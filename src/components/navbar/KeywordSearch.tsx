"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { BiSearch } from "react-icons/bi";

const KeywordSearch = () => {
    const [keyword, setKeyword] = useState(''); // État pour le mot clé
    const router = useRouter();

    const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setKeyword(e.target.value); // Mise à jour de l'état du mot clé
    };

    const handleSearch = () => {
        if (!keyword) return; // Ne pas chercher si le champ est vide

        const query = { keyword };
        const searchUrl = `/search?${new URLSearchParams(query as any).toString()}`;

        router.push(searchUrl); // Rediriger vers l'URL de la recherche
    };

    return (
        <div className="flex flex-row items-center justify-between border-[1px] p-2 rounded-full shadow-sm hover:shadow-md transition">
            <input 
                type="text" 
                value={keyword} 
                onChange={handleKeywordChange} 
                placeholder="Enter keyword"
                className="border-none outline-none flex-grow px-4"
            />
            <div className="p-2 bg-blue-500 rounded-full text-white cursor-pointer" onClick={handleSearch}>
                <BiSearch size={18} />
            </div>
        </div>
    );
};

export default KeywordSearch;
