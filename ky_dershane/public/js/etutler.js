// Etüt taleplerini almak için API'yi çağır
window.onload = function () {
    const hocaId = 1;
    fetch(`/ogretmen/etutler?hoca_id=${hocaId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Giriş yapmalısınız');
            }
            return response.json();
        })
        .then(data => {
            const etutTableBody = document.getElementById("etutTableBody");
            data.forEach(etut => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${etut.ogrenci_ad} ${etut.ogrenci_soyad}</td>
                    <td>${new Date(etut.etut_talep_tarihi).toLocaleString()}</td>
                    <td>${new Date(etut.etut_tarihi).toLocaleString()}</td>
                    <td>${etut.durum}</td>
                    <td>${etut.aciklama}</td>
                    <td>
                        <button class="onayla-btn" onclick="onayla(${etut.etut_id})">Onayla</button>
                        <button class="reddet-btn" onclick="reddet(${etut.etut_id})">Reddet</button>
                    </td>
                `;
                etutTableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Etüt talepleri alınırken hata oluştu:", error);
            alert(error.message);
        });
};


// Onayla butonuna tıklandığında etüt talebini onayla
function onayla(etut_id) {
    fetch(`/ogretmen/etutler/onayla/${etut_id}`, {
        method: 'POST',
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById(`durum-${etut_id}`).innerText = "Onaylandı";
        })
        .catch(error => {
            console.error("Onaylama işlemi sırasında hata oluştu:", error);
        });
}

// Reddet butonuna tıklandığında etüt talebini reddet
function reddet(etut_id) {
    fetch(`/ogretmen/etutler/reddet/${etut_id}`, {
        method: 'POST',
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById(`durum-${etut_id}`).innerText = "Reddedildi";
        })
        .catch(error => {
            console.error("Reddetme işlemi sırasında hata oluştu:", error);
        });
}
