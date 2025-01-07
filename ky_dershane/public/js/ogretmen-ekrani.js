// Sayfa yüklendiğinde şubeleri çek
window.onload = function() {
    getSubeler();
};

// Şubeleri getir
function getSubeler() {
    fetch('/ogretmen/subeler')
        .then(response => response.json())
        .then(data => {
            const subeSec = document.getElementById('sube-sec');
            data.forEach(sube => {
                const option = document.createElement('option');
                option.value = sube.sube_ad;
                option.textContent = sube.sube_ad;
                subeSec.appendChild(option);
            });
        });
}

// Deneme sınavlarını getir
function getDenemeler() {
    const subeAd = document.getElementById('sube-sec').value;

    if (!subeAd) return;

    fetch(`/ogretmen/denemeler?sube_ad=${subeAd}`)
        .then(response => response.json())
        .then(data => {
            const denemeSec = document.getElementById('deneme-sec');
            denemeSec.innerHTML = '<option value="">Deneme Seçin</option>';
            data.forEach(deneme => {
                const option = document.createElement('option');
                option.value = deneme.deneme_id;
                option.textContent = deneme.deneme_ad;
                denemeSec.appendChild(option);
            });
        });
}

// Net sonuçlarını getir ve grafikte göster
function getNetSonuclari() {
    const denemeId = document.getElementById('deneme-sec').value;

    if (!denemeId) return;

    fetch(`/ogretmen/net-sonuclari?deneme_id=${denemeId}`)
        .then(response => response.json())
        .then(data => {
            const ctx = document.getElementById('netGrafik').getContext('2d');
            const labels = data.map(item => item.ogrenci_ad);
            const netler = data.map(item => item.net);

            new Chart(ctx, {
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
        });
}
