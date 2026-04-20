import { RouterProvider } from "react-router";
import { Toaster } from "sonner";
import { router } from "./routes";
import { NotificationProvider } from "./context/NotificationContext";

export default function App() {
  const buildVersion =
    import.meta.env.VITE_BUILD_VERSION ||
    import.meta.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ||
    "local-dev";

  return (
    <NotificationProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors closeButton />
      <div className="fixed bottom-3 left-3 z-[9999] rounded-md border border-slate-300 bg-white/95 px-2 py-1 text-[10px] font-medium text-slate-600 shadow-sm">
        Build: {buildVersion}
      </div>
    </NotificationProvider>
  );
}
