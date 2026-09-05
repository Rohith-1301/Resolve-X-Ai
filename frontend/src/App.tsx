import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { Queue } from './pages/Queue';
import { TicketWorkspace } from './pages/TicketWorkspace';
import { CustomersList } from './pages/CustomersList';
import { Customer360 } from './pages/Customer360';
import { Knowledge } from './pages/Knowledge';
import { Proactive } from './pages/Proactive';
import { Predictive } from './pages/Predictive';
import { Team } from './pages/Team';
import { SpecialistDesk } from './pages/SpecialistDesk';
import { QualityCompliance } from './pages/QualityCompliance';
import { Settings } from './pages/Settings';

const LandingRouteWrapper: React.FC = () => {
  const navigate = useNavigate();
  const handleEnterApp = (scenario?: string) => {
    if (scenario === 'billing') {
      navigate('/tickets/TKT-1042');
    } else if (scenario === 'missing') {
      navigate('/tickets/TKT-1043');
    } else if (scenario === 'escalation') {
      navigate('/tickets/TKT-1044');
    } else {
      navigate('/');
    }
  };
  return <LandingPage onEnterApp={handleEnterApp} />;
};

export const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Standalone SaaS Landing Page */}
        <Route path="/landing" element={<LandingRouteWrapper />} />

        {/* Main Enterprise Operations Dashboard with Navbar & Sidebar */}
        <Route
          path="/*"
          element={
            <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white">
              <Navbar />
              <div className="flex-1 flex overflow-hidden">
                <Sidebar />
                <main className="flex-1 flex flex-col overflow-hidden">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/queue" element={<Queue />} />
                    <Route path="/tickets/:id" element={<TicketWorkspace />} />
                    <Route path="/tickets" element={<Navigate to="/tickets/TKT-1042" replace />} />
                    <Route path="/customers" element={<CustomersList />} />
                    <Route path="/customers/:id" element={<Customer360 />} />
                    <Route path="/knowledge" element={<Knowledge />} />
                    <Route path="/analytics" element={<Dashboard />} />
                    <Route path="/predictive" element={<Predictive />} />
                    <Route path="/proactive" element={<Proactive />} />
                    <Route path="/specialist" element={<SpecialistDesk />} />
                    <Route path="/team" element={<SpecialistDesk />} />
                    <Route path="/quality" element={<QualityCompliance />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
