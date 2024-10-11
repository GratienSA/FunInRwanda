"use client"

import Logo from '../navbar/Logo'
import { PowerIcon } from 'lucide-react'
import { Button } from '../ui/button'
import NavLinks from './NavLink'
import ModeToggle from '../dashboard/ModeToggle'
import { logout } from '@/src/actions/logout'



export default function SideNav() {
  return (
    <div className="flex flex-col h-full p-3">
      <div>
        <Logo />
      </div>

      <div className="flex flex-row grow  space-x-2 md:flex-col md:space-x-0 md:space-y-2 md:mt-2">
        <NavLinks />
        <div className="h-auto w-full grow rounded-md md:block"></div>

        <div className="flex md:flex-col ">
          <ModeToggle />
          <form
            action={logout}
          >
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground"
            >
              <PowerIcon className="w-6 mr-2" />
              <div className="hidden md:block">Sign Out</div>
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}