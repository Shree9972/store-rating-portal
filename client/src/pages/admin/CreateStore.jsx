import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import adminApi from "../../api/adminApi";

const CreateStore = () => {
  const navigate = useNavigate();

  const [owners, setOwners] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: "",
  });

  const [loadingOwners, setLoadingOwners] = useState(true);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadOwners = async () => {
      try {
        setLoadingOwners(true);

        const response = await adminApi.getUsers({
          role: "owner",
        });

        if (response.success) {
          setOwners(response.data.users || []);
        } else {
          setError(
            response.message || "Unable to load store owners"
          );
        }
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load store owners"
        );
      } finally {
        setLoadingOwners(false);
      }
    };

    loadOwners();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if(!formData.name || !formData.email || !formData.address || !formData.ownerId) 
    {
        setError("All fields are required");
        return;
    }

    try {
      setLoading(true);

      const response = await adminApi.createStore({
        name: formData.name,
        email: formData.email,
        address: formData.address,
        ownerId: Number(formData.ownerId),
      });

      if (!response.success) {
        setError(
          response.message || "Unable to create store"
        );
        return;
      }

      setSuccess("Store created successfully");

      setTimeout(() => {
        navigate("/admin/stores");
      }, 700);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to create store"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Create Store</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Store Name</label>

          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="email">Store Email</label>

          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="address">Store Address</label>

          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div>
          <label htmlFor="ownerId">Store Owner</label>

          {loadingOwners ? (
            <p>Loading owners...</p>
          ) : (
            <select
              id="ownerId"
              name="ownerId"
              value={formData.ownerId}
              onChange={handleChange}
            >
              <option value="">Select an owner</option>

              {owners.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.name} ({owner.email})
                </option>
              ))}
            </select>
          )}
        </div>

        {error && <p>{error}</p>}

        {success && <p>{success}</p>}

        <button
          type="submit"
          disabled={loading || loadingOwners}
        >
          {loading ? "Creating..." : "Create Store"}
        </button>
      </form>

      <br />

      <Link to="/admin/stores">Back to Stores</Link>
    </div>
  );
};

export default CreateStore;