
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  FileText, 
  Download, 
  ExternalLink,
  Filter,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<any>(null);

  const search = async (page = 1) => {
    if (!query.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: query,
        page: page.toString(),
        limit: '20'
      });

      const response = await fetch(`/api/knowledge-smelter/search?${params}`);
      const data = await response.json();

      setResults(data.files);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      search();
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Search Archive</h1>
        <p className="text-muted-foreground">
          Search through {pagination?.total || 0} archived files
        </p>
      </div>

      {/* Search Bar */}
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search by filename, job number, customer name, or content..."
              className="pl-10"
            />
          </div>
          <Button onClick={() => search()} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            Search
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {results.length} of {pagination?.total} results
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => search(pagination.page - 1)}
                disabled={pagination.page === 1 || loading}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {pagination.page} of {pagination.pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => search(pagination.page + 1)}
                disabled={pagination.page === pagination.pages || loading}
              >
                Next
              </Button>
            </div>
          </div>

          {results.map((file) => (
            <Card key={file.id} className="p-6 hover:bg-accent transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <h3 className="text-lg font-semibold">{file.fileName}</h3>
                    <Badge>{file.fileType}</Badge>
                    <Badge variant="outline">{file.confidence}% confident</Badge>
                  </div>

                  {/* Metadata */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-4">
                    {file.jobNumber && (
                      <div>
                        <span className="font-medium">Job:</span> {file.jobNumber}
                      </div>
                    )}
                    {file.customerName && (
                      <div>
                        <span className="font-medium">Customer:</span> {file.customerName}
                      </div>
                    )}
                    {file.productType && (
                      <div>
                        <span className="font-medium">Product:</span> {file.productType}
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Size:</span>{' '}
                      {(Number(file.fileSize) / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>

                  {/* Tags */}
                  {file.tags && file.tags.length > 0 && (
                    <div className="flex items-center flex-wrap gap-2">
                      {file.tags.slice(0, 5).map((tag: any) => (
                        <Badge key={tag.id} variant="secondary" className="text-xs">
                          {tag.key}: {tag.value}
                        </Badge>
                      ))}
                      {file.tags.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{file.tags.length - 5} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  {file.sharePointUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={file.sharePointUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && results.length === 0 && query && (
        <Card className="p-12">
          <div className="text-center">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search query or filters
            </p>
          </div>
        </Card>
      )}

      {/* Initial State */}
      {!loading && results.length === 0 && !query && (
        <Card className="p-12">
          <div className="text-center">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Search the Archive</h3>
            <p className="text-muted-foreground">
              Enter a search query above to find files by name, job number, customer, or content
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
