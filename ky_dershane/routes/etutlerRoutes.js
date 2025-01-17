const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Etüt taleplerini almak için
router.get('/etutler', (req, res) => {
    const hocaId = req.session.hoca_id;

    if (!hocaId) {
        return res.status(401).send('Giriş yapmalısınız');
    }

    const query = `
        SELECT 
            etut_talep.etut_id, 
            ogrenci.ogrenci_ad, 
            ogrenci.ogrenci_soyad, 
            etut_talep.etut_talep_tarihi, 
            etut_talep.etut_tarihi, 
            etut_talep.durum, 
            etut_talep.aciklama
        FROM etut_talep
        JOIN ogrenci ON etut_talep.ogrenci_id = ogrenci.ogrenci_id
        WHERE etut_talep.hoca_id = ?;
    `;

    db.query(query, [hocaId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Veritabanı hatası');
        }
        res.json(results);
    });
});



// Etüt talebini onayla
router.post('/etutler/onayla/:etut_id', (req, res) => {
    const etut_id = req.params.etut_id;
    const query = 'UPDATE etut_talep SET durum = "Onaylandı" WHERE etut_id = ?';

    db.query(query, [etut_id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Veritabanı hatası');
        }
        res.json({ message: 'Etüt talebi onaylandı' });
    });
});

// Etüt talebini reddet
router.post('/etutler/reddet/:etut_id', (req, res) => {
    const etut_id = req.params.etut_id;
    const query = 'UPDATE etut_talep SET durum = "Reddedildi" WHERE etut_id = ?';

    db.query(query, [etut_id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Veritabanı hatası');
        }
        res.json({ message: 'Etüt talebi reddedildi' });
    });
});


module.exports = router;
