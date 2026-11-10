@echo off
echo ========================================================
echo       Starting Local MongoDB Server on Port 27017
echo ========================================================
if not exist "backend\data\db" mkdir "backend\data\db"
"C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath backend\data\db --port 27017
pause
