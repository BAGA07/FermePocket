// src/components/MobileTopBar.jsx
import { useMemo } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { ArrowLeft, Bell } from 'lucide-react';
import NotificationButton from './NotificationButton';

export default function MobileTopBar() {
  const location = useLocation();

  const title = useMemo(() => {
    const path = location.pathname;
    if (path === '/') return 'Tableau de bord';
    if (path.startsWith('/elevage')) return 'Élevage';
    if (path.startsWith('/stocks')) return 'Stocks';
    if (path.startsWith('/couveuse')) return 'Couveuses';
    if (path.startsWith('/personnel')) return 'GRH';
    if (path.startsWith('/rapports')) return 'Rapports';
    if (path.startsWith('/finances')) return 'Finances';
    return 'FermePocket';
  }, [location.pathname]);

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-50">
      <div className="h-12 flex items-center justify-between px-4">
        {/* Back to dashboard on logo/title click */}
        <NavLink to="/" className="text-green-700 font-semibold">{title}</NavLink>
        <div className="flex items-center gap-2">
          <NotificationButton variant="mobile" />
          <img
            src="https://ui-avatars.com/api/?name=AB&background=16a34a&color=fff"
            alt="Profil"
            className="w-8 h-8 rounded-full border border-green-600"
          />
        </div>
      </div>
    </header>
  );
}
