[//]: # (title: 空值安全)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-hello-world.md">Hello world</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-basic-types.md">基本型別</a><br />
        <img src="icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections.md">集合</a><br />
        <img src="icon-4-done.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-control-flow.md">控制流程</a><br />
        <img src="icon-5-done.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-functions.md">函式</a><br />
        <img src="icon-6-done.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-classes.md">類別</a><br />
        <img src="icon-7.svg" width="20" alt="Final step" /> <strong>空值安全</strong><br /></p>
</tldr>

在 Kotlin 中，可以有 `null` 值。Kotlin 在某些內容缺失或尚未設定時使用 `null` 值。
你已經在 [集合](kotlin-tour-collections.md#kotlin-tour-map-no-key) 章節中看過 Kotlin 返回 `null` 值的範例，當時你嘗試存取一個在映射 (map) 中不存在的鍵值對 (key-value pair)。儘管這樣使用 `null` 值很有用，但如果你的程式碼沒有準備好處理它們，你可能會遇到問題。

為了幫助防止程式中出現 `null` 值問題，Kotlin 引入了空值安全 (null safety)。空值安全在編譯時而非執行時檢測潛在的 `null` 值問題。

空值安全是多種功能的組合，讓你可以：

*   明確宣告程式中何時允許 `null` 值。
*   檢查 `null` 值。
*   使用安全呼叫 (safe calls) 來存取可能包含 `null` 值的屬性或函式。
*   宣告檢測到 `null` 值時要採取的動作。

## 可空型別

Kotlin 支援可空型別 (nullable types)，這允許宣告的型別具有 `null` 值。預設情況下，型別**不**允許接受 `null` 值。可空型別是透過在型別宣告後明確新增 `?` 來宣告的。

例如：

```kotlin
fun main() {
    // neverNull has String type
    var neverNull: String = "This can't be null"

    // Throws a compiler error
    neverNull = null

    // nullable has nullable String type
    var nullable: String? = "You can keep a null here"

    // This is OK
    nullable = null

    // By default, null values aren't accepted
    var inferredNonNull = "The compiler assumes non-nullable"

    // Throws a compiler error
    inferredNonNull = null

    // notNull doesn't accept null values
    fun strLength(notNull: String): Int {                 
        return notNull.length
    }

    println(strLength(neverNull)) // 18
    println(strLength(nullable))  // Throws a compiler error
}
```
{kotlin-runnable="true" validate="false" kotlin-min-compiler-version="1.3" id="kotlin-tour-nullable-type"}

> `length` 是 [String](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/) 類別的一個屬性，包含字串中的字元數。
>
{style="tip"}

## 檢查空值

你可以在條件表達式中檢查是否存在 `null` 值。在以下範例中，`describeString()` 函式有一個 `if` 陳述式，它檢查 `maybeString` 是否**不為** `null` 且其 `length` 是否大於零：

```kotlin
fun describeString(maybeString: String?): String {
    if (maybeString != null && maybeString.length > 0) {
        return "String of length ${maybeString.length}"
    } else {
        return "Empty or null string"
    }
}

fun main() {
    val nullString: String? = null
    println(describeString(nullString))
    // Empty or null string
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-check-nulls"}

## 使用安全呼叫

若要安全地存取可能包含 `null` 值的物件屬性，請使用安全呼叫運算子 `?.`。如果物件或其存取的任何屬性為 `null`，安全呼叫運算子會返回 `null`。這在你想避免 `null` 值引發程式碼錯誤時非常有用。

在以下範例中，`lengthString()` 函式使用安全呼叫來返回字串的長度或 `null`：

```kotlin
fun lengthString(maybeString: String?): Int? = maybeString?.length

fun main() { 
    val nullString: String? = null
    println(lengthString(nullString))
    // null
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-safe-call-property"}

> 安全呼叫可以串聯起來，這樣如果物件的任何屬性包含 `null` 值，則會返回 `null` 而不會拋出錯誤。例如：
> 
> ```kotlin
>   person.company?.address?.country
> ```
>
{style="tip"}

安全呼叫運算子也可用於安全地呼叫延伸函式 (extension function) 或成員函式 (member function)。在這種情況下，函式被呼叫前會執行 `null` 檢查。如果檢查檢測到 `null` 值，則呼叫會被跳過並返回 `null`。

在以下範例中，`nullString` 為 `null`，因此對 [`.uppercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/uppercase.html) 的調用被跳過，並返回 `null`：

```kotlin
fun main() {
    val nullString: String? = null
    println(nullString?.uppercase())
    // null
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-safe-call-function"}

## 使用 Elvis 運算子

你可以使用 **Elvis 運算子** `?:` 來提供一個預設值，以便在檢測到 `null` 值時返回。

在 Elvis 運算子的左側寫入應檢查 `null` 值的部分。
在 Elvis 運算子的右側寫入在檢測到 `null` 值時應返回的部分。

在以下範例中，`nullString` 為 `null`，因此存取 `length` 屬性的安全呼叫會返回 `null` 值。
結果，Elvis 運算子返回 `0`：

```kotlin
fun main() {
    val nullString: String? = null
    println(nullString?.length ?: 0)
    // 0
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-elvis-operator"}

有關 Kotlin 中空值安全的更多資訊，請參閱 [空值安全](null-safety.md)。

## 練習

### 練習 {initial-collapse-state="collapsed" collapsible="true"}

你擁有 `employeeById` 函式，它讓你能夠存取公司員工的資料庫。不幸的是，此函式返回 `Employee?` 型別的值，因此結果可能為 `null`。你的目標是編寫一個函式，當提供員工的 `id` 時返回其薪資，如果資料庫中缺少該員工則返回 `0`。

|---|---|
```kotlin
data class Employee (val name: String, var salary: Int)

fun employeeById(id: Int) = when(id) {
    1 -> Employee("Mary", 20)
    2 -> null
    3 -> Employee("John", 21)
    4 -> Employee("Ann", 23)
    else -> null
}

fun salaryById(id: Int) = // Write your code here

fun main() {
    println((1..5).sumOf { id -> salaryById(id) })
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-null-safety-exercise"}

|---|---|
```kotlin
data class Employee (val name: String, var salary: Int)

fun employeeById(id: Int) = when(id) {
    1 -> Employee("Mary", 20)
    2 -> null
    3 -> Employee("John", 21)
    4 -> Employee("Ann", 23)
    else -> null
}

fun salaryById(id: Int) = employeeById(id)?.salary ?: 0

fun main() {
    println((1..5).sumOf { id -> salaryById(id) })
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答" id="kotlin-tour-null-safety-solution"}

## 接下來是什麼？

恭喜！現在你已經完成了入門導覽，透過我們的進階導覽將你對 Kotlin 的理解提升到一個新的層次：

<a href="kotlin-tour-intermediate-extension-functions.md"><img src="start-intermediate-tour.svg" width="700" alt="開始 Kotlin 進階導覽" style="block"/></a>