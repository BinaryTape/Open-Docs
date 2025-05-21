---
title: "기본 자료형"
---
<no-index/>
:::info
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-hello-world">Hello world</a><br />
        <img src="/img/icon-2.svg" width="20" alt="Second step" /> <strong>Basic types (기본 자료형)</strong><br />
        <img src="/img/icon-3-todo.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections">Collections</a><br />
        <img src="/img/icon-4-todo.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-control-flow">Control flow</a><br />
        <img src="/img/icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-functions">Functions</a><br />
        <img src="/img/icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-classes">Classes</a><br />
        <img src="/img/icon-7-todo.svg" width="20" alt="Final step" /> <a href="kotlin-tour-null-safety">Null safety</a>
</p>

:::

Kotlin의 모든 변수와 데이터 구조에는 유형이 있습니다. 유형은 컴파일러에게 해당 변수 또는 데이터 구조로 무엇을 할 수 있는지 알려주기 때문에 중요합니다. 즉, 어떤 함수와 속성을 가지고 있는지 알려줍니다.

지난 장에서 Kotlin은 이전 예제에서 `customers`의 유형이 [`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/)임을 알 수 있었습니다.
유형을 **추론**하는 Kotlin의 능력을 **타입 추론 (type inference)**이라고 합니다. `customers`에는 정수 값이 할당됩니다.
여기에서 Kotlin은 `customers`가 숫자 유형 `Int`를 갖는다고 추론합니다. 결과적으로 컴파일러는 `customers`로 산술 연산을 수행할 수 있음을 알고 있습니다.

```kotlin
fun main() {

    var customers = 10

    // Some customers leave the queue
    customers = 8

    customers = customers + 3 // Example of addition: 11
    customers += 7            // Example of addition: 18
    customers -= 3            // Example of subtraction: 15
    customers *= 2            // Example of multiplication: 30
    customers /= 3            // Example of division: 10

    println(customers) // 10

}
```

:::tip
`+=`, `-=`, `*=`, `/=`, 및 `%=`는 augmented assignment operators (확대 할당 연산자)입니다. 자세한 내용은 [Augmented assignments](operator-overloading#augmented-assignments)를 참조하세요.

:::

전반적으로 Kotlin에는 다음과 같은 기본 유형이 있습니다.

| **Category**           | **Basic types**                    | **Example code**                                              |
|------------------------|------------------------------------|---------------------------------------------------------------|
| Integers (정수)              | `Byte`, `Short`, `Int`, `Long`     | `val year: Int = 2020`                                        |
| Unsigned integers (부호 없는 정수)      | `UByte`, `UShort`, `UInt`, `ULong` | `val score: UInt = 100u`                                      |
| Floating-point numbers (부동 소수점 숫자) | `Float`, `Double`                  | `val currentTemp: Float = 24.5f`, `val price: Double = 19.99` |
| Booleans (부울)               | `Boolean`                          | `val isEnabled: Boolean = true`                               |
| Characters (문자)             | `Char`                             | `val separator: Char = ','`                                   |
| Strings (문자열)                | `String`                           | `val message: String = "Hello, world!"`                       |

기본 유형 및 해당 속성에 대한 자세한 내용은 [Basic types](basic-types)를 참조하세요.

이 지식을 바탕으로 변수를 선언하고 나중에 초기화할 수 있습니다. Kotlin은 변수가 처음 읽기 전에 초기화되는 한 이를 관리할 수 있습니다.

초기화하지 않고 변수를 선언하려면 `:`로 유형을 지정합니다. 예시:

```kotlin
fun main() {

    // Variable declared without initialization
    val d: Int
    // Variable initialized
    d = 3

    // Variable explicitly typed and initialized
    val e: String = "hello"

    // Variables can be read because they have been initialized
    println(d) // 3
    println(e) // hello

}
```

변수를 읽기 전에 초기화하지 않으면 오류가 표시됩니다.

```kotlin
fun main() {

    // Variable declared without initialization
    val d: Int
    
    // Triggers an error
    println(d)
    // Variable 'd' must be initialized

}
```

이제 기본 유형을 선언하는 방법을 알았으니 [collections](kotlin-tour-collections)에 대해 알아볼 시간입니다.

## Practice

### Exercise 

각 변수에 대해 올바른 유형을 명시적으로 선언하십시오.

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

## Next step

[Collections](kotlin-tour-collections)