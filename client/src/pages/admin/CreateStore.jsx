import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import adminApi from "../../api/adminApi";
import "./styles/CreateStore.css";

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
                        response.message ||
                            "Unable to load store owners"
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

        if (
            !formData.name ||
            !formData.email ||
            !formData.address ||
            !formData.ownerId
        ) {
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
                    response.message ||
                        "Unable to create store"
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
        <div className="create-store-page">
            <div className="create-store-container">
                <Link
                    className="create-store-back"
                    to="/admin/stores"
                >
                    ← Back to Stores
                </Link>

                <header className="create-store-header">
                    <p>Store Management</p>
                    <h1>Create Store</h1>
                    <span>
                        Add a new store and assign it to an owner.
                    </span>
                </header>

                <section className="create-store-card">
                    <form onSubmit={handleSubmit}>
                        <div className="create-store-field">
                            <label htmlFor="name">
                                Store Name
                            </label>

                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="create-store-field">
                            <label htmlFor="email">
                                Store Email
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="create-store-field">
                            <label htmlFor="address">
                                Store Address
                            </label>

                            <textarea
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows="4"
                            />
                        </div>

                        <div className="create-store-field">
                            <label htmlFor="ownerId">
                                Store Owner
                            </label>

                            {loadingOwners ? (
                                <p className="create-store-loading">
                                    Loading owners...
                                </p>
                            ) : (
                                <select
                                    id="ownerId"
                                    name="ownerId"
                                    value={formData.ownerId}
                                    onChange={handleChange}
                                >
                                    <option value="">
                                        Select an owner
                                    </option>

                                    {owners.map((owner) => (
                                        <option
                                            key={owner.id}
                                            value={owner.id}
                                        >
                                            {owner.name} (
                                            {owner.email})
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {error && (
                            <div
                                className="create-store-message error"
                                role="alert"
                            >
                                {error}
                            </div>
                        )}

                        {success && (
                            <div
                                className="create-store-message success"
                                role="status"
                            >
                                {success}
                            </div>
                        )}

                        <button
                            className="create-store-submit"
                            type="submit"
                            disabled={loading || loadingOwners}
                        >
                            {loading
                                ? "Creating..."
                                : "Create Store"}
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
};

export default CreateStore;