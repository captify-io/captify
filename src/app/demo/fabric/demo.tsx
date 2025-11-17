'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@captify-io/base/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@captify-io/base/ui';
import { Badge } from '@captify-io/base/ui';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function Demo() {
  return (
    <div className="container mx-auto p-8 space-y-6">
      <Link
        href="/demo"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Demo Hub
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">@captify-io/fabric Demo</h1>
        <p className="text-muted-foreground">
          Comprehensive demonstration of ProseMirror-based living documentation system
        </p>
      </div>

      {/* Package Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Package Information</CardTitle>
          <CardDescription>
            Living documentation package built on ProseMirror
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Key Features:</h3>
              <ul className="space-y-1 text-sm">
                <li><Badge variant="secondary">Rich Text Editing</Badge> - ProseMirror editor</li>
                <li><Badge variant="secondary">Real-time Collaboration</Badge> - Y.js + WebSocket</li>
                <li><Badge variant="secondary">Wikilinks</Badge> - Internal document linking</li>
                <li><Badge variant="secondary">Entity References</Badge> - Link to ontology nodes</li>
                <li><Badge variant="secondary">Comments</Badge> - Inline commenting system</li>
                <li><Badge variant="secondary">Templates</Badge> - Document templates with variables</li>
                <li><Badge variant="secondary">AI Assistance</Badge> - Inline chat integration</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Bundle Info:</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Package:</dt>
                  <dd className="font-mono">@captify-io/fabric</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Version:</dt>
                  <dd className="font-mono">1.0.0</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Client Bundle:</dt>
                  <dd className="font-mono">181.83 KB</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Dependencies:</dt>
                  <dd className="font-mono">ProseMirror, Y.js</dd>
                </div>
              </dl>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Demos */}
      <Tabs defaultValue="features" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="architecture">Architecture</TabsTrigger>
        </TabsList>

        {/* Tab 1: Features */}
        <TabsContent value="features" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Editor Features</CardTitle>
                <CardDescription>ProseMirror-based rich text editing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge>Rich Text</Badge>
                  <span>Headers, bold, italic, lists, tables</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>Markdown</Badge>
                  <span>Markdown input rules</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>Autocomplete</Badge>
                  <span>@ mentions and entity linking</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>Images</Badge>
                  <span>Paste/upload with S3 storage</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>Tables</Badge>
                  <span>Create and edit tables</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Collaboration</CardTitle>
                <CardDescription>Real-time multi-user editing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge>Y.js</Badge>
                  <span>CRDT-based synchronization</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>Presence</Badge>
                  <span>See who's editing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>Cursors</Badge>
                  <span>Remote cursor positions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>Comments</Badge>
                  <span>Inline threaded comments</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>Offline</Badge>
                  <span>Offline editing with sync</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Templates</CardTitle>
                <CardDescription>Document templates with variables</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge>Variables</Badge>
                  <span>Dynamic template fields</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>Picker</Badge>
                  <span>Template selection dialog</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>Starter Templates</Badge>
                  <span>Pre-built document templates</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>Custom</Badge>
                  <span>Create your own templates</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>Management</Badge>
                  <span>Template CRUD operations</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Features</CardTitle>
                <CardDescription>Intelligent assistance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge>Inline Chat</Badge>
                  <span>Chat within documents</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>Suggestions</Badge>
                  <span>AI-powered writing help</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>Agent Changes</Badge>
                  <span>Review/approve AI edits</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>Context</Badge>
                  <span>Document-aware responses</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Components */}
        <TabsContent value="components" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Component Structure</CardTitle>
              <CardDescription>
                Main components in the fabric package
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Core Components</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">FabricProvider</Badge>
                      <span className="text-muted-foreground">Context provider</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Fabric</Badge>
                      <span className="text-muted-foreground">Main layout component</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">ProseMirrorEditor</Badge>
                      <span className="text-muted-foreground">Rich text editor</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">EditorPanel</Badge>
                      <span className="text-muted-foreground">Editor container</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">NotesPanel</Badge>
                      <span className="text-muted-foreground">Document browser</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Template Components</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">TemplatePicker</Badge>
                      <span className="text-muted-foreground">Select templates</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">TemplateEditor</Badge>
                      <span className="text-muted-foreground">Edit templates</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">TemplateManagement</Badge>
                      <span className="text-muted-foreground">CRUD interface</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">VariableInputDialog</Badge>
                      <span className="text-muted-foreground">Input variables</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Editor Plugins</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Autocomplete</Badge>
                      <span className="text-muted-foreground">@ mentions, entity links</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Comments</Badge>
                      <span className="text-muted-foreground">Inline commenting</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Presence</Badge>
                      <span className="text-muted-foreground">User presence tracking</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">ImagePaste</Badge>
                      <span className="text-muted-foreground">Image upload handling</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">LinkClick</Badge>
                      <span className="text-muted-foreground">Wikilink navigation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">InlineChat</Badge>
                      <span className="text-muted-foreground">AI assistant</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Architecture */}
        <TabsContent value="architecture" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Architecture Compliance</CardTitle>
              <CardDescription>Package follows architectural guidelines</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50">✓</Badge>
                  <span>Client-side components only (ProseMirror is browser-only)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50">✓</Badge>
                  <span>Uses @captify-io/base for UI components and API client</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50">✓</Badge>
                  <span>Integrates with @captify-io/ontology for entity linking</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50">✓</Badge>
                  <span>No circular dependencies with captify app</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50">✓</Badge>
                  <span>Clean package separation (31 files extracted)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50">✓</Badge>
                  <span>External dependencies properly marked (ProseMirror, Y.js)</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Technical Stack</CardTitle>
              <CardDescription>Core technologies and dependencies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Editor Framework</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• prosemirror-model - Document schema</li>
                    <li>• prosemirror-state - Editor state management</li>
                    <li>• prosemirror-view - DOM rendering</li>
                    <li>• prosemirror-commands - Standard commands</li>
                    <li>• prosemirror-history - Undo/redo</li>
                    <li>• prosemirror-keymap - Keyboard shortcuts</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Collaboration</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• yjs - CRDT data structures</li>
                    <li>• y-prosemirror - ProseMirror bindings</li>
                    <li>• prosemirror-collab - Collaboration primitives</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Extensions</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• prosemirror-tables - Table support</li>
                    <li>• prosemirror-autocomplete - Autocomplete</li>
                    <li>• prosemirror-inputrules - Markdown shortcuts</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Additional</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• date-fns - Date formatting</li>
                    <li>• AWS SDK - S3 image uploads</li>
                    <li>• DynamoDB - Document storage</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
