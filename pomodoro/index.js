const qs = (arg) => document.querySelector(arg)
const qsAll = (arg) => document.querySelectorAll(arg)
const buttons = qsAll('.button')
const divMinutes = qs('.minutes')
const divSeconds = qs('.seconds')
const timerButton = qs('.timer__button')
const circle = qs('.svg__circle')
const showSettingsButton = qs('.showSettingsButton')
const settingsWrapper = qs('.settingsWrapper')
const settingsExitButton = qs('.settings__exit')
const applyBtn = qs('.apply')
const pomodoroInput = qs('#mainTimer')
const shortBreakInput = qs('#shortTimer')
const longBreakInput = qs('#longTimer')
const fontButtons = qsAll('.font__button')
const colorButtons = qsAll('.color__button')
const allInputsArrows = qsAll('.arr')

const changeValueArrows = (type, val) => {
    if (type === 'incr') {
        if (val < 60) {
            return ++val
        }
    } else {
        if (val > 1) {
            return --val
        }
    }
}
const changeInputsValue = (inputName, type) => {
    const currentInput = document.querySelector(`#${inputName}`)
    const newValue = changeValueArrows(type, +currentInput.value)
    currentInput.value = newValue
}

const inPutValueValidate = (input) => {
    if (input.value > 60) {
        input.value = 60
    } else if (input.value < 1) {
        input.value = 1
    }
}
const addHandleFromInput = (input) => {
    input.addEventListener('change', () => inPutValueValidate(input))
}
addHandleFromInput(pomodoroInput)
addHandleFromInput(shortBreakInput)
addHandleFromInput(longBreakInput)

let defaultFont
let defaultFontClass
let defaultColor
const pomodoroTimer = {
    time: null
}
const shortBreakTimer = {
    time: null
}
const longBreakTimer = {
    time: null
}

const setValuesFromLS = ({ input, timer, lsKey, defaultTime }) => {
    if (localStorage.getItem(lsKey)) {
        timer.time = input.value = localStorage.getItem(lsKey)
    } else {
        input.value = timer.time = defaultTime
    }
}
setValuesFromLS({ input: pomodoroInput, timer: pomodoroTimer, lsKey: 'pomodoroTime', defaultTime: 40 })
setValuesFromLS({ input: shortBreakInput, timer: shortBreakTimer, lsKey: 'shortBreakTime', defaultTime: 15 })
setValuesFromLS({ input: longBreakInput, timer: longBreakTimer, lsKey: 'LongBreakTime', defaultTime: 25 })

let currentPomodoroValue = pomodoroInput.value, currentShortValue = shortBreakInput.value, currentLongValue = longBreakInput.value


let activeTimer = pomodoroTimer
let intermediateFontClass = 'kumbh'
let intermediateColorClass = 'pink'
const showSettings = () => {
    settingsWrapper.style.display = 'block'
}
const setFontFromLS = () => {
    if (localStorage.getItem('defaultFont')) {
        document.body.style.fontFamily = localStorage.getItem('defaultFont')
        defaultFont = localStorage.getItem('defaultFont')
    } else {
        defaultFont = 'Kumbh Sans'
        document.body.style.fontFamily = defaultFont
    }
    let lsValue = localStorage.getItem('defaultFontClass')
    if (lsValue) {
        changeActiveButton(fontButtons, 'activeFont', document.querySelector(`.${lsValue}`))
        defaultFontClass = lsValue
        intermediateFontClass = lsValue
    } else {
        defaultFontClass = 'kumbh'
    }
}
const changeActiveButton = (buttons, activeClassName, targetButton) => {
    buttons.forEach(e => e.classList.remove(`${activeClassName}`))
    targetButton.classList.add(`${activeClassName}`)
}
const setColorFromLS = () => {
    let lsValue = localStorage.getItem('defaultColor')
    if (lsValue) {
        document.documentElement.style.setProperty('--currentColor', `var(--${lsValue})`)
        defaultColor = lsValue
        changeActiveButton(colorButtons, 'activeColor', document.querySelector(`.${lsValue}`))
        intermediateColorClass = defaultColor = lsValue
    } else {
        defaultColor = 'pink'
        document.documentElement.style.setProperty('--currentColor', `var(--${defaultColor})`)
    }
}
setColorFromLS()
setFontFromLS()
const resetToDefaultSettings = () => {
    document.body.style.fontFamily = defaultFont
    document.documentElement.style.setProperty('--currentColor', `var(--${defaultColor})`)
    pomodoroInput.value = currentPomodoroValue
    shortBreakInput.value = currentShortValue
    longBreakInput.value = currentLongValue
}
const exitSettings = () => {
    settingsWrapper.style.display = 'none'
    resetToDefaultSettings()
    changeActiveButton(colorButtons, 'activeColor', document.querySelector(`.${defaultColor}`))
    changeActiveButton(fontButtons, 'activeFont', document.querySelector(`.${defaultFontClass}`))
}
const setSettingsToLS = () => {
    localStorage.setItem('defaultFont', defaultFont)
    localStorage.setItem('defaultFontClass', defaultFontClass)
    localStorage.setItem('defaultColor', defaultColor)
    localStorage.setItem('pomodoroTime', pomodoroTimer.time)
    localStorage.setItem('shortBreakTime', shortBreakTimer.time)
    localStorage.setItem('LongBreakTime', longBreakTimer.time)
}
const applySettings = () => {
    defaultFont = document.body.style.fontFamily
    defaultFontClass = intermediateFontClass
    defaultColor = intermediateColorClass
    currentPomodoroValue = pomodoroTimer.time = pomodoroInput.value
    currentShortValue = shortBreakTimer.time = shortBreakInput.value
    currentLongValue = longBreakTimer.time = longBreakInput.value
    settingsWrapper.style.display = 'none'
    timeInMS = convertMinToMs(activeTimer.time)
    clearInterval(timerId)
    startButton = timerButton.textContent = 'START'
    setSettingsToLS()
    setTime(activeTimer.time)
}
applyBtn.addEventListener('click', applySettings)
showSettingsButton.addEventListener('click', showSettings)
settingsExitButton.addEventListener('click', exitSettings)
const radius = circle.r.baseVal.value
const circumference = radius * 2 * Math.PI
circle.style.strokeDasharray = circumference
circle.style.strokeDashoffset = circumference

