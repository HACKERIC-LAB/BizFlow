import { Bell, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../store/authStore';
import { Menu as HeadlessMenu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export const AppHeader = () => {
  const { user } = useAuth();
  const logout = useAuthStore(state => state.logout);

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-neutral-border h-16 flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center text-primary font-bold text-lg">
          {user?.businessName?.[0] || 'B'}
        </div>
        <div>
          <h1 className="text-lg font-bold leading-tight">{user?.businessName}</h1>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-mpesa-green rounded-full animate-pulse" />
            <span className="text-[10px] uppercase font-bold text-neutral-textLight tracking-wider">Live</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative p-2 text-neutral-textMid hover:bg-neutral-background rounded-full transition-standard">
          <Bell size={22} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-accent-red rounded-full border-2 border-white" />
        </button>

        <HeadlessMenu as="div" className="relative">
          <HeadlessMenu.Button className="p-2 text-neutral-textMid hover:bg-neutral-background rounded-full transition-standard">
            <UserIcon size={22} />
          </HeadlessMenu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <HeadlessMenu.Items className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-neutral-border rounded-card bg-white shadow-large ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-4 py-3">
                <p className="text-sm font-medium text-neutral-darkNavy">{user?.name}</p>
                <p className="text-xs text-neutral-textLight truncate">{user?.phone}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-primary-light text-primary text-[10px] font-bold rounded-badge uppercase">
                  {user?.role}
                </span>
              </div>
              <div className="py-1">
                <HeadlessMenu.Item>
                  {({ active }) => (
                    <button
                      onClick={logout}
                      className={`${
                        active ? 'bg-neutral-background text-accent-red' : 'text-neutral-textMid'
                      } group flex w-full items-center px-4 py-2 text-sm transition-standard`}
                    >
                      <LogOut size={16} className="mr-3" />
                      Sign Out
                    </button>
                  )}
                </HeadlessMenu.Item>
              </div>
            </HeadlessMenu.Items>
          </Transition>
        </HeadlessMenu>
      </div>
    </header>
  );
};
