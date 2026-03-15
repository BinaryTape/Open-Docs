[//]: # (title: 資料類別)

Kotlin 中的資料類別主要用於持有資料。編譯器會自動為每個資料類別產生額外的成員函數，讓您可以將執行個體印出為可讀的輸出、比較執行個體、複製執行個體等。
資料類別以 `data` 標記：

```kotlin
data class User(val name: String, val age: Int)
```

編譯器會根據在主建構函數中宣告的所有屬性自動衍生以下成員：

* `equals()`/`hashCode()` 配對。
* 形式如 `"User(name=John, age=42)"` 的 `toString()`。
* 與屬性宣告順序相對應的 [`componentN()` 函式](destructuring-declarations.md)。
* [`copy()` 函式](#copying)。

為了確保產生的程式碼具有一致性且行為有意義，資料類別必須符合以下需求：

* 主建構函數必須至少有一個參數。
* 所有主建構函數的參數必須標記為 `val` 或 `var`。
* 資料類別不能是 abstract、open、sealed 或 inner。

此外，資料類別成員的產生在成員繼承方面遵循以下規則：

* 如果在資料類別主體中有 `equals()`、`hashCode()` 或 `toString()` 的明確實作，或者在父類別中有 `final` 實作，則不會產生這些函式，並會使用現有的實作。
* 如果父型別具有 `open` 且傳回相容型別的 `componentN()` 函式，則會為該資料類別產生相應的函式並覆寫父型別中的函式。如果由於簽章不相容或其為 final 而導致無法覆寫父型別的函式，則會回報錯誤。
* 不允許為 `componentN()` 和 `copy()` 函式提供明確的實作。

資料類別可以擴充其他類別（範例請參閱 [密封類別 (Sealed classes)](sealed-classes.md)）。

> 在 JVM 上，如果產生的類別需要具有無參數建構函式，則必須為屬性指定預設值（請參閱 [建構函式](classes.md#constructors-and-initializer-blocks)）：
> 
> ```kotlin
> data class User(val name: String = "", val age: Int = 0)
> ```
>
{style="note"}

## 在類別主體中宣告的屬性

編譯器僅使用在主建構函數內部定義的屬性來產生自動產生的函式。若要從產生的實作中排除某個屬性，請將其宣告在類別主體中：

```kotlin
data class Person(val name: String) {
    var age: Int = 0
}
```

在下面的範例中，預設情況下只有 `name` 屬性會被用於 `toString()`、`equals()`、`hashCode()` 和 `copy()` 的實作，並且只有一個組件函式 `component1()`。`age` 屬性宣告在類別主體內並被排除。
因此，兩個具有相同 `name` 但不同 `age` 值的 `Person` 物件會被視為相等，因為 `equals()` 只評估來自主建構函數的屬性：

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

使用 `copy()` 函式來複製物件，這讓您可以修改 *某些* 屬性，同時保持其餘屬性不變。上述 `User` 類別的此函式實作如下：

```kotlin
fun copy(name: String = this.name, age: Int = this.age) = User(name, age)
```

接著您可以撰寫如下程式碼：

```kotlin
val jack = User(name = "Jack", age = 1)
val olderJack = jack.copy(age = 2)
```

`copy()` 函式會對執行個體進行 *淺層 (shallow)* 複製。換句話說，它不會遞迴地複製組件。因此，對其他物件的參照會被共享。

例如，如果某個屬性持有可變列表，則透過「原始」值所做的變更也會在複本中可見，而透過複本所做的變更在原始值中也同樣可見：

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

如您所見，修改 `duplicate.roles` 屬性也會變更 `original.roles` 屬性，因為這兩個屬性共享相同的列表參照。

## 資料類別與解構宣告

為資料類別產生的 *組件函式 (Component functions)* 使得在 [解構宣告](destructuring-declarations.md) 中使用它們成為可能：

```kotlin
val jane = User("Jane", 35)
val (name, age) = jane
println("$name, $age years of age") 
// Jane, 35 years of age
```

## 標準資料類別

標準函式庫提供了 `Pair` 和 `Triple` 類別。但在大多數情況下，具名的資料類別是更好的設計選擇，因為它們透過為屬性提供有意義的名稱來提高程式碼的可讀性。