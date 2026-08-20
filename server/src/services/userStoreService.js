const { db } = require("../config/database");

//in seach only email adn name is inclued
//sorting is for user preference only 
const getStoresForUser = async ({ userId, search, sortBy = "name", sortOrder = "ASC" }) => {

    const allowedSortFields = { name: "s.name", address: "s.address", average_rating: "average_rating" };

    const sortColumn = allowedSortFields[sortBy] || "s.name";

    const order = sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC";

    const valuesToQuery = [];
    let conditionClause = "";

    valuesToQuery.push(userId);

    //only name and email is included here 
    if(search) 
    {
        conditionClause = `WHERE s.name LIKE ? OR s.address LIKE ?`;
        const searchValue = `%${search}%`;
        valuesToQuery.push(searchValue, searchValue);
    }

    const [stores] = await db.query(
        `SELECT s.id, s.name, s.address,

        COALESCE((SELECT AVG(r.rating) FROM ratings r WHERE r.store_id = s.id), 0) AS average_rating,

        (SELECT COUNT(*) FROM ratings r WHERE r.store_id = s.id) AS total_ratings,
        (SELECT r.rating FROM ratings r WHERE r.store_id = s.id AND r.user_id = ? LIMIT 1) AS user_rating

        FROM stores s

        ${conditionClause}
        ORDER BY ${sortColumn} ${order}`,
        valuesToQuery
    );

    return stores.map((store) => ({

        id: store.id,
        name: store.name,
        address: store.address,
        averageRating: Number(Number(store.average_rating).toFixed(2)),

        totalRatings: Number(store.total_ratings),
        userRating: store.user_rating === null ? null : Number(store.user_rating)

    }));

};

module.exports = { getStoresForUser };