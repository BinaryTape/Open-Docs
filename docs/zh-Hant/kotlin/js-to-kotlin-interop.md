請注意，在某些情況下 Kotlin 編譯器不會套用名稱重整 (mangling)：
- `external` 宣告不會被重整。
- 繼承自 `external` 類別的非 `external` 類別中的任何覆寫函式都不會被重整。

`@JsName` 的參數必須是常數字串常值，且該常值必須是有效的識別符號。
任何嘗試將非識別符號字串傳遞給 `@JsName` 的行為，編譯器都會報錯。
以下範例會產生編譯期錯誤：

```kotlin
@JsName("new C()")   // 這裡會出錯
external fun newC()
```

### `@JsExport` 註解
<primary-label ref="experimental-general"/>

透過將 `@JsExport` 註解套用至頂層宣告（如類別、介面或函式），您可以讓 Kotlin 宣告在 JavaScript 或 TypeScript 中可用。此註解會匯出所有具有 Kotlin 中指定名稱的巢狀宣告。

例如，以下是如何匯出包含巢狀類別和具名伴隨物件的 Kotlin 介面：

```kotlin
@JsExport
interface Identity {
     class Metadata(val tag: String)

    companion object Registry {
        val defaultTag = "GUEST"
    }
}
```

目前，`@JsExport` 註解是使您的函式從 Kotlin 中可見的唯一方法。

`@JsExport` 註解也可用於：

* 多平台專案的通用程式碼中。它僅在針對 JavaScript 目標進行編譯時生效，並允許您同時匯出非平台特定的 Kotlin 宣告。
* 與 [`@JsName` 註解](#jsname-annotation)結合使用，以指定產生和匯出的函式名稱。這有助於解決匯出中的歧義（例如同名函式的多載）。
* 使用 `@file:JsExport` 套用於檔案層級。

#### 支援值類別 (value class) 匯出

您可以將 Kotlin 的 [內嵌值類別](inline-classes.md) 匯出為一般的 TypeScript 類別。

要匯出值類別，請在 Kotlin 端將其標記為 `@JsExport` 註解：

```kotlin
// Kotlin
@JsExport
@JvmInline
value class Email(val address: String) {
    init { require(address.contains("@")) { "Invalid email" } }
}

@JsExport
class AuthService {
    suspend fun login(email: Email): String = ...
}
```

從 TypeScript 端來看，它就像一個普通的類別：

```typescript
// TypeScript
import { AuthService, Email } from "..."
const auth = new AuthService();

console.log(await auth.login(new Email("jane@example.com"))); 
// "Welcome, jane@example.com!"
console.log(await auth.login(new Email("not-an-email"))); 
// "Invalid email"
```

### `@JsNoRuntime` 註解

您可以使用 `@JsNoRuntime` 註解將 Kotlin 介面匯出到 JavaScript/TypeScript。這允許直接對應到一般的 TypeScript 介面。

要匯出 Kotlin 介面（例如從 Kotlin 多平台專案匯出）：

1. 在通用程式碼中為 Kotlin 介面加上 `@JsNoRuntime` 註解：

    ```kotlin
    // commonMain
    import kotlin.js.JsNoRuntime
    
    @JsNoRuntime
    expect interface DataProcessor {
        fun process(data: String): Int 
    }
    ```

2. 在 JavaScript 特定的原始碼中提供帶有 `@JsNoRuntime` 的實際實作：

    ```kotlin
    // jsMain
    import kotlin.js.JsNoRuntime
    
    @JsNoRuntime
    actual interface DataProcessor {
        actual fun process(data: String): Int
    } 
    ```
    
3. 在 TypeScript 端，該介面將被對應為一般的 TypeScript 介面：
    
    ```typescript
    // 產生的 .d.ts
    export interface DataProcessor {
        process(data: string): number;
    }
    ```

對於 Kotlin 多平台專案，一般規則如下：

* `expect` 和 `actual` 介面宣告都必須加上 `@JsNoRuntime` 註解。唯一的例外是平台特定程式碼中 `actual` 端不需要註解的 `external` 實作。
* 禁止在 `expect` 端的通用程式碼中使用 `external` 介面宣告。應改用加上 `@JsNoRuntime` 註解的一般介面。

使用 `@JsNoRuntime` 匯出 Kotlin 介面有一些限制。該註解不允許用於：

* `external` 介面，因為它們預設的行為就已經像是有 `@JsNoRuntime`。加上它會導致編譯器警告。
* `is` 和 `as` 型別檢查。
* 使用 [`::class` 語法](js-reflection.md) 的類別參照。
* 作為 [具體化型別引數 (reified type argument)](inline-functions.md#reified-type-parameters) 傳遞的介面。

### `@JsStatic`
<primary-label ref="experimental-general"/>

`@JsStatic` 註解指示編譯器為目標宣告產生額外的靜態方法。這有助於您直接在 JavaScript 中使用 Kotlin 程式碼中的靜態成員。

您可以將 `@JsStatic` 註解套用至在命名物件中定義的函式，以及在類別和介面內宣告的伴隨物件。如果您使用此註解，編譯器將同時產生該物件的靜態方法以及物件本身的執行個體方法。例如：

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

此功能為 [實驗性](components-stability.md#stability-levels-explained)。請在我們的問題追蹤器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-18891/JS-provide-a-way-to-declare-static-members-JsStatic) 中分享您的回饋。

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