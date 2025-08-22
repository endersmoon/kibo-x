// Firebase Firestore service functions for the candidate tracking system
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from './firebase';

// Collection names
const COLLECTIONS = {
  REQUISITIONS: 'requisitions',
  CANDIDATES: 'candidates',
};

// Helper function to get current user ID
const getCurrentUserId = () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User must be authenticated to perform this action');
  }
  return user.uid;
};

// ===== REQUISITIONS SERVICES =====

export const requisitionServices = {
  // Get all requisitions for current user
  async getAll() {
    try {
      const userId = getCurrentUserId();
      const requisitionsRef = collection(db, COLLECTIONS.REQUISITIONS);
      
      // Try with ordering first, fall back to simple query if index doesn't exist
      let querySnapshot;
      try {
        const q = query(
          requisitionsRef, 
          where('user_id', '==', userId),
          orderBy('created_at', 'desc')
        );
        querySnapshot = await getDocs(q);
      } catch (indexError) {
        console.warn('Composite index not available, using simple query:', indexError.message);
        // Fallback to query without ordering
        const q = query(requisitionsRef, where('user_id', '==', userId));
        querySnapshot = await getDocs(q);
      }
      
      const requisitions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate?.()?.toISOString() || doc.data().created_at,
        updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || doc.data().updated_at,
      }));
      
      // Sort client-side if we couldn't sort server-side
      return requisitions.sort((a, b) => {
        const dateA = new Date(a.created_at || a.created_date || 0);
        const dateB = new Date(b.created_at || b.created_date || 0);
        return dateB - dateA;
      });
    } catch (error) {
      console.error('Error fetching requisitions:', error);
      throw error;
    }
  },

  // Get requisition by ID (with user verification)
  async getById(id) {
    try {
      const userId = getCurrentUserId();
      const docRef = doc(db, COLLECTIONS.REQUISITIONS, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Verify the requisition belongs to the current user
        if (data.user_id !== userId) {
          throw new Error('Access denied: This requisition does not belong to you');
        }
        return {
          id: docSnap.id,
          ...data,
          created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at,
          updated_at: data.updated_at?.toDate?.()?.toISOString() || data.updated_at,
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching requisition:', error);
      throw error;
    }
  },

  // Add new requisition
  async add(requisitionData) {
    try {
      const userId = getCurrentUserId();
      const requisitionsRef = collection(db, COLLECTIONS.REQUISITIONS);
      const newRequisition = {
        ...requisitionData,
        user_id: userId,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      };
      
      const docRef = await addDoc(requisitionsRef, newRequisition);
      
      // Return the new requisition with its ID
      return {
        id: docRef.id,
        ...requisitionData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error adding requisition:', error);
      throw error;
    }
  },

  // Update requisition
  async update(id, updates) {
    try {
      const docRef = doc(db, COLLECTIONS.REQUISITIONS, id);
      const updateData = {
        ...updates,
        updated_at: serverTimestamp(),
      };
      
      await updateDoc(docRef, updateData);
      
      // Return the updated requisition
      return await this.getById(id);
    } catch (error) {
      console.error('Error updating requisition:', error);
      throw error;
    }
  },

  // Delete requisition
  async delete(id) {
    try {
      const docRef = doc(db, COLLECTIONS.REQUISITIONS, id);
      await deleteDoc(docRef);
      return id;
    } catch (error) {
      console.error('Error deleting requisition:', error);
      throw error;
    }
  },

  // Subscribe to requisitions changes
  subscribe(callback) {
    const requisitionsRef = collection(db, COLLECTIONS.REQUISITIONS);
    const q = query(requisitionsRef, orderBy('created_at', 'desc'));
    
    return onSnapshot(q, (querySnapshot) => {
      const requisitions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate?.()?.toISOString() || doc.data().created_at,
        updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || doc.data().updated_at,
      }));
      callback(requisitions);
    }, (error) => {
      console.error('Error in requisitions subscription:', error);
    });
  },
};

// ===== CANDIDATES SERVICES =====

