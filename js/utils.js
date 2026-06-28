/**
 * ═══════════════════════════════════════════════════════
 * JanVikas AI — Utilities Module
 * Category: Helper Library
 * ═══════════════════════════════════════════════════════
 */

export const Utils = {
  /**
   * Format budget numbers as Indian Rupees (Cr / Lakh)
   * @param {number|string} val
   * @returns {string}
   */
  formatCurrency(val) {
    if (typeof val === 'string' && (val.includes('₹') || val.includes('Cr'))) {
      return val;
    }
    const num = Number(val);
    if (isNaN(num)) return '₹0 Cr';
    if (num >= 100) {
      return `₹${(num / 100).toFixed(2).replace(/\.00$/, '')} Cr`;
    }
    return `₹${num} L`;
  },

  /**
   * Format timestamp to IST human readable format
   * @param {Date|string|number} date
   * @returns {string}
   */
  formatDateTime(date) {
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Just Now';
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(d.getDate())} ${months[d.getMonth()]} ${d.getFullYear()} · ${pad(d.getHours())}:${pad(d.getMinutes())} IST`;
  },

  /**
   * Simple debounce implementation for high-frequency events (inputs, window resize)
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Safe HTML escaping to prevent XSS injection
   */
  escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  },

  /**
   * Generate lightweight UUID-like strings for offline sync tracking
   */
  generateUUID() {
    return 'jv-' + Math.random().toString(36).substring(2, 15) + '-' + Date.now().toString(36);
  },

  /**
   * Dynamic clock updater
   */
  initClock(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const update = () => {
      const now = new Date();
      const options = { day: '2-digit', month: 'short', year: 'numeric' };
      const dateStr = now.toLocaleDateString('en-IN', options).replace(/,/g, '');
      const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
      el.textContent = `${dateStr} · ${timeStr} IST`;
    };
    update();
    setInterval(update, 1000);
  },

  /**
   * Track network availability and notify callbacks
   */
  monitorConnectivity(onStatusChange) {
    const handleStatus = () => {
      onStatusChange(navigator.onLine);
    };
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    // Initial call
    onStatusChange(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }
};
