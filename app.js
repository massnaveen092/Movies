const express = require("express");
const {open} = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const databasePath = path.join(__dirname,"moviesData.db")
const app = express();
app.use(express.json());
let database = null

const initializeServer  = async () => {
    try{
        database = await open({
            filename : databasePath,
            driver : sqlite3.Database,
        })
    app.listen(3000, ()=> 
        console.log("Logged On the Localhost http://localhost:3000/")
    )}
    catch(error){
        console.log(`Error At Database ${error.message}`)
        process.exit(1)
    }
    }
initializeServer ()

const convertDbObjectToResponseObject =(obj) => {
    return{
        directorId : obj.director_id,
        movieName : obj.movie_name,
        leadActor : obj.lead_actor,
        movieId :  obj.movie_id,
    }
}
app.get("/movies/",async (request, response) => {
    const movieDetails = `
    SELECT 
        movie_name
    FROM
        movie`
    const movie = await database.all(movieDetails)
    response.send(movie.map((each) => ({
        movieName : eachMovie.movie_name
    }   
    ))
    )

});

app.post("/movies/",async (request,response) => {
    const { directorId,movieName,leadActor} = request.body
    const updateMovies = `
        INSERT INTO 
            movie(director_id,movie_name,lead_actor)
        VALUES
            ('${directorId}','${movieName}','${leadActor}')`
    await database.run(updateMovies)
    response.send("Movie Successfully Added")
})

app.get("/movies/:movieId/",async (request,response) => {
    const {movieId} = request.params
    const getByMovie = `
        SELECT 
        *
        FROM
            movie
        WHERE
            movie_id = '${movieId}'`
    const movie = await database.get(getByMovie)
    response.send(convertDbObjectToResponseObject(movie))
})

app.put("/movies/:movieId/",async (request,response) => {
    const {movieId} = request.params
    const { directorId,movieName,leadActor} = request.body
    const upMovies = `
    UPDATE 
        movie
    SET
        director_id = ${directorId},
        movie_name = ${movieName},
        lead_actor = ${leadActor},
    WHERE
        movie_id = '${movieId}'`
    await database.run(upMovies)
    response.send("Movie Details Updated")

})

app.delete("/movies/:movieId/", async (request,response)=> {
    const {movieId} = request.params
    const deleteMovies = `
    DELETE FROM 
        movie
    WHERE 
        movie_id = '${movieId}'`
    await database.run(deleteMovies)
    response.send("Movie Removed")

})

app.get("/directors/",async (request,response) => {
    const director = `
    SELECT
        *
    FROM 
        director`
    const movie = await database.all(director)
    response.send(movie.map((each) => 
    convertDbObjectToResponseObject(each))
))

app.get("/directors/:directorId/movies/",async (request,response) => {
    const {directorId} = request.params
    const directorMovie = `
    SELECT movie_name
    FROM movie
    WHERE director_id = '${directorId}'`
    const movie =  await database.all(directorMovie)
    response.send(movie.map((each) => ({
        movieName : eachMovie.movie_name
    }))
})
module.exports = app