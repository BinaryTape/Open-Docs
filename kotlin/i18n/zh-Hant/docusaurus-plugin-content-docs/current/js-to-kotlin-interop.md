---
title: "從 JavaScript 使用 Kotlin 程式碼"
---
取決於選擇的 [JavaScript 模組](js-modules)系統，Kotlin/JS 編譯器會產生不同的輸出。
但一般來說，Kotlin 編譯器會產生一般的 JavaScript 類別（class）、函式（function）和屬性（property），您可以從 JavaScript 程式碼中自由使用它們。不過，有一些細微的地方您應該記住。

## 在純（plain）模式下，將宣告隔離在單獨的 JavaScript 物件中

如果您已明確將模組種類設定為 `plain`，Kotlin 會建立一個物件，其中包含目前模組中的所有 Kotlin 宣告。這樣做是為了防止破壞全域物件（global object）。這表示對於模組 `myModule`，所有宣告都可以透過 `myModule` 物件供 JavaScript 使用。例如：

```kotlin
fun foo() = "Hello"
```

可以像這樣從 JavaScript 呼叫：

```javascript
alert(myModule.foo());
```

當您將 Kotlin 模組編譯為 JavaScript 模組（如 UMD，這是 `browser` 和 `nodejs` 目標的預設設定）、CommonJS 或 AMD 時，這並不適用。在這種情況下，您的宣告將以您選擇的 JavaScript 模組系統指定的格式公開。例如，當使用 UMD 或 CommonJS 時，您的呼叫點可能如下所示：

```javascript
alert(require('myModule').foo());
```

請查看關於 [JavaScript 模組](js-modules)的文章，以獲取有關 JavaScript 模組系統主題的更多資訊。

## 封包結構（Package structure）

Kotlin 將其封包結構公開給 JavaScript，因此除非您在根封包中定義宣告，否則必須在 JavaScript 中使用完整名稱（fully qualified names）。例如：

```kotlin
package my.qualified.packagename

fun foo() = "Hello"
```

例如，當使用 UMD 或 CommonJS 時，您的呼叫點可能如下所示：

```javascript
alert(require('myModule').my.qualified.packagename.foo())
```

或者，在使用 `plain` 作為模組系統設定的情況下：

```javascript
alert(myModule.my.qualified.packagename.foo());
```

### @JsName 註解（annotation）

在某些情況下（例如，為了支援多載（overload）），Kotlin 編譯器會修改在 JavaScript 程式碼中產生的函式和屬性的名稱。要控制產生的名稱，您可以使用 `@JsName` 註解：

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

現在，您可以透過以下方式從 JavaScript 使用此類別：

```javascript
// If necessary, import 'kjs' according to chosen module system
var person = new kjs.Person("Dmitry");   // refers to module 'kjs'
person.hello();                          // prints "Hello Dmitry!"
person.helloWithGreeting("Servus");      // prints "Servus Dmitry!"
```

如果我們沒有指定 `@JsName` 註解，則相應函式的名稱將包含從函式簽章計算出的字尾，例如 `hello_61zpoe`.

請注意，在某些情況下，Kotlin 編譯器不會套用名稱修改：
- `external` 宣告不會被修改。
- 從繼承自 `external` 類別的非 `external` 類別中的任何覆寫函式都不會被修改。

`@JsName` 的參數必須是有效的識別符號的常數字串文字。
編譯器將報告任何嘗試將非識別符號字串傳遞給 `@JsName` 的錯誤。
以下範例會產生編譯時期錯誤：

```kotlin
@JsName("new C()")   // error here
external fun newC()
```

### @JsExport 註解（annotation）

