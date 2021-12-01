sudo apt update && sudo apt upgrade -y

#update npm 
npm install -g npm@latest

npm init -y

npm install express nodemon

npm install mongoose

npm install babel-cli babel-preset-env babel-preset-stage-0 --save--dev

npm install body-parser express-session passport passport-local-mongoose connect-ensure-login


# change "test" in package.json to this:  "start": "nodemon ./index.js ==exec babel-node -e js"


touch .babelrc


touch index.js


#NEED TO INSTALL MONGODB

echo "installing mongoDB"

# following commands are for Linux Mint only

sudo apt update && sudo apt install gnupg -y

wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | sudo apt-key add -

echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/
mongodb-org/4.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.2.list

sudo apt install mongodb-org

sudo systemctl start mongod

sudo systemctl enable mongod

mongo

# use AlephChat


