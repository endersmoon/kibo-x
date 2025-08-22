"use client";

import { useState, useEffect } from "react";
import RequisitionOverview from "@/components/requisition-overview";
import CandidateKanban from "@/components/candidate-kanban";
import CandidateModal from "@/components/candidate-modal";
import AddRequisitionForm from "@/components/add-requisition-form";
import AddCandidateForm from "@/components/add-candidate-form";
import { useJsLoaded } from "@/lib/use-js-loaded";
import { sampleRequisitions, sampleCandidates } from "@/lib/data";

export default function Home() {
  const [currentView, setCurrentView] = useState("overview"); // 'overview' or 'kanban'
  const [selectedRequisition, setSelectedRequisition] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [isAddRequisitionOpen, setIsAddRequisitionOpen] = useState(false);
  const [isAddCandidateOpen, setIsAddCandidateOpen] = useState(false);
  const [requisitions, setRequisitions] = useState(sampleRequisitions);
  const [candidates, setCandidates] = useState(sampleCandidates);
  const jsLoaded = useJsLoaded();

  const handleSelectRequisition = (requisition) => {
    setSelectedRequisition(requisition);
    setCurrentView("kanban");
  };

  const handleBackToOverview = () => {
    setCurrentView("overview");
    setSelectedRequisition(null);
  };

  const handleCandidateClick = (candidate) => {
    setSelectedCandidate(candidate);
    setIsCandidateModalOpen(true);
  };

  const handleCandidateModalClose = () => {
    setIsCandidateModalOpen(false);
    setSelectedCandidate(null);
  };

  const handleCandidateSave = (updatedCandidate) => {
    // Update the candidate in the local state
    setCandidates(prev => 
      prev.map(candidate => 
        candidate.id === updatedCandidate.id ? updatedCandidate : candidate
      )
    );
    console.log("Saving candidate:", updatedCandidate);
  };

  const handleAddRequisition = (newRequisition) => {
    setRequisitions(prev => [...prev, newRequisition]);
    console.log("Adding requisition:", newRequisition);
  };

  const handleAddCandidate = (newCandidate) => {
    setCandidates(prev => [...prev, newCandidate]);
    console.log("Adding candidate:", newCandidate);
  };

  // Event listeners for custom events
  useEffect(() => {
    const handleOpenAddRequisition = () => {
      setIsAddRequisitionOpen(true);
    };

    const handleOpenAddCandidate = (event) => {
      setSelectedRequisition(event.detail.requisition);
      setIsAddCandidateOpen(true);
    };

    window.addEventListener('openAddRequisition', handleOpenAddRequisition);
    window.addEventListener('openAddCandidate', handleOpenAddCandidate);

    return () => {
      window.removeEventListener('openAddRequisition', handleOpenAddRequisition);
      window.removeEventListener('openAddCandidate', handleOpenAddCandidate);
    };
  }, []);

  // Don't render anything until JavaScript has loaded to prevent hydration issues
  if (!jsLoaded) {
    return (
      <div className="min-h-screen  p-6">
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
        onClose={() => setIsAddRequisitionOpen(false)}
        onSave={handleAddRequisition}
      />

      {/* Add Candidate Form */}
      <AddCandidateForm
        isOpen={isAddCandidateOpen}
        onClose={() => setIsAddCandidateOpen(false)}
        onSave={handleAddCandidate}
        requisition={selectedRequisition}
      />
    </>
  );
}
