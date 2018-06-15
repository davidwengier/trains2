@echo off
git fetch --all
git merge master
call tsc -p tsconfig.json
git add .
git commit -am "Build"
git push