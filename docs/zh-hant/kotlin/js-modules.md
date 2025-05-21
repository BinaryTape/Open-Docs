---
title: "JavaScript 模組"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

您可以將您的 Kotlin 專案編譯為適用於各種流行模組系統 (module system) 的 JavaScript 模組 (module)。 我們目前支援以下 JavaScript 模組 (module) 的設定：

- [統一模組定義 (Unified Module Definitions, UMD)](https://github.com/umdjs/umd)，它與 *AMD* 和 *CommonJS* 相容。
    UMD 模組 (module) 也能夠在沒有被導入或沒有模組系統 (module system) 的情況下執行。 這是 `browser` 和 `nodejs` 目標 (target) 的預設選項。
- [非同步模組定義 (Asynchronous Module Definitions, AMD)](https://github.com/amdjs/amdjs-api/wiki/AMD)，特別是被 [RequireJS](https://requirejs.org/) 函式庫使用。
- [CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1)，被 Node.js/npm 廣泛使用
   （`require` 函數和 `module.exports` 物件）。
- Plain (純)。 不要為了任何模組系統 (module system) 而編譯。 您可以在全域範圍 (global scope) 中透過其名稱來存取模組 (module)。

## 瀏覽器目標 (Browser targets)

如果您打算在網頁瀏覽器環境中執行您的程式碼，並且想要使用 UMD 以外的模組系統 (module system)，您可以在 `webpackTask` 設定區塊中指定想要的模組類型 (module type)。 例如，要切換到 CommonJS，請使用：

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

Webpack 提供了兩種不同的 CommonJS 風格，`commonjs` 和 `commonjs2`，它們會影響您的宣告被提供使用的方式。 在大多數情況下，您可能想要 `commonjs2`，它會將 `module.exports` 語法新增到產生的函式庫中。 或者，您也可以選擇 `commonjs` 選項，它嚴格遵守 CommonJS 規範。
要了解更多關於 `commonjs` 和 `commonjs2` 之間的差異，請參閱 [Webpack repository](https://github.com/webpack/webpack/issues/1114)。

## JavaScript 函式庫和 Node.js 檔案

如果您正在建立一個用於 JavaScript 或 Node.js 環境的函式庫，並且想要使用不同的模組系統 (module system)，則說明會略有不同。

### 選擇目標模組系統 (target module system)

要選擇目標模組系統 (target module system)，請在 Gradle 建置腳本中設定 `moduleKind` 編譯器選項 (compiler option)：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.targets.js.ir.KotlinJsIrLink> {
    compilerOptions.moduleKind.set(org.jetbrains.kotlin.gradle.dsl.JsModuleKind.MODULE_COMMONJS)
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
compileKotlinJs.compilerOptions.moduleKind = org.jetbrains.kotlin.gradle.dsl.JsModuleKind.MODULE_COMMONJS
```

</TabItem>
</Tabs>

可用的值有：`umd` (預設)、`commonjs`、`amd`、`plain`。

:::note
這與調整 `webpackTask.output.libraryTarget` 不同。 函式庫目標 (library target) 變更了 _webpack 產生的_ 輸出（在您的程式碼已經被編譯之後）。 `compilerOptions.moduleKind` 變更了 _Kotlin 編譯器產生的_ 輸出。

:::  

在 Kotlin Gradle DSL 中，也有一個設定 CommonJS 模組種類 (module kind) 的捷徑：

```kotlin
kotlin {
    js {
        useCommonJs()
        // ...
    }
}
```

## @JsModule 註解

要告訴 Kotlin 一個 `external` 類別 (class)、套件 (package)、函數 (function) 或屬性 (property) 是一個 JavaScript 模組 (module)，您可以使用 `@JsModule` 註解。 假設您有以下名為 "hello" 的 CommonJS 模組 (module)：

```javascript
module.exports.sayHello = function (name) { alert("Hello, " + name); }
```

您應該在 Kotlin 中像這樣宣告它：

```kotlin
@JsModule("hello")
external fun sayHello(name: String)
```

### 將 @JsModule 應用於套件 (packages)

一些 JavaScript 函式庫導出套件 (package)（命名空間 (namespace)）而不是函數 (function) 和類別 (class)。
在 JavaScript 方面，它是一個 *物件 (object)*，其中具有作為類別 (class)、函數 (function) 和屬性 (property) 的 *成員 (member)*。
將這些套件 (package) 作為 Kotlin 物件 (object) 導入通常看起來不自然。
編譯器可以使用以下表示法將導入的 JavaScript 套件 (package) 映射到 Kotlin 套件 (package)：

```kotlin
@file:JsModule("extModule")

package ext.jspackage.name

external fun foo()

external class C
```

其中，相應的 JavaScript 模組 (module) 宣告如下：

```javascript
module.exports = {
  foo: { /* some code here */ },
  C: { /* some code here */ }
}
```

使用 `@file:JsModule` 註解標記的檔案不能宣告非外部 (non-external) 成員 (member)。
下面的範例會產生一個編譯時期錯誤 (compile-time error)：

```kotlin
@file:JsModule("extModule")

package ext.jspackage.name

external fun foo()

fun bar() = "!" + foo() + "!" // error here
```

### 導入更深的套件層級 (package hierarchies)

在先前的範例中，JavaScript 模組 (module) 導出一個單一套件 (package)。
然而，一些 JavaScript 函式庫從一個模組 (module) 中導出多個套件 (package)。
Kotlin 也支援這種情況，但您必須為您導入的每個套件 (package) 宣告一個新的 `.kt` 檔案。

例如，讓我們把範例變得更複雜一點：

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

要在 Kotlin 中導入這個模組 (module)，您必須編寫兩個 Kotlin 原始碼檔案：

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

當一個宣告被標記為 `@JsModule` 時，如果您不將它編譯為 JavaScript 模組 (module)，您就不能從 Kotlin 程式碼中使用它。
通常，開發人員會將他們的函式庫同時作為 JavaScript 模組 (module) 和可下載的 `.js` 檔案發布，您可以將這些檔案複製到您專案的靜態資源 (static resources) 中，並透過 `<script>` 標籤包含它們。 要告訴 Kotlin，從非模組 (non-module) 環境中使用 `@JsModule` 宣告是可以的，請新增 `@JsNonModule` 註解。 例如，考慮以下 JavaScript 程式碼：

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

### Kotlin 標準函式庫使用的模組系統 (module system)

Kotlin 與 Kotlin/JS 標準函式庫一起作為單一檔案發布，該檔案本身被編譯為 UMD 模組 (module)，因此您可以將它與上述任何模組系統 (module system) 一起使用。 對於 Kotlin/JS 的大多數使用案例，建議使用 Gradle 依賴項 (dependency) `kotlin-stdlib-js`，它也可以在 NPM 上作為 [`kotlin`](https://www.npmjs.com/package/kotlin) 套件使用。

  ```