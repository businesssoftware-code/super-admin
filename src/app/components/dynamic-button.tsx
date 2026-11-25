import React from 'react'

interface DynamicButtonProps{
    text:string;
    isActive?:boolean;
    onClick:()=>void
}
const DynamicButton: React.FC<DynamicButtonProps> = ({ text, isActive = false, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full shadow-custom transition-all duration-300
        ${isActive ? 'bg-primary text-white' : 'bg-secondary text-primary'}
      `}
    >
      {text}
    </button>
  );
};

export default DynamicButton;
