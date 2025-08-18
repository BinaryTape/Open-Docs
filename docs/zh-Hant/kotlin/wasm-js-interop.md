[//]: # (title: 與 JavaScript 的互通性)

Kotlin/Wasm 允許您在 Kotlin 中使用 JavaScript 程式碼，並在 JavaScript 中使用 Kotlin 程式碼。

與 [Kotlin/JS](js-overview.md) 一樣，Kotlin/Wasm 編譯器也具備與 JavaScript 的互通性。如果您熟悉 Kotlin/JS 的互通性，您會注意到 Kotlin/Wasm 的互通性與其相似。然而，仍有一些關鍵差異需要考量。

> Kotlin/Wasm 處於 [Alpha 階段](components-stability.md)。它隨時可能變更。請在生產環境前的情境中使用。我們歡迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492) 提供意見回饋。
>
{style="note"}

## 在 Kotlin 中使用 JavaScript 程式碼

了解如何透過使用 `external` 宣告、包含 JavaScript 程式碼片段的函式，以及 `@JsModule` 註解，在 Kotlin 中使用 JavaScript 程式碼。

### 外部宣告

外部 JavaScript 程式碼預設在 Kotlin 中不可見。
要在 Kotlin 中使用 JavaScript 程式碼，您可以使用 `external` 宣告來描述其 API。

#### JavaScript 函式

考慮以下 JavaScript 函式：

```javascript
function greet (name) {
    console.log("Hello, " + name + "!");
}
```

您可以在 Kotlin 中將其宣告為 `external` 函式：

```kotlin
external fun greet(name: String)
```

外部函式沒有函式主體，您可以將其作為常規 Kotlin 函式呼叫：

```kotlin
fun main() {
    greet("Alice")
}
```

#### JavaScript 屬性

考慮這個全域 JavaScript 變數：

```javascript
let globalCounter = 0;
```

您可以在 Kotlin 中使用 `external var` 或 `val` 屬性來宣告它：

```kotlin
external var globalCounter: Int
```

這些屬性是在外部初始化的。這些屬性不能在 Kotlin 程式碼中包含 `= value` 初始化器。

#### JavaScript 類別

考慮以下 JavaScript 類別：

```javascript
class Rectangle {
    constructor (height, width) {
        this.height = height;
        this.width = width;
    }

    area () {
        return this.height * this.width;
    }
}
```

您可以在 Kotlin 中將其作為外部類別使用：

```kotlin
external class Rectangle(height: Double, width: Double) : JsAny {
    val height: Double
    val width: Double
    fun area(): Double
}
```

`external` 類別內的所有宣告都隱含地視為外部宣告。

#### 外部介面

您可以在 Kotlin 中描述 JavaScript 物件的形狀。考慮以下 JavaScript 函式及其傳回值：

```javascript
function createUser (name, age) {
    return { name: name, age: age };
}
```

了解如何使用 `external interface User` 類型在 Kotlin 中描述其形狀：

```kotlin
external interface User : JsAny {
    val name: String
    val age: Int
}

external fun createUser(name: String, age: Int): User
```

外部介面沒有執行時類型資訊，並且只是一個編譯時概念。
因此，與常規介面相比，外部介面有一些限制：
* 您不能在 `is` 檢查的右側使用它們。
* 您不能在類別常值表達式（例如 `User::class`）中使用它們。
* 您不能將它們作為具體化類型引數傳遞。
* 使用 `as` 對外部介面進行型別轉換總是會成功。

#### 外部物件

考慮以下包含物件的 JavaScript 變數：

```javascript
let Counter = {
    value: 0,
    step: 1,
    increment () {
        this.value += this.step;
    }
};
```

您可以在 Kotlin 中將其作為外部物件使用：

```kotlin
external object Counter : JsAny {
    fun increment()
    val value: Int
    var step: Int
}
```

#### 外部型別繼承

