// Hàm khởi tạo slider cho product
function initializeProductSlider(containerSelector, delay = 5000) {
    const sliderContainer = document.querySelector(containerSelector);
    if (!sliderContainer) {
        console.log(`Không tìm thấy product slider container: ${containerSelector}`);
        return;
    }

    const slidesContainer = sliderContainer.querySelector('.product-slides');
    const productGroups = slidesContainer.querySelectorAll('.product-group');
    const prevBtn = sliderContainer.querySelector('.slider-prev');
    const nextBtn = sliderContainer.querySelector('.slider-next');

    // Tính số nhóm thực (2 nhóm thực)
    const totalRealGroups = 2;
    let currentIndex = 1; // Bắt đầu từ nhóm thực đầu tiên
    let intervalId = null;
    let lastClickTime = 0;
    const CLICK_DELAY = 400; // Chỉ cho click mỗi 400ms

    // Biến cho tính năng kéo
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let animationID;
    let currentSlideWidth;

    function startAutoSlide() {
        stopAutoSlide();
        intervalId = setInterval(nextSlide, delay);
    }

    function stopAutoSlide() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    function updateSlideWidth() {
        currentSlideWidth = sliderContainer.offsetWidth;
    }

    function goToGroup(index, instant = false) {
        if (instant) {
            slidesContainer.style.transition = 'none';
        } else {
            slidesContainer.style.transition = 'transform 0.4s ease';
        }

        // Tính toán transform: mỗi nhóm chiếm 25% (vì có 4 nhóm)
        const translateX = -index * 25;
        slidesContainer.style.transform = `translateX(${translateX}%)`;

        currentIndex = index;

        // Xử lý vòng lặp vô hạn
        if (!instant) {
            setTimeout(() => {
                if (currentIndex === 0) {
                    // Nhảy về nhóm thực cuối cùng (index = 2)
                    goToGroup(2, true);
                } else if (currentIndex === 3) {
                    // Nhảy về nhóm thực đầu tiên (index = 1)
                    goToGroup(1, true);
                }
            }, 400);
        }
    }

    function nextSlide() {
        const now = Date.now();
        if (now - lastClickTime < CLICK_DELAY) return;
        lastClickTime = now;

        let nextIndex = currentIndex + 1;
        goToGroup(nextIndex);
    }

    function prevSlide() {
        const now = Date.now();
        if (now - lastClickTime < CLICK_DELAY) return;
        lastClickTime = now;

        let prevIndex = currentIndex - 1;
        goToGroup(prevIndex);
    }

    // TÍNH NĂNG KÉO
    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function setSliderPosition() {
        const baseTranslate = -currentIndex * 25;
        const dragTranslate = (currentTranslate / currentSlideWidth) * 100;
        const newTranslate = baseTranslate + dragTranslate;
        slidesContainer.style.transform = `translateX(${newTranslate}%)`;
    }

    function animation() {
        setSliderPosition();
        if (isDragging) requestAnimationFrame(animation);
    }

    function touchStart(event) {
        isDragging = true;
        startPos = getPositionX(event);
        slidesContainer.style.transition = 'none';
        stopAutoSlide();
        updateSlideWidth();
        animationID = requestAnimationFrame(animation);
        sliderContainer.classList.add('grabbing');
    }

    function touchMove(event) {
        if (!isDragging) return;
        event.preventDefault();
        const currentPosition = getPositionX(event);
        currentTranslate = currentPosition - startPos;
    }

    function touchEnd() {
        if (!isDragging) return;

        isDragging = false;
        cancelAnimationFrame(animationID);
        sliderContainer.classList.remove('grabbing');
        slidesContainer.style.transition = 'transform 0.3s ease';

        const movedBy = currentTranslate;
        const threshold = currentSlideWidth * 0.1;

        if (Math.abs(movedBy) > threshold) {
            if (movedBy > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
        } else {
            goToGroup(currentIndex);
        }

        currentTranslate = 0;
        setTimeout(startAutoSlide, 3000);
    }

    // Sự kiện điều khiển
    if (prevBtn) {
        prevBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            prevSlide();
            stopAutoSlide();
            setTimeout(startAutoSlide, 3000);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            nextSlide();
            stopAutoSlide();
            setTimeout(startAutoSlide, 3000);
        });
    }

    // Gắn sự kiện kéo
    sliderContainer.addEventListener('mousedown', touchStart);
    document.addEventListener('mousemove', touchMove);
    document.addEventListener('mouseup', touchEnd);

    sliderContainer.addEventListener('touchstart', touchStart, { passive: false });
    document.addEventListener('touchmove', touchMove, { passive: false });
    document.addEventListener('touchend', touchEnd);

    // Auto slide control
    sliderContainer.addEventListener('mouseenter', stopAutoSlide);
    sliderContainer.addEventListener('mouseleave', startAutoSlide);

    // Xử lý resize
    window.addEventListener('resize', updateSlideWidth);

    // Khởi tạo
    updateSlideWidth();
    goToGroup(currentIndex, true);
    setTimeout(() => {
        slidesContainer.style.transition = 'transform 0.4s ease';
    }, 50);
    startAutoSlide();

    console.log(`Đã khởi tạo product slider: ${containerSelector}`);
}

// Khởi tạo product slider khi DOM loaded
document.addEventListener('DOMContentLoaded', function () {
    // Product slider trong flash sale
    initializeProductSlider('.flash-sale-product .container-products', 5000);
    
    // Product slider trong best seller (nếu có)
    initializeProductSlider('.best-seller-products .container-products', 5000);
});