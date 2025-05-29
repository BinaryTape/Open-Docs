[//]: # (title: Kotlin/JS プロジェクトを IR コンパイラに移行する)

私たちは、すべてのプラットフォームでKotlinの挙動を統一し、新しいJS固有の最適化を実装することなどを目的として、古いKotlin/JSコンパイラを[IRベースのコンパイラ](js-ir-compiler.md)に置き換えました。
これら2つのコンパイラの内部的な違いについては、Sebastian Aigner氏によるブログ記事[Migrating our Kotlin/JS app to the new IR compiler](https://dev.to/kotlin/migrating-our-kotlin-js-app-to-the-new-ir-compiler-3o6i)で詳しく学ぶことができます。

コンパイラ間の著しい違いにより、Kotlin/JSプロジェクトを古いバックエンドから新しいバックエンドに切り替えるには、コードの調整が必要になる場合があります。このページでは、既知の移行問題とその解決策のリストをまとめました。

> [Kotlin/JS Inspection pack](https://plugins.jetbrains.com/plugin/17183-kotlin-js-inspection-pack/)プラグインをインストールすると、移行中に発生する問題の一部を修正するための役立つヒントが得られます。
>
{style="tip"}

このガイドは、問題の修正や新しい問題の発見に伴い、時間の経過とともに変更される可能性があることに注意してください。このガイドを完全な状態に保つため、ご協力をお願いします。IRコンパイラへの切り替え時に遭遇した問題は、課題トラッカー[YouTrack](https://kotl.in/issue)に提出するか、[このフォーム](https://surveys.jetbrains.com/s3/ir-be-migration-issue)に記入して報告してください。

## JSおよびReact関連のクラスとインターフェースをexternalインターフェースに変換する

**問題**: Reactの`State`や`Props`など、純粋なJSクラスから派生したKotlinインターフェースおよびクラス（データクラスを含む）を使用すると、`ClassCastException`が発生する可能性があります。このような例外は、実際にはJSから来ているにもかかわらず、コンパイラがこれらのクラスのインスタンスをKotlinオブジェクトであるかのように扱おうとするために発生します。

**解決策**: 純粋なJSクラスから派生するすべてのクラスとインターフェースを[externalインターフェース](js-interop.md#external-interfaces)に変換します。

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

IntelliJ IDEAでは、これらの[構造検索と置換](https://www.jetbrains.com/help/idea/structural-search-and-replace.html)テンプレートを使用して、インターフェースを自動的に`external`としてマークできます。
* [Template for `State`](https://gist.github.com/SebastianAigner/62119536f24597e630acfdbd14001b98)
* [Template for `Props`](https://gist.github.com/SebastianAigner/a47a77f5e519fc74185c077ba12624f9)

## externalインターフェースのプロパティをvarに変換する

**問題**: Kotlin/JSコードのexternalインターフェースのプロパティは、読み取り専用（`val`）プロパティにすることはできません。なぜなら、それらの値は`js()`または`jso()`（[`kotlin-wrappers`](https://github.com/JetBrains/kotlin-wrappers)のヘルパー関数）でオブジェクトが作成された後にのみ代入できるためです。

```kotlin
import kotlinx.js.jso

val myState = jso<CustomComponentState>()
myState.name = "name"
```

**解決策**: externalインターフェースのすべてのプロパティを`var`に変換します。

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

## externalインターフェース内のレシーバー付き関数を通常の関数に変換する

**問題**: external宣言は、拡張関数や対応する関数型を持つプロパティなど、レシーバー付き関数を含むことはできません。

**解決策**: そのような関数とプロパティを、レシーバーオブジェクトを引数として追加することで、通常の関数に変換します。

```kotlin
// Replace this
external interface ButtonProps : Props {
   var inside: StyledDOMBuilder<BUTTON>.() -> Unit
}
```

```kotlin
external interface ButtonProps : Props {
   var inside: (StyledDOMBuilder<BUTTON>) -> Unit
}
```

## 相互運用性のためにプレーンなJSオブジェクトを作成する

**問題**: externalインターフェースを実装するKotlinオブジェクトのプロパティは、_列挙可能_ではありません。これは、たとえば以下のような、オブジェクトのプロパティを反復処理する操作に対してそれらが見えないことを意味します。
* `for (var name in obj)`
* `console.log(obj)`
* `JSON.stringify(obj)`

しかし、それらは名前（例：`obj.myProperty`）でアクセスすることは引き続き可能です。

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

**解決策1**: `js()`または`jso()`（[`kotlin-wrappers`](https://github.com/JetBrains/kotlin-wrappers)のヘルパー関数）を使用して、プレーンなJavaScriptオブジェクトを作成します。

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

**解決策2**: `kotlin.js.json()`でオブジェクトを作成します。

```kotlin
// or with this
val jsonApp = kotlin.js.json(Pair("name", "App1")) as AppProps
```

## 関数参照に対するtoString()呼び出しを.nameに置き換える

**問題**: IRバックエンドでは、関数参照に対して`toString()`を呼び出しても一意の値が生成されません。

**解決策**: `toString()`の代わりに`name`プロパティを使用します。

## ビルドスクリプトでbinaries.executable()を明示的に指定する

**問題**: コンパイラが実行可能な`.js`ファイルを生成しません。

これは、デフォルトのコンパイラはデフォルトでJavaScript実行可能ファイルを生成する一方で、IRコンパイラはこれを行うための明示的な指示を必要とするために発生する可能性があります。詳細については、[Kotlin/JSプロジェクトセットアップ手順](js-project-setup.md#execution-environments)を参照してください。

**解決策**: プロジェクトの`build.gradle(.kts)`に`binaries.executable()`の行を追加します。

```kotlin
kotlin {
    js(IR) {
        browser {
        }
        binaries.executable()
    }
}
```

## Kotlin/JS IRコンパイラを使用する際のその他のトラブルシューティングのヒント

これらのヒントは、Kotlin/JS IRコンパイラを使用しているプロジェクトで問題のトラブルシューティングを行う際に役立つかもしれません。

### externalインターフェースのブーリアンプロパティをnull許容にする

**問題**: externalインターフェースの`Boolean`に対して`toString`を呼び出すと、`Uncaught TypeError: Cannot read properties of undefined (reading 'toString')`のようなエラーが発生します。JavaScriptはブーリアン変数の`null`または`undefined`の値を`false`として扱います。もし（例えば、制御できないJavaScriptコードからコードが呼び出される場合など）`null`または`undefined`である可能性がある`Boolean`に対して`toString`を呼び出すことに依存している場合、これに注意してください。

```kotlin
external interface SomeExternal {
    var visible: Boolean
}

fun main() {
    val empty: SomeExternal = js("{}")
    println(empty.visible.toString()) // Uncaught TypeError: Cannot read properties of undefined (reading 'toString')
}
```

**解決策**: externalインターフェースの`Boolean`プロパティをnull許容（`Boolean?`）にすることができます。

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