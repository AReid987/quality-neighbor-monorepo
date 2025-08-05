import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { blogConfigsApi } from '@/api';
import { BlogConfig, BlogPlatform } from '@/types';
import { Plus, Settings, Trash, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export const BlogConfigPage: React.FC = () => {
  const [configs, setConfigs] = useState<BlogConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    platform: BlogPlatform.WORDPRESS as BlogPlatform,
    url: '',
    api_key: '',
    username: '',
    password: '',
  });

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const response = await blogConfigsApi.getBlogConfigs();
      setConfigs(response.data);
    } catch (error) {
      console.error('Failed to fetch blog configs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await blogConfigsApi.createBlogConfig(formData);
      setShowCreateDialog(false);
      setFormData({
        name: '',
        platform: BlogPlatform.WORDPRESS,
        url: '',
        api_key: '',
        username: '',
        password: '',
      });
      await fetchConfigs();
    } catch (error) {
      console.error('Failed to create blog config:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this blog configuration?')) {
      try {
        await blogConfigsApi.deleteBlogConfig(id);
        await fetchConfigs();
      } catch (error) {
        console.error('Failed to delete blog config:', error);
      }
    }
  };

  const getPlatformBadge = (platform: BlogPlatform) => {
    const platformColors = {
      [BlogPlatform.WORDPRESS]: 'bg-blue-100 text-blue-800',
      [BlogPlatform.GHOST]: 'bg-gray-100 text-gray-800',
      [BlogPlatform.DEVTO]: 'bg-green-100 text-green-800',
    };
    
    return (
      <Badge className={platformColors[platform]}>
        {platform}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Blog Configurations</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog Configurations</h1>
          <p className="text-muted-foreground">
            Configure your publishing platforms
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Configuration
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Blog Configuration</DialogTitle>
              <DialogDescription>
                Configure a new publishing platform
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Name</label>
                <Input
                  placeholder="My WordPress Blog"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Platform</label>
                <Select 
                  value={formData.platform} 
                  onValueChange={(value: BlogPlatform) => 
                    setFormData(prev => ({ ...prev, platform: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={BlogPlatform.WORDPRESS}>WordPress</SelectItem>
                    <SelectItem value={BlogPlatform.GHOST}>Ghost</SelectItem>
                    <SelectItem value={BlogPlatform.DEVTO}>Dev.to</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Site URL</label>
                <Input
                  placeholder="https://yoursite.com"
                  value={formData.url}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  required
                />
              </div>
              
              {formData.platform === BlogPlatform.DEVTO ? (
                <div>
                  <label className="text-sm font-medium mb-2 block">API Key</label>
                  <Input
                    type="password"
                    placeholder="Your Dev.to API key"
                    value={formData.api_key}
                    onChange={(e) => setFormData(prev => ({ ...prev, api_key: e.target.value }))}
                    required
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Username</label>
                    <Input
                      placeholder="WordPress username"
                      value={formData.username}
                      onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Application Password</label>
                    <Input
                      type="password"
                      placeholder="WordPress application password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>
                </>
              )}
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Configs Grid */}
      {configs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">No blog configurations</h3>
              <p className="text-muted-foreground mb-4">
                Add your first publishing platform to get started
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Configuration
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {configs.map((config) => (
            <Card key={config.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-base">{config.name}</CardTitle>
                  <div className="flex items-center space-x-2">
                    {getPlatformBadge(config.platform)}
                    <Badge variant={config.is_active ? 'default' : 'secondary'}>
                      {config.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="sm" asChild>
                    <a href={config.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(config.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {config.url}
                </CardDescription>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Published:</span>
                    <span className="font-medium">{config.total_published || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Failed:</span>
                    <span className="font-medium">{config.total_failed || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};