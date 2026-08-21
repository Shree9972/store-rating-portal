import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import adminApi from "../../api/adminApi";
import "./styles/CreateUser.css";

const CreateUser = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "user",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

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

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.address ||
      !formData.role
    ) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const response = await adminApi.createUser(formData);

      if (!response.success) {
        setError(response.message || "Unable to create user");
        return;
      }

      setSuccess("User created successfully");

      setTimeout(() => {
        navigate("/admin/users");
      }, 700);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to create user"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-user-page">
      <div className="create-user-container">
        <div className="create-user-header">
          <p>Create User</p>
          <h1>Create New User</h1>
          <span>Add a new user to the application.</span>
        </div>

        <form className="create-user-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>

            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>

            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="user">Normal User</option>
              <option value="owner">Store Owner</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {error && <p className="create-user-message error">{error}</p>}

          {success && (
            <p className="create-user-message success">
              {success}
            </p>
          )}

          <button
            className="create-user-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create User"}
          </button>
        </form>

        <Link className="create-user-back-link" to="/admin/users">
          Back to Users
        </Link>
      </div>
    </div>
  );
};

export default CreateUser;