import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useAuth } from '../../contexts/AuthContext';

interface CreateClassroomProps {
  onClassroomCreated?: () => void;
}

const CreateClassroom: React.FC<CreateClassroomProps> = ({ onClassroomCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode } = useDarkMode();
  const { isAuthenticated, role, id } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!isAuthenticated || role !== 'teacher') {
      setError('You must be logged in as a teacher to create a classroom');
      return;
    }

    if (!name.trim()) {
      setError('Classroom name is required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/classrooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          description,
          teacherId: id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create classroom');
      }

      setSuccess(true);
      setName('');
      setDescription('');
      if (onClassroomCreated) {
        onClassroomCreated();
      }
      setTimeout(() => setIsOpen(false), 2000); // Close the modal after 2 seconds
    } catch (err) {
      setError('An error occurred while creating the classroom');
    }
  };

  const dialogContent = (
    <DialogContent className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} transition-colors duration-200`}>
      <DialogHeader>
        <DialogTitle>Create New Classroom</DialogTitle>
      </DialogHeader>
      {!isAuthenticated || role !== 'teacher' ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>You must be logged in as a teacher to create a classroom.</AlertDescription>
        </Alert>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="name" className={isDarkMode ? 'text-white' : 'text-gray-800'}>
              Classroom Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter classroom name"
              className={isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="description" className={isDarkMode ? 'text-white' : 'text-gray-800'}>
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter classroom description"
              className={isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}
            />
          </div>
          <Button type="submit" className="w-full">Create Classroom</Button>
        </form>
      )}
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className={`mt-4 ${isDarkMode ? 'bg-green-800 text-white' : 'bg-green-100 text-green-800'}`}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>Classroom created successfully!</AlertDescription>
        </Alert>
      )}
    </DialogContent>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Create New Classroom</Button>
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  );
};

export default CreateClassroom;