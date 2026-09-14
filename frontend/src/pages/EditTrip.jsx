import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import TripForm from "../components/trip/TripForm.jsx";
import Loader from "../components/common/Loader.jsx";
import { fetchTripById, updateTrip } from "../services/tripService";
import { toInputDate } from "../utils/formatDate";

const EditTrip = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadTrip = async () => {
      setIsLoading(true);
      setError("");
      try {
        const data = await fetchTripById(id);
        if (isMounted) setTrip(data);
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || "Failed to load this trip.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadTrip();
    return () => {
      isMounted = false;
    };
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
          <div className="alert alert-error">{error}</div>
          <Link to="/trips" className="btn btn-secondary" style={{ textDecoration: "none", display: "inline-flex" }}>
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
