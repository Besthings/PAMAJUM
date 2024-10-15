$(document).ready(function(){
    $('.catalog').owlCarousel({
        loop: true, // ทำให้ Carousel กลับไปที่จุดเริ่มต้น
        margin: 10, // ระยะห่างระหว่างภาพ
        nav: true, // แสดงปุ่มถัดไปและก่อนหน้า
        autoplay: true,
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

$(document).ready(function(){
    $('#slider1').owlCarousel({
        loop: true, // วนลูป
        margin: 10, // ระยะห่างระหว่างภาพ
        nav: false, // แสดงปุ่มถัดไปและก่อนหน้า
        items: 1, // แสดงเพียง 1 ภาพ
        autoplay: true, // เปิดการใช้งาน autoplay
        autoplayTimeout: 2500, // เปลี่ยนภาพทุก 2 วินาที
        autoplayHoverPause: true // หยุดการเลื่อนอัตโนมัติเมื่อวางเม้าส์
    });
});