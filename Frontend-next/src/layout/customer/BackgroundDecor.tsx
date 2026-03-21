"use client";

const BackgroundDecor = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#fdfdfd] min-h-screen w-full">

      {/* Primary Brand Blob - Top Left */}
      <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] bg-brand-200/10 blur-[130px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[55%] h-[55%] bg-brand-500/8 blur-[160px] rounded-full delay-700 animate-pulse" />
      
      <div className="absolute top-[30%] right-[10%] w-[35%] h-[35%] bg-brand-100/15 blur-[110px] rounded-full delay-1000 animate-pulse" />
      <div className="absolute bottom-[20%] left-[15%] w-[30%] h-[30%] bg-brand-400/5 blur-[140px] rounded-full delay-500 animate-pulse" />
      
      {/* Suble Dot Grid Texture */}
      <div className="absolute inset-0 opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(#f02d7d 0.8px, transparent 0.8px)', backgroundSize: '40px 40px' }} 
      />
      
      {/* Glassy overlay for refinement */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
    </div>
  );
};


export default BackgroundDecor;
