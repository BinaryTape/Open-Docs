[//]: # (title: npmからの依存関係の使用)

Kotlin/JSプロジェクトでは、すべての依存関係をGradleプラグインを通じて管理できます。これには、`kotlinx.coroutines`、`kotlinx.serialization`、`ktor-client`といったKotlin/Multiplatformライブラリも含まれます。

[npm](https://www.npmjs.com/)からのJavaScriptパッケージに依存する場合、Gradle DSLは`npm`関数を公開しており、これによりnpmからインポートしたいパッケージを指定できます。[`is-sorted`](https://www.npmjs.com/package/is-sorted)というNPMパッケージのインポートを考えてみましょう。

Gradleビルドファイルにおける対応する箇所は次のようになります。

```kotlin
dependencies {
    // ...
    implementation(npm("is-sorted", "1.0.5"))
}
```

JavaScriptモジュールは通常、動的に型付けされており、Kotlinは静的に型付けされた言語であるため、ある種のアダプターを提供する必要があります。Kotlinでは、このようなアダプターは_外部宣言_と呼ばれます。`is-sorted`パッケージは1つの関数のみを提供するため、この宣言は簡単に記述できます。ソースフォルダー内に`is-sorted.kt`という新しいファイルを作成し、以下の内容を記述します。

```kotlin
@JsModule("is-sorted")
@JsNonModule
external fun <T> sorted(a: Array<T>): Boolean
```

CommonJSをターゲットとして使用している場合、`@JsModule`および`@JsNonModule`アノテーションはそれに応じて調整する必要があることに注意してください。

このJavaScript関数は、通常のKotlin関数と同じように使用できます。ヘッダーファイルに型情報を提供したため（単にパラメーターと戻り値の型を`dynamic`として定義するのではなく）、適切なコンパイラーサポートと型チェックも利用できます。

```kotlin
console.log("Hello, Kotlin/JS!")
console.log(sorted(arrayOf(1,2,3)))
console.log(sorted(arrayOf(3,1,2)))
```

これらの3行をブラウザまたはNode.jsで実行すると、`sorted`への呼び出しが`is-sorted`パッケージによってエクスポートされた関数に適切にマッピングされていることが出力に示されます。

```kotlin
Hello, Kotlin/JS!
true
false
```

JavaScriptエコシステムには、パッケージ内で関数を公開する複数の方法（たとえば、名前付きエクスポートやデフォルトエクスポートなど）があるため、他のnpmパッケージでは、外部宣言の構造をわずかに変更する必要がある場合があります。

宣言の記述方法についてさらに学ぶには、[KotlinからJavaScriptを呼び出す](js-interop.md)を参照してください。