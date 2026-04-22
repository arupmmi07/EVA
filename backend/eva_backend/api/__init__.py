from __future__ import annotations

from flask import Flask

from eva_backend.api.eva_chat import bp as eva_chat_bp
from eva_backend.api.eva_message import bp as eva_message_bp
from eva_backend.api.health import bp as health_bp


def register_blueprints(app: Flask) -> None:
    app.register_blueprint(health_bp, url_prefix="/api")
    app.register_blueprint(eva_chat_bp, url_prefix="/api")
    app.register_blueprint(eva_message_bp, url_prefix="/api")


__all__ = ["register_blueprints", "health_bp", "eva_chat_bp", "eva_message_bp"]
