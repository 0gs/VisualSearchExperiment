// utils.js

// if ever needed
export function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  
  // random pick
  export function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  
  // send data
  export async function postData(endpoint, payload) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error('Save error', err);
    }
  }
  