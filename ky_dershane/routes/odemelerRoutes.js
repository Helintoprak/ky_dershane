const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 🟢 Öğrencinin ödemelerini çek
router.get('/odemeler/:ogrenciId', (req, res) => {
    const { ogrenciId } = req.params;

    const query = `
        SELECT DATE_FORMAT(odeme_tarihi, '%Y-%m-%d') AS odeme_tarihi, 
               odeme_miktari, 
               odeme_durumu
        FROM odemeler
        WHERE ogrenci_id = ?
        ORDER BY odeme_tarihi DESC;
    `;

    db.query(query, [ogrenciId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Veritabanı hatası!' });
        } else {
            res.json(results);
        }
    });
});

module.exports = router;
