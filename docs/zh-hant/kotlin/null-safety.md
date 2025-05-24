---
title: "Null 安全性"
---
空值安全（Null safety）是 Kotlin 的一項功能，旨在顯著降低空引用（null references）的風險，空引用也被稱為[「價值十億美元的錯誤」](https://en.wikipedia.org/wiki/Null_pointer#History)。

許多程式語言（包括 Java）中最常見的陷阱之一是，存取空引用（null reference）的成員會導致空引用異常（null reference exception）。在 Java 中，這相當於 `NullPointerException`，簡稱 _NPE_。

Kotlin 明確支援將可空性（nullability）作為其類型系統的一部分，這意味著您可以明確聲明哪些變數或屬性允許為 `null`。此外，當您聲明不可空變數時，編譯器會強制這些變數不能保存 `null` 值，從而避免 NPE。

Kotlin 的空值安全可透過在編譯時而非運行時捕獲潛在的與空值相關的問題，確保程式碼更安全。此功能透過明確表達 `null` 值來提高程式碼的穩健性、可讀性和可維護性，使程式碼更易於理解和管理。

在 Kotlin 中，NPE 唯一可能的起因是：

* 顯式呼叫 [`throw NullPointerException()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-null-pointer-exception/)。
* 使用 [非空斷言運算符 `!!`](#not-null-assertion-operator)。
* 初始化期間的資料不一致，例如：
  * 在建構函式中使用的未初始化的 `this` 在其他地方可用（[「洩漏的 `this`」](https://youtrack.jetbrains.com/issue/KTIJ-9751)）。
  * [超類別建構函式呼叫開放成員](inheritance#derived-class-initialization-order)，而該成員在衍生類別中的實現使用未初始化的狀態。
* Java 互操作：
  * 嘗試存取 [平台類型](java-interop#null-safety-and-platform-types)的 `null` 參考的成員。
  * 泛型類型的可空性問題。例如，一段 Java 程式碼將 `null` 新增到 Kotlin `MutableList<String>` 中，這需要 `MutableList<String?>` 才能正確處理它。
  * 由外部 Java 程式碼引起嘅其他問題。

:::tip
除了 NPE 之外，另一個與空值安全相關的例外是 [`UninitializedPropertyAccessException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-uninitialized-property-access-exception/)。當您嘗試存取尚未初始化的屬性時，Kotlin 會拋出此例外，確保在非可空屬性準備就緒之前不會使用它們。這通常發生在 [`lateinit` 屬性](properties#late-initialized-properties-and-variables)中。

:::

## 可空類型和不可空類型（Nullable types and non-nullable types）

在 Kotlin 中，類型系統區分可以保存 `null` 的類型（可空類型）和不能保存 `null` 的類型（不可空類型）。 例如，類型為 `String` 的常規變數不能保存 `null`：

```kotlin
fun main() {

    // 將非空字符串分配給變數（Assigns a non-null string to a variable）
    var a: String = "abc"
    // 嘗試將 null 重新分配給不可空變數（Attempts to re-assign null to the non-nullable variable）
    a = null
    print(a)
    // Null 不能是非空類型 String 的值（Null can not be a value of a non-null type String）

}
```

您可以安全地呼叫 `a` 上的方法或存取屬性。保證不會導致 NPE，因為 `a` 是不可空變數。編譯器確保 `a` 始終保持有效的 `String` 值，因此不存在在 `a` 為 `null` 時存取其屬性或方法的風險：

```kotlin
fun main() {

    // 將非空字符串分配給變數（Assigns a non-null string to a variable）
    val a: String = "abc"
    // 返回非空變數的長度（Returns the length of a non-nullable variable）
    val l = a.length
    print(l)
    // 3

}
```

若要允許 `null` 值，請在變數類型後面的加上一個 `?` 符號來聲明變數。 例如，您可以通過編寫 `String?` 來聲明可空字符串。 此表達式使 `String` 成為一種可以接受 `null` 的類型：

```kotlin
fun main() {

    // 將可空字符串分配給變數（Assigns a nullable string to a variable）
    var b: String? = "abc"
    // 成功地將 null 重新分配給可空變數（Successfully re-assigns null to the nullable variable）
    b = null
    print(b)
    // null

}
```

如果您嘗試直接在 `b` 上存取 `length`，編譯器會報告錯誤。 這是因為 `b` 聲明為可空變數，並且可以保存 `null` 值。 嘗試直接存取可空對象上的屬性會導致 NPE：

```kotlin
fun main() {

    // 將可空字符串分配給變數（Assigns a nullable string to a variable）
    var b: String? = "abc"
    // 將 null 重新分配給可空變數（Re-assigns null to the nullable variable）
    b = null
    // 嘗試直接返回可空變數的長度（Tries to directly return the length of a nullable variable）
    val l = b.length
    print(l)
    // 僅允許對 String? 類型的可空接收器使用安全 (?.) 或非空斷言 (!!.) 呼叫（Only safe (?.) or non-null asserted (!!.) calls are allowed on a nullable receiver of type String?）

}
```

在上面的示例中，編譯器要求您使用安全呼叫來檢查可空性，然後才能存取屬性或執行操作。 有幾種處理可空類型的方法：

* [使用 `if` 條件檢查 `null`](#check-for-null-with-the-if-conditional)
* [安全呼叫運算符 `?.`](#safe-call-operator)
* [Elvis 運算符 `?:`](#elvis-operator)
* [非空斷言運算符 `!!`](#not-null-assertion-operator)
* [可空接收器](#nullable-receiver)
* [`let` 函數](#let-function)
* [安全轉換 `as?`](#safe-casts)
* [可空類型的集合](#collections-of-a-nullable-type)

閱讀以下章節，以了解 `null` 處理工具和技術的詳細資訊和範例。

## 使用 if 條件檢查 null（Check for null with the if conditional）

使用可空類型時，您需要安全地處理可空性，以避免 NPE。 一種處理方法是使用 `if` 條件表達式顯式檢查可空性。

例如，檢查 `b` 是否為 `null`，然後存取 `b.length`：

```kotlin
fun main() {

    // 將 null 分配給可空變數（Assigns null to a nullable variable）
    val b: String? = null
    // 首先檢查可空性，然後存取長度（Checks for nullability first and then accesses length）
    val l = if (b != null) b.length else -1
    print(l)
    // -1

}
```

在上面的示例中，編譯器執行[智能轉換](typecasts#smart-casts)以將類型從可空 `String?` 更改為不可空 `String`。 它還會追蹤您執行的檢查的相關訊息，並允許在 `if` 條件內呼叫 `length`。

也支援更複雜的條件：

```kotlin
fun main() {

    // 將可空字符串分配給變數（Assigns a nullable string to a variable）
    val b: String? = "Kotlin"

    // 首先檢查可空性，然後存取長度（Checks for nullability first and then accesses length）
    if (b != null && b.length > 0) {
        print("String of length ${b.length}")
    // 如果不滿足條件，則提供替代方案（Provides alternative if the condition is not met）
    } else {
        print("Empty string")
        // 長度為 6 的字符串（String of length 6）
    }

}
```

請注意，上面的示例僅在編譯器可以保證 `b` 在檢查和使用之間沒有變更時才有效，與[智能轉換先決條件](typecasts#smart-cast-prerequisites)相同。

## 安全呼叫運算符（Safe call operator）

安全呼叫運算符 `?.` 允許您以更短的形式安全地處理可空性。如果物件為 `null`，`?.` 運算符不會引發 NPE，而是簡單地返回 `null`：

```kotlin
fun main() {

    // 將可空字符串分配給變數（Assigns a nullable string to a variable）
    val a: String? = "Kotlin"
    // 將 null 分配給可空變數（Assigns null to a nullable variable）
    val b: String? = null

    // 檢查可空性並返回長度或 null（Checks for nullability and returns length or null）
    println(a?.length)
    // 6
    println(b?.length)
    // null

}
```

`b?.length` 表達式檢查可空性，如果 `b` 不為 null，則返回 `b.length`，否則返回 `null`。 此表達式的類型為 `Int?`。

您可以在 Kotlin 中將 `?.` 運算符與 [`var` 和 `val` 變數](basic-syntax#variables)一起使用：

* 可空 `var` 可以保存 `null`（例如，`var nullableValue: String? = null`）或非空值（例如，`var nullableValue: String? = "Kotlin"`）。 如果它是非空值，您可以隨時將其更改為 `null`。
* 可空 `val` 可以保存 `null`（例如，`val nullableValue: String? = null`）或非空值（例如，`val nullableValue: String? = "Kotlin"`）。 如果它是非空值，則不能隨後將其更改為 `null`。

安全呼叫在鏈中很有用。 例如，Bob 是一名員工，可能會（也可能不會）被分配到一個部門。 該部門反過來可能會聘用另一名員工擔任部門主管。 若要取得 Bob 的部門主管的姓名（如果有的話），您可以編寫以下內容：

```kotlin
bob?.department?.head?.name
```

如果其任何屬性為 `null`，則此鏈會返回 `null`。 以下是與上述安全呼叫相同的內容，但使用 `if` 條件：

```kotlin
if (person != null && person.department != null) {
    person.department.head = managersPool.getManager()
}
```

您還可以將安全呼叫放在賦值的左側：

```kotlin
person?.department?.head = managersPool.getManager()
```

在上面的示例中，如果安全呼叫鏈中的其中一個接收器為 `null`，則會跳過賦值，並且根本不評估右側的表達式。 例如，如果 `person` 或 `person.department` 為 `null`，則不會呼叫該函數。

## Elvis 運算符（Elvis operator）

使用可空類型時，您可以檢查 `null` 並提供替代值。 例如，如果 `b` 不為 `null`，則存取 `b.length`。 否則，返回替代值：

```kotlin
fun main() {

    // 將 null 分配給可空變數（Assigns null to a nullable variable）
    val b: String? = null
    // 檢查可空性。 如果不為 null，則返回長度。 如果為 null，則返回 0（Checks for nullability. If not null, returns length. If null, returns 0）
    val l: Int = if (b != null) b.length else 0
    println(l)
    // 0

}
```

您可以使用 Elvis 運算符 `?:` 以更簡潔的方式處理此問題，而不是編寫完整的 `if` 表達式：

```kotlin
fun main() {

    // 將 null 分配給可空變數（Assigns null to a nullable variable）
    val b: String? = null
    // 檢查可空性。 如果不為 null，則返回長度。 如果為 null，則返回非 null 值（Checks for nullability. If not null, returns length. If null, returns a non-null value）
    val l = b?.length ?: 0
    println(l)
    // 0

}
```

如果 `?:` 左側的表達式不為 `null`，則 Elvis 運算符會返回它。 否則，Elvis 運算符會返回右側的表達式。 只有在左側為 `null` 時，才會評估右側的表達式。

由於 `throw` 和 `return` 是 Kotlin 中的表達式，因此您也可以在 Elvis 運算符的右側使用它們。 例如，在檢查函數參數時，這可能會很方便：

```kotlin
fun foo(node: Node): String? {
    // 檢查 getParent()。 如果不為 null，則會將其分配給 parent。 如果為 null，則返回 null（Checks for getParent(). If not null, it's assigned to parent. If null, returns null）
    val parent = node.getParent() ?: return null
    // 檢查 getName()。 如果不為 null，則會將其分配給 name。 如果為 null，則拋出例外（Checks for getName(). If not null, it's assigned to name. If null, throws exception）
    val name = node.getName() ?: throw IllegalArgumentException("name expected")
    // ...
}
```

## 非空斷言運算符（Not-null assertion operator）

非空斷言運算符 `!!` 將任何值轉換為非可空類型。

當您將 `!!` 運算符應用於其值不為 `null` 的變數時，會將其安全地處理為非可空類型，並且程式碼正常執行。 但是，如果值為 `null`，則 `!!` 運算符會強制將其視為非可空，這會導致 NPE。

當 `b` 不為 `null` 並且 `!!` 運算符使其返回其非 null 值（在此示例中為 `String`）時，它會正確存取 `length`：

```kotlin
fun main() {

    // 將可空字符串分配給變數（Assigns a nullable string to a variable）
    val b: String? = "Kotlin"
    // 將 b 視為非 null 並存取其長度（Treats b as non-null and accesses its length）
    val l = b!!.length
    println(l)
    // 6

}
```

當 `b` 為 `null` 並且 `!!` 運算符使其返回其非 null 值時，會發生 NPE：

```kotlin
fun main() {

    // 將 null 分配給可空變數（Assigns null to a nullable variable）
    val b: String? = null
    // 將 b 視為非 null 並嘗試存取其長度（Treats b as non-null and tries to access its length）
    val l = b!!.length
    println(l)
    // 线程 "main" java.lang.NullPointerException 中发生异常（Exception in thread "main" java.lang.NullPointerException）

}
```

當您確信值不為 `null` 並且不會發生 NPE 時，`!!` 運算符特別有用，但由於某些規則，編譯器無法保證這一點。 在這種情況下，您可以使用 `!!` 運算符來顯式告知編譯器該值不為 `null`。

## 可空接收器（Nullable receiver）

您可以將擴展函數與[可空接收器類型](extensions#nullable-receiver)一起使用，從而允許在可能為 `null` 的變數上呼叫這些函數。

透過在可空接收器類型上定義擴展函數，您可以在函數本身中處理 `null` 值，而不是在您呼叫該函數的每個位置檢查 `null`。

例如，可以在可空接收器上呼叫 [`.toString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/to-string.html) 擴展函數。 在 `null` 值上調用時，它會安全地返回字符串 `"null"`，而不會引發例外：

```kotlin

fun main() {
    // 將可空 Person 物件分配給存儲在 person 變數中的物件（Assigns null to a nullable Person object stored in the person variable）
    val person: Person? = null

    // 將 .toString 應用於可空 person 變數並印出一個字符串（Applies .toString to the nullable person variable and prints a string）
    println(person.toString())
    // null
}

// 定義一個簡單的 Person 類別（Defines a simple Person class）
data class Person(val name: String)

```

在上面的示例中，即使 `person` 為 `null`，`.toString()` 函數也會安全地返回字符串 `"null"`。 這有助於進行調試和日誌記錄。

如果您希望 `.toString()` 函數返回一個可空字符串（字符串表示形式或 `null`），請使用[安全呼叫運算符 `?.`](#safe-call-operator)。
`?.` 運算符僅在物件不為 `null` 時才呼叫 `.toString()`，否則返回 `null`：

```kotlin

fun main() {
    // 將可空 Person 物件分配給變數（Assigns a nullable Person object to a variable）
    val person1: Person? = null
    val person2: Person? = Person("Alice")

    // 如果 person 為 null，則印出 "null"；否則印出 person.toString() 的結果（Prints "null" if person is null; otherwise prints the result of person.toString()）
    println(person1?.toString())
    // null
    println(person2?.toString())
    // Person(name=Alice)
}

// 定義 Person 類別（Defines a Person class）
data class Person(val name: String)

```

`?.` 運算符允許您安全地處理潛在的 `null` 值，同時仍然存取可能為 `null` 的物件的屬性或函數。

## Let 函數（Let function）

若要處理 `null` 值並僅對非空類型執行操作，您可以將安全呼叫運算符 `?.` 與 [`let` 函數](scope-functions#let)一起使用。

此組合對於評估表達式、檢查結果是否為 `null` 以及僅在結果不為 `null` 時才執行程式碼非常有用，從而避免了手動 null 檢查：

```kotlin
fun main() {

    // 聲明可空字符串的列表（Declares a list of nullable strings）
    val listWithNulls: List<String?> = listOf("Kotlin", null)

    // 迭代列表中的每個項目（Iterates over each item in the list）
    for (item in listWithNulls) {
        // 檢查項目是否為 null 並且僅印出非 null 值（Checks if the item is null and only prints non-null values）
        item?.let { println(it) }
        //Kotlin
    }

}
```

## 安全轉換（Safe casts）

[類型轉換](typecasts#unsafe-cast-operator)的常規 Kotlin 運算符是 `as` 運算符。 但是，如果物件不是目標類型，則常規轉換可能會導致例外。

您可以使用 `as?` 運算符進行安全轉換。 它會嘗試將值轉換為指定的類型，如果該值不是該類型，則返回 `null`：

```kotlin
fun main() {

    // 聲明一個 Any 類型的變數，它可以保存任何類型的值（Declares a variable of type Any, which can hold any type of value）
    val a: Any = "Hello, Kotlin!"

    // 使用 'as?' 運算符安全地轉換為 Int（Safe casts to Int using the 'as?' operator）
    val aInt: Int? = a as? Int
    // 使用 'as?' 運算符安全地轉換為 String（Safe casts to String using the 'as?' operator）
    val aString: String? = a as? String

    println(aInt)
    // null
    println(aString)
    // "Hello, Kotlin!"

}
```

上面的程式碼印出 `null`，因為 `a` 不是 `Int`，因此轉換安全地失敗。 它還印出 `"Hello, Kotlin!"`，因為它與 `String?` 類型匹配，因此安全轉換成功。

## 可空類型的集合（Collections of a nullable type）

如果您有一個可空元素的集合，並且只想保留非 null 元素，請使用 `filterNotNull()` 函數：

```kotlin
fun main() {

    // 聲明一個包含一些 null 和非 null 整數值的列表（Declares a list containing some null and non-null integer values）
    val nullableList: List<Int?> = listOf(1, 2, null, 4)

    // 過濾掉 null 值，從而產生一個非 null 整數的列表（Filters out null values, resulting in a list of non-null integers）
    val intList: List<Int> = nullableList.filterNotNull()

    println(intList)
    // [1, 2, 4]

}
```

## 後續步驟？（What's next?）

* 了解如何在 [Java 和 Kotlin 中處理可空性](java-to-kotlin-nullability-guide)。
* 了解[明確的非空類型](generics#definitely-non-nullable-types)的泛型類型。