export const candidateServices = {
  // Get all candidates for current user
  async getAll() {
    try {
      const userId = getCurrentUserId();
      const candidatesRef = collection(db, COLLECTIONS.CANDIDATES);
      
      // Try with ordering first, fall back to simple query if index doesn't exist
      let querySnapshot;
      try {
        const q = query(
          candidatesRef, 
          where('user_id', '==', userId),
          orderBy('created_at', 'desc')
        );
        querySnapshot = await getDocs(q);
      } catch (indexError) {
        console.warn('Composite index not available, using simple query:', indexError.message);
        // Fallback to query without ordering
        const q = query(candidatesRef, where('user_id', '==', userId));
        querySnapshot = await getDocs(q);
      }
      
      const candidates = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate?.()?.toISOString() || doc.data().created_at,
        updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || doc.data().updated_at,
      }));
      
      // Sort client-side if we couldn't sort server-side
      return candidates.sort((a, b) => {
        const dateA = new Date(a.created_at || a.applied_date || 0);
        const dateB = new Date(b.created_at || b.applied_date || 0);
        return dateB - dateA;
      });
    } catch (error) {
      console.error('Error fetching candidates:', error);
      throw error;
    }
  },

  // Get candidates by requisition ID for current user
  async getByRequisitionId(requisitionId) {
    try {
      const userId = getCurrentUserId();
      const candidatesRef = collection(db, COLLECTIONS.CANDIDATES);
      
      // Try with ordering first, fall back to simple query if index doesn't exist
      let querySnapshot;
      try {
        const q = query(
          candidatesRef,
          where('user_id', '==', userId),
          where('requisition_id', '==', requisitionId),
          orderBy('created_at', 'desc')
        );
        querySnapshot = await getDocs(q);
      } catch (indexError) {
        console.warn('Composite index not available, using simple query:', indexError.message);
        // Fallback to query without ordering
        const q = query(
          candidatesRef,
          where('user_id', '==', userId),
          where('requisition_id', '==', requisitionId)
        );
        querySnapshot = await getDocs(q);
      }
      
      const candidates = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate?.()?.toISOString() || doc.data().created_at,
        updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || doc.data().updated_at,
      }));
      
      // Sort client-side if we couldn't sort server-side
      return candidates.sort((a, b) => {
        const dateA = new Date(a.created_at || a.applied_date || 0);
        const dateB = new Date(b.created_at || b.applied_date || 0);
        return dateB - dateA;
      });
    } catch (error) {
      console.error('Error fetching candidates by requisition:', error);
      throw error;
    }
  },

  // Get candidate by ID
  async getById(id) {
    try {
      const docRef = doc(db, COLLECTIONS.CANDIDATES, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at,
          updated_at: data.updated_at?.toDate?.()?.toISOString() || data.updated_at,
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching candidate:', error);
      throw error;
    }
  },

  // Add new candidate
  async add(candidateData) {
    try {
      const userId = getCurrentUserId();
      const candidatesRef = collection(db, COLLECTIONS.CANDIDATES);
      const newCandidate = {
        ...candidateData,
        user_id: userId,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      };
      
      const docRef = await addDoc(candidatesRef, newCandidate);
      
      // Return the new candidate with its ID
      return {
        id: docRef.id,
        ...candidateData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error adding candidate:', error);
      throw error;
    }
  },

  // Update candidate
  async update(id, updates) {
    try {
      const docRef = doc(db, COLLECTIONS.CANDIDATES, id);
      const updateData = {
        ...updates,
        updated_at: serverTimestamp(),
      };
      
      await updateDoc(docRef, updateData);
      
      // Return the updated candidate
      return await this.getById(id);
    } catch (error) {
      console.error('Error updating candidate:', error);
      throw error;
    }
  },

  // Update candidate stage
  async updateStage(id, newStage) {
    try {
      const docRef = doc(db, COLLECTIONS.CANDIDATES, id);
      await updateDoc(docRef, {
        current_stage: newStage,
        updated_at: serverTimestamp(),
      });
      
      return await this.getById(id);
    } catch (error) {
      console.error('Error updating candidate stage:', error);
      throw error;
    }
  },

  // Update multiple candidates (for drag and drop operations)
  async updateMultiple(candidateUpdates) {
    try {
      const batch = writeBatch(db);
      
      candidateUpdates.forEach(({ id, updates }) => {
        if (!id || !updates) {
          console.warn('Invalid candidate update format:', { id, updates });
          return;
        }
        
        // Filter out undefined values to prevent Firestore errors
        const cleanUpdates = Object.fromEntries(
          Object.entries(updates).filter(([key, value]) => value !== undefined)
        );
        
        const docRef = doc(db, COLLECTIONS.CANDIDATES, id);
        batch.update(docRef, {
          ...cleanUpdates,
          updated_at: serverTimestamp(),
        });
      });
      
      await batch.commit();
      
      // Return updated candidates
      const updatedCandidates = await Promise.all(
        candidateUpdates.map(({ id }) => this.getById(id))
      );
      
      return updatedCandidates;
    } catch (error) {
      console.error('Error updating multiple candidates:', error);
      throw error;
    }
  },

  // Delete candidate
  async delete(id) {
    try {
      const docRef = doc(db, COLLECTIONS.CANDIDATES, id);
      await deleteDoc(docRef);
      return id;
    } catch (error) {
      console.error('Error deleting candidate:', error);
      throw error;
    }
  },

  // Subscribe to candidates changes
  subscribe(callback, requisitionId = null) {
    const candidatesRef = collection(db, COLLECTIONS.CANDIDATES);
    let q;
    
    if (requisitionId) {
      q = query(
        candidatesRef,
        where('requisition_id', '==', requisitionId),
        orderBy('created_at', 'desc')
      );
    } else {
      q = query(candidatesRef, orderBy('created_at', 'desc'));
    }
    
    return onSnapshot(q, (querySnapshot) => {
      const candidates = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate?.()?.toISOString() || doc.data().created_at,
        updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || doc.data().updated_at,
      }));
      callback(candidates);
    }, (error) => {
      console.error('Error in candidates subscription:', error);
    });
  },
};

