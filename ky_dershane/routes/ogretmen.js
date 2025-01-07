const express = require('express');
const router = express.Router();
const db = require('../config/db');


// Öğretmen giriş doğrulama ve bilgilerini çekme
router.post('/ogrt-giris', (req, res) => {
    const { ad, soyad, sifre } = req.body;

    const query = `
        SELECT hoca_id, hoca_ad, hoca_soyad 
        FROM hocalar 
        WHERE TRIM(LOWER(hoca_ad)) = TRIM(LOWER(?)) 
        AND TRIM(LOWER(hoca_soyad)) = TRIM(LOWER(?)) 
        AND hoca_sifre = ?
    `;

    db.query(query, [ad, soyad, sifre], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Veritabanı hatası!' });
        } else if (results.length === 0) {
            res.status(401).json({ error: 'Geçersiz giriş bilgileri!' });
        } else {
            // Öğrenci bilgilerini dizi formatında döndür
            res.json(results);
        }
    });
});

// Şubeleri getir
router.get('/subeler', (req, res) => {
    const query = 'SELECT DISTINCT sube_ad FROM sube';
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Veritabanı hatası!' });
        } else {
            res.json(results);
        }
    });
});

// Deneme sınavlarını getir
router.get('/denemeler', (req, res) => {
    const query = 'SELECT deneme_id, deneme_ad FROM deneme_sinavi';
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Veritabanı hatası!' });
        } else {
            res.json(results);
        }
    });
});

// Net sonuçlarını getir
router.get('/net-sonuclari', (req, res) => {
    const { sube_ad, deneme_id } = req.query;
    const hocaId = req.session.hoca_id;

    const query = `
        SELECT o.ogrenci_ad, SUM(dkd.dogru_yanlis) AS net 
        FROM deneme_konu_detay AS dkd
        JOIN ogrenci AS o ON o.ogrenci_id = dkd.ogrenci_id
        JOIN sube AS s ON s.ogrenci_id = o.ogrenci_id
        JOIN hoca_ders AS hd ON hd.ders_id = dkd.konu_id
        WHERE s.sube_ad = ? AND dkd.deneme_id = ? AND hd.hoca_id = ?
        GROUP BY o.ogrenci_ad
    `;

    db.query(query, [sube_ad, deneme_id, hocaId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Veritabanı hatası!' });
        } else {
            res.json(results);
        }
    });
});

module.exports = router;
