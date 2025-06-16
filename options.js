document.addEventListener('DOMContentLoaded', function () {
    const loginButton = document.getElementById('loginButton');
    const logoutButton = document.getElementById('logoutButton');
    const saveButton = document.getElementById('saveButton');
    const configSection = document.getElementById('configSection');
    const userInfoDiv = document.getElementById('userInfo');
    const targetUrlInput = document.getElementById('targetUrl');
    const puskesmasNameInput = document.getElementById('puskesmasName');
    const statusMessagesDiv = document.getElementById('statusMessages');

    function updateUI(isLoggedIn, userEmail = '', settings = {}) {
        if (isLoggedIn) {
            loginButton.classList.add('hidden');
            configSection.classList.remove('hidden');
            logoutButton.classList.remove('hidden');
            userInfoDiv.textContent = `Logged in as: ${userEmail}`;
            targetUrlInput.value = settings && settings.targetUrl ? settings.targetUrl : '';
            puskesmasNameInput.value = settings && settings.puskesmasName ? settings.puskesmasName : '';
        } else {
            loginButton.classList.remove('hidden');
            configSection.classList.add('hidden');
            logoutButton.classList.add('hidden');
            userInfoDiv.textContent = 'Not logged in.';
            targetUrlInput.value = '';
            puskesmasNameInput.value = '';
        }
        statusMessagesDiv.textContent = ''; // Clear old messages
    }

    function showStatus(message, isError = false) {
        statusMessagesDiv.textContent = message;
        statusMessagesDiv.style.color = isError ? 'red' : 'green';
    }

    // Check initial login state
    chrome.storage.local.get(['authToken', 'userEmail', 'settings'], (result) => {
        if (result.authToken && result.userEmail) { // Check for email as well
            // Potentially verify token validity here with an API call if needed for robustness
            updateUI(true, result.userEmail, result.settings);
        } else {
            updateUI(false);
        }
    });

    loginButton.addEventListener('click', () => {
        showStatus('Attempting login...');
        chrome.identity.getAuthToken({ interactive: true }, (token) => {
            if (chrome.runtime.lastError || !token) {
                showStatus('Login failed: ' + (chrome.runtime.lastError ? chrome.runtime.lastError.message : 'No token received. Ensure you are logged into Chrome and have enabled sync, or try again.'), true);
                updateUI(false);
                return;
            }

            // Fetch user email using the token
            fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Google API Error: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                if (!data.email) {
                    showStatus('Failed to fetch user email from Google.', true);
                    chrome.identity.removeCachedAuthToken({ token: token }, () => {}); // Clean up
                    updateUI(false);
                    return;
                }
                const userEmail = data.email;
                chrome.storage.local.set({ authToken: token, userEmail: userEmail }, () => {
                    showStatus('Login successful!');
                    chrome.storage.local.get(['settings'], (res) => {
                        updateUI(true, userEmail, res.settings);
                    });
                });
            })
            .catch(error => {
                showStatus('Failed to fetch user info: ' + error.message, true);
                chrome.identity.removeCachedAuthToken({ token: token }, () => {}); // Clean up
                updateUI(false);
            });
        });
    });

    logoutButton.addEventListener('click', () => {
        showStatus('Logging out...');
        chrome.storage.local.get(['authToken'], (result) => {
            if (result.authToken) {
                // It's good practice to revoke the token on Google's side if possible,
                // but for simplicity, we'll just remove it locally.
                // For a production app, consider revoking:
                // fetch('https://accounts.google.com/o/oauth2/revoke?token=' + result.authToken)
                chrome.identity.removeCachedAuthToken({ token: result.authToken }, () => {
                    chrome.storage.local.remove(['authToken', 'userEmail', 'settings'], () => {
                        showStatus('Logout successful.');
                        updateUI(false);
                    });
                });
            } else {
                updateUI(false); // Should not happen if logout button is visible
                 showStatus('Already logged out or no token found.', true);
            }
        });
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
        // Puskesmas name can be optional or have a default, so not strictly validating emptiness here
        // unless specified by requirements.

        chrome.storage.local.set({ settings: settings }, () => {
            if (chrome.runtime.lastError) {
                showStatus('Error saving settings: ' + chrome.runtime.lastError.message, true);
            } else {
                showStatus('Settings saved successfully!');
            }
        });
    });
});
