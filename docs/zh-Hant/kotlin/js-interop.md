[//]: # (title: 從 Kotlin 使用 JavaScript 程式碼)

Kotlin 最初設計的目的是為了方便與 Java 平台互通：它將 Java 類別視為 Kotlin 類別，而 Java 則將 Kotlin 類別視為 Java 類別。

然而，JavaScript 是一種動態型別語言 (dynamically typed language)，這意味著它不會在編譯時期 (compile time) 檢查型別。您可以透過 [動態型別 (dynamic type)](dynamic-type.md) 自由地從 Kotlin 與 JavaScript 進行通訊。如果您想充分利用 Kotlin 型別系統 (type system) 的強大功能，您可以為 JavaScript 函式庫建立外部宣告 (external declarations)，這些宣告將被 Kotlin 編譯器和周邊工具鏈 (tooling) 理解。

## 行內 JavaScript

您可以使用 [`js()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/js.html) 函式將 JavaScript 程式碼行內 (inline) 嵌入到 Kotlin 程式碼中。
例如：

```kotlin
fun jsTypeOf(o: Any): String {
    return js("typeof o")
}
```

由於 `js` 的參數在編譯時期被解析並「按原樣 (as-is)」翻譯成 JavaScript 程式碼，因此它必須是一個字串常數 (string constant)。所以，以下程式碼是錯誤的：

```kotlin
fun jsTypeOf(o: Any): String {
    return js(getTypeof() + " o") // error reported here
}

fun getTypeof() = "typeof"
```

> 由於 JavaScript 程式碼是由 Kotlin 編譯器解析的，並非所有 ECMAScript 功能都可能受到支援。
> 在這種情況下，您可能會遇到編譯錯誤 (compilation errors)。
> 
{style="note"}

請注意，呼叫 `js()` 會回傳一個 [`dynamic`](dynamic-type.md) 型別的結果，這在編譯時期不提供任何型別安全 (type safety)。

## external 修飾符

為了告訴 Kotlin 某個宣告是以純 JavaScript 編寫的，您應該使用 `external` 修飾符標記它。當編譯器看到這樣的宣告時，它會假設對應類別、函式或屬性的實作是由外部提供的（由開發人員或透過 [npm 依賴 (npm dependency)](js-project-setup.md#npm-dependencies)），因此不會嘗試從該宣告生成任何 JavaScript 程式碼。這也是 `external` 宣告不能有函式本體 (body) 的原因。例如：

```kotlin
external fun alert(message: Any?): Unit

external class Node {
    val firstChild: Node

    fun append(child: Node): Node

    fun removeChild(child: Node): Node

    // etc
}

external val window: Window
```

請注意，`external` 修飾符會被巢狀宣告 (nested declarations) 繼承。這就是為什麼在 `Node` 類別的範例中，成員函式和屬性之前沒有 `external` 修飾符。

`external` 修飾符只允許用於套件層級宣告 (package-level declarations)。您不能宣告非 `external` 類別的 `external` 成員。

### 宣告類別的 (靜態) 成員

在 JavaScript 中，您可以在原型 (prototype) 或類別本身上定義成員：

``` javascript
function MyClass() { ... }
MyClass.sharedMember = function() { /* implementation */ };
MyClass.prototype.ownMember = function() { /* implementation */ };
```

Kotlin 中沒有這樣的語法。然而，在 Kotlin 中我們有 [伴生物件 (companion objects)](object-declarations.md#companion-objects)。Kotlin 會以特殊方式處理 `external` 類別的伴生物件：它不期望物件，而是假設伴生物件的成員是類別本身的成員。上述範例中的 `MyClass` 可以描述如下：

```kotlin
external class MyClass {
    companion object {
        fun sharedMember()
    }

    fun ownMember()
}
```

### 宣告選用參數

如果您正在為一個具有選用參數 (optional parameter) 的 JavaScript 函式編寫外部宣告，請使用 `definedExternally`。這將預設值 (default values) 的生成委託給 JavaScript 函式本身：

```kotlin
external fun myFunWithOptionalArgs(
    x: Int,
    y: String = definedExternally,
    z: String = definedExternally
)
```

有了這個外部宣告，您可以呼叫 `myFunWithOptionalArgs`，帶有一個必要引數和兩個選用引數，其中預設值由 `myFunWithOptionalArgs` 的 JavaScript 實作計算。

### 擴充 JavaScript 類別

您可以輕鬆擴充 JavaScript 類別，就像它們是 Kotlin 類別一樣。只需定義一個 `external open` 類別，然後由一個非 `external` 類別擴充它。例如：

```kotlin
open external class Foo {
    open fun run()
    fun stop()
}

class Bar : Foo() {
    override fun run() {
        window.alert("Running!")
    }

    fun restart() {
        window.alert("Restarting")
    }
}
```

存在一些限制：

- 當外部基礎類別 (external base class) 的函式透過簽章多載 (overloaded by signature) 時，您不能在衍生類別 (derived class) 中覆寫它。
- 您不能覆寫具有預設引數 (default arguments) 的函式。
- 非外部類別不能被外部類別擴充。

### 外部介面

JavaScript 沒有介面 (interfaces) 的概念。當一個函式期望其參數支援 `foo` 和 `bar` 兩個方法時，您只需傳入一個實際具有這些方法的物件。

您可以使用介面在靜態型別 (statically typed) 的 Kotlin 中表達這個概念：

```kotlin
external interface HasFooAndBar {
    fun foo()

    fun bar()
}

external fun myFunction(p: HasFooAndBar)
```

外部介面 (external interfaces) 的典型使用案例是描述設定物件 (settings objects)。例如：

```kotlin
external interface JQueryAjaxSettings {
    var async: Boolean

    var cache: Boolean

    var complete: (JQueryXHR, String) -> Unit

    // etc
}

fun JQueryAjaxSettings(): JQueryAjaxSettings = js("{}")

external class JQuery {
    companion object {
        fun get(settings: JQueryAjaxSettings): JQueryXHR
    }
}

fun sendQuery() {
    JQuery.get(JQueryAjaxSettings().apply {
        complete = { (xhr, data) ->
            window.alert("Request complete")
        }
    })
}
```

外部介面有一些限制：

- 它們不能用於 `is` 檢查的右側 (right-hand side of `is` checks)。
- 它們不能作為實化型別引數 (reified type arguments) 傳遞。
- 它們不能用於類別字面值表達式 (class literal expressions)（例如 `I::class`）。
- 轉型為外部介面 (casts to external interfaces) 總是成功。
    轉型為外部介面會產生「未檢查的外部介面轉型 (Unchecked cast to external interface)」編譯時期警告 (compile time warning)。該警告可以使用 `@Suppress("UNCHECKED_CAST_TO_EXTERNAL_INTERFACE")` 註解 (annotation) 抑制 (suppressed)。

    IntelliJ IDEA 也可以自動生成 `@Suppress` 註解。透過燈泡圖示 (light bulb icon) 或 Alt-Enter 開啟意圖選單 (intentions menu)，然後點擊「未檢查的外部介面轉型」檢查旁邊的小箭頭。在這裡，您可以選擇抑制範圍 (suppression scope)，您的 IDE 將相應地將註解新增到您的檔案中。

### 轉型 (Casts)

除了在轉型不可能時會拋出 `ClassCastException` 的「不安全 (unsafe)」轉型運算子 [`as`](typecasts.md#unsafe-cast-operator) 之外，Kotlin/JS 還提供了 [`unsafeCast<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/unsafe-cast.html)。使用 `unsafeCast` 時，在執行時期 (runtime) _根本不進行型別檢查_。例如，考慮以下兩種方法：

```kotlin
fun usingUnsafeCast(s: Any) = s.unsafeCast<String>()
fun usingAsOperator(s: Any) = s as String
```

它們將相應地編譯：

```javascript
function usingUnsafeCast(s) {
    return s;
}

function usingAsOperator(s) {
    var tmp$;
    return typeof (tmp$ = s) === 'string' ? tmp$ : throwCCE();
}
```

## 相等性

與其他平台相比，Kotlin/JS 在相等性檢查方面具有特定語意 (particular semantics)。

在 Kotlin/JS 中，Kotlin [參照相等性](equality.md#referential-equality)運算子 (`===`) 總是轉換為 JavaScript [嚴格相等性](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality)運算子 (`===`)。

JavaScript 的 `===` 運算子不僅檢查兩個值是否相等，還檢查這兩個值的型別是否相等：

 ```kotlin
fun main() {
    val name = "kotlin"
    val value1 = name.substring(0, 1)
    val value2 = name.substring(0, 1)

    println(if (value1 === value2) "yes" else "no")
    // 在 Kotlin/JS 上列印 'yes'
    // 在其他平台上列印 'no'
}
 ```

此外，在 Kotlin/JS 中，[`Byte`、`Short`、`Int`、`Float` 和 `Double`](js-to-kotlin-interop.md#kotlin-types-in-javascript) 這五種數值型別在執行時期都以 `Number` JavaScript 型別表示。因此，這五種類型的值是無法區分 (indistinguishable) 的：

 ```kotlin
fun main() {
    println(1.0 as Any === 1 as Any)
    // 在 Kotlin/JS 上列印 'true'
    // 在其他平台上列印 'false'
}
 ```

> 有關 Kotlin 中相等性的更多資訊，請參閱[相等性 (Equality)](equality.md) 文件。
> 
{style="tip"}