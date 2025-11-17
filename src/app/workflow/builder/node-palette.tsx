/**
 * Node Palette Component
 * Displays available workflow nodes for drag-and-drop
 */

'use client';

import React from 'react';
import { Card } from '@captify-io/base/ui';
import { NODE_DEFINITIONS, type NodeCategory } from '@/types/workflow/nodes';

export interface NodePaletteProps {
  onNodeSelect?: (nodeType: string) => void;
  filter?: NodeCategory;
}

export function NodePalette({ onNodeSelect, filter }: NodePaletteProps) {
  const nodes = Object.values(NODE_DEFINITIONS).filter(
    (node) => !filter || node.category === filter
  );

  const categories: NodeCategory[] = ['core', 'logic', 'data', 'tools'];

  return (
    <div className="w-64 p-4 space-y-4">
      <h3 className="text-lg font-semibold">Node Palette</h3>

      {categories.map((category) => {
        const categoryNodes = nodes.filter((n) => n.category === category);
        if (categoryNodes.length === 0) return null;

        return (
          <div key={category} className="space-y-2">
            <h4 className="text-sm font-medium capitalize">{category}</h4>
            <div className="space-y-1">
              {categoryNodes.map((node) => (
                <Card
                  key={node.type}
                  className="p-3 cursor-pointer hover:bg-accent"
                  onClick={() => onNodeSelect?.(node.type)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{node.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {node.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
