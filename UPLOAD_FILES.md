# Upload Files Checklist (GitHub)

## 1) Upload These (Core Project)

- `README.md`
- `UPLOAD_FILES.md`
- `.gitignore`
- `starter.ps1`
- `backend/**` (except ignored files)
- `admin-panel/**` (except ignored files)
- `frontend/slc-website/**` (except ignored files)
- `images/readme images/**`
- `images/Mazar/**`
- `images/SUST/**`
- `uploads/.gitkeep`

## 2) Do NOT Upload

- Any `node_modules/`
- Any `build/` or `dist/`
- Any `.env`
- Temporary notes/dumps not required in product delivery
- Duplicate backup folders (for example: `Shahjalal_Library_Corner - Copy1 - Copy/`)

## 3) Recommended Clean Repo Structure

```text
Shahjalal_Library_Corner/
  backend/
    models/
    routes/
    server.js
    package.json
  admin-panel/
    src/
    public/
    package.json
    tailwind.config.js
    postcss.config.js
  frontend/
    slc-website/
      src/
      public/
      scripts/
      package.json
  images/
    readme images/
    Mazar/
    SUST/
  uploads/
    .gitkeep
  README.md
  UPLOAD_FILES.md
  .gitignore
  starter.ps1
```

## 4) Pre-Push Sanity Checks

```powershell
cd "<project-root>"
git status
npm --prefix backend install
npm --prefix admin-panel install
npm --prefix frontend/slc-website install
npm --prefix admin-panel run build
npm --prefix frontend/slc-website run build
```

## 5) Push With PAT

```powershell
cd "<project-root>"
git init
git add .
git commit -m "feat: SLC full stack rebuild with admin/user screenshots and docs"
git branch -M main
git remote add origin https://<GITHUB_USERNAME>:<PAT_TOKEN>@github.com/<GITHUB_USERNAME>/<REPO_NAME>.git
git push -u origin main
```
