import api from "./api";

export const fetchTransportation = async (tripId) => {
  const { data } = await api.get(`/trips/${tripId}/transportation`);
  return data.entries;
};

export const createTransportationEntry = async (tripId, entryData) => {
  const { data } = await api.post(`/trips/${tripId}/transportation`, entryData);
  return data.entry;
};

export const updateTransportationEntry = async (tripId, entryId, entryData) => {
  const { data } = await api.put(`/trips/${tripId}/transportation/${entryId}`, entryData);
  return data.entry;
};

export const deleteTransportationEntry = async (tripId, entryId) => {
  const { data } = await api.delete(`/trips/${tripId}/transportation/${entryId}`);
  return data;
};
