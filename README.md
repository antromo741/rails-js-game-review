# rails-js-game-review

Link to the back end https://github.com/antromo741/rails-js-game-review-backend

# About 
Hello, Welcome to the Front end of the Rails/JavaScript game review application.\
In this part of the application you will find all of the Javascript used to update and change the page when viewed in the browser.\
There is a section for Authentication functions, our event listeners, the functions that will make our fetch requests, and a section to use Modal which will allow for a small window to pop up to either login or edit something without ever refreshing the screen.
## Installation
Fork and clone this repository.\
Run database server and local rails server in backend part of the project.

## Getting Started
To get started make sure you have a local server running and a database server connection to the backend as well.\
In the terminal use the command line to run explorer.exe my_index.html to open the correct index in the browser.\
Test_index is not to be used and will not work properly with the finished version of the backend as many things are missing from it.\
It is simply to be used to test small changes and to see how certain functions would work before I put them in my_index.

## Usage
Once the my_index is open in the browser and all the servers are running you will be shown a static page, that updates with javascript.\
To use the game reviews app, first login using the login button to the right, the original login info that has access to the seeded data from the back-end of the app has a,

Username: test@test.com\
and a password: password

You can always signup and create your own data of course.\
After that you will have authentication to make fetch requests and get some data on the screen.\
If you have seeded data from the backend you will see 3 games with reviews already.\
You can now add a new game, give it a review as well as add reviews to the existing games.\
This app includes all the CRUD features with Authentication.\
As long as the user is signed in they will be able to create, read, edit/update and even delete reviews, as well as games.

The navbar will scroll with the user if the page is long enough and also includes a drop down menu for different consoles, as of right now the navbar menu doesn't change the games being displayed, but I am looking to impliment a console attribute to the games and reviews so that the games can belong to certain consoles and will display only if you are looking at the specific console. Like having Super Mario on the switch, or Megaman on the ps4.
