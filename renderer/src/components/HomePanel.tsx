import React from 'react';
import { MenuButton } from './lib/Button';

export function HomePanel({children}: {children: React.ReactNode}) {
    // Single background image for the entire panel
    const panelBgImage = "url('/static/img/ui/main-menu/main_menu.png')";

    // Default button actions - can be customized as needed
    const handleButtonClick = (buttonName: string) => {
        console.log(`Clicked: ${buttonName}`);
        // Add specific button logic here
    };

    return (
        <div 
            className="flex h-full w-full relative"
            style={{
                backgroundImage: panelBgImage,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            {/* Optional overlay for better content readability */}
            <div className="absolute inset-0 bg-black/10"></div>
            
            {/* Left Panel - 1/3 width */}
            <div className="w-1/3 flex flex-col justify-center items-center p-6 relative z-10">
                {/* Button Container */}
                <div className="w-full max-w-xs space-y-4">
                    <MenuButton 
                        onClick={() => handleButtonClick('开始游戏')}
                        className="text-lg font-medium"
                    >
                        开始游戏
                    </MenuButton>
                    
                    <MenuButton 
                        onClick={() => handleButtonClick('继续游戏')}
                        className="text-lg font-medium"
                    >
                        继续游戏
                    </MenuButton>
                    
                    <MenuButton 
                        onClick={() => handleButtonClick('读取存档')}
                        className="text-lg font-medium"
                    >
                        读取存档
                    </MenuButton>
                    
                    <MenuButton 
                        onClick={() => handleButtonClick('游戏设置')}
                        className="text-lg font-medium"
                    >
                        游戏设置
                    </MenuButton>
                    
                    <MenuButton 
                        onClick={() => handleButtonClick('退出游戏')}
                        className="text-lg font-medium"
                    >
                        退出游戏
                    </MenuButton>
                </div>
            </div>

            {/* Right Panel - 2/3 width */}
            <div className="w-2/3 relative z-10 flex items-center justify-center">
                {/* Content Container */}
                <div className="w-full h-full p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
