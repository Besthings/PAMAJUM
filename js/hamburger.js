document.addEventListener('DOMContentLoaded', function() {
    const menuIcon = document.querySelector('.hamburger'); // The hamburger menu icon
    const navToggle = document.getElementById('hamburger-toggle'); // The menu

    if (menuIcon && navToggle) {
        // Toggle the menu when clicking the hamburger icon
        menuIcon.addEventListener('click', function(event) {
            this.classList.toggle('is-active'); // Toggle the hamburger animation
            navToggle.classList.toggle('active'); // Toggle the 'active' class

            // Set max-height dynamically when the menu is opened
            if (navToggle.classList.contains('active')) {
                navToggle.style.maxHeight = navToggle.scrollHeight + 'px';
            } else {
                navToggle.style.maxHeight = '0';
            }

            event.stopPropagation(); // Stop propagation to prevent conflicts
        });

        // Close the menu when clicking outside of it
        document.addEventListener('click', function(event) {
            // Check if the menu is open and the click target is not inside the menu or the toggle button
            if (navToggle.classList.contains('active') && !navToggle.contains(event.target) && !event.target.closest('.hamburger')) {
                navToggle.classList.remove('active'); // Remove 'active' class
                navToggle.style.maxHeight = '0'; // Reset max-height to 0
                
                menuIcon.classList.remove('is-active'); // Deactivate the hamburger animation
            }
        });
    }
});
