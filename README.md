# Terra & Oak — Microservices E-Commerce (DevSecOps Practice Project)

A small polyglot microservices e-commerce app, built for practicing
DevSecOps pipelines, secret management, and multi-service deployment.
No Dockerfiles or docker-compose files are included on purpose — that part
is left for you to build as part of your DevSecOps practice (CI/CD,
image scanning, secret injection, orchestration, etc).

## Architecture

```
                        ┌──────────────────┐
                        │     frontend      │  React + Vite (brown/black theme)
                        │   localhost:3000   │
                        └─────────┬─────────┘
                                  │ JWT bearer token
        ┌─────────────┬──────────┼───────────┬──────────────┐
        │             │          │           │              │
┌───────▼──────┐ ┌────▼───────┐ ┌▼──────────┐ ┌▼─────────────┐
│ auth-service │ │ product-svc│ │order-service│ │ cart-service │
│ Spring Boot  │ │ Spring Boot│ │  Node.js/   │ │  Python /    │
│ Java, MySQL  │ │ Java,MySQL │ │  Express,   │ │  FastAPI,    │
│ :8081        │ │ :8082      │ │  MySQL:5001 │ │  MySQL:8000  │
└──────┬───────┘ └─────┬──────┘ └─────┬───────┘ └──────┬───────┘
       │                │              │                │
   auth_db           product_db     order_db          cart_db
     (MySQL)          (MySQL)        (MySQL)           (MySQL)
```

| Service         | Stack                        | Port | Database    | Responsibility                          |
|------------------|------------------------------|------|-------------|------------------------------------------|
| auth-service     | Spring Boot (Java) + MySQL   | 8081 | `auth_db`    | Registration, login, JWT issuing/validation |
| product-service  | Spring Boot (Java) + MySQL   | 8082 | `product_db` | Product catalog (CRUD, search, category)    |
| order-service    | Node.js + Express + MySQL    | 5001 | `order_db`   | Order creation, order history, status       |
| cart-service     | Python + FastAPI + MySQL     | 8000 | `cart_db`    | Shopping cart per user                      |
| frontend         | React + Vite                 | 3000 | —           | Brown/black themed storefront UI            |

## Authentication flow (JWT)

1. `frontend` calls `auth-service` `/api/auth/register` or `/api/auth/login`.
2. `auth-service` issues a signed JWT (HMAC-SHA256) containing `sub` (username),
   `userId`, and `role` claims. The signing key comes purely from the
   `JWT_SECRET` environment variable — it is never hardcoded anywhere in the
   codebase.
3. The frontend stores the token and attaches it as `Authorization: Bearer <token>`
   on every request to `product-service`, `order-service`, and `cart-service`.
4. Each of those services independently verifies the token's signature using
   the **same** `JWT_SECRET` value (shared secret, symmetric signing) — they
   do not call back into `auth-service` for every request, keeping things
   fast and decoupled. `auth-service` also exposes `/api/auth/validate` if a
   service ever needs to double-check a token centrally.
5. `product-service` restricts product writes (`POST`/`PUT`/`DELETE`) to
   users with the `ADMIN` role; reads are public. `order-service` and
   `cart-service` require any authenticated user, with a couple of
   admin-only endpoints in `order-service`.

**No secrets are hardcoded anywhere.** Every service reads its DB
credentials and `JWT_SECRET` from environment variables. Each service ships
a `.env.example` — copy it to `.env` locally (already excluded via
`.gitignore`) and fill in real values, or inject them via your DevSecOps
pipeline / secret manager / vault instead.

## Prerequisites

- MySQL 8.x server running somewhere you control
- Java 17+ and Maven (for `auth-service`, `product-service`)
- Node.js 18+ (for `order-service`, `frontend`)
- Python 3.11+ (for `cart-service`)

## One-time database setup

```bash
mysql -u root -p < db/init.sql
```

This creates `auth_db`, `product_db`, `order_db`, `cart_db` and a scoped
`ecommerce_app` MySQL user. Edit the placeholder password in `db/init.sql`
before running it — do not commit real credentials.

## Generating a JWT secret

```bash
openssl rand -base64 64
```

Put the same value in the `JWT_SECRET` env var for **all four** backend
services.

## Running each service locally (no Docker)

Open a separate terminal per service.

### auth-service
```bash
cd auth-service
cp .env.example .env   # fill in real values
export $(grep -v '^#' .env | xargs)   # or use your preferred env loader / IDE run config
./mvnw spring-boot:run
```

### product-service
```bash
cd product-service
cp .env.example .env
export $(grep -v '^#' .env | xargs)
./mvnw spring-boot:run
```

### order-service
```bash
cd order-service
cp .env.example .env
npm install
npm run dev
```

### cart-service
```bash
cd cart-service
cp .env.example .env
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Then open http://localhost:3000.

## Suggested DevSecOps practice steps from here

- Add Dockerfiles per service with multi-stage builds and non-root users.
- Add a docker-compose (or Kubernetes manifests) for local orchestration.
- Wire secrets through a vault/secret manager instead of `.env` files.
- Add SAST (e.g. Semgrep, SpotBugs) and dependency scanning (e.g. Trivy,
  OWASP Dependency-Check, `npm audit`, `pip-audit`) into CI.
- Add image scanning and SBOM generation once Dockerfiles exist.
- Add centralized logging/monitoring and mTLS between services.

## Project layout

```
ecommerce-microservices/
├── auth-service/       # Spring Boot, Java, MySQL
├── product-service/    # Spring Boot, Java, MySQL
├── order-service/       # Node.js + Express, MySQL
├── cart-service/        # Python + FastAPI, MySQL
├── frontend/             # React + Vite
├── db/init.sql           # one-time DB + user bootstrap script
├── .gitignore
└── .dockerignore
```
