export default function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  
    const { latitude, longitude } = req.body;
  
    if (!latitude || !longitude) {
      return res.status(400).json({ allowed: false, message: "Invalid location data" });
    }
  
    // Swinburne Hawthorn Campus Coordinates (approximate bounding box)
    const swinburneBounds = {
      minLat: -37.8245,
      maxLat: -37.8205,
      minLng: 145.0350,
      maxLng: 145.0420,
    };
  
    const isOnCampus =
      latitude >= swinburneBounds.minLat &&
      latitude <= swinburneBounds.maxLat &&
      longitude >= swinburneBounds.minLng &&
      longitude <= swinburneBounds.maxLng;
  
    if (isOnCampus) {
      return res.json({ allowed: true, message: "User is on campus." });
    } else {
      return res.json({ allowed: false, message: "User is not on campus." });
    }
  }
  