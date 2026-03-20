// import Dashboard from "./components/Dashboard";

// function App() {
//   return (
    
//       <Dashboard />

//   );
// }

// export default App;
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import MeasurePatients from "./components/MeasurePatients";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/measure/:id" element={<MeasurePatients />} />
      </Routes>
    </Router>
  );
}

export default App;