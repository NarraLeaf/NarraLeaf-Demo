import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'narraleaf-react';

// Extend Window interface for React DevTools
declare global {
    interface Window {
        __REACT_DEVTOOLS_GLOBAL_HOOK__?: any;
        React?: any;
        ReactDOM?: any;
    }
}

interface ComponentNode {
    id: string;
    name: string;
    type: string;
    props: Record<string, any>;
    state: Record<string, any>;
    children: ComponentNode[];
    depth: number;
    key?: string;
    isVisible: boolean;
    isMounted: boolean;
    componentType: 'function' | 'class' | 'context' | 'provider' | 'fragment' | 'unknown';
    renderCount: number;
    lastRenderTime: number;
    hooks: HookInfo[];
    errorBoundary?: boolean;
    lazy?: boolean;
    memo?: boolean;
    forwardRef?: boolean;
}

interface HookInfo {
    name: string;
    value: any;
    deps?: any[];
}

interface ComprehensiveComponentAnalyzerProps {
    isVisible: boolean;
    onClose: () => void;
}

export function ComprehensiveComponentAnalyzer({ isVisible, onClose }: ComprehensiveComponentAnalyzerProps) {
    const [components, setComponents] = useState<ComponentNode[]>([]);
    const [selectedComponent, setSelectedComponent] = useState<ComponentNode | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisTime, setAnalysisTime] = useState(0);
    const [shouldCancel, setShouldCancel] = useState(false);
    const [expandedComponents, setExpandedComponents] = useState<Set<string>>(new Set());
    const router = useRouter();

    // Add debug log with performance protection
    const addDebugLog = (message: string) => {
        // Check if analysis should be cancelled
        if (shouldCancel) {
            throw new Error('Analysis cancelled by user');
        }

        // Only log to console, don't update UI state
        console.log(`[ComprehensiveAnalyzer] ${message}`);
    };

    // Cancel analysis
    const cancelAnalysis = () => {
        setShouldCancel(true);
        addDebugLog('用户取消分析');
    };

    // Analyze components using multiple methods
    const analyzeComponents = useCallback(async () => {
        setIsAnalyzing(true);
        setShouldCancel(false);
        const startTime = performance.now();

        addDebugLog('开始全面组件分析...');

        // First, detect React environment
        detectReactEnvironment();

        try {
            let allComponents: ComponentNode[] = [];

            // Method 1: DOM-based analysis (mounted components)
            addDebugLog('方法1: DOM分析 (已挂载组件)...');
            const domComponents = analyzeDOMComponents();
            addDebugLog(`DOM分析找到 ${domComponents.length} 个已挂载组件`);
            allComponents.push(...domComponents);

            // Method 2: Fiber tree analysis (all components in memory)
            addDebugLog('方法2: Fiber树分析 (内存中的组件)...');
            const fiberComponents = analyzeFiberTree();
            addDebugLog(`Fiber分析找到 ${fiberComponents.length} 个组件`);
            allComponents.push(...fiberComponents);

            // Method 3: Global component registry analysis
            addDebugLog('方法3: 全局组件注册表分析...');
            const registryComponents = analyzeGlobalComponentRegistry();
            addDebugLog(`注册表分析找到 ${registryComponents.length} 个组件`);
            allComponents.push(...registryComponents);

            // Method 4: React internal state analysis
            addDebugLog('方法4: React内部状态分析...');
            const internalComponents = analyzeReactInternalState();
            addDebugLog(`内部状态分析找到 ${internalComponents.length} 个组件`);
            allComponents.push(...internalComponents);

            // Method 5: Direct React detection
            addDebugLog('方法5: 直接React检测...');
            const directComponents = analyzeDirectReactDetection();
            addDebugLog(`直接检测找到 ${directComponents.length} 个组件`);
            allComponents.push(...directComponents);

            // Method 6: Deep component detection
            addDebugLog('方法6: 深层组件检测...');
            const deepComponents = analyzeDeepComponents();
            addDebugLog(`深层检测找到 ${deepComponents.length} 个组件`);
            allComponents.push(...deepComponents);

            // Assign depth to components that don't have proper depth
            assignDepthToComponents(allComponents);

            // Deduplicate and merge components
            const uniqueComponents = deduplicateComponents(allComponents);
            addDebugLog(`去重后总共找到 ${uniqueComponents.length} 个唯一组件`);

            // Build component hierarchy
            const tree = buildComprehensiveHierarchy(uniqueComponents as ComponentNode[]);
            setComponents(tree as ComponentNode[]);

            const endTime = performance.now();
            setAnalysisTime(endTime - startTime);
            addDebugLog(`分析完成，耗时 ${(endTime - startTime).toFixed(2)}ms`);
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : '未知错误';
            addDebugLog(`分析失败: ${errorMsg}`);
            console.error('Comprehensive component analysis failed:', error);
        } finally {
            setIsAnalyzing(false);
            setShouldCancel(false);
        }
    }, []);

    // Detect React environment
    const detectReactEnvironment = () => {
        addDebugLog('检测React环境...');
        
        // Check for React in global scope
        if (window.React) {
            addDebugLog(`找到React: ${window.React.version}`);
        } else {
            addDebugLog('未找到React在全局作用域');
        }

        // Check for ReactDOM
        if (window.ReactDOM) {
            addDebugLog(`找到ReactDOM: ${window.ReactDOM.version}`);
        } else {
            addDebugLog('未找到ReactDOM在全局作用域');
        }

        // Check for React DevTools
        if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
            addDebugLog('找到React DevTools全局钩子');
        } else {
            addDebugLog('未找到React DevTools全局钩子');
        }

        // Check for React internal objects
        const reactInternalKeys = Object.keys(window).filter(key => 
            key.includes('react') || key.includes('React')
        );
        addDebugLog(`全局作用域中的React相关键: ${reactInternalKeys.join(', ')}`);

        // Check document for React attributes
        const reactAttributes = ['data-reactroot', 'data-reactid', 'data-react'];
        reactAttributes.forEach(attr => {
            const elements = document.querySelectorAll(`[${attr}]`);
            if (elements.length > 0) {
                addDebugLog(`找到 ${elements.length} 个元素包含 ${attr} 属性`);
            }
        });
    };

    // Direct React detection method
    const analyzeDirectReactDetection = (): ComponentNode[] => {
        const components: ComponentNode[] = [];

        try {
            addDebugLog('开始直接React检测...');

            // Method 1: Check for React DevTools hook
            if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
                addDebugLog('使用React DevTools钩子检测组件...');
                const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
                
                if (hook.renderers && hook.renderers.size > 0) {
                    addDebugLog(`找到 ${hook.renderers.size} 个React渲染器`);
                    hook.renderers.forEach((renderer: any, id: string) => {
                        addDebugLog(`渲染器 ${id}: ${renderer.constructor?.name}`);
                        
                        if (renderer.getCurrentFiber) {
                            try {
                                const fiber = renderer.getCurrentFiber();
                                if (fiber) {
                                    addDebugLog(`通过渲染器找到Fiber: ${fiber.constructor?.name}`);
                                    const componentInfo = extractComponentFromFiber(fiber, false);
                                    if (componentInfo) {
                                        componentInfo.type = 'direct';
                                        components.push(componentInfo);
                                    }
                                }
                            } catch (e) {
                                addDebugLog(`渲染器获取Fiber失败: ${e}`);
                            }
                        }
                    });
                }
            }

            // Method 2: Check for React internal roots
            if (window.ReactDOM) {
                addDebugLog('检查ReactDOM内部根...');
                try {
                    // Try to access ReactDOM internal properties
                    const reactDOMKeys = Object.keys(window.ReactDOM);
                    addDebugLog(`ReactDOM属性: ${reactDOMKeys.join(', ')}`);
                    
                    // Look for internal roots using any type
                    const reactDOM = window.ReactDOM as any;
                    if (reactDOM._internalRoot) {
                        addDebugLog('找到ReactDOM内部根');
                        const internalRoot = reactDOM._internalRoot;
                        if (internalRoot.current) {
                            traverseFiberTree(internalRoot.current, components, new Set(), 0);
                        }
                    }
                } catch (e) {
                    addDebugLog(`ReactDOM内部访问失败: ${e}`);
                }
            }

            // Method 3: Check for React internal instances
            addDebugLog('检查React内部实例...');
            const allElements = document.querySelectorAll('*');
            let internalInstancesFound = 0;
            let fiberNodesFound = 0;
            let componentsFound = 0;

            allElements.forEach((element, index) => {
                // Only log every 200th element to reduce spam
                if (index % 200 === 0) {
                    addDebugLog(`已检查 ${index}/${allElements.length} 个元素的内部实例`);
                }

                // Try to access React internal instance directly
                const keys = Object.keys(element);
                const internalKeys = keys.filter(key => 
                    key.includes('internal') || 
                    key.includes('fiber') || 
                    key.includes('react')
                );

                if (internalKeys.length > 0) {
                    internalInstancesFound++;
                    internalKeys.forEach(key => {
                        try {
                            const instance = (element as any)[key];
                            if (instance && typeof instance === 'object') {
                                // Only log first few instances to reduce spam
                                if (internalInstancesFound <= 10) {
                                    addDebugLog(`找到内部实例: ${instance.constructor?.name} 在元素 ${element.tagName}`);
                                }
                                
                                // Check if it's a FiberNode
                                if (instance.constructor?.name === 'FiberNode') {
                                    fiberNodesFound++;
                                    
                                    // Only log first few instances to reduce spam
                                    if (fiberNodesFound <= 5) {
                                        addDebugLog(`找到FiberNode: ${instance.type?.name || instance.type?.displayName || 'Unknown'}`);
                                    }
                                    
                                    // Check if it's a React component instance
                                    if (instance.type && typeof instance.type === 'function') {
                                        const componentInfo = extractComponentFromFiber(instance, true);
                                        if (componentInfo) {
                                            componentInfo.type = 'direct';
                                            components.push(componentInfo);
                                            componentsFound++;
                                            addDebugLog(`成功提取组件: ${componentInfo.name}`);
                                        }
                                    } else if (instance.type && typeof instance.type === 'object') {
                                        const componentInfo = extractComponentFromFiber(instance, true);
                                        if (componentInfo) {
                                            componentInfo.type = 'direct';
                                            components.push(componentInfo);
                                            componentsFound++;
                                            addDebugLog(`成功提取对象组件: ${componentInfo.name}`);
                                        }
                                    } else if (instance.type && typeof instance.type === 'string') {
                                        // Try to find React components by traversing up the fiber tree
                                        const parentComponents = findParentComponents(instance);
                                        if (parentComponents.length > 0) {
                                            addDebugLog(`通过向上遍历找到 ${parentComponents.length} 个父组件`);
                                            parentComponents.forEach(comp => comp.type = 'direct');
                                            components.push(...parentComponents);
                                            componentsFound += parentComponents.length;
                                        }
                                    }
                                } else if (instance.type && typeof instance.type === 'function') {
                                    const componentInfo = extractComponentFromFiber(instance, true);
                                    if (componentInfo) {
                                        componentInfo.type = 'direct';
                                        components.push(componentInfo);
                                        componentsFound++;
                                        addDebugLog(`成功提取组件: ${componentInfo.name}`);
                                    }
                                }
                            }
                        } catch (e) {
                            // Only log first few errors to reduce spam
                            if (internalInstancesFound <= 5) {
                                addDebugLog(`访问内部实例失败: ${e}`);
                            }
                        }
                    });
                }
            });

            addDebugLog(`找到 ${internalInstancesFound} 个元素包含内部实例`);
            addDebugLog(`找到 ${fiberNodesFound} 个FiberNode`);
            addDebugLog(`成功提取 ${componentsFound} 个组件`);

            // Method 4: Check for React components in memory
            addDebugLog('检查内存中的React组件...');
            const memoryComponents = findReactComponentsInMemory();
            memoryComponents.forEach(comp => comp.type = 'direct');
            components.push(...memoryComponents);

        } catch (error) {
            addDebugLog(`直接React检测错误: ${error}`);
        }

        return components;
    };

    // Find React components in memory
    const findReactComponentsInMemory = (): ComponentNode[] => {
        const components: ComponentNode[] = [];

        try {
            // Look for components in various scopes
            const scopes = [
                window,
                document,
                document.body,
                ...Array.from(document.querySelectorAll('*')).slice(0, 10) // Check first 10 elements
            ];

            scopes.forEach((scope, index) => {
                if (scope && typeof scope === 'object') {
                    const scopeKeys = Object.keys(scope);
                    const reactKeys = scopeKeys.filter(key => 
                        key.toLowerCase().includes('react') ||
                        key.toLowerCase().includes('component') ||
                        key.toLowerCase().includes('fiber')
                    );

                    if (reactKeys.length > 0) {
                        addDebugLog(`作用域 ${index} 包含React键: ${reactKeys.join(', ')}`);
                        
                        reactKeys.forEach(key => {
                            try {
                                const obj = (scope as any)[key];
                                if (obj && typeof obj === 'function') {
                                    // Check if it's a React component
                                    if (obj.prototype && obj.prototype.isReactComponent) {
                                        const component: ComponentNode = {
                                            id: `memory-class-${key}-${obj.name || 'anonymous'}`,
                                            name: key,
                                            type: 'memory',
                                            props: {},
                                            state: {},
                                            children: [],
                                            depth: 0,
                                            isVisible: false,
                                            isMounted: false,
                                            componentType: 'class',
                                            renderCount: 0,
                                            lastRenderTime: 0,
                                            hooks: []
                                        };
                                        components.push(component);
                                        addDebugLog(`找到内存中的类组件: ${key}`);
                                    } else if (obj.displayName || obj.name) {
                                        const component: ComponentNode = {
                                            id: `memory-function-${key}-${obj.displayName || obj.name || 'anonymous'}`,
                                            name: obj.displayName || obj.name || key,
                                            type: 'memory',
                                            props: {},
                                            state: {},
                                            children: [],
                                            depth: 0,
                                            isVisible: false,
                                            isMounted: false,
                                            componentType: 'function',
                                            renderCount: 0,
                                            lastRenderTime: 0,
                                            hooks: []
                                        };
                                        components.push(component);
                                        addDebugLog(`找到内存中的函数组件: ${component.name}`);
                                    }
                                }
                            } catch (e) {
                                // Ignore access errors
                            }
                        });
                    }
                }
            });

        } catch (error) {
            addDebugLog(`内存组件检测错误: ${error}`);
        }

        return components;
    };

    // Analyze DOM-mounted components - Improved for deeper detection
    const analyzeDOMComponents = (): ComponentNode[] => {
        const components: ComponentNode[] = [];
        const processedFiber = new Set<any>();

        try {
            const allElements = document.querySelectorAll('*');
            addDebugLog(`扫描 ${allElements.length} 个DOM元素`);

            let fiberKeysFound = 0;
            let reactKeysFound = 0;
            let componentsFound = 0;

            allElements.forEach((element, index) => {
                const elementKeys = Object.keys(element);
                
                // Look for various React-related keys with more patterns
                const reactKeys = elementKeys.filter(key => 
                    key.includes('react') || 
                    key.includes('fiber') || 
                    key.includes('internal') ||
                    key.includes('__react') ||
                    key.includes('_react') ||
                    key.includes('React') ||
                    key.includes('Fiber')
                );

                if (reactKeys.length > 0) {
                    reactKeysFound++;
                }

                // Try different React key patterns with more variations
                const reactKey = elementKeys.find(key => 
                    key.startsWith('__reactFiber$') || 
                    key.startsWith('__reactInternalInstance$') ||
                    key.startsWith('_reactInternalInstance$') ||
                    key.startsWith('_reactInternalFiber$') ||
                    key.includes('reactFiber') ||
                    key.includes('reactInternal') ||
                    key.includes('ReactFiber') ||
                    key.includes('ReactInternal') ||
                    key.includes('__react') ||
                    key.includes('_react')
                );

                if (reactKey) {
                    fiberKeysFound++;
                    const fiber = (element as any)[reactKey];
                    
                    if (fiber && !processedFiber.has(fiber)) {
                        processedFiber.add(fiber);
                        
                        // Check if it's a FiberNode
                        if (fiber.constructor?.name === 'FiberNode') {
                            // Check if it's a React component (not a DOM element)
                            if (fiber.type && typeof fiber.type !== 'string') {
                                const componentInfo = extractComponentFromFiber(fiber, true);
                                if (componentInfo) {
                                    componentInfo.type = 'dom'; // Mark as DOM component
                                    components.push(componentInfo);
                                    componentsFound++;
                                    addDebugLog(`找到DOM组件: ${componentInfo.name}`);
                                }
                            } else {
                                // Try to find React components by traversing up the fiber tree
                                const parentComponents = findParentComponents(fiber);
                                if (parentComponents.length > 0) {
                                    addDebugLog(`通过向上遍历找到 ${parentComponents.length} 个DOM组件`);
                                    parentComponents.forEach(comp => comp.type = 'dom');
                                    components.push(...parentComponents);
                                    componentsFound += parentComponents.length;
                                }
                            }
                        } else {
                            const componentInfo = extractComponentFromFiber(fiber, true);
                            if (componentInfo) {
                                componentInfo.type = 'dom'; // Mark as DOM component
                                components.push(componentInfo);
                                componentsFound++;
                                addDebugLog(`找到DOM组件: ${componentInfo.name}`);
                            }
                        }
                    }
                }

                // Also check for React internal properties directly
                reactKeys.forEach(key => {
                    try {
                        const value = (element as any)[key];
                        if (value && typeof value === 'object' && value.type) {
                            const componentInfo = extractComponentFromFiber(value, true);
                            if (componentInfo && !processedFiber.has(value)) {
                                processedFiber.add(value);
                                componentInfo.type = 'dom';
                                components.push(componentInfo);
                                componentsFound++;
                                addDebugLog(`通过React键 ${key} 找到DOM组件: ${componentInfo.name}`);
                            }
                        }
                    } catch (e) {
                        // Ignore access errors
                    }
                });
            });

            addDebugLog(`DOM分析完成: ${reactKeysFound} 个React元素, ${fiberKeysFound} 个Fiber, ${componentsFound} 个组件`);

        } catch (error) {
            addDebugLog(`DOM分析错误: ${error}`);
        }

        return components;
    };

    // Analyze Fiber tree (including unmounted components) - Improved for deeper detection
    const analyzeFiberTree = (): ComponentNode[] => {
        const components: ComponentNode[] = [];
        const processedFiber = new Set<any>();

        try {
            // Try to find React roots with more patterns
            const rootSelectors = [
                '[data-reactroot]', 
                '[data-reactid]',
                '#root',
                '#app',
                '[id*="root"]',
                '[id*="app"]',
                'body > div',
                'body > *',
                '*[class*="root"]',
                '*[class*="app"]',
                'div',
                'main',
                'section'
            ];

            let rootElements: Element[] = [];
            rootSelectors.forEach(selector => {
                try {
                    const elements = document.querySelectorAll(selector);
                    rootElements.push(...Array.from(elements));
                } catch (e) {
                    // Ignore invalid selectors
                }
            });

            // Remove duplicates
            rootElements = Array.from(new Set(rootElements));
            addDebugLog(`尝试 ${rootSelectors.length} 种选择器，找到 ${rootElements.length} 个可能的根元素`);

            rootElements.forEach((rootElement, index) => {
                addDebugLog(`检查根元素 ${index}: ${rootElement.tagName}${rootElement.id ? '#' + rootElement.id : ''}`);
                
                const elementKeys = Object.keys(rootElement);
                const reactKeys = elementKeys.filter(key => 
                    key.includes('react') || 
                    key.includes('fiber') || 
                    key.includes('internal')
                );

                if (reactKeys.length > 0) {
                    addDebugLog(`根元素 ${index} 包含React键: ${reactKeys.join(', ')}`);
                }

                const reactKey = elementKeys.find(key => 
                    key.startsWith('__reactFiber$') || 
                    key.startsWith('__reactInternalInstance$') ||
                    key.startsWith('_reactInternalInstance$') ||
                    key.startsWith('_reactInternalFiber$') ||
                    key.includes('reactFiber') ||
                    key.includes('reactInternal')
                );

                if (reactKey) {
                    const fiber = (rootElement as any)[reactKey];
                    addDebugLog(`根元素 ${index} 找到Fiber: ${fiber?.constructor?.name}`);
                    if (fiber) {
                        // If it's a DOM element fiber, try to find parent components
                        if (fiber.type && typeof fiber.type === 'string') {
                            addDebugLog(`根元素Fiber是DOM元素: ${fiber.type}`);
                            const parentComponents = findParentComponents(fiber);
                            if (parentComponents.length > 0) {
                                addDebugLog(`通过向上遍历找到 ${parentComponents.length} 个父组件`);
                                parentComponents.forEach(comp => comp.type = 'fiber');
                                components.push(...parentComponents);
                            }
                        } else {
                            traverseFiberTree(fiber, components, processedFiber, 0);
                        }
                    }
                }
            });

            // Also scan for any fiber in memory with more aggressive approach
            if (components.length === 0) {
                addDebugLog('尝试更激进的Fiber扫描...');
                const allElements = document.querySelectorAll('*');
                let scannedElements = 0;
                
                allElements.forEach(element => {
                    scannedElements++;
                    if (scannedElements % 50 === 0) {
                        addDebugLog(`已扫描 ${scannedElements}/${allElements.length} 个元素`);
                    }

                    const elementKeys = Object.keys(element);
                    const reactKey = elementKeys.find(key => 
                        key.includes('react') || 
                        key.includes('fiber') ||
                        key.includes('internal') ||
                        key.includes('__react') ||
                        key.includes('_react')
                    );
                    
                    if (reactKey) {
                        const fiber = (element as any)[reactKey];
                        if (fiber && !processedFiber.has(fiber)) {
                            processedFiber.add(fiber);
                            addDebugLog(`找到Fiber: ${fiber?.constructor?.name} 在元素 ${element.tagName}`);
                            traverseFiberTree(fiber, components, processedFiber, 0);
                        }
                    }
                });
            }

            // Try to find React roots in global scope with more patterns
            if (components.length === 0) {
                addDebugLog('尝试在全局作用域中查找React根...');
                const globalKeys = Object.keys(window);
                const reactGlobalKeys = globalKeys.filter(key => 
                    key.toLowerCase().includes('react') ||
                    key.toLowerCase().includes('root') ||
                    key.toLowerCase().includes('app') ||
                    key.toLowerCase().includes('fiber') ||
                    key.toLowerCase().includes('component')
                );
                
                addDebugLog(`全局作用域中找到React相关键: ${reactGlobalKeys.join(', ')}`);
                
                reactGlobalKeys.forEach(key => {
                    const globalObj = (window as any)[key];
                    if (globalObj && typeof globalObj === 'object') {
                        addDebugLog(`检查全局对象: ${key}, 类型: ${globalObj.constructor?.name}`);
                        // Try to find fiber in global objects
                        const objKeys = Object.keys(globalObj);
                        const fiberKeys = objKeys.filter(k => k.includes('fiber') || k.includes('react'));
                        if (fiberKeys.length > 0) {
                            addDebugLog(`全局对象 ${key} 包含Fiber键: ${fiberKeys.join(', ')}`);
                            
                            // Try to traverse fibers found in global objects
                            fiberKeys.forEach(fiberKey => {
                                try {
                                    const fiber = globalObj[fiberKey];
                                    if (fiber && !processedFiber.has(fiber)) {
                                        processedFiber.add(fiber);
                                        addDebugLog(`从全局对象 ${key} 找到Fiber: ${fiber?.constructor?.name}`);
                                        traverseFiberTree(fiber, components, processedFiber, 0);
                                    }
                                } catch (e) {
                                    // Ignore access errors
                                }
                            });
                        }
                    }
                });
            }

            // Mark all components from this method as fiber type
            components.forEach(comp => {
                if (!comp.type || comp.type === 'unknown') {
                    comp.type = 'fiber';
                }
            });

        } catch (error) {
            addDebugLog(`Fiber树分析错误: ${error}`);
        }

        return components;
    };

    // Analyze global component registry
    const analyzeGlobalComponentRegistry = (): ComponentNode[] => {
        const components: ComponentNode[] = [];

        try {
            // Look for components in global scope
            const globalObjects = Object.keys(window);
            addDebugLog(`扫描 ${globalObjects.length} 个全局对象`);
            
            const componentPatterns = [
                /Component$/,
                /Provider$/,
                /Context$/,
                /Container$/,
                /Wrapper$/,
                /Layout$/,
                /Page$/,
                /Screen$/,
                /App$/,
                /Player$/,
                /Panel$/,
                /Menu$/,
                /Dialog$/,
                /Modal$/,
                /Form$/,
                /Button$/,
                /Input$/,
                /Text$/,
                /Image$/,
                /Video$/
            ];

            let potentialComponents = 0;

            globalObjects.forEach(key => {
                const obj = (window as any)[key];
                if (obj && typeof obj === 'function') {
                    // Check if it looks like a React component
                    const isReactComponent = componentPatterns.some(pattern => pattern.test(key)) ||
                        (obj.prototype && obj.prototype.isReactComponent) ||
                        (obj.displayName && componentPatterns.some(pattern => pattern.test(obj.displayName))) ||
                        (obj.name && componentPatterns.some(pattern => pattern.test(obj.name))) ||
                        (obj.render && typeof obj.render === 'function') ||
                        (obj.prototype && obj.prototype.render && typeof obj.prototype.render === 'function');

                    if (isReactComponent) {
                        potentialComponents++;
                        const component: ComponentNode = {
                            id: `global-${key}-${obj.name || obj.displayName || 'anonymous'}`,
                            name: key,
                            type: 'global',
                            props: {},
                            state: {},
                            children: [],
                            depth: 0,
                            isVisible: false,
                            isMounted: false,
                            componentType: 'function',
                            renderCount: 0,
                            lastRenderTime: 0,
                            hooks: []
                        };
                        components.push(component);
                        addDebugLog(`找到全局组件: ${key}`);
                    }
                }
            });

            addDebugLog(`找到 ${potentialComponents} 个潜在的React组件`);
            addDebugLog(`成功识别 ${components.length} 个全局组件`);

        } catch (error) {
            addDebugLog(`全局注册表分析错误: ${error}`);
        }

        return components;
    };

    // Analyze React internal state
    const analyzeReactInternalState = (): ComponentNode[] => {
        const components: ComponentNode[] = [];

        try {
            addDebugLog('开始React内部状态分析...');
            
            // Look for React internal state in memory
            const allElements = document.querySelectorAll('*');
            addDebugLog(`扫描 ${allElements.length} 个元素的React内部状态`);
            
            const reactStatePatterns = [
                '__reactInternalInstance$',
                '__reactFiber$',
                '_reactInternalFiber',
                '_reactInternalInstance',
                '__reactProps$',
                '__reactState$',
                '__reactContext$'
            ];

            let elementsWithReactState = 0;
            let fibersFound = 0;

            allElements.forEach((element, index) => {
                if (index % 50 === 0) {
                    addDebugLog(`已扫描 ${index}/${allElements.length} 个元素`);
                }

                reactStatePatterns.forEach(pattern => {
                    const keys = Object.keys(element).filter(key => key.includes(pattern));
                    if (keys.length > 0) {
                        elementsWithReactState++;
                        keys.forEach(key => {
                            const fiber = (element as any)[key];
                            if (fiber && fiber.memoizedState) {
                                fibersFound++;
                                addDebugLog(`找到带状态的Fiber: ${fiber.constructor?.name} 在元素 ${element.tagName}`);
                                // Extract component info from memoized state
                                const componentInfo = extractComponentFromMemoizedState(fiber);
                                if (componentInfo) {
                                    componentInfo.type = 'internal';
                                    components.push(componentInfo);
                                }
                            }
                        });
                    }
                });
            });

            addDebugLog(`找到 ${elementsWithReactState} 个元素包含React状态`);
            addDebugLog(`找到 ${fibersFound} 个带状态的Fiber`);

        } catch (error) {
            addDebugLog(`React内部状态分析错误: ${error}`);
        }

        return components;
    };

    // Traverse Fiber tree recursively - Improved to capture parent-child relationships
    const traverseFiberTree = (fiber: any, components: ComponentNode[], processedFiber: Set<any>, depth: number) => {
        if (!fiber || processedFiber.has(fiber) || depth > 100) return; // Increased depth limit

        processedFiber.add(fiber);

        addDebugLog(`遍历Fiber: ${fiber.constructor?.name}, 深度: ${depth}`);

        // Check if this fiber represents a component
        if (fiber.type) {
            addDebugLog(`Fiber type: ${typeof fiber.type}, 值: ${fiber.type?.name || fiber.type?.displayName || fiber.type}`);
            
            // Only process if it's not a DOM element (string type)
            if (typeof fiber.type !== 'string') {
                const componentInfo = extractComponentFromFiber(fiber, false);
                if (componentInfo) {
                    componentInfo.depth = depth;
                    
                    // Try to find parent component from return fiber
                    if (fiber.return && fiber.return.type && typeof fiber.return.type !== 'string') {
                        const parentComponent = extractComponentFromFiber(fiber.return, false);
                        if (parentComponent) {
                            // Find the parent component in our list and add this as child
                            const existingParent = components.find(comp => 
                                comp.name === parentComponent.name && 
                                comp.componentType === parentComponent.componentType
                            );
                            if (existingParent) {
                                existingParent.children.push(componentInfo);
                                addDebugLog(`建立父子关系: ${existingParent.name} -> ${componentInfo.name}`);
                            } else {
                                components.push(componentInfo);
                                addDebugLog(`在深度 ${depth} 找到组件: ${componentInfo.name} (无父组件)`);
                            }
                        } else {
                            components.push(componentInfo);
                            addDebugLog(`在深度 ${depth} 找到组件: ${componentInfo.name} (父组件提取失败)`);
                        }
                    } else {
                        components.push(componentInfo);
                        addDebugLog(`在深度 ${depth} 找到组件: ${componentInfo.name} (根组件)`);
                    }
                } else {
                    addDebugLog(`在深度 ${depth} 无法提取组件信息`);
                }
            } else {
                addDebugLog(`在深度 ${depth} 跳过DOM元素: ${fiber.type}`);
            }
        } else {
            addDebugLog(`在深度 ${depth} Fiber没有type属性`);
        }

        // Traverse children with more aggressive approach
        if (fiber.child) {
            addDebugLog(`在深度 ${depth} 遍历子Fiber`);
            traverseFiberTree(fiber.child, components, processedFiber, depth + 1);
        }

        // Traverse siblings
        if (fiber.sibling) {
            addDebugLog(`在深度 ${depth} 遍历兄弟Fiber`);
            traverseFiberTree(fiber.sibling, components, processedFiber, depth);
        }

        // Also traverse alternative fiber paths
        if (fiber.alternate) {
            addDebugLog(`在深度 ${depth} 遍历alternate Fiber`);
            traverseFiberTree(fiber.alternate, components, processedFiber, depth);
        }
    };

    // Extract component information from Fiber - Improved
    const extractComponentFromFiber = (fiber: any, isMounted: boolean): ComponentNode | null => {
        if (!fiber) return null;

        // Check if this is actually a component fiber
        if (!fiber.type) {
            return null;
        }

        const type = fiber.type;
        let name = 'Unknown';
        let componentType: ComponentNode['componentType'] = 'unknown';

        if (typeof type === 'string') {
            // This is a DOM element, not a React component
            return null;
        }

        if (typeof type === 'function') {
            name = type.name || type.displayName || 'AnonymousComponent';
            componentType = type.prototype && type.prototype.isReactComponent ? 'class' : 'function';
        } else if (type && typeof type === 'object') {
            name = type.displayName || type.name || 'Component';
            
            // Check for React element types
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
            } else if (type.$$typeof === Symbol.for('react.lazy')) {
                componentType = 'function';
            } else {
                componentType = 'class';
            }
        } else {
            return null;
        }

        // Extract hooks information
        const hooks = extractHooksFromFiber(fiber);

        // Extract props safely
        let props = {};
        try {
            if (fiber.memoizedProps) {
                props = fiber.memoizedProps;
            }
        } catch (e) {
            // Ignore props extraction errors
        }

        // Extract state safely
        let state = {};
        try {
            state = extractStateFromFiber(fiber);
        } catch (e) {
            // Ignore state extraction errors
        }

        // Generate a more stable ID based on component name and fiber reference
        const id = `${name}-${componentType}-${fiber.key || 'no-key'}-${fiber.tag || 'no-tag'}-${fiber.return ? 'child' : 'root'}`;

        const component: ComponentNode = {
            id,
            name,
            type: componentType,
            props,
            state,
            children: [],
            depth: 0, // Will be set by caller
            key: fiber.key,
            isVisible: isMounted,
            isMounted,
            componentType,
            renderCount: getRenderCount(fiber),
            lastRenderTime: getLastRenderTime(fiber),
            hooks,
            errorBoundary: isErrorBoundary(fiber),
            lazy: isLazyComponent(fiber),
            memo: isMemoComponent(fiber),
            forwardRef: isForwardRefComponent(fiber)
        };

        return component;
    };

    // Extract component from memoized state
    const extractComponentFromMemoizedState = (fiber: any): ComponentNode | null => {
        if (!fiber || !fiber.memoizedState) return null;

        // This is a simplified extraction - in practice you'd need more complex logic
        return {
            id: `memoized-${fiber.tag || 'unknown'}-${fiber.key || 'no-key'}`,
            name: 'MemoizedComponent',
            type: 'memoized',
            props: {},
            state: {},
            children: [],
            depth: 0,
            isVisible: false,
            isMounted: false,
            componentType: 'function',
            renderCount: 0,
            lastRenderTime: 0,
            hooks: []
        };
    };

    // Helper functions
    const extractHooksFromFiber = (fiber: any): HookInfo[] => {
        const hooks: HookInfo[] = [];
        
        if (fiber.memoizedState) {
            let currentState = fiber.memoizedState;
            let hookIndex = 0;
            
            while (currentState && hookIndex < 50) {
                if (currentState.queue) {
                    // Safely extract hook value
                    let hookValue;
                    try {
                        hookValue = currentState.memoizedState;
                        // Test if it can be serialized
                        JSON.stringify(hookValue);
                    } catch (e) {
                        hookValue = '[无法序列化的值]';
                    }
                    
                    hooks.push({
                        name: `useState_${hookIndex}`,
                        value: hookValue
                    });
                } else if (currentState.memoizedState) {
                    // Safely extract hook value
                    let hookValue;
                    try {
                        hookValue = currentState.memoizedState;
                        // Test if it can be serialized
                        JSON.stringify(hookValue);
                    } catch (e) {
                        hookValue = '[无法序列化的值]';
                    }
                    
                    hooks.push({
                        name: `useEffect_${hookIndex}`,
                        value: hookValue
                    });
                }
                currentState = currentState.next;
                hookIndex++;
            }
        }

        return hooks;
    };

    const extractStateFromFiber = (fiber: any): Record<string, any> => {
        const state: Record<string, any> = {};
        
        if (fiber.memoizedState) {
            let currentState = fiber.memoizedState;
            let hookIndex = 0;
            
            while (currentState && hookIndex < 50) {
                if (currentState.queue) {
                    // Safely extract state value
                    try {
                        const stateValue = currentState.memoizedState;
                        // Test if it can be serialized
                        JSON.stringify(stateValue);
                        state[`hook_${hookIndex}`] = stateValue;
                    } catch (e) {
                        state[`hook_${hookIndex}`] = '[无法序列化的值]';
                    }
                }
                currentState = currentState.next;
                hookIndex++;
            }
        }

        return state;
    };

    const getRenderCount = (fiber: any): number => {
        return Math.floor(Math.random() * 10) + 1; // Placeholder
    };

    const getLastRenderTime = (fiber: any): number => {
        return Math.random() * 5; // Placeholder
    };

    const isErrorBoundary = (fiber: any): boolean => {
        return fiber.type && fiber.type.prototype && 
               typeof fiber.type.prototype.componentDidCatch === 'function';
    };

    const isLazyComponent = (fiber: any): boolean => {
        return fiber.type && fiber.type.$$typeof === Symbol.for('react.lazy');
    };

    const isMemoComponent = (fiber: any): boolean => {
        return fiber.type && fiber.type.$$typeof === Symbol.for('react.memo');
    };

    const isForwardRefComponent = (fiber: any): boolean => {
        return fiber.type && fiber.type.$$typeof === Symbol.for('react.forward_ref');
    };

    // Deduplicate components - but keep genuine duplicates
    const deduplicateComponents = (components: ComponentNode[]): ComponentNode[] => {
        addDebugLog(`开始处理组件，原始组件数量: ${components.length}`);
        
        // Only remove exact duplicates (same ID, same name, same type, same depth)
        const uniqueMap = new Map<string, ComponentNode>();
        const duplicates: ComponentNode[] = [];
        
        components.forEach((component, index) => {
            // Create a key that includes all identifying information
            const key = `${component.name}-${component.componentType}-${component.depth}-${component.type}`;
            
            if (!uniqueMap.has(key)) {
                uniqueMap.set(key, component);
            } else {
                const existing = uniqueMap.get(key)!;
                // Check if this is truly the same component or just similar
                if (component.id === existing.id && 
                    component.name === existing.name && 
                    component.componentType === existing.componentType &&
                    component.depth === existing.depth) {
                    // This is an exact duplicate, skip it
                    addDebugLog(`跳过完全重复的组件: ${component.name}`);
                } else {
                    // This is a genuine duplicate (same name/type but different instance)
                    duplicates.push(component);
                    addDebugLog(`保留真正的重复组件: ${component.name} (实例 ${duplicates.length})`);
                }
            }
        });

        const result = [...Array.from(uniqueMap.values()), ...duplicates];
        addDebugLog(`处理完成，最终组件数量: ${result.length} (包含 ${duplicates.length} 个重复实例)`);
        
        // Log depth distribution for debugging
        const depthCounts = new Map<number, number>();
        result.forEach(comp => {
            const count = depthCounts.get(comp.depth) || 0;
            depthCounts.set(comp.depth, count + 1);
        });
        
        depthCounts.forEach((count, depth) => {
            addDebugLog(`深度 ${depth}: ${count} 个组件`);
        });
        
        return result;
    };

    // Build comprehensive hierarchy - Improved algorithm
    const buildComprehensiveHierarchy = (components: ComponentNode[]): ComponentNode[] => {
        if (components.length === 0) {
            return [];
        }

        addDebugLog(`开始构建层级，组件数量: ${components.length}`);

        // First, try to build hierarchy from actual Fiber relationships
        const fiberBasedHierarchy = buildFiberBasedHierarchy(components);
        if (fiberBasedHierarchy.length > 0) {
            addDebugLog(`使用Fiber关系构建层级，找到 ${fiberBasedHierarchy.length} 个根组件`);
            return fiberBasedHierarchy;
        }

        // Fallback to depth-based hierarchy
        addDebugLog('Fiber关系构建失败，使用深度基础层级构建');
        return buildDepthBasedHierarchy(components);
    };

    // Build hierarchy based on actual Fiber relationships - Improved
    const buildFiberBasedHierarchy = (components: ComponentNode[]): ComponentNode[] => {
        const componentMap = new Map<string, ComponentNode>();
        const rootComponents: ComponentNode[] = [];
        const processedComponents = new Set<string>();

        addDebugLog(`开始Fiber基础层级构建，组件数量: ${components.length}`);

        // Create a map for quick lookup
        components.forEach(comp => {
            componentMap.set(comp.id, comp);
        });

        // First pass: identify root components (components with depth 0 or no clear parent)
        const potentialRoots = components.filter(comp => 
            comp.depth === 0 || 
            comp.name.toLowerCase().includes('app') ||
            comp.name.toLowerCase().includes('root') ||
            comp.componentType === 'provider' ||
            comp.componentType === 'context'
        );

        addDebugLog(`找到 ${potentialRoots.length} 个潜在根组件`);

        // Second pass: build hierarchy based on depth relationships with improved logic
        components.forEach(component => {
            if (processedComponents.has(component.id)) return;

            // Look for components that might be children of this component
            const potentialChildren = components.filter(comp => 
                comp.id !== component.id && 
                !processedComponents.has(comp.id) &&
                comp.depth > component.depth &&
                comp.depth <= component.depth + 5 // Increased range for better nesting
            );

            if (potentialChildren.length > 0) {
                addDebugLog(`组件 ${component.name} 找到 ${potentialChildren.length} 个潜在子组件`);
                
                // Add children to this component with improved logic
                potentialChildren.forEach(child => {
                    if (!processedComponents.has(child.id)) {
                        // Improved parent-child relationship logic
                        const isReasonableParent = 
                            component.depth < child.depth &&
                            (
                                // Direct depth relationship
                                child.depth === component.depth + 1 ||
                                // Provider/Context relationships
                                (component.componentType as any) === 'provider' ||
                                (component.componentType as any) === 'context' ||
                                (component.componentType as any) === 'fragment' ||
                                // Name-based relationships
                                child.name.toLowerCase().includes(component.name.toLowerCase()) ||
                                component.name.toLowerCase().includes(child.name.toLowerCase()) ||
                                // Type-based relationships
                                ((component.componentType as any) === 'provider' && (child.componentType as any) !== 'provider') ||
                                ((component.componentType as any) === 'context' && (child.componentType as any) !== 'context') ||
                                // Sequential depth relationship (for nested components)
                                (child.depth <= component.depth + 2 && 
                                 !potentialChildren.some(otherChild => 
                                     otherChild.id !== child.id && 
                                     otherChild.depth < child.depth && 
                                     otherChild.depth > component.depth
                                 ))
                            );

                        if (isReasonableParent) {
                            component.children.push(child);
                            processedComponents.add(child.id);
                            addDebugLog(`建立Fiber关系: ${component.name} (深度: ${component.depth}) -> ${child.name} (深度: ${child.depth})`);
                        }
                    }
                });
            }

            // If this component has children or is a root-level component, add to roots
            if (component.children.length > 0 || component.depth === 0 || potentialRoots.includes(component)) {
                if (!processedComponents.has(component.id)) {
                    rootComponents.push(component);
                    processedComponents.add(component.id);
                    addDebugLog(`添加根组件: ${component.name} (深度: ${component.depth}, 子组件: ${component.children.length})`);
                }
            }
        });

        // Add remaining unprocessed components as root components
        components.forEach(component => {
            if (!processedComponents.has(component.id)) {
                rootComponents.push(component);
                processedComponents.add(component.id);
                addDebugLog(`添加未处理的根组件: ${component.name} (深度: ${component.depth})`);
            }
        });

        // Sort children for consistent display
        const sortChildren = (comps: ComponentNode[]) => {
            comps.forEach(comp => {
                if (comp.children.length > 0) {
                    comp.children.sort((a, b) => {
                        if (a.depth !== b.depth) {
                            return a.depth - b.depth;
                        }
                        return a.name.localeCompare(b.name);
                    });
                    sortChildren(comp.children);
                }
            });
        };
        sortChildren(rootComponents);

        addDebugLog(`Fiber基础层级构建完成，根组件数量: ${rootComponents.length}`);
        
        // Log the hierarchy for debugging
        const logHierarchy = (comps: ComponentNode[], level = 0): void => {
            if (!comps || comps.length === 0) return;
            comps.forEach((comp: ComponentNode) => {
                if (!comp) return;
                const indent = '  '.repeat(level);
                addDebugLog(`${indent}${comp.name} (深度: ${comp.depth}, 子组件: ${comp.children.length})`);
                if (comp.children && comp.children.length > 0) {
                    logHierarchy(comp.children, level + 1);
                }
            });
        };
        logHierarchy(rootComponents, 0);

        return rootComponents;
    };

    // Build hierarchy based on depth (fallback method)
    const buildDepthBasedHierarchy = (components: ComponentNode[]): ComponentNode[] => {
        // Sort components by depth first, then by name for consistency
        components.sort((a, b) => {
            if (a.depth !== b.depth) {
                return a.depth - b.depth;
            }
            return a.name.localeCompare(b.name);
        });

        // Group by depth
        const depthGroups = new Map<number, ComponentNode[]>();
        components.forEach(component => {
            const depth = component.depth;
            if (!depthGroups.has(depth)) {
                depthGroups.set(depth, []);
            }
            depthGroups.get(depth)!.push(component);
        });

        // Build hierarchy by connecting components across depths
        const rootComponents: ComponentNode[] = [];
        const processedComponents = new Set<string>();

        // Get all depth levels sorted
        const depthLevels = Array.from(depthGroups.keys()).sort((a, b) => a - b);
        addDebugLog(`深度级别: ${depthLevels.join(', ')}`);

        // Start with the lowest depth (root level)
        if (depthLevels.length > 0) {
            const rootDepth = depthLevels[0];
            const rootLevelComponents = depthGroups.get(rootDepth) || [];
            
            addDebugLog(`根级组件 (深度 ${rootDepth}): ${rootLevelComponents.length} 个`);
            rootLevelComponents.forEach(component => {
                rootComponents.push(component);
                processedComponents.add(component.id);
                addDebugLog(`添加根组件: ${component.name} (深度: ${component.depth})`);
            });

            // For each subsequent depth level, try to find parents
            for (let i = 1; i < depthLevels.length; i++) {
                const currentDepth = depthLevels[i];
                const currentLevelComponents = depthGroups.get(currentDepth) || [];
                
                addDebugLog(`处理深度 ${currentDepth} 的组件: ${currentLevelComponents.length} 个`);
                
                currentLevelComponents.forEach(component => {
                    if (processedComponents.has(component.id)) return;

                    // Find the best parent from the previous depth level
                    let bestParent: ComponentNode | null = null;
                    const previousDepth = depthLevels[i - 1];
                    const potentialParents = depthGroups.get(previousDepth) || [];
                    
                    // Improved parent selection logic
                    for (const potentialParent of potentialParents) {
                        if (processedComponents.has(potentialParent.id)) continue;
                        
                        // Check if this looks like a good parent-child relationship
                        const parentName = potentialParent.name.toLowerCase();
                        const childName = component.name.toLowerCase();
                        
                        const isGoodRelationship = 
                            parentName.includes('app') || parentName.includes('root') || // App/Root components
                            parentName.includes('provider') || parentName.includes('context') || // Provider/Context components
                            parentName.includes('layout') || parentName.includes('container') || // Layout/Container components
                            childName.includes(parentName) || // Child name contains parent name
                            parentName.includes(childName) || // Parent name contains child name
                            (potentialParent.componentType === 'provider' && component.componentType !== 'provider') || // Provider -> Component
                            (potentialParent.componentType === 'context' && component.componentType !== 'context') || // Context -> Component
                            (potentialParent.componentType === 'fragment' && component.componentType !== 'fragment'); // Fragment -> Component

                        if (isGoodRelationship) {
                            bestParent = potentialParent;
                            break;
                        }
                    }

                    if (bestParent) {
                        bestParent.children.push(component);
                        processedComponents.add(component.id);
                        addDebugLog(`设置父子关系: ${bestParent.name} (深度: ${bestParent.depth}) -> ${component.name} (深度: ${component.depth})`);
                    } else {
                        // If no good parent found, add to root
                        rootComponents.push(component);
                        processedComponents.add(component.id);
                        addDebugLog(`未找到父组件，设为根组件: ${component.name} (深度: ${component.depth})`);
                    }
                });
            }
        }

        // Sort children for consistent display
        const sortChildren = (comps: ComponentNode[]) => {
            comps.forEach(comp => {
                if (comp.children.length > 0) {
                    comp.children.sort((a, b) => {
                        if (a.depth !== b.depth) {
                            return a.depth - b.depth;
                        }
                        return a.name.localeCompare(b.name);
                    });
                    sortChildren(comp.children);
                }
            });
        };
        sortChildren(rootComponents);

        addDebugLog(`深度基础层级构建完成，根组件数量: ${rootComponents.length}`);
        
        // Log the hierarchy for debugging
        const logHierarchy = (comps: ComponentNode[], level = 0): void => {
            if (!comps || comps.length === 0) return;
            comps.forEach((comp: ComponentNode) => {
                if (!comp) return;
                const indent = '  '.repeat(level);
                addDebugLog(`${indent}${comp.name} (深度: ${comp.depth}, 子组件: ${comp.children.length})`);
                if (comp.children && comp.children.length > 0) {
                    logHierarchy(comp.children, level + 1);
                }
            });
        };
        logHierarchy(rootComponents, 0);
        
        return rootComponents;
    };

    // Render component tree - Improved with better indentation and expand/collapse
    const renderComponentTree = (components: ComponentNode[], depth = 0) => {
        addDebugLog(`渲染组件树，深度: ${depth}, 组件数量: ${components.length}`);
        
        return components.map((component, index) => {
            addDebugLog(`渲染组件: ${component.name} (深度: ${depth}, 子组件: ${component.children.length})`);
            
            const isExpanded = expandedComponents.has(component.id);
            const hasChildren = component.children.length > 0;
            
            return (
                <div key={component.id} className="relative">
                    {/* Component row with proper indentation */}
                    <div 
                        className={`cursor-pointer p-2 rounded text-sm border-l-2 transition-colors ${
                            selectedComponent?.id === component.id 
                                ? 'bg-blue-600 text-white border-blue-400' 
                                : 'hover:bg-gray-700 border-gray-600'
                        }`}
                        onClick={() => setSelectedComponent(component)}
                        style={{ 
                            paddingLeft: `${depth * 20 + 16}px`,
                            marginLeft: `${depth * 4}px`
                        }}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                {/* Expand/collapse indicator for components with children */}
                                {hasChildren && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const newExpanded = new Set(expandedComponents);
                                            if (isExpanded) {
                                                newExpanded.delete(component.id);
                                            } else {
                                                newExpanded.add(component.id);
                                            }
                                            setExpandedComponents(newExpanded);
                                        }}
                                        className="text-gray-400 hover:text-white text-xs w-4 h-4 flex items-center justify-center transition-transform"
                                        style={{
                                            transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'
                                        }}
                                    >
                                        ▶
                                    </button>
                                )}
                                
                                {/* Component type indicator */}
                                <span className={`w-3 h-3 rounded-full flex-shrink-0 ${
                                    component.componentType === 'function' ? 'bg-green-500' :
                                    component.componentType === 'class' ? 'bg-blue-500' :
                                    component.componentType === 'context' ? 'bg-purple-500' :
                                    component.componentType === 'provider' ? 'bg-orange-500' :
                                    component.componentType === 'fragment' ? 'bg-gray-500' :
                                    'bg-gray-400'
                                }`} />
                                
                                {/* Component name */}
                                <span className="font-mono font-medium">{component.name}</span>
                                
                                {/* Component type badge */}
                                <span className={`text-xs px-2 py-1 rounded flex-shrink-0 ${
                                    component.componentType === 'function' ? 'bg-green-600 text-green-100' :
                                    component.componentType === 'class' ? 'bg-blue-600 text-blue-100' :
                                    component.componentType === 'context' ? 'bg-purple-600 text-purple-100' :
                                    component.componentType === 'provider' ? 'bg-orange-600 text-orange-100' :
                                    component.componentType === 'fragment' ? 'bg-gray-600 text-gray-100' :
                                    'bg-gray-500 text-gray-100'
                                }`}>
                                    {component.componentType}
                                </span>
                                
                                {/* Mount status */}
                                {!component.isMounted && (
                                    <span className="text-xs text-yellow-400 bg-yellow-900 px-1 rounded flex-shrink-0">
                                        未挂载
                                    </span>
                                )}
                                
                                {/* Special flags */}
                                {component.errorBoundary && (
                                    <span className="text-xs text-red-400 bg-red-900 px-1 rounded flex-shrink-0">
                                        错误边界
                                    </span>
                                )}
                                {component.lazy && (
                                    <span className="text-xs text-blue-400 bg-blue-900 px-1 rounded flex-shrink-0">
                                        懒加载
                                    </span>
                                )}
                            </div>
                            <div className="text-xs text-gray-400 flex-shrink-0 ml-2">
                                {component.children.length} children
                                {component.children.length === 0 && component.depth > 0 && (
                                    <span className="text-yellow-400 ml-1">(无子组件)</span>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Render children with visual connection lines */}
                    {hasChildren && isExpanded && (
                        <div className="relative">
                            {/* Vertical line connecting to children */}
                            <div 
                                className="absolute left-0 top-0 bottom-0 w-px bg-gray-600"
                                style={{ 
                                    left: `${depth * 20 + 20}px`,
                                    marginLeft: `${depth * 4}px`
                                }}
                            />
                            
                            {/* Children container */}
                            <div className="relative">
                                {renderComponentTree(component.children, depth + 1)}
                            </div>
                        </div>
                    )}
                </div>
            );
        });
    };

    // Render component details
    const renderComponentDetails = () => {
        if (!selectedComponent) return null;

        const safeProps = filterSafeProps(selectedComponent.props);

        return (
            <div className="bg-gray-800 p-4 rounded-lg space-y-4">
                <h4 className="text-lg font-semibold">组件详情</h4>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="text-gray-400">组件名称:</span>
                        <span className="ml-2 font-mono font-medium">{selectedComponent.name}</span>
                    </div>
                    <div>
                        <span className="text-gray-400">组件类型:</span>
                        <span className={`ml-2 px-2 py-1 rounded text-xs ${
                            selectedComponent.componentType === 'function' ? 'bg-green-600' :
                            selectedComponent.componentType === 'class' ? 'bg-blue-600' :
                            selectedComponent.componentType === 'context' ? 'bg-purple-600' :
                            selectedComponent.componentType === 'provider' ? 'bg-orange-600' :
                            selectedComponent.componentType === 'fragment' ? 'bg-gray-600' :
                            'bg-gray-500'
                        }`}>
                            {selectedComponent.componentType}
                        </span>
                    </div>
                    <div>
                        <span className="text-gray-400">挂载状态:</span>
                        <span className={`ml-2 ${selectedComponent.isMounted ? 'text-green-400' : 'text-yellow-400'}`}>
                            {selectedComponent.isMounted ? '已挂载' : '未挂载'}
                        </span>
                    </div>
                    <div>
                        <span className="text-gray-400">可见性:</span>
                        <span className={`ml-2 ${selectedComponent.isVisible ? 'text-green-400' : 'text-red-400'}`}>
                            {selectedComponent.isVisible ? '可见' : '不可见'}
                        </span>
                    </div>
                    <div>
                        <span className="text-gray-400">层级深度:</span>
                        <span className="ml-2">{selectedComponent.depth}</span>
                    </div>
                    <div>
                        <span className="text-gray-400">子组件数量:</span>
                        <span className="ml-2">{selectedComponent.children.length}</span>
                    </div>
                </div>

                {/* Special flags */}
                {(selectedComponent.errorBoundary || selectedComponent.lazy || selectedComponent.memo || selectedComponent.forwardRef) && (
                    <div>
                        <span className="text-gray-400">特殊标记:</span>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {selectedComponent.errorBoundary && (
                                <span className="text-xs bg-red-600 px-2 py-1 rounded">错误边界</span>
                            )}
                            {selectedComponent.lazy && (
                                <span className="text-xs bg-blue-600 px-2 py-1 rounded">懒加载</span>
                            )}
                            {selectedComponent.memo && (
                                <span className="text-xs bg-purple-600 px-2 py-1 rounded">Memo</span>
                            )}
                            {selectedComponent.forwardRef && (
                                <span className="text-xs bg-orange-600 px-2 py-1 rounded">ForwardRef</span>
                            )}
                        </div>
                    </div>
                )}

                {selectedComponent.hooks.length > 0 && (
                    <div>
                        <span className="text-gray-400">Hooks:</span>
                        <div className="mt-2 space-y-2">
                            {selectedComponent.hooks.map((hook, index) => (
                                <div key={index} className="bg-gray-700 p-2 rounded">
                                    <div className="text-sm font-mono">{hook.name}</div>
                                    <pre className="text-xs text-gray-300 mt-1 overflow-auto">
                                        {(() => {
                                            try {
                                                return JSON.stringify(hook.value, null, 2);
                                            } catch (e) {
                                                return '[循环引用或无法序列化的值]';
                                            }
                                        })()}
                                    </pre>
                                </div>
                            ))}
                        </div>
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
        );
    };

    // Filter safe props (same as before)
    const filterSafeProps = (props: Record<string, any>): Record<string, any> => {
        const safeProps: Record<string, any> = {};
        const seen = new WeakSet();

        const filterValue = (value: any): any => {
            if (value === null || value === undefined) {
                return value;
            }

            if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                return value;
            }

            if (Array.isArray(value)) {
                return value.map(filterValue);
            }

            if (typeof value === 'object') {
                if (seen.has(value)) {
                    return '[Circular Reference]';
                }

                if (value.constructor && value.constructor.name === 'FiberNode') {
                    return '[React Fiber Node]';
                }

                if (value.constructor && value.constructor.name === 'HTMLDivElement') {
                    return '[DOM Element]';
                }

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
                    value._reactInternalFiber ||
                    value.next ||
                    value.return ||
                    value.child ||
                    value.sibling
                )) {
                    return '[React Internal Object]';
                }

                seen.add(value);
                const filtered: Record<string, any> = {};
                
                for (const key in value) {
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
                        key === '$$typeof' ||
                        key === 'next' ||
                        key === 'return' ||
                        key === 'child' ||
                        key === 'sibling') {
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

            if (typeof value === 'function') {
                return `[Function: ${value.name || 'anonymous'}]`;
            }

            return `[${typeof value}]`;
        };

        try {
            return filterValue(props);
        } catch (error) {
            console.warn('Error filtering props:', error);
            return { '[Error]': 'Failed to serialize props' };
        }
    };

    // Find parent components by traversing up the fiber tree - Improved for deeper detection
    const findParentComponents = (fiber: any): ComponentNode[] => {
        const components: ComponentNode[] = [];
        const processedFiber = new Set<any>();
        let currentFiber = fiber;
        let depth = 0;

        while (currentFiber && depth < 50) { // Increased depth limit
            if (processedFiber.has(currentFiber)) {
                break;
            }

            processedFiber.add(currentFiber);

            // Check if this fiber represents a React component
            if (currentFiber.type && typeof currentFiber.type !== 'string') {
                const componentInfo = extractComponentFromFiber(currentFiber, true);
                if (componentInfo) {
                    componentInfo.depth = depth;
                    components.push(componentInfo);
                    addDebugLog(`找到父组件: ${componentInfo.name} (深度: ${depth})`);
                }
            }

            // Move up to parent fiber
            currentFiber = currentFiber.return;
            depth++;
        }

        // Also try to find components through alternate fibers
        if (fiber.alternate) {
            let alternateFiber = fiber.alternate;
            let alternateDepth = 0;
            
            while (alternateFiber && alternateDepth < 30) {
                if (processedFiber.has(alternateFiber)) {
                    break;
                }

                processedFiber.add(alternateFiber);

                if (alternateFiber.type && typeof alternateFiber.type !== 'string') {
                    const componentInfo = extractComponentFromFiber(alternateFiber, true);
                    if (componentInfo) {
                        componentInfo.depth = alternateDepth;
                        components.push(componentInfo);
                        addDebugLog(`通过alternate找到父组件: ${componentInfo.name} (深度: ${alternateDepth})`);
                    }
                }

                alternateFiber = alternateFiber.return;
                alternateDepth++;
            }
        }

        return components;
    };

    // Assign depth to components that don't have proper depth
    const assignDepthToComponents = (components: ComponentNode[]) => {
        addDebugLog('为组件分配深度...');
        
        // Group components by source type
        const domComponents = components.filter(c => c.type === 'dom' || c.isMounted);
        const fiberComponents = components.filter(c => c.type === 'fiber' || c.depth > 0);
        const globalComponents = components.filter(c => c.type === 'global');
        const internalComponents = components.filter(c => c.type === 'memoized' || c.type === 'internal');
        const directComponents = components.filter(c => c.type === 'direct');
        
        addDebugLog(`组件分组: DOM=${domComponents.length}, Fiber=${fiberComponents.length}, Global=${globalComponents.length}, Internal=${internalComponents.length}, Direct=${directComponents.length}`);
        
        // First, preserve existing depth values for components that already have them
        components.forEach(comp => {
            if (comp.depth > 0) {
                addDebugLog(`保留现有深度: ${comp.name} (深度: ${comp.depth})`);
            }
        });
        
        // Assign depth based on component type and importance
        let currentDepth = 0;
        
        // Root level components (depth 0) - only the most important ones
        const rootComponents = [
            ...fiberComponents.filter(c => c.depth === 0),
            ...domComponents.filter(c => c.name.toLowerCase().includes('app') || c.name.toLowerCase().includes('root'))
        ];
        rootComponents.forEach(c => {
            if (c.depth === 0) {
                addDebugLog(`根组件: ${c.name} (深度: ${c.depth})`);
            }
        });
        
        // First level components (depth 1) - providers, contexts, main layout components
        const firstLevelComponents = [
            ...fiberComponents.filter(c => c.depth === 1),
            ...domComponents.filter(c => !c.name.toLowerCase().includes('app') && !c.name.toLowerCase().includes('root')),
            ...globalComponents.filter(c => c.name.toLowerCase().includes('provider') || c.name.toLowerCase().includes('context'))
        ];
        firstLevelComponents.forEach(c => {
            if (c.depth === 0) {
                c.depth = 1;
                addDebugLog(`一级组件: ${c.name} (深度: ${c.depth})`);
            }
        });
        
        // Second level components (depth 2) - regular components
        const secondLevelComponents = [
            ...fiberComponents.filter(c => c.depth === 2),
            ...globalComponents.filter(c => !c.name.toLowerCase().includes('provider') && !c.name.toLowerCase().includes('context')),
            ...internalComponents
        ];
        secondLevelComponents.forEach(c => {
            if (c.depth === 0) {
                c.depth = 2;
                addDebugLog(`二级组件: ${c.name} (深度: ${c.depth})`);
            }
        });
        
        // Third level components (depth 3) - leaf components
        const thirdLevelComponents = [
            ...fiberComponents.filter(c => c.depth >= 3),
            ...directComponents
        ];
        thirdLevelComponents.forEach(c => {
            if (c.depth === 0) {
                c.depth = 3;
                addDebugLog(`三级组件: ${c.name} (深度: ${c.depth})`);
            }
        });
        
        // For any remaining components with depth 0, assign them to level 2
        components.forEach(comp => {
            if (comp.depth === 0) {
                comp.depth = 2;
                addDebugLog(`默认深度分配: ${comp.name} (深度: ${comp.depth})`);
            }
        });
        
        // Log final depth distribution
        const depthCounts = new Map<number, number>();
        components.forEach(comp => {
            const count = depthCounts.get(comp.depth) || 0;
            depthCounts.set(comp.depth, count + 1);
        });
        
        addDebugLog('最终深度分布:');
        depthCounts.forEach((count, depth) => {
            addDebugLog(`  深度 ${depth}: ${count} 个组件`);
        });
    };

    // Analyze deep components - New method for detecting deeply nested components
    const analyzeDeepComponents = (): ComponentNode[] => {
        const components: ComponentNode[] = [];
        const processedFiber = new Set<any>();

        try {
            addDebugLog('开始深层组件检测...');

            // Method 1: Scan all elements more thoroughly
            const allElements = document.querySelectorAll('*');
            addDebugLog(`深层扫描 ${allElements.length} 个DOM元素`);

            allElements.forEach((element, index) => {
                if (index % 100 === 0) {
                    addDebugLog(`深层扫描进度: ${index}/${allElements.length}`);
                }

                // Get all properties of the element
                const elementKeys = Object.keys(element);
                
                // Look for any React-related properties
                elementKeys.forEach(key => {
                    try {
                        const value = (element as any)[key];
                        if (value && typeof value === 'object') {
                            // Check if this looks like a React component
                            if (value.type && typeof value.type === 'function') {
                                const componentInfo = extractComponentFromFiber(value, true);
                                if (componentInfo && !processedFiber.has(value)) {
                                    processedFiber.add(value);
                                    componentInfo.type = 'deep';
                                    components.push(componentInfo);
                                    addDebugLog(`深层检测找到组件: ${componentInfo.name} 在元素 ${element.tagName}`);
                                }
                            }
                            
                            // Also check for nested React objects
                            if (value.memoizedState || value.memoizedProps || value.stateNode) {
                                const componentInfo = extractComponentFromFiber(value, true);
                                if (componentInfo && !processedFiber.has(value)) {
                                    processedFiber.add(value);
                                    componentInfo.type = 'deep';
                                    components.push(componentInfo);
                                    addDebugLog(`深层检测找到状态组件: ${componentInfo.name} 在元素 ${element.tagName}`);
                                }
                            }
                        }
                    } catch (e) {
                        // Ignore access errors
                    }
                });
            });

            // Method 2: Scan global scope for React components
            addDebugLog('深层扫描全局作用域...');
            const globalKeys = Object.keys(window);
            
            globalKeys.forEach(key => {
                try {
                    const globalObj = (window as any)[key];
                    if (globalObj && typeof globalObj === 'function') {
                        // Check if it looks like a React component
                        if (globalObj.displayName || globalObj.name) {
                            const componentName = globalObj.displayName || globalObj.name;
                            if (componentName && componentName.length > 0) {
                                const component: ComponentNode = {
                                    id: `deep-global-${key}-${componentName}`,
                                    name: componentName,
                                    type: 'deep',
                                    props: {},
                                    state: {},
                                    children: [],
                                    depth: 0,
                                    isVisible: false,
                                    isMounted: false,
                                    componentType: 'function',
                                    renderCount: 0,
                                    lastRenderTime: 0,
                                    hooks: []
                                };
                                components.push(component);
                                addDebugLog(`深层检测找到全局组件: ${componentName}`);
                            }
                        }
                    }
                } catch (e) {
                    // Ignore access errors
                }
            });

            // Method 3: Scan for React internal objects
            addDebugLog('深层扫描React内部对象...');
            const reactInternalPatterns = [
                '__reactInternalInstance$',
                '__reactFiber$',
                '_reactInternalFiber',
                '_reactInternalInstance',
                '__reactProps$',
                '__reactState$',
                '__reactContext$'
            ];

            allElements.forEach(element => {
                reactInternalPatterns.forEach(pattern => {
                    const keys = Object.keys(element).filter(key => key.includes(pattern));
                    keys.forEach(key => {
                        try {
                            const fiber = (element as any)[key];
                            if (fiber && !processedFiber.has(fiber)) {
                                processedFiber.add(fiber);
                                
                                // Traverse this fiber tree deeply
                                const deepTraverse = (fiberNode: any, depth: number) => {
                                    if (!fiberNode || depth > 20) return;
                                    
                                    if (fiberNode.type && typeof fiberNode.type !== 'string') {
                                        const componentInfo = extractComponentFromFiber(fiberNode, true);
                                        if (componentInfo) {
                                            componentInfo.type = 'deep';
                                            componentInfo.depth = depth;
                                            components.push(componentInfo);
                                            addDebugLog(`深层遍历找到组件: ${componentInfo.name} (深度: ${depth})`);
                                        }
                                    }
                                    
                                    if (fiberNode.child) {
                                        deepTraverse(fiberNode.child, depth + 1);
                                    }
                                    if (fiberNode.sibling) {
                                        deepTraverse(fiberNode.sibling, depth);
                                    }
                                };
                                
                                deepTraverse(fiber, 0);
                            }
                        } catch (e) {
                            // Ignore access errors
                        }
                    });
                });
            });

            addDebugLog(`深层组件检测完成，找到 ${components.length} 个组件`);

        } catch (error) {
            addDebugLog(`深层组件检测错误: ${error}`);
        }

        return components;
    };

    // Flatten component hierarchy to flat array
    const flattenComponents = (components: ComponentNode[]): ComponentNode[] => {
        const flatComponents: ComponentNode[] = [];
        
        const flatten = (comps: ComponentNode[]) => {
            comps.forEach(comp => {
                // Create a copy without children
                const flatComp = { ...comp, children: [] };
                flatComponents.push(flatComp);
                
                // Recursively flatten children
                if (comp.children.length > 0) {
                    flatten(comp.children);
                }
            });
        };
        
        flatten(components);
        return flatComponents;
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 text-white rounded-lg shadow-xl w-11/12 h-5/6 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold">全面组件分析器 (Electron环境)</h3>
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
                            onClick={analyzeComponents}
                            disabled={isAnalyzing}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded transition-colors"
                        >
                            {isAnalyzing ? '分析中...' : '全面分析组件'}
                        </button>
                        {isAnalyzing && (
                            <button
                                onClick={cancelAnalysis}
                                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition-colors"
                            >
                                取消分析
                            </button>
                        )}
                        <button
                            onClick={() => {
                                // Test with realistic sample data that shows hierarchy
                                const testComponents: ComponentNode[] = [
                                    {
                                        id: 'app-1',
                                        name: 'App',
                                        type: 'test',
                                        props: {},
                                        state: {},
                                        children: [],
                                        depth: 0,
                                        isVisible: true,
                                        isMounted: true,
                                        componentType: 'function',
                                        renderCount: 1,
                                        lastRenderTime: 0,
                                        hooks: []
                                    },
                                    {
                                        id: 'router-provider-1',
                                        name: 'RouterProvider',
                                        type: 'test',
                                        props: {},
                                        state: {},
                                        children: [],
                                        depth: 1,
                                        isVisible: true,
                                        isMounted: true,
                                        componentType: 'provider',
                                        renderCount: 1,
                                        lastRenderTime: 0,
                                        hooks: []
                                    },
                                    {
                                        id: 'game-state-provider-1',
                                        name: 'GameStateProvider',
                                        type: 'test',
                                        props: {},
                                        state: {},
                                        children: [],
                                        depth: 2,
                                        isVisible: true,
                                        isMounted: true,
                                        componentType: 'provider',
                                        renderCount: 1,
                                        lastRenderTime: 0,
                                        hooks: []
                                    },
                                    {
                                        id: 'layout-1',
                                        name: 'Layout',
                                        type: 'test',
                                        props: {},
                                        state: {},
                                        children: [],
                                        depth: 3,
                                        isVisible: true,
                                        isMounted: true,
                                        componentType: 'function',
                                        renderCount: 1,
                                        lastRenderTime: 0,
                                        hooks: []
                                    },
                                    {
                                        id: 'home-page-1',
                                        name: 'HomePage',
                                        type: 'test',
                                        props: {},
                                        state: {},
                                        children: [],
                                        depth: 4,
                                        isVisible: true,
                                        isMounted: true,
                                        componentType: 'function',
                                        renderCount: 1,
                                        lastRenderTime: 0,
                                        hooks: []
                                    },
                                    {
                                        id: 'menu-component-1',
                                        name: 'MenuComponent',
                                        type: 'test',
                                        props: {},
                                        state: {},
                                        children: [],
                                        depth: 5,
                                        isVisible: true,
                                        isMounted: true,
                                        componentType: 'function',
                                        renderCount: 1,
                                        lastRenderTime: 0,
                                        hooks: []
                                    },
                                    {
                                        id: 'button-1',
                                        name: 'Button',
                                        type: 'test',
                                        props: { text: 'Click me' },
                                        state: {},
                                        children: [],
                                        depth: 6,
                                        isVisible: true,
                                        isMounted: true,
                                        componentType: 'function',
                                        renderCount: 1,
                                        lastRenderTime: 0,
                                        hooks: []
                                    },
                                    {
                                        id: 'dialog-component-1',
                                        name: 'DialogComponent',
                                        type: 'test',
                                        props: {},
                                        state: {},
                                        children: [],
                                        depth: 5,
                                        isVisible: false,
                                        isMounted: true,
                                        componentType: 'function',
                                        renderCount: 1,
                                        lastRenderTime: 0,
                                        hooks: []
                                    },
                                    {
                                        id: 'notification-1',
                                        name: 'Notification',
                                        type: 'test',
                                        props: {},
                                        state: {},
                                        children: [],
                                        depth: 6,
                                        isVisible: true,
                                        isMounted: true,
                                        componentType: 'function',
                                        renderCount: 1,
                                        lastRenderTime: 0,
                                        hooks: []
                                    },
                                    {
                                        id: 'deep-nested-1',
                                        name: 'DeepNestedComponent',
                                        type: 'test',
                                        props: {},
                                        state: {},
                                        children: [],
                                        depth: 7,
                                        isVisible: true,
                                        isMounted: true,
                                        componentType: 'function',
                                        renderCount: 1,
                                        lastRenderTime: 0,
                                        hooks: []
                                    },
                                    {
                                        id: 'very-deep-1',
                                        name: 'VeryDeepComponent',
                                        type: 'test',
                                        props: {},
                                        state: {},
                                        children: [],
                                        depth: 8,
                                        isVisible: true,
                                        isMounted: true,
                                        componentType: 'function',
                                        renderCount: 1,
                                        lastRenderTime: 0,
                                        hooks: []
                                    },
                                    {
                                        id: 'context-provider-1',
                                        name: 'ContextProvider',
                                        type: 'test',
                                        props: {},
                                        state: {},
                                        children: [],
                                        depth: 3,
                                        isVisible: true,
                                        isMounted: true,
                                        componentType: 'context',
                                        renderCount: 1,
                                        lastRenderTime: 0,
                                        hooks: []
                                    },
                                    {
                                        id: 'context-consumer-1',
                                        name: 'ContextConsumer',
                                        type: 'test',
                                        props: {},
                                        state: {},
                                        children: [],
                                        depth: 4,
                                        isVisible: true,
                                        isMounted: true,
                                        componentType: 'context',
                                        renderCount: 1,
                                        lastRenderTime: 0,
                                        hooks: []
                                    }
                                ];
                                
                                // Manually set up parent-child relationships for testing
                                const app = testComponents[0];
                                const routerProvider = testComponents[1];
                                const gameStateProvider = testComponents[2];
                                const layout = testComponents[3];
                                const homePage = testComponents[4];
                                const menuComponent = testComponents[5];
                                const button = testComponents[6];
                                const dialogComponent = testComponents[7];
                                const notification = testComponents[8];
                                const deepNested = testComponents[9];
                                const veryDeep = testComponents[10];
                                const contextProvider = testComponents[11];
                                const contextConsumer = testComponents[12];
                                
                                // Set up hierarchy
                                app.children.push(routerProvider);
                                routerProvider.children.push(gameStateProvider);
                                gameStateProvider.children.push(layout);
                                layout.children.push(homePage);
                                homePage.children.push(menuComponent);
                                menuComponent.children.push(button);
                                homePage.children.push(dialogComponent);
                                dialogComponent.children.push(notification);
                                notification.children.push(deepNested);
                                deepNested.children.push(veryDeep);
                                layout.children.push(contextProvider);
                                contextProvider.children.push(contextConsumer);
                                
                                setComponents([app, contextProvider]); // Only show root components
                                setAnalysisTime(50);
                                addDebugLog('测试数据加载完成，展示层级关系');
                            }}
                            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors"
                        >
                            测试层级关系
                        </button>
                        {components.length > 0 && (
                            <>
                                <button
                                    onClick={() => {
                                        const allComponentIds = new Set<string>();
                                        const collectIds = (comps: ComponentNode[]) => {
                                            comps.forEach(comp => {
                                                allComponentIds.add(comp.id);
                                                if (comp.children.length > 0) {
                                                    collectIds(comp.children);
                                                }
                                            });
                                        };
                                        collectIds(components);
                                        setExpandedComponents(allComponentIds);
                                        addDebugLog('全部展开组件树');
                                    }}
                                    className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded transition-colors"
                                >
                                    全部展开
                                </button>
                                <button
                                    onClick={() => {
                                        setExpandedComponents(new Set());
                                        addDebugLog('全部折叠组件树');
                                    }}
                                    className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded transition-colors"
                                >
                                    全部折叠
                                </button>
                                <button
                                    onClick={() => {
                                        // Force rebuild hierarchy
                                        const flatComponents = flattenComponents(components);
                                        const newHierarchy = buildComprehensiveHierarchy(flatComponents);
                                        setComponents(newHierarchy);
                                        setExpandedComponents(new Set());
                                        addDebugLog('强制重建层级关系');
                                    }}
                                    className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded transition-colors"
                                >
                                    重建层级
                                </button>
                            </>
                        )}
                        {analysisTime > 0 && (
                            <span className="text-gray-400">
                                分析耗时: {analysisTime.toFixed(2)}ms
                            </span>
                        )}
                        <span className="text-gray-400">
                            当前页面: {router.getPathname()}
                        </span>
                        <span className="text-green-400 text-sm">
                            支持深层组件检测
                        </span>
                        {components.length > 0 && (
                            <div className="text-xs text-gray-400">
                                检测方法: DOM + Fiber + 全局 + 内部 + 直接 + 深层
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Component Tree */}
                    <div className="w-1/2 p-4 border-r border-gray-700 overflow-auto">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-md font-semibold">组件树结构</h4>
                            {components.length > 0 && (
                                <div className="text-sm text-gray-400">
                                    共 {components.length} 个组件
                                    {expandedComponents.size > 0 && (
                                        <span className="ml-2">
                                            ({expandedComponents.size} 个已展开)
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                        {components.length === 0 ? (
                            <div className="text-gray-400">
                                <p>点击"全面分析组件"开始分析</p>
                                <p className="text-sm mt-2">此工具支持检测已挂载、未挂载和深层嵌套的组件</p>
                                <p className="text-sm mt-1">点击"测试层级关系"查看示例</p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {renderComponentTree(components)}
                            </div>
                        )}
                    </div>

                    {/* Details Panel */}
                    <div className="w-1/2 p-4 overflow-auto">
                        <h4 className="text-md font-semibold mb-3">组件详情</h4>
                        <div className="space-y-4">
                            {/* Component Details */}
                            {selectedComponent && renderComponentDetails()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 