"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  useEffect(() => {
    // Redirect to overview page
    router.replace(`/project/${projectId}/overview`);
  }, [projectId, router]);

  return null;
}
