// Ensure this script runs only once or is idempotent if run multiple times.
// The original check `if($('#drug2PDF').length == 0)` helps, but global vars need care.

let configuredPuskesmasName = "PKM Jayengan"; // Default value

// Load Puskesmas name from storage
// This is asynchronous, so getPusk() might be called before this completes if not careful.
// However, clickLabel is user-initiated, by which time this should have completed.
chrome.storage.local.get(['settings'], function(result) {
    if (result.settings && result.settings.puskesmasName && result.settings.puskesmasName.trim() !== "") {
        configuredPuskesmasName = result.settings.puskesmasName;
        console.log('Puskesmas Name loaded:', configuredPuskesmasName);
    } else {
        console.log('Puskesmas Name not found in settings or is empty, using default:', configuredPuskesmasName);
    }
});

if($('#drug2PDF').length == 0 ){ // Check if the iframe for PDF is already added
  const clickLabel = () => {
    let al; // Alert counter
    let empt; // Empty data counter
  
    // This 'jaminan' variable is declared inside clickLabel, and then used by getPusk.
    // It needs to be accessible to getPusk. It's fine as is because getPusk is a nested function.
    let jaminan;

    if($('#sex').val().length){ // Check if patient gender is filled
      let pasienTglLahir = $('#tgllahir').val();
      let nik = $('#nik').val();
      let pasienUmur = pasienUm(); // Calculates patient's age

      if (pasienUmur == "error" ){
        if(al == undefined){ // Show alert only once
          alert("tanggal lahir salah");
          al = 1; // Increment alert counter
        }
        $('#tgllahir').focus();
      } else {
        let noRM = $('#patient_id').val().toUpperCase();
        let svg = drawBarcode("svg", noRM, { // Assuming drawBarcode is from bardcode.min.js
          type: 'Code 128'
        });
        noRM = noRM.substr(0,6); // Take first 6 chars for display
        let pasienSex = $('#sex').val();
        let pasienJK = $('#jk > option[value="' + pasienSex + '"]').text(); // Get gender text
  
        let alamat = $('#alamat').val();
        let jamKode = $('#typepatient').val(); // Patient type code
        jaminan = $('#jenispasien > option[value="' + jamKode + '"]').text(); // Patient type text (used by getPusk)
  
        let pasien = pasienJK + ", " + pasienTglLahir + ", " + pasienUmur;
        let pusk = getPusk(); // Get Puskesmas name string
  
        // Assuming $ is jQuery and these methods are from jsLabel2PDF.js
        $.CreateTemplate("inches",2.91339,1.29921,0.0787402,0.0787402,2.3622,1.1811,1,1,0.2,0.05);
  
        let pasienNama, pasienKK;
        
        // Handle different possible field names for patient name and family head name
        if($('#VisitNama').length){
          pasienNama = $('#VisitNama').val();
          pasienKK = $('#VisitNamaKk').val();
        }else{
          pasienNama = $('#namapasien').val();
          pasienKK = $('#nama_kk').val();
        }	

        // Draw barcode rectangles
        $(svg).find('rect').map(function(){ 
          let $x = $(this).attr('x');
          let strX = 0.2 + ($x*0.004481);
          let strY = 0.85;
          let $width = $(this).attr('width');
          let strW = ($width*0.004481);
          let strH = 0.45;
          $.AddRect(strX, strY, strW, strH);
        });

        // Add text elements to PDF
        $.AddText(1.55,0.05,noRM,16);
        $.AddText(0.2,0.7,pasienNama,10);
        $.AddText(0.2,0.55,nik,10); // Added NIK
        $.AddText(0.2,0.4,pasien,8);
        $.AddText(0.2,0.25,alamat,8);
        $.AddText(0.2,0.1,pusk,8); // Puskesmas name
        $.DrawPDF(); // Generate PDF
        $('#drug2PDF').show(); // Show the iframe
      }

      // Modified getPusk function
      function getPusk(){
        if(jaminan && jaminan.trim() !== ""){ // Check if jaminan has a meaningful value
          return configuredPuskesmasName + " " + jaminan;
        }
        return configuredPuskesmasName;
      }
  
      function pasienUm() { // Function to calculate patient's age
        let tanggalSplit = $('#tgllahir').val().split('-');
        // Ensure date format is YYYY-MM-DD for Date constructor if DD-MM-YYYY is from input
        let dateBirth = new Date(tanggalSplit[2]+ "-" + tanggalSplit[1] + "-" + tanggalSplit[0]);
        let dateNow = new Date();

        if (isNaN(dateBirth.getTime())) { // Check for invalid date
            return "error";
        }

        let pasienThn = -1;
        let tempDate = new Date(dateNow.getTime());
        while ( tempDate > dateBirth ) {
          tempDate = new Date( tempDate.setFullYear( tempDate.getFullYear() - 1 ) );
          pasienThn++;
        }

        tempDate = new Date(dateNow.getTime()); // Reset tempDate
        tempDate.setFullYear(tempDate.getFullYear() - pasienThn); // Adjust to the year boundary

        let pasienBln = -1;
        while ( tempDate > dateBirth ) {
          tempDate = new Date( tempDate.setMonth( tempDate.getMonth() - 1 ) );
          pasienBln++;
        }

        tempDate = new Date(dateNow.getTime()); // Reset tempDate
        tempDate.setFullYear(tempDate.getFullYear() - pasienThn);
        tempDate.setMonth(tempDate.getMonth() - pasienBln); // Adjust to month boundary

        let pasienHr = -1;
        while ( tempDate > dateBirth ) {
          tempDate = new Date( tempDate.setDate( tempDate.getDate() - 1 ) );
          pasienHr++;
        }
          
        if (pasienThn > 0){
          return pasienThn + " thn.";
        } else if (pasienBln > 0){
          return pasienBln + " bln.";
        } else if (pasienHr >= 0) { // Changed to >= 0 to include newborn
          return pasienHr + " hr.";
        } else {
          return "error"; // Should ideally not happen if logic is correct
        }
      };
    } else if(empt == undefined){ // Check if patient ID is empty
      $('#patient_id').focus();
      alert('data register masih kosong'); // Alert if registration data is empty
      empt = 1; // Increment empty counter
    } else {
      $('#patient_id').focus();
    }
  }

  // This part adds print icons to medication rows
  if($('#obat2 > table.nested-table > tbody > tr').length > 1){
    // Add an iframe for PDF generation if not already present (though the top check should handle this)
    if ($('#drug2PDF').length === 0) { // Ensure iframe is added only once
        $('#obat2').append('<iframe id="drug2PDF" name="dinda" style="display: none;"></iframe>');
    }

    let obats = [...document.getElementById('obat2').querySelectorAll('tr')].map( row => {
      let tabs = [...row.querySelectorAll('td')]
      if(!tabs || tabs.length < 6){ // Basic check for sufficient td elements
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

    // Add "Label" header if there are medications
    if(obats.length > 1 && obats[1] && obats[1].kode){ // Check obats.length and specific item
      // Check if header already exists to prevent duplicates if script runs multiple times
      if ($('#obat2 > table.nested-table > tbody > tr:nth-child(1) > th:contains("Label")').length === 0) {
        $('#obat2 > table.nested-table > tbody > tr:nth-child(1)').append("<th width='20'>Label</th>");
      }
    }

    // Add print icons for each medication row
    for(let [id, obat] of Object.entries(obats)) {
      if(Number(id) > 0 && obat.kode){ // Ensure it's a valid medication entry
        let labelID = `printlabel_${id}_${obat.kode.replace(/[^a-zA-Z0-9]/g, "")}`; // Make ID more robust
        let childRowIndex = Number(id) + 1;
        let targetRow = $(`#obat2 > table.nested-table > tbody > tr:nth-child(${childRowIndex})`);

        // Check if icon already added
        if (targetRow.find(`#${labelID}`).length === 0) {
          targetRow.append(
            `<td align="center" valign="top">
              <a href="#" id="${labelID}" onclick="return false;">
                <img src="${chrome.runtime.getURL('drug_16x16.png')}" alt="Print" title="Print">
              </a>
            </td>`
          );
          // Add event listener directly. Avoid relying on document.getElementById if elements are dynamically added/checked
          // Though, in this loop, it should be fine.
          document.getElementById(labelID).addEventListener("click", clickLabel);
        }
      }
    }
  }
}
