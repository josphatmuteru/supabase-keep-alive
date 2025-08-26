// Supabase Keep Alive Background Service Worker

const DEFAULT_PING_INTERVAL = 60 * 24; // 24 hours in minutes
const ALARM_NAME = 'supabaseKeepAlive';

// Initialize the extension
chrome.runtime.onInstalled.addListener(async () => {
  // Set default settings if not exists
  const result = await chrome.storage.sync.get(['pingInterval', 'urls', 'enabled']);
  
  if (!result.pingInterval) {
    await chrome.storage.sync.set({ pingInterval: DEFAULT_PING_INTERVAL });
  }
  
  if (!result.urls) {
    await chrome.storage.sync.set({ urls: [] });
  }
  
  if (result.enabled === undefined) {
    await chrome.storage.sync.set({ enabled: true });
  }
  
  // Create the alarm
  await createAlarm();
});

// Create or update the alarm
async function createAlarm() {
  const { pingInterval, enabled } = await chrome.storage.sync.get(['pingInterval', 'enabled']);
  
  // Clear existing alarm
  await chrome.alarms.clear(ALARM_NAME);
  
  if (enabled) {
    // Create new alarm
    await chrome.alarms.create(ALARM_NAME, {
      delayInMinutes: 1, // Start after 1 minute
      periodInMinutes: pingInterval || DEFAULT_PING_INTERVAL
    });
  }
}

// Handle alarm events
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === ALARM_NAME) {
    await performKeepAlivePings();
  }
});

// Perform keep alive pings
async function performKeepAlivePings() {
  try {
    const { urls, enabled } = await chrome.storage.sync.get(['urls', 'enabled']);
    
    if (!enabled || !urls || urls.length === 0) {
      return;
    }
    
    const results = [];
    
    for (const urlData of urls) {
      const url = typeof urlData === 'string' ? urlData : urlData.url;
      const name = typeof urlData === 'string' ? url : (urlData.name || new URL(url).hostname);
      const apiKey = typeof urlData === 'object' ? urlData.apiKey : null;
      
      if (!url) continue;
      
      try {
        // Prepare headers
        const headers = {
          'User-Agent': 'Supabase-Keep-Alive-Extension/1.0',
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        };
        
        // Add Supabase authentication if it's a Supabase URL and anon key is provided
        if (url.includes('.supabase.co') && apiKey) {
          headers['apikey'] = apiKey;
          headers['Authorization'] = `Bearer ${apiKey}`;
        }
        
        const response = await fetch(url, {
          method: 'GET',
          headers: headers
        });
        
        const success = response.ok;
        const status = response.status;
        
        results.push({
          url,
          name,
          success,
          status,
          timestamp: Date.now()
        });
        
      } catch (error) {
        results.push({
          url,
          name,
          success: false,
          error: error.message,
          timestamp: Date.now()
        });
      }
    }
    
    // Store last ping results
    await chrome.storage.local.set({
      lastPingResults: results,
      lastPingTime: Date.now()
    });
    
    // Update badge
    const failedCount = results.filter(r => !r.success).length;
    const badgeText = failedCount > 0 ? failedCount.toString() : '';
    const badgeColor = failedCount > 0 ? '#ff4444' : '#00aa00';
    
    await chrome.action.setBadgeText({ text: badgeText });
    await chrome.action.setBadgeBackgroundColor({ color: badgeColor });
    
  } catch (error) {
    // Silently handle errors
  }
}

// Handle storage changes to update alarm
chrome.storage.onChanged.addListener(async (changes, area) => {
  if (area === 'sync' && (changes.pingInterval || changes.enabled)) {
    await createAlarm();
  }
  
  // Clear ping results when URLs are modified
  if (area === 'sync' && changes.urls) {
    await chrome.storage.local.remove(['lastPingResults', 'lastPingTime']);
  }
});

// Handle messages from popup/options
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'pingNow') {
    performKeepAlivePings().then(() => {
      sendResponse({ success: true });
    }).catch((error) => {
      sendResponse({ success: false, error: error.message });
    });
    return true; // Keep message channel open for async response
  } else if (request.action === 'getLastResults') {
    chrome.storage.local.get(['lastPingResults', 'lastPingTime']).then((result) => {
      sendResponse(result);
    }).catch((error) => {
      sendResponse({ lastPingResults: [], lastPingTime: null });
    });
    return true; // Keep message channel open for async response
  }
  
  return false; // Don't keep channel open for unknown messages
});