"use client";

import { useState, useEffect } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { getPriorityBadge } from "@/lib/data";
import EditInterviewForm from "@/components/edit-interview-form";
import { Edit, Save, X } from "lucide-react";

export default function CandidateModal({
  candidate,
  requisition,
  isOpen,
  onClose,
  onSave,
}) {
  const [editedCandidate, setEditedCandidate] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Initialize edited candidate when modal opens
  useEffect(() => {
    if (candidate && isOpen) {
      setEditedCandidate({ ...candidate });
      setIsEditMode(false); // Reset edit mode when opening modal
    }
  }, [candidate, isOpen]);

  const handleSave = () => {
    if (editedCandidate && onSave) {
      // Basic validation - only check email since first/last name are not editable
      if (!editedCandidate.email?.trim()) {
        alert("Email is a required field.");
        return;
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editedCandidate.email.trim())) {
        alert("Please enter a valid email address.");
        return;
      }

      // Filter out empty tags
      const filteredTags = (editedCandidate.tags || []).filter(tag => tag.trim() !== "");

      // Update the updated_at timestamp
      const updatedCandidate = {
        ...editedCandidate,
        tags: filteredTags,
        updated_at: new Date().toISOString(),
      };
      onSave(updatedCandidate);
    }
    setIsEditMode(false);
    onClose();
  };

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
    if (isEditMode) {
      // If canceling edit, reset to original candidate data
      setEditedCandidate({ ...candidate });
    }
  };

  const handleInputChange = (field, value) => {
    setEditedCandidate(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagChange = (index, value) => {
    const newTags = [...(editedCandidate.tags || [])];
    newTags[index] = value;
    setEditedCandidate(prev => ({
      ...prev,
      tags: newTags
    }));
  };

  const addTag = () => {
    setEditedCandidate(prev => ({
      ...prev,
      tags: [...(prev.tags || []), ""]
    }));
  };

  const removeTag = (index) => {
    const newTags = (editedCandidate.tags || []).filter((_, i) => i !== index);
    setEditedCandidate(prev => ({
      ...prev,
      tags: newTags
    }));
  };



  const handleDeleteInterview = (indexToDelete) => {
    if (editedCandidate && editedCandidate.interviews) {
      const updatedInterviews = editedCandidate.interviews.filter(
        (_, index) => index !== indexToDelete
      );
      setEditedCandidate({
        ...editedCandidate,
        interviews: updatedInterviews,
      });
    }
  };

  const handleUpdateInterview = (interviewIndex, updatedInterview) => {
    if (editedCandidate && editedCandidate.interviews) {
      const updatedInterviews = editedCandidate.interviews.map((interview, index) =>
        index === interviewIndex ? updatedInterview : interview
      );
      setEditedCandidate({
        ...editedCandidate,
        interviews: updatedInterviews,
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getExperienceLevel = (years) => {
    if (years <= 2) return "Junior";
    if (years <= 5) return "Mid-level";
    if (years <= 8) return "Senior";
    return "Principal";
  };

  const getRatingStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  const getCurrentStageInfo = () => {
    if (!candidate || !requisition) return null;
    return requisition.hiring_stages.find(
      (stage) => stage.id === candidate.current_stage,
    );
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

  if (!candidate || !editedCandidate) return null;

  const currentStage = getCurrentStageInfo();

  return (
    <Drawer open={isOpen} onOpenChange={onClose} direction="right">
              <DrawerContent className="p-3 h-full overflow-y-auto w-auto min-w-[800px] max-w-[90vw]">
        <DrawerHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-lg font-medium text-white">
                  {candidate.first_name.charAt(0)}
                  {candidate.last_name.charAt(0)}
                </span>
              </div>
              <div>
                <DrawerTitle className="text-2xl font-bold">
                  {candidate.first_name} {candidate.last_name}
                </DrawerTitle>
                <DrawerDescription>
                  Candidate for {requisition?.title} • {isEditMode ? (editedCandidate?.current_title || candidate.current_title) : candidate.current_title} at{" "}
                  {isEditMode ? (editedCandidate?.current_company || candidate.current_company) : candidate.current_company}
                </DrawerDescription>
              </div>
            </div>
            <Button
              variant={isEditMode ? "destructive" : "outline"}
              size="sm"
              onClick={handleEditToggle}
              className="flex items-center gap-2"
            >
              {isEditMode ? (
                <>
                  <X className="h-4 w-4" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4" />
                  Edit
                </>
              )}
            </Button>
          </div>
        </DrawerHeader>

        <div className="space-y-6 w-full">
          {/* Status and Priority */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Current Stage:</Label>
              <Badge variant="outline" className="capitalize">
                {currentStage?.name ||
                  candidate.current_stage.replace("_", " ")}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Priority:</Label>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(candidate.priority)}`}
              >
                {candidate.priority}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Source:</Label>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSourceBadge(candidate.source)}`}
              >
                {candidate.source}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Information */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">
                Contact Information
              </h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Email
                  </Label>
                  {isEditMode ? (
                    <input
                      type="email"
                      value={editedCandidate?.email || ""}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    />
                  ) : (
                    <p className="text-sm">{candidate.email}</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Phone
                  </Label>
                  {isEditMode ? (
                    <input
                      type="tel"
                      value={editedCandidate?.phone || ""}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    />
                  ) : (
                    <p className="text-sm">{candidate.phone}</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Location
                  </Label>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={editedCandidate?.location || ""}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    />
                  ) : (
                    <p className="text-sm">{candidate.location}</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    LinkedIn
                  </Label>
                  {isEditMode ? (
                    <input
                      type="url"
                      value={editedCandidate?.linkedin_url || ""}
                      onChange={(e) => handleInputChange("linkedin_url", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      placeholder="https://linkedin.com/in/username"
                    />
                  ) : candidate.linkedin_url ? (
                    <a
                      href={candidate.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View Profile
                    </a>
                  ) : (
                    <p className="text-sm text-gray-500">Not provided</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Portfolio
                  </Label>
                  {isEditMode ? (
                    <input
                      type="url"
                      value={editedCandidate?.portfolio_url || ""}
                      onChange={(e) => handleInputChange("portfolio_url", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      placeholder="https://portfolio.com"
                    />
                  ) : candidate.portfolio_url ? (
                    <a
                      href={candidate.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View Portfolio
                    </a>
                  ) : (
                    <p className="text-sm text-gray-500">Not provided</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Professional Information */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">
                Professional Information
              </h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Current Company
                  </Label>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={editedCandidate?.current_company || ""}
                      onChange={(e) => handleInputChange("current_company", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    />
                  ) : (
                    <p className="text-sm">{candidate.current_company}</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Current Title
                  </Label>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={editedCandidate?.current_title || ""}
                      onChange={(e) => handleInputChange("current_title", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    />
                  ) : (
                    <p className="text-sm">{candidate.current_title}</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Experience
                  </Label>
                  {isEditMode ? (
                    <input
                      type="number"
                      min="0"
                      value={editedCandidate?.experience_years || 0}
                      onChange={(e) => handleInputChange("experience_years", parseInt(e.target.value) || 0)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    />
                  ) : (
                    <p className="text-sm">
                      {getExperienceLevel(candidate.experience_years)} (
                      {candidate.experience_years} years)
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Salary Expectation
                  </Label>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={editedCandidate?.salary_expectation || ""}
                      onChange={(e) => handleInputChange("salary_expectation", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      placeholder="$120,000"
                    />
                  ) : (
                    <p className="text-sm">{candidate.salary_expectation}</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Notice Period
                  </Label>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={editedCandidate?.notice_period || ""}
                      onChange={(e) => handleInputChange("notice_period", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      placeholder="2 weeks"
                    />
                  ) : (
                    <p className="text-sm">{candidate.notice_period}</p>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Skills/Tags */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Skills & Tags</h3>
            {isEditMode ? (
              <div className="space-y-3">
                {(editedCandidate?.tags || [""]).map((tag, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => handleTagChange(index, e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
                      placeholder="react, typescript, senior-level"
                    />
                    {(editedCandidate?.tags || []).length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeTag(index)}
                        className="px-3"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" onClick={addTag} className="text-sm">
                  + Add Tag
                </Button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {candidate.tags && candidate.tags.length > 0 ? (
                  candidate.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No tags added</p>
                )}
              </div>
            )}
          </Card>

          {/* Interview History */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Interview History</h3>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Interviews are automatically created when moving between stages
              </div>
            </div>
            {editedCandidate.interviews && editedCandidate.interviews.length > 0 ? (
              <div className="space-y-4">
                {editedCandidate.interviews.map((interview, index) => {
                  // Find the stage information for this interview
                  const stage = requisition?.hiring_stages?.find(s => s.id === interview.type);
                  const stageName = stage?.name || interview.type.replace("_", " ");
                  
                  return (
                    <div
                      key={index}
                      className="border-l-2 border-blue-500 pl-4 py-2 relative group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">
                          {stageName}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {formatDateTime(interview.date)}
                          </span>
                          <span className="text-sm">
                            {getRatingStars(interview.rating)}
                          </span>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                            <EditInterviewForm
                              interview={interview}
                              onUpdateInterview={(updatedInterview) => handleUpdateInterview(index, updatedInterview)}
                              stageName={stageName}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteInterview(index)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 px-2 py-1 h-6"
                            >
                              ×
                            </Button>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Interviewer: {interview.interviewer}
                      </p>
                      {interview.feedback && (
                        <p className="text-sm">{interview.feedback}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p className="text-sm">No interviews recorded yet.</p>
                <p className="text-xs mt-1">Interviews will be automatically created when moving the candidate between stages.</p>
              </div>
            )}
          </Card>

          {/* Notes */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Notes</h3>
            <Textarea
              value={editedCandidate.notes || ""}
              onChange={(e) =>
                setEditedCandidate({
                  ...editedCandidate,
                  notes: e.target.value,
                })
              }
              className="min-h-[100px]"
              placeholder="Add notes about this candidate..."
            />
          </Card>

          {/* Timeline */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Timeline</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Applied:
                </span>
                <span>{formatDate(candidate.applied_date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Last Updated:
                </span>
                <span>{formatDateTime(candidate.updated_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Record Created:
                </span>
                <span>{formatDateTime(candidate.created_at)}</span>
              </div>
            </div>
          </Card>
        </div>

        <DrawerFooter className="gap-2">
          {isEditMode ? (
            <>
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleEditToggle}>
                Cancel
              </Button>
            </>
          ) : (
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
