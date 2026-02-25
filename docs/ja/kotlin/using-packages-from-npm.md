[//]: # (title: npmの依存関係を使用する)

Kotlin/JSプロジェクトでは、すべての依存関係をGradleプラグインを通じて管理できます。これには、`kotlinx.coroutines`、`kotlinx.serialization`、`ktor-client`などのKotlin/マルチプラットフォーム（Kotlin/Multiplatform）ライブラリが含まれます。

[npm](https://www.npmjs.com/)のJavaScriptパッケージに依存する場合、Gradle DSLはnpmからインポートしたいパッケージを指定できる`npm`関数を提供しています。例として、[`is-sorted`](https://www.npmjs.com/package/is-sorted)という名前のnpmパッケージをインポートする場合を考えてみましょう。

Gradleビルドファイルの対応する部分は次のようになります。

```kotlin
dependencies {
    // ...
    implementation(npm("is-sorted", "1.0.5"))
}
```

JavaScriptモジュールは通常動的に型付けされますが、Kotlinは静的型付け言語であるため、ある種のアダプターを提供する必要があります。Kotlinでは、このようなアダプターは「外部宣言 (external declarations)」と呼ばれます。1つの関数のみを提供する`is-sorted`パッケージの場合、この宣言の記述はわずかです。ソースフォルダ内に`is-sorted.kt`という新しいファイルを作成し、以下の内容を記述します。

```kotlin
@JsModule("is-sorted")
@JsNonModule
external fun <T> sorted(a: Array<T>): Boolean
```

CommonJSをターゲットとして使用している場合は、それに応じて`@JsModule`および`@JsNonModule`アノテーションを調整する必要があることに注意してください。

このJavaScript関数は、通常のKotlin関数と同じように使用できるようになります。（パラメータや戻り値の型を単に`dynamic`と定義するのではなく）ヘッダーファイルで型情報を提供したため、適切なコンパイラサポートと型チェックも利用可能です。

```kotlin
console.log("Hello, Kotlin/JS!")
console.log(sorted(arrayOf(1,2,3)))
console.log(sorted(arrayOf(3,1,2)))
```

これら3行をブラウザまたはNode.jsで実行すると、出力は`sorted`への呼び出しが`is-sorted`パッケージによってエクスポートされた関数に適切にマッピングされたことを示します。

```kotlin
Hello, Kotlin/JS!
true
false
```

JavaScriptのエコシステムには、パッケージ内で関数を公開する方法が複数あるため（例えば、名前付きエクスポートやデフォルトエクスポートなど）、他のnpmパッケージでは外部宣言に少し異なる構造が必要になる場合があります。

宣言の書き方の詳細については、[KotlinからJavaScriptを呼び出す](js-interop.md)を参照してください。