set -e

cd dist
git init
git add .
git commit -m deploy
git remote add origin git@github.com:hal-wang/cba-todo-web.git
git push origin main -f
cd ..