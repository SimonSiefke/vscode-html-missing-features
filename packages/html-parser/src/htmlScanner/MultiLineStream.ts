const whitespaceMap = {
  ' ': true,
  '\n': true,
  '\t': true,
  '\f': true,
  '\r': true,
}

function isWhitespace(char: string): boolean {
  return char in whitespaceMap
}

export class MultiLineStream {
  public position: number

  private source: string

  private length: number

  constructor(source: string, position: number) {
    this.source = source
    this.length = source.length
    this.position = position
  }

  public eos(): boolean {
    return this.length <= this.position
  }

  public getSource(): string {
    return this.source
  }

  public goTo(position: number): void {
    this.position = position
  }

  public goBack(n: number): void {
    this.position -= n
  }

  public advance(n: number): void {
    this.position += n
  }

  public goToEnd(): void {
    this.position = this.source.length
  }

  public raceBackUntilChars(firstChar: string, secondChar: string): string {
    this.position--
    while (
      this.position >= 0 &&
      this.source[this.position] !== firstChar &&
      this.source[this.position] !== secondChar
    ) {
      this.position--
    }
    this.position++
    if (this.position === 0) {
      return ''
    }
    return this.source[this.position - 1]
  }

  public goBackToUntilChar(char: string): void {
    while (this.position >= 0 && this.source[this.position] !== char) {
      this.position--
    }
    this.position++
  }
  public goBackToUntilChars(chars: string): void {
    const reversedChars = chars
      .split('')
      .reverse()
      .join('')
    outer: while (this.position >= 0) {
      for (let i = 0; i < reversedChars.length; i++) {
        if (this.source[this.position - i] !== reversedChars[i]) {
          this.position--
          continue outer
        }
      }
      break
    }
    this.position++
  }

  public goBackToUntilEitherChar(...chars: string[]): void {
    while (this.position >= 0 && !chars.includes(this.source[this.position])) {
      // console.log('minus')
      this.position--
    }
    // console.log(chars)
    // console.log(this.position)
    // console.log(this.source[this.position])
    // console.log(!chars.includes(this.source[this.position]))
    // console.log(this.position >= 0)
    // console.log('plus')
    this.position++
  }
  public advanceUntilEitherChar(...chars: string[]): void {
    while (
      this.position < this.source.length &&
      !chars.includes(this.source[this.position])
    ) {
      this.position++
    }
    // this.position--
  }

  public peekLeft(n: number = 0): string {
    return this.source[this.position - n]
  }

  public currentlyEndsWith(chars: string): boolean {
    for (let i = 0; i < chars.length; i++) {
      if (this.source[this.position - i - 1] !== chars[chars.length - 1 - i]) {
        return false
      }
    }
    return true
  }

  public currentlyEndsWithRegex(regex: RegExp): boolean {
    return regex.test(this.source.slice(0, this.position))
  }

  public previousChar(): string {
    return this.source[this.position]
  }
  public previousChars(n: number): string {
    return this.source.slice(this.position - n, this.position)
  }

  public nextChar(): string {
    return this.source[this.position + 1]
  }

  public nextChars(n: number): string {
    return this.source.slice(this.position, this.position + n)
  }

  public peekRight(n: number = 0): string {
    return this.source[this.position + n] || ''
  }

  public advanceIfChar(ch: string): boolean {
    if (ch === this.source[this.position]) {
      this.position++
      return true
    }
    return false
  }

  public advanceIfChars(ch: string): boolean {
    if (this.position + ch.length > this.source.length) {
      return false
    }
    for (let i = 0; i < ch.length; i++) {
      if (this.source[this.position + i] !== ch[i]) {
        return false
      }
    }
    this.advance(ch.length)
    return true
  }

  public advanceIfRegExp(regex: RegExp): string | undefined {
    const str = this.source.substr(this.position)
    const match = str.match(regex)
    if (match) {
      this.position = this.position + match.index + match[0].length
      return match[0]
    }
    return undefined
  }

  public advanceUntilRegExp(regex: RegExp): string | undefined {
    const str = this.source.substr(this.position)
    const match = str.match(regex)
    if (match) {
      this.position = this.position + match.index
      return match[0]
    }
    this.goToEnd()

    return undefined
  }

  public advanceUntilChar(ch: string): boolean {
    while (this.position < this.source.length) {
      if (this.source[this.position] === ch) {
        return true
      }
      this.advance(1)
    }
    return false
  }

  public advanceUntilChars(ch: string): boolean {
    while (this.position + ch.length <= this.source.length) {
      let i = 0
      while (i < ch.length && this.source[this.position + i] === ch[i]) {
        i++
      }
      if (i === ch.length) {
        return true
      }
      this.advance(1)
    }
    this.goToEnd()
    return false
  }

  public skipWhitespace(): boolean {
    const initialPosition = this.position
    while (
      this.position < this.length &&
      isWhitespace(this.source[this.position])
    ) {
      this.position++
    }
    return this.position - initialPosition > 0
  }
}
