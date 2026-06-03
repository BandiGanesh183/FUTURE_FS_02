import api from "./api";

export const getDashboardStats = async () => {
  const res = await api.get("/leads");

  const leads = res.data.data || [];

  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    converted: leads.filter((l) => l.status === "converted").length,
  };

  return stats;
};