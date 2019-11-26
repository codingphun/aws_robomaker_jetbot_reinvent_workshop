(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
   
   module.exports = getAWSCredentials();
   
},{}],2:[function(require,module,exports){
    
    var AWS = require('aws-sdk');
    var AWSIoTData = require('aws-iot-device-sdk');
    var AWSConfiguration = require('./aws-configuration.js');
    
    console.log('Loaded AWS SDK for JavaScript and AWS IoT SDK for Node.js');
    
    //
    // Remember our current subscription topic here.
    //
    var currentlySubscribedTopic = 'myTopic';
    
    //
    // Remember our message history here.
    //
    var messageHistory = '';
    
    //
    // Create a client id to use when connecting to AWS IoT.
    //
    //var clientId = 'mqtt-explorer-' + (Math.floor((Math.random() * 100000) + 1));
    var clientId = 'arn:aws:iot:us-east-2:701792830453:thing/MyFirstThing'
    //
    // Initialize our configuration.
    //
    AWS.config.region = AWSConfiguration.region;
    
    AWS.config.credentials = new AWS.Credentials({
      accessKeyId: AWSConfiguration.accessKeyId,
      secretAccessKey: AWSConfiguration.secretAccessKey,
      sessionToken: AWSConfiguration.sessionToken
   });
    //
    // Create the AWS IoT device object.  Note that the credentials must be 
    // initialized with empty strings; when we successfully authenticate to
    // the Cognito Identity Pool, the credentials will be dynamically updated.
    //
    const mqttClient = AWSIoTData.device({
       //
       // Set the AWS region we will operate in.
       //
       region: AWS.config.region,
       //
       ////Set the AWS IoT Host Endpoint
       host:AWSConfiguration.host,
       //
       // Use the clientId created earlier.
       //
       clientId: clientId,
       //
       // Connect via secure WebSocket
       //
       protocol: 'wss',
       //
       // Set the maximum reconnect time to 8 seconds; this is a browser application
       // so we don't want to leave the user waiting too long for reconnection after
       // re-connecting to the network/re-opening their laptop/etc...
       //
       maximumReconnectTimeMs: 8000,
       //
       // Enable console debugging information (optional)
       //
       debug: true,
       //
       // IMPORTANT: the AWS access key ID, secret key, and sesion token must be 
       // initialized with empty strings.
       //
       accessKeyId: '',
       secretKey: '',
       sessionToken: ''
    });
    
    //
    // Attempt to authenticate to the Cognito Identity Pool.  Note that this
    // example only supports use of a pool which allows unauthenticated 
    // identities.
    //
   AWS.config.credentials.get(function(err, data) {
      if (!err) {
         console.log('retrieved IAM Credentials');
         if (!err) {
            //
            // Update our latest AWS credentials; the MQTT client will use these
            // during its next reconnect attempt.
            //
            // console.log('Access Key ' + data.credentials.AccessKeyId)
            // console.log('Access Key ' + data.Credentials.AccessKeyId)
   
            // shadows.updateWebSocketCredentials(data.Credentials.AccessKeyId,
            //    data.Credentials.SecretKey,
            //    data.Credentials.SessionToken);
            mqttClient.updateWebSocketCredentials(AWS.config.credentials.accessKeyId,
               AWS.config.credentials.secretAccessKey);
         } else {
            console.log('error retrieving credentials: ' + err);
            alert('error retrieving credentials: ' + err);
         }
      } else {
         console.log('error retrieving IAM Credentials:' + err);
         alert('error retrieving IAM Credentials: ' + err);
      }
   });
    
    //
    // Connect handler; update div visibility and fetch latest shadow documents.
    // Subscribe to lifecycle events on the first connect event.
    //
    window.mqttClientConnectHandler = function() {
       console.log('connect');
       document.getElementById("status").innerHTML = "Connected";
       messageHistory = '';
    
       //
       // Subscribe to our current topic.
       //
       mqttClient.subscribe(currentlySubscribedTopic);
    };
    
    //
    // Reconnect handler; update div visibility.
    //
    window.mqttClientReconnectHandler = function() {
       console.log('reconnect');
       document.getElementById("status").innerHTML = "Reconnect";
    };
    
    //
    // Utility function to determine if a value has been defined.
    //
    window.isUndefined = function(value) {
       return typeof value === 'undefined' || typeof value === null;
    };
    
    //
    // Message handler for lifecycle events; create/destroy divs as clients
    // connect/disconnect.
    //
    window.mqttClientMessageHandler = function(topic, payload) {
       console.log('message: ' + topic + ':' + payload.toString());
       messageHistory = messageHistory + topic + ':' + payload.toString() + '</br>';
    };
    
    //
    // Handle the UI for the current topic subscription
    //
    window.updateSubscriptionTopic = function() {
       var subscribeTopic = document.getElementById('subscribe-topic').value;
       document.getElementById('subscribe-div').innerHTML = '';
       mqttClient.unsubscribe(currentlySubscribedTopic);
       currentlySubscribedTopic = subscribeTopic;
       mqttClient.subscribe(currentlySubscribedTopic);
    };
    
    //
    // Handle the UI to clear the history window
    //
    window.clearHistory = function() {
       if (confirm('Delete message history?') === true) {
          document.getElementById('subscribe-div').innerHTML = '<p><br></p>';
          messageHistory = '';
       }
    };
    
    //
    // Handle the UI to update the topic we're publishing on
    //
    window.updatePublishTopic = function() {};
    //
    // Install connect/reconnect event handlers.
    //
    mqttClient.on('connect', window.mqttClientConnectHandler);
    mqttClient.on('reconnect', window.mqttClientReconnectHandler);
    mqttClient.on('message', window.mqttClientMessageHandler);

    move = function (linear, angular) {
        var rawText = {
            linear: {
                x: linear,
                y: 0,
                z: 0
            },
            angular: {
                x: 0,
                y: 0,
                z: angular
            }
        }
        var publishText = JSON.stringify(rawText);
        mqttClient.publish("joystick1", publishText);
        console.log('Sending: ' + publishText)
    }
    
    },{"./aws-configuration.js":1,"aws-iot-device-sdk":"aws-iot-device-sdk","aws-sdk":"aws-sdk"}]},{},[2]);
    