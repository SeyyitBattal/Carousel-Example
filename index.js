{
  /* 
index.html kodları:

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <script src="./index.js" defer></script>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div class="product-detail container"></div>
  </body>
</html> 
*/
}

(() => {
  const init = () => {
    const isProductPage = document.querySelector(".product-detail");
    if (isProductPage) {
      fetchProductData();
    }
  };

  const fetchProductData = () => {
    const localData = JSON.parse(localStorage.getItem("productData"));
    if (localData) {
      buildHTML(localData);
      buildCSS();
      setEvents();
    } else {
      const url =
        "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json";

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem("productData", JSON.stringify(data));
          buildHTML(data);
          buildCSS();
          setEvents();
        })
        .catch((error) => console.error("Error fetching product data:", error));
    }
  };

  const buildHTML = (products) => {
    const container = document.querySelector(".product-detail");
    const carouselContainer = document.createElement("div");
    carouselContainer.classList.add("carousel-container");

    const title = document.createElement("h2");
    title.textContent = "You Might Also Like";
    container.appendChild(title);

    products.forEach((product, index) => {
      const isLiked = localStorage.getItem(product.name) === "true";
      const heartClass = isLiked ? "liked" : "";

      const item = document.createElement("div");
      item.classList.add("item");
      if (index === 0) {
        item.classList.add("active");
      }
      item.innerHTML = `
          <a href="${product.url}" target="_blank">
            <div class="heart-icon ${heartClass}" data-product="${
        product.name
      }">
              ${getHeartSVG(isLiked)}
            </div>
            <img class="product-img" src="${product.img}" alt="${
        product.name
      }" />
          </a>
          <div class="product-info">
            <p>${product.name}</p>
            <p class="price">${product.price.toFixed(2)} TRY</p>
          </div>
        `;

      const heartIcon = item.querySelector(".heart-icon");
      heartIcon.addEventListener("click", (event) => {
        event.preventDefault();
        const productName = heartIcon.getAttribute("data-product");
        const isLiked = localStorage.getItem(productName) === "true";

        if (isLiked) {
          localStorage.setItem(productName, "false");
          heartIcon.classList.remove("liked");
        } else {
          localStorage.setItem(productName, "true");
          heartIcon.classList.add("liked");
        }
        heartIcon.classList.toggle("clicked");
      });
      carouselContainer.appendChild(item);
    });

    container.appendChild(carouselContainer);

    const buttonContainer = document.createElement("div");
    buttonContainer.id = "buttonContainer";

    const prevButton = document.createElement("button");
    prevButton.id = "prevBtn";
    prevButton.innerHTML = "&#9665;";

    const nextButton = document.createElement("button");
    nextButton.id = "nextBtn";
    nextButton.innerHTML = "&#9655;";

    buttonContainer.appendChild(prevButton);
    buttonContainer.appendChild(nextButton);

    container.appendChild(buttonContainer);
  };

  const buildCSS = () => {
    const css = `
        .product-detail {
            width: 100%;
            overflow: hidden;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.9);
            margin: 3rem;
            max-width: 95%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center; 
        }
        .container {
          background-color: white;
          display: flex;
          flex: 1;
          flex-direction: column;
          align-items: center;
          justify-content: center; 
        }
        .each-product {
          max-width: 13rem;
          margin: 3px;
        }
        .product-img {
          height: 16rem;
          width: 13rem;
        }
        .product-info {
          text-align: left;
        }
        .price {
          color: blue;
          font-weight: bold;
        }
        .carousel-container {
          display: flex;
          transition: transform 0.5s ease;
          width: 100%;
          box-sizing: border-box;
        }
        .item {
          flex: 0 0 100%; 
          box-sizing: border-box;
          padding: 0 15px;
          text-align: center;
          max-width: 15rem;
        }
        #buttonContainer {
          display: flex;
          justify-content: center;
        }
        #prevBtn,
        #nextBtn {
          background-color: #3498db;
          color: #fff;
          border: none;
          padding: 10px 15px;
          font-size: 18px;
          cursor: pointer;
          transition: background-color 0.3s, transform 0.3s;
          border-radius: 5px;
          margin: 10px;
        }
        #prevBtn:hover,
        #nextBtn:hover {
          background-color: #2980b9;
          transform: scale(1.05);
        }
        .heart-icon {
          position: relative;
          width: 30px; 
          height: 30px; 
        }
        .heart-icon .heart {
          position: absolute;
          top: 3rem;
          left: 12rem;
          transform: translate(-100%, -50%);
          width: 75%;
          height: 75%;
          stroke: gray;
          stroke-width: 1;
          stroke-linecap: round;
          stroke-linejoin: round;
          fill: transparent;
          cursor: pointer; 
        }
        .heart-icon.clicked .heart {
          fill: blue; 
        }
        body {
          font-family: "Lucida Sans Unicode", "Lucida Grande", sans-serif;
        }
        
        @media (min-width: 576px) {
            .item {
              flex: 0 0 50%;
            }
          }          
        @media (max-width: 768px) {
          .item {
            flex: 0 0 100%;
          }
        }
        @media (min-width: 992px) {
            .item {
              flex: 0 0 33.33%;
            }
          }
      `;
    const styleElement = document.createElement("style");
    styleElement.textContent = css;
    document.head.appendChild(styleElement);
  };

  const setEvents = () => {
    let currentIndex = 0;
    const container = document.querySelector(".carousel-container");
    const items = document.querySelectorAll(".item");
    const totalItems = items.length;

    const updateCarousel = () => {
      container.style.transform = `translateX(-${
        currentIndex * (165 / totalItems)
      }%)`;
    };

    document.body.addEventListener("click", (event) => {
      const targetId = event.target.id;
      event.stopPropagation();

      if (targetId === "nextBtn") {
        if (currentIndex < totalItems - 1) {
          currentIndex += 1;
          updateCarousel();
        }
      } else if (targetId === "prevBtn") {
        if (currentIndex > 0) {
          currentIndex -= 1;
          updateCarousel();
        }
      } else if (event.target.classList.contains("heart-icon")) {
        event.preventDefault();
        const heartIcon = event.target;
        const productName = heartIcon.getAttribute("data-product");
        const isLiked = localStorage.getItem(productName) === "true";

        if (isLiked) {
          localStorage.setItem(productName, "false");
          heartIcon.classList.remove("liked");
        } else {
          localStorage.setItem(productName, "true");
          heartIcon.classList.add("liked");
        }
        heartIcon.classList.toggle("clicked");
      }
    });
  };

  const getHeartSVG = (isLiked) => {
    const fillColor = isLiked ? "blue" : "transparent";
    return `
        <svg class="heart" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${fillColor}" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C15.09 3.81 16.76 3 18.5 3 21.58 3 24 5.42 24 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      `;
  };

  init();
})();
