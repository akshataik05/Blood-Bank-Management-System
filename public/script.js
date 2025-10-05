const API_URL = 'http://localhost:3000/donors';
let donors = [];

// Fetch donors from backend (with optional blood group filter)
async function fetchDonors(bloodGroup = '') {
  try {
    let url = API_URL;
    if (bloodGroup) url += '?bloodGroup=' + encodeURIComponent(bloodGroup);

    const res = await fetch(url);
    donors = await res.json();
    renderDonors();
  } catch {
    alert('Failed to fetch donors.');
  }
}

// Render donors into the table
function renderDonors() {
  const tbody = document.querySelector('#donorsTable tbody');
  tbody.innerHTML = '';

  donors.forEach(donor => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${donor.name}</td>
      <td>${donor.bloodGroup}</td>
      <td>${donor.contact}</td>
      <td>
        <span class="area-text">${donor.area}</span>
        <span class="edit-area-icon" title="Edit Area">✎</span>
      </td>
      <td>${donor.age}</td>
      <td>${donor.gender}</td>
      <td>
        <button class="btn btn-sm btn-danger delete-btn">Delete</button>
      </td>
    `;

    // Delete donor
    tr.querySelector('.delete-btn').onclick = async () => {
      if (!confirm(`Delete donor "${donor.name}"?`)) return;
      await fetch(`${API_URL}/${donor._id}`, { method: 'DELETE' });
      fetchDonors(document.getElementById('searchBloodGroup').value);
    };

    // Edit area inline
    const areaSpan = tr.querySelector('.area-text');
    const editIcon = tr.querySelector('.edit-area-icon');
    editIcon.onclick = () => {
      const input = document.createElement('input');
      input.type = 'text';
      input.value = donor.area;
      input.className = 'edit-area-input';
      areaSpan.replaceWith(input);
      editIcon.style.display = 'none';
      input.focus();

      input.onblur = async () => {
        const newArea = input.value.trim();
        if (newArea && newArea !== donor.area) {
          try {
            const res = await fetch(`${API_URL}/${donor._id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ area: newArea }),
            });
            if (!res.ok) throw new Error('Update failed');
            fetchDonors(document.getElementById('searchBloodGroup').value);
          } catch {
            alert('Failed to update area.');
            renderDonors();
          }
        } else {
          renderDonors();
        }
      };

      input.onkeydown = e => {
        if (e.key === 'Enter') input.blur();
      };
    };

    tbody.appendChild(tr);
  });
}

// Add donor form submit
document.getElementById('donorForm').onsubmit = async e => {
  e.preventDefault();
  const form = e.target;

  const donor = {
    name: form.name.value.trim(),
    bloodGroup: form.bloodGroup.value,
    contact: form.contact.value.trim(),
    area: form.area.value.trim(),
    age: Number(form.age.value),
    gender: form.gender.value,
  };

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donor),
    });
    if (!res.ok) throw new Error('Failed to add donor');
    form.reset();
    fetchDonors();
  } catch (err) {
    alert(err.message);
  }
};

// Filter by blood group
document.getElementById('searchBtn').onclick = e => {
  e.preventDefault();
  const filter = document.getElementById('searchBloodGroup').value.toUpperCase();
  const rows = document.querySelectorAll('#donorsTable tbody tr');
  rows.forEach(row => {
    const bloodGroup = row.cells[1].innerText.toUpperCase();
    row.style.display = filter === '' || bloodGroup.includes(filter) ? '' : 'none';
  });
};

// Reset filters
document.getElementById('resetBtn').onclick = e => {
  e.preventDefault();
  document.getElementById('searchBloodGroup').value = '';
  const rows = document.querySelectorAll('#donorsTable tbody tr');
  rows.forEach(row => (row.style.display = ''));
};

// Initial load
fetchDonors();
