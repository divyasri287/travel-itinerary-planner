import { useState } from "react";
import Input from "../common/Input.jsx";
import Button from "../common/Button.jsx";
import { getErrorMessage } from "../../utils/getErrorMessage";

const TODAY = new Date().toISOString().split("T")[0];

const buildInitialState = (initialValues) => ({
  tripName: initialValues?.tripName || "",
  destination: initialValues?.destination || "",
  startDate: initialValues?.startDate || "",
  endDate: initialValues?.endDate || "",
  travelers: initialValues?.travelers ?? "",
  budget: initialValues?.budget ?? "",
});

/**
 * Shared form for Create Trip and Edit Trip. The parent is responsible for
 * calling the right API (create vs update) inside `onSubmit`.
 */
const TripForm = ({ initialValues, onSubmit, submitLabel = "Save Trip" }) => {
  const [formData, setFormData] = useState(buildInitialState(initialValues));
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const errors = {};

    if (!formData.tripName.trim() || formData.tripName.trim().length < 2) {
      errors.tripName = "Trip name must be at least 2 characters";
    }
    if (!formData.destination.trim() || formData.destination.trim().length < 2) {
      errors.destination = "Destination is required";
    }
    if (!formData.startDate) {
      errors.startDate = "Start date is required";
    }
    if (!formData.endDate) {
      errors.endDate = "End date is required";
    }
    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.endDate) < new Date(formData.startDate)
    ) {
      errors.endDate = "End date cannot be before start date";
    }
    const travelersNum = Number(formData.travelers);
    if (!formData.travelers || Number.isNaN(travelersNum) || travelersNum < 1) {
      errors.travelers = "Enter at least 1 traveler";
    }
    const budgetNum = Number(formData.budget);
    if (formData.budget === "" || Number.isNaN(budgetNum) || budgetNum < 0) {
      errors.budget = "Enter a valid budget (0 or more)";
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
        tripName: formData.tripName.trim(),
        destination: formData.destination.trim(),
        startDate: formData.startDate,
        endDate: formData.endDate,
        travelers: Number(formData.travelers),
        budget: Number(formData.budget),
      });
    } catch (error) {
      setServerError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="card" style={{ maxWidth: 520 }}>
      {serverError && <div className="alert alert-error">{serverError}</div>}

      <Input
        id="tripName"
        name="tripName"
        label="Trip Name"
        placeholder="Ooty Vacation"
        value={formData.tripName}
        onChange={handleChange}
        error={fieldErrors.tripName}
      />
      <Input
        id="destination"
        name="destination"
        label="Destination"
        placeholder="Ooty"
        value={formData.destination}
        onChange={handleChange}
        error={fieldErrors.destination}
      />

      <div className="form-row">
        <Input
          id="startDate"
          name="startDate"
          type="date"
          label="Start Date"
          value={formData.startDate}
          onChange={handleChange}
          error={fieldErrors.startDate}
          min={TODAY}
        />
        <Input
          id="endDate"
          name="endDate"
          type="date"
          label="End Date"
          value={formData.endDate}
          onChange={handleChange}
          error={fieldErrors.endDate}
          min={formData.startDate || TODAY}
        />
      </div>

      <div className="form-row">
        <Input
          id="travelers"
          name="travelers"
          type="number"
          min="1"
          label="Number of Travelers"
          placeholder="4"
          value={formData.travelers}
          onChange={handleChange}
          error={fieldErrors.travelers}
        />
        <Input
          id="budget"
          name="budget"
          type="number"
          min="0"
          label="Total Budget (₹)"
          placeholder="15000"
          value={formData.budget}
          onChange={handleChange}
          error={fieldErrors.budget}
        />
      </div>

      <Button type="submit" isLoading={isSubmitting}>
        {submitLabel}
      </Button>
    </form>
  );
};

export default TripForm;
