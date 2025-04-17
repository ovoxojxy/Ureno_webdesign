import { useUser } from "@/contexts/authContext/UserContext";
import { useState, useEffect } from 'react';
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/footer";
import ProfileNav from "@/components/profileNav";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { getAuth, updateProfile, updateEmail } from "firebase/auth";
import '../styles/FlooringProduct.css'


export default function EditProfile() {
    const { user, profile } = useUser();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        displayName: "",
        email: "",
        phone: "",
        profilePicture: null,
    })

    useEffect(() => {
        if (profile) {
            setFormData({
                displayName: user.displayName || "",
                email: user.email || "",
                phone: profile.phone || "",
                profilePicture: null,
            })
        }
    }, [profile, user]);

    if (!user || !profile) return <p>Loading profile data...</p>

    const handleSubmit = async (e) => {
        e.preventDefault();
        const auth = getAuth();
        const db = getFirestore();
        const storage = getStorage();

        const currentUser = auth.currentUser;
        if (!currentUser) return;

        const updates = {};
        const firestoreUpdates = {};

        try {
            if (formData.displayName && formData.displayName !== currentUser.displayName) {
                await updateProfile(currentUser, { displayName: formData.displayName })
                firestoreUpdates.displayName = formData.displayName
            }

            if (formData.email && formData.email !== currentUser.email) {
                await updateEmail(currentUser, formData.email)
                firestoreUpdates.email = formData.email;
            }

            if (formData.phone) {
                firestoreUpdates.phone = formData.phone
            }

            if (formData.profilePicture) {
                const storageRef = ref(storage, `profilePictures/${currentUser.uid}`)
                await uploadBytes(storageRef, formData.profilePicture)
                const photoURL = await getDownloadURL(storageRef)

                await updateProfile(currentUser, { photoURL })
                firestoreUpdates.photoURL = photoURL
                }

                if (Object.keys(firestoreUpdates).length > 0) {
                    const userDocRef = doc(db, "users", currentUser.uid)
                    await updateDoc(userDocRef, firestoreUpdates)
                }

                alert("profile updated succesfully")
                navigate("/ProfileDashboard")
            } catch (error){
                console.error("Error updating profile:", error);
                alert("Failed to update profile. Check the console for details.")
        }
    }

    return (
        <>
           <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4"> Edit Profile</h2>
            <Form>
                <Form.Group controlId="displayName" className="mb-3">
                    <Form.Label>Display Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.displayName}
                            onChange={(e) =>
                                setFormData({ ...formData, displayName: e.target.value })
                        }
                    />
                </Form.Group>

                <Form.Group controlId="email" className="mb-3">
                    <Form.Label>email</Form.Label>
                    <Form.Control
                        type="email"
                        value={formData.email}
                            onChange={(e) => 
                                setFormData({ ...formData, email: e.target.value })
                            }
                        />
                </Form.Group>

                <Form.Group controlId="phone" className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                        type="text"
                        value={formData.phone}
                        onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                    }
                    />
                </Form.Group>

                <Form.Group controlId="profilePicture" className="mb-3">
                    <Form.Label>Profile Picture</Form.Label>
                    <Form.Control
                        type="file"
                        onChange={(e) =>
                        setFormData({ ...formData, profilePicture: e.target.files[0] })
                    }
                    />
                </Form.Group>

                <div className="flex gap-4">
                    <Button variant="primary" onClick={(handleSubmit)} type="submit">Save Changes</Button>
                    <Button variant="secondary" onClick={() => navigate("/ProfileDashboard")}>
                        Cancel
                    </Button>
                </div>
            </Form>
           </div>
        </>
    )
}