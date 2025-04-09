---
title: "慣用語 (Idioms)"
---
Kotlin 中隨機且常用的慣用語集合。如果您有喜歡的慣用語，請發送 Pull Request 來貢獻它。

## 建立 DTO (POJO/POCO)

```kotlin
data class Customer(val name: String, val email: String)
```

提供一個具有以下功能的 `Customer` 類別：

* 所有屬性的 getter（以及 `var` 的 setter）
* `equals()`
* `hashCode()`
* `toString()`
* `copy()`
* 所有屬性的 `component1()`、`component2()`、...（請參閱[資料類別](data-classes)）

## 函數參數的預設值

```kotlin
fun foo(a: Int = 0, b: String = "") { ... }
```

## 過濾列表

```kotlin
val positives = list.filter { x `->` x > 0 }
```

或者，甚至更短：

```kotlin
val positives = list.filter { it > 0 }
```

了解 [Java 和 Kotlin 過濾](java-to-kotlin-collections-guide#filter-elements)之間的差異。

## 檢查集合中是否存在元素

```kotlin
if ("john@example.com" in emailsList) { ... }

if ("jane@example.com" !in emailsList) { ... }
```

## 字串差值

```kotlin
println("Name $name")
```

了解 [Java 和 Kotlin 字串串連](java-to-kotlin-idioms-strings#concatenate-strings)之間的差異。

## 安全地讀取標準輸入

```kotlin
// 讀取字串，如果輸入無法轉換為整數，則傳回 null。例如：Hi there!
val wrongInt = readln().toIntOrNull()
println(wrongInt)
// null

// 讀取可以轉換為整數的字串，並傳回整數。例如：13
val correctInt = readln().toIntOrNull()
println(correctInt)
// 13
```

如需更多資訊，請參閱[讀取標準輸入](read-standard-input)。

## 實例檢查

```kotlin
when (x) {
    is Foo `->` ...
    is Bar `->` ...
    else   `->` ...
}
```

## 唯讀列表

```kotlin
val list = listOf("a", "b", "c")
```
## 唯讀 Map

```kotlin
val map = mapOf("a" to 1, "b" to 2, "c" to 3)
```

## 存取 Map 條目

```kotlin
println(map["key"])
map["key"] = value
```

## 遍歷 Map 或 Pair 列表

```kotlin
for ((k, v) in map) {
    println("$k `->` $v")
}
```

`k` 和 `v` 可以是任何方便的名稱，例如 `name` 和 `age`。

## 迭代範圍

```kotlin
for (i in 1..100) { ... }  // 閉區間：包含 100
for (i in 1..&lt;100) { ... } // 開區間：不包含 100
for (x in 2..10 step 2) { ... }
for (x in 10 downTo 1) { ... }
(1..10).forEach { ... }
```

## 惰性屬性

```kotlin
val p: String by lazy { // 該值僅在第一次存取時計算
    // 計算字串
}
```

## 擴展函數 (Extension functions)

```kotlin
fun String.spaceToCamelCase() { ... }

"Convert this to camelcase".spaceToCamelCase()
```

## 建立單例 (Singleton)

```kotlin
object Resource {
    val name = "Name"
}
```

## 使用內聯值類別 (Inline Value Classes) 實現型別安全的值

```kotlin
@JvmInline
value class EmployeeId(private val id: String)

@JvmInline
value class CustomerId(private val id: String)
```

如果您不小心混淆了 `EmployeeId` 和 `CustomerId`，則會觸發編譯錯誤。

:::note
`@JvmInline` 註解僅適用於 JVM 後端。

:::

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

## If-not-null 簡寫

```kotlin
val files = File("Test").listFiles()

println(files?.size) // 如果 files 不為 null，則列印 size
```

## If-not-null-else 簡寫

```kotlin
val files = File("Test").listFiles()

// 對於簡單的後備值：
println(files?.size ?: "empty") // 如果 files 為 null，則列印 "empty"

// 若要在程式碼區塊中計算更複雜的後備值，請使用 `run`
val filesSize = files?.size ?: run { 
    val someSize = getSomeSize()
    someSize * 2
}
println(filesSize)
```

## 如果為 null 則執行語句

```kotlin
val values = ...
val email = values["email"] ?: throw IllegalStateException("Email is missing!")
```

## 取得可能為空的集合的第一個項目

```kotlin
val emails = ... // 可能為空
val mainEmail = emails.firstOrNull() ?: ""
```

了解 [Java 和 Kotlin 取得第一個項目](java-to-kotlin-collections-guide#get-the-first-and-the-last-items-of-a-possibly-empty-collection)之間的差異。

## 如果不為 null 則執行

```kotlin
val value = ...

value?.let {
    ... // 如果不為 null，則執行此區塊
}
```

## 如果不為 null，則對可為 null 的值進行 Map 運算

```kotlin
val value = ...

val mapped = value?.let { transformValue(it) } ?: defaultValue 
// 如果 value 或轉換結果為 null，則傳回 defaultValue。
```

## 在 When 語句中傳回

```kotlin
fun transform(color: String): Int {
    return when (color) {
        "Red" `->` 0
        "Green" `->` 1
        "Blue" `->` 2
        else `->` throw IllegalArgumentException("Invalid color param value")
    }
}
```

## try-catch 表達式

```kotlin
fun test() {
    val result = try {
        count()
    } catch (e: ArithmeticException) {
        throw IllegalStateException(e)
    }

    // Working with result
}
```

## if 表達式

```kotlin
val y = if (x == 1) {
    "one"
} else if (x == 2) {
    "two"
} else {
    "other"
}
```

## Builder 風格的使用 Unit 傳回方法

```kotlin
fun arrayOfMinusOnes(size: Int): IntArray {
    return IntArray(size).apply { fill(-1) }
}
```

## 單一表達式函數

```kotlin
fun theAnswer() = 42
```

這等效於

```kotlin
fun theAnswer(): Int {
    return 42
}
```

這可以有效地與其他慣用語結合，從而縮短程式碼。例如，使用 `when` 表達式：

```kotlin
fun transform(color: String): Int = when (color) {
    "Red" `->` 0
    "Green" `->` 1
    "Blue" `->` 2
    else `->` throw IllegalArgumentException("Invalid color param value")
}
```

## 在物件實例上呼叫多個方法 (with)

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

## 配置物件的屬性 (apply)

```kotlin
val myRectangle = Rectangle().apply {
    length = 4
    breadth = 5
    color = 0xFAFAFA
}
```

這對於配置物件建構子中不存在的屬性非常有用。

## Java 7 的 try-with-resources

```kotlin
val stream = Files.newInputStream(Paths.get("/some/file.txt"))
stream.buffered().reader().use { reader `->`
    println(reader.readText())
}
```

## 需要泛型類型資訊的泛型函數

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

## 將程式碼標記為未完成 (TODO)
 
Kotlin 的標準函式庫有一個 `TODO()` 函數，它始終會拋出 `NotImplementedError`。
它的傳回類型是 `Nothing`，因此無論預期的類型如何，都可以使用它。
還有一個接受原因參數的重載：

```kotlin
fun calcTaxes(): BigDecimal = TODO("Waiting for feedback from accounting")
```

IntelliJ IDEA 的 Kotlin 外掛程式了解 `TODO()` 的語意，並自動在 TODO 工具視窗中新增程式碼指標。

## 接下來做什麼？

* 使用慣用的 Kotlin 風格解決 [Advent of Code 謎題](advent-of-code)。
* 學習如何在 [Java 和 Kotlin 中使用字串執行典型任務](java-to-kotlin-idioms-strings)。
* 學習如何在 [Java 和 Kotlin 中使用集合執行典型任務](java-to-kotlin-collections-guide)。
* 學習如何 [處理 Java 和 Kotlin 中的可空性](java-to-kotlin-nullability-guide)。