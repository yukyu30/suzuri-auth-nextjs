import Link from 'next/link';
import { SignIn } from '../SignIn';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '../ui/navigation-menu';

const Header = () => {
  return (
    <div className="flex justify-between">
      <Link href="/" legacyBehavior passHref>
        S Tools
      </Link>

      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem></NavigationMenuItem>
          <NavigationMenuItem>
            <SignIn />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default Header;
