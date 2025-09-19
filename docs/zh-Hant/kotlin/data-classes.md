[//]: # (title: 資料類別)

Kotlin 中的資料類別主要用於持有資料。對於每個資料類別，編譯器會自動生成額外的成員函數，讓您可以將實例列印為可讀的輸出、比較實例、複製實例等等。
資料類別使用 `data` 標記：

```kotlin
data class User(val name: String, val age: Int)
```

編譯器會自動從主建構函式中宣告的所有屬性衍生出以下成員：

*   `equals()`/`hashCode()` 對。
*   形式為 `"User(name=John, age=42)"` 的 `toString()`。
*   對應於屬性宣告順序的 [`componentN()` 函數](destructuring-declarations.md)。
*   `copy()` 函數 (見下文)。

為確保生成程式碼的一致性和有意義的行為，資料類別必須滿足以下要求：

*   主建構函式必須至少有一個參數。
*   所有主建構函式參數都必須標記為 `val` 或 `var`。
*   資料類別不能是 `abstract`、`open`、`sealed` 或 `inner` 的。

此外，資料類別成員的生成遵循關於成員繼承的這些規則：

*   如果在資料類別主體中有 `equals()`、`hashCode()` 或 `toString()` 的明確實作，或者在超類別 (`superclass`) 中有 `final` 實作，則這些函數不會被生成，而是使用現有的實作。
*   如果超型別 (`supertype`) 具有 `open` 且返回相容型別的 `componentN()` 函數，則會為資料類別生成對應的函數並覆寫超型別中的函數。如果超型別的函數因不相容的簽名 (`signatures`) 或因為它們是 `final` 而無法被覆寫，則會報告錯誤。
*   不允許為 `componentN()` 和 `copy()` 函數提供明確的實作。

資料類別可以擴展其他類別 (請參閱 [密封類別](sealed-classes.md) 以獲取範例)。

> 在 JVM 上，如果生成的類別需要一個無參數的建構函式，則必須為屬性指定預設值 (請參閱 [建構函式](classes.md#constructors))：
>
> ```kotlin
> data class User(val name: String = "", val age: Int = 0)
> ```
>
{style="note"}

## 在類別主體中宣告的屬性

編譯器僅使用主建構函式中定義的屬性來生成自動生成的函數。若要從生成的實作中排除某個屬性，請將其宣告在類別主體內：

```kotlin
data class Person(val name: String) {
    var age: Int = 0
}
```

在下面的範例中，`toString()`、`equals()`、`hashCode()` 和 `copy()` 實作中預設只使用了 `name` 屬性，並且只有一個組件函數 `component1()`。
`age` 屬性宣告在類別主體內，並被排除在外。
因此，兩個 `Person` 物件，即使 `age` 值不同但 `name` 相同，仍被視為相等，因為 `equals()` 只評估來自主建構函式的屬性：

```kotlin
data class Person(val name: String) {
    var age: Int = 0
}
fun main() {
//sampleStart
    val person1 = Person("John")
    val person2 = Person("John")
    person1.age = 10
    person2.age = 20

    println("person1 == person2: ${person1 == person2}")
    // person1 == person2: true
  
    println("person1 with age ${person1.age}: ${person1}")
    // person1 with age 10: Person(name=John)
  
    println("person2 with age ${person2.age}: ${person2}")
    // person2 with age 20: Person(name=John)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 複製

使用 `copy()` 函數來複製物件，讓您可以更改其**部分**屬性，同時保持其餘屬性不變。
上述 `User` 類別的此函數實作如下：

```kotlin
fun copy(name: String = this.name, age: Int = this.age) = User(name, age)
```

然後您可以這樣撰寫：

```kotlin
val jack = User(name = "Jack", age = 1)
val olderJack = jack.copy(age = 2)
```

`copy()` 函數會建立實例的**淺層複製** (shallow copy)。換句話說，它不會遞迴地複製組件。
因此，對其他物件的引用會被共享。

例如，如果屬性持有**可變列表** (mutable list)，則透過「原始」值所做的更改也會透過複製可見，而透過複製所做的更改也會透過原始值可見：

```kotlin
data class Employee(val name: String, val roles: MutableList<String>)

fun main() {
    val original = Employee("Jamie", mutableListOf("developer"))
    val duplicate = original.copy()

    duplicate.roles.add("team lead")

    println(original) 
    // Employee(name=Jamie, roles=[developer, team lead])
    println(duplicate) 
    // Employee(name=Jamie, roles=[developer, team lead])
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

如您所見，修改 `duplicate.roles` 屬性也會更改 `original.roles` 屬性，因為這兩個屬性共享同一個列表引用。

## 資料類別與解構宣告

為資料類別生成的**組件函數** (`Component functions`) 使其可以在 [解構宣告](destructuring-declarations.md) 中使用：

```kotlin
val jane = User("Jane", 35)
val (name, age) = jane
println("$name, $age years of age") 
// Jane, 35 years of age
```

## 標準資料類別

標準函式庫提供了 `Pair` 和 `Triple` 類別。然而，在大多數情況下，具名資料類別是更好的設計選擇，因為它們為屬性提供了有意義的名稱，使程式碼更容易閱讀。