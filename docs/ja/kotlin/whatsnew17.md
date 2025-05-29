[//]: # (title: Kotlin 1.7.0の新機能)

<tldr>
   <p>Kotlin 1.7.0のIDEサポートは、IntelliJ IDEA 2021.2、2021.3、2022.1で利用可能です。</p>
</tldr>

_[リリース日: 2022年6月9日](releases.md#release-details)_

Kotlin 1.7.0がリリースされました。このバージョンでは、新しいKotlin/JVM K2コンパイラのAlpha版が公開され、言語機能が安定化され、JVM、JS、Nativeプラットフォームのパフォーマンスが向上しています。

このバージョンの主要な更新点は以下の通りです。

* [新しいKotlin K2コンパイラのAlpha版](#new-kotlin-k2-compiler-for-the-jvm-in-alpha)が利用可能になり、大幅なパフォーマンス改善を提供します。これはJVM専用であり、kaptを含むどのコンパイラプラグインも動作しません。
* [Gradleにおけるインクリメンタルコンパイルの新しいアプローチ](#a-new-approach-to-incremental-compilation)。インクリメンタルコンパイルは、依存する非Kotlinモジュール内で行われた変更にも対応し、Gradleと互換性があります。
* [オプトイン要件アノテーション](#stable-opt-in-requirements)、[確実な非NULL型](#stable-definitely-non-nullable-types)、[ビルダーインファレンス](#stable-builder-inference)が安定化されました。
* [型引数にアンダースコア演算子が導入されました](#underscore-operator-for-type-arguments)。これにより、他の型が指定されている場合に型引数を自動的に推論できます。
* [このリリースでは、インラインクラスのインライン値への委譲による実装が可能になりました](#allow-implementation-by-delegation-to-an-inlined-value-of-an-inline-class)。これにより、ほとんどの場合メモリを割り当てない軽量ラッパーを作成できます。

変更点の簡単な概要は、こちらのビデオでもご確認いただけます。

<video src="https://www.youtube.com/v/54WEfLKtCGk" title="What's new in Kotlin 1.7.0"/>

## JVM向けKotlin K2コンパイラがAlpha版に

このKotlinリリースでは、新しいKotlin K2コンパイラの**Alpha**版が導入されます。新しいコンパイラは、新しい言語機能の開発を加速し、Kotlinがサポートするすべてのプラットフォームを統一し、パフォーマンスの向上をもたらし、コンパイラ拡張のためのAPIを提供することを目指しています。

新しいコンパイラとその利点について、すでに詳細な説明を公開しています。

* [The Road to the New Kotlin Compiler](https://www.youtube.com/watch?v=iTdJJq_LyoY)
* [K2 Compiler: a Top-Down View](https://www.youtube.com/watch?v=db19VFLZqJM)

新しいK2コンパイラのAlpha版では、パフォーマンスの向上に主に焦点を当てており、JVMプロジェクトでのみ動作することに注意してください。Kotlin/JS、Kotlin/Native、その他のマルチプラットフォームプロジェクトはサポートしておらず、[kapt](kapt.md)を含むどのコンパイラプラグインも動作しません。

弊社のベンチマークでは、内部プロジェクトで優れた結果が示されています。

| プロジェクト | 現在のKotlinコンパイラのパフォーマンス | 新しいK2 Kotlinコンパイラのパフォーマンス | パフォーマンス向上率 |
|---------------|-------------------------------------|------------------------------------|-------------------|
| Kotlin        | 2.2 KLOC/s                          | 4.8 KLOC/s                         | ~ x2.2            |
| YouTrack      | 1.8 KLOC/s                          | 4.2 KLOC/s                         | ~ x2.3            |
| IntelliJ IDEA | 1.8 KLOC/s                          | 3.9 KLOC/s                         | ~ x2.2            |
| Space         | 1.2 KLOC/s                          | 2.8 KLOC/s                         | ~ x2.3            |

> KLOC/sのパフォーマンス数値は、コンパイラが1秒あたりに処理するコードの千行数を表します。
>
> {style="tip"}

ご自身のJVMプロジェクトでパフォーマンス向上を確認し、古いコンパイラの結果と比較することができます。Kotlin K2コンパイラを有効にするには、以下のコンパイラオプションを使用します。

```bash
-Xuse-k2
```

また、K2コンパイラには[多数のバグ修正](https://youtrack.jetbrains.com/issues/KT?q=tag:%20FIR-preview-qa%20%23Resolved)が含まれています。このリストに含まれる**State: Open**の問題も、実際にはK2で修正済みであることに注意してください。

今後のKotlinリリースでは、K2コンパイラの安定性が向上し、より多くの機能が提供される予定です。ご期待ください！

Kotlin K2コンパイラでパフォーマンスに関する問題が発生した場合は、[課題トラッカーに報告](https://kotl.in/issue)してください。

## 言語

Kotlin 1.7.0では、委譲による実装のサポートと、型引数用の新しいアンダースコア演算子が導入されます。また、以前のリリースでプレビューとして導入されたいくつかの言語機能が安定化されました。

* [インラインクラスのインライン値への委譲による実装](#allow-implementation-by-deegation-to-an-inlined-value-of-an-inline-class)
* [型引数用のアンダースコア演算子](#underscore-operator-for-type-arguments)
* [安定版のビルダーインファレンス](#stable-builder-inference)
* [安定版のオプトイン要件](#stable-opt-in-requirements)
* [安定版の確実な非NULL型](#stable-definitely-non-nullable-types)

### インラインクラスのインライン値への委譲による実装を許可

値またはクラスインスタンスの軽量ラッパーを作成したい場合、すべてのインターフェースメソッドを手作業で実装する必要があります。委譲による実装はこの問題を解決しますが、1.7.0より前のバージョンではインラインクラスで動作しませんでした。この制限が解除され、ほとんどの場合メモリを割り当てない軽量ラッパーを作成できるようになりました。

```kotlin
interface Bar {
    fun foo() = "foo"
}

@JvmInline
value class BarWrapper(val bar: Bar): Bar by bar

fun main() {
    val bw = BarWrapper(object: Bar {})
    println(bw.foo())
}
```

### 型引数用のアンダースコア演算子

Kotlin 1.7.0では、型引数用のアンダースコア演算子`_`が導入されました。これにより、他の型が指定されている場合に型引数を自動的に推論できます。

```kotlin
abstract class SomeClass<T> {
    abstract fun execute(): T
}

class SomeImplementation : SomeClass<String>() {
    override fun execute(): String = "Test"
}

class OtherImplementation : SomeClass<Int>() {
    override fun execute(): Int = 42
}

object Runner {
    inline fun <reified S: SomeClass<T>, T> run(): T {
        return S::class.java.getDeclaredConstructor().newInstance().execute()
    }
}

fun main() {
    // T is inferred as String because SomeImplementation derives from SomeClass<String>
    val s = Runner.run<SomeImplementation, _>()
    assert(s == "Test")

    // T is inferred as Int because OtherImplementation derives from SomeClass<Int>
    val n = Runner.run<OtherImplementation, _>()
    assert(n == 42)
}
```

> アンダースコア演算子は、変数リストの任意の場所で使用して型引数を推論できます。
>
{style="note"}

### 安定版のビルダーインファレンス

ビルダーインファレンスは、ジェネリックなビルダー関数を呼び出す際に役立つ特殊な型推論です。これにより、コンパイラはラムダ引数内の他の呼び出しに関する型情報を使用して、呼び出しの型引数を推論するのに役立ちます。

1.7.0以降、ビルダーインファレンスは、通常の型推論が型に関する十分な情報を得られない場合に、[1.6.0で導入された](whatsnew16.md#changes-to-builder-inference)コンパイラオプション`-Xenable-builder-inference`を指定しなくても自動的に有効になります。

[カスタムジェネリックビルダーの書き方](using-builders-with-builder-inference.md)をご覧ください。

### 安定版のオプトイン要件

[オプトイン要件](opt-in-requirements.md)は[安定版](components-stability.md)となり、追加のコンパイラ設定は不要になりました。

1.7.0より前は、オプトイン機能自体が警告を避けるために引数`-opt-in=kotlin.RequiresOptIn`を必要としました。これは不要になりましたが、`-opt-in`コンパイラ引数を使用して、他のアノテーションや[モジュール](opt-in-requirements.md#opt-in-a-module)をオプトインすることは引き続き可能です。

### 安定版の確実な非NULL型

Kotlin 1.7.0では、確実な非NULL型が[安定版](components-stability.md)に昇格しました。これらは、ジェネリックなJavaクラスやインターフェースを拡張する際により良い相互運用性を提供します。

新しい構文`T & Any`を使用して、使用箇所でジェネリック型パラメータを確実な非NULLとしてマークできます。この構文形式は[交差型](https://en.wikipedia.org/wiki/Intersection_type)の表記法に由来し、現在は`&`の左側にNULL許容な上限を持つ型パラメータ、右側に非NULLな`Any`がある場合に限定されます。

```kotlin
fun <T> elvisLike(x: T, y: T & Any): T & Any = x ?: y

fun main() {
    // OK
    elvisLike<String>("", "").length
    // Error: 'null' cannot be a value of a non-null type
    elvisLike<String>("", null).length

    // OK
    elvisLike<String?>(null, "").length
    // Error: 'null' cannot be a value of a non-null type
    elvisLike<String?>(null, null).length
}
```

確実な非NULL型の詳細については、[こちらのKEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types.md)をご覧ください。

## Kotlin/JVM

このリリースでは、Kotlin/JVMコンパイラのパフォーマンスが向上し、新しいコンパイラオプションが導入されます。さらに、関数型インターフェースコンストラクタへの呼び出し可能な参照が安定版になりました。なお、1.7.0以降、Kotlin/JVMコンパイルのデフォルトターゲットバージョンは`1.8`です。

* [コンパイラのパフォーマンス最適化](#compiler-performance-optimizations)
* [新しいコンパイラオプション`-Xjdk-release`](#new-compiler-option-xjdk-release)
* [関数型インターフェースコンストラクタへの安定版呼び出し可能な参照](#stable-callable-references-to-functional-interface-constructors)
* [JVMターゲットバージョン1.6の削除](#removed-jvm-target-version-1-6)

### コンパイラのパフォーマンス最適化

Kotlin 1.7.0では、Kotlin/JVMコンパイラのパフォーマンスが向上します。弊社のベンチマークによると、コンパイル時間はKotlin 1.6.0と比較して[平均10%削減されました](https://youtrack.jetbrains.com/issue/KT-48233/Switching-to-JVM-IR-backend-increases-compilation-time-by-more-t#focus=Comments-27-6114542.0-0)。例えば、[`kotlinx.html`を使用するプロジェクト](https://youtrack.jetbrains.com/issue/KT-51416/Compilation-of-kotlinx-html-DSL-should-still-be-faster)など、インライン関数の使用が多いプロジェクトでは、バイトコードの後処理の改善によりコンパイルが高速化されます。

### 新しいコンパイラオプション: -Xjdk-release

Kotlin 1.7.0では、新しいコンパイラオプション`-Xjdk-release`が導入されます。このオプションは、[javacのコマンドライン`--release`オプション](http://openjdk.java.net/jeps/247)に似ています。`-Xjdk-release`オプションは、ターゲットとなるバイトコードのバージョンを制御し、クラスパス内のJDKのAPIを指定されたJavaバージョンに制限します。例えば、`kotlinc -Xjdk-release=1.8`は、依存関係にあるJDKがバージョン9以上であっても`java.lang.Module`の参照を許可しません。

> このオプションは、[各JDKディストリビューションに対して効果があることを保証するものではありません](https://youtrack.jetbrains.com/issue/KT-29974)。
>
{style="note"}

[こちらのYouTrackチケット](https://youtrack.jetbrains.com/issue/KT-29974/Add-a-compiler-option-Xjdk-release-similar-to-javac-s-release-to)でフィードバックをお寄せください。

### 関数型インターフェースコンストラクタへの安定版呼び出し可能な参照

関数型インターフェースコンストラクタへの[呼び出し可能な参照](reflection.md#callable-references)が[安定版](components-stability.md)になりました。呼び出し可能な参照を使用して、コンストラクタ関数を持つインターフェースから関数型インターフェースへの[移行方法](fun-interfaces.md#migration-from-an-interface-with-constructor-function-to-a-functional-interface)を学びましょう。

見つけた問題は[YouTrack](https://youtrack.jetbrains.com/newissue?project=kt)に報告してください。

### JVMターゲットバージョン1.6の削除

Kotlin/JVMコンパイルのデフォルトターゲットバージョンは`1.8`です。`1.6`ターゲットは削除されました。

JVMターゲット1.8以降に移行してください。JVMターゲットバージョンの更新方法については、以下をご覧ください。

* [Gradle](gradle-compiler-options.md#attributes-specific-to-jvm)
* [Maven](maven.md#attributes-specific-to-jvm)
* [The command-line compiler](compiler-reference.md#jvm-target-version)

## Kotlin/Native

Kotlin 1.7.0には、Objective-CおよびSwiftの相互運用性に関する変更が含まれ、以前のリリースで導入された機能が安定化されています。また、新しいメモリマネージャーのパフォーマンス向上とともに、その他の更新も含まれています。

* [新しいメモリマネージャーのパフォーマンス向上](#performance-improvements-for-the-new-memory-manager)
* [JVMおよびJS IRバックエンドとの統合されたコンパイラプラグインABI](#unified-compiler-plugin-abi-with-jvm-and-js-ir-backends)
* [スタンドアロンAndroid実行可能ファイルへの対応](#support-for-standalone-android-executables)
* [Swiftのasync/awaitとの相互運用: `KotlinUnit`ではなく`Void`を返す](#interop-with-swift-async-await-returning-void-instead-of-kotlinunit)
* [Objective-Cブリッジを介した未宣言例外の禁止](#prohibited-undeclared-exceptions-through-objective-c-bridges)
* [CocoaPods連携の改善](#improved-cocoapods-integration)
* [Kotlin/NativeコンパイラのダウンロードURLの上書き](#overriding-the-kotlin-native-compiler-download-url)

### 新しいメモリマネージャーのパフォーマンス向上

> 新しいKotlin/Nativeメモリマネージャーは[Alpha版](components-stability.md)です。将来的に互換性のない変更が行われる可能性があり、手動での移行が必要になる場合があります。[YouTrack](https://youtrack.jetbrains.com/issue/KT-48525)でフィードバックをいただければ幸いです。
>
{style="note"}

新しいメモリマネージャーはまだAlpha版ですが、[安定版](components-stability.md)になる途中です。このリリースでは、特にガベージコレクション（GC）において、新しいメモリマネージャーのパフォーマンスが大幅に向上します。具体的には、[1.6.20で導入された](whatsnew1620.md)スイープフェーズの並行実装がデフォルトで有効になりました。これにより、アプリケーションがGCのために一時停止する時間を削減できます。新しいGCスケジューラは、特に大規模なヒープにおいて、GCの頻度を選択するのに優れています。

また、デバッグバイナリを特に最適化し、メモリマネージャーの実装コードで適切な最適化レベルとリンク時最適化が使用されるようにしました。これにより、弊社のベンチマークでデバッグバイナリの実行時間を約30%向上させることができました。

ご自身のプロジェクトで新しいメモリマネージャーを試してその動作を確認し、[YouTrack](https://youtrack.jetbrains.com/issue/KT-48525)でフィードバックをお寄せください。

### JVMおよびJS IRバックエンドとの統合されたコンパイラプラグインABI

Kotlin 1.7.0以降、Kotlin Multiplatform Gradleプラグインは、デフォルトでKotlin/Native用の埋め込み可能なコンパイラjarを使用します。この[機能は1.6.0で実験的として発表されました](whatsnew16.md#unified-compiler-plugin-abi-with-jvm-and-js-ir-backends)が、今回安定版となり利用可能になりました。

この改善は、コンパイラプラグインの開発体験を向上させるため、ライブラリ作者にとって非常に便利です。このリリース以前は、Kotlin/Native用に個別のアーティファクトを提供する必要がありましたが、今ではNativeと他のサポートされているプラットフォームで同じコンパイラプラグインアーティファクトを使用できます。

> この機能により、プラグイン開発者は既存のプラグインに対して移行手順を踏む必要がある場合があります。
>
> この[YouTrackの課題](https://youtrack.jetbrains.com/issue/KT-48595)で、更新に備えてプラグインを準備する方法を学びましょう。
>
{style="warning"}

### スタンドアロンAndroid実行可能ファイルへの対応

Kotlin 1.7.0では、Android Nativeターゲット用の標準実行可能ファイルを生成するための完全なサポートが提供されます。[1.6.20で導入され](whatsnew1620.md#support-for-standalone-android-executables)、現在デフォルトで有効になっています。

Kotlin/Nativeが共有ライブラリを生成していた以前の動作に戻したい場合は、以下の設定を使用してください。

```kotlin
binaryOptions["androidProgramType"] = "nativeActivity"
```

### Swiftのasync/awaitとの相互運用: `KotlinUnit`ではなく`Void`を返す

Kotlinの`suspend`関数は、Swiftで`KotlinUnit`ではなく`Void`型を返すようになりました。これは、Swiftの`async`/`await`との相互運用性が改善された結果です。この機能は[1.6.20で導入され](whatsnew1620.md#interop-with-swift-async-await-returning-void-instead-of-kotlinunit)、このリリースではデフォルトでこの動作が有効になっています。

これらの関数で適切な型を返すために、もはや`kotlin.native.binary.unitSuspendFunctionObjCExport=proper`プロパティを使用する必要はありません。

### Objective-Cブリッジを介した未宣言例外の禁止

Swift/Objective-CコードからKotlinコードを呼び出す場合（またはその逆の場合）で、このコードが例外をスローするときは、適切な変換（例えば`@Throws`アノテーションを使用）で言語間の例外転送を特に許可しない限り、例外が発生したコードで処理されるべきです。

以前は、Kotlinには意図しない動作があり、未宣言の例外が場合によってはある言語から別の言語に「漏れる」可能性がありました。Kotlin 1.7.0ではその問題が修正され、現在ではそのようなケースはプログラムの終了につながります。

したがって、例えば、Kotlinで`{ throw Exception() }`ラムダがあり、それをSwiftから呼び出す場合、Kotlin 1.7.0では例外がSwiftコードに到達するとすぐにプログラムが終了します。以前のKotlinバージョンでは、そのような例外がSwiftコードに漏れる可能性がありました。

`@Throws`アノテーションは以前と同様に動作します。

### CocoaPods連携の改善

Kotlin 1.7.0以降、プロジェクトでCocoaPodsを連携させたい場合、`cocoapods-generate`プラグインをインストールする必要はなくなりました。

以前は、CocoaPodsを使用するために、例えばKotlin Multiplatform Mobileプロジェクトで[iOSの依存関係](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-ios-dependencies.html#with-cocoapods)を処理するために、CocoaPods依存関係マネージャーと`cocoapods-generate`プラグインの両方をインストールする必要がありました。

CocoaPodsの連携設定が簡単になり、Ruby 3以降で`cocoapods-generate`がインストールできない問題を解決しました。Apple M1でより良く動作する最新のRubyバージョンもサポートされています。

[CocoaPodsの初期連携](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html#set-up-an-environment-to-work-with-cocoapods)の方法をご覧ください。

### Kotlin/NativeコンパイラのダウンロードURLの上書き

Kotlin 1.7.0以降、Kotlin/NativeコンパイラのダウンロードURLをカスタマイズできるようになりました。これは、CIで外部リンクが禁止されている場合に役立ちます。

デフォルトのベースURL`https://download.jetbrains.com/kotlin/native/builds`を上書きするには、以下のGradleプロパティを使用します。

```none
kotlin.native.distribution.baseDownloadUrl=https://example.com
```

> ダウンローダーは、実際のコンパイラディストリビューションをダウンロードするために、このベースURLにネイティブバージョンとターゲットOSを追加します。
>
{style="note"}

## Kotlin/JS

Kotlin/JSは、[JS IRコンパイラバックエンド](js-ir-compiler.md)のさらなる改善と、開発体験を向上させるその他の更新を受けています。

* [新しいIRバックエンドのパフォーマンス向上](#performance-improvements-for-the-new-ir-backend)
* [IR使用時のメンバー名のミニファイ](#minification-for-member-names-when-using-ir)
* [IRバックエンドでのポリフィルによる古いブラウザのサポート](#support-for-older-browsers-via-polyfills-in-the-ir-backend)
* [js式からのJavaScriptモジュールの動的ロード](#dynamically-load-javascript-modules-from-js-expressions)
* [JavaScriptテストランナーの環境変数を指定](#specify-environment-variables-for-javascript-test-runners)

### 新しいIRバックエンドのパフォーマンス向上

このリリースには、開発体験を向上させるためのいくつかの主要な更新が含まれています。

* Kotlin/JSのインクリメンタルコンパイルのパフォーマンスが大幅に改善されました。JSプロジェクトのビルド時間が短縮されます。インクリメンタルリビルドは、多くの場合、レガシーバックエンドと同等の速度になりました。
* Kotlin/JSの最終バンドルは、最終成果物のサイズを大幅に削減したため、より少ないディスクスペースで済みます。一部の大規模プロジェクトでは、レガシーバックエンドと比較して、本番バンドルサイズが最大20%削減されたと計測されています。
* インターフェースの型チェックが桁違いに改善されました。
* Kotlinはより高品質なJSコードを生成します。

### IR使用時のメンバー名のミニファイ

Kotlin/JS IRコンパイラは、Kotlinのクラスと関数の関係に関する内部情報を使用して、関数、プロパティ、クラスの名前を短縮するより効率的なミニファイを適用するようになりました。これにより、結果として生成されるバンドルアプリケーションのサイズが縮小されます。

この種類のミニファイは、Kotlin/JSアプリケーションを本番モードでビルドする際に自動的に適用され、デフォルトで有効になっています。メンバー名のミニファイを無効にするには、`-Xir-minimized-member-names`コンパイラフラグを使用します。

```kotlin
kotlin {
    js(IR) {
        compilations.all {
            compileKotlinTask.kotlinOptions.freeCompilerArgs += listOf("-Xir-minimized-member-names=false")
        }
    }
}
```

### IRバックエンドでのポリフィルによる古いブラウザのサポート

Kotlin/JS用のIRコンパイラバックエンドは、レガシーバックエンドと同じポリフィルを含むようになりました。これにより、新しいコンパイラでコンパイルされたコードは、Kotlin標準ライブラリが使用するES2015のすべてのメソッドをサポートしていない古いブラウザでも実行できます。プロジェクトで実際に使用されるポリフィルのみが最終バンドルに含まれるため、バンドルサイズへの潜在的な影響が最小限に抑えられます。

この機能は、IRコンパイラを使用する場合にデフォルトで有効になっており、設定する必要はありません。

### js式からのJavaScriptモジュールの動的ロード

JavaScriptモジュールを扱う際、ほとんどのアプリケーションは静的インポートを使用しており、その使用法は[JavaScriptモジュール連携](js-modules.md)でカバーされています。しかし、Kotlin/JSには、アプリケーション内でJavaScriptモジュールをランタイム時に動的にロードするメカニズムが不足していました。

Kotlin 1.7.0以降、JavaScriptの`import`ステートメントが`js`ブロックでサポートされ、ランタイム時にパッケージをアプリケーションに動的に取り込むことが可能になりました。

```kotlin
val myPackage = js("import('my-package')")
```

### JavaScriptテストランナーの環境変数を指定

Node.jsのパッケージ解決を調整したり、外部情報をNode.jsテストに渡したりするために、JavaScriptテストランナーが使用する環境変数を指定できるようになりました。環境変数を定義するには、ビルドスクリプトの`testTask`ブロック内でキーと値のペアを指定して`environment()`関数を使用します。

```kotlin
kotlin {
    js {
        nodejs {
            testTask {
                environment("key", "value")
            }
        }
    }
}
```

## 標準ライブラリ

Kotlin 1.7.0では、標準ライブラリにさまざまな変更と改善が加えられました。これらには、新しい機能の導入、実験的な機能の安定化、Native、JS、JVM向けの[名前付きキャプチャグループ](#support-for-named-capturing-groups-in-js-and-native)のサポートの統合が含まれます。

* [min()およびmax()コレクション関数が非NULL型を返すように](#min-and-max-collection-functions-return-as-non-nullable)
* [特定のインデックスでの正規表現マッチング](#regular-expression-matching-at-specific-indices)
* [以前の言語およびAPIバージョンの拡張サポート](#extended-support-for-previous-language-and-api-versions)
* [リフレクションによるアノテーションへのアクセス](#access-to-annotations-via-reflection)
* [安定版のディープ再帰関数](#stable-deep-recursive-functions)
* [デフォルトのタイムソースに対するインラインクラスに基づくタイムマーク](#time-marks-based-on-inline-classes-for-default-time-source)
* [Java Optional向けの新しい実験的拡張関数](#new-experimental-extension-functions-for-java-optionals)
* [JSおよびNativeにおける名前付きキャプチャグループのサポート](#support-for-named-capturing-groups-in-js-and-native)

### min()およびmax()コレクション関数が非NULL型を返すように

[Kotlin 1.4.0](whatsnew14.md)では、`min()`および`max()`コレクション関数を`minOrNull()`および`maxOrNull()`に改名しました。これらの新しい名前は、レシーバコレクションが空の場合にnullを返すという動作をよりよく反映しています。また、KotlinコレクションAPI全体で使用されている命名規則と関数の動作を合わせるのにも役立ちました。

同様に、`minBy()`、`maxBy()`、`minWith()`、`maxWith()`もKotlin 1.4.0で*OrNull()の同義語が導入されました。この変更の影響を受けた古い関数は段階的に非推奨になりました。

Kotlin 1.7.0では、元の関数名が再導入されましたが、非NULL戻り値型となりました。新しい`min()`、`max()`、`minBy()`、`maxBy()`、`minWith()`、`maxWith()`関数は、コレクション要素を厳密に返すか、例外をスローするようになりました。

```kotlin
fun main() {
    val numbers = listOf<Int>()
    println(numbers.maxOrNull()) // "null"
    println(numbers.max()) // "Exception in... Collection is empty."
}
```

### 特定のインデックスでの正規表現マッチング

[1.5.30で導入された](whatsnew1530.md#matching-with-regex-at-a-particular-position) `Regex.matchAt()`および`Regex.matchesAt()`関数は、安定版になりました。これらは、正規表現が`String`または`CharSequence`の特定の場所で正確な一致を持つかどうかをチェックする方法を提供します。

`matchesAt()`は一致をチェックし、真偽値を返します。

```kotlin
fun main() {
    val releaseText = "Kotlin 1.7.0 is on its way!"
    // regular expression: one digit, dot, one digit, dot, one or more digits
    val versionRegex = "\\d[.]\\d[.]\\d+".toRegex()

    println(versionRegex.matchesAt(releaseText, 0)) // "false"
    println(versionRegex.matchesAt(releaseText, 7)) // "true"
}
```

`matchAt()`は、一致が見つかればそれを返し、そうでなければ`null`を返します。

```kotlin
fun main() {
    val releaseText = "Kotlin 1.7.0 is on its way!"
    val versionRegex = "\\d[.]\\d[.]\\d+".toRegex()

    println(versionRegex.matchAt(releaseText, 0)) // "null"
    println(versionRegex.matchAt(releaseText, 7)?.value) // "1.7.0"
}
```

この[YouTrackの課題](https://youtrack.jetbrains.com/issue/KT-34021)でフィードバックをいただければ幸いです。

### 以前の言語およびAPIバージョンの拡張サポート

広範囲の以前のKotlinバージョンで利用可能なライブラリを開発するライブラリ作者をサポートし、Kotlinの主要リリースの頻度増加に対応するため、以前の言語およびAPIバージョンのサポートを拡張しました。

Kotlin 1.7.0では、2つではなく3つの以前の言語およびAPIバージョンをサポートします。これにより、Kotlin 1.7.0はKotlin 1.4.0までのバージョンをターゲットとするライブラリの開発をサポートします。後方互換性の詳細については、[互換性モード](compatibility-modes.md)をご覧ください。

### リフレクションによるアノテーションへのアクセス

[`KAnnotatedElement.findAnnotations()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/find-annotations.html)拡張関数は、[1.6.0で初めて導入され](whatsnew16.md#repeatable-annotations-with-runtime-retention-for-1-8-jvm-target)ましたが、今回[安定版](components-stability.md)になりました。この[リフレクション](reflection.md)関数は、個別に適用されたアノテーションや繰り返し適用されたアノテーションを含む、指定された型のアノテーションをすべて要素上で返します。

```kotlin
@Repeatable
annotation class Tag(val name: String)

@Tag("First Tag")
@Tag("Second Tag")
fun taggedFunction() {
    println("I'm a tagged function!")
}

fun main() {
    val x = ::taggedFunction
    val foo = x as KAnnotatedElement
    println(foo.findAnnotations<Tag>()) // [@Tag(name=First Tag), @Tag(name=Second Tag)]
}
```

### 安定版のディープ再帰関数

ディープ再帰関数は、[Kotlin 1.4.0](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-rc-debugging-coroutines/#Defining_deep_recursive_functions_using_coroutines)以来実験的機能として利用可能でしたが、Kotlin 1.7.0で[安定版](components-stability.md)になりました。`DeepRecursiveFunction`を使用すると、実際の呼び出しスタックの代わりにヒープにスタックを保持する関数を定義できます。これにより、非常に深い再帰計算を実行できます。ディープ再帰関数を呼び出すには、それを`invoke`します。

この例では、ディープ再帰関数を使用して二分木の深さを再帰的に計算します。このサンプル関数は100,000回再帰的に自身を呼び出しますが、`StackOverflowError`はスローされません。

```kotlin
class Tree(val left: Tree?, val right: Tree?)

val calculateDepth = DeepRecursiveFunction<Tree?, Int> { t ->
    if (t == null) 0 else maxOf(
        callRecursive(t.left),
        callRecursive(t.right)
    ) + 1
}

fun main() {
    // Generate a tree with a depth of 100_000
    val deepTree = generateSequence(Tree(null, null)) { prev ->
        Tree(prev, null)
    }.take(100_000).last()

    println(calculateDepth(deepTree)) // 100000
}
```

再帰の深さが1000回を超えるようなコードでは、ディープ再帰関数の使用を検討してください。

### デフォルトのタイムソースに対するインラインクラスに基づくタイムマーク

Kotlin 1.7.0では、`TimeSource.Monotonic`によって返されるタイムマークをインライン値クラスに変更することで、時間計測機能のパフォーマンスが向上します。これにより、`markNow()`、`elapsedNow()`、`measureTime()`、`measureTimedValue()`のような関数を呼び出す際に、それらの`TimeMark`インスタンスのラッパークラスが割り当てられなくなります。特にホットパスの一部であるコードを計測する場合、これにより計測のパフォーマンスへの影響を最小限に抑えることができます。

```kotlin
@OptIn(ExperimentalTime::class)
fun main() {
    val mark = TimeSource.Monotonic.markNow() // Returned `TimeMark` is inline class
    val elapsedDuration = mark.elapsedNow()
}
```

> この最適化は、`TimeMark`が取得されるタイムソースが静的に`TimeSource.Monotonic`であることが判明している場合にのみ利用可能です。
>
{style="note"}

### Java Optional向けの新しい実験的拡張関数

Kotlin 1.7.0には、Javaの`Optional`クラスを扱う際に便利な新しい関数が導入されます。これらの新しい関数は、JVM上のOptionalオブジェクトをアンラップしたり変換したりするのに使用でき、Java APIをより簡潔に扱えるようになります。

`getOrNull()`、`getOrDefault()`、`getOrElse()`拡張関数を使用すると、`Optional`に値が存在する場合にその値を取得できます。それ以外の場合、それぞれ`null`、デフォルト値、または関数によって返された値を取得します。

```kotlin
val presentOptional = Optional.of("I'm here!")

println(presentOptional.getOrNull())
// "I'm here!"

val absentOptional = Optional.empty<String>()

println(absentOptional.getOrNull())
// null
println(absentOptional.getOrDefault("Nobody here!"))
// "Nobody here!"
println(absentOptional.getOrElse {
    println("Optional was absent!")
    "Default value!"
})
// "Optional was absent!"
// "Default value!"
```

`toList()`、`toSet()`、`asSequence()`拡張関数は、存在する`Optional`の値をリスト、セット、またはシーケンスに変換し、そうでない場合は空のコレクションを返します。`toCollection()`拡張関数は、`Optional`の値を既存の宛先コレクションに追加します。

```kotlin
val presentOptional = Optional.of("I'm here!")
val absentOptional = Optional.empty<String>()
println(presentOptional.toList() + "," + absentOptional.toList())
// ["I'm here!"], []
println(presentOptional.toSet() + "," + absentOptional.toSet())
// ["I'm here!"], []
val myCollection = mutableListOf<String>()
absentOptional.toCollection(myCollection)
println(myCollection)
// []
presentOptional.toCollection(myCollection)
println(myCollection)
// ["I'm here!"]
val list = listOf(presentOptional, absentOptional).flatMap { it.asSequence() }
println(list)
// ["I'm here!"]
```

これらの拡張関数は、Kotlin 1.7.0で実験的機能として導入されます。`Optional`拡張の詳細については、[こちらのKEEP](https://github.com/Kotlin/KEEP/pull/291)をご覧ください。いつものように、[Kotlin課題トラッカー](https://kotl.in/issue)でフィードバックをお待ちしております。

### JSおよびNativeにおける名前付きキャプチャグループのサポート

Kotlin 1.7.0以降、名前付きキャプチャグループはJVMだけでなく、JSおよびNativeプラットフォームでもサポートされます。

キャプチャグループに名前を付けるには、正規表現で(`?<name>group`)構文を使用します。グループに一致したテキストを取得するには、新しく導入された[`MatchGroupCollection.get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/get.html)関数を呼び出し、グループ名を渡します。

#### 名前によるマッチしたグループ値の取得

都市の座標をマッチングするこの例を考えてみましょう。正規表現に一致したグループのコレクションを取得するには、[`groups`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-match-result/groups.html)を使用します。グループの内容をその番号（インデックス）で取得する場合と、`value`を使用してその名前で取得する場合を比較します。

```kotlin
fun main() {
    val regex = "\\b(?<city>[A-Za-z\\s]+),\\s(?<state>[A-Z]{2}):\\s(?<areaCode>[0-9]{3})\\b".toRegex()
    val input = "Coordinates: Austin, TX: 123"
    val match = regex.find(input)!!
    println(match.groups["city"]?.value) // "Austin" — by name
    println(match.groups[2]?.value) // "TX" — by number
}
```

#### 名前付き後方参照

グループを後方参照する際に、グループ名を使用することもできるようになりました。後方参照は、以前にキャプチャグループによって一致したのと同じテキストに一致します。これには、正規表現で`\k<name>`構文を使用します。

```kotlin
fun backRef() {
    val regex = "(?<title>\\w+), yes \\k<title>".toRegex()
    val match = regex.find("Do you copy? Sir, yes Sir!")!!
    println(match.value) // "Sir, yes Sir"
    println(match.groups["title"]?.value) // "Sir"
}
```

#### 置換式における名前付きグループ

名前付きグループ参照は、置換式とともに使用できます。入力内の指定された正規表現のすべての出現箇所を置換式で置き換える[`replace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/replace.html)関数と、最初の一致のみを置き換える[`replaceFirst()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/replace-first.html)関数を考えてみましょう。

置換文字列内の`${name}`の出現箇所は、指定された名前のキャプチャグループに対応する部分シーケンスに置き換えられます。グループ参照の置換を名前とインデックスで比較できます。

```kotlin
fun dateReplace() {
    val dateRegex = Regex("(?<dd>\\d{2})-(?<mm>\\d{2})-(?<yyyy>\\d{4})")
    val input = "Date of birth: 27-04-2022"
    println(dateRegex.replace(input, "\${yyyy}-\${mm}-\${dd}")) // "Date of birth: 2022-04-27" — by name
    println(dateRegex.replace(input, "\$3-\$2-\$1")) // "Date of birth: 2022-04-27" — by number
}
```

## Gradle

このリリースでは、新しいビルドレポート、Gradleプラグインバリアントのサポート、kaptの新しい統計などが導入されます。

* [インクリメンタルコンパイルの新しいアプローチ](#a-new-approach-to-incremental-compilation)
* [コンパイラのパフォーマンス追跡のための新しいビルドレポート](#build-reports-for-kotlin-compiler-tasks)
* [GradleおよびAndroid Gradleプラグインの最小サポートバージョンの変更](#bumping-minimum-supported-versions)
* [Gradleプラグインバリアントのサポート](#support-for-gradle-plugin-variants)
* [Kotlin GradleプラグインAPIの更新](#updates-in-the-kotlin-gradle-plugin-api)
* [plugins APIを介したsam-with-receiverプラグインの利用](#the-sam-with-receiver-plugin-is-available-via-the-plugins-api)
* [コンパイルタスクの変更](#changes-in-compile-tasks)
* [kaptにおける各アノテーションプロセッサによる生成ファイルの新しい統計](#statistics-of-generated-files-by-each-annotation-processor-in-kapt)
* [kotlin.compiler.execution.strategyシステムプロパティの非推奨化](#deprecation-of-the-kotlin-compiler-execution-strategy-system-property)
* [非推奨オプション、メソッド、プラグインの削除](#removal-of-deprecated-options-methods-and-plugins)

### インクリメンタルコンパイルの新しいアプローチ

> インクリメンタルコンパイルの新しいアプローチは[実験的](components-stability.md)です。これはいつでも廃止または変更される可能性があります。オプトインが必要です（詳細は下記参照）。評価目的でのみ使用することを推奨しており、[YouTrack](https://youtrack.jetbrains.com/issues/KT)でフィードバックをいただければ幸いです。
>
{style="warning"}

Kotlin 1.7.0では、モジュール間の変更に対するインクリメンタルコンパイルを再設計しました。これにより、依存する非Kotlinモジュール内で行われた変更に対してもインクリメンタルコンパイルがサポートされ、[Gradleビルドキャッシュ](https://docs.gradle.org/current/userguide/build_cache.html)と互換性があります。コンパイル回避のサポートも改善されました。

ビルドキャッシュを使用している場合、または非Kotlin Gradleモジュールで頻繁に変更を行う場合、この新しいアプローチで最も大きなメリットが得られると期待しています。`kotlin-gradle-plugin`モジュールにおけるKotlinプロジェクトでの弊社のテストでは、キャッシュヒット後の変更で80%以上の改善が示されています。

この新しいアプローチを試すには、`gradle.properties`に以下のオプションを設定してください。

```none
kotlin.incremental.useClasspathSnapshot=true
```

> インクリメンタルコンパイルの新しいアプローチは、現在のところGradleビルドシステムにおけるJVMバックエンドでのみ利用可能です。
>
{style="note"}

インクリメンタルコンパイルの新しいアプローチが内部でどのように実装されているかについては、[こちらのブログ投稿](https://blog.jetbrains.com/kotlin/2022/07/a-new-approach-to-incremental-compilation-in-kotlin/)で詳しく説明されています。

私たちはこの技術を安定化させ、他のバックエンド（例えばJS）やビルドシステムへのサポートを追加することを計画しています。このコンパイルスキームで遭遇したいかなる問題や奇妙な動作についても、[YouTrack](https://youtrack.jetbrains.com/issues/KT)に報告していただければ幸いです。ありがとうございます！

Kotlinチームは、[Ivan Gavrilovic](https://github.com/gavra0)、[Hung Nguyen](https://github.com/hungvietnguyen)、[Cédric Champeau](https://github.com/melix)、およびその他の外部貢献者の皆様の協力に深く感謝しています。

### Kotlinコンパイラタスクのビルドレポート

> Kotlinビルドレポートは[実験的](components-stability.md)です。これらはいつでも廃止または変更される可能性があります。オプトインが必要です（詳細は下記参照）。評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issues/KT)でフィードバックをいただければ幸いです。
>
{style="warning"}

Kotlin 1.7.0では、コンパイラのパフォーマンスを追跡するのに役立つビルドレポートが導入されます。レポートには、異なるコンパイルフェーズの期間と、コンパイルがインクリメンタルにならなかった理由が含まれています。

ビルドレポートは、コンパイラタスクに関する問題を調査したい場合に役立ちます。例えば、以下のようなケースです。

* Gradleビルドに時間がかかりすぎ、パフォーマンス低下の根本原因を理解したい場合。
* 同じプロジェクトのコンパイル時間が異なる場合（数秒で終わることもあれば、数分かかることもある）。

ビルドレポートを有効にするには、`gradle.properties`でビルドレポートの出力先を宣言します。

```none
kotlin.build.report.output=file
```

以下の値（およびその組み合わせ）が利用可能です。

* `file`はビルドレポートをローカルファイルに保存します。
* `build_scan`はビルドレポートを[ビルドスキャン](https://scans.gradle.com/)の`custom values`セクションに保存します。

  > Gradle Enterpriseプラグインは、カスタム値の数とその長さを制限します。大規模なプロジェクトでは、一部の値が失われる可能性があります。
  >
  {style="note"}

* `http`はHTTP(S)を使用してビルドレポートを投稿します。POSTメソッドはJSON形式でメトリクスを送信します。データはバージョンによって変更される可能性があります。送信されるデータの現在のバージョンは、[Kotlinリポジトリ](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/report/data/GradleCompileStatisticsData.kt)で確認できます。

長時間のコンパイルに対するビルドレポートの分析が解決に役立つ一般的なケースが2つあります。

* ビルドがインクリメンタルではなかった場合。理由を分析し、根本的な問題を修正します。
* ビルドはインクリメンタルであったが、時間がかかりすぎた場合。ソースファイルを再編成してみてください — 大きなファイルを分割する、個々のクラスを別のファイルに保存する、大きなクラスをリファクタリングする、トップレベル関数を別のファイルで宣言する、など。

新しいビルドレポートの詳細については、[こちらのブログ投稿](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/)をご覧ください。

皆様のインフラストラクチャでビルドレポートを使用してみることを歓迎します。フィードバック、問題の発見、改善の提案などございましたら、お気軽に[課題トラッカー](https://youtrack.jetbrains.com/newIssue)までご報告ください。よろしくお願いいたします！

### 最小サポートバージョンの引き上げ

Kotlin 1.7.0以降、Gradleの最小サポートバージョンは6.7.1です。[Gradleプラグインバリアント](#support-for-gradle-plugin-variants)と新しいGradle APIをサポートするために、[バージョンを引き上げる必要がありました](https://youtrack.jetbrains.com/issue/KT-49733/Bump-minimal-supported-Gradle-version-to-6-7-1)。Gradleプラグインバリアント機能のおかげで、今後は最小サポートバージョンを頻繁に引き上げる必要はなくなるはずです。

また、最小サポートAndroid Gradleプラグインバージョンは現在3.6.4です。

### Gradleプラグインバリアントのサポート

Gradle 7.0では、Gradleプラグイン作者向けの新しい機能 — [バリアントを持つプラグイン](https://docs.gradle.org/7.0/userguide/implementing_gradle_plugins.html#plugin-with-variants) — が導入されました。この機能により、Gradle 7.1より前のバージョンとの互換性を維持しながら、新しいGradle機能のサポートを簡単に追加できるようになります。[Gradleでのバリアント選択](https://docs.gradle.org/current/userguide/variant_model.html)について詳しく学びましょう。

Gradleプラグインバリアントを使用すると、異なるGradleバージョンに対応する異なるKotlin Gradleプラグインバリアントを出荷できます。目標は、最も古いサポート対象のGradleバージョンに対応する`main`バリアントで基本的なKotlinコンパイルをサポートすることです。各バリアントは、対応するリリースからのGradle機能の実装を持ちます。最新のバリアントは、最も広範なGradle機能セットをサポートします。このアプローチにより、機能が制限された古いGradleバージョンへのサポートを拡張できます。

現在、Kotlin Gradleプラグインには2つのバリアントのみがあります。

* Gradleバージョン6.7.1～6.9.3向けの`main`
* Gradleバージョン7.0以降向けの`gradle70`

今後のKotlinリリースでは、さらに追加される可能性があります。

ビルドがどのバリアントを使用しているかを確認するには、[`--info`ログレベル](https://docs.gradle.org/current/userguide/logging.html#sec:choosing_a_log_level)を有効にし、出力で`Using Kotlin Gradle plugin`で始まる文字列（例: `Using Kotlin Gradle plugin main variant`）を見つけます。

> 以下は、Gradleでのバリアント選択に関する既知の問題の回避策です。
> * [pluginManagementでのResolutionStrategyがマルチバリアントプラグインで機能しない](https://github.com/gradle/gradle/issues/20545)
> * [`buildSrc`共通依存関係としてプラグインが追加された場合、プラグインバリアントが無視される](https://github.com/gradle/gradle/issues/20847)
>
{style="note"}

[こちらのYouTrackチケット](https://youtrack.jetbrains.com/issue/KT-49227/Support-Gradle-plugins-variants)でフィードバックをお寄せください。

### Kotlin GradleプラグインAPIの更新

Kotlin GradleプラグインAPIアーティファクトにいくつかの改善が加えられました。

* ユーザーが設定可能な入力を持つKotlin/JVMおよびKotlin/kaptタスクの新しいインターフェースが追加されました。
* すべてのKotlinプラグインが継承する新しい`KotlinBasePlugin`インターフェースが追加されました。このインターフェースは、任意のKotlin Gradleプラグイン（JVM、JS、Multiplatform、Native、およびその他のプラットフォーム）が適用されるたびに何らかの設定アクションをトリガーしたい場合に使用します。

  ```kotlin
  project.plugins.withType<org.jetbrains.kotlin.gradle.plugin.KotlinBasePlugin>() {
      // Configure your action here
  }
  ```
  [`KotlinBasePlugin`](https://youtrack.jetbrains.com/issue/KT-48008/Consider-offering-a-KotlinBasePlugin)に関するフィードバックは、[こちらのYouTrackチケット](https://youtrack.jetbrains.com/issue/KT-48008/Consider-offering-a-KotlinBasePlugin)にお寄せください。

* Android GradleプラグインがKotlinコンパイルを自身で設定できるようにするための基盤を構築しました。つまり、ビルドにKotlin Android Gradleプラグインを追加する必要がなくなります。[Android Gradle Pluginリリースアナウンス](https://developer.android.com/studio/releases/gradle-plugin)をフォローして、追加されたサポートについて学び、試してみてください！

### plugins APIを介したsam-with-receiverプラグインの利用

[sam-with-receiverコンパイラプラグイン](sam-with-receiver-plugin.md)が、[Gradle plugins DSL](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block)を介して利用可能になりました。

```kotlin
plugins {
    id("org.jetbrains.kotlin.plugin.sam.with.receiver") version "$kotlin_version"
}
```

### コンパイルタスクの変更

コンパイルタスクは、このリリースで多くの変更を受けました。

* Kotlinコンパイルタスクは、Gradleの`AbstractCompile`タスクを継承しなくなりました。`DefaultTask`のみを継承します。
* `AbstractCompile`タスクには`sourceCompatibility`および`targetCompatibility`入力がありました。`AbstractCompile`タスクが継承されなくなったため、これらの入力はKotlinユーザーのスクリプトでは利用できなくなりました。
* `SourceTask.stableSources`入力は利用できなくなり、`sources`入力を使用する必要があります。`setSource(...)`メソッドは引き続き利用可能です。
* すべてのコンパイルタスクは、コンパイルに必要なライブラリのリストとして`libraries`入力を使用するようになりました。`KotlinCompile`タスクには、将来のリリースで削除される非推奨のKotlinプロパティ`classpath`がまだあります。
* コンパイルタスクは引き続き`PatternFilterable`インターフェースを実装しており、これによりKotlinソースのフィルタリングが可能です。`sourceFilesExtensions`入力は、`PatternFilterable`メソッドを使用することに置き換えられ削除されました。
* 非推奨の`Gradle destinationDir: File`出力は、`destinationDirectory: DirectoryProperty`出力に置き換えられました。
* Kotlin/Nativeの`AbstractNativeCompile`タスクは、`AbstractKotlinCompileTool`基本クラスを継承するようになりました。これは、Kotlin/Nativeビルドツールを他のすべてのツールに統合するための最初のステップです。

[こちらのYouTrackチケット](https://youtrack.jetbrains.com/issue/KT-32805)でフィードバックをお寄せください。

### kaptにおける各アノテーションプロセッサによる生成ファイルの新しい統計

`kotlin-kapt` Gradleプラグインは、すでに[各プロセッサのパフォーマンス統計を報告しています](https://github.com/JetBrains/kotlin/pull/4280)。Kotlin 1.7.0以降、各アノテーションプロセッサによって生成されたファイルの数に関する統計も報告できるようになりました。

これは、ビルドの一部として未使用のアノテーションプロセッサがあるかどうかを追跡するのに役立ちます。生成されたレポートを使用して、不要なアノテーションプロセッサをトリガーするモジュールを見つけ、それを防ぐためにモジュールを更新することができます。

統計を有効にするには、2つのステップが必要です。

* `build.gradle.kts`で`showProcessorStats`フラグを`true`に設定します。

  ```kotlin
  kapt {
      showProcessorStats = true
  }
  ```

* `gradle.properties`で`kapt.verbose`Gradleプロパティを`true`に設定します。
  
  ```none
  kapt.verbose=true
  ```

> [コマンドラインオプション`verbose`](kapt.md#use-in-cli)を介して詳細出力を有効にすることもできます。
>
{style="note"}

統計は`info`レベルでログに表示されます。`Annotation processor stats:`行に続いて、各アノテーションプロセッサの実行時間に関する統計が表示されます。これらの行の後に、`Generated files report:`行に続いて、各アノテーションプロセッサによって生成されたファイルの数に関する統計が表示されます。例：

```text
[INFO] Annotation processor stats:
[INFO] org.mapstruct.ap.MappingProcessor: total: 290 ms, init: 1 ms, 3 round(s): 289 ms, 0 ms, 0 ms
[INFO] Generated files report:
[INFO] org.mapstruct.ap.MappingProcessor: total sources: 2, sources per round: 2, 0, 0
```

[こちらのYouTrackチケット](https://youtrack.jetbrains.com/issue/KT-51132/KAPT-Support-reporting-the-number-of-generated-files-by-each-ann)でフィードバックをお寄せください。

### kotlin.compiler.execution.strategyシステムプロパティの非推奨化

Kotlin 1.6.20では、[Kotlinコンパイラの実行戦略を定義するための新しいプロパティ](whatsnew1620.md#properties-for-defining-kotlin-compiler-execution-strategy)が導入されました。Kotlin 1.7.0では、新しいプロパティを優先して、古いシステムプロパティ`kotlin.compiler.execution.strategy`の非推奨化サイクルが開始されました。

`kotlin.compiler.execution.strategy`システムプロパティを使用すると、警告が表示されます。このプロパティは将来のリリースで削除されます。以前の動作を維持するには、システムプロパティを同名のGradleプロパティに置き換えてください。これは`gradle.properties`で行うことができます。例：

```none
kotlin.compiler.execution.strategy=out-of-process
```

コンパイルタスクプロパティ`compilerExecutionStrategy`も使用できます。これについては、[Gradleページ](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy)で詳しく学ぶことができます。

### 非推奨オプション、メソッド、プラグインの削除

#### useExperimentalAnnotationメソッドの削除

Kotlin 1.7.0では、`useExperimentalAnnotation` Gradleメソッドの非推奨化サイクルが完了しました。モジュールでAPIの使用をオプトインするには、代わりに`optIn()`を使用してください。

例えば、Gradleモジュールがマルチプラットフォームの場合：

```kotlin
sourceSets {
    all {
        languageSettings.optIn("org.mylibrary.OptInAnnotation")
    }
}
```

Kotlinの[オプトイン要件](opt-in-requirements.md)について詳しく学びましょう。

#### 非推奨コンパイラオプションの削除

いくつかのコンパイラオプションの非推奨化サイクルが完了しました。

* `kotlinOptions.jdkHome`コンパイラオプションは1.5.30で非推奨となり、現在のリリースで削除されました。このオプションを含むGradleビルドは失敗するようになりました。Kotlin 1.5.30以降サポートされている[Javaツールチェーン](whatsnew1530.md#support-for-java-toolchains)の使用を推奨します。
* 非推奨の`noStdlib`コンパイラオプションも削除されました。Gradleプラグインは、`kotlin.stdlib.default.dependency=true`プロパティを使用してKotlin標準ライブラリが存在するかどうかを制御します。

> コンパイラ引数`-jdkHome`および`-no-stdlib`は引き続き利用可能です。
>
{style="note"}

#### 非推奨プラグインの削除

Kotlin 1.4.0で`kotlin2js`および`kotlin-dce-plugin`プラグインは非推奨となり、このリリースで削除されました。`kotlin2js`の代わりに、新しい`org.jetbrains.kotlin.js`プラグインを使用してください。デッドコード除去（DCE）は、Kotlin/JS Gradleプラグインが[適切に設定されている](javascript-dce.md)場合に動作します。

Kotlin 1.6.0で、`KotlinGradleSubplugin`クラスの非推奨レベルを`ERROR`に変更しました。開発者はこのクラスをコンパイラプラグインの記述に使用していました。このリリースでは、[このクラスが削除されました](https://youtrack.jetbrains.com/issue/KT-48831/)。代わりに`KotlinCompilerPluginSupportPlugin`クラスを使用してください。

> ベストプラクティスは、プロジェクト全体でKotlinプラグインのバージョン1.7.0以降を使用することです。
>
{style="tip"}

#### 非推奨のコルーチンDSLオプションとプロパティの削除

非推奨の`kotlin.experimental.coroutines` Gradle DSLオプションと、`gradle.properties`で使用されていた`kotlin.coroutines`プロパティを削除しました。これからは、単に_[中断関数](coroutines-basics.md#extract-function-refactoring)_を使用するか、ビルドスクリプトに[`kotlinx.coroutines`の依存関係を追加](gradle-configure-project.md#set-a-dependency-on-a-kotlinx-library)するだけで済みます。

コルーチンに関する詳細については、[コルーチンガイド](coroutines-guide.md)をご覧ください。

#### ツールチェーン拡張メソッドにおける型キャストの削除

Kotlin 1.7.0より前は、Kotlin DSLでGradleツールチェーンを設定する際に、`JavaToolchainSpec`クラスへの型キャストを行う必要がありました。

```kotlin
kotlin {
    jvmToolchain {
        (this as JavaToolchainSpec).languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)
    }
}
```

今では、`(this as JavaToolchainSpec)`の部分を省略できます。

```kotlin
kotlin {
    jvmToolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)
    }
}
```

## Kotlin 1.7.0への移行

### Kotlin 1.7.0をインストール

IntelliJ IDEA 2022.1およびAndroid Studio Chipmunk (212)は、Kotlinプラグインを1.7.0に自動的に更新することを推奨します。

> IntelliJ IDEA 2022.2、Android Studio Dolphin (213)、またはAndroid Studio Electric Eel (221)の場合、Kotlinプラグイン1.7.0は今後のIntelliJ IDEAおよびAndroid Studioのアップデートとともに提供されます。
> 
{style="note"}

新しいコマンドラインコンパイラは、[GitHubのリリースページ](https://github.com/JetBrains/kotlin/releases/tag/v1.7.0)からダウンロードできます。

### 既存プロジェクトの移行またはKotlin 1.7.0での新規プロジェクトの開始

* 既存のプロジェクトをKotlin 1.7.0に移行するには、Kotlinのバージョンを`1.7.0`に変更し、GradleまたはMavenプロジェクトを再インポートします。[Kotlin 1.7.0への更新方法](releases.md#update-to-a-new-kotlin-version)をご覧ください。

* Kotlin 1.7.0で新しいプロジェクトを開始するには、Kotlinプラグインを更新し、**File** | **New** | **Project**からプロジェクトウィザードを実行します。

### Kotlin 1.7.0の互換性ガイド

Kotlin 1.7.0は[機能リリース](kotlin-evolution-principles.md#language-and-tooling-releases)であるため、以前の言語バージョンで書かれたコードと互換性のない変更をもたらす可能性があります。そのような変更の詳細なリストは、[Kotlin 1.7.0の互換性ガイド](compatibility-guide-17.md)で確認できます。