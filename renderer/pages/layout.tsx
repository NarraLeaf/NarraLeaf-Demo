import React, { useEffect } from "react";
import { useApp } from "narraleaf/client";

export default function Layout({children}: {children: React.ReactNode}) {

    return (
        <>
            {children}
        </>
    );
}

