define(['jquery','knockout', 'text!../comp1/comp1.html','postbox','datatables'], function($,ko, template1) { // insert [], if preloading other stuff
	// this is the 'main' component that displays all rows
	function comp1vm(params) {

		var base_url = "api/";
		var self = this;

		self.doRefresh = ko.observable().syncWith("doRefresh"); // used to trigger refresh of main table
		self.doRefresh.subscribe(function(newValue) {
			self.refresh();
		})
		self.currentID = ko.observable().syncWith("currentID");
		self.itemDialogOpen = ko.observable(false).syncWith("itemDialogOpen");
		self.newDialogOpen = ko.observable(false).syncWith("newDialogOpen");

		self.itemDialogOpen.subscribe(function(newValue) {
			//refresh when dialog closes
			if (newValue == false) {
				console.log("comp1 detected item dialog close - refreshing full list...");
				self.refresh();
			}
		})

		// self.items = ko.observableArray([
		// 	{ "id": 1, name: "Johnny"},
		// 	{ "id": 2, name: "Vanessa"},
		// 	{ "id": 3, name: "Nancy"}
		// ]);

		self.items = ko.observableArray([]);

		self.refresh = function() {
			// refresh list from server
			$.ajax({
				type: "GET",
	            url: base_url + "users",
	            dataType: "json"
        	}).done(function (result) { 
        		console.log(result);
        		self.items(result.data);
        	}) 
        }

		self.openItem = function() {
			// open selected item in edit/detail view dialog
			console.log("comp1: openItem fired... ID for current item: " + this.ID);
			self.currentID(this.ID);
			// self.itemDialogOpen(true); // this wont work - needs to be broadcast to be caught by comp 2
			ko.postbox.publish("itemDialogOpen", true);
			
		}

		self.removeItem = function(id) {
			// remove selected item
		}

		self.addItem = function() {
			// open new form to add another item
			console.log("addItem fired...");
			ko.postbox.publish("newDialogOpen", true);
		}

		self.enableDataTable = function() {
			$('#datatable').DataTable();
		}


		console.log("component1 vm fired");
		self.refresh();

		// self.enableDataTable(); // this is a hack!
		

		return self;
	}

	// ko.bindingHandlers.dataTablesForEach = {
	// 	page: 0,
	// 	init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
	// 		var binding = ko.utils.unwrapObservable(valueAccessor());

	// 		ko.unwrap(binding.data);
			
	// 		if (binding.options.paging) {
	// 			binding.data.subscribe(function(changes) {
	// 				var table = $(element).closest('table').DataTable();
	// 				ko.bindingHandlers.dataTablesForEach.page = table.page();
	// 				table.destroy();
	// 			}, null, 'arrayChange');
	// 		}

	// 		var nodes = Array.prototype.slice.call(element.childNodes, 0);
	// 		ko.utils.arrayForEach(nodes, function(node) {
	// 			if (node && node.nodeType !== 1) {
	// 				node.parentNode.removeChild(node);
	// 			}
	// 		});

	// 		return ko.bindingHandlers.foreach.init(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
	// 	},
	// 	update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
	// 		var binding = ko.utils.unwrapObservable(valueAccessor()),
	// 			key = 'DataTablesForEach_Initialized';

	// 		ko.unwrap(binding.data);
			
	// 		var table;
	// 		if (!binding.options.paging) {
	// 			table = $(element).closest('table').DataTable();
	// 			table.destroy();
	// 		}

	// 		ko.bindingHandlers.foreach.update(element, valueAccessor, allBindings, viewModel, bindingContext);

	// 		table = $(element).closest('table').DataTable(binding.options);

	// 		if (binding.options.paging) {
	// 			if (table.page.info().pages - ko.bindingHandlers.dataTablesForEach.page === 0) {
	// 				table.page(--ko.bindingHandlers.dataTablesForEach.page).draw(false);
	// 			} else {
	// 				table.page(ko.bindingHandlers.dataTablesForEach.page).draw(false);
	// 			}
	// 		}

	// 		if (!ko.utils.domData.get(element, key) && (binding.data || binding.length)) {
	// 			ko.utils.domData.set(element, key, true);
	// 		}

	// 		return {
	// 			controlsDescendantBindings: true
	// 		};
	// 	}
	// };

	$(document).ready(function() {
    	// $('#datatable').DataTable({
    	// 	responsive: true
    	// });
	}); // grants datatable functionality... could be better without direct reference of dom? does work though

	 return { viewModel: comp1vm, template: template1 }; 
	// return comp1vm;

});