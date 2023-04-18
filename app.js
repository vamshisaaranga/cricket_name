const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
let db = null;
app.use(express.json());

const dbpath = path.join(__dirname, "moviesData.db");
const InitializingDBServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is Running");
    });
  } catch (e) {
    console.log(`DB ERROR ${e.message}`);
    process.exit(1);
  }
};
InitializingDBServer();

//GET
app.get("/movies/", async (request, response) => {
  const getallmovies = `
    SELECT
    movie_name
    FROM
    movie;
    ORDER BY
    movie_id`;
  const movienameslist = await db.all(getallmovies);
  response.send(movienameslist);
});

//POST
app.post("/movies/", async (request, response) => {
  const addMovieDetails = request.body;
  const { directorId, movieName, leadActor } = addMovieDetails;
  const addMovieQuery = `
  INSERT INTO
  movie (director_id, movie_name, lead_actor)
  VALUES
  (${directorId},'${movieName}','${leadActor}');`;
  const addMovieDB = await db.run(addMovieQuery);
  response.send("Movie Successfully Added");
});

app.get("/movies/:moviesId/", async (request, response) => {
  const { moviesId } = request.params;
  const queryMovie = `
    SELECT
    *
    FROM
    movie
    WHERE
    movie_id = ${moviesId};`;
  const getMovie = await db.get(queryMovie);
  response.send(getMovie);
});

//put
app.put("/movies/:movieId", async (request, response) => {
  const { movieId } = request.params;
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const updateQuery = `
  UPDATE
  movie
  SET
  director_id = ${directorId},
  movie_name = '${movieName}',
  lead_actor = '${leadActor}'
  WHERE
  movie_id = ${movieId};`;
  const updatedMovie = await db.run(updateQuery);
  response.send("Movie Details Updated");
});

//DELETE
app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deleteQuery = `
    DELETE FROM
    movie
    WHERE
    movie_id = ${movieId};`;
  const deleteMovie = await db.run(deleteQuery);
  response.send("Movie Removed");
});

//GET DIRECTORS
app.get("/directors/", async (request, response) => {
  const getDirectorsQuery = `
    SELECT
    *
    FROM
    director
    ORDER BY 
    director_id;`;
  const directorList = await db.all(getDirectorsQuery);
  response.send(directorList);
});

//DIRECTOR MOVIES

app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const directorMovieName = `
  SELECT
  movie_name
  FROM
  movie INNER JOIN director ON movie.director_id = director.director_id
  WHERE
  movie.director_id = ${directorId};`;
  const directormovieList = await db.all(directorMovieName);
  response.send(directormovieList);
});

module.exports = app;
