import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useClassrooms } from '../contexts/ClassroomContext';

interface GenerateInvitationProps {
  classroomIds: number[];
}

export const GenerateInvitation: React.FC<GenerateInvitationProps> = ({ classroomIds }) => {
  const { isAuthenticated } = useAuth();
  const { classrooms } = useClassrooms();
  const [selectedClassroomId, setSelectedClassroomId] = useState<number | ''>('');
  const [invitationCode, setInvitationCode] = useState<string | null>(null);

  const generateInvitation = async () => {
    if (!isAuthenticated || selectedClassroomId === '') {
      console.error('User not authenticated or no classroom selected');
      return;
    }

    try {
      const response = await fetch(`/api/classrooms/${selectedClassroomId}/generate-invitation`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        const { code } = await response.json();
        setInvitationCode(code);
        console.log('Generated invitation code:', code);
      } else {
        console.error('Failed to generate invitation code');
      }
    } catch (error) {
      console.error('Error generating invitation code:', error);
    }
  };

  const availableClassrooms = classrooms.filter(classroom => classroomIds.includes(classroom.id));

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <h2 className="text-xl font-bold mb-4">Generate Classroom Invitation</h2>
      <select
        value={selectedClassroomId}
        onChange={(e) => setSelectedClassroomId(Number(e.target.value))}
        className="mb-4 block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
      >
        <option value="">Select a classroom</option>
        {availableClassrooms.map((classroom) => (
          <option key={classroom.id} value={classroom.id}>
            {classroom.name}
          </option>
        ))}
      </select>
      <button 
        onClick={generateInvitation}
        disabled={!selectedClassroomId}
        className="mb-4 px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Generate Invitation Code
      </button>
      {invitationCode && (
        <div className="mt-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded">
          Invitation Code: <span className="font-bold">{invitationCode}</span>
        </div>
      )}
    </div>
  );
};