# Integración SonarCloud (React + Vite/Vitest + GitHub Actions)

## 1) Desactivar Automatic Analysis
En SonarCloud: Proyecto → Administration → Analysis method → Disable Automatic Analysis.

## 2) Secrets / Variables en GitHub (environment p.e. SONAR_ENV)
- Secrets: `SONAR_TOKEN` (token de análisis).
- Variables (no sensibles): `SONAR_PROJECT_KEY`, `SONAR_ORGANIZATION`.
- Si no usas environment, ponlos a nivel de repositorio y quita `environment:` del job.

## 3) Workflow `.github/workflows/sonar.yaml`
```yaml
name: SonarCloud

on:
  push:
    branches: [main]
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  sonar:
    runs-on: ubuntu-latest
    environment: SONAR_ENV           # o quita si usas repo-level vars/secrets
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Use Node 22
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: yarn

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Run tests with coverage (Vitest)
        run: yarn test

      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
        with:
          args: >
            -Dsonar.projectKey=${{ vars.SONAR_PROJECT_KEY || secrets.SONAR_PROJECT_KEY }}
            -Dsonar.organization=${{ vars.SONAR_ORGANIZATION || secrets.SONAR_ORGANIZATION }}
            -Dsonar.sources=src
            -Dsonar.tests=src
            -Dsonar.test.inclusions=src/**/*.test.ts,src/**/*.test.tsx
            -Dsonar.exclusions=**/coverage/**,**/*.test.*
            -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
            -Dsonar.typescript.tsconfigPath=tsconfig.app.json
            -Dsonar.qualitygate.wait=true

      - name: Sonar report link
        if: always()
        env:
          PROJECT_KEY: ${{ vars.SONAR_PROJECT_KEY }}
        run: |
          if [ -n "$PROJECT_KEY" ]; then
            echo "Sonar report: https://sonarcloud.io/summary/new_code?id=${PROJECT_KEY}&branch=${GITHUB_REF_NAME}" >> $GITHUB_STEP_SUMMARY
          else
            echo "Define SONAR_PROJECT_KEY as an environment variable (not secret) to show the report link here." >> $GITHUB_STEP_SUMMARY
          fi
```

## 4) Quality Gate (p.e. cobertura ≥ 80%)
- Organización → Quality Gates → crear/clone gate → condición `Coverage on New Code >= 80` (o `Overall Coverage >= 80`).
- Asigna el gate al proyecto (Project → Quality gate → seleccionar gate).
- El flag `-Dsonar.qualitygate.wait=true` hará fallar el job si el gate no pasa.

## 5) Flujo esperado
- PR/push: corre tests con cobertura → SonarCloud ingiere `coverage/lcov.info` → calcula métricas → verifica Quality Gate.
- Si cobertura < umbral, el paso SonarCloud falla y el workflow queda Failed.
- El Job Summary muestra el link directo al análisis.

## 6) Troubleshooting rápido
- "Automatic Analysis enabled": desactívalo (paso 1).
- "lcov no encontrado": asegura que `yarn test` genere `coverage/lcov.info` y que la ruta coincida con `sonar.javascript.lcov.reportPaths`.
- Enlace con `***`: usa variables (no secrets) para `projectKey`/`organization` o el paso final genera el link si `PROJECT_KEY` está definido.
