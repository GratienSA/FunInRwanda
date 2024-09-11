"use client";

import { PuffLoader } from "react-spinners";

const Loader = () => {
    return (
        <div className="flex flex-col justify-center items-center h-[70vh]">
            <PuffLoader color="#6c5ce7" size={150} />
        </div>
    );
}

export default Loader;