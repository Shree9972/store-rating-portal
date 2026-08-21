import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import adminApi from "../../api/adminApi";

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

    if (!formData.name || !formData.email || !formData.password || !formData.address || !formData.role) 
    {
      setError("All fields are required");
      return;
    }

    try 
    {
      setLoading(true);

      const response = await adminApi.createUser(formData);

      if(!response.success) 
      {
        setError( response.message || "Unable to create user" );
        return;
      }

      setSuccess("User created successfully");

      setTimeout(() => {
        navigate("/admin/users");
      }, 700);

    } 
    catch (error) 
    {
      setError(
        error.response?.data?.message ||
          "Unable to create user"
      );
    } 
    finally 
    {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Create User</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>

          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>

          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>

          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="address">Address</label>

          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div>
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

        {error && <p>{error}</p>}
        {success && <p>{success}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create User"}
        </button>
      </form>

      <br />

      <Link to="/admin/users">
        Back to Users
      </Link>
    </div>
  );
};

export default CreateUser;