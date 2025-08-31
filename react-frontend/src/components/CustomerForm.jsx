import { useState, useEffect } from "react";
import api from "../services/api";
import { Spinner } from "react-bootstrap";

export default function CustomerForm({ selectedCustomer, onSaved, loading, setLoading }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedCustomer) {
      setFirstName(selectedCustomer.first_name);
      setLastName(selectedCustomer.last_name);
      setEmail(selectedCustomer.email);
      setContactNo(selectedCustomer.contact_no);
    } else {
      setFirstName("");
      setLastName("");
      setEmail("");
      setContactNo("");
    }
    setErrors({});
  }, [selectedCustomer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      if (selectedCustomer) {
        await api.put(`/customers/${selectedCustomer.id}`, {
          first_name: firstName,
          last_name: lastName,
          email,
          contact_no: contactNo,
        });
      } else {
        await api.post("/customers", {
          first_name: firstName,
          last_name: lastName,
          email,
          contact_no: contactNo,
        });
      }
      onSaved();
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors || { general: [error.response.data.message] });
      } else {
        setErrors({ general: ["An unexpected error occurred."] });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="position-relative">
      {loading && (
        <div
          className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: "rgba(255,255,255,0.7)", zIndex: 10 }}
        >
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-4 p-3 border rounded bg-light">
        <h2 className="mb-3">{selectedCustomer ? "Edit Customer" : "Add Customer"}</h2>

        {errors.general && <div className="alert alert-danger">{errors.general.join(" ")}</div>}
        {errors.email && <div className="alert alert-danger">{errors.email.join(" ")}</div>}

        <input
          type="text"
          className={`form-control mb-2 ${errors.first_name ? "is-invalid" : ""}`}
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          className={`form-control mb-2 ${errors.last_name ? "is-invalid" : ""}`}
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <input
          type="email"
          className={`form-control mb-2 ${errors.email ? "is-invalid" : ""}`}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="tel"
          className={`form-control mb-3 ${errors.contact_no ? "is-invalid" : ""}`}
          placeholder="Contact No"
          value={contactNo}
          onChange={(e) => setContactNo(e.target.value.replace(/\D/g, ""))}
          required
        />

        <button type="submit" className="btn btn-success w-100" disabled={loading}>
          {selectedCustomer ? "Update" : "Create"}
        </button>
      </form>
    </div>
  );
}
