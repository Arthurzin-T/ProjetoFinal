document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. SELEÇÃO DE ELEMENTOS DO CHAT
  // ==========================================
  const chatBox = document.getElementById("chatBox");
  const supportForm = document.getElementById("supportForm");
  const userMessageInput = document.getElementById("userMessage");
  const supportHint = document.getElementById("supportHint");

  // ==========================================
  // 2. FUNÇÃO: ADICIONAR MENSAGEM NA TELA
  // ==========================================
  function addMessage(text, sender) {
    const msg = document.createElement("div");
    msg.className = `message ${sender}`; // Define se é 'user' ou 'bot' para o CSS
    msg.textContent = text;
    chatBox.appendChild(msg);
    
    // Faz o scroll automático para o final da conversa
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // ==========================================
  // 3. FUNÇÃO: LÓGICA DE RESPOSTA DO BOT
  // ==========================================
  function botReply(userText) {
    const lower = userText.toLowerCase(); // Converte para minúsculo para facilitar a busca

    // Verifica palavras-chave na mensagem do usuário
    if (lower.includes("pedido") || lower.includes("entrega")) {
      return "Seu pedido está em processamento. Use o número de rastreamento no seu e-mail para acompanhar a entrega.";
    }
    
    if (lower.includes("pagamento") || lower.includes("cartão") || lower.includes("pix")) {
      return "Aceitamos PIX, cartão de crédito e boleto. Se preferir, podemos enviar link de pagamento seguro.";
    }
    
    if (lower.includes("troca") || lower.includes("devolucao") || lower.includes("reembolso")) {
      return "Você pode solicitar troca/devolução em até 30 dias. Envie o motivo e o número do pedido.";
    }

    // Resposta padrão caso nenhuma palavra-chave seja encontrada
    return "Obrigado pelo contato! Já recebemos sua mensagem e vamos responder em instantes.";
  }

  // ==========================================
  // 4. EVENTO: ENVIO DO FORMULÁRIO (INPUT)
  // ==========================================
  supportForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Impede a página de recarregar
    
    const text = userMessageInput.value.trim();
    if (!text) return; // Se estiver vazio, não faz nada

    // 1. Adiciona a mensagem do usuário na tela
    addMessage(text, "user");
    userMessageInput.value = ""; // Limpa o campo de texto
    
    // 2. Atualiza a dica visual de "status"
    supportHint.textContent = "Aguarde... enquadrando sua solicitação ao atendimento.";

    // 3. Simula um atraso (600ms) para parecer que o bot está "pensando"
    setTimeout(() => {
      addMessage(botReply(text), "bot"); // Gera a resposta baseada no texto
      supportHint.textContent = "Pergunte outra coisa ou use o botão de voltar para iniciar nova conversa.";
    }, 600);
  });
});