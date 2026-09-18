import React from 'react';

export const AuroraBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#030305]">
      {/* High performance hardware-accelerated static ambient depth */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[80vw] max-w-[900px] h-[50vh] rounded-full opacity-10 pointer-events-none blur-3xl" 
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0, 113, 227, 0.2) 0%, rgba(3, 3, 5, 0) 70%)'
        }}
      />
    </div>
  );
};
