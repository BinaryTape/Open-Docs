---
title: "類別 (Classes)"
---
Kotlin 中的類別使用關鍵字 `class` 宣告：

```kotlin
class Person { /*...*/ }
```

類別宣告包含類別名稱、類別標頭（指定其類型參數、主要建構函式（primary constructor）及其他內容）以及用大括號括起來的類別主體。 標頭和主體都是可選的；如果類別沒有主體，則可以省略大括號。

```kotlin
class Empty
```

## 建構函式（Constructors）

Kotlin 中的類別有一個_主要建構函式_（primary constructor），並且可能有一個或多個_次要建構函式_（secondary constructors）。 主要建構函式在類別標頭中宣告，它位於類別名稱和可選類型參數之後。

```kotlin
class Person constructor(firstName: String) { /*...*/ }
```

如果主要建構函式沒有任何註解（annotations）或可見性修飾符（visibility modifiers），則可以省略 `constructor` 關鍵字：

```kotlin
class Person(firstName: String) { /*...*/ }
```

主要建構函式初始化類別實例以及在類別標頭中的屬性。 類別標頭不能包含任何可執行的程式碼。 如果您想要在物件建立期間執行一些程式碼，請在類別主體內使用_初始化區塊_（initializer blocks）。 初始化區塊使用 `init` 關鍵字宣告，後跟大括號。 在大括號內撰寫您想要執行的任何程式碼。

在實例初始化期間，初始化區塊的執行順序與它們在類別主體中出現的順序相同，並且與屬性初始化器交錯：

```kotlin

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

fun main() {
    InitOrderDemo("hello")
}
```

主要建構函式參數可以在初始化區塊中使用。 它們也可以在類別主體中宣告的屬性初始化器中使用：

```kotlin
class Customer(name: String) {
    val customerKey = name.uppercase()
}
```

Kotlin 具有簡潔的語法，可用於宣告屬性並從主要建構函式初始化它們：

```kotlin
class Person(val firstName: String, val lastName: String, var age: Int)
```

此類宣告還可以包含類別屬性的預設值：

```kotlin
class Person(val firstName: String, val lastName: String, var isEmployed: Boolean = true)
```

您可以在宣告類別屬性時使用 [結尾逗號](coding-conventions#trailing-commas)：

```kotlin
class Person(
    val firstName: String,
    val lastName: String,
    var age: Int, // 結尾逗號
) { /*...*/ }
```

與常規屬性非常相似，在主要建構函式中宣告的屬性可以是可變的 (`var`) 或唯讀的 (`val`)。

如果建構函式具有註解或可見性修飾符，則需要 `constructor` 關鍵字，並且修飾符位於其前面：

```kotlin
class Customer public @Inject constructor(name: String) { /*...*/ }
```

了解更多關於[可見性修飾符](visibility-modifiers#constructors)。

### 次要建構函式（Secondary constructors）

類別也可以宣告_次要建構函式_，這些建構函式以 `constructor` 為字首：

```kotlin
class Person(val pets: MutableList<Pet> = mutableListOf())

class Pet {
    constructor(owner: Person) {
        owner.pets.add(this) // 將此寵物新增到其主人的寵物清單中
    }
}
```

如果類別具有主要建構函式，則每個次要建構函式都需要委託給主要建構函式，可以直接或間接透過另一個或多個次要建構函式。 委託給同一類別的另一個建構函式是使用 `this` 關鍵字完成的：

```kotlin
class Person(val name: String) {
    val children: MutableList<Person> = mutableListOf()
    constructor(name: String, parent: Person) : this(name) {
        parent.children.add(this)
    }
}
```

初始化區塊中的程式碼實際上成為主要建構函式的一部分。 委託給主要建構函式發生在存取次要建構函式的第一個語句時，因此所有初始化區塊和屬性初始化器中的程式碼都在次要建構函式的主體之前執行。

即使類別沒有主要建構函式，委託仍然隱式發生，並且初始化區塊仍然會執行：

```kotlin

class Constructors {
    init {
        println("Init block")
    }

    constructor(i: Int) {
        println("Constructor $i")
    }
}

fun main() {
    Constructors(1)
}
```

如果非抽象類別未宣告任何建構函式（主要或次要），它將具有一個產生的、沒有引數的主要建構函式。 建構函式的可見性將是 public。

如果您不希望您的類別具有 public 建構函式，請宣告一個具有非預設可見性的空主要建構函式：

```kotlin
class DontCreateMe private constructor() { /*...*/ }
```

:::note
在 JVM 上，如果所有主要建構函式參數都具有預設值，則編譯器將產生一個額外的無參數建構函式，該建構函式將使用預設值。 這使得將 Kotlin 與 Jackson 或 JPA 等透過無參數建構函式建立類別實例的函式庫一起使用變得更加容易。

```kotlin
class Customer(val customerName: String = "")
```

:::

## 建立類別的實例

若要建立類別的實例，請呼叫建構函式，就像它是常規函數一樣。 您可以將建立的實例指派給[變數](basic-syntax#variables)：

```kotlin
val invoice = Invoice()

val customer = Customer("Joe Smith")
```

:::note
Kotlin 沒有 `new` 關鍵字。

:::

建立巢狀類別（nested）、內部類別（inner）和匿名內部類別（anonymous inner）實例的過程在 [巢狀類別](nested-classes) 中描述。

## 類別成員（Class members）

類別可以包含：

* [建構函式和初始化區塊](classes#constructors)
* [函式](functions)
* [屬性](properties)
* [巢狀和內部類別](nested-classes)
* [物件宣告](object-declarations)

## 繼承（Inheritance）

類別可以彼此繼承，並形成繼承層次結構。
[了解更多關於 Kotlin 中的繼承](inheritance)。

## 抽象類別（Abstract classes）

一個類別可以宣告為 `abstract`，以及它的一些或所有成員。
抽象成員在其類別中沒有實作。
您不需要使用 `open` 註解抽象類別或函數。

```kotlin
abstract class Polygon {
    abstract fun draw()
}

class Rectangle : Polygon() {
    override fun draw() {
        // 繪製矩形
    }
}
```

您可以使用抽象成員覆寫非抽象 `open` 成員。

```kotlin
open class Polygon {
    open fun draw() {
        // 一些預設的多邊形繪製方法
    }
}

abstract class WildShape : Polygon() {
    // 繼承 WildShape 的類別需要提供它們自己的
    // draw 方法，而不是使用 Polygon 上的預設方法
    abstract override fun draw()
}
```

## 伴生物件（Companion objects）

如果您需要編寫一個可以在沒有類別實例的情況下呼叫的函數，但需要存取類別的內部結構（例如 factory method），您可以將其編寫為該類別內[物件宣告](object-declarations)的成員。

更具體地說，如果您在類別中宣告一個 [伴生物件](object-declarations#companion-objects)，您可以使用類別名稱作為限定詞來存取其成員。