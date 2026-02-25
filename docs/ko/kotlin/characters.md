[//]: # (title: 문자)

문자는 `Char` 타입으로 표현됩니다.
문자 리터럴은 작은따옴표로 감쌉니다: `'1'`.

> JVM에서 기본 타입(primitive type)인 `char`로 저장된 문자는 16비트 유니코드 문자를 나타냅니다.
>
{style="note"}

특수 문자는 이스케이프 백슬래시 `\`로 시작합니다.
다음과 같은 이스케이프 시퀀스(escape sequences)를 지원합니다: 

* `\t` – 탭
* `\b` – 백스페이스
* `
` – 새 줄 (LF)
* `\r` – 캐리지 리턴 (CR)
* `\'` – 작은따옴표
* `\"` – 큰따옴표
* `\\` – 백슬래시
* `\$` – 달러 기호

다른 문자를 인코딩하려면 유니코드 이스케이프 시퀀스 구문인 `'\uFF00'`을 사용하세요.

```kotlin
fun main() {
//sampleStart
    val aChar: Char = 'a'
 
    println(aChar)
    println('
') // 추가 줄바꿈 문자를 출력합니다
    println('\uFF00')
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

문자 변수의 값이 숫자인 경우, [`digitToInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/digit-to-int.html) 함수를 사용하여 명시적으로 `Int` 숫자로 변환할 수 있습니다.

> JVM에서 문자는 [숫자](numbers.md#boxing-and-caching-numbers-on-the-java-virtual-machine)와 마찬가지로 널 허용 참조(nullable reference)가 필요할 때 Java 클래스에 박싱(boxing)됩니다. 박싱 연산 시 동일성(identity)은 보존되지 않습니다.
>
{style="note"}