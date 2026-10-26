POLICY_VERSIONS = {
    "terms_of_use": "1.0",
    "privacy_policy": "1.0",
    "acceptable_use_policy": "1.0",
    "ai_processing_disclosure": "1.0",
    "data_confidentiality": "1.0",
    "disclaimer": "1.0",
    "cookie_policy": "1.0",
}


def acceptance_current(record):
    return bool(record and record.get("versions") == POLICY_VERSIONS)
