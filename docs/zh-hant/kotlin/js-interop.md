---
title: "從 Kotlin 使用 JavaScript 程式碼"
---
Kotlin 最初的設計目標是易於與 Java 平台互操作：它將 Java 類別視為 Kotlin 類別，而 Java 將 Kotlin 類別視為 Java 類別。

然而，JavaScript 是一種動態類型語言，這意味著它不會在編譯時檢查類型。 你可以通過 [`dynamic`](dynamic-type) 類型自由地從 Kotlin 與 JavaScript 交互。 如果你想使用 Kotlin 類型系統的全部功能，你可以為 JavaScript 函式庫建立外部宣告（external declarations），這些宣告將被 Kotlin 編譯器和周圍的工具所理解。

## 行內 JavaScript（Inline JavaScript）

你可以使用 [`js()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/js.html) 函數將 JavaScript 程式碼內嵌到 Kotlin 程式碼中。 例如：

```kotlin
fun jsTypeOf(o: Any): String {
    return js("typeof o")
}
```

由於 `js` 的參數在編譯時被解析並「原樣」翻譯成 JavaScript 程式碼，因此它必須是字串常數。 所以，以下程式碼是不正確的：

```kotlin
fun jsTypeOf(o: Any): String {
    return js(getTypeof() + " o") // 此處報告錯誤
}

fun getTypeof() = "typeof"
```

:::note
由於 JavaScript 程式碼由 Kotlin 編譯器解析，因此可能不支援所有 ECMAScript 功能。
在這種情況下，你可能會遇到編譯錯誤。

:::

請注意，調用 `js()` 會返回 [`dynamic`](dynamic-type) 類型的结果，該類型在編譯時不提供任何類型安全。

## external 修飾符

要告訴 Kotlin 某個宣告（declaration）是用純 JavaScript 撰寫的，你應該使用 `external` 修飾符標記它。 當編譯器看到這樣的宣告時，它會假定相應類別、函數或屬性的實現是從外部提供的（由開發人員或通過 [npm 依賴項](js-project-setup#npm-dependencies)），因此不會嘗試從宣告中產生任何 JavaScript 程式碼。 這也是為什麼 `external` 宣告不能有主體（body）。 例如：

```kotlin
external fun alert(message: Any?): Unit

external class Node {
    val firstChild: Node

    fun append(child: Node): Node

    fun removeChild(child: Node): Node

    // 等等
}

external val window: Window
```

請注意，`external` 修飾符會被嵌套宣告繼承。 這就是為什麼在 `Node` 類別的示例中，成員函數和屬性之前沒有 `external` 修飾符。

`external` 修飾符僅允許在套件級別宣告（package-level declarations）上使用。 你不能宣告一個非 `external` 類別的 `external` 成員。

### 宣告類別的（靜態）成員

在 JavaScript 中，你可以在原型（prototype）或類別本身上定義成員：

``` javascript
function MyClass() { ... }
MyClass.sharedMember = function() { /* implementation */ };
MyClass.prototype.ownMember = function() { /* implementation */ };
```

Kotlin 中沒有這樣的語法。 但是，在 Kotlin 中，我們有 [`companion`](object-declarations#companion-objects) 物件。 Kotlin 以特殊的方式處理 `external` 類別的伴生物件（companion objects）：它不是期望一個物件，而是假定伴生物件的成員是類別本身的成員。 上面示例中的 `MyClass` 可以描述如下：

```kotlin
external class MyClass {
    companion object {
        fun sharedMember()
    }

    fun ownMember()
}
```

### 宣告可選參數

如果你正在為具有可選參數的 JavaScript 函數編寫外部宣告，請使用 `definedExternally`。 這會將預設值的產生委託給 JavaScript 函數本身：

```kotlin
external fun myFunWithOptionalArgs(
    x: Int,
    y: String = definedExternally,
    z: String = definedExternally
)
```

使用此外部宣告，你可以使用一個必需參數和兩個可選參數調用 `myFunWithOptionalArgs`，其中預設值由 `myFunWithOptionalArgs` 的 JavaScript 實現計算。

### 擴展 JavaScript 類別

你可以像擴展 Kotlin 類別一樣輕鬆地擴展 JavaScript 類別。 只需定義一個 `external open` 類別，並通過一個非 `external` 類別來擴展它。 例如：

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

有一些限制：

- 當外部基底類別的函數被簽名（signature）重載時，你不能在派生類別中覆蓋它。
- 你不能覆蓋具有預設參數的函數。
- 非外部類別不能被外部類別擴展。

### external 介面（external interfaces）

JavaScript 沒有介面（interface）的概念。 當一個函數期望它的參數支援兩個方法 `foo` 和 `bar` 時，你只需傳入一個實際具有這些方法的物件。

你可以使用介面在靜態類型的 Kotlin 中表達這個概念：

```kotlin
external interface HasFooAndBar {
    fun foo()

    fun bar()
}

external fun myFunction(p: HasFooAndBar)
```

外部介面的典型用例是描述設定物件。 例如：

```kotlin
external interface JQueryAjaxSettings {
    var async: Boolean

    var cache: Boolean

    var complete: (JQueryXHR, String) `->` Unit

    // 等等
}

fun JQueryAjaxSettings(): JQueryAjaxSettings = js("{}")

external class JQuery {
    companion object {
        fun get(settings: JQueryAjaxSettings): JQueryXHR
    }
}

fun sendQuery() {
    JQuery.get(JQueryAjaxSettings().apply {
        complete = { (xhr, data) `->`
            window.alert("Request complete")
        }
    })
}
```

外部介面有一些限制：

- 它們不能在 `is` 檢查的右側使用。
- 它們不能作為具體化的類型參數（reified type arguments）傳遞。
- 它們不能在類別字面量（class literal）表達式中使用（例如 `I::class`）。
- `as` 轉換為外部介面總是成功。
    轉換為外部介面會產生「未經檢查的轉換為外部介面（Unchecked cast to external interface）」編譯時警告。 可以使用 `@Suppress("UNCHECKED_CAST_TO_EXTERNAL_INTERFACE")` 注釋來抑制該警告。

    IntelliJ IDEA 也可以自動產生 `@Suppress` 注釋。 通過燈泡圖示或 Alt-Enter 打開意圖選單，然後點擊「未經檢查的轉換為外部介面（Unchecked cast to external interface）」檢查旁邊的小箭頭。 在這裡，你可以選擇抑制範圍，你的 IDE 會相應地將注釋添加到你的檔案中。

### 類型轉換（Casts）

除了 ["不安全"的轉換運算符](typecasts#unsafe-cast-operator) `as`（如果轉換不可能，它會抛出 `ClassCastException`）之外，Kotlin/JS 還提供了 [`unsafeCast<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/unsafe-cast.html)。 使用 `unsafeCast` 時，在運行時_根本不進行類型檢查_。 例如，考慮以下兩種方法：

