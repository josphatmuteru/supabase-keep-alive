// Supabase Keep Alive Options Page

document.addEventListener('DOMContentLoaded', async () => {
    await loadSettings();
    await loadLastResults();
    
    // Event listeners
    const saveButton = document.getElementById('save');
    const addButton = document.getElementById('addUrl');
    const pingButton = document.getElementById('pingNow');
    const coffeeButton = document.getElementById('buyMeCoffee');
    const githubButton = document.getElementById('openGitHub');
    
    if (saveButton) {
        saveButton.addEventListener('click', saveSettings);
    }
    
    if (addButton) {
        addButton.addEventListener('click', () => {
            // Check if there are any empty URL fields before adding a new one
            const urlItems = document.querySelectorAll('.url-item');
            const hasEmptyUrl = Array.from(urlItems).some(item => {
                const urlInput = item.querySelector('.url-input');
                return !urlInput.value.trim();
            });
            
            if (hasEmptyUrl) {
                showStatus('Please fill in all existing URL fields before adding a new one.', 'error');
                return;
            }
            
            // Check if there are any invalid URLs
            const hasInvalidUrl = Array.from(urlItems).some(item => {
                const urlInput = item.querySelector('.url-input');
                return urlInput.value.trim() && urlInput.classList.contains('invalid');
            });
            
            if (hasInvalidUrl) {
                showStatus('Please fix invalid URLs before adding a new one.', 'error');
                return;
            }
            
            addUrlField();
            showStatus('New URL field added. Please enter a valid URL.', 'success');
        });
    }
    
    if (pingButton) {
        pingButton.addEventListener('click', testPingNow);
    }
    
    if (coffeeButton) {
        coffeeButton.addEventListener('click', () => {
            chrome.tabs.create({ url: 'https://buymeacoffee.com/josphatmuteru' });
        });
    }
    
    if (githubButton) {
        githubButton.addEventListener('click', () => {
            chrome.tabs.create({ url: 'https://github.com/josphatmuteru/supabase-keep-alive' });
        });
    }
    
    // Add initial URL field if none exist
    const urlList = document.getElementById('urlList');
    if (urlList.children.length === 0) {
        addUrlField();
    }
});

async function loadSettings() {
    const settings = await chrome.storage.sync.get(['enabled', 'pingInterval', 'urls']);
    
    document.getElementById('enabled').checked = settings.enabled !== false;
    document.getElementById('pingInterval').value = settings.pingInterval || 1440; // Default 24 hours
    
    const urlList = document.getElementById('urlList');
    urlList.innerHTML = '';
    
    if (settings.urls && settings.urls.length > 0) {
        settings.urls.forEach(urlData => {
            if (typeof urlData === 'string') {
                addUrlField(urlData, '', '');
            } else {
                addUrlField(urlData.url || '', urlData.name || '', urlData.apiKey || '');
            }
        });
    }
}

function addUrlField(url = '', name = '', apiKey = '') {
    const urlList = document.getElementById('urlList');
    const urlItem = document.createElement('div');
    urlItem.className = 'url-item';
    
    urlItem.innerHTML = `
        <input type="text" placeholder="Display name (optional)" value="${name}" class="url-name">
        <input type="text" placeholder="https://your-project.supabase.co/rest/v1/users" value="${url}" class="url-input">
        <input type="password" placeholder="Supabase anon key (optional)" value="${apiKey}" class="api-key-input">
        <button type="button" class="remove-url-btn">Remove</button>
        <div class="url-validation-message"></div>
    `;
    
    // Add real-time URL validation
    const urlInput = urlItem.querySelector('.url-input');
    const validationMessage = urlItem.querySelector('.url-validation-message');
    
    urlInput.addEventListener('input', () => {
        validateUrlField(urlInput, validationMessage);
    });
    
    // Add event listener to the remove button
    const removeBtn = urlItem.querySelector('.remove-url-btn');
    removeBtn.addEventListener('click', () => {
        urlItem.remove();
    });
    
    // Validate initial URL if provided
    if (url) {
        validateUrlField(urlInput, validationMessage);
    }
    
    urlList.appendChild(urlItem);
}

function validateUrlField(urlInput, validationMessage) {
    const url = urlInput.value.trim();
    
    if (!url) {
        urlInput.classList.remove('valid', 'invalid');
        validationMessage.textContent = '';
        validationMessage.className = 'url-validation-message';
        return false;
    }
    
    try {
        const urlObj = new URL(url);
        if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
            urlInput.classList.remove('invalid');
            urlInput.classList.add('valid');
            validationMessage.innerHTML = `
                <svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: #10b981; margin-right: 4px;">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                Valid URL (${urlObj.hostname})
            `;
            validationMessage.className = 'url-validation-message validation-success';
            return true;
        } else {
            throw new Error('Only HTTP and HTTPS URLs are supported');
        }
    } catch (error) {
        urlInput.classList.remove('valid');
        urlInput.classList.add('invalid');
        validationMessage.innerHTML = `
            <svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: #ef4444; margin-right: 4px;">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            ${error.message}
        `;
        validationMessage.className = 'url-validation-message validation-error';
        return false;
    }
}


