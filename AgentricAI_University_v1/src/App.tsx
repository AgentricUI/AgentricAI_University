import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import AgentricAIErrorBoundary from './components/StealthErrorBoundary';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import UserInterface from './components/UserInterface';
import AgentMonitoringDashboard from './components/AgentMonitoringDashboard';
import Navigation from './components/Navigation';
import AgentStatus from './components/AgentStatus';

function App() {
  return (
    <AgentricAIErrorBoundary enableAgentAnalysis={true} userType="admin">
      <Router>
        <div className="min-h-screen bg-stealth-black overflow-hidden">
          {/* Background Pattern */}
          <div className="fixed inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, #00ffff 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }} />
          </div>
          
          {/* Navigation */}
          <Navigation />
          
          {/* Agent Status Bar */}
          <AgentStatus />
          
          {/* Main Content */}
          <motion.main 
            className="relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/admin/agent-monitor" element={<AgentMonitoringDashboard />} />
              <Route path="/user" element={
                <AgentricAIErrorBoundary enableAgentAnalysis={true} userType="child">
                  <UserInterface />
                </AgentricAIErrorBoundary>
              } />
            </Routes>
          </motion.main>
          
          {/* Ambient Lighting Effects */}
          <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-lime opacity-60" />
          <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-neon-lime via-neon-blue to-neon-cyan opacity-60" />
        </div>
      </Router>
    </AgentricAIErrorBoundary>
  );
}

export default App;