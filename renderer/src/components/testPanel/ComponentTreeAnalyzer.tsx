import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'narraleaf-react';

interface ComponentNode {
    name: string;
    type: string;
    props: Record<string, any>;
    children: ComponentNode[];
    depth: number;
    key?: string;
    isVisible?: boolean;
    componentType: 'function' | 'class' | 'context' | 'provider' | 'fragment' | 'unknown';
}

interface ComponentTreeAnalyzerProps {
    isVisible: boolean;
    onClose: () => void;
}

export function ComponentTreeAnalyzer({ isVisible, onClose }: ComponentTreeAnalyzerProps) {
    const [componentTree, setComponentTree] = useState<ComponentNode[]>([]);
    const [selectedNode, setSelectedNode] = useState<ComponentNode | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisTime, setAnalysisTime] = useState<number>(0);
    const [debugInfo, setDebugInfo] = useState<string[]>([]);
    const router = useRouter();

    // Add debug log
    const addDebugLog = (message: string) => {
        setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
        console.log(`[ComponentAnalyzer] ${message}`);
    };

    // Function to analyze component tree
    const analyzeComponentTree = () => {
        setIsAnalyzing(true);
        setDebugInfo([]);
        const startTime = performance.now();

        addDebugLog('开始分析组件树...');

        try {
            // Try multiple methods to get component tree
            let tree: ComponentNode[] = [];

            // Method 1: React DevTools API
            addDebugLog('尝试使用React DevTools API...');
            tree = getReactComponentTree();
            addDebugLog(`React DevTools API找到 ${tree.length} 个组件`);

            // Method 2: DOM-based analysis if DevTools failed
            if (tree.length === 0) {
                addDebugLog('React DevTools API未找到组件，尝试DOM分析...');
                const rootElement = document.getElementById('root') || document.body;
                tree = buildComponentTreeFromDOM(rootElement, 0);
                addDebugLog(`DOM分析找到 ${tree.length} 个组件`);
            }

            // Method 3: Direct fiber access
            if (tree.length === 0) {
                addDebugLog('尝试直接访问React Fiber...');
                tree = getComponentsFromFiber();
                addDebugLog(`直接Fiber访问找到 ${tree.length} 个组件`);
            }

            // Method 4: Fallback - scan all elements
            if (tree.length === 0) {
                addDebugLog('尝试扫描所有元素...');
                tree = scanAllElements();
                addDebugLog(`元素扫描找到 ${tree.length} 个组件`);
            }

            setComponentTree(tree);
            setAnalysisTime(performance.now() - startTime);
            addDebugLog(`分析完成，耗时 ${analysisTime.toFixed(2)}ms`);
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : '未知错误';
            addDebugLog(`分析失败: ${errorMsg}`);
            console.error('Component tree analysis failed:', error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Get React component tree using DevTools API
    const getReactComponentTree = (): ComponentNode[] => {
        const components: ComponentNode[] = [];
        
        try {
            // Check if React DevTools are available
            if ((window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__) {
                addDebugLog('React DevTools钩子可用');
                const hook = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
                const renderers = hook.renderers;
                
                addDebugLog(`找到 ${renderers?.size || 0} 个渲染器`);
                
                if (renderers && renderers.size > 0) {
                    const renderer = renderers.get(1); // React DOM renderer
                    if (renderer && renderer.getFiberRoots) {
                        const roots = renderer.getFiberRoots();
                        addDebugLog(`找到 ${roots.size} 个Fiber根节点`);
                        
                        roots.forEach((root: any) => {
                            const fiber = root.current;
                            if (fiber) {
                                const componentNodes = traverseReactFiber(fiber, 0);
                                components.push(...componentNodes);
                            }
                        });
                    } else {
                        addDebugLog('渲染器不支持getFiberRoots方法');
                    }
                }
            } else {
                addDebugLog('React DevTools钩子不可用');
            }
        } catch (error) {
            addDebugLog(`React DevTools API错误: ${error}`);
        }

        return components;
    };

    // Direct fiber access method
    const getComponentsFromFiber = (): ComponentNode[] => {
        const components: ComponentNode[] = [];
        
        try {
            // Try to find React root elements
            const rootElements = document.querySelectorAll('[data-reactroot], [data-reactid]');
            addDebugLog(`找到 ${rootElements.length} 个React根元素`);
            
            rootElements.forEach((element, index) => {
                addDebugLog(`检查根元素 ${index}: ${element.tagName}`);
                
                // Look for fiber properties
                const fiberProps = Object.keys(element).filter(key => 
                    key.includes('react') || key.includes('fiber') || key.includes('internal')
                );
                
                addDebugLog(`元素 ${index} 的React属性: ${fiberProps.join(', ')}`);
                
                fiberProps.forEach(prop => {
                    try {
                        const fiber = (element as any)[prop];
                        if (fiber && fiber.type) {
                            addDebugLog(`找到Fiber: ${fiber.type.name || fiber.type.displayName || 'Unknown'}`);
                            const componentNodes = traverseReactFiber(fiber, 0);
                            components.push(...componentNodes);
                        }
                    } catch (e) {
                        addDebugLog(`访问属性 ${prop} 失败: ${e}`);
                    }
                });
            });
        } catch (error) {
            addDebugLog(`直接Fiber访问错误: ${error}`);
        }

        return components;
    };

    // Scan all elements method
    const scanAllElements = (): ComponentNode[] => {
        const components: ComponentNode[] = [];
        const processedComponents = new Set<string>(); // 避免重复处理
        const fiberToComponent = new Map<any, ComponentNode>(); // Fiber到组件的映射
        
        try {
            // Scan all elements for React fiber properties
            const allElements = document.querySelectorAll('*');
            addDebugLog(`扫描 ${allElements.length} 个元素`);
            
            let fiberCount = 0;
            let processedFiberCount = 0;
            allElements.forEach((element, index) => {
                if (index % 1000 === 0) {
                    addDebugLog(`已扫描 ${index} 个元素，找到 ${fiberCount} 个Fiber`);
                }
                
                const reactKey = Object.keys(element).find(key => 
                    key.startsWith('__reactFiber$') || 
                    key.startsWith('__reactInternalInstance$') ||
                    key.includes('react') ||
                    key.includes('fiber')
                );

                if (reactKey) {
                    fiberCount++;
                    try {
                        const fiber = (element as any)[reactKey];
                        if (fiber) {
                            processedFiberCount++;
                            addDebugLog(`处理Fiber ${processedFiberCount}: ${reactKey}`);
                            
                            // Try to find React components by traversing up the fiber tree
                            const componentInfo = findReactComponentInFiberTree(fiber);
                            if (componentInfo) {
                                const componentKey = `${componentInfo.name}-${componentInfo.componentType}`;
                                if (!processedComponents.has(componentKey)) {
                                    processedComponents.add(componentKey);
                                    
                                    const node: ComponentNode = {
                                        name: componentInfo.name,
                                        type: componentInfo.type,
                                        props: componentInfo.props || {},
                                        children: [],
                                        depth: 0, // 稍后计算
                                        key: componentInfo.key,
                                        isVisible: true,
                                        componentType: componentInfo.componentType
                                    };
                                    
                                    // Store the fiber that created this component
                                    fiberToComponent.set(componentInfo.sourceFiber, node);
                                    components.push(node);
                                    addDebugLog(`✅ 找到新组件: ${componentInfo.name} (${componentInfo.componentType})`);
                                } else {
                                    addDebugLog(`⏭️ 跳过重复组件: ${componentInfo.name}`);
                                }
                            } else {
                                addDebugLog(`❌ 在此Fiber树中未找到React组件`);
                            }
                        }
                    } catch (e) {
                        addDebugLog(`处理Fiber失败: ${e}`);
                    }
                }
            });
            
            // Build component hierarchy based on fiber relationships
            addDebugLog(`开始构建组件层级关系...`);
            buildComponentHierarchyFromFiber(components, fiberToComponent);
            
            addDebugLog(`扫描完成，找到 ${fiberCount} 个Fiber，处理了 ${processedFiberCount} 个，识别出 ${components.length} 个唯一组件`);
        } catch (error) {
            addDebugLog(`元素扫描错误: ${error}`);
        }

        return components;
    };

    // Build component hierarchy based on fiber parent-child relationships
    const buildComponentHierarchyFromFiber = (components: ComponentNode[], fiberToComponent: Map<any, ComponentNode>) => {
        // Create a map of component names to components for easier lookup
        const componentMap = new Map<string, ComponentNode>();
        components.forEach(comp => componentMap.set(comp.name, comp));
        
        // Build hierarchy based on fiber relationships
        fiberToComponent.forEach((component, sourceFiber) => {
            // Find the parent component by traversing up the fiber tree
            let parentFiber = sourceFiber.return;
            let depth = 0;
            
            while (parentFiber && depth < 20) {
                depth++;
                
                // Check if this parent fiber corresponds to a component
                if (parentFiber.type && typeof parentFiber.type !== 'string') {
                    const parentName = getComponentNameFromFiber(parentFiber);
                    if (parentName && componentMap.has(parentName)) {
                        const parentComponent = componentMap.get(parentName)!;
                        
                        // Check if this component is not already a child of the parent
                        if (!parentComponent.children.some(child => child.name === component.name)) {
                            component.depth = parentComponent.depth + 1;
                            parentComponent.children.push(component);
                            addDebugLog(`构建层级: ${parentComponent.name} -> ${component.name} (深度: ${component.depth})`);
                        }
                        break;
                    }
                }
                
                parentFiber = parentFiber.return;
            }
        });
        
        // Assign depths to root components
        let rootDepth = 0;
        components.forEach(component => {
            if (component.depth === 0) {
                component.depth = rootDepth;
                rootDepth++;
            }
        });
        
        addDebugLog(`层级构建完成，根组件数量: ${components.filter(c => c.children.length > 0 || c.depth === 0).length}`);
    };

    // Get component name from fiber
    const getComponentNameFromFiber = (fiber: any): string | null => {
        if (!fiber || !fiber.type) return null;
        
        const type = fiber.type;
        if (typeof type === 'function') {
            return type.name || type.displayName || null;
        } else if (type && typeof type === 'object') {
            return type.displayName || type.name || null;
        }
        
        return null;
    };

    // Find React component by traversing up the fiber tree
    const findReactComponentInFiberTree = (fiber: any) => {
        if (!fiber) {
            addDebugLog('  Fiber为空');
            return null;
        }

        let currentFiber = fiber;
        let depth = 0;
        const maxDepth = 20; // 增加最大深度
        
        addDebugLog(`  开始向上遍历Fiber树...`);
        
        while (currentFiber && depth < maxDepth) {
            depth++;
            
            if (currentFiber.type) {
                const type = currentFiber.type;
                addDebugLog(`  深度${depth}: 检查类型 ${typeof type}`);
                
                if (typeof type === 'string') {
                    addDebugLog(`    跳过DOM元素: ${type}`);
                    // 继续向上遍历，跳过DOM元素
                } else if (typeof type === 'function') {
                    const name = type.name || type.displayName || 'AnonymousComponent';
                    const componentType: ComponentNode['componentType'] = type.prototype && type.prototype.isReactComponent ? 'class' : 'function';
                    addDebugLog(`    ✅ 找到函数组件: ${name} (${componentType})`);
                    
                    return {
                        name,
                        type: componentType,
                        props: currentFiber.memoizedProps || {},
                        key: currentFiber.key,
                        componentType,
                        sourceFiber: currentFiber // 保存源Fiber用于构建层级
                    };
                } else if (type && typeof type === 'object') {
                    const name = type.displayName || type.name || 'Component';
                    let componentType: ComponentNode['componentType'] = 'unknown';
                    
                    // Check for React symbols
                    if (type.$$typeof) {
                        const symbolName = type.$$typeof.toString();
                        addDebugLog(`    React符号: ${symbolName}`);
                        
                        if (type.$$typeof === Symbol.for('react.context')) {
                            componentType = 'context';
                        } else if (type.$$typeof === Symbol.for('react.provider')) {
                            componentType = 'provider';
                        } else if (type.$$typeof === Symbol.for('react.fragment')) {
                            componentType = 'fragment';
                        } else if (type.$$typeof === Symbol.for('react.memo')) {
                            componentType = 'function';
                        } else if (type.$$typeof === Symbol.for('react.forward_ref')) {
                            componentType = 'function';
                        } else {
                            addDebugLog(`    未知React符号: ${symbolName}`);
                            componentType = 'unknown';
                        }
                    } else {
                        addDebugLog(`    对象组件，无React符号`);
                        componentType = 'class';
                    }
                    
                    if (componentType !== 'unknown') {
                        addDebugLog(`    ✅ 找到对象组件: ${name} (${componentType})`);
                        return {
                            name,
                            type: componentType,
                            props: currentFiber.memoizedProps || {},
                            key: currentFiber.key,
                            componentType,
                            sourceFiber: currentFiber // 保存源Fiber用于构建层级
                        };
                    }
                } else {
                    addDebugLog(`    未知类型: ${typeof type}`);
                }
            } else {
                addDebugLog(`    深度${depth}: Fiber无type属性`);
            }

            // 向上遍历到父级Fiber
            currentFiber = currentFiber.return;
            if (currentFiber) {
                addDebugLog(`    向上遍历到父级Fiber`);
            }
        }

        addDebugLog(`  达到最大深度(${maxDepth})，未找到React组件`);
        return null;
    };

    // Traverse React fiber tree to get component information
    const traverseReactFiber = (fiber: any, depth: number): ComponentNode[] => {
        const nodes: ComponentNode[] = [];

        let currentFiber = fiber;
        let count = 0;
        
        while (currentFiber && count < 1000) { // Prevent infinite loops
            count++;
            
            // Only process React components, skip DOM elements
            if (currentFiber.type && typeof currentFiber.type !== 'string') {
                const componentInfo = extractComponentInfo(currentFiber);
                if (componentInfo) {
                    const node: ComponentNode = {
                        name: componentInfo.name,
                        type: componentInfo.type,
                        props: componentInfo.props || {},
                        children: [],
                        depth,
                        key: componentInfo.key,
                        isVisible: true,
                        componentType: componentInfo.componentType
                    };

                    // Process children
                    if (currentFiber.child) {
                        const childNodes = traverseReactFiber(currentFiber.child, depth + 1);
                        node.children = childNodes;
                    }

                    nodes.push(node);
                    addDebugLog(`处理组件: ${componentInfo.name} (深度: ${depth})`);
                }
            }

            currentFiber = currentFiber.sibling;
        }

        return nodes;
    };

    // Fallback: Build component tree from DOM
    const buildComponentTreeFromDOM = (element: Element, depth: number): ComponentNode[] => {
        const nodes: ComponentNode[] = [];
        
        // Get React fiber information if available
        const reactKey = Object.keys(element).find(key => 
            key.startsWith('__reactFiber$') || 
            key.startsWith('__reactInternalInstance$')
        );

        if (reactKey) {
            const fiber = (element as any)[reactKey];
            if (fiber) {
                const componentInfo = extractComponentInfo(fiber);
                if (componentInfo && componentInfo.componentType !== 'unknown') {
                    const node: ComponentNode = {
                        name: componentInfo.name,
                        type: componentInfo.type,
                        props: componentInfo.props || {},
                        children: [],
                        depth,
                        key: componentInfo.key,
                        isVisible: isElementVisible(element),
                        componentType: componentInfo.componentType
                    };
                    nodes.push(node);
                }
            }
        }

        // Process children
        for (let i = 0; i < element.children.length; i++) {
            const child = element.children[i];
            const childNodes = buildComponentTreeFromDOM(child, depth + 1);
            if (nodes.length > 0) {
                nodes[0].children.push(...childNodes);
            } else {
                nodes.push(...childNodes);
            }
        }

        return nodes;
    };

    // Check if element is visible
    const isElementVisible = (element: Element): boolean => {
        const style = window.getComputedStyle(element);
        return style.display !== 'none' && 
               style.visibility !== 'hidden' && 
               style.opacity !== '0';
    };

    // Render component tree node with proper indentation
    const renderTreeNode = (node: ComponentNode, index: number) => {
        const isSelected = selectedNode === node;
        const indentSize = node.depth * 20; // 20px per level
        
        return (
            <div key={`${node.name}-${index}-${node.depth}`}>
                <div 
                    className={`cursor-pointer p-2 rounded text-sm hover:bg-gray-700 transition-colors ${
                        isSelected ? 'bg-blue-600 text-white' : 'text-gray-200'
                    }`}
                    onClick={() => setSelectedNode(node)}
                    style={{ paddingLeft: `${indentSize + 12}px` }}
                >
                    <div className="flex items-center space-x-2">
                        {/* Component type indicator */}
                        <span className={`w-3 h-3 rounded-full ${
                            node.componentType === 'function' ? 'bg-green-500' :
                            node.componentType === 'class' ? 'bg-blue-500' :
                            node.componentType === 'context' ? 'bg-purple-500' :
                            node.componentType === 'provider' ? 'bg-orange-500' :
                            node.componentType === 'fragment' ? 'bg-gray-500' :
                            'bg-gray-400'
                        }`} />
                        
                        {/* Component name */}
                        <span className="font-mono font-medium">{node.name}</span>
                        
                        {/* Component type badge */}
                        <span className={`text-xs px-2 py-1 rounded ${
                            node.componentType === 'function' ? 'bg-green-600 text-green-100' :
                            node.componentType === 'class' ? 'bg-blue-600 text-blue-100' :
                            node.componentType === 'context' ? 'bg-purple-600 text-purple-100' :
                            node.componentType === 'provider' ? 'bg-orange-600 text-orange-100' :
                            node.componentType === 'fragment' ? 'bg-gray-600 text-gray-100' :
                            'bg-gray-500 text-gray-100'
                        }`}>
                            {node.componentType}
                        </span>
                        
                        {/* Key indicator */}
                        {node.key && (
                            <span className="text-xs text-gray-400 bg-gray-700 px-1 rounded">
                                key: {node.key}
                            </span>
                        )}
                        
                        {/* Children count */}
                        {node.children.length > 0 && (
                            <span className="text-xs text-gray-400 bg-gray-700 px-1 rounded">
                                {node.children.length} children
                            </span>
                        )}
                    </div>
                </div>
                
                {/* Render children */}
                {node.children.map((child, childIndex) => 
                    renderTreeNode(child, childIndex)
                )}
            </div>
        );
    };

    // Render selected node details
    const renderNodeDetails = () => {
        if (!selectedNode) return null;

        // Filter out circular references and React internal properties
        const safeProps = filterSafeProps(selectedNode.props);

        return (
            <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-lg font-semibold mb-3">Component Details</h4>
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="text-gray-400">Component Name:</span>
                            <span className="ml-2 font-mono font-medium">{selectedNode.name}</span>
                        </div>
                        <div>
                            <span className="text-gray-400">Component Type:</span>
                            <span className={`ml-2 px-2 py-1 rounded text-xs ${
                                selectedNode.componentType === 'function' ? 'bg-green-600' :
                                selectedNode.componentType === 'class' ? 'bg-blue-600' :
                                selectedNode.componentType === 'context' ? 'bg-purple-600' :
                                selectedNode.componentType === 'provider' ? 'bg-orange-600' :
                                selectedNode.componentType === 'fragment' ? 'bg-gray-600' :
                                'bg-gray-500'
                            }`}>
                                {selectedNode.componentType}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-400">Depth:</span>
                            <span className="ml-2">{selectedNode.depth}</span>
                        </div>
                        <div>
                            <span className="text-gray-400">Children:</span>
                            <span className="ml-2">{selectedNode.children.length}</span>
                        </div>
                    </div>
                    
                    {selectedNode.key && (
                        <div>
                            <span className="text-gray-400">Key:</span>
                            <span className="ml-2 font-mono bg-gray-700 px-2 py-1 rounded text-sm">
                                {selectedNode.key}
                            </span>
                        </div>
                    )}
                    
                    {Object.keys(safeProps).length > 0 && (
                        <div>
                            <span className="text-gray-400">Props:</span>
                            <pre className="mt-2 p-3 bg-gray-900 rounded text-xs overflow-auto max-h-40 border border-gray-700">
                                {JSON.stringify(safeProps, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Filter out circular references and React internal properties
    const filterSafeProps = (props: Record<string, any>): Record<string, any> => {
        const safeProps: Record<string, any> = {};
        const seen = new WeakSet();

        const filterValue = (value: any): any => {
            // Handle null and undefined
            if (value === null || value === undefined) {
                return value;
            }

            // Handle primitives
            if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                return value;
            }

            // Handle arrays
            if (Array.isArray(value)) {
                return value.map(filterValue);
            }

            // Handle objects
            if (typeof value === 'object') {
                // Check for circular references
                if (seen.has(value)) {
                    return '[Circular Reference]';
                }

                // Skip React internal objects
                if (value.constructor && value.constructor.name === 'FiberNode') {
                    return '[React Fiber Node]';
                }

                if (value.constructor && value.constructor.name === 'HTMLDivElement') {
                    return '[DOM Element]';
                }

                // Skip React internal properties
                if (typeof value === 'object' && (
                    value.$$typeof || 
                    value._owner || 
                    value._store || 
                    value.ref || 
                    value.key ||
                    value.props ||
                    value.state ||
                    value.context ||
                    value.updater ||
                    value._reactInternalInstance ||
                    value._reactInternalFiber
                )) {
                    return '[React Internal Object]';
                }

                seen.add(value);
                const filtered: Record<string, any> = {};
                
                for (const key in value) {
                    // Skip React internal property names
                    if (key.startsWith('__react') || 
                        key.startsWith('_react') || 
                        key === 'ref' || 
                        key === 'key' ||
                        key === 'children' ||
                        key === 'type' ||
                        key === 'props' ||
                        key === 'state' ||
                        key === 'context' ||
                        key === 'updater' ||
                        key === '_owner' ||
                        key === '_store' ||
                        key === '_self' ||
                        key === '_source' ||
                        key === '$$typeof') {
                        continue;
                    }

                    try {
                        filtered[key] = filterValue(value[key]);
                    } catch (error) {
                        filtered[key] = '[Error: Cannot serialize]';
                    }
                }

                seen.delete(value);
                return filtered;
            }

            // Handle functions
            if (typeof value === 'function') {
                return `[Function: ${value.name || 'anonymous'}]`;
            }

            // Handle other types
            return `[${typeof value}]`;
        };

        try {
            return filterValue(props);
        } catch (error) {
            console.warn('Error filtering props:', error);
            return { '[Error]': 'Failed to serialize props' };
        }
    };

    // Extract component information from React fiber (original method)
    const extractComponentInfo = (fiber: any) => {
        if (!fiber) return null;

        let currentFiber = fiber;
        while (currentFiber) {
            if (currentFiber.type) {
                const type = currentFiber.type;
                let name = 'Unknown';
                let componentType: ComponentNode['componentType'] = 'unknown';

                if (typeof type === 'function') {
                    name = type.name || type.displayName || 'AnonymousComponent';
                    componentType = type.prototype && type.prototype.isReactComponent ? 'class' : 'function';
                } else if (typeof type === 'string') {
                    // Skip DOM elements in component-focused view
                    return null;
                } else if (type && typeof type === 'object') {
                    name = type.displayName || type.name || 'Component';
                    if (type.$$typeof === Symbol.for('react.context')) {
                        componentType = 'context';
                    } else if (type.$$typeof === Symbol.for('react.provider')) {
                        componentType = 'provider';
                    } else if (type.$$typeof === Symbol.for('react.fragment')) {
                        componentType = 'fragment';
                    } else if (type.$$typeof === Symbol.for('react.memo')) {
                        componentType = 'function';
                    } else if (type.$$typeof === Symbol.for('react.forward_ref')) {
                        componentType = 'function';
                    } else {
                        componentType = 'class';
                    }
                }

                return {
                    name,
                    type: componentType,
                    props: currentFiber.memoizedProps || {},
                    key: currentFiber.key,
                    componentType
                };
            }
            currentFiber = currentFiber.return;
        }

        return null;
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 text-white rounded-lg shadow-xl w-11/12 h-5/6 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold">React Component Tree Analyzer (Debug)</h3>
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
                            onClick={analyzeComponentTree}
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
                        <span className="text-green-400 text-sm">
                            Debug Mode
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Component Tree */}
                    <div className="w-1/2 p-4 border-r border-gray-700 overflow-auto">
                        <h4 className="text-md font-semibold mb-3">React Component Tree Structure</h4>
                        {componentTree.length === 0 ? (
                            <div className="text-gray-400">
                                <p>Click "Analyze React Component Tree" to start</p>
                                <p className="text-sm mt-2">This tool focuses on React components and does not show DOM elements</p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {componentTree.map((node, index) => renderTreeNode(node, index))}
                            </div>
                        )}
                    </div>

                    {/* Details Panel */}
                    <div className="w-1/2 p-4 overflow-auto">
                        <h4 className="text-md font-semibold mb-3">Debug Information</h4>
                        <div className="space-y-4">
                            {/* Debug Info */}
                            <div className="bg-gray-800 p-3 rounded-lg">
                                <h5 className="text-sm font-semibold mb-2">Debug Log</h5>
                                <div className="text-xs space-y-1 max-h-32 overflow-auto">
                                    {debugInfo.map((log, index) => (
                                        <div key={index} className="text-gray-300 font-mono">
                                            {log}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Component Details */}
                            {selectedNode && renderNodeDetails()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 
