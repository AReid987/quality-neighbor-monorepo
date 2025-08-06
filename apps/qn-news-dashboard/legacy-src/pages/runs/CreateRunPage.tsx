import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { runsApi, sourcesApi, demographicsApi } from '@/api';
import { RunFrequency, SourceType } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FiArrowLeft, FiArrowRight, FiCheck } from 'react-icons/fi';

// Form schema
const createRunSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().optional(),
  frequency: z.nativeEnum(RunFrequency),
  selectedSources: z.array(z.number()).min(1, 'Select at least one source'),
  selectedDemographics: z.array(z.number()).min(1, 'Select at least one demographic'),
  demographicConfig: z.record(z.any()).optional(),
  filters: z.record(z.any()).optional(),
  publishingConfig: z.record(z.any()).optional(),
});

type CreateRunFormValues = z.infer<typeof createRunSchema>;

const steps = [
  { id: 'basic', name: 'Basic Info' },
  { id: 'demographics', name: 'Demographics' },
  { id: 'sources', name: 'Sources' },
  { id: 'publishing', name: 'Publishing' },
  { id: 'review', name: 'Review' },
];

function CreateRunPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Fetch sources
  const { data: sources = [] } = useQuery({
    queryKey: ['sources'],
    queryFn: async () => {
      const response = await sourcesApi.getSources();
      return response.data;
    },
  });
  
  // Fetch demographics
  const { data: demographics = [] } = useQuery({
    queryKey: ['demographics'],
    queryFn: async () => {
      const response = await demographicsApi.getDemographics();
      return response.data;
    },
  });
  
  // Group sources by type
  const sourcesByType = sources.reduce((acc: Record<string, any[]>, source: any) => {
    if (!acc[source.type]) {
      acc[source.type] = [];
    }
    acc[source.type].push(source);
    return acc;
  }, {});
  
  // Create run form
  const form = useForm<CreateRunFormValues>({
    resolver: zodResolver(createRunSchema),
    defaultValues: {
      name: '',
      description: '',
      frequency: RunFrequency.DAILY,
      selectedSources: [],
      selectedDemographics: [],
      demographicConfig: {},
      filters: {},
      publishingConfig: {},
    },
  });
  
  // Create run mutation
  const createRunMutation = useMutation({
    mutationFn: async (values: CreateRunFormValues) => {
      // Transform form values to API format
      const runData = {
        name: values.name,
        description: values.description,
        frequency: values.frequency,
        demographics_config: {
          demographics: values.selectedDemographics,
          ...values.demographicConfig,
        },
        filters: values.filters || {},
        publishing_config: values.publishingConfig || {},
      };
      
      // Create the run
      const response = await runsApi.createRun(runData);
      const runId = response.data.id;
      
      // Associate sources with the run
      for (const sourceId of values.selectedSources) {
        await runsApi.updateRun(runId, {
          sources: [{ source_id: sourceId, is_active: true, priority: 1 }],
        });
      }
      
      return response.data;
    },
    onSuccess: (data) => {
      toast({
        title: 'Run created',
        description: 'Your monitoring run has been created successfully',
      });
      navigate(`/runs/${data.id}`);
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to create run',
        description: error.message || 'An error occurred while creating the run',
        variant: 'destructive',
      });
    },
  });
  
  // Form submission
  const onSubmit = (values: CreateRunFormValues) => {
    createRunMutation.mutate(values);
  };
  
  // Navigation between steps
  const nextStep = () => {
    const currentStepFields = {
      0: ['name', 'description', 'frequency'],
      1: ['selectedDemographics'],
      2: ['selectedSources'],
      3: [], // Publishing step has no required fields for now
      4: [], // Review step has no required fields
    }[currentStep];
    
    const isStepValid = currentStepFields?.every(field => 
      field === 'selectedSources' || field === 'selectedDemographics'
        ? (form.getValues(field as any)?.length > 0)
        : !!form.getValues(field as any)
    );
    
    if (isStepValid) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    } else {
      // Trigger validation for the current step fields
      currentStepFields?.forEach(field => {
        form.trigger(field as any);
      });
    }
  };
  
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => navigate('/runs')} className="mr-4">
          <FiArrowLeft className="mr-2 h-4 w-4" />
          Back to Runs
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Create New Run</h2>
      </div>
      
      {/* Progress steps */}
      <div className="hidden md:block">
        <nav aria-label="Progress">
          <ol className="flex space-x-2">
            {steps.map((step, index) => (
              <li key={step.id} className="flex-1">
                <button
                  type="button"
                  onClick={() => index < currentStep && setCurrentStep(index)}
                  className={`
                    group flex w-full items-center
                    ${index <= currentStep ? 'cursor-pointer' : 'cursor-not-allowed'}
                  `}
                  disabled={index > currentStep}
                >
                  <span
                    className={`
                      flex h-10 w-10 items-center justify-center rounded-full
                      ${index < currentStep ? 'bg-primary text-primary-foreground' : 
                        index === currentStep ? 'border-2 border-primary' :
                        'border-2 border-border'}
                    `}
                  >
                    {index < currentStep ? (
                      <FiCheck className="h-5 w-5" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </span>
                  <span
                    className={`
                      ml-2 text-sm font-medium
                      ${index <= currentStep ? 'text-foreground' : 'text-muted-foreground'}
                    `}
                  >
                    {step.name}
                  </span>
                </button>
                {index < steps.length - 1 && (
                  <div className="flex-1 border-t border-border" />
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
      
      {/* Mobile step indicator */}
      <div className="md:hidden">
        <span className="text-sm font-medium">
          Step {currentStep + 1} of {steps.length}: {steps[currentStep].name}
        </span>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Step 1: Basic Info */}
          {currentStep === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Provide basic details for your monitoring run
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter run name" {...field} />
                      </FormControl>
                      <FormDescription>
                        A descriptive name for your monitoring run
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter a description"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A brief description of the purpose of this run
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={RunFrequency.DAILY}>Daily</SelectItem>
                          <SelectItem value={RunFrequency.TWICE_DAILY}>Twice daily (2x)</SelectItem>
                          <SelectItem value={RunFrequency.THREE_TIMES_DAILY}>Three times daily (3x)</SelectItem>
                          <SelectItem value={RunFrequency.FOUR_TIMES_DAILY}>Four times daily (4x)</SelectItem>
                          <SelectItem value={RunFrequency.HOURLY}>Hourly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        How often to collect data from sources
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="button" onClick={nextStep}>
                  Next
                  <FiArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Step 2: Demographics */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Demographics</CardTitle>
                <CardDescription>
                  Select the target demographics for this run
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="selectedDemographics"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Demographics</FormLabel>
                        <FormDescription>
                          Select one or more demographics to target
                        </FormDescription>
                      </div>
                      
                      {demographics.length > 0 ? (
                        <div className="space-y-2">
                          {demographics.map((demographic) => (
                            <FormField
                              key={demographic.id}
                              control={form.control}
                              name="selectedDemographics"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={demographic.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(demographic.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, demographic.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== demographic.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel className="font-normal">
                                        {demographic.name}
                                      </FormLabel>
                                      {demographic.description && (
                                        <FormDescription>
                                          {demographic.description}
                                        </FormDescription>
                                      )}
                                    </div>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          No demographics available. Create demographics in settings first.
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="demographicConfig"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Demographics Configuration</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter custom JSON configuration (optional)"
                          className="font-mono text-xs"
                          rows={5}
                          value={JSON.stringify(field.value || {}, null, 2)}
                          onChange={(e) => {
                            try {
                              const value = JSON.parse(e.target.value);
                              field.onChange(value);
                            } catch (error) {
                              // Invalid JSON, don't update
                            }
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Advanced: Enter custom JSON configuration for demographics
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={prevStep}>
                  <FiArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button type="button" onClick={nextStep}>
                  Next
                  <FiArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Step 3: Sources */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Data Sources</CardTitle>
                <CardDescription>
                  Select the sources to collect data from
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="selectedSources"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Data Sources</FormLabel>
                        <FormDescription>
                          Select one or more sources to collect data from
                        </FormDescription>
                      </div>
                      
                      <Tabs defaultValue={Object.keys(sourcesByType)[0] || 'news'}>
                        <TabsList>
                          {Object.keys(sourcesByType).map((type) => (
                            <TabsTrigger key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                        
                        {Object.entries(sourcesByType).map(([type, sourcesOfType]) => (
                          <TabsContent key={type} value={type} className="space-y-4">
                            {sourcesOfType.length > 0 ? (
                              <div className="space-y-2">
                                {sourcesOfType.map((source) => (
                                  <FormField
                                    key={source.id}
                                    control={form.control}
                                    name="selectedSources"
                                    render={({ field }) => {
                                      return (
                                        <FormItem
                                          key={source.id}
                                          className="flex flex-row items-start space-x-3 space-y-0"
                                        >
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(source.id)}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([...field.value, source.id])
                                                  : field.onChange(
                                                      field.value?.filter(
                                                        (value) => value !== source.id
                                                      )
                                                    )
                                              }}
                                            />
                                          </FormControl>
                                          <div className="space-y-1 leading-none">
                                            <FormLabel className="font-normal">
                                              {source.name}
                                            </FormLabel>
                                            {source.description && (
                                              <FormDescription>
                                                {source.description}
                                              </FormDescription>
                                            )}
                                          </div>
                                        </FormItem>
                                      )
                                    }}
                                  />
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-4 text-muted-foreground">
                                No {type} sources available. Configure sources in settings first.
                              </div>
                            )}
                          </TabsContent>
                        ))}
                      </Tabs>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="filters"
                  render={({ field }) => (
                    <FormItem className="mt-6">
                      <FormLabel>Content Filters</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter custom JSON configuration (optional)"
                          className="font-mono text-xs"
                          rows={5}
                          value={JSON.stringify(field.value || {}, null, 2)}
                          onChange={(e) => {
                            try {
                              const value = JSON.parse(e.target.value);
                              field.onChange(value);
                            } catch (error) {
                              // Invalid JSON, don't update
                            }
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Advanced: Enter custom JSON configuration for content filtering
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={prevStep}>
                  <FiArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button type="button" onClick={nextStep}>
                  Next
                  <FiArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Step 4: Publishing */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Publishing Configuration</CardTitle>
                <CardDescription>
                  Configure how content should be published
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="publishingConfig"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Publishing Configuration</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter custom JSON configuration (optional)"
                          className="font-mono text-xs"
                          rows={10}
                          value={JSON.stringify(field.value || {}, null, 2)}
                          onChange={(e) => {
                            try {
                              const value = JSON.parse(e.target.value);
                              field.onChange(value);
                            } catch (error) {
                              // Invalid JSON, don't update
                            }
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Advanced: Enter custom JSON configuration for publishing settings
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={prevStep}>
                  <FiArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button type="button" onClick={nextStep}>
                  Next
                  <FiArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Step 5: Review */}
          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle>Review and Create</CardTitle>
                <CardDescription>
                  Review your run configuration before creating
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium">Basic Information</h3>
                    <div className="mt-2 space-y-2">
                      <div className="grid grid-cols-3 gap-4">
                        <span className="font-medium">Name:</span>
                        <span className="col-span-2">{form.getValues('name')}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <span className="font-medium">Description:</span>
                        <span className="col-span-2">{form.getValues('description') || 'None'}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <span className="font-medium">Frequency:</span>
                        <span className="col-span-2">{form.getValues('frequency')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium">Demographics</h3>
                    <div className="mt-2">
                      <div className="grid grid-cols-3 gap-4">
                        <span className="font-medium">Selected Demographics:</span>
                        <span className="col-span-2">
                          {form.getValues('selectedDemographics').length} selected
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium">Sources</h3>
                    <div className="mt-2">
                      <div className="grid grid-cols-3 gap-4">
                        <span className="font-medium">Selected Sources:</span>
                        <span className="col-span-2">
                          {form.getValues('selectedSources').length} selected
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium">Full Configuration</h3>
                    <pre className="mt-2 rounded bg-muted p-4 text-xs font-mono">
                      {JSON.stringify(form.getValues(), null, 2)}
                    </pre>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={prevStep}>
                  <FiArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button 
                  type="submit" 
                  disabled={createRunMutation.isPending}
                >
                  {createRunMutation.isPending ? 'Creating...' : 'Create Run'}
                </Button>
              </CardFooter>
            </Card>
          )}
        </form>
      </Form>
    </div>
  );
}

export default CreateRunPage;