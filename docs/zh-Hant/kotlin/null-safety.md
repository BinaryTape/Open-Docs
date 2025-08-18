[//]: # (title: 空值安全)

空值安全 (Null safety) 是 Kotlin 的一項功能，旨在顯著降低空值引用（亦稱作 [十億美元的錯誤](https://en.wikipedia.org/wiki/Null_pointer#History)）的風險。

許多程式語言（包括 Java）中最常見的陷阱之一是，存取空值引用的成員會導致空值引用例外。在 Java 中，這相當於 `NullPointerException`，簡稱 *NPE*。

Kotlin 明確支援空值性作為其類型系統的一部分，這表示您可以明確宣告哪些變數或屬性允許為 `null`。此外，當您宣告非空變數時，編譯器會強制要求這些變數不能持有 `null` 值，從而防止 NPE 的發生。

Kotlin 的空值安全透過在編譯時期而非執行時期捕獲潛在的空值相關問題，確保了更安全的程式碼。此功能透過明確表達 `null` 值來提高程式碼的穩健性、可讀性和可維護性，使程式碼更易於理解和管理。

Kotlin 中可能導致 NPE 的唯一原因有：

*   明確呼叫 [`throw NullPointerException()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-null-pointer-exception/)。
*   使用[非空斷言運算子 `!!`](#not-null-assertion-operator)。
*   初始化期間的資料不一致，例如：
    *   建構函式中可用的未初始化 `this` 在其他地方被使用（「洩漏的 `this`」）。
    *   [超類別建構函式呼叫開放成員](inheritance.md#derived-class-initialization-order)，其在衍生類別中的實作使用了未初始化的狀態。
*   Java 互通性：
    *   嘗試存取[平台類型](java-interop.md#null-safety-and-platform-types)的 `null` 引用的成員。
    *   泛型相關的空值性問題。例如，一段 Java 程式碼將 `null` 加入 Kotlin `MutableList<String>`，這將需要 `MutableList<String?>` 才能正確處理。
    *   由外部 Java 程式碼引起的其他問題。

> 除了 NPE，另一個與空值安全相關的例外是 [`UninitializedPropertyAccessException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-uninitialized-property-access-exception/)。當您嘗試存取尚未初始化的屬性時，Kotlin 會拋出此例外，確保非空屬性在準備好之前不會被使用。這通常發生在 [`lateinit` 屬性](properties.md#late-initialized-properties-and-variables)上。
>
{style="tip"}

## 可空類型與非空類型

在 Kotlin 中，類型系統區分可以持有 `null` 的類型（可空類型）和不能持有 `null` 的類型（非空類型）。例如，`String` 類型的常規變數不能持有 `null`：

```kotlin
fun main() {
//sampleStart
    // Assigns a non-null string to a variable
    var a: String = "abc"
    // Attempts to re-assign null to the non-nullable variable
    a = null
    print(a)
    // Null can not be a value of a non-null type String
//sampleEnd
}
```
{kotlin-runnable="true" validate="false"}

您可以安全地呼叫 `a` 上的方法或存取其屬性。它保證不會導致 NPE，因為 `a` 是一個非空變數。編譯器確保 `a` 始終持有有效的 `String` 值，因此當 `a` 為 `null` 時，沒有存取其屬性或方法的風險：

```kotlin
fun main() {
//sampleStart
    // Assigns a non-null string to a variable
    val a: String = "abc"
    // Returns the length of a non-nullable variable
    val l = a.length
    print(l)
    // 3
//sampleEnd
}
```
{kotlin-runnable="true" validate="false"}

為了允許 `null` 值，在變數類型後面宣告一個帶有 `?` 符號的變數。例如，您可以透過寫 `String?` 來宣告一個可空字串。這個表達式使 `String` 成為可以接受 `null` 的類型：

```kotlin
fun main() {
//sampleStart
    // Assigns a nullable string to a variable
    var b: String? = "abc"
    // Successfully re-assigns null to the nullable variable
    b = null
    print(b)
    // null
//sampleEnd
}
```
{kotlin-runnable="true"}

如果您嘗試直接在 `b` 上存取 `length`，編譯器會報告錯誤。這是因為 `b` 被宣告為可空變數，並且可以持有 `null` 值。嘗試直接存取可空變數的屬性會導致 NPE：

```kotlin
fun main() {
//sampleStart
    // Assigns a nullable string to a variable
    var b: String? = "abc"
    // Re-assigns null to the nullable variable
    b = null
    // Tries to directly return the length of a nullable variable
    val l = b.length
    print(l)
    // Only safe (?.) or non-null asserted (!!.) calls are allowed on a nullable receiver of type String? 
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" validate="false"}

在上面的範例中，編譯器要求您在使用安全呼叫之前檢查空值性，然後再存取屬性或執行操作。有幾種處理可空值的方法：

*   [使用 `if` 條件式檢查 `null`](#check-for-null-with-the-if-conditional)
*   [安全呼叫運算子 `?.`](#safe-call-operator)
*   [Elvis 運算子 `?:`](#elvis-operator)
*   [非空斷言運算子 `!!`](#not-null-assertion-operator)
*   [可空接收者](#nullable-receiver)
*   [`let` 函式](#let-function)
*   [安全轉型 `as?`](#safe-casts)
*   [可空類型集合](#collections-of-a-nullable-type)

請閱讀接下來的章節，了解處理 `null` 的工具和技術的詳細資訊和範例。

## 使用 `if` 條件式檢查 `null`

當處理可空類型時，您需要安全地處理空值性以避免 NPE。處理此問題的一種方法是使用 `if` 條件式明確檢查空值性。

例如，檢查 `b` 是否為 `null`，然後存取 `b.length`：

```kotlin
fun main() {
//sampleStart
    // Assigns null to a nullable variable
    val b: String? = null
    // Checks for nullability first and then accesses length
    val l = if (b != null) b.length else -1
    print(l)
    // -1
//sampleEnd
}
```
{kotlin-runnable="true"}

在上面的範例中，編譯器執行[智慧轉型](typecasts.md#smart-casts)，將類型從可空的 `String?` 變更為非空的 `String`。它還會追蹤您執行的檢查資訊，並允許在 `if` 條件式內部呼叫 `length`。

也支援更複雜的條件：

```kotlin
fun main() {
//sampleStart
    // Assigns a nullable string to a variable
    val b: String? = "Kotlin"

    // Checks for nullability first and then accesses length
    if (b != null && b.length > 0) {
        print("String of length ${b.length}")
        // String of length 6
    } else {
        // Provides alternative if the condition is not met
        print("Empty string")
    }
//sampleEnd
}
```
{kotlin-runnable="true"}

請注意，上面的範例僅在編譯器能夠保證 `b` 在檢查和使用之間不會改變時才有效，這與[智慧轉型的先決條件](typecasts.md#smart-cast-prerequisites)相同。

## 安全呼叫運算子

安全呼叫運算子 `?.` 允許您以更短的形式安全地處理空值性。如果物件為 `null`，`?.` 運算子將直接返回 `null`，而不是拋出 NPE：

```kotlin
fun main() {
//sampleStart
    // Assigns a nullable string to a variable
    val a: String? = "Kotlin"
    // Assigns null to a nullable variable
    val b: String? = null
    
    // Checks for nullability and returns length or null
    println(a?.length)
    // 6
    println(b?.length)
    // null
//sampleEnd
}
```
{kotlin-runnable="true"}

`b?.length` 表達式檢查空值性，如果 `b` 非空則返回 `b.length`，否則返回 `null`。此表達式的類型為 `Int?`。

您可以在 Kotlin 中將 `?.` 運算子與 [`var` 和 `val` 變數](basic-syntax.md#variables)一起使用：

*   可空的 `var` 可以持有 `null`（例如，`var nullableValue: String? = null`）或非空值（例如，`var nullableValue: String? = "Kotlin"`）。如果它是一個非空值，您可以隨時將其更改為 `null`。
*   可空的 `val` 可以持有 `null`（例如，`val nullableValue: String? = null`）或非空值（例如，`val nullableValue: String? = "Kotlin"`）。如果它是一個非空值，您不能隨後將其更改為 `null`。

安全呼叫在鏈式呼叫中非常有用。例如，Bob 是一名員工，他可能被分配到一個部門（或不被分配）。該部門又可能有一位主管員工。為了獲取 Bob 部門主管的姓名（如果有的話），您可以這樣寫：

```kotlin
bob?.department?.head?.name
```

如果其任何屬性為 `null`，此鏈將返回 `null`。

您還可以將安全呼叫放在賦值的左側：

```kotlin
person?.department?.head = managersPool.getManager()
```

在上面的範例中，如果安全呼叫鏈中的其中一個接收者為 `null`，則會跳過賦值，並且右側的表達式根本不會被評估。例如，如果 `person` 或 `person.department` 為 `null`，則不會呼叫該函式。以下是相同安全呼叫的等效 `if` 條件式寫法：

```kotlin
if (person != null && person.department != null) {
    person.department.head = managersPool.getManager()
}
```

## Elvis 運算子

當處理可空類型時，您可以檢查 `null` 並提供替代值。例如，如果 `b` 不為 `null`，則存取 `b.length`。否則，返回替代值：

```kotlin
fun main() {
//sampleStart
    // Assigns null to a nullable variable  
    val b: String? = null
    // Checks for nullability. If not null, returns length. If null, returns 0
    val l: Int = if (b != null) b.length else 0
    println(l)
    // 0
//sampleEnd
}
```
{kotlin-runnable="true"}

您可以使用 Elvis 運算子 `?:` 以更簡潔的方式處理此問題，而不是編寫完整的 `if` 表達式：

```kotlin
fun main() {
//sampleStart
    // Assigns null to a nullable variable  
    val b: String? = null
    // Checks for nullability. If not null, returns length. If null, returns a non-null value
    val l = b?.length ?: 0
    println(l)
    // 0
//sampleEnd
}
```
{kotlin-runnable="true"}

如果 `?:` 左側的表達式不為 `null`，Elvis 運算子將返回它。否則，Elvis 運算子將返回右側的表達式。右側的表達式僅在左側為 `null` 時才進行評估。

由於 `throw` 和 `return` 在 Kotlin 中是表達式，您也可以在 Elvis 運算子的右側使用它們。這在檢查函式引數時非常方便，例如：

```kotlin
fun foo(node: Node): String? {
    // Checks for getParent(). If not null, it's assigned to parent. If null, returns null
    val parent = node.getParent() ?: return null
    // Checks for getName(). If not null, it's assigned to name. If null, throws exception
    val name = node.getName() ?: throw IllegalArgumentException("name expected")
    // ...
}
```

## 非空斷言運算子

非空斷言運算子 `!!` 將任何值轉換為非空類型。

當您將 `!!` 運算子應用於值不為 `null` 的變數時，它會被安全地處理為非空類型，並且程式碼正常執行。但是，如果值為 `null`，`!!` 運算子會強制將其視為非空，這將導致 NPE。

當 `b` 不為 `null` 且 `!!` 運算子使其返回其非空值（此範例中為 `String`）時，它會正確存取 `length`：

```kotlin
fun main() {
//sampleStart
    // Assigns a nullable string to a variable
    val b: String? = "Kotlin"
    // Treats b as non-null and accesses its length
    val l = b!!.length
    println(l)
    // 6
//sampleEnd
}
```
{kotlin-runnable="true"}

當 `b` 為 `null` 且 `!!` 運算子使其返回其非空值時，就會發生 NPE：

```kotlin
fun main() {
//sampleStart
    // Assigns null to a nullable variable  
    val b: String? = null
    // Treats b as non-null and tries to access its length
    val l = b!!.length
    println(l) 
    // Exception in thread "main" java.lang.NullPointerException
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" validate="false"}

`!!` 運算子特別有用，當您確信一個值不為 `null` 並且沒有發生 NPE 的可能性，但編譯器由於某些規則無法保證這一點時。在這種情況下，您可以使用 `!!` 運算子明確告訴編譯器該值不為 `null`。

## 可空接收者

您可以將擴充函式與[可空接收者類型](extensions.md#nullable-receiver)一起使用，允許在可能為 `null` 的變數上呼叫這些函式。

透過在可空接收者類型上定義擴充函式，您可以在函式內部處理 `null` 值，而不是在每次呼叫函式的地方檢查 `null`。

例如，[`.toString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/to-string.html) 擴充函式可以在可空接收者上呼叫。當在 `null` 值上呼叫時，它會安全地返回字串 `"null"` 而不會拋出例外：

```kotlin
//sampleStart
fun main() {
    // Assigns null to a nullable Person object stored in the person variable
    val person: Person? = null

    // Applies .toString to the nullable person variable and prints a string
    println(person.toString())
    // null
}

// Defines a simple Person class
data class Person(val name: String)
//sampleEnd
```
{kotlin-runnable="true"}

在上面的範例中，即使 `person` 為 `null`，`.toString()` 函式也會安全地返回字串 `"null"`。這有助於偵錯和日誌記錄。

如果您期望 `.toString()` 函式返回一個可空字串（可以是字串表示形式或 `null`），請使用[安全呼叫運算子 `?.`](#safe-call-operator)。`?.` 運算子僅在物件不為 `null` 時呼叫 `.toString()`，否則返回 `null`：

```kotlin
//sampleStart
fun main() {
    // Assigns a nullable Person object to a variable
    val person1: Person? = null
    val person2: Person? = Person("Alice")

    // Prints "null" if person is null; otherwise prints the result of person.toString()
    println(person1?.toString())
    // null
    println(person2?.toString())
    // Person(name=Alice)
}

// Defines a Person class
data class Person(val name: String)
//sampleEnd
```
{kotlin-runnable="true"}

`?.` 運算子允許您安全地處理潛在的 `null` 值，同時仍然存取可能為 `null` 的物件的屬性或函式。

## Let 函式

為了處理 `null` 值並僅對非空類型執行操作，您可以將安全呼叫運算子 `?.` 與 [`let` 函式](scope-functions.md#let)一起使用。

這種組合對於評估表達式、檢查結果是否為 `null`，以及僅在非 `null` 時才執行程式碼非常有用，從而避免手動 `null` 檢查：

```kotlin
fun main() {
//sampleStart
    // Declares a list of nullable strings
    val listWithNulls: List<String?> = listOf("Kotlin", null)

    // Iterates over each item in the list
    for (item in listWithNulls) {
        // Checks if the item is null and only prints non-null values
        item?.let { println(it) }
        //Kotlin 
    }
//sampleEnd
}
```
{kotlin-runnable="true"}

## 安全轉型

Kotlin 用於[類型轉型](typecasts.md#unsafe-cast-operator)的常規運算子是 `as` 運算子。但是，如果物件不是目標類型，常規轉型可能會導致例外。

您可以使用 `as?` 運算子進行安全轉型。它嘗試將值轉型為指定的類型，如果值不是該類型，則返回 `null`：

```kotlin
fun main() {
//sampleStart
    // Declares a variable of type Any, which can hold any type of value
    val a: Any = "Hello, Kotlin!"

    // Safe casts to Int using the 'as?' operator
    val aInt: Int? = a as? Int
    // Safe casts to String using the 'as?' operator
    val aString: String? = a as? String

    println(aInt)
    // null
    println(aString)
    // "Hello, Kotlin!"
//sampleEnd
}
```
{kotlin-runnable="true"}

上面的程式碼印出 `null`，因為 `a` 不是 `Int`，所以轉型安全地失敗了。它還印出 `"Hello, Kotlin!"`，因為它符合 `String?` 類型，所以安全轉型成功了。

## 可空類型集合

如果您有一個包含可空元素的集合，並且只想保留非空元素，請使用 `filterNotNull()` 函式：

```kotlin
fun main() {
//sampleStart
    // Declares a list containing some null and non-null integer values
    val nullableList: List<Int?> = listOf(1, 2, null, 4)

    // Filters out null values, resulting in a list of non-null integers
    val intList: List<Int> = nullableList.filterNotNull()
  
    println(intList)
    // [1, 2, 4]
//sampleEnd
}
```
{kotlin-runnable="true"}

## 下一步是什麼？

*   了解如何在 [Java 和 Kotlin 中處理空值性](java-to-kotlin-nullability-guide.md)。
*   了解[明確非空類型](generics.md#definitely-non-nullable-types)的泛型。