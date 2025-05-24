---
title: "繼承 (Inheritance)"
---
Kotlin 中的所有類別都有一個共同的父類別 `Any`，它是未宣告父型別之類別的預設父類別：

```kotlin
class Example // 隱式繼承自 Any
```

`Any` 具有三個方法：`equals()`、`hashCode()` 和 `toString()`。因此，所有 Kotlin 類別都定義了這些方法。

預設情況下，Kotlin 類別是 final 的 – 它們不能被繼承。 要使一個類別可繼承，請使用 `open` 關鍵字標記它：

```kotlin
open class Base // 類別開放繼承

```

要宣告一個明確的父型別 (Supertype)，請在類別標頭中的冒號後放置該型別：

```kotlin
open class Base(p: Int)

class Derived(p: Int) : Base(p)
```

如果衍生類別具有主建構子 (Primary Constructor)，則必須根據其參數在該主建構子中初始化基底類別。

如果衍生類別沒有主建構子，則每個次要建構子 (Secondary Constructor) 都必須使用 `super` 關鍵字初始化基底型別，或者它必須委託給另一個執行此操作的建構子。 請注意，在這種情況下，不同的次要建構子可以呼叫基底型別的不同建構子：

```kotlin
class MyView : View {
    constructor(ctx: Context) : super(ctx)

    constructor(ctx: Context, attrs: AttributeSet) : super(ctx, attrs)
}
```

## 覆寫方法 (Overriding methods)

Kotlin 要求對可覆寫的成員和覆寫使用顯式修飾符：

```kotlin
open class Shape {
    open fun draw() { /*...*/ }
    fun fill() { /*...*/ }
}

class Circle() : Shape() {
    override fun draw() { /*...*/ }
}
```

`Circle.draw()` 需要 `override` 修飾符。 如果缺少它，編譯器會報錯。 如果函數上沒有 `open` 修飾符，例如 `Shape.fill()`，則不允許在子類別中宣告具有相同簽名的方法，無論是否使用 `override`。 當添加到 final 類別（沒有 `open` 修飾符的類別）的成員時，`open` 修飾符無效。

標記為 `override` 的成員本身是 open 的，因此可以在子類別中覆寫它。 如果要禁止重新覆寫，請使用 `final`：

```kotlin
open class Rectangle() : Shape() {
    final override fun draw() { /*...*/ }
}
```

## 覆寫屬性 (Overriding properties)

覆寫機制以與方法相同的方式作用於屬性。 在父類別上宣告，然後在衍生類別上重新宣告的屬性必須以 `override` 開頭，並且它們必須具有相容的型別。 每個宣告的屬性都可以被具有初始化器的屬性或具有 `get` 方法的屬性覆寫：

```kotlin
open class Shape {
    open val vertexCount: Int = 0
}

class Rectangle : Shape() {
    override val vertexCount = 4
}
```

您也可以使用 `var` 屬性覆寫 `val` 屬性，但反之則不行。 這是允許的，因為 `val` 屬性本質上宣告了一個 `get` 方法，並且將其覆寫為 `var` 會在衍生類別中額外宣告一個 `set` 方法。

請注意，您可以將 `override` 關鍵字用作主建構子中屬性宣告的一部分：

```kotlin
interface Shape {
    val vertexCount: Int
}

class Rectangle(override val vertexCount: Int = 4) : Shape // 始終有 4 個頂點

class Polygon : Shape {
    override var vertexCount: Int = 0  // 稍後可以設定為任何數字
}
```

## 衍生類別初始化順序 (Derived class initialization order)

在建構衍生類別的新實例期間，基底類別初始化是作為第一步完成的（僅先於基底類別建構子的參數的評估），這意味著它發生在衍生類別的初始化邏輯執行之前。

```kotlin

open class Base(val name: String) {

    init { println("Initializing a base class") }

    open val size: Int = 
        name.length.also { println("Initializing size in the base class: $it") }
}

class Derived(
    name: String,
    val lastName: String,
) : Base(name.replaceFirstChar { it.uppercase() }.also { println("Argument for the base class: $it") }) {

    init { println("Initializing a derived class") }

    override val size: Int =
        (super.size + lastName.length).also { println("Initializing size in the derived class: $it") }
}

fun main() {
    println("Constructing the derived class(\"hello\", \"world\")")
    Derived("hello", "world")
}
```

這意味著當執行基底類別建構子時，尚未初始化在衍生類別中宣告或覆寫的屬性。 在基底類別初始化邏輯中使用任何這些屬性（直接或間接透過另一個覆寫的 `open` 成員實現）可能會導致不正確的行為或執行階段失敗。 因此，在設計基底類別時，應避免在建構子、屬性初始化器或 `init` 區塊中使用 `open` 成員。

## 呼叫父類別實作 (Calling the superclass implementation)

衍生類別中的程式碼可以使用 `super` 關鍵字呼叫其父類別函數和屬性存取器實作：

```kotlin
open class Rectangle {
    open fun draw() { println("Drawing a rectangle") }
    val borderColor: String get() = "black"
}

class FilledRectangle : Rectangle() {
    override fun draw() {
        super.draw()
        println("Filling the rectangle")
    }

    val fillColor: String get() = super.borderColor
}
```

在內部類別 (Inner Class) 中，存取外部類別 (Outer Class) 的父類別是使用 `super` 關鍵字並使用外部類別名稱進行限定來完成的：`super@Outer`：

```kotlin
open class Rectangle {
    open fun draw() { println("Drawing a rectangle") }
    val borderColor: String get() = "black"
}

class FilledRectangle: Rectangle() {
    override fun draw() {
        val filler = Filler()
        filler.drawAndFill()
    }
    
    inner class Filler {
        fun fill() { println("Filling") }
        fun drawAndFill() {
            super@FilledRectangle.draw() // 呼叫 Rectangle 的 draw() 實作
            fill()
            println("Drawn a filled rectangle with color ${super@FilledRectangle.borderColor}") // 使用 Rectangle 的 borderColor 的 get() 實作
        }
    }
}

fun main() {
    val fr = FilledRectangle()
        fr.draw()
}
```

## 覆寫規則 (Overriding rules)

在 Kotlin 中，實作繼承 (Implementation inheritance) 受以下規則約束：如果一個類別從其直接父類別繼承同一個成員的多個實作，則它必須覆寫此成員並提供自己的實作（可能使用繼承的實作之一）。

要表示從哪個父型別取得繼承的實作，請使用以角括號括住的父型別名稱限定的 `super`，例如 `super<Base>`：

```kotlin
open class Rectangle {
    open fun draw() { /* ... */ }
}

interface Polygon {
    fun draw() { /* ... */ } // 介面成員預設是 'open' 的
}

class Square() : Rectangle(), Polygon {
    // 編譯器要求覆寫 draw()：
    override fun draw() {
        super<Rectangle>.draw() // 呼叫 Rectangle.draw()
        super<Polygon>.draw() // 呼叫 Polygon.draw()
    }
}
```

從 `Rectangle` 和 `Polygon` 繼承是可以的，但是它們都有 `draw()` 的實作，因此您需要在 `Square` 中覆寫 `draw()` 並為其提供單獨的實作以消除歧義。