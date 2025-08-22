"use client";

import { useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  getRequisitionStats,
  getPriorityBadge,
  REQUISITION_STATUS,
} from "@/lib/data";
import {
  requisitionStatsAtom,
  openAddRequisitionModalAtom
} from "@/lib/atoms";

export default function RequisitionOverview({ onSelectRequisition, requisitions, candidates }) {
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("table"); // "card" or "table"
  
  // Jotai atoms
  const requisitionStats = useAtomValue(requisitionStatsAtom);
  const openAddRequisitionModal = useSetAtom(openAddRequisitionModalAtom);

  const getStatusBadge = (status) => {
    const colors = {
      open: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      draft: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
      on_hold:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      closed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}
      >
        {status.replace("_", " ").toUpperCase()}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredRequisitions = requisitions.filter((req) => {
    if (activeTab === "all") return true;
    return req.status === activeTab;
  });

  return (
    <div className="h-full overflow-auto p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Candidate Tracking System
              </h1>
              <p className="text-base lg:text-lg text-gray-600 dark:text-gray-300">
                Manage job requisitions and track candidates through the hiring
                process
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <ToggleGroup 
                type="single" 
                value={viewMode} 
                onValueChange={(value) => value && setViewMode(value)}
                variant="outline"
              >
                <ToggleGroupItem value="card" aria-label="Card view">
                  Cards
                </ToggleGroupItem>
                <ToggleGroupItem value="table" aria-label="Table view">
                  Table
                </ToggleGroupItem>
              </ToggleGroup>
              <Button 
                onClick={() => openAddRequisitionModal()}
                size="lg"
              >
                + Add New Requisition
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Requisitions</TabsTrigger>
            {Object.values(REQUISITION_STATUS).map((status) => (
              <TabsTrigger key={status} value={status}>
                {status.replace("_", " ").toUpperCase()}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {requisitions.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Total Requisitions
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {requisitions.filter((req) => req.status === "open").length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Open Positions
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {requisitions.reduce(
                (sum, req) => sum + req.positions_to_fill,
                0,
              )}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Total Positions to Fill
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {candidates.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Total Candidates
            </div>
          </Card>
        </div>

        {/* Requisitions Display */}
        {viewMode === "card" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredRequisitions.map((requisition) => {
              const stats = requisitionStats.find(rs => rs.requisition.id === requisition.id)?.stats;

              return (
                <Card
                  key={requisition.id}
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => onSelectRequisition(requisition)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {requisition.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {requisition.department} • {requisition.location}
                      </p>
                    </div>
                    <div className="ml-4 space-y-1">
                      {getStatusBadge(requisition.status)}
                      <div className="flex justify-end">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(requisition.priority)}`}
                        >
                          {requisition.priority}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        Hiring Manager:
                      </span>
                      <span className="font-medium">
                        {requisition.hiring_manager}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        Recruiter:
                      </span>
                      <span className="font-medium">{requisition.recruiter}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        Positions:
                      </span>
                      <span className="font-medium">
                        {requisition.positions_to_fill}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        Target Start:
                      </span>
                      <span className="font-medium">
                        {formatDate(requisition.target_start_date)}
                      </span>
                    </div>
                  </div>

                  {/* Candidate Stats */}
                  {stats && (
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          Candidates
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {stats.total_candidates} total
                        </Badge>
                      </div>

                      {/* Stage Progress */}
                      <div className="space-y-2">
                        {requisition.hiring_stages.slice(0, 4).map((stage) => {
                          const count = stats.stages[stage.id] || 0;
                          return count > 0 ? (
                            <div
                              key={stage.id}
                              className="flex justify-between text-xs"
                            >
                              <span className="text-gray-600 dark:text-gray-400 truncate">
                                {stage.name}
                              </span>
                              <span className="font-medium">{count}</span>
                            </div>
                          ) : null;
                        })}
                        {Object.values(stats.stages).some(
                          (count) => count > 0,
                        ) ? null : (
                          <div className="text-xs text-gray-500 italic">
                            No candidates yet
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="mt-4 pt-4 border-t">
                    <Button
                      className="w-full"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectRequisition(requisition);
                      }}
                    >
                      View Kanban Board
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <div className="overflow-auto max-h-[70vh]">
              <Table>
                <TableHeader className="sticky top-0 bg-background">
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Position</TableHead>
                    <TableHead className="whitespace-nowrap">Department</TableHead>
                    <TableHead className="whitespace-nowrap">Location</TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                    <TableHead className="whitespace-nowrap">Priority</TableHead>
                    <TableHead className="whitespace-nowrap">Positions</TableHead>
                    <TableHead className="whitespace-nowrap">Hiring Manager</TableHead>
                    <TableHead className="whitespace-nowrap">Recruiter</TableHead>
                    <TableHead className="whitespace-nowrap">Target Start</TableHead>
                    <TableHead className="whitespace-nowrap">Candidates</TableHead>
                    <TableHead className="whitespace-nowrap">Actions</TableHead>
                  </TableRow>
                </TableHeader>
              <TableBody>
                {filteredRequisitions.map((requisition) => {
                  const stats = requisitionStats.find(rs => rs.requisition.id === requisition.id)?.stats;
                  
                  return (
                    <TableRow
                      key={requisition.id}
                      className="cursor-pointer"
                      onClick={() => onSelectRequisition(requisition)}
                    >
                      <TableCell className="font-medium min-w-[180px]">
                        {requisition.title}
                      </TableCell>
                      <TableCell className="min-w-[120px]">{requisition.department}</TableCell>
                      <TableCell className="min-w-[120px]">{requisition.location}</TableCell>
                      <TableCell>
                        {getStatusBadge(requisition.status)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(requisition.priority)}`}
                        >
                          {requisition.priority}
                        </span>
                      </TableCell>
                      <TableCell>{requisition.positions_to_fill}</TableCell>
                      <TableCell>{requisition.hiring_manager}</TableCell>
                      <TableCell>{requisition.recruiter}</TableCell>
                      <TableCell>{formatDate(requisition.target_start_date)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {stats?.total_candidates || 0}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectRequisition(requisition);
                          }}
                        >
                          View Board
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              </Table>
            </div>
          </Card>
        )}

        {filteredRequisitions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400">
              No requisitions found for the selected filter.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
