document.addEventListener('DOMContentLoaded', () => {
    const photoUpload = document.getElementById('photo-upload');
    const photoPreview = document.getElementById('photo-preview');
    const dropZone = document.getElementById('photo-drop-zone');
    const generateBtn = document.getElementById('generate-btn');
    let userPhoto = null;

    // Drag and drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });
    
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        
        if (e.dataTransfer.files.length) {
            processImage(e.dataTransfer.files[0]);
        }
    });

    // File input
    photoUpload.addEventListener('change', (e) => {
        if (e.target.files.length) {
            processImage(e.target.files[0]);
        }
    });

    function processImage(file) {
        if (!file.type.match('image.*')) {
            alert('Пожалуйста, выберите файл изображения');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            userPhoto = event.target.result;
            photoPreview.innerHTML = `
                <div class="preview-wrapper">
                    <img src="${userPhoto}" alt="Ваше фото">
                    <div class="preview-controls">
                        <button id="rotate-left">↺</button>
                        <button id="rotate-right">↻</button>
                        <button id="remove-photo">✕ Удалить</button>
                    </div>
                </div>
            `;
            
            // Добавляем обработчики для кнопок
            document.getElementById('remove-photo').addEventListener('click', () => {
                userPhoto = null;
                photoPreview.innerHTML = '';
                photoUpload.value = '';
            });
            
            document.getElementById('rotate-left').addEventListener('click', rotateImage(-90));
            document.getElementById('rotate-right').addEventListener('click', rotateImage(90));
        };
        reader.readAsDataURL(file);
    }

    function rotateImage(degrees) {
        return () => {
            const img = photoPreview.querySelector('img');
            const currentRotation = parseInt(img.style.transform.replace('rotate(', '').replace('deg)', '')) || 0;
            const newRotation = currentRotation + degrees;
            img.style.transform = `rotate(${newRotation}deg)`;
        };
    }

    // Обработка генерации
    generateBtn.addEventListener('click', () => {
        const userName = document.getElementById('user-name').value || 'Юный Читатель';
        const font = document.getElementById('font-select').value;
        const coverStyle = document.getElementById('cover-style').value;
        const lang = document.querySelector('.language-switcher button.active').dataset.lang;
        
        // Проверка выбора сказки
        const selectedTale = document.querySelector('.tale-card.selected');
        if (!selectedTale) {
            alert('Пожалуйста, выберите сказку');
            return;
        }
        const taleId = selectedTale.dataset.id;
        
        if (!userPhoto) {
            alert('Пожалуйста, загрузите фото');
            return;
        }
        
        // Сохраняем данные
        sessionStorage.setItem('userPhoto', userPhoto);
        sessionStorage.setItem('userName', userName);
        sessionStorage.setItem('font', font);
        sessionStorage.setItem('coverStyle', coverStyle);
        sessionStorage.setItem('tale', taleId);
        sessionStorage.setItem('lang', lang);
        
        // Переходим к генератору
        window.location.href = 'generator.html';
    });

    // Выбор сказки
    document.querySelectorAll('.tale-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.tale-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
        });
    });

    // Переключение языка
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
});
