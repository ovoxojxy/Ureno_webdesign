import React, { useState } from "react";
import { db } from "../../../firebase";
import { collection, addDoc } from "firebase/firestore";

const ProductForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    overview: "",
    brand: "",
    image1: "",
    image2: "",
    image3: "",
    link: "/productDetail",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newProduct = {
      title: formData.title,
      price: formData.price,
      description: formData.description,
      overview: formData.overview,
      brand: formData.brand,
      image: [formData.image1, formData.image2, formData.image3],
      link: formData.link,
    };

    try {
      await addDoc(collection(db, "products"), newProduct);
      alert("Product added successfully");
      setFormData({
        title: "",
        price: "",
        description: "",
        overview: "",
        brand: "",
        image1: "",
        image2: "",
        image3: "",
        link: "/productDetail",
      });
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 600 }}>
      <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title" required />
      <input type="text" name="price" value={formData.price} onChange={handleChange} placeholder="Price" required />
      <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Short Description" required />
      <textarea name="overview" value={formData.overview} onChange={handleChange} placeholder="Overview (longer description)" />
      <input type="text" name="brand" value={formData.brand} onChange={handleChange} placeholder="Brand" />
      <input type="text" name="image1" value={formData.image1} onChange={handleChange} placeholder="Image URL 1" required />
      <input type="text" name="image2" value={formData.image2} onChange={handleChange} placeholder="Image URL 2" />
      <input type="text" name="image3" value={formData.image3} onChange={handleChange} placeholder="Image URL 3" />
      <button type="submit">Submit Product</button>
    </form>
  );
};

export default ProductForm;