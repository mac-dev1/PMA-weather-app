'use client';

import { PowerIcon } from '@heroicons/react/24/outline';
import NavLinks from '@/app/ui/home/nav-links';
import { useState } from 'react';
import { PMAModal } from '../pma-modal';
import { logout } from '@/app/lib/actions';

export default function SideNav() {
  const [showInfo, setShowInfo] = useState(false);
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <div
        className="mb-2 flex h-20 items-center justify-center rounded-md bg-blue-600 p-4 md:h-40"
      >
        <div className="flex flex-col w-64 text-white text-center">
          <button
              onClick={() => setShowInfo(true)}
              className="inline-flex items-center justify-center gap-2 font-semibold underline-offset-4 transition hover:underline hover:text-blue-100"
          >
              More about PM Accelerator
          </button>
          <p className="mt-3 text-sm text-blue-100">Developed by M. Casarotto</p>
                    {showInfo && (
              <PMAModal onClose={() => setShowInfo(false)} />
          )}
        </div>
      </div>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <form action={logout}>
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
