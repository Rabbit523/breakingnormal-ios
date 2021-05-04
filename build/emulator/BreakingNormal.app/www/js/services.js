
var mainApp = angular.module("mainApp", ['ngRoute']);

//App version constant
var APP_VERSION = '1.0.2';

//custom directives
mainApp.directive('videoEnded', function(){
	return function($scope, $element){
	  $element.bind('ended', function(){
		$scope.eventVideoEnded();
		$element[0].webkitExitFullscreen(); //exit fullscreen after video is done playing
	  });
	};
});

mainApp.directive('videoPaused', function(){
	return function($scope, $element){
	  $element.bind('pause', function(){
		$scope.eventVideoPaused();
		$element[0].webkitExitFullscreen(); //exit fullscreen after video is done playing
	  });
	};
});

mainApp.directive('videoError', function(){
	return function($scope, $element){
	  $element.bind('error', function(){
		$scope.eventVideoError();
	  });
	};
});

mainApp.directive('videoLoaded', function(){
	return function($scope, $element){
		//ios video thumbnail issue workaround
		/*
		$element[0].autoplay=true;
		$element.bind('loadstart', function(){			
			$element[0].pause();
		});
		*/
	};
});

//app settings service
mainApp.factory('settingsService', function(){
	var factory = {};	
	/*
	var webserviceUrl = "https://tribedesigner.online/";	
	var webserviceBaseUrl = "https://tribedesigner.online/services/";	
	*/
	var webserviceUrl = "http://nad.as/tdo/";	
	var webserviceBaseUrl = "http://nad.as/tdo/services/";		
	factory.baseUrl = webserviceUrl;
	factory.userAuthRegisterUrl = webserviceBaseUrl + "user-auth.php?op=register";
	factory.userAuthRegisterFbUrl = webserviceBaseUrl + "user-auth.php?op=register_fb";
	factory.userAuthLoginUrl = webserviceBaseUrl + "user-auth.php?op=login";	
	factory.userInfoUrl = webserviceBaseUrl + "get-content.php?op=get-user&ver="+APP_VERSION;
	factory.weeklyChallengeUrl = webserviceBaseUrl + "get-content.php?op=get-weekly-challenge";
	factory.uploadChallengeVideoUrl = webserviceBaseUrl+"upload-video.php?op=upload-challenge-video";
	factory.weeklyChallengeResponsesUrl = webserviceBaseUrl + "get-content.php?op=get-weekly-challenge-responses";
	factory.weeklyChallengeResponseUrl = webserviceBaseUrl + "get-content.php?op=get-weekly-challenge-response";
	factory.responseReplyUrl = webserviceBaseUrl + "get-content.php?op=get-response-reply";
	factory.messageVideoUrl = webserviceBaseUrl + "get-content.php?op=get-message-video";
	factory.tribeUrl = webserviceBaseUrl + "get-content.php?op=get-tribe";	
	factory.notificationsUrl = webserviceBaseUrl + "get-content.php?op=get-notifications";	
	factory.messagesUrl = webserviceBaseUrl + "get-content.php?op=get-messages";	
	factory.logEventUrl = webserviceBaseUrl + "put-content.php?op=log-event";	
	return factory;	
});


//user authentication service for user registeration, login ...
mainApp.factory('userAuthService', function($http, settingsService) {
	var factory = {};
	
	factory.registerUser = registerUser;
	factory.loginUser = loginUser;
	factory.checkAuth = checkAuth;
	
	return factory;
	
	function registerUser(name, email, passwordone){
		//return "success";
		
		//ready data
		var userData = "&name="+name+"&email="+email+"&pwd="+passwordone;
		
		$http.get(settingsService.userAuthRegisterUrl + userData).then(function(response) {
			objRD = response.data;
			if(objRD.success=='true'){
				//log user in
				loginUser(email, passwordone);
				return true;
			}else{
				//alert("register error");
				displayErrorMessage(objRD.message);
			}
			
		},function(response){
			displayErrorMessage("Error connecting to server. Please try again later");
		});
		
		//.then(handleSuccess, handleError('Error connecting with server'));
		return true;
	}	
	
	
	function loginUser(email, passwordone){
		//ready data
		var userData = "&email="+email+"&pwd="+passwordone;
		
		$http.get(settingsService.userAuthLoginUrl + userData).then(function(response) {
			objRD = response.data;
			if(objRD.success=='true'){
				//set session data
				window.localStorage.setItem("user-id", objRD.userid);
				window.localStorage.setItem("usr", email);
				window.localStorage.setItem("pwd", passwordone);
				//show dashboard
				window.location = "#/dashboard";
				//alert(objRD.userid);
			}else{
				displayErrorMessage(objRD.message);
				//alert("user is login error");
			}
			
		},function(response){
			displayErrorMessage("Error connecting to server. Please try again later");
			//alert("user is login connection error");
		});
		
		//.then(handleSuccess, handleError('Error connecting with server'));
		return true;		
		
	}
	
	function checkAuth(email,passwordone){
		
		var userData = "&email="+email+"&pwd="+passwordone;
		
		$http.get(settingsService.userAuthLoginUrl + userData).then(function(response) {
			objRD = response.data;
			if(objRD.success=='true'){
				return true;
			}else{
				return false;
			}
			
		},function(response){
			return false;
		});
		
		
	}
	
	
});


