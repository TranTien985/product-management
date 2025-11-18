document.addEventListener('DOMContentLoaded', function () {
    const containerProducts = document.querySelector('.container-products');
    if (!containerProducts) {
        console.log('Không tìm thấy container products');
        return;
    }

    const productSlides = containerProducts.querySelector('.product-slides');
    const prevBtn = containerProducts.querySelector('.slider-prev');
    const nextBtn = containerProducts.querySelector('.slider-next');

    const totalRealGroups = 2; // 2 nhóm thực
    let currentIndex = 1; // Bắt đầu từ nhóm thực đầu tiên

    // Biến cho tính năng kéo
    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    let dragDistance = 0;
    const dragThreshold = 50;

    function goToGroup(index) {
        // Tổng số nhóm là 4 (2 thực + 2 clone)
        const translateX = -index * 25; // Mỗi nhóm chiếm 25%
        productSlides.style.transform = `translateX(${translateX}%)`;
        productSlides.style.transition = 'transform 0.6s ease-in-out';

        currentIndex = index;

        // Xử lý vòng lặp vô hạn
        setTimeout(() => {
            if (currentIndex === 0) {
                productSlides.style.transition = 'none';
                currentIndex = totalRealGroups;
                productSlides.style.transform = `translateX(-${currentIndex * 25}%)`;
            } else if (currentIndex === totalRealGroups + 1) {
                productSlides.style.transition = 'none';
                currentIndex = 1;
                productSlides.style.transform = `translateX(-${currentIndex * 25}%)`;
            }
        }, 600);
    }

    function nextGroup() {
        let nextIndex = currentIndex + 1;
        goToGroup(nextIndex);
    }

    function prevGroup() {
        let prevIndex = currentIndex - 1;
        goToGroup(prevIndex);
    }

    // Tính năng kéo
    function handleDragStart(e) {
        isDragging = true;
        containerProducts.classList.add('grabbing');

        startX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
        productSlides.style.transition = 'none';
    }

    function handleDragMove(e) {
        if (!isDragging) return;

        e.preventDefault();

        currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
        dragDistance = currentX - startX;

        const baseTranslate = -currentIndex * 25;
        const dragTranslate = (dragDistance / containerProducts.offsetWidth) * 100;
        const newTranslate = baseTranslate + dragTranslate;

        productSlides.style.transform = `translateX(${newTranslate}%)`;
    }

    function handleDragEnd() {
        if (!isDragging) return;

        isDragging = false;
        containerProducts.classList.remove('grabbing');
        productSlides.style.transition = 'transform 0.6s ease-in-out';

        if (Math.abs(dragDistance) > dragThreshold) {
            if (dragDistance > 0) {
                prevGroup();
            } else {
                nextGroup();
            }
        } else {
            goToGroup(currentIndex);
        }

        dragDistance = 0;
    }

    // Sự kiện cho nút điều khiển - ĐÃ SỬA LỖI
    if (prevBtn) {
        prevBtn.addEventListener('click', function (e) {
            e.stopPropagation(); // Ngăn sự kiện nổi bọt
            prevGroup();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function (e) {
            e.stopPropagation(); // Ngăn sự kiện nổi bọt
            nextGroup();
        });
    }

    //Gắn sự kiện kéo
    containerProducts.addEventListener('mousedown', handleDragStart);
    containerProducts.addEventListener('mousemove', handleDragMove);
    containerProducts.addEventListener('mouseup', handleDragEnd);
    containerProducts.addEventListener('mouseleave', handleDragEnd);

    containerProducts.addEventListener('touchstart', handleDragStart, { passive: false });
    containerProducts.addEventListener('touchmove', handleDragMove, { passive: false });
    containerProducts.addEventListener('touchend', handleDragEnd);

    console.log('Đã khởi tạo slider sản phẩm với 2 nhóm');
});
