import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styling/ProductsAPI.css";

function ProductsList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    localStorage.getItem("selectedCategory") || ""
  );
  const [currentPage, setCurrentPage] = useState(
    parseInt(localStorage.getItem("currentPage")) || 1
  );

  const productsPerPage = 4;
  const maxVisiblePages = 5;

  useEffect(() => {
    fetch("https://dummyjson.com/products?limit=0")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load products");
        }
        return res.json();
      })
      .then((json) => {
        const normalizedProducts = json.products.map((product) => ({
          id: product.id,
          title: product.title,
          price: product.price,
          description: product.description,
          category: product.category,
          image: product.thumbnail,
        }));

        setProducts(normalizedProducts);
        setCategories([
          ...new Set(normalizedProducts.map((product) => product.category)),
        ]);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    localStorage.setItem("selectedCategory", category);
    setCurrentPage(1);
    localStorage.setItem("currentPage", 1);
  };

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const changePage = (page) => {
    setCurrentPage(page);
    localStorage.setItem("currentPage", page);
  };

  const renderPageNumbers = () => {
    const pages = [];

    let startPage = Math.max(
      1,
      currentPage - Math.floor(maxVisiblePages / 2)
    );
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (currentPage > 1) {
      pages.push(
        <button key="prev" onClick={() => changePage(currentPage - 1)}>
          Prev
        </button>
      );
    }

    if (startPage > 1) {
      pages.push(
        <button key={1} onClick={() => changePage(1)}>
          1
        </button>
      );

      if (startPage > 2) {
        pages.push(
          <span key="start-ellipsis" className="pagination-dots">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => changePage(i)}
          className={currentPage === i ? "active" : ""}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="end-ellipsis" className="pagination-dots">
            ...
          </span>
        );
      }

      pages.push(
        <button key={totalPages} onClick={() => changePage(totalPages)}>
          {totalPages}
        </button>
      );
    }

    if (currentPage < totalPages) {
      pages.push(
        <button key="next" onClick={() => changePage(currentPage + 1)}>
          Next
        </button>
      );
    }

    return pages;
  };

  return (
    <section className="API-section">
      <div className="APIproduct-filter">
        <div className="category-buttons">
          <button
            onClick={() => handleCategoryChange("")}
            className={selectedCategory === "" ? "active" : ""}
          >
            see all products
          </button>

          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={selectedCategory === category ? "active" : ""}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="APIproduct-list">
        {currentProducts.map((product) => (
          <div key={product.id} className="APIproduct-div">
            <Link to={`/product/${product.id}`}>
              <img src={product.image} alt={product.title} />
            </Link>
            <h3 className="APIproduct-h3">{product.title}</h3>
            <div className="APIproduct-btns">
              <p>
                <b>{product.price} SEK</b>
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">{renderPageNumbers()}</div>
    </section>
  );
}

export default ProductsList;