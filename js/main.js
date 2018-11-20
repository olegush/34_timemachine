var TIMEOUT_IN_SECS = 3 * 60
var TIMEOUT_MESSAGES_IN_SECS = 30
var TEMPLATE = '<h1><span class="js-timer-minutes">00</span>:<span class="js-timer-seconds">00</span></h1>'

function padZero(number) {
    return ("00" + String(number)).slice(-2);
}

class Timer {
    // IE does not support new style classes yet
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
    constructor(timeout_in_secs) {
        this.initial_timeout_in_secs = timeout_in_secs
        this.reset()
    }
    getTimestampInSecs() {
        var timestampInMilliseconds = new Date().getTime()
        return Math.round(timestampInMilliseconds / 1000)
    }
    start() {
        if (this.isRunning)
            return
        this.timestampOnStart = this.getTimestampInSecs()
        this.isRunning = true
    }
    stop() {
        if (!this.isRunning)
            return
        this.timeout_in_secs = this.calculateSecsLeft()
        this.timestampOnStart = null
        this.isRunning = false
    }
    reset(timeout_in_secs) {
        this.isRunning = false
        this.timestampOnStart = null
        this.timeout_in_secs = this.initial_timeout_in_secs

    }
    calculateSecsLeft() {
        if (!this.isRunning)
            return this.timeout_in_secs
        var currentTimestamp = this.getTimestampInSecs()
        var secsGone = currentTimestamp - this.timestampOnStart
        return Math.max(this.timeout_in_secs - secsGone, 0)
    }
}

class TimerWidget {
    // IE does not support new style classes yet
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
    construct() {
        this.timerContainer = this.minutes_element = this.seconds_element = null
    }
    mount(rootTag) {
        if (this.timerContainer)
            this.unmount()

        // adds HTML tag to current page
        this.timerContainer = document.createElement('div')

        document.body.setAttribute("style", "margin-top: 25px;")
        this.timerContainer.setAttribute("style", "width:50px; height: 35px; padding-left: 30px; margin-top: -10px; font-size: 8px; background-color: #FFFFFF; color: #d93025; position: fixed; top: 0; left: 0; z-index: 1000;")
        this.timerContainer.innerHTML = TEMPLATE

        rootTag.insertBefore(this.timerContainer, rootTag.firstChild)

        this.minutes_element = this.timerContainer.getElementsByClassName('js-timer-minutes')[0]
        this.seconds_element = this.timerContainer.getElementsByClassName('js-timer-seconds')[0]
    }
    update(secsLeft) {
        var minutes = Math.floor(secsLeft / 60);
        var seconds = secsLeft - minutes * 60;

        this.minutes_element.innerHTML = padZero(minutes)
        this.seconds_element.innerHTML = padZero(seconds)
    }
    unmount() {
        if (!this.timerContainer)
            return
        this.timerContainer.remove()
        this.timerContainer = this.minutes_element = this.seconds_element = null
    }
}


function main() {
    var timer = new Timer(TIMEOUT_IN_SECS)
    var timerWiget = new TimerWidget()
    var intervalId = null
    timerWiget.mount(document.body)


    function handleIntervalTick() {
        var secsLeft = timer.calculateSecsLeft()
        timerWiget.update(secsLeft)
    }


    function handleVisibilityChange() {
        if (document.hidden) {
            timer.stop()
            clearInterval(intervalId)
            intervalId = null
        } else {
            timer.start()
            intervalId = intervalId || setInterval(handleIntervalTick, 300)
        }
    }



    function check_timer() {
        if (timer.calculateSecsLeft() == 0) {
            clearInterval(intervalIdCheck)
            alert_messages()
        }
    }



    function alert_messages() {
        var timer_msg = new Timer(TIMEOUT_MESSAGES_IN_SECS)
        var intervalIdmsg = null
        var messages = ['Ну наконец-то пришла пора поработать!', 'Хабр прекрасен, спору нет, но работа стоит', 'И вот твой таймер-друг напоминает о необходимости переключиться с потребления на созидание', 'Эти нули в углу своей как бы намекают о том, что ... ', 'Уверен, что не прокрастинируешь? Или нет? В любом случае только ты знаешь, что делать.', 'Ты кнопку OK нажми, а потом "Закрыть вкладку" и пусть не отвлекает тебя ничего больше от дела', 'Хоть работа в лес не убежит, а волка-то ноги кормят.'];


        function handleIntervalTickMsg() {
            var secsLeftMsg = timer_msg.calculateSecsLeft()
            if (secsLeftMsg === 0) {
                alert(messages[Math.floor(Math.random() * messages.length)])
                timer_msg.reset(TIMEOUT_MESSAGES_IN_SECS)
                timer_msg.start()
            }

        }


        function handleVisibilityChangeMsg() {
            if (document.hidden) {
                timer_msg.stop()
                clearInterval(intervalIdmsg)
                intervalIdmsg = null
            } else {
                timer_msg.start()
                intervalIdmsg = intervalIdmsg || setInterval(handleIntervalTickMsg, 300)
            }
        }


        document.addEventListener("visibilitychange", handleVisibilityChangeMsg, false);
        handleVisibilityChangeMsg()
    }


    document.addEventListener("visibilitychange", handleVisibilityChange, false);
    handleVisibilityChange()
    intervalIdCheck = setInterval(check_timer, 300)


}



if (document.readyState === "complete" || document.readyState === "loaded") {
    main();

} else {
    // initialize timer when page ready for presentation
    window.addEventListener('DOMContentLoaded', main);
}
