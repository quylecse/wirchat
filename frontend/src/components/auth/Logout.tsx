import { Button } from "../ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { signOut } = useAuthStore();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/signin");
    } catch (error) {
      console.log(error);
    }
  };

  return <Button onClick={handleLogout}>Logout</Button>;
};

export default Logout;
