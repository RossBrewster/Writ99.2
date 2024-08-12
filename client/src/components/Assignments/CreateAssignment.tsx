import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { cn } from "../../lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useAuth } from '../../contexts/AuthContext';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  instructions: z.string().min(1, 'Instructions are required'),
  readingMaterial: z.string().optional(),
  prompt: z.string().min(1, 'Prompt is required'),
  minimumDrafts: z.number().min(0, 'Minimum drafts must be 0 or greater'),
  dueDate: z.date({
    required_error: "Due date is required",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export const CreateAssignmentModal = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode } = useDarkMode();
  const { id: userId } = useAuth();


  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      instructions: '',
      readingMaterial: '',
      prompt: '',
      minimumDrafts: 1,
      dueDate: new Date(),
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('api/assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          ...values,
          createdById: userId, // Include the user's ID in the request
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create assignment');
      }

      const data = await response.json();
      console.log('Assignment created:', data);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to create assignment:', error);
      // Here you might want to set an error state and display it to the user
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalContent = (
    <DialogContent className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} transition-colors duration-200 max-w-4xl max-h-[90vh] overflow-y-auto`}>
      <DialogHeader>
        <DialogTitle className={isDarkMode ? 'text-white' : 'text-gray-800'}>Create New Assignment</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={isDarkMode ? 'text-white' : 'text-gray-800'}>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Assignment title" {...field} className={`w-full ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={isDarkMode ? 'text-white' : 'text-gray-800'}>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Assignment description" {...field} className={`w-full min-h-[100px] ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="instructions"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={isDarkMode ? 'text-white' : 'text-gray-800'}>Instructions</FormLabel>
                <FormControl>
                  <Textarea placeholder="Assignment instructions" {...field} className={`w-full min-h-[100px] ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="readingMaterial"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={isDarkMode ? 'text-white' : 'text-gray-800'}>Reading Material (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="URL or description of reading material" {...field} className={`w-full ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={isDarkMode ? 'text-white' : 'text-gray-800'}>Prompt</FormLabel>
                <FormControl>
                  <Textarea placeholder="Assignment prompt" {...field} className={`w-full min-h-[100px] ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="minimumDrafts"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={isDarkMode ? 'text-white' : 'text-gray-800'}>Minimum Drafts</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value, 10))} className={`w-full ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className={isDarkMode ? 'text-white' : 'text-gray-800'}>Due Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full md:w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                          isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className={`w-auto p-0 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`} align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      className={isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className={`w-full md:w-auto ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}`} disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Assignment'}
          </Button>
        </form>
      </Form>
    </DialogContent>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className={isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}>
          Create New Assignment
        </Button>
      </DialogTrigger>
      {modalContent}
    </Dialog>
  );
};