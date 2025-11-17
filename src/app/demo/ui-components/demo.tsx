'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Alert,
  AlertDescription,
  AlertTitle,
  Input,
  Label,
  Checkbox,
  RadioGroup,
  RadioGroupItem,
  Switch,
  Slider,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Progress,
  Separator,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@captify-io/base/ui';
import Link from 'next/link';
import {
  ArrowLeft,
  AlertCircle,
  Info,
  CheckCircle2,
  AlertTriangle,
  Download,
  Settings,
  User,
  LogOut,
  Mail,
} from 'lucide-react';

export function Demo() {
  const [sliderValue, setSliderValue] = useState([50]);
  const [progressValue, setProgressValue] = useState(60);
  const [switchChecked, setSwitchChecked] = useState(false);

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
        <h1 className="text-3xl font-bold mb-2">@captify-io/base - UI Components Demo</h1>
        <p className="text-muted-foreground">
          40+ production-ready UI components built on Radix UI with full TypeScript support
        </p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="buttons">Buttons & Inputs</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="overlays">Overlays</TabsTrigger>
          <TabsTrigger value="data">Data Display</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Component Library Overview</CardTitle>
              <CardDescription>
                Comprehensive UI components for building accessible, production-ready applications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Available Components (40+)</h3>
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <Badge variant="secondary">Accordion</Badge>
                  <Badge variant="secondary">Alert</Badge>
                  <Badge variant="secondary">AlertDialog</Badge>
                  <Badge variant="secondary">AspectRatio</Badge>
                  <Badge variant="secondary">Avatar</Badge>
                  <Badge variant="secondary">Badge</Badge>
                  <Badge variant="secondary">Breadcrumb</Badge>
                  <Badge variant="secondary">Button</Badge>
                  <Badge variant="secondary">Calendar</Badge>
                  <Badge variant="secondary">Card</Badge>
                  <Badge variant="secondary">Carousel</Badge>
                  <Badge variant="secondary">Chart</Badge>
                  <Badge variant="secondary">Checkbox</Badge>
                  <Badge variant="secondary">Collapsible</Badge>
                  <Badge variant="secondary">Command</Badge>
                  <Badge variant="secondary">ContextMenu</Badge>
                  <Badge variant="secondary">DataTable</Badge>
                  <Badge variant="secondary">Dialog</Badge>
                  <Badge variant="secondary">Drawer</Badge>
                  <Badge variant="secondary">DropdownMenu</Badge>
                  <Badge variant="secondary">Form</Badge>
                  <Badge variant="secondary">HoverCard</Badge>
                  <Badge variant="secondary">Input</Badge>
                  <Badge variant="secondary">InputOTP</Badge>
                  <Badge variant="secondary">Label</Badge>
                  <Badge variant="secondary">Menubar</Badge>
                  <Badge variant="secondary">NavigationMenu</Badge>
                  <Badge variant="secondary">Pagination</Badge>
                  <Badge variant="secondary">Popover</Badge>
                  <Badge variant="secondary">Progress</Badge>
                  <Badge variant="secondary">RadioGroup</Badge>
                  <Badge variant="secondary">ScrollArea</Badge>
                  <Badge variant="secondary">Select</Badge>
                  <Badge variant="secondary">Separator</Badge>
                  <Badge variant="secondary">Sheet</Badge>
                  <Badge variant="secondary">Skeleton</Badge>
                  <Badge variant="secondary">Slider</Badge>
                  <Badge variant="secondary">Switch</Badge>
                  <Badge variant="secondary">Table</Badge>
                  <Badge variant="secondary">Tabs</Badge>
                  <Badge variant="secondary">Textarea</Badge>
                  <Badge variant="secondary">Toast</Badge>
                  <Badge variant="secondary">Toggle</Badge>
                  <Badge variant="secondary">Tooltip</Badge>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Key Features</h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>
                    <strong>Accessible:</strong> Built on Radix UI primitives with WAI-ARIA compliance
                  </li>
                  <li>
                    <strong>Customizable:</strong> Tailwind CSS v4 styling with theme support
                  </li>
                  <li>
                    <strong>TypeScript:</strong> Full type safety with exported prop types
                  </li>
                  <li>
                    <strong>Dark Mode:</strong> Built-in dark mode support with theme provider
                  </li>
                  <li>
                    <strong>Responsive:</strong> Mobile-first design with responsive utilities
                  </li>
                  <li>
                    <strong>Tree-shakeable:</strong> Import only what you need
                  </li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Usage Example</h3>
                <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
                  {`import { Button, Card, Dialog } from '@captify-io/base/ui';

export function MyComponent() {
  return (
    <Card className="p-6">
      <h2>Welcome</h2>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>
              Dialog content goes here
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </Card>
  );
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="buttons" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Buttons & Input Components</CardTitle>
              <CardDescription>Interactive elements for user input and actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Buttons</h3>
                <div className="flex flex-wrap gap-3">
                  <Button>Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                  <Button size="sm">Small</Button>
                  <Button size="lg">Large</Button>
                  <Button disabled>Disabled</Button>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Text Inputs</h3>
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Enter your email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="Enter password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Type your message here" rows={4} />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Selection Controls</h3>
                <div className="space-y-4 max-w-md">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" />
                    <Label htmlFor="terms">Accept terms and conditions</Label>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications">Enable notifications</Label>
                    <Switch
                      id="notifications"
                      checked={switchChecked}
                      onCheckedChange={setSwitchChecked}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Select an option</Label>
                    <RadioGroup defaultValue="option1">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option1" id="option1" />
                        <Label htmlFor="option1">Option 1</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option2" id="option2" />
                        <Label htmlFor="option2">Option 2</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option3" id="option3" />
                        <Label htmlFor="option3">Option 3</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>Select Framework</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a framework" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="next">Next.js</SelectItem>
                        <SelectItem value="react">React</SelectItem>
                        <SelectItem value="vue">Vue</SelectItem>
                        <SelectItem value="svelte">Svelte</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Volume ({sliderValue[0]}%)</Label>
                    <Slider value={sliderValue} onValueChange={setSliderValue} max={100} step={1} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feedback Components</CardTitle>
              <CardDescription>
                Components for providing feedback and status information to users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Alerts</h3>
                <div className="space-y-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Info</AlertTitle>
                    <AlertDescription>
                      This is an informational alert with helpful information.
                    </AlertDescription>
                  </Alert>

                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      An error occurred. Please try again later.
                    </AlertDescription>
                  </Alert>

                  <Alert className="border-green-500 text-green-900 dark:text-green-100">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>Your changes have been saved successfully.</AlertDescription>
                  </Alert>

                  <Alert className="border-yellow-500 text-yellow-900 dark:text-yellow-100">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Warning</AlertTitle>
                    <AlertDescription>
                      This action cannot be undone. Please proceed with caution.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Badges</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge className="bg-green-500">Custom</Badge>
                  <Badge className="bg-blue-500">Status: Active</Badge>
                  <Badge className="bg-orange-500">Priority: High</Badge>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Progress</h3>
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Upload Progress</span>
                      <span>{progressValue}%</span>
                    </div>
                    <Progress value={progressValue} />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => setProgressValue(Math.max(0, progressValue - 10))}>
                      -10%
                    </Button>
                    <Button size="sm" onClick={() => setProgressValue(Math.min(100, progressValue + 10))}>
                      +10%
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setProgressValue(0)}>
                      Reset
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Avatars</h3>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback>AB</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overlays" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Overlay Components</CardTitle>
              <CardDescription>Dialogs, popovers, dropdowns, and tooltips</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Dialog</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Open Dialog</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Dialog Title</DialogTitle>
                      <DialogDescription>
                        This is a dialog component that can contain any content. It's accessible and
                        keyboard navigable.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="Enter your name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email-dialog">Email</Label>
                        <Input id="email-dialog" type="email" placeholder="Enter your email" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">Cancel</Button>
                      <Button>Submit</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Dropdown Menu</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Popover</h3>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">Open Popover</Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-3">
                      <h4 className="font-medium">Dimensions</h4>
                      <div className="space-y-2">
                        <div className="grid grid-cols-3 items-center gap-4">
                          <Label htmlFor="width">Width</Label>
                          <Input id="width" defaultValue="100%" className="col-span-2 h-8" />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                          <Label htmlFor="height">Height</Label>
                          <Input id="height" defaultValue="25px" className="col-span-2 h-8" />
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Tooltip</h3>
                <TooltipProvider>
                  <div className="flex gap-4">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Download file</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Mail className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Send email</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Display Components</CardTitle>
              <CardDescription>Tables, accordions, and other data presentation components</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Table</h3>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">John Doe</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">Active</Badge>
                        </TableCell>
                        <TableCell>Admin</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Jane Smith</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">Active</Badge>
                        </TableCell>
                        <TableCell>Editor</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Bob Johnson</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Inactive</Badge>
                        </TableCell>
                        <TableCell>Viewer</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Accordion</h3>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>What is Captify?</AccordionTrigger>
                    <AccordionContent>
                      Captify is a comprehensive platform for building enterprise applications with
                      AI-powered features, workflow automation, and collaborative tools.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>How do I get started?</AccordionTrigger>
                    <AccordionContent>
                      You can get started by exploring the demo pages, reading the documentation, and
                      trying out the interactive examples throughout the platform.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Is it accessible?</AccordionTrigger>
                    <AccordionContent>
                      Yes! All components are built with accessibility in mind using Radix UI primitives
                      and follow WAI-ARIA guidelines.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Cards</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Card Title</CardTitle>
                      <CardDescription>Card description goes here</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Card content with useful information
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Statistics</CardTitle>
                      <CardDescription>Platform metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">1,234</div>
                      <p className="text-sm text-muted-foreground">Total users</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                      <CardDescription>Common tasks</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Button size="sm" className="w-full">
                          Create Project
                        </Button>
                        <Button size="sm" variant="outline" className="w-full">
                          View Reports
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
