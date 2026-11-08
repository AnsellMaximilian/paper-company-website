# Michael Scott Paper Company

A standalone storefront used to test the customer journey before any Our Impact
integration. This baseline intentionally contains no Our Impact SDK, widget, keys, or
branding.

## Features

- Registration, login, logout, and database-backed sessions
- Seeded paper catalog and product pages
- Persistent customer cart
- Simulated checkout and order history
- Responsive yellow, black, and white storefront design

## Local setup

Requirements: Node.js 24+, pnpm, and PostgreSQL 16.

```bash
pnpm install
pnpm db:setup
pnpm dev
```

The app reads `DATABASE_URL` from `.env.local`. Copy `.env.example` when setting up on a
different machine.

Checkout is intentionally simulated and never collects or processes payment details.
