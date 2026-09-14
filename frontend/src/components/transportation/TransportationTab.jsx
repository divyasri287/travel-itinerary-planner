import { useEffect, useState } from "react";
import {
  fetchTransportation,
  createTransportationEntry,
  updateTransportationEntry,
  deleteTransportationEntry,
} from "../../services/transportationService";
import Button from "../common/Button.jsx";
import Loader from "../common/Loader.jsx";
import EmptyState from "../common/EmptyState.jsx";
import ErrorState from "../common/ErrorState.jsx";
import ConfirmModal from "../common/ConfirmModal.jsx";
import Modal from "../common/Modal.jsx";
import Toast from "../common/Toast.jsx";
import TransportationForm from "./TransportationForm.jsx";
import { formatDate } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";
import { getErrorMessage } from "../../utils/getErrorMessage";

const TYPE_ICONS = {
  Flight: "✈️",
  Train: "🚆",
  Bus: "🚌",
  Cab: "🚕",
  Car: "🚗",
  Other: "🧭",
};

const formatTime = (time) => {
  if (!time) return "";
  const [hoursStr, minutesStr] = time.split(":");
  const hours = Number(hoursStr);
  const suffix = hours >= 12 ? "PM" : "AM";
  const displayHours = ((hours + 11) % 12) + 1;
  return `${displayHours}:${minutesStr} ${suffix}`;
};

const TransportationTab = ({ tripId }) => {
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
      const data = await fetchTransportation(tripId);
      setEntries(data);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load transportation."));
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
      const updated = await updateTransportationEntry(tripId, editingEntry._id, formValues);
      setEntries((prev) => prev.map((entry) => (entry._id === updated._id ? updated : entry)));
      setToast({ type: "success", message: "Transportation updated successfully." });
    } else {
      const created = await createTransportationEntry(tripId, formValues);
      setEntries((prev) => [...prev, created]);
      setToast({ type: "success", message: "Transportation added successfully." });
    }
    closeForm();
  };

  const handleConfirmDelete = async () => {
    if (!entryPendingDelete) return;
    setIsDeleting(true);
    try {
      await deleteTransportationEntry(tripId, entryPendingDelete._id);
      setEntries((prev) => prev.filter((entry) => entry._id !== entryPendingDelete._id));
      setToast({ type: "success", message: "Transportation deleted successfully." });
    } catch (err) {
      setToast({
        type: "error",
        message: getErrorMessage(err, "Failed to delete transportation."),
      });
    } finally {
      setIsDeleting(false);
      setEntryPendingDelete(null);
    }
  };

  const sortedEntries = entries
    .slice()
    .sort((a, b) => {
      const dateDiff = new Date(a.date) - new Date(b.date);
      if (dateDiff !== 0) return dateDiff;
      return a.time < b.time ? -1 : a.time > b.time ? 1 : 0;
    });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 18 }}>
        <Button onClick={openAddForm} style={{ width: "auto", minHeight: 38, padding: "8px 18px" }}>
          + Add Transportation
        </Button>
      </div>

      {isLoading && <Loader label="Loading transportation..." />}

      {!isLoading && error && <ErrorState message={error} onRetry={loadEntries} />}

      {!isLoading && !error && entries.length === 0 && (
        <EmptyState
          title="No transportation added yet"
          description="Add your flights, trains, or cabs to keep all your travel legs in one place."
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
                  <span style={{ fontSize: 18 }}>{TYPE_ICONS[entry.type] || "🧭"}</span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: 0.6,
                      color: "var(--color-primary)",
                      background: "rgba(45, 125, 125, 0.08)",
                      padding: "2px 8px",
                      borderRadius: 999,
                    }}
                  >
                    {entry.type}
                  </span>
                </div>
                <h3
                  style={{
                    margin: "4px 0 6px",
                    fontSize: 16,
                    fontWeight: 700,
                    fontFamily: "var(--font-serif)",
                    color: "var(--color-text)",
                  }}
                >
                  {entry.from} → {entry.to}
                </h3>
                <div style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
                  🗓 {formatDate(entry.date)} {entry.time && `· 🕒 ${formatTime(entry.time)}`}
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
        <Modal title={editingEntry ? "Edit Transportation" : "Add Transportation"} onClose={closeForm}>
          <TransportationForm
            initialValues={editingEntry}
            onSubmit={handleFormSubmit}
            onCancel={closeForm}
            submitLabel={editingEntry ? "Save Changes" : "Add Entry"}
          />
        </Modal>
      )}

      {entryPendingDelete && (
        <ConfirmModal
          title="Delete this transportation entry?"
          message={`This ${entryPendingDelete.type} from ${entryPendingDelete.from} to ${entryPendingDelete.to} will be permanently deleted. This cannot be undone.`}
          isSubmitting={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setEntryPendingDelete(null)}
        />
      )}

      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  );
};

export default TransportationTab;
