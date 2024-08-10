document.getElementById('show-popup').addEventListener('click', () => {
    document.getElementById('popup-overlay').style.display = 'block';
    document.getElementById('popup-container').style.display = 'block';
});

document.getElementById('popup-close').addEventListener('click', () => {
    document.getElementById('popup-overlay').style.display = 'none';
    document.getElementById('popup-container').style.display = 'none';
});

document.getElementById('popup-overlay').addEventListener('click', () => {
    document.getElementById('popup-overlay').style.display = 'none';
    document.getElementById('popup-container').style.display = 'none';
});