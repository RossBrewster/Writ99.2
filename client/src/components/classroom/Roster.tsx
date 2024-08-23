import { useState, useEffect } from 'react';
import { useClassrooms, fetchWithAuth } from '../../contexts/ClassroomContext';
import { AlertCircle, Users } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { GenerateInvitation } from './GenerateInvitation';

interface User {
    id: number;
    username: string;
    email: string;
  }

  interface RosterData {
    classroom: {
      id: number;
      name: string;
    };
    teacher: User;
    students: User[];
    studentCount: number;
  }

  export const Roster = () => {
    const { selectedClassroom } = useClassrooms();
    const [rosterData, setRosterData] = useState<RosterData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const {isDarkMode} = useDarkMode()

    useEffect(() => {
      const fetchRosterData = async () => {
        if (!selectedClassroom) return;

        setLoading(true);
        setError(null);

        try {
          const data = await fetchWithAuth(`/api/classrooms/${selectedClassroom.id}/roster`);
          setRosterData(data);
        } catch (err) {
          setError('Failed to fetch roster data');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchRosterData();
    }, [selectedClassroom]);

    if (!selectedClassroom) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <Users size={48} />
          <p className="mt-4 text-lg">Please select a classroom to view its roster</p>
        </div>
      );
    }

    if (loading) {
      return <div className="text-center">Loading roster data...</div>;
    }

    if (error) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }

    if (!rosterData) {
      return null;
    }

    return (
      <div className={`space-y-6 w-full flex flex-col justify-start items-center mt-4 rounded p-4 max-w-5xl ${isDarkMode ? "bg-[#395286]" : "bg-white"}`}>
        <h2 className="text-2xl font-bold">{selectedClassroom.name} ({rosterData.studentCount} students)</h2>
        <div className=" flex gap-4">
            {rosterData.students.map((student) => (
              <div
               key={student.id}
               className={`p-4 rounded ${isDarkMode ? "bg-[#222f4b] hover:bg-[#203665]" : "bg-gray-300 hover:bg-gray-200"}`}
              >{student.username}</div>
            ))}
        </div>
        <GenerateInvitation />
      </div>
    );
  };