import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // Sử dụng selector để tối ưu hóa, chỉ re-render khi các giá trị này thay đổi
  const accessToken = useAuthStore((state) => state.accessToken);
  const loading = useAuthStore((state) => state.loading);
  const fetchMe = useAuthStore((state) => state.fetchMe);

  useEffect(() => {
    // Nếu không có token trong store (ví dụ: sau khi tải lại trang),
    // hãy thử khôi phục phiên đăng nhập bằng cách gọi fetchMe.
    if (!accessToken) {
      fetchMe().catch(() => {
        // Bắt lỗi ở đây để ngăn lỗi "unhandled promise rejection"
        // trong trường hợp người dùng thực sự chưa đăng nhập.
      });
    }
  }, [accessToken, fetchMe]);

  // Trong khi đang kiểm tra phiên đăng nhập, hiển thị trạng thái tải
  if (loading) {
    return <div>Loading...</div>; // Có thể thay bằng một component Spinner đẹp hơn
  }

  // Sau khi kiểm tra xong, nếu vẫn không có token, chuyển hướng về trang đăng nhập
  if (!accessToken && !loading) {
    return <Navigate to="/signin" replace></Navigate>;
  }

  // Nếu có token, cho phép truy cập vào trang được bảo vệ
  return <Outlet />;
};

export default ProtectedRoute;
