"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function EditInterviewForm({ interview, onUpdateInterview, stageName }) {
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    interviewer: interview?.interviewer || "",
    rating: interview?.rating || "",
    feedback: interview?.feedback || "",
  });

  const validateForm = () => {
    const newErrors = {};

    // Validate interviewer
    if (!formData.interviewer.trim()) {
      newErrors.interviewer = "Interviewer name is required";
    } else if (formData.interviewer.trim().length < 2) {
      newErrors.interviewer = "Interviewer name must be at least 2 characters";
    }

    // Validate rating
    if (!formData.rating) {
      newErrors.rating = "Rating is required";
    } else {
      const rating = parseInt(formData.rating);
      if (isNaN(rating) || rating < 1 || rating > 5) {
        newErrors.rating = "Rating must be between 1 and 5";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const updatedInterview = {
      ...interview,
      interviewer: formData.interviewer.trim(),
      rating: parseInt(formData.rating),
      feedback: formData.feedback.trim(),
    };

    onUpdateInterview(updatedInterview);
    setIsOpen(false);
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      interviewer: interview?.interviewer || "",
      rating: interview?.rating || "",
      feedback: interview?.feedback || "",
    });
    setErrors({});
    setIsOpen(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // Reset form data when interview prop changes
  useState(() => {
    setFormData({
      interviewer: interview?.interviewer || "",
      rating: interview?.rating || "",
      feedback: interview?.feedback || "",
    });
  }, [interview]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 px-2">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Interview Details</DialogTitle>
          <DialogDescription>
            Update the details for the {stageName} interview.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="interviewer">Interviewer *</Label>
            <Input
              id="interviewer"
              value={formData.interviewer}
              onChange={(e) => handleInputChange("interviewer", e.target.value)}
              placeholder="Enter interviewer name"
              className={errors.interviewer ? "border-red-500" : ""}
              required
            />
            {errors.interviewer && (
              <p className="text-red-500 text-xs mt-1">{errors.interviewer}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="rating">Rating (1-5) *</Label>
            <select
              id="rating"
              value={formData.rating}
              onChange={(e) => handleInputChange("rating", e.target.value)}
              required
              className={`flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.rating ? "border-red-500" : "border-input"
              }`}
            >
              <option value="">Select rating...</option>
              <option value="1">1 - Poor</option>
              <option value="2">2 - Below Average</option>
              <option value="3">3 - Average</option>
              <option value="4">4 - Good</option>
              <option value="5">5 - Excellent</option>
            </select>
            {errors.rating && (
              <p className="text-red-500 text-xs mt-1">{errors.rating}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback">Feedback (optional)</Label>
            <Textarea
              id="feedback"
              value={formData.feedback}
              onChange={(e) => handleInputChange("feedback", e.target.value)}
              placeholder="Enter interview feedback and notes..."
              className="min-h-[80px]"
            />
          </div>
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            Update Interview
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
