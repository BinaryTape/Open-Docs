[//]: # (title: 慣用語)

一份 Kotlin 中常用且隨機的慣用語集合。如果您有喜歡的慣用語，請透過提交拉取請求來貢獻它。

## 建立 DTOs (POJOs/POCOs)

```kotlin
data class Customer(val name: String, val email: String)
```

提供一個 `Customer` 類別，具備以下功能：

*   所有屬性的取得器 (以及 `var` 變數情況下的設定器)
*   `equals()`
*   `hashCode()`
*   `toString()`
*   `copy()`
*   `component1()`、`component2()` 等等，適用於所有屬性 (參閱 [資料類別](data-classes.md))

## 函數參數的預設值

```kotlin
fun foo(a: Int = 0, b: String = "") { ... }
```

## 篩選列表

```kotlin
val positives = list.filter { x -> x > 0 }
```

或者，更簡潔的寫法：

```kotlin
val positives = list.filter { it > 0 }
```

了解 [Java 和 Kotlin 篩選](java-to-kotlin-collections-guide.md#filter-elements) 之間的差異。

## 檢查集合中元素是否存在

```kotlin
if ("john@example.com" in emailsList) { ... }

if ("jane@example.com" !in emailsList) { ... }
```

## 字串內插

```kotlin
println("Name $name")
```

了解 [Java 和 Kotlin 字串串聯](java-to-kotlin-idioms-strings.md#concatenate-strings) 之間的差異。

## 安全地讀取標準輸入

```kotlin
// Reads a string and returns null if the input can't be converted into an integer. For example: Hi there!
val wrongInt = readln().toIntOrNull()
println(wrongInt)
// null

// Reads a string that can be converted into an integer and returns an integer. For example: 13
val correctInt = readln().toIntOrNull()
println(correctInt)
// 13
```

如需更多資訊，請參閱 [讀取標準輸入](read-standard-input.md)。

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

## 遍歷映射或配對列表

```kotlin
for ((k, v) in map) {
    println("$k -> $v")
}
```

`k` 和 `v` 可以是任何方便的名稱，例如 `name` 和 `age`。

## 迭代範圍

```kotlin
for (i in 1..100) { ... }  // closed-ended range: includes 100
for (i in 1..<100) { ... } // open-ended range: does not include 100
for (x in 2..10 step 2) { ... }
for (x in 10 downTo 1) { ... }
(1..10).forEach { ... }
```

## 惰性屬性

```kotlin
val p: String by lazy { // the value is computed only on first access
    // compute the string
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

## 使用行內值類別 (inline value classes) 實現型別安全的值

```kotlin
@JvmInline
value class EmployeeId(private val id: String)

@JvmInline
value class CustomerId(private val id: String)
```

如果您不小心混淆了 `EmployeeId` 和 `CustomerId`，將會觸發編譯錯誤。

> ` @JvmInline ` 註解僅適用於 JVM 後端。
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

## 非空簡寫 (If-not-null shorthand)

```kotlin
val files = File("Test").listFiles()

println(files?.size) // 如果 files 非空，則列印 size
```

## 非空則否簡寫 (If-not-null-else shorthand)

```kotlin
val files = File("Test").listFiles()

// 適用於簡單的備用值：
println(files?.size ?: "empty") // 如果 files 為空，則列印 "empty"

// 若要在程式碼區塊中計算更複雜的備用值，請使用 `run`
val filesSize = files?.size ?: run { 
    val someSize = getSomeSize()
    someSize * 2
}
println(filesSize)
```

## 若為空則執行陳述式

```kotlin
val values = ...
val email = values["email"] ?: throw IllegalStateException("Email is missing!")
```

## 取得可能為空集合的第一個項目

```kotlin
val emails = ... // might be empty
val mainEmail = emails.firstOrNull() ?: ""
```

了解 [Java 和 Kotlin 取得第一個項目](java-to-kotlin-collections-guide.md#get-the-first-and-the-last-items-of-a-possibly-empty-collection) 之間的差異。

## 若非空則執行

```kotlin
val value = ...

value?.let {
    ... // 如果非空則執行此區塊
}
```

## 若非空則映射可空值

```kotlin
val value = ...

val mapped = value?.let { transformValue(it) } ?: defaultValue 
// 如果 value 或轉換結果為空，則回傳 defaultValue。
```

## when 陳述式的回傳值

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

## 回傳 Unit 方法的建造者模式用法

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

這可以有效地與其他慣用語結合，從而產生更短的程式碼。例如，與 `when` 表達式結合使用：

```kotlin
fun transform(color: String): Int = when (color) {
    "Red" -> 0
    "Green" -> 1
    "Blue" -> 2
    else -> throw IllegalArgumentException("Invalid color param value")
}
```

## 在物件實例上呼叫多個方法 (使用 with)

```kotlin
class Turtle {
    fun penDown()
    fun penUp()
    fun turn(degrees: Double)
    fun forward(pixels: Double)
}

val myTurtle = Turtle()
with(myTurtle) { //draw a 100 pix square
    penDown()
    for (i in 1..4) {
        forward(100.0)
        turn(90.0)
    }
    penUp()
}
```

## 配置物件屬性 (使用 apply)

```kotlin
val myRectangle = Rectangle().apply {
    length = 4
    breadth = 5
    color = 0xFAFAFA
}
```

這對於配置建構函數中不存在的屬性很有用。

## Java 7 的 try-with-resources

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

## 將程式碼標記為未完成 (TODO)
 
Kotlin 的標準函式庫有一個 `TODO()` 函數，它總是會拋出 `NotImplementedError`。
它的回傳型別是 `Nothing`，因此無論預期型別為何，都可以使用它。
還有一個接受原因參數的重載：

```kotlin
fun calcTaxes(): BigDecimal = TODO("Waiting for feedback from accounting")
```

IntelliJ IDEA 的 Kotlin 外掛程式理解 `TODO()` 的語義，並自動在 TODO 工具視窗中新增一個程式碼提示。

## 接下來是什麼？

*   使用慣用 Kotlin 風格解決 [Advent of Code 謎題](advent-of-code.md)。
*   學習如何在 [Java 和 Kotlin 中執行常見的字串任務](java-to-kotlin-idioms-strings.md)。
*   學習如何在 [Java 和 Kotlin 中執行常見的集合任務](java-to-kotlin-collections-guide.md)。
*   學習如何在 [Java 和 Kotlin 中處理空值性](java-to-kotlin-nullability-guide.md)。