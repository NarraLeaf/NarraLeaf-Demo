import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'narraleaf-react';

interface ComponentMetrics {
    name: string;
    renderCount: number;
    lastRenderTime: number;
    totalRenderTime: number;
    averageRenderTime: number;
    props: Record<string, any>;
    state: Record<string, any>;
    hooks: string[];
    children: ComponentMetrics[];
}

interface PerformanceSnapshot {
    timestamp: number;
    components: ComponentMetrics[];
    totalComponents: number;
    totalRenderTime: number;
}

interface AdvancedComponentAnalyzerProps {
    isVisible: boolean;
    onClose: () => void;
}

export function AdvancedComponentAnalyzer({ isVisible, onClose }: AdvancedComponentAnalyzerProps) {
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [snapshots, setSnapshots] = useState<PerformanceSnapshot[]>([]);
    const [currentMetrics, setCurrentMetrics] = useState<ComponentMetrics[]>([]);
    const [selectedComponent, setSelectedComponent] = useState<ComponentMetrics | null>(null);
    const [monitoringInterval, setMonitoringInterval] = useState<NodeJS.Timeout | null>(null);
    const router = useRouter();

    // Start monitoring component performance
    const startMonitoring = useCallback(() => {
        if (isMonitoring) return;

        setIsMonitoring(true);
        
        // Create a performance observer to track component renders
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
                if (entry.entryType === 'measure') {
                    console.log('Component render:', entry.name, entry.duration);
                }
            });
        });

        observer.observe({ entryTypes: ['measure'] });

        // Set up interval for periodic snapshots
        const interval = setInterval(() => {
            const snapshot = capturePerformanceSnapshot();
            setSnapshots(prev => [...prev, snapshot]);
            setCurrentMetrics(snapshot.components);
        }, 1000);

        setMonitoringInterval(interval);
    }, [isMonitoring]);

    // Stop monitoring
    const stopMonitoring = useCallback(() => {
        setIsMonitoring(false);
        if (monitoringInterval) {
            clearInterval(monitoringInterval);
            setMonitoringInterval(null);
        }
    }, [monitoringInterval]);

    // Capture performance snapshot
    const capturePerformanceSnapshot = (): PerformanceSnapshot => {
        const components = analyzeComponentPerformance();
        const totalComponents = countTotalComponents(components);
        const totalRenderTime = components.reduce((sum, comp) => sum + comp.totalRenderTime, 0);

        return {
            timestamp: Date.now(),
            components,
            totalComponents,
            totalRenderTime
        };
    };

    // Analyze component performance
    const analyzeComponentPerformance = (): ComponentMetrics[] => {
        const metrics: ComponentMetrics[] = [];
        
        // Get React DevTools data if available
        if ((window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__) {
            const hook = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
            const renderers = hook.renderers;
            
            if (renderers && renderers.size > 0) {
                const renderer = renderers.get(1); // React DOM renderer
                if (renderer && renderer.getFiberRoots) {
                    const roots = renderer.getFiberRoots();
                    roots.forEach((root: any) => {
                        const fiber = root.current;
                        if (fiber) {
                            const componentMetrics = traverseFiber(fiber);
                            metrics.push(...componentMetrics);
                        }
                    });
                }
            }
        }

        return metrics;
    };

    // Traverse React fiber tree
    const traverseFiber = (fiber: any, depth = 0): ComponentMetrics[] => {
        const metrics: ComponentMetrics[] = [];

        let currentFiber = fiber;
        while (currentFiber) {
            if (currentFiber.type && typeof currentFiber.type !== 'string') {
                const componentMetric: ComponentMetrics = {
                    name: getComponentName(currentFiber.type),
                    renderCount: getRenderCount(currentFiber),
                    lastRenderTime: getLastRenderTime(currentFiber),
                    totalRenderTime: getTotalRenderTime(currentFiber),
                    averageRenderTime: getAverageRenderTime(currentFiber),
                    props: currentFiber.memoizedProps || {},
                    state: currentFiber.memoizedState || {},
                    hooks: getHooksInfo(currentFiber),
                    children: []
                };

                // Process children
                if (currentFiber.child) {
                    componentMetric.children = traverseFiber(currentFiber.child, depth + 1);
                }

                metrics.push(componentMetric);
            }

            currentFiber = currentFiber.sibling;
        }

        return metrics;
    };

    // Helper functions
    const getComponentName = (type: any): string => {
        if (typeof type === 'function') {
            return type.name || type.displayName || 'FunctionComponent';
        }
        return 'Unknown';
    };

    const getRenderCount = (fiber: any): number => {
        // This would require custom tracking in production
        return Math.floor(Math.random() * 10) + 1; // Placeholder
    };

    const getLastRenderTime = (fiber: any): number => {
        // This would require custom tracking in production
        return Math.random() * 10; // Placeholder
    };

    const getTotalRenderTime = (fiber: any): number => {
        return getLastRenderTime(fiber) * getRenderCount(fiber);
    };

    const getAverageRenderTime = (fiber: any): number => {
        const count = getRenderCount(fiber);
        return count > 0 ? getTotalRenderTime(fiber) / count : 0;
    };

    const getHooksInfo = (fiber: any): string[] => {
        const hooks: string[] = [];
        let currentFiber = fiber;

        while (currentFiber) {
            if (currentFiber.memoizedState) {
                // Analyze hooks (simplified)
                if (currentFiber.memoizedState.queue) {
                    hooks.push('useState');
                }
                if (currentFiber.memoizedState.memoizedState) {
                    hooks.push('useEffect');
                }
            }
            currentFiber = currentFiber.return;
        }

        return [...new Set(hooks)];
    };

    const countTotalComponents = (components: ComponentMetrics[]): number => {
        return components.reduce((count, comp) => {
            return count + 1 + countTotalComponents(comp.children);
        }, 0);
    };

    // Render component tree
    const renderComponentTree = (components: ComponentMetrics[], depth = 0) => {
        return components.map((component, index) => (
            <div key={`${component.name}-${index}-${depth}`}>
                <div 
                    className={`cursor-pointer p-2 rounded text-sm border-l-2 ${
                        selectedComponent === component 
                            ? 'bg-blue-600 text-white border-blue-400' 
                            : 'hover:bg-gray-700 border-gray-600'
                    }`}
                    onClick={() => setSelectedComponent(component)}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <span className="text-gray-400">{'  '.repeat(depth)}</span>
                            <span className="font-mono">{component.name}</span>
                            <span className="text-xs text-gray-500">
                                ({component.renderCount} renders)
                            </span>
                        </div>
                        <div className="text-xs text-gray-400">
                            {component.averageRenderTime.toFixed(2)}ms avg
                        </div>
                    </div>
                </div>
                {component.children.length > 0 && (
                    <div className="ml-4">
                        {renderComponentTree(component.children, depth + 1)}
                    </div>
                )}
            </div>
        ));
    };

    // Render component details
    const renderComponentDetails = () => {
        if (!selectedComponent) return null;

        return (
            <div className="bg-gray-800 p-4 rounded-lg space-y-4">
                <h4 className="text-lg font-semibold">Component Performance Details</h4>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="text-gray-400">Component Name:</span>
                        <span className="ml-2 font-mono">{selectedComponent.name}</span>
                    </div>
                    <div>
                        <span className="text-gray-400">Render Count:</span>
                        <span className="ml-2">{selectedComponent.renderCount}</span>
                    </div>
                    <div>
                        <span className="text-gray-400">Average Render Time:</span>
                        <span className="ml-2">{selectedComponent.averageRenderTime.toFixed(2)}ms</span>
                    </div>
                    <div>
                        <span className="text-gray-400">Total Render Time:</span>
                        <span className="ml-2">{selectedComponent.totalRenderTime.toFixed(2)}ms</span>
                    </div>
                </div>

                {selectedComponent.hooks.length > 0 && (
                    <div>
                        <span className="text-gray-400">Hooks Used:</span>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {selectedComponent.hooks.map((hook, index) => (
                                <span key={index} className="bg-blue-600 px-2 py-1 rounded text-xs">
                                    {hook}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {Object.keys(selectedComponent.props).length > 0 && (
                    <div>
                        <span className="text-gray-400">Props:</span>
                        <pre className="mt-2 p-2 bg-gray-900 rounded text-xs overflow-auto max-h-32">
                            {JSON.stringify(selectedComponent.props, null, 2)}
                        </pre>
                    </div>
                )}

                {Object.keys(selectedComponent.state).length > 0 && (
                    <div>
                        <span className="text-gray-400">State:</span>
                        <pre className="mt-2 p-2 bg-gray-900 rounded text-xs overflow-auto max-h-32">
                            {JSON.stringify(selectedComponent.state, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        );
    };

    // Render performance chart
    const renderPerformanceChart = () => {
        if (snapshots.length === 0) return null;

        const recentSnapshots = snapshots.slice(-20); // Last 20 snapshots
        const maxRenderTime = Math.max(...recentSnapshots.map(s => s.totalRenderTime));

        return (
            <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-md font-semibold mb-3">Performance Trend</h4>
                <div className="h-32 flex items-end space-x-1">
                    {recentSnapshots.map((snapshot, index) => (
                        <div
                            key={index}
                            className="bg-blue-600 flex-1 min-w-0"
                            style={{
                                height: `${(snapshot.totalRenderTime / maxRenderTime) * 100}%`
                            }}
                            title={`${snapshot.totalRenderTime.toFixed(2)}ms - ${snapshot.totalComponents} components`}
                        />
                    ))}
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>0ms</span>
                    <span>{maxRenderTime.toFixed(2)}ms</span>
                </div>
            </div>
        );
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (monitoringInterval) {
                clearInterval(monitoringInterval);
            }
        };
    }, [monitoringInterval]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 text-white rounded-lg shadow-xl w-11/12 h-5/6 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold">Advanced Component Performance Analyzer</h3>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-white"
                    >
                        ✕
                    </button>
                </div>

                {/* Controls */}
                <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={isMonitoring ? stopMonitoring : startMonitoring}
                            className={`px-4 py-2 rounded transition-colors ${
                                isMonitoring 
                                    ? 'bg-red-600 hover:bg-red-700' 
                                    : 'bg-green-600 hover:bg-green-700'
                            }`}
                        >
                            {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
                        </button>
                        <span className="text-gray-400">
                            Current Page: {router.getPathname()}
                        </span>
                        {isMonitoring && (
                            <span className="text-green-400 animate-pulse">
                                Monitoring
                            </span>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Component Tree */}
                    <div className="w-1/3 p-4 border-r border-gray-700 overflow-auto">
                        <h4 className="text-md font-semibold mb-3">Component Tree</h4>
                        {currentMetrics.length === 0 ? (
                            <p className="text-gray-400">Start monitoring to view the component tree</p>
                        ) : (
                            <div className="font-mono text-sm">
                                {renderComponentTree(currentMetrics)}
                            </div>
                        )}
                    </div>

                    {/* Details Panel */}
                    <div className="w-1/3 p-4 border-r border-gray-700 overflow-auto">
                        <h4 className="text-md font-semibold mb-3">Component Details</h4>
                        {selectedComponent ? (
                            renderComponentDetails()
                        ) : (
                            <p className="text-gray-400">Select a component to view details</p>
                        )}
                    </div>

                    {/* Performance Chart */}
                    <div className="w-1/3 p-4 overflow-auto">
                        <h4 className="text-md font-semibold mb-3">Performance Monitor</h4>
                        {renderPerformanceChart()}
                        
                        {snapshots.length > 0 && (
                            <div className="mt-4 bg-gray-800 p-4 rounded-lg">
                                <h5 className="text-sm font-semibold mb-2">Statistics</h5>
                                <div className="space-y-1 text-sm">
                                    <div>
                                        <span className="text-gray-400">Snapshots:</span>
                                        <span className="ml-2">{snapshots.length}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Average Components:</span>
                                        <span className="ml-2">
                                            {(snapshots.reduce((sum, s) => sum + s.totalComponents, 0) / snapshots.length).toFixed(1)}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Average Render Time:</span>
                                        <span className="ml-2">
                                            {(snapshots.reduce((sum, s) => sum + s.totalRenderTime, 0) / snapshots.length).toFixed(2)}ms
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 
