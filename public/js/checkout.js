document.addEventListener("DOMContentLoaded", () => {
  // Đường dẫn tới file mới của bạn
  const host = "https://production.cas.so/address-kit/2025-07-01/communes";

  const provinceEl = document.querySelector("#province");
  const wardEl = document.querySelector("#ward");

  const provinceNameEl = document.querySelector("#provinceName");
  const wardNameEl = document.querySelector("#wardName");

  // Biến lưu trữ toàn bộ dữ liệu
  let allCommunes = [];

  // 1. Hàm tải dữ liệu và khởi tạo
  const loadData = async () => {
    try {
      const response = await fetch(host);
      const data = await response.json();

      // Dữ liệu mới nằm trong mảng "communes"
      allCommunes = data.communes || [];

      loadProvinces();
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    }
  };

  // 2. Tách và hiển thị danh sách Tỉnh/Thành phố
  const loadProvinces = () => {
    // Sử dụng Map để lọc các tỉnh duy nhất dựa trên provinceCode
    const uniqueProvinces = new Map();

    allCommunes.forEach((commune) => {
      if (!uniqueProvinces.has(commune.provinceCode)) {
        uniqueProvinces.set(commune.provinceCode, commune.provinceName);
      }
    });

    // Thêm option vào thẻ select
    uniqueProvinces.forEach((name, code) => {
      provinceEl.add(new Option(name, code));
    });
  };

  // 3. Sự kiện chọn Tỉnh/Thành phố
  provinceEl.addEventListener("change", () => {
    const provinceCode = provinceEl.value;

    // Lấy tên Tỉnh gán vào input ẩn
    const selectedOption = provinceEl.options[provinceEl.selectedIndex];
    provinceNameEl.value = selectedOption.text;

    wardEl.innerHTML = '<option value="">-- Chọn xã/phường --</option>';
    wardNameEl.value = "";

    if (!provinceCode) return;
    const wardsInProvince = allCommunes.filter(
      (c) => c.provinceCode === provinceCode
    );

    // Đổ dữ liệu thẳng vào ô Xã/Phường
    wardsInProvince.forEach((ward) => {
      wardEl.add(new Option(ward.name, ward.code));
    });
  });

  // 5. chọn Xã/Phường
  wardEl.addEventListener("change", () => {
    const selectedOption = wardEl.options[wardEl.selectedIndex];
    wardNameEl.value = selectedOption.text;
  });

  // Chạy hàm tải dữ liệu khi trang load
  loadData();
});
