import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, X, Filter } from 'lucide-react';

const PortfolioFilterSystem = () => {
  const [selectedFilters, setSelectedFilters] = useState({
    medium: [],
    technology: [],
    genre: [],
    theme: [],
    mood: []
  });
  
  const [expandedSections, setExpandedSections] = useState({
    medium: false,
    technology: false,
    genre: false,
    theme: false,
    mood: false
  });
  
  const [showFilters, setShowFilters] = useState(false);

  // Sample data structure
  const facetOptions = {
    medium: ['Art', 'Code', 'Writing'],
    technology: ['React', 'Adobe Photoshop', 'C++', 'JavaScript', 'Python', 'Figma', 'Node.js'],
    genre: ['Social Media Reel', 'Novel', 'Short Story', 'Web Series', 'Mobile App', 'Website'],
    theme: ['Love', 'Celestial', 'Gay', 'Tarot', 'Nature', 'Technology', 'Fantasy'],
    mood: ['Professional', 'Peaceful', 'Modern', 'Natural', 'Playful', 'Dark', 'Minimalist']
  };

  // Sample projects data
  const projects = [
    {
      id: 1,
      title: "Celestial Tarot App",
      medium: "Code",
      technology: "React",
      genre: "Mobile App",
      theme: "Celestial",
      mood: "Modern"
    },
    {
      id: 2,
      title: "Love Stories Collection",
      medium: "Writing",
      technology: "Adobe Photoshop",
      genre: "Short Story",
      theme: "Love",
      mood: "Peaceful"
    },
    {
      id: 3,
      title: "Pride Month Campaign",
      medium: "Art",
      technology: "Adobe Photoshop",
      genre: "Social Media Reel",
      theme: "Gay",
      mood: "Playful"
    },
    {
      id: 4,
      title: "Portfolio Website",
      medium: "Code",
      technology: "React",
      genre: "Website",
      theme: "Technology",
      mood: "Professional"
    }
  ];

  const toggleFilter = (facet, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [facet]: prev[facet].includes(value)
        ? prev[facet].filter(item => item !== value)
        : [...prev[facet], value]
    }));
  };

  const removeFilter = (facet, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [facet]: prev[facet].filter(item => item !== value)
    }));
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      medium: [],
      technology: [],
      genre: [],
      theme: [],
      mood: []
    });
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      return Object.entries(selectedFilters).every(([facet, values]) => {
        if (values.length === 0) return true;
        return values.includes(project[facet]);
      });
    });
  }, [selectedFilters]);

  const totalSelectedFilters = Object.values(selectedFilters).flat().length;

  const getFacetLabel = (facet) => {
    const labels = {
      medium: 'Medium',
      technology: 'Tech',
      genre: 'Genre',
      theme: 'Theme',
      mood: 'Mood'
    };
    return labels[facet];
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Filter size={16} />
          Filters
          {totalSelectedFilters > 0 && (
            <span className="bg-blue-800 text-xs px-2 py-1 rounded-full">
              {totalSelectedFilters}
            </span>
          )}
        </button>
        
        {totalSelectedFilters > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Selected Filters Display */}
      {totalSelectedFilters > 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex flex-wrap gap-2">
            {Object.entries(selectedFilters).map(([facet, values]) =>
              values.map(value => (
                <span
                  key={`${facet}-${value}`}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  <span className="font-medium">{getFacetLabel(facet)}:</span>
                  {value}
                  <button
                    onClick={() => removeFilter(facet, value)}
                    className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>
      )}

      {/* Filter Panels */}
      {showFilters && (
        <div className="mb-6 border border-gray-200 rounded-lg bg-white">
          {Object.entries(facetOptions).map(([facet, options]) => (
            <div key={facet} className="border-b border-gray-200 last:border-b-0">
              <button
                onClick={() => toggleSection(facet)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium capitalize">{getFacetLabel(facet)}</span>
                  {selectedFilters[facet].length > 0 && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {selectedFilters[facet].length}
                    </span>
                  )}
                </div>
                {expandedSections[facet] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              
              {expandedSections[facet] && (
                <div className="px-4 pb-3">
                  <div className="flex flex-wrap gap-2">
                    {options.map(option => (
                      <button
                        key={option}
                        onClick={() => toggleFilter(facet, option)}
                        className={`px-3 py-1 text-sm rounded-full transition-colors ${
                          selectedFilters[facet].includes(option)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Projects ({filteredProjects.length})
          </h3>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map(project => (
            <div
              key={project.id}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <h4 className="font-medium mb-2">{project.title}</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Medium:</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                    {project.medium}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Tech:</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                    {project.technology}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Genre:</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                    {project.genre}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Theme:</span>
                  <span className="px-2 py-1 bg-pink-100 text-pink-800 rounded text-xs">
                    {project.theme}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Mood:</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    {project.mood}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredProjects.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No projects match the selected filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioFilterSystem;