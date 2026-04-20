# Verisure CX & Churn Dashboard

Dashboard simple en Next.js para visualizar un caso de customer experience y churn de Verisure usando datos agregados locales.

## Stack

- Next.js con App Router
- TypeScript
- Sin backend
- Sin base de datos
- Sin librerías de gráficos

## Ejecutar en local

```bash
npm install
npm run dev
```

La app quedará disponible en `http://localhost:3000`.

## Estructura principal

- `src/app/page.tsx`: página principal del dashboard
- `src/data/verisureCase.ts`: dataset local
- `src/components/*`: componentes reutilizables de UI
- `src/lib/format.ts`: utilidades de formato

## Despliegue en Vercel

1. Sube este proyecto a GitHub, GitLab o Bitbucket.
2. Importa el repositorio en [Vercel](https://vercel.com/).
3. Vercel detectará automáticamente Next.js.
4. Haz clic en Deploy.

No se requiere configuración adicional ni variables de entorno.
