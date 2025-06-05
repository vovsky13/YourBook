document.addEventListener('DOMContentLoaded', () => {
    // Получаем данные
    const userPhoto = sessionStorage.getItem('userPhoto');
    const userName = sessionStorage.getItem('userName') || 'Юный Читатель';
    const font = sessionStorage.getItem('font') || "'Comic Neue', cursive";
    const coverStyle = sessionStorage.getItem('coverStyle') || 'classic';
    const taleId = sessionStorage.getItem('tale');
    const lang = sessionStorage.getItem('lang');
    
    // Применяем шрифт
    document.body.style.fontFamily = font;
    
    // Загружаем сказку
    fetch(`tales/${lang}/${taleId}.json`)
        .then(response => response.json())
        .then(tale => generateBook(tale, userPhoto, userName, coverStyle))
        .catch(error => {
            console.error('Error loading tale:', error);
            alert('Ошибка загрузки сказки. Пожалуйста, попробуйте снова.');
        });
    
    function generateBook(tale, photo, name, coverStyle) {
        const bookPreview = document.getElementById('book-preview');
        bookPreview.innerHTML = '';
        
        // Титульная страница с именем
        const coverPage = document.createElement('div');
        coverPage.className = `book-page cover-page ${coverStyle}`;
        coverPage.innerHTML = `
            <div class="page-content">
                <div class="cover-header">
                    <h1>${tale.title}</h1>
                    <h2>Персональная история для</h2>
                    <h3>${name}</h3>
                </div>
                <div class="cover-image">
                    <img src="${photo}" class="user-photo cover-photo">
                </div>
                <div class="cover-footer">
                    <p>Создано с помощью StoryWraps</p>
                    <p>${new Date().toLocaleDateString()}</p>
                </div>
            </div>
        `;
        bookPreview.appendChild(coverPage);
        
        // Генерация страниц
        tale.pages.forEach((page, index) => {
            const pageElement = document.createElement('div');
            pageElement.className = 'book-page';
            pageElement.innerHTML = `
                <div class="page-content">
                    <div class="illustration">
                        <img src="${photo}" class="user-photo">
                        <img src="assets/masks/${page.mask}" class="mask">
                    </div>
                    <div class="text-content">
                        <h3>${page.title}</h3>
                        <p>${page.text}</p>
                        <div class="page-number">${index + 1}</div>
                    </div>
                </div>
            `;
            bookPreview.appendChild(pageElement);
        });
        
        // Страница с заметками
        const notesPage = document.createElement('div');
        notesPage.className = 'book-page notes-page';
        notesPage.innerHTML = `
            <div class="page-content">
                <h2>Мои заметки</h2>
                <div class="notes-container">
                    <textarea placeholder="Запиши свои впечатления о сказке..."></textarea>
                    <div class="drawing-area">
                        <canvas id="drawing-canvas" width="400" height="300"></canvas>
                        <button id="clear-canvas">Очистить</button>
                    </div>
                </div>
                <div class="page-number">${tale.pages.length + 1}</div>
            </div>
        `;
        bookPreview.appendChild(notesPage);
        
        // Инициализация рисования
        setTimeout(initDrawingCanvas, 500);
    }
    
    function initDrawingCanvas() {
        const canvas = document.getElementById('drawing-canvas');
        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);
        
        document.getElementById('clear-canvas').addEventListener('click', () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        });
        
        function startDrawing(e) {
            isDrawing = true;
            draw(e);
        }
        
        function draw(e) {
            if (!isDrawing) return;
            
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.strokeStyle = '#333';
            
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
        }
        
        function stopDrawing() {
            isDrawing = false;
            ctx.beginPath();
        }
    }
    
    // Обработчики кнопок
    document.getElementById('print-btn').addEventListener('click', () => {
        window.print();
    });
    
    document.getElementById('new-book').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    
    document.getElementById('save-project').addEventListener('click', () => {
        const bookData = {
            userName: userName,
            tale: taleId,
            lang: lang,
            coverStyle: coverStyle,
            font: font,
            createdAt: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(bookData)], {type: 'application/json'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `storywraps-project-${Date.now()}.swp`;
        a.click();
    });
});
