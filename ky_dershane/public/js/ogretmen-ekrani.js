
// Sayfa yüklendiğinde şubeleri ve denemeleri çek
window.onload = function () {
    getSubeler();
};

// Öğretmen ID'sini localStorage'dan al
const hocaId = localStorage.getItem('hocaId');

if (!hocaId) {
    window.location.href = '/ogretmen-giris';
}

console.log('Giriş yapan hoca_id:', hocaId);

// Şubeleri getir
function getSubeler() {
    fetch('/ogretmen/subeler')
        .then(response => response.json())
        .then(data => {
            const subeSec = document.getElementById('sube-sec');
            subeSec.innerHTML = '<option value="">Şube Seçin</option>';
            data.forEach(sube => {
                const option = document.createElement('option');
                option.value = sube.sube_ad;
                option.textContent = sube.sube_ad;
                subeSec.appendChild(option);
            });
        })
        .catch(err => console.error('Şubeler yüklenirken hata oluştu:', err));
}

// Deneme sınavlarını getir
function getDenemeler() {
    const subeAd = document.getElementById('sube-sec').value;

    if (!subeAd) {
        alert('Lütfen bir şube seçin!');
        return;
    }

    fetch(`/ogretmen/denemeler?sube_ad=${subeAd}`)
        .then(response => response.json())
        .then(data => {
            const denemeSec = document.getElementById('deneme-sec');
            denemeSec.innerHTML = '<option value="">Deneme Sınavı Seçin</option>';
            data.forEach(deneme => {
                const option = document.createElement('option');
                option.value = deneme.deneme_id;
                option.textContent = deneme.deneme_ad;
                denemeSec.appendChild(option);
            });
        })
        .catch(err => console.error('Deneme sınavları yüklenirken hata oluştu:', err));
}


function filtreleVeriler() {
    const subeAd = document.getElementById('sube-sec').value;
    const denemeId = document.getElementById('deneme-sec').value;

    if (!subeAd || !denemeId) {
        alert('Lütfen şube ve deneme seçin!');
        return;
    }

    // Canvas üzerinde var olan grafik varsa, önceki grafiği yok et
    if (window.netChart) {
        window.netChart.destroy();
    }

    fetch(`/ogretmen/net-sonuclari?sube_ad=${subeAd}&deneme_id=${denemeId}`)
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    alert('Yetkisiz erişim! Lütfen giriş yapın.');
                }
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('API Yanıtı:', data);

            const ctx = document.getElementById('netGrafik').getContext('2d');
            const labels = data.map(item => item.ogrenci_ad);
            const netler = data.map(item => item.net);

            // Eğer veriler boşsa, grafiği oluşturma
            if (labels.length === 0 || netler.length === 0) {
                alert('Veri bulunamadı!');
                return;
            }

            // Yeni bir grafik oluştur
            window.netChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Net Sonuçları',
                        data: netler,
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        })
        .catch(err => {
            console.error('Net sonuçları yüklenirken hata oluştu:', err);
            alert('Net sonuçları yüklenirken bir hata oluştu!');
        });

    // API'den net sonuçlarını al
    fetch(`/ogretmen/net-sonuclari-tablo?sube_ad=${subeAd}&deneme_id=${denemeId}`)
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('netTablo').getElementsByTagName('tbody')[0];
            tbody.innerHTML = ''; // Önceki veriyi temizle

            data.forEach(item => {
                const row = tbody.insertRow();
                const cell1 = row.insertCell(0);
                const cell2 = row.insertCell(1);
                const cell3 = row.insertCell(2);
                const cell4 = row.insertCell(3);

                cell1.textContent = item.konu_ad;
                cell2.textContent = item.toplam_dogru;
                cell3.textContent = item.toplam_yanlis;

                // Net değeri kontrol et ve sayıya dönüştür
                const toplamNet = parseFloat(item.toplam_net);
                cell4.textContent = isNaN(toplamNet) ? '0' : toplamNet.toFixed(2); // Sayıya dönüştür ve 2 ondalıklı göster
            });
        })
        .catch(err => {
            console.error('Net sonuçları yüklenirken hata oluştu:', err);
            alert('Net sonuçları yüklenirken bir hata oluştu!');
        });
}
