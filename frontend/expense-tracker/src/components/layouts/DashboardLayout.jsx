import React, { useContext, useState } from 'react';
import { UserContext } from '../../context/userContext';
import Navbar from './Navbar';
import SideMenu from './SideMenu';

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  // Responsive: always show on desktop, toggle on mobile
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1080) {
        setSidebarVisible(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggleSidebar = () => {
    setSidebarVisible((v) => !v);
  };

  return (
    <div className="">
      <Navbar onToggleSidebar={handleToggleSidebar} />
      {user && (
        <div className="flex">
          {sidebarVisible && (
            <div>
              <SideMenu activeMenu={activeMenu} />
            </div>
          )}
          <div className="grow mx-5">{children}</div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
