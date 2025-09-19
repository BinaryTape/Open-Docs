[//]: # (title: 類別)

Kotlin 中的類別是使用關鍵字 `class` 宣告的：

```kotlin
class Person { /*...*/ }
```

類別宣告由類別名稱、類別標頭（指定其類型參數、主要建構函式，以及其他一些內容）和由花括號包圍的類別主體組成。標頭和主體都是可選的；如果類別沒有主體，則可以省略花括號。

```kotlin
class Empty
```

## 建構函式

Kotlin 中的類別有一個_主要建構函式_，並可能有一個或多個_次要建構函式_。主要建構函式在類別標頭中宣告，它位於類別名稱和可選的類型參數之後。

```kotlin
class Person constructor(firstName: String) { /*...*/ }
```

如果主要建構函式沒有任何註解或可視性修飾符，則可以省略 `constructor` 關鍵字：

```kotlin
class Person(firstName: String) { /*...*/ }
```

主要建構函式在類別標頭中初始化類別實例及其屬性。類別標頭不能包含任何可執行程式碼。如果您想在物件建立期間執行某些程式碼，請在類別主體中使用_初始化區塊_。初始化區塊使用 `init` 關鍵字宣告，後接花括號。在花括號內編寫任何您想執行的程式碼。

在實例初始化期間，初始化區塊依照其在類別主體中出現的相同順序執行，並與屬性初始化器交錯執行：

```kotlin
//sampleStart
class InitOrderDemo(name: String) {
    val firstProperty = "First property: $name".also(::println)
    
    init {
        println("First initializer block that prints $name")
    }
    
    val secondProperty = "Second property: ${name.length}".also(::println)
    
    init {
        println("Second initializer block that prints ${name.length}")
    }
}
//sampleEnd

fun main() {
    InitOrderDemo("hello")
}
```
{kotlin-runnable="true"}

主要建構函式參數可以用於初始化區塊。它們也可以用於在類別主體中宣告的屬性初始化器中：

```kotlin
class Customer(name: String) {
    val customerKey = name.uppercase()
}
```

Kotlin 有一種簡潔語法，用於宣告屬性並從主要建構函式初始化它們：

```kotlin
class Person(val firstName: String, val lastName: String, var age: Int)
```

這類宣告也可以包含類別屬性的預設值：

```kotlin
class Person(val firstName: String, val lastName: String, var isEmployed: Boolean = true)
```

您可以在宣告類別屬性時使用[末尾逗號](coding-conventions.md#trailing-commas)：

```kotlin
class Person(
    val firstName: String,
    val lastName: String,
    var age: Int, // trailing comma
) { /*...*/ }
```

與常規屬性非常相似，在主要建構函式中宣告的屬性可以是可變 (`var`) 或唯讀 (`val`) 的。

非屬性的建構函式參數可在以下位置存取：
* 類別標頭中。
* 類別主體中已初始化的屬性。
* 初始化區塊中。

例如：

```kotlin
// width and height are plain constructor parameters
class RectangleWithParameters(width: Int, height: Int) {
    val perimeter = 2 * width + 2 * height

    init {
        println("Rectangle created with width = $width and height = $height")
    }
}
```

如果建構函式有註解或可視性修飾符，則 `constructor` 關鍵字是必需的，且修飾符位於其之前：

```kotlin
class Customer public @Inject constructor(name: String) { /*...*/ }
```

深入了解[可視性修飾符](visibility-modifiers.md#constructors)。

### 次要建構函式

類別也可以宣告_次要建構函式_，它們以 `constructor` 作為前綴：

```kotlin
class Person(val pets: MutableList<Pet> = mutableListOf())

class Pet {
    constructor(owner: Person) {
        owner.pets.add(this) // adds this pet to the list of its owner's pets
    }
}
```

如果類別有主要建構函式，每個次要建構函式都需要委託給主要建構函式，無論是直接還是透過其他次要建構函式間接委託。委託給同類別的另一個建構函式是使用 `this` 關鍵字完成的：

```kotlin
class Person(val name: String) {
    val children: MutableList<Person> = mutableListOf()
    constructor(name: String, parent: Person) : this(name) {
        parent.children.add(this)
    }
}
```

初始化區塊中的程式碼實際上成為主要建構函式的一部分。委託給主要建構函式發生在存取次要建構函式第一個陳述式時，因此所有初始化區塊和屬性初始化器中的程式碼都在次要建構函式主體之前執行。

即使類別沒有主要建構函式，委託仍然隱式地發生，並且初始化區塊仍然會執行：

```kotlin
//sampleStart
class Constructors {
    init {
        println("Init block")
    }

    constructor(i: Int) {
        println("Constructor $i")
    }
}
//sampleEnd

fun main() {
    Constructors(1)
}
```
{kotlin-runnable="true"}

如果非抽象類別沒有宣告任何建構函式（主要或次要），它將會產生一個沒有引數的主要建構函式。該建構函式的可視性將是公開的。

如果您不希望您的類別擁有公開建構函式，請宣告一個具有非預設可視性的空主要建構函式：

```kotlin
class DontCreateMe private constructor() { /*...*/ }
```

> 在 JVM 上，如果所有主要建構函式參數都具有預設值，編譯器將產生一個額外的無參數建構函式，該建構函式將使用預設值。這使得 Kotlin 更容易與 Jackson 或 JPA 等透過無參數建構函式建立類別實例的函式庫搭配使用。
>
> ```kotlin
> class Customer(val customerName: String = "")
> ```
>
{style="note"}

## 建立類別實例

要建立類別實例，請將建構函式視為常規函式來呼叫。您可以將建立的實例指派給[變數](basic-syntax.md#variables)：

```kotlin
val invoice = Invoice()

val customer = Customer("Joe Smith")
```

> Kotlin 沒有 `new` 關鍵字。
>
{style="note"}

巢狀類別、內部類別和匿名內部類別的實例建立過程在[巢狀類別](nested-classes.md)中描述。

## 類別成員

類別可以包含：

* [建構函式和初始化區塊](#constructors)
* [函式](functions.md)
* [屬性](properties.md)
* [巢狀和內部類別](nested-classes.md)
* [物件宣告](object-declarations.md)

## 繼承

類別可以彼此繼承並形成繼承層次結構。
[深入了解 Kotlin 中的繼承](inheritance.md)。

## 抽象類別

類別可以宣告為 `abstract`，同時其部分或所有成員也可以是抽象的。
抽象成員在其類別中沒有實作。
您無需使用 `open` 註解抽象類別或函式。

```kotlin
abstract class Polygon {
    abstract fun draw()
}

class Rectangle : Polygon() {
    override fun draw() {
        // draw the rectangle
    }
}
```

您可以使用抽象成員覆寫非抽象的 `open` 成員。

```kotlin
open class Polygon {
    open fun draw() {
        // some default polygon drawing method
    }
}

abstract class WildShape : Polygon() {
    // Classes that inherit WildShape need to provide their own
    // draw method instead of using the default on Polygon
    abstract override fun draw()
}
```

## 伴生物件

如果您需要編寫一個無需類別實例即可呼叫，但需要存取類別內部（例如工廠方法）的函式，您可以將其作為[物件宣告](object-declarations.md)的成員寫在該類別內部。

更具體地說，如果您在類別內部宣告[伴生物件](object-declarations.md#companion-objects)，您可以使用類別名稱作為限定符來存取其成員。