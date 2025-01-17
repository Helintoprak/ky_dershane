// Şubeleri getiren fonksiyon
function getSubeler() {
    fetch('/yonetici/subeler')
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

// Ödemeleri getiren fonksiyon
function getOdemeler() {
    const subeAd = document.getElementById('sube-sec').value;

    if (!subeAd) {
        alert('Lütfen bir şube seçin!');
        return;
    }

    fetch(`/yonetici/odemeler?sube_ad=${subeAd}`)
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('odemeTablosu').getElementsByTagName('tbody')[0];
            tbody.innerHTML = ''; 

            data.forEach(item => {
                const row = tbody.insertRow();
                const cell1 = row.insertCell(0);
                const cell2 = row.insertCell(1);
                const cell3 = row.insertCell(2);
                const cell4 = row.insertCell(3);
                const cell5 = row.insertCell(4); // İşlem butonlarını ekleyeceğiz

                cell1.textContent = `${item.ogrenci_ad} ${item.ogrenci_soyad}`;
                cell2.textContent = item.odeme_miktari;
                cell3.textContent = item.odeme_durumu ? 'Ödendi' : 'Ödenmedi';
                cell4.textContent = item.odeme_tarihi;

                
                const odendiButton = document.createElement('button');
                odendiButton.textContent = item.odeme_durumu ? 'Durum Güncellenemez' : 'Ödendi Yap';
                odendiButton.disabled = item.odeme_durumu; // Eğer ödeme yapılmışsa buton devre dışı
                odendiButton.classList.add('odeme-butonu');
                odendiButton.addEventListener('click', () => odemeDurumuGuncelle(item.ogrenci_id));

                const iptalButton = document.createElement('button');
                iptalButton.textContent = 'İptal Et';
                iptalButton.disabled = !item.odeme_durumu; // Eğer ödeme yapılmamışsa buton devre dışı
                iptalButton.classList.add('odeme-butonu');
                iptalButton.addEventListener('click', () => odemeDurumuIptal(item.ogrenci_id));

                cell5.appendChild(odendiButton);
                cell5.appendChild(iptalButton); 
            });
        })
        .catch(err => {
            console.error('Ödemeler yüklenirken hata oluştu:', err);
            alert('Ödemeler yüklenirken bir hata oluştu!');
        });
}

// Ödeme durumu güncelleme fonksiyonu
function odemeDurumuGuncelle(ogrenci_id) {
    const odeme_durumu = 1; 
    fetch('/yonetici/odeme-durumu-guncelle', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ogrenci_id, odeme_durumu })
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            getOdemeler();
        })
        .catch(err => {
            console.error('Ödeme durumu güncellenirken hata oluştu:', err);
            alert('Ödeme durumu güncellenirken bir hata oluştu!');
        });
}

// Ödeme durumu iptal etme fonksiyonu
function odemeDurumuIptal(ogrenci_id) {
    const odeme_durumu = 0; 
    fetch('/yonetici/odeme-durumu-iptal', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ogrenci_id, odeme_durumu })
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            getOdemeler(); 
        })
        .catch(err => {
            console.error('Ödeme durumu iptal edilirken hata oluştu:', err);
            alert('Ödeme durumu iptal edilirken bir hata oluştu!');
        });
}



// Sayfa yüklendiğinde şubeleri çek
window.onload = function () {
    getSubeler();
};
