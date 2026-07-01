/* ============================================================
   Admin — login dos noivos + lista de confirmações
   Lê a tabela `rsvp` (somente usuários autenticados conseguem,
   conforme as políticas RLS do Supabase).
   ============================================================ */
(function () {
  const client = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

  const loginView = document.getElementById("login-view");
  const dataView = document.getElementById("data-view");
  const loginForm = document.getElementById("login-form");
  const loginNotice = document.getElementById("login-notice");

  let allRows = [];
  let filter = "todos";

  function esc(s) {
    return (s ?? "").toString().replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
  }

  function fmtDate(iso) {
    try {
      return new Date(iso).toLocaleDateString("pt-BR", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      });
    } catch { return ""; }
  }

  function render() {
    const confirmados = allRows.filter((r) => r.presenca === "Sim");
    const ausentes = allRows.filter((r) => r.presenca === "Não");
    const pessoas = confirmados.reduce((s, r) => s + (r.quantidade || 0), 0);

    document.getElementById("c-go").textContent = confirmados.length;
    document.getElementById("c-no").textContent = ausentes.length;
    document.getElementById("c-all").textContent = allRows.length;
    document.getElementById("c-people").textContent = pessoas;

    const rows =
      filter === "sim" ? confirmados :
      filter === "nao" ? ausentes :
      allRows;

    const list = document.getElementById("rsvp-list");
    if (!rows.length) {
      list.innerHTML = `<p class="muted">Nenhuma resposta ainda.</p>`;
      return;
    }

    list.innerHTML = rows.map((r) => {
      const indo = r.presenca === "Sim";
      return `
      <div class="rsvp-item ${indo ? "rsvp-item--go" : "rsvp-item--no"}">
        <div class="rsvp-item__top">
          <span class="rsvp-item__name">${esc(r.nome)}</span>
          <span class="badge ${indo ? "badge--go" : "badge--no"}">
            ${indo ? "Vai" : "Não vai"}
          </span>
        </div>
        <div class="rsvp-item__meta">${esc(r.telefone)} · ${fmtDate(r.created_at)}</div>
        ${indo && r.quantidade ? `<div class="rsvp-item__field"><b>Convidados:</b> ${r.quantidade}</div>` : ""}
        ${r.restricao ? `<div class="rsvp-item__field"><b>Restrição:</b> ${esc(r.restricao)}</div>` : ""}
        ${r.mensagem ? `<div class="rsvp-item__field"><b>Mensagem:</b> ${esc(r.mensagem)}</div>` : ""}
      </div>`;
    }).join("");
  }

  async function loadData() {
    const { data, error } = await client
      .from("rsvp")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      document.getElementById("rsvp-list").innerHTML =
        `<p class="muted">Erro ao carregar as respostas.</p>`;
      return;
    }
    allRows = data || [];
    render();
  }

  function showData() {
    loginView.hidden = true;
    dataView.hidden = false;
    loadData();
  }

  // Filtros
  document.querySelectorAll(".filter").forEach((b) =>
    b.addEventListener("click", () => {
      filter = b.dataset.filter;
      document.querySelectorAll(".filter").forEach((x) => x.classList.remove("is-active"));
      b.classList.add("is-active");
      render();
    })
  );

  // Login
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    loginNotice.hidden = true;
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) {
      loginNotice.className = "notice notice--error";
      loginNotice.textContent = "E-mail ou senha incorretos.";
      loginNotice.hidden = false;
      return;
    }
    showData();
  });

  // Logout + atualizar
  document.getElementById("logout-btn").addEventListener("click", async () => {
    await client.auth.signOut();
    location.reload();
  });
  document.getElementById("refresh-btn").addEventListener("click", loadData);

  // Se já houver sessão ativa, entra direto
  client.auth.getSession().then(({ data }) => {
    if (data.session) showData();
  });
})();
