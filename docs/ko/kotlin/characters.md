[//]: # (title: 문자)

문자는 `Char` 타입으로 표현됩니다.
문자 리터럴은 작은따옴표로 묶습니다: `'1'`.

> JVM에서는 `char` 기본 타입으로 저장된 문자는 16비트 유니코드 문자를 나타냅니다.
>
{style="note"}

특수 문자는 이스케이프 백슬래시 `\`로 시작합니다.
다음 이스케이프 시퀀스를 지원합니다:

*   `\t` – 탭
*   `\b` – 백스페이스
*   `
` – 새 줄 (LF)
*   `\r` – 캐리지 리턴 (CR)
*   `\'` – 작은따옴표
*   `\"` – 큰따옴표
*   `\\` – 백슬래시
*   `\$` – 달러 기호

다른 문자를 인코딩하려면 유니코드 이스케이프 시퀀스 문법을 사용합니다: `'\uFF00'`.

```kotlin
fun main() {
//sampleStart
    val aChar: Char = 'a'
 
    println(aChar)
    println('
') // 추가 줄 바꿈 문자를 출력합니다.
    println('\uFF00')
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

문자 변수의 값이 숫자인 경우, [`digitToInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/digit-to-int.html) 함수를 사용하여 `Int` 숫자로 명시적으로 변환할 수 있습니다.

> JVM에서는 널러블 참조가 필요한 경우, 문자는 [숫자](numbers.md#boxing-and-caching-numbers-on-the-java-virtual-machine)와 마찬가지로 자바 클래스로 박싱됩니다.
> 식별성은 박싱 연산으로 보존되지 않습니다.
>
{style="note"}