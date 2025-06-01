import { useState, useEffect } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useAuth } from "../../contexts/authContext";
import { useNavigate } from "react-router-dom";
import ProjectTypeSelector from "../../components/createProject/projectTypeSelector";
import SurfaceAreaForm from "../../components/createProject/surfaceAreaForm";
import MaterialPicker from "../../components/createProject/materialPicker";
import PaintPicker from "../../components/createProject/PaintPicker";
import EstimateSidebar from "../../components/createProject/estimateSidebar";
import Calendar from "../../components/ui/Calendar";

export default function CreateProject() {
  const [step, setStep] = useState(1);
  const [projectType, setProjectType] = useState(null);
  const [squareFeet, setSquareFeet] = useState(0);
  const [roomDimensions, setRoomDimensions] = useState({ length: 0, width: 0 });
  const [selectedPaint, setSelectedPaint] = useState(null);
  const [selectedFlooring, setSelectedFlooring] = useState(null);
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("creatingProject", "true")
  }, [])

  const isServiceSelectionComplete = () => {
    if (projectType === "flooring") return selectedFlooring;
    if (projectType === "painting") return selectedPaint;
    if (projectType === "both") return selectedFlooring && selectedPaint;
    return false;
  };

  const handleNextStep = () => {
    if (step === 1 && isServiceSelectionComplete()) {
      setStep(2);
    } else if (step === 2 && selectedDateRange) {
      setStep(3);
    }
  };

  const handleCreateProject = async () => {
    if (!currentUser || !projectName.trim()) return;

    setLoading(true);

    try {
      const projectRef = collection(db, "projects");
      
      // Calculate total price
      const flooringPrice = selectedFlooring ? (selectedFlooring.price * squareFeet) : 0;
      const paintPrice = selectedPaint ? selectedPaint.price || 0 : 0;
      const totalPrice = flooringPrice + paintPrice;

      await addDoc(projectRef, {
        ownerId: currentUser.uid,
        title: projectName,
        description: projectDescription,
        projectType,
        squareFeet: Number(squareFeet),
        roomDimensions: {
          length: Number(roomDimensions.length),
          width: Number(roomDimensions.width)
        },
        flooringOption: selectedFlooring,
        paintOption: selectedPaint,
        timeline: {
          startDate: selectedDateRange?.from,
          endDate: selectedDateRange?.to
        },
        pricing: {
          flooringPrice,
          paintPrice,
          totalPrice
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: "submitted"
      });

      setShowSuccess(true);
      localStorage.removeItem("creatingProject");
      
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/projects");
      }, 1500);

    } catch (error) {
      console.error("Error creating project: ", error);
      alert("Error creating project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {step === 1 && (
        <>
          <ProjectTypeSelector value={projectType} onChange={setProjectType} />

          {(projectType === "flooring" || projectType === "both") && (
            <>
              <SurfaceAreaForm onChange={(data) => {
            setSquareFeet(data.squareFeet);
            setRoomDimensions(data.dimensions);
          }} />
              <MaterialPicker onSelect={setSelectedFlooring} />
            </>
          )}

          {(projectType === "painting" || projectType === "both") && (
            <PaintPicker onSelect={setSelectedPaint} />
          )}

          {isServiceSelectionComplete() && (
            <div className="mt-6">
              <button
                onClick={handleNextStep}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Next: Select Project Timeline
              </button>
            </div>
          )}
        </>
      )}

      {step === 2 && (
        <div>
          <div className="mb-6">
            <button
              onClick={() => setStep(1)}
              className="text-blue-600 hover:text-blue-800 mb-4"
            >
              ← Back to Service Selection
            </button>
            <h2 className="text-2xl font-bold mb-4">Select Project Timeline</h2>
            <p className="text-gray-600 mb-6">
              Choose your preferred date range for project completion
            </p>
          </div>
          
          <Calendar onDateRangeSelect={setSelectedDateRange} />
          
          {selectedDateRange && (
            <div className="mt-6">
              <button
                onClick={handleNextStep}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Next: Project Details
              </button>
            </div>
          )}
        </div>
      )}

      {step === 3 && (
        <div>
          <div className="mb-6">
            <button
              onClick={() => setStep(2)}
              className="text-blue-600 hover:text-blue-800 mb-4"
            >
              ← Back to Timeline Selection
            </button>
            <h2 className="text-2xl font-bold mb-4">Project Details</h2>
            <p className="text-gray-600 mb-6">
              Add a name and description for your project
            </p>
          </div>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
                Project Name *
              </label>
              <input
                type="text"
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter a name for your project"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 mb-2">
                Project Description (Optional)
              </label>
              <textarea
                id="projectDescription"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Describe your project goals, specific requirements, or any additional details"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Project Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Project Summary</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Project Type:</span> {projectType}</p>
                {squareFeet > 0 && <p><span className="font-medium">Square Footage:</span> {squareFeet} sq ft</p>}
                {(roomDimensions.length > 0 || roomDimensions.width > 0) && (
                  <p><span className="font-medium">Room Dimensions:</span> {roomDimensions.length}' x {roomDimensions.width}'</p>
                )}
                {selectedFlooring && (
                  <p><span className="font-medium">Flooring:</span> {selectedFlooring.title}</p>
                )}
                {selectedPaint && (
                  <p><span className="font-medium">Paint:</span> {selectedPaint.name || selectedPaint.title}</p>
                )}
                {selectedDateRange && (
                  <p><span className="font-medium">Timeline:</span> {selectedDateRange.from?.toLocaleDateString()} - {selectedDateRange.to?.toLocaleDateString()}</p>
                )}
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={handleCreateProject}
                disabled={!projectName.trim() || loading}
                className={`w-full py-3 px-6 rounded-md font-medium text-white transition-colors ${
                  projectName.trim() && !loading
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                {loading ? "Creating Project..." : "Create Project"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg z-50">
          Project created successfully!
        </div>
      )}

      <EstimateSidebar
        sqft={squareFeet}
        flooring={projectType !== "painting" ? selectedFlooring : null}
        paint={projectType !== "flooring" ? selectedPaint : null}
      />
    </div>
  );
}
