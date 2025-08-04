import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contentApi, blogConfigsApi } from '@/api';
import { Content, ContentStatus, BlogConfig } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FiEdit2, 
  FiSave,
  FiCheck, 
  FiX, 
  FiArrowLeft, 
  FiExternalLink, 
  FiAlertCircle,
  FiTrash2 
} from 'react-icons/fi';
import { useToast } from '@/hooks/use-toast';

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

function ContentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [editedSummary, setEditedSummary] = useState('');
  const [selectedBlogConfig, setSelectedBlogConfig] = useState<number | null>(null);
  
  // Fetch content details
  const { 
    data: content, 
    isLoading: isLoadingContent,
    error: contentError
  } = useQuery({
    queryKey: ['content', id],
    queryFn: async () => {
      if (!id) throw new Error('Content ID is required');
      const response = await contentApi.getContentItem(parseInt(id));
      return response.data;
    },
    onSuccess: (data) => {
      setEditedTitle(data.title);
      setEditedContent(data.content);
      setEditedSummary(data.summary || '');
    }
  });
  
  // Fetch blog configs for publishing
  const { data: blogConfigs = [] } = useQuery({
    queryKey: ['blog-configs'],
    queryFn: async () => {
      const response = await blogConfigsApi.getBlogConfigs();
      return response.data;
    },
  });
  
  // Update content mutation
  const updateContentMutation = useMutation({
    mutationFn: async (updatedContent: Partial<Content>) => {
      if (!id) throw new Error('Content ID is required');
      return await contentApi.updateContent(parseInt(id), updatedContent);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', id] });
      toast({
        title: 'Content updated',
        description: 'Content has been updated successfully',
      });
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to update content',
        description: error.message || 'An error occurred while updating the content',
        variant: 'destructive',
      });
    },
  });
  
  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async (status: ContentStatus) => {
      if (!id) throw new Error('Content ID is required');
      return await contentApi.updateContent(parseInt(id), { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', id] });
      toast({
        title: 'Status updated',
        description: 'Content status has been updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to update status',
        description: error.message || 'An error occurred while updating the status',
        variant: 'destructive',
      });
    },
  });
  
  // Publish content mutation
  const publishContentMutation = useMutation({
    mutationFn: async (blogConfigId: number) => {
      if (!id) throw new Error('Content ID is required');
      return await contentApi.publishContent(parseInt(id), blogConfigId);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['content', id] });
      toast({
        title: 'Content published',
        description: `Content has been published successfully. URL: ${data.data.published_url}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to publish content',
        description: error.message || 'An error occurred while publishing the content',
        variant: 'destructive',
      });
    },
  });
  
  // Delete content mutation
  const deleteContentMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error('Content ID is required');
      return await contentApi.deleteContent(parseInt(id));
    },
    onSuccess: () => {
      toast({
        title: 'Content deleted',
        description: 'Content has been deleted successfully',
      });
      navigate('/content');
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to delete content',
        description: error.message || 'An error occurred while deleting the content',
        variant: 'destructive',
      });
    },
  });
  
  const handleSaveEdit = () => {
    updateContentMutation.mutate({
      title: editedTitle,
      content: editedContent,
      summary: editedSummary,
    });
  };
  
  const handleUpdateStatus = (status: ContentStatus) => {
    updateStatusMutation.mutate(status);
  };
  
  const handlePublish = () => {
    if (!selectedBlogConfig) {
      toast({
        title: 'Please select a blog platform',
        description: 'You need to select a blog platform to publish to',
        variant: 'destructive',
      });
      return;
    }
    
    publishContentMutation.mutate(selectedBlogConfig);
  };
  
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
      deleteContentMutation.mutate();
    }
  };
  
  if (isLoadingContent) {
    return <div className="flex h-full items-center justify-center">Loading content details...</div>;
  }
  
  if (contentError || !content) {
    return (
      <Alert variant="destructive">
        <FiAlertCircle className="h-4 w-4" />
        <AlertDescription>
          {(contentError as Error)?.message || 'Failed to load content details'}
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => navigate('/content')} className="mr-4">
          <FiArrowLeft className="mr-2 h-4 w-4" />
          Back to Content
        </Button>
      </div>
      
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <div>
          {!isEditing ? (
            <h2 className="text-3xl font-bold tracking-tight">{content.title}</h2>
          ) : (
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="text-3xl font-bold"
            />
          )}
          <div className="mt-2 flex items-center space-x-2">
            <Badge variant="outline" className={`${getStatusColor(content.status)} text-white`}>
              {content.status}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Created: {new Date(content.created_at).toLocaleString()}
            </span>
            {content.published_at && (
              <span className="text-sm text-muted-foreground">
                Published: {new Date(content.published_at).toLocaleString()}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {!isEditing ? (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <FiEdit2 className="mr-2 h-4 w-4" />
              Edit
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <FiX className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} disabled={updateContentMutation.isPending}>
                <FiSave className="mr-2 h-4 w-4" />
                Save
              </Button>
            </>
          )}
          
          {content.status === ContentStatus.DRAFT && (
            <Button 
              variant="outline" 
              onClick={() => handleUpdateStatus(ContentStatus.REVIEW)}
              disabled={updateStatusMutation.isPending}
            >
              <FiCheck className="mr-2 h-4 w-4" />
              Submit for Review
            </Button>
          )}
          
          {content.status === ContentStatus.REVIEW && (
            <>
              <Button 
                variant="outline"
                onClick={() => handleUpdateStatus(ContentStatus.APPROVED)}
                disabled={updateStatusMutation.isPending}
              >
                <FiCheck className="mr-2 h-4 w-4" />
                Approve
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleUpdateStatus(ContentStatus.REJECTED)}
                disabled={updateStatusMutation.isPending}
              >
                <FiX className="mr-2 h-4 w-4" />
                Reject
              </Button>
            </>
          )}
          
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={deleteContentMutation.isPending}
          >
            <FiTrash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="publishing">Publishing</TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
              {!isEditing ? (
                <CardDescription>
                  View the full content
                </CardDescription>
              ) : (
                <CardDescription>
                  Edit the content
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {!isEditing ? (
                <div className="prose max-w-none dark:prose-invert">
                  {content.summary && (
                    <div className="mb-4 rounded-md bg-muted p-4">
                      <h3 className="mb-2 text-sm font-medium">Summary</h3>
                      <p>{content.summary}</p>
                    </div>
                  )}
                  <div dangerouslySetInnerHTML={{ __html: content.content }} />
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 text-sm font-medium">Summary</h3>
                    <Textarea
                      value={editedSummary}
                      onChange={(e) => setEditedSummary(e.target.value)}
                      placeholder="Enter a summary of the content"
                      rows={3}
                    />
                  </div>
                  <div>
                    <h3 className="mb-2 text-sm font-medium">Content</h3>
                    <Textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      placeholder="Enter the full content"
                      rows={15}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {content.source_url && (
            <Card>
              <CardHeader>
                <CardTitle>Source</CardTitle>
                <CardDescription>
                  Original source information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <span>Source URL:</span>
                  <a 
                    href={content.source_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:underline"
                  >
                    {content.source_url}
                    <FiExternalLink className="ml-1 h-4 w-4" />
                  </a>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="publishing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
              <CardDescription>
                Publish this content to your blog platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              {content.status === ContentStatus.APPROVED ? (
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Select Blog Platform
                    </label>
                    <Select
                      value={selectedBlogConfig?.toString() || ''}
                      onValueChange={(value) => setSelectedBlogConfig(parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a blog platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {blogConfigs.length > 0 ? (
                          blogConfigs.map((config: BlogConfig) => (
                            <SelectItem key={config.id} value={config.id.toString()}>
                              {config.name} ({config.platform})
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>
                            No blog platforms configured
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    onClick={handlePublish}
                    disabled={
                      publishContentMutation.isPending || 
                      !selectedBlogConfig || 
                      blogConfigs.length === 0
                    }
                  >
                    <FiCheck className="mr-2 h-4 w-4" />
                    Publish Content
                  </Button>
                  
                  {blogConfigs.length === 0 && (
                    <Alert>
                      <FiAlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        No blog platforms have been configured. Please set up a blog platform in the Blog Config section.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ) : content.status === ContentStatus.PUBLISHED ? (
                <div className="space-y-4">
                  <Alert>
                    <FiCheck className="h-4 w-4" />
                    <AlertDescription>
                      This content has already been published.
                    </AlertDescription>
                  </Alert>
                  
                  {content.published_url && (
                    <div>
                      <h3 className="mb-2 text-sm font-medium">Published URL</h3>
                      <a 
                        href={content.published_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:underline"
                      >
                        {content.published_url}
                        <FiExternalLink className="ml-1 h-4 w-4" />
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <Alert>
                  <FiAlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Content must be in the "Approved" state before it can be published.
                    Current status: {content.status}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="metadata" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
              <CardDescription>
                Additional information about this content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <span className="font-medium">ID:</span>
                  <span className="col-span-2">{content.id}</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <span className="font-medium">Run ID:</span>
                  <span className="col-span-2">
                    <Link to={`/runs/${content.run_id}`} className="text-blue-600 hover:underline">
                      {content.run_id}
                    </Link>
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <span className="font-medium">Source ID:</span>
                  <span className="col-span-2">{content.source_id}</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <span className="font-medium">Status:</span>
                  <span className="col-span-2">{content.status}</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <span className="font-medium">Created:</span>
                  <span className="col-span-2">{new Date(content.created_at).toLocaleString()}</span>
                </div>
                {content.updated_at && (
                  <div className="grid grid-cols-3 gap-4">
                    <span className="font-medium">Last Updated:</span>
                    <span className="col-span-2">{new Date(content.updated_at).toLocaleString()}</span>
                  </div>
                )}
                {content.published_at && (
                  <div className="grid grid-cols-3 gap-4">
                    <span className="font-medium">Published:</span>
                    <span className="col-span-2">{new Date(content.published_at).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ContentDetailPage;