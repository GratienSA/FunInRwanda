'use client'

import { Route } from 'next'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { BiSearch } from 'react-icons/bi'

const Search = () => {
    const router = useRouter()
    const params = useSearchParams()

    const [keyword, setKeyword] = useState('')

    useEffect(() => {
        const currentKeyword = params?.get('q')
        if (currentKeyword) {
            setKeyword(currentKeyword)
        }
    }, [params])

    const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setKeyword(e.target.value)
    }

    const handleSearch = () => {
        const query = new URLSearchParams(params?.toString()) // conserver les paramètres existants
        if (keyword) query.set('q', keyword)
        else query.delete('q')

        const searchUrl = `/search?${query.toString()}`
        router.push(searchUrl as unknown as Route)
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    return (
        <div className="w-full md:w-auto py-2 rounded-full shadow-sm hover:shadow-md transition">
            <div className="text-sm pl-6 pr-2 text-gray-600 flex flex-row items-center gap-3">
                <input
                    type="text"
                    value={keyword}
                    onChange={handleKeywordChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Rechercher par mot clé"
                    className="border border-gray-300 rounded-full p-2 outline-none w-full sm:w-auto"
                    aria-label="Search input"
                />

                <div
                    className="p-2 bg-blue-500 rounded-full text-white cursor-pointer"
                    onClick={handleSearch}
                >
                    <BiSearch size={18} />
                </div>
            </div>
        </div>
    )
}

export default Search
