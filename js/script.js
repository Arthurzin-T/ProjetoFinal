document.addEventListener("DOMContentLoaded", () => {
  // Seleção de Elementos
  const buyButtons = document.querySelectorAll(".btn-add"); // Foca apenas nos botões de compra
  const heroButton = document.querySelector("a.btn.btn-primary");
  const openCartBtn = document.getElementById("openCart");
  const closeCartBtn = document.getElementById("closeCart");
  const cartModal = document.getElementById("cartModal");
  const cartBackdrop = document.getElementById("cartBackdrop");
  const cartItemsDiv = document.getElementById("cartItems");
  const cartItemCount = document.getElementById("cartItemCount");
  const headerCartCount = document.getElementById("headerCartCount");
  const cartTotal = document.getElementById("cartTotal");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const resetBtn = document.getElementById("resetBtn");
  const checkoutStatus = document.getElementById("checkoutStatus");
  const paymentSelect = document.getElementById("paymentSelect");

  // Array do Carrinho
  const cart = [];

  // Configuração do Toast (Mensagem flutuante)
  const toast = document.createElement("div");
  toast.id = "toastMessage";
  toast.style.cssText = "position:fixed;right:1rem;bottom:4.4rem;background:#111827;color:#fff;padding:.6rem .9rem;border-radius:10px;box-shadow:0 8px 20px rgba(0,0,0,.2);opacity:0;pointer-events:none;transition:0.2s ease;z-index:10000;";
  document.body.appendChild(toast);

  function showToast(text) {
    toast.textContent = text;
    toast.style.opacity = "1";
    setTimeout(() => {
      toast.style.opacity = "0";
    }, 1700);
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  }

  // Função para Atualizar a Interface do Carrinho
  function updateCartUI() {
    cartItemsDiv.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      cartItemCount.textContent = "0 produtos";
      cartTotal.textContent = "Total: R$ 0,00";
      headerCartCount.textContent = "0";
      cartItemsDiv.innerHTML = `<div class="empty-cart">Seu carrinho está vazio. Adicione produtos para finalizar.</div>`;
      return;
    }

    cart.forEach((item, index) => {
      total += item.price;
      const itemRow = document.createElement("div");
      itemRow.className = "cart-row";
      itemRow.innerHTML = `
        <div>
          <strong>${item.name}</strong>
          <p>${formatCurrency(item.price)}</p>
        </div>
        <button class="btn btn-outline cart-remove" data-index="${index}">Remover</button>
      `;
      cartItemsDiv.appendChild(itemRow);
    });

    cartItemCount.textContent = `${cart.length} ${cart.length === 1 ? "produto" : "produtos"}`;
    cartTotal.textContent = `Total: ${formatCurrency(total)}`;
    headerCartCount.textContent = cart.length;

    // Adiciona evento nos botões de remover recém-criados
    cartItemsDiv.querySelectorAll(".cart-remove").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.dataset.index);
        cart.splice(idx, 1);
        updateCartUI();
        showToast("Item removido do carrinho.");
      });
    });
  }

  // Funções de Abrir/Fechar
  function openCart() {
    cartModal.classList.remove("hidden");
    updateCartUI();
  }

  function closeCart() {
    cartModal.classList.add("hidden");
    checkoutStatus.classList.add("hidden");
    checkoutStatus.textContent = "";
  }

  // Lógica de Adicionar ao Carrinho
  buyButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      
      const card = button.closest(".card");
      const productName = card ? card.querySelector("h3")?.textContent.trim() : "Produto";
      const priceText = card ? card.querySelector(".price")?.textContent.replace(/[^0-9,]/g, "").replace(",", ".") : "0";
      const price = Number(priceText) || 0;

      cart.push({ name: productName, price });
      
      showToast(`${productName} adicionado ✅`);
      updateCartUI();
      
      // Efeito visual no card
      card?.classList.add("cart-hit");
      setTimeout(() => card?.classList.remove("cart-hit"), 200);
    });
  });

  // Eventos de Botões Fixos
  openCartBtn?.addEventListener("click", openCart);
  closeCartBtn?.addEventListener("click", closeCart);
  cartBackdrop?.addEventListener("click", closeCart);

  // Finalizar Compra
  checkoutBtn?.addEventListener("click", () => {
    if (cart.length === 0) {
      showToast("Seu carrinho está vazio.");
      return;
    }
    const method = paymentSelect.value;
    checkoutStatus.classList.remove("hidden");
    checkoutStatus.textContent = `Compra concluída com sucesso! Método: ${method.toUpperCase()}.`;
    cart.length = 0;
    updateCartUI();
  });

  resetBtn?.addEventListener("click", () => {
    closeCart();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Efeito de Rolagem Suave (Hero Button)
  if (heroButton) {
    heroButton.addEventListener("click", (event) => {
      event.preventDefault();
      const targetId = heroButton.getAttribute("href");
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  // Efeitos Visuais nas Sections
  const sections = document.querySelectorAll("section");
  sections.forEach((section) => {
    section.addEventListener("mouseenter", () => {
      section.style.transition = "transform .2s ease";
      section.style.transform = "translateY(-2px)";
    });
    section.addEventListener("mouseleave", () => {
      section.style.transform = "translateY(0)";
    });
  });

  // Inicializa a interface
  updateCartUI();
  // --- MÓDULO DE ACESSIBILIDADE ---

  // 1. Controle de Fonte
  let currentFontSize = 100; // Começa em 100%
  const fontIncreaseBtn = document.getElementById("fontIncrease");
  const fontDecreaseBtn = document.getElementById("fontDecrease");

  fontIncreaseBtn?.addEventListener("click", () => {
    if (currentFontSize < 150) { // Limite máximo de 150%
      currentFontSize += 10;
      document.documentElement.style.fontSize = `${currentFontSize}%`;
    }
  });

  fontDecreaseBtn?.addEventListener("click", () => {
    if (currentFontSize > 80) { // Limite mínimo de 80%
      currentFontSize -= 10;
      document.documentElement.style.fontSize = `${currentFontSize}%`;
    }
  });

  // 2. Leitura de Texto (Voz)
  const readSiteBtn = document.getElementById("readSite");
  let isReading = false;

  function stopReading() {
    window.speechSynthesis.cancel();
    isReading = false;
    readSiteBtn.textContent = "🔈 Ouvir Site";
  }

  readSiteBtn?.addEventListener("click", () => {
    if (isReading) {
      stopReading();
      return;
    }

    // Selecionamos os textos principais para não ler códigos ou menus chatos
    const mainContent = document.querySelector("main").innerText;
    const utterance = new SpeechSynthesisUtterance(mainContent);
    
    utterance.lang = "pt-BR";
    utterance.rate = 1.1; // Velocidade levemente mais rápida

    utterance.onstart = () => {
      isReading = true;
      readSiteBtn.textContent = "🛑 Parar Leitura";
    };

    utterance.onend = () => {
      isReading = false;
      readSiteBtn.textContent = "🔈 Ouvir Site";
    };

    window.speechSynthesis.speak(utterance);
  });

  // Interromper leitura se o usuário fechar a aba ou sair
  window.onbeforeunload = () => stopReading();
});