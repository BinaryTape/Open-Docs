[//]: # (title: 從 JavaScript 使用 Kotlin 程式碼)

根據所選的 [JavaScript 模組](js-modules.md)系統，Kotlin/JS 編譯器會產生不同的輸出。
但一般而言，Kotlin 編譯器會產生正常的 JavaScript 類別、函式和屬性，您可以從 JavaScript 程式碼中自由地
使用它們。不過，有一些細微之處需要記住。

## 在 plain 模式下將宣告隔離在個別的 JavaScript 物件中

如果您明確將模組種類設定為 `plain`，Kotlin 會建立一個包含來自目前模組之所有 Kotlin 宣告的物件。
這樣做是為了防止污染全域物件。這意味著對於模組 `myModule`，
所有宣告都可以透過 `myModule` 物件在 JavaScript 中使用。例如：

```kotlin
fun foo() = "Hello"
```

此函式可以像這樣從 JavaScript 呼叫：

```javascript
alert(myModule.foo());
```

當您將 Kotlin 模組編譯為 JavaScript 模組（如 [UMD](https://github.com/umdjs/umd)（`browser` 和 `nodejs` 目標的預設設定）、[ESM](https://tc39.es/ecma262/#sec-modules)、[CommonJS](https://nodejs.org/api/modules.html#modules-commonjs-modules) 或 [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD)）時，像這樣直接呼叫函式並不適用。
在這些情況下，您的宣告會根據所選的 JavaScript 模組系統進行公開。
例如，當使用 UMD、ESM 或 CommonJS 時，您的呼叫點看起來會像這樣：

```javascript
alert(require('myModule').foo());
```

有關 JavaScript 模組系統的更多資訊，請參閱 [JavaScript 模組](js-modules.md)。

## 套件結構

對於大多數模組系統（CommonJS、Plain 和 UMD），Kotlin 會將其套件結構暴露給 JavaScript。
除非您在根套件中定義宣告，否則必須在 JavaScript 中使用完整限定名稱。
例如：

```kotlin
package my.qualified.packagename

fun foo() = "Hello"
```

例如，當使用 UMD 或 CommonJS 時，您的呼叫點可能如下所示：

```javascript
alert(require('myModule').my.qualified.packagename.foo())
```

當使用 `plain` 作為模組系統設定時，呼叫點將是：

```javascript
alert(myModule.my.qualified.packagename.foo());
```

當目標為 ECMAScript 模組 (ESM) 時，為了提高應用程式套件 (bundle) 大小並符合 ESM 套件的典型佈局，不會保留套件資訊。
在這種情況下，使用 ES 模組取用 Kotlin 宣告的方式如下：

```javascript
import { foo } from 'myModule';

alert(foo());
```

### @JsName 註解

在某些情況下（例如，為了支援多載），Kotlin 編譯器會對 JavaScript 程式碼中產生的函式和屬性名稱進行名稱重整 (mangling)。
要控制產生的名稱，您可以使用 `@JsName` 註解：

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

現在您可以按以下方式從 JavaScript 使用此類別：

```javascript
// 必要時，根據所選的模組系統匯入 'kjs'
var person = new kjs.Person("Dmitry");   // 參照模組 'kjs'
person.hello();                          // 印出 "Hello Dmitry!"
person.helloWithGreeting("Servus");      // 印出 "Servus Dmitry!"
```

如果我們沒有指定 `@JsName` 註解，對應函式的名稱將包含一個根據函式簽章計算出的後綴，例如 `hello_61zpoe`。

請注意，在某些情況下 Kotlin 編譯器不會套用名稱重整：
- `external` 宣告不會被重整。
- 繼承自 `external` 類別的非 `external` 類別中的任何覆寫函式都不會被重整。

`@JsName` 的參數必須是常數字串常值，且該常值必須是有效的識別符號。
任何嘗試將非識別符號字串傳遞給 `@JsName` 的行為，編譯器都會報錯。
以下範例會產生編譯期錯誤：

```kotlin
@JsName("new C()")   // 這裡會出錯
external fun newC()
```

### @JsExport 註解

> 此功能為 [實驗性](components-stability.md#stability-levels-explained)。
> 其設計可能會在未來版本中發生變化。
>
{style="warning"} 

透過將 `@JsExport` 註解套用至頂層宣告（如類別或函式），您可以讓該 Kotlin 宣告在 JavaScript 中可用。
此註解會匯出所有具有 Kotlin 中指定名稱的巢狀宣告。
它也可以使用 `@file:JsExport` 套用於檔案層級。

要解決匯出中的歧義（例如同名函式的多載），您可以將 `@JsExport` 註解與 `@JsName` 結合使用，以指定所產生和匯出之函式的名稱。

目前，`@JsExport` 註解是使您的函式從 Kotlin 中可見的唯一方法。

對於多平台專案，`@JsExport` 也可以在通用程式碼中使用。它僅在針對 JavaScript 目標進行編譯時生效，並允許您同時匯出非平台特定的 Kotlin 宣告。

### @JsStatic

> 此功能為 [實驗性](components-stability.md#stability-levels-explained)。它可能隨時被刪除或更改。
> 僅將其用於評估目的。我們非常歡迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-18891/JS-provide-a-way-to-declare-static-members-JsStatic) 上提供回饋。
>
{style="warning"}

`@JsStatic` 註解指示編譯器為目標宣告產生額外的靜態方法。
這有助於您直接在 JavaScript 中使用 Kotlin 程式碼中的靜態成員。

您可以將 `@JsStatic` 註解套用至在命名物件中定義的函式，以及在類別和介面內宣告的伴隨物件。
如果您使用此註解，編譯器將同時產生該物件的靜態方法以及物件本身的執行個體方法。例如：

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

現在，`callStatic()` 函式在 JavaScript 中是靜態的，而 `callNonStatic()` 函式則不是：

```javascript
// JavaScript
C.callStatic();              // 有效，存取靜態函式
C.callNonStatic();           // 錯誤，在產生的 JavaScript 中不是靜態函式
C.Companion.callStatic();    // 執行個體方法仍然存在
C.Companion.callNonStatic(); // 這是它能運作的唯一方式
```

也可以將 `@JsStatic` 註解套用至物件或伴隨物件的屬性，使其取得方法 (getter) 和設定方法 (setter) 成為該物件或包含伴隨物件之類別中的靜態成員。

### 使用 `BigInt` 型別來表示 Kotlin 的 `Long` 型別
<primary-label ref="experimental-general"/>

當編譯為現代 JavaScript (ES2020) 時，Kotlin/JS 使用 JavaScript 內建的 `BigInt` 型別來表示 Kotlin 的 `Long` 值。

要啟用對 `BigInt` 型別的支援，您需要將以下編譯器選項新增到您的 `build.gradle(.kts)` 檔案中：

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

此功能為 [實驗性](components-stability.md#stability-levels-explained)。請在我們的問題追蹤器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-57128/KJS-Use-BigInt-to-represent-Long-values-in-ES6-mode) 中分享您的回饋。

#### 在匯出的宣告中使用 `Long`

由於 Kotlin 的 `Long` 型別可以編譯為 JavaScript 的 `BigInt` 型別，因此 Kotlin/JS 支援將 `Long` 值匯出到 JavaScript。

要啟用此功能：

1. 允許在 Kotlin/JS 中匯出 `Long`。將以下編譯器選項新增到 `build.gradle(.kts)` 檔案中的 `freeCompilerArgs` 屬性：

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

2. 啟用 `BigInt` 型別。請參閱[使用 `BigInt` 型別來表示 Kotlin 的 `Long` 型別](#use-bigint-type-to-represent-kotlin-s-long-type)以了解如何啟用它。

### 使用 `BigInt64Array` 型別來表示 Kotlin 的 `LongArray` 型別
<primary-label ref="experimental-general"/>

當編譯為 JavaScript 時，Kotlin/JS 可以使用 JavaScript 內建的 `BigInt64Array` 型別來表示 Kotlin 的 `LongArray` 值。

要啟用對 `BigInt64Array` 型別的支援，請將以下編譯器選項新增到您的 `build.gradle(.kts)` 檔案中：

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

此功能為 [實驗性](components-stability.md#stability-levels-explained)。請在我們的問題追蹤器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-79284/Use-BigInt64Array-for-LongArray) 中分享您的回饋。

## JavaScript 中的 Kotlin 型別

了解 Kotlin 型別如何對應到 JavaScript 型別：

| Kotlin                                                           | JavaScript                | 說明                                                                                                |
|------------------------------------------------------------------|---------------------------|---------------------------------------------------------------------------------------------------------|
| `Byte`, `Short`, `Int`, `Float`, `Double`                        | `Number`                  |                                                                                                         |
| `Char`                                                           | `Number`                  | 該數字代表字元的代碼。                                                             |
| `Long`                                                           | `BigInt`                  | 需要配置 [`-Xes-long-as-bigint` 編譯器選項](compiler-reference.md#xes-long-as-bigint)。 |
| `Boolean`                                                        | `Boolean`                 |                                                                                                         |
| `String`                                                         | `String`                  |                                                                                                         |
| `Array`                                                          | `Array`                   |                                                                                                         |
| `ByteArray`                                                      | `Int8Array`               |                                                                                                         |
| `ShortArray`                                                     | `Int16Array`              |                                                                                                         |
| `IntArray`                                                       | `Int32Array`              |                                                                                                         |
| `CharArray`                                                      | `UInt16Array`             | 包含屬性 `$type$ == "CharArray"`。                                                           |
| `FloatArray`                                                     | `Float32Array`            |                                                                                                         |
| `DoubleArray`                                                    | `Float64Array`            |                                                                                                         |
| `LongArray`                                                      | `BigInt64Array`           |                                                                                                         |
| `BooleanArray`                                                   | `Int8Array`               | 包含屬性 `$type$ == "BooleanArray"`。                                                        |
| `List`, `MutableList`                                            | `KtList`, `KtMutableList` | 透過 `KtList.asJsReadonlyArrayView` 或 `KtMutableList.asJsArrayView` 暴露 `Array`。                 |
| `Map`, `MutableMap`                                              | `KtMap`, `KtMutableMap`   | 透過 `KtMap.asJsReadonlyMapView` 或 `KtMutableMap.asJsMapView` 暴露 ES2015 `Map`。                  |
| `Set`, `MutableSet`                                              | `KtSet`, `KtMutableSet`   | 透過 `KtSet.asJsReadonlySetView` 或 `KtMutableSet.asJsSetView` 暴露 ES2015 `Set`。                  |
| `Unit`                                                           | Undefined                 | 當用作傳回型別時可匯出，但用作參數型別時則不可。                               |
| `Any`                                                            | `Object`                  |                                                                                                         |
| `Throwable`                                                      | `Error`                   |                                                                                                         |
| `enum class Type`                                                | `Type`                    | 列舉成員會被暴露為靜態類別屬性 (`Type.ENTRY`)。                                     |
| 可為 Null 的 `Type?`                                                 | `Type                     | null                                                                                                    | undefined` |                                                                                            |
| 除了標記有 `@JsExport` 的型別外，所有其他 Kotlin 型別 | 不支援             | 包含 Kotlin 的[無符號整數類型](unsigned-integer-types.md)。                                  |

此外，請務必了解：

* Kotlin 為 `kotlin.Int`、`kotlin.Byte`、`kotlin.Short`、`kotlin.Char` 和 `kotlin.Long` 保留了溢位語意。
* Kotlin 在執行時無法區分數值型別（`kotlin.Long` 除外），因此以下程式碼可以運作：
  
  ```kotlin
  fun f() {
      val x: Int = 23
      val y: Any = x
      println(y as Float)
  }
  ```

* Kotlin 在 JavaScript 中保留了延遲物件初始化。

    ```kotlin
    val x by lazy { ... }