const setProgress = (percent) => {
    const offset = circumference - (percent / 100) * circumference
    circle.style.strokeDashoffset = offset
}
const selectFont = (e) => {
    intermediateFontClass = changeButton({
        e,
        buttons: fontButtons,
        className: 'activeFont',
        intermediateVar: intermediateFontClass
    })
    setFont(e.target.classList[1])
}

const setFont = (font) => {
    if (font === 'roboto') {
        document.body.style.fontFamily = 'Roboto Slab'
    } else if (font === 'spaceMono') {
        document.body.style.fontFamily = 'Space Mono'
    } else if (font === 'kumbh') {
        document.body.style.fontFamily = 'Kumbh Sans'
    }
}
const selectColor = (e) => {
    intermediateColorClass = changeButton({
        e,
        buttons: colorButtons,
        className: 'activeColor',
        intermediateVar: intermediateColorClass
    })
    setColor(e.target.classList[1])
}
const changeButton = ({ e, buttons, className, intermediateVar }) => {
    if (!e.target.classList.contains(className)) {
        buttons.forEach(el => el.classList.remove(className))
        e.target.classList.add(className)
        return intermediateVar = e.target.classList[1]
    }
    return intermediateVar
}
const setColor = (color) => {
    document.documentElement.style.setProperty('--currentColor', `var(--${color})`)
}
for (let button of fontButtons) {
    button.addEventListener('click', (e) => selectFont(e))
}
for (let button of colorButtons) {
    button.addEventListener('click', (e) => selectColor(e))
}
const selectButton = (e) => {
    const changeTimer = (timer) => {
        clearInterval(timerId)
        startButton = timerButton.textContent = 'START'
        activeTimer = timer
        sound.pause()
        timeInMS = convertMinToMs(timer.time)
        setTime(timer.time)
    }
    if (!e.target.classList.contains('active')) {
        buttons.forEach(e => e.classList.remove('active'))
        e.target.classList.add('active')
    }
    if (e.target.classList[1] === 'pomodoroButton') {
        changeTimer(pomodoroTimer)
    } else if (e.target.classList[1] === 'shortBreakButton') {
        changeTimer(shortBreakTimer)
    } else {
        changeTimer(longBreakTimer)
    }
}

for (let button of buttons) {
    button.addEventListener("click", (e) => selectButton(e));
}
const sound = new Audio('assets/sound.mp3')
sound.preload = 'auto';


const convertMinToMs = (min) => min * 60 * 1000
let timeInMS = convertMinToMs(activeTimer.time)
let startButton = timerButton.textContent = 'START'
const setTime = (startedTime) => {
    let perc = Math.ceil(((startedTime * 60 * 1000) - timeInMS) / (startedTime * 60 * 1000) * 100)
    setProgress(perc)
    let minutes = Math.floor(timeInMS / 1000 / 60) % 60
    const seconds = Math.floor(timeInMS / 1000) % 60
    if (timeInMS === 3600000) {
        minutes = 60
    }
    divMinutes.textContent = minutes < 10 ? `0${minutes}` : minutes
    divSeconds.textContent = seconds < 10 ? `0${seconds}` : seconds
    if (timeInMS === 0) {
        startButton = timerButton.textContent = 'RESTART'
        sound.play();
        clearInterval(timerId)
        timeInMS = startedTime * 60 * 1000
    }
    timeInMS = timeInMS - 1000
}
setTime(activeTimer.time)
let timerId
const manageTimer = (timer) => {
    switch (startButton) {
        case 'START':
            if (timeInMS !== 0) {
                setTime(timer)
            }
            timerId = setInterval(() => setTime(timer), 1000)
            startButton = timerButton.textContent = 'PAUSE'
            break
        case 'PAUSE':
            clearInterval(timerId)
            startButton = timerButton.textContent = 'START'
            break
        case 'RESTART':
            sound.pause()
            setTime(timer)
            timerId = setInterval(() => setTime(timer), 1000)
            startButton = timerButton.textContent = 'PAUSE'
            break
    }
}
timerButton.addEventListener('click', () => manageTimer(activeTimer.time))