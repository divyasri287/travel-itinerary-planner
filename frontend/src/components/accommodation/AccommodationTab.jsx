import { useEffect, useState } from "react";
import {
  fetchAccommodation,
  createAccommodationEntry,
  updateAccommodationEntry,
  deleteAccommodationEntry,
} from "../../services/accommodationService";
import Button from "../common/Button.jsx";
import Loader from "../common/Loader.jsx";
import EmptyState from "../common/EmptyState.jsx";
import ErrorState from "../common/ErrorState.jsx";
import ConfirmModal from "../common/ConfirmModal.jsx";
import Modal from "../common/Modal.jsx";
import Toast from "../common/Toast.jsx";
import AccommodationForm from "./AccommodationForm.jsx";
import { formatDate } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";
import { getErrorMessage } from "../../utils/getErrorMessage";

/**
 * Accommodation tab, rendered inside TripDetails. Handles its own data
 * fetching and CRUD so TripDetails only needs to pass a tripId, matching
 * the ItineraryTab pattern used for day-wise itinerary items.
 */
const AccommodationTab = ({ tripId }) => {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  const [entryPendingDelete, setEntryPendingDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [toast, setToast] = useState(null);

  const loadEntries = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await fetchAccommodation(tripId);
      setEntries(data);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load accommodation."));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId]);

  const openAddForm = () => {
    setEditingEntry(null);
    setIsFormOpen(true);
  };

  const openEditForm = (entry) => {
    setEditingEntry(entry);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingEntry(null);
  };

  const handleFormSubmit = async (formValues) => {
    if (editingEntry) {
      const updated = await updateAccommodationEntry(tripId, editingEntry._id, formValues);
      setEntries((prev) => prev.map((entry) => (entry._id === updated._id ? updated : entry)));
      setToast({ type: "success", message: "Accommodation entry updated successfully." });
    } else {
      const created = await createAccommodationEntry(tripId, formValues);
      setEntries((prev) => [...prev, created]);
      setToast({ type: "success", message: "Accommodation entry added successfully." });
    }
    closeForm();
  };

  const handleConfirmDelete = async () => {
    if (!entryPendingDelete) return;
    setIsDeleting(true);
    try {
      await deleteAccommodationEntry(tripId, entryPendingDelete._id);
      setEntries((prev) => prev.filter((entry) => entry._id !== entryPendingDelete._id));
      setToast({ type: "success", message: "Accommodation entry deleted successfully." });
    } catch (err) {
      setToast({
        type: "error",
        message: getErrorMessage(err, "Failed to delete accommodation entry."),
      });
    } finally {
      setIsDeleting(false);
      setEntryPendingDelete(null);
    }
  };

  const sortedEntries = entries
    .slice()
    .sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <Button onClick={openAddForm} style={{ width: "auto" }}>
          + Add Accommodation
        </Button>
      </div>

      {isLoading && <Loader label="Loading accommodation..." />}

      {!isLoading && error && <ErrorState message={error} onRetry={loadEntries} />}

      {!isLoading && !error && entries.length === 0 && (
        <EmptyState
          title="No accommodation added yet"
          description="Add where you're staying to keep all your stay details in one place."
          action={
            <Button onClick={openAddForm} style={{ width: "auto" }}>
              + Add Accommodation
            </Button>
          }
        />
      )}

      {!isLoading && !error && sortedEntries.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {sortedEntries.map((entry) => (
            <div
              key={entry._id}
              className="card"
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{entry.hotelName}</div>
                <div style={{ fontSize: 13, color: "var(--color-text-muted)" }}>{entry.address}</div>
                <div style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 4 }}>
                  {formatDate(entry.checkIn)} – {formatDate(entry.checkOut)}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{formatCurrency(entry.cost)}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ width: "auto" }}
                    onClick={() => openEditForm(entry)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn"
                    style={{ width: "auto", backgroundColor: "var(--color-danger-bg)", color: "var(--color-danger)" }}
                    onClick={() => setEntryPendingDelete(entry)}
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
        <Modal title={editingEntry ? "Edit Accommodation" : "Add Accommodation"} onClose={closeForm}>
          <AccommodationForm
            initialValues={editingEntry}
            onSubmit={handleFormSubmit}
            onCancel={closeForm}
            submitLabel={editingEntry ? "Save Changes" : "Add Entry"}
          />
        </Modal>
      )}

      {entryPendingDelete && (
        <ConfirmModal
          title="Delete this accommodation entry?"
          message={`"${entryPendingDelete.hotelName}" will be permanently deleted. This cannot be undone.`}
          isSubmitting={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setEntryPendingDelete(null)}
        />
      )}

      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  );
};

export default AccommodationTab;
