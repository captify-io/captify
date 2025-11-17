"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@captify-io/base/ui";
import { Activity, BarChart3, TrendingUp, Users } from "lucide-react";

export default function InsightsPage() {
  const metrics = [
    {
      title: "Total Projects",
      value: "12",
      change: "+2 this week",
      icon: Activity,
      trend: "up"
    },
    {
      title: "Active Issues",
      value: "48",
      change: "-5 from last week",
      icon: BarChart3,
      trend: "down"
    },
    {
      title: "Team Members",
      value: "8",
      change: "+1 this month",
      icon: Users,
      trend: "up"
    },
    {
      title: "Completion Rate",
      value: "87%",
      change: "+3% this week",
      icon: TrendingUp,
      trend: "up"
    }
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Insights</h1>
        <p className="text-muted-foreground">
          Overview of your workspace activity and metrics
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className={`text-xs ${
                  metric.trend === "up"
                    ? "text-green-600 dark:text-green-400"
                    : "text-muted-foreground"
                }`}>
                  {metric.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates across your workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Project Alpha updated</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Issue #42 completed</p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-orange-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">New team member added</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Projects</CardTitle>
            <CardDescription>
              Most active projects this week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium">Project Alpha</p>
                  <p className="text-xs text-muted-foreground">15 issues updated</p>
                </div>
                <div className="text-sm font-medium text-green-600 dark:text-green-400">
                  92%
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium">Project Beta</p>
                  <p className="text-xs text-muted-foreground">8 issues updated</p>
                </div>
                <div className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                  67%
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium">Project Gamma</p>
                  <p className="text-xs text-muted-foreground">5 issues updated</p>
                </div>
                <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  45%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
