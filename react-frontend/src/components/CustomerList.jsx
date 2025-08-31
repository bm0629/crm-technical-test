import { useEffect, useState } from "react";
import api from "../services/api";
import { Button, Spinner } from "react-bootstrap";

export default function CustomerList({
  onEdit,
  refreshKey,
  setDeleting,
  setTableLoading,
  searchQuery,
  onDeleted,
}) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [flashId, setFlashId] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, [refreshKey, searchQuery]);

  const fetchCustomers = async () => {
    setLoading(true);
    setTableLoading(true);
    try {
      const response = await api.get("/customers", {
        params: { search: searchQuery || undefined },
      });
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
      setTableLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    setDeleting(true);
    try {
      const customer = customers.find((c) => c.id === id);
      // flash row before removing
      setFlashId(id);
      await new Promise((resolve) => setTimeout(resolve, 500));
      await api.delete(`/customers/${id}`);
      setCustomers(customers.filter((c) => c.id !== id));
      if (onDeleted && customer) {
        onDeleted(`${customer.first_name} ${customer.last_name}`);
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
    } finally {
      setDeletingId(null);
      setFlashId(null);
      setDeleting(false);
    }
  };

  return (
    <div className="position-relative">
      {(loading || deletingId) && (
        <div
          className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: "rgba(255,255,255,0.7)", zIndex: 10 }}
        >
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Contact No</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr
              key={customer.id}
              style={{
                backgroundColor: flashId === customer.id ? "#f8d7da" : "transparent",
                transition: "background-color 0.5s ease",
              }}
            >
              <td>{customer.id}</td>
              <td>{customer.first_name}</td>
              <td>{customer.last_name}</td>
              <td>{customer.email}</td>
              <td>{customer.contact_no}</td>
              <td className="d-flex gap-2">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => onEdit(customer)}
                  disabled={deletingId !== null || loading}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(customer.id)}
                  disabled={deletingId !== null || loading}
                >
                  {deletingId === customer.id ? (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                  ) : (
                    "Delete"
                  )}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
