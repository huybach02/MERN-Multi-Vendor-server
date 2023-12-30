function queryProducts(products, query) {
  let filteredProducts = [...products];

  function categoryQuery() {
    filteredProducts = query.category
      ? filteredProducts.filter((c) => c.category === query.category)
      : filteredProducts;
  }

  function ratingQuery() {
    filteredProducts = query.rating
      ? filteredProducts.filter(
          (c) =>
            parseInt(query.rating) <= c.rating &&
            c.rating < parseInt(query.rating) + 1
        )
      : filteredProducts;
  }

  function priceQuery() {
    filteredProducts = filteredProducts.filter(
      (p) => p.price >= query.lowPrice && p.price <= query.highPrice
    );
  }

  function searchQuery() {
    filteredProducts = query.searchValue
      ? filteredProducts.filter(
          (p) =>
            p.name.toUpperCase().indexOf(query.searchValue.toUpperCase()) > -1
        )
      : filteredProducts;
  }

  function sortByPrice() {
    if (query.sortPrice) {
      filteredProducts =
        query.sortPrice === "low-to-high"
          ? filteredProducts.sort((a, b) => a.price - b.price)
          : filteredProducts.sort((a, b) => b.price - a.price);
    }
  }

  function skip() {
    const pageNumber = parseInt(query.pageNumber);
    const skipPage = (pageNumber - 1) * query.parPage;

    filteredProducts = filteredProducts.slice(skipPage);
  }

  function limit() {
    const limitCount = Math.min(filteredProducts.length, query.parPage);
    filteredProducts = filteredProducts.slice(0, limitCount);
  }

  function getProducts() {
    return filteredProducts;
  }

  function countProducts() {
    return filteredProducts.length;
  }

  // Execute query functions
  categoryQuery();
  ratingQuery();
  priceQuery();
  searchQuery();
  sortByPrice();
  skip();
  limit();

  // Return an object with the desired methods
  return {
    getProducts,
    countProducts,
  };
}

module.exports = queryProducts;
