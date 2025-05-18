import React from 'react';
import { Dialog, Texts, Nametag, useDialog } from "narraleaf-react";
import clsx from 'clsx';
import { useBackdrop } from '../hooks/useBackdrop';

function SentenceContext() {
    const {done} = useDialog();

    return (
        <>
            <Texts className="text-[22px] max-w-max flex items-center" />
            {/* Add inverted triangle and underline */}
            <div className="flex flex-col items-center">
                {/* Inverted triangle */}
                <div className={clsx(
                    "w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-white filter drop-shadow-[0_0_10px_white]",
                    done ? 'opacity-100' : 'opacity-0'
                )} />
                {/* Underline */}
                <div className="w-[12px] h-[2px] bg-white mt-[2px] filter drop-shadow-[0_0_2px_white]" />
            </div>
        </>
    );
}

export function GameDialog() {
    const {isNarrator} = useDialog();
    const backdrop = useBackdrop("md");
    
    return (
        <Dialog className={clsx("rounded-2xl p-8 shadow-lg w-[90%] h-[90%] mb-4 AlimamaFangYuanTiVF-Thin bg-bottom relative bg-black/50 border-2 border-primary mx-auto", backdrop)}>
            <div className={clsx("absolute left-[30px] -top-8", {
                "hidden": isNarrator
            })}>
                <Nametag className={clsx("rounded-2xl border-2 border-primary bg-black/50 px-4 py-2 min-w-[220px] min-h-[56px] flex items-center justify-center", backdrop)} />
            </div>
            <div className="flex items-center gap-[5px] h-full">
                <SentenceContext />
            </div>
        </Dialog>
    )
}
