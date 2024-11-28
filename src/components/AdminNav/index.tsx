import { useAppSelector } from '@/hooks/useAppSelector';
import Link from 'next/link';
import { delete_cookie } from 'sfcookies';
import Logo from '../Logo';

export default function AdminNav() {
  const user = useAppSelector(store => store.userReducer.user)
  return (
    <>
      <div className="bg-slate-700 text-white p-5 w-full flex px-5 md:px-[10%] justify-between items-center">
        <Logo className="w-[120px] h-[50px] rounded" />

        <div>
          <h3>{user?.fname || "Loading..."}, {user?.lname}</h3>
          <Link
            href={'/api/auth/logout'}
            onClick={() => delete_cookie('token')}
            className='text-sm text-slate-300'
          >
            Logout
          </Link>
        </div>
      </div>
    </>
  );
}
