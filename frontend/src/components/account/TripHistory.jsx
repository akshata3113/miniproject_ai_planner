import { useEffect, useState } from "react";

function TripHistory() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch("http://localhost:5000/my-trips", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        // ✅ Handle only array response
        if (Array.isArray(data)) {
          setTrips(data);
        } else {
          console.log("Unexpected response from server:", data);
          setTrips([]);
        }
      } catch (err) {
        console.log("Error fetching trips:", err);
        setTrips([]);
      }

      setLoading(false);
    };

    fetchTrips();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Trip History</h2>

      {trips.length === 0 ? (
        <p>No trips found.</p>
      ) : (
        trips.map((t, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ddd",
              margin: "10px",
              padding: "10px",
            }}
          >
            <h3>{t.destination}</h3>
            <p>Days: {t.days}</p>
            <p>Budget: {t.budget}</p>
            <p>Travel With: {t.travelWith}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default TripHistory;
