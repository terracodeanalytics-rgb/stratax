"""Local GCS/dispatch boundaries for exercising actual native import/copy routes."""
import base64
import copy
import os
from pathlib import Path
import struct
from datetime import datetime,timezone
from unittest.mock import patch

import google_crc32c
from fastapi import Request
from fastapi.responses import JSONResponse,Response
from test_scientific_api import Reference


def install(app,db,artifacts):
    import main
    import traceback
    original_log=main.logger.error
    def log_error(*args,**kwargs):
        original_log(*args,**kwargs);traceback.print_exc()
    main.logger.error=log_error
    raw=artifacts/'raw';raw.mkdir(exist_ok=True)
    os.environ.update(STRATAX_PROJECT_BUCKET='fixture-raw',RAW_MOUNT=str(raw),STRATAX_IMPORT_JOB='local-import-fixture',STRATAX_SITE_ORIGIN='http://fixture.invalid')
    from google.cloud import firestore
    def deleted(value):return isinstance(value,type(firestore.DELETE_FIELD)) and repr(value)==repr(firestore.DELETE_FIELD)
    def resolved(value):
        if isinstance(value,type(firestore.SERVER_TIMESTAMP)):return datetime.now(timezone.utc)
        if isinstance(value,dict):return {key:resolved(item) for key,item in value.items() if not deleted(item)}
        if isinstance(value,list):return [resolved(item) for item in value]
        return value
    original_set=db.set
    db.set=lambda ref,value:original_set(ref,resolved(value))
    def update(ref,fields):
        record=db.records[ref.path]
        for key,value in fields.items():
            target=record;parts=key.split('.')
            for part in parts[:-1]:target=target.setdefault(part,{})
            if deleted(value):target.pop(parts[-1],None)
            else:target[parts[-1]]=copy.deepcopy(resolved(value))
    Reference.update=update

    class Blob:
        def __init__(self,name,bucket):self.name,self.bucket=name,bucket;self.path=bucket.root/name
        @property
        def size(self):return self.path.stat().st_size
        @property
        def generation(self):return '1'
        @property
        def crc32c(self):return base64.b64encode(struct.pack('>I',google_crc32c.value(self.path.read_bytes()))).decode()
        def upload_from_file(self,source,**kwargs):
            self.path.parent.mkdir(parents=True,exist_ok=True)
            with self.path.open('xb') as target:
                import shutil
                shutil.copyfileobj(source,target,1024**2)
        def reload(self):pass
        def download_as_bytes(self,**kwargs):return self.path.read_bytes()
        def open(self,mode='rb',**kwargs):return self.path.open(mode)
        def create_resumable_upload_session(self,**kwargs):return app.state.fixture_origin+'/__fixture/upload/'+self.name
    class Bucket:
        def __init__(self,name):
            assert name in ('fixture-raw','fixture-derived');self.name=name;self.root=raw if name=='fixture-raw' else artifacts
        def blob(self,name):return Blob(name,self)
        def get_blob(self,name):
            blob=self.blob(name);return blob if blob.path.exists() else None
    class Store:
        def bucket(self,name):return Bucket(name)
        def list_blobs(self,name,prefix=''):
            bucket=Bucket(name);folder=bucket.root/prefix
            return [bucket.blob(str(file.relative_to(bucket.root)).replace('\\','/')) for file in folder.rglob('*') if file.is_file()] if folder.exists() else []
    from google.cloud import storage
    storage.Client=lambda *args,**kwargs:Store()

    @app.put('/__fixture/upload/{name:path}')
    async def upload(name:str,request:Request):
        target=(raw/name).resolve();assert target.is_relative_to(raw.resolve())
        content=await request.body();target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(content)
        return JSONResponse(dict(size=len(content)),headers={'Access-Control-Allow-Origin':'*'})
    @app.options('/__fixture/upload/{name:path}')
    def preflight(name:str):return Response(status_code=204,headers={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'PUT,OPTIONS','Access-Control-Allow-Headers':'Content-Type,Content-Range'})
    @app.middleware('http')
    async def storage_boundary(request,call_next):
        # Signed GCS transfers are a separate binary boundary from the JSON API.
        prefix='/__fixture/upload/'
        if request.url.path.startswith(prefix):
            name=request.url.path[len(prefix):]
            if request.method=='PUT':return await upload(name,request)
            if request.method=='OPTIONS':return preflight(name)
        return await call_next(request)

    def run(environment):
        import ingestion_worker
        # Linux worker private file links are represented by read-only hardlinks on Windows.
        with patch.dict(os.environ,environment),patch.object(Path,'symlink_to',lambda link,target,*args,**kwargs:link.hardlink_to(target)):
            ingestion_worker.run()
    return run
