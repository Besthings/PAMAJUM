document.addEventListener('DOMContentLoaded', function() {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || {};
    const purchaseItemsContainer = document.getElementById('purchase-items');
    let totalPrice = 0;
    let totalQuantity = 0;

    // Fetch product data
    fetch('./json/products.json')
      .then(response => response.json())
      .then(data => {
        // ดึงสินค้าที่อยู่ในตะกร้า
        const cartProducts = data.filter(product => product.id in cartItems);

        // ตรวจสอบว่ามีสินค้าในตะกร้าหรือไม่
        if (cartProducts.length === 0) {
          // แสดงข้อความไม่มีสินค้าตอนนี้
          purchaseItemsContainer.innerHTML = '<p style="color: rgb(247, 71, 71);">ไม่มีสินค้าตอนนี้</p>';
        }

        // แสดงสินค้า
        cartProducts.forEach(product => {
          const itemQuantity = cartItems[product.id];
          totalPrice += product.price * itemQuantity;
          totalQuantity += itemQuantity;

          const itemElement = document.createElement('div');
          itemElement.classList.add('card');
          itemElement.style.display = 'flex';
          itemElement.style.justifyContent = 'space-between';
          itemElement.style.alignItems = 'center';
          itemElement.style.marginBottom = '15px';

          itemElement.innerHTML = `
            <img src="${product.image}" class="card-img-top" alt="${product.name}" style="width: 80px; height: 80px;">
            <div class="card-body">
              <h5 class="card-title">${product.name}</h5>
              <p class="card-text">Price: ฿${product.price}</p>
            </div>
            <div class="quantity-control">
              <button onclick="changeQuantity('${product.id}', -1)" class="btn btn-secondary">&lt;</button>
              <span id="quantity-${product.id}">${itemQuantity}</span>
              <button onclick="changeQuantity('${product.id}', 1)" class="btn btn-secondary">&gt;</button>
            </div>
          `;
          purchaseItemsContainer.appendChild(itemElement);
        });

        // แสดงราคารวม
        document.getElementById('total-price').textContent = `฿${totalPrice}`;
        // แสดงจำนวนสินค้าทั้งหมด
        document.getElementById('total-quantity').textContent = `สินค้าทั้งหมด: ${totalQuantity} ชิ้น`;
      })
      .catch(error => console.error('Error loading products:', error));
  });

  // ฟังก์ชันสำหรับเปลี่ยนจำนวนสินค้า
  function changeQuantity(itemId, change) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || {};

    // ปรับปรุงจำนวนสินค้า
    if (cartItems[itemId]) {
      cartItems[itemId] += change;

      // ถ้าจำนวนสินค้าลดเหลือ 0 หรือต่ำกว่า 0 ให้แสดง Swal.fire เพื่อยืนยันการลบสินค้า
      if (cartItems[itemId] <= 0) {
        Swal.fire({
          title: 'Remove Item?',
          text: 'ต้องการลบสินค้านี้ไหม?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, remove it!',
          cancelButtonText: 'No, keep it'
        }).then((result) => {
          if (result.isConfirmed) {
            // ลบสินค้าออกจากตะกร้า
            delete cartItems[itemId];
            localStorage.setItem('cartItems', JSON.stringify(cartItems));

            // ลบการแสดงผลสินค้าจากหน้าเว็บ
            const itemElement = document.getElementById(`quantity-${itemId}`);
            if (itemElement) {
              itemElement.closest('.card').remove();
            }

            // อัปเดตจำนวนสินค้าในตะกร้า (navbar)
            updateCartCount();
            // คำนวณใหม่และอัปเดตราคารวม
            updateTotals();
          } else {
            // ถ้าไม่ลบสินค้า ให้คืนค่าเป็น 1
            cartItems[itemId] = 1;
            localStorage.setItem('cartItems', JSON.stringify(cartItems));

            // อัปเดตการแสดงผลจำนวนสินค้า
            const quantityElement = document.getElementById(`quantity-${itemId}`);
            if (quantityElement) {
              quantityElement.textContent = cartItems[itemId];
            }

            // อัปเดตจำนวนสินค้าในตะกร้า
            updateCartCount();
          }
        });
      } else {
        // อัปเดตการแสดงผลจำนวนสินค้า
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        const quantityElement = document.getElementById(`quantity-${itemId}`);
        if (quantityElement) {
          quantityElement.textContent = cartItems[itemId];
        }

        // อัปเดตจำนวนสินค้าในตะกร้าและราคารวม
        updateCartCount();
        updateTotals();
      }
    }
  }

  // ฟังก์ชันอัปเดตราคารวมและจำนวนสินค้าทั้งหมด
  function updateTotals() {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || {};
    let totalPrice = 0;
    let totalQuantity = 0;

    fetch('./json/products.json')
      .then(response => response.json())
      .then(data => {
        data.forEach(product => {
          if (product.id in cartItems) {
            const itemQuantity = cartItems[product.id];
            totalPrice += product.price * itemQuantity;
            totalQuantity += itemQuantity;
          }
        });

        // อัปเดตข้อมูลที่แสดง
        document.getElementById('total-price').textContent = `฿${totalPrice}`;
        document.getElementById('total-quantity').textContent = `สินค้าทั้งหมด: ${totalQuantity} ชิ้น`;
      });
  }

  // ฟังก์ชันสำหรับอัปเดตจำนวนสินค้าในตะกร้า (จาก details.js)
  function updateCartCount() {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || {};
    const totalItems = Object.values(cartItems).reduce((total, qty) => total + qty, 0);
    document.querySelector('.cartcount').textContent = totalItems;
  }

  // เรียกใช้ฟังก์ชัน updateCartCount เมื่อโหลดหน้าเว็บ
  document.addEventListener('DOMContentLoaded', updateCartCount);


  document.addEventListener('DOMContentLoaded', function() {
    // ฟังก์ชันสำหรับแสดงวิธีการชำระเงินที่เลือก
    function updatePaymentMethod() {
        const selectedPaymentMethod = document.querySelector('input[name="payment"]:checked');
        if (selectedPaymentMethod) {
            const paymentText = selectedPaymentMethod.value; // ดึง value ของ input
            document.getElementById('selected-payment-method').textContent = paymentText; // แสดงในฝั่งขวา
        }
    }

    // เรียกใช้ฟังก์ชันเมื่อมีการเปลี่ยนแปลงวิธีการชำระเงิน
    document.querySelectorAll('input[name="payment"]').forEach(paymentOption => {
        paymentOption.addEventListener('change', updatePaymentMethod);
    });

    // เรียกใช้ฟังก์ชันเพื่อแสดงผลวิธีการชำระเงินครั้งแรก
    updatePaymentMethod();
});

