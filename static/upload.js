document.getElementById('upload-form').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];
    const statusDiv = document.getElementById('status');
  
    if (!file) {
      statusDiv.textContent = "Please select a file.";
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
  
    statusDiv.textContent = "Uploading...";
  
    fetch('/upload', {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        statusDiv.textContent = data.message;
      } else {
        statusDiv.textContent = "Error: " + data.message;
      }
    })
    .catch(err => {
      console.error(err);
      statusDiv.textContent = "Upload failed.";
    });
  });
  