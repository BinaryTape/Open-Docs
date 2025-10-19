[//]: # (title: 從 JavaScript 使用 Kotlin 程式碼)

根據所選的 [JavaScript 模組](js-modules.md)系統，Kotlin/JS 編譯器會產生不同的輸出。但總體而言，Kotlin 編譯器會產生普通的 JavaScript 類別、函數和屬性，您可以自由地從 JavaScript 程式碼中使用它們。不過，有一些細微之處您應該記住。

## 在 plain 模式下將宣告隔離到獨立的 JavaScript 物件中

如果您明確將模組類型設定為 `plain`，Kotlin 會建立一個物件，其中包含當前模組中的所有 Kotlin 宣告。這樣做是為了防止汙染全域物件。這表示對於模組 `myModule`，所有宣告都可以透過 `myModule` 物件供 JavaScript 使用。例如：

```kotlin
fun foo() = "Hello"
```

這個函數可以像這樣從 JavaScript 呼叫：

```javascript
alert(myModule.foo());
```

當您將 Kotlin 模組編譯為 [UMD](https://github.com/umdjs/umd)（`browser` 和 `nodejs` 目標的預設設定）、[ESM](https://tc39.es/ecma262/#sec-modules)、[CommonJS](https://nodejs.org/api/modules.html#modules-commonjs-modules) 或 [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) 等 JavaScript 模組時，直接像這樣呼叫函數便不適用。在這些情況下，您的宣告會根據所選的 JavaScript 模組系統公開。例如，當使用 UMD、ESM 或 CommonJS 時，您的呼叫點會如下所示：

```javascript
alert(require('myModule').foo());
```

有關 JavaScript 模組系統的更多資訊，請參閱 [JavaScript 模組](js-modules.md)。

## 套件結構

對於大多數模組系統（CommonJS、Plain 和 UMD），Kotlin 會將其套件結構公開給 JavaScript。除非您在根套件中定義您的宣告，否則您必須在 JavaScript 中使用完整合格名稱。例如：

```kotlin
package my.qualified.packagename

fun foo() = "Hello"
```

例如，當使用 UMD 或 CommonJS 時，您的呼叫點可能如下所示：

```javascript
alert(require('myModule').my.qualified.packagename.foo())
```

當使用 `plain` 作為模組系統設定時，呼叫點會是：

```javascript
alert(myModule.my.qualified.packagename.foo());
```

當目標為 ECMAScript Modules (ESM) 時，套件資訊不會被保留，以改善應用程式 bundle 大小並符合 ESM 套件的典型佈局。在這種情況下，使用 ES 模組來使用 Kotlin 宣告的方式如下：

```javascript
import { foo } from 'myModule';

alert(foo());
```

### @JsName 註解

在某些情況下（例如，為了支援多載），Kotlin 編譯器會混淆 JavaScript 程式碼中產生之函數和屬性的名稱。為了控制產生的名稱，您可以使用 `@JsName` 註解：

```kotlin
// Module 'kjs'
class Person(val name: String) {
    fun hello() {
        println("Hello $name!")
    }

    @JsName("helloWithGreeting")
    fun hello(greeting: String) {
        println("$greeting $name!")
    }
}
```

現在您可以以下列方式從 JavaScript 使用此類別：

```javascript
// If necessary, import 'kjs' according to chosen module system
var person = new kjs.Person("Dmitry");   // refers to module 'kjs'
person.hello();                          // prints "Hello Dmitry!"
person.helloWithGreeting("Servus");      // prints "Servus Dmitry!"
```

如果我們沒有指定 `@JsName` 註解，則相應函數的名稱將包含從函數簽章計算出的尾碼，例如 `hello_61zpoe`。

請注意，在某些情況下 Kotlin 編譯器不會應用名稱混淆：
- `external` 宣告不會被混淆。
- 任何繼承自 `external` 類別的非 `external` 類別中被覆寫的函數不會被混淆。

`@JsName` 的參數必須是一個常數字串文字，且為有效的識別符號。如果嘗試將非識別符號字串傳遞給 `@JsName`，編譯器將會報告錯誤。以下範例會產生編譯時錯誤：

```kotlin
@JsName("new C()")   // 此處錯誤
external fun newC()
```

### @JsExport 註解

> 此功能為 [實驗性](components-stability.md#stability-levels-explained)。
> 其設計在未來版本中可能會變更。
>
{style="warning"} 

透過將 `@JsExport` 註解應用於頂層宣告（例如類別或函數），您可以讓 Kotlin 宣告從 JavaScript 中可用。此註解會以 Kotlin 中給定的名稱匯出所有巢狀宣告。它也可以透過使用 `@file:JsExport` 應用於檔案層級。

為了解決匯出中的歧義（例如同名函數的多載），您可以將 `@JsExport` 註解與 `@JsName` 註解一起使用，以指定產生和匯出函數的名稱。

在目前的 [IR 編譯器後端](js-ir-compiler.md)中，`@JsExport` 註解是讓您的函數從 Kotlin 可見的唯一方式。

對於多平台專案，`@JsExport` 也可在通用程式碼中使用。它僅在編譯 JavaScript 目標時生效，並允許您匯出非平台特定的 Kotlin 宣告。

### @JsStatic

> 此功能為 [實驗性](components-stability.md#stability-levels-explained)。它可能隨時被刪除或更改。
> 僅用於評估目的。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-18891/JS-provide-a-way-to-declare-static-members-JsStatic) 上提供關於它的回饋。
>
{style="warning"}

`@JsStatic` 註解指示編譯器為目標宣告產生額外的靜態方法。這有助於您直接在 JavaScript 中使用 Kotlin 程式碼中的靜態成員。

您可以將 `@JsStatic` 註解應用於命名物件中定義的函數，以及在類別和介面中宣告的伴隨物件。如果您使用此註解，編譯器將產生物件的靜態方法和物件本身的實例方法。例如：

```kotlin
// Kotlin
class C {
    companion object {
        @JsStatic
        fun callStatic() {}
        fun callNonStatic() {}
    }
}
```

現在，`callStatic()` 函數在 JavaScript 中是靜態的，而 `callNonStatic()` 函數則不是：

```javascript
// JavaScript
C.callStatic();              // 運作正常，存取靜態函數
C.callNonStatic();           // 錯誤，在產生的 JavaScript 中不是靜態函數
C.Companion.callStatic();    // 實例方法保持不變
C.Companion.callNonStatic(); // 唯一運作方式
```

也可以將 `@JsStatic` 註解應用於物件或伴隨物件的屬性，使其 getter 和 setter 方法成為該物件或包含伴隨物件的類別中的靜態成員。

### 使用 `BigInt` 類型來表示 Kotlin 的 `Long` 類型
<primary-label ref="experimental-general"/>

當編譯至現代 JavaScript (ES2020) 時，Kotlin/JS 使用 JavaScript 內建的 `BigInt` 類型來表示 Kotlin 的 `Long` 值。

為了啟用 `BigInt` 類型的支援，您需要將以下編譯器選項添加到您的 `build.gradle(.kts)` 檔案中：

```kotlin
// build.gradle.kts
kotlin {
    js {
        ...
        compilerOptions {
            freeCompilerArgs.add("-Xes-long-as-bigint")
        }
    }
}
```

此功能為 [實驗性](components-stability.md#stability-levels-explained)。請在我們的議題追蹤器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-57128/KJS-Use-BigInt-to-represent-Long-values-in-ES6-mode) 上分享您的回饋。

#### 在匯出的宣告中使用 `Long`

由於 Kotlin 的 `Long` 類型可以編譯為 JavaScript 的 `BigInt` 類型，Kotlin/JS 支援將 `Long` 值匯出到 JavaScript。

若要啟用此功能：

1. 允許在 Kotlin/JS 中匯出 `Long`。將以下編譯器選項添加到您的 `build.gradle(.kts)` 檔案中的 `freeCompilerArgs` 屬性：

 ```kotlin
// build.gradle.kts
kotlin {
    js {
        ...
        compilerOptions { 
            freeCompilerArgs.add("-XXLanguage:+JsAllowLongInExportedDeclarations")
        }
    }
}
```

2. 啟用 `BigInt` 類型。請參閱 [使用 `BigInt` 類型來表示 Kotlin 的 `Long` 類型](#use-bigint-type-to-represent-kotlin-s-long-type) 中如何啟用它。

## JavaScript 中的 Kotlin 類型

請參閱 Kotlin 類型如何映射到 JavaScript 類型：

| Kotlin                                                           | JavaScript                | 備註                                                                           |
|:-----------------------------------------------------------------|:--------------------------|:-------------------------------------------------------------------------------|
| `Byte`, `Short`, `Int`, `Float`, `Double`                        | `Number`                  |                                                                                |
| `Char`                                                           | `Number`                  | 數字代表字元的程式碼。                                                          |
| `Long`                                                           | `BigInt`                  | 需要配置 [`-Xes-long-as-bigint` 編譯器選項](compiler-reference.md#xes-long-as-bigint)。 |
| `Boolean`                                                        | `Boolean`                 |                                                                                |
| `String`                                                         | `String`                  |                                                                                |
| `Array`                                                          | `Array`                   |                                                                                |
| `ByteArray`                                                      | `Int8Array`               |                                                                                |
| `ShortArray`                                                     | `Int16Array`              |                                                                                |
| `IntArray`                                                       | `Int32Array`              |                                                                                |
| `CharArray`                                                      | `UInt16Array`             | 帶有 `$type$ == "CharArray"` 屬性。                                           |
| `FloatArray`                                                     | `Float32Array`            |                                                                                |
| `DoubleArray`                                                    | `Float64Array`            |                                                                                |
| `LongArray`                                                      | `Array<kotlin.Long>`      | 帶有 `$type$ == "LongArray"` 屬性。另請參閱 Kotlin 的 Long 類型備註。              |
| `BooleanArray`                                                   | `Int8Array`               | 帶有 `$type$ == "BooleanArray"` 屬性。                                         |
| `List`, `MutableList`                                            | `KtList`, `KtMutableList` | 透過 `KtList.asJsReadonlyArrayView` 或 `KtMutableList.asJsArrayView` 公開 `Array`。 |
| `Map`, `MutableMap`                                              | `KtMap`, `KtMutableMap`   | 透過 `KtMap.asJsReadonlyMapView` 或 `KtMutableMap.asJsMapView` 公開 ES2015 `Map`。 |
| `Set`, `MutableSet`                                              | `KtSet`, `KtMutableSet`   | 透過 `KtSet.asJsReadonlySetView` 或 `KtMutableSet.asJsSetView` 公開 ES2015 `Set`。 |
| `Unit`                                                           | Undefined                 | 當用作回傳類型時可匯出，但當用作參數類型時則不可。                                    |
| `Any`                                                            | `Object`                  |                                                                                |
| `Throwable`                                                      | `Error`                   |                                                                                |
| `enum class Type`                                                | `Type`                    | 列舉項目作為靜態類別屬性 (`Type.ENTRY`) 公開。                                 |
| Nullable `Type?`                                                 | `Type | null | undefined` |                                                                                |
| 所有其他 Kotlin 類型，除了標記有 `@JsExport` 的 | Not supported             | 包含 Kotlin 的 [無符號整數類型](unsigned-integer-types.md)。                   |

此外，重要的是要知道：

*   Kotlin 為 `kotlin.Int`、`kotlin.Byte`、`kotlin.Short`、`kotlin.Char` 和 `kotlin.Long` 保留了溢位語義。
*   Kotlin 在執行時無法區分數字類型（`kotlin.Long` 除外），因此以下程式碼有效：

    ```kotlin
    fun f() {
        val x: Int = 23
        val y: Any = x
        println(y as Float)
    }
    ```

*   Kotlin 在 JavaScript 中保留了延遲物件初始化。
*   Kotlin 不在 JavaScript 中實現頂層屬性的延遲初始化。