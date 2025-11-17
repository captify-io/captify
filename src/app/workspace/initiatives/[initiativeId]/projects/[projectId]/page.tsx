"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const initiativeId = params.initiativeId as string;
  const projectId = params.projectId as string;

  // Redirect to overview by default
  useEffect(() => {
    router.replace(`/workspace/initiatives/${initiativeId}/projects/${projectId}/overview`);
  }, [initiativeId, projectId]);

  return null;
}
