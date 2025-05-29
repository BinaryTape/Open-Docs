[//]: # (title: 기본 타입)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="첫 번째 단계" /> <a href="kotlin-tour-hello-world.md">Hello 월드</a><br />
        <img src="icon-2.svg" width="20" alt="두 번째 단계" /> <strong>기본 타입</strong><br />
        <img src="icon-3-todo.svg" width="20" alt="세 번째 단계" /> <a href="kotlin-tour-collections.md">컬렉션</a><br />
        <img src="icon-4-todo.svg" width="20" alt="네 번째 단계" /> <a href="kotlin-tour-control-flow.md">제어 흐름</a><br />
        <img src="icon-5-todo.svg" width="20" alt="다섯 번째 단계" /> <a href="kotlin-tour-functions.md">함수</a><br />
        <img src="icon-6-todo.svg" width="20" alt="여섯 번째 단계" /> <a href="kotlin-tour-classes.md">클래스</a><br />
        <img src="icon-7-todo.svg" width="20" alt="마지막 단계" /> <a href="kotlin-tour-null-safety.md">널 안정성</a></p>
</tldr>

Kotlin의 모든 변수와 데이터 구조는 타입을 가집니다. 타입은 컴파일러에게 해당 변수 또는 데이터 구조로 무엇을 할 수 있는지 알려주기 때문에 중요합니다. 즉, 어떤 함수와 속성을 가지고 있는지 알려줍니다.

지난 장에서 Kotlin은 이전 예시에서 `customers`가 [`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/) 타입을 가진다는 것을 알 수 있었습니다.
Kotlin이 타입을 **추론**하는 능력을 **타입 추론**이라고 합니다. `customers`에는 정수 값이 할당됩니다. 이를 통해 Kotlin은 `customers`가 숫자 타입인 `Int`를 가진다고 추론합니다. 그 결과, 컴파일러는 `customers`로 산술 연산을 수행할 수 있음을 알게 됩니다:

```kotlin
fun main() {
//sampleStart
    var customers = 10

    // Some customers leave the queue
    customers = 8

    customers = customers + 3 // Example of addition: 11
    customers += 7            // Example of addition: 18
    customers -= 3            // Example of subtraction: 15
    customers *= 2            // Example of multiplication: 30
    customers /= 3            // Example of division: 10

    println(customers) // 10
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-basic-types-arithmetic"}

> `+=`, `-=`, `*=`, `/=`, `%=`는 복합 할당 연산자입니다. 더 자세한 내용은 [복합 할당](operator-overloading.md#augmented-assignments)을 참조하세요.
> 
{style="tip"}

Kotlin에는 다음과 같은 기본 타입이 있습니다:

| **범주**           | **기본 타입**                    | **예시 코드**                                              |
|------------------------|------------------------------------|---------------------------------------------------------------|
| 정수               | `Byte`, `Short`, `Int`, `Long`     | `val year: Int = 2020`                                        |
| 부호 없는 정수      | `UByte`, `UShort`, `UInt`, `ULong` | `val score: UInt = 100u`                                      |
| 부동 소수점 숫자 | `Float`, `Double`                  | `val currentTemp: Float = 24.5f`, `val price: Double = 19.99` |
| 불리언               | `Boolean`                          | `val isEnabled: Boolean = true`                               |
| 문자             | `Char`                             | `val separator: Char = ','`                                   |
| 문자열               | `String`                           | `val message: String = "Hello, world!"`                       |

기본 타입 및 해당 속성에 대한 자세한 내용은 [기본 타입](basic-types.md)을 참조하세요.

이 지식을 바탕으로 변수를 선언하고 나중에 초기화할 수 있습니다. Kotlin은 변수가 처음 읽히기 전에 초기화되기만 하면 이를 처리할 수 있습니다.

변수를 초기화하지 않고 선언하려면 `:`를 사용하여 타입을 지정합니다. 예를 들어:

```kotlin
fun main() {
//sampleStart
    // Variable declared without initialization
    val d: Int
    // Variable initialized
    d = 3

    // Variable explicitly typed and initialized
    val e: String = "hello"

    // Variables can be read because they have been initialized
    println(d) // 3
    println(e) // hello
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-basic-types-initialization"}

변수를 읽기 전에 초기화하지 않으면 오류가 발생합니다:

```kotlin
fun main() {
//sampleStart
    // Variable declared without initialization
    val d: Int
    
    // Triggers an error
    println(d)
    // Variable 'd' must be initialized
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-basic-types-no-initialization" validate="false"}

이제 기본 타입을 선언하는 방법을 알았으니, [컬렉션](kotlin-tour-collections.md)에 대해 알아볼 시간입니다.

## 연습

### 연습 {initial-collapse-state="collapsed" collapsible="true"}

각 변수에 올바른 타입을 명시적으로 선언하세요:

|---|---|
```kotlin
fun main() {
    val a: Int = 1000 
    val b = "log message"
    val c = 3.14
    val d = 100_000_000_000_000
    val e = false
    val f = '
'
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-basic-types-exercise"}

|---|---|
```kotlin
fun main() {
    val a: Int = 1000
    val b: String = "log message"
    val c: Double = 3.14
    val d: Long = 100_000_000_000_000
    val e: Boolean = false
    val f: Char = '
'
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 해답" id="kotlin-tour-basic-types-solution"}

## 다음 단계

[컬렉션](kotlin-tour-collections.md)