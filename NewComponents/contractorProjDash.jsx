// import React, { useState, useEffect, useRef } from 'react';
// import { collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
// import { db } from "../src/firebase/firebaseConfig";
// import { useUser } from "../src/contexts/authContext/UserContext";
// import styles from './projectdash.module.css';
// import defaultProfile from "../src/assets/images/profile-svgrepo-com.png"

// const ProjectDashboard = () => {
//   const { profile, user } = useUser();
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         if (!profile || !user || profile.role !== "contractor") {
//           setLoading(false);
//           return;
//         }

//         console.log("Fetching projects for contractor:", user.uid);

//         // Fetch submitted, inquiry, in progress (for this contractor), and pending_approval projects
//         const submittedQuery = query(
//           collection(db, "projects"),
//           where("status", "==", "submitted")
//         );

//         const inquiryQuery = query(
//           collection(db, "projects"),
//           where("status", "==", "inquiry")
//         );

//         const inProgressQuery = query(
//           collection(db, "projects"),
//           where("status", "==", "in progress"),
//           where("contractorId", "==", user.uid)
//         );

//         const pendingApprovalQuery = query(
//           collection(db, "projects"),
//           where("status", "==", "pending_approval"),
//           where("requestedBy", "array-contains", user.uid)
//         );

//         const [submittedSnapshot, inquirySnapshot, inProgressSnapshot, pendingApprovalSnapshot] = await Promise.all([
//           getDocs(submittedQuery),
//           getDocs(inquiryQuery),
//           getDocs(inProgressQuery),
//           getDocs(pendingApprovalQuery)
//         ]);

//         const submittedResults = submittedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         const inquiryResults = inquirySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         const inProgressResults = inProgressSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         const pendingApprovalResults = pendingApprovalSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

//         const results = [...submittedResults, ...inquiryResults, ...inProgressResults, ...pendingApprovalResults];
//         setProjects(results);
//       } catch (error) {
//         console.error("Error fetching projects:", error.message);
//         setProjects([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProjects();
//   }, [profile, user]);

//   // Helper function to get status display info
//   const getStatusInfo = (project) => {
//     const statusMap = {
//       'submitted': { text: 'New Project', class: 'status-blue', isDanger: false },
//       'inquiry': { text: 'Inquiry Made', class: 'status-orange', isDanger: false },
//       'in progress': { text: 'In Progress', class: 'status-green', isDanger: false },
//       'pending_approval': { text: 'Pending Approval', class: 'status-orange', isDanger: false },
//       'completed': { text: 'Completed', class: 'status-green', isDanger: false },
//       'cancelled': { text: 'Cancelled', class: 'status-red', isDanger: true }
//     };
//     return statusMap[project.status] || { text: project.status, class: 'status-blue', isDanger: false };
//   };

//   // Helper function to format date
//   const formatDate = (timestamp) => {
//     if (!timestamp) return 'No date set';
//     const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
//     return date.toLocaleDateString('en-US', { 
//       month: 'short', 
//       day: 'numeric', 
//       year: '2-digit' 
//     });
//   };

//   // Helper function to calculate budget/price
//   const calculateBudget = (project) => {
//     if (project.pricing?.totalPrice) {
//       return `$${project.pricing.totalPrice.toLocaleString()}`;
//     }
//     if (project.flooringOption?.price && project.squareFeet) {
//       return `$${(project.flooringOption.price * project.squareFeet).toLocaleString()}`;
//     }
//     return 'Quote pending';
//   };

//   if (loading) return <div className="max-w-6xl mx-auto p-4">Loading projects...</div>;

//   const handleActionChange = async (projectId, action) => {
//     if (action !== 'Actions') {
//       console.log(`Action "${action}" selected for project ${projectId}`);
      
//       try {
//         const projectRef = doc(db, "projects", projectId);
        
//         switch (action) {
//           case 'Start project':
//             await updateDoc(projectRef, {
//               status: "in progress",
//               contractorId: user.uid,
//               updatedAt: new Date()
//             });
//             break;
//           case 'Send for QA':
//             await updateDoc(projectRef, {
//               status: "under review",
//               updatedAt: new Date()
//             });
//             break;
//           case 'Send invoice':
//             await updateDoc(projectRef, {
//               status: "pending payment",
//               updatedAt: new Date()
//             });
//             break;
//           case 'Complete project':
//             await updateDoc(projectRef, {
//               status: "completed",
//               updatedAt: new Date()
//             });
//             break;
//           default:
//             break;
//         }
        
//         // Refresh projects after action
//         const updatedProjects = projects.map(project => {
//           if (project.id === projectId) {
//             return { 
//               ...project, 
//               status: action === 'Start project' ? 'in progress' : 
//                      action === 'Send for QA' ? 'under review' :
//                      action === 'Send invoice' ? 'pending payment' :
//                      action === 'Complete project' ? 'completed' : project.status,
//               contractorId: action === 'Start project' ? user.uid : project.contractorId
//             };
//           }
//           return project;
//         });
//         setProjects(updatedProjects);
        
//       } catch (error) {
//         console.error("Error updating project:", error);
//         alert("Error updating project. Please try again.");
//       }
//     }
//   };

//   const ActionDropdown = ({ projectId, projectStatus, onActionChange }) => {
//     const [selectedAction, setSelectedAction] = useState('Actions');

//     const handleChange = (e) => {
//       const value = e.target.value;
//       setSelectedAction(value);
//       onActionChange(projectId, value);
      
//       // Reset to default after action
//       setTimeout(() => setSelectedAction('Actions'), 100);
//     };

//     // Get available actions based on project status
//     const getAvailableActions = () => {
//       switch (projectStatus) {
//         case 'submitted':
//         case 'inquiry':
//           return ['Start project'];
//         case 'in progress':
//           return ['Send for QA', 'Complete project'];
//         case 'under review':
//           return ['Send invoice', 'Complete project'];
//         case 'pending payment':
//           return ['Complete project'];
//         default:
//           return [];
//       }
//     };

//     const availableActions = getAvailableActions();

//     if (availableActions.length === 0) {
//       return <span className={styles['no-actions-text']}>No actions available</span>;
//     }

//     return (
//       <form onSubmit={(e) => e.preventDefault()}>
//         <select 
//           className="border border-gray-300 rounded-md px-3 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           value={selectedAction}
//           onChange={handleChange}
//         >
//           <option>Actions</option>
//           {availableActions.map(action => (
//             <option key={action} value={action}>{action}</option>
//           ))}
//         </select>
//       </form>
//     );
//   };

//   return (
//     <div className="w-full">
//       <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
//         <div className="border-b border-gray-200 p-4">
//           <div className="flex items-center justify-between">
//             <span className="text-sm text-gray-500">{projects.length} Projects</span>
//           </div>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timeline</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner + Details</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                   <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {projects.length === 0 ? (
//                   <tr>
//                     <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
//                       No projects available at the moment
//                     </td>
//                   </tr>
//                 ) : (
//                   projects.map((project) => {
//                     const statusInfo = getStatusInfo(project);
//                     return (
//                       <tr key={project.id} className={`hover:bg-gray-50 ${statusInfo.isDanger ? 'bg-red-50' : ''}`}>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-medium text-gray-900">{project.title}</div>
//                           <div className="text-sm text-gray-500">{project.description || 'No description'}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-900">Created: {formatDate(project.createdAt)}</div>
//                           <div className="text-sm text-gray-500">
//                             {project.timeline?.startDate ? 
//                               `Start: ${formatDate(project.timeline.startDate)}` : 
//                               'No timeline set'
//                             }
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className="flex-shrink-0 h-10 w-10">
//                               <img
//                                 className="h-10 w-10 rounded-full"
//                                 src={profile?.photoURL || defaultProfile}
//                                 alt="Project Owner"
//                               />
//                             </div>
//                             <div className="ml-4">
//                               <div className="text-sm font-medium text-gray-900">Project Owner</div>
//                               <div className="text-sm text-gray-500">
//                                 {project.projectType && `Type: ${project.projectType}`}
//                                 {project.squareFeet && ` • ${project.squareFeet} sq ft`}
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-medium text-gray-900">{calculateBudget(project)}</div>
//                           <div className="text-sm text-gray-500">
//                             {project.flooringOption ? project.flooringOption.title : 
//                              project.paintOption ? project.paintOption.name || project.paintOption.title :
//                              'Materials TBD'}
//                           </div>
//                         </td>
//                             <td className={styles.status}>
//                               <span className={`${styles['status-text']} ${styles[statusInfo.class]}`}>
//                                 {statusInfo.text}
//                               </span>
//                             </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                           <ActionDropdown 
//                             projectId={project.id}
//                             projectStatus={project.status}
//                             onActionChange={handleActionChange}
//                           />
//                         </td>
//                           </tr>
//                         );
//                       })
//                     )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//   );
// };

// export default ProjectDashboard;