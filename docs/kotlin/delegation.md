[//]: # (title: 委托)

[委托模式](https://en.wikipedia.org/wiki/Delegation_pattern)已被证明是实现继承的一种良好替代方案，Kotlin 原生支持它，无需任何样板代码。

一个 `Derived` 类可以通过将其所有公共成员委托给一个指定对象来 [实现](delegation.md#overriding-a-member-of-an-interface-implemented-by-delegation) 一个 `Base` 接口：

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

`Derived` 的超类型列表中的 `by` 表达式表示 `b` 将被内部存储在 `Derived` 的对象中，并且编译器将生成所有转发给 `b` 的 `Base` 方法。

## 覆盖通过委托实现的接口成员

[覆盖](inheritance.md#overriding-methods) 会按预期工作：编译器将使用你的 `override` 实现，而不是委托对象中的实现。如果你想向 `Derived` 添加 `override fun printMessage() { print("abc") }`，那么当调用 `printMessage` 时，程序将打印 *abc* 而非 *10*：

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

然而，请注意，以这种方式覆盖的成员不会从委托对象的成员中调用，委托对象只能访问其自身对接口成员的实现：

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
    // 此属性不会从 b 对 `print` 的实现中访问
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

了解更多关于 [委托属性](delegated-properties.md) 的信息。