# Environment Setup Guide

## Quick Start

For local development, the `.env.local` file has already been created with the correct settings.

## Available Environments

### 1. **Local Development** (Default)
- API Base URL: `http://localhost:8000/api/v1`
- Frontend URL: `http://localhost:3000`
- Redirect URL: `http://localhost:3000/verify`

**Setup:**
```bash
# The .env.local file is already configured
bun dev:local
```

### 2. **Development Environment**
- API Base URL: `http://dev-api.beatus.co.in/api/v1`
- Frontend URL: `http://dev.beatus.co.in`
- Redirect URL: `http://dev.beatus.co.in/verify`

**Setup:**
```bash
bun dev:dev
```

### 3. **Production Environment**
- API Base URL: `http://api.beatus.co.in/api/v1`
- Frontend URL: `http://app.beatus.co.in`
- Redirect URL: `http://app.beatus.co.in/verify`

**Setup:**
```bash
bun dev:prod
```

## Environment Variables

### `NEXT_PUBLIC_APP_ENV`

This variable determines which API endpoints to use:

- `local` → localhost:8000
- `development` → dev-api.beatus.co.in
- `production` → api.beatus.co.in

## NPM Scripts

```json
{
  "dev:local": "Uses localhost:8000 for API",
  "dev:dev": "Uses dev-api.beatus.co.in for API",
  "dev:prod": "Uses api.beatus.co.in for API"
}
```

## Troubleshooting

### API not pointing to localhost:8000?

1. Check `.env.local` file exists with `NEXT_PUBLIC_APP_ENV=local`
2. Restart your dev server: `bun dev:local`
3. Clear Next.js cache: `rm -rf .next`
4. Check browser console for the actual API URL being used

### Environment variable not updating?

Next.js caches environment variables. After changing `.env.local`:
1. Stop the dev server (Ctrl+C)
2. Clear cache: `rm -rf .next`
3. Restart: `bun dev:local`

## Docker Builds

For Docker builds, set `NEXT_PUBLIC_APP_ENV` as a build argument:

```dockerfile
ARG NEXT_PUBLIC_APP_ENV=production
ENV NEXT_PUBLIC_APP_ENV=${NEXT_PUBLIC_APP_ENV}
```

## Important Notes

⚠️ **Client-Side Access**: Environment variables must have `NEXT_PUBLIC_` prefix to be accessible in client-side code (React components).

⚠️ **Security**: Never commit `.env.local` or `.env.production.local` to git. These files are already in `.gitignore`.

✅ **Best Practice**: Use `.env.local` for local development overrides.
