import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import TripForm from "../components/trip/TripForm.jsx";
import Loader from "../components/common/Loader.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import { fetchTripById, updateTrip } from "../services/tripService";
import { toInputDate } from "../utils/formatDate";
import { getErrorMessage } from "../utils/getErrorMessage";

const EditTrip = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTrip = async (isMountedRef = { current: true }) => {
    setIsLoading(true);
    setError("");
    try {
      const data = await fetchTripById(id);
      if (isMountedRef.current) setTrip(data);
    } catch (err) {
      if (isMountedRef.current) {
        setError(getErrorMessage(err, "Failed to load this trip."));
      }
    } finally {
      if (isMountedRef.current) setIsLoading(false);
    }
  };

  useEffect(() => {
    const isMountedRef = { current: true };
    loadTrip(isMountedRef);
    return () => {
      isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleUpdate = async (tripData) => {
    await updateTrip(id, tripData);
    navigate("/trips");
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Edit Trip</h1>
        <p className="page-subtitle">Update your trip details.</p>
      </div>

      {isLoading && <Loader label="Loading trip..." />}

      {!isLoading && error && (
        <div>
          <ErrorState message={error} onRetry={() => loadTrip()} />
          <Link to="/trips" className="btn btn-secondary" style={{ textDecoration: "none", display: "inline-flex", width: "auto" }}>
            Back to My Trips
          </Link>
        </div>
      )}

      {!isLoading && !error && trip && (
        <TripForm
          initialValues={{
            tripName: trip.tripName,
            destination: trip.destination,
            startDate: toInputDate(trip.startDate),
            endDate: toInputDate(trip.endDate),
            travelers: trip.travelers,
            budget: trip.budget,
          }}
          onSubmit={handleUpdate}
          submitLabel="Save Changes"
        />
      )}
    </div>
  );
};

export default EditTrip;
