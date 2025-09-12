import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, 
  Brain, 
  Search, 
  Plus, 
  Eye, 
  Activity,
  Network,
  BookOpen,
  Zap,
  Filter,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';
import { agentricaiKnowledgeDB } from '../services/knowledgeDatabase';
import StealthPanel from './ui/StealthPanel';
import NeonButton from './ui/NeonButton';

const KnowledgeDatabasePanel: React.FC = () => {
  const [knowledgeStats, setKnowledgeStats] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [recentAccesses, setRecentAccesses] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [newKnowledge, setNewKnowledge] = useState({
    category: '',
    key: '',
    value: '',
    confidence: 1.0
  });

  useEffect(() => {
    loadKnowledgeStats();
    setupRealTimeUpdates();
  }, []);

  const loadKnowledgeStats = async () => {
    try {
      setLoading(true);
      const stats = await agentricaiKnowledgeDB.getKnowledgeStats();
      setKnowledgeStats(stats);
      setRecentAccesses(stats.recent_accesses || []);
    } catch (error) {
      console.error('Failed to load knowledge stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealTimeUpdates = () => {
    const handleKnowledgeUpdate = () => {
      loadKnowledgeStats();
    };

    window.addEventListener('agentricaiKnowledgeUpdate', handleKnowledgeUpdate);
    window.addEventListener('agentricaiMemoryUpdate', handleKnowledgeUpdate);

    return () => {
      window.removeEventListener('agentricaiKnowledgeUpdate', handleKnowledgeUpdate);
      window.removeEventListener('agentricaiMemoryUpdate', handleKnowledgeUpdate);
    };
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setLoading(true);
      const results = await agentricaiKnowledgeDB.queryKnowledge(searchQuery, 'admin-panel');
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddKnowledge = async () => {
    if (!newKnowledge.category || !newKnowledge.key || !newKnowledge.value) return;

    try {
      setLoading(true);
      let value = newKnowledge.value;
      
      // Try to parse as JSON if it looks like JSON
      if (value.startsWith('{') || value.startsWith('[')) {
        try {
          value = JSON.parse(value);
        } catch {
          // Keep as string if not valid JSON
        }
      }

      await agentricaiKnowledgeDB.storeKnowledge(
        newKnowledge.category,
        newKnowledge.key,
        value,
        'admin-panel',
        newKnowledge.confidence
      );

      setNewKnowledge({ category: '', key: '', value: '', confidence: 1.0 });
      await loadKnowledgeStats();
    } catch (error) {
      console.error('Failed to add knowledge:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Database },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'add', label: 'Add Knowledge', icon: Plus },
    { id: 'activity', label: 'Activity Log', icon: Activity }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Database className="w-8 h-8 text-neon-cyan mr-3" />
          <span className="bg-gradient-to-r from-neon-cyan to-neon-lime bg-clip-text text-transparent">
            AgentricAI
          </span>
          <span className="ml-2 text-neon-blue">Knowledge Database</span>
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={loadKnowledgeStats}
            className="p-2 text-stealth-light hover:text-neon-cyan transition-colors"
            disabled={loading}
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
              activeTab === tab.id
                ? 'bg-neon-cyan bg-opacity-20 text-neon-cyan border-2 border-neon-cyan'
                : 'bg-stealth-panel text-stealth-light hover:bg-stealth-panel-light border-2 border-transparent'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StealthPanel className="p-6 text-center border-2 border-neon-cyan">
                <BookOpen className="w-8 h-8 text-neon-cyan mx-auto mb-3" />
                <div className="text-2xl font-bold text-neon-cyan mb-1">
                  {knowledgeStats?.total_entries || 0}
                </div>
                <div className="text-stealth-light text-sm uppercase tracking-wider">
                  Knowledge Entries
                </div>
              </StealthPanel>

              <StealthPanel className="p-6 text-center border-2 border-neon-blue">
                <Network className="w-8 h-8 text-neon-blue mx-auto mb-3" />
                <div className="text-2xl font-bold text-neon-blue mb-1">
                  {knowledgeStats?.categories || 0}
                </div>
                <div className="text-stealth-light text-sm uppercase tracking-wider">
                  Categories
                </div>
              </StealthPanel>

              <StealthPanel className="p-6 text-center border-2 border-neon-lime">
                <Brain className="w-8 h-8 text-neon-lime mx-auto mb-3" />
                <div className="text-2xl font-bold text-neon-lime mb-1">
                  {knowledgeStats?.agent_memories || 0}
                </div>
                <div className="text-stealth-light text-sm uppercase tracking-wider">
                  Agent Memories
                </div>
              </StealthPanel>

              <StealthPanel className="p-6 text-center border-2 border-neon-orange">
                <Zap className="w-8 h-8 text-neon-orange mx-auto mb-3" />
                <div className="text-2xl font-bold text-neon-orange mb-1">
                  {knowledgeStats?.learning_patterns || 0}
                </div>
                <div className="text-stealth-light text-sm uppercase tracking-wider">
                  Learning Patterns
                </div>
              </StealthPanel>

              {/* Knowledge Graph Visualization */}
              <div className="md:col-span-2 lg:col-span-4">
                <StealthPanel className="p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                    <Network className="w-5 h-5 text-neon-cyan mr-2" />
                    Knowledge Network Status
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-neon-cyan mb-1">
                        {knowledgeStats?.knowledge_graph_nodes || 0}
                      </div>
                      <div className="text-stealth-light text-sm">Graph Nodes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-neon-lime mb-1">ACTIVE</div>
                      <div className="text-stealth-light text-sm">Network Status</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-neon-blue mb-1">OPTIMAL</div>
                      <div className="text-stealth-light text-sm">Performance</div>
                    </div>
                  </div>
                </StealthPanel>
              </div>
            </div>
          )}

          {activeTab === 'search' && (
            <div className="space-y-6">
              <StealthPanel className="p-6">
                <div className="flex space-x-4 mb-6">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search knowledge base..."
                      className="w-full px-4 py-3 bg-stealth-panel-light border border-stealth-border rounded-lg text-white placeholder-stealth-light focus:border-neon-cyan focus:outline-none"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  <NeonButton onClick={handleSearch} disabled={loading}>
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </NeonButton>
                </div>

                {searchResults.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-white font-medium">Search Results ({searchResults.length})</h4>
                    {searchResults.map((result, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-stealth-panel-light p-4 rounded-lg border border-stealth-border"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <span className="text-neon-cyan font-medium">{result.category}</span>
                            <span className="text-stealth-light mx-2">•</span>
                            <span className="text-white">{result.key}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-stealth-light">
                              Confidence: {(result.confidence_score * 100).toFixed(0)}%
                            </span>
                            <span className="text-xs text-stealth-light">
                              Accessed: {result.access_count || 0}x
                            </span>
                          </div>
                        </div>
                        <div className="text-stealth-light text-sm">
                          <pre className="whitespace-pre-wrap font-mono text-xs">
                            {JSON.stringify(result.value, null, 2)}
                          </pre>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </StealthPanel>
            </div>
          )}

          {activeTab === 'add' && (
            <StealthPanel className="p-6">
              <h3 className="text-lg font-bold text-white mb-6">Add New Knowledge</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stealth-light text-sm mb-2">Category</label>
                    <input
                      type="text"
                      value={newKnowledge.category}
                      onChange={(e) => setNewKnowledge({...newKnowledge, category: e.target.value})}
                      placeholder="e.g., neurodiverse_learning"
                      className="w-full px-4 py-3 bg-stealth-panel-light border border-stealth-border rounded-lg text-white placeholder-stealth-light focus:border-neon-cyan focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-stealth-light text-sm mb-2">Key</label>
                    <input
                      type="text"
                      value={newKnowledge.key}
                      onChange={(e) => setNewKnowledge({...newKnowledge, key: e.target.value})}
                      placeholder="e.g., sensory_preferences"
                      className="w-full px-4 py-3 bg-stealth-panel-light border border-stealth-border rounded-lg text-white placeholder-stealth-light focus:border-neon-cyan focus:outline-none"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-stealth-light text-sm mb-2">Value (JSON or text)</label>
                  <textarea
                    value={newKnowledge.value}
                    onChange={(e) => setNewKnowledge({...newKnowledge, value: e.target.value})}
                    placeholder='{"visual_complexity": "low", "animation_speed": "slow"}'
                    rows={6}
                    className="w-full px-4 py-3 bg-stealth-panel-light border border-stealth-border rounded-lg text-white placeholder-stealth-light focus:border-neon-cyan focus:outline-none font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-stealth-light text-sm mb-2">
                    Confidence Score: {newKnowledge.confidence}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={newKnowledge.confidence}
                    onChange={(e) => setNewKnowledge({...newKnowledge, confidence: parseFloat(e.target.value)})}
                    className="w-full"
                  />
                </div>

                <NeonButton onClick={handleAddKnowledge} disabled={loading} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Knowledge Entry
                </NeonButton>
              </div>
            </StealthPanel>
          )}

          {activeTab === 'activity' && (
            <StealthPanel className="p-6">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                <Activity className="w-5 h-5 text-neon-blue mr-2" />
                Recent Knowledge Access Activity
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recentAccesses.map((access, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 bg-stealth-panel-light rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        access.access_type === 'store' ? 'bg-neon-lime' :
                        access.access_type === 'retrieve' ? 'bg-neon-cyan' :
                        access.access_type === 'query' ? 'bg-neon-blue' : 'bg-neon-orange'
                      }`} />
                      <div>
                        <div className="text-white text-sm font-medium">
                          {access.agent_id} • {access.access_type}
                        </div>
                        <div className="text-stealth-light text-xs">
                          {access.knowledge_key}
                        </div>
                      </div>
                    </div>
                    <div className="text-stealth-light text-xs">
                      {new Date(access.timestamp).toLocaleTimeString()}
                    </div>
                  </motion.div>
                ))}
                
                {recentAccesses.length === 0 && (
                  <div className="text-center py-8 text-stealth-light">
                    No recent activity recorded
                  </div>
                )}
              </div>
            </StealthPanel>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default KnowledgeDatabasePanel;