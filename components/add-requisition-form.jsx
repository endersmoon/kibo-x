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
import { DEFAULT_HIRING_STAGES, REQUISITION_STATUS, ROLE_TYPES, getHiringStagesForRole } from "@/lib/data";

export default function AddRequisitionForm({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    type: "Full-time",
    status: REQUISITION_STATUS.DRAFT,
    priority: "medium",
    hiring_manager: "",
    recruiter: "",
    target_start_date: "",
    description: "",
    requirements: [""],
    salary_range: "",
    positions_to_fill: 1,
    role_type: ROLE_TYPES.ENGINEERING,
    hiring_stages: getHiringStagesForRole(ROLE_TYPES.ENGINEERING),
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      
      // Update hiring stages when role type changes
      if (field === 'role_type') {
        newData.hiring_stages = getHiringStagesForRole(value);
      }
      
      return newData;
    });
  };

  const handleRequirementChange = (index, value) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData(prev => ({
      ...prev,
      requirements: newRequirements
    }));
  };

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, ""]
    }));
  };

  const removeRequirement = (index) => {
    const newRequirements = formData.requirements.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      requirements: newRequirements
    }));
  };

  const handleSave = () => {
    const newRequisition = {
      ...formData,
      id: `req-${Date.now()}`,
      created_date: new Date().toISOString().split('T')[0],
      requirements: formData.requirements.filter(req => req.trim() !== ""),
    };
    
    onSave(newRequisition);
    
    // Reset form
    setFormData({
      title: "",
      department: "",
      location: "",
      type: "Full-time",
      status: REQUISITION_STATUS.DRAFT,
      priority: "medium",
      hiring_manager: "",
      recruiter: "",
      target_start_date: "",
      description: "",
      requirements: [""],
      salary_range: "",
      positions_to_fill: 1,
      role_type: ROLE_TYPES.ENGINEERING,
      hiring_stages: getHiringStagesForRole(ROLE_TYPES.ENGINEERING),
    });
    
    onClose();
  };

  const isFormValid = formData.title && formData.department && formData.hiring_manager;

  return (
    <Drawer open={isOpen} onOpenChange={onClose} direction="right">
      <DrawerContent className="p-3 h-full overflow-y-auto w-auto min-w-[800px] max-w-[90vw]">
        <DrawerHeader>
          <DrawerTitle className="text-2xl font-bold">
            Add New Job Requisition
          </DrawerTitle>
          <DrawerDescription>
            Create a new job requisition to start the hiring process
          </DrawerDescription>
        </DrawerHeader>

        <div className="space-y-6 w-full">
          {/* Basic Information */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Job Title *</Label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Senior Frontend Developer"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Department *</Label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => handleInputChange("department", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Engineering"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Location</Label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="San Francisco, CA / Remote"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Job Type</Label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div>
                <Label className="text-sm font-medium">Role Type *</Label>
                <select
                  value={formData.role_type}
                  onChange={(e) => handleInputChange("role_type", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value={ROLE_TYPES.ENGINEERING}>Engineering</option>
                  <option value={ROLE_TYPES.PRODUCT}>Product</option>
                  <option value={ROLE_TYPES.DESIGN}>Design</option>
                  <option value={ROLE_TYPES.SALES}>Sales</option>
                  <option value={ROLE_TYPES.MARKETING}>Marketing</option>
                  <option value={ROLE_TYPES.OPERATIONS}>Operations</option>
                  <option value={ROLE_TYPES.CUSTOM}>Custom</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  This determines the hiring stages for the kanban board
                </p>
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
                <Label className="text-sm font-medium">Positions to Fill</Label>
                <input
                  type="number"
                  min="1"
                  value={formData.positions_to_fill}
                  onChange={(e) => handleInputChange("positions_to_fill", parseInt(e.target.value) || 1)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </Card>

          {/* People & Dates */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">People & Dates</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Hiring Manager *</Label>
                <input
                  type="text"
                  value={formData.hiring_manager}
                  onChange={(e) => handleInputChange("hiring_manager", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Sarah Johnson"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Recruiter</Label>
                <input
                  type="text"
                  value={formData.recruiter}
                  onChange={(e) => handleInputChange("recruiter", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Mike Chen"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Target Start Date</Label>
                <input
                  type="date"
                  value={formData.target_start_date}
                  onChange={(e) => handleInputChange("target_start_date", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Salary Range</Label>
                <input
                  type="text"
                  value={formData.salary_range}
                  onChange={(e) => handleInputChange("salary_range", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="$120,000 - $160,000"
                />
              </div>
            </div>
          </Card>

          {/* Job Description */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Job Description</h3>
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="min-h-[120px]"
              placeholder="Describe the role, responsibilities, and what makes this position exciting..."
            />
          </Card>

          {/* Requirements */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Requirements</h3>
            <div className="space-y-3">
              {formData.requirements.map((requirement, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={requirement}
                    onChange={(e) => handleRequirementChange(index, e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-md"
                    placeholder="5+ years of frontend development experience"
                  />
                  {formData.requirements.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeRequirement(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" onClick={addRequirement}>
                + Add Requirement
              </Button>
            </div>
          </Card>

          {/* Hiring Stages Preview */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">
              Hiring Stages Preview
              <span className="text-sm font-normal text-gray-500 ml-2">
                (Based on {formData.role_type} role type)
              </span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {formData.hiring_stages.slice(0, -1).map((stage, index) => (
                <div key={stage.id} className="text-center">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 border-2 border-gray-200 dark:border-gray-700">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                      {stage.name}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {stage.description}
                    </div>
                  </div>
                  {index < formData.hiring_stages.length - 2 && (
                    <div className="hidden md:block text-gray-400 text-sm mt-2">→</div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 text-xs text-gray-500">
              These stages will be used as columns in the candidate kanban board. The "Rejected" stage is available but not shown in the preview.
            </div>
          </Card>
        </div>

        <DrawerFooter className="gap-2">
          <Button 
            onClick={handleSave}
            disabled={!isFormValid}
          >
            Create Requisition
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
