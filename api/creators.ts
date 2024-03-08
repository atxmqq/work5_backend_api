import express from "express";
import { conn } from "../dbconnect";
import { PersonData } from "../model/persondata";
import mysql from "mysql";

export const router = express.Router();
router.use(express.json());

router.post("/insert/:movid", (req, res) => {
    const persondata: PersonData = req.body;
    const movieId = req.params.movid;

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

        // หากพบหนัง
        const { Name, Gender, Birth, img } = persondata;

        // เพิ่มข้อมูลบุคคลลงในตาราง person
        const insertPerson = 'INSERT INTO `person`(`Name`, `Gender`, `Birth`, `img`) VALUES (?, ?, ?, ?)';
        conn.query(insertPerson, [Name, Gender, Birth, img], (error, personResult) => {
            if (error) {
                return res.status(500).json({ error: 'Error inserting Person' });
            }

            // หา ID ของบุคคลที่เพิ่มเข้าไป
            const personId = personResult.insertId;

            // เพิ่มการเชื่อมโยงระหว่างหนังและนักแสดงในตาราง stars
            let insertStars = 'INSERT INTO `creators`(`mid_cre_fk`, `pid_cre_fk`) VALUES (?, ?)';
            insertStars = mysql.format(insertStars, [movieId, personId]);

            conn.query(insertStars, (err, result) => {
                if (err) {
                    throw err;
                }

                // ส่งข้อมูลกลับไปยังผู้ใช้งาน
                res.status(201).json({ success: true, message: 'Insert Stars(Person) Successful' });
            });
        });
    });
});


router.delete("/insert/:movid/:strid", (req, res) => {
    const movieId = req.params.movid;
    const starsId = req.params.strid;


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

        const deleteStars = 'DELETE FROM `creators` WHERE mid_cre_fk = ? AND pid_cre_fk =?';

        conn.query(deleteStars, [movieId, starsId], (err, result) => {
            if (err) {
                throw err;
            }

            res.status(200).json({ success: true, message: 'Delete Star(Person) Successful' });
        });
    });
});
