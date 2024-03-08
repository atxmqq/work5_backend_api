import express from "express";
import { router as movie } from "./api/movie"
import { router as person } from "./api/person"
import { router as stars } from "./api/stars"
import { router as creators } from "./api/creators"
import { router as alldatamovie } from "./api/searchmovie"



export const app = express();


app.use("/movie", movie);

app.use("/person", person);

app.use("/stars", stars);

app.use("/creators", creators);

app.use("/alldatamovie", alldatamovie);