import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { sampleRequisitions, sampleCandidates } from './data';
import firebaseServices from './firebase-services';
import { currentUserAtom } from './auth-atoms';

// Data atoms - using Firebase Firestore
export const requisitionsAtom = atom([]);
export const candidatesAtom = atom([]);

// Loading states
export const requisitionsLoadingAtom = atom(false);
export const candidatesLoadingAtom = atom(false);

// Error states
export const requisitionsErrorAtom = atom(null);
export const candidatesErrorAtom = atom(null);

// Firebase synchronization flag
export const isFirebaseConnectedAtom = atom(false);

// UI State atoms
export const currentViewAtom = atom('overview'); // 'overview' or 'kanban'
export const selectedRequisitionAtom = atom(null);
export const selectedCandidateAtom = atom(null);

// Modal state atoms
export const candidateModalOpenAtom = atom(false);
export const addRequisitionModalOpenAtom = atom(false);
export const addCandidateModalOpenAtom = atom(false);

// Form state atoms
export const selectedRequisitionForAddAtom = atom(null);

// Derived atoms for computed values
export const candidatesByRequisitionAtom = atom((get) => {
  const candidates = get(candidatesAtom);
  const selectedRequisition = get(selectedRequisitionAtom);
  
  if (!selectedRequisition) return [];
  
  return candidates.filter(candidate => 
    candidate.requisition_id === selectedRequisition.id
  );
});

export const candidatesWithRequisitionInfoAtom = atom((get) => {
  const candidates = get(candidatesAtom);
  const requisitions = get(requisitionsAtom);
  
  return candidates.map(candidate => {
    const requisition = requisitions.find(req => req.id === candidate.requisition_id);
    return {
      ...candidate,
      requisition_title: requisition?.title || 'Unknown',
      requisition_department: requisition?.department || 'Unknown',
      requisition: requisition
    };
  });
});

// Firebase data loading atoms
export const loadRequisitionsAtom = atom(
  null,
  async (get, set) => {
    try {
      set(requisitionsLoadingAtom, true);
      set(requisitionsErrorAtom, null);
      
      const user = get(currentUserAtom);
      if (!user) {
        // User not authenticated, use sample data
        set(requisitionsAtom, sampleRequisitions);
        return;
      }
      
      const requisitions = await firebaseServices.requisitions.getAll();
      set(requisitionsAtom, requisitions);
      set(isFirebaseConnectedAtom, true);
    } catch (error) {
      console.error('Error loading requisitions:', error);
      set(requisitionsErrorAtom, error.message);
      // Fallback to sample data if Firebase fails
      set(requisitionsAtom, sampleRequisitions);
    } finally {
      set(requisitionsLoadingAtom, false);
    }
  }
);

export const loadCandidatesAtom = atom(
  null,
  async (get, set) => {
    try {
      set(candidatesLoadingAtom, true);
      set(candidatesErrorAtom, null);
      
      const user = get(currentUserAtom);
      if (!user) {
        // User not authenticated, use sample data
        set(candidatesAtom, sampleCandidates);
        return;
      }
      
      const candidates = await firebaseServices.candidates.getAll();
      set(candidatesAtom, candidates);
      set(isFirebaseConnectedAtom, true);
    } catch (error) {
      console.error('Error loading candidates:', error);
      set(candidatesErrorAtom, error.message);
      // Fallback to sample data if Firebase fails
      set(candidatesAtom, sampleCandidates);
    } finally {
      set(candidatesLoadingAtom, false);
    }
  }
);

// Action atoms for data mutations with Firebase
export const addRequisitionAtom = atom(
  null,
  async (get, set, newRequisition) => {
    try {
      set(requisitionsLoadingAtom, true);
      set(requisitionsErrorAtom, null);
      
      const addedRequisition = await firebaseServices.requisitions.add(newRequisition);
      const currentRequisitions = get(requisitionsAtom);
      set(requisitionsAtom, [addedRequisition, ...currentRequisitions]);
      
      return addedRequisition;
    } catch (error) {
      console.error('Error adding requisition:', error);
      set(requisitionsErrorAtom, error.message);
      throw error;
    } finally {
      set(requisitionsLoadingAtom, false);
    }
  }
);

export const addCandidateAtom = atom(
  null,
  async (get, set, newCandidate) => {
    try {
      set(candidatesLoadingAtom, true);
      set(candidatesErrorAtom, null);
      
      const addedCandidate = await firebaseServices.candidates.add(newCandidate);
      const currentCandidates = get(candidatesAtom);
      set(candidatesAtom, [addedCandidate, ...currentCandidates]);
      
      return addedCandidate;
    } catch (error) {
      console.error('Error adding candidate:', error);
      set(candidatesErrorAtom, error.message);
      throw error;
    } finally {
      set(candidatesLoadingAtom, false);
    }
  }
);

export const updateCandidateAtom = atom(
  null,
  async (get, set, updatedCandidate) => {
    try {
      set(candidatesLoadingAtom, true);
      set(candidatesErrorAtom, null);
      
      const updated = await firebaseServices.candidates.update(updatedCandidate.id, updatedCandidate);
      const currentCandidates = get(candidatesAtom);
      const newCandidates = currentCandidates.map(candidate =>
        candidate.id === updated.id ? updated : candidate
      );
      set(candidatesAtom, newCandidates);
      
      return updated;
    } catch (error) {
      console.error('Error updating candidate:', error);
      set(candidatesErrorAtom, error.message);
      throw error;
    } finally {
      set(candidatesLoadingAtom, false);
    }
  }
);

