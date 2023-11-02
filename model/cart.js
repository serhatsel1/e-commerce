const fs = require("fs"); // fs modülünü alır: Dosya işlemleri yapmak için kullanılır.
const path = require("path"); // path modülünü alır: Dosya yollarını işlemek için kullanılır.

const p = path.join(
  // Dosya yolunu hesaplar ve p değişkenine atar.
  path.dirname(require.main.filename), // Ana uygulamanın çalıştırılabilir dosyasının dizinini alır.
  "data", // "data" dizini
  "cart.json" // "cart.json" dosyası
);

module.exports = class Cart {
  // Cart sınıfını oluşturur ve dışa aktarır.

  static addProduct(id, productPrice) {
    // Ürün eklemek için kullanılacak bir metot tanımlar ve iki parametre alır: id (ürün kimliği) ve productPrice (ürün fiyatı).

    fs.readFile(p, (err, fileContent) => {
      // "cart.json" dosyasını okur.
      let cart = { products: [], totalPrice: 0 }; // Varsa mevcut sepet bilgisini alır, yoksa boş bir sepet oluşturur.

      if (!err) {
        // Hata yoksa:
        cart = JSON.parse(fileContent); // Dosya içeriğini JSON formatından JavaScript nesnesine çevirir.
      }

      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.id === id
      ); // Sepet içinde aynı ürünü arar ve indeksini alır.
      const existingProduct = cart.products[existingProductIndex]; // Eğer ürün varsa, bu değişken mevcut ürünü temsil eder.

      let updatedProduct; // Güncellenmiş ürün bilgisini tutacak değişken.

      if (existingProduct) {
        // Eğer ürün sepette varsa:

        updatedProduct = { ...existingProduct }; // Mevcut ürünün bir kopyasını oluşturur.
        updatedProduct.qty = updatedProduct.qty + 1; // Ürün miktarını bir artırır.
        cart.products = [...cart.products]; // Sepet içeriğini güncellemek için yeni bir kopya oluşturur.
        cart.products[existingProductIndex] = updatedProduct; // Mevcut ürünü günceller.
      } else {
        // Eğer ürün daha önce eklenmemişse:

        updatedProduct = { id: id, qty: 1 }; // Yeni bir ürün nesnesi oluşturur.
        cart.products = [...cart.products, updatedProduct]; // Yeni ürünü sepete ekler.
      }

      cart.totalPrice = cart.totalPrice + +productPrice; // Sepetin toplam fiyatını günceller.

      fs.writeFile(p, JSON.stringify(cart), (err) => {
        // Güncellenmiş sepet bilgisini "cart.json" dosyasına yazdırır.
        console.log(err); // Herhangi bir hata durumunda hatayı konsola yazdırır.
      });
    });
  }

  static deleteProduct(id,productPrice) {
  fs.readFile(p, (err, fileContent) =>{
    if(err) {
      return;
    }
    const updatedCart = {...JSON.parse(fileContent)};
    const product = updatedCart.products.find(prod => prod.id === id);
    const productQty = product.qty;
    updatedCart.products = updatedCart.products.filter(
        prod => prod.id !== id
      );
    updatedCart.totalPrice =
        updatedCart.totalPrice - productPrice * productQty;

    fs.writeFile(p, JSON.stringify(updatedCart), err => {
        console.log(err);
      });
    });
  }

  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      if (err) {
        console.log("err" ,err)
        cb(null);
      } else {
        cb(cart);
      }
    });
  }
};
