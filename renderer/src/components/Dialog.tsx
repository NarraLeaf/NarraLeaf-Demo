import React from 'react';
import { Dialog, Texts, Nametag, useDialog } from "narraleaf-react";

function SentenceContext() {
    const {done} = useDialog();

    return (
        <>
            <Texts className="text-[22px] max-w-max pt-[63px] pl-[128px]" />
            {/* Add inverted triangle and underline */}
            <div className="flex flex-col items-center mt-[70px]">
                {/* Inverted triangle */}
                <div className={`w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-white filter drop-shadow-[0_0_10px_white] ${done ? '' : 'transparent'}`} />
                {/* Underline */}
                <div className="w-[12px] h-[2px] bg-white mt-[2px] filter drop-shadow-[0_0_2px_white]" />
            </div>
        </>
    );
}

export function GameDialog() {
    return (
        <Dialog className="rounded-lg p-6 shadow-lg w-full h-full mb-4 AlimamaFangYuanTiVF-Thin bg-contain bg-no-repeat bg-bottom relative" style={{
            backgroundImage: "url('/static/img/ui/dialog/dialog.png')"
        }}>
            <div className="absolute left-[133px] flex justify-center w-[200px] top-[28px]">
                <Nametag />
            </div>
            <div className="flex items-center gap-[5px]">
                <SentenceContext />
            </div>
        </Dialog>
    )
}
