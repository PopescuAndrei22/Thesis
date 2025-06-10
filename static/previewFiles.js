    function toggleSecondFileInput() {
      const compareOption = document.getElementById("compare");
      const secondFileGroup = document.getElementById("secondFileGroup");
      secondFileGroup.style.display = compareOption.checked ? "block" : "none";
    }

    function previewFile(fileInput, previewContainerId, dropdownId) {
      const file = fileInput.files[0];
      if (!file) return;

      const allowedTypes = ['application/json', 'text/csv'];
      if (!allowedTypes.includes(file.type) && !file.name.endsWith('.csv') && !file.name.endsWith('.json')) {
        alert('Doar fisiere CSV si JSON sunt acceptate.');
        fileInput.value = '';
        return;
      }

      const previewContainer = document.getElementById(previewContainerId);
      const dropdown = document.getElementById(dropdownId);
      previewContainer.innerHTML = '';
      dropdown.innerHTML = '<option value="">Selecteaza coloana pentru analiza</option>';

      const reader = new FileReader();
      reader.onload = function(e) {
        const content = e.target.result;

        if (file.name.endsWith('.csv')) {
          Papa.parse(content, {
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
              const data = results.data.slice(0, 5);
              const headers = results.meta.fields;

              let html = `<table class="table table-sm table-bordered"><thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>`;
              data.forEach(row => {
                html += '<tr>' + headers.map(h => `<td>${row[h] ?? ''}</td>`).join('') + '</tr>';
              });
              html += '</tbody></table>';
              previewContainer.innerHTML = html;

              headers.forEach(h => {
                const option = document.createElement('option');
                option.value = h;
                option.textContent = h;
                dropdown.appendChild(option);
              });
            }
          });
        } else if (file.name.endsWith('.json')) {
          try {
            const data = JSON.parse(content);
            if (!Array.isArray(data) || data.length === 0 || typeof data[0] !== 'object') {
              previewContainer.innerHTML = 'JSON invalid sau format nepotrivit pentru previzualizare.';
              return;
            }
            const keys = Object.keys(data[0]);
            let html = `<table class="table table-sm table-bordered"><thead><tr>${keys.map(k => `<th>${k}</th>`).join('')}</tr></thead><tbody>`;
            data.slice(0, 5).forEach(item => {
              html += '<tr>' + keys.map(k => `<td>${item[k] ?? ''}</td>`).join('') + '</tr>';
            });
            html += '</tbody></table>';
            previewContainer.innerHTML = html;

            keys.forEach(k => {
              const option = document.createElement('option');
              option.value = k;
              option.textContent = k;
              dropdown.appendChild(option);
            });
          } catch (error) {
            previewContainer.innerHTML = 'Eroare la parsarea JSON-ului.';
          }
        }
      };
      reader.readAsText(file);
    }