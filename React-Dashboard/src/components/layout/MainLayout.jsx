import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import OrderDetailsModal from '../orders/OrderDetailsModal';

export const MainLayout = () => {
  const theme = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const drawerWidth = 260;
  const collapsedWidth = 72;

  const handleToggleSidebar = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleToggleCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  const handleCloseMobile = () => {
    setMobileOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sidebar (Desktop + Mobile) */}
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={handleToggleCollapse}
        mobileOpen={mobileOpen}
        onCloseMobile={handleCloseMobile}
        drawerWidth={drawerWidth}
        collapsedWidth={collapsedWidth}
      />

      {/* Main Content Area */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          width: {
            md: `calc(100% - ${collapsed ? collapsedWidth : drawerWidth}px)`,
          },
          minHeight: '100vh',
          transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Top Navigation */}
        <TopNavbar
          onToggleSidebar={handleToggleSidebar}
          isSidebarCollapsed={collapsed}
        />

        {/* Page View Container */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3, md: 3.5 },
            width: '100%',
            maxWidth: 1600,
            mx: 'auto',
          }}
        >
          <Outlet />
        </Box>
      </Box>

      {/* Global Order Details Modal */}
      <OrderDetailsModal />
    </Box>
  );
};

export default MainLayout;

