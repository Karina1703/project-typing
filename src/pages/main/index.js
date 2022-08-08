export default class MainPage {
    constructor() {
        this.correctCount = 0
        this.wrongCount = 0
        this.index = 0
        this.typingDuration = 30
    }

    async render() {
        const text = await this.loadText()
        this.lettersToEnter = text.split('')
        this.element = this.mainText
        this.addTimer()
        this.initEventListeners()
        return this.element
    }

    async loadText() {
        const response = await fetch('https://fish-text.ru/get?format=json&number=3')
        const data = await response.json()
        return data.text
    }

    initEventListeners() {
        this.element.addEventListener('input', this.onInput)
    }

    addTimer() {
        this.typingDurationCountdown = this.typingDuration
        const timer = this.element.querySelector('.timer')

        const timerElementId = setInterval(() => {
            this.typingDurationCountdown--;
            timer.innerHTML = this.typingDurationCountdown;
        }, 1000);

        const timerSpeedId = setInterval(() => {
            this.speedSwitcher()
        }, 200);

        setTimeout(() => {
            clearInterval(timerElementId);
            clearInterval(timerSpeedId);
            this.addResult();
        }, this.typingDuration * 1000)
    }

    onInput = (e) => {
        this.classToggler(e.target.value)
        this.accuracySwitcher()
        e.target.value = ""
    }

    speedSwitcher() {
        const speedValue = document.getElementById('speed__value')
        this.elapsedTimeInMinutes = (this.typingDuration - this.typingDurationCountdown) / 60
        this.speed = Math.round(this.correctCount / this.elapsedTimeInMinutes)
        speedValue.innerHTML =  this.speed ? this.speed : 0
    }

    accuracySwitcher() {
        const accuracyValue = document.getElementById('accuracy__value')
        const totalCount = this.wrongCount + this.correctCount
        const accuracy = this.correctCount / totalCount * 100
        accuracyValue.innerHTML = accuracy.toFixed(1)
    }

    classToggler(letter) {
        const letterListInHtml = this.element.querySelectorAll('.letter')

        if (this.lettersToEnter[this.index] === letter) {
            this.index++
            this.correctCount++

            if (this.element.querySelector('.next')) this.element.querySelector('.next').classList.remove('next')

            letterListInHtml[this.index].classList.add('next')
            letterListInHtml[this.index - 1].classList.add('white')
            letterListInHtml[this.index - 1].classList.remove('red')

        } else {
            this.wrongCount++
            letterListInHtml[this.index].classList.remove('white')
            letterListInHtml[this.index].classList.add('red')
        }
    }

    get mainText() {
        return this.createElement(`
        <div class = 'wrapper'>
        <div class="main__text">
        <input type="text" class="certificate-input" id="certificateInput" autocomplete="off" autofocus>
        <div class="text__wrapper">
            <div class='words'>${this.addDefaultText()}</div>
        </div>
    </div>
    <div class="main__stat">
    <div class="speed__wrapper">
        <div class="value__wrapper"><span id="speed__value">0</span> зн./мин</div>
        <div class="speed__text">скорость</div>
    </div>
    <div class="accuracy__wrapper">
        <div class="value__wrapper"><span id="accuracy__value">0</span>%</div>
        <div class="accuracy__text">Точность</div>
    </div>
    <div class="timer timer__value">${this.typingDuration}</div>
</div></div>
    `)
    }

    addDefaultText() {
        return this.lettersToEnter
            .map(letter => {
                return `<letter class = 'letter'>${letter}</letter>`
            })
            .join('')
    }

    addResult() {
        this.element.innerHTML = `<div class = 'result__wrapper'><div class ="result__text">${this.speed} символов в минуту!</div></div>`
    }

    createElement(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.firstElementChild;
    }
}


