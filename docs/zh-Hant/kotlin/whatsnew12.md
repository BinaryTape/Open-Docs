[//]: # (title: Kotlin 1.2 的新功能)

發布日期：2017 年 11 月 28 日

## 目錄

* [多平台專案](#multiplatform-projects-experimental)
* [其他語言功能](#other-language-features)
* [標準函式庫](#standard-library)
* [JVM 後端](#jvm-backend)
* [JavaScript 後端](#javascript-backend)

## 多平台專案 (實驗性)

多平台專案是 Kotlin 1.2 中一項新的**實驗性**功能，它允許您在 Kotlin 支援的目標平台（JVM、JavaScript，以及未來支援的 Native）之間重複使用程式碼。在多平台專案中，您有三種模組：

* *common* 模組包含不特定於任何平台的程式碼，以及不具平台相關 API 實作的宣告。
* *platform* 模組包含 common 模組中特定平台的平台相關宣告實作，以及其他平台相關程式碼。
* 一般模組則針對特定平台，它可以是平台模組的依賴項，或依賴於平台模組。

當您為特定平台編譯多平台專案時，將會生成 common 和平台特定部分的程式碼。

多平台專案支援的一個關鍵功能是能夠透過 *expected* 和 *actual* 宣告來表達 common 程式碼對平台特定部分的依賴性。*expected* 宣告指定了一個 API（類別、介面、註解、頂層宣告等）。*actual* 宣告則是該 API 的平台相關實作，或是指向外部函式庫中該 API 現有實作的類型別名。以下是一個範例：

在 common 程式碼中：

```kotlin
// expected platform-specific API:
expect fun hello(world: String): String

fun greet() {
    // usage of the expected API:
    val greeting = hello("multiplatform world")
    println(greeting)
}

expect class URL(spec: String) {
    open fun getHost(): String
    open fun getPath(): String
}
```

在 JVM 平台程式碼中：

```kotlin
actual fun hello(world: String): String =
    "Hello, $world, on the JVM platform!"

// using existing platform-specific implementation:
actual typealias URL = java.net.URL
```

請參閱 [多平台程式設計文件](https://kotlinlang.org/docs/multiplatform/get-started.html) 以了解更多詳細資訊和建立多平台專案的步驟。

## 其他語言功能

### 註解中的陣列字面值

從 Kotlin 1.2 開始，註解的陣列引數可以使用新的陣列字面值語法傳遞，而不是使用 `arrayOf` 函式：

```kotlin
@CacheConfig(cacheNames = ["books", "default"])
public class BookRepositoryImpl {
    // ...
}
```

陣列字面值語法僅限用於註解引數。

### `lateinit` 頂層屬性和局部變數

`lateinit` 修飾符現在可以用於頂層屬性和局部變數。後者可用於，例如，當作為建構函式引數傳遞給一個物件的 lambda 引用了必須稍後定義的另一個物件時：

```kotlin
class Node<T>(val value: T, val next: () -> Node<T>)

fun main(args: Array<String>) {
    // A cycle of three nodes:
    lateinit var third: Node<Int>

    val second = Node(2, next = { third })
    val first = Node(1, next = { second })

    third = Node(3, next = { first })

    val nodes = generateSequence(first) { it.next() }
    println("Values in the cycle: ${nodes.take(7).joinToString { it.value.toString() }}, ...")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 檢查 `lateinit var` 是否已初始化

您現在可以使用屬性引用上的 `isInitialized` 來檢查 `lateinit var` 是否已初始化：

```kotlin
class Foo {
    lateinit var lateinitVar: String

    fun initializationLogic() {
//sampleStart
        println("isInitialized before assignment: " + this::lateinitVar.isInitialized)
        lateinitVar = "value"
        println("isInitialized after assignment: " + this::lateinitVar.isInitialized)
//sampleEnd
    }
}

fun main(args: Array<String>) {
	Foo().initializationLogic()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 具有預設函式參數的內聯函式

內聯函式現在允許為其內聯的函式參數設定預設值：

```kotlin
//sampleStart
inline fun <E> Iterable<E>.strings(transform: (E) -> String = { it.toString() }) =
    map { transform(it) }

val defaultStrings = listOf(1, 2, 3).strings()
val customStrings = listOf(1, 2, 3).strings { "($it)" } 
//sampleEnd

fun main(args: Array<String>) {
    println("defaultStrings = $defaultStrings")
    println("customStrings = $customStrings")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 顯式轉換的資訊用於類型推斷

Kotlin 編譯器現在可以在類型推斷中使用類型轉換的資訊。如果您呼叫一個返回類型參數 `T` 的泛型方法，並將返回值轉換為特定類型 `Foo`，編譯器現在會理解該呼叫的 `T` 需要綁定到 `Foo` 類型。

這對於 Android 開發者尤其重要，因為編譯器現在可以正確分析 Android API level 26 中泛型 `findViewById` 的呼叫：

```kotlin
val button = findViewById(R.id.button) as Button
```

### 智慧型轉換改進

當變數從安全呼叫表達式賦值並檢查是否為 null 時，智慧型轉換現在也會應用於安全呼叫接收者：

```kotlin
fun countFirst(s: Any): Int {
//sampleStart
    val firstChar = (s as? CharSequence)?.firstOrNull()
    if (firstChar != null)
    return s.count { it == firstChar } // s: Any is smart cast to CharSequence

    val firstItem = (s as? Iterable<*>)?.firstOrNull()
    if (firstItem != null)
    return s.count { it == firstItem } // s: Any is smart cast to Iterable<*>
//sampleEnd
    return -1
}

fun main(args: Array<String>) {
  val string = "abacaba"
  val countInString = countFirst(string)
  println("called on \"$string\": $countInString")

  val list = listOf(1, 2, 3, 1, 2)
  val countInList = countFirst(list)
  println("called on $list: $countInList")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

此外，現在也允許在 lambda 中對僅在 lambda 之前修改的局部變數進行智慧型轉換：

```kotlin
fun main(args: Array<String>) {
//sampleStart
    val flag = args.size == 0
    var x: String? = null
    if (flag) x = "Yahoo!"

    run {
        if (x != null) {
            println(x.length) // x is smart cast to String
        }
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 支援 `::foo` 作為 `this::foo` 的簡寫

現在可以省略顯式接收者來編寫綁定到 `this` 成員的可呼叫引用，即 `::foo` 而不是 `this::foo`。這也使得在 lambda 中引用外部接收者的成員時，可呼叫引用使用起來更方便。

### 破壞性變更：`try` 區塊後的健全智慧型轉換

此前，Kotlin 會使用 `try` 區塊內部的賦值來進行區塊後的智慧型轉換，這可能會破壞類型安全和 null 安全，並導致執行時期失敗。此版本修復了這個問題，使智慧型轉換更為嚴格，但也因此破壞了一些依賴於此類智慧型轉換的程式碼。

要切換回舊的智慧型轉換行為，請將回溯旗標 `-Xlegacy-smart-cast-after-try` 作為編譯器引數傳遞。該旗標將在 Kotlin 1.3 中棄用。

### 棄用：資料類別覆寫 `copy`

當資料類別繼承自已經擁有相同簽章的 `copy` 函式的類型時，為該資料類別生成的 `copy` 實作會使用父類型的預設值，導致反直覺的行為；如果父類型中沒有預設參數，則可能在執行時期失敗。

在 Kotlin 1.2 中，導致 `copy` 衝突的繼承已棄用並發出警告，並將在 Kotlin 1.3 中成為錯誤。

### 棄用：列舉條目中的巢狀類型

由於初始化邏輯中的問題，在列舉條目內部定義不是 `inner class` 的巢狀類型已被棄用。這在 Kotlin 1.2 中會發出警告，並將在 Kotlin 1.3 中成為錯誤。

### 棄用：`vararg` 的單一具名引數

為了與註解中的陣列字面值保持一致，以具名形式 (`foo(items = i)`) 為 `vararg` 參數傳遞單一項目已棄用。請使用展開運算子及相應的陣列工廠函式：

```kotlin
foo(items = *arrayOf(1))
```

在此類情況下，存在一項優化可消除冗餘的陣列創建，從而防止性能下降。單引數形式在 Kotlin 1.2 中會產生警告，並將在 Kotlin 1.3 中移除。

### 棄用：繼承 `Throwable` 的泛型類別的內部類別

繼承自 `Throwable` 的泛型類型的內部類別可能會在拋出-捕獲情境中違反類型安全，因此已被棄用；這在 Kotlin 1.2 中會發出警告，並在 Kotlin 1.3 中成為錯誤。

### 棄用：變異唯讀屬性的支援欄位

透過在自訂 getter 中賦值 `field = ...` 來變異唯讀屬性的支援欄位已棄用；這在 Kotlin 1.2 中會發出警告，並在 Kotlin 1.3 中成為錯誤。

## 標準函式庫

### Kotlin 標準函式庫 Artifacts 和拆分套件

Kotlin 標準函式庫現在完全相容於 Java 9 模組系統，該系統禁止拆分套件（即多個 jar 檔案在同一個套件中宣告類別）。為了支援這一點，引入了新的 Artifacts `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8`，它們取代了舊的 `kotlin-stdlib-jre7` 和 `kotlin-stdlib-jre8`。

從 Kotlin 的角度來看，新 Artifacts 中的宣告在相同的套件名稱下可見，但對於 Java 來說則具有不同的套件名稱。因此，切換到新的 Artifacts 不需要對您的原始碼進行任何更改。

為確保與新模組系統的相容性而進行的另一項變更是，從 `kotlin-reflect` 函式庫中移除了 `kotlin.reflect` 套件中已棄用的宣告。如果您正在使用它們，則需要切換到使用 `kotlin.reflect.full` 套件中的宣告，該套件自 Kotlin 1.1 起就已支援。

### `windowed`、`chunked`、`zipWithNext`

`Iterable<T>`、`Sequence<T>` 和 `CharSequence` 的新擴展函式涵蓋了諸如緩衝或批次處理 (`chunked`)、滑動視窗和計算滑動平均值 (`windowed`)，以及處理連續項目對 (`zipWithNext`) 等使用情境：

```kotlin
fun main(args: Array<String>) {
//sampleStart
    val items = (1..9).map { it * it }

    val chunkedIntoLists = items.chunked(4)
    val points3d = items.chunked(3) { (x, y, z) -> Triple(x, y, z) }
    val windowed = items.windowed(4)
    val slidingAverage = items.windowed(4) { it.average() }
    val pairwiseDifferences = items.zipWithNext { a, b -> b - a }
//sampleEnd

    println("items: $items
")

    println("chunked into lists: $chunkedIntoLists")
    println("3D points: $points3d")
    println("windowed by 4: $windowed")
    println("sliding average by 4: $slidingAverage")
    println("pairwise differences: $pairwiseDifferences")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### `fill`、`replaceAll`、`shuffle`/`shuffled`

為操作列表添加了一組擴展函式：用於 `MutableList` 的 `fill`、`replaceAll` 和 `shuffle`，以及用於唯讀 `List` 的 `shuffled`：

```kotlin
fun main(args: Array<String>) {
//sampleStart
    val items = (1..5).toMutableList()
    
    items.shuffle()
    println("Shuffled items: $items")
    
    items.replaceAll { it * 2 }
    println("Items doubled: $items")
    
    items.fill(5)
    println("Items filled with 5: $items")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### `kotlin-stdlib` 中的數學運算

為回應長期以來的請求，Kotlin 1.2 新增了 `kotlin.math` API，用於 JVM 和 JS 共通的數學運算，並包含以下內容：

* 常數：`PI` 和 `E`
* 三角函式：`cos`、`sin`、`tan` 及其反函式：`acos`、`asin`、`atan`、`atan2`
* 雙曲函式：`cosh`、`sinh`、`tanh` 及其反函式：`acosh`、`asinh`、`atanh`
* 指數運算：`pow`（一個擴展函式）、`sqrt`、`hypot`、`exp`、`expm1`
* 對數：`log`、`log2`、`log10`、`ln`、`ln1p`
* 四捨五入：
    * `ceil`、`floor`、`truncate`、`round`（半捨入到偶數）函式
    * `roundToInt`、`roundToLong`（半捨入到整數）擴展函式
* 符號和絕對值：
    * `abs` 和 `sign` 函式
    * `absoluteValue` 和 `sign` 擴展屬性
    * `withSign` 擴展函式
* 兩個值的 `max` 和 `min`
* 二進位表示：
    * `ulp` 擴展屬性
    * `nextUp`、`nextDown`、`nextTowards` 擴展函式
    * `toBits`、`toRawBits`、`Double.fromBits`（這些位於 `kotlin` 套件中）

相同的一組函式（但不含常數）也可用於 `Float` 引數。

### `BigInteger` 和 `BigDecimal` 的運算子和轉換

Kotlin 1.2 引入了一組函式，用於操作 `BigInteger` 和 `BigDecimal` 以及從其他數值類型創建它們。這些函式包括：

* `Int` 和 `Long` 的 `toBigInteger`
* `Int`、`Long`、`Float`、`Double` 和 `BigInteger` 的 `toBigDecimal`
* 算術和位元運算子函式：
    * 二元運算子 `+`、`-`、`*`、`/`、`%` 和中綴函式 `and`、`or`、`xor`、`shl`、`shr`
    * 一元運算子 `-`、`++`、`--`，以及函式 `inv`

### 浮點數到位元轉換

新增了用於 `Double` 和 `Float` 與其位元表示之間相互轉換的函式：

* `toBits` 和 `toRawBits`，`Double` 返回 `Long`，`Float` 返回 `Int`
* `Double.fromBits` 和 `Float.fromBits`，用於從位元表示創建浮點數

### `Regex` 現在可序列化

`kotlin.text.Regex` 類別現在已實作 `Serializable` 介面，可以在可序列化層次結構中使用。

### `Closeable.use` 在可用時呼叫 `Throwable.addSuppressed`

`Closeable.use` 函式在某些其他例外發生後關閉資源時拋出例外情況時，會呼叫 `Throwable.addSuppressed`。

要啟用此行為，您需要在依賴項中包含 `kotlin-stdlib-jdk7`。

## JVM 後端

### 建構函式呼叫正規化

從 1.0 版本以來，Kotlin 就支援具有複雜控制流程的表達式，例如 `try-catch` 表達式和內聯函式呼叫。根據 Java 虛擬機器規範，此類程式碼是有效的。不幸的是，當此類表達式出現在建構函式呼叫的引數中時，一些位元組碼處理工具無法很好地處理這些程式碼。

為了解決這些位元組碼處理工具用戶的問題，我們新增了一個命令列編譯器選項 (`-Xnormalize-constructor-calls=MODE`)，它指示編譯器為此類建構生成更像 Java 的位元組碼。這裡的 `MODE` 是以下之一：

* `disable` (預設值) – 以 Kotlin 1.0 和 1.1 相同的方式生成位元組碼。
* `enable` – 為建構函式呼叫生成類似 Java 的位元組碼。這可能會改變類別載入和初始化的順序。
* `preserve-class-initialization` – 為建構函式呼叫生成類似 Java 的位元組碼，確保保留類別初始化順序。這可能會影響您應用程式的整體效能；僅當您在多個類別之間共享某些複雜狀態並在類別初始化時更新時才使用它。

「手動」的解決方法是將帶有控制流程的子表達式的值儲存在變數中，而不是直接在呼叫引數內部進行評估。這與 `-Xnormalize-constructor-calls=enable` 類似。

### Java 預設方法呼叫

在 Kotlin 1.2 之前，介面成員在針對 JVM 1.6 時覆寫 Java 預設方法，會對 `super` 呼叫產生警告：`Super calls to Java default methods are deprecated in JVM target 1.6. Recompile with '-jvm-target 1.8'`。在 Kotlin 1.2 中，這將直接變成**錯誤**，因此任何此類程式碼都必須使用 JVM target 1.8 進行編譯。

### 破壞性變更：平台類型 `x.equals(null)` 行為的一致性

在映射到 Java 原始類型（`Int!`、`Boolean!`、`Short!`、`Long!`、`Float!`、`Double!`、`Char!`）的平台類型上呼叫 `x.equals(null)`，當 `x` 為 null 時錯誤地返回 `true`。從 Kotlin 1.2 開始，在平台類型的 null 值上呼叫 `x.equals(...)` 將會**拋出 NPE**（但 `x == ...` 不會）。

要返回到 1.2 之前的行為，請將旗標 `-Xno-exception-on-explicit-equals-for-boxed-null` 傳遞給編譯器。

### 破壞性變更：修復透過內聯擴展接收者導致平台 null 逸出問題

當在平台類型的 null 值上呼叫內聯擴展函式時，並未檢查接收者是否為 null，因此允許 null 值逸出到其他程式碼中。Kotlin 1.2 在呼叫點強制執行此檢查，如果接收者為 null 則拋出例外。

要切換到舊行為，請將回溯旗標 `-Xno-receiver-assertions` 傳遞給編譯器。

## JavaScript 後端

### 預設啟用 TypedArrays 支援

JS 類型化陣列支援（將 Kotlin 原始陣列，例如 `IntArray`、`DoubleArray`，轉換為 [JavaScript 類型化陣列](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays)），此功能此前為可選加入，現已預設啟用。

## 工具

### 將警告視為錯誤

編譯器現在提供一個選項，可將所有警告視為錯誤。請在命令列使用 `-Werror`，或使用以下 Gradle 片段：

```groovy
compileKotlin {
    kotlinOptions.allWarningsAsErrors = true
}
```