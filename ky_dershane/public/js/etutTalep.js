document.addEventListener('DOMContentLoaded', () => {
    const dersSelect = document.getElementById('dersSelect');
    const ogretmenSelect = document.getElementById('ogretmenSelect');
    const etutTalepBtn = document.getElementById('etutTalepBtn');
    const gecmisEtutlerBody = document.getElementById('gecmisEtutlerBody');

    const ogrenciId = localStorage.getItem('ogrenciId'); // Öğrenci ID'si session'dan alınacak

    // Tüm Etütleri Yükle
    fetch(`/ogrenci/tum-etutler/${ogrenciId}`)
        .then(response => response.json())
        .then(data => {
            data.forEach(etut => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${etut.ders_ad}</td>
                    <td>${etut.hoca_ad} ${etut.hoca_soyad}</td>
                    <td>${etut.etut_talep_tarihi}</td>
                    <td>${etut.etut_tarihi}</td>
                    <td>${etut.durum}</td>
                    <td>${etut.aciklama}</td>
                `;
                gecmisEtutlerBody.appendChild(row);
            });
        })
        .catch(error => console.error('Etüt verileri çekilemedi:', error));

    // Dersleri Yükle
    fetch(`/ogrenci/dersler/${ogrenciId}`)
        .then(response => response.json())
        .then(data => {
            data.forEach(ders => {
                const option = document.createElement('option');
                option.value = ders.ders_id;
                option.textContent = ders.ders_ad;
                dersSelect.appendChild(option);
            });
        });

    // Öğretmenleri Yükle
    dersSelect.addEventListener('change', () => {
        const dersId = dersSelect.value;
        fetch(`/ogrenci/ogretmenler/${dersId}`)
            .then(response => response.json())
            .then(data => {
                ogretmenSelect.innerHTML = '<option value="">Öğretmen Seçin</option>';
                data.forEach(ogretmen => {
                    const option = document.createElement('option');
                    option.value = ogretmen.hoca_id;
                    option.textContent = `${ogretmen.hoca_ad} ${ogretmen.hoca_soyad}`;
                    ogretmenSelect.appendChild(option);
                });
            });
    });

    // Etüt Talebi Gönder
    etutTalepBtn.addEventListener('click', () => {
        const hocaId = ogretmenSelect.value;
        const etutTarihi = document.getElementById('etutTarihi').value;
        const etutSaati = document.getElementById('etutSaati').value;

        const etutFullDateTime = `${etutTarihi} ${etutSaati}`;

        const aciklama = prompt('Etüt talebi için açıklama giriniz:');

        fetch('/ogrenci/etut-talep', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ogrenci_id: ogrenciId,
                hoca_id: hocaId,
                etut_tarihi: etutFullDateTime,
                aciklama: aciklama
            })
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                window.location.reload();
            })
            .catch(error => console.error('Etüt talebi hatası:', error));
    });
});
