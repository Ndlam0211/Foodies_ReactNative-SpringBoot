 [Người dùng chọn món & tùy chọn]
                |
                v
   ┌─────────────────────────────┐
   | Bấm nút "Add to Cart"       |
   └─────────────────────────────┘
                |
                v
 ┌───────────────────────────────────────┐
 | 1. Gọi hàm transformSelectedOptions   |
 |    - Chuyển index → dữ liệu option    |
 |    - Validate loại & giá trị          |
 └───────────────────────────────────────┘
                |
                v
 ┌───────────────────────────────────────┐
 | 2. Sắp xếp danh sách option theo type |
 |    (localeCompare để đảm bảo thứ tự)  |
 └───────────────────────────────────────┘
                |
                v
 ┌─────────────────────────────────────────────┐
 | 3. Tạo object customizedData chứa:          |
 |    - Thông tin nhà hàng (restaurant)         |
 |    - Thông tin món (item)                    |
 |    - Số lượng, giá                           |
 |    - Danh sách option đã xử lý               |
 └─────────────────────────────────────────────┘
                |
                v
 ┌──────────────────────────────────────────┐
 | 4. dispatch(addCustomizableItem(...))    |
 |    → Redux Store lưu món ăn vào giỏ hàng |
 └──────────────────────────────────────────┘
                |
                v
 ┌───────────────────────────────┐
 | 5. onClose()                   |
 |    → Đóng popup chọn món       |
 └───────────────────────────────┘
                |
                v
         [Giỏ hàng đã cập nhật]
