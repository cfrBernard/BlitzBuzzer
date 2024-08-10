document.addEventListener('DOMContentLoaded', () => {
    const categoriesContainer = document.getElementById('categories-container');
    const difficultyButtons = document.querySelectorAll('.difficulty-buttons button');
    const selectedCategoryInput = document.getElementById('selected-category');
    const selectedDifficultyInput = document.getElementById('selected-difficulty');

    function fetchCategories() {
        fetch('https://opentdb.com/api_category.php')
            .then(response => response.json())
            .then(data => {
                const categories = data.trivia_categories;
                categories.forEach(category => {
                    const categoryDiv = document.createElement('div');
                    categoryDiv.className = 'category-div';

                    const categoryName = category.name.replace(/^(Entertainment: |Science: )/, '');
                    categoryDiv.textContent = categoryName;
                    categoryDiv.setAttribute('data-category', category.id);
                    categoriesContainer.appendChild(categoryDiv);
                });

                document.querySelectorAll('.category-div, .all-categories-div').forEach(div => {
                    div.addEventListener('click', () => {
                        document.querySelectorAll('.category-div, .all-categories-div').forEach(d => {
                            d.classList.remove('active');
                            d.classList.add('inactive');
                        });
                        div.classList.remove('inactive');
                        div.classList.add('active');
                        selectedCategoryInput.value = div.getAttribute('data-category');
                    });
                });
            });
    }

    fetchCategories();

    const defaultDifficulty = 'facile';
    difficultyButtons.forEach(button => {
        button.addEventListener('click', () => {
            difficultyButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            selectedDifficultyInput.value = button.getAttribute('data-difficulty');
        });
    });

    const defaultDifficultyButton = Array.from(difficultyButtons).find(button => button.getAttribute('data-difficulty') === defaultDifficulty);
    if (defaultDifficultyButton) {
        defaultDifficultyButton.classList.add('active');
        selectedDifficultyInput.value = defaultDifficultyButton.getAttribute('data-difficulty');
    }

    document.getElementById('start-game').addEventListener('click', function() {
        const category = selectedCategoryInput.value;
        const difficulty = selectedDifficultyInput.value;

        let quizUrl = 'pages/game.html?';
        if (category) quizUrl += `category=${category}&`;
        if (difficulty) quizUrl += `difficulty=${difficulty}`;

        window.location.href = quizUrl;
    });
});