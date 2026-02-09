#!/bin/bash
echo "installing MySQL SERVER"
sudo apt update
sudo apt install mysql-server -y
sudo mysql_secure_installation

echo "installing mongoDB SERVER"
curl -fsSL https://pgp.mongodb.com/server-6.0.asc | \
sudo gpg -o /usr/share/keyrings/mongodb-server-6.0.gpg --dearmor
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] \
https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | \
sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo systemctl start mongod
sudo systemctl enable mongod
echo "Fix MongoDB bind IP for global access"
echo "Edit config:  >> sudo nano /etc/mongod.conf     bindIp: 127.0.0.1    to bindIp: 0.0.0.0     >>sudo systemctl restart mongod"