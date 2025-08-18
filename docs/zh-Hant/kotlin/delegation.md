[//]: # (title: 委託)

[委託模式](https://en.wikipedia.org/wiki/Delegation_pattern) 已被證明是實作繼承的一個良好替代方案，Kotlin 原生支援此模式，無需任何樣板程式碼。

類別 `Derived` 可以透過將其所有公開成員委託給一個指定物件來實作介面 `Base`：

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

`Derived` 的超類型列表中的 `by` 子句表示 `b` 將在 `Derived` 的物件內部儲存，且編譯器會產生所有將 `Base` 的方法轉發給 `b` 的程式碼。

## 覆寫透過委託實作的介面成員

[覆寫](inheritance.md#overriding-methods) 如你所預期地運作：編譯器將使用你的 `override` 實作，而非委託物件中的實作。如果你想將 `override fun printMessage() { print("abc") }` 加入 `Derived`，當呼叫 `printMessage` 時，程式將印出 *abc* 而非 *10*：

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

然而請注意，以此方式覆寫的成員不會被委託物件的成員呼叫，因為委託物件只能存取其自身對介面成員的實作：

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

深入了解 [委託屬性](delegated-properties.md)。