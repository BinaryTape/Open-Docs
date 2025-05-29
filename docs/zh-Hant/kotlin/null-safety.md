[//]: # (title: 空值安全)

空值安全 (Null safety) 是 Kotlin 的一項功能，旨在顯著降低空值引用 (null references) 的風險，空值引用又被稱為[十億美元的錯誤](https://en.wikipedia.org/wiki/Null_pointer#History)。

許多程式語言 (包括 Java) 最常見的陷阱之一是，存取空值引用 (null reference) 的成員會導致空值引用例外 (exception)。在 Java 中，這等同於 `NullPointerException`，簡稱 _NPE_。

Kotlin 明確地將空值性 (nullability) 作為其型別系統 (type system) 的一部分來支援，這意味著您可以明確宣告哪些變數或屬性允許為 `null`。此外，當您宣告非空值變數時，編譯器會強制規定這些變數不能持有 `null` 值，從而防止 NPE。

Kotlin 的空值安全透過在編譯時而非執行時捕捉潛在的空值相關問題，確保了更安全的程式碼。此功能透過明確表達 `null` 值，提高了程式碼的健壯性 (robustness)、可讀性 (readability) 和可維護性 (maintainability)，使程式碼更容易理解和管理。

在 Kotlin 中，NPE 唯一可能的原因是：

*   明確呼叫 [`throw NullPointerException()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-null-pointer-exception/)。
*   使用[非空值斷言運算子 `!!`](#not-null-assertion-operator)。
*   初始化期間的資料不一致，例如：
    *   建構子 (constructor) 中可用的未初始化 `this` 在其他地方被使用 ([「`this` 洩漏」](https://youtrack.jetbrains.com/issue/KTIJ-9751))。
    *   超類別 (superclass) 建構子呼叫一個開放 (open) 成員，其在衍生類別 (derived class) 中的實作 (implementation) 使用了未初始化 (uninitialized) 的狀態。
*   Java 互通性 (interoperation)：
    *   嘗試存取[平台型別 (platform type)](java-interop.md#null-safety-and-platform-types) 的 `null` 引用的成員。
    *   泛型 (generic types) 的空值性問題。例如，一段 Java 程式碼將 `null` 加入 Kotlin `MutableList<String>` 中，而這需要 `MutableList<String?>` 才能正確處理。
    *   其他由外部 Java 程式碼引起的問題。

> 除了 NPE 之外，另一個與空值安全相關的例外是 [`UninitializedPropertyAccessException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-uninitialized-property-access-exception/)。當您嘗試存取尚未初始化的屬性時，Kotlin 會拋出此例外，確保非空值屬性在使用前已準備就緒。這通常發生在 [`lateinit` 屬性](properties.md#late-initialized-properties-and-variables)上。
>
{style="tip"}

## 可空值型別與非空值型別

在 Kotlin 中，型別系統區分了可以持有 `null` 的型別 (可空值型別) 和不能持有 `null` 的型別 (非空值型別)。例如，正常 `String` 型別的變數不能持有 `null`：

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

您可以安全地呼叫 `a` 上的方法或存取其屬性。它保證不會導致 NPE，因為 `a` 是一個非空值變數。編譯器確保 `a` 始終持有有效的 `String` 值，所以當 `a` 為 `null` 時，沒有存取其屬性或方法的風險：

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

若要允許 `null` 值，請在變數型別後緊跟一個 `?` 符號來宣告變數。例如，您可以透過寫入 `String?` 來宣告一個可空值字串。這個表達式使 `String` 成為一個可以接受 `null` 的型別：

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

如果您嘗試直接在 `b` 上存取 `length`，編譯器會報告錯誤。這是因為 `b` 被宣告為一個可空值變數，並且可以持有 `null` 值。嘗試直接在可空值型別上存取屬性會導致 NPE：

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

在上述範例中，編譯器要求您在使用安全呼叫來檢查空值性之後才能存取屬性或執行操作。有幾種處理可空值型別的方式：

*   [使用 `if` 條件式檢查 `null`](#check-for-null-with-the-if-conditional)
*   [安全呼叫運算子 `?.`](#safe-call-operator)
*   [Elvis 運算子 `?:`](#elvis-operator)
*   [非空值斷言運算子 `!!`](#not-null-assertion-operator)
*   [可空值接收者](#nullable-receiver)
*   [`let` 函數](#let-function)
*   [安全轉型 `as?`](#safe-casts)
*   [可空值型別的集合](#collections-of-a-nullable-type)

閱讀以下章節以了解 `null` 處理工具和技術的詳細資訊和範例。

## 使用 `if` 條件式檢查 `null`

處理可空值型別時，您需要安全地處理空值性以避免 NPE。一種處理方式是使用 `if` 條件表達式明確檢查空值性。

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
//end
}
```
{kotlin-runnable="true"}

在上述範例中，編譯器執行[智慧型轉型 (smart cast)](typecasts.md#smart-casts)，將型別從可空值 `String?` 變更為非空值 `String`。它還追蹤您執行的檢查資訊，並允許在 `if` 條件式內部呼叫 `length`。

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

請注意，上述範例僅在編譯器能夠保證 `b` 在檢查和使用之間不會改變時才有效，這與[智慧型轉型先決條件](typecasts.md#smart-cast-prerequisites)相同。

## 安全呼叫運算子

安全呼叫運算子 `?.` 允許您以更短的形式安全地處理空值性。如果物件為 `null`，`?.` 運算子不會拋出 NPE，而是直接返回 `null`：

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

`b?.length` 表達式檢查空值性：如果 `b` 為非空值，則返回 `b.length`；否則返回 `null`。此表達式的型別為 `Int?`。

您可以在 Kotlin 中將 `?.` 運算子與 [`var` 和 `val` 變數](basic-syntax.md#variables)一起使用：

*   可空值 `var` 可以持有 `null` (例如，`var nullableValue: String? = null`) 或非空值 (例如，`var nullableValue: String? = "Kotlin"`)。如果它是一個非空值，您可以在任何時候將其變更為 `null`。
*   可空值 `val` 可以持有 `null` (例如，`val nullableValue: String? = null`) 或非空值 (例如，`val nullableValue: String? = "Kotlin"`)。如果它是一個非空值，您不能隨後將其變更為 `null`。

安全呼叫在鏈式呼叫中很有用。例如，Bob 是一名員工，他可能被分配到一個部門 (或沒有)。該部門可能反過來有另一名員工作為部門主管。要獲取 Bob 部門主管的姓名 (如果有的話)，您可以這樣寫：

```kotlin
bob?.department?.head?.name
```

如果此鏈中的任何屬性為 `null`，則該鏈返回 `null`。

您也可以將安全呼叫放在賦值運算子的左側：

```kotlin
person?.department?.head = managersPool.getManager()
```

在上述範例中，如果安全呼叫鏈中的任何一個接收者為 `null`，則會跳過賦值，並且右側的表達式根本不會被評估。例如，如果 `person` 或 `person.department` 為 `null`，則不會呼叫該函數。以下是相同安全呼叫的 `if` 條件式等效寫法：

```kotlin
if (person != null && person.department != null) {
    person.department.head = managersPool.getManager()
}
```

## Elvis 運算子

處理可空值型別時，您可以檢查 `null` 並提供替代值。例如，如果 `b` 不為 `null`，則存取 `b.length`。否則，返回替代值：

```kotlin
fun main() {
//sampleStart
    // Assigns null to a nullable variable  
    val b: String? = null
    // Checks for nullability. If not null, returns length. If null, returns 0
    val l: Int = if (b != null) b.length else 0
    println(l)
    // 0
//end
}
```
{kotlin-runnable="true"}

您可以使用 Elvis 運算子 `?:` 以更簡潔的方式處理此情況，而無需編寫完整的 `if` 表達式：

```kotlin
fun main() {
//sampleStart
    // Assigns null to a nullable variable  
    val b: String? = null
    // Checks for nullability. If not null, returns length. If null, returns a non-null value
    val l = b?.length ?: 0
    println(l)
    // 0
//end
}
```
{kotlin-runnable="true"}

如果 `?:` 左側的表達式不為 `null`，Elvis 運算子會返回它。否則，Elvis 運算子會返回右側的表達式。右側的表達式僅在左側為 `null` 時才被評估。

由於 `throw` 和 `return` 在 Kotlin 中是表達式，您也可以將它們用於 Elvis 運算子的右側。例如，在檢查函數參數時，這會很方便：

```kotlin
fun foo(node: Node): String? {
    // Checks for getParent(). If not null, it's assigned to parent. If null, returns null
    val parent = node.getParent() ?: return null
    // Checks for getName(). If not null, it's assigned to name. If null, throws exception
    val name = node.getName() ?: throw IllegalArgumentException("name expected")
    // ...
}
```

## 非空值斷言運算子

非空值斷言運算子 `!!` 將任何值轉換為非空值型別。

當您將 `!!` 運算子應用於一個其值不為 `null` 的變數時，它會被安全地作為非空值型別處理，程式碼正常執行。然而，如果該值為 `null`，`!!` 運算子會強制將其視為非空值，這將導致 NPE。

當 `b` 不為 `null` 且 `!!` 運算子使其返回其非空值 (在此範例中為 `String`) 時，它會正確存取 `length`：

```kotlin
fun main() {
//sampleStart
    // Assigns a nullable string to a variable
    val b: String? = "Kotlin"
    // Treats b as non-null and accesses its length
    val l = b!!.length
    println(l)
    // 6
//end
}
```
{kotlin-runnable="true"}

當 `b` 為 `null` 且 `!!` 運算子使其返回其非空值時，會發生 NPE：

```kotlin
fun main() {
//sampleStart
    // Assigns null to a nullable variable  
    val b: String? = null
    // Treats b as non-null and tries to access its length
    val l = b!!.length
    println(l) 
    // Exception in thread "main" java.lang.NullPointerException
//end
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" validate="false"}

當您確信某個值不為 `null` 且沒有發生 NPE 的機會，但由於某些規則編譯器無法保證這一點時，`!!` 運算子特別有用。在這種情況下，您可以使用 `!!` 運算子明確告訴編譯器該值不為 `null`。

## 可空值接收者

您可以將擴充函數 (extension functions) 用於[可空值接收者型別](extensions.md#nullable-receiver)，這允許這些函數在可能為 `null` 的變數上被呼叫。

透過在可空值接收者型別上定義擴充函數，您可以在函數內部處理 `null` 值，而不是在每次呼叫函數的地方都檢查 `null`。

例如，[`.toString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/to-string.html) 擴充函數可以在可空值接收者上被呼叫。當在 `null` 值上呼叫時，它會安全地返回字串 `"null"`，而不會拋出例外：

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
//end
```
{kotlin-runnable="true"}

在上述範例中，即使 `person` 為 `null`，`.toString()` 函數也會安全地返回字串 `"null"`。這對於偵錯 (debugging) 和日誌記錄 (logging) 會很有幫助。

如果您期望 `.toString()` 函數返回一個可空值字串 (可以是字串表示或 `null`)，請使用[安全呼叫運算子 `?.`](#safe-call-operator)。`?.` 運算子僅在物件不為 `null` 時才呼叫 `.toString()`，否則它返回 `null`：

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
//end
```
{kotlin-runnable="true"}

`?.` 運算子允許您安全地處理潛在的 `null` 值，同時仍可存取可能為 `null` 的物件的屬性或函數。

## `let` 函數

若要處理 `null` 值並僅對非空值型別執行操作，您可以將安全呼叫運算子 `?.` 與 [`let` 函數](scope-functions.md#let)一起使用。

這種組合對於評估表達式、檢查結果是否為 `null` 以及僅在不為 `null` 時執行程式碼非常有用，避免了手動空值檢查：

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
//end
}
```
{kotlin-runnable="true"}

## 安全轉型

正常的 Kotlin [型別轉型 (type casts)](typecasts.md#unsafe-cast-operator) 運算子是 `as` 運算子。然而，如果物件不是目標型別，常規轉型可能會導致例外。

您可以使用 `as?` 運算子進行安全轉型。它會嘗試將值轉型為指定型別，如果該值不是該型別，則返回 `null`：

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
//end
}
```
{kotlin-runnable="true"}

上述程式碼印出 `null`，因為 `a` 不是 `Int`，因此轉型安全失敗。它還印出 `"Hello, Kotlin!"`，因為它符合 `String?` 型別，所以安全轉型成功。

## 可空值型別的集合

如果您有一個包含可空值元素的集合，並且只想保留非空值元素，請使用 `filterNotNull()` 函數：

```kotlin
fun main() {
//sampleStart
    // Declares a list containing some null and non-null integer values
    val nullableList: List<Int?> = listOf(1, 2, null, 4)

    // Filters out null values, resulting in a list of non-null integers
    val intList: List<Int> = nullableList.filterNotNull()
  
    println(intList)
    // [1, 2, 4]
//end
}
```
{kotlin-runnable="true"}

## 接下來是什麼？

*   了解如何在 [Java 和 Kotlin 中處理空值性](java-to-kotlin-nullability-guide.md)。
*   了解[絕對非空值 (definitely non-nullable) 的泛型型別](generics.md#definitely-non-nullable-types)。