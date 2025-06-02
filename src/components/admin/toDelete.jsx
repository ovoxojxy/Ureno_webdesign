// import React, { useState } from "react";;
// import { getFirestore, collection, addDoc } from "firebase/firestore";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { useNavigate } from "react-router-dom"

// const ProductForm = () => {
//     const [title, setTitle] = useState("");
//     const [description, setDescription] = useState("");
//     const [price, setPrice] = useState("")
//     const [link, setLink] = useState("")
//     const [imageFile, setImageFile] = useState(null);
//     const navigate = useNavigate()

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             const storage = getStorage();
//             const imageRef = ref(storage, `products/${imageFile.name}`)
//             await uploadBytes(imageRef, imageFile)
//             const imageUrl = await getDownloadURL(imageRef);

//             const db = getFirestore();
//             await addDoc(collection(db, "products"), {
//                 title,
//                 description,
//                 price,
//                 link,
//                 image: imageUrl
//             });

//             navigate("/admin")
//         } catch (error) {
//             console.error("Error uploading product:", error)
//         }
//     }

//     return (
//         <div className="product-form">
//             <h2>Add New Product</h2>
//             <form onSubmit={handleSubmit}>
//                 <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required/>
//                 <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />
//                 <input type="text" placeholder="Link" value={link} onChange={e => setPrice(e.target.value)} required/>
//                 <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} required/>
//                 <button type="submit">Save Product</button>
//             </form>
//         </div>
//     )
// }

// export default ProductForm;