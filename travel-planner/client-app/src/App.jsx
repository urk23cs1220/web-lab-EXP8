// src/App.jsx
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  // State for the list of packages
  const [packages, setPackages] = useState([]);
  // State for the status message
  const [message, setMessage] = useState("");

  // State for the form inputs
  const [packageName, setPackageName] = useState("");
  const [packageCode, setPackageCode] = useState("");
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");

  // Load all packages when the page first opens
  useEffect(() => {
    loadPackages();
  }, []);

  // 1. READ (Fetch) all packages
  const loadPackages = () => {
    axios.get("http://localhost:7000/api/packages")
      .then((res) => {
        setPackages(res.data);
      })
      .catch((err) => console.log(err));
  };

  // 2. CREATE (Insert) a new package
  const addPackage = (event) => {
    event.preventDefault(); // Stop the form from reloading
    
    axios.post("http://localhost:7000/api/addPackage", {
      packageName: packageName,
      packageCode: packageCode,
      destination: destination,
      duration: duration,
      price: price
    })
    .then((res) => {
      setMessage(res.data.message); // Set the success/error message
      loadPackages(); // Refresh the package list
      // Clear the form fields
      setPackageName("");
      setPackageCode("");
      setDestination("");
      setDuration("");
      setPrice("");
    })
    .catch((err) => console.log(err));
  };

  // 3. DELETE a package
  const deletePackage = (id) => {
    // Send the package's unique _id to the server
    axios.post("http://localhost:7000/api/deletePackage", { id: id })
      .then((res) => {
        setMessage(res.data.message); // Set the success message
        loadPackages(); // Refresh the package list
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container p-3 mt-4">
      <div className="p-3 card bg-light w-75 mx-auto">
        
        <h1 className="text-center mb-4">✈️ Travel Package Planner</h1>
        <hr />
        
        <h3 className="text-center">Add New Package</h3>
        <div className="p-4">
          <form onSubmit={addPackage}>
            <div className="row">
              <div className="col-md-6">
                <input
                  placeholder="Package Name (e.g., Paris Getaway)"
                  value={packageName}
                  className="form-control mb-3"
                  required
                  onChange={(e) => setPackageName(e.target.value)}
                />
                <input
                  placeholder="Package Code (e.g., P-001)"
                  value={packageCode}
                  className="form-control mb-3"
                  required
                  onChange={(e) => setPackageCode(e.target.value)}
                />
                <input
                  placeholder="Destination (e.g., Paris, France)"
                  value={destination}
                  className="form-control mb-3"
                  required
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <input
                  type="number"
                  placeholder="Duration (days)"
                  value={duration}
                  className="form-control mb-3"
                  required
                  onChange={(e) => setDuration(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Price ($)"
                  value={price}
                  className="form-control mb-3"
                  required
                  onChange={(e) => setPrice(e.target.value)}
                />
                <button type="submit" className="btn btn-primary btn-lg w-100">Add Package</button>
              </div>
            </div>
          </form>
          
          <div className="text-success text-center mt-4 fs-4">
            {message && <span>{message}</span>}
          </div>
        </div>

        <hr />
        
        <h3 className="text-center">Available Packages</h3>
        <div className="mt-3">
          <table className="table table-bordered table-striped">
            <thead>
              <tr className="bg-light">
                <th>Package Name</th>
                <th>Code</th>
                <th>Destination</th>
                <th>Duration</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {!packages || packages.length === 0 ? (
                <tr>
                  <td colSpan="6" align="center">
                    No Packages Yet
                  </td>
                </tr>
              ) : (
                packages.map((pkg, index) => (
                  <tr key={index}>
                    <td>{pkg.packageName}</td>
                    <td>{pkg.packageCode}</td>
                    <td>{pkg.destination}</td>
                    <td>{pkg.duration} days</td>
                    <td>${pkg.price}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => deletePackage(pkg._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
      </div>
    </div>
  );
}

export default App;