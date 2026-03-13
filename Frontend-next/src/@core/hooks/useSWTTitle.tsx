"use client";

import { useEffect } from "react"

const useSWTTitle = (title: string) => {
    useEffect(() => {
        document.title = title;
    }, [title]);
}

export default useSWTTitle;