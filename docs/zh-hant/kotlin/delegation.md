---
title: "委派 (Delegation)"
---
[委託模式 (Delegation pattern)](https://en.wikipedia.org/wiki/Delegation_pattern) 已被證明是實作繼承 (implementation inheritance) 的一個良好替代方案，而 Kotlin 原生支援它，無需任何樣板程式碼 (boilerplate code)。

一個類別 `Derived` 可以透過將其所有 public 成員委託給指定的物件來實作介面 `Base`：

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

`Derived` 的 supertype 列表中的 `by` 子句表示 `b` 將在 `Derived` 的物件中被內部儲存，並且編譯器將產生所有轉發到 `b` 的 `Base` 方法。

## 覆寫由委託實作的介面成員

[覆寫 (Overrides)](inheritance#overriding-methods) 如您所預期的那樣工作：編譯器將使用您的 `override` 實作，而不是委託物件中的實作。 如果您想將 `override fun printMessage() { print("abc") }` 新增到 `Derived`，則當呼叫 `printMessage` 時，程式將印出 *abc* 而不是 *10*：

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

但請注意，以這種方式覆寫的成員不會從委託物件的成員中呼叫，委託物件只能存取其自身對介面成員的實作：

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

瞭解更多關於 [委託屬性 (delegated properties)](delegated-properties)。