async function saveSettings() {
    const enabled = document.getElementById('enabled').checked;
    const pingInterval = parseInt(document.getElementById('pingInterval').value);
    
    // Collect URLs
    const urlItems = document.querySelectorAll('.url-item');
    const urls = [];
    
    urlItems.forEach((item, index) => {
        const nameInput = item.querySelector('.url-name');
        const urlInput = item.querySelector('.url-input');
        const apiKeyInput = item.querySelector('.api-key-input');
        
        if (!nameInput || !urlInput || !apiKeyInput) {
            return;
        }
        
        const name = nameInput.value.trim();
        const url = urlInput.value.trim();
        const apiKey = apiKeyInput.value.trim();
        
        if (url && url.length > 0) {
            let displayName = name;
            if (!displayName) {
                try {
                    displayName = new URL(url).hostname;
                } catch (e) {
                    displayName = url;
                }
            }
            urls.push({
                name: displayName,
                url: url,
                apiKey: apiKey || null
            });
        }
    });
    
    // Validate all URLs before saving
    const validUrls = [];
    const invalidUrls = [];
    
    for (const urlData of urls) {
        try {
            const urlObj = new URL(urlData.url);
            if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
                validUrls.push(urlData);
            } else {
                invalidUrls.push(urlData.name);
            }
        } catch (e) {
            invalidUrls.push(urlData.name);
        }
    }
    
    if (invalidUrls.length > 0) {
        showStatus(`Please fix invalid URLs: ${invalidUrls.join(', ')}`, 'error');
        return;
    }
    
    // Check if all URLs are properly validated
    let hasInvalidUrls = false;
    urlItems.forEach(item => {
        const urlInput = item.querySelector('.url-input');
        if (urlInput.value.trim() && urlInput.classList.contains('invalid')) {
            hasInvalidUrls = true;
        }
    });
    
    if (hasInvalidUrls) {
        showStatus('Please fix the invalid URLs highlighted in red before saving.', 'error');
        return;
    }
    
    // Check for duplicate URLs
    const urlSet = new Set();
    const duplicateUrls = [];
    for (const urlData of validUrls) {
        if (urlSet.has(urlData.url)) {
            duplicateUrls.push(urlData.name);
        } else {
            urlSet.add(urlData.url);
        }
    }
    
    if (duplicateUrls.length > 0) {
        showStatus(`Duplicate URLs found: ${duplicateUrls.join(', ')}. Please remove duplicates.`, 'error');
        return;
    }
    
    // Save settings
    try {
        await chrome.storage.sync.set({
            enabled: enabled,
            pingInterval: pingInterval,
            urls: validUrls
        });
        
        showStatus('Settings saved successfully!', 'success');
    } catch (error) {
        showStatus(`Error saving settings: ${error.message}`, 'error');
        return;
    }
    
    // Clear old results and reload after saving
    setTimeout(async () => {
        await chrome.storage.local.remove(['lastPingResults', 'lastPingTime']);
        loadLastResults();
    }, 500);
}

async function testPingNow() {
    showStatus('Testing pings...', 'success');
    
    try {
        const response = await chrome.runtime.sendMessage({ action: 'pingNow' });
        if (response && response.success) {
            showStatus('Test pings completed! Check results below.', 'success');
            // Reload results after a short delay
            setTimeout(() => {
                loadLastResults();
            }, 1000);
        } else {
            showStatus('Failed to trigger test pings', 'error');
        }
    } catch (error) {
        showStatus(`Error: ${error.message}`, 'error');
    }
}

async function loadLastResults() {
    try {
        const response = await chrome.runtime.sendMessage({ action: 'getLastResults' });
        if (!response) {
            return;
        }
        const { lastPingResults, lastPingTime } = response;
        
        const resultsDiv = document.getElementById('lastResults');
        
        if (!lastPingResults || lastPingResults.length === 0) {
            resultsDiv.innerHTML = '<p class="help-text">No ping results available yet.</p>';
            return;
        }
        
        const lastPingDate = new Date(lastPingTime).toLocaleString();
        
        let html = `<p><strong>Last ping: ${lastPingDate}</strong></p>`;
        
        lastPingResults.forEach(result => {
            const statusIcon = result.success ? 
                `<svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: #10b981;">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>` : 
                `<svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: #ef4444;">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>`;
            const statusText = result.success ? `Success (${result.status})` : `Failed`;
            const errorText = result.error ? ` - ${result.error}` : '';
            
            html += `
                <div style="margin: 5px 0; padding: 8px; background: ${result.success ? '#f0f9ff' : '#fef2f2'}; border-radius: 4px; font-size: 14px;">
                    ${statusIcon} <strong>${result.name}</strong><br>
                    <span style="color: #666; font-size: 12px;">${result.url}</span><br>
                    <span style="color: ${result.success ? '#059669' : '#dc2626'};">${statusText}${errorText}</span>
                </div>
            `;
        });
        
        resultsDiv.innerHTML = html;
        
    } catch (error) {
        document.getElementById('lastResults').innerHTML = '<p class="help-text">Error loading results.</p>';
    }
}

function showStatus(message, type) {
    const statusDiv = document.getElementById('status');
    statusDiv.innerHTML = `<div class="status-message status-${type}">${message}</div>`;
    
    // Clear status after 5 seconds
    setTimeout(() => {
        statusDiv.innerHTML = '';
    }, 5000);
}

