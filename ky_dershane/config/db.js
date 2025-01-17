const mysql = require('mysql2');

// Veritabanı bağlantısı
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',       // Veritabanı kullanıcı adı
    password: '',  // Veritabanı şifresi
    database: 'ky_dershane' // Veritabanı adı
});

// Bağlantıyı kontrol et
db.connect((err) => {
    if (err) {
        console.error('Veritabanı bağlantı hatası:', err);
    } else {
        console.log('Veritabanına başarıyla bağlanıldı!');
    }
});

module.exports = db;
