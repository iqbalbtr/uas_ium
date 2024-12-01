"use client"
import { LoadingType } from '@hooks/use-loading'
import React from 'react'

function Loading({ isLoading, type = "line", className, ...props }: { isLoading: LoadingType, type?: "loader" | "line" } & React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>) {

    function getType() {
        switch (type) {
            case "line":
                return "loader-btn";
            case "loader":
                return "loader";
            default:
                return "loader"
        }
    }

    return isLoading === "loading" ? (
        <span className={getType()} {...props} />
    ) : props.children
}

export default Loading
