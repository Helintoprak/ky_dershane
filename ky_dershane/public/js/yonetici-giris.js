// Formu seçiyoruz
const loginForm = document.getElementById('loginForm');

// Form gönderildiğinde çalışacak fonksiyon
loginForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Formun sayfayı yenilemesini engelliyoruz

    // Kullanıcı adı ve şifreyi alıyoruz
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Yönetici kullanıcı adı ve şifresi
    const validUsername = 'admin';
    const validPassword = '1234';

    // Kullanıcı adı ve şifreyi kontrol ediyoruz
    if (username === validUsername && password === validPassword) {
        // Başarılı girişte yönlendirme yapıyoruz
        window.location.href = '/yonetici-ekrani';
    } else {
        // Başarısız girişte uyarı gösteriyoruz
        alert('Geçersiz kullanıcı adı veya şifre');
    }
});
