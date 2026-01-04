// XỬ LÝ ĐẾM NGƯỢC THEO DB

// 1. Lấy giá trị thời gian hết hạn từ input ẩn
const expireAtRaw = document.getElementById("data-expire-at").value;
const countdownElement = document.getElementById("otp-countdown");
const btnResend = document.getElementById("btn-resend");
const btnConfirm = document.getElementById("btn-confirm");

if (expireAtRaw) {
  // Chuyển đổi chuỗi thời gian của DB thành Timestamp
  const endTime = new Date(expireAtRaw).getTime();

  const countdownTimer = setInterval(() => {
    // Lấy thời gian hiện tại
    const now = new Date().getTime();

    // Tính khoảng cách thời gian (ms)
    const distance = endTime - now;

    // Nếu hết giờ
    if (distance < 0) {
      clearInterval(countdownTimer);
      countdownElement.innerText = "Hết hạn";
      countdownElement.style.color = "gray";

      // Mở khóa nút gửi lại
      btnResend.style.pointerEvents = "auto";
      btnResend.style.cursor = "pointer";
      btnResend.style.opacity = "1";
      btnResend.classList.remove("text-muted");
      btnResend.classList.add("text-primary");
      return;
    }

    // Tính toán phút và giây
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Format số 0 ở đầu (ví dụ: 05 thay vì 5)
    const displayMin = minutes < 10 ? "0" + minutes : minutes;
    const displaySec = seconds < 10 ? "0" + seconds : seconds;

    // Hiển thị
    countdownElement.innerText = `${displayMin}:${displaySec}`;
  }, 1000);
} else {
  // Trường hợp không có expireAt (lỗi DB)
  countdownElement.innerText = "N/A";
}
