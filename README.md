# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Docker

```bash
docker compose build
```

```bash
docker compose up
```

```bash
docker compose -f compose.dev.yaml build
```

```bash
docker compose -f compose.dev.yaml up
```

## Setup

Make sure to install the dependencies:

```bash
# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# bun
bun run dev -o
```

## Production

Build the application for production:

```bash
# bun
bun run build
```

Locally preview production build:

```bash
# bun
bun run preview
```

Update all dependencies to latest version

```bash
 bun update -f
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
