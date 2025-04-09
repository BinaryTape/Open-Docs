---
title: "Kotlin 1.1 的新特性"
---
_發布日期：2016 年 2 月 15 日_

## 目錄

* [協程 (Coroutines)](#coroutines-experimental)
* [其他語言特性 (Other language features)](#other-language-features)
* [標準函式庫 (Standard library)](#standard-library)
* [JVM 後端 (JVM backend)](#jvm-backend)
* [JavaScript 後端 (JavaScript backend)](#javascript-backend)

## JavaScript

從 Kotlin 1.1 開始，JavaScript 目標不再被視為實驗性功能。支援所有語言特性，並且有許多新工具可以與前端開發環境整合。有關更詳細的變更清單，請參閱[下方](#javascript-backend)。

## 協程 (Coroutines) (實驗性)

Kotlin 1.1 的主要新特性是*協程 (coroutines)*，它帶來了對 `async`/`await`、`yield` 和類似程式設計模式的支援。Kotlin 設計的關鍵特性是協程執行的實作是函式庫的一部分，而不是語言的一部分，因此您不受任何特定程式設計範例或並行函式庫的約束。

協程 (Coroutine) 實際上是一個輕量級的線程，可以被暫停並在以後恢復。協程 (Coroutines) 通過_[暫停函式 (suspending functions)](coroutines-basics#extract-function-refactoring)_支援：呼叫這樣的函式可能會暫停協程 (Coroutine)，並且為了啟動一個新的協程 (Coroutine)，我們通常使用一個匿名暫停函式 (suspending functions)（即，暫停的 Lambda 運算式）。

讓我們看看 `async`/`await`，它是在一個外部函式庫 [kotlinx.coroutines](https://github.com/kotlin/kotlinx.coroutines) 中實現的：

```kotlin
// 在背景執行緒池中執行程式碼
fun asyncOverlay() = async(CommonPool) {
    // 啟動兩個非同步操作
    val original = asyncLoadImage("original")
    val overlay = asyncLoadImage("overlay")
    // 然後將疊加應用於兩個結果
    applyOverlay(original.await(), overlay.await())
}

// 在 UI 執行緒中啟動新的協程
launch(UI) {
    // 等待非同步疊加完成
    val image = asyncOverlay().await()
    // 然後在 UI 中顯示它
    showImage(image)
}
```

在這裡，`async { ... }` 啟動一個協程，當我們使用 `await()` 時，協程的執行會被暫停，同時執行等待的操作，並且在等待的操作完成後恢復（可能在不同的執行緒上）。

標準函式庫使用協程來支援使用 `yield` 和 `yieldAll` 函式*延遲產生的序列 (lazily generated sequences)*。在這樣的序列中，返回序列元素的程式碼塊在檢索到每個元素後被暫停，並在請求下一個元素時恢復。這是一個例子：

```kotlin
import kotlin.coroutines.experimental.*

fun main(args: Array<String>) {
    val seq = buildSequence {
      for (i in 1..5) {
          // 產生 i 的平方
          yield(i * i)
      }
      // 產生一個範圍
      yieldAll(26..28)
    }

    // 印出序列
    println(seq.toList())
}
```

執行上面的程式碼以查看結果。隨時編輯它並再次執行！

有關更多資訊，請參閱[協程 (coroutines) 文件](coroutines-overview)和[教學](coroutines-and-channels)。

請注意，協程 (coroutines) 目前被認為是一個**實驗性功能 (experimental feature)**，這意味著 Kotlin 團隊不承諾在最終的 1.1 版本發布後支援此功能的向後相容性。

## 其他語言特性 (Other language features)

### 型別別名 (Type aliases)

型別別名 (type alias) 允許您為現有類型定義替代名稱。這對於泛型類型（例如集合）以及函式類型最有用。這是一個例子：

```kotlin

typealias OscarWinners = Map<String, String>

fun countLaLaLand(oscarWinners: OscarWinners) =
        oscarWinners.count { it.value.contains("La La Land") }

// 請注意，類型名稱（初始和型別別名）是可以互換的：
fun checkLaLaLandIsTheBestMovie(oscarWinners: Map<String, String>) =
        oscarWinners["Best picture"] == "La La Land"

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

有關更多詳細資訊，請參閱[型別別名文件](type-aliases)和 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/type-aliases)。

### 綁定的可呼叫引用 (Bound callable references)

您現在可以使用 `::` 運算子來取得指向特定物件實例的方法或屬性的[成員引用 (member reference)](reflection#function-references)。以前，這只能用 Lambda 運算式表達。這是一個例子：

```kotlin

val numberRegex = "\\d+".toRegex()
val numbers = listOf("abc", "123", "456").filter(numberRegex::matches)

fun main(args: Array<String>) {
    println("Result is $numbers")
}
```

閱讀 [文件](reflection) 和 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/bound-callable-references) 以取得更多詳細資訊。

### 密封類別 (Sealed classes) 和資料類別 (data classes)

Kotlin 1.1 移除了一些在 Kotlin 1.0 中存在的對密封類別 (sealed classes) 和資料類別 (data classes) 的限制。現在，您可以在同一檔案的頂層定義頂層密封類別 (sealed classes) 的子類別，而不僅僅是密封類別 (sealed classes) 的巢狀類別。資料類別 (data classes) 現在可以擴展其他類別。這可以用於優雅而乾淨地定義表達式類別的層次結構：

```kotlin

sealed class Expr

data class Const(val number: Double) : Expr()
data class Sum(val e1: Expr, val e2: Expr) : Expr()
object NotANumber : Expr()

fun eval(expr: Expr): Double = when (expr) {
    is Const `->` expr.number
    is Sum `->` eval(expr.e1) + eval(expr.e2)
    NotANumber `->` Double.NaN
}
val e = eval(Sum(Const(1.0), Const(2.0)))

fun main(args: Array<String>) {
    println("e is $e") // 3.0
}
```

閱讀 [密封類別文件](sealed-classes) 或 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/sealed-class-inheritance) 以及 [資料類別](https://github.com/Kotlin/KEEP/blob/master/proposals/data-class-inheritance) 了解更多詳細資訊。

### Lambda 運算式中的解構 (Destructuring)

您現在可以使用[解構宣告 (destructuring declaration)](destructuring-declarations)語法來解包傳遞給 Lambda 運算式的引數。這是一個例子：

```kotlin
fun main(args: Array<String>) {

    val map = mapOf(1 to "one", 2 to "two")
    // 之前
    println(map.mapValues { entry `->`
      val (key, value) = entry
      "$key `->` $value!"
    })
    // 現在
    println(map.mapValues { (key, value) `->` "$key `->` $value!" })

}
```

閱讀 [解構宣告文件](destructuring-declarations) 和 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/destructuring-in-parameters) 以取得更多詳細資訊。

### 用於未使用參數的底線 (Underscores)

對於具有多個參數的 Lambda 運算式，您可以使用 `_` 字元來替換您不使用的參數的名稱：

```kotlin
fun main(args: Array<String>) {
    val map = mapOf(1 to "one", 2 to "two")

    map.forEach { _, value `->` println("$value!") }

}
```

這也適用於[解構宣告](destructuring-declarations)：

```kotlin
data class Result(val value: Any, val status: String)

fun getResult() = Result(42, "ok").also { println("getResult() returns $it") }

fun main(args: Array<String>) {

    val (_, status) = getResult()

    println("status is '$status'")
}
```

閱讀 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/underscore-for-unused-parameters) 以取得更多詳細資訊。

### 數字字面值中的底線 (Underscores)

就像在 Java 8 中一樣，Kotlin 現在允許在數字字面值中使用底線來分隔數字組：

```kotlin

val oneMillion = 1_000_000
val hexBytes = 0xFF_EC_DE_5E
val bytes = 0b11010010_01101001_10010100_10010010

fun main(args: Array<String>) {
    println(oneMillion)
    println(hexBytes.toString(16))
    println(bytes.toString(2))
}
```

閱讀 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/underscores-in-numeric-literals) 以取得更多詳細資訊。

### 屬性的較短語法 (Shorter syntax)

對於將 getter 定義為表達式主體的屬性，現在可以省略屬性類型：

```kotlin

    data class Person(val name: String, val age: Int) {
    val isAdult get() = age >= 20 // 屬性類型推斷為 'Boolean'
}

fun main(args: Array<String>) {
    val akari = Person("Akari", 26)
    println("$akari.isAdult = ${akari.isAdult}")
}
```

### Inline 屬性存取器 (Inline property accessors)

如果屬性沒有後端欄位 (backing field)，您現在可以使用 `inline` 修飾符標記屬性存取器。這些存取器的編譯方式與 [Inline 函式 (inline functions)](inline-functions) 相同。

```kotlin

public val <T> List<T>.lastIndex: Int
    inline get() = this.size - 1

fun main(args: Array<String>) {
    val list = listOf('a', 'b')
    // getter 將被 inline
    println("Last index of $list is ${list.lastIndex}")
}
```

您也可以將整個屬性標記為 `inline` - 然後修飾符將應用於兩個存取器。

閱讀 [Inline 函式 (inline functions) 文件](inline-functions#inline-properties) 和 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-properties) 以取得更多詳細資訊。

### 本機委託屬性 (Local delegated properties)

您現在可以將[委託屬性 (delegated property)](delegated-properties)語法與本機變數一起使用。一種可能的用途是定義一個延遲評估的本機變數：

```kotlin
import java.util.Random

fun needAnswer() = Random().nextBoolean()

fun main(args: Array<String>) {

    val answer by lazy {
        println("Calculating the answer...")
        42
    }
    if (needAnswer()) {                     // 傳回隨機值
        println("The answer is $answer.")   // 在此時計算答案
    }
    else {
        println("Sometimes no answer is the answer...")
    }

}
```

閱讀 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/local-delegated-properties) 以取得更多詳細資訊。

### 攔截委託屬性綁定 (Interception of delegated property binding)

對於[委託屬性 (delegated properties)](delegated-properties)，現在可以使用 `provideDelegate` 運算子攔截委託給屬性的綁定。例如，如果我們想在綁定之前檢查屬性名稱，我們可以這樣寫：

```kotlin
class ResourceLoader<T>(id: ResourceID<T>) {
    operator fun provideDelegate(thisRef: MyUI, prop: KProperty<*>): ReadOnlyProperty<MyUI, T> {
        checkProperty(thisRef, prop.name)
        ... // 屬性建立
    }

    private fun checkProperty(thisRef: MyUI, name: String) { ... }
}

fun <T> bindResource(id: ResourceID<T>): ResourceLoader<T> { ... }

class MyUI {
    val image by bindResource(ResourceID.image_id)
    val text by bindResource(ResourceID.text_id)
}
```

在建立 `MyUI` 實例期間，將為每個屬性呼叫 `provideDelegate` 方法，並且它可以立即執行必要的驗證。

閱讀 [委託屬性文件](delegated-properties) 以取得更多詳細資訊。

### 泛型列舉值存取 (Generic enum value access)

現在可以以泛型方式枚舉列舉類別 (enum class) 的值。

```kotlin

enum class RGB { RED, GREEN, BLUE }

inline fun <reified T : Enum<T>> printAllValues() {
    print(enumValues<T>().joinToString { it.name })
}

fun main(args: Array<String>) {
    printAllValues<RGB>() // 印出 RED, GREEN, BLUE
}
```

### DSL 中隱式接收者的範圍控制 (Scope control)

[`@DslMarker`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-dsl-marker/index.html) 註釋允許限制在 DSL 環境中使用來自外部範圍的接收者。考慮典型的 [HTML 建立器範例](type-safe-builders)：

```kotlin
table {
    tr {
        td { + "Text" }
    }
}
```

在 Kotlin 1.0 中，傳遞給 `td` 的 Lambda 運算式中的程式碼可以存取三個隱式接收者：傳遞給 `table` 的、傳遞給 `tr` 的和傳遞給 `td` 的。這允許您呼叫在上下文中沒有意義的方法 - 例如，在 `td` 內部呼叫 `tr`，從而將 `<tr>` 標籤放在 `<td>` 中。

在 Kotlin 1.1 中，您可以限制這一點，以便只有在傳遞給 `td` 的 Lambda 運算式中才能使用在 `td` 的隱式接收者上定義的方法。您可以透過定義用 `@DslMarker` 元註釋標記的註釋，並將其應用於標籤類別的基類來做到這一點。

閱讀 [類型安全建立器文件](type-safe-builders) 和 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/scope-control-for-implicit-receivers) 以取得更多詳細資訊。

### rem 運算符

`mod` 運算符現在已棄用，而改為使用 `rem`。有關動機，請參閱[此問題](https://youtrack.jetbrains.com/issue/KT-14650)。

## 標準函式庫 (Standard library)

### 字串到數字的轉換 (String to number conversions)

字串類別上有一堆新的擴展，用於將其轉換為數字，而不會在無效數字上拋出例外：`String.toIntOrNull(): Int?`、`String.toDoubleOrNull(): Double?` 等。

```kotlin
val port = System.getenv("PORT")?.toIntOrNull() ?: 80
```

此外，整數轉換函式，如 `Int.toString()`、`String.toInt()`、`String.toIntOrNull()`，每個都有一個帶有 `radix` 參數的重載，允許指定轉換的基數（2 到 36）。

### onEach()

`onEach` 是一個小而有用的集合和序列擴展函式，它允許在操作鏈中對集合/序列的每個元素執行某些操作，可能具有副作用。在可迭代物件上，它的行為類似於 `forEach`，但也進一步傳回可迭代物件實例。在序列上，它傳回一個包裝序列，該序列在元素被迭代時延遲應用給定的操作。

```kotlin
inputDir.walk()
        .filter { it.isFile && it.name.endsWith(".txt") }
        .onEach { println("Moving $it to $outputDir") }
        .forEach { moveFile(it, File(outputDir, it.toRelativeString(inputDir))) }
```

### also()、takeIf() 和 takeUnless()

這些是適用於任何接收者的三個通用擴展函式。

`also` 類似於 `apply`：它接收接收者，對其執行某些操作，然後傳回該接收者。不同之處在於，在 `apply` 內部的塊中，接收者可以作為 `this` 使用，而在 `also` 內部的塊中，它可以作為 `it` 使用（如果您願意，可以給它另一個名稱）。當您不想遮蔽外部範圍的 `this` 時，這很方便：

```kotlin
class Block {
    lateinit var content: String
}

fun Block.copy() = Block().also {
    it.content = this.content
}

// 使用 'apply' 代替
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

`takeIf` 類似於單個值的 `filter`。它檢查接收者是否滿足謂詞，如果滿足則傳回接收者，如果不滿足則傳回 `null`。與 Elvis 運算符 (?:) 和提前傳回結合使用，它允許編寫如下結構：

```kotlin
val outDirFile = File(outputDir.path).takeIf { it.exists() } ?: return false
// 對現有的 outDirFile 執行某些操作
```

```kotlin
fun main(args: Array<String>) {
    val input = "Kotlin"
    val keyword = "in"

    val index = input.indexOf(keyword).takeIf { it >= 0 } ?: error("keyword not found")
    // 對輸入字串中關鍵字的索引執行某些操作，假設已找到它

    println("'$keyword' was found in '$input'")
    println(input)
    println(" ".repeat(index) + "^")
}
```

`takeUnless` 與 `takeIf` 相同，但它採用反轉的謂詞。當它*不*滿足謂詞時，它傳回接收者，否則傳回 `null`。因此，上面的範例之一可以使用 `takeUnless` 重寫如下：

```kotlin
val index = input.indexOf(keyword).takeUnless { it < 0 } ?: error("keyword not found")
```

當您有一個可呼叫的引用而不是 Lambda 運算式時，使用它也很方便：

```kotlin
private fun testTakeUnless(string: String) {

    val result = string.takeUnless(String::isEmpty)

    println("string = \"$string\"; result = \"$result\"")
}

fun main(args: Array<String>) {
    testTakeUnless("")
    testTakeUnless("abc")
}
```

### groupingBy()

此 API 可用於按鍵對集合進行分組，並同時摺疊每個群組。例如，它可用於計算以每個字母開頭的單字數：

```kotlin
fun main(args: Array<String>) {
    val words = "one two three four five six seven eight nine ten".split(' ')

    val frequencies = words.groupingBy { it.first() }.eachCount()

    println("Counting first letters: $frequencies.")

    // 使用 'groupBy' 和 'mapValues' 的替代方法建立一個中間 Map，
    // 而 'groupingBy' 方法會即時計數。
    val groupBy = words.groupBy { it.first() }.mapValues { (_, list) `->` list.size }
    println("Comparing the result with using 'groupBy': ${groupBy == frequencies}.")
}
```

### Map.toMap() 和 Map.toMutableMap()

這些函式可用於輕鬆複製 Map：

```kotlin
class ImmutablePropertyBag(map: Map<String, Any>) {
    private val mapCopy = map.toMap()
}
```

### Map.minus(key)

`plus` 運算符提供了一種將鍵值對新增到唯讀 Map 並產生新 Map 的方法，但是沒有一種簡單的方法可以做到相反：要從 Map 中刪除鍵，您必須求助於不太直接的方法，例如 `Map.filter()` 或 `Map.filterKeys()`。現在，`minus` 運算符填補了這個空白。有 4 個重載可用：用於刪除單個鍵、鍵集合、鍵序列和鍵陣列。

```kotlin
fun main(args: Array<String>) {

    val map = mapOf("key" to 42)
    val emptyMap = map - "key"

    println("map: $map")
    println("emptyMap: $emptyMap")
}
```

### minOf() 和 maxOf()

這些函式可用於尋找兩個或三個給定值的最低值和最大值，其中值是原始數字或 `Comparable` 物件。如果您想比較本身不可比較的物件，則每個函式也有一個額外的 `Comparator` 實例的重載。

```kotlin
fun main(args: Array<String>) {

    val list1 = listOf("a", "b")
    val list2 = listOf("x", "y", "z")
    val minSize = minOf(list1.size, list2.size)
    val longestList = maxOf(list1, list2, compareBy { it.size })

    println("minSize = $minSize")
    println("longestList = $longestList")
}
```

### 類似陣列的 List 實例化函式

與 `Array` 構造函數類似，現在有函式可以建立 `List` 和 `MutableList` 實例，並透過呼叫 Lambda 運算式初始化每個元素：

```kotlin
fun main(args: Array<String>) {

    val squares = List(10) { index `->` index * index }
    val mutable = MutableList(10) { 0 }

    println("squares: $squares")
    println("mutable: $mutable")
}
```

### Map.getValue()

此 `Map` 上的擴展傳回與給定鍵對應的現有值，或拋出例外，並提及找不到哪個鍵。如果使用 `withDefault` 產生 Map，則此函式將傳回預設值，而不是拋出例外。

```kotlin
fun main(args: Array<String>) {

    val map = mapOf("key" to 42)
    // 傳回不可為空的 Int 值 42
    val value: Int = map.getValue("key")

    val mapWithDefault = map.withDefault { k `->` k.length }
    // 傳回 4
    val value2 = mapWithDefault.getValue("key2")

    // map.getValue("anotherKey") // `<-` 這將拋出 NoSuchElementException

    println("value is $value")
    println("value2 is $value2")
}
```

### 抽象集合 (Abstract collections)

當實作 Kotlin 集合類別時，這些抽象類別可以用作基類。對於實作唯讀集合，有 `AbstractCollection`、`AbstractList`、`AbstractSet` 和 `AbstractMap`，對於可變集合，有 `AbstractMutableCollection`、`AbstractMutableList`、`AbstractMutableSet` 和 `AbstractMutableMap`。在 JVM 上，這些抽象的可變集合繼承了 JDK 抽象集合的大部分功能。

### 陣列操作函式 (Array manipulation functions)

標準函式庫現在提供一組用於陣列上逐元素操作的函式：比較（`contentEquals` 和 `contentDeepEquals`）、雜湊碼計算（`contentHashCode` 和 `contentDeepHashCode`）以及轉換為字串（`contentToString` 和 `contentDeepToString`）。它們在 JVM（其中它們充當 `java.util.Arrays` 中相應函式的別名）和 JS（其中實作在 Kotlin 標準函式庫中提供）上都受支援。

```kotlin
fun main(args: Array<String>) {

    val array = arrayOf("a", "b", "c")
    println(array.toString())  // JVM 實作：類型和雜湊胡言亂語
    println(array.contentToString())  // 格式良好，如清單
}
```

## JVM 後端 (JVM Backend)

### Java 8 位元組碼支援 (Java 8 bytecode support)

Kotlin 現在可以選擇產生 Java 8 位元組碼（`-jvm-target 1.8` 命令行選項或 Ant/Maven/Gradle 中的相應選項）。目前，這不會改變位元組碼的語義（特別是，介面中的預設方法和 Lambda 運算式的產生方式與 Kotlin 1.0 中完全相同），但我們計劃稍後進一步利用它。

### Java 8 標準函式庫支援 (Java 8 standard library support)

現在有單獨的標準函式庫版本，支援 Java 7 和 8 中新增的新的 JDK API。如果您需要存取新的 API，請使用 `kotlin-stdlib-jre7` 和 `kotlin-stdlib-jre8` Maven 構件而不是標準的 `kotlin-stdlib`。這些構件是 `kotlin-stdlib` 之上的微小擴展，它們將其作為傳遞依賴項帶到您的專案中。

### 位元組碼中的參數名稱 (Parameter names in the bytecode)

Kotlin 現在支援將參數名稱儲存在位元組碼中。可以使用 `-java-parameters` 命令行選項啟用此功能。

### 常數內聯 (Constant inlining)

編譯器現在將 `const val` 屬性的值內聯到使用它們的位置。

### 可變閉包變數 (Mutable closure variables)

用於在 Lambda 運算式中捕獲可變閉包變數的盒裝類別不再具有 volatile 欄位。此變更提高了效能，但在某些罕見的使用情境中可能會導致新的競爭條件。如果您受到此影響，則需要為存取變數提供您自己的同步。

### javax.script 支援

Kotlin 現在與 [javax.script API](https://docs.oracle.com/javase/8/docs/api/javax/script/package-summary.html) (JSR-223) 整合。該 API 允許在運行時評估程式碼片段：

```kotlin
val engine = ScriptEngineManager().getEngineByExtension("kts")!!
engine.eval("val x = 3")
println(engine.eval("x + 2"))  // 印出 5
```

有關使用 API 的更大的範例專案，請參閱[此處](https://github.com/JetBrains/kotlin/tree/1.1.0/libraries/examples/kotlin-jsr223-local-example)。

### kotlin.reflect.full

為了[準備 Java 9 支援](https://blog.jetbrains.com/kotlin/2017/01/kotlin-1-1-whats-coming-in-the-standard-library/)，`kotlin-reflect.jar` 函式庫中的擴展函式和屬性已移至 `kotlin.reflect.full` 套件。舊套件（`kotlin.reflect`）中的名稱已棄用，將在 Kotlin 1.2 中移除。請注意，核心反射介面（例如 `KClass`）是 Kotlin 標準函式庫的一部分，而不是 `kotlin-reflect`，並且不受此變更的影響。

## JavaScript 後端 (JavaScript backend)

### 統一的標準函式庫 (Unified standard library)

現在可以從編譯為 JavaScript 的程式碼中使用 Kotlin 標準函式庫的更大一部分。特別是，關鍵類別（例如集合（`ArrayList`、`HashMap` 等）、例外（`IllegalArgumentException` 等）和一些其他類別（`StringBuilder`、`Comparator`））現在在 `kotlin` 套件下定義。在 JVM 上，這些名稱是相應 JDK 類別的類型別名，而在 JS 上，這些類別在 Kotlin 標準函式庫中實作。

### 更好的程式碼產生 (Better code generation)

JavaScript 後端現在產生更多可靜態檢查的程式碼，這對 JS 程式碼處理工具（如縮小器、優化器、linter 等）更友好。

### external 修飾符

如果您需要以類型安全的方式從 Kotlin 存取在 JavaScript 中實作的類別，則可以使用 `external` 修飾符編寫 Kotlin 宣告。（在 Kotlin 1.0 中，改為使用 `@native` 註釋。）與 JVM 目標不同，JS 目標允許將 external 修飾符與類別和屬性一起使用。例如，以下是如何宣告 DOM `Node` 類別：

```kotlin
external class Node {
    val firstChild: Node

    fun appendChild(child: Node): Node

    fun removeChild(child: Node): Node

    // 等等
}
```

### 改進的導入處理 (Improved import handling)

您現在可以更精確地描述應從 JavaScript 模組導入的宣告。如果您在外部宣告中新增 `@JsModule("<module-name>")` 註釋，則會在編譯期間將其正確導入到模組系統（CommonJS 或 AMD）。例如，使用 CommonJS，宣告將透過 `require(...)` 函式導入。此外，如果您想將宣告作為模組或作為全域 JavaScript 物件導入，則可以使用 `@JsNonModule` 註釋。

例如，以下是如何將 JQuery 導入到 Kotlin 模組中：

```kotlin
external interface JQuery {
    fun toggle(duration: Int = definedExternally): JQuery
    fun click(handler: (Event) `->` Unit): JQuery
}

@JsModule("jquery")
@JsNonModule
@JsName("$")
external fun jquery(selector: String): JQuery
```

在這種情況下，JQuery 將作為名為 `jquery` 的模組導入。或者，它可以作為 $-object 使用，具體取決於 Kotlin 編譯器配置為使用的模組系統。

您可以像這樣在您的應用程式中使用這些宣告：

```kotlin
fun main(args: Array<String>) {
    jquery(".toggle-button").click {
        jquery(".toggle-panel").toggle(300)
    }
}
```