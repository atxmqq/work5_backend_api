import express from "express";
import { conn } from "../dbconnect";


export const router = express.Router();
router.use(express.json());

router.post("/insert/:movid/:perid", (req, res) => {
    const movieId = req.params.movid;
    const personId = req.params.perid;


    // ตรวจสอบว่าหนังที่เลือกมามีอยู่ในฐานข้อมูลหรือไม่
    let checkMovieSql = "SELECT * FROM `movie` WHERE `mid` = ?";
    conn.query(checkMovieSql, [movieId], (err, result) => {
        if (err) {
            throw err;
        }

        // ถ้าไม่พบหนัง
        if (result.length === 0) {
            return res.status(404).json({ success: false, message: 'Movie not found' });
        }

        let checkPersonSql = "SELECT * FROM `person` WHERE `pid` = ?";
        conn.query(checkPersonSql, [personId], (err, result) => {
            if (err) {
                throw err;
            }

            // ถ้าไม่พบคน
            if (result.length === 0) {
                return res.status(404).json({ success: false, message: 'Person not found' });
            }


            const starsdata = {
                mid_cre_fk: movieId,
                pid_cre_fk: personId
            };

            const insertStars = 'INSERT INTO `creators`(`mid_cre_fk`, `pid_cre_fk`) VALUES (?, ?)';
            conn.query(
                insertStars,
                [starsdata.mid_cre_fk, starsdata.pid_cre_fk],
                (error, result) => {
                    if (error) {
                        return res.status(500).json({ error: 'Error inserting Person' });
                    }
                    res.status(201).json({ success: true, message: 'Insert Star(Person) Successful' });
                }
            );

        });
    });
});


router.delete("/delete/:movid/:perid", (req, res) => {
    const movieId = req.params.movid;
    const personId = req.params.perid;


    // ตรวจสอบว่าหนังที่เลือกมามีอยู่ในฐานข้อมูลหรือไม่
    let checkMovieSql = "SELECT * FROM `movie` WHERE `mid` = ?";
    conn.query(checkMovieSql, [movieId], (err, result) => {
        if (err) {
            throw err;
        }

        // ถ้าไม่พบหนัง
        if (result.length === 0) {
            return res.status(404).json({ success: false, message: 'Movie not found' });
        }



        let checkPersonSql = "SELECT * FROM `person` WHERE `pid` = ?";
        conn.query(checkPersonSql, [personId], (err, result) => {
            if (err) {
                throw err;
            }

            // ถ้าไม่พบคน
            if (result.length === 0) {
                return res.status(404).json({ success: false, message: 'Person not found' });
            }

            const deleteStars = 'DELETE FROM `creators` WHERE mid_cre_fk = ? AND pid_cre_fk =?';
            conn.query(deleteStars, [movieId, personId], (err, result) => {
                if (err) {
                    throw err;
                }

                res.status(200).json({ success: true, message: 'Delete Star(Person) Successful' });
            });

        });
    });
});
