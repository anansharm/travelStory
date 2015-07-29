angular.module('storyCtrl', ['storyService'])

.controller('storyController', function(Story, socketio){


	var vm = this;

	Story.allStory()
		.success(function(data){

			vm.stories = data;

		});



		vm.createStory = function(){
			vm.message = '';
			Story.create(vm.storyData)
				.success(function(data){
					vm.storyData = ''; //clear up the form once its success and returns 200 from the server

					vm.message = data.message;


				});
				
		};


		socketio.on('story', function(data){
			vm.stories.push(data); 
		})
})

.controller('AllStoriesController', function(stories, socketio){


	var vm = this;
	vm.stories = stories.data;

	socketio.on('story', function(data){
			vm.stories.push(data); 
		});


});