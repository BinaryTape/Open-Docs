[//]: # (title: 불리언(Booleans))

`Boolean` 타입은 `true`와 `false`라는 두 가지 값을 가질 수 있는 불리언 객체를 나타냅니다.
`Boolean`은 `Boolean?`으로 선언되는 [널 허용(nullable)](null-safety.md) 버전을 가지고 있습니다.

> JVM에서 기본(primitive) `boolean` 타입으로 저장되는 불리언은 보통 8비트를 사용합니다.
>
{style="note"}

불리언에 대한 내장 연산은 다음과 같습니다:

* `||` – 논리합 (논리적 _OR_)
* `&&` – 논리곱 (논리적 _AND_)
* `!` – 부정 (논리적 _NOT_)

예를 들어:

```kotlin
fun main() {
//sampleStart
    val myTrue: Boolean = true
    val myFalse: Boolean = false
    val boolNull: Boolean? = null

    println(myTrue || myFalse)
    // true
    println(myTrue && myFalse)
    // false
    println(!myTrue)
    // false
    println(boolNull)
    // null
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`||` 및 `&&` 연산자는 지연 평가(lazily) 방식으로 작동하며, 이는 다음을 의미합니다:

* 첫 번째 피연산자가 `true`이면, `||` 연산자는 두 번째 피연산자를 평가하지 않습니다.
* 첫 번째 피연산자가 `false`이면, `&&` 연산자는 두 번째 피연산자를 평가하지 않습니다.

> JVM에서 불리언 객체에 대한 널 허용 참조는 [숫자](numbers.md#boxing-and-caching-numbers-on-the-java-virtual-machine)와 마찬가지로 Java 클래스에 박싱(boxed)됩니다.
>
{style="note"}