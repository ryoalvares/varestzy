document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formPendaftaran");
  const tabel = document.getElementById("tabelPendaftar").getElementsByTagName('tbody')[0] || document.getElementById("tabelPendaftar");
  
  let pendaftar = JSON.parse(localStorage.getItem("pendaftar")) || [];
  let editIndex = null;

  // Fungsi untuk menampilkan data pendaftar ke tabel
  function renderTable() {
    // Reset isi tbody tabel agar tidak dobel
    tabel.innerHTML = "";

    // Loop dan buat baris data
    pendaftar.forEach((p, i) => {
      const row = tabel.insertRow();

      row.insertCell(0).innerText = p.nama;
      row.insertCell(1).innerText = p.email;
      row.insertCell(2).innerText = p.kursus;

      const aksiCell = row.insertCell(3);
      aksiCell.innerHTML = `
        <button type="button" onclick="editData(${i})" aria-label="Edit data pendaftar">✏️ Edit</button>
        <button type="button" onclick="hapusData(${i})" aria-label="Hapus data pendaftar">❌ Hapus</button>
      `;
    });

    // Jika data kosong, tampilkan baris informasi
    if (pendaftar.length === 0) {
      const row = tabel.insertRow();
      const cell = row.insertCell(0);
      cell.colSpan = 4;
      cell.style.textAlign = "center";
      cell.innerText = "Belum ada data pendaftar.";
    }
  }

  // Fungsi validasi sederhana untuk email
  function validEmail(email) {
    // Regex sederhana untuk cek email
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Event submit form (tambah atau edit data)
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nama = form.nama.value.trim();
    const email = form.email.value.trim();
    const kursus = form.kursus.value;

    // Validasi form
    if (!nama || !email || !kursus) {
      alert("Semua field wajib diisi!");
      return;
    }

    if (!validEmail(email)) {
      alert("Email tidak valid!");
      return;
    }

    if (editIndex === null) {
      // Tambah data baru
      pendaftar.push({
        nama,
        email,
        kursus,
        tanggal: new Date().toLocaleString()
      });
    } else {
      // Update data lama
      pendaftar[editIndex] = {
        ...pendaftar[editIndex], // mempertahankan properti selain yang diubah
        nama,
        email,
        kursus
      };
      editIndex = null;
    }

    // Simpan dan render ulang
    localStorage.setItem("pendaftar", JSON.stringify(pendaftar));
    renderTable();

    // Reset form dan fokus ke nama
    form.reset();
    form.nama.focus();
  });

  // Fungsi hapus data pendaftar berdasarkan index
  window.hapusData = (index) => {
    if (confirm("Yakin ingin menghapus data ini?")) {
      pendaftar.splice(index, 1);
      localStorage.setItem("pendaftar", JSON.stringify(pendaftar));
      renderTable();
    }
  };

  // Fungsi edit data, isi form dengan data yang dipilih
  window.editData = (index) => {
    const p = pendaftar[index];
    form.nama.value = p.nama;
    form.email.value = p.email;
    form.kursus.value = p.kursus;
    editIndex = index;

    // Fokus ke input nama agar user tahu sedang edit
    form.nama.focus();
  };

  // Render tabel saat halaman pertama kali dimuat
  renderTable();
});
