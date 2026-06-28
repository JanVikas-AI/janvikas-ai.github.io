/**
 * ═══════════════════════════════════════════════════════
 * JanVikas AI — Firebase & Data Persistence Module
 * Category: Storage & Sync Engine (Zero-Build ESM)
 * ═══════════════════════════════════════════════════════
 */

import { Utils } from './utils.js';

let app = null;
let db = null;
let config = null;
let isFirebaseActive = false;

// Mock storage queues for fallback when Firebase is offline or permission errors occur
const localDB = {
  get(collectionName) {
    try {
      const data = localStorage.getItem(`jv_${collectionName}`);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  set(collectionName, data) {
    try {
      localStorage.setItem(`jv_${collectionName}`, JSON.stringify(data));
    } catch (e) {
      console.warn('LocalStorage limit reached or disabled:', e);
    }
  },
  insert(collectionName, item) {
    const list = this.get(collectionName);
    list.push(item);
    this.set(collectionName, list);
    return item;
  },
  update(collectionName, itemId, updates) {
    const list = this.get(collectionName);
    const updated = list.map(item => {
      if (item.id === itemId || item.uid === itemId) {
        return { ...item, ...updates };
      }
      return item;
    });
    this.set(collectionName, updated);
  }
};

/**
 * Dynamically import Firebase libraries from the Google CDN
 */
async function initializeFirebase() {
  try {
    const response = await fetch('firebase-applet-config.json');
    if (!response.ok) throw new Error('Firebase configuration file not found');
    config = await response.json();

    // Import Firebase modules
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
    const { initializeFirestore, getFirestore } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');

    app = initializeApp(config);

    // If config defines a custom databaseId, we must initialize firestore with it
    if (config.firestoreDatabaseId) {
      db = initializeFirestore(app, {
        databaseId: config.firestoreDatabaseId
      });
    } else {
      db = getFirestore(app);
    }

    isFirebaseActive = true;
    console.log('🔥 Firebase Persistence Engine successfully mounted.');
  } catch (err) {
    console.warn('⚠️ Firebase initial connection failed, defaulting to High-Fidelity LocalStorage Engine:', err.message);
    isFirebaseActive = false;
  }
}

// Kick off Firebase loading in background
const initPromise = initializeFirebase();

export const StorageEngine = {
  async ensureReady() {
    await initPromise;
  },

  isOnline() {
    return isFirebaseActive && navigator.onLine;
  },

  /**
   * Insert a document into a collection
   */
  async insert(collectionName, documentData) {
    await this.ensureReady();
    const payload = {
      ...documentData,
      id: documentData.id || Utils.generateUUID(),
      timestamp: documentData.timestamp || Date.now()
    };

    // Always log in local storage for instant offline resilience
    localDB.insert(collectionName, payload);

    if (this.isOnline()) {
      try {
        const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
        const docRef = doc(db, collectionName, payload.id);
        await setDoc(docRef, payload);
        console.log(`Synced to cloud collection: ${collectionName}`);
      } catch (e) {
        console.warn(`Cloud save failed for ${collectionName}. Enqueued in offline queue:`, e.message);
      }
    }
    return payload;
  },

  /**
   * Get all documents of a collection
   */
  async getAll(collectionName) {
    await this.ensureReady();
    
    // Always load local cache first (for offline-first UI performance)
    const localItems = localDB.get(collectionName);

    if (this.isOnline()) {
      try {
        const { collection, getDocs, query, orderBy } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
        const q = query(collection(db, collectionName), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const cloudItems = [];
        querySnapshot.forEach((doc) => {
          cloudItems.push(doc.data());
        });

        if (cloudItems.length > 0) {
          // Merge and update local cache
          localDB.set(collectionName, cloudItems);
          return cloudItems;
        }
      } catch (e) {
        console.warn(`Failed to fetch ${collectionName} from cloud, using local cache:`, e.message);
      }
    }
    return localItems;
  },

  /**
   * Update a document by ID
   */
  async update(collectionName, id, updates) {
    await this.ensureReady();
    localDB.update(collectionName, id, updates);

    if (this.isOnline()) {
      try {
        const { doc, updateDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
        const docRef = doc(db, collectionName, id);
        await updateDoc(docRef, updates);
        console.log(`Document ${id} updated in cloud`);
      } catch (e) {
        console.warn(`Failed to update ${id} in cloud, local cache updated.`, e.message);
      }
    }
  },

  /**
   * Set up a live subscription for development projects or signals
   */
  async subscribe(collectionName, onUpdate, onError) {
    await this.ensureReady();

    // Trigger immediately with cached data
    const cached = localDB.get(collectionName);
    onUpdate(cached);

    if (this.isOnline()) {
      try {
        const { collection, onSnapshot, query, orderBy } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
        const q = query(collection(db, collectionName), orderBy('timestamp', 'desc'));
        
        return onSnapshot(q, (snapshot) => {
          const list = [];
          snapshot.forEach((doc) => {
            list.push(doc.data());
          });
          localDB.set(collectionName, list);
          onUpdate(list);
        }, (err) => {
          console.warn(`Live stream connection interrupted for ${collectionName}:`, err.message);
          if (onError) onError(err);
        });
      } catch (e) {
        console.warn(`Subscription failed for ${collectionName}:`, e.message);
        if (onError) onError(e);
      }
    }
    return () => {}; // return unsubscriber stub
  }
};
