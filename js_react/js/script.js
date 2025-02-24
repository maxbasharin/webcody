document.addEventListener('DOMContentLoaded', function() {
    const navbarHTML = `
    <header>
        <nav id="navbar">
            <ul>
                <li><a href="/index.html">Главная</a></li>
            </ul>
        </nav>
    </header>
    `;

    // Вставляем навигацию в тело документа
    document.body.insertAdjacentHTML('afterbegin', navbarHTML);

    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    const closeModal = document.querySelector('.close');

    // Проверяем наличие элементов перед добавлением обработчиков событий
    if (modal && modalBody && closeModal) {
        document.querySelectorAll('a[data-modal-trigger]').forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault(); // Отменяем стандартное поведение ссылки
                const url = this.getAttribute('href');

                // Загружаем содержимое страницы
                fetch(url)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Сетевая ошибка: ' + response.statusText);
                        }
                        return response.text();
                    })
                    .then(data => {
                        modalBody.innerHTML = data; // Вставляем содержимое в модальное окно
                        modal.classList.add('show'); // Показываем модальное окно с анимацией
                        setTimeout(() => {
                            modal.querySelector('.modal-content').classList.add('show');
                        }, 100); // Увеличиваем задержку до 100 мс
                        
                        document.body.classList.add('no-scroll'); // Запрещаем прокрутку страницы
                        history.pushState(null, '', url); // Меняем URL
                    })
                    .catch(error => console.error('Ошибка при загрузке:', error));
            });
        });

        closeModal.addEventListener('click', function() {
            modal.querySelector('.modal-content').classList.remove('show'); // Убираем класс показа
            modal.querySelector('.modal-content').classList.add('hide'); // Применяем класс для скрытия
            setTimeout(() => {
                modal.classList.remove('show'); // Убираем модалку из отображения
                modal.querySelector('.modal-content').classList.remove('hide'); // Убираем класс скрытия
                document.body.classList.remove('no-scroll'); // Восстанавливаем прокрутку страницы
            }, 300); // Устанавливаем таймаут, чтобы дождаться окончания анимации
            history.replaceState(null, '', '/index.html'); // Очищаем URL, возвращая к главной странице
        });

        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal.click(); // Закрываем модальное окно при клике вне его
            }
        });

        window.addEventListener('popstate', function() {
            closeModal.click(); // Закрываем модальное окно при нажатии кнопки "Назад"
        });
    }
});

// Код для процента прокрутки
const scrollPercentageElement = document.getElementById('scrollPercentage');

if (scrollPercentageElement) {
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY; // Количество прокрученных пикселей
        const windowHeight = window.innerHeight; // Высота окна браузера
        const documentHeight = document.documentElement.scrollHeight; // Полная высота документа

        // Вычисляем процент прокрутки
        const totalScrollableHeight = documentHeight - windowHeight;
        const scrollPercentage = Math.min((scrollTop / totalScrollableHeight) * 100, 100);

        // Обновляем текст элемента с процентом прокрутки
        scrollPercentageElement.textContent = Math.round(scrollPercentage) + '%';
    });
}
