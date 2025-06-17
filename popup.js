document.addEventListener('DOMContentLoaded', function () {
    const openOptionsLink = document.getElementById('openOptionsLink');
    // const configDisplayDiv = document.getElementById('configDisplay'); // Tidak terlalu dibutuhkan karena selalu terlihat
    const displayTargetUrl = document.getElementById('displayTargetUrl');
    const displayPuskesmasName = document.getElementById('displayPuskesmasName');
    const statusMessagesPopupDiv = document.getElementById('statusMessagesPopup');

    function showPopupStatus(message, isError = false) {
        statusMessagesPopupDiv.textContent = message;
        statusMessagesPopupDiv.style.color = isError ? 'crimson' : 'green';
        setTimeout(() => { statusMessagesPopupDiv.textContent = ''; }, 5000); // Pesan hilang setelah 5 detik
    }

    function updatePopupUI(settings = {}) {
        // configDisplayDiv sekarang selalu terlihat via HTML
        displayTargetUrl.textContent = settings && settings.targetUrl ? settings.targetUrl : 'Belum diatur';
        displayPuskesmasName.textContent = settings && settings.puskesmasName ? settings.puskesmasName : 'Belum diatur';
    }

    // Perbarui UI awal
    chrome.storage.local.get(['settings'], (result) => {
        updatePopupUI(result.settings);
    });

    // Dengarkan perubahan penyimpanan untuk menjaga sinkronisasi UI popup
    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'local' && changes.settings) { // Hanya bereaksi jika pengaturan berubah
            chrome.storage.local.get(['settings'], (result) => {
                updatePopupUI(result.settings);
            });
        }
    });

    openOptionsLink.addEventListener('click', () => {
        chrome.runtime.openOptionsPage();
    });
});
