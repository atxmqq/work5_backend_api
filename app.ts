import express from "express";
import { router as movie } from "./api/movie"
import { router as person } from "./api/person"
import { router as stars } from "./api/stars"
import { router as creators } from "./api/creators"
import { router as alldatamovie } from "./api/searchmovie"
import cors from "cors";



export const app = express();

app.use(
    cors({ //api ที่สร้างอนุญาติให้เว็บนี้เข้ามาเรียกเท่านั้น
        origin: "*",
    })
);

app.use("/movie", movie);

app.use("/person", person);

app.use("/stars", stars);

app.use("/creators", creators);

app.use("/alldatamovie", alldatamovie);