document.addEventListener("DOMContentLoaded", () => {
  const productsContainer = document.getElementById("products-container");
  const searchInput = document.querySelector(".search-input");
  const categoryLinks = document.querySelectorAll(".category-link");

  let allProducts = [];
  let currentCategory = "all";

  // Fetch products
  async function fetchProducts() {
    try {
      productsContainer.innerHTML = '<div class="loader"><i class="fas fa-spinner"></i></div>';
      const res = await fetch("https://fakestoreapi.com/products");
      allProducts = await res.json();
      displayProducts(allProducts);
    } catch {
      showMessage("Failed to load products", "fa-exclamation-triangle");
    }
  }

  // Display products
  function displayProducts(products) {
    if (!products.length) return showMessage("No products found", "fa-search");

    productsContainer.innerHTML = products
      .map(
        p => `
        <div class="product-card">
          <img src="${p.image}" alt="${p.title}" class="product-image">
          <div class="product-info">
            <h3 class="product-title">${p.title}</h3>
            <div class="product-price">$${p.price}</div>
            <div class="product-rating"><i class="fas fa-star"></i> ${p.rating.rate}</div>
          </div>
        </div>`
      )
      .join("");
  }

  // Show message (error / empty)
  function showMessage(text, icon) {
    productsContainer.innerHTML = `
      <div class="no-results">
        <i class="fas ${icon}"></i>
        <h3>${text}</h3>
      </div>`;
  }

  // Filter logic
  function filterProducts() {
    let filtered = allProducts;
    const query = searchInput.value.toLowerCase();

    if (currentCategory !== "all")
      filtered = filtered.filter(p => p.category === currentCategory);

    if (query)
      filtered = filtered.filter(
        p =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );

    displayProducts(filtered);
  }

  // Event Listeners
  categoryLinks.forEach(link =>
    link.addEventListener("click", e => {
      e.preventDefault();
      categoryLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
      currentCategory = link.dataset.category;
      filterProducts();
    })
  );

  searchInput.addEventListener("input", filterProducts);

  fetchProducts();
});
