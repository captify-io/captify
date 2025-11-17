"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Target,
  FolderKanban,
  CheckSquare2,
  Users,
  ArrowRight
} from "lucide-react";

export default function WorkspacePage() {
  const router = useRouter();

  const sections = [
    {
      title: "Initiatives",
      description: "Strategic objectives and key results",
      icon: Target,
      href: "/workspace/initiatives",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Projects",
      description: "All active projects and deliverables",
      icon: FolderKanban,
      href: "/workspace/projects",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Issues",
      description: "Track and manage work items",
      icon: CheckSquare2,
      href: "/workspace/issues",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Teams",
      description: "Workspace teams and members",
      icon: Users,
      href: "/workspace/teams",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <div className="container mx-auto p-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-bold mb-4">Workspace</h1>
        <p className="text-xl text-muted-foreground">
          Manage your initiatives, projects, issues, and teams
        </p>
      </div>

      {/* Navigation Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.href}
              onClick={() => router.push(section.href)}
              className="group relative p-8 border rounded-lg text-left hover:border-primary transition-all hover:shadow-lg bg-card"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${section.bgColor}`}>
                  <Icon className={`h-8 w-8 ${section.color}`} />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {section.title}
                  </h2>
                  <p className="text-muted-foreground">
                    {section.description}
                  </p>
                </div>
                <ArrowRight className="h-6 w-6 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Stats (Optional - can be populated later) */}
      <div className="mt-12 p-6 border rounded-lg bg-muted/30">
        <h3 className="text-sm font-semibold text-muted-foreground mb-4">
          QUICK STATS
        </h3>
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <div className="text-3xl font-bold">—</div>
            <div className="text-sm text-muted-foreground">Active Initiatives</div>
          </div>
          <div>
            <div className="text-3xl font-bold">—</div>
            <div className="text-sm text-muted-foreground">Active Projects</div>
          </div>
          <div>
            <div className="text-3xl font-bold">—</div>
            <div className="text-sm text-muted-foreground">Open Issues</div>
          </div>
          <div>
            <div className="text-3xl font-bold">—</div>
            <div className="text-sm text-muted-foreground">Teams</div>
          </div>
        </div>
      </div>
    </div>
  );
}
