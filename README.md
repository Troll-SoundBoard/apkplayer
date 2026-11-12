# APK Player (Render)

Upload an .apk in the browser and run it in a streamed Android device (via Appetize.io).

## Deploy on Render
1. Push this folder to a GitHub repo.
2. Render → New → Blueprint (uses render.yaml), or New → Web Service (Build: `npm install`, Start: `npm start`).
3. Add env var `APPETIZE_API_TOKEN` (from appetize.io → Account → API token).

## Local
APPETIZE_API_TOKEN=xxx npm install && npm start
