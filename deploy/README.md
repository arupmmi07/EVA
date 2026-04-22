# Deployment scaffolding (POC)

- `Dockerfile` — production-oriented image for the Flask app (gunicorn).
- `docker-compose.yml` — **Redis Stack** (modules for search/JSON; vectors today are stored as hashes in the POC) + **API** (gunicorn :8000).

Assumptions: images are built from the repository root with `-f deploy/Dockerfile`.

```bash
docker compose -f deploy/docker-compose.yml up -d redis   # Redis only for local Flask
docker compose -f deploy/docker-compose.yml up --build    # redis + api
```
