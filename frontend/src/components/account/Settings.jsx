function Settings() {
  return (
    <div>
      <h2>Settings</h2>
      <button onClick={() => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }}>Logout</button>
    </div>
  );
}

export default Settings;
