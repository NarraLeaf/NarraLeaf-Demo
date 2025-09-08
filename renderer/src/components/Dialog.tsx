import React from 'react';
import { Dialog, Texts, Nametag, useDialog } from "narraleaf-react";
import clsx from 'clsx';

function SentenceContext() {
    const { done } = useDialog();

    return (
        <>
            <Texts className="text-[22px] max-w-max flex items-center" />
            {/* Add inverted triangle and underline */}
            <div className="flex flex-col items-center">
                {/* Inverted triangle */}
                <div className={clsx(
                    "w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-white",
                    done ? 'opacity-100' : 'opacity-0'
                )} />
                {/* Underline */}
                <div className="w-[12px] h-[2px] bg-white mt-[2px]" />
            </div>
        </>
    );
}

export function GameDialog() {
    const { isNarrator } = useDialog();

    return (
        <Dialog
            className={clsx(
                "absolute bottom-4 left-1/2 -translate-x-1/2 p-12 px-16 w-[90%] h-[216px] ZhanKu"
            )}
            style={{
                backgroundImage: "url('/static/img/ui/dialog/game-dialog.png')",
                backgroundSize: 'contain',
                backgroundPosition: 'bottom',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <div className={clsx("absolute left-[30px] -top-[15px]", {
                "hidden": isNarrator
            })}>
                <Nametag
                    className={clsx(
                        "px-4 py-2 min-w-[220px] min-h-[56px] flex items-center justify-center text-primary ZhanKu"
                    )}
                    style={{
                        backgroundImage: "url('/static/img/ui/dialog/game-dialog-nametag.png')",
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                />
            </div>
            <div className="flex items-center gap-[5px] h-full">
                <SentenceContext />
            </div>
        </Dialog>
    )
}
