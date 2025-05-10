// public/js/utils.js

export function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  
  export function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  
  export async function postData(endpoint, payload) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      //console.log('POST', endpoint, '→', await res.json());
    } catch (err) {
      console.error('Save error', err);
    }
  }
  