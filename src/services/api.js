import dashboardData from '../components/data/dashboardData.json';

export const fetchDashboardData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(dashboardData);
    }, 500); // simulate API delay
  });
};