與常規類別和介面類似，您可以宣告外部宣告以擴展其他外部類別並實作外部介面。
然而，您不能在同一個型別繼承中混合使用外部和非外部宣告。

### 包含 JavaScript 程式碼的 Kotlin 函式

您可以透過定義函式並使用 `= js("code")` 主體，將 JavaScript 片段加入 Kotlin/Wasm 程式碼中：

```kotlin
fun getCurrentURL(): String =
    js("window.location.href")
```

如果您想執行一個 JavaScript 陳述式區塊，請使用花括號 `{}` 將您的程式碼包圍在字串內部：

```kotlin
fun setLocalSettings(value: String): Unit = js(
    """{
        localStorage.setItem('settings', value);
}"""
)
```

如果您想傳回一個物件，請使用圓括號 `()` 將花括號 `{}` 包圍起來：

```kotlin
fun createJsUser(name: String, age: Int): JsAny =
    js("({ name: name, age: age })")
```

Kotlin/Wasm 以特殊方式處理對 `js()` 函式的呼叫，且其實作有一些限制：
* `js()` 函式呼叫必須提供一個字串常值引數。
* `js()` 函式呼叫必須是函式主體中唯一的表達式。
* `js()` 函式只允許從套件級別函式中呼叫。
* 函式傳回型別必須明確提供。
* [型別](#type-correspondence) 受到限制，類似於 `external fun`。

Kotlin 編譯器會將程式碼字串放入生成的 JavaScript 檔案中的函式中，並將其匯入 WebAssembly 格式。
Kotlin 編譯器不會驗證這些 JavaScript 片段。
如果存在 JavaScript 語法錯誤，它們會在您執行 JavaScript 程式碼時報告。

> `@JsFun` 註解具有類似功能，並很可能將被棄用。
>
{style="note"}

### JavaScript 模組

預設情況下，外部宣告對應於 JavaScript 全域範圍。如果您使用 [`@JsModule` 註解](js-modules.md#jsmodule-annotation) 註解 Kotlin 檔案，則其中所有外部宣告都將從指定的模組匯入。

考慮以下 JavaScript 程式碼範例：

```javascript
// users.mjs
export let maxUsers = 10;

export class User {
    constructor (username) {
        this.username = username;
    }
}
```

在 Kotlin 中使用 `@JsModule` 註解來使用此 JavaScript 程式碼：

```kotlin
// Kotlin
@file:JsModule("./users.mjs")

external val maxUsers: Int

external class User : JsAny {
    constructor(username: String)

    val username: String
}
```

### 陣列互通性

您可以將 JavaScript 的 `JsArray<T>` 複製到 Kotlin 的原生 `Array` 或 `List` 型別；同樣，您也可以將這些 Kotlin 型別複製到 `JsArray<T>`。

若要將 `JsArray<T>` 轉換為 `Array<T>` 或反之，請使用其中一個可用的 [轉接函式](https://github.com/Kotlin/kotlinx-browser/blob/dfbdceed314567983c98f1d66e8c2e10d99c5a55/src/wasmJsMain/kotlin/arrayCopy.kt)。

這是一個通用型別之間轉換的範例：

```kotlin
val list: List<JsString> =
    listOf("Kotlin", "Wasm").map { it.toJsString() }

// Uses .toJsArray() to convert List or Array to JsArray
val jsArray: JsArray<JsString> = list.toJsArray()

// Uses .toArray() and .toList() to convert it back to Kotlin types 
val kotlinArray: Array<JsString> = jsArray.toArray()
val kotlinList: List<JsString> = jsArray.toList()
```

類似的轉接函式也可用於將型別化陣列轉換為其 Kotlin 對應項（例如，`IntArray` 和 `Int32Array`）。有關詳細資訊和實作，請參閱 [`kotlinx-browser` 儲存庫]( https://github.com/Kotlin/kotlinx-browser/blob/dfbdceed314567983c98f1d66e8c2e10d99c5a55/src/wasmJsMain/kotlin/arrayCopy.kt)。

這是一個型別化陣列之間轉換的範例：

```kotlin
import org.khronos.webgl.*

    // ...

    val intArray: IntArray = intArrayOf(1, 2, 3)
    
    // Uses .toInt32Array() to convert Kotlin IntArray to JavaScript Int32Array
    val jsInt32Array: Int32Array = intArray.toInt32Array()
    
    // Uses toIntArray() to convert JavaScript Int32Array back to Kotlin IntArray
    val kotlnIntArray: IntArray = jsInt32Array.toIntArray()
```

## 在 JavaScript 中使用 Kotlin 程式碼

了解如何透過使用 `@JsExport` 註解，在 JavaScript 中使用您的 Kotlin 程式碼。

### 帶有 `@JsExport` 註解的函式

若要使 Kotlin/Wasm 函式可用於 JavaScript 程式碼，請使用 `@JsExport` 註解：

```kotlin
// Kotlin/Wasm

@JsExport
fun addOne(x: Int): Int = x + 1
```

標記為 `@JsExport` 註解的 Kotlin/Wasm 函式，會以生成的 `.mjs` 模組的 `default` 匯出屬性形式可見。
然後您可以在 JavaScript 中使用此函式：

```javascript
// JavaScript

import exports from "./module.mjs"

exports.addOne(10)
```

Kotlin/Wasm 編譯器能夠從您的 Kotlin 程式碼中任何 `@JsExport` 宣告生成 TypeScript 定義。這些定義可用於 IDE 和 JavaScript 工具，以提供程式碼自動完成、協助型別檢查，並使從 JavaScript 和 TypeScript 消費 Kotlin 程式碼變得更容易。

Kotlin/Wasm 編譯器會收集任何標記為 `@JsExport` 註解的頂層函式，並自動在 `.d.ts` 檔案中生成 TypeScript 定義。

若要生成 TypeScript 定義，請在您的 `build.gradle.kts` 檔案中的 `wasmJs{}` 區塊內，新增 `generateTypeScriptDefinitions()` 函式：

```kotlin
kotlin {
    wasmJs {
        binaries.executable()
        browser {
        }
        generateTypeScriptDefinitions()
    }
}
```

> 在 Kotlin/Wasm 中生成 TypeScript 宣告檔案是 [實驗性的](components-stability.md#stability-levels-explained)。它可能隨時被移除或變更。
>
{style="warning"}

## 型別對應

Kotlin/Wasm 僅允許在 JavaScript 互通宣告的簽名中使用某些型別。這些限制統一適用於帶有 `external`、`= js("code")` 或 `@JsExport` 的宣告。

查看 Kotlin 型別如何對應到 JavaScript 型別：

| Kotlin                                                     | JavaScript                        |
|------------------------------------------------------------|-----------------------------------|
| `Byte`、`Short`、`Int`、`Char`、`UByte`、`UShort`、`UInt` | `Number`                          |
| `Float`、`Double`                                          | `Number`                          |
| `Long`、`ULong`                                            | `BigInt`                          |
| `Boolean`                                                  | `Boolean`                         |
| `String`                                                   | `String`                          |
| `Unit` 在傳回位置                                          | `undefined`                       |
| 函式型別，例如 `(String) -> Int`                           | Function                          |
| `JsAny` 及其子型別                                         | 任何 JavaScript 值                |
| `JsReference`                                              | Kotlin 物件的不透明參考         |
| 其他型別                                                   | 不支援                            |

您也可以使用這些型別的可空版本。

### JsAny 型別

JavaScript 值在 Kotlin 中使用 `JsAny` 型別及其子型別表示。

Kotlin/Wasm 標準函式庫提供了其中一些型別的表示：
* 套件 `kotlin.js`：
    * `JsAny`
    * `JsBoolean`、`JsNumber`、`JsString`
    * `JsArray`
    * `Promise`

您也可以透過宣告 `external` 介面或類別來建立自訂的 `JsAny` 子型別。

### JsReference 型別

Kotlin 值可以使用 `JsReference` 型別作為不透明參考傳遞給 JavaScript。

例如，如果您想將此 Kotlin 類別 `User` 暴露給 JavaScript：

```kotlin
class User(var name: String)
```

您可以使用 `toJsReference()` 函式來建立 `JsReference<User>` 並將其傳回給 JavaScript：

```kotlin
@JsExport
fun createUser(name: String): JsReference<User> {
    return User(name).toJsReference()
}
```

這些參考在 JavaScript 中不可直接使用，並且表現為空閒置的 JavaScript 物件。
若要操作這些物件，您需要使用 `get()` 方法將參考值解封，並匯出更多函式到 JavaScript：

```kotlin
@JsExport
fun setUserName(user: JsReference<User>, name: String) {
    user.get().name = name
}
```

您可以建立一個類別並從 JavaScript 更改其名稱：

```javascript
import UserLib from "./userlib.mjs"

let user = UserLib.createUser("Bob");
UserLib.setUserName(user, "Alice");
```

### 型別參數

如果 JavaScript 互通宣告的型別參數具有 `JsAny` 或其子型別的上界，則可以包含型別參數。例如：

```kotlin
external fun <T : JsAny> processData(data: JsArray<T>): T
```

## 異常處理

您可以使用 Kotlin 的 `try-catch` 表達式來捕獲 JavaScript 異常。
然而，預設情況下在 Kotlin/Wasm 中無法存取有關拋出值的特定詳細資訊。

您可以配置 `JsException` 型別以包含來自 JavaScript 的原始錯誤訊息和堆疊追蹤。
為此，請將以下編譯器選項新增到您的 `build.gradle.kts` 檔案中：

```kotlin
kotlin {
    wasmJs {
        compilerOptions {
            freeCompilerArgs.add("-Xwasm-attach-js-exception")
        }
    }
}
```

此行為取決於 `WebAssembly.JSTag` API，該 API 僅在某些瀏覽器中可用：

* **Chrome**：從版本 115 起支援
* **Firefox**：從版本 129 起支援
* **Safari**：尚未支援

以下是演示此行為的範例：

```kotlin
external object JSON {
    fun <T: JsAny> parse(json: String): T
}

fun main() {
    try {
        JSON.parse("an invalid JSON")
    } catch (e: JsException) {
        println("Thrown value is: ${e.thrownValue}")
        // SyntaxError: Unexpected token 'a', "an invalid JSON" is not valid JSON

        println("Message: ${e.message}")
        // Message: Unexpected token 'a', "an invalid JSON" is not valid JSON

        println("Stacktrace:")
        // Stacktrace:

        // Prints the full JavaScript stack trace 
        e.printStackTrace()
    }
}
```

啟用 `-Xwasm-attach-js-exception` 編譯器選項後，`JsException` 型別會提供 JavaScript 錯誤的特定詳細資訊。
如果未啟用此編譯器選項，`JsException` 僅包含一條通用訊息，說明在執行 JavaScript 程式碼時拋出了一個異常。

如果您嘗試使用 JavaScript 的 `try-catch` 表達式來捕獲 Kotlin/Wasm 異常，它看起來就像一個通用的 `WebAssembly.Exception`，沒有可直接存取的訊息和資料。

## Kotlin/Wasm 與 Kotlin/JS 互通性差異

儘管 Kotlin/Wasm 的互通性與 Kotlin/JS 的互通性有相似之處，但仍有一些關鍵差異需要考量：

|                         | **Kotlin/Wasm**                                                                                                                                                                                                     | **Kotlin/JS**                                                                                                                                       |
|-------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| **外部列舉**          | 不支援外部列舉類別。                                                                                                                                                                                                | 支援外部列舉類別。                                                                                                                                  |
| **型別擴展**          | 不支援非外部型別擴展外部型別。                                                                                                                                                                                      | 支援非外部型別。                                                                                                                                    |
| **`JsName` 註解**       | 僅在註解外部宣告時生效。                                                                                                                                                                                            | 可用於更改常規非外部宣告的名稱。                                                                                                                     |
| **`js()` 函式**         | `js("code")` 函式呼叫允許作為套件級別函式的單一表達式主體。                                                                                                                                                          | `js("code")` 函式可以在任何內容中呼叫，並傳回 `dynamic` 值。                                                                                         |
| **模組系統**          | 僅支援 ES 模組。沒有 `@JsNonModule` 註解的類比。將其匯出作為 `default` 物件上的屬性提供。僅允許匯出套件級別函式。                                                                                                         | 支援 ES 模組和傳統模組系統。提供具名 ESM 匯出。允許匯出類別和物件。                                                                                   |
| **型別**                | 對所有互通宣告 `external`、`= js("code")` 和 `@JsExport` 統一應用更嚴格的型別限制。允許選定的[內建 Kotlin 型別和 `JsAny` 子型別](#type-correspondence)。                                                        | 允許 `external` 宣告中的所有型別。限制 [可在 `@JsExport` 中使用的型別](js-to-kotlin-interop.md#kotlin-types-in-javascript)。                      |
| **Long**                | 型別對應於 JavaScript `BigInt`。                                                                                                                                                                                    | 在 JavaScript 中可見為自訂類別。                                                                                                                     |
| **陣列**                | 尚未直接在互通中支援。您可以改用新的 `JsArray` 型別。                                                                                                                                                                 | 實作為 JavaScript 陣列。                                                                                                                            |
| **其他型別**            | 需要 `JsReference<>` 才能將 Kotlin 物件傳遞給 JavaScript。                                                                                                                                                          | 允許在外部宣告中使用非外部 Kotlin 類別型別。                                                                                                        |
| **異常處理**          | 您可以使用 `JsException` 和 `Throwable` 型別捕獲任何 JavaScript 異常。                                                                                                                                              | 可以使用 `Throwable` 型別捕獲 JavaScript `Error`。它可以使用 `dynamic` 型別捕獲任何 JavaScript 異常。                                            |
| **動態型別**            | 不支援 `dynamic` 型別。請改用 `JsAny`（請參閱下方範例程式碼）。                                                                                                                                                      | 支援 `dynamic` 型別。                                                                                                                               |

> Kotlin/JS 的 [動態型別](dynamic-type.md) 用於與非型別或鬆散型別物件的互通性，在 Kotlin/Wasm 中不受支援。您可以使用 `JsAny` 型別代替 `dynamic` 型別：
>
> ```kotlin
> // Kotlin/JS
> fun processUser(user: dynamic, age: Int) {
>     // ...
>     user.profile.updateAge(age)
>     // ...
> }
>
> // Kotlin/Wasm
> private fun updateUserAge(user: JsAny, age: Int): Unit =
>     js("{ user.profile.updateAge(age); }")
>
> fun processUser(user: JsAny, age: Int) {
>     // ...
>     updateUserAge(user, age)
>     // ...
> }
> ```
>
{style="note"}

## Web 相關瀏覽器 API

[`kotlinx-browser` 函式庫](https://github.com/kotlin/kotlinx-browser) 是一個獨立函式庫，提供 JavaScript 瀏覽器 API，包括：
* 套件 `org.khronos.webgl`：
  * 型別化陣列，例如 `Int8Array`。
  * WebGL 型別。
* 套件 `org.w3c.dom.*`：
  * DOM API 型別。
* 套件 `kotlinx.browser`：
  * DOM API 全域物件，例如 `window` 和 `document`。

若要使用 `kotlinx-browser` 函式庫中的宣告，請將其作為依賴項新增到您專案的建置設定檔中：

```kotlin
val wasmJsMain by getting {
    dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-browser:0.3")
    }
}
```