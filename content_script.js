// Pastikan skrip ini hanya berjalan sekali atau bersifat idempoten jika dijalankan berkali-kali.
// Pengecekan asli `if($('#drug2PDF').length == 0)` membantu, tetapi variabel global perlu perhatian.

let configuredPuskesmasName = "PKM Jayengan"; // Nilai default

// Muat nama Puskesmas dari penyimpanan
// Ini bersifat asinkron, jadi getPusk() mungkin dipanggil sebelum ini selesai jika tidak hati-hati.
// Namun, clickLabel dipicu oleh pengguna, yang seharusnya saat itu proses ini sudah selesai.
chrome.storage.local.get(['settings'], function(result) {
    if (result.settings && result.settings.puskesmasName && result.settings.puskesmasName.trim() !== "") {
        configuredPuskesmasName = result.settings.puskesmasName;
        console.log('Nama Puskesmas dimuat:', configuredPuskesmasName);
    } else {
        console.log('Nama Puskesmas tidak ditemukan di pengaturan atau kosong, menggunakan default:', configuredPuskesmasName);
    }
});

if($('#drug2PDF').length == 0 ){ // Periksa apakah iframe untuk PDF sudah ditambahkan
  const clickLabel = () => {
    let al; // Penghitung alert
    let empt; // Penghitung data kosong
  
    // Variabel 'jaminan' ini dideklarasikan di dalam clickLabel, lalu digunakan oleh getPusk.
    // Perlu dapat diakses oleh getPusk. Ini tidak masalah karena getPusk adalah fungsi bersarang.
    let jaminan;

    if($('#sex').val().length){ // Periksa apakah jenis kelamin pasien sudah diisi
      let pasienTglLahir = $('#tgllahir').val();
      let nik = $('#nik').val();
      let pasienUmur = pasienUm(); // Hitung usia pasien

      if (pasienUmur == "error" ){
        if(al == undefined){ // Tampilkan alert hanya sekali
          alert("tanggal lahir salah");
          al = 1; // Tambah penghitung alert
        }
        $('#tgllahir').focus();
      } else {
        let noRM = $('#patient_id').val().toUpperCase();
        let svg = drawBarcode("svg", noRM, { // Asumsikan drawBarcode dari bardcode.min.js
          type: 'Code 128'
        });
        noRM = noRM.substr(0,6); // Ambil 6 karakter pertama untuk tampilan
        let pasienSex = $('#sex').val();
        let pasienJK = $('#jk > option[value="' + pasienSex + '"]').text(); // Dapatkan teks jenis kelamin
  
        let alamat = $('#alamat').val();
        let jamKode = $('#typepatient').val(); // Kode jenis pasien
        jaminan = $('#jenispasien > option[value="' + jamKode + '"]').text(); // Teks jenis pasien (digunakan oleh getPusk)
  
        let pasien = pasienJK + ", " + pasienTglLahir + ", " + pasienUmur;
        let pusk = getPusk(); // Dapatkan string nama Puskesmas
  
        // Asumsikan $ adalah jQuery dan metode ini dari jsLabel2PDF.js
        $.CreateTemplate("inches",2.91339,1.29921,0.0787402,0.0787402,2.3622,1.1811,1,1,0.2,0.05);
  
        let pasienNama, pasienKK;
        
        // Tangani kemungkinan nama field yang berbeda untuk nama pasien dan nama kepala keluarga
        if($('#VisitNama').length){
          pasienNama = $('#VisitNama').val();
          pasienKK = $('#VisitNamaKk').val();
        }else{
          pasienNama = $('#namapasien').val();
          pasienKK = $('#nama_kk').val();
        }	

        // Gambar persegi panjang barcode
        $(svg).find('rect').map(function(){ 
          let $x = $(this).attr('x');
          let strX = 0.2 + ($x*0.004481);
          let strY = 0.85;
          let $width = $(this).attr('width');
          let strW = ($width*0.004481);
          let strH = 0.45;
          $.AddRect(strX, strY, strW, strH);
        });

        // Tambahkan elemen teks ke PDF
        $.AddText(1.55,0.05,noRM,16);
        $.AddText(0.2,0.7,pasienNama,10);
        $.AddText(0.2,0.55,nik,10); // NIK ditambahkan
        $.AddText(0.2,0.4,pasien,8);
        $.AddText(0.2,0.25,alamat,8);
        $.AddText(0.2,0.1,pusk,8); // Nama Puskesmas
        $.DrawPDF(); // Buat PDF
        $('#drug2PDF').show(); // Tampilkan iframe
      }

      // Fungsi getPusk yang dimodifikasi
      function getPusk(){
        if(jaminan && jaminan.trim() !== ""){ // Periksa apakah jaminan memiliki nilai yang berarti
          return configuredPuskesmasName + " " + jaminan;
        }
        return configuredPuskesmasName;
      }
  
      function pasienUm() { // Fungsi untuk menghitung usia pasien
        let tanggalSplit = $('#tgllahir').val().split('-');
        // Pastikan format tanggal adalah YYYY-MM-DD untuk konstruktor Date jika DD-MM-YYYY dari input
        let dateBirth = new Date(tanggalSplit[2]+ "-" + tanggalSplit[1] + "-" + tanggalSplit[0]);
        let dateNow = new Date();

        if (isNaN(dateBirth.getTime())) { // Periksa tanggal tidak valid
            return "error";
        }

        let pasienThn = -1;
        let tempDate = new Date(dateNow.getTime());
        while ( tempDate > dateBirth ) {
          tempDate = new Date( tempDate.setFullYear( tempDate.getFullYear() - 1 ) );
          pasienThn++;
        }

        tempDate = new Date(dateNow.getTime()); // Reset tempDate
        tempDate.setFullYear(tempDate.getFullYear() - pasienThn); // Sesuaikan dengan batas tahun

        let pasienBln = -1;
        while ( tempDate > dateBirth ) {
          tempDate = new Date( tempDate.setMonth( tempDate.getMonth() - 1 ) );
          pasienBln++;
        }

        tempDate = new Date(dateNow.getTime()); // Reset tempDate
        tempDate.setFullYear(tempDate.getFullYear() - pasienThn);
        tempDate.setMonth(tempDate.getMonth() - pasienBln); // Sesuaikan dengan batas bulan

        let pasienHr = -1;
        while ( tempDate > dateBirth ) {
          tempDate = new Date( tempDate.setDate( tempDate.getDate() - 1 ) );
          pasienHr++;
        }
          
        if (pasienThn > 0){
          return pasienThn + " thn.";
        } else if (pasienBln > 0){
          return pasienBln + " bln.";
        } else if (pasienHr >= 0) { // Ubah menjadi >= 0 untuk menyertakan bayi baru lahir
          return pasienHr + " hr.";
        } else {
          return "error"; // Seharusnya tidak terjadi jika logika benar
        }
      };
    } else if(empt == undefined){ // Periksa apakah ID pasien kosong
      $('#patient_id').focus();
      alert('data register masih kosong'); // Alert jika data registrasi kosong
      empt = 1; // Tambah penghitung data kosong
    } else {
      $('#patient_id').focus();
    }
  }

  // Bagian ini menambahkan ikon cetak ke baris obat
  if($('#obat2 > table.nested-table > tbody > tr').length > 1){
    // Tambahkan iframe untuk pembuatan PDF jika belum ada (meskipun pengecekan di atas seharusnya menangani ini)
    if ($('#drug2PDF').length === 0) { // Pastikan iframe ditambahkan hanya sekali
        $('#obat2').append('<iframe id="drug2PDF" name="dinda" style="display: none;"></iframe>');
    }

    let obats = [...document.getElementById('obat2').querySelectorAll('tr')].map( row => {
      let tabs = [...row.querySelectorAll('td')]
      if(!tabs || tabs.length < 6){ // Pengecekan dasar untuk elemen td yang cukup
        return {};
      }
      return {
        kode: tabs[0].textContent.trim(),
        nama: tabs[1].textContent.trim(),
        dosis: tabs[2].textContent.trim(),
        jml: tabs[3].textContent.trim(),
        puyer: tabs[4].textContent.trim(),
        pmt: tabs[5].textContent.trim(),
      };
    });

    // Tambahkan header "Label" jika ada obat
    if(obats.length > 1 && obats[1] && obats[1].kode){ // Periksa obats.length dan item spesifik
      // Periksa apakah header sudah ada untuk mencegah duplikat jika skrip berjalan berkali-kali
      if ($('#obat2 > table.nested-table > tbody > tr:nth-child(1) > th:contains("Label")').length === 0) {
        $('#obat2 > table.nested-table > tbody > tr:nth-child(1)').append("<th width='20'>Label</th>");
      }
    }

    // Tambahkan ikon cetak untuk setiap baris obat
    for(let [id, obat] of Object.entries(obats)) {
      if(Number(id) > 0 && obat.kode){ // Pastikan ini adalah entri obat yang valid
        let labelID = `printlabel_${id}_${obat.kode.replace(/[^a-zA-Z0-9]/g, "")}`; // Buat ID lebih kuat
        let childRowIndex = Number(id) + 1;
        let targetRow = $(`#obat2 > table.nested-table > tbody > tr:nth-child(${childRowIndex})`);

        // Periksa apakah ikon sudah ditambahkan
        if (targetRow.find(`#${labelID}`).length === 0) {
          targetRow.append(
            `<td align="center" valign="top">
              <a href="#" id="${labelID}" onclick="return false;">
                <img src="${chrome.runtime.getURL('drug_16x16.png')}" alt="Print" title="Print">
              </a>
            </td>`
          );
          // Tambahkan event listener secara langsung. Hindari mengandalkan document.getElementById jika elemen ditambahkan/diperiksa secara dinamis.
          // Meskipun, dalam loop ini, seharusnya tidak masalah.
          document.getElementById(labelID).addEventListener("click", clickLabel);
        }
      }
    }
  }
}
