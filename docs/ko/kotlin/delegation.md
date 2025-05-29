[//]: # (title: 위임)

[위임 패턴(Delegation pattern)](https://en.wikipedia.org/wiki/Delegation_pattern)은 구현 상속의 좋은 대안임이 입증되었으며, 코틀린은 불필요한 상용구 코드 없이 이를 기본적으로 지원합니다.

`Derived` 클래스는 모든 공개 멤버를 지정된 객체에 위임함으로써 `Base` 인터페이스를 구현할 수 있습니다:

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

`Derived`의 상위 타입 목록에 있는 `by` 절은 `b`가 `Derived` 객체 내부에 저장되며, 컴파일러가 `b`로 전달되는 `Base`의 모든 메서드를 생성함을 나타냅니다.

## 위임을 통해 구현된 인터페이스 멤버 재정의

[재정의](inheritance.md#overriding-methods)는 예상대로 작동합니다. 컴파일러는 위임 객체에 있는 구현 대신 사용자가 `override`한 구현을 사용합니다. `override fun printMessage() { print("abc") }`를 `Derived`에 추가하면, `printMessage`가 호출될 때 프로그램은 *10* 대신 *abc*를 출력할 것입니다:

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

하지만 이런 식으로 재정의된 멤버는 위임 객체의 멤버로부터 호출되지 않는다는 점에 유의하십시오. 위임 객체의 멤버는 인터페이스 멤버의 자체 구현에만 접근할 수 있습니다:

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

[위임 프로퍼티](delegated-properties.md)에 대해 더 알아보세요.