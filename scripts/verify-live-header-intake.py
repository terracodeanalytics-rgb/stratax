"""Two isolated live accounts exercise the native header-led import contract."""
import json
from pathlib import Path
import runpy
import secrets
import subprocess
import time
from urllib.parse import parse_qs, quote, urlparse
import requests

helpers = runpy.run_path(str(Path(__file__).with_name('verify-project-api.py')))
request, API, PROJECT, SITE = [helpers[name] for name in ('request', 'API', 'PROJECT', 'SITE')]


def main():
    admin = subprocess.check_output(['gcloud.cmd', 'auth', 'print-access-token'], text=True).strip()
    _, config = request(API + '/api/runtime-config')
    identity = 'https://identitytoolkit.googleapis.com/v1/'
    users, checks = [], []
    pid = 'qa-header-' + secrets.token_hex(8)

    def check(name, condition):
        if not condition:
            raise RuntimeError('Live header acceptance failed at ' + name)
        checks.append(name)
        print('PASS ' + name, flush=True)

    try:
        for index in range(2):
            email = 'stratax-header-' + secrets.token_hex(8) + '@example.com'
            status, link = request(identity + 'projects/' + PROJECT + '/accounts:sendOobCode', 'POST',
                {'requestType': 'EMAIL_SIGNIN', 'email': email, 'returnOobLink': True,
                 'continueUrl': SITE + '/#email-action', 'canHandleCodeInApp': True}, admin,
                headers={'x-goog-user-project': PROJECT})
            check('Verification link generated without mail', status == 200)
            code = parse_qs(urlparse(link['oobLink']).query)['oobCode'][0]
            status, user = request(identity + 'accounts:signInWithEmailLink?key=' + config['firebase']['apiKey'],
                                    'POST', {'email': email, 'oobCode': code})
            check('Fixture identity verified', status == 200)
            users.append(user)
            token = user['idToken']
            check('Policy acceptance', request(API + '/api/legal-acceptance', 'POST',
                {'accepted': True, 'accepted_versions': config['policy_versions']}, token)[0] == 200)
            base = API + '/api/projects/' + pid
            check('Isolated Cloud project', request(base, 'PUT', {'revision': 0,
                'project': {'name': 'Header acceptance', 'workflows': ['petrophysics'], 'storage': 'cloud', 'status': 'Active'},
                'workspace': {'files': [], 'audit': []}}, token)[0] == 200)
            if index:
                check('Account isolation', request(base + '/imports', token=users[0]['idToken'])[0] == 200)
                _, own = request(base, token=token)
                _, other = request(base, token=users[0]['idToken'])
                check('Separate workspaces at same project ID', own['workspace']['files'] == [] and bool(other['workspace']['files']))
            sources = [
                ('header', 'well-header.csv', 'well_headers',
                 b'WELL,UWI,LATITUDE,LONGITUDE\nEXAMPLE_1,EXAMPLE-001,4.6,6.8\n'),
                ('log', 'logs.las', 'logs',
                 b'~Version\nVERS. 2.0\nWRAP. NO\n~Well\nWELL. EXAMPLE_1\nNULL. -999.25\n~Curve\nDEPT.M\nGR.GAPI\n~ASCII\n0 35\n100 -999.25\n'),
                ('survey', 'survey.csv', 'deviation', b'MD,INCLINATION,AZIMUTH\n0,0,0\n100,2,45\n'),
            ]
            settings = {
                'header': {'mapping': {'well': 0, 'uwi': 1, 'latitude': 2, 'longitude': 3},
                           'references': {'crs': 'EPSG:4326'}, 'headerActions': {'0': {'well': 'well-a'}}},
                'log': {'well': 'well-a', 'deriveWellHeader': False, 'mapping': {'index': 0},
                        'references': {'depthUnit': 'm', 'depthReference': 'MD'}},
                'survey': {'well': 'well-a', 'mapping': {'md': 0, 'inclination': 1, 'azimuth': 2},
                           'references': {'depthUnit': 'm', 'depthReference': 'MD',
                                          'angleUnit': 'degrees', 'northReference': 'True north'}}
            }
            status, record = request(base + '/imports', 'POST', {'family': 'mixed',
                'files': [{'name': name, 'size': len(content), 'client_id': key, 'family': family}
                          for key, name, family, content in sources],
                'options': {'schemaVersion': 2, 'perAsset': settings, 'reviewed': True}}, token)
            check('Native batch reserved', status == 201)
            url = base + '/imports/' + record['id']
            for key, name, family, content in sources:
                asset = next(a for a in record['assets'] if a.get('clientId') == key)
                status, transfer = request(url + '/upload/' + asset['id'], 'POST', {}, token)
                check('Private upload session', status == 200)
                uploaded = requests.put(transfer['upload_url'], data=content,
                    headers={'Content-Type': 'application/octet-stream',
                             'Content-Range': f'bytes 0-{len(content)-1}/{len(content)}'}, timeout=30)
                check('Original retained', uploaded.status_code in (200, 201))
                check('Original completed', request(url + '/complete/' + asset['id'], 'POST', {}, token)[0] == 200)
            check('Worker dispatched', request(url + '/inspect', 'POST', {}, token)[0] == 202)
            for attempt in range(120):
                time.sleep(3)
                _, record = request(url, token=token)
                if record.get('status') != 'inspecting':
                    break
            check('Native datasets inspected', record.get('status') in ('awaiting confirmation', 'retained/unresolved')
                  and len(record.get('datasets', [])) == 3)
            log = next(d for d in record['datasets'] if d['family'] == 'logs')
            status, denied = request(url + '/commit', 'POST', {'revision': record['revision'],
                'acknowledge_warnings': True, 'selected_dataset_ids': [log['id']]}, token)
            check('Header prerequisite enforced by live API', status == 400 and denied.get('code') == 'well_header_required')
            status, committed = request(url + '/commit', 'POST',
                {'revision': record['revision'], 'acknowledge_warnings': True}, token)
            check('Header logs and optional deviation activated', status == 200)
            status, preview = request(url + '/preview/' + log['id'], token=token)
            check('Native normalized schema', status == 200 and preview.get('normalization', {}).get('format') == 'stratax-dataset/1')
            check('Native units and null sample', preview['columns'][1]['effectiveUnit'] == 'gAPI' and preview['preview'][1][1] is None)
            _, saved = request(base, token=token)
            check('Reloaded owning well and survey', saved['workspace']['wellDrafts'][0]['id'] == 'well-a'
                  and bool(saved['workspace']['wellDrafts'][0].get('activeSurveyId')))
        report = {'api': API, 'passed': len(checks), 'accounts': len(users), 'checks': checks}
        Path('.release/live-header-intake-20261117.json').write_text(json.dumps(report, indent=2))
        print(json.dumps(report))
    finally:
        root = f'https://firestore.googleapis.com/v1/projects/{PROJECT}/databases/(default)/documents/'
        for user in users:
            uid = user['localId']
            path = f'stratax_projects/{uid}/records/{pid}'
            for collection in ('imports', 'datasets', 'import_templates'):
                _, listing = request(root + path + '/' + collection, token=admin)
                for doc in listing.get('documents', []):
                    request('https://firestore.googleapis.com/v1/' + doc['name'], 'DELETE', token=admin)
            for item in (path, f'stratax_legal_acceptance/{uid}', f'stratax_accounts/{uid}'):
                request(root + item, 'DELETE', token=admin)
            prefix = f'owners/{uid}/projects/{pid}/'
            for bucket in ('project-9afac-stratax-raw', 'project-9afac-stratax-derived'):
                _, objects = request('https://storage.googleapis.com/storage/v1/b/' + bucket +
                                     '/o?versions=true&prefix=' + quote(prefix, safe=''), token=admin)
                for obj in objects.get('items', []):
                    if obj['name'].startswith(prefix):
                        request('https://storage.googleapis.com/storage/v1/b/' + bucket + '/o/' +
                                quote(obj['name'], safe='') + '?generation=' + obj['generation'], 'DELETE', token=admin)
            request(identity + 'projects/' + PROJECT + '/accounts:delete', 'POST', {'localId': uid}, admin,
                    headers={'x-goog-user-project': PROJECT})
        print(json.dumps({'isolatedAccountsCleaned': len(users)}))


if __name__ == '__main__':
    main()
