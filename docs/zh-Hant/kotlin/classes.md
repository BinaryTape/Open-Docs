[//]: # (title: 類別)

如同其他物件導向語言，Kotlin 使用 _類別_ 來封裝資料（屬性）和行為（函式），以實現可重複使用、結構化的程式碼。

類別是物件的藍圖或模板，您可以透過[建構函式](#constructors-and-initializer-blocks)來建立物件。當您[建立類別實例](#creating-instances)時，您正在基於該藍圖建立一個具體物件。

Kotlin 提供了宣告類別的簡潔語法。若要宣告類別，請使用 `class` 關鍵字，後接類別名稱：

```kotlin
class Person { /*...*/ }
```

類別宣告包含：
*   **類別標頭**，包括但不限於：
    *   `class` 關鍵字
    *   類別名稱
    *   類型參數（如果有的話）
    *   [主要建構函式](#primary-constructor)（可選）
*   **類別主體**（可選），由花括號 `{}` 包圍，並包含**類別成員**，例如：
    *   [次要建構函式](#secondary-constructors)
    *   [初始化區塊](#initializer-blocks)
    *   [函式](functions.md)
    *   [屬性](properties.md)
    *   [巢狀和內部類別](nested-classes.md)
    *   [物件宣告](object-declarations.md)

您可以將類別標頭和主體都保持在最低限度。如果類別沒有主體，您可以省略花括號 `{}`：

```kotlin
// 具有主要建構函式但無主體的類別
class Person(val name: String, var age: Int)
```

這是一個宣告具有標頭和主體的類別，然後從中[建立實例](#creating-instances)的範例：

```kotlin
// 具有主要建構函式的 Person 類別
// 用於初始化 name 屬性
class Person(val name: String) {
    // 具有 age 屬性的類別主體
    var age: Int = 0
}

fun main() {
    // 透過呼叫建構函式建立 Person 類別的實例
    val person = Person("Alice")

    // 存取實例的屬性
    println(person.name)
    // Alice
    println(person.age)
    // 0
}
```
{kotlin-runnable="true" id="class-with-header-and-body"}

## 建立實例

當您使用類別作為藍圖，在程式中建立一個真實物件來操作時，即建立了一個實例。

若要建立類別實例，請使用類別名稱後接圓括號 `()`，類似於呼叫[函式](functions.md)：

```kotlin
// 建立 Person 類別的實例
val anonymousUser = Person()
```

在 Kotlin 中，您可以透過以下方式建立實例：

*   **不帶引數** (`Person()`)：如果類別中宣告了預設值，則使用預設值建立實例。
*   **帶引數** (`Person(value)`)：透過傳遞特定值來建立實例。

您可以將建立的實例指派給可變 (`var`) 或唯讀 (`val`) [變數](basic-syntax.md#variables)：

```kotlin
// 使用預設值建立實例
// 並將其指派給可變變數
var anonymousUser = Person()

// 透過傳遞特定值建立實例
// 並將其指派給唯讀變數
val namedUser = Person("Joe")
```

您可以在任何需要的地方建立實例，例如在 [`main()` 函式](basic-syntax.md#program-entry-point)內部、在其他函式內部，或在另一個類別內部。此外，您可以在另一個函式內部建立實例，並從 `main()` 呼叫該函式。

以下程式碼宣告了一個 `Person` 類別，其中包含一個用於儲存名稱的屬性。它也展示了
如何使用預設建構函式的值和特定值來建立實例：

```kotlin
// 類別標頭，帶有一個使用預設值初始化 name 的主要建構函式
class Person(val name: String = "Sebastian")

fun main() {
    // 使用預設建構函式的值建立實例
    val anonymousUser = Person()

    // 透過傳遞特定值建立實例
    val namedUser = Person("Joe")

    // 存取實例的 name 屬性
    println(anonymousUser.name)
    // Sebastian
    println(namedUser.name)
    // Joe
}
```
{kotlin-runnable="true" id="create-instance-of-a-class"}

> 在 Kotlin 中，不像其他物件導向程式設計語言，建立類別實例時不需要 `new` 關鍵字。
>
{style="note"}

有關建立巢狀、內部和匿名內部類別實例的資訊，請參閱[巢狀類別](nested-classes.md)部分。

## 建構函式與初始化區塊

當您建立類別實例時，會呼叫其其中一個建構函式。Kotlin 中的類別可以有一個[主要建構函式](#primary-constructor)和一個或多個[次要建構函式](#secondary-constructors)。

主要建構函式是初始化類別的主要方式。您在類別標頭中宣告它。次要建構函式提供額外的初始化邏輯。您在類別主體中宣告它。

主要和次要建構函式都是可選的，但類別必須至少有一個建構函式。

### 主要建構函式

主要建構函式在[建立實例](#creating-instances)時設定實例的初始狀態。

若要宣告主要建構函式，請將其放在類別名稱後的類別標頭中：

```kotlin
class Person constructor(name: String) { /*...*/ }
```

如果主要建構函式沒有任何[註解](annotations.md)或[可視性修飾符](visibility-modifiers.md#constructors)，您可以省略 `constructor` 關鍵字：

```kotlin
class Person(name: String) { /*...*/ }
```

主要建構函式可以將參數宣告為屬性。在引數名稱前使用 `val` 關鍵字宣告唯讀屬性，使用 `var` 關鍵字宣告可變屬性：

```kotlin
class Person(val name: String, var age: Int) { /*...*/ }
```

這些建構函式參數屬性作為實例的一部分儲存，並可從類別外部存取。

也可以宣告非屬性的主要建構函式參數。這些參數前面沒有 `val` 或 `var`，因此它們不會儲存在實例中，並且只在類別主體內可用：

```kotlin
// 也是屬性的主要建構函式參數
class PersonWithProperty(val name: String) {
    fun greet() {
        println("Hello, $name")
    }
}

// 僅為主要建構函式參數（未儲存為屬性）
class PersonWithAssignment(name: String) {
    // 必須指派給屬性才能稍後使用
    val displayName: String = name
    
    fun greet() {
        println("Hello, $displayName")
    }
}
```

在主要建構函式中宣告的屬性可由類別的[成員函式](functions.md)存取：

```kotlin
// 具有宣告屬性的主要建構函式的類別
class Person(val name: String, var age: Int) {
    // 存取類別屬性的成員函式
    fun introduce(): String {
        return "Hi, I'm $name and I'm $age years old."
    }
}
```

您也可以在主要建構函式中為屬性指派預設值：

```kotlin
class Person(val name: String = "John", var age: Int = 30) { /*...*/ }
```

如果在[建立實例](#creating-instances)期間沒有傳遞值給建構函式，屬性將使用其預設值：

```kotlin
// 具有包含 name 和 age 預設值的主要建構函式的類別
class Person(val name: String = "John", var age: Int = 30)

fun main() {
    // 使用預設值建立實例
    val person = Person()
    println("Name: ${person.name}, Age: ${person.age}")
    // Name: John, Age: 30
}
```
{kotlin-runnable="true" id="class-with-primary-constructor"}

您可以使用主要建構函式參數直接在類別主體中初始化額外的類別屬性：

```kotlin
// 具有包含 name 和 age 預設值的主要建構函式的類別
class Person(
    val name: String = "John",
    var age: Int = 30
) {
    // 從主要建構函式參數初始化 description 屬性
    val description: String = "Name: $name, Age: $age"
}

fun main() {
    // 建立 Person 類別的實例
    val person = Person()
    // 存取 description 屬性
    println(person.description)
    // Name: John, Age: 30
}
```
{kotlin-runnable="true" id="class-with-default-values"}

與函式一樣，您可以在建構函式宣告中使用[末尾逗號](coding-conventions.md#trailing-commas)：

```kotlin
class Person(
    val name: String,
    val lastName: String,
    var age: Int,
) { /*...*/ }
```

### 初始化區塊

主要建構函式初始化類別並設定其屬性。在大多數情況下，您可以使用簡單的程式碼處理此問題。

如果您需要在[建立實例](#creating-instances)期間執行更複雜的操作，請將該邏輯放在類別主體內的 _初始化區塊_ 中。這些區塊在主要建構函式執行時執行。

使用 `init` 關鍵字後接花括號 `{}` 宣告初始化區塊。在花括號內編寫任何您想在初始化期間執行的程式碼：

```kotlin
// 具有初始化 name 和 age 的主要建構函式的類別
class Person(val name: String, var age: Int) {
    init {
        // 建立實例時執行初始化區塊
        println("Person created: $name, age $age.")
    }
}

fun main() {
    // 建立 Person 類別的實例
    Person("John", 30)
    // Person created: John, age 30.
}
```
{kotlin-runnable="true" id="class-with-initializer-block"}

根據需要新增任意數量的初始化區塊 (`init {}`)。它們按照在類別主體中出現的順序執行，並與屬性初始化器交錯執行：

```kotlin
//sampleStart
// 具有初始化 name 和 age 的主要建構函式的類別
class Person(val name: String, var age: Int) {
    // 第一個初始化區塊
    init {
        // 建立實例時首先執行
        println("Person created: $name, age $age.")
    }

    // 第二個初始化區塊
    init {
        // 在第一個初始化區塊之後執行
        if (age < 18) {
            println("$name is a minor.")
        } else {
            println("$name is an adult.")
        }
    }
}

fun main() {
    // 建立 Person 類別的實例
    Person("John", 30)
    // Person created: John, age 30.
    // John is an adult.
}
//sampleEnd
```
{kotlin-runnable="true" id="class-with-second-initializer-block"}

您可以在初始化區塊中使用主要建構函式參數。例如，在上面的程式碼中，第一個和第二個初始化區塊使用了來自主要建構函式的 `name` 和 `age` 參數。

`init` 區塊的一個常見用例是資料驗證。例如，透過呼叫 [`require` 函式](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/require.html)：

```kotlin
class Person(val age: Int) {
    init {
        require(age > 0, "age must be positive")
    }
}
```

### 次要建構函式

在 Kotlin 中，次要建構函式是除了主要建構函式之外，類別還可以擁有的額外建構函式。當您需要多種方式初始化類別或用於[Java 互操作性](java-to-kotlin-interop.md)時，次要建構函式非常有用。

若要宣告次要建構函式，請在類別主體內使用 `constructor` 關鍵字，並在圓括號 `()` 內放置建構函式參數。將建構函式邏輯新增到花括號 `{}` 內：

```kotlin
// 類別標頭，帶有一個宣告 name 和 age 的主要建構函式
class Person(val name: String, var age: Int) {

    // 次要建構函式，接受字串 age 並將其轉換為整數
    constructor(name: String, age: String) : this(name, age.toIntOrNull() ?: 0) {
        println("$name created with converted age: $age")
    }
}

fun main() {
    // 使用將 age 作為字串的次要建構函式
    Person("Bob", "8")
    // Bob created with converted age: 8
}
```
{kotlin-runnable="true" id="class-with-secondary-constructor"}

> 表達式 `age.toIntOrNull() ?: 0` 使用了 Elvis 運算符。更多資訊請參閱[空值安全](null-safety.md#elvis-operator)。
>
{style="tip"}

在上面的程式碼中，次要建構函式透過 `this` 關鍵字委託給主要建構函式，傳遞 `name` 和轉換為整數的 `age` 值。

在 Kotlin 中，次要建構函式必須委託給主要建構函式。這種委託確保所有主要建構函式初始化邏輯在任何次要建構函式邏輯執行之前執行。

建構函式委託可以是：
*   **直接委託**，次要建構函式立即呼叫主要建構函式。
*   **間接委託**，一個次要建構函式呼叫另一個，而後者又委託給主要建構函式。

這是一個展示直接和間接委託如何運作的範例：

```kotlin
// 類別標頭，帶有一個初始化 name 和 age 的主要建構函式
class Person(
    val name: String,
    var age: Int
) {
    // 具有直接委託給主要建構函式的次要建構函式
    constructor(name: String) : this(name, 0) {
        println("Person created with default age: $age and name: $name.")
    }

    // 具有間接委託的次要建構函式：
    // this("Bob") -> constructor(name: String) -> 主要建構函式
    constructor() : this("Bob") {
        println("New person created with default age: $age and name: $name.")
    }
}

fun main() {
    // 根據直接委託建立實例
    Person("Alice")
    // Person created with default age: 0 and name: Alice.

    // 根據間接委託建立實例
    Person()
    // Person created with default age: 0 and name: Bob.
    // New person created with default age: 0 and name: Bob.
}
```
{kotlin-runnable="true" id="class-delegation"}

在具有初始化區塊 (`init {}`) 的類別中，這些區塊內的程式碼會成為主要建構函式的一部分。鑑於次要建構函式首先委託給主要建構函式，所有初始化區塊和屬性初始化器都會在次要建構函式主體之前執行。即使類別沒有主要建構函式，委託仍然隱式發生：

```kotlin
// 無主要建構函式的類別標頭
class Person {
    // 建立實例時執行初始化區塊
    init {
        // 在次要建構函式之前執行
        println("1. First initializer block runs")
    }

    // 接受整數參數的次要建構函式
    constructor(i: Int) {
        // 在初始化區塊之後執行
        println("2. Person $i is created")
    }
}

fun main() {
    // 建立 Person 類別的實例
    Person(1)
    // 1. First initializer block runs
    // 2. Person 1 created
}
```
{kotlin-runnable="true" id="class-delegation-sequence"}

### 無建構函式的類別

未宣告任何建構函式（主要或次要）的類別具有一個不帶參數的隱式主要建構函式：

```kotlin
// 無明確建構函式的類別
class Person {
    // 未宣告主要或次要建構函式
}

fun main() {
    // 使用隱式主要建構函式建立 Person 類別的實例
    val person = Person()
}
```

這個隱式主要建構函式的可視性是公開的，表示它可以從任何地方存取。如果您不希望您的類別擁有公開建構函式，請宣告一個具有非預設可視性的空主要建構函式：

```kotlin
class Person private constructor() { /*...*/ }
```

> 在 JVM 上，如果所有主要建構函式參數都具有預設值，編譯器會隱式提供一個使用這些預設值的無參數建構函式。
>
> 這使得 Kotlin 更容易與 [Jackson](https://github.com/FasterXML/jackson) 或 [Spring Data JPA](https://spring.io/projects/spring-data-jpa) 等透過無參數建構函式建立類別實例的函式庫搭配使用。
>
> 在以下範例中，Kotlin 隱式提供了一個使用預設值 `""` 的無參數建構函式 `Person()`：
>
> ```kotlin
> class Person(val personName: String = "")
> ```
>
{style="note"}

## 繼承

Kotlin 中的類別繼承允許您從現有類別（基底類別）建立新類別（衍生類別），繼承其屬性和函式，同時新增或修改行為。

有關繼承層次結構以及如何使用 `open` 關鍵字的詳細資訊，請參閱[繼承](inheritance.md)部分。

## 抽象類別

在 Kotlin 中，抽象類別是無法直接實例化的類別。它們旨在被其他類別繼承，這些類別定義它們的實際行為。這種行為稱為_實作_。

抽象類別可以宣告抽象屬性和函式，這些必須由子類別實作。

抽象類別也可以有建構函式。這些建構函式初始化類別屬性並為子類別強制執行必需的參數。使用 `abstract` 關鍵字宣告抽象類別：

```kotlin
abstract class Person(val name: String, val age: Int)
```

抽象類別可以同時擁有抽象和非抽象成員（屬性和函式）。若要將成員宣告為抽象，您必須明確使用 `abstract` 關鍵字。

您不需要使用 `open` 關鍵字標註抽象類別或函式，因為它們預設是隱式可繼承的。有關 `open` 關鍵字的更多詳細資訊，請參閱[繼承](inheritance.md#open-keyword)。

抽象成員在抽象類別中沒有實作。您在子類別或繼承類別中透過 `override` 函式或屬性定義實作：

```kotlin
// 具有宣告 name 和 age 的主要建構函式的抽象類別
abstract class Person(
    val name: String,
    val age: Int
) {
    // 抽象成員
    // 不提供實作，
    // 且必須由子類別實作
    abstract fun introduce()

    // 非抽象成員（有實作）
    fun greet() {
        println("Hello, my name is $name.")
    }
}

// 提供抽象成員實作的子類別
class Student(
    name: String,
    age: Int,
    val school: String
) : Person(name, age) {
    override fun introduce() {
        println("I am $name, $age years old, and I study at $school.")
    }
}

fun main() {
    // 建立 Student 類別的實例
    val student = Student("Alice", 20, "Engineering University")
    
    // 呼叫非抽象成員
    student.greet()
    // Hello, my name is Alice.
    
    // 呼叫被覆寫的抽象成員
    student.introduce()
    // I am Alice, 20 years old, and I study at Engineering University.
}
```
{kotlin-runnable="true" id="abstract-class"}

## 伴生物件

在 Kotlin 中，每個類別都可以有一個[伴生物件](object-declarations.md#companion-objects)。伴生物件是一種物件宣告，允許您在不建立類別實例的情況下使用類別名稱存取其成員。

假設您需要編寫一個無需建立類別實例即可呼叫，但邏輯上仍與該類別相關（例如工廠函式）的函式。在這種情況下，您可以在類別內部宣告一個伴隨[物件宣告](object-declarations.md)：

```kotlin
// 具有宣告 name 屬性的主要建構函式的類別
class Person(
    val name: String
) {
    // 帶有伴生物件的類別主體
    companion object {
        fun createAnonymous() = Person("Anonymous")
    }
}

fun main() {
    // 無需建立類別實例即可呼叫函式
    val anonymous = Person.createAnonymous()
    println(anonymous.name)
    // Anonymous
}
```
{kotlin-runnable="true" id="class-with-companion-object"}

如果您在類別內部宣告伴生物件，您只需使用類別名稱作為限定符即可存取其成員。

更多資訊請參閱[伴生物件](object-declarations.md#companion-objects)。