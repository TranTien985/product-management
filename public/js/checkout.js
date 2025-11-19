// File: public/js/checkout.js

document.addEventListener("DOMContentLoaded", () => {
  const host = "https://provinces.open-api.vn/api/";
  const provinceEl = document.querySelector("#province");
  const districtEl = document.querySelector("#district");
  const wardEl = document.querySelector("#ward");

  const provinceNameEl = document.querySelector("#provinceName");
  const districtNameEl = document.querySelector("#districtName");
  const wardNameEl = document.querySelector("#wardName");

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
        provinceEl.add(new Option(province.name, province.code));
      });
    } catch (error) {
      console.error("Lỗi khi tải tỉnh/thành phố:", error);
    }
  };

  // 3. Sự kiện chọn Tỉnh/Thành phố
  provinceEl.addEventListener("change", async () => {
    const provinceCode = provinceEl.value;
    
    // --- MỚI: Lấy tên Tỉnh và gán vào input ẩn ---
    const selectedOption = provinceEl.options[provinceEl.selectedIndex];
    provinceNameEl.value = selectedOption.text; 
    // ---------------------------------------------

    // Xóa danh sách quận/huyện và xã/phường cũ
    districtEl.innerHTML = '<option value="">-- Chọn quận/huyện --</option>';
    wardEl.innerHTML = '<option value="">-- Chọn xã/phường --</option>';
    districtNameEl.value = ""; // Reset tên huyện
    wardNameEl.value = "";     // Reset tên xã

    if (!provinceCode) return;

    try {
      const data = await callApi(`${host}p/${provinceCode}?depth=2`);
      data.districts.forEach(district => {
        districtEl.add(new Option(district.name, district.code));
      });
    } catch (error) {
      console.error("Lỗi khi tải quận/huyện:", error);
    }
  });

  // 4. Sự kiện chọn Quận/Huyện
  districtEl.addEventListener("change", async () => {
    const districtCode = districtEl.value;

    // --- MỚI: Lấy tên Quận và gán vào input ẩn ---
    const selectedOption = districtEl.options[districtEl.selectedIndex];
    districtNameEl.value = selectedOption.text;
    // ---------------------------------------------

    // Xóa danh sách xã/phường cũ
    wardEl.innerHTML = '<option value="">-- Chọn xã/phường --</option>';
    wardNameEl.value = ""; // Reset tên xã

    if (!districtCode) return;

    try {
      const data = await callApi(`${host}d/${districtCode}?depth=2`);
      data.wards.forEach(ward => {
        wardEl.add(new Option(ward.name, ward.code));
      });
    } catch (error) {
      console.error("Lỗi khi tải xã/phường:", error);
    }
  });

  // 5. Sự kiện chọn Xã/Phường (Mới thêm)
  wardEl.addEventListener("change", () => {
    // --- MỚI: Lấy tên Xã và gán vào input ẩn ---
    const selectedOption = wardEl.options[wardEl.selectedIndex];
    wardNameEl.value = selectedOption.text;
    // -------------------------------------------
  });

  // Chạy hàm tải tỉnh/thành phố khi trang được load
  loadProvinces();
});