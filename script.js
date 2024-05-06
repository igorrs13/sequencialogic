document.addEventListener('DOMContentLoaded', function () {
    const uploadInput = document.getElementById('image-upload');
    const previewArea = document.getElementById('preview-area');
    const confirmButton = document.getElementById('confirm-button');
    const studentContainer = document.querySelector('.student-container');
    const slotsContainer = document.querySelector('.slots-container');
    const uploadedImagesDiv = document.querySelector('.uploaded-images');
    let uploadedImages = [];

    // Função para adicionar imagem à pré-visualização
    function addImageToPreview(file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imgDiv = document.createElement('div');
            imgDiv.classList.add('preview-img');
            imgDiv.style.backgroundImage = `url('${e.target.result}')`;
            const closeButton = document.createElement('div');
            closeButton.classList.add('close');
            closeButton.textContent = 'X';
            closeButton.onclick = function () {
                // Remove a imagem do array e do DOM
                previewArea.removeChild(imgDiv);
                uploadedImages = uploadedImages.filter(img => img !== file);
            };
            imgDiv.appendChild(closeButton);
            previewArea.appendChild(imgDiv);
            uploadedImages.push(file);
        };
        reader.readAsDataURL(file);
    }

    // Evento de mudança no input de upload
    uploadInput.addEventListener('change', function () {
        if (uploadedImages.length < 8) {
            Array.from(uploadInput.files).forEach(file => {
                if (uploadedImages.length < 8) {
                    addImageToPreview(file);
                }
            });
        }
        uploadInput.value = ''; // Limpa o input depois do upload
    });

    // Função para criar os slots e as imagens no contêiner do aluno
    function initializeStudentArea() {
        uploadedImagesDiv.innerHTML = ''; // Limpa imagens prévias
        slotsContainer.innerHTML = ''; // Limpa slots prévios
        uploadedImages.forEach((image, index) => {
            const slot = document.createElement('div');
            slot.classList.add('slot');
            slotsContainer.appendChild(slot);

            const img = document.createElement('img');
            img.classList.add('draggable-image');
            img.src = URL.createObjectURL(image);
            img.draggable = true;
            img.ondragstart = dragStart;
            uploadedImagesDiv.appendChild(img);
        });
    }

    // Configura o drag and drop
    function dragStart(event) {
        event.dataTransfer.setData("text/plain", event.target.src);
    }

    slotsContainer.ondragover = function (event) {
        event.preventDefault();
    };

    slotsContainer.ondrop = function (event) {
        event.preventDefault();
        const src = event.dataTransfer.getData("text/plain");
        const img = document.querySelector(`img[src="${src}"]`);
        const slot = event.target.closest('.slot');
        if (slot && !slot.firstChild) {
            slot.appendChild(img); // Move a imagem para o slot
        }
    };

    // Evento do botão de confirmar
    confirmButton.addEventListener('click', function () {
        if (uploadedImages.length > 0) {
            initializeStudentArea();
            previewArea.innerHTML = '';
            uploadInput.style.display = 'none';
            confirmButton.style.display = 'none';
            studentContainer.style.display = 'block'; // Garante que o contêiner do aluno seja exibido
        } else {
            alert('Por favor, faça upload de pelo menos uma imagem antes de confirmar.');
        }
    });
});
