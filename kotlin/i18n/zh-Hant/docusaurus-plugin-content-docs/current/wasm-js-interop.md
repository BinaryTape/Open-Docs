---
title: "與 JavaScript 的互通性"
---
Kotlin/Wasm 允許您在 Kotlin 中使用 JavaScript 代碼，並在 JavaScript 中使用 Kotlin 代碼。

與 [Kotlin/JS](js-overview) 類似，Kotlin/Wasm 編譯器也具有與 JavaScript 的互通性（Interoperability）。如果您熟悉 Kotlin/JS 的互通性，您會注意到 Kotlin/Wasm 的互通性與之相似。但是，有一些關鍵差異需要考慮。

:::note
Kotlin/Wasm 處於 [Alpha](components-stability) 階段。它可能隨時更改。請在正式環境前使用它。我們感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492) 中的回饋。

:::

## 在 Kotlin 中使用 JavaScript 代碼

了解如何透過使用 `external` 宣告、帶有 JavaScript 代碼片段的函數和 `@JsModule` 註解，在 Kotlin 中使用 JavaScript 代碼。

### External 宣告

預設情況下，外部 JavaScript 代碼在 Kotlin 中是不可見的。
要在 Kotlin 中使用 JavaScript 代碼，您可以使用 `external` 宣告來描述其 API。

#### JavaScript 函數

考慮以下 JavaScript 函數：

```javascript
function greet (name) {
    console.log("Hello, " + name + "!");
}
```

您可以在 Kotlin 中將其宣告為 `external` 函數：

```kotlin
external fun greet(name: String)
```

External 函數沒有主體，您可以像調用常規 Kotlin 函數一樣調用它：

```kotlin
fun main() {
    greet("Alice")
}
```

#### JavaScript 屬性

考慮以下全域 JavaScript 變數：

```javascript
let globalCounter = 0;
```

您可以使用 external `var` 或 `val` 屬性在 Kotlin 中宣告它：

```kotlin
external var globalCounter: Int
```

這些屬性是在外部初始化的。這些屬性在 Kotlin 代碼中不能有 `= value` 初始化器（initializer）。

#### JavaScript 類別（Class）

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

您可以在 Kotlin 中將其用作 external 類別：

```kotlin
external class Rectangle(height: Double, width: Double) : JsAny {
    val height: Double
    val width: Double
    fun area(): Double
}
```

`external` 類別中的所有宣告都隱式地被視為 external。

#### External 介面（Interface）

您可以在 Kotlin 中描述 JavaScript 物件的形狀。考慮以下 JavaScript 函數及其返回值：

```javascript
function createUser (name, age) {
    return { name: name, age: age };
}
```

查看如何在 Kotlin 中使用 `external interface User` 類型描述其形狀：

```kotlin
external interface User : JsAny {
    val name: String
    val age: Int
}

external fun createUser(name: String, age: Int): User
```

External 介面沒有運行時類型訊息，並且僅是編譯時概念。
因此，與常規介面相比，external 介面有一些限制：
* 您不能在 `is` 檢查的右側使用它們。
* 您不能在類別字面量表達式（Class literal expression）（例如 `User::class`）中使用它們。
* 您不能將它們作為具體化的類型參數（Reified type argument）傳遞。
* 使用 `as` 轉換為 external 介面始終成功。

#### External 物件

考慮以下 JavaScript 變數，它們持有一個物件：

```javascript
let Counter = {
    value: 0,
    step: 1,
    increment () {
        this.value += this.step;
    }
};
```

您可以在 Kotlin 中將它們用作 external 物件：

```kotlin
external object Counter : JsAny {
    fun increment()
    val value: Int
    var step: Int
}
```

#### External 類型層級（Type Hierarchy）

與常規類別和介面類似，您可以宣告 external 宣告來擴展其他 external 類別並實現 external 介面。
但是，您不能在同一類型層級中混合 external 和非 external 宣告。

### 具有 JavaScript 代碼的 Kotlin 函數

您可以透過定義一個帶有 `= js("code")` 主體的函數，將 JavaScript 片段新增到 Kotlin/Wasm 代碼中：

```kotlin
fun getCurrentURL(): String =
    js("window.location.href")
```

如果要運行一個 JavaScript 語句塊，請將您的代碼用花括號 `{}` 括起來：

```kotlin
fun setLocalSettings(value: String): Unit = js(
    """{
        localStorage.setItem('settings', value);
}"""
)
```

如果要返回一個物件，請用圓括號 `()` 括住花括號 `{}`：

