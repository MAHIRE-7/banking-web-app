#!/bin/bash
echo "This is Ubuntu Shell Script File press CTRL + C is you are on another OS"
sleep 5

sudo apt-get update
sleep 5
echo "Installing node"
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
\. "$HOME/.nvm/nvm.sh"
nvm install 24
node -v # Should print "v24.13.0".
npm -v # Should print "11.6.2".
sudo chown -R ubuntu:ubuntu /opt

