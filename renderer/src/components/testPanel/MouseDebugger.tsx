import React, { useEffect, useState } from 'react';
import { EnhancedTestPanel } from './EnhancedTestPanel';

interface ElementInfo {
    tagName: string;
    className: string;
    id: string;
    pointerEvents: string;
    userSelect: string;
    position: { x: number; y: number };
    zIndex: string;
    styles: {
        pointerEvents: string;
        userSelect: string;
        webkitUserSelect: string;
        position: string;
        zIndex: string;
    };
}

interface MouseDebuggerProps {
    isVisible: boolean;
    onClose: () => void;
}

export function MouseDebugger({ isVisible, onClose }: MouseDebuggerProps) {
    const [elementInfo, setElementInfo] = useState<ElementInfo | null>(null);
    const [isTracking, setIsTracking] = useState(false);
    const [clickHistory, setClickHistory] = useState<any[]>([]);

    useEffect(() => {
        if (!isTracking || !isVisible) return;

        const handleMouseMove = (e: MouseEvent) => {
            const element = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
            if (!element) return;

            const computedStyle = window.getComputedStyle(element);
            
            const info: ElementInfo = {
                tagName: element.tagName,
                className: element.className || '(no class)',
                id: element.id || '(no id)',
                pointerEvents: computedStyle.pointerEvents,
                userSelect: computedStyle.userSelect,
                position: { x: e.clientX, y: e.clientY },
                zIndex: computedStyle.zIndex,
                styles: {
                    pointerEvents: computedStyle.pointerEvents,
                    userSelect: computedStyle.userSelect,
                    webkitUserSelect: computedStyle.webkitUserSelect,
                    position: computedStyle.position,
                    zIndex: computedStyle.zIndex,
                }
            };

            setElementInfo(info);
        };

        const handleRightClick = (e: MouseEvent) => {
            e.stopPropagation();
            
            // 获取所有在这个位置的元素
            const elementsAtPoint = document.elementsFromPoint(e.clientX, e.clientY);
            const elementsData = elementsAtPoint.map(el => ({
                tag: el.tagName,
                class: el.className || '(no class)',
                id: el.id || '(no id)',
                pointerEvents: window.getComputedStyle(el).pointerEvents,
                userSelect: window.getComputedStyle(el).userSelect,
                zIndex: window.getComputedStyle(el).zIndex
            }));

            const clickData = {
                timestamp: new Date().toLocaleTimeString(),
                position: { x: e.clientX, y: e.clientY },
                target: e.target ? (e.target as HTMLElement).tagName : 'unknown',
                defaultPrevented: e.defaultPrevented,
                elements: elementsData
            };

            setClickHistory(prev => [clickData, ...prev.slice(0, 4)]); // 保留最近5次点击
            
            console.log('=== 右键点击调试信息 ===');
            console.log('事件目标:', e.target);
            console.log('当前元素:', document.elementFromPoint(e.clientX, e.clientY));
            console.log('事件是否被阻止:', e.defaultPrevented);
            console.log('该位置的所有元素:', elementsData);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('contextmenu', handleRightClick, true); // 使用捕获阶段

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('contextmenu', handleRightClick, true);
        };
    }, [isTracking, isVisible]);

    const toggleTracking = () => {
        setIsTracking(!isTracking);
        if (!isTracking) {
            setElementInfo(null);
            setClickHistory([]);
        }
    };

    const clearHistory = () => {
        setClickHistory([]);
    };

    return (
        <EnhancedTestPanel
            isVisible={isVisible}
            onClose={onClose}
            title="鼠标事件调试器"
            initialPosition={{ x: 100, y: 100 }}
            initialSize={{ width: 600, height: 700 }}
        >
            <div className="text-white space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">鼠标事件调试器</h3>
                    <button
                        onClick={toggleTracking}
                        className={`px-4 py-2 rounded transition-colors ${
                            isTracking 
                                ? 'bg-red-600 hover:bg-red-700' 
                                : 'bg-green-600 hover:bg-green-700'
                        }`}
                    >
                        {isTracking ? '停止跟踪' : '开始跟踪'}
                    </button>
                </div>

                {isTracking && (
                    <div className="bg-green-800/30 border border-green-600 rounded p-3">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-green-300">正在跟踪鼠标移动和右键点击</span>
                        </div>
                    </div>
                )}

                {/* 当前鼠标下的元素信息 */}
                {isTracking && elementInfo && (
                    <div className="bg-gray-800 rounded p-4">
                        <h4 className="text-md font-semibold mb-3 text-blue-300">当前元素信息</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div><span className="text-gray-400">元素:</span> {elementInfo.tagName}</div>
                            <div><span className="text-gray-400">位置:</span> ({elementInfo.position.x}, {elementInfo.position.y})</div>
                            <div className="col-span-2"><span className="text-gray-400">类名:</span> {elementInfo.className}</div>
                            <div className="col-span-2"><span className="text-gray-400">ID:</span> {elementInfo.id}</div>
                        </div>
                        
                        <div className="mt-3 p-3 bg-gray-700 rounded">
                            <h5 className="text-sm font-semibold mb-2 text-yellow-300">CSS 属性</h5>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                    <span className="text-gray-400">pointer-events:</span>{' '}
                                    <span className={elementInfo.styles.pointerEvents === 'none' ? 'text-red-400' : 'text-green-400'}>
                                        {elementInfo.styles.pointerEvents}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-400">user-select:</span>{' '}
                                    <span className={elementInfo.styles.userSelect === 'none' ? 'text-red-400' : 'text-green-400'}>
                                        {elementInfo.styles.userSelect}
                                    </span>
                                </div>
                                <div><span className="text-gray-400">z-index:</span> {elementInfo.styles.zIndex}</div>
                                <div><span className="text-gray-400">position:</span> {elementInfo.styles.position}</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 右键点击历史 */}
                <div className="bg-gray-800 rounded p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-md font-semibold text-purple-300">右键点击历史</h4>
                        {clickHistory.length > 0 && (
                            <button
                                onClick={clearHistory}
                                className="text-xs bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded"
                            >
                                清除
                            </button>
                        )}
                    </div>
                    
                    {clickHistory.length === 0 ? (
                        <div className="text-gray-400 text-sm">
                            {isTracking ? '开始右键点击来查看调试信息...' : '启动跟踪后右键点击来查看调试信息'}
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {clickHistory.map((click, index) => (
                                <div key={index} className="bg-gray-700 rounded p-2">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-gray-400">{click.timestamp}</span>
                                        <span className="text-xs text-blue-300">
                                            ({click.position.x}, {click.position.y})
                                        </span>
                                    </div>
                                    <div className="text-sm mb-2">
                                        <span className="text-gray-400">目标:</span> {click.target}
                                    </div>
                                    <div className="text-xs">
                                        <span className="text-gray-400">元素层级 ({click.elements.length}):</span>
                                        <div className="mt-1 space-y-1">
                                            {click.elements.slice(0, 3).map((el: any, elIndex: number) => (
                                                <div key={elIndex} className="bg-gray-600 rounded px-2 py-1">
                                                    <div className="flex items-center justify-between">
                                                        <span>{el.tag}</span>
                                                        <span className={`text-xs ${
                                                            el.pointerEvents === 'none' ? 'text-red-400' : 'text-green-400'
                                                        }`}>
                                                            {el.pointerEvents}
                                                        </span>
                                                    </div>
                                                    {el.class !== '(no class)' && (
                                                        <div className="text-xs text-gray-400">{el.class}</div>
                                                    )}
                                                </div>
                                            ))}
                                            {click.elements.length > 3 && (
                                                <div className="text-xs text-gray-400">
                                                    ...还有 {click.elements.length - 3} 个元素
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="text-xs text-gray-400 bg-gray-800 rounded p-3">
                    <h5 className="font-semibold mb-2">使用说明:</h5>
                    <ul className="space-y-1">
                        <li>• 点击"开始跟踪"来监控鼠标事件</li>
                        <li>• 移动鼠标查看当前元素的CSS属性</li>
                        <li>• 右键点击查看该位置的所有元素层级</li>
                        <li>• 红色表示阻止鼠标事件，绿色表示允许</li>
                        <li>• 详细信息会输出到浏览器控制台</li>
                    </ul>
                </div>
            </div>
        </EnhancedTestPanel>
    );
} 