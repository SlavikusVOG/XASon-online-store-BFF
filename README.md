# XASon-online-store-BFF

Backend-for-Frontend (BFF) for the [Xason Online Store](https://github.com/SlavikusVOG/XASon-online-store) Angular application.

Proxies authentication and customer operations to [commercetools](https://docs.commercetools.com/) using the official TypeScript SDK.

Built with [NestJS](https://nestjs.com/) 11.

## Prerequisites

Node.js 24.15.0,
npm,
commercetools project + API clients

## Environment setup

1. `.env — B2C` — server-side operations (B2CConfigService):
```txt
PORT=
CTP_PROJECT_KEY=
CTP_CLIENT_ID=
CTP_CLIENT_SECRET=
CTP_AUTH_URL=https://auth.europe-west1.gcp.commercetools.com
CTP_API_URL=https://api.europe-west1.gcp.commercetools.com
CTP_SCOPES=
```

2. `.env.spa` — SPA customer client (CommercetoolsConfigService, auth + /me/\*, /products):
```txt
SPA_CTP_PROJECT_KEY=
SPA_CTP_CLIENT_ID=
SPA_CTP_CLIENT_SECRET=
SPA_CTP_AUTH_URL=https://auth.europe-west1.gcp.commercetools.com
SPA_CTP_API_URL=https://api.europe-west1.gcp.commercetools.com
SPA_CTP_SCOPES=
```

3. `.env.api-clients` — API client management (ApiClientsCommercetoolsConfigService):
```txt
API_CLIENTS_CTP_PROJECT_KEY=
API_CLIENTS_CTP_CLIENT_ID=
API_CLIENTS_CTP_CLIENT_SECRET=
API_CLIENTS_CTP_AUTH_URL=https://auth.europe-west1.gcp.commercetools.com
API_CLIENTS_CTP_API_URL=https://api.europe-west1.gcp.commercetools.com
API_CLIENTS_CTP_SCOPES=
```

## Getting started

```bash
npm install
npm run start:dev
```

## Team members

- ### SlavikusVOG - https://github.com/slavikusvog
- ### annevci - https://github.com/annevci
- ### xevoider - https://github.com/xevoider

## Deploy

[Vercel](https://xa-son-online-store-bff.vercel.app/api)
