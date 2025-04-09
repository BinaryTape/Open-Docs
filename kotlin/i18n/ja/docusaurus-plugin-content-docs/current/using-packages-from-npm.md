---
title: "npm の依存関係を使用する"
---
Kotlin/JS プロジェクトでは、すべての依存関係を Gradle プラグインを通じて管理できます。これには、`kotlinx.coroutines`、`kotlinx.serialization`、または `ktor-client` などの Kotlin/Multiplatform ライブラリが含まれます。

[npm](https://www.npmjs.com/) から JavaScript パッケージに依存する場合、Gradle DSL は `npm` 関数を公開します。これにより、npm からインポートするパッケージを指定できます。[`is-sorted`](https://www.npmjs.com/package/is-sorted) という NPM パッケージのインポートについて考えてみましょう。

Gradle ビルドファイル内の対応する部分は次のようになります。

```kotlin
dependencies {
    // ...
    implementation(npm("is-sorted", "1.0.5"))
}
```

JavaScript モジュールは通常、動的に型付けされ、Kotlin は静的に型付けされた言語であるため、一種のアダプターを提供する必要があります。Kotlin では、このようなアダプターは _外部宣言_ と呼ばれます。1 つの関数のみを提供する `is-sorted` パッケージの場合、この宣言は記述するのにわずかな労力で済みます。ソースフォルダー内に `is-sorted.kt` という新しいファイルを作成し、次の内容を入力します。

```kotlin
@JsModule("is-sorted")
@JsNonModule
external fun <T> sorted(a: Array<T>): Boolean
```

CommonJS をターゲットとして使用している場合、`@JsModule` および `@JsNonModule` アノテーションを適宜調整する必要があることに注意してください。

この JavaScript 関数は、通常の Kotlin 関数とまったく同じように使用できるようになりました。ヘッダーファイルで型情報を提供したため（パラメーターと戻り値の型を単に `dynamic` と定義するのとは対照的に）、適切なコンパイラーサポートと型チェックも利用できます。

```kotlin
console.log("Hello, Kotlin/JS!")
console.log(sorted(arrayOf(1,2,3)))
console.log(sorted(arrayOf(3,1,2)))
```

これらの 3 行をブラウザーまたは Node.js のいずれかで実行すると、出力は `sorted` の呼び出しが `is-sorted` パッケージによってエクスポートされた関数に適切にマッピングされたことを示しています。

```kotlin
Hello, Kotlin/JS!
true
false
```

JavaScript エコシステムには、パッケージ内で関数を公開する複数の方法があるため（たとえば、名前付きエクスポートまたはデフォルトエクスポートを通じて）、他の npm パッケージでは、外部宣言の構造をわずかに変更する必要がある場合があります。

宣言の記述方法の詳細については、[Calling JavaScript from Kotlin](js-interop) を参照してください。