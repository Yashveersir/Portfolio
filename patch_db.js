async function patch() {
  console.log("Fetching current DB state...");
  const res = await fetch('https://portfolio-backend-w82m.onrender.com/api/portfolio');
  const data = await res.json();
  console.log("Current projects count:", data.projects ? data.projects.length : 0);
  console.log("Done");
}
patch();
