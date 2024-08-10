document.getElementById('show-cats-popup').addEventListener('click', () => {
    document.getElementById('popup-overlay').style.display = 'block';
    document.getElementById('cats-popup-container').style.display = 'block';
});

document.getElementById('cats-popup-close').addEventListener('click', () => {
    document.getElementById('popup-overlay').style.display = 'none';
    document.getElementById('cats-popup-container').style.display = 'none';
});

document.getElementById('popup-overlay').addEventListener('click', () => {
    document.getElementById('popup-overlay').style.display = 'none';
    document.getElementById('cats-popup-container').style.display = 'none';
});