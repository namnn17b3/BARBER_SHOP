var dropzone = document.getElementById('dropzone');

dropzone.addEventListener('dragover', e => {
  e.preventDefault();
  dropzone.classList.add('border-indigo-600');
});

dropzone.addEventListener('dragleave', e => {
  e.preventDefault();
  dropzone.classList.remove('border-indigo-600');
});

dropzone.addEventListener('drop', e => {
  e.preventDefault();
  dropzone.classList.remove('border-indigo-600');
  var file = e.dataTransfer.files[0];
  displayPreview(file);
});

var input = document.getElementById('file-upload');

input.addEventListener('change', e => {
  var file = e.target.files[0];
  displayPreview(file);
});

function displayPreview(file) {
  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    var preview = document.getElementById('preview');
    preview.src = reader.result;
    preview.classList.remove('hidden');
  };
}