document.getElementById('submit-order').addEventListener('click', function() {
    // ดึงข้อมูลสินค้าในตะกร้าจาก localStorage
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || {};

    // ตรวจสอบว่ามีสินค้าในตะกร้าหรือไม่
    if (Object.keys(cartItems).length === 0) {
        // ถ้าไม่มีสินค้าในตะกร้า ให้แสดง Swal.fire แจ้งเตือน
        Swal.fire({
            title: 'ไม่มีสินค้าในตะกร้า',
            text: 'กรุณาเพิ่มสินค้าลงในตะกร้าก่อนทำการสั่งซื้อ',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
    } else {
        // ถ้ามีสินค้าในตะกร้า แสดงข้อความชำระเงินเรียบร้อย
        Swal.fire({
            title: 'การชำระเงินเรียบร้อยแล้ว',
            text: 'ขอบคุณสำหรับการสั่งซื้อ!',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then((result) => {
            if (result.isConfirmed) {
                // ลบข้อมูลสินค้าในตะกร้าออกจาก localStorage
                localStorage.removeItem('cartItems');
                
                // รีเฟรชหน้าเพื่ออัปเดตข้อมูล หรือเปลี่ยนไปยังหน้าขอบคุณ
                window.location.href = "index.html"; // เปลี่ยนไปยังหน้า index
            }
        });
    }
});
