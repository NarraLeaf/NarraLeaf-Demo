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
                title="React组件分析工具"
                initialPosition={{ x: 50, y: 50 }}
                initialSize={{ width: 500, height: 500 }}
            >
                <div className="text-white">
                    <h3 className="text-lg mb-4">React组件分析工具</h3>
                    <p className="text-white/80 mb-4">
                        这些工具可以帮助你分析和调试React组件树结构。
                    </p>
                    <div className="space-y-3">
                        <button 
                            onClick={() => setShowComponentTree(true)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                        >
                            基础组件树分析器
                        </button>
                        <button 
                            onClick={() => setShowAdvancedAnalyzer(true)}
                            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
                        >
                            高级性能分析器
                        </button>
                        <button 
                            onClick={() => setShowComprehensiveAnalyzer(true)}
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded transition-colors"
                        >
                            全面组件分析器 (Electron)
                        </button>
                        <button 
                            onClick={() => setShowMouseDebugger(true)}
                            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                        >
                            鼠标事件调试器
                        </button>
                        <button 
                            onClick={() => setShowReactDevTools(true)}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors"
                        >
                            React DevTools集成
                        </button>
                        <div className="text-xs text-gray-400 mt-4 p-2 bg-gray-800 rounded">
                            <p>• 基础组件树分析器：分析当前页面的React组件结构</p>
                            <p>• 高级性能分析器：监控组件渲染性能和状态变化</p>
                            <p>• 全面组件分析器：Electron环境专用，支持未挂载组件检测</p>
                            <p>• 鼠标事件调试器：跟踪鼠标事件和元素层级，调试右键菜单问题</p>
                            <p>• React DevTools集成：深度分析组件树和Hooks</p>
                            <p>• 支持实时监控和性能趋势分析</p>
                        </div>
                    </div>
                </div>
            </EnhancedTestPanel>

            {/* Minimized Test Panel */}
            <MinimizedTestPanel 
                isVisible={isVisible && isMinimized}
                onRestore={handleRestore}
                title="测试面板"
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
                hintText="输入 'dev' 显示测试面板"
                showHint={isSettingsPage} // Only show hint on settings page
            />
        </>
    );
} 