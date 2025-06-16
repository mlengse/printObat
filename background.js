let configuredTargetUrl = null;

function loadConfiguration() {
  chrome.storage.local.get(['settings'], (result) => {
    configuredTargetUrl = result.settings && result.settings.targetUrl ? result.settings.targetUrl : null;
    console.log('Configuration loaded:', { configuredTargetUrl });
  });
}

// Load configuration when the service worker starts
loadConfiguration();

// Listen for storage changes to reload configuration
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.settings) {
    console.log('Settings changed, reloading configuration...');
    loadConfiguration();
  }
});

// Note: getCurrentTab is not used in the provided onUpdated listener logic,
// but kept here if it's used by other parts of the extension not shown.
async function getCurrentTab() {
  let [tab] = await chrome.tabs.query({ 
		active: true, 
		lastFocusedWindow: true 
	});
  return tab;
}

// Called when the url of a tab changes.
chrome.tabs.onUpdated.addListener(async function(tabId, changeInfo, tab) {
  // We only care about updates where the URL is present and has changed.
	if (changeInfo.url) {
		console.log('Tab URL updated:', changeInfo.url);
		console.log('Current configuration:', { configuredTargetUrl });

		// Check if the configuredTargetUrl is set and if the tab's URL starts with it.
		if (configuredTargetUrl && changeInfo.url.startsWith(configuredTargetUrl)) {
			console.log('Matching URL, executing script for tab ID:', tab.id);
			chrome.scripting.executeScript({
				target: {
					tabId: tab.id // Use tab.id from the listener argument
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
				configuredTargetUrl,
				url: changeInfo.url,
				startsWith: configuredTargetUrl ? changeInfo.url.startsWith(configuredTargetUrl) : 'N/A (no target URL)'
			});
		}
	}
});
