[//]: # (title: 類別)

在 Kotlin 中，類別是使用關鍵字 `class` 來宣告的：

```kotlin
class Person { /*...*/ }
```

類別宣告由類別名稱、類別標頭（指定其型別參數、主要建構函式及其他一些內容）以及由大括號包圍的類別主體組成。標頭和主體都是可選的；如果類別沒有主體，則可以省略大括號。

```kotlin
class Empty
```

## 建構函式

在 Kotlin 中，一個類別有一個_主要建構函式_，並可能有一個或多個_次要建構函式_。主要建構函式在類別標頭中宣告，它位於類別名稱和可選型別參數之後。

```kotlin
class Person constructor(firstName: String) { /*...*/ }
```

如果主要建構函式沒有任何註解或可見性修飾符，則可以省略 `constructor` 關鍵字：

```kotlin
class Person(firstName: String) { /*...*/ }
```

主要建構函式在類別標頭中初始化類別實例及其屬性。類別標頭不能包含任何可執行程式碼。如果您想在物件建立期間執行一些程式碼，請在類別主體內部使用_初始化區塊_。初始化區塊使用 `init` 關鍵字宣告，後接大括號。將您想執行的任何程式碼寫在大括號內。

在實例初始化期間，初始化區塊會按照它們在類別主體中出現的相同順序執行，並與屬性初始化器交錯：

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

主要建構函式參數可以用於初始化區塊中。它們也可以用於在類別主體中宣告的屬性初始化器中：

```kotlin
class Customer(name: String) {
    val customerKey = name.uppercase()
}
```

Kotlin 有一種簡潔的語法，用於宣告屬性並從主要建構函式中初始化它們：

```kotlin
class Person(val firstName: String, val lastName: String, var age: Int)
```

此類宣告也可以包含類別屬性的預設值：

```kotlin
class Person(val firstName: String, val lastName: String, var isEmployed: Boolean = true)
```

當您宣告類別屬性時，可以使用[尾隨逗號](coding-conventions.md#trailing-commas)：

```kotlin
class Person(
    val firstName: String,
    val lastName: String,
    var age: Int, // trailing comma
) { /*...*/ }
```

就像常規屬性一樣，在主要建構函式中宣告的屬性可以是可變的 (`var`) 或唯讀的 (`val`)。

如果建構函式有註解或可見性修飾符，則 `constructor` 關鍵字是必需的，且修飾符位於它之前：

```kotlin
class Customer public @Inject constructor(name: String) { /*...*/ }
```

了解更多關於[可見性修飾符](visibility-modifiers.md#constructors)的資訊。

### 次要建構函式

類別也可以宣告_次要建構函式_，它們以 `constructor` 為前綴：

```kotlin
class Person(val pets: MutableList<Pet> = mutableListOf())

class Pet {
    constructor(owner: Person) {
        owner.pets.add(this) // adds this pet to the list of its owner's pets
    }
}
```

如果類別有一個主要建構函式，每個次要建構函式都需要委派給主要建構函式，無論是直接還是透過其他次要建構函式間接委派。委派給同一個類別的另一個建構函式是使用 `this` 關鍵字完成的：

```kotlin
class Person(val name: String) {
    val children: MutableList<Person> = mutableListOf()
    constructor(name: String, parent: Person) : this(name) {
        parent.children.add(this)
    }
}
```

初始化區塊中的程式碼實質上成為主要建構函式的一部分。委派給主要建構函式發生在存取次要建構函式的第一個語句時，因此所有初始化區塊和屬性初始化器中的程式碼會在次要建構函式的主體之前執行。

即使類別沒有主要建構函式，委派仍然會隱含地發生，且初始化區塊仍會執行：

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

如果一個非抽象類別沒有宣告任何建構函式（主要或次要），它將有一個生成的無參數主要建構函式。該建構函式的可見性將是公開的。

如果您不想讓您的類別擁有公開建構函式，請宣告一個帶有非預設可見性的空主要建構函式：

```kotlin
class DontCreateMe private constructor() { /*...*/ }
```

> 在 JVM 上，如果所有主要建構函式參數都具有預設值，編譯器將生成一個額外的無參數建構函式，它將使用這些預設值。這使得 Kotlin 更容易與透過無參數建構函式建立類別實例的函式庫（例如 Jackson 或 JPA）一起使用。
>
> ```kotlin
> class Customer(val customerName: String = "")
> ```
>
{style="note"}

## 建立類別實例

要建立類別的實例，請將建構函式視為常規函式來呼叫。您可以將建立的實例指派給一個[變數](basic-syntax.md#variables)：

```kotlin
val invoice = Invoice()

val customer = Customer("Joe Smith")
```

> Kotlin 沒有 `new` 關鍵字。
>
{style="note"}

建立巢狀、內部和匿名內部類別實例的過程在[巢狀類別](nested-classes.md)中描述。

## 類別成員

類別可以包含：

*   [建構函式和初始化區塊](#constructors)
*   [函式](functions.md)
*   [屬性](properties.md)
*   [巢狀與內部類別](nested-classes.md)
*   [物件宣告](object-declarations.md)

## 繼承

類別可以彼此派生並形成繼承階層。[了解更多關於 Kotlin 中的繼承](inheritance.md)。

## 抽象類別

類別可以被宣告為 `abstract`，連同其部分或所有成員。抽象成員在其類別中沒有實作。您不需要使用 `open` 來註解抽象類別或函式。

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

您可以用一個抽象成員來覆寫一個非抽象的 `open` 成員。

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

## 伴侶物件

如果您需要撰寫一個函式，它可以在沒有類別實例的情況下被呼叫，但需要存取類別的內部（例如工廠方法），您可以將其寫作該類別內部[物件宣告](object-declarations.md)的一個成員。

更具體地說，如果您在類別內部宣告一個[伴侶物件](object-declarations.md#companion-objects)，您可以僅使用類別名稱作為限定詞來存取其成員。