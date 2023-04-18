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
  movie(director_id,movie_name,lead_actor)
  VALUES
  (${directorId},${movieName},${leadActor})`;
  const addMovieDB = await db.run(addMovieQuery);
  response.send("Movie Successfully Added");
});
