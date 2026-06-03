import api from "./api";

// GET ALL LEADS
export const getLeads = async () => {
  const res = await api.get("/leads");
  return res.data.data;
};

// CREATE LEAD
export const createLead = async (data) => {
  const res = await api.post("/leads", data);
  return res.data.data;
};

// DELETE LEAD
export const deleteLead = async (id) => {
  const res = await api.delete(`/leads/${id}`);
  return res.data;
};

// UPDATE STATUS
export const updateLeadStatus = async (id, status) => {
  const res = await api.put(`/leads/${id}/status`, { status });
  return res.data.data;
};