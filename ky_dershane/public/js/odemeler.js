document.addEventListener('DOMContentLoaded', () => {
    const odemelerBody = document.getElementById('odemelerBody');
    const ogrenciId = localStorage.getItem('ogrenciId');

    if (!ogrenciId) {
        console.error('Öğrenci ID tanımlı değil!');
        window.location.href = '/ogrenci-giris';
        return;
    }

    // Ödemeleri çek ve tabloyu güncelle
    fetch(`/ogrenci/odemeler/${ogrenciId}`)
        .then(response => response.json())
        .then(data => {
            odemelerBody.innerHTML = '';
            data.forEach(odeme => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${odeme.odeme_tarihi}</td>
                    <td>${odeme.odeme_miktari}</td>
                    <td>${odeme.odeme_durumu === 1 ? 'Ödendi' : 'Beklemede'}</td>
                `;
                odemelerBody.appendChild(row);
            });
        })
        .catch(error => console.error('Ödemeler verileri çekilemedi:', error));
});
