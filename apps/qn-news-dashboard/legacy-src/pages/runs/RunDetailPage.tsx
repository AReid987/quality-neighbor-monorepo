import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { runsApi, contentApi } from '@/api';
import { Run, RunStatus, Content, ContentStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FiEdit2, FiPause, FiPlay, FiRefreshCw, FiTrash2, FiAlertCircle } from 'react-icons/fi';
import { useToast } from '@/hooks/use-toast';

function RunDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Fetch run details
  const { 
    data: run, 
    isLoading: isLoadingRun,
    error: runError
  } = useQuery({
    queryKey: ['run', id],
    queryFn: async () => {
      if (!id) throw new Error('Run ID is required');
      const response = await runsApi.getRun(parseInt(id));
      return response.data;
    },
  });
  
  // Fetch run content
  const { 
    data: content = [], 
    isLoading: isLoadingContent 
  } = useQuery({
    queryKey: ['run-content', id],
    queryFn: async () => {
      if (!id) throw new Error('Run ID is required');
      const response = await contentApi.getContent({ run_id: id });
      return response.data;
    },
    enabled: !!id,
  });
  
  // Update run status mutation
  const updateRunMutation = useMutation({
    mutationFn: async ({ runId, status }: { runId: number; status: RunStatus }) => {
      return await runsApi.updateRun(runId, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['run', id] });
      toast({
        title: 'Run updated',
        description: 'Run status has been updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to update run',
        description: error.message || 'An error occurred while updating the run',
        variant: 'destructive',
      });
    },
  });
  
  // Delete run mutation
  const deleteRunMutation = useMutation({
    mutationFn: async (runId: number) => {
      return await runsApi.deleteRun(runId);
    },
    onSuccess: () => {
      toast({
        title: 'Run deleted',
        description: 'Run has been deleted successfully',
      });
      navigate('/runs');
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to delete run',
        description: error.message || 'An error occurred while deleting the run',
        variant: 'destructive',
      });
    },
  });
  
  const handleStatusChange = (status: RunStatus) => {
    if (!run) return;
    updateRunMutation.mutate({ runId: run.id, status });
  };
  
  const handleDelete = () => {
    if (!run) return;
    if (confirm('Are you sure you want to delete this run? This action cannot be undone.')) {
      deleteRunMutation.mutate(run.id);
    }
  };
  
  if (isLoadingRun) {
    return <div className="flex h-full items-center justify-center">Loading run details...</div>;
  }
  
  if (runError || !run) {
    return (
      <Alert variant="destructive">
        <FiAlertCircle className="h-4 w-4" />
        <AlertDescription>
          {(runError as Error)?.message || 'Failed to load run details'}
        </AlertDescription>
      </Alert>
    );
  }
  
  const statusColor = {
    [RunStatus.ACTIVE]: 'bg-green-500',
    [RunStatus.PAUSED]: 'bg-yellow-500',
    [RunStatus.DRAFT]: 'bg-gray-500',
    [RunStatus.COMPLETED]: 'bg-blue-500',
    [RunStatus.FAILED]: 'bg-red-500',
  }[run.status] || 'bg-gray-500';
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{run.name}</h2>
          {run.description && <p className="text-muted-foreground">{run.description}</p>}
        </div>
        
        <div className="flex items-center space-x-2">
          {run.status === RunStatus.ACTIVE && (
            <Button 
              variant="outline" 
              onClick={() => handleStatusChange(RunStatus.PAUSED)}
              disabled={updateRunMutation.isPending}
            >
              <FiPause className="mr-2 h-4 w-4" />
              Pause
            </Button>
          )}
          
          {run.status === RunStatus.PAUSED && (
            <Button 
              variant="outline" 
              onClick={() => handleStatusChange(RunStatus.ACTIVE)}
              disabled={updateRunMutation.isPending}
            >
              <FiPlay className="mr-2 h-4 w-4" />
              Resume
            </Button>
          )}
          
          <Button 
            variant="outline"
            disabled={updateRunMutation.isPending}
            onClick={() => handleStatusChange(RunStatus.ACTIVE)}
          >
            <FiRefreshCw className="mr-2 h-4 w-4" />
            Run Now
          </Button>
          
          <Link to={`/runs/${run.id}/edit`}>
            <Button variant="outline">
              <FiEdit2 className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={deleteRunMutation.isPending}
          >
            <FiTrash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Badge variant="outline" className={`${statusColor} text-white`}>
                {run.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Frequency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{run.frequency}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Content Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{run.total_content_collected}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Last Run</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">
              {run.last_run_at ? new Date(run.last_run_at).toLocaleString() : 'Never'}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Next Run</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">
              {run.next_run_at ? new Date(run.next_run_at).toLocaleString() : 'Not scheduled'}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content ({content.length})</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Run Details</CardTitle>
              <CardDescription>
                Overview of this monitoring run
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Demographics Configuration</h3>
                  <pre className="mt-2 rounded bg-muted p-4 text-sm">
                    {JSON.stringify(run.demographics_config, null, 2)}
                  </pre>
                </div>
                
                <div>
                  <h3 className="font-medium">Filters</h3>
                  <pre className="mt-2 rounded bg-muted p-4 text-sm">
                    {JSON.stringify(run.filters, null, 2)}
                  </pre>
                </div>
                
                <div>
                  <h3 className="font-medium">Publishing Configuration</h3>
                  <pre className="mt-2 rounded bg-muted p-4 text-sm">
                    {JSON.stringify(run.publishing_config, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Collected Content</CardTitle>
              <CardDescription>
                Content items collected from this run
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingContent ? (
                <div className="py-4 text-center">Loading content...</div>
              ) : content.length === 0 ? (
                <div className="py-4 text-center text-muted-foreground">
                  No content has been collected for this run yet
                </div>
              ) : (
                <div className="space-y-4">
                  {content.map((item: Content) => (
                    <div key={item.id} className="rounded-md border p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{item.title}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {item.summary ? `${item.summary.substring(0, 150)}...` : 'No summary available'}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {item.status}
                        </Badge>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Created: {new Date(item.created_at).toLocaleString()}
                        </span>
                        <Link to={`/content/${item.id}`}>
                          <Button variant="outline" size="sm">View</Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sources</CardTitle>
              <CardDescription>
                Data sources configured for this run
              </CardDescription>
            </CardHeader>
            <CardContent>
              {run.sources?.length > 0 ? (
                <div className="space-y-2">
                  {run.sources.map((source: any) => (
                    <div key={source.id} className="rounded-md border p-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{source.name}</h3>
                        <Badge variant={source.is_active ? 'default' : 'outline'}>
                          {source.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Priority: {source.priority} • Type: {source.type}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center text-muted-foreground">
                  No sources configured for this run
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Run Configuration</CardTitle>
              <CardDescription>
                Detailed configuration for this monitoring run
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 font-medium">Basic Information</h3>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <span className="text-sm font-medium">Name:</span>
                      <span className="col-span-2">{run.name}</span>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <span className="text-sm font-medium">Description:</span>
                      <span className="col-span-2">{run.description || 'No description'}</span>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <span className="text-sm font-medium">Created:</span>
                      <span className="col-span-2">{new Date(run.created_at).toLocaleString()}</span>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <span className="text-sm font-medium">Last Updated:</span>
                      <span className="col-span-2">
                        {run.updated_at ? new Date(run.updated_at).toLocaleString() : 'Never'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="mb-2 font-medium">Advanced Configuration</h3>
                  <pre className="rounded bg-muted p-4 text-sm">
                    {JSON.stringify({
                      filters: run.filters,
                      demographics_config: run.demographics_config,
                      publishing_config: run.publishing_config
                    }, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default RunDetailPage;