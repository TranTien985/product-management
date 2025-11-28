// https://console.cloud.google.com

// Hàm khởi tạo bản đồ với nhiều chi nhánh
function initMap() {
    console.log('initMap called');

    // Danh sách các chi nhánh với URL Google Maps chính xác
    const stores = [
        {
            name: 'Hệ Thống Thế Giới Cầu Lông - Chi Nhánh Cầu Giấy',
            position: { lat: 21.045262617737322, lng: 105.79681346626803 },
            address: '106B1 Tô Hiệu, Nghĩa Tân, Cầu Giấy, Hà Nội',
            phone: '0838010188',
            hours: '09:00 - 19:00',
            image: '/images/hethongcuahang/store1.png',
            directionURL: 'https://www.google.com/maps/dir//21.045097,105.796733',
            mapURL:
                'https://www.google.com/maps/place/H%E1%BB%87+Th%E1%BB%91ng+Th%E1%BA%BF+Gi%E1%BB%9Bi+C%E1%BA%A7u+L%C3%B4ng+-+Chi+Nh%C3%A1nh+C%E1%BA%A7u+Gi%E1%BA%A5y/@21.0450974,105.796733,783m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3135ab4b448caffd:0x177b47935703a24e!8m2!3d21.0450974!4d105.796733!16s%2Fg%2F11td5rnbpq'
        },
        {
            name: 'Hệ Thống Thế Giới Cầu Lông - Chi Nhánh Hà Đông',
            position: { lat: 20.979430190670527, lng: 105.79686492709828 },
            address: 'Số 123, Quang Trung, Hà Đông, Hà Nội',
            phone: '0838010188',
            hours: '09:00 - 19:00',
            image: '/images/hethongcuahang/store2.png',
            directionURL: 'https://www.google.com/maps/dir//20.979266,105.796062',
            mapURL:
                'https://www.google.com/maps/place/H%E1%BB%87+th%E1%BB%91ng+Th%E1%BA%BF+Gi%E1%BB%9Bi+C%E1%BA%A7u+L%C3%B4ng+-+Chi+nh%C3%A1nh+H%C3%A0+%C4%90%C3%B4ng/@20.9792649,105.7960549,783m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3135ad9b7761a509:0xa6b489f85442069c!8m2!3d20.9792649!4d105.7960549!16s%2Fg%2F11y8sdrdw7'
        },
        {
            name: 'Hệ Thống Thế Giới Cầu Lông - Chi Nhánh Mỹ Đình',
            position: { lat: 21.027329509670494, lng: 105.77323753373196 },
            address: '236 Mỹ Đình, Nam Từ Liêm, Hà Nội',
            phone: '0814010188',
            hours: '09:00 - 19:00',
            image: '/images/hethongcuahang/store3.png',
            directionURL: 'https://www.google.com/maps/dir//21.027114,105.773318',
            mapURL:
                'https://www.google.com/maps/place/Th%E1%BA%BF+Gi%E1%BB%9Bi+C%E1%BA%A7u+L%C3%B4ng+M%E1%BB%B9+%C4%90%C3%ACnh/@21.0271142,105.773318,783m/data=!3m2!1e3!4b1!4m6!3m5!1s0x313455853f767f67:0xbca571a9c2bbb98b!8m2!3d21.0271142!4d105.773318!16s%2Fg%2F11sts57gsy'
        }
    ];

    // Tạo bản đồ
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        center: { lat: 21.017, lng: 105.789 },
        mapTypeControl: true,
        streetViewControl: true
    });

    const infoWindow = new google.maps.InfoWindow();

    // Click ở ngoài để đóng InfoWindow
    map.addListener('click', () => infoWindow.close());

    // Thêm marker cho từng chi nhánh
    stores.forEach(store => {
        const marker = new google.maps.Marker({
            map,
            position: store.position,
            title: store.name,
            icon: {
                url: '/images/ico.png',
                scaledSize: new google.maps.Size(64, 64),
                anchor: new google.maps.Point(32, 64)
            }
        });

        // Click vào marker hiển thị popup
        marker.addListener('click', () => {
            infoWindow.setContent(`
                <div class="map-store-card">
                    <img src="${store.image}" alt="${store.name}">
                    <div class="map-store-content">
                        <strong class="map-store-title">${store.name}</strong>
                        <ul class="map-store-info-list">
                            <li>
                                <i class="fas fa-map-marked-alt"></i>
                                <span>${store.address}</span>
                            </li>
                            <li>
                                <i class="fa-solid fa-phone"></i>
                                <span>${store.phone}</span>
                            </li>
                            <li>
                                <i class="fa-solid fa-envelope"></i>
                                <span>contact@thegioicaulong.com</span>
                            </li>
                            <li>
                                <i class="fa-solid fa-door-open"></i>
                                <span>${store.hours}</span>
                            </li>
                            <li style="margin-bottom:0;">
                                <a href="${store.mapURL}" target="_blank" class="store-detail-btn">Chi Tiết</a>

                                <a href="${store.directionURL}" target="_blank" class="store-direction-btn">
                                   <i class="fa-solid fa-location-arrow"></i> Chỉ đường
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            `);
            infoWindow.open(map, marker);
        });
    });

    console.log('All markers added for', stores.length, 'stores');
}

// Tải Google Maps API
function loadGoogleMaps() {
    const apiKey = 'AIzaSyAX5H-INZaEQo7WsBxivjXs2wJuF0v-_bE';
    const script = document.createElement('script');

    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
    script.async = true;
    script.defer = true;

    document.head.appendChild(script);
}

// Gọi hàm tải bản đồ
window.addEventListener('DOMContentLoaded', loadGoogleMaps);
