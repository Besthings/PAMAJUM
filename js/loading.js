window.scrollTo(0, 0);

setTimeout(function() {
    document.getElementById('opening').classList.add('hidden'); // Add hidden class to animate bounce-up
    setTimeout(function() {
      document.getElementById('opening').style.display = 'none'; // Hide opening screen after bounce-up
      document.getElementById('main-content').style.display = 'block'; // Show main content
    }, 800); // Wait for bounce-up animation to finish
  }, 4000); // Time matches the total animation duration (3s + 1s delay)