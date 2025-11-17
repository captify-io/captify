"use client";

import React, { useState } from "react";
import { Button } from "@captify-io/base/ui";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@captify-io/base/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@captify-io/base/ui";
import { Calendar } from "@captify-io/base/ui";
import { cn } from "@captify-io/base/lib/utils";
import { CalendarIcon, User, Target, AlertCircle } from "lucide-react";
import type { WorkspaceProject, ProjectStatus } from "@captify-io/workspace/types";

interface ProjectPropertiesProps {
  project: WorkspaceProject;
  onUpdate: (updates: Partial<WorkspaceProject>) => void;
}

const statusConfig: Record<ProjectStatus, { label: string; color: string }> = {
  planned: { label: "Planned", color: "bg-gray-500" },
  active: { label: "Active", color: "bg-blue-500" },
  paused: { label: "Paused", color: "bg-yellow-500" },
  completed: { label: "Completed", color: "bg-green-500" },
  cancelled: { label: "Cancelled", color: "bg-red-500" },
};

export function ProjectProperties({ project, onUpdate }: ProjectPropertiesProps) {
  const [statusOpen, setStatusOpen] = useState(false);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [targetDateOpen, setTargetDateOpen] = useState(false);

  const handleStatusChange = (status: ProjectStatus) => {
    onUpdate({ status });
    setStatusOpen(false);
  };

  const handleStartDateSelect = (date: Date | undefined) => {
    if (date) {
      onUpdate({ startDate: date.toISOString().split("T")[0] });
      setStartDateOpen(false);
    }
  };

  const handleTargetDateSelect = (date: Date | undefined) => {
    if (date) {
      onUpdate({ targetDate: date.toISOString().split("T")[0] });
      setTargetDateOpen(false);
    }
  };

  const statusInfo = project.status ? statusConfig[project.status] : statusConfig.planned;

  return (
    <div className="flex flex-wrap gap-3">
      {/* Status Property */}
      <Popover open={statusOpen} onOpenChange={setStatusOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2 h-9">
            <div className={cn("w-2 h-2 rounded-full", statusInfo.color)} />
            <span className="font-medium">{statusInfo.label}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2">
          <div className="space-y-1">
            {Object.entries(statusConfig).map(([value, config]) => (
              <Button
                key={value}
                variant="ghost"
                className="w-full justify-start gap-3 h-9"
                onClick={() => handleStatusChange(value as ProjectStatus)}
              >
                <div className={cn("w-2 h-2 rounded-full", config.color)} />
                <span>{config.label}</span>
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Start Date Property */}
      <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2 h-9">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground text-xs">Start:</span>
            <span className="font-medium">
              {project.startDate
                ? new Date(project.startDate).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "No date"}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={project.startDate ? new Date(project.startDate) : undefined}
            onSelect={handleStartDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* Target Date Property */}
      <Popover open={targetDateOpen} onOpenChange={setTargetDateOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2 h-9">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground text-xs">Target:</span>
            <span className="font-medium">
              {project.targetDate
                ? new Date(project.targetDate).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "No date"}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={project.targetDate ? new Date(project.targetDate) : undefined}
            onSelect={handleTargetDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* Lead Property */}
      {project.leadId && (
        <Button variant="outline" className="gap-2 h-9">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground text-xs">Lead:</span>
          <span className="font-medium">{project.leadId}</span>
        </Button>
      )}

      {/* Teams Count */}
      {project.teamIds && project.teamIds.length > 0 && (
        <Button variant="outline" className="gap-2 h-9">
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">
            {project.teamIds.length} {project.teamIds.length === 1 ? "Team" : "Teams"}
          </span>
        </Button>
      )}
    </div>
  );
}