```kotlin
fun createJsUser(name: String, age: Int): JsAny =
    js("({ name: name, age: age })")
```

Kotlin/Wasm 以特殊的方式處理對 `js()` 函數的調用，並且該實現有一些限制：
* `js()` 函數調用必須提供一個字串字面量參數。
* `js()` 函數調用必須是函數主體中唯一的表達式。
* `js()` 函數僅允許從套件級別（Package-level）函數調用。
* [類型](#type-correspondence)受到限制，類似於 `external fun`。

Kotlin 編譯器將代碼字串放入生成的 JavaScript 檔案中的一個函數中，並將其匯入 WebAssembly 格式。
Kotlin 編譯器不驗證這些 JavaScript 片段。
如果存在 JavaScript 語法錯誤，則在運行 JavaScript 代碼時會報告這些錯誤。

:::note
`@JsFun` 註解具有類似的功能，並且可能會被棄用。

:::

### JavaScript 模組（Module）

預設情況下，external 宣告對應於 JavaScript 全域作用域。如果使用
[`@JsModule` 註解](js-modules#jsmodule-annotation)註解 Kotlin 檔案，則其中的所有 external 宣告都將從指定的模組匯入。

考慮以下 JavaScript 代碼範例：

```javascript
// users.mjs
export let maxUsers = 10;

export class User {
    constructor (username) {
        this.username = username;
    }
}
```

使用 `@JsModule` 註解在 Kotlin 中使用此 JavaScript 代碼：

```kotlin
// Kotlin
@file:JsModule("./users.mjs")

external val maxUsers: Int

external class User : JsAny {
    constructor(username: String)

    val username: String
}
```

### 陣列（Array）互通性

您可以將 JavaScript 的 `JsArray<T>` 複製到 Kotlin 的原生 `Array` 或 `List` 類型中；同樣，
您可以將這些 Kotlin 類型複製到 `JsArray<T>`。

要將 `JsArray<T>` 轉換為 `Array<T>` 或反之，請使用可用的 [adapter 函數](https://github.com/Kotlin/kotlinx-browser/blob/dfbdceed314567983c98f1d66e8c2e10d99c5a55/src/wasmJsMain/kotlin/arrayCopy.kt)之一。

以下是一個在泛型類型之間轉換的範例：

```kotlin
val list: List<JsString> =
    listOf("Kotlin", "Wasm").map { it.toJsString() }

// 使用 .toJsArray() 將 List 或 Array 轉換為 JsArray
val jsArray: JsArray<JsString> = list.toJsArray()

// 使用 .toArray() 和 .toList() 將其轉換回 Kotlin 類型
val kotlinArray: Array<JsString> = jsArray.toArray()
val kotlinList: List<JsString> = jsArray.toList()
```

類似的 adapter 函數可用於將類型化的陣列（Typed array）轉換為它們的 Kotlin 等效項
（例如，`IntArray` 和 `Int32Array`）。有關詳細訊息和實現，
請參閱 [`kotlinx-browser` 儲存庫]( https://github.com/Kotlin/kotlinx-browser/blob/dfbdceed314567983c98f1d66e8c2e10d99c5a55/src/wasmJsMain/kotlin/arrayCopy.kt)。

以下是一個在類型化的陣列之間轉換的範例：

```kotlin
import org.khronos.webgl.*

    // ...

    val intArray: IntArray = intArrayOf(1, 2, 3)
    
    // 使用 .toInt32Array() 將 Kotlin IntArray 轉換為 JavaScript Int32Array
    val jsInt32Array: Int32Array = intArray.toInt32Array()
    
    // 使用 toIntArray() 將 JavaScript Int32Array 轉換回 Kotlin IntArray
    val kotlnIntArray: IntArray = jsInt32Array.toIntArray()
```

## 在 JavaScript 中使用 Kotlin 代碼

了解如何透過使用 `@JsExport` 註解在 JavaScript 中使用您的 Kotlin 代碼。

### 帶有 @JsExport 註解的函數

要使 Kotlin/Wasm 函數對 JavaScript 代碼可用，請使用 `@JsExport` 註解：

```kotlin
// Kotlin/Wasm

@JsExport
fun addOne(x: Int): Int = x + 1
```

標記有 `@JsExport` 註解的 Kotlin/Wasm 函數在生成的 `.mjs` 模組的 `default` 匯出（Export）上可見為屬性。
然後，您可以在 JavaScript 中使用此函數：

```javascript
// JavaScript

import exports from "./module.mjs"

exports.addOne(10)
```

Kotlin/Wasm 編譯器能夠從 Kotlin 代碼中的任何 `@JsExport` 宣告生成 TypeScript 定義。
這些定義可供 IDE 和 JavaScript 工具使用，以提供代碼自動完成、幫助進行類型檢查，並使從 JavaScript 和 TypeScript 使用 Kotlin 代碼更容易。

Kotlin/Wasm 編譯器收集標記有 `@JsExport` 註解的任何頂層函數，並在 `.d.ts` 檔案中自動生成 TypeScript 定義。

要生成 TypeScript 定義，請在 `build.gradle.kts` 檔案中的 `wasmJs{}` 塊中，新增 `generateTypeScriptDefinitions()` 函數：

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

:::note
在 Kotlin/Wasm 中生成 TypeScript 宣告檔案是 [實驗性的（Experimental）](components-stability#stability-levels-explained)。
它可能隨時被刪除或更改。

## 類型對應（Type Correspondence）

Kotlin/Wasm 僅允許在 JavaScript 互通性（Interop）宣告的簽章中使用某些類型。
這些限制統一應用於帶有 `external`、`= js("code")` 或 `@JsExport` 的宣告。

查看 Kotlin 類型如何對應於 Javascript 類型：

| Kotlin                                                     | JavaScript                        |
|------------------------------------------------------------|-----------------------------------|
| `Byte`, `Short`, `Int`, `Char`, `UByte`, `UShort`, `UInt`, | `Number`                          |
| `Float`, `Double`,                                         | `Number`                          |
| `Long`, `ULong`,                                           | `BigInt`                          |
| `Boolean`,                                                 | `Boolean`                         |
| `String`,                                                  | `String`                          |
| 處於返回位置的 `Unit`                                  | `undefined`                       |
| 函數類型，例如 `(String) `->` Int`               | Function                          |
| `JsAny` 及其子類型                                       | 任何 JavaScript 值              |
| `JsReference`                                              | 指向 Kotlin 物件的不透明引用 |
| 其他類型                                                | 不支援                     |

您也可以使用這些類型的可空版本。

### JsAny 類型

JavaScript 值在 Kotlin 中使用 `JsAny` 類型及其子類型表示。

Kotlin/Wasm 標準庫為其中一些類型提供了表示：
* 套件 `kotlin.js`:
    * `JsAny`
    * `JsBoolean`, `JsNumber`, `JsString`
    * `JsArray`
    * `Promise`

您還可以透過宣告 `external` 介面或類別來建立自定義 `JsAny` 子類型。

### JsReference 類型

Kotlin 值可以使用 `JsReference` 類型作為不透明引用傳遞給 JavaScript。

例如，如果您想將此 Kotlin 類別 `User` 暴露給 JavaScript：

```kotlin
class User(var name: String)
```

您可以使用 `toJsReference()` 函數建立 `JsReference<User>` 並將其返回給 JavaScript：

```kotlin
@JsExport
fun createUser(name: String): JsReference<User> {
    return User(name).toJsReference()
}
```

這些引用在 JavaScript 中不可直接使用，並且表現得像空的凍結 JavaScript 物件。
要對這些物件進行操作，您需要使用 `get()` 方法向 JavaScript 匯出更多函數，在其中解包引用值：

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

### 類型參數（Type Parameter）

如果 JavaScript 互通性宣告具有 `JsAny` 或其子類型的上限，則它們可以具有類型參數。例如：

```kotlin
external fun <T : JsAny> processData(data: JsArray<T>): T
```

## 異常處理（Exception Handling）

您可以使用 Kotlin `try-catch` 表達式來捕獲 JavaScript 異常。
但是，預設情況下無法在 Kotlin/Wasm 中訪問有關拋出值的特定詳細訊息。

您可以配置 `JsException` 類型以包含來自 JavaScript 的原始錯誤訊息和堆疊追蹤（Stack trace）。
為此，請將以下編譯器選項新增到您的 `build.gradle.kts` 檔案：

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

* **Chrome:** 從版本 115 開始支援
* **Firefox:** 從版本 129 開始支援
* **Safari:** 尚未支援

以下範例示範了此行為：

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

        // 打印完整的 JavaScript 堆疊追蹤
        e.printStackTrace()
    }
}
```

啟用 `-Xwasm-attach-js-exception` 編譯器選項後，`JsException` 類型會提供來自 JavaScript 錯誤的特定詳細訊息。
如果不啟用此編譯器選項，`JsException` 僅包含一條通用訊息，指出在運行 JavaScript 代碼時拋出了異常。

如果您嘗試使用 JavaScript `try-catch` 表達式來捕獲 Kotlin/Wasm 異常，它看起來像一個
通用的 `WebAssembly.Exception`，沒有可直接訪問的訊息和數據。

## Kotlin/Wasm 和 Kotlin/JS 互通性的差異

<a name="differences"/>

雖然 Kotlin/Wasm 互通性與 Kotlin/JS 互通性有相似之處，但有一些關鍵差異需要考慮：

|                         | **Kotlin/Wasm**                                                                                                                                                                                                     | **Kotlin/JS**                                                                                                                                       |
|-------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| **External 列舉（Enum）**      | 不支援 external 列舉類別。                                                                                                                                                                                    | 支援 external 列舉類別。                                                                                                                    |
| **類型擴展（Type Extension）**     | 不支援非 external 類型擴展 external 類型。                                                                                                                                                              | 支援非 external 類型。                                                                                                                      |
| **`JsName` 註解** | 僅在註解 external 宣告時有效。                                                                                                                                                                                          | 可用於更改常規非 external 宣告的名稱。                                                                                                                 |
| **`js()` 函數**       | 允許 `js("code")` 函數調用作為套件級別函數的單個表達式主體。                                                                                                                                                           | `js("code")` 函數可以在任何上下文中調用，並返回一個 `dynamic` 值。                                                                              |
| **模組系統（Module System）**      | 僅支援 ES 模組。沒有 `@JsNonModule` 註解的類似物。將其匯出作為 `default` 物件上的屬性提供。僅允許匯出套件級別函數。                                                                                         | 支援 ES 模組和傳統模組系統。提供具名的 ESM 匯出。允許匯出類別和物件。                                                                                 |
| **類型**               | 將更嚴格的類型限制統一應用於所有互通性宣告 `external`、`= js("code")` 和 `@JsExport`。允許選擇數量的 [內置 Kotlin 類型和 `JsAny` 子類型](#type-correspondence)。 | 允許 `external` 宣告中的所有類型。限制 [可在 `@JsExport` 中使用的類型](js-to-kotlin-interop#kotlin-types-in-javascript)。 |
| **Long**                | 類型對應於 JavaScript `BigInt`。                                                                                                                                                                                    | 在 JavaScript 中可見為自定義類別。                                                                                                              |
| **陣列**              | 尚未直接在互通性中支援。您可以改為使用新的 `JsArray` 類型。                                                                                                                                                              | 實現為 JavaScript 陣列。                                                                                                                 |
| **其他類型**         | 需要 `JsReference<>` 才能將 Kotlin 物件傳遞給 JavaScript。                                                                                                                                                            | 允許在 external 宣告中使用非 external Kotlin 類別類型。                                                                                       |
| **異常處理**  | 您可以使用 `JsException` 和 `Throwable` 類型捕獲任何 JavaScript 異常。                                                                                                                                     | 可以使用 `Throwable` 類型捕獲 JavaScript `Error`。它可以使用 `dynamic` 類型捕獲任何 JavaScript 異常。                                  |
| **Dynamic 類型**       | 不支援 `dynamic` 類型。請改用 `JsAny` (請參閱下面的代碼範例)。                                                                                                                                                  | 支援 `dynamic` 類型。                                                                                                                        |

Kotlin/JS [dynamic 類型](dynamic-type) 用於與無類型或鬆散類型物件的互通性，在 Kotlin/Wasm 中不受支援。您可以改為使用 `JsAny` 類型，而不是 `dynamic` 類型：

```kotlin
// Kotlin/JS
fun processUser(user: dynamic, age: Int) {
    // ...
    user.profile.updateAge(age)
    // ...
}

// Kotlin/Wasm
private fun updateUserAge(user: JsAny, age: Int): Unit =
    js("{ user.profile.updateAge(age); }")

fun processUser(user: JsAny, age: Int) {
    // ...
    updateUserAge(user, age)
    // ...
}
```

:::

## Web 相關的瀏覽器 API

[`kotlinx-browser` 函式庫](https://github.com/kotlin/kotlinx-browser) 是一個獨立的
函式庫，提供 JavaScript 瀏覽器 API，包括：
* 套件 `org.khronos.webgl`:
  * 類型化的陣列，如 `Int8Array`。
  * WebGL 類型。
* 套件 `org.w3c.dom.*`:
  * DOM API 類型。
* 套件 `kotlinx.browser`:
  * DOM API 全域物件，如 `window` 和 `document`。

要使用 `kotlinx-browser` 函式庫中的宣告，請將其作為依賴項新增到您的
專案的建置配置檔案中：

```kotlin
val wasmJsMain by getting {
    dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-browser:0.3")
    }
}
```