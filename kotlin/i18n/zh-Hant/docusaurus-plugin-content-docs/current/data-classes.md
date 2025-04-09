---
title: "資料類別 (Data classes)"
---
Kotlin 中的資料類別（Data classes）主要用於保存資料。 對於每個資料類別，編譯器會自動產生額外的成員函式，讓您可以將實例列印為可讀的輸出、比較實例、複製實例等等。 資料類別以 `data` 標記：

```kotlin
data class User(val name: String, val age: Int)
```

編譯器會自動從主建構子中宣告的所有屬性衍生以下成員：

* `equals()`/`hashCode()` 組合。
* `toString()` 形式為 `"User(name=John, age=42)"`。
* 對應於宣告順序的屬性的 [`componentN()` 函式](destructuring-declarations)。
* `copy()` 函式（見下文）。

為了確保產生程式碼的一致性和有意義的行為，資料類別必須滿足以下要求：

* 主建構子必須至少有一個參數。
* 所有主建構子參數都必須標記為 `val` 或 `var`。
* 資料類別不能是 abstract（抽象）、open（開放）、sealed（密封）或 inner（內部）。

此外，資料類別成員的產生遵循以下關於成員繼承的規則：

* 如果資料類別的主體中有 `equals()`、`hashCode()` 或 `toString()` 的顯式實作，或者超類別中有 `final` 實作，則不會產生這些函式，並且使用現有的實作。
* 如果超類型具有 `open` 且傳回相容類型的 `componentN()` 函式，則會為資料類別產生相應的函式，並覆寫超類型的函式。 如果由於簽名不相容或由於它們是 final（最終）而無法覆寫超類型的函式，則會報告錯誤。
* 不允許為 `componentN()` 和 `copy()` 函式提供顯式實作。

資料類別可以擴展其他類別（有關範例，請參閱 [密封類別](sealed-classes)）。

:::note
在 JVM 上，如果產生的類別需要具有無參數建構子，則必須指定屬性的預設值（請參閱 [建構子](classes#constructors)）：

```kotlin
data class User(val name: String = "", val age: Int = 0)
```

:::

## 在類別主體中宣告的屬性

編譯器只會使用在主建構子中定義的屬性來自動產生函式。 若要從產生的實作中排除屬性，請在類別主體中宣告它：

```kotlin
data class Person(val name: String) {
    var age: Int = 0
}
```

在下面的範例中，預設情況下只有 `name` 屬性會被 `toString()`、`equals()`、`hashCode()` 和 `copy()` 實作使用，並且只有一個 component 函式 `component1()`。 `age` 屬性在類別主體中宣告，並且被排除。 因此，具有相同 `name` 但不同 `age` 值的兩個 `Person` 物件被認為是相等的，因為 `equals()` 僅評估主建構子的屬性：

```kotlin
data class Person(val name: String) {
    var age: Int = 0
}
fun main() {

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

}
```

## 複製（Copying）

使用 `copy()` 函式來複製物件，讓您可以更改其 _某些_ 屬性，同時保持其餘屬性不變。 上面 `User` 類別的這個函式的實作如下：

```kotlin
fun copy(name: String = this.name, age: Int = this.age) = User(name, age)
```

然後您可以編寫以下內容：

```kotlin
val jack = User(name = "Jack", age = 1)
val olderJack = jack.copy(age = 2)
```

## 資料類別和解構宣告（Destructuring declarations）

為資料類別產生的 _Component 函式_ 使它們可以在 [解構宣告](destructuring-declarations) 中使用：

```kotlin
val jane = User("Jane", 35)
val (name, age) = jane
println("$name, $age years of age") 
// Jane, 35 years of age
```

## 標準資料類別（Standard data classes）

標準函式庫提供了 `Pair` 和 `Triple` 類別。 但是，在大多數情況下，命名的資料類別是更好的設計選擇，因為它們透過為屬性提供有意義的名稱，使程式碼更易於閱讀。