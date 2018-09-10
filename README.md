[![npm version](https://badge.fury.io/js/sony-android-tv.svg)](https://badge.fury.io/js/sony-android-tv) [![CircleCI](https://circleci.com/gh/jozefdransfield/sony-android-tv.svg?style=svg)](https://circleci.com/gh/jozefdransfield/sony-android-tv) 

# Sony-Android-TV API

This API allows you to connect and send remote control commands to a Sony Android TV.

## Setup

From the device or using Bonjour you can discover the IP address of your audio device, then the following code will allow you to setup a remote control object;

    const remoteFor = require('sony-android-tv');
    const tvRemote = await remoteFor('http://<ip-address>:<port>', '<psk>');
    
   
Now your remote control object is initialised and ready to execute commands:

    await tvRemote.turnOn();
    await tvRemote.turnOff();

