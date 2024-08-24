import React, { useState, useEffect } from 'react';
import { useClassrooms, fetchWithAuth } from '../../contexts/ClassroomContext';
import { AlertCircle, Users, UserSquare } from 'lucide-react';
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

export const Roster: React.FC = () => {
  const { selectedClassroom } = useClassrooms();
  const [rosterData, setRosterData] = useState<RosterData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isDarkMode } = useDarkMode();

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
    <div className={`w-full max-w-5xl rounded-2xl p-4 mt-4 flex flex-col justify-start shadow-2xl ${isDarkMode ? "bg-[#395286]" : "bg-[#f3f4f8]"}`}>
      <h2 className="text-2xl font-[Saira] w-full text-left border-b-[#c2cada] border-b-2 pl-4 mb-4 pb-2">
        {selectedClassroom.name} ({rosterData.studentCount} students)
      </h2>
      <div className="grid grid-cols-3 gap-4">
        {rosterData.students.map((student) => (
          <div
            key={student.id}
            className={`p-4 rounded flex items-center gap-2 shadow-lg cursor-pointer ${
              isDarkMode ? "bg-[#4b6aaf] hover:bg-[#7291d3] hover:text-black" : "bg-[#fafcfe] hover:bg-[#eff3ff]"
            }`}
          >
            <UserSquare className="shrink-0" />
            <span className="truncate">{student.username}</span>
          </div>
        ))}
      </div>
      <div className= "w-full flex justify-start mt-2">
        <GenerateInvitation />
      </div>
    </div>
  );
};