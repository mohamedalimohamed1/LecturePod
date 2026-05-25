import useAppStore from '../../store/useAppStore.js';

function Notification() {
  const notification = useAppStore((state) => state.notification);

  if (!notification) {
    return null;
  }

  return (
    <div className={`app-notification ${notification.type ?? 'info'}`} role="status">
      {notification.message}
    </div>
  );
}

export default Notification;
