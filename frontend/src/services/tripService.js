import api from "./api";

export const fetchTrips = async () => {
  const { data } = await api.get("/trips");
  return data.trips;
};

export const fetchDashboardSummary = async () => {
  const { data } = await api.get("/dashboard/summary");
  return data;
};

export const fetchTripById = async (tripId) => {
  const { data } = await api.get(`/trips/${tripId}`);
  return data.trip;
};

export const createTrip = async (tripData) => {
  const { data } = await api.post("/trips", tripData);
  return data.trip;
};

export const updateTrip = async (tripId, tripData) => {
  const { data } = await api.put(`/trips/${tripId}`, tripData);
  return data.trip;
};

export const deleteTrip = async (tripId) => {
  const { data } = await api.delete(`/trips/${tripId}`);
  return data;
};
