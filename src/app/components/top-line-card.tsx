import React from 'react';

interface TopLineCardProps {
  minHeight?: string;
  width?: string;
  children: React.ReactNode;
  topColor?: string;
  childrenPadding?: string;
  className?: string;
  
}

const TopLineCard: React.FC<TopLineCardProps> = ({
  minHeight = "min-h-[428px]",
  width = "min-w-[328px]",
  children,
  topColor = "bg-info", // <- set default 
  // here
  childrenPadding = "",
  className = "",
}) => {
  return (
    <div className={`${width} ${minHeight} ${className} flex flex-col  mt-2 rounded-[20px] overflow-hidden  shadow-custom`}>
      {/* Top Color Line */}
      <div className={`w-full h-[41px] ${topColor}`} />
      
      {/* Content */}
      <div className={`flex-1 w-full flex flex-col ${childrenPadding}`}>
        {children}
      </div>
    </div>
  );
};

export default TopLineCard;
