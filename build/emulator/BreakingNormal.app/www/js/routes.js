//routes configuration////////////////////////
mainApp.config(['$routeProvider', function($routeProvider) {
   $routeProvider.
   when('/init', {
      template: '<p></p>', controller: 'initController'
   }).     
   when('/login', {
      templateUrl: 'views/login.html', controller: 'loginController'
   }).   
   when('/dashboard', {
      templateUrl: 'views/dashboard.html', controller: 'dashboardController'
   }).
   when('/register', {
      templateUrl: 'views/register.html', controller: 'registerController'
   }).
   when('/signin', {
      templateUrl: 'views/signin.html', controller: 'signinController'
   }).
   when('/weeklychallenge', {
      templateUrl: 'views/weeklychallenge.html', controller: 'weeklychallengeController'
   }).
   when('/weeklychallengeresponses', {
      templateUrl: 'views/weeklychallengeresponses.html', controller: 'weeklychallengeresponsesController'
   }).
   when('/weeklychallengeresponse', {
      templateUrl: 'views/weeklychallengeresponse.html', controller: 'weeklychallengeresponseController'
   }).
   when('/responsereply', {
      templateUrl: 'views/responsereply.html', controller: 'responsereplyController'
   }).
   when('/guidelines', {
      templateUrl: 'views/guidelines/guideline1.html', controller: 'guidelinesController'
   }).
   when('/guidelinesintro', {
      templateUrl: 'views/guidelines/guideline-intro.html', controller: 'guidelinesintroController'
   }).
   when('/guidelinesacademy', {
      templateUrl: 'views/guidelines/guideline-academy.html', controller: 'guidelinesacademyController'
   }).
   when('/guideline1', {
      templateUrl: 'views/guidelines/guideline1.html', controller: 'guidelinesController'
   }).
   when('/guideline2', {
      templateUrl: 'views/guidelines/guideline2.html', controller: 'guidelinesController'
   }).
   when('/guideline3', {
      templateUrl: 'views/guidelines/guideline3.html', controller: 'guidelinesController'
   }).
   when('/guideline4', {
      templateUrl: 'views/guidelines/guideline4.html', controller: 'guidelinesController'
   }).
   when('/guideline5', {
      templateUrl: 'views/guidelines/guideline5.html', controller: 'guidelinesController'
   }).
   when('/guideline6', {
      templateUrl: 'views/guidelines/guideline6.html', controller: 'guidelinesController'
   }).
   when('/guideline7', {
      templateUrl: 'views/guidelines/guideline7.html', controller: 'guidelinesController'
   }).
   when('/profile', {
      templateUrl: 'views/profile.html', controller: 'profileController'
   }).
   when('/tribe', {
      templateUrl: 'views/tribe.html', controller: 'tribeController'
   }).
   when('/messages', {
      templateUrl: 'views/messages.html', controller: 'messagesController'
   }).
   when('/message', {
      templateUrl: 'views/message.html', controller: 'messageController'
   }).
   when('/subscription', {
      templateUrl: 'views/subscription.html', controller: 'subscriptionController'
   }).
   when('/betalock', {
      templateUrl: 'views/beta-lock.html', controller: 'betalockController'
   }).
   when('/versionlock', {
      templateUrl: 'views/version-lock.html', controller: 'versionlockController'
   }).
   when('/subscriptionstatus', {
      templateUrl: 'views/subscription-status.html', controller: 'subscriptionstatusController'
   }).
   when('/notifications', {
      templateUrl: 'views/notifications.html', controller: 'notificationsController'
   }).
   when('/game', {
      templateUrl: 'views/game.html', controller: 'gameController'
   }).
   when('/gameintro', {
      templateUrl: 'views/game-introduction.html', controller: 'gameintroController'
   }).
   when('/signout', {
      template: '<p></p>', controller: 'signoutController'
   }).     
   otherwise({
	template: '<p></p>'
   });     
}]);
/////////////////////////////////////////////