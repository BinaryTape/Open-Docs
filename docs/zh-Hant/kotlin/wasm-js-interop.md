[//]: # (title: 與 JavaScript 的互通性)

Kotlin/Wasm 允許您在 Kotlin 中使用 JavaScript 程式碼，並在 JavaScript 中使用 Kotlin 程式碼。

與 [Kotlin/JS](js-overview.md) 一樣，Kotlin/Wasm 編譯器也具備與 JavaScript 的互通性。如果您熟悉 Kotlin/JS 的互通性，您會注意到 Kotlin/Wasm 的互通性是相似的。然而，仍有一些關鍵差異需要考量。

> Kotlin/Wasm 處於 [Alpha](components-stability.md) 階段。它可能隨時變更。請在非生產環境情境下使用。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492) 中提供意見回饋。
>
{style="note"}

## 在 Kotlin 中使用 JavaScript 程式碼

了解如何透過使用 `external` 宣告、包含 JavaScript 程式碼片段的函式以及 `@JsModule` 註解，在 Kotlin 中使用 JavaScript 程式碼。

### 外部宣告

外部 JavaScript 程式碼預設在 Kotlin 中不可見。要在 Kotlin 中使用 JavaScript 程式碼，您可以透過 `external` 宣告來描述其 API。

#### JavaScript 函式

請考慮以下 JavaScript 函式：

```javascript
function greet (name) {
    console.log("Hello, " + name + "!");
}
```

您可以在 Kotlin 中將其宣告為一個 `external` 函式：

```kotlin
external fun greet(name: String)
```

外部函式沒有函式主體，您可以將其作為一個常規的 Kotlin 函式呼叫：

```kotlin
fun main() {
    greet("Alice")
}
```

#### JavaScript 屬性

請考慮以下全域 JavaScript 變數：

```javascript
let globalCounter = 0;
```

您可以在 Kotlin 中使用外部 `var` 或 `val` 屬性來宣告它：

```kotlin
external var globalCounter: Int
```

這些屬性是在外部初始化的。這些屬性不能在 Kotlin 程式碼中具有 `= value` 初始器。

#### JavaScript 類別

請考慮以下 JavaScript 類別：

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

您可以在 Kotlin 中將其作為一個外部類別使用：

```kotlin
external class Rectangle(height: Double, width: Double) : JsAny {
    val height: Double
    val width: Double
    fun area(): Double
}
```

`external` 類別內的所有宣告都被隱式地視為外部的。

#### 外部介面

您可以在 Kotlin 中描述 JavaScript 物件的形狀。請考慮以下 JavaScript 函式及其回傳值：

```javascript
function createUser (name, age) {
    return { name: name, age: age };
}
```

請看如何在 Kotlin 中使用 `external interface User` 類型來描述其形狀：

```kotlin
external interface User : JsAny {
    val name: String
    val age: Int
}

external fun createUser(name: String, age: Int): User
```

外部介面不具有執行時類型資訊，僅為編譯時概念。因此，與常規介面相比，外部介面有一些限制：
* 您不能在 `is` 檢查的右側使用它們。
* 您不能在類別常值表達式（例如 `User::class`）中使用它們。
* 您不能將它們作為具體化類型引數傳遞。
* 使用 `as` 轉換到外部介面總是成功。

#### 外部物件

請考慮這些包含物件的 JavaScript 變數：

```javascript
let Counter = {
    value: 0,
    step: 1,
    increment () {
        this.value += this.step;
    }
};
```

您可以在 Kotlin 中將其作為一個外部物件使用：

```kotlin
external object Counter : JsAny {
    fun increment()
    val value: Int
    var step: Int
}
```

#### 外部類型階層

與常規類別和介面類似，您可以宣告外部宣告以擴展其他外部類別並實作外部介面。然而，您不能在同一個類型階層中混用外部和非外部宣告。

### 包含 JavaScript 程式碼的 Kotlin 函式

您可以透過定義一個具有 `= js("code")` 主體的函式，將 JavaScript 片段添加到 Kotlin/Wasm 程式碼中：

```kotlin
fun getCurrentURL(): String =
    js("window.location.href")
```

如果您想執行一段 JavaScript 語句區塊，請用大括號 `{}` 將字串內的程式碼包圍起來：

