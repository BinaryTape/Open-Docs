[//]: # (title: 繼承)

> 在使用類別建立繼承階層之前，請考慮使用 [抽象類別](classes.md#abstract-classes) 或 [介面](interfaces.md)。
> 預設情況下，您可以從抽象類別和介面繼承。它們旨在讓其他類別可以繼承其成員並實作它們。
>
{style="tip"}

Kotlin 中的所有類別都有一個共同的超類別 `Any`，它是一個沒有宣告超類型之類別的預設超類別：

```kotlin
class Example // 隱式繼承自 Any
```

`Any` 有三個方法：`equals()`、`hashCode()` 和 `toString()`。因此，這些方法是為所有 Kotlin 類別定義的。

預設情況下，Kotlin 類別是 `final` 的，這表示它們不能被繼承。要使一個類別可被繼承，請使用 `open` 關鍵字標記它：

```kotlin
open class Base // 類別開放供繼承

```

[欲知詳情，請參閱 Open 關鍵字](#open-keyword)。

若要宣告一個明確的超類型，請在類別標頭中的冒號後放置該類型：

```kotlin
open class Base(p: Int)

class Derived(p: Int) : Base(p)
```

如果衍生類別有一個主要建構函式，基礎類別可以（並且必須）根據其參數在該主要建構函式中初始化。

如果衍生類別沒有主要建構函式，那麼每個次要建構函式都必須使用 `super` 關鍵字來初始化基礎類型，或者它必須委派給另一個這樣做的建構函式。請注意，在這種情況下，不同的次要建構函式可以呼叫基礎類型的不同建構函式：

```kotlin
class MyView : View {
    constructor(ctx: Context) : super(ctx)

    constructor(ctx: Context, attrs: AttributeSet) : super(ctx, attrs)
}
```

## Open 關鍵字

在 Kotlin 中，`open` 關鍵字表示一個類別或成員（函式或屬性）可以在子類別中被覆寫。預設情況下，Kotlin 類別及其成員是 _final_ 的，這表示它們不能被繼承（對於類別而言）或覆寫（對於成員而言），除非您明確地將它們標記為 `open`：

```kotlin
// 允許繼承的帶有 open 關鍵字的基礎類別
open class Person(
    val name: String
) {
    // 可以在子類別中覆寫的 open 函式
    open fun introduce() {
        println("Hello, my name is $name.")
    }
}

// 繼承自 Person 並覆寫 introduce() 函式的子類別
class Student(
    name: String,
    val school: String
) : Person(name) {
    override fun introduce() {
        println("Hi, I'm $name, and I study at $school.")
    }
}
```

如果您覆寫了基礎類別的一個成員，則該覆寫成員預設也是 `open` 的。如果您想改變這一點並禁止您的類別的子類別覆寫您的實作，您可以明確地將該覆寫成員標記為 `final`：

```kotlin
// 允許繼承的帶有 open 關鍵字的基礎類別
open class Person(val name: String) {
    // 可以在子類別中覆寫的 open 函式
    open fun introduce() {
        println("Hello, my name is $name.")
    }
}

// 繼承自 Person 並覆寫 introduce() 函式的子類別
class Student(name: String, val school: String) : Person(name) {
    // final 關鍵字可防止在子類別中進一步覆寫
    final override fun introduce() {
        println("Hi, I'm $name, and I study at $school.")
    }
}
```

## 覆寫方法

Kotlin 要求對可覆寫成員和覆寫提供明確的修飾符：

```kotlin
open class Shape {
    open fun draw() { /*...*/ }
    fun fill() { /*...*/ }
}

class Circle() : Shape() {
    override fun draw() { /*...*/ }
}
```

`Circle.draw()` 必須使用 `override` 修飾符。如果缺少它，編譯器會發出錯誤。如果一個函式沒有 `open` 修飾符，例如 `Shape.fill()`，則不允許在子類別中宣告具有相同簽章的方法，無論有無 `override` 修飾符皆是。`open` 修飾符加到 `final` 類別（即沒有 `open` 修飾符的類別）的成員時，沒有任何效果。

被標記為 `override` 的成員本身是 `open` 的，因此它可以在子類別中被覆寫。如果您想禁止再次覆寫，請使用 `final`：

```kotlin
open class Rectangle() : Shape() {
    final override fun draw() { /*...*/ }
}
```

## 覆寫屬性

覆寫機制在屬性上的運作方式與在方法上相同。在超類別上宣告的屬性，如果隨後在衍生類別上重新宣告，則必須以 `override` 為前綴，並且它們必須具有相容的類型。每個宣告的屬性都可以被一個帶有初始化器或帶有 `get` 方法的屬性覆寫：

```kotlin
open class Shape {
    open val vertexCount: Int = 0
}

class Rectangle : Shape() {
    override val vertexCount = 4
}
```

您還可以使用 `var` 屬性覆寫 `val` 屬性，但反之則不行。這是允許的，因為 `val` 屬性本質上宣告了一個 `get` 方法，而將其覆寫為 `var` 會在衍生類別中額外宣告一個 `set` 方法。

請注意，您可以在主要建構函式中將 `override` 關鍵字作為屬性宣告的一部分使用：

```kotlin
interface Shape {
    val vertexCount: Int
}

class Rectangle(override val vertexCount: Int = 4) : Shape // 總是具有 4 個頂點

class Polygon : Shape {
    override var vertexCount: Int = 0  // 稍後可以設定為任何數字
}
```

## 衍生類別初始化順序

在衍生類別的新實例建構期間，基礎類別的初始化是第一步（僅在評估基礎類別建構函式的引數之前進行），這表示它發生在衍生類別的初始化邏輯運行之前。

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

這表示當基礎類別建構函式執行時，在衍生類別中宣告或覆寫的屬性尚未初始化。在基礎類別初始化邏輯中（無論是直接還是間接透過另一個覆寫的 `open` 成員實作）使用這些屬性中的任何一個都可能導致不正確的行為或執行時失敗。因此，在設計基礎類別時，應避免在建構函式、屬性初始化器或 `init` 區塊中使用 `open` 成員。

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

在內部類別中，存取外部類別的超類別是使用 `super` 關鍵字並限定外部類別名稱來完成的：`super@Outer`：

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
            println("Drawn a filled rectangle with color ${super@FilledRectangle.borderColor}") // 使用 Rectangle 的 borderColor 的 get() 實作繪製了一個帶有顏色的實心矩形
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

在 Kotlin 中，實作繼承受以下規則約束：如果一個類別從其直接超類別繼承了相同成員的多個實作，它必須覆寫此成員並提供自己的實作（或許，使用其中一個繼承的實作）。

為了表示繼承實作的超類型，請使用帶有尖括號中超類型名稱的 `super` 關鍵字，例如 `super<Base>`：

```kotlin
open class Rectangle {
    open fun draw() { /* ... */ }
}

interface Polygon {
    fun draw() { /* ... */ } // 介面成員預設為 'open'
}

class Square() : Rectangle(), Polygon {
    // 編譯器要求覆寫 draw()：
    override fun draw() {
        super<Rectangle>.draw() // 呼叫 Rectangle.draw()
        super<Polygon>.draw() // 呼叫 Polygon.draw()
    }
}
```

從 `Rectangle` 和 `Polygon` 繼承是沒有問題的，但它們都有自己的 `draw()` 實作，因此您需要在 `Square` 中覆寫 `draw()` 並為其提供一個單獨的實作以消除歧義。