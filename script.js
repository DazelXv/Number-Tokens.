async function saveToGithub() {
  const tokenValue = document.getElementById("tokenInput").value;
  const status = document.getElementById("status");

  if (!tokenValue) {
    status.innerText = "❌ Token tidak boleh kosong";
    return;
  }

  // ===== KONFIGURASI GITHUB =====
  const GITHUB_TOKEN = "GITHUB_PAT_KAMU"; // ❌ JANGAN UNTUK PRODUKSI
  const OWNER = "usernameGithub";
  const REPO = "namaRepo";
  const FILE_PATH = "data.json";
  const BRANCH = "main";

  const apiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`;

  try {
    // Ambil file lama
    const getFile = await fetch(apiUrl, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`
      }
    });

    let content = [];
    let sha = null;

    if (getFile.ok) {
      const data = await getFile.json();
      sha = data.sha;
      content = JSON.parse(atob(data.content));
    }

    // Tambahkan data baru
    content.push({
      value: tokenValue,
      time: new Date().toISOString()
    });

    // Upload ulang
    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "Add new token",
        content: btoa(JSON.stringify(content, null, 2)),
        sha: sha,
        branch: BRANCH
      })
    });

    if (response.ok) {
      status.innerText = "✅ Berhasil disimpan ke GitHub";
      document.getElementById("tokenInput").value = "";
    } else {
      status.innerText = "❌ Gagal menyimpan data";
    }

  } catch (err) {
    status.innerText = "❌ Error: " + err.message;
  }
}
