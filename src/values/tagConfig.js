export const tagColors = {
  AOI: 'bg-purple-600 text-white',
  Imagery: 'bg-green-600 text-white',
  NDVI: 'bg-blue-600 text-white',
  LULC: 'bg-yellow-500 text-black',
  Report: 'bg-red-500 text-white',
};

export const TAG_ORDER = ["AOI", "Imagery", "NDVI", "LULC", "Report"];

export const sortTags = (tags) => {
  return [...tags].sort((a, b) => {
    const aIndex = TAG_ORDER.indexOf(a);
    const bIndex = TAG_ORDER.indexOf(b);

    // If tag not found, put it at the end
    const safeA = aIndex === -1 ? TAG_ORDER.length : aIndex;
    const safeB = bIndex === -1 ? TAG_ORDER.length : bIndex;

    return safeA - safeB;
  });
};
