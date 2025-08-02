import React from 'react'

const Home = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500">Total Carbon</p>
          <p className="text-2xl font-bold">1234 Tons</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500">Mapped Area</p>
          <p className="text-2xl font-bold">5,000 km²</p>
        </div>
        {/* Add more stats here */}
      </div>
    </div>
  );
};

export default Home