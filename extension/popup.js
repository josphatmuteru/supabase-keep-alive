// Supabase Keep Alive Popup

document.addEventListener('DOMContentLoaded', async () => {
    await loadStatus();
    await loadLastResults();
    
    // Event listeners
    document.getElementById('pingNow').addEventListener('click', handlePingNow);
    document.getElementById('toggleExtension').addEventListener('click', handleToggleExtension);
    document.getElementById('openOptions').addEventListener('click', handleOpenOptions);
    document.getElementById('buyMeCoffee').addEventListener('click', handleBuyMeCoffee);
    document.getElementById('openGitHub').addEventListener('click', handleOpenGitHub);
    
    // Refresh status every 30 seconds
    setInterval(loadStatus, 30000);
});

async function loadStatus() {
    try {
        const settings = await chrome.storage.sync.get(['enabled', 'pingInterval', 'urls']);
        const { lastPingTime } = await chrome.storage.local.get(['lastPingTime']);
        
        // Extension status
        const enabled = settings.enabled !== false;
        const statusElement = document.getElementById('extensionStatus');
        statusElement.textContent = enabled ? 'Enabled' : 'Disabled';
        statusElement.className = enabled ? 'status-value status-enabled' : 'status-value status-disabled';
        
        // URL count
        const urlCount = settings.urls ? settings.urls.length : 0;
        document.getElementById('urlCount').textContent = urlCount;
        
        // Ping interval
        const interval = settings.pingInterval || 1440;
        const intervalText = formatInterval(interval);
        document.getElementById('pingInterval').textContent = intervalText;
        
        // Last ping time
        const lastPingElement = document.getElementById('lastPing');
        if (lastPingTime) {
            const timeAgo = formatTimeAgo(lastPingTime);
            lastPingElement.textContent = timeAgo;
        } else {
            lastPingElement.textContent = 'Never';
        }
        
        // Update toggle button text
        const toggleButton = document.getElementById('toggleExtension');
        toggleButton.innerHTML = enabled ? 
            `<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>Disable` : 
            `<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>Enable`;
        
    } catch (error) {
        // Error loading status
    }
}

async function loadLastResults() {
    try {
        const response = await chrome.runtime.sendMessage({ action: 'getLastResults' });
        if (!response) {
            return;
        }
        const { lastPingResults } = response;
        
        const resultsSection = document.getElementById('resultsSection');
        const resultsContent = document.getElementById('resultsContent');
        
        if (!lastPingResults || lastPingResults.length === 0) {
            resultsSection.style.display = 'none';
            return;
        }
        
        const successCount = lastPingResults.filter(r => r.success).length;
        const failedCount = lastPingResults.length - successCount;
        
        let html = `
            <div class="status-row">
                <span class="status-label">Last ping results:</span>
                <span class="status-value">${successCount} success / ${failedCount} failed</span>
            </div>
        `;
        
        if (failedCount > 0) {
            html += '<div class="results-summary">';
            lastPingResults.filter(r => !r.success).forEach(result => {
                html += `
                    <div class="result-item">
                        <svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: #ef4444;">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                        <span style="font-weight: 500;">${result.name}</span>
                    </div>
                `;
            });
            html += '</div>';
        }
        
        resultsContent.innerHTML = html;
        resultsSection.style.display = 'block';
        
    } catch (error) {
        // Error loading last results
    }
}

async function handlePingNow() {
    const button = document.getElementById('pingNow');
    const originalText = button.innerHTML;
    
    button.innerHTML = `
        <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="animation: spin 1s linear infinite;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        Pinging...
    `;
    button.classList.add('loading');
    button.disabled = true;
    
    try {
        const response = await chrome.runtime.sendMessage({ action: 'pingNow' });
        if (response && response.success) {
            button.innerHTML = `
                <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: #10b981;">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                Pinged!
            `;
            
            // Reload status and results after a short delay
            setTimeout(async () => {
                await loadStatus();
                await loadLastResults();
                button.innerHTML = originalText;
                button.classList.remove('loading');
                button.disabled = false;
            }, 2000);
        } else {
            throw new Error('Failed to trigger ping');
        }
    } catch (error) {
        button.innerHTML = `
            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: #ef4444;">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            Failed
        `;
        setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('loading');
            button.disabled = false;
        }, 2000);
    }
}

async function handleToggleExtension() {
    const button = document.getElementById('toggleExtension');
    const originalText = button.textContent;
    
    button.disabled = true;
    button.textContent = '⏳ Updating...';
    
    try {
        const { enabled } = await chrome.storage.sync.get(['enabled']);
        const newEnabled = enabled === false;
        
        await chrome.storage.sync.set({ enabled: newEnabled });
        
        setTimeout(async () => {
            await loadStatus();
            button.disabled = false;
        }, 1000);
        
    } catch (error) {
        button.textContent = originalText;
        button.disabled = false;
    }
}

function handleOpenOptions() {
    chrome.runtime.openOptionsPage();
    window.close();
}

function handleBuyMeCoffee(e) {
    e.preventDefault();
    chrome.tabs.create({ url: 'https://buymeacoffee.com/josphatmuteru' });
    window.close();
}

function handleOpenGitHub(e) {
    e.preventDefault();
    chrome.tabs.create({ url: 'https://github.com/josphatmuteru/supabase-keep-alive' });
    window.close();
}

function formatInterval(minutes) {
    if (minutes < 60) {
        return `${minutes}m`;
    } else if (minutes < 1440) {
        const hours = Math.floor(minutes / 60);
        return `${hours}h`;
    } else {
        const days = Math.floor(minutes / 1440);
        return `${days}d`;
    }
}

function formatTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) {
        return 'Just now';
    } else if (minutes < 60) {
        return `${minutes}m ago`;
    } else if (hours < 24) {
        return `${hours}h ago`;
    } else {
        return `${days}d ago`;
    }
}