"use client";

import { useEffect } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  KanbanBoardProvider,
  KanbanBoard,
  KanbanBoardColumn,
  KanbanBoardColumnHeader,
  KanbanBoardColumnTitle,
  KanbanBoardColumnList,
  KanbanBoardColumnListItem,
  KanbanBoardCard,
  KanbanBoardCardTitle,
  KanbanBoardCardDescription,
  KanbanBoardExtraMargin,
  KanbanColorCircle,
} from "@/components/kanban";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getPriorityBadge,
} from "@/lib/data";
import {
  candidatesByRequisitionAtom,
  updateCandidatesAtom,
  openAddCandidateModalAtom
} from "@/lib/atoms";

export default function CandidateKanban({
  requisition,
  onCandidateClick,
  onBack,
}) {
  // Get candidates for this requisition from global state
  const candidates = useAtomValue(candidatesByRequisitionAtom);
  const updateCandidates = useSetAtom(updateCandidatesAtom);
  const openAddCandidateModal = useSetAtom(openAddCandidateModalAtom);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getExperienceLevel = (years) => {
    if (years <= 2) return "Junior";
    if (years <= 5) return "Mid-level";
    if (years <= 8) return "Senior";
    return "Principal";
  };

  const getSourceBadge = (source) => {
    const colors = {
      LinkedIn: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      "Company Website":
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      Referral:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      Recruiter:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      AngelList:
        "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
      Dribbble: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
    };

    return (
      colors[source] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    );
  };



  // Helper function to determine if we should create an interview record
  const shouldCreateInterview = (currentStageId, newStageId, existingInterviews = []) => {
    const stageIds = requisition.hiring_stages.map(stage => stage.id);
    const currentIndex = stageIds.indexOf(currentStageId);
    const newIndex = stageIds.indexOf(newStageId);
    
    // Check if an interview already exists for this stage
    const hasExistingInterview = existingInterviews.some(interview => interview.type === newStageId);
    if (hasExistingInterview) {
      return false;
    }
    
    // Create interview for forward progression
    if (newIndex > currentIndex) {
      return true;
    }
    
    // Create interview for final states (rejected/hired) from any stage
    if (['rejected', 'hired'].includes(newStageId)) {
      return true;
    }
    
    return false;
  };

  const handleDropOverColumn = (data, columnId) => {
    const candidateData = JSON.parse(data);

    // Only update if the candidate is actually changing stages
    if (candidateData.current_stage === columnId) return;

    // Find the stage information for the new column
    const newStage = requisition.hiring_stages.find(stage => stage.id === columnId);
    
    const updatedCandidates = candidates.map((candidate) => {
      if (candidate.id === candidateData.id) {
        let updatedInterviews = candidate.interviews || [];

        // Only create a new interview record if appropriate
        if (shouldCreateInterview(candidateData.current_stage, columnId, candidate.interviews)) {
          const newInterview = {
            date: new Date().toISOString(),
            type: columnId,
            interviewer: "System", // Default interviewer, can be updated later
            rating: 3, // Default rating, can be updated later
            feedback: `Candidate moved to ${newStage?.name || columnId} stage`,
          };

          updatedInterviews = [...updatedInterviews, newInterview];
        }

        return {
          ...candidate,
          current_stage: columnId,
          interviews: updatedInterviews,
          updated_at: new Date().toISOString(),
        };
      }
      return candidate;
    });
    
    updateCandidates(updatedCandidates);
  };

  const handleDropOverListItem = (data, dropDirection, targetCandidateId) => {
    const candidateData = JSON.parse(data);
    const targetCandidate = candidates.find(
      (candidate) => candidate.id === targetCandidateId,
    );
    if (!targetCandidate || candidateData.id === targetCandidateId) return;

    // Create a copy of all candidates without the dragged candidate
    const filteredCandidates = candidates.filter(
      (candidate) => candidate.id !== candidateData.id,
    );

    // Find the target candidate in the filtered data
    const targetIndex = filteredCandidates.findIndex(
      (candidate) => candidate.id === targetCandidateId,
    );
    if (targetIndex === -1) return;

    // Calculate insert position
    const insertIndex = dropDirection === "top" ? targetIndex : targetIndex + 1;

    // Create updated candidate with new stage
    const updatedCandidate = {
      ...candidateData,
      current_stage: targetCandidate.current_stage,
      updated_at: new Date().toISOString(),
    };

    // If the candidate is changing stages and we should create an interview, add an interview record
    if (candidateData.current_stage !== targetCandidate.current_stage && 
        shouldCreateInterview(candidateData.current_stage, targetCandidate.current_stage, candidateData.interviews)) {
      const newStage = requisition.hiring_stages.find(stage => stage.id === targetCandidate.current_stage);
      const newInterview = {
        date: new Date().toISOString(),
        type: targetCandidate.current_stage,
        interviewer: "System", // Default interviewer, can be updated later
        rating: 3, // Default rating, can be updated later
        feedback: `Candidate moved to ${newStage?.name || targetCandidate.current_stage} stage`,
      };

      updatedCandidate.interviews = [...(candidateData.interviews || []), newInterview];
    }

    // Insert the candidate at the correct position
    const newCandidates = [...filteredCandidates];
    newCandidates.splice(insertIndex, 0, updatedCandidate);

    updateCandidates(newCandidates);
  };

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={onBack}>
                ← Back to Requisitions
              </Button>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(requisition.priority)}`}
                >
                  {requisition.priority}
                </span>
                <Badge variant="secondary">{requisition.department}</Badge>
              </div>
            </div>
            <Button 
              onClick={() => openAddCandidateModal(requisition)}
            >
              + Add New Candidate
            </Button>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {requisition.title}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
            <span>📍 {requisition.location}</span>
            <span>👤 {requisition.hiring_manager}</span>
            <span>
              🎯 {requisition.positions_to_fill} position
              {requisition.positions_to_fill > 1 ? "s" : ""}
            </span>
            <span>
              📊 {candidates.length} candidate
              {candidates.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="h-[calc(100vh-250px)]">
          <KanbanBoardProvider>
            <KanbanBoard className="h-full">
              {requisition.hiring_stages.map((stage) => (
                <KanbanBoardColumn
                  key={stage.id}
                  columnId={stage.id}
                  onDropOverColumn={(data) =>
                    handleDropOverColumn(data, stage.id)
                  }
                >
                  <KanbanBoardColumnHeader>
                    <KanbanBoardColumnTitle columnId={stage.id}>
                      <KanbanColorCircle color="primary" />
                      {stage.name}
                    </KanbanBoardColumnTitle>
                    <Badge variant="secondary" className="text-xs">
                      {
                        candidates.filter(
                          (candidate) => candidate.current_stage === stage.id,
                        ).length
                      }
                    </Badge>
                  </KanbanBoardColumnHeader>

                  <KanbanBoardColumnList>
                    {candidates
                      .filter(
                        (candidate) => candidate.current_stage === stage.id,
                      )
                      .map((candidate, index) => (
                        <KanbanBoardColumnListItem
                          key={`${stage.id}-${candidate.id}-${index}`}
                          cardId={candidate.id}
                          onDropOverListItem={(data, direction) =>
                            handleDropOverListItem(
                              data,
                              direction,
                              candidate.id,
                            )
                          }
                        >
                          <KanbanBoardCard
                            data={candidate}
                            onClick={() => onCandidateClick(candidate)}
                          >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-2">
                              <KanbanBoardCardTitle>
                                {candidate.first_name} {candidate.last_name}
                              </KanbanBoardCardTitle>
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(candidate.priority)}`}
                              >
                                {candidate.priority}
                              </span>
                            </div>

                            {/* Current Role */}
                            <KanbanBoardCardDescription>
                              {candidate.current_title} at{" "}
                              {candidate.current_company}
                            </KanbanBoardCardDescription>

                            {/* Experience & Location */}
                            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
                              <span>
                                {getExperienceLevel(candidate.experience_years)}{" "}
                                ({candidate.experience_years}y)
                              </span>
                              <span>📍 {candidate.location}</span>
                            </div>

                            {/* Tags */}
                            {candidate.tags && candidate.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {candidate.tags
                                  .slice(0, 2)
                                  .map((tag, tagIndex) => (
                                    <Badge
                                      key={tagIndex}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                {candidate.tags.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{candidate.tags.length - 2}
                                  </Badge>
                                )}
                              </div>
                            )}

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                              <div className="flex items-center space-x-2">
                                {/* Avatar */}
                                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                  <span className="text-xs font-medium text-white">
                                    {candidate.first_name.charAt(0)}
                                    {candidate.last_name.charAt(0)}
                                  </span>
                                </div>
                                {/* Source */}
                                <span
                                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSourceBadge(candidate.source)}`}
                                >
                                  {candidate.source}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Applied {formatDate(candidate.applied_date)}
                              </div>
                            </div>
                          </KanbanBoardCard>
                        </KanbanBoardColumnListItem>
                      ))}
                  </KanbanBoardColumnList>
                </KanbanBoardColumn>
              ))}
              <KanbanBoardExtraMargin />
            </KanbanBoard>
          </KanbanBoardProvider>
        </div>
      </div>
    </div>
  );
}
