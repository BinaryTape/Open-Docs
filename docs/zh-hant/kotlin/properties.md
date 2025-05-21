---
title: "屬性 (Properties)"
---
## 宣告屬性 (Declaring properties)

在 Kotlin 類別中的屬性，可以使用 `var` 關鍵字宣告為可變的，或者使用 `val` 關鍵字宣告為唯讀的。

```kotlin
class Address {
    var name: String = "Holmes, Sherlock"
    var street: String = "Baker"
    var city: String = "London"
    var state: String? = null
    var zip: String = "123456"
}
```

要使用屬性，只需透過其名稱來引用它：

```kotlin
fun copyAddress(address: Address): Address {
    val result = Address() // 在 Kotlin 中沒有 'new' 關鍵字
    result.name = address.name // 存取器 (accessors) 被呼叫
    result.street = address.street
    // ...
    return result
}
```

## Getter 和 Setter (Getters and setters)

宣告屬性的完整語法如下：

```kotlin
var <propertyName>[: <PropertyType>] [= <property_initializer>]
    [<getter>]
    [<setter>]
```

初始化器 (initializer)、getter 和 setter 都是可選的。如果屬性類型可以從初始化器或 getter 的返回類型推斷出來，則屬性類型也是可選的，如下所示：

```kotlin
var initialized = 1 // 具有 Int 類型，預設的 getter 和 setter
// var allByDefault // ERROR: 需要明確的初始化器，隱含預設的 getter 和 setter
```

唯讀屬性宣告的完整語法與可變屬性宣告的不同之處在於：它以 `val` 開頭，而不是 `var`，並且不允許 setter：

```kotlin
val simple: Int? // 具有 Int 類型，預設的 getter，必須在建構函式中初始化
val inferredType = 1 // 具有 Int 類型和預設的 getter
```

您可以為屬性定義自訂的存取器 (accessors)。如果定義了自訂的 getter，則每次存取該屬性時都會呼叫它（透過這種方式，您可以實現一個計算屬性）。以下是一個自訂 getter 的範例：

```kotlin

class Rectangle(val width: Int, val height: Int) {
    val area: Int // 屬性類型是可選的，因為它可以從 getter 的返回類型推斷出來
        get() = this.width * this.height
}

fun main() {
    val rectangle = Rectangle(3, 4)
    println("Width=${rectangle.width}, height=${rectangle.height}, area=${rectangle.area}")
}
```

如果屬性類型可以從 getter 推斷出來，您可以省略屬性類型：

```kotlin
val area get() = this.width * this.height
```

如果定義了自訂的 setter，則每次為屬性賦值時都會呼叫它，除了初始化之外。一個自訂的 setter 看起來像這樣：

```kotlin
var stringRepresentation: String
    get() = this.toString()
    set(value) {
        setDataFromString(value) // 解析字串並為其他屬性賦值
    }
```

按照慣例，setter 參數的名稱是 `value`，但如果願意，您可以選擇不同的名稱。

如果您需要為存取器新增註解 (annotate) 或更改其可見性 (visibility)，但又不想更改預設的實現，則可以定義存取器而不定義其主體：

```kotlin
var setterVisibility: String = "abc"
    private set // setter 是私有的，並且具有預設的實現

var setterWithAnnotation: Any? = null
    @Inject set // 使用 Inject 註解 setter
```

### Backing fields

在 Kotlin 中，欄位 (field) 僅用作屬性的一部分，以在記憶體中保存其值。欄位不能直接宣告。但是，當屬性需要 backing field 時，Kotlin 會自動提供它。這個 backing field 可以使用 `field` 識別符在存取器中引用：

```kotlin
var counter = 0 // 初始化器直接賦值給 backing field
    set(value) {
        if (value >= 0)
            field = value
            // counter = value // ERROR StackOverflow: 使用實際名稱 'counter' 會使 setter 遞迴呼叫
    }
```

`field` 識別符只能在屬性的存取器中使用。

如果屬性使用至少一個存取器的預設實現，或者自訂存取器透過 `field` 識別符引用它，則會為該屬性生成 backing field。

