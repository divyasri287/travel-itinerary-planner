import { useState } from "react";
import Input from "../common/Input.jsx";
import Button from "../common/Button.jsx";
import { toInputDate } from "../../utils/formatDate";
import { getErrorMessage } from "../../utils/getErrorMessage";

const TRANSPORTATION_TYPES = ["Flight", "Train", "Bus", "Cab", "Car", "Other"];

const buildInitialState = (initialValues) => ({
  type: initialValues?.type || "",
  from: initialValues?.from || "",
  to: initialValues?.to || "",
  date: initialValues?.date ? toInputDate(initialValues.date) : "",
  time: initialValues?.time || "",
  cost: initialValues?.cost ?? "",
});

/**
 * Shared form for adding and editing a single transportation entry. The
 * parent (TransportationTab) is responsible for calling the right API
 * (create vs update) inside `onSubmit`, matching the AccommodationForm
 * pattern used for accommodation entries.
 */
const TransportationForm = ({ initialValues, onSubmit, onCancel, submitLabel = "Save Entry" }) => {
  const [formData, setFormData] = useState(buildInitialState(initialValues));
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const errors = {};

    if (!formData.type) {
      errors.type = "Type is required";
    }
    if (!formData.from.trim()) {
      errors.from = "From is required";
    }
    if (!formData.to.trim()) {
      errors.to = "To is required";
    }
    if (!formData.date) {
      errors.date = "Date is required";
    }
    if (!formData.time) {
      errors.time = "Time is required";
    }
    const costNum = Number(formData.cost);
    if (formData.cost === "" || Number.isNaN(costNum) || costNum < 0) {
      errors.cost = "Enter a valid cost (0 or more)";
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
        type: formData.type,
        from: formData.from.trim(),
        to: formData.to.trim(),
        date: formData.date,
        time: formData.time,
        cost: Number(formData.cost),
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
        <label className="form-label" htmlFor="type">
          Type
        </label>
        <select
          id="type"
          name="type"
          className="form-input"
          value={formData.type}
          onChange={handleChange}
        >
          <option value="">Select type</option>
          {TRANSPORTATION_TYPES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {fieldErrors.type && <div className="form-error">{fieldErrors.type}</div>}
      </div>

      <div className="form-row">
        <Input
          id="from"
          name="from"
          label="From"
          placeholder="Chennai"
          value={formData.from}
          onChange={handleChange}
          error={fieldErrors.from}
        />
        <Input
          id="to"
          name="to"
          label="To"
          placeholder="Goa"
          value={formData.to}
          onChange={handleChange}
          error={fieldErrors.to}
        />
      </div>

      <div className="form-row">
        <Input
          id="date"
          name="date"
          type="date"
          label="Date"
          value={formData.date}
          onChange={handleChange}
          error={fieldErrors.date}
        />
        <Input
          id="time"
          name="time"
          type="time"
          label="Time"
          value={formData.time}
          onChange={handleChange}
          error={fieldErrors.time}
        />
      </div>

      <Input
        id="cost"
        name="cost"
        type="number"
        min="0"
        label="Cost (₹)"
        placeholder="2500"
        value={formData.cost}
        onChange={handleChange}
        error={fieldErrors.cost}
      />

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

export default TransportationForm;
