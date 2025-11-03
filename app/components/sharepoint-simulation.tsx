
'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { FolderOpen, FileText, Upload, Download, Share2, Search, Plus, Eye, Edit, Trash2, RefreshCw } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  modifiedDate: string;
  modifiedBy: string;
  folder: string;
  url?: string;
  version: string;
  status: 'active' | 'archived';
}

interface Folder {
  id: string;
  name: string;
  path: string;
  documentCount: number;
  lastModified: string;
}

export default function SharePointSimulation() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFolder, setCurrentFolder] = useState('/');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  useEffect(() => {
    fetchSharePointData();
  }, [currentFolder]);

  const fetchSharePointData = async () => {
    try {
      const response = await fetch(`/api/sharepoint?folder=${encodeURIComponent(currentFolder)}`);
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents || []);
        setFolders(data.folders || []);
      } else {
        // Fallback to mock data for demo
        setDocuments(mockDocuments);
        setFolders(mockFolders);
      }
    } catch (error) {
      console.error('Error fetching SharePoint data:', error);
      // Fallback to mock data for demo
      setDocuments(mockDocuments);
      setFolders(mockFolders);
    } finally {
      setLoading(false);
    }
  };

  const mockDocuments: Document[] = [
    {
      id: '1',
      name: 'Project Specification - SFG001.pdf',
      type: 'PDF',
      size: '2.4 MB',
      modifiedDate: '2024-01-15',
      modifiedBy: 'John Smith',
      folder: '/Projects/SFG001',
      version: '1.2',
      status: 'active'
    },
    {
      id: '2',
      name: 'Installation Manual v3.docx',
      type: 'Word',
      size: '850 KB',
      modifiedDate: '2024-01-12',
      modifiedBy: 'Sarah Wilson',
      folder: '/Manuals',
      version: '3.0',
      status: 'active'
    },
    {
      id: '3',
      name: 'Customer Quote - QUO240115.xlsx',
      type: 'Excel',
      size: '145 KB',
      modifiedDate: '2024-01-10',
      modifiedBy: 'Mike Jones',
      folder: '/Quotes/2024',
      version: '1.0',
      status: 'active'
    },
    {
      id: '4',
      name: 'Safety Guidelines 2024.pdf',
      type: 'PDF',
      size: '1.8 MB',
      modifiedDate: '2024-01-08',
      modifiedBy: 'David Brown',
      folder: '/Safety',
      version: '2.1',
      status: 'active'
    },
    {
      id: '5',
      name: 'Team Meeting Notes.docx',
      type: 'Word',
      size: '230 KB',
      modifiedDate: '2024-01-05',
      modifiedBy: 'Lisa Johnson',
      folder: '/Meetings',
      version: '1.0',
      status: 'active'
    }
  ];

  const mockFolders: Folder[] = [
    {
      id: 'f1',
      name: 'Projects',
      path: '/Projects',
      documentCount: 45,
      lastModified: '2024-01-15'
    },
    {
      id: 'f2',
      name: 'Quotes',
      path: '/Quotes',
      documentCount: 128,
      lastModified: '2024-01-14'
    },
    {
      id: 'f3',
      name: 'Manuals',
      path: '/Manuals',
      documentCount: 23,
      lastModified: '2024-01-12'
    },
    {
      id: 'f4',
      name: 'Safety',
      path: '/Safety',
      documentCount: 15,
      lastModified: '2024-01-08'
    },
    {
      id: 'f5',
      name: 'Meetings',
      path: '/Meetings',
      documentCount: 67,
      lastModified: '2024-01-05'
    }
  ];

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf': return '📄';
      case 'word': case 'docx': case 'doc': return '📝';
      case 'excel': case 'xlsx': case 'xls': return '📊';
      case 'image': case 'jpg': case 'png': return '🖼️';
      default: return '📋';
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.modifiedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDocumentClick = (document: Document) => {
    setSelectedDocument(document);
    setShowDocumentModal(true);
  };

  const handleFolderClick = (folder: Folder) => {
    setCurrentFolder(folder.path);
  };

  const navigateUp = () => {
    const pathParts = currentFolder.split('/').filter(part => part !== '');
    if (pathParts.length > 0) {
      pathParts.pop();
      setCurrentFolder('/' + pathParts.join('/'));
    } else {
      setCurrentFolder('/');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Share2 className="h-8 w-8 mr-3 text-blue-600" />
            SharePoint Integration
          </h1>
          <p className="text-muted-foreground">
            Document management and collaboration platform
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Folder
          </Button>
        </div>
      </div>

      {/* Navigation and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={navigateUp} disabled={currentFolder === '/'}>
                ↑ Up
              </Button>
              <span className="text-sm text-muted-foreground">
                Current: {currentFolder || '/'}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              <div className="flex gap-1">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  List
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  Grid
                </Button>
              </div>

              <Button variant="outline" size="sm" onClick={fetchSharePointData}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="documents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="folders">Folders</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="shared">Shared</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          {viewMode === 'list' ? (
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
                <CardDescription>
                  {filteredDocuments.length} documents in current folder
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filteredDocuments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        No documents found
                      </h3>
                      <p>
                        {searchTerm ? 'Try adjusting your search terms' : 'This folder is empty'}
                      </p>
                    </div>
                  ) : (
                    filteredDocuments.map((document) => (
                      <div
                        key={document.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => handleDocumentClick(document)}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{getFileIcon(document.type)}</span>
                          <div>
                            <p className="font-medium">{document.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Modified by {document.modifiedBy} on {new Date(document.modifiedDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <Badge variant="outline">{document.type}</Badge>
                          <span className="text-muted-foreground">{document.size}</span>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredDocuments.map((document) => (
                <Card
                  key={document.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleDocumentClick(document)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-4xl mb-3">{getFileIcon(document.type)}</div>
                    <h3 className="font-medium text-sm mb-2 truncate" title={document.name}>
                      {document.name}
                    </h3>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p>{document.size}</p>
                      <p>{new Date(document.modifiedDate).toLocaleDateString()}</p>
                      <Badge variant="outline" className="text-xs">
                        {document.type}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="folders" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {folders.map((folder) => (
              <Card
                key={folder.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleFolderClick(folder)}
              >
                <CardContent className="p-4 text-center">
                  <FolderOpen className="h-12 w-12 mx-auto mb-3 text-blue-600" />
                  <h3 className="font-medium mb-2">{folder.name}</h3>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>{folder.documentCount} documents</p>
                    <p>Updated {new Date(folder.lastModified).toLocaleDateString()}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Documents</CardTitle>
              <CardDescription>
                Documents you've recently accessed or modified
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documents.slice(0, 5).map((document) => (
                  <div
                    key={document.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleDocumentClick(document)}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{getFileIcon(document.type)}</span>
                      <div>
                        <p className="font-medium">{document.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {document.folder}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(document.modifiedDate).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shared" className="space-y-4">
          <Card>
            <CardContent className="py-16 text-center">
              <Share2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">Shared Documents</h3>
              <p className="text-muted-foreground">
                Documents shared with you will appear here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Document Detail Modal */}
      <Dialog open={showDocumentModal} onOpenChange={setShowDocumentModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <span className="text-2xl">{selectedDocument && getFileIcon(selectedDocument.type)}</span>
              <span>{selectedDocument?.name}</span>
            </DialogTitle>
            <DialogDescription>
              Document details and actions
            </DialogDescription>
          </DialogHeader>

          {selectedDocument && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">File Type</label>
                    <p className="font-medium">{selectedDocument.type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">File Size</label>
                    <p className="font-medium">{selectedDocument.size}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Version</label>
                    <p className="font-medium">{selectedDocument.version}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Modified By</label>
                    <p className="font-medium">{selectedDocument.modifiedBy}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Modified Date</label>
                    <p className="font-medium">
                      {new Date(selectedDocument.modifiedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <Badge variant={selectedDocument.status === 'active' ? 'default' : 'secondary'}>
                      {selectedDocument.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Location</label>
                <p className="font-medium">{selectedDocument.folder}</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDocumentModal(false)}>
              Close
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
