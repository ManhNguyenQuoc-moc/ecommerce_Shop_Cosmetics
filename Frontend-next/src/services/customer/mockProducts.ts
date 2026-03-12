export const featuredProducts = [
{
id:"p1",
name:"Son Dưỡng LipIce Hiệu Chỉnh Sắc Môi Hương Tinh Khiết 2.4g",
brand:"LipIce",
price:120000,
salePrice:99000,
rating:4.8,
sold:2100,
image:"https://media.hcdn.vn/catalog/product/f/a/facebook-dynamic-son-duong-co-mau-tu-nhien-lipice-natural-huong-tinh-khiet-2-4g-1721878206_img_320x320_b04c1a_fit_center.jpg"
},
{
id:"p2",
name:"Son Dưỡng Môi Mentholatum Melty Cream Lip Mật Ong 2.4g",
brand:"LipIce",
price:120000,
salePrice:105000,
rating:4.7,
sold:1800,
image:"https://media.hcdn.vn/catalog/product/f/a/facebook-dynamic-son-duong-am-moi-mentholatum-tan-chay-huong-mat-ong-2-4g-1726715509_img_320x320_b04c1a_fit_center.jpg"
},
{
id:"p3",
name:"Serum Dưỡng Môi Lipstician Chống Nắng Bảo Vệ Toàn Diện 9g",
brand:"Lipstician",
price:150000,
salePrice:129000,
rating:4.9,
sold:900,
image:"https://media.hcdn.vn/catalog/product/f/a/facebook-dynamic-serum-duong-moi-lipstician-chong-nang-bao-ve-toan-dien-9g-1726717081_img_320x320_b04c1a_fit_center.jpg"
},

/* FIXED IMAGES */

{
id:"p4",
name:"Son Kem Lì Glamrr Q 02 Lovely Day - Đỏ Nâu Trầm 5g",
brand:"Glamrr Q",
price:180000,
salePrice:145000,
rating:4.6,
sold:1100,
image:"https://images.unsplash.com/photo-1586495777744-4413f21062fa"
},
{
id:"p5",
name:"Son Kem Lì Glamrr Q 01 Glad Day - Đỏ Nâu 5g",
brand:"Glamrr Q",
price:180000,
salePrice:149000,
rating:4.6,
sold:980,
image:"https://images.unsplash.com/photo-1596462502278-27bfdc403348"
},
{
id:"p6",
name:"Son Lì Naris Ailus Mịn Môi Màu 02 Đỏ Cam 4g",
brand:"Naris",
price:220000,
salePrice:179000,
rating:4.7,
sold:650,
image:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9"
},
{
id:"p7",
name:"Son Dưỡng Môi Milaganics Dừa Dưỡng Ẩm 4g",
brand:"Milaganics",
price:90000,
salePrice:69000,
rating:4.5,
sold:1300,
image:"https://tse3.mm.bing.net/th/id/OIP.Rnp6ltEe7vnuvdQgknx33wHaFA?rs=1&pid=ImgDetMain&o=7&rm=3"
},
{
id:"p8",
name:"Sáp Tẩy Trang Banila Co Original 100ml",
brand:"Banila Co",
price:350000,
salePrice:299000,
rating:4.9,
sold:3200,
image:"https://images.unsplash.com/photo-1598440947619-2c35fc9aa908"
},
{
id:"p9",
name:"Sữa Rửa Mặt Acnes Creamy Wash 100g",
brand:"Acnes",
price:95000,
salePrice:79000,
rating:4.6,
sold:4100,
image:"https://images.unsplash.com/photo-1556228578-8c89e6adf883"
},
{
id:"p10",
name:"Kem Chống Nắng Skin Aqua UV Super Moisture Gel 80g",
brand:"Skin Aqua",
price:210000,
salePrice:179000,
rating:4.8,
sold:2800,
image:"https://images.unsplash.com/photo-1601049676869-702ea24cfd58"
},
{
id:"p11",
name:"Nước Tẩy Trang Garnier Micellar Water 400ml",
brand:"Garnier",
price:230000,
salePrice:189000,
rating:4.7,
sold:5000,
image:"https://images.unsplash.com/photo-1571781926291-c477ebfd024b"
},
{
id:"p12",
name:"Serum The Ordinary Niacinamide 10% + Zinc 30ml",
brand:"The Ordinary",
price:320000,
salePrice:279000,
rating:4.9,
sold:6200,
image:"https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd"
}
]

export const bestSellingProducts = [...featuredProducts].sort(
 (a,b)=> (b.sold ?? 0) - (a.sold ?? 0)
)

export const newestProducts = [...featuredProducts].reverse()
export const mockProducts = Array.from({ length: 120 }).map((_, index) => {
  const base = featuredProducts[index % featuredProducts.length];

  return {
    ...base,
    id: `${base.id}-${index + 1}`,
    sold: (base.sold ?? 0) + Math.floor(Math.random() * 500),
    price: base.price + Math.floor(Math.random() * 20000),
  };
});
export async function getProducts(
  page: number = 1,
  pageSize: number = 12
) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    data: mockProducts.slice(start, end),
    total: mockProducts.length,
    page,
    pageSize,
  };
}