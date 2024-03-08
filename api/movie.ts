import express from "express";
import { conn } from "../dbconnect";
import { MovieData } from "../model/moviedata";

export const router = express.Router();

router.use(express.json());

//ดูข้อมูลหนังทุกเรื่อง
router.get("/", (req, res) => {
  conn.query('select * from movie', (err, result, fields) => {
    res.json(result);
  });
});


//เพิ่มข้อมูลหนัง
router.post("/insert", (req, res) => {
  const moviedata: MovieData = req.body;

  const { Title, Year, Rated, Released, Genre, Rating, Poster } = moviedata;

  const sql =
    'INSERT INTO `movie`(`Title`, `Year`, `Rated`, `Released`, `Genre`, `Rating`, `Poster`) VALUES (?, ?, ?, ?, ?, ?, ?)';

  conn.query(
    sql,
    [Title, Year, Rated, Released, Genre, Rating, Poster],
    (error, result) => {
      if (error) {
        return res.status(500).json({ error: 'Error inserting Movie' });
      }
      res.status(201).json({ message: 'Insert Movie Successful' });
    }
  );
});


router.delete("/delete/:movieId", (req, res) => {
  const movieId = req.params.movieId;

  const sql = 'DELETE FROM `movie` WHERE `mid` = ?';

  conn.query(sql, [movieId], (error, result) => {
    if (error) {
      return res.status(500).json({ error: 'Error deleting Movie' });
    }
    res.status(200).json({ message: 'Delete Movie Successful' });
  });
});