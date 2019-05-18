//introduces 'dialog' binding to ko to facilitate launching and communicating with jqueryui dialogs
//http://jsfiddle.net/YmQTW/1/

//usage: <div id="dialog" data-bind="dialog: {'autoOpen': false, 'title': mytitle }, dialogVisible: isOpen">

ko.bindingHandlers.dialog = {
        init: function(element, valueAccessor, allBindingsAccessor) {
            var options = ko.utils.unwrapObservable(valueAccessor()) || {};
            //do in a setTimeout, so the applyBindings doesn't bind twice from element being copied and moved to bottom
            setTimeout(function() { 
                options.close = function() {
                    allBindingsAccessor().dialogVisible(false);                        
                };
                
                $(element).dialog(ko.toJS(options));          
            }, 0);
            
            //handle disposal (not strictly necessary in this scenario)
             ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                 $(element).dialog("destroy");
             });   
        },
        update: function(element, valueAccessor, allBindingsAccessor) {
            var shouldBeOpen = ko.utils.unwrapObservable(allBindingsAccessor().dialogVisible),
                $el = $(element),
                dialog = $el.data("uiDialog") || $el.data("dialog"),
                options = valueAccessor();
            
            //don't call dialog methods before initilization
            if (dialog) {
                $el.dialog(shouldBeOpen ? "open" : "close");
                
                for (var key in options) {
                    if (ko.isObservable(options[key])) {
                        $el.dialog("option", key, options[key]());
                    }
                }
            }
        }
};