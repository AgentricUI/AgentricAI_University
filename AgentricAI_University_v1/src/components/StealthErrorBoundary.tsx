import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Zap, Shield, CheckCircle, X } from 'lucide-react';
import { agentricaiCoreOS } from '../services/agentEcosystem';
import StealthPanel from './ui/StealthPanel';
import AgentricAIPanel from './ui/AgentricAIPanel';
import NeonButton from './ui/NeonButton';

interface Props {
  children: ReactNode;
  enableAgentAnalysis?: boolean;
  userType?: 'child' | 'admin';
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  agentAnalysis: any | null;
  showErrorModal: boolean;
  fixApplied: boolean;
  loading: boolean;
}

// Enhanced Error Boundary with Stealth Agent Integration
class AgentricAIErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      agentAnalysis: null,
      showErrorModal: false,
      fixApplied: false,
      loading: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      showErrorModal: true
    };
  }

  async componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ 
      errorInfo,
      loading: true 
    });

    if (this.props.enableAgentAnalysis) {
      try {
        // Trigger AgentricAI agent analysis
        const context = {
          lastUserAction: 'component_interaction',
          componentState: errorInfo.componentStack,
          activeAgents: ['agentricai-core-os-error-handler', 'agentricai-core-os-learning-coordinator'],
          userType: this.props.userType || 'admin'
        };

        const analysis = await agentricaiCoreOS.handleCoreOSError(
          error, 
          context, 
          this.props.userType || 'admin'
        );

        this.setState({ 
          agentAnalysis: analysis,
          loading: false 
        });

        // Auto-apply safe fixes for children
        if (this.props.userType === 'child' && analysis.proposed_fix.risk_level === 'low') {
          await this.handleApplyFix(analysis.proposed_fix, true);
        }

      } catch (analysisError) {
        console.error('AgentricAI agent analysis failed:', analysisError);
        this.setState({ loading: false });
      }
    }

    // Log error for monitoring
    console.error('AgentricAI Error Boundary caught an error:', error, errorInfo);
  }

  handleApplyFix = async (fix: any, autoApproved: boolean = false) => {
    try {
      this.setState({ loading: true });

      // Simulate applying the fix
      await new Promise(resolve => setTimeout(resolve, 2000));

      this.setState({ 
        fixApplied: true,
        loading: false,
        hasError: false,
        showErrorModal: false
      });

      // Reload the component after fix
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error) {
      console.error('Failed to apply fix:', error);
      this.setState({ loading: false });
    }
  };

  handleDismiss = () => {
    this.setState({ 
      showErrorModal: false,
      hasError: false 
    });
  };

  render() {
    if (this.state.fixApplied) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="min-h-screen bg-stealth-black flex items-center justify-center"
        >
          <StealthPanel className="p-8 max-w-md text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <CheckCircle className="w-16 h-16 text-neon-lime mx-auto mb-4" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2">
              All Fixed! ✨
            </h2>
            <p className="text-stealth-light mb-4">
              {this.props.userType === 'child' 
                ? "Great job! Everything is working perfectly now!"
                : "Stealth agents have successfully resolved the issue."
              }
            </p>
            <div className="w-full bg-stealth-panel rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-neon-cyan to-neon-lime"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1 }}
              />
            </div>
          </StealthPanel>
        </motion.div>
      );
    }

    if (this.state.hasError) {
      return (
        <>
          {this.props.children}
          <AnimatePresence>
            {this.state.showErrorModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
              >
                <motion.div
                  initial={{ scale: 0.8, y: 50 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.8, y: 50 }}
                  className="max-w-lg w-full"
                >
                  <AgentricAIPanel className="p-6 border-2 border-neon-orange" variant="warning" rivetPattern="edges">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-neon-orange bg-opacity-20 rounded-lg">
                          {this.props.userType === 'child' ? (
                            <Zap className="w-6 h-6 text-neon-orange" />
                          ) : (
                            <AlertTriangle className="w-6 h-6 text-neon-orange" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">
                            {this.props.userType === 'child' 
                              ? "AgentricAI is Fixing This!" 
                              : "AgentricAI Core OS Alert"
                            }
                          </h3>
                          <p className="text-stealth-light text-sm">
                            {this.props.userType === 'child'
                              ? "Don't worry - the smart helpers are making it better!"
                              : "AgentricAI Core OS agents are analyzing the issue"
                            }
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={this.handleDismiss}
                        className="text-stealth-light hover:text-white transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {this.state.loading ? (
                      <div className="text-center py-8">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full mx-auto mb-4"
                        />
                        <p className="text-stealth-light">
                          {this.props.userType === 'child'
                            ? "The AgentricAI helpers are working on it..."
                            : "AgentricAI Core OS analyzing error..."
                          }
                        </p>
                      </div>
                    ) : this.state.agentAnalysis ? (
                      <div className="space-y-4">
                        <div className="bg-stealth-panel-light p-4 rounded-lg">
                          <h4 className="text-white font-medium mb-2">
                            {this.props.userType === 'child' ? "What Happened:" : "Analysis:"}
                          </h4>
                          <p className="text-stealth-light text-sm">
                            {this.state.agentAnalysis.explanation}
                          </p>
                        </div>

                        {this.state.agentAnalysis.proposed_fix && (
                          <div className="bg-stealth-panel-light p-4 rounded-lg">
                            <h4 className="text-white font-medium mb-2 flex items-center">
                              <Shield className="w-4 h-4 text-neon-lime mr-2" />
                              {this.props.userType === 'child' ? "AgentricAI Fix:" : "Core OS Solution:"}
                            </h4>
                            <p className="text-stealth-light text-sm mb-3">
                              {this.state.agentAnalysis.proposed_fix.description}
                            </p>
                            <div className="flex space-x-3">
                              <NeonButton
                                onClick={() => this.handleApplyFix(this.state.agentAnalysis.proposed_fix)}
                                variant="primary"
                                className="flex-1"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                {this.props.userType === 'child' ? "Fix It!" : "Apply Fix"}
                              </NeonButton>
                              <NeonButton
                                onClick={this.handleDismiss}
                                variant="secondary"
                                className="flex-1"
                              >
                                {this.props.userType === 'child' ? "Not Now" : "Dismiss"}
                              </NeonButton>
                            </div>
                          </div>
                        )}

                        {this.props.userType === 'admin' && this.state.error && (
                          <details className="bg-stealth-panel-light p-4 rounded-lg">
                            <summary className="text-stealth-light cursor-pointer hover:text-white">
                              Technical Details
                            </summary>
                            <div className="mt-2 text-xs text-stealth-light font-mono">
                              <p><strong>Error:</strong> {this.state.error.message}</p>
                              <p><strong>Type:</strong> {this.state.error.name}</p>
                              {this.state.errorInfo && (
                                <pre className="mt-2 overflow-auto max-h-32">
                                  {this.state.errorInfo.componentStack}
                                </pre>
                              )}
                            </div>
                          </details>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-stealth-light">
                          {this.props.userType === 'child'
                            ? "Something small happened in AgentricAI, but we're working on it!"
                            : "A Core OS error occurred. Please try refreshing the page."
                          }
                        </p>
                        <NeonButton
                          onClick={this.handleDismiss}
                          variant="primary"
                          className="mt-4"
                        >
                          {this.props.userType === 'child' ? "Okay!" : "Dismiss"}
                        </NeonButton>
                      </div>
                    )}
                  </AgentricAIPanel>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      );
    }

    return this.props.children;
  }
}

export default AgentricAIErrorBoundary;