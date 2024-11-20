import Link from 'next/link';
import { SignIn } from '../SignIn';
import { auth } from '@/auth';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
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
        <div className="flex items-end space-x-2">
          <img src="/stool.svg" alt="SToolのロゴ" width={70} className="my-4" />
          <span className="text-xs font-gray-500 pb-[12px]">
            SUZURI非公式ツール群
          </span>
        </div>
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
