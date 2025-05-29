[//]: # (title: JavaScript 模組)

您可以將 Kotlin 專案編譯成適用於各種流行模組系統的 JavaScript 模組。我們目前支援以下 JavaScript 模組配置：

- [統一模組定義 (UMD)](https://github.com/umdjs/umd)，與 *AMD* 和 *CommonJS* 皆相容。UMD 模組也能在未被匯入或沒有模組系統存在的情況下執行。這是 `browser` 和 `nodejs` 目標的預設選項。
- [非同步模組定義 (AMD)](https://github.com/amdjs/amdjs-api/wiki/AMD)，特別由 [RequireJS](https://requirejs.org/) 函式庫使用。
- [CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1)，廣泛用於 Node.js/npm（`require` 函數和 `module.exports` 物件）。
- 純粹。不為任何模組系統編譯。您可以在全域範圍內透過模組名稱存取模組。

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

Webpack 提供了兩種不同風格的 CommonJS，`commonjs` 和 `commonjs2`，它們影響您的宣告如何提供。在大多數情況下，您可能希望使用 `commonjs2`，它會將 `module.exports` 語法新增到生成的函式庫中。或者，您也可以選擇 `commonjs` 選項，它嚴格遵循 CommonJS 規範。要了解 `commonjs` 和 `commonjs2` 之間的更多區別，請參閱 [Webpack 儲存庫](https://github.com/webpack/webpack/issues/1114)。

## JavaScript 函式庫和 Node.js 檔案

如果您正在建立用於 JavaScript 或 Node.js 環境的函式庫，並希望使用不同的模組系統，則說明會略有不同。

### 選擇目標模組系統

若要選擇目標模組系統，請在 Gradle 建構腳本中設定 `moduleKind` 編譯器選項：

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

> 這與調整 `webpackTask.output.libraryTarget` 不同。函式庫目標會改變 _由 webpack 生成_ 的輸出（在您的程式碼已編譯之後）。`compilerOptions.moduleKind` 改變 _由 Kotlin 編譯器生成_ 的輸出。
>
{style="note"}  

在 Kotlin Gradle DSL 中，也有設定 CommonJS 模組種類的快捷方式：

```kotlin
kotlin {
    js {
        useCommonJs()
        // ...
    }
}
```

## @JsModule 註解

若要告訴 Kotlin 某個 `external` 類別、套件、函數或屬性是 JavaScript 模組，您可以使用 `@JsModule` 註解。假設您有以下名為 "hello" 的 CommonJS 模組：

```javascript
module.exports.sayHello = function (name) { alert("Hello, " + name); }
```

您應該在 Kotlin 中如此宣告它：

```kotlin
@JsModule("hello")
external fun sayHello(name: String)
```

### 將 @JsModule 應用於套件

一些 JavaScript 函式庫匯出的是套件（命名空間），而非函數和類別。就 JavaScript 而言，它是一個包含類別、函數和屬性成員的 *物件*。將這些套件匯入為 Kotlin 物件通常看起來不自然。編譯器可以將匯入的 JavaScript 套件映射到 Kotlin 套件，使用以下標記法：

```kotlin
@file:JsModule("extModule")

package ext.jspackage.name

external fun foo()

external class C
```

其中對應的 JavaScript 模組宣告如下：

```javascript
module.exports = {
  foo: { /* some code here */ },
  C: { /* some code here */ }
}
```

標記有 `@file:JsModule` 註解的檔案不能宣告非 `external` 成員。以下範例會產生編譯時期錯誤：

```kotlin
@file:JsModule("extModule")

package ext.jspackage.name

external fun foo()

fun bar() = "!" + foo() + "!" // error here
```

### 匯入更深的套件層級

在前面的範例中，JavaScript 模組匯出單一套件。然而，有些 JavaScript 函式庫從一個模組內部匯出多個套件。Kotlin 也支援這種情況，但您必須為每個匯入的套件宣告一個新的 `.kt` 檔案。

例如，讓我們將範例稍微複雜化：

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

若要在 Kotlin 中匯入此模組，您必須撰寫兩個 Kotlin 原始碼檔案：

```kotlin
@file:JsModule("extModule")
@file:JsQualifier("mylib.pkg1")

package extlib.pkg1

external fun foo()

external fun bar()
```

和

```kotlin
@file:JsModule("extModule")
@file:JsQualifier("mylib.pkg2")

package extlib.pkg2

external fun baz()
```

### @JsNonModule 註解

當一個宣告被標記為 `@JsModule` 時，如果您沒有將其編譯為 JavaScript 模組，則無法在 Kotlin 程式碼中使用它。通常，開發者會以 JavaScript 模組和可下載的 `.js` 檔案兩種形式分發其函式庫，您可以將 `.js` 檔案複製到專案的靜態資源中並透過 `<script>` 標籤引入。為了告訴 Kotlin 允許從非模組環境中使用 `@JsModule` 宣告，請新增 `@JsNonModule` 註解。例如，考慮以下 JavaScript 程式碼：

```javascript
function topLevelSayHello (name) { alert("Hello, " + name); }

if (module && module.exports) {
  module.exports = topLevelSayHello;
}
```

您可以從 Kotlin 如此描述它：

```kotlin
@JsModule("hello")
@JsNonModule
@JsName("topLevelSayHello")
external fun sayHello(name: String)
```

### Kotlin 標準函式庫使用的模組系統

Kotlin 以單一檔案形式分發 Kotlin/JS 標準函式庫，該函式庫本身被編譯為 UMD 模組，因此您可以將其與上述任何模組系統一起使用。對於 Kotlin/JS 的大多數使用案例，建議使用 `kotlin-stdlib-js` 的 Gradle 依賴項，該依賴項也可在 NPM 上以 [`kotlin`](https://www.npmjs.com/package/kotlin) 套件的形式取得。

```
```