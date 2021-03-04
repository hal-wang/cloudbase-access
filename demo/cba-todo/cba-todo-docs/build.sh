set -e

if [ -d "../cba-todo-web/public/docs" ]; then
  rm -rf ../cba-todo-web/public/docs
fi

mv docs/.vuepress/dist ../cba-todo-web/public/docs