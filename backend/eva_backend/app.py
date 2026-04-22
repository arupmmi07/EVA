from __future__ import annotations

import logging
from pathlib import Path

from dotenv import load_dotenv
from flask import Flask, jsonify

from eva_backend.api import register_blueprints
from eva_backend.config import get_settings
from eva_backend.errors import AppError
from eva_backend.logging_config import configure_logging
from eva_backend.skills.skill_index import ensure_skills_indexed

logger = logging.getLogger(__name__)


def create_app() -> Flask:
    # Load .env from repo root (parent of backend/) when present
    load_dotenv(Path(__file__).resolve().parents[2] / ".env")
    configure_logging()
    settings = get_settings()

    app = Flask(__name__)
    app.config["SECRET_KEY"] = settings.secret_key
    app.config["ENV"] = settings.flask_env

    register_blueprints(app)

    try:
        ensure_skills_indexed()
    except Exception as exc:  # pragma: no cover
        logger.warning("skill index bootstrap skipped: %s", exc)

    @app.errorhandler(AppError)
    def handle_app_error(err: AppError):  # type: ignore[no-untyped-def]
        return jsonify(err.to_dict()), err.status_code

    @app.get("/")
    def root():  # type: ignore[no-untyped-def]
        return jsonify({"service": "eva-backend", "docs": "/api/health"}), 200

    logger.info("EVA Flask app created (env=%s)", settings.flask_env)
    return app
