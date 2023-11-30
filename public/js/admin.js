const deleteProduct = async (btn) => {
  try {
    // Butonun ebeveyn elementinden productId değerini alır.
    const prodId = btn.parentNode.querySelector("[name=productId]").value;

    // Silinecek ürünün HTML elementini bulur.
    const productElement = btn.closest("article");

    // "/admin/product/" ile belirtilen URL'ye DELETE isteği yapar.
    const response = await fetch(`/admin/product/${prodId}`, {
      method: "DELETE", // HTTP DELETE metodunu kullanır.
    });

    // Sunucudan gelen cevabı JSON formatına çevirir.
    const data = await response.json();

    // İşlem başarılıysa, ilgili HTML elementini sayfadan kaldırır.
    if (response.ok) {
      productElement.remove();
    } else {
      // Sunucudan hata durumunda gelen mesajı loglar.
      console.error("Server Error:", data.message);
    }
  } catch (error) {
    // Genel hata durumunda hata mesajını loglar.
    console.error("Error:", error.message);
  }
};
