import Link from 'next/link';
import { SignIn } from '../SignIn';
import { auth } from '@/auth';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '../ui/dropdown-menu';
import { SignOut } from '../SignOut';

const Header = async () => {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="flex justify-between border-b pb-2 border-gray-200">
      <Link href="/" legacyBehavior passHref>
        <div className="flex items-center">S Tools</div>
      </Link>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src={user.image || undefined} />
              <AvatarFallback>{user.name}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link href={`https://suzuri.jp/${user.name}`}>
                自分のショップに行く
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className="flex justify-center">
              <SignOut />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <SignIn />
      )}
    </div>
  );
};

export default Header;