export const updateCandidatesAtom = atom(
  null,
  async (get, set, candidateUpdates) => {
    try {
      set(candidatesLoadingAtom, true);
      set(candidatesErrorAtom, null);
      
      // Transform candidate updates to match expected format for updateMultiple
      // candidateUpdates can be either:
      // 1. Array of full candidate objects (from kanban drag/drop)
      // 2. Array of { id, updates } objects (direct API format)
      const formattedUpdates = candidateUpdates.map(candidate => {
        if (candidate.updates) {
          // Already in { id, updates } format
          return candidate;
        } else {
          // Full candidate object - extract only the fields that should be updated
          const { id, ...updates } = candidate;
          
          // Remove computed/derived fields that shouldn't be saved to Firebase
          const { 
            requisition_title, 
            requisition_department, 
            requisition, 
            ...cleanUpdates 
          } = updates;
          
          return { id, updates: cleanUpdates };
        }
      });
      
      const updatedCandidates = await firebaseServices.candidates.updateMultiple(formattedUpdates);
      const allCandidates = get(candidatesAtom);
      
      // Update candidates in the local state
      const newAllCandidates = allCandidates.map(candidate => {
        const updated = updatedCandidates.find(uc => uc.id === candidate.id);
        return updated || candidate;
      });
      
      set(candidatesAtom, newAllCandidates);
      return updatedCandidates;
    } catch (error) {
      console.error('Error updating candidates:', error);
      set(candidatesErrorAtom, error.message);
      throw error;
    } finally {
      set(candidatesLoadingAtom, false);
    }
  }
);

// Initialize Firebase data atom
export const initializeFirebaseDataAtom = atom(
  null,
  async (get, set) => {
    try {
      const user = get(currentUserAtom);
      
      // First try to load existing data
      await Promise.all([
        set(loadRequisitionsAtom),
        set(loadCandidatesAtom),
      ]);
      
      // If user is authenticated and no data exists, initialize with sample data
      if (user) {
        const requisitions = get(requisitionsAtom);
        const candidates = get(candidatesAtom);
        
        if (requisitions.length === 0 && candidates.length === 0) {
          console.log('No data found for authenticated user, initializing with sample data...');
          await firebaseServices.bulk.initializeWithSampleData(sampleRequisitions, sampleCandidates);
          
          // Reload data after initialization
          await Promise.all([
            set(loadRequisitionsAtom),
            set(loadCandidatesAtom),
          ]);
        }
      }
    } catch (error) {
      console.error('Error initializing Firebase data:', error);
      // Fallback to sample data
      set(requisitionsAtom, sampleRequisitions);
      set(candidatesAtom, sampleCandidates);
    }
  }
);

// Navigation actions
export const selectRequisitionAtom = atom(
  null,
  (get, set, requisition) => {
    set(selectedRequisitionAtom, requisition);
    set(currentViewAtom, 'kanban');
  }
);

export const backToOverviewAtom = atom(
  null,
  (get, set) => {
    set(currentViewAtom, 'overview');
    set(selectedRequisitionAtom, null);
  }
);

// Modal actions
export const openCandidateModalAtom = atom(
  null,
  (get, set, candidate) => {
    set(selectedCandidateAtom, candidate);
    set(candidateModalOpenAtom, true);
  }
);

export const closeCandidateModalAtom = atom(
  null,
  (get, set) => {
    set(candidateModalOpenAtom, false);
    set(selectedCandidateAtom, null);
  }
);

export const openAddRequisitionModalAtom = atom(
  null,
  (get, set) => {
    set(addRequisitionModalOpenAtom, true);
  }
);

export const closeAddRequisitionModalAtom = atom(
  null,
  (get, set) => {
    set(addRequisitionModalOpenAtom, false);
  }
);

export const openAddCandidateModalAtom = atom(
  null,
  (get, set, requisition) => {
    set(selectedRequisitionForAddAtom, requisition);
    set(addCandidateModalOpenAtom, true);
  }
);

export const closeAddCandidateModalAtom = atom(
  null,
  (get, set) => {
    set(addCandidateModalOpenAtom, false);
    set(selectedRequisitionForAddAtom, null);
  }
);

// Statistics atoms
export const candidateStatsAtom = atom((get) => {
  const candidates = get(candidatesAtom);
  
  const totalCandidates = candidates.length;
  const inInterview = candidates.filter(c => 
    ['phone_interview', 'technical_interview', 'final_interview', 'case_study', 'design_interview', 'stakeholder_interview', 'team_interview'].includes(c.current_stage)
  ).length;
  const offersExtended = candidates.filter(c => c.current_stage === 'offer').length;
  const hired = candidates.filter(c => c.current_stage === 'hired').length;
  
  return {
    totalCandidates,
    inInterview,
    offersExtended,
    hired
  };
});

export const requisitionStatsAtom = atom((get) => {
  const requisitions = get(requisitionsAtom);
  const candidates = get(candidatesAtom);
  
  return requisitions.map(requisition => {
    const requisitionCandidates = candidates.filter(
      candidate => candidate.requisition_id === requisition.id
    );
    
    const stats = {
      total_candidates: requisitionCandidates.length,
      positions_to_fill: requisition.positions_to_fill,
      stages: {},
    };
    
    // Count candidates in each stage
    requisition.hiring_stages.forEach((stage) => {
      stats.stages[stage.id] = requisitionCandidates.filter(
        candidate => candidate.current_stage === stage.id
      ).length;
    });
    
    return {
      requisition,
      stats
    };
  });
});
