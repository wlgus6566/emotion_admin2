#!/bin/bash

# install yarn
#curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | tee /etc/yum.repos.d/yarn.repo;
#yum -y install yarn;
#npm install yarn -g

# node process kill
ps -ef | grep '/external2/application/prod/emotionHomepage/adminWeb-13001/node_modules/.bin/next start' | awk '{print $2}' | xargs kill -9

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

echo ""
echo ""
echo "NODE Version Check : "
node -v

echo ""
echo ""
echo "NODE Setting : "
nvm use 16.17.1

echo ""
echo ""
echo "NODE Version Check : "
node -v

echo ""
echo ""
echo "YARN Version Check : "
yarn -v

# install
cd /external2/application/prod/emotionHomepage/adminWeb-13001

# debugging..
ls -lah

echo ""
echo ""
echo "YARN install & build & start : "
yarn install
sleep 5s

echo ""
echo ""
echo "YARN build : "
yarn build_prod

echo ""
echo ""
echo "YARN start : "
yarn start_prod > /dev/null 2>&1 &

#nvm use 8.17.0
