angular.module('appRoutes', ['ngRoute']) //Dependency of ng route

.config(function($routeProvider, $locationProvider){

	$routeProvider
		.when('/', {
			templateUrl: 'app/view/pages/home.html',
			controller: 'mainController',
			controllerAs: 'main'
		})
		
		.when('/login',{
			templateUrl: 'app/view/pages/login.html'
		})
		.when('/signup', {
			templateUrl: 'app/view/pages/signup.html'
		})
		.when('/allStories', {
			templateUrl: 'app/view/pages/allStories.html',
			controller: 'AllStoriesController',
			controllerAs: 'story',
			resolve: {
				stories: function(Story){
					return Story.allStories();
				}
			}
		})

		$locationProvider.html5Mode(true);
});