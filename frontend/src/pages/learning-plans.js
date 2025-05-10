import React, { useState } from 'react';
import LearningPlanForm from '../components/plan/LearningPlanForm';
import LearningPlanList from '../components/plan/LearningPlanList';
// Assuming you have a Layout component for consistent structure
// import Layout from '../components/common/Layout'; 

const LearningPlansPage = () => {
  // State to potentially refresh the list after a new plan is created
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePlanCreated = (newPlan) => {
    console.log('New plan created:', newPlan);
    // Increment key to trigger re-fetch in LearningPlanList
  
  
    setRefreshKey(prevKey => prevKey + 1);
  };

  return (
    // <Layout> {/* Wrap with your Layout component if you have one */} 
      <div className="container mx-auto px-4 py-8">
     
        
        {/* Form to create a new learning plan */}
        <div className="mb-12">
          <LearningPlanForm onPlanCreated={handlePlanCreated} />
        </div>

        {/* Pass the refreshKey to trigger refetch in LearningPlanList */}
        <LearningPlanList refreshTrigger={refreshKey} fetchPublic={false} /> 

        {/* Optionally, display public plans as well */}
        {/* <div className="mt-12">
          <LearningPlanList fetchPublic={true} />
        </div> */}
      </div>
    // </Layout>
  );
};

export default LearningPlansPage;