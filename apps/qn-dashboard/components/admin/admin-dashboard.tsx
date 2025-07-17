'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  BarChart3, 
  Users, 
  Mail, 
  TrendingUp, 
  Target,
  Calendar,
  DollarSign,
  Eye,
  MousePointer,
  FileText,
  Zap,
  Activity
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export const AdminDashboard = () => {
  const [kpis] = useState({
    totalSubscribers: 1247,
    openRate: 68.5,
    clickRate: 12.3,
    monthlyGrowth: 15.7,
    campaignROI: 324,
    engagementScore: 87
  });

  const [campaigns] = useState([
    {
      id: 1,
      name: 'Chamber of Commerce Outreach',
      status: 'active',
      budget: 500,
      spent: 234,
      leads: 156,
      conversions: 89
    },
    {
      id: 2,
      name: 'Social Media Infiltration',
      status: 'paused',
      budget: 200,
      spent: 78,
      leads: 45,
      conversions: 23
    },
    {
      id: 3,
      name: 'Local Business Partnerships',
      status: 'active',
      budget: 800,
      spent: 345,
      leads: 203,
      conversions: 134
    }
  ]);

  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'Market Research Report.pdf',
      type: 'research',
      uploadDate: '2024-01-15',
      processed: true
    },
    {
      id: 2,
      name: 'Community Survey Results.xlsx',
      type: 'data',
      uploadDate: '2024-01-18',
      processed: true
    },
    {
      id: 3,
      name: 'Competitor Analysis.docx',
      type: 'research',
      uploadDate: '2024-01-20',
      processed: true
    }
  ]);

  // Sample data for charts
  const subscriberGrowthData = [
    { month: 'Jan', subscribers: 245, newSignups: 45, churn: 12 },
    { month: 'Feb', subscribers: 389, newSignups: 156, churn: 12 },
    { month: 'Mar', subscribers: 567, newSignups: 189, churn: 11 },
    { month: 'Apr', subscribers: 743, newSignups: 198, churn: 22 },
    { month: 'May', subscribers: 934, newSignups: 213, churn: 22 },
    { month: 'Jun', subscribers: 1247, newSignups: 334, churn: 21 }
  ];

  const engagementData = [
    { week: 'Week 1', opens: 456, clicks: 89, shares: 23 },
    { week: 'Week 2', opens: 523, clicks: 102, shares: 31 },
    { week: 'Week 3', opens: 612, clicks: 134, shares: 45 },
    { week: 'Week 4', opens: 689, clicks: 156, shares: 52 }
  ];

  const campaignPerformanceData = [
    { name: 'Chamber Outreach', value: 35, color: '#3b82f6' },
    { name: 'Social Media', value: 25, color: '#10b981' },
    { name: 'Local Partnerships', value: 40, color: '#8b5cf6' }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 1200, costs: 800, profit: 400 },
    { month: 'Feb', revenue: 1890, costs: 1200, profit: 690 },
    { month: 'Mar', revenue: 2340, costs: 1500, profit: 840 },
    { month: 'Apr', revenue: 3200, costs: 1800, profit: 1400 },
    { month: 'May', revenue: 4100, costs: 2200, profit: 1900 },
    { month: 'Jun', revenue: 5200, costs: 2800, profit: 2400 }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newDoc = {
        id: Date.now(),
        name: file.name,
        type: file.type.includes('pdf') ? 'research' : 'data',
        uploadDate: new Date().toISOString().split('T')[0],
        processed: false
      };
      setDocuments([...documents, newDoc]);
      
      // Simulate processing
      setTimeout(() => {
        setDocuments(prev => prev.map(doc => 
          doc.id === newDoc.id ? { ...doc, processed: true } : doc
        ));
      }, 3000);
    }
  };

  const processDocument = (docId: number) => {
    // Simulate AI processing of document
    setDocuments(prev => prev.map(doc => 
      doc.id === docId ? { ...doc, processed: false } : doc
    ));
    
    setTimeout(() => {
      setDocuments(prev => prev.map(doc => 
        doc.id === docId ? { ...doc, processed: true } : doc
      ));
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Monitor performance, manage campaigns, and analyze growth</p>
      </div>

      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="extensions">Extensions</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Subscribers</p>
                    <p className="text-2xl font-bold text-blue-800">{kpis.totalSubscribers.toLocaleString()}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Open Rate</p>
                    <p className="text-2xl font-bold text-green-800">{kpis.openRate}%</p>
                  </div>
                  <Eye className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Click Rate</p>
                    <p className="text-2xl font-bold text-purple-800">{kpis.clickRate}%</p>
                  </div>
                  <MousePointer className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Monthly Growth</p>
                    <p className="text-2xl font-bold text-orange-800">+{kpis.monthlyGrowth}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-600">Campaign ROI</p>
                    <p className="text-2xl font-bold text-emerald-800">{kpis.campaignROI}%</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-emerald-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-pink-50 to-pink-100 border-pink-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-pink-600">Engagement Score</p>
                    <p className="text-2xl font-bold text-pink-800">{kpis.engagementScore}/100</p>
                  </div>
                  <Target className="h-8 w-8 text-pink-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Subscriber Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Subscriber Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={subscriberGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="subscribers" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Engagement Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Weekly Engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="opens" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="clicks" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="shares" stroke="#8b5cf6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Campaign Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Campaign Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={campaignPerformanceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {campaignPerformanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Revenue & Costs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="#10b981" />
                    <Bar dataKey="costs" fill="#ef4444" />
                    <Bar dataKey="profit" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Marketing Campaigns</h2>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Target className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </div>

          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{campaign.name}</h3>
                      <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                        {campaign.status}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Budget: ${campaign.budget}</p>
                      <p className="text-sm text-gray-600">Spent: ${campaign.spent}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-blue-600">Leads Generated</p>
                      <p className="text-2xl font-bold text-blue-800">{campaign.leads}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-green-600">Conversions</p>
                      <p className="text-2xl font-bold text-green-800">{campaign.conversions}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-purple-600">Conversion Rate</p>
                      <p className="text-2xl font-bold text-purple-800">
                        {((campaign.conversions / campaign.leads) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Budget Utilization</span>
                      <span>{((campaign.spent / campaign.budget) * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={(campaign.spent / campaign.budget) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Content Management</h2>
            <div className="flex gap-2">
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Generate Content
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Upload className="h-4 w-4 mr-2" />
                Upload Documents
              </Button>
            </div>
          </div>

          {/* File Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Document Upload & Processing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-600 mb-2">Upload Research Documents</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Supported formats: PDF, DOC, XLSX, CSV
                  </p>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.xlsx,.csv"
                  />
                  <Button asChild className="cursor-pointer">
                    <label htmlFor="file-upload">
                      <span>Choose Files</span>
                    </label>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-gray-800">Document Library</h4>
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-800">{doc.name}</p>
                        <p className="text-sm text-gray-500">Uploaded: {doc.uploadDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={doc.processed ? 'default' : 'secondary'}>
                        {doc.processed ? 'Processed' : 'Processing...'}
                      </Badge>
                      {doc.processed && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => processDocument(doc.id)}
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          Reprocess
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Content Generation */}
          <Card>
            <CardHeader>
              <CardTitle>AI Content Generation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Content Topic</Label>
                <Input id="topic" placeholder="Enter topic for content generation..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tone">Tone & Style</Label>
                <Input id="tone" placeholder="Professional, friendly, informative..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="length">Target Length</Label>
                <Input id="length" placeholder="e.g., 500 words, 2 pages..." />
              </div>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <Zap className="h-4 w-4 mr-2" />
                Generate Content
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="extensions" className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Extension Hub</h2>
            <p className="text-gray-600">Integrate with content creation agents and external tools</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-2 border-blue-200 bg-blue-50/50">
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4">
                  <Zap className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Content Agent Team</h3>
                <p className="text-gray-600 mb-4">
                  Connect with AI agents for automated content creation and curation
                </p>
                <Button variant="outline" className="w-full">
                  Configure Integration
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 bg-green-50/50">
              <CardContent className="p-6 text-center">
                <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4">
                  <Mail className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Email Automation</h3>
                <p className="text-gray-600 mb-4">
                  Connect with email marketing platforms for automated campaigns
                </p>
                <Button variant="outline" className="w-full">
                  Setup Email Tools
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 bg-purple-50/50">
              <CardContent className="p-6 text-center">
                <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Analytics APIs</h3>
                <p className="text-gray-600 mb-4">
                  Integrate with Google Analytics, Facebook Pixel, and other tracking tools
                </p>
                <Button variant="outline" className="w-full">
                  Connect Analytics
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-200 bg-orange-50/50">
              <CardContent className="p-6 text-center">
                <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto mb-4">
                  <Target className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">CRM Integration</h3>
                <p className="text-gray-600 mb-4">
                  Connect with customer relationship management systems
                </p>
                <Button variant="outline" className="w-full">
                  Setup CRM
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input id="api-key" type="password" placeholder="Enter your API key..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="webhook">Webhook URL</Label>
                <Input id="webhook" placeholder="https://your-app.com/webhook" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="config">Configuration JSON</Label>
                <Textarea
                  id="config"
                  placeholder="Enter configuration settings..."
                  className="min-h-[100px]"
                />
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Save Configuration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};