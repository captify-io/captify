"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCaptify } from "@captify-io/base";
import { usePageContext } from "@captify-io/base";
import { apiClient } from "@captify-io/base";
import { ClipboardList, MessageSquare, CheckSquare2, Users } from "lucide-react";
import type { Project } from "@captify-io/base/types";

export default function ProjectTeamPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;
  const { workspace } = useCaptify();
  const { setPageContext } = usePageContext();
  const [project, setProject] = useState<Project | null>(null);

  // Fetch project data
  useEffect(() => {
    if (!projectId || !workspace?.id) return;

    const fetchProject = async () => {
      try {
        const response = await apiClient.run({
          app: 'ontology',
          operation: 'getItem',
          data: {
            type: 'workspace-project',
            id: projectId,
            workspaceId: workspace.id,
          },
        });

        if (response.success && response.data) {
          setProject(response.data as Project);
        }
      } catch (error) {
        console.error('Failed to fetch project:', error);
      }
    };

    fetchProject();
  }, [projectId, workspace?.id]);

  // Set navigation buttons, title, and hide main menu
  useEffect(() => {
    setPageContext({
      title: project?.name || 'Loading...',
      hideMainMenu: true,
      onClose: () => router.push('/project'),
      navButtons: [
        {
          id: 'overview',
          label: 'Overview',
          icon: ClipboardList,
          isActive: false,
          onClick: () => router.push(`/project/${projectId}/overview`),
        },
        {
          id: 'activity',
          label: 'Activity',
          icon: MessageSquare,
          isActive: false,
          onClick: () => router.push(`/project/${projectId}/activity`),
        },
        {
          id: 'issues',
          label: 'Issues',
          icon: CheckSquare2,
          isActive: false,
          onClick: () => router.push(`/project/${projectId}/issues`),
        },
      ],
    });

    // Clean up when component unmounts
    return () => {
      setPageContext({ navButtons: [], hideMainMenu: false, title: '', onClose: undefined });
    };
  }, [projectId, router, setPageContext, project?.name]);

  return (
    <div className="flex flex-col h-full p-6">
      <h1 className="text-2xl font-bold mb-4">Project Team</h1>
      <p className="text-muted-foreground">No team members yet. This is where project team members will appear.</p>
    </div>
  );
}
