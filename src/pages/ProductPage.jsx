import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AiOutlineLeft } from "react-icons/ai";
import ProductsList from "../components/ProductsList";
import "../styling/ProductPage.css";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { cart, setCart, addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
  fetch(`https://dummyjson.com/products/${id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load product");
      }
      return response.json();
    })
    .then((product) =>
      setProduct({
        id: product.id,
        title: product.title,
        price: product.price,
        description: product.description,
        category: product.category,
        image: product.thumbnail,
      })
    )
    .catch((error) => console.error("Error fetching data:", error));
}, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const handleBuyClick = () => {
    if (cart.find((p) => p.id === product.id) === undefined) {
      product.itemCount = 1;
      addToCart(product);
    } else {
      let cartCopy = cart;
      cartCopy[cartCopy.findIndex((p) => p.id === product.id)].itemCount++;
      setCart(cartCopy);
    }
    navigate("/cart");
  };

  return (
    <>
      <div className="product-container">
        <div className="back-to-homePage-navigation">
          <div
            className="back-to-homePage-button"
            onClick={() => navigate("/")}
          >
            <AiOutlineLeft size={24} />
            <span className="back-to-home-page-text">Home</span>
          </div>
        </div>
        <div className="product-content">
          <img
            className="product-image"
            src={product.image}
            alt={product.title}
          />
          <div className="product-details">
            <p className="product-title">{product.title}</p>
            <p className="product-price">{product.price} SEK</p>
            <p className="product-description">{product.description}</p>

            <button className="product-button" onClick={handleBuyClick}>
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductPage;
