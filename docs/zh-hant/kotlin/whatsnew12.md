---
title: "Kotlin 1.2 的新特性"
---
_發布日期：2017 年 11 月 28 日_

## 目錄

* [多平台專案](#multiplatform-projects-experimental)
* [其他語言特性](#other-language-features)
* [標準函式庫](#standard-library)
* [JVM 後端](#jvm-backend)
* [JavaScript 後端](#javascript-backend)

## 多平台專案 (實驗性)

多平台專案是 Kotlin 1.2 中的一項新的**實驗性 (experimental)** 功能，讓您可以在 Kotlin 支援的目標平台（JVM、JavaScript 和（未來）Native）之間重複使用程式碼。在多平台專案中，您有三種模組：

* *通用 (common)* 模組包含不特定於任何平台的程式碼，以及沒有平台相關 API 實作的宣告。
* *平台 (platform)* 模組包含通用模組中平台相關宣告的實作，以及其他平台相關程式碼。
* 常規模組以特定平台為目標，並且可以是平台模組的依賴項，也可以依賴於平台模組。

當您為特定平台編譯多平台專案時，將會產生通用和平台特定部分的程式碼。

多平台專案支援的一個關鍵特性是可以透過 *expected (預期)* 和 *actual (實際)* 宣告來表達通用程式碼對平台特定部分的依賴性。*Expected (預期)* 宣告指定一個 API（類別、介面、註解、頂層宣告等）。*Actual (實際)* 宣告可以是 API 的平台相關實作，也可以是引用外部函式庫中 API 現有實作的類型別名。以下是一個範例：

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

請參閱 [多平台程式設計文件](multiplatform-intro)，以瞭解詳細資訊和建立多平台專案的步驟。

## 其他語言特性

### 註解中的陣列字面值 (Array literals)

從 Kotlin 1.2 開始，註解的陣列參數可以使用新的陣列字面值語法，而不是 `arrayOf` 函數：

```kotlin
@CacheConfig(cacheNames = ["books", "default"])
public class BookRepositoryImpl {
    // ...
}
```

陣列字面值語法僅限於註解參數。

### Lateinit 頂層屬性和區域變數

`lateinit` 修飾符現在可以用於頂層屬性和區域變數。後者可用於例如，當作為建構子參數傳遞給一個物件的 Lambda 引用必須稍後定義的另一個物件時：

```kotlin
class Node<T>(val value: T, val next: () `->` Node<T>)

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

### 檢查 lateinit var 是否已初始化

您現在可以使用屬性參考上的 `isInitialized` 來檢查 lateinit var 是否已初始化：

```kotlin
class Foo {
    lateinit var lateinitVar: String

    fun initializationLogic() {

        println("isInitialized before assignment: " + this::lateinitVar.isInitialized)
        lateinitVar = "value"
        println("isInitialized after assignment: " + this::lateinitVar.isInitialized)

    }
}

fun main(args: Array<String>) {
	Foo().initializationLogic()
}
```

### 具有預設函數參數的 Inline 函數

Inline 函數現在允許其 inline 函數參數具有預設值：

```kotlin

inline fun <E> Iterable<E>.strings(transform: (E) `->` String = { it.toString() }) =
    map { transform(it) }

val defaultStrings = listOf(1, 2, 3).strings()
val customStrings = listOf(1, 2, 3).strings { "($it)" } 

fun main(args: Array<String>) {
    println("defaultStrings = $defaultStrings")
    println("customStrings = $customStrings")
}
```

### 來自顯式轉型的資訊用於型別推斷

Kotlin 編譯器現在可以使用來自型別轉換的資訊進行型別推斷。如果您呼叫一個返回型別參數 `T` 的泛型方法，並將返回值轉換為特定型別 `Foo`，則編譯器現在瞭解此呼叫的 `T` 需要繫結到 `Foo` 型別。

這對於 Android 開發人員尤其重要，因為編譯器現在可以正確分析 Android API level 26 中的泛型 `findViewById` 呼叫：

```kotlin
val button = findViewById(R.id.button) as Button
```

### Smart cast 改進

當從安全呼叫表達式賦值變數並檢查是否為 null 時，smart cast 現在也應用於安全呼叫接收器：

```kotlin
fun countFirst(s: Any): Int {

    val firstChar = (s as? CharSequence)?.firstOrNull()
    if (firstChar != null)
    return s.count { it == firstChar } // s: Any is smart cast to CharSequence

    val firstItem = (s as? Iterable<*>)?.firstOrNull()
    if (firstItem != null)
    return s.count { it == firstItem } // s: Any is smart cast to Iterable<*>

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

此外，現在允許 Lambda 中的 smart cast 用於僅在 Lambda 之前修改的區域變數：

```kotlin
fun main(args: Array<String>) {

    val flag = args.size == 0
    var x: String? = null
    if (flag) x = "Yahoo!"

    run {
        if (x != null) {
            println(x.length) // x is smart cast to String
        }
    }

}
```

### 支援 ::foo 作為 this::foo 的簡寫

現在可以編寫對 `this` 成員的綁定可呼叫參考，而無需顯式接收器，`::foo` 而不是 `this::foo`。這也使得可呼叫參考更方便在 Lambda 中使用，在 Lambda 中您引用外部接收器的成員。

### 重大變更：try 區塊後面的 sound smart cast

先前，Kotlin 使用在 `try` 區塊內進行的賦值來進行區塊後的 smart cast，這可能會破壞型別和 null 安全性，並導致執行階段失敗。此版本修正了此問題，使 smart cast 更加嚴格，但破壞了一些依賴於此類 smart cast 的程式碼。

若要切換到舊的 smart cast 行為，請將後備旗標 `-Xlegacy-smart-cast-after-try` 作為編譯器引數傳遞。它將在 Kotlin 1.3 中被棄用。

### 棄用：資料類別覆寫 copy

當從已經具有相同簽名的 `copy` 函數的型別衍生資料類別時，為資料類別產生的 `copy` 實作使用來自超型別的預設值，導致違反直覺的行為，或者如果超型別中沒有預設參數，則在執行階段失敗。

導致 `copy` 衝突的繼承已在 Kotlin 1.2 中被棄用並發出警告，並且在 Kotlin 1.3 中將會發生錯誤。

### 棄用：enum 條目中的巢狀型別

由於初始化邏輯中的問題，在 enum 條目內定義的不是 `inner class` 的巢狀型別已被棄用。這會在 Kotlin 1.2 中產生警告，並且在 Kotlin 1.3 中將會發生錯誤。

### 棄用：vararg 的單一名稱引數

為了與註解中的陣列字面值保持一致，以命名形式 (`foo(items = i)`) 傳遞 vararg 參數的單個項目已被棄用。請將擴展運算子與相應的陣列工廠函數一起使用：

```kotlin
foo(items = *arrayOf(1))
```

在這種情況下，有一種最佳化可以刪除多餘的陣列建立，從而防止效能下降。單引數形式在 Kotlin 1.2 中產生警告，並將在 Kotlin 1.3 中刪除。

### 棄用：擴展 Throwable 的泛型類別的內部類別

從 `Throwable` 繼承的泛型型別的內部類別可能會在 throw-catch 情況下違反型別安全性，因此已被棄用，在 Kotlin 1.2 中發出警告，並且在 Kotlin 1.3 中發生錯誤。

### 棄用：變更唯讀屬性的後備欄位

透過在自訂 getter 中賦值 `field = ...` 來變更唯讀屬性的後備欄位已被棄用，在 Kotlin 1.2 中發出警告，並且在 Kotlin 1.3 中發生錯誤。

## 標準函式庫

### Kotlin 標準函式庫成品和分割套件

Kotlin 標準函式庫現在與 Java 9 模組系統完全相容，該系統禁止分割套件（在同一套件中宣告類別的多個 jar 檔案）。為了支援這一點，引入了新的成品 `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8`，它們取代了舊的 `kotlin-stdlib-jre7` 和 `kotlin-stdlib-jre8`。

從 Kotlin 的角度來看，新成品中的宣告在相同的套件名稱下可見，但對於 Java 而言，它們具有不同的套件名稱。因此，切換到新成品將不需要對您的原始碼進行任何變更。

為確保與新模組系統相容而進行的另一個變更是從 `kotlin-reflect` 函式庫中刪除了 `kotlin.reflect` 套件中已棄用的宣告。如果您正在使用它們，則需要切換到使用 `kotlin.reflect.full` 套件中的宣告，該套件自 Kotlin 1.1 起已支援。

### windowed、chunked、zipWithNext

`Iterable<T>`、`Sequence<T>` 和 `CharSequence` 的新擴充功能涵蓋了諸如緩衝或批次處理 (`chunked`)、滑動視窗和計算滑動平均值 (`windowed`) 以及處理後續項目對 (`zipWithNext`) 等用例：

```kotlin
fun main(args: Array<String>) {

    val items = (1..9).map { it * it }

    val chunkedIntoLists = items.chunked(4)
    val points3d = items.chunked(3) { (x, y, z) `->` Triple(x, y, z) }
    val windowed = items.windowed(4)
    val slidingAverage = items.windowed(4) { it.average() }
    val pairwiseDifferences = items.zipWithNext { a, b `->` b - a }

    println("items: $items
")

    println("chunked into lists: $chunkedIntoLists")
    println("3D points: $points3d")
    println("windowed by 4: $windowed")
    println("sliding average by 4: $slidingAverage")
    println("pairwise differences: $pairwiseDifferences")
}
```

### fill、replaceAll、shuffle/shuffled

添加了一組用於操作列表的擴充功能：`fill`、`replaceAll` 和 `shuffle` 用於 `MutableList`，以及 `shuffled` 用於唯讀 `List`：

```kotlin
fun main(args: Array<String>) {

    val items = (1..5).toMutableList()
    
    items.shuffle()
    println("Shuffled items: $items")
    
    items.replaceAll { it * 2 }
    println("Items doubled: $items")
    
    items.fill(5)
    println("Items filled with 5: $items")

}
```

### kotlin-stdlib 中的數學運算

為了滿足長期的需求，Kotlin 1.2 添加了 `kotlin.math` API 用於數學運算，這對於 JVM 和 JS 來說是通用的，並且包含以下內容：

* 常數：`PI` 和 `E`
* 三角函數：`cos`、`sin`、`tan` 以及它們的反函數：`acos`、`asin`、`atan`、`atan2`
* 雙曲函數：`cosh`、`sinh`、`tanh` 以及它們的反函數：`acosh`、`asinh`、`atanh`
* 指數：`pow` (一個擴充功能函數)、`sqrt`、`hypot`、`exp`、`expm1`
* 對數：`log`、`log2`、`log10`、`ln`、`ln1p`
* 四捨五入：
    * `ceil`、`floor`、`truncate`、`round`（半偶數）函數
    * `roundToInt`、`roundToLong`（半整數）擴充功能函數
* 符號和絕對值：
    * `abs` 和 `sign` 函數
    * `absoluteValue` 和 `sign` 擴充功能屬性
    * `withSign` 擴充功能函數
* 兩個值的 `max` 和 `min`
* 二進位表示法：
    * `ulp` 擴充功能屬性
    * `nextUp`、`nextDown`、`nextTowards` 擴充功能函數
    * `toBits`、`toRawBits`、`Double.fromBits` (這些在 `kotlin` 套件中)

同一組函數（但沒有常數）也適用於 `Float` 引數。

### BigInteger 和 BigDecimal 的運算符和轉換

Kotlin 1.2 引入了一組用於使用 `BigInteger` 和 `BigDecimal` 進行操作並從其他數值型別建立它們的函數。 這些是：

* `toBigInteger` 用於 `Int` 和 `Long`
* `toBigDecimal` 用於 `Int`、`Long`、`Float`、`Double` 和 `BigInteger`
* 算術和位元運算符函數：
    * 二元運算符 `+`、`-`、`*`、`/`、`%` 和中綴函數 `and`、`or`、`xor`、`shl`、`shr`
    * 一元運算符 `-`、`++`、`--` 和函數 `inv`

### 浮點數到位元轉換

新增了用於將 `Double` 和 `Float` 轉換為其位元表示形式以及從其位元表示形式轉換的新函數：

* `toBits` 和 `toRawBits` 為 `Double` 傳回 `Long`，為 `Float` 傳回 `Int`
* `Double.fromBits` 和 `Float.fromBits` 用於從位元表示形式建立浮點數

### Regex 現在是可序列化的 (Serializable)

`kotlin.text.Regex` 類別已變為 `Serializable`，現在可以在可序列化的層次結構中使用。

### Closeable.use 如果可用，則呼叫 Throwable.addSuppressed

當在關閉資源後發生一些其他異常時，`Closeable.use` 函數在關閉資源期間拋出異常時呼叫 `Throwable.addSuppressed`。

要啟用此行為，您需要在您的依賴項中包含 `kotlin-stdlib-jdk7`。

## JVM 後端

### 建構子呼叫規範化 (Constructor calls normalization)

自 1.0 版以來，Kotlin 支援具有複雜控制流程的表達式，例如 try-catch 表達式和 inline 函數呼叫。根據 Java 虛擬機器規範，此類程式碼是有效的。不幸的是，當此類表達式出現在建構子呼叫的引數中時，某些位元組碼處理工具無法很好地處理此類程式碼。

為了減輕此問題對於此類位元組碼處理工具的使用者的影響，我們添加了一個命令列編譯器選項 (`-Xnormalize-constructor-calls=MODE`)，該選項告訴編譯器為此類建構產生更多類似 Java 的位元組碼。此處 `MODE` 是以下之一：

* `disable` (預設) – 以與 Kotlin 1.0 和 1.1 中相同的方式產生位元組碼。
* `enable` – 為建構子呼叫產生類似 Java 的位元組碼。這可以變更載入和初始化類別的順序。
* `preserve-class-initialization` – 為建構子呼叫產生類似 Java 的位元組碼，確保保留類別初始化順序。這可能會影響應用程式的整體效能； 僅當您在多個類別之間共享一些複雜的狀態並在類別初始化時更新時才使用它。

「手動」的解決方法是將具有控制流程的子表達式的值儲存在變數中，而不是直接在呼叫引數中評估它們。它類似於 `-Xnormalize-constructor-calls=enable`。

### Java 預設方法呼叫

在 Kotlin 1.2 之前，介面成員覆寫 Java 預設方法，同時以 JVM 1.6 為目標，在 super 呼叫時產生警告：`Super calls to Java default methods are deprecated in JVM target 1.6. Recompile with '-jvm-target 1.8'`. 在 Kotlin 1.2 中，有一個**錯誤**，因此需要使用 JVM 目標 1.8 編譯任何此類程式碼。

### 重大變更：平台型別的 x.equals(null) 的一致行為

在平台型別上呼叫 `x.equals(null)`，該平台型別對應於 Java 基本型別 (`Int!`、`Boolean!`、`Short`!、`Long!`、`Float!`、`Double!`、`Char!`) 在 `x` 為 null 時錯誤地傳回 `true`。從 Kotlin 1.2 開始，在平台型別的 null 值上呼叫 `x.equals(...)` **拋出 NPE**（但 `x == ...` 不會）。

要返回到 1.2 之前的行為，請將旗標 `-Xno-exception-on-explicit-equals-for-boxed-null` 傳遞給編譯器。

### 重大變更：修正透過 inline 擴充功能接收器逸出的平台 null

在平台型別的 null 值上呼叫的 Inline 擴充功能函數不會檢查接收器是否為 null，因此會允許 null 逸出到其他程式碼中。Kotlin 1.2 強制在呼叫站點進行此檢查，如果接收器為 null，則拋出異常。

要切換到舊的行為，請將後備旗標 `-Xno-receiver-assertions` 傳遞給編譯器。

## JavaScript 後端

### 預設啟用 TypedArrays 支援

JS typed arrays 支援將 Kotlin 基本型別陣列（例如 `IntArray`、`DoubleArray`）轉換為 [JavaScript typed arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays)，以前是一個選擇加入功能，預設已啟用。

## 工具

### 將警告視為錯誤 (Warnings as errors)

編譯器現在提供一個選項，將所有警告視為錯誤。在命令列上使用 `-Werror`，或使用以下 Gradle 片段：

```groovy
compileKotlin {
    kotlinOptions.allWarningsAsErrors = true
}