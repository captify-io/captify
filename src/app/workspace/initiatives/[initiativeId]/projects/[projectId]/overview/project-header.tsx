"use client";

import React, { useState } from "react";
import { Input } from "@captify-io/base/ui";
import type { WorkspaceProject } from "@captify-io/workspace/types";

interface ProjectHeaderProps {
  project: WorkspaceProject;
  onUpdate: (updates: Partial<WorkspaceProject>) => void;
}

export function ProjectHeader({ project, onUpdate }: ProjectHeaderProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState(project.name);

  const handleNameBlur = () => {
    setIsEditingName(false);
    if (name !== project.name && name.trim()) {
      onUpdate({ name: name.trim() });
    } else {
      setName(project.name);
    }
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleNameBlur();
    } else if (e.key === "Escape") {
      setName(project.name);
      setIsEditingName(false);
    }
  };

  return (
    <div className="space-y-2">
      {/* Title */}
      {isEditingName ? (
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleNameBlur}
          onKeyDown={handleNameKeyDown}
          className="text-4xl font-bold border-none px-0 focus-visible:ring-0"
          autoFocus
        />
      ) : (
        <h1
          className="text-4xl font-bold cursor-pointer hover:text-primary transition-colors"
          onClick={() => setIsEditingName(true)}
        >
          {project.name}
        </h1>
      )}

      {/* Subtitle - Editable description summary */}
      <p className="text-lg text-muted-foreground">
        {project.description
          ? project.description.slice(0, 150) + (project.description.length > 150 ? "..." : "")
          : "Add a description below to get started"}
      </p>
    </div>
  );
}