// ===== BULK OPERATIONS =====

export const bulkOperations = {
  // Initialize database with sample data for current user
  async initializeWithSampleData(requisitions, candidates) {
    try {
      const userId = getCurrentUserId();
      const batch = writeBatch(db);
      
      // Add requisitions with user_id
      requisitions.forEach((requisition) => {
        const requisitionRef = doc(collection(db, COLLECTIONS.REQUISITIONS), `${userId}_${requisition.id}`);
        batch.set(requisitionRef, {
          ...requisition,
          user_id: userId,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        });
      });
      
      // Add candidates with user_id
      candidates.forEach((candidate) => {
        const candidateRef = doc(collection(db, COLLECTIONS.CANDIDATES), `${userId}_${candidate.id}`);
        batch.set(candidateRef, {
          ...candidate,
          user_id: userId,
          // Update requisition_id to match the new format
          requisition_id: `${userId}_${candidate.requisition_id}`,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        });
      });
      
      await batch.commit();
      console.log('Sample data initialized successfully for user:', userId);
    } catch (error) {
      console.error('Error initializing sample data:', error);
      throw error;
    }
  },

  // Clear all data (useful for development/testing)
  async clearAllData() {
    try {
      const batch = writeBatch(db);
      
      // Get all requisitions and candidates
      const [requisitionsSnapshot, candidatesSnapshot] = await Promise.all([
        getDocs(collection(db, COLLECTIONS.REQUISITIONS)),
        getDocs(collection(db, COLLECTIONS.CANDIDATES)),
      ]);
      
      // Delete all requisitions
      requisitionsSnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      // Delete all candidates
      candidatesSnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      console.log('All data cleared successfully');
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  },
};

// Export default services object
export default {
  requisitions: requisitionServices,
  candidates: candidateServices,
  bulk: bulkOperations,
};
