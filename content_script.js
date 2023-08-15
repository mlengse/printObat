if($('#drug2PDF').length == 0 ){
  const clickLabel = () => {
    let al;
    let empt;
  
    if($('#sex').val().length){
      let pasienTglLahir = $('#tgllahir').val();
      let nik = $('#nik').val();
      let pasienUmur = pasienUm();
      let jaminan;
      if (pasienUmur == "error" ){
        if(al == undefined){
          alert("tanggal lahir salah");
          al++;
        }
        $('#tgllahir').focus();
      } else {
        let noRM = $('#patient_id').val().toUpperCase();
        let svg = drawBarcode("svg", noRM, {
          type: 'Code 128'
        });
        noRM = noRM.substr(0,6);
        let pasienSex = $('#sex').val();
        let pasienJK = $('#jk > option[value="' + pasienSex + '"]').text();
  
        let alamat = $('#alamat').val();
        let jamKode = $('#typepatient').val();
        jaminan = $('#jenispasien > option[value="' + jamKode + '"]').text();
  
        let pasien = pasienJK + ", " + pasienTglLahir + ", " + pasienUmur;
        let pusk = getPusk();
  
        $.CreateTemplate("inches",2.91339,1.29921,0.0787402,0.0787402,2.3622,1.1811,1,1,0.2,0.05);
  
        let pasienNama, pasienKK;
        
        if($('#VisitNama').length){
          pasienNama = $('#VisitNama').val();
          pasienKK = $('#VisitNamaKk').val();
  
        }else{
          pasienNama = $('#namapasien').val();
          pasienKK = $('#nama_kk').val();
        }	
        $(svg).find('rect').map(function(){ 
          let $x = $(this).attr('x');
          let strX = 0.2 + ($x*0.004481);
          let strY = 0.85;
          let $width = $(this).attr('width');
          let strW = ($width*0.004481);
          let strH = 0.45;
          $.AddRect(strX, strY, strW, strH);
        });
        $.AddText(1.55,0.05,noRM,16);
        $.AddText(0.2,0.7,pasienNama,10);
        $.AddText(0.2,0.55,nik,10);
        $.AddText(0.2,0.4,pasien,8);
        $.AddText(0.2,0.25,alamat,8);
        $.AddText(0.2,0.1,pusk,8);
        $.DrawPDF();
        $('#drug2PDF').show()
      }
      function getPusk(){
        if(jaminan){
          return "PKM Jayengan " + jaminan;
        }
        return "PKM Jayengan";
      }
  
      function pasienUm() {
        let tanggalSplit = $('#tgllahir').val().split('-');
        let dateBirth = new Date(tanggalSplit[2]+ "-" + tanggalSplit[1] + "-" + tanggalSplit[0]);
        let dateNow = new Date();
        let pasienThn = -1;
        while ( dateNow > dateBirth ) {
          dateNow = new Date( dateNow.setFullYear( dateNow.getFullYear() - 1 ) );
          pasienThn++;
        }
        dateNow = new Date( dateNow.setFullYear( dateNow.getFullYear() + 1 ) );
        let pasienBln = -1;
        while ( dateNow > dateBirth ) {
          dateNow = new Date( dateNow.setMonth( dateNow.getMonth() - 1 ) );
          pasienBln++;
        }
        dateNow = new Date( dateNow.setMonth( dateNow.getMonth() + 1 ) );
        let pasienHr = -1;
        while ( dateNow > dateBirth ) {
          dateNow = new Date( dateNow.setDate( dateNow.getDate() - 1 ) );
          pasienHr++;
        }
          
        if (pasienThn > 0){
          return pasienThn + " thn.";
        } else if (pasienBln > 0){
          return pasienBln + " bln.";
        } else if (pasienHr > 0) {
          return pasienHr + " hr.";
        } else {
          return "error";
        }
      };
    } else if(empt == undefined){
      $('#patient_id').focus();
      alert('data register masih kosong');
      empt++;
    } else {
      $('#patient_id').focus();
    }
  }

  if($('#obat2 > table.nested-table > tbody > tr').length > 1){
    $('#obat2').append('<iframe  id="drug2PDF" name="dinda" style="display: none;"></iframe>')
    let obats = [...document.getElementById('obat2').querySelectorAll('tr')].map( row => {
      let tabs = [...row.querySelectorAll('td')]
      if(!tabs){
        return {}
      }
      if( !tabs[1]) {
        return {}
      }
      return {
        kode: tabs[0].textContent,
        nama: tabs[1].textContent,
        dosis: tabs[2].textContent,
        jml: tabs[3].textContent,
        puyer: tabs[4].textContent,
        pmt: tabs[5].textContent,
      }
    })
    if(obats[1] && obats[1].kode){
      $('#obat2 > table.nested-table > tbody > tr:nth-child(1)').append("<th width='20'>Label</th>")
    }
    for(let [id, obat] of Object.entries(obats)) if(Number(id) > 0 && obat.kode){
      let labelID = `${id}.${obat.kode}`
      let child = Number(id)+1
      console.log(labelID, child)
      $(`#obat2 > table.nested-table > tbody > tr:nth-child(${child})`).append(`<td align="center" valign="top"><a href="" id="${labelID}" onclick="return false;"><img src="${chrome.runtime.getURL('drug_16x16.png')}" alt="Print" title="Print"></a></td>`)
      document.getElementById(`${labelID}`).addEventListener("click", clickLabel)
    }
  }
  
}
