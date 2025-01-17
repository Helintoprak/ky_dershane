// Öğrenci ekleme formu işlemi
const ogrenciForm = document.getElementById('ogrenci-form');
ogrenciForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const ogrenciAd = document.getElementById('ogrenci-ad').value;
    const ogrenciSoyad = document.getElementById('ogrenci-soyad').value;
    const ogrenciSifre = document.getElementById('ogrenci-sifre').value;

    fetch('/ekleme/ogrenci', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ogrenci_ad: ogrenciAd,
            ogrenci_soyad: ogrenciSoyad,
            ogrenci_sifre: ogrenciSifre
        })
    })
        .then(response => response.text())
        .then(data => {
            alert(data);
            ogrenciForm.reset();
        })
        .catch(error => {
            console.error('Error:', error);
        });
});


// Öğretmen ekleme formu işlemi
const ogretmenForm = document.getElementById('ogretmen-form');

fetch('/ekleme/get-dersler') 
    .then(response => response.json())
    .then(data => {
        const dersSelect = document.getElementById('ogretmen-ders');
        data.forEach(ders => {
            const option = document.createElement('option');
            option.value = ders.ders_id;
            option.textContent = ders.ders_ad;
            dersSelect.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });


ogretmenForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const ogretmenAd = document.getElementById('ogretmen-ad').value;
    const ogretmenSoyad = document.getElementById('ogretmen-soyad').value;
    const ogretmenSifre = document.getElementById('ogretmen-sifre').value;
    const ogretmenDers = document.getElementById('ogretmen-ders').value;

    fetch('/ekleme/ogretmen', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ogretmen_ad: ogretmenAd,
            ogretmen_soyad: ogretmenSoyad,
            ogretmen_sifre: ogretmenSifre,
            ders_id: ogretmenDers 
        })
    })
        .then(response => response.text())
        .then(data => {
            alert(data);
            ogretmenForm.reset(); 
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
