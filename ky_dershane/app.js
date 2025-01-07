// Gerekli paketleri dahil et
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./config/db'); // Veritabanı bağlantısı

// Uygulamayı başlat
const app = express();
const ogrenciRoutes = require('./routes/ogrenci');
const ogretmenRoutes = require('./routes/ogretmen');
const etutTalepRoutes = require('./routes/etutTalepRoutes');
const odemelerRoutes = require('./routes/odemelerRoutes');


// Middleware'ler
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public')); // Statik dosyalar için (CSS, JS, Images)

app.use('/ogrenci', ogrenciRoutes);
app.use('/ogrenci', etutTalepRoutes);
app.use('/ogrenci', odemelerRoutes);


app.use('/ogretmen', ogretmenRoutes);


// Ana rota (Hoş geldiniz mesajı)
app.get('/', (req, res) => {
    res.send('KY Dershane Uygulaması Çalışıyor! 🚀');
});
// Kullanıcı Girişi Sayfası Rotası
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/pages/login.html');
});
// Öğrenci Girişi Sayfası Rotası
app.get('/ogrenci-giris', (req, res) => {
    res.sendFile(__dirname + '/public/pages/ogrenci-giris.html');
});
// Öğrenci ekranı rotası
app.get('/ogrenci-ekrani', (req, res) => {
    res.sendFile(__dirname + '/public/pages/ogrenci-ekrani.html');
});
// Etüt Talep Sayfası
app.get('/etut-talep', (req, res) => {
    res.sendFile(__dirname + '/public/pages/etut-talep.html');
});
app.get('/odeme-takip', (req, res) => {
    res.sendFile(__dirname + '/public/pages/odemeler.html');
});





app.get('/ogretmen-giris', (req, res) => {
    res.sendFile(__dirname + '/public/pages/ogretmen-giris.html');
});
// ogretmen ekranı rotası
app.get('/ogretmen-ekrani', (req, res) => {
    res.sendFile(__dirname + '/public/pages/ogretmen-ekrani.html');
});



// Sunucuyu başlat
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
