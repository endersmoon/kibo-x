"use client";

import { useState } from "react";
import RequisitionOverview from "@/components/requisition-overview";
import CandidateKanban from "@/components/candidate-kanban";
import CandidateModal from "@/components/candidate-modal";
import { useJsLoaded } from "@/lib/use-js-loaded";

export default function Home() {
  const [currentView, setCurrentView] = useState("overview"); // 'overview' or 'kanban'
  const [selectedRequisition, setSelectedRequisition] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
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
    // In a real application, this would update the candidate in the database
    console.log("Saving candidate:", updatedCandidate);
    // For now, we'll just log it since we're using dummy data
  };

  // Don't render anything until JavaScript has loaded to prevent hydration issues
  if (!jsLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-6">
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
        <RequisitionOverview onSelectRequisition={handleSelectRequisition} />
      )}

      {currentView === "kanban" && selectedRequisition && (
        <CandidateKanban
          requisition={selectedRequisition}
          onCandidateClick={handleCandidateClick}
          onBack={handleBackToOverview}
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
    </>
  );
}
