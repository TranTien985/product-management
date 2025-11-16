// File: public/js/checkout.js

document.addEventListener("DOMContentLoaded", () => {
  const host = "https://provinces.open-api.vn/api/";
  const provinceEl = document.querySelector("#province");
  const districtEl = document.querySelector("#district");
  const wardEl = document.querySelector("#ward");

  // 1. Hàm gọi API chung
  const callApi = async (api) => {
    const response = await fetch(api);
    return response.json();
  };

  // 2. Tải danh sách Tỉnh/Thành phố khi load trang
  const loadProvinces = async () => {
    try {
      const provinces = await callApi(host + "?depth=1");
      provinces.forEach(province => {
        // Dùng new Option(text, value)
        provinceEl.add(new Option(province.name, province.code));
      });
    } catch (error) {
      console.error("Lỗi khi tải tỉnh/thành phố:", error);
    }
  };

  // 3. Tải Quận/Huyện khi Tỉnh/Thành phố thay đổi
  provinceEl.addEventListener("change", async () => {
    const provinceCode = provinceEl.value;

    // Xóa danh sách quận/huyện và xã/phường cũ
    districtEl.innerHTML = '<option value="">-- Chọn quận/huyện --</option>';
    wardEl.innerHTML = '<option value="">-- Chọn xã/phường --</option>';

    if (!provinceCode) return; // Nếu chọn "Chọn tỉnh/thành phố"

    try {
      // Gọi API tỉnh/thành với code để lấy danh sách quận/huyện
      const data = await callApi(`${host}p/${provinceCode}?depth=2`);
      data.districts.forEach(district => {
        districtEl.add(new Option(district.name, district.code));
      });
    } catch (error) {
      console.error("Lỗi khi tải quận/huyện:", error);
    }
  });

  // 4. Tải Xã/Phường khi Quận/Huyện thay đổi
  districtEl.addEventListener("change", async () => {
    const districtCode = districtEl.value;

    // Xóa danh sách xã/phường cũ
    wardEl.innerHTML = '<option value="">-- Chọn xã/phường --</option>';

    if (!districtCode) return; // Nếu chọn "Chọn quận/huyện"

    try {
      // Gọi API quận/huyện với code để lấy danh sách xã/phường
      const data = await callApi(`${host}d/${districtCode}?depth=2`);
      data.wards.forEach(ward => {
        wardEl.add(new Option(ward.name, ward.code));
      });
    } catch (error) {
      console.error("Lỗi khi tải xã/phường:", error);
    }
  });

  // Chạy hàm tải tỉnh/thành phố khi trang được load
  loadProvinces();
});