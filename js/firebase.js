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
    const { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');

    app = initializeApp(config);

    // Initialize Firestore with persistent multi-tab local cache for robust multi-device offline persistence
    const firestoreConfig = {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
      })
    };
    if (config.firestoreDatabaseId) {
      firestoreConfig.databaseId = config.firestoreDatabaseId;
    }
    db = initializeFirestore(app, firestoreConfig);

    isFirebaseActive = true;
    console.log('🔥 Firebase Persistence Engine successfully mounted with multi-tab offline cache.');
  } catch (err) {
    console.warn('⚠️ Firebase initial connection failed, defaulting to High-Fidelity LocalStorage Engine:', err.message);
    isFirebaseActive = false;
  }
}

// Kick off Firebase loading in background
const initPromise = initializeFirebase().then(() => {
  // Try syncing pending records if online
  if (isFirebaseActive && navigator.onLine) {
    StorageEngine.syncPendingRecords().catch(err => {
      console.warn('Initial syncPendingRecords failed:', err);
    });
  }
});

// Sync pending records on online event
window.addEventListener('online', () => {
  if (isFirebaseActive) {
    StorageEngine.syncPendingRecords().catch(err => {
      console.warn('Online syncPendingRecords failed:', err);
    });
  }
});

export const StorageEngine = {
  async ensureReady() {
    await initPromise;
  },

  isOnline() {
    return isFirebaseActive && navigator.onLine;
  },

  /**
   * Sync pending records from LocalStorage to Firestore once online
   */
  async syncPendingRecords() {
    await this.ensureReady();
    if (!isFirebaseActive || !navigator.onLine) return;

    try {
      const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
      const collectionsToSync = ['citizenSignals'];
      
      for (const col of collectionsToSync) {
        const localItems = localDB.get(col);
        const pendingItems = localItems.filter(item => item.pendingSync);
        
        if (pendingItems.length === 0) continue;
        console.log(`Found ${pendingItems.length} pending records to synchronize for ${col}`);
        
        for (const item of pendingItems) {
          const docRef = doc(db, col, item.id);
          // Create an upload payload without pendingSync
          const uploadItem = { ...item };
          delete uploadItem.pendingSync;
          
          await setDoc(docRef, uploadItem);
          // Mark as synchronized locally
          localDB.update(col, item.id, { pendingSync: false });
          console.log(`Successfully synchronized pending record ${item.id} to cloud`);
        }
      }
    } catch (err) {
      console.warn("Failed to synchronize pending records:", err.message);
    }
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

    const broadcastUpdate = () => {
      if (window.BroadcastChannel) {
        try {
          const bc = new BroadcastChannel('janvikas_channel');
          bc.postMessage({ type: 'update', collectionName, id: payload.id });
          bc.close();
        } catch (bcErr) {
          console.warn('BroadcastChannel sync failed:', bcErr);
        }
      }
    };

    if (isFirebaseActive && navigator.onLine) {
      try {
        const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
        const docRef = doc(db, collectionName, payload.id);
        
        // Wait for successful Firestore write
        await setDoc(docRef, payload);
        console.log(`Synced to cloud collection: ${collectionName}`);
        
        // Save to local storage for local cache & synchronization across other tabs
        localDB.insert(collectionName, payload);
        broadcastUpdate();
        
        return { success: true, payload, synced: true };
      } catch (e) {
        console.warn(`Firestore write failed for ${collectionName}:`, e.message);
        // Check if it's a network/offline error that we should treat as offline
        const isOffline = !navigator.onLine || e.name === 'FirebaseError' && (
          e.code === 'unavailable' || 
          e.message?.toLowerCase().includes('network') || 
          e.message?.toLowerCase().includes('offline') || 
          e.message?.toLowerCase().includes('could not reach')
        );
        if (isOffline) {
          const localPayload = { ...payload, pendingSync: true };
          localDB.insert(collectionName, localPayload);
          broadcastUpdate();
          return { success: true, payload: localPayload, synced: false, offline: true };
        } else {
          // genuine error (permission denied, validation, etc.), let it propagate
          throw e;
        }
      }
    } else {
      // Firebase inactive or client offline
      const localPayload = { ...payload, pendingSync: true };
      localDB.insert(collectionName, localPayload);
      broadcastUpdate();
      return { success: true, payload: localPayload, synced: false, offline: true };
    }
  },

  /**
   * Get all documents of a collection
   */
  async getAll(collectionName) {
    await this.ensureReady();
    
    // Always load local cache first (for offline-first UI performance)
    const localItems = localDB.get(collectionName);

    if (isFirebaseActive) {
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

    // Broadcast synchronization message for multi-tab synchronization
    if (window.BroadcastChannel) {
      try {
        const bc = new BroadcastChannel('janvikas_channel');
        bc.postMessage({ type: 'update', collectionName, id });
        bc.close();
      } catch (bcErr) {
        console.warn('BroadcastChannel sync failed:', bcErr);
      }
    }

    if (isFirebaseActive) {
      try {
        const { doc, getDoc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
        const docRef = doc(db, collectionName, id);
        
        // Read existing first to merge conflicts securely, then update
        const docSnap = await getDoc(docRef);
        let finalData = { ...updates };
        if (docSnap.exists()) {
          finalData = { ...docSnap.data(), ...updates };
        }
        await setDoc(docRef, finalData, { merge: true });
        console.log(`Document ${id} updated in cloud with automatic merge conflict resolution`);
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

    let unsubscribed = false;

    // Local multi-tab and multi-window event listener setup
    const bcListener = (event) => {
      if (unsubscribed) return;
      if (event.data && event.data.collectionName === collectionName) {
        const latest = localDB.get(collectionName);
        onUpdate(latest);
      }
    };

    let bc = null;
    if (window.BroadcastChannel) {
      try {
        bc = new BroadcastChannel('janvikas_channel');
        bc.addEventListener('message', bcListener);
      } catch (bcErr) {
        console.warn('BroadcastChannel registration failed:', bcErr);
      }
    }

    const storageListener = (event) => {
      if (unsubscribed) return;
      // localStorage is saved as 'jv_${collectionName}' in localDB implementation
      if (event.key === `jv_${collectionName}`) {
        const latest = localDB.get(collectionName);
        onUpdate(latest);
      }
    };
    window.addEventListener('storage', storageListener);

    let cloudUnsubscribe = () => {};

    if (isFirebaseActive) {
      try {
        const { collection, onSnapshot, query, orderBy } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
        const q = query(collection(db, collectionName), orderBy('timestamp', 'desc'));
        
        cloudUnsubscribe = onSnapshot(q, (snapshot) => {
          if (unsubscribed) return;
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

    return () => {
      unsubscribed = true;
      if (bc) {
        try {
          bc.removeEventListener('message', bcListener);
          bc.close();
        } catch (bcErr) {
          console.warn('BroadcastChannel teardown failed:', bcErr);
        }
      }
      window.removeEventListener('storage', storageListener);
      cloudUnsubscribe();
    };
  }
};
