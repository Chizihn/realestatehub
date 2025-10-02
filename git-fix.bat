@echo off
echo Fixing Git repository...

echo Adding all files to Git...
git add .

echo Checking Git status...
git status

echo.
echo Files added! Now you can commit and push:
echo git commit -m "Add complete RealEstateHub project"
echo git push origin main

pause