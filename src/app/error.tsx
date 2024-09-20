"use client";

import { useEffect } from "react";
import EmptyState from "../components/EmptyState";

interface ErrorStateProps {
    error: Error;
    title?: string;
    subtitle?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({
    error,
    title = "Oooh",
    subtitle = "Something went wrong!",
}) => {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <EmptyState
            title={title}
            subtitle={`${subtitle} Error: ${error.message}`}
        />
    );
};

export default ErrorState;