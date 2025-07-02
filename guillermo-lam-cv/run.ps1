# Bun + Vite + Solid workflow for Windows PowerShell

Write-Host "`n== Bun + Vite + Solid Project Runner =="
Write-Host "-----------------------------------------`n"

# 1. Install dependencies (once, or after updating package.json)
Write-Host "🔄 Installing dependencies with Bun..."
bun install

# 2. Start the dev server (hot reload, http://localhost:5173)
Write-Host "`n🚀 Starting Vite dev server at http://localhost:5173 ..."
bun run dev

# 3. (Optional) Build the production site (outputs to dist/)
Write-Host "`n🏗️ Building for production (to /dist)..."
bun run build

# 4. (Optional) Preview the built site locally (serves /dist on http://localhost:5173)
Write-Host "`n👀 Previewing production build (http://localhost:5173)..."
bun run preview
