[//]: # (title: 屬性)

## 宣告屬性

Kotlin 類別中的屬性可以宣告為可變的，使用 `var` 關鍵字；或者宣告為唯讀的，使用 `val` 關鍵字。

```kotlin
class Address {
    var name: String = "Holmes, Sherlock"
    var street: String = "Baker"
    var city: String = "London"
    var state: String? = null
    var zip: String = "123456"
}
```

要使用屬性，只需透過其名稱引用即可：

```kotlin
fun copyAddress(address: Address): Address {
    val result = Address() // Kotlin 中沒有 'new' 關鍵字
    result.name = address.name // 存取器會被呼叫
    result.street = address.street
    // ...
    return result
}
```

## 取得器與設定器

宣告屬性的完整語法如下：

```kotlin
var <propertyName>[: <PropertyType>] [= <property_initializer>]
    [<getter>]
    [<setter>]
```

初始化器、取得器和設定器都是可選的。如果屬性型別可以從初始化器或取得器的回傳型別推斷出來，則屬性型別也是可選的，如下所示：

```kotlin
var initialized = 1 // 型別為 Int，預設取得器與設定器
// var allByDefault // 錯誤：需要明確的初始化器，預設取得器與設定器是隱含的
```

唯讀屬性宣告的完整語法與可變屬性有兩點不同：它以 `val` 開頭而不是 `var`，並且不允許設定器：

```kotlin
val simple: Int? // 型別為 Int，預設取得器，必須在建構函數中初始化
val inferredType = 1 // 型別為 Int 並具有預設取得器
```

您可以為屬性定義自訂存取器。如果您定義了自訂取得器，它會在您每次存取該屬性時被呼叫（這樣您可以實作一個計算屬性）。以下是一個自訂取得器的範例：

```kotlin
//sampleStart
class Rectangle(val width: Int, val height: Int) {
    val area: Int // 屬性型別是可選的，因為它可以從取得器的回傳型別推斷出來
        get() = this.width * this.height
}
//sampleEnd
fun main() {
    val rectangle = Rectangle(3, 4)
    println("Width=${rectangle.width}, height=${rectangle.height}, area=${rectangle.area}")
}
```
{kotlin-runnable="true"}

如果屬性型別可以從取得器推斷出來，您可以省略它：

```kotlin
val area get() = this.width * this.height
```

如果您定義了自訂設定器，它會在您每次為屬性賦值時被呼叫，除了其初始化之外。自訂設定器看起來像這樣：

```kotlin
var stringRepresentation: String
    get() = this.toString()
    set(value) {
        setDataFromString(value) // 解析字串並將值賦予其他屬性
    }
```

依慣例，設定器參數的名稱是 `value`，但如果您願意，可以選擇不同的名稱。

如果您需要註解存取器或更改其可見性，但又不想更改預設實作，您可以定義存取器而不定義其主體：

```kotlin
var setterVisibility: String = "abc"
    private set // 設定器是私有的並具有預設實作

var setterWithAnnotation: Any? = null
    @Inject set // 使用 Inject 註解設定器
```

### 幕後欄位

在 Kotlin 中，欄位僅作為屬性的一部分用於在記憶體中儲存其值。欄位無法直接宣告。然而，當屬性需要幕後欄位時，Kotlin 會自動提供。這個幕後欄位可以在存取器中透過 `field` 識別符來引用：

```kotlin
var counter = 0 // 初始化器直接賦值給幕後欄位
    set(value) {
        if (value >= 0)
            field = value
            // counter = value // 錯誤 StackOverflow：使用實際名稱 'counter' 會使設定器遞迴
    }
```

`field` 識別符只能在屬性的存取器中使用。

如果屬性使用至少一個存取器的預設實作，或者自訂存取器透過 `field` 識別符引用它，則會為該屬性生成一個幕後欄位。

例如，在以下情況中將不會有幕後欄位：

```kotlin
val isEmpty: Boolean
    get() = this.size == 0
```

### 幕後屬性

如果您想做一些不符合這種_隱式幕後欄位_方案的事情，您總是可以使用_幕後屬性_：

```kotlin
private var _table: Map<String, Int>? = null
public val table: Map<String, Int>
    get() {
        if (_table == null) {
            _table = HashMap() // 型別參數會被推斷
        }
        return _table ?: throw AssertionError("Set to null by another thread")
    }
```

> 在 JVM 上：對具有預設取得器和設定器的私有屬性的存取會經過優化，以避免函數呼叫開銷。
>
{style="note"}

## 編譯期常數

如果唯讀屬性的值在編譯時已知，請使用 `const` 修飾符將其標記為_編譯期常數_。此類屬性需要滿足以下要求：

*   它必須是頂層屬性，或者是 [`object` 宣告](object-declarations.md#object-declarations-overview)或_[伴生物件](object-declarations.md#companion-objects)_的成員。
*   它必須以 `String` 型別或基本型別的值來初始化。
*   它不能是自訂取得器。

編譯器會行內化常數的用法，將對常數的引用替換為其實際值。然而，該欄位不會被移除，因此可以使用[反射](reflection.md)與其互動。

此類屬性也可以用於註解中：

```kotlin
const val SUBSYSTEM_DEPRECATED: String = "This subsystem is deprecated"

@Deprecated(SUBSYSTEM_DEPRECATED) fun foo() { ... }
```

## 延遲初始化屬性與變數

通常，宣告為非可空型別的屬性必須在建構函數中初始化。然而，這樣做通常不方便。例如，屬性可以透過依賴注入或在單元測試的設定方法中初始化。在這些情況下，您無法在建構函數中提供非空初始化器，但您仍然希望在類別主體內引用屬性時避免空值檢查。

為了處理這些情況，您可以使用 `lateinit` 修飾符標記屬性：

```kotlin
public class MyTest {
    lateinit var subject: TestSubject

    @SetUp fun setup() {
        subject = TestSubject()
    }

    @Test fun test() {
        subject.method()  // 直接解除引用
    }
}
```

此修飾符可用於在類別主體內宣告的 `var` 屬性（不在主要建構函數中，且僅當屬性沒有自訂取得器或設定器時），以及頂層屬性和區域變數。屬性或變數的型別必須是非可空的，並且不能是基本型別。

在 `lateinit` 屬性初始化之前存取它會拋出一個特殊例外，該例外會清楚地識別被存取的屬性以及它尚未初始化的事實。

### 檢查 `lateinit var` 是否已初始化

要檢查 `lateinit var` 是否已初始化，請在[該屬性的引用](reflection.md#property-references)上使用 `.isInitialized`：

```kotlin
if (foo::bar.isInitialized) {
    println(foo.bar)
}
```

此檢查僅適用於當屬性在同一型別、其中一個外部型別或同一檔案的頂層宣告時詞法上可存取的屬性。

## 覆寫屬性

請參閱[覆寫屬性](inheritance.md#overriding-properties)

## 委託屬性

最常見的屬性類型只是從幕後欄位讀取（可能也寫入），但自訂取得器和設定器允許您使用屬性，以便可以實作任何類型的屬性行為。在第一種的簡單性與第二種的多樣性之間，存在一些屬性可以做什麼的常見模式。一些範例：延遲值、透過給定鍵從映射讀取、存取資料庫、在存取時通知監聽器。

這些常見行為可以使用[委託屬性](delegated-properties.md)作為函式庫來實作。