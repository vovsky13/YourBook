// Редактор фото
document.addEventListener('DOMContentLoaded', () => {
    const sizeSlider = document.getElementById('photo-size');
    const brightnessSlider = document.getElementById('photo-brightness');
    const contrastSlider = document.getElementById('photo-contrast');
    const resetBtn = document.getElementById('reset-photo');
    
    sizeSlider.addEventListener('input', () => {
        const value = sizeSlider.value;
        document.getElementById('size-value').textContent = `${value}%`;
        document.querySelectorAll('.user-photo').forEach(img => {
            img.style.width = `${value}%`;
        });
    });
    
    brightnessSlider.addEventListener('input', () => {
        const value = brightnessSlider.value;
        document.getElementById('brightness-value').textContent = `${value}%`;
        updatePhotoFilters();
    });
    
    contrastSlider.addEventListener('input', () => {
        const value = contrastSlider.value;
        document.getElementById('contrast-value').textContent = `${value}%`;
        updatePhotoFilters();
    });
    
    resetBtn.addEventListener('click', () => {
        sizeSlider.value = 100;
        brightnessSlider.value = 100;
        contrastSlider.value = 100;
        document.getElementById('size-value').textContent = '100%';
        document.getElementById('brightness-value').textContent = '100%';
        document.getElementById('contrast-value').textContent = '100%';
        updatePhotoFilters();
        document.querySelectorAll('.user-photo').forEach(img => {
            img.style.width = '100%';
        });
    });
    
    function updatePhotoFilters() {
        const brightness = brightnessSlider.value;
        const contrast = contrastSlider.value;
        document.querySelectorAll('.user-photo').forEach(img => {
            img.style.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
        });
    }
    
    // Ночной режим
    document.getElementById('night-mode-toggle').addEventListener('click', () => {
        document.body.classList.toggle('night-mode');
        const btn = document.getElementById('night-mode-toggle');
        if (document.body.classList.contains('night-mode')) {
            btn.textContent = '☀️ Дневной режим';
        } else {
            btn.textContent = '🌙 Ночной режим';
        }
    });
    
    // Навигация по страницам
    let currentPage = 0;
    const pages = document.querySelectorAll('.book-page');
    
    function updatePageNavigation() {
        document.getElementById('page-counter').textContent = 
            `Страница ${currentPage + 1} из ${pages.length}`;
        
        pages.forEach((page, index) => {
            page.style.display = index === currentPage ? 'block' : 'none';
        });
    }
    
    document.getElementById('prev-page').addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            updatePageNavigation();
        }
    });
    
    document.getElementById('next-page').addEventListener('click', () => {
        if (currentPage < pages.length - 1) {
            currentPage++;
            updatePageNavigation();
        }
    });
    
    // Инициализация после генерации книги
    setTimeout(() => {
        pages = document.querySelectorAll('.book-page');
        if (pages.length > 0) {
            updatePageNavigation();
        }
    }, 1000);
});
