import { useState } from "react";
import CustomerList from "../components/CustomerList";
import CustomerForm from "../components/CustomerForm";
import { Modal, Button, Toast, ToastContainer } from "react-bootstrap";
import { debounce } from "lodash";

export default function CustomersPage() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [loadingModal, setLoadingModal] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const debouncedSearch = debounce((value) => setSearchQuery(value), 1000);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedCustomer(null);
    setShowModal(true);
  };

  const handleSaved = (action) => {
    setSelectedCustomer(null);
    setRefresh(!refresh);
    setShowModal(false);

    if (action === "create") {
      showToastMessage("Customer added successfully!");
    } else if (action === "update") {
      showToastMessage("Customer updated successfully!");
    }
  };

  const handleDeleted = (name) => {
    showToastMessage(`Customer "${name}" has been deleted.`);
    setRefresh(!refresh);
  };

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  return (
    <div>
      <div className="d-flex mb-3 gap-2">
        <Button
          variant="primary"
          onClick={handleAdd}
          disabled={loadingModal || tableLoading || deleting}
        >
          Add New Customer
        </Button>
        <input
          type="text"
          className="form-control"
          placeholder="Search by name or email..."
          value={search}
          onChange={handleSearchChange}
          disabled={tableLoading || deleting || loadingModal}
        />
      </div>

      <CustomerList
        onEdit={handleEdit}
        refreshKey={refresh}
        setDeleting={setDeleting}
        setTableLoading={setTableLoading}
        searchQuery={searchQuery}
        onDeleted={handleDeleted}
      />

      <Modal
        show={showModal}
        onHide={() => !loadingModal && setShowModal(false)}
        backdrop={loadingModal ? "static" : true}
        keyboard={!loadingModal}
      >
        <Modal.Header closeButton={!loadingModal}>
          <Modal.Title>{selectedCustomer ? "Edit Customer" : "Add Customer"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CustomerForm
            selectedCustomer={selectedCustomer}
            onSaved={handleSaved}
            loading={loadingModal}
            setLoading={setLoadingModal}
          />
        </Modal.Body>
      </Modal>

      <ToastContainer position="top-end" className="p-3">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          bg="success"
        >
          <Toast.Header>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}
