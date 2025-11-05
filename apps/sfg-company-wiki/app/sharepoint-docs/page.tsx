
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  FileText,
  Folder,
  Download,
  ExternalLink,
  Clock,
  Share2,
  RefreshCw,
  FolderOpen,
  File,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

interface SharePointFile {
  id: string;
  name: string;
  webUrl: string;
  size?: number;
  createdDateTime: string;
  lastModifiedDateTime: string;
  createdBy?: {
    user: {
      displayName: string;
    };
  };
  file?: {
    mimeType: string;
  };
  folder?: any;
}

interface SharePointSite {
  id: string;
  displayName: string;
  webUrl: string;
  description?: string;
}

interface SharePointDrive {
  id: string;
  name: string;
  description?: string;
  driveType: string;
  webUrl: string;
}

export default function SharePointDocsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sites, setSites] = useState<SharePointSite[]>([]);
  const [selectedSite, setSelectedSite] = useState<SharePointSite | null>(null);
  const [drives, setDrives] = useState<SharePointDrive[]>([]);
  const [selectedDrive, setSelectedDrive] = useState<SharePointDrive | null>(null);
  const [files, setFiles] = useState<SharePointFile[]>([]);
  const [recentFiles, setRecentFiles] = useState<SharePointFile[]>([]);
  const [searchResults, setSearchResults] = useState<SharePointFile[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSites();
    loadRecentFiles();
  }, []);

  const loadSites = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/sharepoint/sites');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setSites(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load SharePoint sites');
      console.error('Load sites error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDrives = async (site: SharePointSite) => {
    setLoading(true);
    setSelectedSite(site);
    try {
      const response = await fetch(`/api/sharepoint/drives?siteId=${site.id}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setDrives(data);
      if (data.length > 0) {
        loadFiles(site, data[0], '');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to load drives');
      console.error('Load drives error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFiles = async (site: SharePointSite, drive: SharePointDrive, path: string) => {
    setLoading(true);
    setSelectedDrive(drive);
    setCurrentPath(path);
    try {
      const url = `/api/sharepoint/files?siteId=${site.id}&driveId=${drive.id}${
        path ? `&path=${encodeURIComponent(path)}` : ''
      }`;
      const response = await fetch(url);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setFiles(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load files');
      console.error('Load files error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentFiles = async () => {
    try {
      const response = await fetch('/api/sharepoint/recent?limit=10');
      const data = await response.json();
      if (response.ok) {
        setRecentFiles(data);
      }
    } catch (error) {
      console.error('Load recent files error:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setLoading(true);
    try {
      const url = `/api/sharepoint/search?q=${encodeURIComponent(searchQuery)}${
        selectedSite ? `&siteId=${selectedSite.id}` : ''
      }`;
      const response = await fetch(url);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setSearchResults(data);
      if (data.length === 0) {
        toast.error('No files found');
      }
    } catch (error: any) {
      toast.error(error.message || 'Search failed');
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (file: SharePointFile) => {
    if (!selectedSite || !selectedDrive) {
      toast.error('Please select a site and drive first');
      return;
    }

    try {
      const response = await fetch(
        `/api/sharepoint/download?siteId=${selectedSite.id}&driveId=${selectedDrive.id}&itemId=${file.id}`
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      window.open(data.downloadUrl, '_blank');
      toast.success('Opening file...');
    } catch (error: any) {
      toast.error(error.message || 'Failed to download file');
      console.error('Download error:', error);
    }
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return 'N/A';
    const kb = bytes / 1024;
    const mb = kb / 1024;
    if (mb >= 1) return `${mb.toFixed(2)} MB`;
    return `${kb.toFixed(2)} KB`;
  };

  const getFileIcon = (file: SharePointFile) => {
    if (file.folder) return <Folder className="w-5 h-5 text-blue-500" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const FileList = ({ files: fileList }: { files: SharePointFile[] }) => (
    <div className="space-y-2">
      {fileList.map((file) => (
        <Card
          key={file.id}
          className={`cursor-pointer hover:bg-muted/50 transition-colors ${
            file.folder ? 'border-blue-200' : ''
          }`}
          onClick={() => {
            if (file.folder && selectedSite && selectedDrive) {
              const newPath = currentPath ? `${currentPath}/${file.name}` : file.name;
              loadFiles(selectedSite, selectedDrive, newPath);
            }
          }}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                {getFileIcon(file)}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{file.name}</h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span>{formatFileSize(file.size)}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(file.lastModifiedDateTime), { addSuffix: true })}
                    </span>
                    {file.createdBy?.user?.displayName && (
                      <span>by {file.createdBy.user.displayName}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!file.folder && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(file);
                      }}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(file.webUrl, '_blank');
                      }}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="w-8 h-8" />
            SharePoint Documents
          </h1>
          <p className="text-muted-foreground mt-1">
            Browse and access your SharePoint files and documents
          </p>
        </div>
        <Button onClick={loadSites} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle>Search Documents</CardTitle>
          <CardDescription>Search across all SharePoint sites and documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter search term..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse</TabsTrigger>
          <TabsTrigger value="recent">Recent Files</TabsTrigger>
          <TabsTrigger value="search">Search Results</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          {/* Sites */}
          {!selectedSite && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="w-5 h-5" />
                  SharePoint Sites ({sites.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sites.map((site) => (
                    <Card
                      key={site.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => loadDrives(site)}
                    >
                      <CardContent className="p-4">
                        <h4 className="font-semibold">{site.displayName}</h4>
                        {site.description && (
                          <p className="text-sm text-muted-foreground mt-1">{site.description}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Drives and Files */}
          {selectedSite && (
            <div className="space-y-4">
              {/* Breadcrumb */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedSite(null);
                        setSelectedDrive(null);
                        setFiles([]);
                        setCurrentPath('');
                      }}
                    >
                      Sites
                    </Button>
                    <span>/</span>
                    <span className="font-semibold">{selectedSite.displayName}</span>
                    {selectedDrive && (
                      <>
                        <span>/</span>
                        <span>{selectedDrive.name}</span>
                      </>
                    )}
                    {currentPath && (
                      <>
                        <span>/</span>
                        <span>{currentPath}</span>
                      </>
                    )}
                    {currentPath && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const pathParts = currentPath.split('/');
                          pathParts.pop();
                          const newPath = pathParts.join('/');
                          if (selectedSite && selectedDrive) {
                            loadFiles(selectedSite, selectedDrive, newPath);
                          }
                        }}
                      >
                        ← Back
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Files */}
              <Card>
                <CardHeader>
                  <CardTitle>Files and Folders</CardTitle>
                </CardHeader>
                <CardContent>
                  {files.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No files found</p>
                  ) : (
                    <FileList files={files} />
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Files
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentFiles.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No recent files</p>
              ) : (
                <FileList files={recentFiles} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Search Results ({searchResults.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {searchResults.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No search results. Use the search bar above to find files.
                </p>
              ) : (
                <FileList files={searchResults} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
