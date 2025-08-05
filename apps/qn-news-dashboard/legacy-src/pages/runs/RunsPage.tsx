import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { runsApi } from '@/api';
import { Run, RunStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FiPlus, FiSearch, FiFilter, FiMoreVertical } from 'react-icons/fi';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

function getStatusColor(status: RunStatus) {
  switch (status) {
    case RunStatus.ACTIVE:
      return 'bg-green-500';
    case RunStatus.PAUSED:
      return 'bg-yellow-500';
    case RunStatus.DRAFT:
      return 'bg-gray-500';
    case RunStatus.COMPLETED:
      return 'bg-blue-500';
    case RunStatus.FAILED:
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
}

function RunsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const { data: runs = [], isLoading } = useQuery({
    queryKey: ['runs', statusFilter],
    queryFn: async () => {
      const params: any = {};
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      const response = await runsApi.getRuns(params);
      return response.data;
    },
  });
  
  // Filter runs based on search query
  const filteredRuns = runs.filter((run: Run) => 
    run.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (run.description && run.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">Monitoring Runs</h2>
        <Link to="/runs/create">
          <Button>
            <FiPlus className="mr-2 h-4 w-4" />
            New Run
          </Button>
        </Link>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Runs</CardTitle>
          <CardDescription>
            Manage your data collection and monitoring runs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <FiSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search runs..."
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
                  <SelectItem value={RunStatus.ACTIVE}>Active</SelectItem>
                  <SelectItem value={RunStatus.PAUSED}>Paused</SelectItem>
                  <SelectItem value={RunStatus.DRAFT}>Draft</SelectItem>
                  <SelectItem value={RunStatus.COMPLETED}>Completed</SelectItem>
                  <SelectItem value={RunStatus.FAILED}>Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {isLoading ? (
            <div className="py-6 text-center">Loading runs...</div>
          ) : filteredRuns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <p className="mb-4 text-muted-foreground">
                {searchQuery || statusFilter !== 'all'
                  ? 'No runs match your search criteria'
                  : 'You haven\'t created any runs yet'}
              </p>
              {!searchQuery && statusFilter === 'all' && (
                <Link to="/runs/create">
                  <Button>Create your first run</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Last Run</TableHead>
                    <TableHead>Next Run</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRuns.map((run: Run) => (
                    <TableRow key={run.id}>
                      <TableCell className="font-medium">
                        <Link to={`/runs/${run.id}`} className="hover:underline">
                          {run.name}
                        </Link>
                        {run.description && (
                          <p className="text-xs text-muted-foreground">{run.description}</p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${getStatusColor(run.status)} text-white`}>
                          {run.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{run.frequency}</TableCell>
                      <TableCell>{run.total_content_collected}</TableCell>
                      <TableCell>
                        {run.last_run_at ? new Date(run.last_run_at).toLocaleString() : 'Never'}
                      </TableCell>
                      <TableCell>
                        {run.next_run_at ? new Date(run.next_run_at).toLocaleString() : 'Not scheduled'}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <FiMoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Link to={`/runs/${run.id}`} className="w-full">View Details</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Pause</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default RunsPage;