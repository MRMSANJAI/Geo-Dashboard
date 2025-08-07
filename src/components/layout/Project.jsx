import React from 'react';
import clsx from 'clsx';
import { Calendar } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';


const tagColors = {
  AOI: 'bg-purple-600 text-white',
  IMAGERY: 'bg-green-600 text-white',
  NDVI: 'bg-blue-600 text-white',
  LULC: 'bg-yellow-500 text-black',
  REPORT: 'bg-red-500 text-white',
};

const Project = ({ title, date, tags, status, endpoint, onTitleClick }) => {
  return (
    <div className="relative group mt-6 p-6 rounded-2xl bg-white shadow-md hover:shadow-xl">
      
      {/* Title + Date */}
      <div className="flex justify-between items-center mb-2">
        <h2 
            className="text-gray-900 font-bold cursor-pointer hover:text-blue-600 transition-colors duration-200"
            onClick={() => onTitleClick(endpoint)}
            >
            {title}
        </h2>        
            <div className="flex items-center gap-1 text-sm text-gray-700">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span>{date}</span>
            </div>
      </div>
          
      {/* Tags + Status */}
      <div className="flex items-center flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className={clsx(
              'px-3 py-1 rounded-full text-xs font-medium transition-colors duration-500',
              tagColors[tag] || 'bg-gray-300 text-black'
            )}
          >
            {tag}
          </span>
        ))}

        {/* Status Dot */}
        <span
          className={clsx(
            'w-3 h-3 rounded-full ml-auto',
            status ? 'bg-green-500' : 'bg-red-500'
          )}
          title={status ? 'Active' : 'Inactive'}
        ></span>
      </div>
    </div>
  );
};

export default Project;
