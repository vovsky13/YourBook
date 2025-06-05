document.getElementById('download-pdf').addEventListener('click', generatePDF);

async function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    
    const progressBar = document.getElementById('generation-progress');
    const pages = document.querySelectorAll('.book-page');
    const totalPages = pages.length;
    
    for (let i = 0; i < totalPages; i++) {
        // Обновляем прогресс
        const progress = Math.round((i + 1) / totalPages * 100);
        progressBar.style.width = `${progress}%`;
        progressBar.textContent = `${progress}%`;
        
        if (i > 0) doc.addPage();
        
        const canvas = await html2canvas(pages[i], {
            scale: 2,
            useCORS: true,
            logging: false
        });
        
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        
        // Рассчитываем пропорции
        const imgRatio = canvas.width / canvas.height;
        const pageRatio = pageWidth / pageHeight;
        
        let width, height;
        if (imgRatio > pageRatio) {
            width = pageWidth;
            height = pageWidth / imgRatio;
        } else {
            height = pageHeight;
            width = pageHeight * imgRatio;
        }
        
        const x = (pageWidth - width) / 2;
        const y = (pageHeight - height) / 2;
        
        doc.addImage(imgData, 'JPEG', x, y, width, height);
    }
    
    doc.save(`storywraps-${new Date().getTime()}.pdf`);
    progressBar.style.width = '0%';
    progressBar.textContent = '0%';
}
