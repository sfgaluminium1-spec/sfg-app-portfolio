
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Upload, Search, Download, Eye, Trash2, FolderOpen, Image, FileSpreadsheet, File, Calendar, User, Building2, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface Document {
  id: string;
  filename: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  documentType: string;
  jobNumber?: string;
  quoteNumber?: string;
  uploadedBy: string;
  uploadDate: Date;
  lastAccessed?: Date;
}

export default function DocumentManagement() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      filename: 'drawing_18456_rev_a.dwg',
      originalName: 'Drawing_18456_Rev_A.dwg',
      fileType: 'dwg',
      fileSize: 2048576,
      documentType: 'DRAWING',
      jobNumber: '18456',
      uploadedBy: 'Design Team',
      uploadDate: new Date('2025-01-15T10:00:00'),
      lastAccessed: new Date('2025-01-15T14:30:00')
    },
    {
      id: '2',
      filename: 'specification_sbs_northampton.pdf',
      originalName: 'Specification_SBS_Northampton.pdf',
      fileType: 'pdf',
      fileSize: 1536000,
      documentType: 'SPECIFICATION',
      jobNumber: '18457',
      uploadedBy: 'Warren Heathcote',
      uploadDate: new Date('2025-01-15T09:30:00'),
      lastAccessed: new Date('2025-01-15T13:15:00')
    },
    {
      id: '3',
      filename: 'quote_21471_lodestone.pdf',
      originalName: 'Quote_21471_Lodestone.pdf',
      fileType: 'pdf',
      fileSize: 512000,
      documentType: 'QUOTE',
      quoteNumber: '21471',
      uploadedBy: 'Admin',
      uploadDate: new Date('2025-01-14T16:15:00'),
      lastAccessed: new Date('2025-01-15T11:20:00')
    },
    {
      id: '4',
      filename: 'installation_photos_18455.zip',
      originalName: 'Installation_Photos_18455.zip',
      fileType: 'zip',
      fileSize: 15728640,
      documentType: 'PHOTO',
      jobNumber: '18455',
      uploadedBy: 'Installation Team',
      uploadDate: new Date('2025-01-14T14:45:00'),
      lastAccessed: new Date('2025-01-15T09:00:00')
    },
    {
      id: '5',
      filename: 'order_31034_nvm.xlsx',
      originalName: 'Order_31034_NVM.xlsx',
      fileType: 'xlsx',
      fileSize: 256000,
      documentType: 'ORDER',
      uploadedBy: 'Craig Wilson',
      uploadDate: new Date('2025-01-14T12:30:00'),
      lastAccessed: new Date('2025-01-14T16:45:00')
    }
  ]);

  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>(documents);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [jobFilter, setJobFilter] = useState('all');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filterDocuments = () => {
    let filtered = documents;

    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.jobNumber?.includes(searchTerm) ||
        doc.quoteNumber?.includes(searchTerm) ||
        doc.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(doc => doc.documentType === typeFilter);
    }

    if (jobFilter !== 'all') {
      filtered = filtered.filter(doc => doc.jobNumber === jobFilter);
    }

    setFilteredDocuments(filtered);
  };

  React.useEffect(() => {
    filterDocuments();
  }, [searchTerm, typeFilter, jobFilter, documents]);

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
      case 'doc':
      case 'docx':
        return FileText;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return Image;
      case 'xlsx':
      case 'xls':
      case 'csv':
        return FileSpreadsheet;
      default:
        return File;
    }
  };

  const getDocumentTypeColor = (type: string) => {
    switch (type) {
      case 'DRAWING':
        return 'bg-blue-500';
      case 'SPECIFICATION':
        return 'bg-green-500';
      case 'QUOTE':
        return 'bg-purple-500';
      case 'ORDER':
        return 'bg-orange-500';
      case 'INVOICE':
        return 'bg-red-500';
      case 'PHOTO':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newDocuments = Array.from(files).map((file, index) => ({
        id: (Date.now() + index).toString(),
        filename: file.name.toLowerCase().replace(/\s+/g, '_'),
        originalName: file.name,
        fileType: file.name.split('.').pop() || 'unknown',
        fileSize: file.size,
        documentType: 'OTHER',
        uploadedBy: 'Current User',
        uploadDate: new Date(),
      }));

      setDocuments(prev => [...newDocuments, ...prev]);
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const DocumentCard = ({ document }: { document: Document }) => {
    const FileIcon = getFileIcon(document.fileType);
    
    return (
      <div>
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileIcon className="h-6 w-6 text-blue-600" />
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-sm truncate">{document.originalName}</CardTitle>
                  <CardDescription className="text-xs">
                    {formatFileSize(document.fileSize)} • {document.fileType.toUpperCase()}
                  </CardDescription>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button variant="outline" size="sm">
                  <Eye className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge className={`${getDocumentTypeColor(document.documentType)} text-white`}>
                  {document.documentType}
                </Badge>
                {document.jobNumber && (
                  <Badge variant="outline">Job {document.jobNumber}</Badge>
                )}
                {document.quoteNumber && (
                  <Badge variant="outline">Quote {document.quoteNumber}</Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex items-center">
                  <User className="h-3 w-3 mr-1" />
                  Uploaded by {document.uploadedBy}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {document.uploadDate.toLocaleDateString()}
                </div>
                {document.lastAccessed && (
                  <div className="flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    Last accessed {document.lastAccessed.toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const uniqueJobs = Array.from(new Set(documents.filter(d => d.jobNumber).map(d => d.jobNumber)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <FolderOpen className="h-8 w-8 mr-3 text-blue-600" />
            Document Management
          </h1>
          <p className="text-muted-foreground">
            Organize and manage all project documents and files
          </p>
        </div>
        <div className="flex space-x-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.doc,.docx,.xlsx,.xls,.dwg,.jpg,.jpeg,.png,.zip"
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload Files'}
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Folder
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Documents</p>
                <p className="text-2xl font-bold">{documents.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Size</p>
                <p className="text-2xl font-bold">
                  {formatFileSize(documents.reduce((sum, doc) => sum + doc.fileSize, 0))}
                </p>
              </div>
              <FolderOpen className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Linked Jobs</p>
                <p className="text-2xl font-bold">{uniqueJobs.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Recent Uploads</p>
                <p className="text-2xl font-bold">
                  {documents.filter(d => 
                    new Date().getTime() - d.uploadDate.getTime() < 24 * 60 * 60 * 1000
                  ).length}
                </p>
              </div>
              <Upload className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents by name, job number, or uploader..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="DRAWING">Drawings</SelectItem>
                <SelectItem value="SPECIFICATION">Specifications</SelectItem>
                <SelectItem value="QUOTE">Quotes</SelectItem>
                <SelectItem value="ORDER">Orders</SelectItem>
                <SelectItem value="INVOICE">Invoices</SelectItem>
                <SelectItem value="PHOTO">Photos</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select value={jobFilter} onValueChange={setJobFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by job" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Jobs</SelectItem>
                {uniqueJobs.map(jobNumber => (
                  <SelectItem key={jobNumber} value={jobNumber || 'all'}>
                    Job {jobNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Documents Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredDocuments.map((document) => (
          <DocumentCard key={document.id} document={document} />
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No documents found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || typeFilter !== 'all' || jobFilter !== 'all'
                ? 'Try adjusting your filters to see more results.'
                : 'Get started by uploading your first document.'}
            </p>
            <Button onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Documents
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
