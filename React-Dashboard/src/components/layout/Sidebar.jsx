import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useOrderFilters } from '../../context/FilterContext';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Orders', path: '/orders', icon: ShoppingBag, showCount: true },
  { label: 'Customers', path: '/customers', icon: Users },
  { label: 'Analytics', path: '/analytics', icon: BarChart3 },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  drawerWidth = 260,
  collapsedWidth = 72,
}) => {
  const theme = useTheme();
  const location = useLocation();
  const isDark = theme.palette.mode === 'dark';
  const { filteredOrders } = useOrderFilters();

  const sidebarContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: isDark ? '#111827' : '#ffffff',
        borderRight: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(226, 232, 240, 0.8)'}`,
        transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        overflowX: 'hidden',
      }}
    >
      {/* Brand Header */}
      <Box
        sx={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          px: collapsed ? 1 : 2.5,
          borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(226, 232, 240, 0.8)'}`,
        }}
      >
        <Box
          component={NavLink}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          {/* Logo Mark */}
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(99, 102, 241, 0.35)',
              flexShrink: 0,
            }}
          >
            <Zap size={20} />
          </Box>

          {!collapsed && (
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  letterSpacing: '-0.02em',
                  background: 'linear-gradient(135deg, #6366f1 0%, #0ea5e9 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1.1,
                }}
              >
                Orderly
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.68rem', fontWeight: 600 }}>
                ANALYTICS SUITE
              </Typography>
            </Box>
          )}
        </Box>

        {/* Desktop Collapse Toggle Button */}
        {!collapsed && (
          <IconButton
            size="small"
            onClick={onToggleCollapse}
            sx={{
              display: { xs: 'none', md: 'flex' },
              color: 'text.secondary',
              '&:hover': { color: 'text.primary' },
            }}
          >
            <ChevronLeft size={18} />
          </IconButton>
        )}
      </Box>

      {/* Navigation List */}
      <List sx={{ px: 1.5, py: 2, flex: 1 }}>
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.path === '/'
              ? location.pathname === '/' || location.pathname === '/dashboard'
              : location.pathname.startsWith(item.path);

          const IconComponent = item.icon;

          return (
            <ListItem key={item.label} disablePadding sx={{ mb: 0.75 }}>
              <Tooltip title={collapsed ? item.label : ''} placement="right">
                <ListItemButton
                  component={NavLink}
                  to={item.path}
                  onClick={() => {
                    if (mobileOpen && onCloseMobile) onCloseMobile();
                  }}
                  sx={{
                    minHeight: 46,
                    borderRadius: 2,
                    px: collapsed ? 1.5 : 2,
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    bgcolor: isActive
                      ? isDark
                        ? 'rgba(99, 102, 241, 0.16)'
                        : 'rgba(99, 102, 241, 0.08)'
                      : 'transparent',
                    color: isActive ? 'primary.main' : 'text.secondary',
                    fontWeight: isActive ? 700 : 500,
                    transition: 'all 0.15s ease',
                    position: 'relative',
                    '&:hover': {
                      bgcolor: isActive
                        ? isDark
                          ? 'rgba(99, 102, 241, 0.22)'
                          : 'rgba(99, 102, 241, 0.12)'
                        : isDark
                        ? 'rgba(255, 255, 255, 0.04)'
                        : 'rgba(0, 0, 0, 0.04)',
                      color: isActive ? 'primary.main' : 'text.primary',
                    },
                  }}
                >
                  {/* Left accent bar for active item */}
                  {isActive && (
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 0,
                        top: '18%',
                        bottom: '18%',
                        width: 3.5,
                        borderRadius: '0 4px 4px 0',
                        bgcolor: 'primary.main',
                      }}
                    />
                  )}

                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: collapsed ? 0 : 2,
                      justifyContent: 'center',
                      color: isActive ? 'primary.main' : 'inherit',
                    }}
                  >
                    <IconComponent size={20} strokeWidth={isActive ? 2.3 : 1.8} />
                  </ListItemIcon>

                  {!collapsed && (
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: '0.88rem',
                        fontWeight: isActive ? 700 : 500,
                      }}
                    />
                  )}

                  {!collapsed && item.showCount && (
                    <Chip
                      label={filteredOrders.length}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        bgcolor: isActive ? 'primary.main' : isDark ? '#1f2937' : '#e2e8f0',
                        color: isActive ? '#ffffff' : 'text.secondary',
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      {/* Expand Button when collapsed */}
      {collapsed && (
        <Box sx={{ p: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
          <Tooltip title="Expand Sidebar" placement="right">
            <IconButton onClick={onToggleCollapse} size="small" sx={{ color: 'text.secondary' }}>
              <ChevronRight size={18} />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      {/* Bottom Pro Badge Card */}
      {!collapsed && (
        <Box sx={{ p: 2, m: 2, borderRadius: 2.5, bgcolor: isDark ? 'rgba(30, 41, 59, 0.6)' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: '6px',
                bgcolor: 'success.main',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={14} />
            </Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.82rem' }}>
              Orderly Enterprise
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1, fontSize: '0.72rem' }}>
            Real-time analytics engine active & synchronized.
          </Typography>
        </Box>
      )}
    </Box>
  );

  return (
    <>
      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: collapsed ? collapsedWidth : drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: collapsed ? collapsedWidth : drawerWidth,
            boxSizing: 'border-box',
            borderRight: 'none',
            overflowX: 'hidden',
          },
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* Mobile/Tablet Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onCloseMobile}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    </>
  );
};

export default Sidebar;

