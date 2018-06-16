@echo off
git fetch --all
git merge origin/master
call tsc -p tsconfig.json
git add .
git commit -am "Build"
git push