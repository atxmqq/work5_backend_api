import express from "express";
import { conn } from "../dbconnect";
import { PersonData } from "../model/persondata";

export const router = express.Router();
router.use(express.json());


router.get("/", (req, res) => {
    conn.query('select * from person', (err, result, fields) => {
        res.json(result);
    });
});


router.post("/insert", (req, res) => {
    const persondata: PersonData = req.body;

    const { Name, Gender, Birth, img } = persondata;

    const sql = 'INSERT INTO `person`(`Name`, `Gender`, `Birth`, `img`) VALUES (?, ?, ?, ?)';

    conn.query(
        sql,
        [Name, Gender, Birth, img],
        (error, result) => {
            if (error) {
                return res.status(500).json({ error: 'Error inserting Person' });
            }
            res.status(201).json({ message: 'Insert Person Successful' });
        }
    );
});


router.delete("/delete/:personId", (req, res) => {
    const personId = req.params.personId;

    const sql = 'DELETE FROM `person` WHERE `pid` = ?';

    conn.query(sql, [personId], (error, result) => {
        if (error) {
            return res.status(500).json({ error: 'Error deleting Person' });
        }
        res.status(200).json({ message: 'Delete Person Successful' });
    });
});