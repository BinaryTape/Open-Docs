[//]: # (title: JavaScriptモジュール)

Kotlinプロジェクトを、さまざまな一般的なモジュールシステム向けのJavaScriptモジュールとしてコンパイルできます。現在、JavaScriptモジュールに対して以下の設定をサポートしています。

- [Unified Module Definitions (UMD)](https://github.com/umdjs/umd): *AMD*と*CommonJS*の両方と互換性があります。UMDモジュールは、インポートされなくても、またはモジュールシステムが存在しない場合でも実行できます。これは`browser`および`nodejs`ターゲットのデフォルトオプションです。
- [Asynchronous Module Definitions (AMD)](https://github.com/amdjs/amdjs-api/wiki/AMD): 特に[RequireJS](https://requirejs.org/)ライブラリで利用されます。
- [CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1): Node.js/npmで広く使用されています（`require`関数と`module.exports`オブジェクト）。
- Plain (プレーン): いかなるモジュールシステム用にもコンパイルしません。モジュールはグローバルスコープ内でその名前でアクセスできます。

## ブラウザターゲット

コードをウェブブラウザ環境で実行し、UMD以外のモジュールシステムを使用したい場合、`webpackTask`設定ブロックで希望するモジュールタイプを指定できます。例えば、CommonJSに切り替えるには、以下を使用します。

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

Webpackは、CommonJSの2つの異なるフレーバー、`commonjs`と`commonjs2`を提供しており、これらは宣言が利用可能になる方法に影響を与えます。ほとんどの場合、生成されるライブラリに`module.exports`構文を追加する`commonjs2`が望ましいでしょう。あるいは、CommonJS仕様に厳密に準拠する`commonjs`オプションを選択することもできます。`commonjs`と`commonjs2`の違いについてさらに学習するには、[Webpackリポジトリ](https://github.com/webpack/webpack/issues/1114)を参照してください。

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

> これは`webpackTask.output.libraryTarget`の調整とは異なります。ライブラリターゲットは、（コードがすでにコンパイルされた後の）_webpackによって生成される_出力を変更します。`compilerOptions.moduleKind`は、_Kotlinコンパイラによって生成される_出力を変更します。
>
{style="note"}

Kotlin Gradle DSLでは、CommonJSモジュール種別を設定するためのショートカットも用意されています。

```kotlin
kotlin {
    js {
        useCommonJs()
        // ...
    }
}
```

## @JsModuleアノテーション

`external`なクラス、パッケージ、関数、またはプロパティがJavaScriptモジュールであることをKotlinに伝えるには、`@JsModule`アノテーションを使用します。"hello"というCommonJSモジュールが以下のようにあるとします。

```javascript
module.exports.sayHello = function (name) { alert("Hello, " + name); }
```

Kotlinでは、次のように宣言する必要があります。

```kotlin
@JsModule("hello")
external fun sayHello(name: String)
```

### @JsModuleをパッケージに適用する

JavaScriptライブラリの中には、関数やクラスの代わりにパッケージ（名前空間）をエクスポートするものがあります。
JavaScriptの観点から見ると、それはクラス、関数、プロパティである*メンバー*を持つ*オブジェクト*です。
これらのパッケージをKotlinオブジェクトとしてインポートすると、不自然に見えることがよくあります。
コンパイラは、インポートされたJavaScriptパッケージをKotlinパッケージに、以下の記法を使用してマッピングできます。

```kotlin
@file:JsModule("extModule")

package ext.jspackage.name

external fun foo()

external class C
```

対応するJavaScriptモジュールが次のように宣言されている場合です。

```javascript
module.exports = {
  foo: { /* some code here */ },
  C: { /* some code here */ }
}
```

`@file:JsModule`アノテーションでマークされたファイルは、非`external`メンバーを宣言できません。
以下の例は、コンパイル時エラーを生成します。

```kotlin
@file:JsModule("extModule")

package ext.jspackage.name

external fun foo()

fun bar() = "!" + foo() + "!" // error here
```

### より深いパッケージ階層のインポート

前の例では、JavaScriptモジュールは単一のパッケージをエクスポートしていました。
しかし、一部のJavaScriptライブラリは、単一モジュール内から複数のパッケージをエクスポートします。
このケースもKotlinでサポートされていますが、インポートする各パッケージごとに新しい`.kt`ファイルを宣言する必要があります。

例えば、例を少し複雑にしてみましょう。

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

と

```kotlin
@file:JsModule("extModule")
@file:JsQualifier("mylib.pkg2")

package extlib.pkg2

external fun baz()
```

### @JsNonModuleアノテーション

宣言が`@JsModule`としてマークされている場合、JavaScriptモジュールとしてコンパイルしない限り、Kotlinコードからそれを使用することはできません。
通常、開発者はライブラリをJavaScriptモジュールとしてだけでなく、ダウンロード可能な`.js`ファイルとしても配布します。これらはプロジェクトの静的リソースにコピーして`<script>`タグを介してインクルードできます。
`@JsModule`宣言を非モジュール環境で使用しても問題ないことをKotlinに伝えるには、`@JsNonModule`アノテーションを追加します。例えば、以下のJavaScriptコードを考えます。

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

### Kotlin標準ライブラリが使用するモジュールシステム

Kotlinは、Kotlin/JS標準ライブラリを単一ファイルとして配布しています。これはそれ自体がUMDモジュールとしてコンパイルされているため、上記のどのモジュールシステムでも使用できます。Kotlin/JSのほとんどのユースケースでは、NPMで[`kotlin`](https://www.npmjs.com/package/kotlin)パッケージとしても利用可能な`kotlin-stdlib-js`へのGradle依存関係を使用することをお勧めします。