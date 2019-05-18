# CRUD TEMPLATE

a *very* quick and dirty "full stack" CRUD engine, based on 
https://github.com/fraigo/node-express-rest-api-example

## tools and dependencies
* node / express backend + sqlite database
* front end using jquery/jquery-ui/knockout/datatables (to display grid)
* knockout postbox https://github.com/rniemeyer/knockout-postbox is used to facilitate communication between components
* RequireJS for front end module loading (definitely needs some cleanup!)
* costum binding handlers for knockout + datatables from https://codepen.io/ricardobrandao/pen/MKaYgY?editors=1111
* jquery-ui amd allows for custom "dialog" binding for ko, and facilitates the usage of two-way bindings within the dialog boxes

## features 
* back end has end points for all CRUD operations.
* front end functionality is divided into self contained ko components
* separation of concerns between various functions and between JS and DOM is well maintained
* postbox is used to facilitate back and forth communication between the 3 modules


## API
Backend api as follows:
* GET /api/users - retrieves full list
* GET /api/user/:id - retrieves user by id
* PATCH /api/user/:id - updates record by id
* DELETE /api/user/:id - removes user by id
* POST /api/user/ - creates new user (id assigned automatically)

## Todo
* design/css - thing looks terrible, and jquery ui isn't the prettiest thing around
* requireJS and AMD framework could use some work
* refactoring and renaming variables, redesigning database to accomodate a more general need
* testing, task running (prettification, sass, minification, linting etc)

## Usage
* clone
* npm install
* npm run start
* point browser to localhost:8000
