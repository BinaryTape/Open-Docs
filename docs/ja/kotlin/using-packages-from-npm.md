[//]: # (title: npmからの依存関係を利用する)

Kotlin/JSプロジェクトでは、すべての依存関係をGradleプラグインを通じて管理できます。これには、`kotlinx.coroutines`、`kotlinx.serialization`、`ktor-client`などのKotlin/Multiplatformライブラリが含まれます。

[npm](https://www.npmjs.com/)からのJavaScriptパッケージに依存する場合、Gradle DSLは、npmからインポートしたいパッケージを指定できる`npm`関数を提供しています。[`is-sorted`](https://www.npmjs.com/package/is-sorted)というNPMパッケージのインポートを考えてみましょう。

Gradleビルドファイルの対応する部分は次のようになります。

```kotlin
dependencies {
    // ...
    implementation(npm("is-sorted", "1.0.5"))
}
```

JavaScriptモジュールは通常動的に型付けされ、Kotlinは静的に型付けされた言語であるため、ある種のアダプターを提供する必要があります。Kotlinでは、このようなアダプターは_外部宣言_と呼ばれます。`is-sorted`パッケージは1つの関数しか提供しないため、この宣言は簡単に記述できます。ソースフォルダ内に`is-sorted.kt`という新しいファイルを作成し、以下の内容を記述します。

```kotlin
@JsModule("is-sorted")
@JsNonModule
external fun <T> sorted(a: Array<T>): Boolean
```

なお、CommonJSをターゲットとして使用している場合、`@JsModule`および`@JsNonModule`アノテーションはそれに応じて調整する必要があります。

このJavaScript関数は、通常のKotlin関数と同じように使用できるようになります。ヘッダーファイルで型情報を提供したため（単にパラメーターと戻り値の型を`dynamic`として定義するのではなく）、適切なコンパイラのサポートと型チェックも利用できます。

```kotlin
console.log("Hello, Kotlin/JS!")
console.log(sorted(arrayOf(1,2,3)))
console.log(sorted(arrayOf(3,1,2)))
```

これらの3行をブラウザまたはNode.jsで実行すると、出力には、`sorted`への呼び出しが`is-sorted`パッケージによってエクスポートされた関数に適切にマッピングされたことが示されます。

```kotlin
Hello, Kotlin/JS!
true
false
```

JavaScriptエコシステムでは、パッケージ内で関数を公開する方法が複数あるため（例えば、名前付きエクスポートやデフォルトエクスポートを通じて）、他のnpmパッケージでは、外部宣言の構造をわずかに変更する必要がある場合があります。

宣言の書き方について詳しく知るには、[KotlinからJavaScriptを呼び出す](js-interop.md)を参照してください。