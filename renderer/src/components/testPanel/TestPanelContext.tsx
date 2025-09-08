import React, { createContext, useContext, ReactNode } from 'react';

// 基础测试面板状态接口
interface TestPanelState {
    // 可以在这里添加通用的测试状态
}

const TestPanelContext = createContext<TestPanelState | undefined>(undefined);

export function TestPanelProvider({ children }: { children: ReactNode }) {
    // 基础状态，可以根据需要扩展
    const value: TestPanelState = {};

    return (
        <TestPanelContext.Provider value={value}>
            {children}
        </TestPanelContext.Provider>
    );
}

export function useTestPanelState() {
    const context = useContext(TestPanelContext);
    if (context === undefined) {
        throw new Error('useTestPanelState must be used within a TestPanelProvider');
    }
    return context;
} 