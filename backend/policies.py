POLICY_VERSIONS = {
    "terms_of_use": "1.1",
    "privacy_policy": "1.1",
    "acceptable_use_policy": "1.1",
    "ai_processing_disclosure": "1.1",
    "data_confidentiality": "1.1",
    "disclaimer": "1.1",
    "cookie_policy": "1.1",
}

def acceptance_current(record):
    return bool(record and record.get("versions") == POLICY_VERSIONS)
