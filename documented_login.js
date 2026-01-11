/**
 * Staff Login System Documentation
 *
 * This code snippet handles the login functionality for staff members (employees and admins) in the "Sheikh El Balad" restaurant management system.
 * It supports two types of authentication:
 * 1. Static admin account (hardcoded for simplicity)
 * 2. Dynamic employee accounts stored in Firebase Realtime Database
 *
 * The system uses Firebase for real-time data synchronization and localStorage for session persistence.
 */

/**
 * Event listener for the login button click.
 * Retrieves username and password from input fields, validates against stored credentials,
 * and either logs in the user or displays an error message.
 */
document.getElementById('loginBtn').addEventListener('click', () => {
    // Get trimmed values from username and password input fields
    const u = document.getElementById('username').value.trim();
    const p = document.getElementById('password').value.trim();

    // Variable to hold the found user object if authentication succeeds
    let found = null;

    // 1. Check static admin account (hardcoded for default admin access)
    if (u === 'admin' && p === '123') {
        found = { name: 'Admin', role: 'admin', key: 'static_admin' };
    }
    // 2. Check dynamic employee accounts from Firebase
    else if (window.allUsersData) {
        // Iterate through all users in the database
        Object.entries(window.allUsersData).forEach(([k, user]) => {
            // Check if username and password match
            if (user.name === u && user.pass === p) {
                // Create user object with database key
                found = { ...user, key: k };
            }
        });
    }

    // If a matching user was found
    if (found) {
        // Set current user globally
        currentUser = found;
        // Store user data in localStorage for session persistence
        localStorage.setItem('sheikh_staff_user', JSON.stringify(found));
        // Call login success function to initialize the dashboard
        loginSuccess(found);
    } else {
        // Display error message if authentication failed
        alert('خطأ في البيانات! يرجى التأكد من اسم الموظف وكلمة المرور.');
    }
});

/**
 * Initializes the system by setting up real-time listeners for various data collections.
 * This function is called after successful login to start monitoring database changes.
 */
function startSystem() {
    // Listen for changes in employee/user accounts from Firebase
    DB.listen('users', (data) => {
        // Store user data globally for quick access
        window.allUsersData = data;
        // Render/update the users list in the admin panel
        renderUsers(data);
    });

    // Additional listeners for other system components (orders, chats, etc.)
    // These are initialized here to enable real-time updates across the application
    // ... other DB.listen calls for orders, chats, etc.
}

/**
 * Additional Notes:
 * - The system uses Firebase Realtime Database for data persistence and real-time synchronization.
 * - User sessions are maintained using localStorage to survive page refreshes.
 * - The static admin account provides a fallback authentication method.
 * - Arabic text is used for user-facing messages to match the application's language.
 * - The code assumes the existence of global variables like 'currentUser', 'DB', and functions like 'loginSuccess' and 'renderUsers'.
 */
