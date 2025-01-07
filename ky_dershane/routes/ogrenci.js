const express = require('express');
const router = express.Router();
const db = require('../config/db');


// Öğrenci giriş doğrulama ve bilgilerini çekme
router.post('/giris', (req, res) => {
    const { ad, soyad, sifre } = req.body;

    const query = `
        SELECT ogrenci_id, ogrenci_ad, ogrenci_soyad 
        FROM ogrenci 
        WHERE TRIM(LOWER(ogrenci_ad)) = TRIM(LOWER(?)) 
        AND TRIM(LOWER(ogrenci_soyad)) = TRIM(LOWER(?)) 
        AND ogrenci_sifre = ?
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


// Öğrenci giriş doğrulama ve netlerini çekme
router.post('/giris1', (req, res) => {
    const { ad, soyad, sifre } = req.body;

    // Öğrencinin netlerini ve genel ortalamayı çeken sorgu
    const query = `
        SELECT d.deneme_ad,
            COUNT(CASE WHEN dkd.dogru_yanlis = 1 THEN 1 END) AS ogrenci_net,
            (SELECT COUNT(CASE WHEN dkd2.dogru_yanlis = 1 THEN 1 END) / COUNT(DISTINCT dkd2.ogrenci_id)
             FROM deneme_konu_detay dkd2
             WHERE dkd2.deneme_id = d.deneme_id) AS genel_ortalama
        FROM ogrenci o
        JOIN deneme_konu_detay dkd ON o.ogrenci_id = dkd.ogrenci_id
        JOIN deneme_sinavi d ON d.deneme_id = dkd.deneme_id
        WHERE TRIM(LOWER(o.ogrenci_ad)) = TRIM(LOWER(?))
        AND TRIM(LOWER(o.ogrenci_soyad)) = TRIM(LOWER(?))
        AND o.ogrenci_sifre = ?
        GROUP BY d.deneme_id;
    `;

    db.query(query, [ad, soyad, sifre], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Veritabanı hatası!' });
        } else if (results.length === 0) {
            res.status(401).json({ error: 'Geçersiz giriş bilgileri!' });
        } else {
            res.json(results);
        }
    });
});
// 🔵 Deneme adlarını çekme
router.get('/denemeler', (req, res) => {
    const query = `SELECT deneme_id, deneme_ad FROM deneme_sinavi`;

    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Veritabanı hatası!' });
        } else {
            res.json(results);
        }
    });
});

// 🔴 Seçilen deneme için ders bazlı netler
router.post('/ders-bazli-netler', (req, res) => {
    const { deneme_id, ogrenci_id } = req.body;

    const query = `
        SELECT d.ders_ad,
               COUNT(CASE WHEN dkd.dogru_yanlis = 1 THEN 1 END) AS ogrenci_net,
               (SELECT COUNT(CASE WHEN dkd2.dogru_yanlis = 1 THEN 1 END) / COUNT(DISTINCT dkd2.ogrenci_id)
                FROM deneme_konu_detay dkd2
                JOIN konular k2 ON dkd2.konu_id = k2.konu_id
                WHERE k2.ders_id = d.ders_id AND dkd2.deneme_id = ?) AS genel_ortalama
        FROM deneme_konu_detay dkd
        JOIN konular k ON dkd.konu_id = k.konu_id
        JOIN dersler d ON k.ders_id = d.ders_id
        WHERE dkd.deneme_id = ? AND dkd.ogrenci_id = ?
        GROUP BY d.ders_ad;
    `;

    db.query(query, [deneme_id, deneme_id, ogrenci_id], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Veritabanı hatası!' });
        } else {
            res.json(results);
        }
    });
});
// 🔵 Öğrencinin aldığı dersleri çekme
router.get('/dersler/:ogrenciId', (req, res) => {
    const { ogrenciId } = req.params;

    const query = `
        SELECT d.ders_id, d.ders_ad
        FROM ogrenci_dersler od
        JOIN dersler d ON od.ders_id = d.ders_id
        WHERE od.ogrenci_id = ?
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
// 🔴 Seçilen ders için çizgi grafiği verilerini çek
router.post('/ders-cizgi-netler', (req, res) => {
    const { ders_id, ogrenci_id } = req.body;

    const query = `
        SELECT d.deneme_ad, COUNT(CASE WHEN dkd.dogru_yanlis = 1 THEN 1 END) AS net
        FROM deneme_konu_detay dkd
        JOIN deneme_sinavi d ON d.deneme_id = dkd.deneme_id
        WHERE dkd.konu_id IN (
            SELECT konu_id FROM konular WHERE ders_id = ?
        ) AND dkd.ogrenci_id = ?
        GROUP BY d.deneme_id;
    `;

    db.query(query, [ders_id, ogrenci_id], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Veritabanı hatası!' });
        } else {
            res.json(results);
        }
    });
});

// Seçilen ders için doğru-yanlış verilerini çek
router.post('/ders-dogru-yanlis', (req, res) => {
    const { ders_id, ogrenci_id } = req.body;

    const query = `
        SELECT k.konu_ad,
               SUM(CASE WHEN dkd.dogru_yanlis = 1 THEN 1 ELSE 0 END) AS dogru,
               SUM(CASE WHEN dkd.dogru_yanlis = 0 THEN 1 ELSE 0 END) AS yanlis
        FROM deneme_konu_detay dkd
        JOIN konular k ON dkd.konu_id = k.konu_id
        WHERE k.ders_id = ? AND dkd.ogrenci_id = ?
        GROUP BY k.konu_ad;
    `;

    db.query(query, [ders_id, ogrenci_id], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Veritabanı hatası!' });
        } else {
            res.json(results);
        }
    });
});


module.exports = router;
