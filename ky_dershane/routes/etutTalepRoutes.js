const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 🔵 Öğrencinin aldığı dersleri çek
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

// 🟢 Seçilen derse ait öğretmenleri çek
router.get('/ogretmenler/:dersId', (req, res) => {
    const { dersId } = req.params;

    const query = `
        SELECT h.hoca_id, h.hoca_ad, h.hoca_soyad
        FROM hoca_ders hd
        JOIN hocalar h ON hd.hoca_id = h.hoca_id
        WHERE hd.ders_id = ?
    `;

    db.query(query, [dersId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Veritabanı hatası!' });
        } else {
            res.json(results);
        }
    });
});

// 🟢 Tüm etüt taleplerini getir
router.get('/tum-etutler/:ogrenciId', (req, res) => {
    const { ogrenciId } = req.params;

    const query = `
        SELECT e.etut_id, d.ders_ad, h.hoca_ad, h.hoca_soyad, 
               DATE_FORMAT(e.etut_talep_tarihi, '%Y-%m-%d %H:%i:%s') AS etut_talep_tarihi,
               DATE_FORMAT(e.etut_tarihi, '%Y-%m-%d %H:%i') AS etut_tarihi,
               e.durum, e.aciklama
        FROM etut_talep e
        JOIN hocalar h ON e.hoca_id = h.hoca_id
        JOIN hoca_ders hd ON h.hoca_id = hd.hoca_id
        JOIN dersler d ON hd.ders_id = d.ders_id
        WHERE e.ogrenci_id = ?
        ORDER BY e.etut_tarihi DESC;
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

// 🔴 Yeni etüt talebi gönder
router.post('/etut-talep', (req, res) => {
    const { ogrenci_id, hoca_id, etut_tarihi, aciklama } = req.body;

    const query = `
        INSERT INTO etut_talep (ogrenci_id, hoca_id, etut_talep_tarihi, etut_tarihi, durum, aciklama)
        VALUES (?, ?, NOW(), ?, 'Beklemede', ?)
    `;

    db.query(query, [ogrenci_id, hoca_id, etut_tarihi, aciklama], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Veritabanı hatası!' });
        } else {
            res.json({ message: 'Etüt talebi başarıyla gönderildi!' });
        }
    });
});


module.exports = router;
