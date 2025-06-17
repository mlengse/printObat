let configuredTargetUrl = null;

function loadConfiguration() {
  chrome.storage.local.get(['settings'], (result) => {
    configuredTargetUrl = result.settings && result.settings.targetUrl ? result.settings.targetUrl : null;
    console.log('Konfigurasi dimuat:', { configuredTargetUrl });
  });
}

// Muat konfigurasi saat service worker dimulai
loadConfiguration();

// Dengarkan perubahan penyimpanan untuk memuat ulang konfigurasi
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.settings) {
    console.log('Pengaturan berubah, memuat ulang konfigurasi...');
    loadConfiguration();
  }
});

// Catatan: getCurrentTab tidak digunakan dalam logika listener onUpdated yang diberikan,
// tetapi disimpan di sini jika digunakan oleh bagian lain dari ekstensi yang tidak ditampilkan.
async function getCurrentTab() {
  let [tab] = await chrome.tabs.query({ 
		active: true, 
		lastFocusedWindow: true 
	});
  return tab;
}

// Dipanggil ketika url tab berubah.
chrome.tabs.onUpdated.addListener(async function(tabId, changeInfo, tab) {
  // Kita hanya peduli pada pembaruan di mana URL ada dan telah berubah.
	if (changeInfo.url) {
		console.log('URL Tab diperbarui:', changeInfo.url);
		console.log('Konfigurasi saat ini:', { configuredTargetUrl });

		// Periksa apakah configuredTargetUrl sudah diatur dan apakah URL tab dimulai dengan itu.
		if (configuredTargetUrl && changeInfo.url.startsWith(configuredTargetUrl)) {
			console.log('URL cocok, menjalankan skrip untuk ID tab:', tab.id);
			chrome.scripting.executeScript({
				target: {
					tabId: tab.id // Gunakan tab.id dari argumen listener
				},
				files: [ 
					"jquery-3.7.1.min.js",
					"bardcode.min.js", 
					"base64.min.js" ,
					"sprintf.min.js",
					"jsLabel2PDF.js",
					"content_script.js",
					]
			}, () => {
        if (chrome.runtime.lastError) {
          console.error("Eksekusi skrip gagal: ", chrome.runtime.lastError.message, "on URL:", changeInfo.url);
        } else {
          console.log("Skrip berhasil dijalankan pada:", changeInfo.url);
        }
      });
		} else {
			console.log('Kondisi tidak terpenuhi untuk eksekusi skrip:', {
				configuredTargetUrl,
				url: changeInfo.url,
				startsWith: configuredTargetUrl ? changeInfo.url.startsWith(configuredTargetUrl) : 'N/A (tidak ada URL target)'
			});
		}
	}
});
