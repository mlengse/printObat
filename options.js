document.addEventListener('DOMContentLoaded', function () {
    const saveButton = document.getElementById('saveButton');
    // const configSection = document.getElementById('configSection'); // Not strictly needed as it's always visible
    const targetUrlInput = document.getElementById('targetUrl');
    const puskesmasNameInput = document.getElementById('puskesmasName');
    const statusMessagesDiv = document.getElementById('statusMessages');

    function updateUI(settings = {}) {
        targetUrlInput.value = settings && settings.targetUrl ? settings.targetUrl : '';
        puskesmasNameInput.value = settings && settings.puskesmasName ? settings.puskesmasName : '';
        // configSection is now always visible via HTML, so no need to toggle its class here.
        statusMessagesDiv.textContent = ''; // Clear old messages
    }

    function showStatus(message, isError = false) {
        statusMessagesDiv.textContent = message;
        statusMessagesDiv.style.color = isError ? 'red' : 'green';
    }

    // Load initial settings
    chrome.storage.local.get(['settings'], (result) => {
        updateUI(result.settings);
    });

    saveButton.addEventListener('click', () => {
        const settings = {
            targetUrl: targetUrlInput.value.trim(),
            puskesmasName: puskesmasNameInput.value.trim()
        };

        if (!settings.targetUrl) {
            showStatus('Target URL cannot be empty.', true);
            return;
        }
        // Puskesmas name can be optional or have a default.

        chrome.storage.local.set({ settings: settings }, () => {
            if (chrome.runtime.lastError) {
                showStatus('Error saving settings: ' + chrome.runtime.lastError.message, true);
            } else {
                showStatus('Settings saved successfully!');
            }
        });
    });
});
