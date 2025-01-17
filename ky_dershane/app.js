// Gerekli paketleri dahil et
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session'); 
const db = require('./config/db'); 

// Uygulamayı başlat
const app = express();
const ogrenciRoutes = require('./routes/ogrenci');
const ogretmenRoutes = require('./routes/ogretmen');
const etutTalepRoutes = require('./routes/etutTalepRoutes');
const odemelerRoutes = require('./routes/odemelerRoutes');
const etutlerRoutes = require('./routes/etutlerRoutes');
const yoneticiEkraniRoutes = require('./routes/yonetici-ekrani-routes');
const eklemeRoutes = require('./routes/eklemeRoutes');

// Session ayarları
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Giriş sayfası
app.post('/ogretmen-giris', (req, res) => {
    const { hoca_id } = req.body; 
    req.session.hoca_id = hoca_id; 
    res.redirect('/ogretmen-ekrani');
});


// Middleware'ler
app.use(express.static('public')); // Statik dosyalar için (CSS, JS, Images)

app.use('/ogrenci', ogrenciRoutes);
app.use('/ogrenci', etutTalepRoutes);
app.use('/ogrenci', odemelerRoutes);

app.use('/ogretmen', ogretmenRoutes);
app.use('/ogretmen', etutlerRoutes);

app.use('/yonetici', yoneticiEkraniRoutes);
app.use('/ekleme', eklemeRoutes); 

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
    res.sendFile(__dirname + '/public/pages/odeme-takip.html');
});

app.get('/ogretmen-giris', (req, res) => {
    res.sendFile(__dirname + '/public/pages/ogretmen-giris.html');
});

// ogretmen ekranı rotası
app.get('/ogretmen-ekrani', (req, res) => {
    res.sendFile(__dirname + '/public/pages/ogretmen-ekrani.html');
});

app.get('/etutler', (req, res) => {
    res.sendFile(__dirname + '/public/pages/etutler.html');
});

// Yönetici Giriş Sayfası
app.get('/yonetici-giris', (req, res) => {
    res.sendFile(__dirname + '/public/pages/yonetici-giris.html');
});

// Yönetici Ekranı
app.get('/yonetici-ekrani', (req, res) => {
    res.sendFile(__dirname + '/public/pages/yonetici-ekrani.html');
});

app.get('/ekleme', (req, res) => {
    res.sendFile(__dirname + '/public/pages/ekleme.html');
});

// Sunucuyu başlat
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});