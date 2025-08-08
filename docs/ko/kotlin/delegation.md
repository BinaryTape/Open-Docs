[//]: # (title: 위임)

[위임 패턴(Delegation pattern)](https://en.wikipedia.org/wiki/Delegation_pattern)은 구현 상속(implementation inheritance)에 대한 좋은 대안임이 입증되었으며, Kotlin은 상용구 코드(boilerplate code)가 전혀 필요 없이 이를 기본적으로 지원합니다.

`Derived` 클래스는 모든 퍼블릭 멤버를 지정된 객체에 위임하여 `Base` 인터페이스를 구현할 수 있습니다.

```kotlin
interface Base {
    fun print()
}

class BaseImpl(val x: Int) : Base {
    override fun print() { print(x) }
}

class Derived(b: Base) : Base by b

fun main() {
    val base = BaseImpl(10)
    Derived(base).print()
}
```
{kotlin-runnable="true"}

`Derived`의 슈퍼타입 목록에 있는 `by` 절은 `b`가 `Derived` 객체 내부에 내부적으로 저장되며 컴파일러가 `Base`의 모든 메서드를 `b`로 전달하도록 생성한다는 것을 나타냅니다.

## 위임으로 구현된 인터페이스 멤버 오버라이드하기

[오버라이드(Overrides)](inheritance.md#overriding-methods)는 예상대로 작동합니다. 컴파일러는 위임 객체에 있는 구현 대신 사용자의 `override` 구현을 사용합니다. 만약 `Derived`에 `override fun printMessage() { print("abc") }`를 추가한다면, `printMessage`가 호출될 때 프로그램은 `10` 대신 *abc*를 출력할 것입니다.

```kotlin
interface Base {
    fun printMessage()
    fun printMessageLine()
}

class BaseImpl(val x: Int) : Base {
    override fun printMessage() { print(x) }
    override fun printMessageLine() { println(x) }
}

class Derived(b: Base) : Base by b {
    override fun printMessage() { print("abc") }
}

fun main() {
    val base = BaseImpl(10)
    Derived(base).printMessage()
    Derived(base).printMessageLine()
}
```
{kotlin-runnable="true"}

그러나 이러한 방식으로 오버라이드된 멤버는 위임 객체의 멤버로부터 호출되지 않는다는 점에 유의하십시오. 위임 객체는 인터페이스 멤버에 대한 자체 구현에만 접근할 수 있기 때문입니다.

```kotlin
interface Base {
    val message: String
    fun print()
}

class BaseImpl(x: Int) : Base {
    override val message = "BaseImpl: x = $x"
    override fun print() { println(message) }
}

class Derived(b: Base) : Base by b {
    // This property is not accessed from b's implementation of `print`
    override val message = "Message of Derived"
}

fun main() {
    val b = BaseImpl(10)
    val derived = Derived(b)
    derived.print()
    println(derived.message)
}
```
{kotlin-runnable="true"}

[위임된 프로퍼티](delegated-properties.md)에 대해 더 알아보세요.