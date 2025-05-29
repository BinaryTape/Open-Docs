[//]: # (title: 繼承)

Kotlin 中的所有類別都擁有一個共同的超類別 `Any`，它是一個未宣告任何超型別的類別的預設超類別：

```kotlin
class Example // 隱含地繼承自 Any
```

`Any` 具有三個方法：`equals()`、`hashCode()` 和 `toString()`。因此，所有 Kotlin 類別都定義了這些方法。

預設情況下，Kotlin 類別是最終的（final）—— 它們無法被繼承。要使一個類別可繼承，請使用 `open` 關鍵字標記它：

```kotlin
open class Base // 該類別開放供繼承

```

要宣告一個明確的超型別，請在類別標頭中的冒號後放置該型別：

```kotlin
open class Base(p: Int)

class Derived(p: Int) : Base(p)
```

如果衍生類別具有主要建構函式，基底類別可以（並且必須）根據其參數在該主要建構函式中初始化。

如果衍生類別沒有主要建構函式，那麼每個次要建構函式都必須使用 `super` 關鍵字初始化基底型別，或者必須委派給另一個執行此操作的建構函式。請注意，在這種情況下，不同的次要建構函式可以呼叫基底型別的不同建構函式：

```kotlin
class MyView : View {
    constructor(ctx: Context) : super(ctx)

    constructor(ctx: Context, attrs: AttributeSet) : super(ctx, attrs)
}
```

## 覆寫方法

Kotlin 對於可覆寫的成員和覆寫項要求明確的修飾符：

```kotlin
open class Shape {
    open fun draw() { /*...*/ }
    fun fill() { /*...*/ }
}

class Circle() : Shape() {
    override fun draw() { /*...*/ }
}
```

`Circle.draw()` 必須使用 `override` 修飾符。如果它缺失，編譯器將會報錯。如果一個函式（例如 `Shape.fill()`）上沒有 `open` 修飾符，那麼在子類別中宣告具有相同簽章的方法是不允許的，無論是否使用 `override`。當 `open` 修飾符被加入到最終類別（即沒有 `open` 修飾符的類別）的成員時，它沒有任何效果。

標記為 `override` 的成員本身是開放的（open），因此它可以在子類別中被覆寫。如果您想禁止再次覆寫，請使用 `final`：

```kotlin
open class Rectangle() : Shape() {
    final override fun draw() { /*...*/ }
}
```

## 覆寫屬性

覆寫機制在屬性上的運作方式與在方法上相同。在超類別上宣告的屬性，然後在衍生類別上重新宣告時，必須以 `override` 為前綴，並且它們必須具有相容的型別。每個宣告的屬性都可以被帶有初始化器或帶有 `get` 方法的屬性覆寫：

```kotlin
open class Shape {
    open val vertexCount: Int = 0
}

class Rectangle : Shape() {
    override val vertexCount = 4
}
```

您還可以用 `var` 屬性覆寫 `val` 屬性，但反之則不行。這是允許的，因為 `val` 屬性本質上宣告了一個 `get` 方法，而將其覆寫為 `var` 則額外地在衍生類別中宣告了一個 `set` 方法。

請注意，您可以在主要建構函式中將 `override` 關鍵字作為屬性宣告的一部分使用：

```kotlin
interface Shape {
    val vertexCount: Int
}

class Rectangle(override val vertexCount: Int = 4) : Shape // 始終有 4 個頂點

class Polygon : Shape {
    override var vertexCount: Int = 0  // 稍後可以設定為任何數字
}
```

## 衍生類別初始化順序

在建構衍生類別的新實例時，基底類別的初始化是第一步完成的（僅在基底類別建構函式的參數評估之後發生），這意味著它在衍生類別的初始化邏輯執行之前發生。

```kotlin
//sampleStart
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
//sampleEnd

fun main() {
    println("Constructing the derived class(\"hello\", \"world\")")
    Derived("hello", "world")
}
```
{kotlin-runnable="true"}

這表示當基底類別建構函式執行時，在衍生類別中宣告或覆寫的屬性尚未被初始化。在基底類別初始化邏輯中（無論是直接還是間接通過另一個覆寫的 `open` 成員實作）使用這些屬性中的任何一個，都可能導致不正確的行為或執行時失敗。因此，在設計基底類別時，您應該避免在建構函式、屬性初始化器或 `init` 區塊中使用 `open` 成員。

## 呼叫超類別實作

衍生類別中的程式碼可以使用 `super` 關鍵字呼叫其超類別函式和屬性存取器實作：

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

在內部類別中，存取外部類別的超類別是通過使用以外部類別名稱限定的 `super` 關鍵字來完成的：`super@Outer`：

```kotlin
open class Rectangle {
    open fun draw() { println("Drawing a rectangle") }
    val borderColor: String get() = "black"
}

//sampleStart
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
            println("Drawn a filled rectangle with color ${super@FilledRectangle.borderColor}") // 使用 Rectangle 的 borderColor 屬性的 get() 實作
        }
    }
}
//sampleEnd

fun main() {
    val fr = FilledRectangle()
        fr.draw()
}
```
{kotlin-runnable="true"}

## 覆寫規則

在 Kotlin 中，實作繼承受以下規則約束：如果一個類別從其直接超類別繼承了相同成員的多個實作，它必須覆寫此成員並提供自己的實作（或許使用其中一個繼承來的實作）。

為了表示繼承實作來源的超型別，請使用尖括號中指定的超型別名稱來限定 `super`，例如 `super<Base>`：

```kotlin
open class Rectangle {
    open fun draw() { /* ... */ }
}

interface Polygon {
    fun draw() { /* ... */ } // 介面成員依預設為 'open'
}

class Square() : Rectangle(), Polygon {
    // 編譯器要求覆寫 draw():
    override fun draw() {
        super<Rectangle>.draw() // 呼叫 Rectangle.draw()
        super<Polygon>.draw() // 呼叫 Polygon.draw()
    }
}
```

同時繼承自 `Rectangle` 和 `Polygon` 是沒問題的，但它們都具有各自的 `draw()` 實作，因此您需要在 `Square` 中覆寫 `draw()` 並為其提供一個單獨的實作以消除歧義。