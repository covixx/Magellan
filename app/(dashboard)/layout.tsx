"use client";

import { Header } from "@/components/header";
import { usePathname } from 'next/navigation';
import { SwitchProvider } from "@/app/switch-context"; // Import SwitchProvider

type Props = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: Props) => {
  const path = usePathname();
  const isLockingIn = path === '/lockingin';

  return (
    <SwitchProvider>
      {!isLockingIn && <Header />}
      <main className="px-3 lg:px-14">
        {children}
      </main>
    </SwitchProvider>
  );
};

export default DashboardLayout;
