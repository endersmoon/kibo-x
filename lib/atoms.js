import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { sampleRequisitions, sampleCandidates } from './data';

// Data atoms - using atomWithStorage to persist data in localStorage
export const requisitionsAtom = atomWithStorage('requisitions', sampleRequisitions);
export const candidatesAtom = atomWithStorage('candidates', sampleCandidates);

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

// Action atoms for data mutations
export const addRequisitionAtom = atom(
  null,
  (get, set, newRequisition) => {
    const currentRequisitions = get(requisitionsAtom);
    set(requisitionsAtom, [...currentRequisitions, newRequisition]);
  }
);

export const addCandidateAtom = atom(
  null,
  (get, set, newCandidate) => {
    const currentCandidates = get(candidatesAtom);
    set(candidatesAtom, [...currentCandidates, newCandidate]);
  }
);

export const updateCandidateAtom = atom(
  null,
  (get, set, updatedCandidate) => {
    const currentCandidates = get(candidatesAtom);
    const newCandidates = currentCandidates.map(candidate =>
      candidate.id === updatedCandidate.id ? updatedCandidate : candidate
    );
    set(candidatesAtom, newCandidates);
  }
);

export const updateCandidatesAtom = atom(
  null,
  (get, set, updatedCandidates) => {
    const allCandidates = get(candidatesAtom);
    const selectedRequisition = get(selectedRequisitionAtom);
    
    // Update only the candidates for the current requisition
    const newAllCandidates = allCandidates.map(candidate => {
      const updatedCandidate = updatedCandidates.find(uc => uc.id === candidate.id);
      return updatedCandidate && updatedCandidate.requisition_id === selectedRequisition?.id 
        ? updatedCandidate 
        : candidate;
    });
    
    set(candidatesAtom, newAllCandidates);
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
