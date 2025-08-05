import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { contentApi, blogConfigsApi } from '@/api';
import { Content, ContentStatus, BlogConfig } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FiSearch, FiFilter, FiMoreVertical, FiEdit, FiCheck, FiX, FiEye } from 'react-icons/fi';

function getStatusColor(status: ContentStatus) {
  switch (status) {
    case ContentStatus.PUBLISHED:
      return 'bg-green-500';
    case ContentStatus.APPROVED:
      return 'bg-blue-500';
    case ContentStatus.REVIEW:
      return 'bg-yellow-500';
    case ContentStatus.DRAFT:
      return 'bg-gray-500';
    case ContentStatus.COLLECTED:
      return 'bg-purple-500';
    case ContentStatus.PROCESSING:
      return 'bg-indigo-500';
    case ContentStatus.REJECTED:
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
}

function ContentPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all');
  
  // Fetch content
  const { data: content = [], isLoading } = useQuery({
    queryKey: ['content', statusFilter, activeTab],
    queryFn: async () => {
      const params: any = {};
      
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      
      if (activeTab !== 'all') {
        params.source_type = activeTab;
      }
      
      const response = await contentApi.getContent(params);
      return response.data;
    },
  });
  
  // Fetch blog configs for publishing
  const { data: blogConfigs = [] } = useQuery({
    queryKey: ['blog-configs'],
    queryFn: async () => {
      const response = await blogConfigsApi.getBlogConfigs();
      return response.data;
    },
  });
  
  // Filter content based on search query
  const filteredContent = content.filter((item: Content) => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (item.content && item.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.summary && item.summary.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">Content Management</h2>
      </div>
      
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Content</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="product">Product</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline">Batch Actions</Button>
            <Link to="/content/create">
              <Button>New Content</Button>
            </Link>
          </div>
        </div>
        
        <Card className="mt-4">
          <CardHeader className="pb-3">
            <CardTitle>Content Items</CardTitle>
            <CardDescription>
              Manage content collected from your monitoring runs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <FiSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search content..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex w-full items-center gap-2 md:w-auto">
                <FiFilter className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value={ContentStatus.COLLECTED}>Collected</SelectItem>
                    <SelectItem value={ContentStatus.PROCESSING}>Processing</SelectItem>
                    <SelectItem value={ContentStatus.DRAFT}>Draft</SelectItem>
                    <SelectItem value={ContentStatus.REVIEW}>Review</SelectItem>
                    <SelectItem value={ContentStatus.APPROVED}>Approved</SelectItem>
                    <SelectItem value={ContentStatus.PUBLISHED}>Published</SelectItem>
                    <SelectItem value={ContentStatus.REJECTED}>Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {isLoading ? (
              <div className="py-6 text-center">Loading content...</div>
            ) : filteredContent.length === 0 ? (
              <div className="py-6 text-center text-muted-foreground">
                {searchQuery || statusFilter !== 'all' || activeTab !== 'all'
                  ? 'No content matches your search criteria'
                  : 'No content has been collected yet'}
              </div>
            ) : (
              <div className="divide-y">
                {filteredContent.map((item: Content) => (
                  <div key={item.id} className="py-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Link to={`/content/${item.id}`} className="hover:underline">
                          <h3 className="font-medium">{item.title}</h3>
                        </Link>
                        {item.summary && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {item.summary.substring(0, 150)}...
                          </p>
                        )}
                        <div className="mt-2 flex items-center space-x-2">
                          <Badge variant="outline" className={`${getStatusColor(item.status)} text-white`}>
                            {item.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Source: {item.source_id}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Created: {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Link to={`/content/${item.id}`}>
                          <Button variant="outline" size="sm">
                            <FiEye className="mr-1 h-4 w-4" />
                            View
                          </Button>
                        </Link>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <FiMoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <FiEdit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            
                            {item.status === ContentStatus.DRAFT && (
                              <DropdownMenuItem>
                                <FiCheck className="mr-2 h-4 w-4" />
                                Move to Review
                              </DropdownMenuItem>
                            )}
                            
                            {item.status === ContentStatus.REVIEW && (
                              <>
                                <DropdownMenuItem>
                                  <FiCheck className="mr-2 h-4 w-4" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <FiX className="mr-2 h-4 w-4" />
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}
                            
                            {item.status === ContentStatus.APPROVED && blogConfigs.length > 0 && (
                              <DropdownMenuItem>
                                <FiCheck className="mr-2 h-4 w-4" />
                                Publish
                              </DropdownMenuItem>
                            )}
                            
                            <DropdownMenuItem className="text-red-600">
                              <FiX className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}

export default ContentPage;