---
title: "Kotlin/JS プロジェクトを IR コンパイラに移行する"
---
古い Kotlin/JS コンパイラーを [IR ベースのコンパイラー](js-ir-compiler) に置き換えたのは、とりわけ、すべてのプラットフォームで Kotlin の動作を統一し、新しい JS 固有の最適化を実装できるようにするためです。2つのコンパイラー間の内部的な違いについては、Sebastian Aigner によるブログ記事 [Migrating our Kotlin/JS app to the new IR compiler](https://dev.to/kotlin/migrating-our-kotlin-js-app-to-the-new-ir-compiler-3o6i) を参照してください。

コンパイラー間の大きな違いにより、Kotlin/JS プロジェクトを古いバックエンドから新しいバックエンドに切り替えるには、コードの調整が必要になる場合があります。このページでは、既知の移行の問題と推奨される解決策をまとめました。

:::tip
[Kotlin/JS Inspection pack](https://plugins.jetbrains.com/plugin/17183-kotlin-js-inspection-pack/) プラグインをインストールすると、移行中に発生するいくつかの問題を修正する方法に関する貴重なヒントが得られます。

:::

このガイドは、問題の修正や新しい問題の発見に伴い、時間の経過とともに変更される可能性があることに注意してください。完全な状態を保つためにご協力ください。IR コンパイラーへの切り替え時に発生した問題は、課題追跡システム [YouTrack](https://kotl.in/issue) に送信するか、[このフォーム](https://surveys.jetbrains.com/s3/ir-be-migration-issue) に記入して報告してください。

## JS および React 関連のクラスとインターフェースを external interface に変換する

**問題**: React の `State` や `Props` などの純粋な JS クラスから派生した Kotlin のインターフェースとクラス (data class を含む) を使用すると、`ClassCastException` が発生する可能性があります。このような例外は、コンパイラーがこれらのクラスのインスタンスを、実際には JS から来たものであるにもかかわらず、Kotlin オブジェクトであるかのように処理しようとするために発生します。

**解決策**: 純粋な JS クラスから派生したすべてのクラスとインターフェースを [external interface](js-interop#external-interfaces) に変換します。

```kotlin
// Replace this
interface AppState : State { }
interface AppProps : Props { }
data class CustomComponentState(var name: String) : State
```

```kotlin
// With this
external interface AppState : State { }
external interface AppProps : Props { }
external interface CustomComponentState : State {
   var name: String
}
```

IntelliJ IDEA では、次の [structural search and replace](https://www.jetbrains.com/help/idea/structural-search-and-replace.html) テンプレートを使用して、インターフェースを `external` として自動的にマークできます。
* [`State` のテンプレート](https://gist.github.com/SebastianAigner/62119536f24597e630acfdbd14001b98)
* [`Props` のテンプレート](https://gist.github.com/SebastianAigner/a47a77f5e519fc74185c077ba12624f9)

## external interface のプロパティを var に変換する

**問題**: Kotlin/JS コードの external interface のプロパティは、読み取り専用 (`val`) プロパティにできません。なぜなら、それらの値は `js()` または `jso()` ([`kotlin-wrappers`](https://github.com/JetBrains/kotlin-wrappers) のヘルパー関数) でオブジェクトが作成された後にのみ割り当てることができるからです。

```kotlin
import kotlinx.js.jso

val myState = jso<CustomComponentState>()
myState.name = "name"
```

**解決策**: external interface のすべてのプロパティを `var` に変換します。

```kotlin
// Replace this
external interface CustomComponentState : State {
   val name: String
}
```

```kotlin
// With this
external interface CustomComponentState : State {
   var name: String
}
```

## external interface 内の receiver を持つ関数を通常の関数に変換する

**問題**: 外部宣言には、拡張関数や対応する関数型を持つプロパティなど、receiver を持つ関数を含めることはできません。

**解決策**: receiver オブジェクトを引数として追加して、そのような関数とプロパティを通常の関数に変換します。

```kotlin
// Replace this
external interface ButtonProps : Props {
   var inside: StyledDOMBuilder<BUTTON>.() `->` Unit
}
```

```kotlin
external interface ButtonProps : Props {
   var inside: (StyledDOMBuilder<BUTTON>) `->` Unit
}
```

## 相互運用性のためにプレーンな JS オブジェクトを作成する

**問題**: external interface を実装する Kotlin オブジェクトのプロパティは、_列挙可能_ ではありません。これは、オブジェクトのプロパティを反復処理する操作では表示されないことを意味します。例:
* `for (var name in obj)`
* `console.log(obj)`
* `JSON.stringify(obj)`

ただし、名前でアクセスできます: `obj.myProperty`

```kotlin
external interface AppProps { var name: String }
data class AppPropsImpl(override var name: String) : AppProps
fun main() {
   val jsApp = js("{name: 'App1'}") as AppProps // plain JS object
   println("Kotlin sees: ${jsApp.name}") // "App1"
   println("JSON.stringify sees:" + JSON.stringify(jsApp)) // {"name":"App1"} - OK

   val ktApp = AppPropsImpl("App2") // Kotlin object
   println("Kotlin sees: ${ktApp.name}") // "App2"
   // JSON sees only the backing field, not the property
   println("JSON.stringify sees:" + JSON.stringify(ktApp)) // {"_name_3":"App2"}
}
```

**解決策 1**: `js()` または `jso()` ([`kotlin-wrappers`](https://github.com/JetBrains/kotlin-wrappers) のヘルパー関数) でプレーンな JavaScript オブジェクトを作成します。

```kotlin
external interface AppProps { var name: String }
data class AppPropsImpl(override var name: String) : AppProps
```

```kotlin
// Replace this
val ktApp = AppPropsImpl("App1") // Kotlin object
```

```kotlin
// With this
val jsApp = js("{name: 'App1'}") as AppProps // or jso {}
```

**解決策 2**: `kotlin.js.json()` でオブジェクトを作成します。

```kotlin
// or with this
val jsonApp = kotlin.js.json(Pair("name", "App1")) as AppProps
```

## 関数参照に対する toString() の呼び出しを .name に置き換える

**問題**: IR バックエンドでは、関数参照に対して `toString()` を呼び出しても一意の値は生成されません。

**解決策**: `toString()` の代わりに `name` プロパティを使用します。

## ビルドスクリプトで binaries.executable() を明示的に指定する

**問題**: コンパイラーが実行可能な `.js` ファイルを生成しません。

これは、デフォルトのコンパイラーがデフォルトで JavaScript 実行ファイルを生成する一方で、IR コンパイラーがこれを行うには明示的な指示が必要なために発生する可能性があります。[Kotlin/JS プロジェクトのセットアップ手順](js-project-setup#execution-environments) を参照してください。

**解決策**: プロジェクトの `build.gradle(.kts)` に `binaries.executable()` という行を追加します。

```kotlin
kotlin {
    js(IR) {
        browser {
        }
        binaries.executable()
    }
}
```

## Kotlin/JS IR コンパイラーを使用する際の追加のトラブルシューティングのヒント

これらのヒントは、Kotlin/JS IR コンパイラーを使用してプロジェクトの問題をトラブルシューティングする際に役立つ場合があります。

### external interface で Boolean プロパティを nullable にする

**問題**: external interface から `Boolean` に対して `toString` を呼び出すと、`Uncaught TypeError: Cannot read properties of undefined (reading 'toString')` のようなエラーが発生します。JavaScript では、ブール変数の `null` または `undefined` の値は `false` として扱われます。`null` または `undefined` になる可能性のある `Boolean` に対して `toString` を呼び出すことに依存している場合 (たとえば、コードが制御できない JavaScript コードから呼び出される場合) は、これに注意してください。

```kotlin
external interface SomeExternal {
    var visible: Boolean
}

fun main() {
    val empty: SomeExternal = js("{}")
    println(empty.visible.toString()) // Uncaught TypeError: Cannot read properties of undefined (reading 'toString')
}
```

**解決策**: external interface の `Boolean` プロパティを nullable (`Boolean?`) にすることができます。

```kotlin
// Replace this
external interface SomeExternal {
    var visible: Boolean
}
```

```kotlin
// With this
external interface SomeExternal {
    var visible: Boolean?
}
```