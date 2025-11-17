import type { CaptifyLayoutConfig } from "@captify-io/base";

/**
 * Captify Application Configuration
 *
 * Main Captify application providing workspace, ontology, flow, agent, and fabric features.
 */

export const config: CaptifyLayoutConfig = {
  slug: "captify",
  appName: "Captify",
  version: "2.0.0",
  description: "Unified platform for workspace, ontology, flow, agent, and fabric",

  // Menu items - organized by feature domain
  menu: [
    {
      id: "insights",
      label: "Insights",
      href: "/insights",
      icon: "BarChart3",
      order: 1,
    },
    {
      id: "projects",
      label: "Projects",
      href: "/workspace/initiatives",
      icon: "FolderKanban",
      order: 2,
      children: [
        {
          id: "initiatives",
          label: "Initiatives",
          href: "/workspace/initiatives",
          icon: "Target",
          order: 1,
          default: true,
        },
        {
          id: "issues",
          label: "Issues",
          href: "/workspace/issues",
          icon: "ListTodo",
          order: 2,
        },
        {
          id: "team",
          label: "Team",
          href: "/workspace/teams",
          icon: "Users",
          order: 3,
        },
      ],
      detailChildren: [
        {
          id: "overview",
          label: "Overview",
          href: "/workspace/initiatives/{initiativeId}/projects/{projectId}/overview",
          icon: "ClipboardList",
          order: 1,
        },
        {
          id: "issues",
          label: "Issues",
          href: "/workspace/initiatives/{initiativeId}/projects/{projectId}/issues",
          icon: "CheckSquare2",
          order: 2,
        },
        {
          id: "updates",
          label: "Updates",
          href: "/workspace/initiatives/{initiativeId}/projects/{projectId}/updates",
          icon: "MessageSquare",
          order: 3,
        },
      ],
    },
    {
      id: "ontology",
      label: "Ontology",
      href: "/ontology",
      icon: "Network",
      order: 3,
    },
  ],

  // Platform configuration
  platform: {
    url:
      typeof window !== "undefined" && window.location.hostname === "localhost"
        ? "http://localhost:3000"
        : "https://www.captify.io",
  },
};

export const { slug, description, menu, appName, version } = config;
export default config;
