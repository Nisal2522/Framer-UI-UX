import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  createdAt: number;
  /** Optional audience label for demo (e.g. AC Committee) */
  audience?: string;
};

type NotificationContextValue = {
  notifications: AppNotification[];
  addNotification: (n: Omit<AppNotification, "id" | "createdAt"> & { id?: string }) => void;
  markAllRead: () => void;
  unreadCount: number;
};

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [readUpTo, setReadUpTo] = useState(0);

  const addNotification = useCallback(
    (n: Omit<AppNotification, "id" | "createdAt"> & { id?: string }) => {
      const id = n.id ?? `n-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      setNotifications((prev) => [
        {
          id,
          title: n.title,
          body: n.body,
          audience: n.audience,
          createdAt: Date.now(),
        },
        ...prev,
      ]);
    },
    []
  );

  const markAllRead = useCallback(() => {
    setReadUpTo(Date.now());
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.createdAt > readUpTo).length,
    [notifications, readUpTo]
  );

  const value = useMemo(
    () => ({ notifications, addNotification, markAllRead, unreadCount }),
    [notifications, addNotification, markAllRead, unreadCount]
  );

  return (
    <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return ctx;
}
