angular.module('authService',[])

.factory('Auth', function($http, $q, AuthToken){  //method to call API from the server, $q is the promise object, Authtoken will be created later on

	var authFactory = {};

	authFactory.login = function(username, password){
		return $http.post('/api/login', {     //this is how you fetch data from the server

			username: username,
			password: password

		})
		.success(function(data){           //this is promise function same as call back function
			AuthToken.setToken(data.token);
			return data;
		})
	}

	authFactory.logout = function(){
		AuthToken.setToken();     //clear token
	}

	authFactory.isLoggedIn = function(){
		if(AuthToken.getToken())
			return true;
		else 
			return false;
	}

	authFactory.getUser = function(){
		if(AuthToken.getToken())
			return $http.get('/api/me');
		else
			return $q.reject({message: "user has no token"});
	}

	return authFactory;

})   //chaining so no ';'

.factory('AuthToken', function($window){  //this will get the token from the borwser 

	var authTokenFactory = {};    

	authTokenFactory.getToken = function(){
		return $window.localStorage.getItem('token');
	}

	authTokenFactory.setToken = function(token){
		if(token)
			$window.localStorage.setItem('token', token);
		else
			$window.localStorage.removeItem('token');
	}

	return authTokenFactory;

})

//interceptor - to check every request whether there is a token or not

.factory('AuthInterceptor', function($q, $location, AuthToken){
	var interceptorFactory = {};

	interceptorFactory.request = function(config){
		var token = AuthToken.getToken();
		if(token){
			config.headers['x-access-token'] = token;
		}

		return config;
	};
	//if user doesn't have token and tries to go to a page with requires a login

	interceptorFactory.responseError = function(response){
		if(response.status == 403)
			location.path('/login');

		return $q.reject(response); //if no token this will redirect you to the login page
	}

	return interceptorFactory;

});


