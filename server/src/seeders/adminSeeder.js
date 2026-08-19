const bcrypt = require("bcryptjs");
const { db } = require("../config/database");

const seedAdmin = async () => {
    
    try {
        const adminEmail = "admin@example.com";
        const adminPassword = "Admin@12345";

        const [existingAdmin] = await db.query("SELECT id FROM users WHERE email = ?", [adminEmail]);

        if (existingAdmin.length > 0) {
            console.log("Admin already exists");
            return;
        }

        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        await db.query(
            `INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, 'admin')`,
            ["System Administrator", adminEmail, hashedPassword, "Admin Office"]
        );

        console.log("Admin created successfully");
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
    } 
    catch (error) 
    {
        console.error("Admin seeding failed:", error.message);
    } 
    finally 
    {
        await db.end();
    }
};

seedAdmin();