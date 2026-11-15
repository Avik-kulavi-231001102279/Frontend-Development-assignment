// Mock Notifications for Orderly Dashboard
export const initialNotifications = [
  {
    id: 'notif-1',
    title: 'New High-Value Order Placed',
    message: 'Order ORD-7821 for $399.99 from Sarah Jenkins has been confirmed.',
    time: '10 minutes ago',
    type: 'order',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'Payment Successful',
    message: 'PayPal payment of $285.50 received for Order ORD-7820.',
    time: '1 hour ago',
    type: 'payment',
    read: false,
  },
  {
    id: 'notif-3',
    title: 'Inventory Alert',
    message: 'Sony WH-1000XM5 stock is running low (only 4 units remaining).',
    time: '3 hours ago',
    type: 'inventory',
    read: false,
  },
  {
    id: 'notif-4',
    title: 'Order Refunded',
    message: 'Order ORD-7816 for James Wilson was cancelled and refunded ($145.00).',
    time: 'Yesterday',
    type: 'refund',
    read: true,
  },
  {
    id: 'notif-5',
    title: 'New Customer Registered',
    message: 'Alexander Wright completed their first purchase and reached VIP status.',
    time: '2 days ago',
    type: 'customer',
    read: true,
  },
];

