import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import adminApi from "../../api/adminApi";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("ASC");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await adminApi.getUsers({
        search: search || undefined,
        sortBy,
        sortOrder,
      });

      if(response.success) 
      {
        setUsers(response.data.users || []);

      } else {
        setError(
          response.message || "Unable to load users"
        );
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [sortBy, sortOrder]);

  const handleSearch = (event) => {
    event.preventDefault();
    loadUsers();
  };

  const handleDelete = async (userId) => {

    const confirmed = window.confirm( "Are you sure you want to delete this user?" );

    if(!confirmed) 
    {
      return;
    }

    try {
      const response = await adminApi.deleteUser(userId);

      if(!response.success) 
      {
        setError( response.message || "Unable to delete user" );
        return;
      }

      setUsers((previous) =>  previous.filter((user) => user.id !== userId) );

    } 
    catch (error) 
    {
      setError( error.response?.data?.message ||   "Unable to delete user" );
    }
  };

  return (
    <div>
      <h1>Manage Users</h1>

      <Link to="/admin/users/create">
        Create User
      </Link>

      <hr />

      <form onSubmit={handleSearch}>

        <input
          type="text"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search users..."
        />

        <button type="submit">
          Search
        </button>
      </form>

      <div>

        <label>
          Sort by:
          <select
            value={sortBy}
            onChange={(event) =>
              setSortBy(event.target.value)
            }
          >
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="address">Address</option>
            <option value="role">Role</option>
            <option value="created_at">
              Created Date
            </option>
          </select>
        </label>

        <button onClick={() =>
              setSortOrder((previous) =>  previous === "ASC" ? "DESC" : "ASC") } >

          {sortOrder === "ASC" ? "Ascending" : "Descending"}

        </button>
      </div>

      {loading && <p>Loading users...</p>}

      {error && <p>{error}</p>}

      {!loading && users.length === 0 && (
        <p>No users found.</p>
      )}

      {!loading && users.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.address}</td>
                <td>{user.role}</td>

                <td>
                  <Link
                    to={`/admin/users/${user.id}`}
                  >
                    View
                  </Link>

                  {" "}

                  <button
                    onClick={() =>
                      handleDelete(user.id)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUsers;