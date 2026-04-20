# Verisure CX & Churn Analysis Dashboard

Interactive analytical dashboard built with Next.js, TypeScript, and App Router. It is designed for Vercel deployment and works directly from a local row-level dataset in `src/data/customers.ts`.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Replace the dataset

Update `src/data/customers.ts` with an array of objects matching this shape:

```ts
export type Customer = {
  id: number | string;
  recommendationNote: number;
  alarmTriggers: number;
  maintenances: number;
  customerType: "Residential" | "Business";
  onceAndDone: "YES" | "NO";
  cancelled: "YES" | "NO";
};
```

The current project already contains your Verisure CSV normalized into that format.

## Deploy to Vercel

```bash
npm run build
```

Then import the repository into Vercel or run a standard Vercel deployment. No database, auth, or server-side data source is required.
