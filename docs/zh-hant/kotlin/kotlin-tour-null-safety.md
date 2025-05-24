---
title: "Null Safety (空值安全)"
---
<no-index/>
:::info
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-hello-world">Hello world (你好世界)</a><br />
        <img src="/img/icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-basic-types">Basic types (基本類型)</a><br />
        <img src="/img/icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections">Collections (集合)</a><br />
        <img src="/img/icon-4-done.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-control-flow">Control flow (控制流程)</a><br />
        <img src="/img/icon-5-done.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-functions">Functions (函式)</a><br />
        <img src="/img/icon-6-done.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-classes">Classes (類別)</a><br />
        <img src="/img/icon-7.svg" width="20" alt="Final step" /> <strong>Null safety (Null 安全)</strong><br />
</p>

:::

在 Kotlin 中，可以擁有一個 `null` 值。當某些東西遺失或尚未設定時，Kotlin 會使用 `null` 值。
你已經在 [Collections (集合)](kotlin-tour-collections#kotlin-tour-map-no-key) 章節中看過 Kotlin 傳回 `null` 值的範例，
當時你嘗試使用不存在於 map (映射) 中的 key (鍵) 來存取 key-value pair (鍵值對)。雖然以這種方式使用
`null` 值很有用，但如果你的程式碼沒有準備好處理它們，你可能會遇到問題。

為了幫助預防程式中 `null` 值所造成的問題，Kotlin 具備 null safety (Null 安全) 機制。Null safety (Null 安全) 會在編譯時期而非執行時期偵測到 `null` 值的潛在問題。

Null safety (Null 安全) 是多種功能的組合，可讓你：

* 明確宣告何時允許在你的程式中使用 `null` 值。
* 檢查 `null` 值。
* 使用安全呼叫 (safe call) 來呼叫可能包含 `null` 值的屬性或函式。
* 宣告偵測到 `null` 值時要採取的動作。

## Nullable types (可為 Null 的類型)

Kotlin 支援 nullable types (可為 Null 的類型)，允許宣告的類型具有 `null` 值。預設情況下，類型
**不**允許接受 `null` 值。Nullable types (可為 Null 的類型) 通過在類型宣告後明確添加 `?` 來宣告。

例如：

```kotlin
fun main() {
    // neverNull 具有 String 類型
    var neverNull: String = "This can't be null"

    // 拋出編譯器錯誤
    neverNull = null

    // nullable 具有可為 Null 的 String 類型
    var nullable: String? = "You can keep a null here"

    // 這是 OK 的
    nullable = null

    // 預設情況下，不接受 null 值
    var inferredNonNull = "The compiler assumes non-nullable"

    // 拋出編譯器錯誤
    inferredNonNull = null

    // notNull 不接受 null 值
    fun strLength(notNull: String): Int {                 
        return notNull.length
    }

    println(strLength(neverNull)) // 18
    println(strLength(nullable))  // 拋出編譯器錯誤
}
```

:::tip
`length` 是 [String](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/) 類別的一個屬性，
其中包含字串中的字元數。

:::

## Check for null values (檢查 Null 值)

你可以在條件運算式中檢查 `null` 值是否存在。在以下範例中，`describeString()`
函式有一個 `if` 語句，用於檢查 `maybeString` 是否 **不是** `null` 且其 `length` 是否大於零：

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

## Use safe calls (使用安全呼叫)

若要安全地存取可能包含 `null` 值的物件的屬性，請使用安全呼叫 (safe call) 運算子 `?.`。如果物件或其存取的屬性之一為 `null`，則安全呼叫 (safe call)
運算子會傳回 `null`。如果你想避免 `null` 值觸發程式碼中的錯誤，這非常有用。

在以下範例中，`lengthString()` 函式使用安全呼叫 (safe call) 來傳回字串的長度或 `null`：

```kotlin
fun lengthString(maybeString: String?): Int? = maybeString?.length

fun main() { 
    val nullString: String? = null
    println(lengthString(nullString))
    // null
}
```

:::tip
可以鏈式使用安全呼叫 (safe call)，以便物件的任何屬性包含 `null` 值時，都會傳回 `null`，而不會
拋出錯誤。例如：

```kotlin
  person.company?.address?.country
```

:::

安全呼叫 (safe call) 運算子也可以用於安全地呼叫 extension (擴展) 或 member function (成員函式)。在這種情況下，會在呼叫函式之前執行 null 檢查。如果檢查偵測到 `null` 值，則會跳過呼叫並傳回 `null`。

在以下範例中，`nullString` 為 `null`，因此會跳過 [`.uppercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/uppercase.html) 的調用，並傳回 `null`：

```kotlin
fun main() {
    val nullString: String? = null
    println(nullString?.uppercase())
    // null
}
```

## Use Elvis operator (使用 Elvis 運算子)

如果使用 **Elvis 運算子** `?:` 偵測到 `null` 值，你可以提供要傳回的預設值。

在 Elvis 運算子的左側寫入應檢查 `null` 值的内容。
在 Elvis 運算子的右側寫入如果偵測到 `null` 值應傳回的内容。

在以下範例中，`nullString` 為 `null`，因此存取 `length` 屬性的安全呼叫 (safe call) 會傳回 `null` 值。
因此，Elvis 運算子會傳回 `0`：

```kotlin
fun main() {
    val nullString: String? = null
    println(nullString?.length ?: 0)
    // 0
}
```

如需有關 Kotlin 中 null safety (Null 安全) 的更多資訊，請參閱 [Null safety (Null 安全)](null-safety)。

## Practice (練習)

### Exercise (練習)

你具有 `employeeById` 函式，可讓你存取公司的員工資料庫。不幸的是，此
函式傳回 `Employee?` 類型的值，因此結果可能為 `null`。你的目標是編寫一個函式，該函式在提供員工 `id` 時傳回員工的薪資，如果員工在資料庫中遺失，則傳回 `0`。

|---|---|
```kotlin
data class Employee (val name: String, var salary: Int)

fun employeeById(id: Int) = when(id) {
    1 `->` Employee("Mary", 20)
    2 `->` null
    3 `->` Employee("John", 21)
    4 `->` Employee("Ann", 23)
    else `->` null
}

fun salaryById(id: Int) = // Write your code here

fun main() {
    println((1..5).sumOf { id `->` salaryById(id) })
}
```

|---|---|
```kotlin
data class Employee (val name: String, var salary: Int)

fun employeeById(id: Int) = when(id) {
    1 `->` Employee("Mary", 20)
    2 `->` null
    3 `->` Employee("John", 21)
    4 `->` Employee("Ann", 23)
    else `->` null
}

fun salaryById(id: Int) = employeeById(id)?.salary ?: 0

fun main() {
    println((1..5).sumOf { id `->` salaryById(id) })
}
```

## What's next? (下一步是什麼？)

恭喜！既然你已經完成了 Kotlin 導覽，請查看我們關於熱門 Kotlin 應用程式的教學課程：

* [Create a backend application (建立後端應用程式)](jvm-create-project-with-spring-boot)
* [Create a cross-platform application for Android and iOS (為 Android 和 iOS 建立跨平台應用程式)](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html)