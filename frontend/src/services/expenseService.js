import api from "./api";

export const fetchExpenses = async (tripId) => {
  const { data } = await api.get(`/trips/${tripId}/expenses`);
  return data.expenses;
};

export const createExpense = async (tripId, expenseData) => {
  const { data } = await api.post(`/trips/${tripId}/expenses`, expenseData);
  return data.expense;
};

// Update/delete use the flat /api/expenses/:id routes (not nested under a
// trip), per the project blueprint's API shape for expenses.
export const updateExpense = async (expenseId, expenseData) => {
  const { data } = await api.put(`/expenses/${expenseId}`, expenseData);
  return data.expense;
};

export const deleteExpense = async (expenseId) => {
  const { data } = await api.delete(`/expenses/${expenseId}`);
  return data;
};
