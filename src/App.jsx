import { useState } from "react";
import axios from "axios";
const apiKey = import.meta.env.VITE_API_KEY;
import "./index.css"; // Ensure this line points to your CSS file location

function App() {
  const [number, setNumber] = useState("");
  const [pnrdetail, setPnrDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!number) return;
    getPNRdata(number);
  };

  const getPNRdata = async (pnrNum) => {
    setLoading(true);
    setError("");

    const options = {
      method: "GET",
      url: "https://irctc1.p.rapidapi.com/api/v3/getPNRStatus",
      params: { pnrNumber: pnrNum },
      headers: {
        // "x-rapidapi-key": "",
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": "irctc1.p.rapidapi.com",
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios.request(options);
      const data = response.data.data ? response.data.data : response.data;
      // console.log(data);
      setPnrDetail(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch PNR status. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pnr-container">
      {/* Header */}
      <div className="pnr-header">
        <h2 className="pnr-title"> PNR Status Check</h2>
        <p className="pnr-subtitle">Enter your 10-digit PNR Number to track your train details</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="pnr-form">
        <input
          type="number"
          name="pnr_no"
          placeholder="Enter 10-digit PNR"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className="pnr-input"
          required
        />
        <button type="submit" className="pnr-button" disabled={loading}>
          {loading ? "Searching..." : "Check Status"}
        </button>
      </form>

      {/* Error Output */}
      {error && <div className="pnr-error">{error}</div>}

      {/* Results Rendering */}
      {pnrdetail && (
        <div className="pnr-results">
          {/* Card 1: Journey Details */}
          <div className="pnr-card">
            {/* <h3 className="pnr-card-title">Journey Details   <span>Status: {pnrdetail.PassengerStatus?.[0]?.ConfirmTktStatus}</span>  </h3> */}
            
            <div className="pnr-card-header">
              <h3 className="pnr-card-title">Journey Details</h3>
              <span className="pnr-card-status">
                Status:{" "}
                <span
                  className={
                    pnrdetail.PassengerStatus?.[0]?.ConfirmTktStatus?.toLowerCase() === "Confirm" ||
                      pnrdetail.PassengerStatus?.[0]?.BookingStatusNew?.toUpperCase() === "CNF"
                      ? "status-confirm"
                      : "status-other"
                  }
                >
                  {pnrdetail.PassengerStatus?.[0]?.ConfirmTktStatus || "N/A"}
                </span>
              </span>
            </div>

            <div className="pnr-grid">
              <div className="pnr-grid-item"><strong>Date of Journey:</strong> {pnrdetail.Doj}</div>
              <div className="pnr-grid-item"><strong>Train Number:</strong> {pnrdetail.TrainNo}</div>
              <div className="pnr-grid-item"><strong>Class / Coach:</strong> {pnrdetail.Class}</div>

              <div className="pnr-grid-item"><strong>Booking Details:</strong> {pnrdetail.PassengerStatus?.[0]?.CurrentStatus}</div>

              <div className="pnr-grid-item"><strong>Duration:</strong> {pnrdetail.Duration} hrs</div>
              <div className="pnr-grid-item"><strong>Platform No:</strong> {pnrdetail.ExpectedPlatformNo || "N/A"}</div>
              <div className="pnr-grid-item"><strong>Chart Status:</strong> {pnrdetail.ChartPrepared ? "Prepared" : "Not Prepared"}</div>
              <div className="pnr-grid-item"><strong>Booking Fare:</strong> ₹ {pnrdetail.BookingFare}</div>
            </div>
          </div>

          {/* Card 2: Station & Routing Info */}
          <div className="pnr-card">
            <h3 className="pnr-card-title">Route & Station Details</h3>
            <div className="pnr-route">
              <div className="pnr-route-block">
                <span className="pnr-station-code">{pnrdetail.From}</span>
                <span className="pnr-station-name">{pnrdetail.BoardingStationName}</span>
                <span className="pnr-time">Departs: {pnrdetail.DepartureTime}</span>
              </div>
              <div className="pnr-arrow">➔</div>
              <div className="pnr-route-block">
                <span className="pnr-station-code">
                  {pnrdetail.DestinationName?.substring(0, 3).toUpperCase()}
                </span>
                <span className="pnr-station-name">{pnrdetail.DestinationName}</span>
                <span className="pnr-time">Arrives: {pnrdetail.ArrivalTime}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;