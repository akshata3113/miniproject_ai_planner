import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import MapView from "../components/ui/MapView";

export default function TripResult() {
  const location = useLocation();
  const { formData, trip: initialTrip } = location.state || {};

  const [trip, setTrip] = useState(initialTrip || null);
  const [coordsList, setCoordsList] = useState([]);
  const [loading, setLoading] = useState(!initialTrip);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!formData || initialTrip) return;

    const generateTrip = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/generate-trip", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            destination: formData.destination,
            days: formData.days,
            budget: formData.budget,
            travelers: formData.travelWith,
          }),
        });

        const data = await res.json();
        setTrip(data);

        const coords =
          data?.itinerary
            ?.filter((d) => d.lat && d.lon)
            ?.map((d) => ({
              lat: d.lat,
              lon: d.lon,
              label: `Day ${d.day}`,
            })) || [];

        setCoordsList(coords);
      } catch (err) {
        console.error(err);
        setError("Failed to generate trip.");
      } finally {
        setLoading(false);
      }
    };

    generateTrip();
  }, [formData, initialTrip]);

  if (!formData)
    return (
      <p>
        No trip data. Go back to <Link to="/create-trip">Create Trip</Link>.
      </p>
    );

  if (loading) return <p className="p-5">Generating your itinerary...</p>;
  if (error) return <p className="text-red-600 p-5">{error}</p>;

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10 flex flex-col min-h-screen">
      <h2 className="font-bold text-3xl mb-6">Your AI-Generated Trip Itinerary</h2>

      {/* Map Preview */}
      {coordsList.length > 0 && (
        <div className="mb-6 h-80">
          <MapView multipleCoords={coordsList} />
        </div>
      )}

      {/* SUMMARY */}
      {trip?.summary && (
        <section className="mb-6 p-5 bg-gray-100 rounded-xl">
          <h3 className="text-2xl font-semibold mb-2">Trip Summary</h3>
          <p><strong>Best Time to Visit:</strong> {trip.summary.best_time_to_visit}</p>
          <p><strong>Total Estimated Cost:</strong> {trip.summary.travel_cost_estimate}</p>

          <h4 className="font-semibold mt-3">Local Tips:</h4>
          <ul className="list-disc pl-6">
            {trip.summary.local_tips?.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </section>
      )}

      {/* HOTELS */}
      {trip?.hotels?.length > 0 && (
        <section className="mb-6">
          <h3 className="text-2xl font-semibold mb-3">Recommended Hotels</h3>

          <div className="space-y-3">
            {trip.hotels.map((hotel, i) => (
              <div key={i} className="p-4 bg-gray-100 rounded-xl border">
                <h4 className="font-bold">{hotel.name}</h4>
                <p>💵 {hotel.price_range}</p>
                <p>⭐ Rating: {hotel.rating}</p>
                {hotel.link && (
                  <a href={hotel.link} target="_blank" className="text-blue-600 underline">
                    View Hotel
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PLACES TO VISIT */}
      {trip?.places_to_visit?.length > 0 && (
        <section className="mb-6">
          <h3 className="text-2xl font-semibold mb-3">Places to Visit</h3>

          {trip.places_to_visit.map((place, i) => (
            <div key={i} className="p-4 bg-gray-100 rounded-xl mb-3 border">
              <h4 className="font-bold">{place.name}</h4>
              <p className="text-gray-700">{place.description}</p>
              <p><strong>Best Time:</strong> {place.best_time}</p>
            </div>
          ))}
        </section>
      )}

      {/* ITINERARY */}
      {trip?.itinerary?.length > 0 && (
        <section className="mb-6">
          <h3 className="text-2xl font-semibold mb-3">Daily Plan</h3>

          {trip.itinerary.map((day, i) => (
            <div key={i} className="border p-4 rounded-xl bg-gray-50 mb-4">
              <h4 className="font-bold text-xl mb-2">Day {day.day}: {day.title}</h4>

              <ul className="list-disc pl-6">
                {day.plan.map((activity, idx) => (
                  <li key={idx}>{activity}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      <Link
        to="/create-trip"
        className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
      >
        Back to Planner
      </Link>

      {/* Footer */}
      <footer className="mt-10 py-6 text-center text-gray-500 border-t">
        &copy; 2025 AI Travel Planner. All rights reserved.
      </footer>
    </div>
  );
}
