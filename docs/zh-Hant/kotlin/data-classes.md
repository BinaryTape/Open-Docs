[//]: # (title: 資料類別)

Kotlin 中的資料類別主要用於儲存資料。對於每個資料類別，編譯器會自動生成額外的成員函數，這些函數允許您將實例輸出為可讀格式、比較實例、複製實例等等。資料類別以 `data` 標記：

```kotlin
data class User(val name: String, val age: Int)
```

編譯器會自動從主建構式中宣告的所有屬性派生以下成員：

*   `equals()`/`hashCode()` 對。
*   形式為 `"User(name=John, age=42)"` 的 `toString()`。
*   [`componentN()` 函數](destructuring-declarations.md)，與屬性依宣告順序對應。
*   `copy()` 函數 (詳見下方)。

為確保生成程式碼的一致性與有意義的行為，資料類別必須滿足以下要求：

*   主建構式必須至少有一個參數。
*   所有主建構式參數都必須標記為 `val` 或 `var`。
*   資料類別不能是抽象 (abstract)、開放 (open)、密封 (sealed) 或內部 (inner) 的。

此外，資料類別成員的生成遵循以下關於成員繼承的規則：

*   如果資料類別主體中有 `equals()`、`hashCode()` 或 `toString()` 的明確實作，或父類別中有 `final` 實作，則這些函數不會被生成，而是使用現有的實作。
*   如果父類型 (supertype) 具有 `open` 且返回相容類型的 `componentN()` 函數，則會為該資料類別生成相應的函數並覆寫 (override) 父類別中的函數。如果由於不相容的簽名或由於它們是 `final` 而導致父類別的函數無法被覆寫，則會報告錯誤。
*   不允許為 `componentN()` 和 `copy()` 函數提供明確的實作。

資料類別可以擴展 (extend) 其他類別 (範例請參見 [密封類別](sealed-classes.md))。

> 在 JVM 上，如果生成的類別需要無參數建構式，則必須為屬性指定預設值 (詳見 [建構式](classes.md#constructors))：
>
> ```kotlin
> data class User(val name: String = "", val age: Int = 0)
> ```
>
{style="note"}

## 在類別主體中宣告的屬性

編譯器僅使用主建構式中定義的屬性來生成自動生成的函數。若要將屬性從生成的實作中排除，請在類別主體中宣告它：

```kotlin
data class Person(val name: String) {
    var age: Int = 0
}
```

在下面的範例中，只有 `name` 屬性在 `toString()`、`equals()`、`hashCode()` 和 `copy()` 的實作中被預設使用，並且只有一個組件函數 `component1()`。`age` 屬性在類別主體中宣告並被排除。因此，兩個 `Person` 物件，即使 `age` 值不同但 `name` 相同，仍被視為相等，因為 `equals()` 只評估主建構式中的屬性：

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

使用 `copy()` 函數來複製一個物件，允許您更改其*部分*屬性，同時保持其餘屬性不變。上述 `User` 類別的此函數實作如下：

```kotlin
fun copy(name: String = this.name, age: Int = this.age) = User(name, age)
```

您可以這樣編寫：

```kotlin
val jack = User(name = "Jack", age = 1)
val olderJack = jack.copy(age = 2)
```

## 資料類別與解構宣告

為資料類別生成的*組件函數*使其能夠在 [解構宣告](destructuring-declarations.md) 中使用：

```kotlin
val jane = User("Jane", 35)
val (name, age) = jane
println("$name, $age years of age") 
// Jane, 35 years of age
```

## 標準資料類別

標準函式庫提供了 `Pair` 和 `Triple` 類別。然而，在大多數情況下，具名資料類別是更好的設計選擇，因為它們為屬性提供了有意義的名稱，使程式碼更易於閱讀。