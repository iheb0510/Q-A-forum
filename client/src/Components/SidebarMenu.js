import React, { useEffect } from 'react';

const SidebarSVG = ({ fontAwesome, text }) => {

  useEffect(() => {
   
    return () => {};
  }, []);

  return (
    <div className="w-full px-4 h-10 mb-1 rounded-full hover:bg-indigo-100 dark:hover:bg-transparent flex justify-start items-center text-lg font-semibold hover:text-indigo-600 cursor-pointer">
      <div className="w-6 mr-3 relative">
        <i className={fontAwesome}></i>
      </div>
      <div className="hidden md:block">{text}</div>
    </div>
  );
};

export default SidebarSVG;
