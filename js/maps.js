/**
 * ═══════════════════════════════════════════════════════
 * JanVikas AI — Map Visualization Module
 * Category: Geographical GIS Interface
 * ═══════════════════════════════════════════════════════
 */

export const MapEngine = {
  _map: null,
  _markers: [],

  /**
   * Inject dark mode map styling to match the OLED Glassmorphic theme
   */
  _injectMapStyles() {
    if (document.getElementById('jv-map-dark-styles')) return;
    const style = document.createElement('style');
    style.id = 'jv-map-dark-styles';
    style.innerHTML = `
      .leaflet-container {
        background: #070b14 !important;
        font-family: 'Inter', sans-serif;
      }
      .leaflet-tile-pane {
        filter: invert(95%) hue-rotate(180deg) brightness(90%) contrast(90%);
      }
      .leaflet-bar {
        border: 1px solid rgba(255, 255, 255, 0.08) !important;
        background: rgba(13, 20, 35, 0.85) !important;
        backdrop-filter: blur(10px);
        box-shadow: none !important;
        border-radius: 6px !important;
        overflow: hidden;
      }
      .leaflet-bar a {
        background: transparent !important;
        border-color: rgba(255, 255, 255, 0.08) !important;
        color: #94a3b8 !important;
        transition: all 0.2s;
      }
      .leaflet-bar a:hover {
        color: #ffffff !important;
        background: rgba(255, 255, 255, 0.05) !important;
      }
      .leaflet-popup-content-wrapper {
        background: rgba(13, 20, 35, 0.95) !important;
        backdrop-filter: blur(20px);
        border: 1px solid rgba(99, 102, 241, 0.2) !important;
        border-radius: 8px !important;
        color: #f1f5f9 !important;
        padding: 6px;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5) !important;
      }
      .leaflet-popup-tip {
        background: rgba(13, 20, 35, 0.95) !important;
        border: 1px solid rgba(99, 102, 241, 0.2) !important;
      }
      .leaflet-popup-content {
        margin: 12px 14px !important;
        line-height: 1.4 !important;
        font-size: 12px !important;
      }
    `;
    document.head.appendChild(style);
  },

  /**
   * Helper to get severity colors
   */
  _getSeverityColor(severity) {
    const map = {
      critical: '#ef4444', // crimson
      high: '#f59e0b',     // amber
      moderate: '#6366f1', // indigo
      good: '#10b981'      // emerald
    };
    return map[severity] || '#6366f1';
  },

  /**
   * Initialize Leaflet map on target element
   * @param {HTMLElement} el
   * @param {Array} initialCoords [lat, lng]
   * @param {number} zoom
   */
  init(el, initialCoords = [22.9734, 78.6569], zoom = 5) {
    if (!el || !window.L) return null;
    this._injectMapStyles();

    this._map = L.map(el, {
      center: initialCoords,
      zoom: zoom,
      zoomControl: true,
      scrollWheelZoom: true,
      maxBounds: [[5, 60], [38, 98]] // Rough bounding box for India
    });

    L.tileLayer('https://{s}.tile.openstreetmap.in/tiles/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OSM</a> | India Map recognized by Govt of India'
    }).addTo(this._map);

    // Fix responsive sizing
    setTimeout(() => { if (this._map) this._map.invalidateSize(); }, 300);
    setTimeout(() => { if (this._map) this._map.invalidateSize(); }, 1000);

    return this._map;
  },

  /**
   * Render suggestions as circle markers
   * @param {Array} suggestions
   * @param {Function} onMarkerClick
   */
  renderMarkers(suggestions, onMarkerClick) {
    if (!this._map || !window.L) return;

    // Clear existing markers
    this._markers.forEach(m => m.remove());
    this._markers = [];

    const bounds = [];

    suggestions.forEach(item => {
      if (!item.lat || !item.lng) return;

      const color = this._getSeverityColor(item.severity);
      const marker = L.circleMarker([item.lat, item.lng], {
        radius: 10,
        fillColor: color,
        color: '#ffffff',
        weight: 1.5,
        opacity: 0.9,
        fillOpacity: 0.8
      }).addTo(this._map);

      // Bind elegant glassmorphic popup
      const popupContent = `
        <div style="font-family:'Inter', sans-serif;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <span style="font-family:'Space Grotesk', sans-serif; font-weight:700; font-size:13px; color:#ffffff;">${item.title}</span>
            <span style="font-family:'JetBrains Mono', monospace; font-size:9px; background:${color}30; color:${color}; padding:2px 6px; border-radius:4px; font-weight:600;">${item.severity.toUpperCase()}</span>
          </div>
          <div style="font-size:11px; color:#94a3b8; margin-bottom:4px;">📍 ${item.city}, ${item.state} (${item.district})</div>
          <div style="font-size:11px; margin-bottom:8px; color:#cbd5e1;">${item.detail || ''}</div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; border-top:1px solid rgba(255,255,255,0.05); padding-top:8px; font-size:10px;">
            <div><span style="color:#64748b;">Scheme:</span> <strong style="color:#6366f1">${item.scheme}</strong></div>
            <div><span style="color:#64748b;">Priority:</span> <strong style="color:#f59e0b">${item.priority}/10</strong></div>
            <div style="grid-column: 1 / -1;"><span style="color:#64748b;">Capital Work:</span> <strong style="color:#10b981">${item.budget}</strong></div>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, { minWidth: 220 });

      if (onMarkerClick) {
        marker.on('click', () => onMarkerClick(item));
      }

      this._markers.push(marker);
      bounds.push([item.lat, item.lng]);
    });

    // Fit map to markers if we have markers
    if (bounds.length > 0) {
      const group = L.featureGroup(this._markers);
      this._map.fitBounds(group.getBounds().pad(0.2), { maxZoom: 7 });
    }
  },

  /**
   * Refit the map viewport to bounds
   */
  refit() {
    if (this._map) {
      this._map.invalidateSize();
    }
  }
};
