import React, { useEffect, useState } from "react"
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore"
import { useNavigate } from "react-router-dom"

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            const db = getFirestore();
            const snapshot = await getDocs(collection(db, "products"));
            const productList = snapshotEqual.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            setProducts(productList);
        }

        fetchProducts();
    }, [])

    const handleDelete = async (id) => {
        const db = getFirestore();
        await deleteDoc(doc(db, "products", id))
        setProducts(products.filter(product => product.id !== id))
    }

    return (
        <div className="admin-dashboard">
            <h1>Product Admin Dashboard</h1>
            <button onClick={() => navigate("/admin/add")}>Add New Product</button>
            <ul>
                {products.map(product => (
                    <li key={product.id} style={{ marginBottom: "1rem"}}>
                        <strong>{product.title}</strong> - {product.price}
                        <br />
                        <button onClick={() => navigate(`/admin/edit/${product.id}`)}>Edit</button>
                        <button onClick={() => handleDelete(product.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default AdminDashboard