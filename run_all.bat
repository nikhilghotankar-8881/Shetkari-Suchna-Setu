@echo off
echo ========================================================
echo Starting Shetkari Suchna-Setu (Backend + Frontend)
echo ========================================================

echo Starting Backend API on http://localhost:8000 ...
start "Shetkari Suchna-Setu Backend" cmd /k "cd backend && call venv\Scripts\activate.bat && python start.py"

echo Starting Frontend on http://localhost:3000 ...
start "Shetkari Suchna-Setu Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both services are launching in separate windows!
echo - Frontend UI: http://localhost:3000
echo - Backend API: http://localhost:8000/docs
echo ========================================================
pause
