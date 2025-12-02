// Hàm khởi tạo slider dùng chung cho TẤT CẢ banners
        function initializeUniversalSlider(containerSelector, delay = 4000) {
            const sliderContainer = document.querySelector(containerSelector);
            if (!sliderContainer) {
                console.log(`Không tìm thấy slider container: ${containerSelector}`);
                return;
            }

            const slidesContainer = sliderContainer.querySelector('.slides');
            const slides = slidesContainer.querySelectorAll('.slider'); // Đã sửa selector
            const prevBtn = sliderContainer.querySelector('.slider-prev');
            const nextBtn = sliderContainer.querySelector('.slider-next');
            const dots = sliderContainer.querySelectorAll('.nav-btn');

            // Tính số slide thực
            const totalRealSlides = dots.length > 0 ? dots.length : slides.length;
            let currentIndex = 1;
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

            function goToSlide(index, instant = false) {
                if (instant) {
                    slidesContainer.style.transition = 'none';
                } else {
                    slidesContainer.style.transition = 'transform 0.4s ease'; // Tốc độ vừa phải
                }

                const totalSlides = totalRealSlides + 2;
                const translateX = -index * (100 / totalSlides);
                slidesContainer.style.transform = `translateX(${translateX}%)`;

                // Cập nhật dots
                if (dots.length > 0) {
                    dots.forEach(dot => dot.classList.remove('active'));
                    const realIndex = getRealIndex(index);
                    const targetDot = Array.from(dots).find(dot =>
                        parseInt(dot.getAttribute('data-index')) === realIndex
                    );
                    if (targetDot) targetDot.classList.add('active');
                }

                currentIndex = index;

                // Xử lý vòng lặp vô hạn
                if (!instant) {
                    setTimeout(() => {
                        if (currentIndex === 0) {
                            goToSlide(totalRealSlides, true);
                        } else if (currentIndex === totalRealSlides + 1) {
                            goToSlide(1, true);
                        }
                    }, 400);
                }
            }

            function getRealIndex(virtualIndex) {
                if (virtualIndex === 0) return totalRealSlides;
                if (virtualIndex === totalRealSlides + 1) return 1;
                return virtualIndex;
            }

            function nextSlide() {
                const now = Date.now();
                if (now - lastClickTime < CLICK_DELAY) return;
                lastClickTime = now;

                let nextIndex = currentIndex + 1;
                goToSlide(nextIndex);
            }

            function prevSlide() {
                const now = Date.now();
                if (now - lastClickTime < CLICK_DELAY) return;
                lastClickTime = now;

                let prevIndex = currentIndex - 1;
                goToSlide(prevIndex);
            }

            // TÍNH NĂNG KÉO
            function getPositionX(event) {
                return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
            }

            function setSliderPosition() {
                const totalSlides = totalRealSlides + 2;
                const baseTranslate = -currentIndex * (100 / totalSlides);
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
                    goToSlide(currentIndex);
                }

                currentTranslate = 0;
                setTimeout(startAutoSlide, 3000);
            }

            // Sự kiện cho dots
            dots.forEach(dot => {
                dot.addEventListener('click', function () {
                    const now = Date.now();
                    if (now - lastClickTime < CLICK_DELAY) return;
                    lastClickTime = now;

                    let index = parseInt(this.getAttribute('data-index'));
                    goToSlide(index);
                    stopAutoSlide();
                    setTimeout(startAutoSlide, 3000);
                });
            });

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
            goToSlide(currentIndex, true);
            setTimeout(() => {
                slidesContainer.style.transition = 'transform 0.4s ease';
            }, 50);
            startAutoSlide();

            console.log(`Đã khởi tạo slider: ${containerSelector}`);
        }

        // Khởi tạo TẤT CẢ slider khi DOM loaded
        document.addEventListener('DOMContentLoaded', function () {
            // Banner chính
            initializeUniversalSlider('.banner-top__left .slider-container', 4000);
            initializeUniversalSlider('.banner-top__right .slider-container', 5000);

            // Banner middle
            initializeUniversalSlider('.banner-middle__left .slider-container', 4000);

            // Tự động tìm tất cả slider còn lại
            document.querySelectorAll('.slider-container').forEach(container => {
                const id = container.id;
                if (id && !container.hasAttribute('data-initialized')) {
                    initializeUniversalSlider(`#${id}`, 4000);
                    container.setAttribute('data-initialized', 'true');
                }
            });
        });
