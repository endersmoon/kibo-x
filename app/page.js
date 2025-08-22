"use client";

import { useEffect } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import RequisitionOverview from "@/components/requisition-overview";
import CandidateKanban from "@/components/candidate-kanban";
import CandidateModal from "@/components/candidate-modal";
import AddRequisitionForm from "@/components/add-requisition-form";
import AddCandidateForm from "@/components/add-candidate-form";
import { useJsLoaded } from "@/lib/use-js-loaded";
import {
  currentViewAtom,
  selectedRequisitionAtom,
  selectedCandidateAtom,
  candidateModalOpenAtom,
  addRequisitionModalOpenAtom,
  addCandidateModalOpenAtom,
  selectedRequisitionForAddAtom,
  selectRequisitionAtom,
  backToOverviewAtom,
  openCandidateModalAtom,
  closeCandidateModalAtom,
  openAddRequisitionModalAtom,
  closeAddRequisitionModalAtom,
  openAddCandidateModalAtom,
  closeAddCandidateModalAtom,
  addRequisitionAtom,
  addCandidateAtom,
  updateCandidateAtom,
  requisitionsAtom,
  candidatesAtom
} from "@/lib/atoms";

export default function Home() {
  // Jotai atoms
  const currentView = useAtomValue(currentViewAtom);
  const selectedRequisition = useAtomValue(selectedRequisitionAtom);
  const selectedCandidate = useAtomValue(selectedCandidateAtom);
  const isCandidateModalOpen = useAtomValue(candidateModalOpenAtom);
  const isAddRequisitionOpen = useAtomValue(addRequisitionModalOpenAtom);
  const isAddCandidateOpen = useAtomValue(addCandidateModalOpenAtom);
  const selectedRequisitionForAdd = useAtomValue(selectedRequisitionForAddAtom);
  const requisitions = useAtomValue(requisitionsAtom);
  const candidates = useAtomValue(candidatesAtom);
  
  // Action atoms
  const selectRequisition = useSetAtom(selectRequisitionAtom);
  const backToOverview = useSetAtom(backToOverviewAtom);
  const openCandidateModal = useSetAtom(openCandidateModalAtom);
  const closeCandidateModal = useSetAtom(closeCandidateModalAtom);
  const openAddRequisitionModal = useSetAtom(openAddRequisitionModalAtom);
  const closeAddRequisitionModal = useSetAtom(closeAddRequisitionModalAtom);
  const openAddCandidateModal = useSetAtom(openAddCandidateModalAtom);
  const closeAddCandidateModal = useSetAtom(closeAddCandidateModalAtom);
  const addRequisition = useSetAtom(addRequisitionAtom);
  const addCandidate = useSetAtom(addCandidateAtom);
  const updateCandidate = useSetAtom(updateCandidateAtom);
  
  const jsLoaded = useJsLoaded();

  const handleSelectRequisition = (requisition) => {
    selectRequisition(requisition);
  };

  const handleBackToOverview = () => {
    backToOverview();
  };

  const handleCandidateClick = (candidate) => {
    openCandidateModal(candidate);
  };

  const handleCandidateModalClose = () => {
    closeCandidateModal();
  };

  const handleCandidateSave = (updatedCandidate) => {
    updateCandidate(updatedCandidate);
    console.log("Saving candidate:", updatedCandidate);
  };

  const handleAddRequisition = (newRequisition) => {
    addRequisition(newRequisition);
    console.log("Adding requisition:", newRequisition);
  };

  const handleAddCandidate = (newCandidate) => {
    addCandidate(newCandidate);
    console.log("Adding candidate:", newCandidate);
  };

  // Event listeners for custom events
  useEffect(() => {
    const handleOpenAddRequisition = () => {
      openAddRequisitionModal();
    };

    const handleOpenAddCandidate = (event) => {
      openAddCandidateModal(event.detail.requisition);
    };

    window.addEventListener('openAddRequisition', handleOpenAddRequisition);
    window.addEventListener('openAddCandidate', handleOpenAddCandidate);

    return () => {
      window.removeEventListener('openAddRequisition', handleOpenAddRequisition);
      window.removeEventListener('openAddCandidate', handleOpenAddCandidate);
    };
  }, [openAddRequisitionModal, openAddCandidateModal]);

  // Don't render anything until JavaScript has loaded to prevent hydration issues
  if (!jsLoaded) {
    return (
      <div className="h-full overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-2/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="h-32 bg-gray-300 dark:bg-gray-700 rounded"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {currentView === "overview" && (
        <RequisitionOverview 
          onSelectRequisition={handleSelectRequisition}
          requisitions={requisitions}
          candidates={candidates}
        />
      )}

      {currentView === "kanban" && selectedRequisition && (
        <CandidateKanban
          requisition={selectedRequisition}
          onCandidateClick={handleCandidateClick}
          onBack={handleBackToOverview}
          candidates={candidates}
        />
      )}

      {/* Candidate Details Modal */}
      <CandidateModal
        candidate={selectedCandidate}
        requisition={selectedRequisition}
        isOpen={isCandidateModalOpen}
        onClose={handleCandidateModalClose}
        onSave={handleCandidateSave}
      />

      {/* Add Requisition Form */}
      <AddRequisitionForm
        isOpen={isAddRequisitionOpen}
        onClose={closeAddRequisitionModal}
        onSave={handleAddRequisition}
      />

      {/* Add Candidate Form */}
      <AddCandidateForm
        isOpen={isAddCandidateOpen}
        onClose={closeAddCandidateModal}
        onSave={handleAddCandidate}
        requisition={selectedRequisitionForAdd}
      />
    </>
  );
}
