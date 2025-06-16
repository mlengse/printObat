document.addEventListener('DOMContentLoaded', function () {
    const openOptionsLink = document.getElementById('openOptionsLink');
    // const configDisplayDiv = document.getElementById('configDisplay'); // Not strictly needed as it's always visible
    const displayTargetUrl = document.getElementById('displayTargetUrl');
    const displayPuskesmasName = document.getElementById('displayPuskesmasName');
    const statusMessagesPopupDiv = document.getElementById('statusMessagesPopup');

    function showPopupStatus(message, isError = false) {
        statusMessagesPopupDiv.textContent = message;
        statusMessagesPopupDiv.style.color = isError ? 'crimson' : 'green';
        setTimeout(() => { statusMessagesPopupDiv.textContent = ''; }, 5000);
    }

    function updatePopupUI(settings = {}) {
        // configDisplayDiv is now always visible via HTML
        displayTargetUrl.textContent = settings && settings.targetUrl ? settings.targetUrl : 'Not set';
        displayPuskesmasName.textContent = settings && settings.puskesmasName ? settings.puskesmasName : 'Not set';
    }

    // Initial UI update
    chrome.storage.local.get(['settings'], (result) => {
        updatePopupUI(result.settings);
    });

    // Listen for storage changes to keep popup UI sync
    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'local' && changes.settings) { // Only react if settings change
            chrome.storage.local.get(['settings'], (result) => {
                updatePopupUI(result.settings);
            });
        }
    });

    openOptionsLink.addEventListener('click', () => {
        chrome.runtime.openOptionsPage();
    });
});
