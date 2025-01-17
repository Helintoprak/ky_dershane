const express = require('express');
const router = express.Router();
const db = require('../config/db'); 

// Öğrenci ekleme route'u
router.post('/ogrenci', (req, res) => {
    const { ogrenci_ad, ogrenci_soyad, ogrenci_sifre } = req.body;

    const query = `
        INSERT INTO ogrenci (ogrenci_ad, ogrenci_soyad, ogrenci_sifre)
        VALUES (?, ?, ?)
    `;

    db.query(query, [ogrenci_ad, ogrenci_soyad, ogrenci_sifre], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Öğrenci eklenirken hata oluştu!');
        }
        res.send('Öğrenci başarıyla eklendi!');
    });
});

// Dersleri getirme route'u
router.get('/get-dersler', (req, res) => {
    const query = 'SELECT * FROM dersler';  
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Dersler alınırken hata oluştu!');
        }
        res.json(results); 
    });
});


// Öğretmen ekleme route'u
router.post('/ogretmen', (req, res) => {
    const { ogretmen_ad, ogretmen_soyad, ogretmen_sifre, ders_id } = req.body;

    const query = `
        INSERT INTO hocalar (hoca_ad, hoca_soyad, hoca_sifre)
        VALUES (?, ?, ?)
    `;

    db.query(query, [ogretmen_ad, ogretmen_soyad, ogretmen_sifre], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Öğretmen eklenirken hata oluştu!');
        }

        const hoca_id = result.insertId; 
        const dersQuery = `
            INSERT INTO hoca_ders (hoca_id, ders_id)
            VALUES (?, ?)
        `;

        db.query(dersQuery, [hoca_id, ders_id], (err2, result2) => {
            if (err2) {
                console.error(err2);
                return res.status(500).send('Öğretmenin dersi ilişkilendirilirken hata oluştu!');
            }
            res.send('Öğretmen başarıyla eklendi!');
        });
    });
});


module.exports = router;