例如，在以下情況下不會有 backing field：

```kotlin
val isEmpty: Boolean
    get() = this.size == 0
```

### Backing properties

如果您想做一些不適合這種*隱式 backing field*方案的事情，您可以隨時退回到擁有一個*backing property*：

```kotlin
private var _table: Map<String, Int>? = null
public val table: Map<String, Int>
    get() {
        if (_table == null) {
            _table = HashMap() // 類型參數 (Type parameters) 會被推斷
        }
        return _table ?: throw AssertionError("Set to null by another thread")
    }
```

:::note
在 JVM 上：對具有預設 getter 和 setter 的私有屬性的存取進行了優化，以避免函數呼叫的額外負擔。

:::

## 編譯時常數 (Compile-time constants)

如果唯讀屬性的值在編譯時已知，請使用 `const` 修飾符將其標記為*編譯時常數*。這樣的屬性需要滿足以下要求：

* 它必須是一個頂層屬性 (top-level property)，或者是一個 [`object` 宣告](object-declarations#object-declarations-overview)或一個_[伴生物件 (companion object)](object-declarations#companion-objects)_的成員。
* 它必須使用 `String` 類型或基本類型 (primitive type) 的值進行初始化
* 它不能有自訂的 getter

編譯器將內聯使用該常數，將對該常數的引用替換為其實際值。但是，該欄位不會被移除，因此可以使用[反射 (reflection)](reflection)與之互動。

此類屬性也可以在註解中使用：

```kotlin
const val SUBSYSTEM_DEPRECATED: String = "This subsystem is deprecated"

@Deprecated(SUBSYSTEM_DEPRECATED) fun foo() { ... }
```

## 延遲初始化屬性和變數 (Late-initialized properties and variables)

通常，宣告為具有不可為空類型 (non-nullable type) 的屬性必須在建構函式中初始化。但是，通常情況下，這樣做並不方便。例如，屬性可以透過依賴注入 (dependency injection) 或單元測試的 setup 方法進行初始化。在這些情況下，您無法在建構函式中提供不可為空的初始化器，但仍然希望在類別主體中引用該屬性時避免空值檢查。

為了處理這種情況，您可以使用 `lateinit` 修飾符標記屬性：

```kotlin
public class MyTest {
    lateinit var subject: TestSubject

    @SetUp fun setup() {
        subject = TestSubject()
    }

    @Test fun test() {
        subject.method()  // 直接解引用 (dereference)
    }
}
```

此修飾符可用於在類別主體內宣告的 `var` 屬性（不在主建構函式中，且僅當屬性沒有自訂的 getter 或 setter 時），以及頂層屬性和區域變數。屬性或變數的類型必須是不可為空的，並且不能是基本類型。

在 `lateinit` 屬性初始化之前存取它會拋出一個特殊的異常，該異常清楚地標識了正在存取的屬性以及它尚未初始化的事實。

### 檢查 lateinit var 是否已初始化 (Checking whether a lateinit var is initialized)

要檢查 `lateinit var` 是否已初始化，請在[對該屬性的引用 (reference to that property)](reflection#property-references)上使用 `.isInitialized`：

```kotlin
if (foo::bar.isInitialized) {
    println(foo.bar)
}
```

此檢查僅適用於在同一類型、外部類型之一或同一檔案的頂層中宣告時，詞法上可存取的屬性。

## 覆寫屬性 (Overriding properties)

請參閱[覆寫屬性](inheritance#overriding-properties)

## 委託屬性 (Delegated properties)

最常見的屬性只是從 backing field 讀取（並且可能寫入），但是自訂的 getter 和 setter 允許您使用屬性，以便可以實現屬性的任何行為。在第一種的簡單性和第二種的多樣性之間，存在著屬性可以做什麼的常見模式。一些範例：延遲賦值 (lazy values)、透過給定的鍵從 Map 讀取、存取資料庫、在存取時通知監聽器。

可以使用[委託屬性](delegated-properties)將此類常見行為實現為程式庫。