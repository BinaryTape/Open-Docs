[//]: # (title: 在 Kotlin 中使用 JavaScript 程式碼)

Kotlin 最初設計旨在與 Java 平台輕鬆互通：它將 Java 類別視為 Kotlin 類別，而 Java 則將 Kotlin 類別視為 Java 類別。

然而，JavaScript 是一種動態型別語言，這表示它不會在編譯時檢查型別。您可以透過 [`dynamic`](dynamic-type.md) 型別，從 Kotlin 自由地與 JavaScript 互動。如果您想充分利用 Kotlin 型別系統的強大功能，您可以為 JavaScript 函式庫建立外部宣告，這些宣告將會被 Kotlin 編譯器和周邊工具所理解。

## 內聯 JavaScript

您可以使用 [`js()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/js.html) 函式將 JavaScript 程式碼內聯到您的 Kotlin 程式碼中。例如：

```kotlin
fun jsTypeOf(o: Any): String {
    return js("typeof o")
}
```

由於 `js` 的參數在編譯時被解析並「原樣」翻譯為 JavaScript 程式碼，因此它必須是一個字串常數。因此，以下程式碼是不正確的：

```kotlin
fun jsTypeOf(o: Any): String {
    return js(getTypeof() + " o") // error reported here
}

fun getTypeof() = "typeof"
```

> 由於 JavaScript 程式碼由 Kotlin 編譯器解析，因此並非所有 ECMAScript 功能都可能受到支援。
> 在這種情況下，您可能會遇到編譯錯誤。
>
{style="note"}

請注意，呼叫 `js()` 會回傳一個 [`dynamic`](dynamic-type.md) 型別的結果，這在編譯時不提供型別安全。

## external 修飾符

為了告訴 Kotlin 某個宣告是以純 JavaScript 編寫的，您應該使用 `external` 修飾符來標記它。當編譯器看到這樣的宣告時，它會假定相應類別、函式或屬性的實作是由外部提供（由開發者提供或透過 [npm 依賴項](js-project-setup.md#npm-dependencies)），因此不會嘗試從該宣告生成任何 JavaScript 程式碼。這也是為什麼 `external` 宣告不能有主體。例如：

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

請注意，`external` 修飾符會被巢狀宣告繼承。這就是為什麼在範例 `Node` 類別中，成員函式和屬性之前沒有 `external` 修飾符。

`external` 修飾符僅允許用於套件級宣告。您不能宣告非 `external` 類別的 `external` 成員。

### 宣告類別的（靜態）成員

在 JavaScript 中，您可以在原型或類別本身上定義成員：

``` javascript
function MyClass() { ... }
MyClass.sharedMember = function() { /* implementation */ };
MyClass.prototype.ownMember = function() { /* implementation */ };
```

Kotlin 中沒有這樣的語法。然而，在 Kotlin 中我們有 [`companion`](object-declarations.md#companion-objects) 物件。Kotlin 以特殊方式處理 `external` 類別的伴隨物件：它不期望一個物件，而是假設伴隨物件的成員就是類別本身的成員。上述範例中的 `MyClass` 可以描述如下：

```kotlin
external class MyClass {
    companion object {
        fun sharedMember()
    }

    fun ownMember()
}
```

### 宣告帶有預設值的參數

如果您正在為一個帶有預設值參數的 JavaScript 函式編寫外部宣告，請使用 `definedExternally`。這會將預設值的生成委託給 JavaScript 函式本身：

```kotlin
external fun myFunWithOptionalArgs(
    x: Int,
    y: String = definedExternally,
    z: String = definedExternally
)
```

有了這個外部宣告，您可以呼叫 `myFunWithOptionalArgs`，並傳遞一個必要引數和兩個可選引數，其中預設值由 `myFunWithOptionalArgs` 的 JavaScript 實作計算。

### 擴展 JavaScript 類別

您可以輕鬆地擴展 JavaScript 類別，就好像它們是 Kotlin 類別一樣。只需定義一個 `external open` 類別，然後由一個非 `external` 類別來擴展它。例如：

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

- 當外部基底類別的函式透過簽名重載時，您不能在衍生類別中覆寫它。
- 您不能覆寫包含預設值參數的函式。
- 非 `external` 類別不能被 `external` 類別擴展。

### external 介面

JavaScript 沒有介面的概念。當一個函式期望其參數支援 `foo` 和 `bar` 這兩個方法時，您只需傳入一個實際具有這些方法的物件即可。

您可以使用介面在靜態型別的 Kotlin 中表達這個概念：

```kotlin
external interface HasFooAndBar {
    fun foo()

    fun bar()
}

external fun myFunction(p: HasFooAndBar)
```

外部介面的典型使用案例是描述設定物件。例如：

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

- 它們不能用於 `is` 檢查的右手邊。
- 它們不能作為實化型別引數傳遞。
- 它們不能用於類別字面量表達式（例如 `I::class`）。
- 對外部介面的 `as` 轉型總是成功。
    轉型為外部介面會產生「未經檢查的外部介面轉型 (Unchecked cast to external interface)」編譯時警告。該警告可以使用 `@Suppress("UNCHECKED_CAST_TO_EXTERNAL_INTERFACE")` 註解來抑制。

    IntelliJ IDEA 也可以自動生成 `@Suppress` 註解。透過燈泡圖示或 Alt-Enter 開啟意圖選單，然後點擊「未經檢查的外部介面轉型」檢查旁邊的小箭頭。在這裡，您可以選擇抑制範圍，您的 IDE 會相應地將註解添加到您的檔案中。

### 轉型

除了會因為轉型失敗而拋出 `ClassCastException` 的「不安全」轉型運算符 [`as`](typecasts.md#unsafe-cast-operator) 之外，Kotlin/JS 還提供了 [`unsafeCast<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/unsafe-cast.html)。當使用 `unsafeCast` 時，在執行時_完全不執行型別檢查_。例如，考慮以下兩種方法：

```kotlin
fun usingUnsafeCast(s: Any) = s.unsafeCast<String>()
fun usingAsOperator(s: Any) = s as String
```

它們將會編譯成如下：

```javascript
function usingUnsafeCast(s) {
    return s;
}

function usingAsOperator(s) {
    var tmp$;
    return typeof (tmp$ = s) === 'string' ? tmp$ : throwCCE();
}
```

## 等同性

Kotlin/JS 與其他平台相比，對於等同性檢查有著特殊的語義。

在 Kotlin/JS 中，Kotlin 的 [參照等同性](equality.md#referential-equality) 運算符 (`===`) 總是會轉換為 JavaScript 的 [嚴格等同性](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality) 運算符 (`===`)。

JavaScript 的 `===` 運算符不僅檢查兩個值是否相等，還檢查這兩個值的型別是否相等：

 ```kotlin
fun main() {
    val name = "kotlin"
    val value1 = name.substring(0, 1)
    val value2 = name.substring(0, 1)

    println(if (value1 === value2) "yes" else "no")
    // Prints 'yes' on Kotlin/JS
    // Prints 'no' on other platforms
}
 ```

此外，在 Kotlin/JS 中，[`Byte`、`Short`、`Int`、`Float` 和 `Double`](js-to-kotlin-interop.md#kotlin-types-in-javascript) 這五種數值型別在執行時都以 `Number` JavaScript 型別表示。因此，這五種型別的值是無法區分的：

 ```kotlin
fun main() {
    println(1.0 as Any === 1 as Any)
    // Prints 'true' on Kotlin/JS
    // Prints 'false' on other platforms
}
 ```

> 有關 Kotlin 中等同性的更多資訊，請參閱 [等同性](equality.md) 文件。
>
{style="tip"}