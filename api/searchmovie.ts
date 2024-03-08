import express from "express";
import { conn } from "../dbconnect";
import { AllData } from "../model/alldatamovie";

export const router = express.Router();
router.use(express.json());

router.get("/", (req, res) => {
    const sql = `
        SELECT 
            movie.*,
            GROUP_CONCAT(DISTINCT CONCAT (person.pid, ' ', person.Name, ' ', person.Gender, ' ', person.Birth, ' ', person.img ) SEPARATOR ',') AS actors,
            GROUP_CONCAT(DISTINCT CONCAT (creators_person.pid, ' ', creators_person.Name, ' ', creators_person.Gender, ' ', creators_person.Birth, ' ', creators_person.img) SEPARATOR ',') AS creators
        FROM movie
        LEFT JOIN stars ON movie.mid = stars.mid_str_fk
        LEFT JOIN person ON stars.pid_str_fk = person.pid
        LEFT JOIN creators ON movie.mid = creators.mid_cre_fk
        LEFT JOIN person AS creators_person ON creators.pid_cre_fk = creators_person.pid
        GROUP BY movie.mid;
    `;

    conn.query(sql, (err, result) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        const formattedResult: AllData[] = result.map((row: any) => {
            return {
                movieID: row.mid,
                Title: row.Title,
                Year: row.Year,
                Rated: row.Rated,
                Released: row.Released,
                Genre: row.Genre,
                Rating: row.Rating,
                Poster: row.Poster,
                Stars: row.actors ? row.actors.split(',').map((actor: string) => {
                    const [pid, Name, Gender, Birth, img] = actor.split(' ');
                    return { pid, Name, Gender, Birth, img };
                }) : [],


                Creators: row.creators ? row.creators.split(',').map((creator: string) => {
                    const [pid, Name, Gender, Birth, img] = creator.split(' ');
                    return { pid, Name, Gender, Birth, img };
                }) : []
            };
        });

        res.json(formattedResult);
    });
});


//search
router.get("/search", (req, res) => {
    const searchmovie = req.query.title;

    const sql = `
        SELECT 
            movie.*,
            GROUP_CONCAT(DISTINCT CONCAT (person.pid, ' ', person.Name, ' ', person.Gender, ' ', person.Birth, ' ', person.img ) SEPARATOR ',') AS actors,
            GROUP_CONCAT(DISTINCT CONCAT (creators_person.pid, ' ', creators_person.Name, ' ', creators_person.Gender, ' ', creators_person.Birth, ' ', creators_person.img) SEPARATOR ',') AS creators
        FROM movie
        LEFT JOIN stars ON movie.mid = stars.mid_str_fk
        LEFT JOIN person ON stars.pid_str_fk = person.pid
        LEFT JOIN creators ON movie.mid = creators.mid_cre_fk
        LEFT JOIN person AS creators_person ON creators.pid_cre_fk = creators_person.pid
        WHERE
            movie.Title LIKE ?
        GROUP BY movie.mid;
    `;

    const searchTitle = `%${searchmovie}%`;


    conn.query(sql, [searchTitle], (err, result) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        const formattedResult: AllData[] = result.map((row: any) => {
            return {
                movieID: row.mid,
                Title: row.Title,
                Year: row.Year,
                Rated: row.Rated,
                Released: row.Released,
                Genre: row.Genre,
                Rating: row.Rating,
                Poster: row.Poster,
                Stars: row.actors ? row.actors.split(',').map((actor: string) => {
                    const [pid, Name, Gender, Birth, img] = actor.split(' ');
                    return { pid, Name, Gender, Birth, img };
                }) : [],


                Creators: row.creators ? row.creators.split(',').map((creator: string) => {
                    const [pid, Name, Gender, Birth, img] = creator.split(' ');
                    return { pid, Name, Gender, Birth, img };
                }) : []
            };
        });

        res.json(formattedResult);
    });
});



