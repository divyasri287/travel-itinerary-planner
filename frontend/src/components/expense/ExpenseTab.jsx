import { useEffect, useState } from "react";
import {
  fetchExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../../services/expenseService";
import Button from "../common/Button.jsx";
import Loader from "../common/Loader.jsx";
import EmptyState from "../common/EmptyState.jsx";
import ErrorState from "../common/ErrorState.jsx";
import ConfirmModal from "../common/ConfirmModal.jsx";
import Modal from "../common/Modal.jsx";
import Toast from "../common/Toast.jsx";
import StatCard from "../trip/StatCard.jsx";
import ExpenseForm from "./ExpenseForm.jsx";
import { formatDate } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";
import { getErrorMessage } from "../../utils/getErrorMessage";

/**
 * Groups a flat expense list into per-category totals, in a fixed display
 * order so the breakdown doesn't jump around as entries are added/removed.
 */
const CATEGORY_ORDER = ["Transportation", "Accommodation", "Food", "Activities", "Shopping", "Other"];

const groupByCategory = (expenses) => {
  const totals = new Map();
  expenses.forEach((expense) => {
    totals.set(expense.category, (totals.get(expense.category) || 0) + expense.amount);
  });
  return CATEGORY_ORDER.filter((category) => totals.has(category)).map((category) => ({
    category,
    total: totals.get(category),
  }));
};

/**
 * Expenses tab, rendered inside TripDetails. Handles its own data fetching
 * and CRUD so TripDetails only needs to pass a tripId and the trip's
 * planned budget, matching the Itinerary/Accommodation/Transportation tab
 * pattern. Budget totals are derived from the same `expenses` state array,
 * so they update immediately after any add/edit/delete.
 */
const ExpenseTab = ({ tripId, tripBudget }) => {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const [expensePendingDelete, setExpensePendingDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [toast, setToast] = useState(null);

  const loadExpenses = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await fetchExpenses(tripId);
      setExpenses(data);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load expenses."));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId]);

  const openAddForm = () => {
    setEditingExpense(null);
    setIsFormOpen(true);
  };

  const openEditForm = (expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingExpense(null);
  };

  const handleFormSubmit = async (formValues) => {
    if (editingExpense) {
      const updated = await updateExpense(editingExpense._id, formValues);
      setExpenses((prev) => prev.map((expense) => (expense._id === updated._id ? updated : expense)));
      setToast({ type: "success", message: "Expense updated successfully." });
    } else {
      const created = await createExpense(tripId, formValues);
      setExpenses((prev) => [...prev, created]);
      setToast({ type: "success", message: "Expense added successfully." });
    }
    closeForm();
  };

  const handleConfirmDelete = async () => {
    if (!expensePendingDelete) return;
    setIsDeleting(true);
    try {
      await deleteExpense(expensePendingDelete._id);
      setExpenses((prev) => prev.filter((expense) => expense._id !== expensePendingDelete._id));
      setToast({ type: "success", message: "Expense deleted successfully." });
    } catch (err) {
      setToast({
        type: "error",
        message: getErrorMessage(err, "Failed to delete expense."),
      });
    } finally {
      setIsDeleting(false);
      setExpensePendingDelete(null);
    }
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBudget = (tripBudget || 0) - totalExpenses;
  const categoryTotals = groupByCategory(expenses);

  const sortedExpenses = expenses
    .slice()
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <StatCard label="Planned Budget" value={formatCurrency(tripBudget)} />
        <StatCard label="Total Expenses" value={formatCurrency(totalExpenses)} />
        <StatCard
          label="Remaining Budget"
          value={
            <span style={{ color: remainingBudget < 0 ? "var(--color-danger)" : "inherit" }}>
              {formatCurrency(remainingBudget)}
            </span>
          }
        />
      </div>

      {!isLoading && !error && categoryTotals.length > 0 && (
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ margin: "0 0 12px", fontSize: 15 }}>Expenses by Category</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {categoryTotals.map(({ category, total }) => (
              <div
                key={category}
                style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}
              >
                <span style={{ color: "var(--color-text-muted)" }}>{category}</span>
                <span style={{ fontWeight: 600 }}>{formatCurrency(total)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <Button onClick={openAddForm} style={{ width: "auto" }}>
          + Add Expense
        </Button>
      </div>

      {isLoading && <Loader label="Loading expenses..." />}

      {!isLoading && error && <ErrorState message={error} onRetry={loadExpenses} />}

      {!isLoading && !error && expenses.length === 0 && (
        <EmptyState
          title="No expenses added yet"
          description="Add your spending to track it against this trip's budget."
          action={
            <Button onClick={openAddForm} style={{ width: "auto" }}>
              + Add Expense
            </Button>
          }
        />
      )}

      {!isLoading && !error && sortedExpenses.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {sortedExpenses.map((expense) => (
            <div
              key={expense._id}
              className="card"
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontSize: 13, color: "var(--color-text-muted)", marginBottom: 2 }}>
                  {expense.category}
                </div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{expense.description}</div>
                <div style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 4 }}>
                  {formatDate(expense.date)}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{formatCurrency(expense.amount)}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ width: "auto" }}
                    onClick={() => openEditForm(expense)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn"
                    style={{ width: "auto", backgroundColor: "var(--color-danger-bg)", color: "var(--color-danger)" }}
                    onClick={() => setExpensePendingDelete(expense)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isFormOpen && (
        <Modal title={editingExpense ? "Edit Expense" : "Add Expense"} onClose={closeForm}>
          <ExpenseForm
            initialValues={editingExpense}
            onSubmit={handleFormSubmit}
            onCancel={closeForm}
            submitLabel={editingExpense ? "Save Changes" : "Add Expense"}
          />
        </Modal>
      )}

      {expensePendingDelete && (
        <ConfirmModal
          title="Delete this expense?"
          message={`"${expensePendingDelete.description}" (${formatCurrency(expensePendingDelete.amount)}) will be permanently deleted. This cannot be undone.`}
          isSubmitting={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setExpensePendingDelete(null)}
        />
      )}

      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  );
};

export default ExpenseTab;
