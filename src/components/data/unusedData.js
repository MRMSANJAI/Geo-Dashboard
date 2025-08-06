 {/* <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="px-3 py-2 rounded-md bg-white text-[#333333] border border-[#2EA7E0] focus:ring-2 focus:ring-[#2EA7E0] transition duration-200"
        >
          {Object.keys(locationOptions).map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select> */}


        {/* City marker */}
            {/* <Marker position={center} icon={icon}>
          <Popup>{selectedCity} Location</Popup>
        </Marker> */}


          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
       
        {/* {mapData && (
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-3 py-2 rounded-md bg-white text-[#333333] border border-[#2EA7E0] focus:ring-2 focus:ring-[#2EA7E0] transition duration-200"
          >
            <option value="0">All Projects</option>
            {Array.from(new Set(mapData.map((project) => project.title))).map(
              (project, index) => (
                <option key={project} value={index}>
                  {project}
                </option>
              )
            )}
          </select>
        )} */}

        <input
          type="file"
          accept=".kml,.geojson,.json"
          onChange={handleFileUpload}
          className="text-sm text-[#333333] bg-white border border-[#2EA7E0] px-3 py-2 rounded-md cursor-pointer transition duration-200 hover:bg-[#2EA7E0]/10"
        />
      </div>