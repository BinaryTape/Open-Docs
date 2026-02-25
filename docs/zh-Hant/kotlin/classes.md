[//]: # (title: 類別)

> 在建立類別之前，如果目的是儲存資料，請考慮使用 [資料類別](data-classes.md)。
> 或者，考慮使用 [擴充套件](extensions.md) 來擴充現有的類別，而不是從頭開始建立一個新類別。
>
{style="tip"}

與其他物件導向語言一樣，Kotlin 使用類別（_classes_）來封裝資料（屬性）和行為（函式），以實現可重複使用且具結構性的程式碼。

類別是物件的藍圖或範本，你可以透過 [建構函式](#constructors-and-initializer-blocks) 來建立物件。當你 [建立類別的執行個體](#creating-instances) 時，你就是在根據該藍圖建立一個具體的物件。

Kotlin 為宣告類別提供了簡潔的語法。要宣告一個類別，請使用 `class` 關鍵字，後跟類別名稱：

```kotlin
class Person { /*...*/ }
```

類別宣告由以下部分組成： 
* **類別標頭**，包括但不限於：
  * `class` 關鍵字
  * 類別名稱
  * 型別參數（如果有）
  * [主建構函數](#primary-constructor)（選用）
* **類別主體**（選用），由花括號 `{}` 包圍，並包含 **類成員**，例如：
  * [次要建構函式](#secondary-constructors)
  * [初始化區塊](#initializer-blocks)
  * [函式](functions.md)
  * [屬性](properties.md)
  * [巢狀與內部類別](nested-classes.md)
  * [物件宣告](object-declarations.md)

你可以將類別標頭和主體保持在最低限度。如果類別沒有主體，可以省略花括號 `{}`：

```kotlin
// 具有主建構函數但沒有主體的類別 
class Person(val name: String, var age: Int)
```

以下是宣告具有標頭和主體的類別，然後從中 [建立執行個體](#creating-instances) 的範例：

```kotlin
// 具有初始化 name 屬性之
// 主建構函數的 Person 類別
class Person(val name: String) {
    // 具有 age 屬性的類別主體
    var age: Int = 0
}

fun main() {
    // 透過呼叫建構函式來建立 Person 類別的執行個體
    val person = Person("Alice")

    // 存取執行個體的屬性
    println(person.name)
    // Alice
    println(person.age)
    // 0
}
```
{kotlin-runnable="true" id="class-with-header-and-body"}

## 建立執行個體

當你將類別作為藍圖，在程式中建立一個可供使用的真實物件時，就會建立一個執行個體（instance）。

要建立類別的執行個體，請使用類別名稱後跟圓括號 `()`，這與呼叫 [函式](functions.md) 類似：

```kotlin
// 建立 Person 類別的執行個體
val anonymousUser = Person()
```

在 Kotlin 中，你可以建立執行個體：

* **不帶引數** (`Person()`)：如果類別中宣告了預設值，則使用預設值建立執行個體。
* **帶有引數** (`Person(value)`)：透過傳遞特定值來建立執行個體。

你可以將建立的執行個體指派給可變 (`var`) 或唯讀 (`val`) [變數](basic-syntax.md#variables)：

```kotlin
// 使用預設值建立執行個體
// 並將其指派給可變變數
var anonymousUser = Person()

// 透過傳遞特定值建立執行個體 
// 並將其指派給唯讀變數
val namedUser = Person("Joe")
```

你可以在任何需要的地方建立執行個體，例如 [`main()` 函式](basic-syntax.md#program-entry-point) 內部、其他函式內部或另一個類別內部。此外，你也可以在另一個函式內部建立執行個體，並從 `main()` 呼叫該函式。

以下程式碼宣告了一個具有儲存姓名屬性的 `Person` 類別。它還示範了如何使用預設建構函式的值和特定值來建立執行個體：

```kotlin
// 類別標頭具有主建構函數，
// 該函數以預設值初始化 name
class Person(val name: String = "Sebastian")

fun main() {
    // 使用預設建構函式的值建立執行個體
    val anonymousUser = Person()

    // 透過傳遞特定值建立執行個體
    val namedUser = Person("Joe")

    // 存取執行個體的 name 屬性
    println(anonymousUser.name)
    // Sebastian
    println(namedUser.name)
    // Joe
}
```
{kotlin-runnable="true" id="create-instance-of-a-class"}

> 在 Kotlin 中，與其他物件導向程式語言不同，建立類別執行個體時不需要 `new` 關鍵字。
>
{style="note"}

有關建立巢狀、內部和匿名內部類別執行個體的資訊，請參閱 [巢狀類別](nested-classes.md) 章節。

## 建構函式與初始化區塊

當你建立類別執行個體時，會呼叫其建構函式之一。Kotlin 中的類別可以有一個 [_主建構函數_](#primary-constructor) 和一或多個 [_次要建構函式_](#secondary-constructors)。

主建構函數是初始化類別的主要方式。你在類別標頭中宣告它。次要建構函式提供額外的初始化邏輯。你在類別主體中宣告它。

主建構函數和次要建構函式都是選用的，但類別必須至少有一個建構函式。

### 主建構函數

主建構函數在執行個體 [建立時](#creating-instances) 設定其初始狀態。

要宣告主建構函數，請將其放在類別標頭中類別名稱的後面：

```kotlin
class Person constructor(name: String) { /*...*/ }
```

如果主建構函數沒有任何 [註解](annotations.md) 或 [可見性修飾詞](visibility-modifiers.md#constructors)，則可以省略 `constructor` 關鍵字：

```kotlin
class Person(name: String) { /*...*/ }
```

主建構函數可以將參數宣告為屬性。在引數名稱前使用 `val` 關鍵字宣告唯讀屬性，使用 `var` 關鍵字宣告可變屬性：

```kotlin
class Person(val name: String, var age: Int) { /*...*/ }
```

這些建構函式參數屬性會作為執行個體的一部分儲存，並可從類別外部存取。

也可以宣告不是屬性的主建構函數參數。這些參數前面沒有 `val` 或 `var`，因此它們不會儲存在執行個體中，且僅在類別主體內可用：

```kotlin
// 也是屬性的主建構函數參數
class PersonWithProperty(val name: String) {
    fun greet() {
        println("Hello, $name")
    }
}

// 僅為主建構函數參數（未儲存為屬性）
class PersonWithAssignment(name: String) {
    // 必須指派給屬性才能在稍後使用
    val displayName: String = name
    
    fun greet() {
        println("Hello, $displayName")
    }
}
```

在主建構函數中宣告的屬性可以由類別的 [成員函數](functions.md) 存取：

```kotlin
// 具有宣告屬性的主建構函數的類別
class Person(val name: String, var age: Int) {
    // 存取類別屬性的成員函數
    fun introduce(): String {
        return "Hi, I'm $name and I'm $age years old."
    }
}
```

你也可以在主建構函數中為屬性指派預設值：

```kotlin
class Person(val name: String = "John", var age: Int = 30) { /*...*/ }
```

如果在 [執行個體建立](#creating-instances) 期間沒有傳遞任何值給建構函式，屬性將使用其預設值：

```kotlin
// 具有主建構函數的類別，
// 包含 name 和 age 的預設值
class Person(val name: String = "John", var age: Int = 30)

fun main() {
    // 使用預設值建立執行個體
    val person = Person()
    println("Name: ${person.name}, Age: ${person.age}")
    // Name: John, Age: 30
}
```
{kotlin-runnable="true" id="class-with-primary-constructor"}

你可以使用主建構函數參數直接在類別主體中初始化額外的類別屬性：

```kotlin
// 具有主建構函數的類別，
// 包含 name 和 age 的預設值
class Person(
    val name: String = "John",
    var age: Int = 30
) {
    // 從主建構函數參數
    // 初始化 description 屬性
    val description: String = "Name: $name, Age: $age"
}

fun main() {
    // 建立 Person 類別的執行個體
    val person = Person()
    // 存取 description 屬性
    println(person.description)
    // Name: John, Age: 30
}
```
{kotlin-runnable="true" id="class-with-default-values"}

與函式一樣，你可以在建構函式宣告中使用 [尾隨逗號](coding-conventions.md#trailing-commas)：

```kotlin
class Person(
    val name: String,
    val lastName: String,
    var age: Int,
) { /*...*/ }
```

### 初始化區塊

主建構函數會初始化類別並設定其屬性。在大多數情況下，你可以使用簡單的程式碼來處理。

如果你在 [執行個體建立](#creating-instances) 期間需要執行更複雜的操作，請將該邏輯放入類別主體內的「初始化區塊」中。這些區塊在主建構函數執行時執行。

使用 `init` 關鍵字後跟花括號 `{}` 宣告初始化區塊。在花括號內編寫任何你想在初始化期間執行的程式碼：

```kotlin
// 具有初始化 name 和 age 之主建構函數的類別
class Person(val name: String, var age: Int) {
    init {
        // 初始化區塊在建立執行個體時執行
        println("Person created: $name, age $age.")
    }
}

fun main() {
    // 建立 Person 類別的執行個體
    Person("John", 30)
    // Person created: John, age 30.
}
```
{kotlin-runnable="true" id="class-with-initializer-block"}

根據需要加入任意數量的初始化區塊 (`init {}`)。它們會按照出現在類別主體中的順序，與屬性初始化程式一起執行：

```kotlin
//sampleStart
// 具有初始化 name 和 age 之主建構函數的類別
class Person(val name: String, var age: Int) {
    // 第一個初始化區塊
    init {
        // 在建立執行個體時首先執行
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
    // 建立 Person 類別的執行個體
    Person("John", 30)
    // Person created: John, age 30.
    // John is an adult.
}
//sampleEnd
```
{kotlin-runnable="true" id="class-with-second-initializer-block"}

你可以在初始化區塊中使用主建構函數參數。例如，在上面的程式碼中，第一和第二個初始化程式使用了來自主建構函數的 `name` 和 `age` 參數。

`init` 區塊的一個常見用法是資料驗證。例如，透過呼叫 [`require` 函式](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/require.html)：

```kotlin
class Person(val age: Int) {
    init {
        require(age > 0) { "age must be positive" }
    }
}
```

### 次要建構函式

在 Kotlin 中，次要建構函式是類別除了主建構函數之外可以擁有的額外建構函式。當你需要多種方式來初始化類別或為了與 [Java 互通性](java-to-kotlin-interop.md) 時，次要建構函式非常有用。

要宣告次要建構函式，請在類別主體內使用 `constructor` 關鍵字，並將建構函式參數放在圓括號 `()` 內。在花括號 `{}` 內加入建構函式邏輯：

```kotlin
// 類別標頭具有初始化 name 和 age 的主建構函數
class Person(val name: String, var age: Int) {

    // 次要建構函式，接收 String 型別的 age
    // 並將其轉換為 Int
    constructor(name: String, age: String) : this(name, age.toIntOrNull() ?: 0) {
        println("$name created with converted age: ${this.age}")
    }
}

fun main() {
    // 使用 age 為 String 的次要建構函式
    Person("Bob", "8")
    // Bob created with converted age: 8
}
```
{kotlin-runnable="true" id="class-with-secondary-constructor"}

> 運算式 `age.toIntOrNull() ?: 0` 使用了 Elvis 運算子。欲了解更多資訊，請參閱 [Null 安全](null-safety.md#elvis-operator)。
>
{style="tip"}

在上面的程式碼中，次要建構函式透過 `this` 關鍵字委派給主建構函數，並傳遞 `name` 和轉換為整數的 `age` 值。

在 Kotlin 中，次要建構函式必須委派給主建構函數。這種委派確保了在執行任何次要建構函式邏輯之前，所有主建構函數的初始化邏輯都已執行。

建構函式委派可以是： 
* **直接**，次要建構函式立即呼叫主建構函數。
* **間接**，一個次要建構函式呼叫另一個，而後者又委派給主建構函數。

以下是示範直接和間接委派運作方式的範例：

```kotlin
// 類別標頭具有初始化 name 和 age 的主建構函數
class Person(
    val name: String,
    var age: Int
) {
    // 具有直接委派
    // 到主建構函數的次要建構函式
    constructor(name: String) : this(name, 0) {
        println("Person created with default age: $age and name: $name.")
    }

    // 具有間接委派的次要建構函式： 
    // this("Bob") -> constructor(name: String) -> 主建構函數
    constructor() : this("Bob") {
        println("New person created with default age: $age and name: $name.")
    }
}

fun main() {
    // 根據直接委派建立執行個體
    Person("Alice")
    // Person created with default age: 0 and name: Alice.

    // 根據間接委派建立執行個體
    Person()
    // Person created with default age: 0 and name: Bob.
    // New person created with default age: 0 and name: Bob.
}
```
{kotlin-runnable="true" id="class-delegation"}

在具有初始化區塊 (`init {}`) 的類別中，這些區塊內的程式碼會成為主建構函數的一部分。由於次要建構函式首先委派給主建構函數，因此所有初始化區塊和屬性初始化程式都會在次要建構函式的主體之前執行。即使類別沒有主建構函數，委派仍然會隱式發生：

```kotlin
// 沒有主建構函數的類別標頭
class Person {
    // 初始化區塊在建立執行個體時執行
    init {
        // 在次要建構函式之前執行
        println("1. First initializer block runs")
    }

    // 接收一個整數參數的次要建構函式
    constructor(i: Int) {
        // 在初始化區塊之後執行
        println("2. Person $i is created")
    }
}

fun main() {
    // 建立 Person 類別的執行個體
    Person(1)
    // 1. First initializer block runs
    // 2. Person 1 created
}
```
{kotlin-runnable="true" id="class-delegation-sequence"}

### 沒有建構函式的類別

沒有宣告任何建構函式（主或次要）的類別具有一個隱式的無參數主建構函數：

```kotlin
// 沒有明確建構函式的類別
class Person {
    // 未宣告主或次要建構函式
}

fun main() {
    // 使用隱式主建構函數 
    // 建立 Person 類別的執行個體
    val person = Person()
}
```

這個隱式主建構函數的可見性是公開的（public），這意味著它可以從任何地方存取。如果你不希望你的類別擁有公開的建構函式，請宣告一個具有非預設可見性的空主建構函數：

```kotlin
class Person private constructor() { /*...*/ }
```

> 在 JVM 上，如果所有主建構函數參數都有預設值，編譯器會隱式提供一個使用這些預設值的無參數建構函式。
> 
> 這使得在 Kotlin 中使用像是 [Jackson](https://github.com/FasterXML/jackson) 或 [Spring Data JPA](https://spring.io/projects/spring-data-jpa) 這樣的程式庫變得更容易，因為這些程式庫是透過無參數建構函式來建立類別執行個體的。
>
> 在以下範例中，Kotlin 隱式提供了一個使用預設值 `""` 的無參數建構函式 `Person()`：
> 
> ```kotlin
> class Person(val personName: String = "")
> ```
>
{style="note"}

## 繼承

Kotlin 中的類別繼承允許你從現有類別（基底類別）建立一個新類別（衍生類別），繼承其屬性和函式，同時增加或修改行為。

有關繼承階層結構以及如何使用 `open` 關鍵字的詳細資訊，請參閱 [繼承](inheritance.md) 章節。

## 抽象類別

在 Kotlin 中，抽象類別是不能直接具現化的類別。它們被設計為由定義其實際行為的其他類別繼承。這種行為稱為「實作」（_implementation_）。

抽象類別可以宣告抽象屬性和函式，這些成員必須由子類別實作。

抽象類別也可以擁有建構函式。這些建構函式會初始化類別屬性，並強制要求子類別提供必要的參數。使用 `abstract` 關鍵字宣告抽象類別：

```kotlin
abstract class Person(val name: String, val age: Int)
```

抽象類別可以同時擁有抽象和非抽象成員（屬性和函式）。要將成員宣告為抽象，必須明確使用 `abstract` 關鍵字。

你不需要為抽象類別或函式標註 `open` 關鍵字，因為它們預設就是可以隱式繼承的。有關 `open` 關鍵字的更多詳細資訊，請參閱 [繼承](inheritance.md#open-keyword)。

抽象成員在抽象類別中沒有實作。你在子類別或繼承類別中，使用 `override` 函式或屬性來定義其實作：

```kotlin
// 具有宣告 name 和 age 之主建構函數的抽象類別
abstract class Person(
    val name: String,
    val age: Int
) {
    // 抽象成員 
    // 不提供實作，
    // 且必須由子類別實作
    abstract fun introduce()

    // 非抽象成員（具有實作）
    fun greet() {
        println("Hello, my name is $name.")
    }
}

// 為抽象成員提供實作的子類別
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
    // 建立 Student 類別的執行個體
    val student = Student("Alice", 20, "Engineering University")
    
    // 呼叫非抽象成員
    student.greet()
    // Hello, my name is Alice.
    
    // 呼叫已覆寫的抽象成員
    student.introduce()
    // I am Alice, 20 years old, and I study at Engineering University.
}
```
{kotlin-runnable="true" id="abstract-class"}

## 伴隨物件

在 Kotlin 中，每個類別都可以有一個 [伴隨物件](object-declarations.md#companion-objects)。伴隨物件是一種物件宣告，允許你使用類別名稱來存取其成員，而無需建立類別執行個體。

假設你需要編寫一個無需建立類別執行個體即可呼叫的函式，但它在邏輯上仍與該類別相關聯（例如工廠函式）。在這種情況下，你可以將其宣告在類別內的伴隨 [物件宣告](object-declarations.md) 中：

```kotlin
// 具有宣告 name 屬性之主建構函數的類別
class Person(
    val name: String
) {
    // 具有伴隨物件的類別主體
    companion object {
        fun createAnonymous() = Person("Anonymous")
    }
}

fun main() {
    // 無需建立類別執行個體即可呼叫函式
    val anonymous = Person.createAnonymous()
    println(anonymous.name)
    // Anonymous
}
```
{kotlin-runnable="true" id="class-with-companion-object"}

如果你在類別中宣告了伴隨物件，則可以僅使用類別名稱作為限定詞來存取其成員。

欲了解更多資訊，請參閱 [伴隨物件](object-declarations.md#companion-objects)。