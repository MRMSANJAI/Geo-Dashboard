import React from 'react';

const Card = ({ title, children }) => {
  return (
    <div className='group'>
      <div className="relative group p-6 border-l-4 border-blue-600 rounded-1xl bg-white shadow-md hover:shadow-xl hover:bg-gradient-to-br hover:from-blue-700 hover:to-gray-900 text-white transition-all duration-500 ease-in-out">
        <h2 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-white transition-colors duration-500">Project A</h2>
        <p className="text-gray-700 group-hover:text-white transition-colors duration-500">This is an ongoing agricultural AI initiative.</p>
      </div>
    </div>
  );
};

export default Card;
