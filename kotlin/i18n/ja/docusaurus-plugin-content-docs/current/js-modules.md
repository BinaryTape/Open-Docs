---
title: JavaScriptモジュール
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Kotlinプロジェクトは、さまざまな一般的なモジュールシステムに対応したJavaScriptモジュールにコンパイルできます。現在、JavaScriptモジュールに対して以下の構成をサポートしています。

- [*AMD*と*CommonJS*の両方に対応する[Unified Module Definitions (UMD)](https://github.com/umdjs/umd)。
    UMDモジュールは、インポートなしで、またはモジュールシステムが存在しない場合でも実行できます。これは、`browser`および`nodejs`ターゲットのデフォルトオプションです。
- 特に[RequireJS](https://requirejs.org/)ライブラリで使用される[Asynchronous Module Definitions (AMD)](https://github.com/amdjs/amdjs-api/wiki/AMD)。
- Node.js/npmで広く使用されている[CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1)
   (`require`関数と`module.exports`オブジェクト)。
- プレーン。モジュールシステム用にコンパイルしません。グローバルスコープでモジュール名を使用してアクセスできます。

## ブラウザターゲット

Webブラウザ環境でコードを実行し、UMD以外のモジュールシステムを使用する場合は、`webpackTask`構成ブロックで目的のモジュールタイプを指定できます。たとえば、CommonJSに切り替えるには、次のようにします。

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

Webpackは、CommonJSの2つの異なる種類、`commonjs`と`commonjs2`を提供します。これらは宣言の利用方法に影響を与えます。ほとんどの場合、生成されたライブラリに`module.exports`構文を追加する`commonjs2`を使用することをお勧めします。または、CommonJS仕様に厳密に準拠する`commonjs`オプションを選択することもできます。`commonjs`と`commonjs2`の違いについて詳しくは、[Webpackリポジトリ](https://github.com/webpack/webpack/issues/1114)を参照してください。

## JavaScriptライブラリとNode.jsファイル

JavaScriptまたはNode.js環境で使用するためのライブラリを作成し、別のモジュールシステムを使用する場合は、手順が少し異なります。

### ターゲットモジュールシステムの選択

ターゲットモジュールシステムを選択するには、Gradleビルドスクリプトで`moduleKind`コンパイラオプションを設定します。

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

使用可能な値は、`umd`（デフォルト）、`commonjs`、`amd`、`plain`です。

:::note
これは、`webpackTask.output.libraryTarget`の調整とは異なります。ライブラリターゲットは、（コードがすでにコンパイルされた後）_webpackによって生成される_出力を変更します。`compilerOptions.moduleKind`は、_Kotlinコンパイラによって_生成される出力を変更します。

:::

Kotlin Gradle DSLには、CommonJSモジュール種類を設定するためのショートカットもあります。

```kotlin
kotlin {
    js {
        useCommonJs()
        // ...
    }
}
```

## @JsModule アノテーション

`external`なクラス、パッケージ、関数、またはプロパティがJavaScriptモジュールであることをKotlinに伝えるには、`@JsModule`アノテーションを使用できます。 "hello"というCommonJSモジュールがあるとします。

```javascript
module.exports.sayHello = function (name) { alert("Hello, " + name); }
```

Kotlinでは次のように宣言する必要があります。

```kotlin
@JsModule("hello")
external fun sayHello(name: String)
```

### パッケージへの@JsModuleの適用

一部のJavaScriptライブラリは、関数やクラスではなくパッケージ（名前空間）をエクスポートします。
JavaScriptの観点から見ると、これはクラス、関数、およびプロパティである*メンバー*を持つ*オブジェクト*です。
これらのパッケージをKotlinオブジェクトとしてインポートすると、不自然に見えることがよくあります。
コンパイラーは、次の表記を使用して、インポートされたJavaScriptパッケージをKotlinパッケージにマップできます。

```kotlin
@file:JsModule("extModule")

package ext.jspackage.name

external fun foo()

external class C
```

対応するJavaScriptモジュールが次のように宣言されている場合：

```javascript
module.exports = {
  foo: { /* some code here */ },
  C: { /* some code here */ }
}
```

`@file:JsModule`アノテーションでマークされたファイルは、非externalメンバーを宣言できません。
次の例は、コンパイル時エラーを生成します。

```kotlin
@file:JsModule("extModule")

package ext.jspackage.name

external fun foo()

fun bar() = "!" + foo() + "!" // error here
```

### より深いパッケージ階層のインポート

前の例では、JavaScriptモジュールは単一のパッケージをエクスポートしています。
ただし、一部のJavaScriptライブラリは、モジュール内から複数のパッケージをエクスポートします。
このケースはKotlinでもサポートされていますが、インポートするパッケージごとに新しい`.kt`ファイルを宣言する必要があります。

たとえば、例をもう少し複雑にしてみましょう。

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

このモジュールをKotlinにインポートするには、2つのKotlinソースファイルを作成する必要があります。

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

### @JsNonModule アノテーション

宣言が`@JsModule`としてマークされている場合、JavaScriptモジュールにコンパイルしない場合、Kotlinコードからそれを使用できません。
通常、開発者はJavaScriptモジュールとダウンロード可能な`.js`ファイルの両方としてライブラリを配布します。これらのファイルは、プロジェクトの静的リソースにコピーして、`<script>`タグを介して含めることができます。 `@JsModule`宣言を非モジュール環境から使用しても問題ないことをKotlinに伝えるには、`@JsNonModule`アノテーションを追加します。たとえば、次のJavaScriptコードについて考えてみます。

```javascript
function topLevelSayHello (name) { alert("Hello, " + name); }

if (module && module.exports) {
  module.exports = topLevelSayHello;
}
```

次のようにKotlinから記述できます。

```kotlin
@JsModule("hello")
@JsNonModule
@JsName("topLevelSayHello")
external fun sayHello(name: String)
```

### Kotlin標準ライブラリで使用されるモジュールシステム

Kotlinは、Kotlin/JS標準ライブラリとともに単一のファイルとして配布され、それ自体がUMDモジュールとしてコンパイルされているため、上記のどのモジュールシステムでも使用できます。 Kotlin/JSのほとんどのユースケースでは、NPMで[`kotlin`](https://www.npmjs.com/package/kotlin)パッケージとして入手可能な`kotlin-stdlib-js`へのGradle依存関係を使用することをお勧めします。