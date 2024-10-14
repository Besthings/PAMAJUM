// ฟังก์ชันสำหรับเคลียร์สินค้าทั้งหมดในตะกร้า
function clearCart() {
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || {};

  // ตรวจสอบว่ามีสินค้าหรือไม่
  if (Object.keys(cartItems).length === 0) {
    Swal.fire({
      title: 'Cart is Empty!',
      text: 'There are no items in your cart to clear.',
      icon: 'warning',
      confirmButtonText: 'OK'
    });
    return; // หยุดการทำงานของฟังก์ชัน
  }

  // ลบข้อมูลสินค้าทั้งหมดใน localStorage
  localStorage.removeItem('cartItems');
  localStorage.removeItem('purchasedItems');

  // ลบการแสดงผลสินค้าในหน้าเว็บ
  const cartItemsContainer = document.getElementById('cart-items');
  cartItemsContainer.innerHTML = '';

  // แสดงข้อความสำเร็จ
  Swal.fire({
    title: 'Cart Cleared!',
    text: 'All items have been removed from your cart.',
    icon: 'success',
    confirmButtonText: 'OK'
  });

  // อัปเดตจำนวนสินค้าในตะกร้า
  updateCartCount();
}


// ฟังก์ชันอัปเดตจำนวนสินค้าในตะกร้า (navbar)
function updateCartCount() {
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || {};
  const totalItems = Object.values(cartItems).reduce((total, qty) => total + qty, 0);
  document.querySelector('.cartcount').textContent = totalItems;
}

// ฟังก์ชันสำหรับแสดงสินค้าที่อยู่ในตะกร้า
document.addEventListener('DOMContentLoaded', function() {
  const cartItemsContainer = document.getElementById('cart-items');
  const cartItemsCounts = JSON.parse(localStorage.getItem('cartItems')) || {}; // ดึงข้อมูลจาก localStorage

  // ตรวจสอบว่ามีสินค้าในตะกร้าหรือไม่
  if (Object.keys(cartItemsCounts).length > 0) {
    fetch('./json/products.json')
      .then(response => response.json())
      .then(data => {
        // ดึงสินค้าที่ตรงกับในตะกร้า
        const cartItems = data.filter(item => item.id in cartItemsCounts);

        cartItems.forEach(item => {
          const itemElement = document.createElement('div');

          itemElement.innerHTML = `
            <div class="card">
              <img src="${item.image}" class="card-img-top" alt="${item.name}">
              <div class="card-body">
                <h5 class="card-title">${item.name}</h5>
                <p class="card-text">${item.description01}</p>
                <p class="card-text"><span>฿${item.price}</span></p>
                <p class="card-text">
                  Quantity: <span id="quantity-${item.id}">${cartItemsCounts[item.id]}</span>
                </p>
                <button class="btn btn-primary" onclick="changeQuantity('${item.id}', 1)">Increase</button>
                <button class="btn btn-danger" onclick="changeQuantity('${item.id}', -1)">Decrease</button>
                <button class="btn btn-warning" onclick="removeItem('${item.id}')">Remove</button>
              </div>
            </div>
          `;

          cartItemsContainer.appendChild(itemElement);
        });
      })
      .catch(error => console.error('Error loading products:', error));
  } else {
    cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
  }

  // อัปเดตจำนวนสินค้าในตะกร้าบน navbar
  updateCartCount();
});

// ฟังก์ชันสำหรับเพิ่ม-ลดจำนวนสินค้า
function changeQuantity(itemId, change) {
  let cartItemsCounts = JSON.parse(localStorage.getItem('cartItems')) || {};

  // ปรับปรุงจำนวนสินค้า
  if (cartItemsCounts[itemId]) {
    cartItemsCounts[itemId] += change;

    // ถ้าจำนวนสินค้าลดเหลือ 0
    if (cartItemsCounts[itemId] <= 0) {
      // แสดงข้อความยืนยันการลบสินค้า
      Swal.fire({
        title: 'Remove Item?',
        text: 'This item has 0 quantity. Do you want to remove it from the cart?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, remove it!',
        cancelButtonText: 'No, keep it'
      }).then((result) => {
        if (result.isConfirmed) {
          delete cartItemsCounts[itemId];  // ลบสินค้าออกจากตะกร้า
          localStorage.setItem('cartItems', JSON.stringify(cartItemsCounts));

          // ลบการแสดงผลสินค้าจากหน้าเว็บ
          const itemElement = document.getElementById(`quantity-${itemId}`);
          if (itemElement) {
            itemElement.remove();
          }

          // แสดงข้อความว่าสินค้าถูกลบ
          Swal.fire({
            title: 'Item Removed',
            text: 'This item has been removed from your cart.',
            icon: 'info',
            confirmButtonText: 'OK'
          });

          // อัปเดตจำนวนสินค้าในตะกร้า (navbar)
          updateCartCount();
        } else {
          // ถ้าไม่ลบสินค้า ให้คืนค่าเป็น 1
          cartItemsCounts[itemId] = 1;
          localStorage.setItem('cartItems', JSON.stringify(cartItemsCounts));

          // อัปเดตการแสดงผลจำนวนสินค้า
          const quantityElement = document.getElementById(`quantity-${itemId}`);
          if (quantityElement) {
            quantityElement.textContent = cartItemsCounts[itemId];
          }

          // อัปเดตจำนวนสินค้าในตะกร้า (navbar)
          updateCartCount();
        }
      });
    } else {
      localStorage.setItem('cartItems', JSON.stringify(cartItemsCounts));

      // อัปเดตการแสดงผลจำนวนสินค้า
      const quantityElement = document.getElementById(`quantity-${itemId}`);
      if (quantityElement) {
        quantityElement.textContent = cartItemsCounts[itemId];
      }

      // อัปเดตจำนวนสินค้าในตะกร้า (navbar)
      updateCartCount();
    }
  } else if (change > 0) {
    cartItemsCounts[itemId] = change;  // เพิ่มสินค้าใหม่ถ้ายังไม่มีในตะกร้า
    localStorage.setItem('cartItems', JSON.stringify(cartItemsCounts));

    // อัปเดตการแสดงผลจำนวนสินค้า
    const quantityElement = document.getElementById(`quantity-${itemId}`);
    if (quantityElement) {
      quantityElement.textContent = cartItemsCounts[itemId];
    }

    // อัปเดตจำนวนสินค้าในตะกร้า (navbar)
    updateCartCount();
  }
}

// ฟังก์ชันสำหรับลบสินค้ารายการเฉพาะ
function removeItem(itemId) {
  let cartItemsCounts = JSON.parse(localStorage.getItem('cartItems')) || {};

  // ลบสินค้าจาก localStorage
  if (cartItemsCounts[itemId]) {
    delete cartItemsCounts[itemId];
    localStorage.setItem('cartItems', JSON.stringify(cartItemsCounts));

    // ลบการแสดงผลสินค้าจากหน้าเว็บ
    const itemElement = document.getElementById(`quantity-${itemId}`);
    if (itemElement) {
      itemElement.remove();
    }

    // แสดงข้อความว่าสินค้าถูกลบ
    Swal.fire({
      title: 'Item Removed',
      text: 'This item has been removed from your cart.',
      icon: 'info',
      confirmButtonText: 'OK'
    });

    // อัปเดตจำนวนสินค้าในตะกร้า (navbar)
    updateCartCount();
  }
}
