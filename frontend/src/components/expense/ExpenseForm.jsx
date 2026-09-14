import { useState } from "react";
import Input from "../common/Input.jsx";
import Button from "../common/Button.jsx";
import { toInputDate } from "../../utils/formatDate";
import { getErrorMessage } from "../../utils/getErrorMessage";

const EXPENSE_CATEGORIES = ["Transportation", "Accommodation", "Food", "Activities", "Shopping", "Other"];

const buildInitialState = (initialValues) => ({
  category: initialValues?.category || "",
  description: initialValues?.description || "",
  amount: initialValues?.amount ?? "",
  date: initialValues?.date ? toInputDate(initialValues.date) : "",
});

/**
 * Shared form for adding and editing a single expense. The parent
 * (ExpenseTab) is responsible for calling the right API (create vs
 * update) inside `onSubmit`, matching the TransportationForm pattern.
 */
const ExpenseForm = ({ initialValues, onSubmit, onCancel, submitLabel = "Save Expense" }) => {
  const [formData, setFormData] = useState(buildInitialState(initialValues));
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const errors = {};

    if (!formData.category) {
      errors.category = "Category is required";
    }
    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }
    const amountNum = Number(formData.amount);
    if (formData.amount === "" || Number.isNaN(amountNum) || amountNum < 0) {
      errors.amount = "Enter a valid amount (0 or more)";
    }
    if (!formData.date) {
      errors.date = "Date is required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        category: formData.category,
        description: formData.description.trim(),
        amount: Number(formData.amount),
        date: formData.date,
      });
    } catch (error) {
      setServerError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {serverError && <div className="alert alert-error">{serverError}</div>}

      <div className="form-group">
        <label className="form-label" htmlFor="category">
          Category
        </label>
        <select
          id="category"
          name="category"
          className="form-input"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="">Select category</option>
          {EXPENSE_CATEGORIES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {fieldErrors.category && <div className="form-error">{fieldErrors.category}</div>}
      </div>

      <Input
        id="description"
        name="description"
        label="Description"
        placeholder="Dinner at the beach shack"
        value={formData.description}
        onChange={handleChange}
        error={fieldErrors.description}
      />

      <div className="form-row">
        <Input
          id="amount"
          name="amount"
          type="number"
          min="0"
          label="Amount (₹)"
          placeholder="1200"
          value={formData.amount}
          onChange={handleChange}
          error={fieldErrors.amount}
        />
        <Input
          id="date"
          name="date"
          type="date"
          label="Date"
          value={formData.date}
          onChange={handleChange}
          error={fieldErrors.date}
        />
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
        <Button variant="secondary" type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting} style={{ width: "auto" }}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForm;
