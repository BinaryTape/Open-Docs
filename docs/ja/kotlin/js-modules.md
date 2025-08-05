[//]: # (title: JavaScriptモジュール)

Kotlinプロジェクトを様々な人気モジュールシステム向けのJavaScriptモジュールにコンパイルできます。現在、JavaScriptモジュール向けに以下の設定をサポートしています。

- [Unified Module Definitions (UMD)](https://github.com/umdjs/umd)。これは*AMD*と*CommonJS*の両方と互換性があります。UMDモジュールは、インポートなしでも、またはモジュールシステムが存在しない場合でも実行可能です。これは`browser`および`nodejs`ターゲットのデフォルトオプションです。
- [Asynchronous Module Definitions (AMD)](https://github.com/amdjs/amdjs-api/wiki/AMD)。特に[RequireJS](https://requirejs.org/)ライブラリで使用されます。
- [CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1)。Node.js/npmで広く使用されています（`require`関数および`module.exports`オブジェクト）。
- Plain（プレーン）。どのモジュールシステム用にもコンパイルしません。グローバルスコープでモジュール名を使ってモジュールにアクセスできます。

## ブラウザターゲット

ウェブブラウザ環境でコードを実行し、UMD以外のモジュールシステムを使用したい場合、`webpackTask`設定ブロックで目的のモジュールタイプを指定できます。例えば、CommonJSに切り替えるには、以下を使用します。

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

WebpackはCommonJSの2つの異なるフレーバー、`commonjs`と`commonjs2`を提供しており、これらは宣言が利用可能になる方法に影響します。ほとんどの場合、生成されるライブラリに`module.exports`構文を追加する`commonjs2`を推奨します。あるいは、CommonJS仕様に厳密に準拠する`commonjs`オプションを選択することもできます。`commonjs`と`commonjs2`の違いについて詳しくは、[Webpackリポジトリ](https://github.com/webpack/webpack/issues/1114)を参照してください。

## JavaScriptライブラリとNode.jsファイル

JavaScriptまたはNode.js環境で使用するライブラリを作成しており、異なるモジュールシステムを使用したい場合、手順はわずかに異なります。

### ターゲットモジュールシステムの選択

ターゲットモジュールシステムを選択するには、Gradleビルドスクリプトで`moduleKind`コンパイラオプションを設定します。

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

利用可能な値は、`umd`（デフォルト）、`commonjs`、`amd`、`plain`です。

> これは`webpackTask.output.libraryTarget`の調整とは異なります。ライブラリターゲットは、_(コードが既にコンパイルされた後で) webpackによって生成される_出力_を変更します。`compilerOptions.moduleKind`は、_Kotlinコンパイラによって生成される_出力を変更します。
> {style="note"}

Kotlin Gradle DSLには、CommonJSモジュール種別を設定するためのショートカットもあります。

```kotlin
kotlin {
    js {
        useCommonJs()
        // ...
    }
}
```

## @JsModuleアノテーション

`external`なクラス、パッケージ、関数、またはプロパティがJavaScriptモジュールであることをKotlinに伝えるには、`@JsModule`アノテーションを使用します。例えば、「hello」というCommonJSモジュールがあると考えてください。

```javascript
module.exports.sayHello = function (name) { alert("Hello, " + name); }
```

Kotlinでは次のように宣言します。

```kotlin
@JsModule("hello")
external fun sayHello(name: String)
```

### パッケージに@JsModuleを適用する

一部のJavaScriptライブラリは、関数やクラスではなく、パッケージ（名前空間）をエクスポートします。JavaScriptの観点では、これはクラス、関数、プロパティである*メンバー*を持つ*オブジェクト*です。これらのパッケージをKotlinオブジェクトとしてインポートすると、不自然に見えることがあります。コンパイラは、インポートされたJavaScriptパッケージをKotlinパッケージに以下の記法でマッピングできます。

```kotlin
@file:JsModule("extModule")

package ext.jspackage.name

external fun foo()

external class C
```

対応するJavaScriptモジュールは次のように宣言されます。

```javascript
module.exports = {
  foo: { /* some code here */ },
  C: { /* some code here */ }
}
```

`@file:JsModule`アノテーションでマークされたファイルは、非`external`メンバーを宣言できません。以下の例はコンパイル時エラーを生成します。

```kotlin
@file:JsModule("extModule")

package ext.jspackage.name

external fun foo()

fun bar() = "!" + foo() + "!" // error here
```

### より深いパッケージ階層のインポート

前の例では、JavaScriptモジュールは単一のパッケージをエクスポートしていました。しかし、一部のJavaScriptライブラリはモジュール内から複数のパッケージをエクスポートします。このケースもKotlinでサポートされていますが、インポートするパッケージごとに新しい`.kt`ファイルを宣言する必要があります。

例えば、もう少し複雑な例を見てみましょう。

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

このモジュールをKotlinにインポートするには、2つのKotlinソースファイルを記述する必要があります。

```kotlin
@file:JsModule("extModule")
@file:JsQualifier("mylib.pkg1")

package extlib.pkg1

external fun foo()

external fun bar()
```

および

```kotlin
@file:JsModule("extModule")
@file:JsQualifier("mylib.pkg2")

package extlib.pkg2

external fun baz()
```

### @JsNonModuleアノテーション

宣言が`@JsModule`としてマークされている場合、それをJavaScriptモジュールにコンパイルしないとKotlinコードから使用できません。通常、開発者はライブラリをJavaScriptモジュールとしても、プロジェクトの静的リソースにコピーして`<script>`タグ経由でインクルードできるダウンロード可能な`.js`ファイルとしても配布します。非モジュール環境から`@JsModule`宣言を使用しても問題ないことをKotlinに伝えるには、`@JsNonModule`アノテーションを追加します。例えば、以下のJavaScriptコードを考えてみましょう。

```javascript
function topLevelSayHello (name) { alert("Hello, " + name); }

if (module && module.exports) {
  module.exports = topLevelSayHello;
}
```

Kotlinからは次のように記述できます。

```kotlin
@JsModule("hello")
@JsNonModule
@JsName("topLevelSayHello")
external fun sayHello(name: String)
```

### Kotlin標準ライブラリで使用されるモジュールシステム

KotlinはKotlin/JS標準ライブラリとして単一のファイルで配布されており、それ自体がUMDモジュールとしてコンパイルされているため、上記のどのモジュールシステムでも使用できます。Kotlin/JSのほとんどのユースケースでは、`kotlin-stdlib-js`へのGradle依存関係を使用することをお勧めします。これはNPMでも[`kotlin`](https://www.npmjs.com/package/kotlin)パッケージとして利用可能です。