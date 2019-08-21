
## Motivations

* Get visual feedback from chess.com data in order to improve at chess.
* Having a fun and efficient way to improve calculation/visualization.
* Learn React.
* Improve/explore javascript and functional programming.

## Features

* Import games from chess.com api.
* Create different kind of charts in order to visualize different metrics gather from chess.com games.
* Exercices: look at a position, hide the pieces then try to reproduce the position.

## Stack

The application uses Node.js for the api, MongoDB for the database and react for the frontend. It get deployed to https://agile-ravine-64606.herokuapp.com through Travis CI. It runs under version 10.16.0 of Node. For developement, a docker-compose file is available so it can run on any machine.

The project at https://github.com/DesignRevision/shards-dashboard-react have been use as an admin react dashboard template.

## Local Environment Infrastructure

In order to work properly the app rely on two docker conatiners.

* `api` which is build from node:10.16.0-alpine image and run on port 3001.
* `mongo` using bitnami/mongodb:4.1 image.

In addition to the required docker services the docker-compose file spin
up a mongo-express container which provide a UI to visualize the data stored in MongoDB. It is accessible on port 8081.

The React app is not part of the docker composition and must be run separatly.

## Instalation
 
Make sure Docker is installed on your machine.

Make a copy of `.env.example` and rename it to `.env`

Run the following comands to build and run the containers.

```docker-compose build```

```docker-compose up```

Serve React application

```npm --prefix web start```


You can access the app at http://localhost:3000


## TODO

* Features
    * Exercices
        * Visualization, show/hide position then find mate in N.
        * Visualization , show/hide position then find all legal move for a given piece.
        * Visualization , find square color for given coordinates
    * Dashboard
        * Add bar and data table charts types.
        * Support filter, limit, sort by, date range custom calculations.
        * Allow resize/reorder charts.

* Code
    * Write tests.
    * Error handling.
    * Action validations.
    * Refactor React code.
    * Try to find cases where higher-order component would be relevant.





