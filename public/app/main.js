/*global require*/
require.config({
    baseUrl: './',
    paths: {
        'jquery': 'lib/jquery/jquery-1.11.1.min',
        'jquery-ui': 'lib/jquery-ui/ui',
        'knockout': 'lib/knockout/knockout-3.5.0',
        'knockout-jqueryui': 'lib/knockout-jqueryui',

        'postbox': 'lib/knockout-postbox/knockout-postbox',
        // 'datatables': 'lib/dataTables/datatables',
        'datatables': 'lib/dataTables/DataTables-1.10.18/js/jquery.dataTables', // this is the correct amdfied plugin
        'knockout-datatable': 'lib/knockout-datatable/knockout-datatable',
        'dataTablesForEach': 'lib/dataTablesForEach/dataTablesForEach',

        'dataTables': 'https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min',

        'bootstrap4': 'https://cdn.datatables.net/1.10.19/js/dataTables.bootstrap4.min',
        'text': 'lib/requirejs-text/text'
    },
    shim: {
      dataTables: {
        deps: ['jquery']
      },
      dataTables_buttons: {
        deps: ['dataTables']
      },
      // https://github.com/gvas/knockout-jqueryui/issues/2
      // jquery_ui: {
      //   deps: ['jquery'],
      //   exports: '$.ui'}
      // knockout_jqueryui: {
      //   deps: ['jquery', 'jquery_ui', 'knockout'],
      //   exports: 'kojqui'
      //   }
    },
    map: {
      '*': {
        'datatables.net': 'dataTables',
        'datatables.net-buttons': 'dataTables_buttons'
      }
    }
});

require(

    [
        'knockout',
        'app/viewModel'
    ],

    function (ko, ViewModel) {

        'use strict';

        ko.components.register('comp1', {
            viewModel: { require: 'app/components/comp1/comp1' },
            template: { require: 'text!app/components/comp1/comp1.html'}
            // require: 'app/components/comp1/comp1'
        });

        ko.components.register('comp2', {
            // viewModel: { require: 'components/comp1/comp1' },
            // template: { require: 'text!components/comp1/comp1.html'}
            require: 'app/components/comp2/comp2'
        });

        ko.components.register('comp3', {
            // viewModel: { require: 'components/comp1/comp1' },
            // template: { require: 'text!components/comp1/comp1.html'}
            require: 'app/components/comp3/comp3'
        });

        //from https://codepen.io/ricardobrandao/pen/MKaYgY?editors=1111

        ko.bindingHandlers.dataTablesForEach = {
          page: 0,
          init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var binding = ko.utils.unwrapObservable(valueAccessor());

            ko.unwrap(binding.data);
            
            if (binding.options.paging) {
              binding.data.subscribe(function(changes) {
                var table = $(element).closest('table').DataTable();
                ko.bindingHandlers.dataTablesForEach.page = table.page();
                table.destroy();
              }, null, 'arrayChange');
            }

            var nodes = Array.prototype.slice.call(element.childNodes, 0);
            ko.utils.arrayForEach(nodes, function(node) {
              if (node && node.nodeType !== 1) {
                node.parentNode.removeChild(node);
              }
            });

            return ko.bindingHandlers.foreach.init(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
          },
          update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var binding = ko.utils.unwrapObservable(valueAccessor()),
              key = 'DataTablesForEach_Initialized';

            ko.unwrap(binding.data);
            
            var table;
            if (!binding.options.paging) {
              table = $(element).closest('table').DataTable();
              table.destroy();
            }

            ko.bindingHandlers.foreach.update(element, valueAccessor, allBindings, viewModel, bindingContext);

            table = $(element).closest('table').DataTable(binding.options);

            if (binding.options.paging) {
              if (table.page.info().pages - ko.bindingHandlers.dataTablesForEach.page === 0) {
                table.page(--ko.bindingHandlers.dataTablesForEach.page).draw(false);
              } else {
                table.page(ko.bindingHandlers.dataTablesForEach.page).draw(false);
              }
            }

            if (!ko.utils.domData.get(element, key) && (binding.data || binding.length)) {
              ko.utils.domData.set(element, key, true);
            }

            return {
              controlsDescendantBindings: true
            };
          }
        };


        ko.applyBindings(new ViewModel(), document.getElementById('container'));
    }
);
