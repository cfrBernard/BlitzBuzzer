document.getElementById('show-legal-popup').addEventListener('click', () => {
    document.getElementById('popup-overlay').style.display = 'block';
    document.getElementById('legal-popup-container').style.display = 'block';
});

document.getElementById('legal-popup-close').addEventListener('click', () => {
    document.getElementById('popup-overlay').style.display = 'none';
    document.getElementById('legal-popup-container').style.display = 'none';
});

document.getElementById('popup-overlay').addEventListener('click', () => {
    document.getElementById('popup-overlay').style.display = 'none';
    document.getElementById('legal-popup-container').style.display = 'none';
});