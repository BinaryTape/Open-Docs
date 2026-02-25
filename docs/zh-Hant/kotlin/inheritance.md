[//]: # (title: 繼承)

> 在透過類別建立繼承階層結構之前，請考慮使用 [抽象類別](classes.md#abstract-classes) 或 [介面](interfaces.md)。 
> 預設情況下，你可以繼承自抽象類別和介面。它們的設計初衷就是為了讓其他類別可以繼承其成員並實作它們。
>
{style="tip"}

Kotlin 中的所有類別都有一個共同的超類別 `Any`，對於沒有宣告超型別的類別，這就是預設的超類別：

```kotlin
class Example // 隱式繼承自 Any
```

`Any` 有三個方法：`equals()`、`hashCode()` 和 `toString()`。因此，所有 Kotlin 類別都定義了這些方法。

預設情況下，Kotlin 類別是 final 的——它們不能被繼承。要讓一個類別可被繼承，請使用 `open` 關鍵字標記它：

```kotlin
open class Base // 類別已 open 以供繼承
```

[欲了解更多資訊，請參閱 Open 關鍵字](#open-keyword)。

要宣告明確的超型別，請在類別標頭中的冒號後方放置該型別：

```kotlin
open class Base(p: Int)

class Derived(p: Int) : Base(p)
```

如果衍生類別具有主建構函數，則基底類別可以（且必須）根據其參數在該主建構函數中進行初始化。

如果衍生類別沒有主建構函數，則每個次要建構函式必須使用 `super` 關鍵字初始化基底型別，或者必須委派給另一個執行此操作的建構函式。請注意，在這種情況下，不同的次要建構函式可以呼叫基底型別的不同建構函式：

```kotlin
class MyView : View {
    constructor(ctx: Context) : super(ctx)

    constructor(ctx: Context, attrs: AttributeSet) : super(ctx, attrs)
}
```

## Open 關鍵字 {#open-keyword}

在 Kotlin 中，`open` 關鍵字表示一個類別或成員（函式或屬性）可以在子類別中被覆寫。預設情況下，Kotlin 類別及其成員是 _final_ 的，這意味著除非你明確將它們標記為 `open`，否則它們不能被繼承（對於類別而言）或被覆寫（對於成員而言）：

```kotlin
// 使用 open 關鍵字的基底類別，允許繼承
open class Person(
    val name: String
) {
    // Open 函式，可以在子類別中被覆寫
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

如果你覆寫了基底類別的一個成員，則該覆寫成員預設也是 open 的。如果你想改變這一點並禁止你的子類別覆寫你的實作，你可以明確地將該覆寫成員標記為 `final`：

```kotlin
// 使用 open 關鍵字的基底類別，允許繼承
open class Person(val name: String) {
    // Open 函式，可以在子類別中被覆寫
    open fun introduce() {
        println("Hello, my name is $name.")
    }
}

// 繼承自 Person 並覆寫 introduce() 函式的子類別
class Student(name: String, val school: String) : Person(name) {
    // final 關鍵字可防止子類別中進一步的覆寫
    final override fun introduce() {
        println("Hi, I'm $name, and I study at $school.")
    }
}
```

## 覆寫方法

Kotlin 要求對可覆寫成員和覆寫進行明確的修飾符標記：

```kotlin
open class Shape {
    open fun draw() { /*...*/ }
    fun fill() { /*...*/ }
}

class Circle() : Shape() {
    override fun draw() { /*...*/ }
}
```

`Circle.draw()` 必須加上 `override` 修飾符。如果遺漏，編譯器將會報錯。如果一個函式沒有 `open` 修飾符（如 `Shape.fill()`），則不允許在子類別中宣告具有相同簽章的方法，無論是否加上 `override`。當將 `open` 修飾符添加到 final 類別（即沒有 `open` 修飾符的類別）的成員上時，它不會產生任何效果。

標記為 `override` 的成員本身是 open 的，因此它可以在子類別中被覆寫。如果你想禁止再次覆寫，請使用 `final`：

```kotlin
open class Rectangle() : Shape() {
    final override fun draw() { /*...*/ }
}
```

## 覆寫屬性

覆寫機制在屬性上的運作方式與在方法上相同。在超類別上宣告且在衍生類別中重新宣告的屬性必須冠以 `override`，並且它們必須具有相容的型別。每個宣告的屬性都可以由具有初始設定式的屬性或具有 `get` 方法的屬性來覆寫：

```kotlin
open class Shape {
    open val vertexCount: Int = 0
}

class Rectangle : Shape() {
    override val vertexCount = 4
}
```

你也可以用 `var` 屬性覆寫 `val` 屬性，但反之則不行。這是允許的，因為 `val` 屬性本質上宣告了一個 `get` 方法，而將其覆寫為 `var` 則在衍生類別中額外宣告了一個 `set` 方法。

請注意，你可以將 `override` 關鍵字作為主建構函數中屬性宣告的一部分：

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

在建構衍生類別的新執行個體期間，基底類別的初始化是作為第一步完成的（僅在評估基底類別建構函式的引數之後），這意味著它發生在衍生類別的初始化邏輯執行之前。

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

這意味著當基底類別建構函式執行時，在衍生類別中宣告或覆寫的屬性尚未初始化。在基底類別初始化邏輯中使用任何這些屬性（無論是直接使用，還是透過另一個被覆寫的 `open` 成員實作間接使用）都可能導致不正確的行為或執行階段失敗。因此，在設計基底類別時，應避免在建構函式、屬性初始設定式或 `init` 區塊中使用 `open` 成員。

## 呼叫超類別實作

衍生類別中的程式碼可以使用 `super` 關鍵字呼叫其超類別的函式和屬性存取子實作：

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

在內部類別中，使用以外部類別名稱限定的 `super` 關鍵字來存取外部類別的超類別：`super@Outer`：

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
            println("Drawn a filled rectangle with color ${super@FilledRectangle.borderColor}") // 使用 Rectangle 的 borderColor 的 get() 實作
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

在 Kotlin 中，實作繼承受以下規則約束：如果一個類別從其直接超類別繼承了同一個成員的多個實作，則它必須覆寫該成員並提供自己的實作（或許可以使用其中一個繼承的實作）。

為了表示繼承實作所來自的超型別，請在尖括號中使用由超型別名稱限定的 `super`，例如 `super<Base>`：

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

同時繼承 `Rectangle` 和 `Polygon` 是可以的，但它們都有各自的 `draw()` 實作，因此你需要在 `Square` 中覆寫 `draw()` 並為其提供單獨的實作以消除歧義。