//camera capture service

mainApp.factory('cameraCaptureService',function($http, $rootScope, settingsService) {
	
	var factory = {}
	
	factory.startCapture = startCapture;
	factory.strCaptureType = ""; //challenge || feedback || message
	
	function startCapture(){
		navigator.device.capture.captureVideo(captureSuccess, captureError, {limit: 1, duration: 60});
	}

	function captureError(e) {
		console.log("capture error: "+JSON.stringify(e));
	}

	function captureSuccess(mediaFiles) {
        var i, len;
        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
            uploadFile(mediaFiles[i]);
			//alert('success');
        }
	}
	
	function uploadFile(mediaFile) {
		
		var ft = new FileTransfer(),
			path = mediaFile.fullPath,
			name = mediaFile.name;
		var options = new FileUploadOptions();
		options.fileKey="file";
		options.mimeType = "video/mpeg";
		options.fileName = name;
		options.chunkedMode = false;
		
		//initialize variables
		var intUserId=0; var intChId=0; var intResponseId=0; var intMessageRecipientId=0; var intMessageId=0;
		
		//get user id
		intUserId = window.localStorage.getItem("user-id");
		
		//get challenge id
		intChId = window.localStorage.getItem("challenge-id");
				
		//get response id
		intResponseId = window.localStorage.getItem("challenge-response-id");
		if(intResponseId>0){
			intChId=0;
		}
		

		
		//get message recipient id
		intMessageRecipientId = window.localStorage.getItem("message-recipient-id");
		if(intMessageRecipientId>0){
			intResponseId=0;
			intChId=0;
			
			//get message id
			intMessageId = window.localStorage.getItem("message-id");		
			
		}
		
		//check if authentic
		var boolIsAuth = 1;
		if(window.localStorage.getItem("user-last-challenge")==intChId){
			boolIsAuth = 0;
		}

		
		var uploadServerUrl = encodeURI(settingsService.uploadChallengeVideoUrl + "&chid="+intChId+"&usrid="+intUserId+"&responseid="+intResponseId+"&isauth="+boolIsAuth+"&messagerecipient="+intMessageRecipientId+"&messageid="+intMessageId);
		console.log(uploadServerUrl);
		
		$rootScope.$emit('showUploadingScreen'); //show uploading overlay
		
		ft.upload(path,
			uploadServerUrl,
			function(result) {
				console.log('Upload success: ' + result.responseCode);
				console.log(result.bytesSent + ' bytes sent');
				console.log('response:'+result.response);
				
				//if error
				if(result.response=='error'){
					$rootScope.$emit('hideUploadingScreen'); //hide uploading overlay
					//show error message box, with retry option
					navigator.notification.confirm(
						'Your video failed to be uploaded! Please make sure you are connected to internet.', // message
						 function(btnIndex){if(btnIndex==1){uploadFile(mediaFile);}},            // callback to invoke with index of button pressed
						'Breaking Normal',           // title
						['Retry','Cancel']     // buttonLabels
					);
					return false;
				}
				
				//show next view
				if(intResponseId>0){
					window.location='#weeklychallengeresponse';
				}else{
					if(intChId>0){
						window.location='#weeklychallengeresponses';
					}
				}
				
				//alert('uploaded');
				
				$rootScope.$emit('hideUploadingScreen'); //hide uploading overlay
				
				return true;
				
			},
			function(error) {
				$rootScope.$emit('hideUploadingScreen'); //hide uploading overlay
				//displayErrorMessage('Error uploading file ' + path + ': ' + error.code);
				
				//show error message box, with retry option
				navigator.notification.confirm(
					'Your video failed to be uploaded! Please make sure you are connected to internet.', // message
					 function(btnIndex){if(btnIndex==1){uploadFile(mediaFile);}},            // callback to invoke with index of button pressed
					'Breaking Normal',           // title
					['Retry','Cancel']     // buttonLabels
				);
				
			},
			options);
		
			
	}

	return factory;
});