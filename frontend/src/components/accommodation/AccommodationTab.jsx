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
      setToast({ type: "success", message: "Accommodation updated successfully." });
    } else {
      const created = await createAccommodationEntry(tripId, formValues);
      setEntries((prev) => [...prev, created]);
      setToast({ type: "success", message: "Accommodation added successfully." });
    }
    closeForm();
  };

  const handleConfirmDelete = async () => {
    if (!entryPendingDelete) return;
    setIsDeleting(true);
    try {
      await deleteAccommodationEntry(tripId, entryPendingDelete._id);
      setEntries((prev) => prev.filter((entry) => entry._id !== entryPendingDelete._id));
      setToast({ type: "success", message: "Accommodation deleted successfully." });
    } catch (err) {
      setToast({
        type: "error",
        message: getErrorMessage(err, "Failed to delete accommodation."),
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
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 18 }}>
        <Button onClick={openAddForm} style={{ width: "auto", minHeight: 38, padding: "8px 18px" }}>
          + Add Accommodation
        </Button>
      </div>

      {isLoading && <Loader label="Loading accommodation..." />}

      {!isLoading && error && <ErrorState message={error} onRetry={loadEntries} />}

      {!isLoading && !error && entries.length === 0 && (
        <EmptyState
          title="No accommodation added yet"
          description="Add where you're staying to keep all your stay details in one place."
        />
      )}

      {!isLoading && !error && sortedEntries.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {sortedEntries.map((entry) => (
            <div
              key={entry._id}
              className="card"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 16,
                flexWrap: "wrap",
                padding: "18px 22px",
              }}
            >
              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 18 }}>🏨</span>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, fontFamily: "var(--font-serif)" }}>
                    {entry.hotelName}
                  </h3>
                </div>
                <div style={{ fontSize: 13, color: "var(--color-text-muted)", marginBottom: 6 }}>
                  📍 {entry.address}
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 12,
                    color: "var(--color-primary)",
                    backgroundColor: "rgba(45, 125, 125, 0.08)",
                    padding: "3px 10px",
                    borderRadius: 999,
                    fontWeight: 600,
                  }}
                >
                  🗓 Check-in: {formatDate(entry.checkIn)} → Check-out: {formatDate(entry.checkOut)}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: "var(--color-text)" }}>
                  {formatCurrency(entry.cost)}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ minHeight: 30, padding: "4px 10px", fontSize: 12, width: "auto" }}
                    onClick={() => openEditForm(entry)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn"
                    style={{
                      minHeight: 30,
                      padding: "4px 10px",
                      fontSize: 12,
                      backgroundColor: "var(--color-danger-bg)",
                      color: "var(--color-danger)",
                      border: "1px solid #fecaca",
                      width: "auto",
                    }}
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
