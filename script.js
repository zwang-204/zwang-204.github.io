document.addEventListener('DOMContentLoaded', () => {
    const counter = document.getElementById('counter');
    const button = document.getElementById('counterButton');

    // Load the saved count from localStorage if it exists, or start with 0
    let count = parseInt(localStorage.getItem('count')) || 0;
    counter.innerText = count;

    button.addEventListener('click', () => {
        count += 1;
        counter.innerText = count;
        // Save the new count to localStorage
        localStorage.setItem('count', count);
    });
});
