[//]: # (title: Kotlin 1.7.0の新機能)

<tldr>
   <p>Kotlin 1.7.0のIDEサポートは、IntelliJ IDEA 2021.2、2021.3、2022.1で利用可能です。</p>
</tldr>

_[リリース日: 2022年6月9日](releases.md#release-details)_

Kotlin 1.7.0がリリースされました。このバージョンでは、新しいKotlin/JVM K2コンパイラのAlpha版が公開され、言語機能が安定化され、JVM、JS、Nativeプラットフォームでのパフォーマンスが向上しています。

このバージョンの主な更新点は以下の通りです。

* [新しいKotlin K2コンパイラがAlpha版になりました](#new-kotlin-k2-compiler-for-the-jvm-in-alpha)。大幅なパフォーマンス向上を実現します。JVMでのみ利用可能で、kaptを含むコンパイラプラグインは動作しません。
* [Gradleのインクリメンタルコンパイルへの新しいアプローチ](#a-new-approach-to-incremental-compilation)。インクリメンタルコンパイルは、依存するKotlin以外のモジュール内部での変更にも対応し、Gradleと互換性があります。
* [オプトイン要件アノテーション](#stable-opt-in-requirements)、[null許容型でないことが保証される型](#stable-definitely-non-nullable-types)、[ビルダ推論](#stable-builder-inference)が安定化されました。
* [型引数にアンダースコア演算子が追加されました](#underscore-operator-for-type-arguments)。他の型が指定されている場合に、引数の型を自動的に推論するために使用できます。
* [このリリースでは、インラインクラスのインライン化された値へのデリゲートによる実装が可能になりました](#allow-implementation-by-delegation-to-an-inlined-value-of-an-inline-class)。ほとんどの場合、メモリを割り当てない軽量なラッパーを作成できるようになりました。

変更点の概要については、以下のビデオでもご確認いただけます。

<video src="https://www.youtube.com/v/54WEfLKtCGk" title="Kotlin 1.7.0の新機能"/>

## JVM向け新しいKotlin K2コンパイラのAlpha版

このKotlinリリースでは、新しいKotlin K2コンパイラの**Alpha**版が導入されます。新しいコンパイラは、新しい言語機能の開発を加速し、Kotlinがサポートするすべてのプラットフォームを統一し、パフォーマンス向上をもたらし、コンパイラ拡張のためのAPIを提供することを目的としています。

新しいコンパイラとその利点については、すでに詳細な説明を公開しています。

* [新しいKotlinコンパイラへの道](https://www.youtube.com/watch?v=iTdJJq_LyoY)
* [K2コンパイラ: トップダウンビュー](https://www.youtube.com/watch?v=db19VFLZqJM)

新しいK2コンパイラのAlpha版では、主にパフォーマンス向上に注力したため、JVMプロジェクトでのみ動作することに注意してください。Kotlin/JS、Kotlin/Native、またはその他のマルチプラットフォームプロジェクトはサポートしておらず、[kapt](kapt.md)を含むどのコンパイラプラグインも動作しません。

弊社のベンチマークでは、社内プロジェクトで優れた結果が示されています。

| プロジェクト       | 現在のKotlinコンパイラのパフォーマンス | 新しいK2 Kotlinコンパイラのパフォーマンス | パフォーマンス向上率 |
|---------------|-------------------------------------|------------------------------------|-------------------|
| Kotlin        | 2.2 KLOC/s                          | 4.8 KLOC/s                         | ~ x2.2            |
| YouTrack      | 1.8 KLOC/s                          | 4.2 KLOC/s                         | ~ x2.3            |
| IntelliJ IDEA | 1.8 KLOC/s                          | 3.9 KLOC/s                         | ~ x2.2            |
| Space         | 1.2 KLOC/s                          | 2.8 KLOC/s                         | ~ x2.3            |

> KLOC/sのパフォーマンス数値は、コンパイラが1秒あたりに処理するコードの千行単位の数値を表します。
>
> {style="tip"}

JVMプロジェクトでパフォーマンス向上を確認し、古いコンパイラのパフォーマンスと比較できます。Kotlin K2コンパイラを有効にするには、以下のコンパイラオプションを使用します。

```bash
-Xuse-k2
```

また、K2コンパイラには[多数のバグ修正が含まれています](https://youtrack.jetbrains.com/issues/KT?q=tag:%20FIR-preview-qa%20%23Resolved)。このリストにある**State: Open** (オープン状態) の問題も、実際にはK2で修正されています。

今後のKotlinリリースでは、K2コンパイラの安定性が向上し、さらなる機能が提供される予定ですので、ご期待ください！

Kotlin K2コンパイラでパフォーマンスの問題に直面した場合は、[課題トラッカーに報告してください](https://kotl.in/issue)。

## 言語

Kotlin 1.7.0では、デリゲートによる実装のサポートと、型引数用の新しいアンダースコア演算子が導入されました。また、以前のリリースでプレビュー版として導入されたいくつかの言語機能が安定化されました。

* [インラインクラスのインライン化された値へのデリゲートによる実装](#allow-implementation-by-delegation-to-an-inlined-value-of-an-inline-class)
* [型引数にアンダースコア演算子](#underscore-operator-for-type-arguments)
* [ビルダ推論の安定化](#stable-builder-inference)
* [オプトイン要件の安定化](#stable-opt-in-requirements)
* [null許容型でないことが保証される型の安定化](#stable-definitely-non-nullable-types)

### インラインクラスのインライン化された値へのデリゲートによる実装を許可

値やクラスインスタンスの軽量なラッパーを作成したい場合、すべてのインターフェースメソッドを手動で実装する必要がありました。デリゲートによる実装はこの問題を解決しますが、1.7.0以前ではインラインクラスでは動作しませんでした。この制限が削除されたため、ほとんどの場合、メモリを割り当てない軽量なラッパーを作成できるようになりました。

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

### 型引数にアンダースコア演算子

Kotlin 1.7.0では、型引数にアンダースコア演算子`_`が導入されました。他の型が指定されている場合に、型引数を自動的に推論するために使用できます。

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
    // SomeImplementationがSomeClass<String>を継承しているため、TはStringと推論される
    val s = Runner.run<SomeImplementation, _>()
    assert(s == "Test")

    // OtherImplementationがSomeClass<Int>を継承しているため、TはIntと推論される
    val n = Runner.run<OtherImplementation, _>()
    assert(n == 42)
}
```

> 変数リストのどの位置でもアンダースコア演算子を使用して、型引数を推論できます。
>
{style="note"}

### ビルダ推論の安定化

ビルダ推論は、ジェネリックビルダ関数を呼び出す際に役立つ特殊な型の型推論です。ラムダ引数内の他の呼び出しに関する型情報を使用して、呼び出しの型引数をコンパイラが推論するのを助けます。

1.7.0以降、`-Xenable-builder-inference`コンパイラオプションを指定しなくても、通常の型推論が型に関する十分な情報を取得できない場合、ビルダ推論は自動的に有効化されます。このオプションは[1.6.0で導入されました](whatsnew16.md#changes-to-builder-inference)。

[カスタムジェネリックビルダの書き方](using-builders-with-builder-inference.md)をご覧ください。

### オプトイン要件の安定化

[オプトイン要件](opt-in-requirements.md)は[安定版](components-stability.md)となり、追加のコンパイラ設定は不要になりました。

1.7.0より前では、オプトイン機能自体が警告を回避するために`-opt-in=kotlin.RequiresOptIn`引数を必要としていました。これは不要になりましたが、引き続き`-opt-in`コンパイラ引数を使用して、他のアノテーションや[モジュール](opt-in-requirements.md#opt-in-a-module)をオプトインすることができます。

### null許容型でないことが保証される型の安定化

Kotlin 1.7.0では、null許容型でないことが保証される型は[安定版](components-stability.md)に昇格しました。これらは、ジェネリックなJavaクラスやインターフェースを拡張する際に、より良い相互運用性を提供します。

新しい構文`T & Any`を使用すると、使用箇所でジェネリック型パラメータをnull許容型でないことが保証される型としてマークできます。この構文形式は[交差型](https://en.wikipedia.org/wiki/Intersection_type)の表記法に由来しており、`&`の左側にnull許容上限を持つ型パラメータ、右側にnull許容型でない`Any`がある場合に限定されます。

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

null許容型でないことが保証される型の詳細については、[こちらのKEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types.md)をご覧ください。

## Kotlin/JVM

このリリースでは、Kotlin/JVMコンパイラのパフォーマンス向上と新しいコンパイラオプションがもたらされます。さらに、関数型インターフェースのコンストラクタへの呼び出し可能参照が安定版になりました。1.7.0以降、Kotlin/JVMコンパイルのデフォルトのターゲットバージョンは`1.8`であることに注意してください。

* [コンパイラのパフォーマンス最適化](#compiler-performance-optimizations)
* [新しいコンパイラオプション `-Xjdk-release`](#new-compiler-option-xjdk-release)
* [関数型インターフェースのコンストラクタへの呼び出し可能参照の安定化](#stable-callable-references-to-functional-interface-constructors)
* [JVMターゲットバージョン1.6の削除](#removed-jvm-target-version-1-6)

### コンパイラのパフォーマンス最適化

Kotlin 1.7.0では、Kotlin/JVMコンパイラのパフォーマンスが向上しています。弊社のベンチマークによると、コンパイル時間はKotlin 1.6.0と比較して[平均10%短縮されました](https://youtrack.jetbrains.com/issue/KT-48233/Switching-to-JVM-IR-backend-increases-compilation-time-by-more-t#focus=Comments-27-6114542.0-0)。例えば、[kotlinx.htmlを使用するプロジェクト](https://youtrack.jetbrains.com/issue/KT-51416/Compilation-of-kotlinx-html-DSL-should-still-be-faster)のように、インライン関数の使用が多いプロジェクトでは、バイトコードの後処理の改善によりコンパイルが速くなります。

### 新しいコンパイラオプション: -Xjdk-release

Kotlin 1.7.0では、新しいコンパイラオプション`-Xjdk-release`が導入されます。このオプションは[javacのコマンドライン`--release`オプション](http://openjdk.java.net/jeps/247)と似ています。`-Xjdk-release`オプションは、ターゲットバイトコードバージョンを制御し、クラスパス内のJDKのAPIを指定されたJavaバージョンに制限します。例えば、`kotlinc -Xjdk-release=1.8`を使用すると、依存関係にあるJDKがバージョン9以上であっても`java.lang.Module`を参照できなくなります。

> このオプションは、すべてのJDKディストリビューションに対して[有効であることが保証されていません](https://youtrack.jetbrains.com/issue/KT-29974)。
>
{style="note"}

[こちらのYouTrackチケット](https://youtrack.jetbrains.com/issue/KT-29974/Add-a-compiler-option-Xjdk-release-similar-to-javac-s-release-to)でフィードバックをお寄せください。

### 関数型インターフェースのコンストラクタへの呼び出し可能参照の安定化

関数型インターフェースのコンストラクタへの[呼び出し可能参照](reflection.md#callable-references)は[安定版](components-stability.md)になりました。[コンストラクタ関数を持つインターフェースから関数型インターフェースへ、呼び出し可能参照を使用して移行する方法](fun-interfaces.md#migration-from-an-interface-with-constructor-function-to-a-functional-interface)をご覧ください。

見つかった問題は[YouTrack](https://youtrack.jetbrains.com/newissue?project=kt)にご報告ください。

### JVMターゲットバージョン1.6の削除

Kotlin/JVMコンパイルのデフォルトのターゲットバージョンは`1.8`です。`1.6`ターゲットは削除されました。

JVMターゲット1.8以降に移行してください。JVMターゲットバージョンの更新方法については、以下をご覧ください。

* [Gradle](gradle-compiler-options.md#attributes-specific-to-jvm)
* [Maven](maven.md#attributes-specific-to-jvm)
* [コマンドラインコンパイラ](compiler-reference.md#jvm-target-version)

## Kotlin/Native

Kotlin 1.7.0には、Objective-CおよびSwiftとの相互運用性の変更、以前のリリースで導入された機能の安定化が含まれています。また、新しいメモリマネージャーのパフォーマンス向上とその他の更新ももたらされます。

* [新しいメモリマネージャーのパフォーマンス向上](#performance-improvements-for-the-new-memory-manager)
* [JVMおよびJS IRバックエンドとの統一されたコンパイラプラグインABI](#unified-compiler-plugin-abi-with-jvm-and-js-ir-backends)
* [スタンドアロンAndroid実行可能ファイルのサポート](#support-for-standalone-android-executables)
* [Swift async/awaitとの相互運用: KotlinUnitの代わりにVoidを返す](#interop-with-swift-async-await-returning-void-instead-of-kotlinunit)
* [Objective-Cブリッジを介した未宣言例外の禁止](#prohibited-undeclared-exceptions-through-objective-c-bridges)
* [CocoaPods統合の改善](#improved-cocoapods-integration)
* [Kotlin/NativeコンパイラのダウンロードURLの上書き](#overriding-the-kotlin-native-compiler-download-url)

### 新しいメモリマネージャーのパフォーマンス向上

> 新しいKotlin/Nativeメモリマネージャーは[Alpha版](components-stability.md)です。
> 将来的に非互換な変更が加えられたり、手動での移行が必要になったりする可能性があります。
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525)でのフィードバックをいただければ幸いです。
>
{style="note"}

新しいメモリマネージャーはまだAlpha版ですが、[安定版](components-stability.md)になる途上にあります。このリリースでは、新しいメモリマネージャー、特にガベージコレクション (GC) のパフォーマンスが大幅に向上しています。特に、[1.6.20で導入された](whatsnew1620.md)スウィープフェーズの並行実装がデフォルトで有効になりました。これにより、アプリケーションがGCのために一時停止する時間を短縮できます。新しいGCスケジューラは、特に大規模なヒープにおいて、GCの頻度をより適切に選択します。

また、デバッグバイナリを特に最適化し、メモリマネージャーの実装コードで適切な最適化レベルとリンク時最適化が使用されるようにしました。これにより、弊社のベンチマークではデバッグバイナリの実行時間が約30%改善されました。

プロジェクトで新しいメモリマネージャーを試してその動作を確認し、[YouTrack](https://youtrack.jetbrains.com/issue/KT-48525)でフィードバックをお寄せください。

### JVMおよびJS IRバックエンドとの統一されたコンパイラプラグインABI

Kotlin 1.7.0以降、Kotlin Multiplatform Gradleプラグインは、Kotlin/Native用の組み込み可能なコンパイラJARをデフォルトで使用します。この[機能は1.6.0で実験的として発表されました](whatsnew16.md#unified-compiler-plugin-abi-with-jvm-and-js-ir-backends)が、現在は安定版となり、使用準備が整っています。

この改善は、コンパイラプラグイン開発体験を向上させるため、ライブラリ開発者にとって非常に便利です。このリリース以前は、Kotlin/Native用に個別のアーティファクトを提供する必要がありましたが、現在はNativeおよびその他のサポートされるプラットフォームで同じコンパイラプラグインアーティファクトを使用できます。

> この機能は、プラグイン開発者が既存のプラグインに対して移行手順を踏む必要がある場合があります。
>
> アップデートに向けてプラグインを準備する方法については、[こちらのYouTrack課題](https://youtrack.jetbrains.com/issue/KT-48595)をご覧ください。
>
{style="warning"}

### スタンドアロンAndroid実行可能ファイルのサポート

Kotlin 1.7.0は、Android Nativeターゲット用の標準の実行可能ファイルを生成するための完全なサポートを提供します。これは[1.6.20で導入されました](whatsnew1620.md#support-for-standalone-android-executables)が、現在はデフォルトで有効になっています。

Kotlin/Nativeが共有ライブラリを生成していた以前の動作に戻したい場合は、以下の設定を使用します。

```kotlin
binaryOptions["androidProgramType"] = "nativeActivity"
```

### Swift async/awaitとの相互運用: KotlinUnitの代わりにVoidを返す

Kotlinの`suspend`関数は、Swiftで`KotlinUnit`の代わりに`Void`型を返すようになりました。これは、Swiftの`async`/`await`との相互運用性が向上した結果です。この機能は[1.6.20で導入されました](whatsnew1620.md#interop-with-swift-async-await-returning-void-instead-of-kotlinunit)が、このリリースではこの動作がデフォルトで有効になっています。

このような関数に適切な型を返すために、`kotlin.native.binary.unitSuspendFunctionObjCExport=proper`プロパティを使用する必要はなくなりました。

### Objective-Cブリッジを介した未宣言例外の禁止

KotlinコードをSwift/Objective-Cコードから呼び出す場合（またはその逆）、そのコードが例外をスローすると、例外が発生したコードで処理されるべきです。ただし、適切な変換（例えば、`@Throws`アノテーションの使用など）を伴う言語間で例外転送を明示的に許可している場合は別です。

以前のKotlinには、未宣言の例外が一部のケースで意図せずある言語から別の言語に「リーク」するという動作がありました。Kotlin 1.7.0ではその問題が修正され、現在はそのようなケースではプログラムが終了します。

したがって、例えばKotlinに`{ throw Exception() }`ラムダがあり、それをSwiftから呼び出す場合、Kotlin 1.7.0では例外がSwiftコードに到達するとすぐに終了します。以前のKotlinバージョンでは、そのような例外がSwiftコードにリークする可能性がありました。

`@Throws`アノテーションは以前と同様に動作します。

### CocoaPods統合の改善

Kotlin 1.7.0以降、プロジェクトにCocoaPodsを統合したい場合でも、`cocoapods-generate`プラグインをインストールする必要がなくなりました。

以前は、CocoaPodsを使用するため、例えばKotlin Multiplatform Mobileプロジェクトで[iOSの依存関係](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-ios-dependencies.html#with-cocoapods)を処理するために、CocoaPods依存関係マネージャーと`cocoapods-generate`プラグインの両方をインストールする必要がありました。

これでCocoaPods統合のセットアップが容易になり、`cocoapods-generate`がRuby 3以降にインストールできない問題も解決されました。Apple M1でより良く動作する最新のRubyバージョンもサポートされています。

[初期のCocoaPods統合](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html#set-up-an-environment-to-work-with-cocoapods)のセットアップ方法をご覧ください。

### Kotlin/NativeコンパイラのダウンロードURLの上書き

Kotlin 1.7.0以降、Kotlin/NativeコンパイラのダウンロードURLをカスタマイズできます。これは、CI上の外部リンクが禁止されている場合に役立ちます。

デフォルトのベースURL `https://download.jetbrains.com/kotlin/native/builds` を上書きするには、以下のGradleプロパティを使用します。

```none
kotlin.native.distribution.baseDownloadUrl=https://example.com
```

> ダウンローダーは、ネイティブバージョンとターゲットOSをこのベースURLに追加して、実際のコンパイラディストリビューションがダウンロードされるようにします。
>
{style="note"}

## Kotlin/JS

Kotlin/JSは、[JS IRコンパイラバックエンド](js-ir-compiler.md)のさらなる改善と、開発体験を向上させるその他のアップデートを受けています。

* [新しいIRバックエンドのパフォーマンス向上](#performance-improvements-for-the-new-ir-backend)
* [IR使用時のメンバー名のミニファイ](#minification-for-member-names-when-using-ir)
* [IRバックエンドでのポリフィルによる古いブラウザのサポート](#support-for-older-browsers-via-polyfills-in-the-ir-backend)
* [js式からのJavaScriptモジュールの動的ロード](#dynamically-load-javascript-modules-from-js-expressions)
* [JavaScriptテストランナー用の環境変数を指定](#specify-environment-variables-for-javascript-test-runners)

### 新しいIRバックエンドのパフォーマンス向上

このリリースには、開発体験を向上させるいくつかの大きなアップデートが含まれています。

* Kotlin/JSのインクリメンタルコンパイルパフォーマンスが大幅に改善されました。JSプロジェクトのビルドにかかる時間が短縮されます。インクリメンタルなリビルドは、多くの場合、レガシーバックエンドとほぼ同等になりました。
* Kotlin/JSの最終バンドルは、最終成果物のサイズを大幅に削減したため、必要なスペースが少なくなりました。一部の大規模プロジェクトでは、プロダクションバンドルサイズがレガシーバックエンドと比較して最大20%削減されたことを確認しています。
* インターフェースの型チェックが桁違いに改善されました。
* Kotlinはより高品質なJSコードを生成します。

### IR使用時のメンバー名のミニファイ

Kotlin/JS IRコンパイラは、Kotlinのクラスと関数の関係に関する内部情報を使用して、関数、プロパティ、クラスの名前を短縮する、より効率的なミニファイ（軽量化）を適用するようになりました。これにより、結果としてバンドルされるアプリケーションが縮小されます。

この種類のミニファイは、Kotlin/JSアプリケーションをプロダクションモードでビルドする際に自動的に適用され、デフォルトで有効になっています。メンバー名のミニファイを無効にするには、`-Xir-minimized-member-names`コンパイラフラグを使用します。

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

Kotlin/JSのIRコンパイラバックエンドには、レガシーバックエンドと同じポリフィルが含まれるようになりました。これにより、新しいコンパイラでコンパイルされたコードは、Kotlin標準ライブラリで使用されるES2015のすべてのメソッドをサポートしていない古いブラウザでも実行できるようになります。プロジェクトで実際に使用されるポリフィルのみが最終バンドルに含まれるため、バンドルサイズへの潜在的な影響を最小限に抑えます。

この機能はIRコンパイラを使用する場合にデフォルトで有効になっており、設定する必要はありません。

### js式からのJavaScriptモジュールの動的ロード

JavaScriptモジュールを扱うほとんどのアプリケーションは、[JavaScriptモジュールの統合](js-modules.md)でカバーされている静的インポートを使用します。しかし、Kotlin/JSには、アプリケーションでJavaScriptモジュールを実行時に動的にロードするメカニズムが不足していました。

Kotlin 1.7.0以降、JavaScriptからの`import`ステートメントが`js`ブロックでサポートされ、パッケージをアプリケーションに実行時に動的に取り込むことができるようになりました。

```kotlin
val myPackage = js("import('my-package')")
```

### JavaScriptテストランナー用の環境変数を指定

Node.jsパッケージの解決を調整したり、Node.jsテストに外部情報を渡したりするために、JavaScriptテストランナーが使用する環境変数を指定できるようになりました。環境変数を定義するには、ビルドスクリプトの`testTask`ブロック内で、キーと値のペアを指定して`environment()`関数を使用します。

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

## Gradle

このリリースでは、新しいビルドレポート、Gradleプラグインバリアントのサポート、kaptの新しい統計情報などが導入されます。

* [インクリメンタルコンパイルへの新しいアプローチ](#a-new-approach-to-incremental-compilation)
* [コンパイラのパフォーマンスを追跡するための新しいビルドレポート](#build-reports-for-kotlin-compiler-tasks)
* [GradleおよびAndroid Gradleプラグインの最小サポートバージョンの変更](#bumping-minimum-supported-versions)
* [Gradleプラグインバリアントのサポート](#support-for-gradle-plugin-variants)
* [Kotlin GradleプラグインAPIの更新](#updates-in-the-kotlin-gradle-plugin-api)
* [plugins APIを介したsam-with-receiverプラグインの利用可能性](#the-sam-with-receiver-plugin-is-available-via-the-plugins-api)
* [コンパイルタスクの変更](#changes-in-compile-tasks)
* [kaptの各アノテーションプロセッサによって生成されたファイルの新しい統計情報](#statistics-of-generated-files-by-each-annotation-processor-in-kapt)
* [kotlin.compiler.execution.strategyシステムプロパティの非推奨化](#deprecation-of-the-kotlin-compiler-execution-strategy-system-property)
* [非推奨オプション、メソッド、プラグインの削除](#removal-of-deprecated-options-methods-and-plugins)

### インクリメンタルコンパイルへの新しいアプローチ

> インクリメンタルコンパイルへの新しいアプローチは[実験的](components-stability.md)です。これはいつでも廃止または変更される可能性があります。
> オプトインが必要です（詳細については下記を参照）。評価目的でのみ使用することをお勧めします。
> [YouTrack](https://youtrack.jetbrains.com/issues/KT)でのフィードバックをいただければ幸いです。
>
{style="warning"}

Kotlin 1.7.0では、クロスモジュール変更のためのインクリメンタルコンパイルを再設計しました。これで、インクリメンタルコンパイルは依存するKotlin以外のモジュール内部での変更にも対応し、[Gradleビルドキャッシュ](https://docs.gradle.org/current/userguide/build_cache.html)と互換性があります。コンパイル回避のサポートも改善されました。

ビルドキャッシュを使用する場合や、Kotlin以外のGradleモジュールで頻繁に変更を行う場合に、新しいアプローチの最も大きなメリットを実感できると期待しています。`kotlin-gradle-plugin`モジュールに関するKotlinプロジェクトのテストでは、キャッシュヒット後の変更で80%以上の改善が示されています。

この新しいアプローチを試すには、`gradle.properties`に以下のオプションを設定してください。

```none
kotlin.incremental.useClasspathSnapshot=true
```

> インクリメンタルコンパイルへの新しいアプローチは、現在GradleビルドシステムにおけるJVMバックエンドでのみ利用可能です。
>
{style="note"}

インクリメンタルコンパイルの新しいアプローチが内部でどのように実装されているかについては、[こちらのブログ投稿](https://blog.jetbrains.com/kotlin/2022/07/a-new-approach-to-incremental-compilation-in-kotlin/)をご覧ください。

私たちはこの技術を安定させ、他のバックエンド（例えばJS）やビルドシステムへのサポートを追加する計画です。このコンパイル方式で発生する問題や奇妙な動作について、[YouTrack](https://youtrack.jetbrains.com/issues/KT)にご報告いただければ幸いです。ありがとうございます！

Kotlinチームは、[Ivan Gavrilovic](https://github.com/gavra0)氏、[Hung Nguyen](https://github.com/hungvietnguyen)氏、[Cédric Champeau](https://github.com/melix)氏、およびその他の外部貢献者の皆様のご協力に深く感謝いたします。

### Kotlinコンパイラタスクのビルドレポート

> Kotlinビルドレポートは[実験的](components-stability.md)です。これはいつでも廃止または変更される可能性があります。
> オプトインが必要です（詳細については下記を参照）。評価目的でのみ使用してください。
> [YouTrack](https://youtrack.jetbrains.com/issues/KT)でのフィードバックをいただければ幸いです。
>
{style="warning"}

Kotlin 1.7.0では、コンパイラのパフォーマンスを追跡するのに役立つビルドレポートが導入されます。レポートには、異なるコンパイルフェーズの期間と、コンパイルがインクリメンタルでなかった理由が含まれています。

ビルドレポートは、コンパイラのタスクに関する問題を調査したい場合に役立ちます。例えば：

* Gradleビルドに時間がかかりすぎ、パフォーマンス低下の根本原因を理解したい場合。
* 同じプロジェクトのコンパイル時間が異なり、数秒で終わることもあれば、数分かかることもある場合。

ビルドレポートを有効にするには、`gradle.properties`でビルドレポートの出力先を宣言します。

```none
kotlin.build.report.output=file
```

以下の値（およびそれらの組み合わせ）が利用可能です。

* `file`はビルドレポートをローカルファイルに保存します。
* `build_scan`はビルドレポートを[ビルドスキャン](https://scans.gradle.com/)の`custom values`セクションに保存します。

  > Gradle Enterpriseプラグインは、カスタム値の数とその長さを制限します。大規模なプロジェクトでは、一部の値が失われる可能性があります。
  >
  {style="note"}

* `http`はHTTP(S)を使用してビルドレポートを送信します。POSTメソッドはJSON形式でメトリクスを送信します。データはバージョンごとに変更される可能性があります。送信されるデータの現在のバージョンは、[Kotlinリポジトリ](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/report/data/GradleCompileStatisticsData.kt)で確認できます。

実行時間の長いコンパイルのビルドレポートを分析することで解決できる一般的なケースが2つあります。

* ビルドがインクリメンタルでなかった場合。原因を分析し、根本的な問題を修正してください。
* ビルドはインクリメンタルだったが、時間がかかりすぎた場合。ソースファイルを再編成してみてください。大きなファイルを分割したり、個別のクラスを異なるファイルに保存したり、大きなクラスをリファクタリングしたり、トップレベル関数を異なるファイルで宣言したりするなどです。

新しいビルドレポートの詳細については、[こちらのブログ投稿](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/)をご覧ください。

インフラストラクチャでビルドレポートの使用を試すことを歓迎します。フィードバック、問題、改善の提案などございましたら、お気軽に[課題トラッカー](https://youtrack.jetbrains.com/newIssue)にご報告ください。よろしくお願いいたします！

### 最小サポートバージョンの変更

Kotlin 1.7.0以降、サポートされるGradleの最小バージョンは6.7.1です。[Gradleプラグインバリアント](#support-for-gradle-plugin-variants)と新しいGradle APIをサポートするために、[バージョンを上げる必要がありました](https://youtrack.jetbrains.com/issue/KT-49733/Bump-minimal-supported-Gradle-version-to-6-7-1)。今後は、Gradleプラグインバリアント機能のおかげで、最小サポートバージョンを頻繁に上げる必要はなくなるはずです。

また、サポートされるAndroid Gradleプラグインの最小バージョンは3.6.4になりました。

### Gradleプラグインバリアントのサポート

Gradle 7.0では、Gradleプラグイン開発者向けの新しい機能である[バリアントを持つプラグイン](https://docs.gradle.org/7.0/userguide/implementing_gradle_plugins.html#plugin-with-variants)が導入されました。この機能により、Gradleバージョン7.1未満との互換性を維持しながら、新しいGradle機能のサポートを容易に追加できます。[Gradleでのバリアント選択](https://docs.gradle.org/current/userguide/variant_model.html)の詳細をご覧ください。

Gradleプラグインバリアントを使用すると、異なるGradleバージョン向けに異なるKotlin Gradleプラグインバリアントを出荷できます。目標は、Gradleの最も古いサポート対象バージョンに対応する`main`バリアントで、ベースとなるKotlinコンパイルをサポートすることです。各バリアントには、対応するリリースからのGradle機能の実装が含まれます。最新のバリアントは、最も幅広いGradle機能セットをサポートします。このアプローチにより、機能が制限された古いGradleバージョンへのサポートを拡張できます。

現在、Kotlin Gradleプラグインには2つのバリアントのみが存在します。

* `main`：Gradleバージョン6.7.1～6.9.3向け
* `gradle70`：Gradleバージョン7.0以上向け

今後のKotlinリリースでは、さらに追加される可能性があります。

ビルドがどのバリアントを使用しているかを確認するには、[`--info`ログレベル](https://docs.gradle.org/current/userguide/logging.html#sec:choosing_a_log_level)を有効にし、出力から`Using Kotlin Gradle plugin`で始まる文字列、例えば`Using Kotlin Gradle plugin main variant`を探してください。

> Gradleにおけるバリアント選択の既知の問題に対する回避策は以下の通りです。
> * [pluginManagementでのResolutionStrategyが、マルチバリアントを持つプラグインで機能しない](https://github.com/gradle/gradle/issues/20545)
> * [プラグインが`buildSrc`共通依存関係として追加された場合、プラグインバリアントが無視される](https://github.com/gradle/gradle/issues/20847)
>
{style="note"}

[こちらのYouTrackチケット](https://youtrack.jetbrains.com/issue/KT-49227/Support-Gradle-plugins-variants)でフィードバックをお寄せください。

### Kotlin GradleプラグインAPIの更新

Kotlin GradleプラグインAPIアーティファクトは、いくつかの改善が施されました。

* ユーザーが設定可能な入力を備えたKotlin/JVMおよびKotlin/kaptタスク用の新しいインターフェースが追加されました。
* すべてのKotlinプラグインが継承する新しい`KotlinBasePlugin`インターフェースが追加されました。このインターフェースは、任意のKotlin Gradleプラグイン（JVM、JS、マルチプラットフォーム、Native、その他のプラットフォーム）が適用されるたびに、何らかの設定アクションをトリガーしたい場合に使用します。

  ```kotlin
  project.plugins.withType<org.jetbrains.kotlin.gradle.plugin.KotlinBasePlugin>() {
      // ここでアクションを設定
  }
  ```
  `KotlinBasePlugin`に関するフィードバックは、[こちらのYouTrackチケット](https://youtrack.jetbrains.com/issue/KT-48008/Consider-offering-a-KotlinBasePlugin)にお寄せください。

* Android GradleプラグインがKotlinコンパイル自体を設定するための基礎を築きました。これにより、ビルドにKotlin Android Gradleプラグインを追加する必要がなくなります。
  追加されたサポートについて学び、試すには、[Android Gradleプラグインのリリースアナウンス](https://developer.android.com/studio/releases/gradle-plugin)をご覧ください！

### plugins APIを介したsam-with-receiverプラグインの利用可能性

[sam-with-receiverコンパイラプラグイン](sam-with-receiver-plugin.md)は、[Gradle plugins DSL](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block)を介して利用可能になりました。

```kotlin
plugins {
    id("org.jetbrains.kotlin.plugin.sam.with.receiver") version "$kotlin_version"
}
```

### コンパイルタスクの変更

コンパイルタスクは、このリリースで多くの変更を受けました。

* Kotlinコンパイルタスクは、Gradleの`AbstractCompile`タスクを継承しなくなりました。`DefaultTask`のみを継承します。
* `AbstractCompile`タスクには`sourceCompatibility`と`targetCompatibility`の入力があります。`AbstractCompile`タスクが継承されなくなったため、これらの入力はKotlinユーザーのスクリプトでは利用できなくなりました。
* `SourceTask.stableSources`入力は利用できなくなり、`sources`入力を使用する必要があります。`setSource(...)`メソッドは引き続き利用可能です。
* すべてのコンパイルタスクは、コンパイルに必要なライブラリのリストとして`libraries`入力を使用するようになりました。`KotlinCompile`タスクにはまだ非推奨のKotlinプロパティ`classpath`がありますが、これは今後のリリースで削除される予定です。
* コンパイルタスクは引き続き`PatternFilterable`インターフェースを実装しており、これによりKotlinソースのフィルタリングが可能です。`sourceFilesExtensions`入力は、`PatternFilterable`メソッドの使用を優先して削除されました。
* 非推奨の`Gradle destinationDir: File`出力は、`destinationDirectory: DirectoryProperty`出力に置き換えられました。
* Kotlin/Nativeの`AbstractNativeCompile`タスクは、`AbstractKotlinCompileTool`基底クラスを継承するようになりました。これは、Kotlin/Nativeビルドツールを他のすべてのツールに統合するための最初のステップです。

[こちらのYouTrackチケット](https://youtrack.jetbrains.com/issue/KT-32805)でフィードバックをお寄せください。

### kaptの各アノテーションプロセッサによって生成されたファイルの新しい統計情報

`kotlin-kapt` Gradleプラグインは、すでに[各プロセッサのパフォーマンス統計を報告しています](https://github.com/JetBrains/kotlin/pull/4280)。Kotlin 1.7.0以降、各アノテーションプロセッサによって生成されたファイルの数に関する統計も報告できます。

これは、ビルドの一部として未使用のアノテーションプロセッサがあるかどうかを追跡するのに役立ちます。生成されたレポートを使用して、不要なアノテーションプロセッサをトリガーするモジュールを見つけ、それを防止するためにモジュールを更新できます。

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

> コマンドラインオプション`verbose`を介して詳細出力を有効にすることもできます（[kapt.md#use-in-cli](kapt.md#use-in-cli)を参照）。
>
{style="note"}

統計は`info`レベルでログに表示されます。`Annotation processor stats:`の行の後に各アノテーションプロセッサの実行時間に関する統計が表示されます。これらの行の後には、`Generated files report:`の行の後に各アノテーションプロセッサによって生成されたファイルの数に関する統計が表示されます。例：

```text
[INFO] Annotation processor stats:
[INFO] org.mapstruct.ap.MappingProcessor: total: 290 ms, init: 1 ms, 3 round(s): 289 ms, 0 ms, 0 ms
[INFO] Generated files report:
[INFO] org.mapstruct.ap.MappingProcessor: total sources: 2, sources per round: 2, 0, 0
```

[こちらのYouTrackチケット](https://youtrack.jetbrains.com/issue/KT-51132/KAPT-Support-reporting-the-number-of-generated-files-by-each-ann)でフィードバックをお寄せください。

### kotlin.compiler.execution.strategyシステムプロパティの非推奨化

Kotlin 1.6.20では[Kotlinコンパイラの実行戦略を定義するための新しいプロパティ](whatsnew1620.md#properties-for-defining-kotlin-compiler-execution-strategy)が導入されました。Kotlin 1.7.0では、古いシステムプロパティ`kotlin.compiler.execution.strategy`の非推奨サイクルが開始され、新しいプロパティが推奨されます。

`kotlin.compiler.execution.strategy`システムプロパティを使用すると、警告が表示されます。このプロパティは今後のリリースで削除されます。以前の動作を保持するには、システムプロパティを同名のGradleプロパティに置き換えてください。例えば、`gradle.properties`でこれを行うことができます。

```none
kotlin.compiler.execution.strategy=out-of-process
```

コンパイルタスクプロパティ`compilerExecutionStrategy`を使用することもできます。詳細については、[Gradleページ](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy)をご覧ください。

### 非推奨オプション、メソッド、プラグインの削除

#### useExperimentalAnnotationメソッドの削除

Kotlin 1.7.0では、`useExperimentalAnnotation` Gradleメソッドの非推奨サイクルが完了しました。モジュールでAPIの使用をオプトインするには、代わりに`optIn()`を使用してください。

例えば、Gradleモジュールがマルチプラットフォームの場合：

```kotlin
sourceSets {
    all {
        languageSettings.optIn("org.mylibrary.OptInAnnotation")
    }
}
```

Kotlinの[オプトイン要件](opt-in-requirements.md)の詳細については、こちらをご覧ください。

#### 非推奨のコンパイラオプションの削除

いくつかのコンパイラオプションの非推奨サイクルを完了しました。

* `kotlinOptions.jdkHome`コンパイラオプションは1.5.30で非推奨となり、現在のリリースで削除されました。Gradleビルドにこのオプションが含まれている場合、ビルドは失敗するようになりました。Kotlin 1.5.30以降でサポートされている[Javaツールチェーン](whatsnew1530.md#support-for-java-toolchains)の使用をお勧めします。
* 非推奨の`noStdlib`コンパイラオプションも削除されました。Gradleプラグインは、Kotlin標準ライブラリが存在するかどうかを制御するために`kotlin.stdlib.default.dependency=true`プロパティを使用します。

> コンパイラ引数`-jdkHome`と`-no-stdlib`は引き続き利用可能です。
>
{style="note"}

#### 非推奨プラグインの削除

Kotlin 1.4.0で`kotlin2js`と`kotlin-dce-plugin`プラグインは非推奨となり、このリリースで削除されました。`kotlin2js`の代わりに、新しい`org.jetbrains.kotlin.js`プラグインを使用してください。デッドコード除去 (DCE) は、Kotlin/JS Gradleプラグインが適切に設定されている場合に動作します。

Kotlin 1.6.0では、`KotlinGradleSubplugin`クラスの非推奨レベルを`ERROR`に変更しました。開発者はこのクラスをコンパイラプラグインの記述に使用していました。このリリースでは、[このクラスが削除されました](https://youtrack.jetbrains.com/issue/KT-48831/)。代わりに`KotlinCompilerPluginSupportPlugin`クラスを使用してください。

> プロジェクト全体でKotlinプラグインのバージョン1.7.0以降を使用するのが最善の方法です。
>
{style="tip"}

#### 非推奨のコルーチンDSLオプションとプロパティの削除

非推奨の`kotlin.experimental.coroutines` Gradle DSLオプションと、`gradle.properties`で使用されていた`kotlin.coroutines`プロパティを削除しました。今後は、_[サスペンド関数](coroutines-basics.md#extract-function-refactoring)_ を使用するか、ビルドスクリプトに[kotlinx.coroutinesの依存関係を追加](gradle-configure-project.md#set-a-dependency-on-a-kotlinx-library)するだけで済みます。

コルーチンの詳細については、[コルーチンガイド](coroutines-guide.md)をご覧ください。

#### ツールチェーン拡張メソッドにおける型キャストの削除

Kotlin 1.7.0より前では、Kotlin DSLでGradleツールチェーンを設定する際に、`JavaToolchainSpec`クラスへの型キャストを行う必要がありました。

```kotlin
kotlin {
    jvmToolchain {
        (this as JavaToolchainSpec).languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)
    }
}
```

これで、`(this as JavaToolchainSpec)`の部分を省略できるようになりました。

```kotlin
kotlin {
    jvmToolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)
    }
}
```

## Kotlin 1.7.0への移行

### Kotlin 1.7.0のインストール

IntelliJ IDEA 2022.1とAndroid Studio Chipmunk (212) は、Kotlinプラグインを1.7.0に自動的に更新することを提案します。

> IntelliJ IDEA 2022.2、Android Studio Dolphin (213)、またはAndroid Studio Electric Eel (221) については、Kotlinプラグイン1.7.0は今後のIntelliJ IDEAおよびAndroid Studioのアップデートで提供されます。
> 
{style="note"}

新しいコマンドラインコンパイラは、[GitHubのリリースぺージ](https://github.com/JetBrains/kotlin/releases/tag/v1.7.0)からダウンロードできます。

### Kotlin 1.7.0への既存プロジェクトの移行または新規プロジェクトの開始

* 既存のプロジェクトをKotlin 1.7.0に移行するには、Kotlinのバージョンを`1.7.0`に変更し、GradleまたはMavenプロジェクトを再インポートします。[Kotlin 1.7.0へのアップデート方法](releases.md#update-to-a-new-kotlin-version)をご覧ください。

* Kotlin 1.7.0で新規プロジェクトを開始するには、Kotlinプラグインを更新し、**File** | **New** | **Project**からプロジェクトウィザードを実行します。

### Kotlin 1.7.0の互換性ガイド

Kotlin 1.7.0は[機能リリース](kotlin-evolution-principles.md#language-and-tooling-releases)であるため、以前の言語バージョンで記述されたコードと互換性のない変更をもたらす可能性があります。そのような変更点の詳細なリストは、[Kotlin 1.7.0の互換性ガイド](compatibility-guide-17.md)をご覧ください。