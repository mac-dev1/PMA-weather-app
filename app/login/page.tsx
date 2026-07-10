'use client'

import LoginForm from '@/app/ui/login-form';
import RegisterForm from '../ui/register-form';
import { useState, Suspense } from 'react';
 
export default function LoginPage() {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <main className="flex justify-center md:pt-40 md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
        </div>
        <div className="flex border-b">
        <button
          onClick={() => setActiveTab('login')}
          className={`flex-1 p-3 ${
              activeTab === 'login'
                ? 'border-b-2 border-blue-500 font-semibold'
                : 'text-gray-500'
            }`}
          >
            Login
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 p-3 ${
              activeTab === 'register'
                ? 'border-b-2 border-blue-500 font-semibold'
                : 'text-gray-500'
            }`}
          >
            Register
          </button>
        </div>

        <div className="mt-6">
          {activeTab === 'login' ? (
            <Suspense>
              <LoginForm />
            </Suspense>
          ) : (
            <Suspense>
              <RegisterForm />
            </Suspense>
          )}
        </div>
      </div>
    </main>
  );
}