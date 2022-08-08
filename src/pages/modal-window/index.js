import MainPage from "../main/index.js";

export default class Modal {
    render() {
        const element = document.createElement('div');
        element.innerHTML = this.modalWindow;
        this.element = element.firstElementChild;
        this.initEventListeners()
        return this.element
    }

    get modalWindow() {
        return `<div class ="wrapper"><div class="modal">
        <div class="modal__header">
            <h1 class ='text-desktop'>Добро пожаловать в тренажер слепой печати</h1>
            <h1 class ='text-mobile'>Прости, тренажер слепой печати не работает на мобильном. Пожалуйста, используй компьютер</h1>
        </div>
        <button id="startButton" class="modal__button">Начать!</button>
        </div></div>`
    }

    initEventListeners() {
        const modalButton = this.element.querySelector('.modal__button')
        modalButton.addEventListener('click', this.onButtonClick)
    }

    async onButtonClick (){
        const contentNode = document.querySelector('#root');
        contentNode.innerHTML = '';
        contentNode.classList.add('loading')

        const mainPage = new MainPage()
        const element = await mainPage.render();
        contentNode.classList.remove('loading')

        contentNode.append(element);
    }
}


