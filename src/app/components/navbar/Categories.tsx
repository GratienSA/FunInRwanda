"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { FaGift, FaBirthdayCake, FaGlassCheers, FaBuilding } from 'react-icons/fa'
import { GiPartyPopper } from 'react-icons/gi'
import CategoryBox from "../CategoryBox"
import Container from "../Container"

export const categories = [
    {
        label: 'Leisure',
        icon: GiPartyPopper,
        description: "Fun activities for everyone"
    },
    {
        label: 'Gifts',
        icon: FaGift,
        description: "Perfect gift ideas"
    },
    {
        label: 'Children',
        icon: FaBirthdayCake,
        description: "Celebrations and activities for kids"
    },
    {
        label: 'Bachelor/Bachelorette',
        icon: FaGlassCheers,
        description: "Celebrate adventures and fun activities with friends."
    },

    {
        label: 'Corporate',
        icon: FaBuilding,
        description: "Corporate events and team building"
    }
]

const Categories = () => {
    const params = useSearchParams();
    const category = params?.get('category');
    const pathname = usePathname();
    const isMainPage = pathname === '/';

    if (!isMainPage) {
        return null;
    }

    return (
        <Container>
            <div className="pt-4 flex flex-row items-center justify-between overflow-x-auto">
                {categories.map((item) => (
                    <CategoryBox
                        key={item.label}
                        label={item.label}
                        selected={category === item.label}
                        icon={item.icon}
                    />
                ))}
            </div>
        </Container>
    )
}

export default Categories