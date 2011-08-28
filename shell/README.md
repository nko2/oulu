
icecapd
=======

Description
-----------

This is a proxy to connect local icecap daemon to our website over HTTP with 
`apikey` provided by our website. We use this on our hosted service 
automatically but you can use it to enable icecap on your own shell service.

Installation to our service
---------------------------

You only need this program if you are using your own shell server/account.

Installation to custom shell service
------------------------------------

### Install icecapd

hg clone http://hg.dovecot.org/icecap/
cd icecap
./autogen.sh
mkdir -p $HOME/opt/icecap
./configure --prefix=$HOME/opt/icecap
make
make install
echo 'PATH=$PATH:$HOME/opt/icecap/bin' >> $HOME/.profile
PATH=$PATH:$HOME/opt/icecap/bin

### Install node

wget http://nodejs.org/dist/node-v0.4.11.tar.gz
tar zxf node-v0.4.11.tar.gz
cd node-v0.4.11
mkdir -p $HOME/opt/node
./configure --prefix=$HOME/opt/node
make
make install
echo 'PATH=$PATH:$HOME/opt/node/bin' >> $HOME/.profile
PATH=$PATH:$HOME/opt/node/bin

### Install npm

git clone http://github.com/isaacs/npm.git
cd npm
mkdir -p $HOME/opt/npm
./configure --prefix=$HOME/opt/npm
make
make install
echo 'PATH=$PATH:$HOME/opt/npm/bin' >> $HOME/.profile
PATH=$PATH:$HOME/opt/npm/bin

### Install node-icecapd

Just type `npm install icecapd` and npm will install it for you.

Running icecapd
---------------

	icecapd start

Configuring it in crontab
-------------------------

List configuration settings:

	./icecapd.js config

Set apikey:

	./icecapd.js config-set apikey ab2cd1ef3gh4g12412
