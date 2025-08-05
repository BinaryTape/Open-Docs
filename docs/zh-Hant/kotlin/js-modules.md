[//]: # (title: JavaScript 模組)

您可以將您的 Kotlin 專案編譯為 JavaScript 模組，以供各種流行的模組系統使用。我們目前支援以下 JavaScript 模組配置：

- [統一模組定義 (UMD)](https://github.com/umdjs/umd)，與 *AMD* 和 *CommonJS* 均相容。UMD 模組也能夠在未匯入或沒有模組系統存在的情況下執行。這是 `browser` 和 `nodejs` 目標的預設選項。
- [非同步模組定義 (AMD)](https://github.com/amdjs/amdjs-api/wiki/AMD)，特別由 [RequireJS](https://requirejs.org/) 函式庫使用。
- [CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1)，被 Node.js/npm 廣泛使用（`require` 函式和 `module.exports` 物件）。
- Plain（純粹）。不為任何模組系統編譯。您可以透過其名稱在全域範圍內存取模組。

## 瀏覽器目標

如果您打算在網頁瀏覽器環境中執行程式碼，並希望使用 UMD 以外的模組系統，您可以在 `webpackTask` 配置區塊中指定所需的模組類型。例如，要切換到 CommonJS，請使用：

```groovy
kotlin {
    js {
        browser {
            webpackTask {
                output.libraryTarget = "commonjs2"
            }
        }
        binaries.executable()
    }
}

```

Webpack 提供兩種不同形式的 CommonJS，`commonjs` 和 `commonjs2`，它們影響您宣告可用性的方式。在大多數情況下，您可能希望使用 `commonjs2`，它會將 `module.exports` 語法添加到生成的函式庫中。或者，您也可以選擇 `commonjs` 選項，它嚴格遵循 CommonJS 規範。要了解 `commonjs` 和 `commonjs2` 之間的更多差異，請參閱 [Webpack repository](https://github.com/webpack/webpack/issues/1114)。

## JavaScript 函式庫與 Node.js 檔案

如果您正在建立用於 JavaScript 或 Node.js 環境的函式庫，並希望使用不同的模組系統，則說明會略有不同。

### 選擇目標模組系統

要選擇目標模組系統，請在 Gradle 建置腳本中設定 `moduleKind` 編譯器選項：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.targets.js.ir.KotlinJsIrLink> {
    compilerOptions.moduleKind.set(org.jetbrains.kotlin.gradle.dsl.JsModuleKind.MODULE_COMMONJS)
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
compileKotlinJs.compilerOptions.moduleKind = org.jetbrains.kotlin.gradle.dsl.JsModuleKind.MODULE_COMMONJS
```

</tab>
</tabs>

可用的值為：`umd`（預設）、`commonjs`、`amd`、`plain`。

> 這與調整 `webpackTask.output.libraryTarget` 不同。函式庫目標變更的是 _Webpack 產生的輸出_（在您的程式碼已經編譯之後）。`compilerOptions.moduleKind` 變更的是 _Kotlin 編譯器產生的輸出_。
>
{style="note"}  

在 Kotlin Gradle DSL 中，也有一個設定 CommonJS 模組類型的捷徑：

```kotlin
kotlin {
    js {
        useCommonJs()
        // ...
    }
}
```

## @JsModule 註解

要告訴 Kotlin，`external` 類別、套件、函式或屬性是 JavaScript 模組，您可以使用 `@JsModule` 註解。假設您有以下名為 "hello" 的 CommonJS 模組：

```javascript
module.exports.sayHello = function (name) { alert("Hello, " + name); }
```

您應該在 Kotlin 中這樣宣告它：

```kotlin
@JsModule("hello")
external fun sayHello(name: String)
```

### 將 @JsModule 應用於套件

一些 JavaScript 函式庫匯出套件（命名空間）而不是函式和類別。就 JavaScript 而言，它是一個具有成員（類別、函式和屬性）的 *物件*。將這些套件匯入為 Kotlin 物件通常看起來不自然。編譯器可以使用以下表示法將匯入的 JavaScript 套件對應到 Kotlin 套件：

```kotlin
@file:JsModule("extModule")

package ext.jspackage.name

external fun foo()

external class C
```

其中對應的 JavaScript 模組是這樣宣告的：

```javascript
module.exports = {
  foo: { /* some code here */ },
  C: { /* some code here */ }
}
```

標記有 `@file:JsModule` 註解的檔案不能宣告非外部成員。下面的例子會產生一個編譯時錯誤：

```kotlin
@file:JsModule("extModule")

package ext.jspackage.name

external fun foo()

fun bar() = "!" + foo() + "!" // error here
```

### 匯入更深層次的套件階層

在前面的例子中，JavaScript 模組匯出單一套件。然而，一些 JavaScript 函式庫從模組內部匯出多個套件。這種情況也受 Kotlin 支援，儘管您必須為每個匯入的套件宣告一個新的 `.kt` 檔案。

例如，讓我們把例子變得更複雜一點：

```javascript
module.exports = {
  mylib: {
    pkg1: {
      foo: function () { /* some code here */ },
      bar: function () { /* some code here */ }
    },
    pkg2: {
      baz: function () { /* some code here */ }
    }
  }
}
```

要在 Kotlin 中匯入此模組，您必須編寫兩個 Kotlin 原始碼檔案：

```kotlin
@file:JsModule("extModule")
@file:JsQualifier("mylib.pkg1")

package extlib.pkg1

external fun foo()

external fun bar()
```

以及

```kotlin
@file:JsModule("extModule")
@file:JsQualifier("mylib.pkg2")

package extlib.pkg2

external fun baz()
```

### @JsNonModule 註解

當一個宣告被標記為 `@JsModule` 時，如果您沒有將其編譯為 JavaScript 模組，則無法從 Kotlin 程式碼中使用它。通常，開發人員會將其函式庫分發為 JavaScript 模組以及可下載的 `.js` 檔案，您可以將其複製到專案的靜態資源中並透過 `<script>` 標籤包含。為了告訴 Kotlin 可以在非模組環境中使用 `@JsModule` 宣告，請添加 `@JsNonModule` 註解。例如，考慮以下 JavaScript 程式碼：

```javascript
function topLevelSayHello (name) { alert("Hello, " + name); }

if (module && module.exports) {
  module.exports = topLevelSayHello;
}
```

您可以從 Kotlin 中這樣描述它：

```kotlin
@JsModule("hello")
@JsNonModule
@JsName("topLevelSayHello")
external fun sayHello(name: String)
```

### Kotlin 標準函式庫使用的模組系統

Kotlin 隨附 Kotlin/JS 標準函式庫作為單一檔案分發，它本身被編譯為 UMD 模組，因此您可以將其與上述任何模組系統一起使用。對於 Kotlin/JS 的大多數使用案例，建議依賴於 `kotlin-stdlib-js` 的 Gradle 依賴，它在 NPM 上也作為 [`kotlin`](https://www.npmjs.com/package/kotlin) 套件提供。