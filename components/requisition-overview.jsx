"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  sampleRequisitions,
  getRequisitionStats,
  getPriorityBadge,
  REQUISITION_STATUS,
} from "@/lib/data";

export default function RequisitionOverview({ onSelectRequisition }) {
  const [filter, setFilter] = useState("all");

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

  const filteredRequisitions = sampleRequisitions.filter((req) => {
    if (filter === "all") return true;
    return req.status === filter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Candidate Tracking System
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Manage job requisitions and track candidates through the hiring
            process
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All Requisitions
          </Button>
          {Object.values(REQUISITION_STATUS).map((status) => (
            <Button
              key={status}
              variant={filter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(status)}
            >
              {status.replace("_", " ").toUpperCase()}
            </Button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {sampleRequisitions.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Total Requisitions
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {sampleRequisitions.filter((req) => req.status === "open").length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Open Positions
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {sampleRequisitions.reduce(
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
              {sampleRequisitions.reduce((sum, req) => {
                const stats = getRequisitionStats(req.id);
                return sum + (stats ? stats.total_candidates : 0);
              }, 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Total Candidates
            </div>
          </Card>
        </div>

        {/* Requisitions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRequisitions.map((requisition) => {
            const stats = getRequisitionStats(requisition.id);

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
