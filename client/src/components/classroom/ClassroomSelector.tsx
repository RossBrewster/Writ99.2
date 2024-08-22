import React from 'react';
import { useClassrooms } from '../../contexts/ClassroomContext';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { CheckCircle } from "lucide-react";

interface ClassroomButtonProps {
    classroom: {
      id: number;
      name: string;
    };
    isSelected: boolean;
    onClick: () => void;
    colorClass: string;
  }

  const ClassroomButton: React.FC<ClassroomButtonProps> = ({ classroom, isSelected, onClick, colorClass }) => {
    const { isDarkMode } = useDarkMode();

    return (
      <Button
        onClick={onClick}
        className={cn(
          "relative px-4 py-2 font-medium transition-all",
          colorClass,
          isSelected && "ring-5 pr-8", // Add extra padding-right when selected
          isSelected && (isDarkMode ? "ring-white" : "ring-black")
        )}
      >
        {classroom.name}
        {isSelected && (
          <CheckCircle className="absolute top-1/2 right-2 w-4 h-4 transform -translate-y-1/2" />
        )}
      </Button>
    );
  };

  const colorClasses = [
    "bg-[#34A853] hover:bg-[#2E974A] text-white",
    "bg-[#4285F4] hover:bg-[#3B78DB] text-white",
    "bg-[#EA4335] hover:bg-[#D33C2F] text-white",
    "bg-[#FBBC05] hover:bg-[#E2A904] text-black", // Yellow button with black text
  ];

  export const ClassroomSelector: React.FC = () => {
    const { classrooms, selectedClassroom, selectClassroom } = useClassrooms();

    return (
      <div className="flex flex-wrap gap-2 p-4 h-fit w-full justify-center">
        {classrooms.map((classroom, index) => (
          <ClassroomButton
            key={classroom.id}
            classroom={classroom}
            isSelected={selectedClassroom?.id === classroom.id}
            onClick={() => selectClassroom(classroom)}
            colorClass={colorClasses[index % colorClasses.length]}
          />
        ))}
      </div>
    );
  };