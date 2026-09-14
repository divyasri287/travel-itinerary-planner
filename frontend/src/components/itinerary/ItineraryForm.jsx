import { useState } from "react";
import Input from "../common/Input.jsx";
import Button from "../common/Button.jsx";
import { toInputDate } from "../../utils/formatDate";
import { getErrorMessage } from "../../utils/getErrorMessage";

const buildInitialState = (initialValues) => ({
  date: initialValues?.date ? toInputDate(initialValues.date) : "",
  place: initialValues?.place || "",
  activity: initialValues?.activity || "",
  startTime: initialValues?.startTime || "",
  endTime: initialValues?.endTime || "",
  estimatedCost: initialValues?.estimatedCost ?? "",
  notes: initialValues?.notes || "",
});

/**
 * Shared form for adding and editing a single itinerary item. The parent
 * (ItineraryTab) is responsible for calling the right API (create vs
 * update) inside `onSubmit`, matching the TripForm pattern used for trips.
 */
const ItineraryForm = ({ initialValues, onSubmit, onCancel, submitLabel = "Save Item" }) => {
  const [formData, setFormData] = useState(buildInitialState(initialValues));
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const errors = {};

    if (!formData.date) {
      errors.date = "Date is required";
    }
    if (!formData.place.trim()) {
      errors.place = "Place is required";
    }
    if (!formData.activity.trim()) {
      errors.activity = "Activity is required";
    }
    if (!formData.startTime) {
      errors.startTime = "Start time is required";
    }
    if (!formData.endTime) {
      errors.endTime = "End time is required";
    }
    if (formData.startTime && formData.endTime && formData.endTime <= formData.startTime) {
      errors.endTime = "End time must be after start time";
    }
    const costNum = Number(formData.estimatedCost);
    if (formData.estimatedCost === "" || Number.isNaN(costNum) || costNum < 0) {
      errors.estimatedCost = "Enter a valid cost (0 or more)";
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
        date: formData.date,
        place: formData.place.trim(),
        activity: formData.activity.trim(),
        startTime: formData.startTime,
        endTime: formData.endTime,
        estimatedCost: Number(formData.estimatedCost),
        notes: formData.notes.trim(),
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
        id="place"
        name="place"
        label="Place"
        placeholder="Botanical Garden"
        value={formData.place}
        onChange={handleChange}
        error={fieldErrors.place}
      />
      <Input
        id="activity"
        name="activity"
        label="Activity"
        placeholder="Morning walk and photography"
        value={formData.activity}
        onChange={handleChange}
        error={fieldErrors.activity}
      />

      <div className="form-row">
        <Input
          id="startTime"
          name="startTime"
          type="time"
          label="Start Time"
          value={formData.startTime}
          onChange={handleChange}
          error={fieldErrors.startTime}
        />
        <Input
          id="endTime"
          name="endTime"
          type="time"
          label="End Time"
          value={formData.endTime}
          onChange={handleChange}
          error={fieldErrors.endTime}
        />
      </div>

      <Input
        id="estimatedCost"
        name="estimatedCost"
        type="number"
        min="0"
        label="Estimated Cost (₹)"
        placeholder="500"
        value={formData.estimatedCost}
        onChange={handleChange}
        error={fieldErrors.estimatedCost}
      />

      <div className="form-group">
        <label className="form-label" htmlFor="notes">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          className="form-input"
          rows={3}
          placeholder="Optional notes..."
          value={formData.notes}
          onChange={handleChange}
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

export default ItineraryForm;
