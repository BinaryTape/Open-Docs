[//]: # (title: 委派)

[委派模式](https://en.wikipedia.org/wiki/Delegation_pattern)已被證明是實作繼承的一個良好替代方案，而 Kotlin 原生支援此模式，無需任何樣板程式碼。

`Derived` 類別可以透過將其所有公開成員委派給指定物件來實作 `Base` 介面：

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

`Derived` 類別父類型列表中的 `by` 子句表示 `b` 將會內部儲存在 `Derived` 的物件中，並且編譯器將會生成所有轉發給 `b` 的 `Base` 方法。

## 覆寫透過委派實作的介面成員

[覆寫](inheritance.md#overriding-methods)如您預期般運作：編譯器將會使用您的 `override` 實作，而非委派物件中的實作。如果您想將 `override fun printMessage() { print("abc") }` 新增至 `Derived`，當呼叫 `printMessage` 時，程式將會印出 *abc* 而非 *10*：

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

然而，請注意，以這種方式覆寫的成員不會從委派物件的成員中呼叫，因為委派物件只能存取其自身對介面成員的實作：

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

進一步了解[委派屬性](delegated-properties.md)。