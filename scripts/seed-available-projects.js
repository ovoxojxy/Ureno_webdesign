// Script to seed the availableProjects collection
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize the app
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Sample projects data
const projects = [
  {
    title: 'Kitchen Flooring Installation',
    description: 'Need help installing new flooring in a modern kitchen, approximately 200 sq ft.',
    status: 'submitted',
    flooringOption: {
      title: 'Luxury Vinyl Plank',
      imageUrl: '/assets/images/luxury.png'
    },
    roomDimensions: {
      length: 20,
      width: 10
    },
    ownerId: 'OWNER_USER_ID', // Replace with actual user ID
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    title: 'Living Room Flooring Replacement',
    description: 'Looking for a contractor to replace old carpet with hardwood in our living room.',
    status: 'submitted',
    flooringOption: {
      title: 'Harvest Grove Rigid',
      imageUrl: '/assets/images/harvest.png'
    },
    roomDimensions: {
      length: 15,
      width: 12
    },
    ownerId: 'OWNER_USER_ID', // Replace with actual user ID
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  }
];

// Add projects to the availableProjects collection
async function seedProjects() {
  try {
    for (const project of projects) {
      await db.collection('availableProjects').add(project);
      console.log(`Added project: ${project.title}`);
    }
    console.log('All projects added successfully!');
  } catch (error) {
    console.error('Error adding projects:', error);
  }
}

seedProjects();
