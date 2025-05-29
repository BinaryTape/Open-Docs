[//]: # (title: Kotlin 1.2 的新功能)

_發佈日期：2017 年 11 月 28 日_

## 目錄

*   [多平台專案 (實驗性)](#multiplatform-projects-experimental)
*   [其他語言功能](#other-language-features)
*   [標準函式庫](#standard-library)
*   [JVM 後端](#jvm-backend)
*   [JavaScript 後端](#javascript-backend)

## 多平台專案 (實驗性)

多平台專案是 Kotlin 1.2 中一項新的**實驗性**功能，允許您在 Kotlin 支援的目標平台（JVM、JavaScript，以及（未來）Native）之間重複使用程式碼。在多平台專案中，您有三種模組類型：

*   *通用 (common)* 模組包含不特定於任何平台的程式碼，以及依賴平台的 API (API) 宣告而無實作的程式碼。
*   *平台 (platform)* 模組包含通用模組中針對特定平台的依賴平台宣告的實作，以及其他依賴平台的程式碼。
*   *常規 (regular)* 模組針對特定平台，可以作為平台模組的依賴項，或依賴於平台模組。

當您為特定平台編譯多平台專案時，通用和特定平台部分的程式碼都會被產生。

多平台專案支援的一個關鍵功能是能夠透過*預期 (expected)* 和*實際 (actual)* 宣告來表達通用程式碼對特定平台部分的依賴關係。*預期宣告*指定了一個 API（類別、介面、註解、頂層宣告等）。*實際宣告*是 API 的依賴平台實作，或者是引用外部函式庫中現有 API 實作的型別別名 (type alias)。以下是一個範例：

在通用程式碼中：

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

有關詳細資訊以及建立多平台專案的步驟，請參閱[多平台程式設計文件](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)。

## 其他語言功能

### 註解中的陣列字面值

從 Kotlin 1.2 開始，註解的陣列引數可以使用新的陣列字面值語法傳遞，而不是 `arrayOf` 函數：

```kotlin
@CacheConfig(cacheNames = ["books", "default"])
public class BookRepositoryImpl {
    // ...
}
```

陣列字面值語法僅限於註解引數。

### Lateinit 頂層屬性和局部變數

`lateinit` 修飾符現在可以用於頂層屬性 (top-level properties) 和局部變數 (local variables)。後者可以用於，例如，當作為建構函數引數傳遞給一個物件的 lambda 引用了另一個必須稍後定義的物件時：

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

### 檢查 lateinit 變數是否已初始化

您現在可以使用屬性引用上的 `isInitialized` 檢查 lateinit 變數是否已初始化：

```kotlin
class Foo {
    lateinit var lateinitVar: String

    fun initializationLogic() {
//sampleStart
        println("isInitialized before assignment: " + this::lateinitVar.isInitialized)
        lateinitVar = "value"
        println("isInitialized after assignment: " + this::lateinitVar.isInitialized)
//sampleStart
    }
}

fun main(args: Array<String>) {
	Foo().initializationLogic()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 具有預設函數參數的內聯函數

內聯函數 (Inline functions) 現在允許為其內聯函數參數 (inlined functional parameters) 設定預設值：

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

### 顯式轉換資訊用於型別推斷

Kotlin 編譯器現在可以使用型別轉換 (type casts) 中的資訊進行型別推斷 (type inference)。如果您呼叫一個回傳型別參數 `T` 的泛型方法，並將回傳值轉換為特定型別 `Foo`，編譯器現在會明白此呼叫的 `T` 需要繫結到 `Foo` 型別。

這對於 Android 開發者尤其重要，因為編譯器現在可以正確分析 Android API level 26 中的泛型 `findViewById` 呼叫：

```kotlin
val button = findViewById(R.id.button) as Button
```

### 智慧型轉換 (Smart cast) 改進

當變數從安全呼叫表達式 (safe call expression) 賦值並檢查是否為 null 時，智慧型轉換現在也應用於安全呼叫接收者 (safe call receiver)：

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

此外，lambda 中的智慧型轉換現在也允許用於僅在 lambda 之前修改的局部變數：

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

現在可以不用顯式接收者 (explicit receiver) 來編寫繫結可呼叫引用 (bound callable reference) 到 `this` 的成員，即 `::foo` 而不是 `this::foo`。這也使得在 lambda 中使用可呼叫引用 (callable references) 更方便，當您引用外部接收者 (outer receiver) 的成員時。

### 破壞性變更：try 區塊後可靠的智慧型轉換

以前，Kotlin 會使用在 `try` 區塊內進行的賦值 (assignments) 來進行區塊後的智慧型轉換，這可能會破壞型別安全和 null 安全，並導致執行時失敗。此版本修正了這個問題，使智慧型轉換更加嚴格，但會破壞一些依賴此類智慧型轉換的程式碼。

若要切換回舊的智慧型轉換行為，請將回退標誌 (fallback flag) `-Xlegacy-smart-cast-after-try` 作為編譯器引數傳遞。它將在 Kotlin 1.3 中被棄用。

### 棄用：資料類別覆寫 `copy`

當資料類別 (data class) 派生自一個已經擁有相同簽章的 `copy` 函數的型別時，為資料類別產生的 `copy` 實作會使用超型別 (supertype) 中的預設值，導致反直覺的行為，如果超型別中沒有預設參數，則會導致執行時失敗。

在 Kotlin 1.2 中，導致 `copy` 衝突的繼承已被棄用並發出警告，並將在 Kotlin 1.3 中成為錯誤。

### 棄用：列舉條目中的巢狀型別

由於初始化邏輯的問題，在列舉條目 (enum entries) 內部定義非 `inner class` 的巢狀型別 (nested type) 已被棄用。這在 Kotlin 1.2 中會導致警告，並將在 Kotlin 1.3 中成為錯誤。

### 棄用：vararg 的單一具名引數

為與註解中的陣列字面值保持一致，為 vararg 參數以具名形式 (`foo(items = i)`) 傳遞單個項目已被棄用。請使用展開運算符 (spread operator) 和對應的陣列工廠函數 (array factory functions)：

```kotlin
foo(items = *arrayOf(1))
```

在這種情況下，存在一個優化，可以移除冗餘的陣列建立，從而防止效能下降。單引數形式在 Kotlin 1.2 中會產生警告，並將在 Kotlin 1.3 中移除。

### 棄用：繼承 `Throwable` 的泛型類別的內部類別

繼承自 `Throwable` 的泛型型別 (generic types) 的內部類別在拋出-捕獲情境 (throw-catch scenario) 中可能會違反型別安全，因此已被棄用，在 Kotlin 1.2 中會發出警告，並在 Kotlin 1.3 中成為錯誤。

### 棄用：變更唯讀屬性的 backing field

在自訂 getter 中透過賦值 `field = ...` 來變更唯讀屬性 (read-only property) 的 backing field 已被棄用，在 Kotlin 1.2 中會發出警告，並在 Kotlin 1.3 中成為錯誤。

## 標準函式庫

### Kotlin 標準函式庫 artifact 和拆分套件

Kotlin 標準函式庫現在與 Java 9 模組系統完全相容，該系統禁止拆分套件 (split packages)（多個 jar 檔案在同一套件中宣告類別）。為了支援這一點，引入了新的 artifact `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8`，它們取代了舊的 `kotlin-stdlib-jre7` 和 `kotlin-stdlib-jre8`。

從 Kotlin 的角度來看，新 artifact 中的宣告在相同的套件名稱下可見，但對於 Java 具有不同的套件名稱。因此，切換到新 artifact 不需要對您的原始碼進行任何更改。

為確保與新模組系統的相容性而進行的另一項更改是從 `kotlin-reflect` 函式庫中移除了 `kotlin.reflect` 套件中已棄用的宣告。如果您正在使用它們，則需要切換到使用 `kotlin.reflect.full` 套件中的宣告，該套件自 Kotlin 1.1 起就已支援。

### `windowed`、`chunked`、`zipWithNext`

為 `Iterable<T>`、`Sequence<T>` 和 `CharSequence` 增加了一組新的擴展函數，涵蓋了緩衝或批次處理 (`chunked`)、滑動視窗和計算滑動平均值 (`windowed`)，以及處理後續項目的對 (`zipWithNext`) 等使用場景：

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

為操作列表 (lists) 添加了一組擴展函數：`MutableList` 的 `fill`、`replaceAll` 和 `shuffle`，以及唯讀 `List` 的 `shuffled`：

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

為滿足長期以來的請求，Kotlin 1.2 新增了 `kotlin.math` API，用於 JVM 和 JS 的通用數學運算，包含以下內容：

*   常數：`PI` 和 `E`
*   三角函數：`cos`、`sin`、`tan` 及其反函數：`acos`、`asin`、`atan`、`atan2`
*   雙曲函數：`cosh`、`sinh`、`tanh` 及其反函數：`acosh`、`asinh`、`atanh`
*   指數運算：`pow`（一個擴展函數）、`sqrt`、`hypot`、`exp`、`expm1`
*   對數：`log`、`log2`、`log10`、`ln`、`ln1p`
*   捨入：
    *   `ceil`、`floor`、`truncate`、`round`（四捨五入到偶數）函數
    *   `roundToInt`、`roundToLong`（四捨五入到整數）擴展函數
*   符號和絕對值：
    *   `abs` 和 `sign` 函數
    *   `absoluteValue` 和 `sign` 擴展屬性
    *   `withSign` 擴展函數
*   兩個值的 `max` 和 `min`
*   二進位表示法：
    *   `ulp` 擴展屬性
    *   `nextUp`、`nextDown`、`nextTowards` 擴展函數
    *   `toBits`、`toRawBits`、`Double.fromBits`（這些在 `kotlin` 套件中）

對於 `Float` 引數，也提供了相同的一組函數（但沒有常數）。

### `BigInteger` 和 `BigDecimal` 的運算符和轉換

Kotlin 1.2 引入了一組函數，用於操作 `BigInteger` 和 `BigDecimal`，並從其他數字型別建立它們。這些包括：

*   `Int` 和 `Long` 的 `toBigInteger`
*   `Int`、`Long`、`Float`、`Double` 和 `BigInteger` 的 `toBigDecimal`
*   算術和位元運算符函數：
    *   二元運算符 `+`、`-`、`*`、`/`、`%` 和中綴函數 (infix functions) `and`、`or`、`xor`、`shl`、`shr`
    *   一元運算符 `-`、`++`、`--` 和函數 `inv`

### 浮點數到位元轉換

新增了用於將 `Double` 和 `Float` 轉換為其位元表示法以及從其位元表示法轉換的功能：

*   `toBits` 和 `toRawBits`，分別為 `Double` 回傳 `Long`，為 `Float` 回傳 `Int`
*   `Double.fromBits` 和 `Float.fromBits`，用於從位元表示法建立浮點數

### `Regex` 現在可序列化

`kotlin.text.Regex` 類別已成為`可序列化 (Serializable)`，現在可以在可序列化層次結構中使用。

### `Closeable.use` 在可用時呼叫 `Throwable.addSuppressed`

當在其他異常之後關閉資源期間拋出異常時，`Closeable.use` 函數會呼叫 `Throwable.addSuppressed`。

若要啟用此行為，您的依賴項中需要包含 `kotlin-stdlib-jdk7`。

## JVM 後端

### 建構函數呼叫正規化

自 1.0 版本以來，Kotlin 一直支援具有複雜控制流的表達式，例如 try-catch 表達式和內聯函數呼叫。這些程式碼符合 Java 虛擬機規範。不幸的是，一些位元碼處理工具在這些表達式存在於建構函數呼叫的引數中時，處理得不太好。

為了解決使用此類位元碼處理工具的用戶的問題，我們新增了一個命令列編譯器選項 (`-Xnormalize-constructor-calls=MODE`)，該選項指示編譯器為此類建構產生更類似 Java 的位元碼。其中 `MODE` 是以下之一：

*   `disable` (預設) – 以與 Kotlin 1.0 和 1.1 相同的方式產生位元碼。
*   `enable` – 為建構函數呼叫產生類似 Java 的位元碼。這可能會改變類別載入和初始化的順序。
*   `preserve-class-initialization` – 為建構函數呼叫產生類似 Java 的位元碼，確保保留類別初始化順序。這可能會影響應用程式的整體效能；僅當您在多個類別之間共用並在類別初始化時更新某些複雜狀態時才使用它。

「手動」解決方法是將帶有控制流的子表達式的值儲存在變數中，而不是直接在呼叫引數中評估它們。這類似於 `-Xnormalize-constructor-calls=enable`。

### Java 預設方法呼叫

在 Kotlin 1.2 之前，介面成員在目標 JVM 1.6 時覆寫 Java 預設方法會產生關於 super 呼叫的警告：`Super calls to Java default methods are deprecated in JVM target 1.6. Recompile with '-jvm-target 1.8'`。在 Kotlin 1.2 中，這將**改為錯誤**，因此任何此類程式碼都需要使用 JVM 目標 1.8 編譯。

### 破壞性變更：平台型別 `x.equals(null)` 的行為一致性

當平台型別 (`Int!`, `Boolean!`, `Short!`, `Long!`, `Float!`, `Double!`, `Char!`) 映射到 Java 基本型別時，在 `x` 為 null 的情況下呼叫 `x.equals(null)` 會錯誤地回傳 `true`。從 Kotlin 1.2 開始，在平台型別的 null 值上呼叫 `x.equals(...)` **會拋出 NPE**（但 `x == ...` 不會）。

若要恢復到 1.2 之前的行為，請將標誌 `-Xno-exception-on-explicit-equals-for-boxed-null` 傳遞給編譯器。

### 破壞性變更：修復透過內聯擴展接收者逃逸的平台 null

在平台型別的 null 值上呼叫的內聯擴展函數 (Inline extension functions) 未檢查接收者是否為 null，因此會允許 null 逃逸到其他程式碼中。Kotlin 1.2 強制在呼叫站點進行此檢查，如果接收者為 null 則會拋出異常。

若要切換到舊行為，請將回退標誌 `-Xno-receiver-assertions` 傳遞給編譯器。

## JavaScript 後端

### 預設啟用 `TypedArrays` 支援

JS 型別化陣列 (typed arrays) 支援將 Kotlin 基本陣列（例如 `IntArray`、`DoubleArray`）轉換為 [JavaScript 型別化陣列](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays)，該功能以前是選擇加入功能 (opt-in feature)，現在已預設啟用。

## 工具

### 將警告視為錯誤

編譯器現在提供一個選項，可將所有警告視為錯誤。在命令列上使用 `-Werror`，或使用以下 Gradle 片段：

```groovy
compileKotlin {
    kotlinOptions.allWarningsAsErrors = true
}
```