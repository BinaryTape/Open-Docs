[//]: # (title: Kotlin %kotlinEapVersion% の新機能)

<primary-label ref="eap"/>

<show-structure depth="1"/>

<web-summary>Kotlin Early Access Preview (EAP) のリリースノートを確認し、正式リリース前の最新の実験的 Kotlin 機能を試してみましょう。</web-summary>

_[リリース日: %kotlinEapReleaseDate%](eap.md#build-details)_

> このドキュメントは Early Access Preview (EAP) リリースのすべての機能を網羅しているわけではありませんが、主要な改善点について詳しく説明します。
>
> 変更点の完全なリストについては、[GitHub の変更履歴](https://github.com/JetBrains/kotlin/releases/tag/v%kotlinEapVersion%)を参照してください。
>
{style="note"}

Kotlin %kotlinEapVersion% がリリースされました！この EAP リリースの主な内容は以下の通りです。

* **言語**: [コンテキストパラメータの Stable 化、明示的なバッキングフィールド、およびアノテーションの使用箇所ターゲット向けの複数の機能](#stable-features)
* **標準ライブラリ**: [UUID の Stable 化](#stable-uuids-in-the-common-kotlin-standard-library) および [ソート順を確認するためのサポート](#support-for-checking-sorted-order)
* **Kotlin/JVM**: [Java 26 のサポート](#support-for-java-26) および [メタデータ内のアノテーションをデフォルトで有効化](#annotations-in-metadata-enabled-by-default)
* **Kotlin/Native**: [依存関係としての Swift パッケージのサポート、Swift export のアップデート、およびデフォルトの CMS GC](#kotlin-native)
* **Kotlin/Wasm**: [インクリメンタルコンパイルのデフォルト有効化と WebAssembly Component Model のサポート](#kotlin-wasm)
* **Kotlin/JS**: [バリュークラスのエクスポートのサポートと、JS コードインライン化における ES2015 機能のサポート](#kotlin-js)
* **Gradle**: [Gradle 9.4.1 との互換性](#gradle)
* **Maven**: [Java と JVM ターゲットバージョンの自動調整](#maven)
* **Kotlin コンパイラ**: [`.klib` コンパイル中のより一貫したインライン関数の動作](#consistent-intra-module-function-inlining-during-klib-compilation)

> Kotlin のリリースサイクルに関する情報は、[Kotlin のリリースプロセス](releases.md)を参照してください。
>
{style="tip"}

## Kotlin %kotlinEapVersion% へのアップデート

最新バージョンの Kotlin は、最新バージョンの [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) および [Android Studio](https://developer.android.com/studio) に含まれています。

新しい Kotlin バージョンにアップデートするには、IDE が最新バージョンに更新されていることを確認し、ビルドスクリプト内の [Kotlin バージョンを %kotlinEapVersion% に変更](releases.md#update-to-a-new-kotlin-version)してください。

## 新機能 {id=new-stable-features}
<primary-label ref="stable"/>

以前の Kotlin リリースでは、いくつかの新機能が実験的 (Experimental) として導入されました。以下の機能は、Kotlin %kotlinEapVersion% で [Stable (安定版)](components-stability.md#stability-levels-explained) に昇格したため、使用するためにオプトインする必要はなくなりました。

* [コンテキストパラメータ (Context parameters)](whatsnew22.md#preview-of-context-parameters)（ただし、[コンテキスト引数](#explicit-context-arguments-for-context-parameters)および [呼び出し可能参照](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md#callable-references)を除く）
* [プロパティ向けの `@all` メターゲット](whatsnew22.md#all-meta-target-for-properties)
* [使用箇所アノテーションターゲット向けの新しいデフォルトルール](whatsnew22.md#new-defaulting-rules-for-use-site-annotation-targets)
* [明示的なバッキングフィールド (Explicit backing fields)](whatsnew23.md#explicit-backing-fields)
* [共通の Kotlin 標準ライブラリにおける Stable な UUID](#stable-uuids-in-the-common-kotlin-standard-library)
* [ソート順を確認するためのサポート](#support-for-checking-sorted-order)
* [JVM 上で符号なし整数を `BigInteger` に変換するための新しい API](#new-api-for-converting-unsigned-integers-to-biginteger-on-the-jvm)
* [JavaScript/TypeScript へのバリュークラスのエクスポートのサポート](#support-for-value-class-export-to-javascript-typescript)
* [JS コードをインライン化する際の ES2015 機能のサポート](#support-for-es2015-features-when-inlining-js-code)
* [Maven: Java と JVM ターゲットバージョンの自動調整](#automatic-alignment-between-java-and-jvm-target-versions)

## 新機能 {id=new-experimental-features}
<primary-label ref="experimental-exp"/>

* [コンテキストパラメータ向けの明示的なコンテキスト引数](#explicit-context-arguments-for-context-parameters)
* [コレクションリテラルのサポート](#support-for-collection-literals)
* [改善されたコンパイル時定数](#improved-compile-time-constants)
* [Swift パッケージのインポート](#swift-package-import)
* [Swift export: コルーチンの Flow をエクスポートするためのサポート](#swift-export-support-for-exporting-coroutine-flows)
* [WebAssembly Component Model のサポート](#support-for-the-webassembly-component-model)

## 言語

Kotlin %kotlinEapVersion% では、コンテキストパラメータ、明示的なバッキングフィールド、およびアノテーションの使用箇所ターゲット機能が [Stable](components-stability.md#stability-levels-explained) に昇格しました。また、このリリースでは[コンテキストパラメータ向けの明示的なコンテキスト引数](#explicit-context-arguments-for-context-parameters)が導入されています。

### Stable な機能
<secondary-label ref="language"/>

Kotlin 2.2.0 では、いくつかの言語機能が [実験的 (Experimental)](components-stability.md#stability-levels-explained) として導入されました。本リリースにおいて、以下の言語機能が [Stable](components-stability.md#stability-levels-explained) になったことをお知らせします。

* [コンテキストパラメータ](whatsnew22.md#preview-of-context-parameters)（ただし、[コンテキスト引数](#explicit-context-arguments-for-context-parameters)および [呼び出し可能参照](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md#callable-references)を除く）
* [プロパティ向けの `@all` メターゲット](whatsnew22.md#all-meta-target-for-properties)
* [使用箇所アノテーションターゲット向けの新しいデフォルトルール](whatsnew22.md#new-defaulting-rules-for-use-site-annotation-targets)
* [明示的なバッキングフィールド](whatsnew23.md#explicit-backing-fields)

[Kotlin の言語デザイン機能と提案の全リストについてはこちらをご覧ください](kotlin-language-features-and-proposals.md)。

### コンテキストパラメータ向けの明示的なコンテキスト引数
<primary-label ref="experimental-opt-in"/>
<secondary-label ref="language"/>

Kotlin %kotlinEapVersion% では、[コンテキストパラメータ](context-parameters.md)に対して明示的なコンテキスト引数を渡せるようになりました。

Kotlin 2.3.20 では、[コンテキストパラメータのオーバーロード解決が変更されました](whatsnew2320.md#changes-to-overload-resolution-for-context-parameters)。その結果、コンテキストパラメータのみが異なるオーバーロードの呼び出しが曖昧になる可能性があります。

呼び出し側で明示的なコンテキスト引数を渡すことで、この曖昧さを解決できるようになりました。

例を以下に示します。

```kotlin
class EmailSender
class SmsSender

context(emailSender: EmailSender)
fun sendNotification() {
    println("Sent email notification")
}

context(smsSender: SmsSender)
fun sendNotification() {
    println("Sent SMS notification")
}

context(defaultEmailSender: EmailSender, defaultSmsSender: SmsSender)
fun notifyUser() {
    
    // EmailSender コンテキストパラメータを持つオーバーロードを選択します
    sendNotification(emailSender = defaultEmailSender)

    // SmsSender コンテキストパラメータを持つオーバーロードを選択します
    sendNotification(smsSender = defaultSmsSender)
}
```

また、`context()` 関数の代わりに明示的なコンテキスト引数を使用して、ネストを減らし、一部の呼び出しを読みやすくすることもできます。複数の呼び出しで同じコンテキスト引数を使用する必要がある場合は、引き続き `context()` 関数を使用してください。

この機能は [実験的 (Experimental)](components-stability.md#stability-levels-explained) です。オプトインするには、ビルドファイルに以下のコンパイラオプションを追加してください。

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xexplicit-context-arguments")
    }
}
```

</tab>
<tab title="Maven" group-key="maven">

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <configuration>
                <args>
                    <arg>-Xexplicit-context-arguments</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

詳細については、この機能の [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0448-explicit-context-arguments.md) を参照してください。

### コレクションリテラルのサポート
<primary-label ref="experimental-opt-in"/>

<secondary-label ref="language"/>

Kotlin %kotlinEapVersion% では、コレクションリテラルの実験的なサポートが導入されました。角括弧 `[]` を使用して、よりシンプルかつ簡潔にコレクションを作成できるようになりました。

例を以下に示します。

```kotlin
fun main() {
    // 明示的な型宣言を伴うミュータブルリスト
    // val shapes: MutableList<String> = mutableListOf("triangle", "square", "circle")

    // 角括弧構文を使用したミュータブルリスト
    val shapes: MutableList<String> = ["triangle", "square", "circle"]
    println(shapes)
    // [triangle, square, circle]
}
```
{validate="false"}

> 現在、コレクションリテラルを使用して Java で定義されたコレクションを構築することはできません。詳細については、[KT-80494](https://youtrack.jetbrains.com/issue/KT-80494) を参照してください。
>
{style="note"}

コンパイラがコレクションの型を推論するのに十分な情報を持っていない場合、デフォルトで `List` 型になります。

```kotlin
fun main() {
    val fruit = ["apple", "banana", "cherry"]
    
    println(fruit)
    // [apple, banana, cherry]
}
```
{validate="false"}

また、独自の型で角括弧構文を使用するために、カスタムの `operator fun of` 関数を宣言することもできます。例えば、以下のような `DoubleMatrix` クラスがある場合：

```kotlin
class DoubleMatrix(vararg val rows: Row) {
    companion object {
        operator fun of(vararg rows: Row) = DoubleMatrix(*rows)
    }
    class Row(vararg val elements: Double) {
        companion object {
            operator fun of(vararg elements: Double) = Row(*elements)
        }
    }
}
```
{validate="false"}

以下のように `identityMatrix` クラスのインスタンスを作成できます。

```kotlin
fun main() {
    val identityMatrix: DoubleMatrix = [
        [1.0, 0.0, 0.0],
        [0.0, 1.0, 0.0],
        [0.0, 0.0, 1.0],
    ]
}
```
{validate="false"}

この例では、コンパイラはネストされたコレクションリテラルを、対応する `operator fun of` 関数の呼び出しに変換します。コンパイラはこれらの呼び出しを再帰的に解決し、期待される型を使用して正しいオーバーロードを選択します。

この機能は [実験的 (Experimental)](components-stability.md#stability-levels-explained) です。オプトインするには、ビルドファイルに以下のコンパイラオプションを追加してください。

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xcollection-literals")
    }
}
```

</tab>
<tab title="Maven" group-key="maven">

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <configuration>
                <args>
                    <arg>-Xcollection-literals</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

詳細については、この機能の [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0416-collection-literals.md) を参照してください。

### 改善されたコンパイル時定数
<primary-label ref="experimental-opt-in"/>

<secondary-label ref="language"/>

Kotlin %kotlinEapVersion% では、[コンパイル時定数 (compile-time constants)](properties.md#compile-time-constants) に実験的な改善が加えられ、数値型と文字列型のサポートが一貫し、使いやすくなりました。これらの改善には以下のサポートが含まれます。

* 符号なし整数型の演算。
* `.lowercase()`、`.uppercase()`、`.trim()` 関数などの文字列用標準ライブラリ関数。
* [列挙型定数 (enum constants)](enum-classes.md#working-with-enum-constants) の `.name` プロパティおよび [`KCallable` インターフェース](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.reflect/-k-callable/) の評価。

どの関数がコンパイル時に評価されるかを明確にするために、Kotlin %kotlinEapVersion% では `IntrinsicConstEvaluation` アノテーションが導入されました。一部の関数はコンパイル時に評価されますが、まだアノテーションが付いていません。将来のリリースで残りの関数にもアノテーションが追加される予定です。サポートされている関数のリストについては、KEEP の [付録 (appendix)](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0444-improve-compile-time-constants.md#appendix) を参照してください。

この機能は [実験的 (Experimental)](components-stability.md#stability-levels-explained) です。オプトインするには、ビルドファイルに以下のコンパイラオプションを追加してください。

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-XXLanguage:+IntrinsicConstEvaluation")
    }
}
```

</tab>
<tab title="Maven" group-key="maven">

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <configuration>
                <args>
                    <arg>-XXLanguage:+IntrinsicConstEvaluation</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

詳細については、この機能の [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0444-improve-compile-time-constants.md) を参照してください。

## 標準ライブラリ

Kotlin %kotlinEapVersion% では、共通の Kotlin 標準ライブラリにおける UUID のサポートが Stable になりました。また、JVM 上で符号なし整数を `BigInteger` に変換するための新しい拡張関数と、ソート順のチェックのサポートも追加されています。

### 共通の Kotlin 標準ライブラリにおける Stable な UUID
<secondary-label ref="standard-library"/>

Kotlin 2.0.20 では、[UUID (universally unique identifiers) を生成するためのクラス](whatsnew2020.md#support-for-uuids-in-the-common-kotlin-standard-library) が導入され、Kotlin と Java の UUID 間の変換サポートが追加されました。その後のリリースで、以下のようなサポートを追加することで、この実験的機能は段階的に改善されてきました。

* [UUID の `<` および `>` 演算子による比較](whatsnew2120.md#changes-in-uuid-parsing-formatting-and-comparability)
* [ハイフン付き 16 進形式およびプレーンテキスト形式からの UUID のパース](whatsnew2120.md#changes-in-uuid-parsing-formatting-and-comparability)
* [無効な UUID をパースする際の `null` の返却](whatsnew23.md#support-for-returning-null-when-parsing-invalid-uuids)

Kotlin %kotlinEapVersion% では、[`kotlin.uuid.Uuid` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/) が [Stable](components-stability.md#stability-levels-explained) になりました。唯一の例外は [V4 および V7 UUID を生成するための関数](whatsnew23.md#support-for-generating-v7-uuids-for-specific-timestamps) で、これらは [実験的 (Experimental)](components-stability.md#stability-levels-explained) のままであり、引き続きオプトインが必要です。

### ソート順を確認するためのサポート
<secondary-label ref="standard-library"/>

Kotlin %kotlinEapVersion% では、iterable、配列、および sequence でソート順を確認するための新しい拡張関数が追加されました。

これには以下の拡張関数が含まれます。

* `.isSorted()`
* `.isSortedDescending()`
* `.isSortedWith(comparator)`
* `.isSortedBy(selector)`
* `.isSortedByDescending(selector)`

これらの拡張関数を使用すると、要素を再度ソートしたり独自のヘルパー関数を作成したりすることなく、要素が既にソートされているかどうかを確認できます。要素が指定された順序である場合、または要素が 2 つ未満の場合は `true` を返し、それ以外の場合は `false` を返します。これらの関数は、順序どおりでないペアが見つかるとすぐに停止するため、大規模な入力に対して効率的です。

`.isSorted()` および `.isSortedBy()` 関数を使用してソート順を確認する例を以下に示します。

```kotlin
data class User(val name: String, val age: Int)

fun main() {
    val numbers = listOf(1, 2, 3, 4)
    println(numbers.isSorted())
    // true

    val users = listOf(
        User("Alice", 24),
        User("Bob", 31),
        User("Charlie", 29),
    )
    println(users.isSortedBy(User::age))
    // false
}
```

フィードバックを [YouTrack](https://youtrack.jetbrains.com/issue/KT-78499) でお待ちしております。

### JVM 上で符号なし整数を `BigInteger` に変換するための新しい API
<secondary-label ref="standard-library"/>

Kotlin %kotlinEapVersion% では、JVM 上に `UInt.toBigInteger()` および `ULong.toBigInteger()` 拡張関数が導入されました。

以前は、`UInt` や `ULong` の値を `BigInteger` に変換するには、文字列ベースのワークアラウンドやカスタムの変換ロジックが必要でした。Kotlin %kotlinEapVersion% 以降では、`.toBigInteger()` を使用して符号なし整数の値を直接 `BigInteger` に変換できます。

例を以下に示します。

```kotlin
fun main() {
    val unsignedLong = Long.MAX_VALUE.toULong() + 1uL
    val unsignedInt = UInt.MAX_VALUE

    println(unsignedLong.toBigInteger())
    // 9223372036854775808

    println(unsignedInt.toBigInteger())
    // 4294967295
}
```

フィードバックを [YouTrack](https://youtrack.jetbrains.com/issue/KT-73111) でお待ちしております。

## Kotlin/JVM

Kotlin %kotlinEapVersion% では、新しい Java バージョンをサポートし、メタデータ内のアノテーションがデフォルトで有効になりました。

### Java 26 のサポート
<secondary-label ref="jvm"/>

Kotlin %kotlinEapVersion% 以降、コンパイラは Java 26 バイトコードを含むクラスを生成できます。

### メタデータ内のアノテーションをデフォルトで有効化
<secondary-label ref="jvm"/>

Kotlin 2.2.0 の Kotlin Metadata JVM ライブラリでは、[Kotlin メタデータに保存されたアノテーションの読み取りサポートが導入されました](whatsnew22.md#support-for-reading-and-writing-annotations-in-kotlin-metadata)。このサポートにより、Kotlin コンパイラは JVM バイトコードと並行してメタデータにアノテーションを書き込み、Kotlin Metadata JVM ライブラリからアクセスできるようにします。その結果、アノテーションプロセッサやその他のツールは、リフレクションを使用したりソースコードを変更したりすることなく、メタデータレベルでこれらのアノテーションを理解し操作できるようになります。

Kotlin %kotlinEapVersion% では、このサポートがデフォルトで有効になっています。

## Kotlin/Native

Kotlin %kotlinEapVersion% では、Swift パッケージのインポートのサポート、Swift export を通じた相互運用の改善、およびガベージコレクタにおけるデフォルトの並行マーク（concurrent marking）が導入されました。

### Swift パッケージのインポート
<primary-label ref="experimental-general"/>

<secondary-label ref="native"/>

Kotlin Multiplatform プロジェクトにおいて、Gradle 構成で iOS アプリの依存関係として [Swift パッケージ](https://docs.swift.org/swiftpm/documentation/packagemanagerdocs/) を宣言できるようになりました。

```kotlin
// build.gradle.kts
kotlin {

    swiftPMDependencies {
        swiftPackage(
            url = url("https://github.com/firebase/firebase-ios-sdk.git"),
            version = from("12.11.0"),
            products = listOf(
                product("FirebaseAI"),
                product("FirebaseAnalytics"),
                ...
}
```
{validate="false"}

動作するサンプルや詳細な情報については、[SwiftPM インポート](https://kotlinlang.org/docs/multiplatform/multiplatform-spm-import.html) を参照してください。

プロジェクトが CocoaPods の依存関係に依存している場合は、現在のセットアップを Swift パッケージを使用するように移行できます。KMP ツールはこのユースケースを考慮しており、プロジェクトの自動再構成を支援します。詳細については、[CocoaPods 移行ガイド](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-spm-migration.html) を参照してください。

### Swift export: コルーチンの Flow をエクスポートするためのサポート
<primary-label ref="experimental-general"/>

<secondary-label ref="native"/>

Kotlin %kotlinEapVersion% では、`kotlinx.coroutines` の Flow を Swift にエクスポートするサポートを追加することで、Swift export を通じた Swift との相互運用性をさらに向上させています。

`kotlinx.coroutines` の Flow は、並行して発行および消費できるデータの非同期ストリームを表します。これらは、データベースの更新、ネットワークリクエスト、または UI イベントのリスニングなどのリアクティブプログラミングパターンによく使用されます。

以前は、[`kotlinx.coroutines.flow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-flow/) の `Flow` インターフェースを Swift に公開する唯一の方法は、サードパーティのソリューションを使用することでした。今回のアップデートにより、標準機能として Swift の慣用的な対応物である [`AsyncSequence`](https://developer.apple.com/documentation/Swift/AsyncSequence) にエクスポートできるようになりました。

この機能はデフォルトで有効になっています。型情報を保持したまま、`Flow` 型を持つ任意のパブリック API を Swift にエクスポートできます。
例を以下に示します。

```kotlin
// Kotlin
// Flow をエクスポートする際、String 型が保持されます
fun flowOfStrings(): Flow<String> = flowOf("hello", "any", "world")
```

```Swift
// Swift
var actual: [String] = []
// String 型が Kotlin から正しく推論されます
for try await element in flowOfStrings().asAsyncSequence() {
    actual.append(element)
}
```

Swift export の詳細については、[ドキュメント](native-swift-export.md) を参照してください。

### ガベージコレクタのデフォルトの並行マーク
<secondary-label ref="native"/>

Kotlin 2.0.20 において、Kotlin チームは並行マークアンドスイープ ガベージコレクタ (CMS GC) の [実験的なサポートを導入しました](whatsnew2020.md#concurrent-marking-in-garbage-collector)。ユーザーからのフィードバックの処理とリグレッションの修正を経て、Kotlin %kotlinEapVersion% 以降、CMS をデフォルトで有効にする準備が整いました。

以前のガベージコレクタにおけるデフォルトの並行スイープを伴う並列マーク (PMCS) の設定では、GC がヒープ内のオブジェクトをマークする間、アプリケーションのスレッドを停止させる必要がありました。それに対し、CMS ではマークフェーズをアプリケーションスレッドと並行して実行できます。

これにより、GC の停止時間とアプリの応答性が大幅に向上します。これは、レイテンシが重要なアプリケーションのパフォーマンスにとって重要です。CMS は、[Compose Multiplatform](https://blog.jetbrains.com/kotlin/2024/10/compose-multiplatform-1-7-0-released/#performance-improvements-on-ios) で構築された UI アプリケーションのベンチマークにおいて、すでにその有効性を実証しています。

問題が発生した場合は、PMCS に戻すことができます。その場合は、`gradle.properties` ファイルに以下の [バイナリオプション](native-binary-options.md) を設定してください。

```none
kotlin.native.binary.gc=pmcs
```

Kotlin/Native ガベージコレクタの詳細については、[ドキュメント](native-memory-manager.md#garbage-collector) を参照してください。

## Kotlin/Wasm

Kotlin %kotlinEapVersion% では、Kotlin/Wasm のインクリメンタルコンパイルがデフォルトで有効になり、WebAssembly Component Model のサポートが導入されました。

### インクリメンタルコンパイルのデフォルト有効化

<secondary-label ref="wasm"/>

Kotlin/Wasm は 2.1.0 でインクリメンタルコンパイルを導入しました。Kotlin %kotlinEapVersion% 以降、これは [Stable](components-stability.md#stability-levels-explained) となり、デフォルトで有効になっています。
この機能により、コンパイラは最近の変更によって影響を受けたファイルのみを再ビルドするため、ビルド時間が大幅に短縮されます。

インクリメンタルコンパイルを無効にするには、プロジェクトの `local.properties` または `gradle.properties` ファイルに以下の行を追加してください。

```none
# gradle.properties
kotlin.incremental.wasm=false
```

問題が発生した場合は、[YouTrack](https://kotl.in/issue) で報告してください。

### WebAssembly Component Model のサポート
<primary-label ref="experimental-general"/>

<secondary-label ref="wasm"/>

Kotlin %kotlinEapVersion% では、[WebAssembly Component Model](https://component-model.bytecodealliance.org/) の実験的なサポートを導入することで、さらに一歩前進しました。
このプロポーザルは、標準化されたインターフェースと型を通じて Wasm モジュールからコンポーネントを構築する方法を定義しています。このアプローチは、Wasm を低レベルのバイナリ命令フォーマットから、再利用可能で言語に依存しないコンポーネントを構成するためのシステムへと進化させるのに役立ちます。これにより、Kotlin/Wasm がブラウザを超えて利用可能になります。例えば、Kotlin と WebAssembly は、FaaS (Function-as-a-Service) またはサーバーレスアプリケーションに非常に適しています。

この機能を試すには、[`wasi:http` で構築されたシンプルなサーバー](https://github.com/Kotlin/sample-wasi-http-kotlin/) を確認してください。

<img src="kotlin-wasm-wasi-http.gif" alt="WebAssembly Component Model を使用した Kotlin/Wasm" width="600"/>

フィードバックを [YouTrack](https://youtrack.jetbrains.com/issue/KT-64569/Kotlin-Wasm-Support-Component-Model) で共有してください。

## Kotlin/JS

Kotlin %kotlinEapVersion% では、JavaScript/TypeScript へのバリュークラスのエクスポートのサポートと、JS コードインライン化時の ES2015 機能のサポートが追加されました。

### JavaScript/TypeScript へのバリュークラスのエクスポートのサポート
<secondary-label ref="js"/>

以前は、通常の Kotlin クラスのみが JavaScript/TypeScript にエクスポート可能でした。
Kotlin %kotlinEapVersion% ではその制限が解除されました。Kotlin の [インラインバリュークラス (inline value classes)](inline-classes.md) を、通常の TypeScript クラスとしてエクスポートできるようになりました。

バリュークラスをエクスポートするには、Kotlin 側で `@JsExport` アノテーションを付けます。

```Kotlin
// Kotlin
@JsExport
@JvmInline
value class Email(val address: String) {
    init { require(address.contains("@")) { "Invalid email" } }
}

@JsExport
class AuthService {
    suspend fun login(email: Email): String = ...
}
```

TypeScript 側からは、通常のクラスのように見えます。

```TypeScript
// TypeScript
import { AuthService, Email } from "..."
const auth = new AuthService();

console.log(await auth.login(new Email("jane@example.com"))); 
// "Welcome, jane@example.com!"
console.log(await auth.login(new Email("not-an-email"))); 
// "Invalid email"
```

詳細については、[`@JsExport` アノテーション](js-to-kotlin-interop.md#jsexport-annotation) を参照してください。

### JS コードをインライン化する際の ES2015 機能のサポート
<secondary-label ref="js"/>

Kotlin %kotlinEapVersion% 以降、JavaScript コードのインライン化において [ES2015 機能](js-project-setup.md#support-for-es2015-features) がフルサポートされました。

これはサードパーティライブラリとの相互運用だけでなく、アプリケーションコードの自動生成を直接制御する場合にも役立ちます。

[`js()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.js/js.html) の呼び出し内で、以下を含む最新の JS 機能を使用できるようになりました。

* ラムダ ([アロー関数](whatsnew21.md#support-for-generating-es2015-arrow-functions))
* ES クラス
* テンプレート文字列
* スプレッド演算子
* `const` および `let` 変数宣言
* ジェネレータ

`js()` 関数のパラメータは、コンパイル時にパースされ JavaScript コードに「そのまま」変換されるため、文字列定数である必要があることに注意してください。
例えば、スプレッド演算子の場合は以下のように使用します。

```kotlin
fun spreadExample(): dynamic = js("""
    const add = (a, b, c) => a + b + c;

    const nums = [1, 2, 3];
    const sum = add(...nums);

    const a = [1, 2, 3];
    const b = [...a, 4, 5, 6];

    return { sum, b: b };
""")
```

インライン JavaScript コードのインライン化の詳細については、[ドキュメント](js-interop.md#inline-javascript) を参照してください。

## Gradle

Kotlin %kotlinEapVersion% は、Gradle 7.6.3 から 9.4.1 と完全に互換性があります。最新の Gradle リリースまでのバージョンも使用可能ですが、その場合は非推奨の警告が表示されたり、一部の新しい Gradle 機能が動作しなかったりする可能性があることに注意してください。

## Maven

Kotlin %kotlinEapVersion% では、Java と JVM ターゲットバージョンの自動調整により、プロジェクト構成がさらに容易になりました。

### Java と JVM ターゲットバージョンの自動調整
<secondary-label ref="maven"/>

プロジェクト構成を簡素化し互換性の問題を防止するために、Kotlin Maven プラグインは、プロジェクトで構成された Java コンパイラバージョンに合わせて JVM ターゲットバージョンを自動的に調整するようになりました。

これにより、Kotlin と Maven のコンパイラが同じバイトコードバージョンをターゲットにすることが保証され、Kotlin が生成したバイトコードがプロジェクトの他の部分や意図したデプロイ環境と互換性がないという問題を回避できます。

`<extensions>` オプションを有効にすると、`kotlin.compiler.jvmTarget` プロパティは不要になります。まだ定義されていない場合、Kotlin Maven プラグインは以下の順序で JVM ターゲットバージョンを自動的に解決します。

1. プロジェクトプロパティとして、または `maven-compiler-plugin` 構成内で定義された `maven.compiler.release` バージョン。

    この場合、Kotlin コンパイラには `jvmTarget` と `jdkRelease` コンパイラオプションの両方が設定され、API は特定の JDK バージョンに制限されます。

2. Maven のリリースバージョンが設定されていない場合は、`maven.compiler.target` バージョン。コンパイラターゲットは、プロジェクトプロパティとして、または `maven-compiler-plugin` 構成内で定義できます。

    この場合、Kotlin の `jvmTarget` のみが設定され、API は特定の JDK バージョンに制限されません。

これにより、Kotlin プロジェクトの構成が大幅に簡素化され、`pom.xml` ファイルは以下のようになります。

```xml
<properties>
    <maven.compiler.release>17</maven.compiler.release>
    <kotlin.version>%kotlinVersion%</kotlin.version>
</properties>

<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <version>${kotlin.version}</version>
            <extensions>true</extensions>
        </plugin>
    </plugins>
</build>
```

ビルド中、プラグインは以下のようなメッセージを出力します。

```none
[INFO] Using jvmTarget=17 (derived from maven.compiler.release=17)
```

> `<extensions>` オプションは、プロジェクトレベルのプロパティとグローバルな `maven-compiler-plugin` 構成のみをチェックします。
> プラグインの `<executions>` セクション内で定義された構成はチェックしません。
>
{style="note"}

プロジェクトの自動構成の詳細については、[ドキュメント](maven-configure-project.md#automatic-configuration) を参照してください。

## Kotlin コンパイラ

Kotlin %kotlinEapVersion% では、`.klib` コンパイル中に同じモジュール内で宣言されたインライン関数の一貫した動作が導入されました。

### klib コンパイル中の一貫したモジュール内関数インライン化
<secondary-label ref="compiler"/>

以前は、[関数インライン化 (function inlining)](inline-functions.md) の動作は Kotlin のプラットフォームごとに異なっていました。JetBrains チームは、同じ互換性保証を確実にするために、サポートされているすべてのプラットフォームでこれを統一する作業を進めています。

Kotlin/JVM では、関数のインライン化はコンパイル時に発生します。そのため、Kotlin ソースが Kotlin/JVM コンパイラでコンパイルされる際、生成されたクラスファイルのバイトコードにはインライン関数の呼び出しは含まれません。インライン関数の本体が呼び出し側にインライン化されるため、その動作はコンパイル時に確定します。

それに対して、Kotlin/Native、Kotlin/JS、および Kotlin/Wasm では、ソースから klib へのコンパイル中には関数のインライン化は行われず、バイナリ生成時にのみ行われていました。その結果、インライン関数の動作は `.klib` コンパイル中に確定されず、`.klib` ライブラリは Kotlin/JVM が提供するようなインライン関数の互換性保証を提供していませんでした。

Kotlin %kotlinEapVersion% では、`.klib` アーティファクトの生成時にモジュール内 (intra-module) のインライン化を有効にすることで、インライン関数の動作を統一するための第一歩を踏み出しました。

```kotlin
// 既存の logging.klib ライブラリ
inline fun logDebug(message: String) {
    println("[DEBUG] $message")
}
```

```kotlin
// 現在コンパイル中の App モジュール
inline fun greetUser(name: String) {
    println("Hello, $name!")
}

fun main() {
    logDebug("App started") // インライン化されない: 別のモジュールで宣言されている
    greetUser("Alice")      // インライン化される: 同じモジュールで宣言されている
}
```

`.klib` にコンパイルされると、コードは以下のようになります。

```kotlin
// 疑似コード
fun main() {
    logDebug("App started")  // インライン化されない、別のモジュールで宣言されている
    val tmp0 = "Alice"
    println("Hello, $tmp0!") // greetUser() からインライン化された
}
```

これは、`.klib` コンパイル中には同じモジュール内で宣言されたインライン関数のみがインライン化されることを意味します。この場合、他の関数はプラットフォーム固有のバイナリ生成中にインライン化されます。

#### 有効にする方法

%kotlinEapVersion% 以降、モジュール内のインライン化は Kotlin/Native、Kotlin/JS、および Kotlin/Wasm でデフォルトで有効になっています。

この機能で予期しない問題が発生した場合は、コマンドラインで以下のコンパイラオプションを使用して無効にすることができます。

```bash
-Xklib-ir-inliner=disabled
```

次のステップは、プロジェクト内のすべてのインライン関数が一貫してインライン化されるように、モジュール間 (cross-module) のインライン化を有効にすることです。この変更は将来の Kotlin リリースで予定されていますが、コマンドラインで以下のコンパイラオプションを使用することで、既に試してみることができます。

```bash
-Xklib-ir-inliner=full
```

フィードバックの共有や問題の報告は、[YouTrack](https://kotl.in/issue) でお願いします。