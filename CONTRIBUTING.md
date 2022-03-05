# Let's Get Started

Contact @oliverbutler to get access to the PlanetScale DB and Vercel teams.

## Env Setup

- `NEXTAUTH_SECRET` Any string/key
- `GITHUB_ID` Ask @oliverbutler
- `GITHUB_SECRET` Ask @oliverbutler
- `NX_CLOUD_ACCESS_TOKEN` Ask @oliverbutler
- `NOTION_CLIENT_SECRET` Ask @oliverbutler

## Running Xeo 🔥

Install Dependencies

```bash
yarn
```

Run Xeo

```bash
yarn dev
```

## Updating the Prisma Schema

Please start by reading the Prisma docs, and look at how to connect to a PlanetScale

With PlanetScale you don't want to make migrations, instead, make a branch on PlanetScale and use `yarn prisma db push` to push changes
