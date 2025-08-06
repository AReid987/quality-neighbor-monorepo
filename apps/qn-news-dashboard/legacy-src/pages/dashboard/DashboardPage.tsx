import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { runsApi, contentApi, sourcesApi } from '@/api';
import { Run, Content, Source, SourceType, ContentStatus } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FiPlus, FiBarChart2, FiClock, FiCheck, FiAlertTriangle } from 'react-icons/fi';

function DashboardPage() {
  const [activeTab, setActiveTab] = useState('news');
  
  // Fetch runs
  const { data: runs = [], isLoading: isLoadingRuns } = useQuery({
    queryKey: ['runs'],
    queryFn: async () => {
      const response = await runsApi.getRuns({ limit: 5, status: 'active' });
      return response.data;
    },
  });
  
  // Fetch recent content
  const { data: content = [], isLoading: isLoadingContent } = useQuery({
    queryKey: ['content', activeTab],
    queryFn: async () => {
      const params: any = { 
        limit: 10,
        source_type: activeTab,
        sort: 'created_at:desc'
      };
      const response = await contentApi.getContent(params);
      return response.data;
    },
  });
  
  // Fetch stats for visualization
  const { data: stats = [], isLoading: isLoadingStats } = useQuery({
    queryKey: ['content-stats'],
    queryFn: async () => {
      // This would normally be a dedicated stats endpoint
      // We're simulating it here with content data
      const response = await contentApi.getContent();
      const contentData = response.data;
      
      // Transform data for charts
      return [
        { name: 'Collected', value: contentData.filter((c: Content) => c.status === ContentStatus.COLLECTED).length },
        { name: 'Processing', value: contentData.filter((c: Content) => c.status === ContentStatus.PROCESSING).length },
        { name: 'Draft', value: contentData.filter((c: Content) => c.status === ContentStatus.DRAFT).length },
        { name: 'Review', value: contentData.filter((c: Content) => c.status === ContentStatus.REVIEW).length },
        { name: 'Approved', value: contentData.filter((c: Content) => c.status === ContentStatus.APPROVED).length },
        { name: 'Published', value: contentData.filter((c: Content) => c.status === ContentStatus.PUBLISHED).length },
      ];
    },
  });
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <Link to="/runs/create">
          <Button>
            <FiPlus className="mr-2 h-4 w-4" />
            New Run
          </Button>
        </Link>
      </div>
      
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Runs</CardTitle>
            <FiBarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoadingRuns ? '...' : runs.length}</div>
            <p className="text-xs text-muted-foreground">
              {runs.length > 0 ? `Last run: ${new Date(runs[0]?.last_run_at || '').toLocaleDateString()}` : 'No active runs'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Collected</CardTitle>
            <FiClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoadingContent ? '...' : content.length}</div>
            <p className="text-xs text-muted-foreground">
              {content.length > 0 ? `Last updated: ${new Date(content[0]?.created_at || '').toLocaleTimeString()}` : 'No content collected'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published Content</CardTitle>
            <FiCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingContent ? '...' : content.filter((item: Content) => item.status === ContentStatus.PUBLISHED).length}
            </div>
            <p className="text-xs text-muted-foreground">
              +5 since last week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Tasks</CardTitle>
            <FiAlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Content overview by source type */}
      <Tabs defaultValue="news" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="news">News</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="product">Product</TabsTrigger>
        </TabsList>
        
        <TabsContent value="news" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Latest News Articles</CardTitle>
              <CardDescription>
                The most recent articles collected from news sources
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingContent ? (
                <p>Loading articles...</p>
              ) : content.length > 0 ? (
                <div className="space-y-2">
                  {content.map((item: Content) => (
                    <div key={item.id} className="rounded-md border p-3">
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.summary?.substring(0, 120)}...</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                        <Link to={`/content/${item.id}`}>
                          <Button variant="outline" size="sm">View</Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">No news articles collected yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Insights</CardTitle>
              <CardDescription>
                Top pain points and discussions from social media
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingContent ? (
                <p>Loading social insights...</p>
              ) : content.length > 0 ? (
                <div className="space-y-2">
                  {content.map((item: Content) => (
                    <div key={item.id} className="rounded-md border p-3">
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.summary?.substring(0, 120)}...</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                        <Link to={`/content/${item.id}`}>
                          <Button variant="outline" size="sm">View</Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">No social insights collected yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="product" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Releases</CardTitle>
              <CardDescription>
                Recent product launches and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingContent ? (
                <p>Loading product data...</p>
              ) : content.length > 0 ? (
                <div className="space-y-2">
                  {content.map((item: Content) => (
                    <div key={item.id} className="rounded-md border p-3">
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.summary?.substring(0, 120)}...</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                        <Link to={`/content/${item.id}`}>
                          <Button variant="outline" size="sm">View</Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">No product data collected yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Content Status Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Content Status Overview</CardTitle>
          <CardDescription>
            Distribution of content across different stages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            {isLoadingStats ? (
              <p>Loading chart data...</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Runs */}
      <Card>
        <CardHeader>
          <CardTitle>Active Runs</CardTitle>
          <CardDescription>
            Your currently active monitoring runs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingRuns ? (
            <p>Loading runs...</p>
          ) : runs.length > 0 ? (
            <div className="space-y-2">
              {runs.map((run: Run) => (
                <div key={run.id} className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <h3 className="font-medium">{run.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Frequency: {run.frequency} • {run.total_content_collected} items collected
                    </p>
                  </div>
                  <Link to={`/runs/${run.id}`}>
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-4">
              <p className="mb-4 text-center text-muted-foreground">
                You don't have any active runs yet
              </p>
              <Link to="/runs/create">
                <Button>Create your first run</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default DashboardPage;