:::caution
此功能為 [實驗性](components-stability#stability-levels-explained)。
其設計可能會在未來的版本中變更。

:::

透過將 `@JsExport` 註解套用到頂層宣告（top-level declaration）（如類別或函式），您可以從 JavaScript 使用 Kotlin 宣告。此註解會匯出所有具有 Kotlin 中給定名稱的巢狀宣告。它也可以使用 `@file:JsExport` 應用於檔案層級（file-level）。

為了消除匯出中的歧義（如具有相同名稱的函式的多載），您可以將 `@JsExport` 註解與 `@JsName` 一起使用，以指定產生和匯出的函式的名稱。

在目前的 [IR 編譯器後端](js-ir-compiler)中，`@JsExport` 註解是使您的函式從 Kotlin 可見的唯一方法。

對於多平台專案，`@JsExport` 也可在通用程式碼中使用。它僅在為 JavaScript 目標編譯時才有效，並且允許您匯出非平台特定的 Kotlin 宣告。

### @JsStatic

:::caution
此功能為 [實驗性](components-stability#stability-levels-explained)。它可能隨時被刪除或更改。
僅將其用於評估目的。我們將感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-18891/JS-provide-a-way-to-declare-static-members-JsStatic) 上提供有關它的回饋。

:::

`@JsStatic` 註解指示編譯器為目標宣告產生額外的靜態方法（static methods）。
這有助於您直接在 JavaScript 中使用 Kotlin 程式碼中的靜態成員。

您可以將 `@JsStatic` 註解應用於在具名物件（named objects）中定義的函式，以及在類別和介面（interface）內宣告的伴生物件（companion objects）。如果您使用此註解，則編譯器將產生物件的靜態方法和物件本身中的實例方法。例如：

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

現在，`callStatic()` 函式在 JavaScript 中是靜態的，而 `callNonStatic()` 函式不是：

```javascript
// JavaScript
C.callStatic();              // Works, accessing the static function
C.callNonStatic();           // Error, not a static function in the generated JavaScript
C.Companion.callStatic();    // Instance method remains
C.Companion.callNonStatic(); // The only way it works
```

也可以將 `@JsStatic` 註解應用於物件或伴生物件的屬性，使其 getter 和 setter 方法成為該物件或包含伴生物件的類別中的靜態成員。

## JavaScript 中的 Kotlin 類型

請參閱 Kotlin 類型如何對應到 JavaScript 類型：

| Kotlin                                                                      | JavaScript                 | 備註                                                                                      |
|-----------------------------------------------------------------------------|----------------------------|-------------------------------------------------------------------------------------------|
| `Byte`, `Short`, `Int`, `Float`, `Double`                                   | `Number`                   |                                                                                           |
| `Char`                                                                      | `Number`                   | 該數字表示字元的程式碼。                                                                              |
| `Long`                                                                      | 不支援                    | JavaScript 中沒有 64 位元整數數字類型，因此它由 Kotlin 類別模擬。                              |
| `Boolean`                                                                   | `Boolean`                  |                                                                                           |
| `String`                                                                    | `String`                   |                                                                                           |
| `Array`                                                                     | `Array`                    |                                                                                           |
| `ByteArray`                                                                 | `Int8Array`                |                                                                                           |
| `ShortArray`                                                                | `Int16Array`               |                                                                                           |
| `IntArray`                                                                  | `Int32Array`               |                                                                                           |
| `CharArray`                                                                 | `UInt16Array`              | 攜帶屬性 `$type$ == "CharArray"`。                                                                  |
| `FloatArray`                                                                | `Float32Array`             |                                                                                           |
| `DoubleArray`                                                               | `Float64Array`             |                                                                                           |
| `LongArray`                                                                 | `Array<kotlin.Long>`       | 攜帶屬性 `$type$ == "LongArray"`。另請參閱 Kotlin 的 Long 類型備註。                                |
| `BooleanArray`                                                              | `Int8Array`                | 攜帶屬性 `$type$ == "BooleanArray"`。                                                             |
| `List`, `MutableList`                                                       | `KtList`, `KtMutableList`  | 透過 `KtList.asJsReadonlyArrayView` 或 `KtMutableList.asJsArrayView` 公開 `Array`。              |
| `Map`, `MutableMap`                                                         | `KtMap`, `KtMutableMap`    | 透過 `KtMap.asJsReadonlyMapView` 或 `KtMutableMap.asJsMapView` 公開 ES2015 `Map`。             |
| `Set`, `MutableSet`                                                         | `KtSet`, `KtMutableSet`    | 透過 `KtSet.asJsReadonlySetView` 或 `KtMutableSet.asJsSetView` 公開 ES2015 `Set`。             |
| `Unit`                                                                      | Undefined                  | 當用作回傳類型時可匯出，但當用作參數類型時則不能。                                                        |
| `Any`                                                                       | `Object`                   |                                                                                           |
| `Throwable`                                                                 | `Error`                    |                                                                                           |
| 可為空值 `Type?`                                                            | `Type | null | undefined`  |                                                                                            |
| 所有其他 Kotlin 類型（標記有 `JsExport` 註解的類型除外）                         | 不支援                    | 包括 Kotlin 的 [無符號整數類型](unsigned-integer-types)。                                                         |

此外，重要的是要知道：

* Kotlin 保留了 `kotlin.Int`、`kotlin.Byte`、`kotlin.Short`、`kotlin.Char` 和 `kotlin.Long` 的溢位語義。
* Kotlin 無法在執行時區分數值類型（`kotlin.Long` 除外），因此以下程式碼有效：
  
  ```kotlin
  fun f() {
      val x: Int = 23
      val y: Any = x
      println(y as Float)
  }
  ```

* Kotlin 在 JavaScript 中保留了延遲物件初始化（lazy object initialization）。
* Kotlin 不會在 JavaScript 中實現頂層屬性的延遲初始化。
  ```