# 测试面板框架

一个可拖动的、独立的测试面板框架，不受页面布局缩放影响。

## 特性

- 🎯 **完全独立**: 在应用级别渲染，不受页面 transform 缩放影响
- 🖱️ **可拖动**: 支持拖拽到屏幕任何位置
- 📏 **可调整大小**: 支持调整面板尺寸
- 🔽 **可最小化**: 支持最小化到左下角
- ⌨️ **键盘触发**: 支持自定义键盘快捷键
- 🎨 **现代化UI**: 半透明背景、毛玻璃效果

## 文件结构

```
testPanel/
├── index.ts                    # 统一导出
├── TestPanel.tsx              # 基础测试面板组件
├── EnhancedTestPanel.tsx      # 增强版测试面板（可拖动、调整大小）
├── TestPanelContext.tsx       # React Context 状态管理
└── GlobalTestPanel.tsx        # 全局测试面板组件
```

## 使用方法

### 1. 在 app.tsx 中集成

```tsx
import { TestPanelProvider, GlobalTestPanel } from './src/components/testPanel';

const App = ({children}) => {
    return (
        <TestPanelProvider>
            {children}
            <GlobalTestPanel />
        </TestPanelProvider>
    );
};
```

### 2. 自定义测试内容

在 `GlobalTestPanel.tsx` 中修改面板内容：

```tsx
<EnhancedTestPanel 
    isVisible={isVisible && !isMinimized} 
    onClose={closePanel}
    onMinimize={handleMinimize}
    title="我的测试面板"
    initialPosition={{ x: 50, y: 50 }}
    initialSize={{ width: 500, height: 400 }}
>
    <div className="text-white">
        {/* 在这里添加你的测试内容 */}
        <h3 className="text-lg mb-4">自定义测试</h3>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            测试按钮
        </button>
    </div>
</EnhancedTestPanel>
```

### 3. 修改触发键

```tsx
const { isVisible, togglePanel, closePanel } = useTestPanel("custom"); // 改为 "custom"

<TestPanelTrigger 
    triggerKeys="custom"  // 改为 "custom"
    onTrigger={togglePanel}
    hintText="输入 'custom' 显示测试面板"
/>
```

## 组件说明

### EnhancedTestPanel
- 可拖动的测试面板容器
- 支持最小化/恢复
- 支持调整大小
- 窗口化设计

### TestPanelTrigger
- 键盘触发提示组件
- 支持自定义触发键
- 固定位置显示

### useTestPanel
- 管理测试面板显示状态
- 支持自定义触发键

## 触发方式

1. **键盘输入**: 在键盘上输入 "dev" 显示面板
2. **ESC键**: 按 ESC 键关闭面板
3. **点击关闭**: 点击面板右上角的 ✕ 按钮

## 样式定制

面板使用 Tailwind CSS 类名，可以通过修改类名来自定义样式：

```tsx
<EnhancedTestPanel 
    className="custom-panel-class"
    // ... 其他属性
>
```

## 扩展建议

- 添加更多测试面板内容
- 实现面板位置和大小持久化
- 添加多面板支持
- 集成更多测试工具 