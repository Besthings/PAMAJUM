document.querySelector('.hamburger').addEventListener('click', function(event) {
    const navToggle = document.getElementById('hamburger-toggle'); // Your menu
    this.classList.toggle('is-active'); // Toggle the Tasty CSS hamburger animation

    navToggle.classList.toggle('active'); // Toggle the 'active' class

    // If the menu is open, adjust the max-height
    if (navToggle.classList.contains('active')) {
        navToggle.style.maxHeight = navToggle.scrollHeight + 'px'; // Set max-height dynamically
    } else {
        navToggle.style.maxHeight = '0'; // Reset max-height to 0
    }
    
    event.stopPropagation(); // Stop propagation to prevent conflicts
});

// Function to close the menu when clicking outside of it
document.addEventListener('click', function(event) {
    const navToggle = document.getElementById('hamburger-toggle'); // Your menu
    const menuIcon = document.querySelector('.hamburger'); // The menu icon
    
    // Check if the menu is open and the click target is not inside the menu or the toggle button
    if (navToggle.classList.contains('active') && !navToggle.contains(event.target) && !event.target.closest('.hamburger')) {
        navToggle.classList.remove('active'); // Remove 'active' class
        navToggle.style.maxHeight = '0'; // Reset max-height to 0
        
        menuIcon.classList.remove('is-active'); // Deactivate the Tasty CSS animation
    }
});
