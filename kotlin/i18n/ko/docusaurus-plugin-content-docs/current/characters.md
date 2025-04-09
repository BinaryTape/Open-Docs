---
title: 캐릭터
---
문자는 `Char` 타입으로 표현됩니다.
문자 리터럴은 작은 따옴표 안에 넣습니다: `'1'`.

:::note
JVM에서 primitive 타입인 `char`로 저장되는 문자는 16비트 유니코드 문자를 나타냅니다.

:::

특수 문자는 이스케이프 백슬래시 `\`로 시작합니다.
다음 이스케이프 시퀀스가 지원됩니다.

* `\t` – tab
* `\b` – backspace
* `
` – new line (LF)
* `\r` – carriage return (CR)
* `\'` – single quotation mark
* `\"` – double quotation mark
* `\\` – backslash
* `\

   – dollar sign

다른 문자를 인코딩하려면 유니코드 이스케이프 시퀀스 구문인 `'\uFF00'`을 사용하십시오.

```kotlin
fun main() {

    val aChar: Char = 'a'
 
    println(aChar)
    println('
') // Prints an extra newline character
    println('\uFF00')

}
```

문자 변수의 값이 숫자이면 [`digitToInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/digit-to-int.html) 함수를 사용하여 명시적으로 `Int` 숫자로 변환할 수 있습니다.

:::note
JVM에서는 [numbers](numbers#boxing-and-caching-numbers-on-the-java-virtual-machine)에서와 마찬가지로 nullable 참조가 필요한 경우 문자는 Java 클래스에 boxing됩니다.
boxing 작업으로 ID가 유지되지는 않습니다.

:::