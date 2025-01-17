const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Şubeleri getiren rota
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

// Ödemeleri getiren rota
router.get('/odemeler', (req, res) => {
    const { sube_ad } = req.query;

    const query = `
        SELECT DISTINCT o.ogrenci_id, o.ogrenci_ad, o.ogrenci_soyad, od.odeme_miktari, od.odeme_durumu, od.odeme_tarihi
        FROM odemeler AS od
        JOIN ogrenci AS o ON od.ogrenci_id = o.ogrenci_id
        JOIN sube AS s ON s.ogrenci_id = o.ogrenci_id
        WHERE s.sube_ad = ? 
        AND YEAR(od.odeme_tarihi) = YEAR(CURDATE())  -- Bu yıl
        AND MONTH(od.odeme_tarihi) = MONTH(CURDATE())  -- Bu ay
    `;

    db.query(query, [sube_ad], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Veritabanı hatası!' });
        } else {
            // Tarih formatını sadece 'YYYY-MM-DD' olarak al
            results = results.map(item => {
                item.odeme_tarihi = item.odeme_tarihi.toISOString().split('T')[0];
                return item;
            });
            res.json(results);  // Ödeme bilgilerini döndürüyoruz
        }
    });
});

// Ödeme durumu güncelleyen rota
router.post('/odeme-durumu-guncelle', (req, res) => {
    const { ogrenci_id, odeme_durumu } = req.body;

    const query = `
        UPDATE odemeler 
        SET odeme_durumu = ? 
        WHERE ogrenci_id = ? 
        AND YEAR(odeme_tarihi) = YEAR(CURDATE()) 
        AND MONTH(odeme_tarihi) = MONTH(CURDATE())
        AND odeme_durumu = 0  -- Sadece "Ödenmedi" durumundakileri güncelle
    `;

    db.query(query, [odeme_durumu, ogrenci_id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Veritabanı hatası!' });
        } else {
            res.json({ message: 'Ödeme durumu güncellendi!' });
        }
    });
});

// Ödeme durumu güncelleyen rota (İptal Et)
router.post('/odeme-durumu-iptal', (req, res) => {
    const { ogrenci_id, odeme_durumu } = req.body;

    const query = `
        UPDATE odemeler 
        SET odeme_durumu = ? 
        WHERE ogrenci_id = ? 
        AND YEAR(odeme_tarihi) = YEAR(CURDATE()) 
        AND MONTH(odeme_tarihi) = MONTH(CURDATE())
        AND odeme_durumu = 1  -- "Ödendi" durumundakileri güncelliyoruz
    `;

    db.query(query, [odeme_durumu, ogrenci_id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Veritabanı hatası!' });
        } else {
            res.json({ message: 'Ödeme durumu iptal edildi!' });
        }
    });
});


module.exports = router;
