document.addEventListener('DOMContentLoaded', function () {
    const loginButton = document.getElementById('loginButton');
    const logoutButton = document.getElementById('logoutButton');
    const openOptionsLink = document.getElementById('openOptionsLink');
    const userInfoDiv = document.getElementById('userInfo');
    const configDisplayDiv = document.getElementById('configDisplay');
    const displayTargetUrl = document.getElementById('displayTargetUrl');
    const displayPuskesmasName = document.getElementById('displayPuskesmasName');
    const statusMessagesPopupDiv = document.getElementById('statusMessagesPopup');


    function showPopupStatus(message, isError = false) {
        statusMessagesPopupDiv.textContent = message;
        statusMessagesPopupDiv.style.color = isError ? 'crimson' : 'green';
        setTimeout(() => { statusMessagesPopupDiv.textContent = ''; }, 5000);
    }

    function updatePopupUI(isLoggedIn, userEmail = '', settings = {}) {
        if (isLoggedIn) {
            loginButton.classList.add('hidden');
            logoutButton.classList.remove('hidden');
            userInfoDiv.textContent = `Logged in as: ${userEmail}`;
            configDisplayDiv.classList.remove('hidden');
            displayTargetUrl.textContent = settings && settings.targetUrl ? settings.targetUrl : 'Not set';
            displayPuskesmasName.textContent = settings && settings.puskesmasName ? settings.puskesmasName : 'Not set';
        } else {
            loginButton.classList.remove('hidden');
            logoutButton.classList.add('hidden');
            userInfoDiv.textContent = 'Not logged in.';
            configDisplayDiv.classList.add('hidden');
        }
    }

    // Initial UI update
    chrome.storage.local.get(['authToken', 'userEmail', 'settings'], (result) => {
        if (result.authToken && result.userEmail) {
            updatePopupUI(true, result.userEmail, result.settings);
        } else {
            updatePopupUI(false);
        }
    });

    // Listen for storage changes to keep popup UI sync
    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'local') {
            chrome.storage.local.get(['authToken', 'userEmail', 'settings'], (result) => {
                if (result.authToken && result.userEmail) {
                    updatePopupUI(true, result.userEmail, result.settings);
                } else {
                    updatePopupUI(false);
                }
            });
        }
    });

    loginButton.addEventListener('click', () => {
        showPopupStatus('Attempting login...');
        chrome.identity.getAuthToken({ interactive: true }, (token) => {
            if (chrome.runtime.lastError || !token) {
                showPopupStatus('Login failed: ' + (chrome.runtime.lastError ? chrome.runtime.lastError.message : 'No token. Open settings to login.'), true);
                updatePopupUI(false);
                return;
            }
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
                    showPopupStatus('Failed to fetch user email from Google.', true);
                    chrome.identity.removeCachedAuthToken({ token: token }, () => {});
                    updatePopupUI(false);
                    return;
                }
                const userEmail = data.email;
                chrome.storage.local.set({ authToken: token, userEmail: userEmail }, () => {
                     chrome.storage.local.get(['settings'], (res) => { // Get settings to display them
                        updatePopupUI(true, userEmail, res.settings);
                        showPopupStatus('Login successful!');
                    });
                });
            })
            .catch(error => {
                showPopupStatus('Login failed during user info fetch: ' + error.message, true);
                chrome.identity.removeCachedAuthToken({ token: token }, () => {});
                updatePopupUI(false);
            });
        });
    });

    logoutButton.addEventListener('click', () => {
        showPopupStatus('Logging out...');
        chrome.storage.local.get(['authToken'], (result) => {
            if (result.authToken) {
                chrome.identity.removeCachedAuthToken({ token: result.authToken }, () => {
                    chrome.storage.local.remove(['authToken', 'userEmail', 'settings'], () => {
                        updatePopupUI(false);
                        showPopupStatus('Logout successful.');
                    });
                });
            } else {
                 showPopupStatus('Already logged out.', true);
            }
        });
    });

    openOptionsLink.addEventListener('click', () => {
        chrome.runtime.openOptionsPage();
    });
});
