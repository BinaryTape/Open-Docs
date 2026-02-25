[//]: # (title: 習慣用法)

這裡收集了 Kotlin 中常見且常用的各種習慣用法。如果你有喜歡的習慣用法，歡迎透過傳送 [提取要求 (PR)](pull-request.md) 來貢獻。

## 建立 DTO (POJO/POCO)

```kotlin
data class Customer(val name: String, val email: String)
```

這會提供一個具備以下功能的 `Customer` 類別：

* 所有屬性的 getter（如果是 `var` 則還有 setter）
* `equals()`
* `hashCode()`
* `toString()`
* `copy()`
* 所有屬性的 `component1()`、`component2()` 等（請參閱 [資料類別](data-classes.md)）

## 函式參數的預設值

```kotlin
fun foo(a: Int = 0, b: String = "") { ... }
```

## 篩選清單

```kotlin
val positives = list.filter { x -> x > 0 }
```

或者，更簡短的寫法：

```kotlin
val positives = list.filter { it > 0 }
```

進一步了解 [Java 與 Kotlin 篩選之間的差異](java-to-kotlin-collections-guide.md#filter-elements)。

## 檢查集合中是否存在某個元素

```kotlin
if ("john@example.com" in emailsList) { ... }

if ("jane@example.com" !in emailsList) { ... }
```

## 字串插值

```kotlin
println("Name $name")
```

進一步了解 [Java 與 Kotlin 字串連接之間的差異](java-to-kotlin-idioms-strings.md#concatenate-strings)。

## 安全地讀取標準輸入

```kotlin
// 讀取一個字串，如果輸入無法轉換為整數（例如：Hi there!），則傳回 null
val wrongInt = readln().toIntOrNull()
println(wrongInt)
// null

// 讀取可以轉換為整數的字串並傳回整數（例如：13）
val correctInt = readln().toIntOrNull()
println(correctInt)
// 13
```

若要了解更多資訊，請參閱 [讀取標準輸入](read-standard-input.md)。

## 執行個體檢查

```kotlin
when (x) {
    is Foo -> ...
    is Bar -> ...
    else   -> ...
}
```

## 唯讀清單

```kotlin
val list = listOf("a", "b", "c")
```

## 唯讀 Map

```kotlin
val map = mapOf("a" to 1, "b" to 2, "c" to 3)
```

## 存取 Map 項目

```kotlin
println(map["key"])
map["key"] = value
```

## 遍歷 Map 或成對清單

```kotlin
for ((k, v) in map) {
    println("$k -> $v")
}
```

`k` 和 `v` 可以是任何方便的名稱，例如 `name` 和 `age`。

## 在範圍內疊代

```kotlin
for (i in 1..100) { ... }  // 閉合範圍：包含 100
for (i in 1..<100) { ... } // 半開範圍：不包含 100
for (x in 2..10 step 2) { ... }
for (x in 10 downTo 1) { ... }
(1..10).forEach { ... }
```

## 延遲屬性

```kotlin
val p: String by lazy { // 僅在首次存取時計算值
    // 計算字串
}
```

## 擴充函式

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

## 使用內聯值類別以實現型別安全的值

```kotlin
@JvmInline
value class EmployeeId(private val id: String)

@JvmInline
value class CustomerId(private val id: String)
```

如果你不小心混淆了 `EmployeeId` 和 `CustomerId`，則會觸發編譯錯誤。

> `@JvmInline` 註解僅在 JVM 後端需要。
>
{style="note"}

## 具現化抽象類別

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

println(files?.size) // 如果 files 不為 null，則列印大小
```

## If-not-null-else 簡寫

```kotlin
val files = File("Test").listFiles()

// 對於簡單的備援值：
println(files?.size ?: "empty") // 如果 files 為 null，這會列印 "empty"

// 若要在程式碼區塊中計算更複雜的備援值，請使用 `run`
val filesSize = files?.size ?: run { 
    val someSize = getSomeSize()
    someSize * 2
}
println(filesSize)
```

## 如果為 null 則執行運算式

```kotlin
val values = ...
val email = values["email"] ?: throw IllegalStateException("Email is missing!")
```

## 從可能為空的集合中獲取第一個項目

```kotlin
val emails = ... // 可能為空
val mainEmail = emails.firstOrNull() ?: ""
```

進一步了解 [Java 與 Kotlin 獲取第一個項目之間的差異](java-to-kotlin-collections-guide.md#get-the-first-and-the-last-items-of-a-possibly-empty-collection)。

## 如果不為 null 則執行

```kotlin
val value = ...

value?.let {
    ... // 如果不為 null 則執行此區塊
}
```

## 如果不為 null 則映射可為 null 的值

```kotlin
val value = ...

val mapped = value?.let { transformValue(it) } ?: defaultValue 
// 如果值或轉換結果為 null，則傳回 defaultValue。
```

## 在 when 陳述式中傳回

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

## try-catch 運算式

```kotlin
fun test() {
    val result = try {
        count()
    } catch (e: ArithmeticException) {
        throw IllegalStateException(e)
    }

    // 使用 result 進行操作
}
```

## if 運算式

```kotlin
val y = if (x == 1) {
    "one"
} else if (x == 2) {
    "two"
} else {
    "other"
}
```

## 傳回 Unit 的方法之生成器風格用法

```kotlin
fun arrayOfMinusOnes(size: Int): IntArray {
    return IntArray(size).apply { fill(-1) }
}
```

## 單運算式函式

```kotlin
fun theAnswer() = 42
```

這等同於：

```kotlin
fun theAnswer(): Int {
    return 42
}
```

這可以有效地與其他習慣用法結合，從而縮短程式碼。例如與 `when` 運算式結合：

```kotlin
fun transform(color: String): Int = when (color) {
    "Red" -> 0
    "Green" -> 1
    "Blue" -> 2
    else -> throw IllegalArgumentException("Invalid color param value")
}
```

## 在物件執行個體上呼叫多個方法 (with)

```kotlin
class Turtle {
    fun penDown()
    fun penUp()
    fun turn(degrees: Double)
    fun forward(pixels: Double)
}

val myTurtle = Turtle()
with(myTurtle) { // 畫一個 100 像素的正方形
    penDown()
    for (i in 1..4) {
        forward(100.0)
        turn(90.0)
    }
    penUp()
}
```

## 設定物件屬性 (apply)

```kotlin
val myRectangle = Rectangle().apply {
    length = 4
    breadth = 5
    color = 0xFAFAFA
}
```

這對於設定不在物件建構函式中的屬性非常有用。

## Java 7 的 try-with-resources

```kotlin
val stream = Files.newInputStream(Paths.get("/some/file.txt"))
stream.buffered().reader().use { reader ->
    println(reader.readText())
}
```

## 需要泛型型別資訊的泛型函式

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
 
Kotlin 的標準函式庫有一個 `TODO()` 函式，它始終會拋出 `NotImplementedError`。
其傳回型別為 `Nothing`，因此無論預期型別為何都可以使用。
還有一個接受原因參數的多載版本：

```kotlin
fun calcTaxes(): BigDecimal = TODO("正在等待會計部門的回饋")
```

IntelliJ IDEA 的 Kotlin 外掛程式能夠理解 `TODO()` 的語意，並自動在 TODO 工具視窗中加入程式碼指標。

## 下一步？

* 使用慣用的 Kotlin 風格解決 [Advent of Code 謎題](advent-of-code.md)。
* 了解如何 [在 Java 與 Kotlin 中執行字串的典型任務](java-to-kotlin-idioms-strings.md)。
* 了解如何 [在 Java 與 Kotlin 中執行集合的典型任務](java-to-kotlin-collections-guide.md)。
* 了解如何 [在 Java 與 Kotlin 中處理可為 null 性](java-to-kotlin-nullability-guide.md)。