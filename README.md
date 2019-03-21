
### install  - Ubuntu 16.04
    1 sudo apt-get update
    2 sudo apt-get install nodejs
    3 curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
    4 echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
    5 sudo apt-get install yarn
    6 sudo apt-get install mysql 
    7 mysql -u USER -pPASSWORD DATABASE < city.sql
    8 cd youar path project
    9 yarn install 
    10 node index.js
        
### install  - macOs
    1 brew install node
    2 brew install mysql
    3 mysql -u USER -pPASSWORD DATABASE < city.sql
    4 cd youar path project 
    5 yarn install 
    6 node index.js
    
