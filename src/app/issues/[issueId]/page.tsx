"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function IssueRedirect() {
  const params = useParams();
  const router = useRouter();
  const issueId = params.issueId as string;

  useEffect(() => {
    router.replace(`/workspace/issues/${issueId}`);
  }, [issueId, router]);

  return null;
}
