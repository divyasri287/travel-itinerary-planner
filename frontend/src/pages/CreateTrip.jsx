import { useNavigate } from "react-router-dom";
import TripForm from "../components/trip/TripForm.jsx";
import { createTrip } from "../services/tripService";

const CreateTrip = () => {
  const navigate = useNavigate();

  const handleCreate = async (tripData) => {
    await createTrip(tripData);
    navigate("/trips");
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Create New Trip</h1>
        <p className="page-subtitle">Fill in the basics — you can add itinerary details later.</p>
      </div>
      <TripForm onSubmit={handleCreate} submitLabel="Create Trip" />
    </div>
  );
};

export default CreateTrip;
