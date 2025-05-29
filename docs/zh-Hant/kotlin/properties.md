[//]: # (title: 屬性)

## 宣告屬性

Kotlin 類別中的屬性可以使用 `var` 關鍵字宣告為可變的，或者使用 `val` 關鍵字宣告為唯讀的。

```kotlin
class Address {
    var name: String = "Holmes, Sherlock"
    var street: String = "Baker"
    var city: String = "London"
    var state: String? = null
    var zip: String = "123456"
}
```

要使用屬性，只需透過其名稱參照它即可：

```kotlin
fun copyAddress(address: Address): Address {
    val result = Address() // there's no 'new' keyword in Kotlin
    result.name = address.name // accessors are called
    result.street = address.street
    // ...
    return result
}
```

## Getter 與 Setter

宣告屬性的完整語法如下：

```kotlin
var <propertyName>[: <PropertyType>] [= <property_initializer>]
    [<getter>]
    [<setter>]
```

初始化器 (initializer)、取值器 (getter) 和設定器 (setter) 都是可選的。如果屬性型別可以從初始化器或取值器的回傳型別中推斷出來，則屬性型別是可選的，如下所示：

```kotlin
var initialized = 1 // has type Int, default getter and setter
// var allByDefault // ERROR: explicit initializer required, default getter and setter implied
```

唯讀屬性宣告的完整語法與可變屬性有兩種不同之處：它以 `val` 開頭而不是 `var`，並且不允許設定器：

```kotlin
val simple: Int? // has type Int, default getter, must be initialized in constructor
val inferredType = 1 // has type Int and a default getter
```

您可以為屬性定義自訂存取器 (accessor)。如果您定義了自訂取值器，每次存取該屬性時都會呼叫它（透過這種方式，您可以實作一個計算屬性 (computed property)）。以下是一個自訂取值器的範例：

```kotlin
//sampleStart
class Rectangle(val width: Int, val height: Int) {
    val area: Int // property type is optional since it can be inferred from the getter's return type
        get() = this.width * this.height
}
//sampleEnd
fun main() {
    val rectangle = Rectangle(3, 4)
    println("Width=${rectangle.width}, height=${rectangle.height}, area=${rectangle.area}")
}
```
{kotlin-runnable="true"}

如果屬性型別可以從取值器中推斷出來，您可以省略它：

```kotlin
val area get() = this.width * this.height
```

如果您定義了自訂設定器，每次將值指派給屬性時（除了其初始化之外），它都會被呼叫。自訂設定器看起來像這樣：

```kotlin
var stringRepresentation: String
    get() = this.toString()
    set(value) {
        setDataFromString(value) // parses the string and assigns values to other properties
    }
```

按照慣例，設定器參數的名稱是 `value`，但如果您喜歡，可以選擇一個不同的名稱。

如果您需要註解 (annotate) 存取器或改變其可見性 (visibility)，但不想改變預設實作 (default implementation)，您可以不定義存取器的主體 (body) 來定義它：

```kotlin
var setterVisibility: String = "abc"
    private set // the setter is private and has the default implementation

var setterWithAnnotation: Any? = null
    @Inject set // annotate the setter with Inject
```

### 支援欄位

在 Kotlin 中，欄位 (field) 僅作為屬性的一部分用於在記憶體中儲存其值。欄位無法直接宣告。然而，當屬性需要支援欄位時，Kotlin 會自動提供。此支援欄位可以在存取器中使用 `field` 識別符號來參照：

```kotlin
var counter = 0 // the initializer assigns the backing field directly
    set(value) {
        if (value >= 0)
            field = value
            // counter = value // ERROR StackOverflow: Using actual name 'counter' would make setter recursive
    }
```

`field` 識別符號只能用於屬性的存取器中。

如果屬性使用了至少一個存取器的預設實作，或者自訂存取器透過 `field` 識別符號參照它，則會為該屬性生成一個支援欄位。

例如，在以下情況中將不會有支援欄位：

```kotlin
val isEmpty: Boolean
    get() = this.size == 0
```

### 支援屬性

如果您想做的事情不符合這種 _隱式支援欄位_ 方案，您總是可以使用 _支援屬性_ 作為替代：

```kotlin
private var _table: Map<String, Int>? = null
public val table: Map<String, Int>
    get() {
        if (_table == null) {
            _table = HashMap() // Type parameters are inferred
        }
        return _table ?: throw AssertionError("Set to null by another thread")
    }
```

> 在 JVM 上：對具有預設取值器和設定器的私有屬性的存取會進行最佳化，以避免函式呼叫的開銷。
>
{style="note"}

## 編譯時常數

如果唯讀屬性的值在編譯時已知，請使用 `const` 修飾符將其標記為 _編譯時常數_。此類屬性需要滿足以下要求：

*   它必須是頂層屬性，或是 [`object` 宣告](object-declarations.md#object-declarations-overview) 或 _[伴隨物件](object-declarations.md#companion-objects)_ 的成員。
*   它必須使用 `String` 型別或基本型別的值進行初始化。
*   它不能是自訂取值器。

編譯器 (compiler) 會將常數的用法內聯 (inline)，將對常數的參照替換為其實際值。然而，該欄位不會被移除，因此可以使用 [反射 (reflection)](reflection.md) 進行互動。

此類屬性也可以用於註解中：

```kotlin
const val SUBSYSTEM_DEPRECATED: String = "This subsystem is deprecated"

@Deprecated(SUBSYSTEM_DEPRECATED) fun foo() { ... }
```

## 延遲初始化屬性與變數

通常，被宣告為非空型別 (non-nullable type) 的屬性必須在建構函式 (constructor) 中初始化。然而，這樣做通常不方便。例如，屬性可以透過依賴注入 (dependency injection) 或在單元測試 (unit test) 的設定方法中初始化。在這些情況下，您無法在建構函式中提供非空初始化器，但您仍然希望在類別主體 (class body) 內部參照屬性時避免空值檢查 (null checks)。

為了處理這些情況，您可以使用 `lateinit` 修飾符標記屬性：

```kotlin
public class MyTest {
    lateinit var subject: TestSubject

    @SetUp fun setup() {
        subject = TestSubject()
    }

    @Test fun test() {
        subject.method()  // dereference directly
    }
}
```

這個修飾符可以用於宣告在類別主體內部的 `var` 屬性（不能在主建構函式 (primary constructor) 中，且僅當屬性沒有自訂取值器或設定器時），以及頂層屬性 (top-level properties) 和局部變數 (local variables)。屬性或變數的型別必須是非空型別，並且不能是基本型別。

在 `lateinit` 屬性初始化之前存取它，會拋出一個特殊例外 (exception)，該例外會清楚地識別被存取的屬性以及它尚未初始化的事實。

### 檢查 `lateinit var` 是否已初始化

要檢查 `lateinit var` 是否已初始化，請在 [該屬性的參照](reflection.md#property-references) 上使用 `.isInitialized`：

```kotlin
if (foo::bar.isInitialized) {
    println(foo.bar)
}
```

此檢查僅適用於在相同型別、其中一個外部型別中宣告或在相同檔案的頂層在語法上可存取的屬性。

## 覆寫屬性

請參閱 [覆寫屬性](inheritance.md#overriding-properties)

## 委託屬性

最常見的屬性類型只是從支援欄位讀取（或許也寫入），但自訂取值器和設定器允許您使用屬性，以便可以實作屬性的任何行為。介於第一種的簡潔性與第二種的多樣性之間，存在一些屬性可以實現的常見模式。幾個例子包括：延遲值 (lazy values)、透過給定鍵從映射 (map) 中讀取、存取資料庫、在存取時通知監聽器 (listener)。

此類常見行為可以使用 [委託屬性 (delegated properties)](delegated-properties.md) 作為函式庫實作。