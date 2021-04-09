# if you just want to deploy the web, maybe the code while help you
# add '"deploy": "bash deploy.sh"' in 'scripts' 

set -e

bash build.sh $1

cd ..

tcb login

tcb fn deploy $1 --force
