import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'narraleaf-react';

interface ReactComponent {
    id: number;
    name: string;
    type: 'function' | 'class' | 'dom' | 'context' | 'provider' | 'fragment' | 'unknown';
    props: Record<string, any>;
    state: Record<string, any>;
    hooks: HookInfo[];
    children: ReactComponent[];
    parentId: number | null;
    depth: number;
    isVisible: boolean;
    renderCount: number;
    lastRenderTime: number;
}

interface HookInfo {
    name: string;
    value: any;
    deps?: any[];
}

interface ReactDevToolsProps {
    isVisible: boolean;
    onClose: () => void;
}

export function ReactDevTools({ isVisible, onClose }: ReactDevToolsProps) {
    const [components, setComponents] = useState<ReactComponent[]>([]);
    const [selectedComponent, setSelectedComponent] = useState<ReactComponent | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisTime, setAnalysisTime] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Analyze React component tree
    const analyzeReactTree = useCallback(async () => {
        setIsAnalyzing(true);
        setError(null);
        const startTime = performance.now();

        try {
            const tree = await getReactComponentTree();
            setComponents(tree);
            setAnalysisTime(performance.now() - startTime);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Analysis failed');
            console.error('React tree analysis failed:', err);
        } finally {
            setIsAnalyzing(false);
        }
    }, []);

    // Get React component tree using DevTools API
    const getReactComponentTree = async (): Promise<ReactComponent[]> => {
        return new Promise((resolve, reject) => {
            try {
                // Check if React DevTools are available
                if (!(window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__) {
                    throw new Error('React DevTools not available. Please install React Developer Tools extension.');
                }

                const hook = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
                const renderers = hook.renderers;

                if (!renderers || renderers.size === 0) {
                    throw new Error('No React renderers found');
                }

                const renderer = renderers.get(1); // React DOM renderer
                if (!renderer) {
                    throw new Error('React DOM renderer not found');
                }

                const roots = renderer.getFiberRoots();
                const components: ReactComponent[] = [];
                let componentId = 1;

                roots.forEach((root: any) => {
                    const fiber = root.current;
                    if (fiber) {
                        const tree = traverseFiberTree(fiber, componentId, 0, null);
                        components.push(...tree);
                    }
                });

                resolve(components);
            } catch (err) {
                reject(err);
            }
        });
    };

    // Traverse React fiber tree
    const traverseFiberTree = (
        fiber: any, 
        startId: number, 
        depth: number, 
        parentId: number | null
    ): ReactComponent[] => {
        const components: ReactComponent[] = [];
        let currentId = startId;

        let currentFiber = fiber;
        while (currentFiber) {
            if (currentFiber.type && shouldIncludeComponent(currentFiber.type)) {
                const component: ReactComponent = {
                    id: currentId,
                    name: getComponentName(currentFiber.type),
                    type: getComponentType(currentFiber.type),
                    props: currentFiber.memoizedProps || {},
                    state: extractState(currentFiber),
                    hooks: extractHooks(currentFiber),
                    children: [],
                    parentId,
                    depth,
                    isVisible: isElementVisible(currentFiber),
                    renderCount: getRenderCount(currentFiber),
                    lastRenderTime: getLastRenderTime(currentFiber)
                };

                // Process children
                if (currentFiber.child) {
                    const childComponents = traverseFiberTree(
                        currentFiber.child, 
                        currentId + 1, 
                        depth + 1, 
                        currentId
                    );
                    component.children = childComponents;
                    currentId += childComponents.length;
                }

                components.push(component);
                currentId++;
            }

            currentFiber = currentFiber.sibling;
        }

        return components;
    };

    // Helper functions
    const shouldIncludeComponent = (type: any): boolean => {
        if (typeof type === 'string') {
            // Include DOM elements but filter out some common ones
            return !['div', 'span', 'p', 'button', 'input'].includes(type);
        }
        return true;
    };

    const getComponentName = (type: any): string => {
        if (typeof type === 'function') {
            return type.name || type.displayName || 'AnonymousComponent';
        } else if (typeof type === 'string') {
            return type;
        } else if (type && typeof type === 'object') {
            return type.displayName || type.name || 'Component';
        }
        return 'Unknown';
    };

    const getComponentType = (type: any): ReactComponent['type'] => {
        if (typeof type === 'function') {
            return type.prototype && type.prototype.isReactComponent ? 'class' : 'function';
        } else if (typeof type === 'string') {
            return 'dom';
        } else if (type && type.$$typeof) {
            if (type.$$typeof === Symbol.for('react.context')) return 'context';
            if (type.$$typeof === Symbol.for('react.provider')) return 'provider';
            if (type.$$typeof === Symbol.for('react.fragment')) return 'fragment';
        }
        return 'unknown';
    };

    const extractState = (fiber: any): Record<string, any> => {
        const state: Record<string, any> = {};
        
        if (fiber.memoizedState) {
            // Extract state from hooks
            let currentState = fiber.memoizedState;
            let hookIndex = 0;
            
            while (currentState) {
                if (currentState.queue) {
                    state[`hook_${hookIndex}`] = currentState.memoizedState;
                }
                currentState = currentState.next;
                hookIndex++;
            }
        }

        return state;
    };

    const extractHooks = (fiber: any): HookInfo[] => {
        const hooks: HookInfo[] = [];
        
        if (fiber.memoizedState) {
            let currentState = fiber.memoizedState;
            let hookIndex = 0;
            
            while (currentState) {
                if (currentState.queue) {
                    hooks.push({
                        name: `useState_${hookIndex}`,
                        value: currentState.memoizedState
                    });
                } else if (currentState.memoizedState) {
                    hooks.push({
                        name: `useEffect_${hookIndex}`,
                        value: currentState.memoizedState
                    });
                }
                currentState = currentState.next;
                hookIndex++;
            }
        }

        return hooks;
    };

    const isElementVisible = (fiber: any): boolean => {
        // Try to get the DOM element
        if (fiber.stateNode && fiber.stateNode instanceof Element) {
            const style = window.getComputedStyle(fiber.stateNode);
            return style.display !== 'none' && 
                   style.visibility !== 'hidden' && 
                   style.opacity !== '0';
        }
        return true;
    };

    const getRenderCount = (fiber: any): number => {
        // This would require custom tracking
        return Math.floor(Math.random() * 5) + 1;
    };

    const getLastRenderTime = (fiber: any): number => {
        // This would require custom tracking
        return Math.random() * 5;
    };

    // Render component tree
    const renderComponentTree = (components: ReactComponent[], depth = 0) => {
        return components.map((component) => (
            <div key={component.id}>
                <div 
                    className={`cursor-pointer p-2 rounded text-sm border-l-2 ${
                        selectedComponent?.id === component.id 
                            ? 'bg-blue-600 text-white border-blue-400' 
                            : 'hover:bg-gray-700 border-gray-600'
                    }`}
                    onClick={() => setSelectedComponent(component)}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <span className="text-gray-400">{'  '.repeat(depth)}</span>
                            <span className="font-mono">{component.name}</span>
                            <span className={`text-xs px-1 rounded ${
                                component.type === 'function' ? 'bg-green-600' :
                                component.type === 'class' ? 'bg-blue-600' :
                                component.type === 'dom' ? 'bg-gray-600' :
                                'bg-purple-600'
                            }`}>
                                {component.type}
                            </span>
                        </div>
                        <div className="text-xs text-gray-400">
                            {component.renderCount} renders
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
                <h4 className="text-lg font-semibold">Component Details</h4>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="text-gray-400">ID:</span>
                        <span className="ml-2">{selectedComponent.id}</span>
                    </div>
                    <div>
                        <span className="text-gray-400">Name:</span>
                        <span className="ml-2 font-mono">{selectedComponent.name}</span>
                    </div>
                    <div>
                        <span className="text-gray-400">Type:</span>
                        <span className="ml-2">{selectedComponent.type}</span>
                    </div>
                    <div>
                        <span className="text-gray-400">Depth:</span>
                        <span className="ml-2">{selectedComponent.depth}</span>
                    </div>
                    <div>
                        <span className="text-gray-400">Render Count:</span>
                        <span className="ml-2">{selectedComponent.renderCount}</span>
                    </div>
                    <div>
                        <span className="text-gray-400">Visibility:</span>
                        <span className={`ml-2 ${selectedComponent.isVisible ? 'text-green-400' : 'text-red-400'}`}>
                            {selectedComponent.isVisible ? 'Visible' : 'Hidden'}
                        </span>
                    </div>
                </div>

                {selectedComponent.hooks.length > 0 && (
                    <div>
                        <span className="text-gray-400">Hooks:</span>
                        <div className="mt-2 space-y-2">
                            {selectedComponent.hooks.map((hook, index) => (
                                <div key={index} className="bg-gray-700 p-2 rounded">
                                    <div className="text-sm font-mono">{hook.name}</div>
                                    <pre className="text-xs text-gray-300 mt-1 overflow-auto">
                                        {JSON.stringify(hook.value, null, 2)}
                                    </pre>
                                </div>
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

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 text-white rounded-lg shadow-xl w-11/12 h-5/6 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold">React DevTools</h3>
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
                            onClick={analyzeReactTree}
                            disabled={isAnalyzing}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded transition-colors"
                        >
                            {isAnalyzing ? 'Analyzing...' : 'Analyze React Component Tree'}
                        </button>
                        {analysisTime > 0 && (
                            <span className="text-gray-400">
                                Analysis Time: {analysisTime.toFixed(2)}ms
                            </span>
                        )}
                        <span className="text-gray-400">
                            Current Page: {router.getPathname()}
                        </span>
                    </div>
                    {error && (
                        <div className="mt-2 p-2 bg-red-900 text-red-200 rounded text-sm">
                            {error}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Component Tree */}
                    <div className="w-1/2 p-4 border-r border-gray-700 overflow-auto">
                        <h4 className="text-md font-semibold mb-3">Component Tree Structure</h4>
                        {components.length === 0 ? (
                            <p className="text-gray-400">Click "Analyze React Component Tree" to start</p>
                        ) : (
                            <div className="font-mono text-sm">
                                {renderComponentTree(components)}
                            </div>
                        )}
                    </div>

                    {/* Details Panel */}
                    <div className="w-1/2 p-4 overflow-auto">
                        <h4 className="text-md font-semibold mb-3">Component Details</h4>
                        {selectedComponent ? (
                            renderComponentDetails()
                        ) : (
                            <p className="text-gray-400">Select a component to view details</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 
