class TypingTest {
  constructor(string) {
    this.string = string
    this.elements = this.createElements()
    this.cursor = 0
  }

  createElements() {
    const test = document.getElementById("test-container")
    const elements = []

    for (let i = 0; i<this.string.length; i++) {
      const label = document.createElement("span")
      label.className = "test-char"
      label.innerHTML = this.string[i]
      test.appendChild(label)
      elements.push(label)
    }

    return elements
  }

  keydown(e) {
    switch (e.key) {
      case "Shift":
        break
      case "Backspace":
        if (this.cursor > 0) {
          this.cursor--
          this.elements[this.cursor].classList.remove("green")
          this.elements[this.cursor].classList.remove("red")
        }
        break
      default:
        if (this.cursor < this.elements.length) {
          if (e.key === this.elements[this.cursor].innerHTML) {
            this.elements[this.cursor].classList.add("green")
          } else {
            this.elements[this.cursor].classList.add("red")
          }
          this.cursor++
        }
        break
    }
  }
}

window.addEventListener("load",()=> {
  const test = new TypingTest("Hei mitt navn er sen og jeg liker boller!")
  
  function keydown(e) {
    test.keydown(e)
  }

  window.addEventListener("keydown", keydown)
})

