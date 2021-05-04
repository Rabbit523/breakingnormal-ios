/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
	    //navigator.notification.alert('device ready');
	    /*
	    navigator.device.capture.captureVideo(function(){console.log('y');}, function(){console.log('n');}, {limit: 1, duration: 60});
	    */
        this.receivedEvent('deviceready');
        //document.getElementById('btncapture').addEventListener("click", startCapture);
		
		try{
            window.plugins.insomnia.keepAwake();
        }catch(err){
            
        }
		
		/*
        window.FirebasePlugin.getToken(function(token) {
            // save this server-side and use it to push notifications to this device
            console.log("firebase init device token: " + token);
            
        }, function(error) {
            console.error(error);
        });
		*/
		
		window.FirebasePlugin.grantPermission();
        window.FirebasePlugin.onTokenRefresh(function(token) {
            // save this server-side and use it to push notifications to this device
            console.log("firebase refresh token: " + token);
			window.localStorage.setItem("firebase-token", token)
            
        }, function(error) {
            console.error(error);
        });
        		
		if (window.cordova.platformId == "browser") {
			setTimeout(function () {
				facebookConnectPlugin.browserInit('374565429579825');
			},3000);
			
		}else{
			window.location = "#init"; //COMMENT OUT FOR PRODUCTION
		}

        //other permissions
        try{
            cordova.plugins.diagnostic.requestCameraAuthorization({
                successCallback: function(status){
                    console.log("Authorization request for camera use was " + (status == cordova.plugins.diagnostic.permissionStatus.GRANTED ? "granted" : "denied"));
                },
                errorCallback: function(error){
                    console.error(error);
                },
                externalStorage: false
            });
            cordova.plugins.diagnostic.requestMicrophoneAuthorization(function(status){
               if(status === cordova.plugins.diagnostic.permissionStatus.GRANTED){
                   console.log("Microphone use is authorized");
               }
            }, function(error){
                console.error(error);
            });
            
        }catch(err){
            
        }
		
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
	/*
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
	*/
        console.log('Received Event: ' + id);
        
        
    }
};

app.initialize();