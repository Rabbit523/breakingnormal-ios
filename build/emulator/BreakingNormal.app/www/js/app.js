
 mainApp.controller('initController', function($scope, $http, settingsService) {

	//check user auth
	var strUserEmail = 	window.localStorage.getItem("usr");
	var strUserPwd =	window.localStorage.getItem("pwd");
	
	//check fb authentication
	function checkFbAuth(){
		facebookConnectPlugin.getLoginStatus(function(data) {
			if(data.status=='connected'){
				window.location = "#dashboard";
			}else{
				window.location = "#login";
			}		
		});		
	}
	
	function checkAuth(){
		var userData = "&email="+strUserEmail+"&pwd="+strUserPwd;
		
		$http.get(settingsService.userAuthLoginUrl + userData).then(function(response) {
			objRD = response.data;
			if(objRD.success=='true'){
				window.location = "#dashboard";
			}else{
				window.location = "#login";
			}
			
		},function(response){
			window.location = "#login";
		});		
	}

	if ((typeof strUserEmail !== 'undefined') && (typeof strUserPwd !== 'undefined')) {
		if(strUserPwd == 'fbuser'){
			checkFbAuth();
		}else{
			checkAuth();
		}
	}else{
		window.location = "#login";
	}		

 });


 mainApp.controller('loginController', function($scope, $timeout, $http, $timeout, settingsService) {

	$scope.$on('$viewContentLoaded', function() {		 
			//alert('y');
			hideSideMenu();			
	});	
	
	
	$scope.fbLoginSuccess = function (userData) {
		//alert("UserInfo: " + JSON.stringify(userData));
		//alert(userData.authResponse.userID);
		facebookConnectPlugin.api(userData.authResponse.userID+"/?fields=id,name,email,picture.width(720).height(720)", ["email"],
			function (result) {
				//alert("Result: " + JSON.stringify(result));
				
				//register user
				var strPicture = encodeURIComponent(result.picture.data.url);
				var strName = result.name;
				var strEmail = result.email;
				var strFbId = result.id;
				
				var userData = "&email="+strEmail+"&id="+strFbId+"&name="+strName+"&pic="+strPicture;
				
				//alert(userData);
				
				$http.get(settingsService.userAuthRegisterFbUrl + userData).then(function(response) {
					objRD = response.data;
					if(objRD.success=='true'){
						//set session data
						window.localStorage.setItem("user-id", objRD.userid);
						window.localStorage.setItem("usr", strEmail);
						window.localStorage.setItem("pwd", 'fbuser');
						window.localStorage.setItem("fbid", strFbId);
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
				
			},
			function (error) {
				alert("Failed: " + JSON.stringify(error));
			});
		
		
	}
	$scope.facebookLogin = function () {
		facebookConnectPlugin.login(['public_profile', 'email'], $scope.fbLoginSuccess, function (data) {
			alert("You need to approve access to login!");
		});
	};
	
	
 });
 
//the game 
mainApp.controller('gameController', function($scope, $rootScope) {
	
	$rootScope.$emit('changeBackButton', '#dashboard');
	
	$scope.$on('$viewContentLoaded', function() {		 
			//alert('y');
			showSideMenu();
			$rootScope.$emit('sideMenuTitleChange', 'The Game');//change side menu
	});	

}); 

//game introduction 
mainApp.controller('gameintroController', function($scope, $rootScope) {
	
	$rootScope.$emit('changeBackButton', '#dashboard');
	
	$scope.$on('$viewContentLoaded', function() {		 
			//alert('y');
			showSideMenu();
			$rootScope.$emit('sideMenuTitleChange', 'The Game');//change side menu
	});	

}); 
 
//guidelines 
mainApp.controller('guidelinesController', function($scope, $rootScope) {
	
	$rootScope.$emit('changeBackButton', '#dashboard');
	
	$scope.$on('$viewContentLoaded', function() {		 
			//alert('y');
			showSideMenu();
			$rootScope.$emit('sideMenuTitleChange', 'Guidelines');//change side menu
			$rootScope.$emit('hideLoadingScreen'); //hide loading overlay
			
			if(window.localStorage.getItem("first-time-use")!='no'){
				window.localStorage.setItem("first-time-use",'no');
				$scope.firstTimeUse=1;
			}
	});	
	
	$scope.gotoStep = function(num){
		window.location = "#guideline"+num;
	};
	
	$scope.gotoDashboard = function(num){
		window.location = "#dashboard";
		return true;
	};
});

//guidelines intro
mainApp.controller('guidelinesintroController', function($scope, $rootScope) {
	
	$rootScope.$emit('changeBackButton', '#dashboard');
	
	$scope.$on('$viewContentLoaded', function() {		 
			//alert('y');
			showSideMenu();
			$rootScope.$emit('sideMenuTitleChange', 'Guidelines');//change side menu
			$rootScope.$emit('hideLoadingScreen'); //hide loading overlay
			
			if(window.localStorage.getItem("first-time-use")!='no'){
				window.localStorage.setItem("first-time-use",'no');
				$scope.firstTimeUse=1;
			}
	});	
	
	$scope.gotoDashboard = function(num){
		window.location = "#dashboard";
		return true;
	};
});


//guidelines for academy
mainApp.controller('guidelinesacademyController', function($scope, $rootScope) {
	
	$rootScope.$emit('changeBackButton', '#dashboard');
	
	$scope.$on('$viewContentLoaded', function() {		 
			//alert('y');
			showSideMenu();
			$rootScope.$emit('sideMenuTitleChange', 'Guidelines');//change side menu
			$rootScope.$emit('hideLoadingScreen'); //hide loading overlay
	});	
	
	$scope.gotoChallenge = function(){
		navigator.notification.confirm(
		'Are you ready for your weekly challenge? You will be read a challenge question and your camera will turn on automatically after 5 seconds.', // message
		 function(btnIndex){if(btnIndex==1){window.location = '#weeklychallenge';}},            // callback to invoke with index of button pressed
		'Breaking Normal',           // title
		['Enter','Cancel']     // buttonLabels
		);
		window.localStorage.setItem("weekly-challenge-warning", 1);
	};
});
 
//profile 
mainApp.controller('profileController', function($scope, $rootScope) {

	$scope.$on('$viewContentLoaded', function() {		 
			//alert('y');
			showSideMenu();
			$rootScope.$emit('sideMenuTitleChange', 'Profile');//change side menu
	});	
	
});
 
//signout 
mainApp.controller('signoutController', function($scope, $rootScope) {
	window.localStorage.setItem("user-id", "");
	window.localStorage.setItem("usr", "");
	window.localStorage.setItem("pwd", "");
	window.localStorage.setItem("user-last-challenge", "");
	//show dashboard
	window.location = "#init";	
});


//subscription 
mainApp.controller('subscriptionController', function($scope, $rootScope) {

	$scope.$on('$viewContentLoaded', function() {		 
			//alert('y');
			showSideMenu();
			$rootScope.$emit('sideMenuTitleChange', 'Subscribe');//change side menu
			$rootScope.$emit('changeBackButton', 'hide');
			$rootScope.$emit('hideLoadingScreen'); //hide loading overlay
			hideMenuButton();
	});	
	
});

//beta-lock 
mainApp.controller('betalockController', function($scope, $rootScope) {

	$scope.$on('$viewContentLoaded', function() {		 
			//alert('y');
			showSideMenu();
			$rootScope.$emit('sideMenuTitleChange', 'Breaking Normal');//change side menu
			$rootScope.$emit('changeBackButton', 'hide');
			$rootScope.$emit('hideLoadingScreen'); //hide loading overlay
			hideMenuButton();
	});	
	
});

//version-lock 
mainApp.controller('versionlockController', function($scope, $rootScope) {

	$scope.$on('$viewContentLoaded', function() {		 
			//alert('y');
			showSideMenu();
			$rootScope.$emit('sideMenuTitleChange', 'Breaking Normal');//change side menu
			$rootScope.$emit('changeBackButton', 'hide');
			$rootScope.$emit('hideLoadingScreen'); //hide loading overlay
			hideMenuButton();
	});

	$scope.gotoAppUpdate = function(){
		window.open(window.localStorage.getItem("update-link"),"_system");
	};
		
	
});

//subscription-status 
mainApp.controller('subscriptionstatusController', function($scope, $rootScope) {

	$scope.$on('$viewContentLoaded', function() {		 
			//alert('y');
			showSideMenu();
			$rootScope.$emit('changeBackButton', '#dashboard');
			$rootScope.$emit('sideMenuTitleChange', 'Subscription Status');//change side menu
			//$rootScope.$emit('changeBackButton', 'hide');
			$rootScope.$emit('hideLoadingScreen'); //hide loading overlay
			//hideMenuButton();
	});	
	
});
 
 
//dashboard controller
mainApp.controller('dashboardController', function($scope, $rootScope, $http, settingsService) {
	
	
	$rootScope.$emit('sideMenuTitleChange', '  Dashboard');//change side menu
	$rootScope.$emit('changeBackButton', 'hide');
	showMenuButton();
	$rootScope.$emit('showLoadingScreen'); //show loading overlay
	
	//default data
	$scope.profilePicSrc = "img/1x1.gif";
	$scope.profileName = "";
	
	
	
	$scope.$on('$viewContentLoaded', function() {		 
			showSideMenu();			
			
			var userData = "&userid="+window.localStorage.getItem("user-id");
			//attach firebasse token
			userData = userData + "&firebaseToken="+window.localStorage.getItem("firebase-token");
			$http.get(settingsService.userInfoUrl + userData).then(function(response) {
				objRD = response.data;
				if(objRD.success=='true'){
					//dump(objRD);
					$scope.profilePicSrc = objRD.user.profile_pic;
					$scope.profileName = objRD.user.display_name;
					$scope.intChallenges = objRD.challenge_count;
					$scope.intBadges = objRD.badge_count;
					$scope.intFeedbacks = objRD.feedback_count;
					$scope.hasNotifications = objRD.has_notifications;
					//$scope.$apply();					
					
					//redirect to payment/subscription view, if subscription status==0
					
					//redirect to guidelines if first time use
					if(window.localStorage.getItem("first-time-use")!='no'){
						if(objRD.trial==1){
							window.location="#guidelinesintro";
							return true;
						}else{
							window.localStorage.setItem("first-time-use","no");
						}
					}

					//redirect if beta lock
					if(objRD.lock_beta==1){
						window.location="#betalock";
						return true;
					}	

					//redirect if version lock
					if(objRD.lock_version==1){
						window.localStorage.setItem("update-link",objRD.update_link)
						window.location="#versionlock";
						return true;
					}		

					if(objRD.user.subscription_status==0){
						window.location="#subscription";
						return true;
					}						
					
					
				}else{					
					displayErrorMessage(objRD.message);
				}	
				$rootScope.$emit('hideLoadingScreen'); //hide loading overlay	
				
			},function(response){
				$rootScope.$emit('hideLoadingScreen'); 
				displayErrorMessage("Error connecting to server. Please try again later");
			});

		
			$scope.showWeeklyChallenge = function(id){
				//alert(id);
				if(window.localStorage.getItem("weekly-challenge-warning")>0){
					window.location = '#weeklychallenge';

				}else{
					window.location = '#guidelinesacademy';
				}
			};
	});	
 });
 
 
 //weekly challenge controller
 mainApp.controller('weeklychallengeController', function($scope, $rootScope, $interval, $http, settingsService, cameraCaptureService) {

	var intTimerInterval = 5;
	var tmrTimer;

	//default model values
	$scope.strTimerCaption = "Camera will start recording automatically after question is read and timer is up!";
	$scope.strTimerCaptionBold = '';
	$scope.checkVideoButtonVisibility = 0;
 	
	$rootScope.$emit('sideMenuTitleChange', 'Weekly Challenge'); //change side menu
	$rootScope.$emit('changeBackButton', '#dashboard');
	$rootScope.$emit('showLoadingScreen'); //show loading overlay
	
	//initialize camera service
	window.localStorage.setItem("challenge-response-id", 0); //reset variables
	window.localStorage.setItem("message-recipient-id", 0);
	$scope.startCapture = function(){
		$interval.cancel(tmrTimer);
		cameraCaptureService.startCapture();
	}
	
	
	$scope.$on('$viewContentLoaded', function() {		 
			showSideMenu();			
			
			var userData = "&userid="+window.localStorage.getItem("user-id");
			$http.get(settingsService.weeklyChallengeUrl + userData).then(function(response) {
				objRD = response.data;
				if(objRD.success=='true'){

					
					//set session data					
					window.localStorage.setItem("challenge-id", objRD.challenge_id);
					
					//window.localStorage.setItem("user-last-challenge",0); DEBUG
					
					//redirect to other view if user has already submitted challenge video
					if(objRD.has_user_submission=='true'){
						window.location="#weeklychallengeresponses";
						return true;
					}	
					
					//set video data
					$scope.videoUrl = settingsService.baseUrl + "data/challenge-videos/"+ objRD.challenge_id+'.mp4';
					
					$scope.challengeText = objRD.challenge_text;
					
					//check if challenge time elapsed
					if(window.localStorage.getItem("user-last-challenge") == objRD.challenge_id){
						$scope.disableRecordButton();
					}else{
					
						//Read Question
						try{
							TTS.speak({text: objRD.challenge_text, locale: 'en-GB', rate: 1}, function () {
								$scope.startTimer();
							}, function (reason) {
								//alert(reason);
							});
						}catch(err){
							$scope.startTimer();
						}
					}
					
					//$scope.$apply();
				}else{
					displayErrorMessage(objRD.message);
				}	
				
				$rootScope.$emit('hideLoadingScreen'); //hide loading overlay	
				
			},function(response){
				$rootScope.$emit('hideLoadingScreen'); //hide loading overlay
				displayErrorMessage("Error connecting to server. Please try again later");
			});
		
		
	});	
	
	

	
	//logic for video response within a time limit
	$scope.eventVideoEnded = function(){
		//$scope.startTimer();
	};
	
	$scope.eventVideoPaused = function(){
		//$scope.startTimer();
	};
	

	$scope.changeTimerCaption = function(intTime){
		$scope.strTimerCaption = "";
		$scope.strTimerCaptionBold =intTime;
	};	
	
	$scope.startTimer = function(){
		
		if(window.localStorage.getItem("challenge-id") == window.localStorage.getItem("user-last-challenge")){
			return false;
		}
		
		tmrTimer = $interval(function(){
			intTimerInterval--;
			$scope.changeTimerCaption(intTimerInterval);
			if(intTimerInterval==0){
				//disable record button and set session data after time is elapsed
				$interval.cancel(tmrTimer);
				//$scope.disableRecordButton();
				var intChallengeId = window.localStorage.getItem("challenge-id");
				window.localStorage.setItem("user-last-challenge", intChallengeId);
				$scope.startCapture();
			}
		}, 1000);
		
	};	
	
	$scope.disableRecordButton = function(){
		$scope.checkVideoButtonVisibility = 0;
		$scope.strTimerCaption = "You can tap on respond button to record a response.";
		$scope.strTimerCaptionBold = "";
	}

	
 });
 
 //weekly challenge responses controller
 mainApp.controller('weeklychallengeresponsesController', function($scope, $rootScope, $http, settingsService) {

	//default data values
	$scope.videoresponses = [{"profile_pic":"","display_name":"default","user_video_id":"0"}];
	
 	
	$rootScope.$emit('sideMenuTitleChange', 'Weekly Challenge');//change side menu
	$rootScope.$emit('changeBackButton', '#dashboard');
	$rootScope.$emit('showLoadingScreen'); //show loading overlay
	
	$scope.eventVideoEnded = function(){};
	
	$scope.$on('$viewContentLoaded', function() {		 
			showSideMenu();			
			
			var userData = "&chid=" + window.localStorage.getItem("challenge-id");
			userData += "&userid=" + window.localStorage.getItem("user-id");
			$http.get(settingsService.weeklyChallengeResponsesUrl + userData).then(function(response) {
				objRD = response.data;
				if(objRD.success=='true'){
					//dump(objRD);
					$scope.videoUrl = settingsService.baseUrl + "data/challenge-videos/"+ objRD.challenge_id+'.mp4';
					$scope.challengeText = objRD.challenge_text;
					$scope.baseUrl = '';
					$scope.videoresponses = objRD.videoresponses;
					
					//$scope.$apply();
				}else{
					displayErrorMessage(objRD.message);
				}			
				
				$rootScope.$emit('hideLoadingScreen'); //hide loading overlay
				
			},function(response){
				$rootScope.$emit('hideLoadingScreen');
				displayErrorMessage("Error connecting to server. Please try again later");
			});
			
			$scope.showResponse = function(id){
				//alert(id);
				window.localStorage.setItem("challenge-response-id",id);
				window.location = "#weeklychallengeresponse";
			};
			
	});


	
 });
 
 
 //weekly challenge response controller
 mainApp.controller('weeklychallengeresponseController', function($scope, $rootScope, $http, $interval, settingsService, cameraCaptureService) {

 	
	$rootScope.$emit('sideMenuTitleChange', 'Challenge Response'); //change side menu
	$rootScope.$emit('changeBackButton', '#weeklychallengeresponses');
	$rootScope.$emit('showLoadingScreen'); //show loading overlay
	
	$scope.hasReplies = 1;
	$scope.hasLockedFb = 0;
	$scope.boolShowTimerCaption = 0;
	$scope.boolShowRecordButton =1;
	
	//initialize camera service
	window.localStorage.setItem("message-recipient-id", 0); //reset other variables
	$scope.startCapture = cameraCaptureService.startCapture;

	$scope.$on('$viewContentLoaded', function() {		 
			showSideMenu();			

			var userData = "&vid=" + window.localStorage.getItem("challenge-response-id");
			userData += "&userid=" + window.localStorage.getItem("user-id");
			$http.get(settingsService.weeklyChallengeResponseUrl + userData).then(function(response) {
				var objRD = response.data;
				if(objRD.success=='true'){
					//dump(objRD);
					var videoResponse = objRD.response_video;
					$scope.videoUrl = settingsService.baseUrl + "data/user-videos/"+ videoResponse.file_name;
					$scope.baseUrl = '';
					$scope.videoreplies = objRD.videoreplies;
					$scope.videoResponse = videoResponse;	
					$scope.hasReplies = objRD.has_replies;
					$scope.hasLockedFb = objRD.has_lockedfb;
					$scope.enableSharing = objRD.enable_sharing;
					if(objRD.disable_timer == 1){
						$scope.boolShowRecordButton =0;
					}
					
					//$scope.$apply();
				}else{
					displayErrorMessage(objRD.message);
				}	
				
				$rootScope.$emit('hideLoadingScreen'); //hide loading overlay
				
			},function(response){
				$rootScope.$emit('hideLoadingScreen');
				displayErrorMessage("Error connecting to server. Please try again later");
			});
			
			$scope.showReply=function(id){
				window.localStorage.setItem("response-reply-id",id);
				window.location = "#responsereply";
			};

			$scope.showChallenge=function(id){
				window.localStorage.setItem("challenge-response-id",id);
				window.location = "#weeklychallengeresponse";
			};

			$scope.shareFb=function(){

				window.open('https://www.facebook.com/dialog/feed?app_id=374565429579825&link=http://breakingnormal.io/content.php?id='+window.localStorage.getItem("challenge-response-id"),'_system');
			};
				
			$scope.goBack = function(){
				window.location = "#weeklychallengeresponses";
			};
			
			$scope.reloadVideo = function(){
				var intRand = Math.floor((Math.random() * 100000) + 1);
				$('#challenge-video-player').attr('src',$scope.videoUrl+'?rand='+intRand);
			}
			
			
			//start timer on video end
			$scope.eventVideoEnded = function(){
				if($scope.boolShowRecordButton==1){
					$scope.startTimer();
					$scope.boolShowTimerCaption=1;
				}
			};	

			//on video error, show video reload option
			$scope.eventVideoError = function(){
				$('.video-container').css('height','370px');
				$('#video-reload').show();
			};					
			
			var intTimerInterval = 15;
	
			$scope.changeTimerCaption = function(intTime){
				$scope.strTimerCaptionBold =intTime+"s";
			};	
			
			$scope.disableRecordButton= function(){
				$scope.boolShowTimerCaption=0;
				$scope.boolShowRecordButton=0;			
				//log event
				var userData = "&refid=" + window.localStorage.getItem("challenge-response-id");
				userData += "&userid=" + window.localStorage.getItem("user-id");	
				userData += "&title=feedback-timer-up";				
				$http.get(settingsService.logEventUrl + userData).then(function(response) {
				}, function(response){});
				//alert(settingsService.logEventUrl + userData);
			}
			
			$scope.startTimer = function(){
				var tmrTimer = $interval(function(){
					intTimerInterval--;
					$scope.changeTimerCaption(intTimerInterval);
					if(intTimerInterval==0){
						//disable record button and set session data after time is elapsed
						
						$interval.cancel(tmrTimer);
						$scope.disableRecordButton();
						
						/*
						
						var intChallengeId = window.localStorage.getItem("challenge-id");
						window.localStorage.setItem("user-last-challenge", intChallengeId);
						*/
					}
				}, 1000);
				
			};	
			
	});	
 });
 
 
  
//Response's reply controller
mainApp.controller('responsereplyController', function($scope, $rootScope, $http, settingsService) {

 	
	$rootScope.$emit('sideMenuTitleChange', 'Feedback Video');	//change side menu
	$rootScope.$emit('changeBackButton', '#weeklychallengeresponse');
	$rootScope.$emit('showLoadingScreen'); //show loading overlay

	$scope.eventVideoEnded = function(){};

	$scope.$on('$viewContentLoaded', function() {		 
			showSideMenu();			
			
			var userData = "&vid=" + window.localStorage.getItem("response-reply-id");
			$http.get(settingsService.responseReplyUrl + userData).then(function(response) {
				var objRD = response.data;
				if(objRD.success=='true'){
					//dump(objRD);
					var videoResponse = objRD.response_video;
					$scope.videoUrl = settingsService.baseUrl + "data/user-videos/"+ videoResponse.file_name;
					$scope.baseUrl = '';
					$scope.videoResponse = videoResponse;
					
					$rootScope.$emit('hideLoadingScreen'); //hide loading overlay
					
					//$scope.$apply();
				}else{
					displayErrorMessage(objRD.message);
				}			
				
				$rootScope.$emit('hideLoadingScreen');
				
			},function(response){
				$rootScope.$emit('hideLoadingScreen');
				displayErrorMessage("Error connecting to server. Please try again later");
			});
			
			$scope.goBack = function(){
				window.location = "#weeklychallengeresponse";
			};
			
	});	
 });
 
 //register controller
 mainApp.controller('registerController', function($scope, userAuthService) {
	$scope.$on('$viewContentLoaded', function() {		 
			//alert('y');
			hideSideMenu();
			$scope.registerU = function(){				
				if($scope.passwordone != $scope.passwordtwo){
					displayErrorMessage("Passwords do not match");
					return false;
				}
				var at = userAuthService.registerUser($scope.name,$scope.email,$scope.passwordone);
			}	
	});	
 });
 
 //signin controller
 mainApp.controller('signinController', function($scope, userAuthService) {
	$scope.$on('$viewContentLoaded', function() {		 
			//alert('y');
			hideSideMenu();
			$scope.loginU = function(){				
				var at = userAuthService.loginUser($scope.email,$scope.passwordone);
			}	
	});	
 });


//messages controller
 mainApp.controller('messagesController', function($scope, $rootScope, $http, settingsService) {

 	
	$rootScope.$emit('sideMenuTitleChange', 'Messages'); //change side menu
	$rootScope.$emit('changeBackButton', '#dashboard');
	$rootScope.$emit('showLoadingScreen'); //show loading overlay

	$scope.$on('$viewContentLoaded', function() {		 
			showSideMenu();			
			
			var userData = "&userid=" + window.localStorage.getItem("user-id");
			$http.get(settingsService.messagesUrl + userData).then(function(response) {
				var objRD = response.data;
				if(objRD.success=='true'){
					//dump(objRD);
					$scope.baseUrl = '';
					$scope.messages = objRD.messages;					
					$scope.hasMessages = objRD.has_messages;	
					$scope.messagesOutbox = objRD.outbox_messages;					
					$scope.hasOutboxMessages = objRD.has_outbox_messages;
					
					//$scope.$apply();
				}else{
					displayErrorMessage(objRD.message);
				}	
				
				$rootScope.$emit('hideLoadingScreen'); //hide loading overlay
				
			},function(response){
				$rootScope.$emit('hideLoadingScreen');
				displayErrorMessage("Error connecting to server. Please try again later");
			});
			
	});	
	
	$scope.gotoMessage=function(id, boolReply){
		window.localStorage.setItem("message-video-id",id);
		window.localStorage.setItem("message-enable-reply",boolReply);
		window.location = "#message";
	}
	
 });  
 
 
//message controller
mainApp.controller('messageController', function($scope, $rootScope, $http, settingsService, cameraCaptureService) {

 	
	$rootScope.$emit('sideMenuTitleChange', 'Message Video');	//change side menu
	$rootScope.$emit('changeBackButton', '#messages');
	$rootScope.$emit('showLoadingScreen'); //show loading overlay

	$scope.eventVideoEnded = function(){};

	$scope.$on('$viewContentLoaded', function() {		 
			showSideMenu();			
			
			var userData = "&vid=" + window.localStorage.getItem("message-video-id");
			$http.get(settingsService.messageVideoUrl + userData).then(function(response) {
				var objRD = response.data;
				if(objRD.success=='true'){
					//dump(objRD);
					var videoResponse = objRD.response_video;
					$scope.videoUrl = settingsService.baseUrl + "data/user-videos/"+ videoResponse.file_name;
					$scope.baseUrl = '';
					$scope.videoResponse = videoResponse;
					$scope.messageUserId = videoResponse.user_id;
					$scope.enableReply = objRD.enable_reply;
					
					//sets message id for reply
					window.localStorage.setItem("message-id", objRD.message_id);
					
					$rootScope.$emit('hideLoadingScreen'); //hide loading overlay
					
					//$scope.$apply();
				}else{
					displayErrorMessage(objRD.message);
				}			
				
				$rootScope.$emit('hideLoadingScreen');
				
			},function(response){
				$rootScope.$emit('hideLoadingScreen');
				displayErrorMessage("Error connecting to server. Please try again later");
			});
			
			$scope.goBack = function(){
				window.location = "#messages";
			};
			
	});	
	
	//message recording
	$scope.recordMessage = function(id){
		//set cameracapture service variables
		window.localStorage.setItem("challenge-response-id", 0);
		window.localStorage.setItem("message-recipient-id", id);
		cameraCaptureService.startCapture();
	}
	
 });
 

//tribe controller
 mainApp.controller('tribeController', function($scope, $rootScope, $http, settingsService, cameraCaptureService) {

 	
	$rootScope.$emit('sideMenuTitleChange', 'My Tribe'); //change side menu
	$rootScope.$emit('changeBackButton', '#dashboard');
	$rootScope.$emit('showLoadingScreen'); //show loading overlay

	$scope.$on('$viewContentLoaded', function() {		 
			showSideMenu();			
			
			var userData = "&userid=" + window.localStorage.getItem("user-id");
			$http.get(settingsService.tribeUrl + userData).then(function(response) {
				var objRD = response.data;
				if(objRD.success=='true'){
					//dump(objRD);
					$scope.baseUrl = '';
					$scope.tribemembers = objRD.tribe_members;					
					
					//$scope.$apply();
				}else{
					displayErrorMessage(objRD.message);
				}	
				
				$rootScope.$emit('hideLoadingScreen'); //hide loading overlay
				
			},function(response){
				$rootScope.$emit('hideLoadingScreen');
				displayErrorMessage("Error connecting to server. Please try again later");
			});
			
	});	
	
	//message recording
	$scope.recordMessage = function(id){
		//set cameracapture service variables
		window.localStorage.setItem("challenge-response-id", 0);
		window.localStorage.setItem("message-recipient-id", id);
		window.localStorage.setItem("message-id", 0);
		cameraCaptureService.startCapture();
	}
	
 }); 
 
 
 
//notifications controller
 mainApp.controller('notificationsController', function($scope, $rootScope, $http, settingsService) {

 	
	$rootScope.$emit('sideMenuTitleChange', 'Notifications'); //change side menu
	$rootScope.$emit('changeBackButton', '#dashboard');
	$rootScope.$emit('showLoadingScreen'); //show loading overlay

	$scope.$on('$viewContentLoaded', function() {		 
			showSideMenu();			
			
			var userData = "&userid=" + window.localStorage.getItem("user-id");
			$http.get(settingsService.notificationsUrl + userData).then(function(response) {
				var objRD = response.data;
				if(objRD.success=='true'){
					//dump(objRD);
					$scope.baseUrl = '';
					$scope.notifications = objRD.notifications;					
					
					//$scope.$apply();
				}else{
					displayErrorMessage(objRD.message);
				}	
				
				$rootScope.$emit('hideLoadingScreen'); //hide loading overlay
				
			},function(response){
				$rootScope.$emit('hideLoadingScreen');
				displayErrorMessage("Error connecting to server. Please try again later");
			});
			
	});
	
	$scope.gotoNotification=function(strLink){
		window.location = strLink;
	}
	
 }); 
 
 
mainApp.controller('testControllerDefault', function($scope) {
	$scope.message = "This page will be used to display all the students";
 });
 
mainApp.config(['$locationProvider', function($locationProvider) {
  $locationProvider.hashPrefix('');
}]);

//controller for sidemenu include
mainApp.controller('sideMenuController', function($scope, $rootScope) {

	 //when sidemenu template is loaded
	 $scope.$on('$includeContentLoaded', function() {
		 
			//document.getElementById('side-menu-text').innerHTML = "DASHBOARD";

			$('#side-menu-link').sidr({
				timing: 'ease-in-out',
				speed: 500
			});			

			$( window ).resize(function () {
			  $.sidr('close', 'sidr');
			});

			$('.smooth').click(function () {
			  var target = $(this.hash);

			  $.sidr('close', 'sidr');
			  
			});
	});
	
	$rootScope.$on('sideMenuTitleChange', function(event, data) {
		$scope.menuTitle = data;
	});
	
	//control loading and uploading screens
	$rootScope.$on('showLoadingScreen', function(event, data) {
		window.scrollTo(0, 0);
		$('#loading-screen').show();
	});
	$rootScope.$on('showUploadingScreen', function(event, data) {
		window.scrollTo(0, 0);
		$('#uploading-screen').show();
	});
	$rootScope.$on('hideLoadingScreen', function(event, data) {
		$('#loading-screen').hide();
	});
	$rootScope.$on('hideUploadingScreen', function(event, data) {
		$('#uploading-screen').hide();
	});
	
	//back button control
	$rootScope.$on('changeBackButton', function(event, data) {
		if(data=='hide'){
			$('#side-menu-back-button').hide();
		}else{
			$('#side-menu-back-button').show();
			$('#side-menu-back-button').attr("href",data);
		}
	});
	
 });