```kotlin
fun setLocalSettings(value: String): Unit = js(
    """{
        localStorage.setItem('settings', value);
}"""
)
```

如果您想回傳一個物件，請用小括號 `()` 將大括號 `{}` 包圍起來：

```kotlin
fun createJsUser(name: String, age: Int): JsAny =
    js("({ name: name, age: age })")
```

Kotlin/Wasm 以特殊方式處理對 `js()` 函式的呼叫，且其實作有一些限制：
* `js()` 函式呼叫必須提供一個字串常值引數。
* `js()` 函式呼叫必須是函式主體中唯一的表達式。
* `js()` 函式僅允許從套件層級函式中呼叫。
* 函式的回傳類型必須明確提供。
* [類型](#type-correspondence) 受到限制，類似於 `external fun`。

Kotlin 編譯器將程式碼字串放入生成的 JavaScript 檔案中的函式，並將其匯入 WebAssembly 格式。Kotlin 編譯器不驗證這些 JavaScript 片段。如果存在 JavaScript 語法錯誤，則在您執行 JavaScript 程式碼時會報告這些錯誤。

> `@JsFun` 註解具有類似的功能，並且很可能將被棄用。
>
{style="note"}

### JavaScript 模組

預設情況下，外部宣告對應於 JavaScript 全域範圍。如果您使用 [`@JsModule` 註解](js-modules.md#jsmodule-annotation) 對 Kotlin 檔案進行註解，則其中所有外部宣告都將從指定的模組匯入。

請考慮以下 JavaScript 程式碼範例：

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

您可以將 JavaScript 的 `JsArray<T>` 複製到 Kotlin 的原生 `Array` 或 `List` 類型；同樣地，您也可以將這些 Kotlin 類型複製到 `JsArray<T>`。

要將 `JsArray<T>` 轉換為 `Array<T>` 或反之，請使用其中一個可用的 [轉接函式](https://github.com/Kotlin/kotlinx-browser/blob/dfbdceed314567983c98f1d66e8c2e10d99c5a55/src/wasmJsMain/kotlin/arrayCopy.kt)。

以下是泛型類型之間轉換的範例：

```kotlin
val list: List<JsString> =
    listOf("Kotlin", "Wasm").map { it.toJsString() }

// Uses .toJsArray() to convert List or Array to JsArray
val jsArray: JsArray<JsString> = list.toJsArray()

// Uses .toArray() and .toList() to convert it back to Kotlin types 
val kotlinArray: Array<JsString> = jsArray.toArray()
val kotlinList: List<JsString> = jsArray.toList()
```

類似的轉接函式也可用於將類型化陣列轉換為其 Kotlin 等效項（例如，`IntArray` 和 `Int32Array`）。有關詳細資訊和實作，請參閱 [`kotlinx-browser` 儲存庫]( https://github.com/Kotlin/kotlinx-browser/blob/dfbdceed314567983c98f1d66e8c2e10d99c5a55/src/wasmJsMain/kotlin/arrayCopy.kt)。

以下是類型化陣列之間轉換的範例：

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

### 帶有 @JsExport 註解的函式

要使 Kotlin/Wasm 函式可供 JavaScript 程式碼使用，請使用 `@JsExport` 註解：

```kotlin
// Kotlin/Wasm

@JsExport
fun addOne(x: Int): Int = x + 1
```

標記有 `@JsExport` 註解的 Kotlin/Wasm 函式，會以生成的 `.mjs` 模組的 `default` 匯出屬性形式可見。然後您可以在 JavaScript 中使用此函式：

```javascript
// JavaScript

import exports from "./module.mjs"

exports.addOne(10)
```

Kotlin/Wasm 編譯器能夠從您的 Kotlin 程式碼中的任何 `@JsExport` 宣告生成 TypeScript 定義。這些定義可供 IDE 和 JavaScript 工具使用，以提供程式碼自動補齊、協助類型檢查，並使得從 JavaScript 和 TypeScript 中使用 Kotlin 程式碼變得更容易。

Kotlin/Wasm 編譯器會收集任何標記有 `@JsExport` 註解的頂層函式，並自動在 `.d.ts` 檔案中生成 TypeScript 定義。

要生成 TypeScript 定義，請在您的 `build.gradle.kts` 檔案的 `wasmJs{}` 區塊中，添加 `generateTypeScriptDefinitions()` 函式：

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

> 在 Kotlin/Wasm 中生成 TypeScript 宣告檔案是 [實驗性](components-stability.md#stability-levels-explained) 功能。它可能隨時被移除或更改。
>
{style="warning"}

## 類型對應

Kotlin/Wasm 僅允許在 JavaScript 互通宣告的簽章中使用特定類型。這些限制均勻地適用於帶有 `external`、`= js("code")` 或 `@JsExport` 的宣告。

請看 Kotlin 類型如何對應到 JavaScript 類型：

| Kotlin                                                     | JavaScript                        |
|------------------------------------------------------------|-----------------------------------|
| `Byte`、`Short`、`Int`、`Char`、`UByte`、`UShort`、`UInt`、 | `Number`                          |
| `Float`、`Double`、                                         | `Number`                          |
| `Long`、`ULong`、                                           | `BigInt`                          |
| `Boolean`、                                                 | `Boolean`                         |
| `String`、                                                  | `String`                          |
| 回傳位置的 `Unit`                                          | `undefined`                       |
| 函式類型，例如 `(String) -> Int`                           | Function                          |
| `JsAny` 及其子類型                                         | 任何 JavaScript 值                |
| `JsReference`                                              | 對 Kotlin 物件的不透明參考        |
| 其他類型                                                   | 不支援                            |

您也可以使用這些類型的可空版本。

### JsAny 類型

JavaScript 值在 Kotlin 中使用 `JsAny` 類型及其子類型表示。

Kotlin/Wasm 標準函式庫提供了其中一些類型的表示：
* 套件 `kotlin.js`：
    * `JsAny`
    * `JsBoolean`、`JsNumber`、`JsString`
    * `JsArray`
    * `Promise`

您也可以透過宣告 `external` 介面或類別來創建自訂的 `JsAny` 子類型。

### JsReference 類型

Kotlin 值可以使用 `JsReference` 類型作為不透明參考傳遞給 JavaScript。

例如，如果您想將此 Kotlin 類別 `User` 暴露給 JavaScript：

```kotlin
class User(var name: String)
```

您可以使用 `toJsReference()` 函式來創建 `JsReference<User>` 並將其回傳給 JavaScript：

```kotlin
@JsExport
fun createUser(name: String): JsReference<User> {
    return User(name).toJsReference()
}
```

這些參考在 JavaScript 中無法直接使用，其行為類似於空的凍結 JavaScript 物件。要操作這些物件，您需要使用 `get()` 方法將參考值解包，並向 JavaScript 匯出更多函式：

```kotlin
@JsExport
fun setUserName(user: JsReference<User>, name: String) {
    user.get().name = name
}
```

您可以從 JavaScript 建立一個類別並更改其名稱：

```javascript
import UserLib from "./userlib.mjs"

let user = UserLib.createUser("Bob");
UserLib.setUserName(user, "Alice");
```

### 類型參數

如果 JavaScript 互通宣告的類型參數具有 `JsAny` 或其子類型上限，則這些宣告可以包含類型參數。例如：

```kotlin
external fun <T : JsAny> processData(data: JsArray<T>): T
```

## 異常處理

您可以使用 Kotlin 的 `try-catch` 表達式來捕獲 JavaScript 異常。然而，預設情況下無法在 Kotlin/Wasm 中存取關於拋出值的具體細節。

您可以配置 `JsException` 類型以包含來自 JavaScript 的原始錯誤訊息和堆疊追蹤。為此，請將以下編譯器選項添加到您的 `build.gradle.kts` 檔案中：

```kotlin
kotlin {
    wasmJs {
        compilerOptions {
            freeCompilerArgs.add("-Xwasm-attach-js-exception")
        }
    }
}
```

此行為取決於 `WebAssembly.JSTag` API，該 API 僅在特定瀏覽器中可用：

*   **Chrome：** 從版本 115 開始支援
*   **Firefox：** 從版本 129 開始支援
*   **Safari：** 尚未支援

以下是一個展示此行為的範例：

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

啟用 `-Xwasm-attach-js-exception` 編譯器選項後，`JsException` 類型會提供 JavaScript 錯誤的具體細節。如果未啟用此編譯器選項，`JsException` 將僅包含一個通用訊息，說明在執行 JavaScript 程式碼時拋出了異常。

如果您嘗試使用 JavaScript 的 `try-catch` 表達式來捕獲 Kotlin/Wasm 異常，它將看起來像一個通用的 `WebAssembly.Exception`，且無法直接存取訊息和資料。

## Kotlin/Wasm 與 Kotlin/JS 互通性差異

儘管 Kotlin/Wasm 互通性與 Kotlin/JS 互通性有相似之處，但仍有一些關鍵差異需要考量：

|                         | **Kotlin/Wasm**                                                                                                                                                                                                     | **Kotlin/JS**                                                                                                                                       |
|-------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| **外部列舉**            | 不支援外部列舉類別。                                                                                                                                                                                                  | 支援外部列舉類別。                                                                                                                                  |
| **類型擴展**            | 不支援非外部類型擴展外部類型。                                                                                                                                                                                        | 支援非外部類型。                                                                                                                                    |
| **`@JsName` 註解**      | 僅在註解外部宣告時生效。                                                                                                                                                                                              | 可用於更改常規非外部宣告的名稱。                                                                                                                    |
| **`js()` 函式**         | `js("code")` 函式呼叫被允許作為套件層級函式的單一表達式主體。                                                                                                                                                        | `js("code")` 函式可以在任何上下文（context）中呼叫，並回傳 `dynamic` 值。                                                                           |
| **模組系統**            | 僅支援 ES 模組。沒有 `@JsNonModule` 註解的類比。將其匯出作為 `default` 物件的屬性提供。僅允許匯出套件層級函式。                                                                                                          | 支援 ES 模組和傳統模組系統。提供具名 ESM 匯出。允許匯出類別和物件。                                                                                 |
| **類型**                | 對所有互通宣告 `external`、`= js("code")` 和 `@JsExport` 統一應用更嚴格的類型限制。僅允許選定數量的 [內建 Kotlin 類型和 `JsAny` 子類型](#type-correspondence)。 | 允許 `external` 宣告中使用所有類型。限制了 [可在 `@JsExport` 中使用的類型](js-to-kotlin-interop.md#kotlin-types-in-javascript)。             |
| **Long**                | 類型對應於 JavaScript 的 `BigInt`。                                                                                                                                                                                   | 在 JavaScript 中顯示為自訂類別。                                                                                                                    |
| **陣列**                | 尚未直接支援互通。您可以改用新的 `JsArray` 類型。                                                                                                                                                                     | 實作為 JavaScript 陣列。                                                                                                                            |
| **其他類型**            | 需要 `JsReference<>` 才能將 Kotlin 物件傳遞給 JavaScript。                                                                                                                                                            | 允許在外部宣告中使用非外部 Kotlin 類別類型。                                                                                                        |
| **異常處理**            | 您可以使用 `JsException` 和 `Throwable` 類型捕獲任何 JavaScript 異常。                                                                                                                                              | 可以使用 `Throwable` 類型捕獲 JavaScript `Error`。可以使用 `dynamic` 類型捕獲任何 JavaScript 異常。                                                 |
| **動態類型**            | 不支援 `dynamic` 類型。請改用 `JsAny`（參見下方範例程式碼）。                                                                                                                                                         | 支援 `dynamic` 類型。                                                                                                                               |

> Kotlin/Wasm 不支援用於與未類型化或鬆散類型化物件互通的 Kotlin/JS [動態類型](dynamic-type.md)。您可以使用 `JsAny` 類型代替 `dynamic` 類型：
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

## 網路相關瀏覽器 API

[`kotlinx-browser` 函式庫](https://github.com/kotlin/kotlinx-browser) 是一個獨立函式庫，提供 JavaScript 瀏覽器 API，包括：
* 套件 `org.khronos.webgl`：
  * 類型化陣列，例如 `Int8Array`。
  * WebGL 類型。
* 套件 `org.w3c.dom.*`：
  * DOM API 類型。
* 套件 `kotlinx.browser`：
  * DOM API 全域物件，例如 `window` 和 `document`。

要使用 `kotlinx-browser` 函式庫中的宣告，請將其作為依賴項添加到您專案的建構配置檔案中：

```kotlin
val wasmJsMain by getting {
    dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-browser:0.3")
    }
}
```