import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { Button } from "../ui/button";

export default function Header() {
  return (
    <header className='flex w-full justify-between items-center h-12 bg-orange-500 text-white px-2'>
      <Link to={"/"} className="text-center h-auto">
      <img
        src="/NutriBin_Logo.svg"
        alt="NutriBin Logo"
        className="h-8 px-4"
      />


      </Link>
      <nav className="flex w-auto px-2 gap-4">
        <Button asChild className={"bg-transparent hover:bg-amber-700"}>
          <Link to={'/login'}>
            Home
          </Link>
          </Button>
        <Button asChild className={"bg-transparent hover:bg-amber-700"}>
          <Link to={'/guide'}>
            Guide
          </Link>
          </Button>
        <Button asChild className={"bg-transparent hover:bg-amber-700"}>
          <Link to={'/register'}>
            Register
          </Link>
          </Button>
      </nav>
    </header>
  );
}
