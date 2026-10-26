import sys
from pathlib import Path
from unittest.mock import Mock, patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from fastapi.testclient import TestClient
import main
from mailer import render_email, send_email
from policies import POLICY_VERSIONS, acceptance_current

client = TestClient(main.app)


def test_health_and_public_configuration():
    assert client.get('/healthz').status_code == 200
    assert client.get('/api/health').status_code == 200
    config = client.get('/api/runtime-config').json()
    assert config['firebase']['projectId'] == 'project-9afac'
    assert config['policy_versions'] == POLICY_VERSIONS
    assert 'SMTP_PASSWORD' not in str(config)


def test_private_endpoints_reject_anonymous():
    for path in ['/api/account', '/api/legal-acceptance']:
        assert client.get(path).status_code == 401


def test_invalid_token_and_unverified_identity():
    with patch.object(main, 'firebase'), patch.object(main.auth, 'verify_id_token', side_effect=ValueError('private diagnostic')):
        response = client.get('/api/account', headers={'Authorization': 'Bearer invalid'})
        assert response.status_code == 401
        assert 'private diagnostic' not in response.text
    with patch.object(main, 'firebase'), patch.object(main.auth, 'verify_id_token', return_value={'uid': 'a', 'email_verified': False}):
        assert client.get('/api/account', headers={'Authorization': 'Bearer unverified'}).status_code == 403


def test_origin_and_body_boundaries():
    assert client.options('/api/account', headers={'Origin': 'https://evil.example', 'Access-Control-Request-Method': 'GET'}).status_code == 403
    response = client.options('/api/account', headers={'Origin': main.SITE_ORIGIN, 'Access-Control-Request-Method': 'GET'})
    assert response.headers['access-control-allow-origin'] == main.SITE_ORIGIN
    assert client.post('/api/auth/action-email', content='{}').status_code == 415
    assert client.post('/api/auth/action-email', json={'padding': 'x' * 9000}).status_code == 413
    assert client.post('/api/auth/action-email', json={'email': 'invalid', 'purpose': 'signup'}).status_code == 400
    assert client.post('/api/auth/action-email', json={'email': 'a@example.com', 'purpose': 'signup', 'continueUrl': 'https://evil.example'}).status_code == 400


def test_policy_versions_and_identity_are_authoritative():
    assert not acceptance_current({'versions': {}})
    assert acceptance_current({'versions': POLICY_VERSIONS})
    main.app.dependency_overrides[main.current_user] = lambda: {'uid': 'verified-owner', 'email': 'owner@example.com'}
    try:
        db = Mock()
        with patch.object(main, 'database', return_value=db):
            assert client.post('/api/legal-acceptance', json={'accepted': True, 'accepted_versions': {}}).status_code == 400
            response = client.post('/api/legal-acceptance', json={'accepted': True, 'accepted_versions': POLICY_VERSIONS})
            assert response.status_code == 200
            db.collection.assert_called_with('stratax_legal_acceptance')
            db.collection.return_value.document.assert_called_with('verified-owner')
            assert client.post('/api/legal-acceptance', json={'accepted': True, 'accepted_versions': POLICY_VERSIONS, 'uid': 'another-user'}).status_code == 400
    finally:
        main.app.dependency_overrides.clear()


def test_profile_is_whitelisted_and_user_scoped():
    main.app.dependency_overrides[main.current_user] = lambda: {'uid': 'owner', 'email': 'a@example.com'}
    try:
        db = Mock()
        db.collection.return_value.document.return_value.get.return_value.to_dict.return_value = {'versions': POLICY_VERSIONS}
        with patch.object(main, 'database', return_value=db):
            assert client.put('/api/account', json={'display_name': '<Ada>', 'organization': 'Lab', 'uid': 'other'}).status_code == 400
            response = client.put('/api/account', json={'display_name': ' Ada ', 'organization': ' Lab '})
            assert response.json() == {'uid': 'owner', 'email': 'a@example.com', 'display_name': 'Ada', 'organization': 'Lab'}
            db.collection.return_value.document.assert_called_with('owner')
    finally:
        main.app.dependency_overrides.clear()


def test_branded_email_escapes_names_and_has_plain_text():
    for purpose in ['signup', 'recovery', 'verification']:
        title, text, markup = render_email(purpose, '<Ada & Co>', 'https://example.com/?code=abc&mode=signIn', 'https://example.com/logo.png')
        assert 'StrataX' in title and 'STRATAX' in text
        assert '<Ada & Co>' not in markup
        assert '&lt;Ada &amp; Co&gt;' in markup
        assert 'https://example.com/?code=abc&mode=signIn' in text
        assert 'G-RES' not in markup or purpose == 'recovery'


def test_links_use_fixed_stratax_origin_without_shared_template_changes():
    generated = 'https://project-9afac.firebaseapp.com/__/auth/action?mode=signIn&oobCode=test-code&apiKey=public-key&continueUrl=https%3A%2F%2Fevil.example'
    with patch.object(main, 'firebase'), patch.object(main.auth, 'generate_sign_in_with_email_link', return_value=generated) as generator:
        link = main.account_link('a@example.com', 'signup')
        assert link.startswith(main.SITE_ORIGIN + '/?')
        assert link.endswith('#email-action')
        assert 'evil.example' not in link
        assert 'oobCode=test-code' in link
        assert generator.call_args.args[1].url == main.SITE_ORIGIN + '/#email-action'


def test_email_failures_and_generic_response():
    with patch.object(main, 'rate_limit'), patch.object(main, 'account_link', return_value='https://example.com/secure'), patch.object(main, 'send_email', side_effect=RuntimeError('private SMTP detail')):
        response = client.post('/api/auth/action-email', json={'email': 'a@example.com', 'purpose': 'signup'})
        assert response.status_code == 503
        assert 'private SMTP detail' not in response.text
    with patch.object(main, 'rate_limit'), patch.object(main, 'account_link', return_value='https://example.com/secure'), patch.object(main, 'send_email'):
        assert client.post('/api/auth/action-email', json={'email': 'a@example.com', 'purpose': 'signup'}).json()['accepted'] is True


def test_rate_limit_failure_is_retryable():
    from fastapi import HTTPException
    with patch.object(main, 'rate_limit', side_effect=HTTPException(429, {'code': 'too_many_requests', 'message': 'Wait.'}, headers={'Retry-After': '900'})):
        response = client.post('/api/auth/action-email', json={'email': 'a@example.com', 'purpose': 'recovery'})
        assert response.status_code == 429
        assert response.headers['retry-after'] == '900'
