import Logout from "@/components/auth/Logout";
import { useAuthStore } from "@/stores/useAuthStore";

const ChatAppPage = () => {
  const user = useAuthStore((s) => s.user);
  return (
    <>
      <h1>Willkommen, {user?.displayName || user?.username}!</h1>
      <Logout></Logout>
    </>
  );
};

export default ChatAppPage;
