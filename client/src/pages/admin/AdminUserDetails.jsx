import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import adminApi from "../../api/adminApi";

const AdminUserDetails = () => {

    const { userId } = useParams();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const loadUser = async () => {

            try 
            {
                setLoading(true);
                setError("");

                const response = await adminApi.getUserById(userId);

                console.log(response);

                if(response.success)
                {
                    setUser(response.data.user);
                } 
                else 
                {
                    setError( response.message || "Unable to load user");
                }
            } 
            catch (error) 
            {
                setError( error.response?.data?.message ||  "Unable to load user" );
            } 
            finally 
            {
                setLoading(false);
            }

        };

        loadUser();

    }, [userId]);

    if(loading) 
    {
        return <div>Loading user...</div>;
    }

    if(error) 
    {
        return (
        <div>
            <p>{error}</p>

            <Link to="/admin/users">
                Back to Users
            </Link>
        </div>
        );
    }

    if (!user) 
    {
        return (
        <div>
            <p>User not found.</p>

            <Link to="/admin/users">
                Back to Users
            </Link>
        </div>
        );
    }

    return (

        <div>

            <h1>User Details</h1>

            <div>
                <p>
                <strong>Name:</strong> {user.name}
                </p>

                <p>
                <strong>Email:</strong> {user.email}
                </p>

                <p>
                <strong>Address:</strong> {user.address}
                </p>

                <p>
                <strong>Role:</strong> {user.role}
                </p>
            </div>

        {user.role === "owner" && (
            <div>
            <h2>Store Information</h2>

            {user.stores && user.stores.length > 0 ? (
            <table>

                <thead>

                    <tr>
                        <th>Store</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Rating</th>
                    </tr>

                </thead>

                <tbody>

                    {user.stores.map((store) => (

                        <tr key={store.id}>

                            <td>{store.name}</td>
                            <td>{store.email}</td>
                            <td>{store.address}</td>
                            <td>
                                {store.average_rating ?? "No ratings"}
                            </td>

                        </tr>

                    ))}

                </tbody>
            </table>
            ) : (
                <p>This owner has no stores.</p>
            )}
            </div>
        )}

        <br />

        <Link to="/admin/users">
            Back to Users
        </Link>
        </div>
    );
};

export default AdminUserDetails;