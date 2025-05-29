[//]: # (title: 從 JavaScript 中使用 Kotlin 程式碼)

根據所選的 [JavaScript 模組](js-modules.md) 系統，Kotlin/JS 編譯器會產生不同的輸出。但總體而言，Kotlin 編譯器會生成正常的 JavaScript 類別、函式和屬性，您可以從 JavaScript 程式碼中自由使用它們。不過，您需要記住一些細微之處。

## 在 Plain 模式下將宣告隔離到獨立的 JavaScript 物件中

如果您已明確將模組類型 (module kind) 設定為 `plain`，Kotlin 會建立一個物件，其中包含目前模組中的所有 Kotlin 宣告。這樣做是為了防止污染全域物件。這表示對於模組 `myModule`，所有宣告都可以透過 `myModule` 物件供 JavaScript 使用。例如：

```kotlin
fun foo() = "Hello"
```

可以像這樣從 JavaScript 中呼叫：

```javascript
alert(myModule.foo());
```

當您將 Kotlin 模組編譯為 UMD (這是 `browser` 和 `nodejs` 目標的預設設定)、CommonJS 或 AMD 等 JavaScript 模組時，此情況不適用。在這種情況下，您的宣告將以您所選的 JavaScript 模組系統指定的格式公開。例如，當使用 UMD 或 CommonJS 時，您的呼叫位置 (call site) 可能會像這樣：

```javascript
alert(require('myModule').foo());
```

有關 JavaScript 模組系統的更多資訊，請查閱 [JavaScript 模組](js-modules.md) 文章。

## 套件結構

Kotlin 將其套件結構公開給 JavaScript，因此除非您在根套件中定義宣告，否則您必須在 JavaScript 中使用完全限定名稱 (fully qualified names)。例如：

```kotlin
package my.qualified.packagename

fun foo() = "Hello"
```

例如，當使用 UMD 或 CommonJS 時，您的呼叫位置可能看起來像這樣：

```javascript
alert(require('myModule').my.qualified.packagename.foo())
```

或者，在使用 `plain` 作為模組系統設定的情況下：

```javascript
alert(myModule.my.qualified.packagename.foo());
```

### @JsName 註解

在某些情況下 (例如，為了支援多載)，Kotlin 編譯器會混淆 (mangle) JavaScript 程式碼中生成函式和屬性的名稱。為了控制生成的名稱，您可以使用 `@JsName` 註解：

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

現在您可以透過以下方式從 JavaScript 中使用此類別：

```javascript
// If necessary, import 'kjs' according to chosen module system
var person = new kjs.Person("Dmitry");   // refers to module 'kjs'
person.hello();                          // prints "Hello Dmitry!"
person.helloWithGreeting("Servus");      // prints "Servus Dmitry!"
```

如果我們沒有指定 `@JsName` 註解，相應函式的名稱將包含一個從函式簽章 (signature) 計算出的後綴，例如 `hello_61zpoe`。

請注意，在某些情況下，Kotlin 編譯器不會應用名稱混淆 (mangling)：
- `external` 宣告不會被混淆。
- 繼承自 `external` 類別的非 `external` 類別中任何被覆寫的函式不會被混淆。

`@JsName` 的參數必須是一個有效的識別符號常數字串文字。編譯器會報告任何將非識別符號字串傳遞給 `@JsName` 的嘗試錯誤。以下範例會產生編譯時錯誤：

```kotlin
@JsName("new C()")   // error here
external fun newC()
```

### @JsExport 註解

> 此功能為 [實驗性](components-stability.md#stability-levels-explained)。
> 其設計在未來版本中可能會變更。
>
{style="warning"} 

透過將 `@JsExport` 註解套用於頂層宣告 (如類別或函式)，您可以使 Kotlin 宣告可從 JavaScript 存取。此註解會匯出所有具有 Kotlin 中給定名稱的巢狀宣告。它也可以透過 `@file:JsExport` 套用於檔案層級。

為了解決匯出中的歧義 (例如同名函式的多載)，您可以將 `@JsExport` 註解與 `@JsName` 一起使用，以指定生成和匯出函式的名稱。

在目前的 [IR 編譯器後端](js-ir-compiler.md) 中，`@JsExport` 註解是使您的函式可供 JavaScript 存取的唯一方式。

對於多平台專案，`@JsExport` 在共同程式碼 (common code) 中也可用。它僅在編譯 JavaScript 目標時生效，並允許您匯出非平台特定的 Kotlin 宣告。

### @JsStatic

> 此功能為 [實驗性](components-stability.md#stability-levels-explained)。它可能隨時被移除或更改。
> 僅用於評估目的。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-18891/JS-provide-a-way-to-declare-static-members-JsStatic) 上提供關於它的回饋。
>
{style="warning"}

`@JsStatic` 註解指示編譯器為目標宣告生成額外的靜態方法。這有助於您直接在 JavaScript 中使用 Kotlin 程式碼中的靜態成員。

您可以將 `@JsStatic` 註解套用於命名物件中定義的函式，以及在類別和介面中宣告的伴生物件 (companion objects)。如果您使用此註解，編譯器將生成物件的靜態方法以及物件本身的實例方法。例如：

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
C.callStatic();              // Works, accessing the static function
C.callNonStatic();           // Error, not a static function in the generated JavaScript
C.Companion.callStatic();    // Instance method remains
C.Companion.callNonStatic(); // The only way it works
```

也可以將 `@JsStatic` 註解套用於物件或伴生物件的屬性，使其 getter 和 setter 方法成為該物件或包含伴生物件的類別中的靜態成員。

## JavaScript 中的 Kotlin 類型

查看 Kotlin 類型如何映射到 JavaScript 類型：

| Kotlin                                                                      | JavaScript                 | 備註                                                                                      |
|-----------------------------------------------------------------------------|----------------------------|-------------------------------------------------------------------------------------------|
| `Byte`, `Short`, `Int`, `Float`, `Double`                                   | `Number`                   |                                                                                           |
| `Char`                                                                      | `Number`                   | 該數字表示字元的程式碼。                                                                  |
| `Long`                                                                      | 不支援                     | JavaScript 中沒有 64 位元整數類型，因此它由 Kotlin 類別模擬。                                |
| `Boolean`                                                                   | `Boolean`                  |                                                                                           |
| `String`                                                                    | `String`                   |                                                                                           |
| `Array`                                                                     | `Array`                    |                                                                                           |
| `ByteArray`                                                                 | `Int8Array`                |                                                                                           |
| `ShortArray`                                                                | `Int16Array`               |                                                                                           |
| `IntArray`                                                                  | `Int32Array`               |                                                                                           |
| `CharArray`                                                                 | `UInt16Array`              | 帶有屬性 `$type$ == "CharArray"`。                                                        |
| `FloatArray`                                                                | `Float32Array`             |                                                                                           |
| `DoubleArray`                                                               | `Float64Array`             |                                                                                           |
| `LongArray`                                                                 | `Array<kotlin.Long>`       | 帶有屬性 `$type$ == "LongArray"`。另請參閱 Kotlin 的 Long 類型註釋。                       |
| `BooleanArray`                                                              | `Int8Array`                | 帶有屬性 `$type$ == "BooleanArray"`。                                                     |
| `List`, `MutableList`                                                       | `KtList`, `KtMutableList`  | 透過 `KtList.asJsReadonlyArrayView` 或 `KtMutableList.asJsArrayView` 暴露 `Array`。         |
| `Map`, `MutableMap`                                                         | `KtMap`, `KtMutableMap`    | 透過 `KtMap.asJsReadonlyMapView` 或 `KtMutableMap.asJsMapView` 暴露 ES2015 `Map`。          |
| `Set`, `MutableSet`                                                         | `KtSet`, `KtMutableSet`    | 透過 `KtSet.asJsReadonlySetView` 或 `KtMutableSet.asJsSetView` 暴露 ES2015 `Set`。          |
| `Unit`                                                                      | Undefined                  | 當用作回傳類型時可匯出，但當用作參數類型時則不可。                                        |
| `Any`                                                                       | `Object`                   |                                                                                           |
| `Throwable`                                                                 | `Error`                    |                                                                                           |
| Nullable `Type?`                                                            | `Type | null | undefined`  |                                                                                           |
| 所有其他 Kotlin 類型 (除了標記有 `JsExport` 註解的類型)                     | 不支援                     | 包含 Kotlin 的 [無符號整數類型](unsigned-integer-types.md)。                             |

此外，還需要了解：

*   Kotlin 保留 `kotlin.Int`、`kotlin.Byte`、`kotlin.Short`、`kotlin.Char` 和 `kotlin.Long` 的溢位語意 (overflow semantics)。
*   Kotlin 在執行時無法區分數字類型 (除了 `kotlin.Long`)，因此以下程式碼有效：
    
    ```kotlin
    fun f() {
        val x: Int = 23
        val y: Any = x
        println(y as Float)
    }
    ```

*   Kotlin 在 JavaScript 中保留延遲物件初始化。
*   Kotlin 在 JavaScript 中不實作頂層屬性的延遲初始化。