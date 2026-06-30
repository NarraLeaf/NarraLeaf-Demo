import React, { useState, useEffect } from 'react';
import { TestPanelTrigger, useTestPanel } from './TestPanel';
import { EnhancedTestPanel, MinimizedTestPanel } from './EnhancedTestPanel';
import { ComponentTreeAnalyzer } from './ComponentTreeAnalyzer';
import { AdvancedComponentAnalyzer } from './AdvancedComponentAnalyzer';
import { ReactDevTools } from './ReactDevTools';
import { ComprehensiveComponentAnalyzer } from './ComprehensiveComponentAnalyzer';
import { MouseDebugger } from './MouseDebugger';
import { useRouter } from 'narraleaf-react';

export function GlobalTestPanel() {
    const [isMinimized, setIsMinimized] = useState<boolean>(false);
    const [showComponentTree, setShowComponentTree] = useState<boolean>(false);
    const [showAdvancedAnalyzer, setShowAdvancedAnalyzer] = useState<boolean>(false);
    const [showReactDevTools, setShowReactDevTools] = useState<boolean>(false);
    const [showComprehensiveAnalyzer, setShowComprehensiveAnalyzer] = useState<boolean>(false);
    const [showMouseDebugger, setShowMouseDebugger] = useState<boolean>(false);
    const { isVisible, togglePanel, closePanel } = useTestPanel("dev");
    const router = useRouter();

    const handleMinimize = () => {
        setIsMinimized(true);
    };

    const handleRestore = () => {
        setIsMinimized(false);
    };

    // Reset minimized state when panel is closed
    const handleClose = () => {
        setIsMinimized(false);
        closePanel();
    };

    // Check if current page is settings
    const isSettingsPage = router.getPathname() === "/home/settings";

    return (
        <>
            {/* Enhanced Test Panel - Rendered at app level */}
            <EnhancedTestPanel 
                isVisible={isVisible && !isMinimized} 
                onClose={handleClose}
                onMinimize={handleMinimize}
                isMinimized={isMinimized}
                title="React Component Analysis Tools"
                initialPosition={{ x: 50, y: 50 }}
                initialSize={{ width: 500, height: 500 }}
            >
                <div className="text-white">
                    <h3 className="text-lg mb-4">React Component Analysis Tools</h3>
                    <p className="text-white/80 mb-4">
                        These tools help inspect and debug the React component tree.
                    </p>
                    <div className="space-y-3">
                        <button 
                            onClick={() => setShowComponentTree(true)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                        >
                            Basic Component Tree Analyzer
                        </button>
                        <button 
                            onClick={() => setShowAdvancedAnalyzer(true)}
                            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
                        >
                            Advanced Performance Analyzer
                        </button>
                        <button 
                            onClick={() => setShowComprehensiveAnalyzer(true)}
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded transition-colors"
                        >
                            Comprehensive Component Analyzer (Electron)
                        </button>
                        <button 
                            onClick={() => setShowMouseDebugger(true)}
                            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                        >
                            Mouse Event Debugger
                        </button>
                        <button 
                            onClick={() => setShowReactDevTools(true)}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors"
                        >
                            React DevTools Integration
                        </button>
                        <div className="text-xs text-gray-400 mt-4 p-2 bg-gray-800 rounded">
                            <p>• Basic Component Tree Analyzer: inspect the React component structure on the current page</p>
                            <p>• Advanced Performance Analyzer: monitor render performance and state changes</p>
                            <p>• Comprehensive Component Analyzer: Electron-only tool with unmounted component detection</p>
                            <p>• Mouse Event Debugger: track mouse events and element stacking for context-menu debugging</p>
                            <p>• React DevTools Integration: inspect component trees and hooks in depth</p>
                            <p>• Supports live monitoring and performance trend analysis</p>
                        </div>
                    </div>
                </div>
            </EnhancedTestPanel>

            {/* Minimized Test Panel */}
            <MinimizedTestPanel 
                isVisible={isVisible && isMinimized}
                onRestore={handleRestore}
                title="Test Panel"
            />
            
            {/* Component Tree Analyzer */}
            <ComponentTreeAnalyzer 
                isVisible={showComponentTree}
                onClose={() => setShowComponentTree(false)}
            />

            {/* Advanced Component Analyzer */}
            <AdvancedComponentAnalyzer 
                isVisible={showAdvancedAnalyzer}
                onClose={() => setShowAdvancedAnalyzer(false)}
            />

            {/* Comprehensive Component Analyzer */}
            <ComprehensiveComponentAnalyzer 
                isVisible={showComprehensiveAnalyzer}
                onClose={() => setShowComprehensiveAnalyzer(false)}
            />

            {/* React DevTools */}
            <ReactDevTools 
                isVisible={showReactDevTools}
                onClose={() => setShowReactDevTools(false)}
            />

            {/* Mouse Debugger */}
            <MouseDebugger 
                isVisible={showMouseDebugger}
                onClose={() => setShowMouseDebugger(false)}
            />
            
            {/* Global keyboard listener - always active */}
            <TestPanelTrigger 
                triggerKeys="dev"
                onTrigger={togglePanel}
                hintText="Type 'dev' to show the test panel"
                showHint={isSettingsPage} // Only show hint on settings page
            />
        </>
    );
} 
