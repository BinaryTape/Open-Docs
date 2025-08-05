[//]: # (title: 慣用寫法)

一份 Kotlin 中常用及隨機慣用寫法的集合。如果您有喜歡的慣用寫法，歡迎透過發送 Pull Request 貢獻。

## 建立 DTOs (POJOs/POCOs)

```kotlin
data class Customer(val name: String, val email: String)
```

為 `Customer` 類別提供了以下功能：

*   所有屬性的 getter (若為 `var` 變數則包含 setter)
*   `equals()`
*   `hashCode()`
*   `toString()`
*   `copy()`
*   `component1()`、`component2()` 等等，適用於所有屬性（請參閱 [資料類別](data-classes.md)）

## 函數參數的預設值

```kotlin
fun foo(a: Int = 0, b: String = "") { ... }
```

## 篩選列表

```kotlin
val positives = list.filter { x -> x > 0 }
```

或者，甚至更簡潔的寫法：

```kotlin
val positives = list.filter { it > 0 }
```

了解 [Java 和 Kotlin 篩選](java-to-kotlin-collections-guide.md#filter-elements) 之間的差異。

## 檢查集合中是否存在元素

```kotlin
if ("john@example.com" in emailsList) { ... }

if ("jane@example.com" !in emailsList) { ... }
```

## 字串內插

```kotlin
println("Name $name")
```

了解 [Java 和 Kotlin 字串連接](java-to-kotlin-idioms-strings.md#concatenate-strings) 之間的差異。

## 安全地讀取標準輸入

```kotlin
// 讀取字串，如果輸入無法轉換為整數，則返回 null。例如：Hi there!
val wrongInt = readln().toIntOrNull()
println(wrongInt)
// null

// 讀取可以轉換為整數的字串並返回整數。例如：13
val correctInt = readln().toIntOrNull()
println(correctInt)
// 13
```

更多資訊請參閱 [讀取標準輸入。](read-standard-input.md)

## 實例檢查

```kotlin
when (x) {
    is Foo -> ...
    is Bar -> ...
    else   -> ...
}
```

## 唯讀列表

```kotlin
val list = listOf("a", "b", "c")
```
## 唯讀映射

```kotlin
val map = mapOf("a" to 1, "b" to 2, "c" to 3)
```

## 存取映射條目

```kotlin
println(map["key"])
map["key"] = value
```

## 遍歷映射或對偶列表

```kotlin
for ((k, v) in map) {
    println("$k -> $v")
}
```

`k` 和 `v` 可以是任何方便的名稱，例如 `name` 和 `age`。

## 疊代範圍

```kotlin
for (i in 1..100) { ... }  // 閉區間範圍：包含 100
for (i in 1..<100) { ... } // 開區間範圍：不包含 100
for (x in 2..10 step 2) { ... }
for (x in 10 downTo 1) { ... }
(1..10).forEach { ... }
```

## 惰性屬性

```kotlin
val p: String by lazy { // 該值僅在首次存取時計算
    // 計算字串
}
```

## 擴充函數

```kotlin
fun String.spaceToCamelCase() { ... }

"Convert this to camelcase".spaceToCamelCase()
```

## 建立單例

```kotlin
object Resource {
    val name = "Name"
}
```

## 使用內聯值類別實現型別安全的值

```kotlin
@JvmInline
value class EmployeeId(private val id: String)

@JvmInline
value class CustomerId(private val id: String)
```

如果您不小心混淆了 `EmployeeId` 和 `CustomerId`，會觸發編譯錯誤。

> `The `@JvmInline` 註解僅適用於 JVM 後端。`
>
{style="note"}

## 實例化抽象類別

```kotlin
abstract class MyAbstractClass {
    abstract fun doSomething()
    abstract fun sleep()
}

fun main() {
    val myObject = object : MyAbstractClass() {
        override fun doSomething() {
            // ...
        }

        override fun sleep() { // ...
        }
    }
    myObject.doSomething()
}
```

## 若非 null 簡寫

```kotlin
val files = File("Test").listFiles()

println(files?.size) // 如果 files 不是 null，則會列印 size
```

## 若非 null 否則 簡寫

```kotlin
val files = File("Test").listFiles()

// 對於簡單的預設值：
println(files?.size ?: "empty") // 如果 files 是 null，這會列印 "empty"

// 若要在程式碼區塊中計算更複雜的預設值，請使用 `run`
val filesSize = files?.size ?: run { 
    val someSize = getSomeSize()
    someSize * 2
}
println(filesSize)
```

## 若為 null 執行表達式

```kotlin
val values = ...
val email = values["email"] ?: throw IllegalStateException("Email is missing!")
```

## 取得可能為空的集合的第一個項目

```kotlin
val emails = ... // 可能為空
val mainEmail = emails.firstOrNull() ?: ""
```

了解 [Java 和 Kotlin 取得第一個項目](java-to-kotlin-collections-guide.md#get-the-first-and-the-last-items-of-a-possibly-empty-collection) 之間的差異。

## 若非 null 則執行

```kotlin
val value = ...

value?.let {
    ... // 如果不是 null，則執行此區塊
}
```

## 若非 null 映射可為 null 的值

```kotlin
val value = ...

val mapped = value?.let { transformValue(it) } ?: defaultValue 
// 如果 value 或轉換結果為 null，則返回 defaultValue。
```

## `when` 陳述式中的返回

```kotlin
fun transform(color: String): Int {
    return when (color) {
        "Red" -> 0
        "Green" -> 1
        "Blue" -> 2
        else -> throw IllegalArgumentException("Invalid color param value")
    }
}
```

## `try-catch` 表達式

```kotlin
fun test() {
    val result = try {
        count()
    } catch (e: ArithmeticException) {
        throw IllegalStateException(e)
    }

    // 處理結果
}
```

## `if` 表達式

```kotlin
val y = if (x == 1) {
    "one"
} else if (x == 2) {
    "two"
} else {
    "other"
}
```

## 返回 Unit 的方法的建構器風格用法

```kotlin
fun arrayOfMinusOnes(size: Int): IntArray {
    return IntArray(size).apply { fill(-1) }
}
```

## 單表達式函數

```kotlin
fun theAnswer() = 42
```

這等同於

```kotlin
fun theAnswer(): Int {
    return 42
}
```

這可以有效地與其他慣用寫法結合，從而產生更簡潔的程式碼。例如，與 `when` 表達式結合使用：

```kotlin
fun transform(color: String): Int = when (color) {
    "Red" -> 0
    "Green" -> 1
    "Blue" -> 2
    else -> throw IllegalArgumentException("Invalid color param value")
}
```

## 呼叫物件實例上的多個方法 (`with`)

```kotlin
class Turtle {
    fun penDown()
    fun penUp()
    fun turn(degrees: Double)
    fun forward(pixels: Double)
}

val myTurtle = Turtle()
with(myTurtle) { //繪製一個 100 像素的正方形
    penDown()
    for (i in 1..4) {
        forward(100.0)
        turn(90.0)
    }
    penUp()
}
```

## 配置物件的屬性 (`apply`)

```kotlin
val myRectangle = Rectangle().apply {
    length = 4
    breadth = 5
    color = 0xFAFAFA
}
```

這對於配置物件建構函式中不存在的屬性很有用。

## Java 7 的 `try-with-resources`

```kotlin
val stream = Files.newInputStream(Paths.get("/some/file.txt"))
stream.buffered().reader().use { reader ->
    println(reader.readText())
}
```

## 需要泛型型別資訊的泛型函數

```kotlin
//  public final class Gson {
//     ...
//     public <T> T fromJson(JsonElement json, Class<T> classOfT) throws JsonSyntaxException {
//     ...

inline fun <reified T: Any> Gson.fromJson(json: JsonElement): T = this.fromJson(json, T::class.java)
```

## 交換兩個變數

```kotlin
var a = 1
var b = 2
a = b.also { b = a }
```

## 將程式碼標記為不完整 (`TODO`)
 
Kotlin 的標準函式庫有一個 `TODO()` 函數，它總是會拋出 `NotImplementedError`。
它的返回型別是 `Nothing`，因此無論預期型別為何都可以使用它。
還有一個接受原因參數的重載：

```kotlin
fun calcTaxes(): BigDecimal = TODO("等待會計部門的回饋")
```

IntelliJ IDEA 的 Kotlin 外掛程式理解 `TODO()` 的語義，並自動在 TODO 工具視窗中新增一個程式碼指標。

## 接下來呢？

*   使用慣用 Kotlin 風格解決 [Advent of Code 謎題](advent-of-code.md)。
*   學習如何在 [Java 和 Kotlin 中執行字串的典型任務](java-to-kotlin-idioms-strings.md)。
*   學習如何在 [Java 和 Kotlin 中執行集合的典型任務](java-to-kotlin-collections-guide.md)。
*   學習如何在 [Java 和 Kotlin 中處理可為 null 性](java-to-kotlin-nullability-guide.md)。