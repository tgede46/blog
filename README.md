# Blog

Application de blog avec un frontend Next.js (`frontend/my-app`) et une API FastAPI (`backend`), déployables respectivement sur Vercel et Render, avec PostgreSQL sur Neon.

## Développement local

Prérequis : Node.js 20+, Python 3.12 et PostgreSQL 15+.

```bash
# API et PostgreSQL
cd backend
cp .env.example .env
docker compose up --build

# Frontend (autre terminal)
cd frontend/my-app
npm ci
cp .env.example .env.local
npm run dev
```

Sans Docker, créer un environnement virtuel dans `backend`, installer `requirements.txt`, définir une `DATABASE_URL` PostgreSQL en `postgresql+asyncpg://...`, puis lancer :

```bash
alembic upgrade head
uvicorn app.main:app --reload
```

API : `http://localhost:8000` ; frontend : `http://localhost:3000` ; santé : `GET /health/live` et `GET /health/ready`.

## Variables d'environnement

- API : `DATABASE_URL`, `SECRET_KEY` (aléatoire, au moins 32 caractères en production), `ENVIRONMENT`, `FRONTEND_URL` et `ALLOWED_ORIGINS`.
- Auth : `ACCESS_TOKEN_EXPIRE_MINUTES`, les délais `MFA_CHALLENGE_EXPIRE_MINUTES`, `EMAIL_OTP_EXPIRE_MINUTES`, `EMAIL_OTP_RESEND_SECONDS` et, si nécessaire, `COOKIE_DOMAIN`/`COOKIE_SAMESITE`.
- Frontend : `API_URL`, URL HTTPS de l'API sans slash final, utilisée par le rendu serveur et le proxy même origine, et `NEXT_PUBLIC_SITE_URL`, URL canonique HTTPS du site. `NEXT_PUBLIC_API_URL` reste un fallback de compatibilité locale.
- Médias : `UPLOAD_DIR`; les clés `S3_BUCKET`, `S3_REGION`, `S3_ENDPOINT_URL`, `S3_PUBLIC_BASE_URL` et `AWS_*` sont prévues pour un stockage objet.
- E-mail : `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM_EMAIL`, `SMTP_TO_EMAIL`, `SMTP_USE_TLS`.

Ne jamais committer les fichiers `.env`; utiliser les secrets Vercel/Render. En production, `ALLOWED_ORIGINS` doit contenir l'origine Vercel exacte (liste séparée par des virgules).

## Base, migrations et données initiales

Depuis `backend` :

```bash
alembic upgrade head
python scripts/create_admin.py --email admin@gmail.com --password 'mot-de-passe-fort' --name Admin
python scripts/seed_demo_data.py  # optionnel; utilise actuellement cet e-mail admin
```

Avant une migration, créer une sauvegarde ou une branche Neon. Pour annuler la dernière révision :

```bash
alembic current
alembic downgrade -1
```

Tester le downgrade sur une branche Neon avant la production. Si la migration est destructive ou déjà utilisée par l'application, restaurer la sauvegarde/branche Neon et redéployer la version précédente plutôt que forcer un downgrade.

## Tests et contrôles

```bash
cd backend
ruff check app
pytest

cd ../frontend/my-app
npm ci
npm run lint
npm test
npx tsc --noEmit
npm run build
```

Les dépendances de test sont regroupées dans `backend/requirements-dev.txt`.

## Déploiement

1. **Neon** — créer le projet et une branche de production, activer les sauvegardes/rétention adaptées, puis fournir à Render la chaîne de connexion en remplaçant le schéma par `postgresql+asyncpg://`. Tester migrations et restaurations sur une branche Neon.
2. **Render** — créer le service depuis `render.yaml`, renseigner `DATABASE_URL`, `FRONTEND_URL` et `ALLOWED_ORIGINS`; `SECRET_KEY` est générée par Render. Le pre-deploy exécute Alembic et `/health/ready` sert de health check.
3. **Vercel** — importer le dépôt, choisir `frontend/my-app` comme Root Directory et définir `API_URL=https://<api-render>` ainsi que `NEXT_PUBLIC_SITE_URL=https://<site-vercel>`. Le rewrite `/backend-api/*` garde les cookies d’authentification sur le domaine du frontend. Après le premier déploiement, reporter l’URL Vercel dans `FRONTEND_URL` et `ALLOWED_ORIGINS` sur Render.

Pour revenir en arrière : redéployer le dernier build sain sur Vercel/Render. Ne restaurer Neon que si le schéma ou les données ont été altérés; une restauration crée de préférence une nouvelle branche, validée avant de repointer `DATABASE_URL`.

### Stockage objet et SMTP

En développement, les uploads sont écrits sur disque. En production Render, un stockage S3-compatible est obligatoire pour conserver les médias après un redémarrage. Renseigner `S3_BUCKET`, `S3_REGION`, `S3_ENDPOINT_URL`, `S3_PUBLIC_BASE_URL`, `AWS_ACCESS_KEY_ID` et `AWS_SECRET_ACCESS_KEY`. Le dossier `/tmp/uploads` est uniquement un fallback éphémère.

Configurer `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM_EMAIL`, `SMTP_TO_EMAIL` et `SMTP_USE_TLS` chez Render. Tester le formulaire de contact, l'OTP MFA par e-mail et la notification envoyée aux abonnés lors de la première publication d'un article.

### Checklist avant ouverture au public

- La branche déployée est à jour sur GitHub et la CI est verte.
- Render répond sur `/health/live` et `/health/ready`.
- Vercel contient `API_URL` et `NEXT_PUBLIC_SITE_URL`.
- Render contient les URLs exactes du frontend dans `FRONTEND_URL` et `ALLOWED_ORIGINS`.
- Un compte administrateur peut se connecter, terminer le MFA et ouvrir toutes les pages admin.
- Une image importée reste disponible après un redémarrage Render.
- Les trois e-mails critiques sont reçus : contact, OTP MFA et notification de publication.
- Le sitemap, le flux RSS et les métadonnées utilisent bien l'URL HTTPS publique.
