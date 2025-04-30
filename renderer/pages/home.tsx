import React from "react";
import {useApp} from "narraleaf/client";

export default function Home() {
    const {app} = useApp();

    return (
        <div style={{
            width: "100%",
            height: "100%",
            backgroundColor: "white",
        }}>
            <button onClick={() => app.newGame()}>New Game</button>
        </div>
    );
}