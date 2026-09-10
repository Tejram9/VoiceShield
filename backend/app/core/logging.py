import logging
import sys
from typing import Any, Dict, Optional


class PrivacyLogFilter(logging.Filter):
    """
    Privacy filter ensuring raw audio payloads, sensitive credentials,
    or raw secret keys are scrubbed before reaching log output handlers.
    """
    SENSITIVE_KEYS = {"raw_audio", "audio_data", "api_key", "secret_key", "password", "token"}

    def filter(self, record: logging.LogRecord) -> bool:
        if isinstance(record.msg, dict):
            record.msg = self.sanitize_dict(record.msg)
        elif hasattr(record, "args") and isinstance(record.args, dict):
            record.args = self.sanitize_dict(record.args)
        return True

    def sanitize_dict(self, d: Dict[str, Any]) -> Dict[str, Any]:
        sanitized = {}
        for k, v in d.items():
            if k.lower() in self.SENSITIVE_KEYS:
                sanitized[k] = "<REDACTED_PRIVACY_PROTECTED>"
            elif isinstance(v, dict):
                sanitized[k] = self.sanitize_dict(v)
            else:
                sanitized[k] = v
        return sanitized


def setup_logger(name: str = "voiceshield") -> logging.Logger:
    logger = logging.getLogger(name)
    if not logger.handlers:
        logger.setLevel(logging.INFO)
        handler = logging.StreamHandler(sys.stdout)
        formatter = logging.Formatter(
            "[%(asctime)s] [%(levelname)s] [%(name)s] [session_id=%(session_id)s] %(message)s",
            defaults={"session_id": "global"}
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        logger.addFilter(PrivacyLogFilter())
    return logger


logger = setup_logger()
