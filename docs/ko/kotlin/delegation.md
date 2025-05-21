---
title: 위임
---
[위임 패턴](https://en.wikipedia.org/wiki/Delegation_pattern)은 구현 상속에 대한 좋은 대안으로 입증되었으며, Kotlin은 상용구 코드가 전혀 필요 없이 이를 기본적으로 지원합니다.

`Derived` 클래스는 모든 public 멤버를 지정된 객체에 위임하여 `Base` 인터페이스를 구현할 수 있습니다.

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

`Derived`에 대한 슈퍼타입 목록의 `by`절은 `b`가 `Derived` 객체 내부에 저장되고 컴파일러가 `b`로 전달되는 `Base`의 모든 메서드를 생성함을 나타냅니다.

## 위임으로 구현된 인터페이스의 멤버 오버라이드

[Overrides](inheritance#overriding-methods)는 예상대로 작동합니다. 컴파일러는 delegate 객체의 구현 대신 사용자의 `override` 구현을 사용합니다. `override fun printMessage() { print("abc") }`를 `Derived`에 추가하면 `printMessage`가 호출될 때 프로그램은 *10* 대신 *abc*를 출력합니다.

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

그러나 이러한 방식으로 오버라이드된 멤버는 delegate 객체의 멤버에서 호출되지 않으며 인터페이스 멤버의 자체 구현에만 접근할 수 있습니다.

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

[위임된 프로퍼티](delegated-properties)에 대해 자세히 알아보세요.