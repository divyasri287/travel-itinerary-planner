import api from "./api";

export const fetchItinerary = async (tripId) => {
  const { data } = await api.get(`/trips/${tripId}/itinerary`);
  return data.items;
};

export const createItineraryItem = async (tripId, itemData) => {
  const { data } = await api.post(`/trips/${tripId}/itinerary`, itemData);
  return data.item;
};

export const updateItineraryItem = async (tripId, itemId, itemData) => {
  const { data } = await api.put(`/trips/${tripId}/itinerary/${itemId}`, itemData);
  return data.item;
};

export const deleteItineraryItem = async (tripId, itemId) => {
  const { data } = await api.delete(`/trips/${tripId}/itinerary/${itemId}`);
  return data;
};
