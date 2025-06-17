document.addEventListener('DOMContentLoaded', function () {
    const saveButton = document.getElementById('saveButton');
    // const configSection = document.getElementById('configSection'); // Tidak terlalu dibutuhkan karena selalu terlihat
    const targetUrlInput = document.getElementById('targetUrl');
    const puskesmasNameInput = document.getElementById('puskesmasName');
    const statusMessagesDiv = document.getElementById('statusMessages');

    function updateUI(settings = {}) {
        targetUrlInput.value = settings && settings.targetUrl ? settings.targetUrl : '';
        puskesmasNameInput.value = settings && settings.puskesmasName ? settings.puskesmasName : '';
        // configSection sekarang selalu terlihat via HTML, jadi tidak perlu mengubah kelasnya di sini.
        statusMessagesDiv.textContent = ''; // Hapus pesan lama
    }

    function showStatus(message, isError = false) {
        statusMessagesDiv.textContent = message;
        statusMessagesDiv.style.color = isError ? 'red' : 'green';
    }

    // Muat pengaturan awal
    chrome.storage.local.get(['settings'], (result) => {
        updateUI(result.settings);
    });

    saveButton.addEventListener('click', () => {
        const settings = {
            targetUrl: targetUrlInput.value.trim(),
            puskesmasName: puskesmasNameInput.value.trim()
        };

        if (!settings.targetUrl) {
            showStatus('URL Target tidak boleh kosong.', true);
            return;
        }
        // Nama Puskesmas bisa opsional atau memiliki nilai default.

        chrome.storage.local.set({ settings: settings }, () => {
            if (chrome.runtime.lastError) {
                showStatus('Gagal menyimpan pengaturan: ' + chrome.runtime.lastError.message, true);
            } else {
                showStatus('Pengaturan berhasil disimpan!');
            }
        });
    });
});
