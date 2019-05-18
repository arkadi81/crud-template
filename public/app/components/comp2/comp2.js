define(['jquery','knockout', 'text!../comp2/comp2.html','postbox','knockout-jqueryui/dialog'], function($,ko, template) { // insert [], if preloading other stuff
	// 'text!templ1','knockout_jqueryui/dialog'
	function vm(params) {
		var self = this;
		
		self.ID = ko.observable();
		self.name = ko.observable();

		self.isOpen = ko.observable(false).syncWith("itemDialogOpen");
		self.currentID = ko.observable().syncWith("currentID");

		self.currentID.subscribe(function(newValue) {
			console.log("current ID changed... repopulating...");
			//fetch rest of data from id:
			$.ajax({
				type: "GET",
	            url: "api/user/" + self.currentID(),
	            dataType: "json"
        	}).done(function (result) { 
        		console.log(result);
        		self.name(result.data.name);
        	}).error(function(err) { console.log('user not found: ' + self.CurrentID()) }); 

		});

		self.submitForm = function() {

			//update / patch entry
			$.ajax({
				type: "PATCH",
	            url: "api/user/" + self.currentID(),
	            data: {
	            	name: self.name(),
	            	email: self.name()+'aaa@bbb.com', // just to avoid unique consraint issue right now
	            	password: '123'
	            },
	            dataType: "json"
        	}).done(function (result) { 
        		console.log(result);
        		self.isOpen(false);
        		ko.postbox.publish("doRefresh", Date.now());
        		

        	}).error(function(err) { 
        		console.log('not able to update user: ' + self.currentID());
        		console.log(err);
        	})
        }

		self.resetForm = function () {
			$.ajax({
				type: "GET",
	            url: "api/user/" + self.currentID(),
	            dataType: "json"
        	}).done(function (result) { 
        		console.log(result);
        		self.name(result.data.name);
        	}).error(function(err) { console.log('user not found: ' + self.CurrentID) }); 
		}

		self.removeItem = function() {
			$.ajax({
				type: "DELETE",
	            url: "api/user/" + self.currentID(),
	            dataType: "json"
        	}).done(function (result) {
        		self.isOpen(false); 
        		console.log(result);
        		ko.postbox.publish("doRefresh", Date.now());
        	}).error(function(err) { console.log('couldnt delete user: ' + self.CurrentID) }); 
		}

		self.closeDialog = function() {
			self.isOpen(false);
			//refresh main

		}

		console.log("component2 vm fired");

		// when instantiated, get info from server re active stuff
		return self;
	}

	 return { viewModel: vm, template: template }; 
	// return comp1vm;
});

