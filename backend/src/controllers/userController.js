export const authMe = async (req, res) => {
    // Sau khi middleware `protectedRoute` chạy, thông tin người dùng sẽ được đính kèm vào `req.user`
    if (req.user) {
        // Trả về thông tin người dùng đã được xác thực
        return res.status(200).json({ user: req.user });
    } else {
        // Trường hợp không tìm thấy người dùng (mặc dù middleware đã chạy, điều này không nên xảy ra)
        return res.status(401).json({ message: "Không tìm thấy thông tin người dùng." });
    }
};