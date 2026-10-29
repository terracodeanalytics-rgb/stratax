"""Append the new StrataX domain to Firebase authorised domains, preserving all others."""
import argparse
import json
import shutil
import subprocess
from urllib.request import Request,urlopen
from urllib.parse import urlparse


def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--origin',required=True)
    args=parser.parse_args();parsed=urlparse(args.origin)
    if parsed.scheme!='https' or not parsed.hostname.endswith('.chatgpt.site'):raise ValueError('Use the exact HTTPS Site origin.')
    gcloud=shutil.which('gcloud.cmd') or shutil.which('gcloud')
    token=subprocess.run([gcloud,'auth','print-access-token'],capture_output=True,text=True,check=True).stdout.strip()
    url='https://identitytoolkit.googleapis.com/admin/v2/projects/project-9afac/config'
    headers={'Authorization':'Bearer '+token,'Content-Type':'application/json','X-Goog-User-Project':'project-9afac'}
    with urlopen(Request(url,headers=headers),timeout=30) as response:current=json.load(response)
    domains=list(current.get('authorizedDomains',[]))
    if parsed.hostname not in domains:
        domains.append(parsed.hostname)
        request=Request(url+'?updateMask=authorizedDomains',data=json.dumps({'authorizedDomains':domains}).encode(),headers=headers,method='PATCH')
        with urlopen(request,timeout=30) as response:json.load(response)
    print('Preserved existing Firebase domains; new StrataX Site domain authorised.')


if __name__=='__main__':main()
