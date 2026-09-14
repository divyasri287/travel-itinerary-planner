import { useState } from "react";
import Input from "../common/Input.jsx";
import Button from "../common/Button.jsx";
import { toInputDate } from "../../utils/formatDate";
import { getErrorMessage } from "../../utils/getErrorMessage";

const buildInitialState = (initialValues) => ({
  hotelName: initialValues?.hotelName || "",
  address: initialValues?.address || "",
  checkIn: initialValues?.checkIn ? toInputDate(initialValues.checkIn) : "",
  checkOut: initialValues?.checkOut ? toInputDate(initialValues.checkOut) : "",
  cost: initialValues?.cost ?? "",
});

/**
 * Shared form for adding and editing a single accommodation entry. The
 * parent (AccommodationTab) is responsible for calling the right API
 * (create vs update) inside `onSubmit`, matching the ItineraryForm pattern
 * used for itinerary items.
 */
const AccommodationForm = ({ initialValues, onSubmit, onCancel, submitLabel = "Save Entry" }) => {
  const [formData, setFormData] = useState(buildInitialState(initialValues));
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const errors = {};

    if (!formData.hotelName.trim()) {
      errors.hotelName = "Hotel name is required";
    }
    if (!formData.address.trim()) {
      errors.address = "Address is required";
    }
    if (!formData.checkIn) {
      errors.checkIn = "Check-in date is required";
    }
    if (!formData.checkOut) {
      errors.checkOut = "Check-out date is required";
    }
    if (formData.checkIn && formData.checkOut && formData.checkOut <= formData.checkIn) {
      errors.checkOut = "Check-out date must be after check-in date";
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
        hotelName: formData.hotelName.trim(),
        address: formData.address.trim(),
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
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

      <Input
        id="hotelName"
        name="hotelName"
        label="Hotel Name"
        placeholder="The Grand Palace Hotel"
        value={formData.hotelName}
        onChange={handleChange}
        error={fieldErrors.hotelName}
      />
      <Input
        id="address"
        name="address"
        label="Address"
        placeholder="123 MG Road, Bengaluru"
        value={formData.address}
        onChange={handleChange}
        error={fieldErrors.address}
      />

      <div className="form-row">
        <Input
          id="checkIn"
          name="checkIn"
          type="date"
          label="Check-In"
          value={formData.checkIn}
          onChange={handleChange}
          error={fieldErrors.checkIn}
        />
        <Input
          id="checkOut"
          name="checkOut"
          type="date"
          label="Check-Out"
          value={formData.checkOut}
          onChange={handleChange}
          error={fieldErrors.checkOut}
        />
      </div>

      <Input
        id="cost"
        name="cost"
        type="number"
        min="0"
        label="Cost (₹)"
        placeholder="3500"
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

export default AccommodationForm;
