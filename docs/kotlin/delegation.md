---
title: 委托
---
[委托模式 (Delegation pattern)](https://en.wikipedia.org/wiki/Delegation_pattern) 已被证明是实现继承的一个很好的替代方案，Kotlin 原生支持它，无需任何样板代码。

类 `Derived` 可以通过将其所有公共成员委托给指定的对象来实现接口 `Base`：

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

`Derived` 的超类型列表中的 `by` 子句表明 `b` 将在 `Derived` 对象内部存储，并且编译器将生成 `Base` 的所有方法，这些方法将转发到 `b`。

## 重写通过委托实现的接口的成员

[重写 (Overrides)](inheritance#overriding-methods) 的工作方式符合您的预期：编译器将使用您的 `override` 实现，而不是委托对象中的实现。 如果您想将 `override fun printMessage() { print("abc") }` 添加到 `Derived`，则当调用 `printMessage` 时，程序将打印 *abc* 而不是 *10*：

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

但是请注意，以这种方式重写的成员不会从委托对象的成员中调用，委托对象只能访问其自身对接口成员的实现：

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

了解更多关于[委托属性 (delegated properties)](delegated-properties)的信息。