// Global değişkenler (Grafikleri yok etmek için)
let netChart1 = null;
let netChart2 = null;
let netChart3 = null;

document.addEventListener('DOMContentLoaded', () => {
    const ad = localStorage.getItem('ogrenciAd');
    const soyad = localStorage.getItem('ogrenciSoyad');
    const sifre = localStorage.getItem('ogrenciSifre');

    
    if (!ad || !soyad || !sifre) {
        window.location.href = '/login';
        return;
    }

    fetch('/ogrenci/giris', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ad, soyad, sifre })
    })
    .then(response => response.json())
    .then(data => {
        if (data.length === 0) {
            console.error('Geçersiz giriş bilgileri!');
            window.location.href = '/login';
        } else {
            // İlk öğeyi al ve localStorage'a kaydet
            const ogrenci = data[0];
            localStorage.setItem('ogrenciId', ogrenci.ogrenci_id);
            console.log('LocalStorage’a Kaydedilen Öğrenci ID:', ogrenci.ogrenci_id);

            // Deneme netlerini çek ve grafiği oluştur
            fetchDenemeNetleri(ad, soyad, sifre);
        }
    })
    .catch(error => console.error('Veri çekme hatası:', error));

    // 🟢 Deneme adlarını çek ve dropdown'a ekle
    const denemeSelect = document.getElementById('denemeSelect');

    fetch('/ogrenci/denemeler')
        .then(response => response.json())
        .then(data => {
            data.forEach(deneme => {
                const option = document.createElement('option');
                option.value = deneme.deneme_id;
                option.textContent = deneme.deneme_ad;
                denemeSelect.appendChild(option);
            });
        });

    // 🔴 Filtrele butonuna tıklandığında ders bazlı net grafiğini oluştur
    const filtreleBtn = document.getElementById('filtreleBtn');
    filtreleBtn.addEventListener('click', () => {
        const deneme_id = denemeSelect.value;
        const ogrenci_id = localStorage.getItem('ogrenciId');
        fetchDersBazliNetler(deneme_id, ogrenci_id);
    });

    // 🟢 Öğrencinin aldığı dersleri çek
    const dersSelect = document.getElementById('dersSelect');
    const ogrenciId = localStorage.getItem('ogrenciId');

    fetch(`/ogrenci/dersler/${ogrenciId}`)
        .then(response => response.json())
        .then(data => {
            data.forEach(ders => {
                const option = document.createElement('option');
                option.value = ders.ders_id;
                option.textContent = ders.ders_ad;
                dersSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Ders bilgileri çekilemedi:', error));

    // 🔴 Filtrele butonuna tıklandığında çizgi grafiğini oluştur
    const dersFiltreleBtn = document.getElementById('dersFiltreleBtn');
    dersFiltreleBtn.addEventListener('click', () => {
        const dersId = dersSelect.value;
        fetchDersCizgiGrafik(dersId, ogrenciId);
    });

    // Ders seçme ve tabloyu doldurma
    const tabloFiltreleBtn = document.getElementById('tabloFiltreleBtn');
    const dersTableSelect = document.getElementById('dersTableSelect');
    const dogruYanlisTablosu = document.querySelector('dogruYanlisTablosu tbody');

    fetch(`/ogrenci/dersler/${ogrenciId}`)
        .then(response => response.json())
        .then(data => {
            data.forEach(ders => {
                const option = document.createElement('option');
                option.value = ders.ders_id;
                option.textContent = ders.ders_ad;
                dersTableSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Ders bilgileri çekilemedi:', error));

    tabloFiltreleBtn.addEventListener('click', () => {
        const dersId = dersTableSelect.value;
        fetchDogruYanlisTablosu(dersId, ogrenciId);
    });
});

// ✅ Deneme Netleri Grafiği Fonksiyonu
function fetchDenemeNetleri(ad, soyad, sifre) {
    fetch('/ogrenci/giris1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ad, soyad, sifre })
    })
    .then(response => response.json())
    .then(data => {
        const denemeAdlari = data.map(item => item.deneme_ad);
        const ogrenciNetleri = data.map(item => item.ogrenci_net);
        const genelOrtalamalar = data.map(item => item.genel_ortalama);

        if (netChart1) netChart1.destroy();

        const ctx1 = document.getElementById('netChart1').getContext('2d');
        netChart1 = new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: denemeAdlari,
                datasets: [
                    {
                        label: 'Öğrenci Netleri',
                        data: ogrenciNetleri,
                        backgroundColor: 'rgba(0, 123, 255, 0.7)',
                    },
                    {
                        label: 'Genel Ortalamalar',
                        data: genelOrtalamalar,
                        backgroundColor: 'rgba(255, 99, 132, 0.7)',
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    tooltip: {
                        mode: 'nearest',
                        intersect: false,
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    })
    .catch(error => console.error('Veri çekme hatası:', error));
}

// ✅ Ders Bazlı Net Grafiği Fonksiyonu
function fetchDersBazliNetler(deneme_id, ogrenci_id) {
    fetch('/ogrenci/ders-bazli-netler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deneme_id, ogrenci_id })
    })
    .then(response => response.json())
    .then(data => {
        const dersAdlari = data.map(item => item.ders_ad);
        const ogrenciNetleri = data.map(item => item.ogrenci_net);
        const genelOrtalamalar = data.map(item => item.genel_ortalama);

        if (netChart2) netChart2.destroy();

        const ctx2 = document.getElementById('netChart2').getContext('2d');
        netChart2 = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: dersAdlari,
                datasets: [
                    {
                        label: 'Öğrenci Netleri',
                        data: ogrenciNetleri,
                        backgroundColor: 'rgba(0, 123, 255, 0.7)',
                    },
                    {
                        label: 'Genel Ortalamalar',
                        data: genelOrtalamalar,
                        backgroundColor: 'rgba(255, 99, 132, 0.7)',
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        ticks: {
                            autoSkip: false,
                            maxRotation: 45,
                            minRotation: 0
                        }
                    },
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    })
    .catch(error => console.error('Veri çekme hatası:', error));
}

// ✅ Ders Çizgi Grafiği Fonksiyonu
function fetchDersCizgiGrafik(dersId, ogrenciId) {
    fetch('/ogrenci/ders-cizgi-netler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ders_id: dersId, ogrenci_id: ogrenciId })
    })
    .then(response => response.json())
    .then(data => {
        const denemeAdlari = data.map(item => item.deneme_ad);
        const netler = data.map(item => item.net);

        if (netChart3) netChart3.destroy();

        const ctx3 = document.getElementById('netChart3').getContext('2d');
        netChart3 = new Chart(ctx3, {
            type: 'line',
            data: {
                labels: denemeAdlari,
                datasets: [
                    {
                        label: 'Netler',
                        data: netler,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    })
    .catch(error => console.error('Veri çekme hatası:', error));
}
// Ders seçme ve tabloyu doldurma
const tabloFiltreleBtn = document.getElementById('tabloFiltreleBtn');
const dersTableSelect = document.getElementById('dersTableSelect');
const dogruYanlisTabloBody = document.querySelector('#dogruYanlisTablosu tbody');

// 🟢 localStorage üzerinden öğrenci ID'sini al
const ogrenciId = localStorage.getItem('ogrenciId');

// Eğer öğrenci ID'si yoksa hata ver ve login'e yönlendir
if (!ogrenciId) {
    console.error('Öğrenci ID tanımlı değil!');
    window.location.href = '/login';
}

// Öğrencinin aldığı dersleri çek ve dropdown'a ekle
fetch(`/ogrenci/dersler/${ogrenciId}`)
    .then(response => response.json())
    .then(data => {
        data.forEach(ders => {
            const option = document.createElement('option');
            option.value = ders.ders_id;
            option.textContent = ders.ders_ad;
            dersTableSelect.appendChild(option);
        });
    })
    .catch(error => console.error('Ders bilgileri çekilemedi:', error));

// 🔴 Filtrele butonuna tıklandığında doğru-yanlış verilerini çek ve tabloyu güncelle
tabloFiltreleBtn.addEventListener('click', () => {
    const dersId = dersTableSelect.value;

    fetch('/ogrenci/ders-dogru-yanlis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ders_id: dersId, ogrenci_id: ogrenciId })
    })
    .then(response => response.json())
    .then(data => {
        // Tabloyu temizle
        dogruYanlisTabloBody.innerHTML = '';

        // Yeni verileri tabloya ekle
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.konu_ad}</td>
                <td>${item.dogru}</td>
                <td>${item.yanlis}</td>
            `;
            dogruYanlisTabloBody.appendChild(row);
        });
    })
    .catch(error => console.error('Tablo verileri çekilemedi:', error));
});

