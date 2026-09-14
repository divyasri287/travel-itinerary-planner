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
      <div style={{ maxWidth: 660, margin: "0 auto 24px", textAlign: "center" }}>
        <h1 className="page-title">Create New Trip</h1>
      </div>
      <TripForm onSubmit={handleCreate} submitLabel="Create Trip" />
    </div>
  );
};

export default CreateTrip;
