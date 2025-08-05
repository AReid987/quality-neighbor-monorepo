import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { runsApi, contentApi } from '@/api';
import { Run, Content, RunStatus, ContentStatus } from '@/types';
import { 
  Play, 
  Pause, 
  FileText, 
  TrendingUp, 
  Activity,
  Clock,
  Users,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const [runs, setRuns] = useState<Run[]>([]);
  const [recentContent, setRecentContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRuns: 0,
    activeRuns: 0,
    totalContent: 0,
    publishedContent: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch runs
      const runsResponse = await runsApi.getRuns({ limit: 10 });
      const runsData = runsResponse.data;
      setRuns(runsData);
      
      // Fetch recent content
      const contentResponse = await contentApi.getContent({ limit: 10 });
      const contentData = contentResponse.data;
      setRecentContent(contentData);
      
      // Calculate stats
      const activeRuns = runsData.filter(run => run.status === RunStatus.ACTIVE).length;
      const publishedContent = contentData.filter(content => content.status === ContentStatus.PUBLISHED).length;
      
      setStats({
        totalRuns: runsData.length,
        activeRuns,
        totalContent: contentData.length,
        publishedContent,
      });
      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: RunStatus) => {
    const statusColors = {
      [RunStatus.ACTIVE]: 'bg-green-100 text-green-800',
      [RunStatus.PAUSED]: 'bg-yellow-100 text-yellow-800',
      [RunStatus.DRAFT]: 'bg-gray-100 text-gray-800',
      [RunStatus.COMPLETED]: 'bg-blue-100 text-blue-800',
      [RunStatus.FAILED]: 'bg-red-100 text-red-800',
    };
    
    return (
      <Badge className={statusColors[status]}>
        {status}
      </Badge>
    );
  };

  const getContentStatusBadge = (status: ContentStatus) => {
    const statusColors = {
      [ContentStatus.COLLECTED]: 'bg-blue-100 text-blue-800',
      [ContentStatus.PROCESSING]: 'bg-yellow-100 text-yellow-800',
      [ContentStatus.APPROVED]: 'bg-green-100 text-green-800',
      [ContentStatus.PUBLISHED]: 'bg-purple-100 text-purple-800',
      [ContentStatus.REJECTED]: 'bg-red-100 text-red-800',
      [ContentStatus.DRAFT]: 'bg-gray-100 text-gray-800',
      [ContentStatus.REVIEW]: 'bg-orange-100 text-orange-800',
    };
    
    return (
      <Badge className={statusColors[status]}>
        {status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your content aggregation and publishing pipeline
          </p>
        </div>
        <Button asChild>
          <Link to="/runs/new">
            <Play className="mr-2 h-4 w-4" />
            Create Run
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRuns}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeRuns} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Runs</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeRuns}</div>
            <p className="text-xs text-muted-foreground">
              Currently collecting
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Content</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalContent}</div>
            <p className="text-xs text-muted-foreground">
              Collected articles
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.publishedContent}</div>
            <p className="text-xs text-muted-foreground">
              Successfully published
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Runs */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Runs</CardTitle>
            <CardDescription>
              Your latest content collection runs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {runs.slice(0, 5).map((run) => (
                <div
                  key={run.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{run.name}</h4>
                      {getStatusBadge(run.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Frequency: {run.frequency} • Content: {run.total_content_collected}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/runs/${run.id}`}>View</Link>
                  </Button>
                </div>
              ))}
              {runs.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No runs created yet</p>
                  <Button className="mt-2" asChild>
                    <Link to="/runs/new">Create your first run</Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Content */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Content</CardTitle>
            <CardDescription>
              Latest collected articles and posts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentContent.slice(0, 5).map((content) => (
                <div
                  key={content.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium line-clamp-1">{content.title}</h4>
                      {getContentStatusBadge(content.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Score: {content.score} • Comments: {content.comments_count}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/content/${content.id}`}>View</Link>
                  </Button>
                </div>
              ))}
              {recentContent.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No content collected yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};