```kotlin
fun usingUnsafeCast(s: Any) = s.unsafeCast<String>()
fun usingAsOperator(s: Any) = s as String
```

它們將被相應地編譯：

```javascript
function usingUnsafeCast(s) {
    return s;
}

function usingAsOperator(s) {
    var tmp$;
    return typeof (tmp$ = s) === 'string' ? tmp$ : throwCCE();
}
```

## 相等性（Equality）

與其他平台相比，Kotlin/JS 在相等性檢查方面具有特定的語意。

在 Kotlin/JS 中，Kotlin [引用相等性](equality#referential-equality) 運算符 (`===`) 總是轉換為 JavaScript [嚴格相等性](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality) 運算符 (`===`)。

JavaScript `===` 運算符不僅檢查兩個值是否相等，還檢查這兩個值的類型是否相等：

 ```kotlin
fun main() {
    val name = "kotlin"
    val value1 = name.substring(0, 1)
    val value2 = name.substring(0, 1)

    println(if (value1 === value2) "yes" else "no")
    // 在 Kotlin/JS 上印出 'yes'
    // 在其他平台上印出 'no'
}
 ```

此外，在 Kotlin/JS 中，[`Byte`, `Short`, `Int`, `Float`, 和 `Double`](js-to-kotlin-interop#kotlin-types-in-javascript) 數字類型在運行時都用 `Number` JavaScript 類型表示。 因此，這五種類型的值是無法區分的：

 ```kotlin
fun main() {
    println(1.0 as Any === 1 as Any)
    // 在 Kotlin/JS 上印出 'true'
    // 在其他平台上印出 'false'
}
 ```

:::tip
有關 Kotlin 中相等性的更多資訊，請參閱 [相等性（Equality）](equality) 文件。

:::