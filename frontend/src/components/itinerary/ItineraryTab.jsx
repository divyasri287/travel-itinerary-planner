import { useEffect, useState } from "react";
import {
  fetchItinerary,
  createItineraryItem,
  updateItineraryItem,
  deleteItineraryItem,
} from "../../services/itineraryService";
import Button from "../common/Button.jsx";
import Loader from "../common/Loader.jsx";
import EmptyState from "../common/EmptyState.jsx";
import ErrorState from "../common/ErrorState.jsx";
import ConfirmModal from "../common/ConfirmModal.jsx";
import Modal from "../common/Modal.jsx";
import Toast from "../common/Toast.jsx";
import ItineraryForm from "./ItineraryForm.jsx";
import { formatDate, toInputDate } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";
import { getErrorMessage } from "../../utils/getErrorMessage";

// Converts "14:30" -> "2:30 PM" for display only; stored/validated value
// stays in 24h HH:MM format end to end.
const formatTime = (time) => {
  if (!time) return "";
  const [hoursStr, minutesStr] = time.split(":");
  const hours = Number(hoursStr);
  const suffix = hours >= 12 ? "PM" : "AM";
  const displayHours = ((hours + 11) % 12) + 1;
  return `${displayHours}:${minutesStr} ${suffix}`;
};

// Groups the flat item list into day buckets, sorted by date, with each
// day's items sorted by start time.
const groupByDate = (items) => {
  const groups = new Map();

  items.forEach((item) => {
    const key = toInputDate(item.date);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  });

  return Array.from(groups.entries())
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([dateKey, dayItems]) => ({
      dateKey,
      items: dayItems
        .slice()
        .sort((a, b) => (a.startTime < b.startTime ? -1 : a.startTime > b.startTime ? 1 : 0)),
    }));
};

/**
 * Day-wise itinerary tab, rendered inside TripDetails.
 * Editorial travel-journal day-by-day table format.
 */
const ItineraryTab = ({ tripId }) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [itemPendingDelete, setItemPendingDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [toast, setToast] = useState(null);

  const loadItems = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await fetchItinerary(tripId);
      setItems(data);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load itinerary."));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId]);

  const openAddForm = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const openEditForm = (item) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingItem(null);
  };

  const handleFormSubmit = async (formValues) => {
    if (editingItem) {
      const updated = await updateItineraryItem(tripId, editingItem._id, formValues);
      setItems((prev) => prev.map((item) => (item._id === updated._id ? updated : item)));
      setToast({ type: "success", message: "Itinerary item updated successfully." });
    } else {
      const created = await createItineraryItem(tripId, formValues);
      setItems((prev) => [...prev, created]);
      setToast({ type: "success", message: "Itinerary item added successfully." });
    }
    closeForm();
  };

  const handleConfirmDelete = async () => {
    if (!itemPendingDelete) return;
    setIsDeleting(true);
    try {
      await deleteItineraryItem(tripId, itemPendingDelete._id);
      setItems((prev) => prev.filter((item) => item._id !== itemPendingDelete._id));
      setToast({ type: "success", message: "Itinerary item deleted successfully." });
    } catch (err) {
      setToast({
        type: "error",
        message: getErrorMessage(err, "Failed to delete itinerary item."),
      });
    } finally {
      setIsDeleting(false);
      setItemPendingDelete(null);
    }
  };

  const dayGroups = groupByDate(items);

  return (
    <div>
      {/* Top action header: Single Add button */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 18 }}>
        <Button onClick={openAddForm} style={{ width: "auto", minHeight: 38, padding: "8px 18px" }}>
          + Add Itinerary Item
        </Button>
      </div>

      {isLoading && <Loader label="Loading itinerary..." />}

      {!isLoading && error && <ErrorState message={error} onRetry={loadItems} />}

      {!isLoading && !error && items.length === 0 && (
        <EmptyState
          title="No itinerary items yet"
          description="Start building your day-by-day travel plan."
        />
      )}

      {!isLoading && !error && dayGroups.length > 0 && (
        <div>
          {dayGroups.map((group, index) => (
            <div key={group.dateKey} className="itinerary-day-card">
              {/* Day Header */}
              <div className="itinerary-day-header">
                <h3 className="itinerary-day-title">✓ DAY {index + 1}</h3>
                <span className="itinerary-day-date">{formatDate(group.dateKey).toUpperCase()}</span>
              </div>

              {/* Day Table */}
              <div className="itinerary-table">
                <div className="itinerary-table-header">
                  <span>Time</span>
                  <span>Activity / Place</span>
                  <span style={{ textAlign: "right" }}>Cost</span>
                  <span style={{ textAlign: "right" }}>Actions</span>
                </div>

                {group.items.map((item) => (
                  <div key={item._id} className="itinerary-row">
                    <div className="itinerary-time">
                      {item.startTime ? formatTime(item.startTime) : "Anytime"}
                      {item.endTime ? ` – ${formatTime(item.endTime)}` : ""}
                    </div>

                    <div className="itinerary-main">
                      <div className="itinerary-activity">{item.activity}</div>
                      <div className="itinerary-place">📍 {item.place}</div>
                      {item.notes && <div className="itinerary-notes">“{item.notes}”</div>}
                    </div>

                    <div className="itinerary-cost">
                      {formatCurrency(item.estimatedCost)}
                    </div>

                    <div className="itinerary-actions">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ minHeight: 28, padding: "3px 8px", fontSize: 12, width: "auto" }}
                        onClick={() => openEditForm(item)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn"
                        style={{
                          minHeight: 28,
                          padding: "3px 8px",
                          fontSize: 12,
                          backgroundColor: "var(--color-danger-bg)",
                          color: "var(--color-danger)",
                          border: "1px solid #fecaca",
                          width: "auto",
                        }}
                        onClick={() => setItemPendingDelete(item)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {isFormOpen && (
        <Modal title={editingItem ? "Edit Itinerary Item" : "Add Itinerary Item"} onClose={closeForm}>
          <ItineraryForm
            initialValues={editingItem}
            onSubmit={handleFormSubmit}
            onCancel={closeForm}
            submitLabel={editingItem ? "Save Changes" : "Add Item"}
          />
        </Modal>
      )}

      {itemPendingDelete && (
        <ConfirmModal
          title="Delete this itinerary item?"
          message={`"${itemPendingDelete.activity}" at ${itemPendingDelete.place} will be permanently deleted. This cannot be undone.`}
          isSubmitting={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setItemPendingDelete(null)}
        />
      )}

      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  );
};

export default ItineraryTab;
