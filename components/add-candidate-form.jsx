"use client";

import { useState } from "react";
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

export default function AddCandidateForm({ isOpen, onClose, onSave, requisition }) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    location: "",
    current_stage: "applied",
    priority: "medium",
    source: "Company Website",
    experience_years: 0,
    current_company: "",
    current_title: "",
    linkedin_url: "",
    resume_url: "",
    portfolio_url: "",
    salary_expectation: "",
    notice_period: "",
    notes: "",
    tags: [""],
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagChange = (index, value) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData(prev => ({
      ...prev,
      tags: newTags
    }));
  };

  const addTag = () => {
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, ""]
    }));
  };

  const removeTag = (index) => {
    const newTags = formData.tags.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      tags: newTags
    }));
  };

  const handleSave = () => {
    const newCandidate = {
      ...formData,
      id: `cand-${Date.now()}`,
      requisition_id: requisition.id,
      applied_date: new Date().toISOString().split('T')[0],
      tags: formData.tags.filter(tag => tag.trim() !== ""),
      interviews: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    onSave(newCandidate);
    
    // Reset form
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      location: "",
      current_stage: "applied",
      priority: "medium",
      source: "Company Website",
      experience_years: 0,
      current_company: "",
      current_title: "",
      linkedin_url: "",
      resume_url: "",
      portfolio_url: "",
      salary_expectation: "",
      notice_period: "",
      notes: "",
      tags: [""],
    });
    
    onClose();
  };

  const isFormValid = formData.first_name && formData.last_name && formData.email;

  const sourceOptions = [
    "Company Website",
    "LinkedIn",
    "Referral", 
    "Recruiter",
    "AngelList",
    "Dribbble",
    "Indeed",
    "Glassdoor",
    "Other"
  ];

  return (
    <Drawer open={isOpen} onOpenChange={onClose} direction="right">
      <DrawerContent className="p-3 h-full overflow-y-auto w-auto min-w-[800px] max-w-[90vw]">
        <DrawerHeader>
          <DrawerTitle className="text-2xl font-bold">
            Add New Candidate
          </DrawerTitle>
          <DrawerDescription>
            Add a new candidate for {requisition?.title}
          </DrawerDescription>
        </DrawerHeader>

        <div className="space-y-6 w-full">
          {/* Personal Information */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">First Name *</Label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange("first_name", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Alex"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Last Name *</Label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange("last_name", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Chen"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Email *</Label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="alex.chen@email.com"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Phone</Label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Location</Label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="San Francisco, CA"
                />
              </div>
            </div>
          </Card>

          {/* Professional Information */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Professional Information</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Current Company</Label>
                <input
                  type="text"
                  value={formData.current_company}
                  onChange={(e) => handleInputChange("current_company", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="TechCorp Inc."
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Current Title</Label>
                <input
                  type="text"
                  value={formData.current_title}
                  onChange={(e) => handleInputChange("current_title", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Frontend Developer"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Years of Experience</Label>
                <input
                  type="number"
                  min="0"
                  value={formData.experience_years}
                  onChange={(e) => handleInputChange("experience_years", parseInt(e.target.value) || 0)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Salary Expectation</Label>
                <input
                  type="text"
                  value={formData.salary_expectation}
                  onChange={(e) => handleInputChange("salary_expectation", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="$145,000"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Notice Period</Label>
                <input
                  type="text"
                  value={formData.notice_period}
                  onChange={(e) => handleInputChange("notice_period", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="2 weeks"
                />
              </div>
            </div>
          </Card>

          {/* Application Details */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Application Details</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Current Stage</Label>
                <select
                  value={formData.current_stage}
                  onChange={(e) => handleInputChange("current_stage", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  {requisition?.hiring_stages.map(stage => (
                    <option key={stage.id} value={stage.id}>
                      {stage.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-sm font-medium">Priority</Label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleInputChange("priority", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <Label className="text-sm font-medium">Source</Label>
                <select
                  value={formData.source}
                  onChange={(e) => handleInputChange("source", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  {sourceOptions.map(source => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* Links */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Links & URLs</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label className="text-sm font-medium">LinkedIn URL</Label>
                <input
                  type="url"
                  value={formData.linkedin_url}
                  onChange={(e) => handleInputChange("linkedin_url", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="https://linkedin.com/in/alexchen"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Portfolio URL</Label>
                <input
                  type="url"
                  value={formData.portfolio_url}
                  onChange={(e) => handleInputChange("portfolio_url", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="https://alexchen.dev"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Resume URL</Label>
                <input
                  type="url"
                  value={formData.resume_url}
                  onChange={(e) => handleInputChange("resume_url", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="/resumes/alex-chen.pdf"
                />
              </div>
            </div>
          </Card>

          {/* Tags */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Skills & Tags</h3>
            <div className="space-y-3">
              {formData.tags.map((tag, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => handleTagChange(index, e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-md"
                    placeholder="react, typescript, senior-level"
                  />
                  {formData.tags.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeTag(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" onClick={addTag}>
                + Add Tag
              </Button>
            </div>
          </Card>

          {/* Notes */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Notes</h3>
            <Textarea
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              className="min-h-[100px]"
              placeholder="Add any initial notes about this candidate..."
            />
          </Card>
        </div>

        <DrawerFooter className="gap-2">
          <Button 
            onClick={handleSave}
            disabled={!isFormValid}
          >
            Add Candidate
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
