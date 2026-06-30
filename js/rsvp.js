/* ============================================================
   Confirmar Presença — envio para o Supabase
   Regra condicional:
     - presença = "Sim"  -> mostra/exige Quantidade; mostra
                            Restrição e Mensagem (opcionais)
     - presença = "Não"  -> envia só nome, telefone e presença
   ============================================================ */
(function () {
  const client = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

  const form = document.getElementById("rsvp-form");
  const conditional = document.getElementById("conditional");
  const qtdField = document.getElementById("qtd-field");
  const notice = document.getElementById("form-notice");
  const submitBtn = document.getElementById("submit-btn");

  // Mostra/esconde o bloco condicional conforme a resposta de presença
  function syncConditional() {
    const value = form.querySelector('input[name="presenca"]:checked')?.value;
    const indo = value === "Sim";
    conditional.hidden = !indo;
    // Quantidade só é obrigatória quando vai comparecer
    form.querySelectorAll('input[name="quantidade"]').forEach((r) => {
      r.required = indo;
    });
  }

  form.querySelectorAll('input[name="presenca"]').forEach((r) =>
    r.addEventListener("change", syncConditional)
  );

  function showNotice(type, msg) {
    notice.className = "notice notice--" + type;
    notice.textContent = msg;
    notice.hidden = false;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    notice.hidden = true;

    const presenca = form.querySelector('input[name="presenca"]:checked')?.value;
    if (!presenca) {
      showNotice("error", "Por favor, escolha se você poderá comparecer.");
      return;
    }

    const indo = presenca === "Sim";
    const data = new FormData(form);

    const payload = {
      nome: (data.get("nome") || "").toString().trim(),
      telefone: (data.get("telefone") || "").toString().trim(),
      presenca: presenca,
      quantidade: indo ? Number(data.get("quantidade")) || null : null,
      restricao: indo ? (data.get("restricao") || "").toString().trim() || null : null,
      mensagem: indo ? (data.get("mensagem") || "").toString().trim() || null : null,
    };

    if (indo && !payload.quantidade) {
      showNotice("error", "Selecione a quantidade de convidados.");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando...";

    const { error } = await client.from("rsvp").insert(payload);

    submitBtn.disabled = false;
    submitBtn.textContent = "Confirmar";

    if (error) {
      console.error(error);
      showNotice("error", "Não foi possível enviar agora. Tente novamente em instantes.");
      return;
    }

    // Sucesso: troca o formulário por uma mensagem de agradecimento
    const wrap = document.getElementById("form-card");
    wrap.innerHTML = `
      <div class="form-success">
        <div class="form-success__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
               stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 class="page-head__script" style="font-size:2.6rem">Obrigado!</h2>
        <p style="margin-top:8px;color:var(--sage)">
          ${indo
            ? "Sua presença foi confirmada. Mal podemos esperar para celebrar com você!"
            : "Recebemos sua resposta. Sentiremos sua falta, mas agradecemos o carinho."}
        </p>
      </div>`;
  });

  syncConditional();
})();
