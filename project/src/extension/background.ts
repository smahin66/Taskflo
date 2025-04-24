import browser from 'webextension-polyfill';

interface BlockedResource {
  id: string;
  url: string;
  type: 'website' | 'application';
}

let blockedResources: BlockedResource[] = [];
let isBlocking = false;

// Listen for messages from the React app
browser.runtime.onMessage.addListener((message) => {
  if (message.type === 'UPDATE_BLOCKED_RESOURCES') {
    blockedResources = message.resources;
    isBlocking = message.isBlocking;
    console.log('Updated blocked resources:', blockedResources);
    console.log('Blocking status:', isBlocking);
  }
});

// Block requests to blocked websites
browser.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (!isBlocking) {
      return { cancel: false };
    }

    try {
      const url = new URL(details.url);
      const isBlocked = blockedResources.some(resource => {
        if (resource.type !== 'website') return false;
        
        // Remove protocol and www from URLs for comparison
        const resourceUrl = resource.url.toLowerCase()
          .replace(/^https?:\/\//, '')
          .replace(/^www\./, '');
        
        const requestUrl = url.hostname.toLowerCase()
          .replace(/^www\./, '');
        
        return requestUrl.includes(resourceUrl);
      });

      if (isBlocked) {
        return { redirectUrl: chrome.runtime.getURL('blocked.html') };
      }
    } catch (error) {
      console.error('Error in onBeforeRequest:', error);
    }

    return { cancel: false };
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);