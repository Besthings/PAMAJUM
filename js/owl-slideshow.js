$(document).ready(function(){
    $('.owl-carousel').owlCarousel({
        loop: true, // ทำให้ Carousel กลับไปที่จุดเริ่มต้น
        margin: 10, // ระยะห่างระหว่างภาพ
        nav: true, // แสดงปุ่มถัดไปและก่อนหน้า
        responsive: {
            0: {
                items: 1 // แสดง 1 item
            },
            600: {
                items: 2 // แสดง 2 item
            },
            1000: {
                items: 3 // แสดง 3 item
            },
            1400: {
                items: 4 // แสดง 3 item
            }
        }
    });
});
