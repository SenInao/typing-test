class Char {
  constructor(c, el, test) {
    this.test = test
    this.el = el
    this.c = c
    this.typed = false
    this.typedFalse = false
  } 

  type(c) {
    if (c === this.c) {
      if (!this.typedFalse) {
        this.el.classList.add("green")
      } else {
        this.test.false--
        this.test.totalFalse++
        this.el.classList.add("yellow")
      }
    } else {
      this.test.false++
      this.test.totalFalse++
      this.typedFalse = true
      this.el.classList.add("red")
    }
    this.typed = true
    this.removeUnderline()
  }

  goBack() {
    if (this.typedFalse) {
      this.test.totalFalse--
    }
    this.el.classList.remove("red")
    this.el.classList.remove("yellow")
    this.el.classList.remove("green")
    this.underline()
  }

  underline() {
    this.el.classList.add("underline")
  }

  removeUnderline() {
    this.el.classList.remove("underline")
  }
}

class TypingTest {
  constructor(string) {
    this.string = string
    this.elements = this.createElements()
    this.cursor = 0
    this.false = 0
    this.totalFalse = 0
    this.line = 0

    this.time = 0
    this.timerId = null
    this.timerEl = document.getElementById("timer")

    this.wpm = 0
    this.wpmEl = document.getElementById("wpm")

    this.accuracy = 0
    this.accuracyEl = document.getElementById("accuracy")

    this.charsInWidth = Math.round(document.getElementById("test-container").offsetWidth/35)
    console.log(this.charsInWidth)
  }

  updateWpm() {
    this.wpm = (((this.cursor+1-this.false)/5)/(this.time/60))
    this.wpmEl.innerHTML = "WPM: "+Math.round(this.wpm)
  }

  updateAccuracy() {
    this.accuracy = (this.cursor+1-this.totalFalse)/(this.cursor+1)*100
    this.accuracyEl.innerHTML = "Accuracy: "+Math.round(this.accuracy)+"%"
  }

  startTimer() {
    this.timerId = setInterval(()=>{
      this.time++

      let mins = Math.floor(this.time/60)
      let secs = this.time - mins*60

      if (mins.toString().length < 2) {
        mins = "0"+mins
      }
      if (secs.toString().length < 2) {
        secs = "0"+secs
      }

      this.timerEl.innerHTML = "Time: "+mins+":"+secs

      this.updateWpm()
      this.updateAccuracy()
    }, 1000)
  }

  stopTimer() {
    clearInterval(this.timerId)
    this.timerId = null
  }

  createElements() {
    const test = document.getElementById("test-container")
    const elements = []

    for (let i = 0; i<this.string.length; i++) {
      const label = document.createElement("span")
      label.className = "test-char"
      label.innerHTML = this.string[i]
      let char = new Char(this.string[i], label, this)
      test.appendChild(label)
      elements.push(char)
    }

    elements[0].underline()
    return elements
  }

  keydown(e) {
    if (!this.timerId) {
      this.startTimer()
    }
    switch (e.key) {
      case "Shift":
        break
      case "Backspace":
        if (this.cursor > 0) {
          this.elements[this.cursor].removeUnderline()
          this.cursor--
          this.elements[this.cursor].goBack()
        }
        break
      default:
        if (e.repeat) break
        if (this.cursor < this.elements.length) {
          this.elements[this.cursor].type(e.key)
          this.cursor++
          this.elements[this.cursor].underline()
        }
        break
    }

    console.log(this.cursor, this.charsInWidth, this.line)
    if (this.charsInWidth*(2+this.line) === this.cursor) {
      const el = document.getElementById("test-container")
      el.scrollBy(0, 47)
      this.line++
    }

    this.updateWpm()
    this.updateAccuracy()
  }
}

window.addEventListener("load",()=> {
  let string = "Filler string"
  fetch("/api/test-words")
    .then(response => response.json())
    .then(data => {
      string = data.string
    }).finally(()=>{
      const test = new TypingTest(string)
      window.addEventListener("keydown", e=>{test.keydown(e)})
    })
})

