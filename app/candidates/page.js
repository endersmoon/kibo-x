'use client';

import { useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getPriorityBadge } from '@/lib/data';
import { ExternalLink, Phone, Mail, MapPin, Plus } from 'lucide-react';
import CandidateModal from '@/components/candidate-modal';
import AddCandidateForm from '@/components/add-candidate-form';
import {
  candidatesWithRequisitionInfoAtom,
  candidateStatsAtom,
  requisitionsAtom,
  selectedCandidateAtom,
  candidateModalOpenAtom,
  addCandidateModalOpenAtom,
  selectedRequisitionForAddAtom,
  openCandidateModalAtom,
  closeCandidateModalAtom,
  openAddCandidateModalAtom,
  closeAddCandidateModalAtom,
  addCandidateAtom,
  updateCandidateAtom
} from '@/lib/atoms';

export default function CandidatesPage() {
  // Local state for filters
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedStage, setSelectedStage] = useState('all');
  const [selectedRequisition, setSelectedRequisition] = useState('all');
  
  // Jotai atoms
  const candidatesWithRequisition = useAtomValue(candidatesWithRequisitionInfoAtom);
  const candidateStats = useAtomValue(candidateStatsAtom);
  const requisitions = useAtomValue(requisitionsAtom);
  const selectedCandidate = useAtomValue(selectedCandidateAtom);
  const isModalOpen = useAtomValue(candidateModalOpenAtom);
  const isAddCandidateOpen = useAtomValue(addCandidateModalOpenAtom);
  const selectedRequisitionForAdd = useAtomValue(selectedRequisitionForAddAtom);
  
  // Action atoms
  const openCandidateModal = useSetAtom(openCandidateModalAtom);
  const closeCandidateModal = useSetAtom(closeCandidateModalAtom);
  const openAddCandidateModal = useSetAtom(openAddCandidateModalAtom);
  const closeAddCandidateModal = useSetAtom(closeAddCandidateModalAtom);
  const addCandidate = useSetAtom(addCandidateAtom);
  const updateCandidate = useSetAtom(updateCandidateAtom);

  // Filter candidates
  const filteredCandidates = candidatesWithRequisition.filter(candidate => {
    return (
      (selectedPriority === 'all' || candidate.priority === selectedPriority) &&
      (selectedStage === 'all' || candidate.current_stage === selectedStage) &&
      (selectedRequisition === 'all' || candidate.requisition_id === selectedRequisition)
    );
  });

  // Get unique values for filters
  const priorities = [...new Set(candidatesWithRequisition.map(c => c.priority))];
  const stages = [...new Set(candidatesWithRequisition.map(c => c.current_stage))];

  const formatStage = (stage) => {
    return stage.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getStageBadgeColor = (stage) => {
    const colors = {
      applied: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      screening: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      phone_interview: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
      technical_interview: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      final_interview: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
      case_study: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
      design_challenge: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
      portfolio_review: 'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-300',
      design_interview: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
      stakeholder_interview: 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300',
      team_interview: 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300',
      offer: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      hired: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };
    return colors[stage] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  };

  const handleCandidateClick = (candidate) => {
    openCandidateModal(candidate);
  };

  const handleCloseModal = () => {
    closeCandidateModal();
  };

  const handleSaveCandidate = (updatedCandidate) => {
    // In a real app, this would save to the database
    console.log('Saving candidate:', updatedCandidate);
    
    updateCandidate(updatedCandidate);
  };

  const handleAddCandidate = (newCandidate) => {
    // In a real app, this would save to the database
    console.log('Adding new candidate:', newCandidate);
    
    addCandidate(newCandidate);
  };

  const handleAddCandidateClick = () => {
    // If a specific requisition is filtered, use that as default
    if (selectedRequisition !== 'all') {
      const requisition = requisitions.find(req => req.id === selectedRequisition);
      openAddCandidateModal(requisition);
    } else {
      // Default to the first requisition if none is selected
      openAddCandidateModal(requisitions[0]);
    }
  };

  return (
    <div className="h-full overflow-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">All Candidates</h1>
            <p className="text-muted-foreground">
              View and manage all candidates across all requisitions
            </p>
          </div>
          <Button onClick={handleAddCandidateClick} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Candidate
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredCandidates.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Interview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {candidateStats.inInterview}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offers Extended</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {candidateStats.offersExtended}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hired</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {candidateStats.hired}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Requisition</label>
              <select
                value={selectedRequisition}
                onChange={(e) => setSelectedRequisition(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Requisitions</option>
                {requisitions.map(req => (
                  <option key={req.id} value={req.id}>{req.title}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Priority</label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Priorities</option>
                {priorities.map(priority => (
                  <option key={priority} value={priority}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Stage</label>
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Stages</option>
                {stages.map(stage => (
                  <option key={stage} value={stage}>{formatStage(stage)}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Candidates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Candidates ({filteredCandidates.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-auto max-h-[60vh] border-t">
            <Table>
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  <TableHead className="whitespace-nowrap">Name</TableHead>
                  <TableHead className="whitespace-nowrap">Position</TableHead>
                  <TableHead className="whitespace-nowrap">Stage</TableHead>
                  <TableHead className="whitespace-nowrap">Priority</TableHead>
                  <TableHead className="whitespace-nowrap">Experience</TableHead>
                  <TableHead className="whitespace-nowrap">Location</TableHead>
                  <TableHead className="whitespace-nowrap">Contact</TableHead>
                  <TableHead className="whitespace-nowrap">Applied</TableHead>
                  <TableHead className="whitespace-nowrap">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCandidates.map((candidate) => (
                  <TableRow 
                    key={candidate.id} 
                    className="hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleCandidateClick(candidate)}
                  >
                    <TableCell className="min-w-[200px]">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {candidate.first_name} {candidate.last_name}
                        </span>
                        <span className="text-sm text-muted-foreground truncate">
                          {candidate.current_title} at {candidate.current_company}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[180px]">
                      <div className="flex flex-col">
                        <span className="font-medium truncate">{candidate.requisition_title}</span>
                        <span className="text-sm text-muted-foreground">
                          {candidate.requisition_department}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStageBadgeColor(candidate.current_stage)}>
                        {formatStage(candidate.current_stage)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityBadge(candidate.priority)}>
                        {candidate.priority.charAt(0).toUpperCase() + candidate.priority.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {candidate.experience_years} years
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{candidate.location}</span>
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[200px]">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          <a 
                            href={`mailto:${candidate.email}`}
                            className="text-sm text-blue-600 hover:underline truncate"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {candidate.email}
                          </a>
                        </div>
                        {candidate.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                            <a 
                              href={`tel:${candidate.phone}`}
                              className="text-sm text-blue-600 hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {candidate.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {new Date(candidate.applied_date).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {candidate.linkedin_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(candidate.linkedin_url, '_blank');
                            }}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        )}
                        {candidate.portfolio_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(candidate.portfolio_url, '_blank');
                            }}
                          >
                            Portfolio
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredCandidates.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No candidates found matching the selected filters.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Candidate Modal */}
      {selectedCandidate && (
        <CandidateModal
          candidate={selectedCandidate}
          requisition={selectedCandidate?.requisition}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveCandidate}
        />
      )}

      {/* Add Candidate Form */}
      {selectedRequisitionForAdd && (
        <AddCandidateForm
          requisition={selectedRequisitionForAdd}
          allRequisitions={requisitions}
          isOpen={isAddCandidateOpen}
          onClose={closeAddCandidateModal}
          onSave={handleAddCandidate}
        />
      )}
    </div>
  );
}
