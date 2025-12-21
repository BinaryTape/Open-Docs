[//]: # (title: Kotlin 1.1 新功能)

發布日期：2016 年 2 月 15 日

## 目錄

*   [協程](#coroutines-experimental)
*   [其他語言功能](#other-language-features)
*   [標準函式庫](#standard-library)
*   [JVM 後端](#jvm-backend)
*   [JavaScript 後端](#javascript-backend)

## JavaScript

從 Kotlin 1.1 開始，JavaScript 目標不再被視為實驗性功能。所有語言功能都獲得支援，並有許多新工具用於整合前端開發環境。請參閱[下方](#javascript-backend)以獲取更詳細的變更列表。

## 協程 (實驗性)

Kotlin 1.1 的關鍵新功能是 *協程 (coroutines)*，它帶來了 `async`/`await`、`yield` 和類似程式設計模式的支援。Kotlin 設計的關鍵特點是協程執行的實作是函式庫的一部分，而非語言本身，因此您不受任何特定程式設計範式或併發函式庫的約束。

協程實際上是一個輕量級執行緒，可以暫停並稍後恢復。協程透過 _[suspend 函數](coroutines-basics.md)_ 獲得支援：呼叫此類函數可能會暫停協程，而要啟動一個新的協程，我們通常使用匿名 suspend 函數（即 suspend lambda 表達式）。

讓我們看看 `async`/`await`，它是在外部函式庫 [kotlinx.coroutines](https://github.com/kotlin/kotlinx.coroutines) 中實作的：

```kotlin
// runs the code in the background thread pool
fun asyncOverlay() = async(CommonPool) {
    // start two async operations
    val original = asyncLoadImage("original")
    val overlay = asyncLoadImage("overlay")
    // and then apply overlay to both results
    applyOverlay(original.await(), overlay.await())
}

// launches new coroutine in UI context
launch(UI) {
    // wait for async overlay to complete
    val image = asyncOverlay().await()
    // and then show it in UI
    showImage(image)
}
```

在這裡，`async { ... }` 啟動一個協程，當我們使用 `await()` 時，協程的執行會暫停，直到被等待的操作執行完畢，然後在被等待的操作完成時恢復（可能在不同的執行緒上）。

標準函式庫使用協程透過 `yield` 和 `yieldAll` 函數支援 *惰性生成的序列 (lazily generated sequences)*。在此類序列中，返回序列元素的程式碼塊在每個元素被檢索後暫停，並在請求下一個元素時恢復。這是一個範例：

```kotlin
import kotlin.coroutines.experimental.*

fun main(args: Array<String>) {
    val seq = buildSequence {
      for (i in 1..5) {
          // yield a square of i
          yield(i * i)
      }
      // yield a range
      yieldAll(26..28)
    }

    // print the sequence
    println(seq.toList())
}
```

執行上面的程式碼以查看結果。隨意編輯它並再次執行！

有關更多資訊，請參閱[協程文件](coroutines-overview.md)和[教學](coroutines-and-channels.md)。

請注意，協程目前被視為一個 **實驗性功能**，這意味著 Kotlin 團隊不承諾在 1.1 最終版本發布後支援此功能的向後相容性。

## 其他語言功能

### 型別別名

型別別名允許您為現有型別定義一個替代名稱。這對於泛型型別（例如集合）以及函數型別最有用。這是一個範例：

```kotlin
//sampleStart
typealias OscarWinners = Map<String, String>

fun countLaLaLand(oscarWinners: OscarWinners) =
        oscarWinners.count { it.value.contains("La La Land") }

// Note that the type names (initial and the type alias) are interchangeable:
fun checkLaLaLandIsTheBestMovie(oscarWinners: Map<String, String>) =
        oscarWinners["Best picture"] == "La La Land"
//sampleEnd

fun oscarWinners(): OscarWinners {
    return mapOf(
            "Best song" to "City of Stars (La La Land)",
            "Best actress" to "Emma Stone (La La Land)",
            "Best picture" to "Moonlight" /* ... */)
}

fun main(args: Array<String>) {
    val oscarWinners = oscarWinners()

    val laLaLandAwards = countLaLaLand(oscarWinners)
    println("LaLaLandAwards = $laLaLandAwards (in our small example), but actually it's 6.")

    val laLaLandIsTheBestMovie = checkLaLaLandIsTheBestMovie(oscarWinners)
    println("LaLaLandIsTheBestMovie = $laLaLandIsTheBestMovie")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

有關更多詳細資訊，請參閱[型別別名文件](type-aliases.md)和 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/type-aliases.md)。

### 繫結可呼叫參照

您現在可以使用 `::` 運算子來取得指向特定物件實例的方法或屬性的[成員參照](reflection.md#function-references)。以前這只能透過 lambda 表達式來實現。這是一個範例：

```kotlin
//sampleStart
val numberRegex = "\\d+".toRegex()
val numbers = listOf("abc", "123", "456").filter(numberRegex::matches)
//sampleEnd

fun main(args: Array<String>) {
    println("Result is $numbers")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

閱讀[文件](reflection.md)和 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/bound-callable-references.md) 以獲取更多詳細資訊。

### 密封類別與資料類別

Kotlin 1.1 移除了 Kotlin 1.0 中對密封類別和資料類別的一些限制。現在您可以在同一個檔案的頂層定義頂層密封類別的子類別，而不再僅限於密封類別的巢狀類別。資料類別現在可以擴展其他類別。這可以用於清晰地定義表達式類別的階層：

```kotlin
//sampleStart
sealed class Expr

data class Const(val number: Double) : Expr()
data class Sum(val e1: Expr, val e2: Expr) : Expr()
object NotANumber : Expr()

fun eval(expr: Expr): Double = when (expr) {
    is Const -> expr.number
    is Sum -> eval(expr.e1) + eval(expr.e2)
    NotANumber -> Double.NaN
}
val e = eval(Sum(Const(1.0), Const(2.0)))
//sampleEnd

fun main(args: Array<String>) {
    println("e is $e") // 3.0
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

閱讀[密封類別文件](sealed-classes.md)或有關[密封類別](https://github.com/Kotlin/KEEP/blob/master/proposals/sealed-class-inheritance.md)和[資料類別](https://github.com/Kotlin/KEEP/blob/master/proposals/data-class-inheritance.md)的 KEEPs 以獲取更多詳細資訊。

### Lambda 表達式中的解構

您現在可以使用[解構宣告](destructuring-declarations.md)語法來解包傳遞給 lambda 表達式的引數。這是一個範例：

```kotlin
fun main(args: Array<String>) {
//sampleStart
    val map = mapOf(1 to "one", 2 to "two")
    // before
    println(map.mapValues { entry ->
      val (key, value) = entry
      "$key -> $value!"
    })
    // now
    println(map.mapValues { (key, value) -> "$key -> $value!" })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

閱讀[解構宣告文件](destructuring-declarations.md)和 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/destructuring-in-parameters.md) 以獲取更多詳細資訊。

### 未使用參數的底線

對於具有多個參數的 lambda 表達式，您可以使用 `_` 字元替換您未使用的參數名稱：

```kotlin
fun main(args: Array<String>) {
    val map = mapOf(1 to "one", 2 to "two")

//sampleStart
    map.forEach { _, value -> println("$value!") }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

這也適用於[解構宣告](destructuring-declarations.md)：

```kotlin
data class Result(val value: Any, val status: String)

fun getResult() = Result(42, "ok").also { println("getResult() returns $it") }

fun main(args: Array<String>) {
//sampleStart
    val (_, status) = getResult()
//sampleEnd
    println("status is '$status'")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

閱讀 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/underscore-for-unused-parameters.md) 以獲取更多詳細資訊。

### 數值字面量中的底線

就像 Java 8 一樣，Kotlin 現在允許在數值字面量中使用底線來分隔數字組：

```kotlin
//sampleStart
val oneMillion = 1_000_000
val hexBytes = 0xFF_EC_DE_5E
val bytes = 0b11010010_01101001_10010100_10010010
//sampleEnd

fun main(args: Array<String>) {
    println(oneMillion)
    println(hexBytes.toString(16))
    println(bytes.toString(2))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

閱讀 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/underscores-in-numeric-literals.md) 以獲取更多詳細資訊。

### 屬性的簡潔語法

對於 getter 定義為表達式主體的屬性，現在可以省略屬性型別：

```kotlin
//sampleStart
    data class Person(val name: String, val age: Int) {
    val isAdult get() = age >= 20 // Property type inferred to be 'Boolean'
}
//sampleEnd
fun main(args: Array<String>) {
    val akari = Person("Akari", 26)
    println("$akari.isAdult = ${akari.isAdult}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 內聯屬性存取器

如果屬性沒有支援欄位，您現在可以使用 `inline` 修飾符標記屬性存取器。此類存取器的編譯方式與[內聯函數](inline-functions.md)相同。

```kotlin
//sampleStart
public val <T> List<T>.lastIndex: Int
    inline get() = this.size - 1
//sampleEnd

fun main(args: Array<String>) {
    val list = listOf('a', 'b')
    // the getter will be inlined
    println("Last index of $list is ${list.lastIndex}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

您也可以將整個屬性標記為 `inline` - 然後修飾符將應用於兩個存取器。

閱讀[內聯函數文件](inline-functions.md#inline-properties)和 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-properties.md) 以獲取更多詳細資訊。

### 局部委託屬性

您現在可以將[委託屬性](delegated-properties.md)語法與局部變數一起使用。一種可能的用途是定義一個惰性求值的局部變數：

```kotlin
import java.util.Random

fun needAnswer() = Random().nextBoolean()

fun main(args: Array<String>) {
//sampleStart
    val answer by lazy {
        println("Calculating the answer...")
        42
    }
    if (needAnswer()) {                     // returns the random value
        println("The answer is $answer.")   // answer is calculated at this point
    }
    else {
        println("Sometimes no answer is the answer...")
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

閱讀 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/local-delegated-properties.md) 以獲取更多詳細資訊。

### 委託屬性綁定的攔截

對於[委託屬性](delegated-properties.md)，現在可以使用 `provideDelegate` 運算子攔截委託到屬性的綁定。例如，如果我們想在綁定之前檢查屬性名稱，我們可以這樣寫：

```kotlin
class ResourceLoader<T>(id: ResourceID<T>) {
    operator fun provideDelegate(thisRef: MyUI, prop: KProperty<*>): ReadOnlyProperty<MyUI, T> {
        checkProperty(thisRef, prop.name)
        ... // property creation
    }

    private fun checkProperty(thisRef: MyUI, name: String) { ... }
}

fun <T> bindResource(id: ResourceID<T>): ResourceLoader<T> { ... }

class MyUI {
    val image by bindResource(ResourceID.image_id)
    val text by bindResource(ResourceID.text_id)
}
```

`provideDelegate` 方法將在 `MyUI` 實例建立期間為每個屬性呼叫，並且它可以立即執行必要的驗證。

閱讀[委託屬性文件](delegated-properties.md)以獲取更多詳細資訊。

### 泛型列舉值存取

現在可以以泛型方式列舉列舉類別的值。

```kotlin
//sampleStart
enum class RGB { RED, GREEN, BLUE }

inline fun <reified T : Enum<T>> printAllValues() {
    print(enumValues<T>().joinToString { it.name })
}
//sampleEnd

fun main(args: Array<String>) {
    printAllValues<RGB>() // prints RED, GREEN, BLUE
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### DSL 中隱式接收者的作用域控制

[`@DslMarker`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-dsl-marker/index.html) 註解允許限制在 DSL 內容中使用外部作用域的接收者。考慮典型的 [HTML 建造器範例](type-safe-builders.md)：

```kotlin
table {
    tr {
        td { + "Text" }
    }
}
```

在 Kotlin 1.0 中，傳遞給 `td` 的 lambda 表達式中的程式碼可以存取三個隱式接收者：傳遞給 `table`、`tr` 和 `td` 的接收者。這允許您呼叫在該內容中沒有意義的方法——例如在 `td` 內部呼叫 `tr`，從而在 `<td>` 中放入一個 `<tr>` 標籤。

在 Kotlin 1.1 中，您可以限制這一點，以便只有在 `td` 的隱式接收者上定義的方法才能在傳遞給 `td` 的 lambda 表達式中可用。您透過定義帶有 `@DslMarker` 元註解的註解並將其應用於標籤類別的基類來實現此目的。

閱讀[型別安全建造器文件](type-safe-builders.md)和 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/scope-control-for-implicit-receivers.md) 以獲取更多詳細資訊。

### rem 運算子

`mod` 運算子現在已棄用，改用 `rem`。有關動機，請參閱[此問題](https://youtrack.jetbrains.com/issue/KT-14650)。

## 標準函式庫

### 字串到數字的轉換

`String` 類別上有一系列新的擴展函數，可以將其轉換為數字而不會在無效數字時拋出異常：`String.toIntOrNull(): Int?`、`String.toDoubleOrNull(): Double?` 等。

```kotlin
val port = System.getenv("PORT")?.toIntOrNull() ?: 80
```

此外，整數轉換函數，如 `Int.toString()`、`String.toInt()`、`String.toIntOrNull()`，每個都新增了一個帶有 `radix` 參數的重載，允許指定轉換的基數（2 到 36）。

### onEach()

`onEach` 是一個小巧但有用的集合和序列擴展函數，它允許在操作鏈中對集合/序列的每個元素執行某些操作，可能伴隨副作用。對於可迭代物件，它的行為類似 `forEach`，但也會返回可迭代實例。對於序列，它返回一個包裝序列，該序列在元素被迭代時惰性地應用給定的操作。

```kotlin
inputDir.walk()
        .filter { it.isFile && it.name.endsWith(".txt") }
        .onEach { println("Moving $it to $outputDir") }
        .forEach { moveFile(it, File(outputDir, it.toRelativeString(inputDir))) }
```

### also()、takeIf() 和 takeUnless()

這三個是適用於任何接收者的通用擴展函數。

`also` 類似於 `apply`：它接受接收者，對其執行一些操作，然後返回該接收者。區別在於，在 `apply` 內部的程式碼塊中，接收者以 `this` 的形式可用，而在 `also` 內部的程式碼塊中，它以 `it` 的形式可用（如果您願意，可以給它另一個名稱）。當您不想遮蔽外部作用域的 `this` 時，這會很方便：

```kotlin
class Block {
    lateinit var content: String
}

//sampleStart
fun Block.copy() = Block().also {
    it.content = this.content
}
//sampleEnd

// using 'apply' instead
fun Block.copy1() = Block().apply {
    this.content = this@copy1.content
}

fun main(args: Array<String>) {
    val block = Block().apply { content = "content" }
    val copy = block.copy()
    println("Testing the content was copied:")
    println(block.content == copy.content)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`takeIf` 類似於單一值的 `filter`。它檢查接收者是否符合判斷式，如果符合則返回接收者，否則返回 `null`。結合 elvis 運算子 (?:) 和早期返回，它允許編寫如下結構：

```kotlin
val outDirFile = File(outputDir.path).takeIf { it.exists() } ?: return false
// do something with existing outDirFile
```

```kotlin
fun main(args: Array<String>) {
    val input = "Kotlin"
    val keyword = "in"

//sampleStart
    val index = input.indexOf(keyword).takeIf { it >= 0 } ?: error("keyword not found")
    // do something with index of keyword in input string, given that it's found
//sampleEnd
    
    println("'$keyword' was found in '$input'")
    println(input)
    println(" ".repeat(index) + "^")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`takeUnless` 與 `takeIf` 相同，但它接受反向判斷式。當接收者_不_符合判斷式時，它返回接收者，否則返回 `null`。因此，上面的一個範例可以用 `takeUnless` 改寫如下：

```kotlin
val index = input.indexOf(keyword).takeUnless { it < 0 } ?: error("keyword not found")
```

當您有可呼叫參照而不是 lambda 表達式時，使用它也很方便：

```kotlin
private fun testTakeUnless(string: String) {
//sampleStart
    val result = string.takeUnless(String::isEmpty)
//sampleEnd

    println("string = \"$string\"; result = \"$result\"")
}

fun main(args: Array<String>) {
    testTakeUnless("")
    testTakeUnless("abc")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### groupingBy()

此 API 可用於按鍵分組集合並同時折疊每個組。例如，它可用於計算每個字母開頭的單詞數量：

```kotlin
fun main(args: Array<String>) {
    val words = "one two three four five six seven eight nine ten".split(' ')
//sampleStart
    val frequencies = words.groupingBy { it.first() }.eachCount()
//sampleEnd
    println("Counting first letters: $frequencies.")

    // The alternative way that uses 'groupBy' and 'mapValues' creates an intermediate map, 
    // while 'groupingBy' way counts on the fly.
    val groupBy = words.groupBy { it.first() }.mapValues { (_, list) -> list.size }
    println("Comparing the result with using 'groupBy': ${groupBy == frequencies}.")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### Map.toMap() 和 Map.toMutableMap()

這些函數可用於輕鬆複製 Map：

```kotlin
class ImmutablePropertyBag(map: Map<String, Any>) {
    private val mapCopy = map.toMap()
}
```

### Map.minus(key)

`plus` 運算子提供了一種向唯讀 Map 添加鍵值對並產生新 Map 的方式，但之前沒有簡單的方法來執行相反的操作：要從 Map 中移除一個鍵，您必須訴諸於較不直接的方式，例如 `Map.filter()` 或 `Map.filterKeys()`。現在 `minus` 運算子填補了這個空白。有 4 個重載可用：用於移除單一鍵、鍵的集合、鍵的序列和鍵的陣列。

```kotlin
fun main(args: Array<String>) {
//sampleStart
    val map = mapOf("key" to 42)
    val emptyMap = map - "key"
//sampleEnd
    
    println("map: $map")
    println("emptyMap: $emptyMap")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### minOf() 和 maxOf()

這些函數可用於查找兩個或三個給定值中的最低和最高值，其中這些值是原始數字或 `Comparable` 物件。如果需要比較本身不可比較的物件，每個函數還有一個重載，接受一個額外的 `Comparator` 實例。

```kotlin
fun main(args: Array<String>) {
//sampleStart
    val list1 = listOf("a", "b")
    val list2 = listOf("x", "y", "z")
    val minSize = minOf(list1.size, list2.size)
    val longestList = maxOf(list1, list2, compareBy { it.size })
//sampleEnd
    
    println("minSize = $minSize")
    println("longestList = $longestList")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 類陣列的 List 實例化函數

類似於 `Array` 構造函數，現在有函數可以建立 `List` 和 `MutableList` 實例，並透過呼叫 lambda 表達式初始化每個元素：

```kotlin
fun main(args: Array<String>) {
//sampleStart
    val squares = List(10) { index -> index * index }
    val mutable = MutableList(10) { 0 }
//sampleEnd

    println("squares: $squares")
    println("mutable: $mutable")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### Map.getValue()

`Map` 上的這個擴展函數返回與給定鍵對應的現有值，如果找不到該鍵則拋出異常並提及哪個鍵未找到。如果 Map 是用 `withDefault` 產生的，此函數將返回預設值而不是拋出異常。

```kotlin
fun main(args: Array<String>) {
//sampleStart    
    val map = mapOf("key" to 42)
    // returns non-nullable Int value 42
    val value: Int = map.getValue("key")

    val mapWithDefault = map.withDefault { k -> k.length }
    // returns 4
    val value2 = mapWithDefault.getValue("key2")

    // map.getValue("anotherKey") // <- this will throw NoSuchElementException
//sampleEnd
    
    println("value is $value")
    println("value2 is $value2")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 抽象集合

這些抽象類別可用作實作 Kotlin 集合類別的基類。對於實作唯讀集合，有 `AbstractCollection`、`AbstractList`、`AbstractSet` 和 `AbstractMap`，對於可變集合，有 `AbstractMutableCollection`、`AbstractMutableList`、`AbstractMutableSet` 和 `AbstractMutableMap`。在 JVM 上，這些抽象可變集合的大部分功能繼承自 JDK 的抽象集合。

### 陣列操作函數

標準函式庫現在提供了一組用於陣列元素級操作的函數：比較 (`contentEquals` 和 `contentDeepEquals`)、雜湊碼計算 (`contentHashCode` 和 `contentDeepHashCode`) 以及轉換為字串 (`contentToString` 和 `contentDeepToString`)。它們在 JVM（在此處它們充當 `java.util.Arrays` 中相應函數的別名）和 JS（在此處實作在 Kotlin 標準函式庫中提供）中都受支援。

```kotlin
fun main(args: Array<String>) {
//sampleStart
    val array = arrayOf("a", "b", "c")
    println(array.toString())  // JVM implementation: type-and-hash gibberish
    println(array.contentToString())  // nicely formatted as list
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## JVM 後端

### Java 8 位元碼支援

Kotlin 現在可以選擇生成 Java 8 位元碼（`-jvm-target 1.8` 命令列選項或 Ant/Maven/Gradle 中相應的選項）。目前這不會改變位元碼的語義（特別是，介面中的預設方法和 lambda 表達式與 Kotlin 1.0 中完全相同），但我們計劃稍後進一步利用這一點。

### Java 8 標準函式庫支援

現在有獨立版本的標準函式庫支援 Java 7 和 8 中新增的 JDK API。如果您需要存取新的 API，請使用 `kotlin-stdlib-jre7` 和 `kotlin-stdlib-jre8` Maven 構件，而不是標準的 `kotlin-stdlib`。這些構件是 `kotlin-stdlib` 之上的微小擴展，它們將其作為傳遞依賴項引入您的專案。

### 位元碼中的參數名稱

Kotlin 現在支援在位元碼中儲存參數名稱。這可以使用 `-java-parameters` 命令列選項啟用。

### 常數內聯

編譯器現在將 `const val` 屬性的值內聯到它們被使用的位置。

### 可變閉包變數

用於在 lambda 表達式中捕獲可變閉包變數的 box 類別不再具有 volatile 欄位。此更改提高了效能，但在某些罕見的使用場景中可能導致新的競爭條件。如果您受到此影響，則需要為存取變數提供自己的同步機制。

### javax.script 支援

Kotlin 現在整合了 [javax.script API](https://docs.oracle.com/javase/8/docs/api/javax/script/package-summary.html) (JSR-223)。該 API 允許在執行時評估程式碼片段：

```kotlin
val engine = ScriptEngineManager().getEngineByExtension("kts")!!
engine.eval("val x = 3")
println(engine.eval("x + 2"))  // Prints out 5
```

請參閱[此處](https://github.com/JetBrains/kotlin/tree/1.1.0/libraries/examples/kotlin-jsr223-local-example)以獲取使用該 API 的更大範例專案。

### kotlin.reflect.full

為了[準備支援 Java 9](https://blog.jetbrains.com/kotlin/2017/01/kotlin-1-1-whats-coming-in-the-standard-library/)，`kotlin-reflect.jar` 函式庫中的擴展函數和屬性已移至 `kotlin.reflect.full` 套件。舊套件 (`kotlin.reflect`) 中的名稱已棄用，並將在 Kotlin 1.2 中移除。請注意，核心反射介面（例如 `KClass`）是 Kotlin 標準函式庫的一部分，而非 `kotlin-reflect`，並且不受此移動的影響。

## JavaScript 後端

### 統一標準函式庫

現在可以從編譯為 JavaScript 的程式碼中使用更大一部分 Kotlin 標準函式庫。特別是，關鍵類別如集合 (`ArrayList`、`HashMap` 等)、異常 (`IllegalArgumentException` 等) 和一些其他類別 (`StringBuilder`、`Comparator`) 現在都在 `kotlin` 套件下定義。在 JVM 上，這些名稱是相應 JDK 類別的型別別名，而在 JS 上，這些類別是在 Kotlin 標準函式庫中實作的。

### 更好的程式碼生成

JavaScript 後端現在產生更多靜態可檢查的程式碼，這對 JS 程式碼處理工具（如程式碼壓縮器、最佳化器、程式碼風格檢查器等）更友好。

### external 修飾符

如果您需要以型別安全的方式從 Kotlin 存取 JavaScript 中實作的類別，您可以使用 `external` 修飾符編寫 Kotlin 宣告。（在 Kotlin 1.0 中，改用 `@native` 註解）。與 JVM 目標不同，JS 目標允許對類別和屬性使用 external 修飾符。例如，以下是如何宣告 DOM `Node` 類別：

```kotlin
external class Node {
    val firstChild: Node

    fun appendChild(child: Node): Node

    fun removeChild(child: Node): Node

    // etc
}
```

### 改進的導入處理

您現在可以更精確地描述應從 JavaScript 模組導入的宣告。如果您在外部宣告上添加 `@JsModule("<module-name>")` 註解，它將在編譯期間正確導入到模組系統（CommonJS 或 AMD）。例如，對於 CommonJS，宣告將透過 `require(...)` 函數導入。此外，如果您想將宣告作為模組或作為全域 JavaScript 物件導入，您可以使用 `@JsNonModule` 註解。

例如，以下是如何將 JQuery 導入 Kotlin 模組：

```kotlin
external interface JQuery {
    fun toggle(duration: Int = definedExternally): JQuery
    fun click(handler: (Event) -> Unit): JQuery
}

@JsModule("jquery")
@JsNonModule
@JsName("$")
external fun jquery(selector: String): JQuery
```

在這種情況下，JQuery 將作為名為 `jquery` 的模組導入。或者，它可以作為一個 $-物件 使用，這取決於 Kotlin 編譯器配置為使用的模組系統。

您可以在應用程式中這樣使用這些宣告：

```kotlin
fun main(args: Array<String>) {
    jquery(".toggle-button").click {
        jquery(".toggle-panel").toggle(300)
    }
}