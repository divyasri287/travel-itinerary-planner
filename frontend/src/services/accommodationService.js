import api from "./api";

export const fetchAccommodation = async (tripId) => {
  const { data } = await api.get(`/trips/${tripId}/accommodation`);
  return data.entries;
};

export const createAccommodationEntry = async (tripId, entryData) => {
  const { data } = await api.post(`/trips/${tripId}/accommodation`, entryData);
  return data.entry;
};

export const updateAccommodationEntry = async (tripId, entryId, entryData) => {
  const { data } = await api.put(`/trips/${tripId}/accommodation/${entryId}`, entryData);
  return data.entry;
};

export const deleteAccommodationEntry = async (tripId, entryId) => {
  const { data } = await api.delete(`/trips/${tripId}/accommodation/${entryId}`);
  return data;
};
