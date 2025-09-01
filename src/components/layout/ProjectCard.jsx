import React, { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { sortTags, TAG_ORDER, tagColors } from "../../values/tagConfig";

// const TAG_ORDER = ["AOI", "Imagery", "NDVI", "LULC", "Report"];

// const tagColors = {
//   AOI: "bg-purple-600 text-white",
//   Imagery: "bg-green-600 text-white",
//   NDVI: "bg-blue-600 text-white",
//   LULC: "bg-yellow-500 text-black",
//   Report: "bg-red-500 text-white",
// };

export default function ProjectCard({ projects }) {
  const [filtered, setFiltered] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortByDate, setSortByDate] = useState(true); // ✅ Default to true

  useEffect(() => {
    let out = [...projects];

    // ✅ Filter by selected tags
    if (selectedTags.length > 0) {
      out = out.filter((p) =>
        selectedTags.every((t) => p.tags && p.tags.includes(t))
      );
    }

    // ✅ Filter by status
    if (selectedStatus) {
      out = out.filter((p) => {
        if (selectedStatus === "ongoing") return p.status.isActive === true;
        if (selectedStatus === "closed") return p.status.isActive === false;
        return true;
      });
    }

    // ✅ Sort by date if checkbox is checked
    if (sortByDate) {
      out.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    setFiltered(out);
  }, [projects, selectedTags, selectedStatus, sortByDate]);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearAll = () => {
    setSelectedTags([]);
    setSelectedStatus("");
    setSortByDate(true); // ✅ Reset sort to true after clearing
  };

  return (
    <>
      {/* Header Summary */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-semibold">Project Overview</h2>
          <p className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Showing {filtered.length} of {projects.length} projects
            {sortByDate && " (sorted by date)"}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          {/* Tag filters */}
          <div className="flex flex-wrap gap-2">
            {TAG_ORDER.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 text-xs font-medium rounded-full border transition ${
                    active
                      ? `${tagColors[tag]} border-transparent`
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            <option value="">All Status</option>
            <option value="ongoing">Ongoing</option>
            <option value="closed">Closed</option>
          </select>

          {/* Sort by Date checkbox */}
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={sortByDate} // ✅ Controlled by state
              onChange={() => setSortByDate((prev) => !prev)} // ✅ Toggle
              className="mr-1"
            />
            Sort by Date
          </label>

          {/* Clear All */}
          {(selectedTags.length || selectedStatus || sortByDate !== true) && (
            <button
              onClick={clearAll}
              className="text-xs px-3 py-1 bg-red-500 text-white rounded-md"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.length > 0 ? (
          filtered.map((proj, idx) => (
            <div
              key={idx}
              className="relative group p-6 rounded-2xl bg-white shadow-md hover:shadow-xl transition"
            >
              {/* Top row */}
              <div className="flex justify-between items-center mb-2">
                <Link
                  to={`/project-detail/${proj.id}`}
                  className="text-blue-500 hover:underline mt-2 inline-block"
                >
                  <h3 className="text-lg font-bold cursor-pointer text-[#02353C] hover:underline">
                    {proj.title}
                  </h3>
                </Link>

                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{proj.date}</span>
                </div>
              </div>

              {/* Tags and status */}
              <div className="flex flex-wrap justify-between items-center gap-2">
                <div className="flex flex-wrap gap-2">
                  {sortTags(proj.tags || []).map((tag, i) => (
                    <span
                      key={i}
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        tagColors[tag] || "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`h-3 w-3 rounded-full ${
                      proj.status.isActive ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            No projects match the current filters.
          </div>
        )}
      </div>
    </>
  );
}
