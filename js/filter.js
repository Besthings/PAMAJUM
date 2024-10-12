let products = []; // เก็บสินค้าทั้งหมด

window.onload = function() {
  // เรียกใช้ filterProducts('all') เพื่อทำให้ปุ่ม All เป็น active เมื่อหน้าโหลด
  filterProducts('all');
};

// โหลดสินค้าจากไฟล์ JSON
fetch('./json/products.json')
  .then(response => response.json())
  .then(data => {
    products = data; // เก็บสินค้าทั้งหมด
    displayProducts(products); // แสดงสินค้าทั้งหมดเมื่อเริ่มต้น
  })
  .catch(error => console.error('Error loading products:', error));

// ฟังก์ชันแสดงสินค้า
function displayProducts(items) {
  const container = document.getElementById('grid-recommend');
  container.innerHTML = ''; // ล้างสินค้าก่อนแสดงใหม่
  items.forEach(item => {
    const menuItem = document.createElement('div');
    menuItem.classList.add('menu-item');

    menuItem.innerHTML = `
      <div class="box">
        <a href="details.html?id=${item.id}">
          <img src="${item.image}" alt="${item.name}">
          <h3>${item.name}</h3>
          <p>${item.description01}</p>
          <span>฿${item.price}</span>
        </a>
        <button onclick="openModal(${item.id})" class="buy">Buy</button>
      </div>
    `;

    container.appendChild(menuItem);
  });
}

// ฟังก์ชันกรองสินค้าตามประเภท
function filterProducts(type) {
  // ลบคลาส active จากปุ่มทั้งหมด
  const buttons = document.querySelectorAll('#filter-buttons button');
  buttons.forEach(button => button.classList.remove('active'));

  // เพิ่มคลาส active ให้กับปุ่มที่ถูกคลิก
  const activeButton = Array.from(buttons).find(button => button.textContent.toLowerCase() === type);
  if (activeButton) {
    activeButton.classList.add('active');
  }

  // กรองสินค้าและแสดงผล
  if (type === 'all') {
    displayProducts(products); // แสดงสินค้าทั้งหมด
  } else {
    const filteredProducts = products.filter(item => item.type === type);
    displayProducts(filteredProducts); // แสดงสินค้าเฉพาะประเภทที่เลือก
  }
}

// ฟังก์ชันที่ใช้ในการอ่านประเภทจาก URL และกรองสินค้า
function loadProductsFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const type = urlParams.get('type') || 'all'; // ถ้าไม่มี type ให้เป็น 'all'

  filterProducts(type); // กรองสินค้าตามประเภทที่อ่านได้จาก URL
}

// เรียกใช้ฟังก์ชันเมื่อโหลดหน้า
window.onload = loadProductsFromURL;


// ฟังก์ชันค้นหาสินค้าตามชื่อ (แบบเรียลไทม์)
function searchProducts(event) {
  const searchTerm = document.getElementById('search-input').value.toLowerCase(); // ดึงค่าที่พิมพ์

  // ย้าย active ไปที่ปุ่ม All
  filterProducts('all');  // เปลี่ยนปุ่ม All เป็น active
  
  // กรองสินค้าตามคำค้นหา
  const filteredProducts = products.filter(item => item.name.toLowerCase().includes(searchTerm)); 
  displayProducts(filteredProducts); // แสดงสินค้าที่ตรงกับคำค้นหา
}
