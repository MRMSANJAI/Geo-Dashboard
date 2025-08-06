useEffect(() => {
  const dummyProjects = [
    { id: "1", name: "Solar Mapping", description: "Geo-tagged carbon data collection." },
    { id: "2", name: "Green Buildings", description: "Energy efficiency stats and modeling." },
  ];
  const found = dummyProjects.find((p) => p.id === id);
  setProject(found);
  setLoading(false);
}, [id]);

