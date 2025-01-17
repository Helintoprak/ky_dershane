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
            const ogretmen = results[0];
            req.session.hoca_id = ogretmen.hoca_id; 
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
    const { sube_ad } = req.query;

    const query = `
        SELECT DISTINCT ds.deneme_id, ds.deneme_ad
        FROM deneme_sinavi AS ds
        JOIN deneme_konu_detay AS dkd ON ds.deneme_id = dkd.deneme_id
        JOIN ogrenci AS o ON dkd.ogrenci_id = o.ogrenci_id
        JOIN sube AS s ON s.ogrenci_id = o.ogrenci_id
        WHERE s.sube_ad = ?
    `;

    db.query(query, [sube_ad], (err, results) => {
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

    if (!hocaId) {
        return res.status(401).json({ error: 'Geçerli bir oturum bulunamadı!' });
    }

    const query = `
        SELECT o.ogrenci_ad, COUNT(DISTINCT dkd.soru_numara) AS net 
        FROM deneme_konu_detay AS dkd
        JOIN ogrenci AS o ON dkd.ogrenci_id = o.ogrenci_id
        JOIN sube AS s ON s.ogrenci_id = o.ogrenci_id
        JOIN konular AS k ON dkd.konu_id = k.konu_id
        JOIN dersler AS d ON k.ders_id = d.ders_id
        JOIN hoca_ders AS hd ON hd.ders_id = d.ders_id
        WHERE s.sube_ad = ? AND dkd.deneme_id = ? AND hd.hoca_id = ? AND dkd.dogru_yanlis = 1
        GROUP BY o.ogrenci_ad, d.ders_ad;
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

router.get('/net-sonuclari-tablo', (req, res) => {
    const { sube_ad, deneme_id } = req.query;
    const hocaId = req.session.hoca_id;

    if (!hocaId) {
        return res.status(401).json({ error: 'Geçerli bir oturum bulunamadı!' });
    }

    const query = `
        SELECT k.konu_ad,
               SUM(CASE WHEN dkd.dogru_yanlis = 1 THEN 1 ELSE 0 END) AS toplam_dogru,
               SUM(CASE WHEN dkd.dogru_yanlis = 0 THEN 1 ELSE 0 END) AS toplam_yanlis,
               SUM(CASE WHEN dkd.dogru_yanlis = 1 THEN 1 ELSE 0 END) - 
               (SUM(CASE WHEN dkd.dogru_yanlis = 0 THEN 0.25 ELSE 0 END)) AS toplam_net
        FROM deneme_konu_detay AS dkd
        JOIN konular AS k ON dkd.konu_id = k.konu_id
        JOIN deneme_sinavi AS ds ON dkd.deneme_id = ds.deneme_id
        JOIN dersler AS d ON k.ders_id = d.ders_id
        JOIN hoca_ders AS hd ON hd.ders_id = d.ders_id
        JOIN sube AS s ON s.ogrenci_id = dkd.ogrenci_id
        WHERE s.sube_ad = ? 
        AND ds.deneme_id = ? 
        AND hd.hoca_id = ?
        GROUP BY k.konu_ad;
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