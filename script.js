document.addEventListener("DOMContentLoaded", () => {
    const APIKey = "85783acfd55f4c66b5a8202a02298cb7";
    const closeButtons = document.querySelectorAll(".close-btn");
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";

    closeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const newsItem = button.closest(".news-item");
            const newsCard = newsItem.querySelector(".news-card");
            animateCardOut(newsCard);
        });
    });

    function animateCardOut(card) {
        gsap.to(card, {
            y: 1000,
            opacity: 0,
            duration: 1,
            onComplete: () => fetchNews(card),
        });
    }

    function fetchNews(newsCard) {
        const category = newsCard.id.replace("-news", "");
        console.log(`Fetching news for category: ${category}`);

        fetch(`${proxyUrl}https://newsapi.org/v2/top-headlines?category=${category}&language=en&apiKey=${APIKey}`, {
            headers: {
                "Upgrade-Insecure-Requests": "1"
            }
        })
        .then((response) => {
            console.log(`Response status: ${response.status}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((json) => {
            console.log(`API response for ${category}:`, json);
            const newsContent = newsCard.querySelector(".news-content");
            if (json.articles && json.articles.length > 0) {
                const article = json.articles[Math.floor(Math.random() * json.articles.length)];
                newsContent.innerHTML = `
                    <h2>${article.title}</h2>
                    <p>${article.description}</p>
                    <a href="${article.url}" target="_blank">Read more</a>
                `;
            } else {
                newsContent.innerHTML = "No news available.";
            }
            animateCardIn(newsCard);
        })
        .catch((error) => {
            console.error("Error fetching news:", error);
            const newsContent = newsCard.querySelector(".news-content");
            newsContent.innerHTML = "Error fetching news.";
        });
    }

    function animateCardIn(card) {
        gsap.fromTo(card, {
            y: 1000,
            opacity: 0,
        }, {
            y: 0,
            opacity: 1,
            duration: 1,
        });
    }

    function hideBackground() {
        document.getElementById("body").style.background = "transparent";
    }

    window.hideBackground = hideBackground;

    document.querySelectorAll(".news-card").forEach((card) => {
        fetchNews(card);
    });
});
