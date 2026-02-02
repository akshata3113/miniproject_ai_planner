import { useEffect, useState } from "react";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/auth/me", {
        headers: { Authorization: token },
      });

      const data = await res.json();
      setUser(data);
    };

    fetchProfile();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h2>Profile</h2>
      <p><b>Name:</b> {user.name}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Account Created:</b> {new Date(user.createdAt).toLocaleDateString()}</p>
      <p><b>Total Trips:</b> {user.tripCount}</p>
    </div>
  );
}

export default Profile;
