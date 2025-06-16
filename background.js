let configuredTargetUrl = null;
let isAuthenticated = false;

function loadConfiguration() {
  chrome.storage.local.get(['settings', 'authToken', 'userEmail'], (result) => {
    configuredTargetUrl = result.settings && result.settings.targetUrl ? result.settings.targetUrl : null;
    isAuthenticated = !!result.authToken; // Check if authToken exists to determine authentication status
    console.log('Configuration loaded:', { configuredTargetUrl, isAuthenticated, userEmail: result.userEmail });
  });
}

// Load configuration when the service worker starts
loadConfiguration();

// Listen for storage changes to reload configuration
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && (changes.settings || changes.authToken || changes.userEmail)) {
    console.log('Configuration changed, reloading...');
    loadConfiguration();
  }
});

async function getCurrentTab() {
  let [tab] = await chrome.tabs.query({ 
		active: true, 
		lastFocusedWindow: true 
	});
  return tab;
}

// Called when the url of a tab changes.
chrome.tabs.onUpdated.addListener(async function(tabId, changeInfo, tab) {
  // Ensure the tab object is the one from the event or refetch if necessary,
  // but getCurrentTab() might not be what we want here if the update is for a non-active tab.
  // The 'tab' argument from onUpdated is usually sufficient if its 'url' property is populated.
  // We only care about updates where the URL is present and has changed to something meaningful.
	if (changeInfo.url) { // Check if URL changed
		// Use the URL from changeInfo as tab.url might be outdated for this specific event
		console.log('Tab URL updated:', changeInfo.url);
		console.log('Current configuration:', { isAuthenticated, configuredTargetUrl });

		if (isAuthenticated && configuredTargetUrl && changeInfo.url.startsWith(configuredTargetUrl)) {
			console.log('Matching URL and authenticated, executing script for tab ID:', tab.id);
			chrome.scripting.executeScript({
				target: {
					tabId: tab.id
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
          console.error("Script execution failed: ", chrome.runtime.lastError.message, "on URL:", changeInfo.url);
        } else {
          console.log("Script executed successfully on:", changeInfo.url);
        }
      });
		} else {
			console.log('Conditions not met for script execution:', {
				isAuthenticated,
				configuredTargetUrl,
				url: changeInfo.url,
				startsWith: configuredTargetUrl ? changeInfo.url.startsWith(configuredTargetUrl) : 'N/A (no target URL)'
			});
		}
	}
});
