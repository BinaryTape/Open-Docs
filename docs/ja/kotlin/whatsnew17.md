---
title: "Kotlin 1.7.0 の新機能"
---
:::info
<p>
   Kotlin 1.7.0 の IDE サポートは、IntelliJ IDEA 2021.2、2021.3、および 2022.1 で利用できます。
</p>

:::

_[Released: 2022年6月9日](releases#release-details)_

Kotlin 1.7.0 がリリースされました。新しい Kotlin/JVM K2 コンパイラーの Alpha 版が公開され、言語機能が安定化し、JVM、JS、および Native プラットフォームのパフォーマンスが向上しています。

このバージョンにおける主なアップデートは次のとおりです。

* [新しい Kotlin K2 コンパイラーが Alpha 版になりました](#new-kotlin-k2-compiler-for-the-jvm-in-alpha)。これにより、パフォーマンスが大幅に向上します。これは JVM でのみ利用可能であり、[kapt](kapt) を含むコンパイラープラグインはいずれも動作しません。
* [Gradle でのインクリメンタルコンパイルへの新しいアプローチ](#a-new-approach-to-incremental-compilation)。インクリメンタルコンパイルは、依存する Kotlin 以外のモジュール内で行われた変更でもサポートされるようになり、Gradle との互換性があります。
* [opt-in requirement アノテーション](#stable-opt-in-requirements)、[definitely non-nullable types](#stable-definitely-non-nullable-types)、および [builder inference](#stable-builder-inference) が安定化されました。
* [型引数にアンダースコア演算子が追加されました](#underscore-operator-for-type-arguments)。これを使用すると、他の型が指定されている場合に、引数の型を自動的に推論できます。
* [このリリースでは、インラインクラスのインライン化された値へのデリゲートによる実装が許可されています](#allow-implementation-by-delegation-to-an-inlined-value-of-an-inline-class)。これにより、ほとんどの場合にメモリーを割り当てない軽量ラッパーを作成できます。

このビデオで変更点の簡単な概要を確認することもできます。

<video src="https://www.youtube.com/v/54WEfLKtCGk" title="What's new in Kotlin 1.7.0"/>

## New Kotlin K2 compiler for the JVM in Alpha

この Kotlin リリースでは、新しい Kotlin K2 コンパイラーの **Alpha** 版が導入されています。新しいコンパイラーは、新しい言語機能の開発を加速し、Kotlin がサポートするすべてのプラットフォームを統合し、パフォーマンスを向上させ、コンパイラー拡張機能の API を提供することを目的としています。

新しいコンパイラーとその利点に関する詳細な説明をすでに公開しています。

* [The Road to the New Kotlin Compiler](https://www.youtube.com/watch?v=iTdJJq_LyoY)
* [K2 Compiler: a Top-Down View](https://www.youtube.com/watch?v=db19VFLZqJM)

新しい K2 コンパイラーの Alpha 版では、主にパフォーマンスの向上に重点を置いており、JVM プロジェクトでのみ動作することに注意することが重要です。Kotlin/JS、Kotlin/Native、またはその他のマルチプラットフォームプロジェクトはサポートされておらず、[kapt](kapt) を含むコンパイラープラグインはいずれも動作しません。

当社のベンチマークでは、社内プロジェクトで優れた結果が得られています。

| Project       | Current Kotlin compiler performance | New K2 Kotlin compiler performance | Performance boost |
|---------------|-------------------------------------|------------------------------------|-------------------|
| Kotlin        | 2.2 KLOC/s                          | 4.8 KLOC/s                         | ~ x2.2            |
| YouTrack      | 1.8 KLOC/s                          | 4.2 KLOC/s                         | ~ x2.3            |
| IntelliJ IDEA | 1.8 KLOC/s                          | 3.9 KLOC/s                         | ~ x2.2            |
| Space         | 1.2 KLOC/s                          | 2.8 KLOC/s                         | ~ x2.3            |
:::note
KLOC/s のパフォーマンス数値は、コンパイラーが 1 秒あたりに処理するコード行数 (千単位) を表します。

JVM プロジェクトでのパフォーマンスの向上を確認し、古いコンパイラーの結果と比較できます。Kotlin K2 コンパイラーを有効にするには、次のコンパイラーオプションを使用します。

```bash
-Xuse-k2
```

また、K2 コンパイラーには [多数のバグ修正が含まれています](https://youtrack.jetbrains.com/issues/KT?q=tag:%20FIR-preview-qa%20%23Resolved)。このリストの **State: Open** の問題も、実際には K2 で修正されていることに注意してください。

次期 Kotlin リリースでは、K2 コンパイラーの安定性が向上し、より多くの機能が提供される予定ですので、ご期待ください。

Kotlin K2 コンパイラーでパフォーマンスの問題が発生した場合は、[課題追跡システムにご報告ください](https://kotl.in/issue)。

## Language

Kotlin 1.7.0 では、デリゲートによる実装のサポートと、型引数の新しいアンダースコア演算子が導入されています。また、以前のリリースでプレビューとして導入されたいくつかの言語機能も安定化されています。

* [インラインクラスのインライン化された値へのデリゲートによる実装](#allow-implementation-by-delegation-to-an-inlined-value-of-an-inline-class)
* [型引数のアンダースコア演算子](#underscore-operator-for-type-arguments)
* [Stable builder inference](#stable-builder-inference)
* [Stable opt-in requirements](#stable-opt-in-requirements)
* [Stable definitely non-nullable types](#stable-definitely-non-nullable-types)

### Allow implementation by delegation to an inlined value of an inline class

値またはクラスインスタンスの軽量ラッパーを作成する場合、すべてのインターフェースメソッドを手動で実装する必要があります。デリゲートによる実装は、この問題を解決しますが、1.7.0 より前のインラインクラスでは機能しませんでした。この制限が削除されたため、ほとんどの場合にメモリーを割り当てない軽量ラッパーを作成できるようになりました。

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

### Underscore operator for type arguments

Kotlin 1.7.0 では、型引数のアンダースコア演算子 `_` が導入されています。これを使用すると、他の型が指定されている場合に、型引数を自動的に推論できます。

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

変数のリストの任意の位置にアンダースコア演算子を使用して、型引数を推論できます。

:::

### Stable builder inference

Builder inference は、汎用ビルダー関数を呼び出すときに役立つ特殊な種類の型推論です。これにより、コンパイラーはラムダ引数内の他の呼び出しの型情報を使用して、呼び出しの型引数を推論できます。

1.7.0 以降、通常の型推論では型に関する十分な情報を取得できない場合、[1.6.0 で導入された](whatsnew16#changes-to-builder-inference) `-Xenable-builder-inference` コンパイラーオプションを指定しなくても、ビルダー推論が自動的に有効になります。

[カスタム汎用ビルダーの作成方法](using-builders-with-builder-inference) をご覧ください。

### Stable opt-in requirements

[Opt-in requirements](opt-in-requirements) が [Stable](components-stability) になり、追加のコンパイラー構成は不要になりました。

1.7.0 より前は、opt-in 機能自体で警告を回避するために引数 `-opt-in=kotlin.RequiresOptIn` が必要でした。これからは必要ありません。ただし、コンパイラー引数 `-opt-in` を使用して、他のアノテーション、[モジュール](opt-in-requirements#opt-in-a-module) を opt-in できます。

### Stable definitely non-nullable types

Kotlin 1.7.0 では、definitely non-nullable types が [Stable](components-stability) に昇格しました。これにより、汎用 Java クラスとインターフェースを拡張する際の相互運用性が向上します。

新しい構文 `T & Any` を使用して、使用場所で汎用型パラメーターを definitely non-nullable としてマークできます。構文形式は、[intersection types](https://en.wikipedia.org/wiki/Intersection_type) の表記法に由来し、現在は `&` の左側に nullable の上限を持つ型パラメーターと、右側に non-nullable の `Any` に制限されています。

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

definitely non-nullable types の詳細については、[こちらの KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types) を参照してください。

## Kotlin/JVM

このリリースでは、Kotlin/JVM コンパイラーのパフォーマンスが向上し、新しいコンパイラーオプションが追加されています。さらに、関数型インターフェースコンストラクターへの呼び出し可能参照が Stable になりました。1.7.0 以降、Kotlin/JVM コンパイルのデフォルトのターゲットバージョンは `1.8` であることに注意してください。

* [コンパイラーのパフォーマンス最適化](#compiler-performance-optimizations)
* [新しいコンパイラーオプション `-Xjdk-release`](#new-compiler-option-xjdk-release)
* [関数型インターフェースコンストラクターへの Stable callable references](#stable-callable-references-to-functional-interface-constructors)
* [JVM ターゲットバージョン 1.6 を削除](#removed-jvm-target-version-1-6)

### Compiler performance optimizations

Kotlin 1.7.0 では、Kotlin/JVM コンパイラーのパフォーマンスが向上しています。当社のベンチマークによると、コンパイル時間は Kotlin 1.6.0 と比較して [平均 10% 削減されています](https://youtrack.jetbrains.com/issue/KT-48233/Switching-to-JVM-IR-backend-increases-compilation-time-by-more-t#focus=Comments-27-6114542.0-0)。インライン関数の使用量が多いプロジェクト (例: [`kotlinx.html` を使用するプロジェクト](https://youtrack.jetbrains.com/issue/KT-51416/Compilation-of-kotlinx-html-DSL-should-still-be-faster)) は、バイトコードの後処理の改善により、コンパイルが高速化されます。

### New compiler option: -Xjdk-release

Kotlin 1.7.0 には、新しいコンパイラーオプション `-Xjdk-release` が導入されています。このオプションは、[javac のコマンドラインオプション `--release`](http://openjdk.java.net/jeps/247) と同様です。`-Xjdk-release` オプションは、ターゲットのバイトコードバージョンを制御し、クラスパス内の JDK の API を指定された Java バージョンに制限します。たとえば、`kotlinc -Xjdk-release=1.8` では、依存関係の JDK がバージョン 9 以降であっても `java.lang.Module` を参照できません。

:::note
このオプションは、各 JDK ディストリビューションで有効であることが [保証されていません](https://youtrack.jetbrains.com/issue/KT-29974)。

:::

[この YouTrack チケット](https://youtrack.jetbrains.com/issue/KT-29974/Add-a-compiler-option-Xjdk-release-similar-to-javac-s-release-to) でフィードバックをお寄せください。

### Stable callable references to functional interface constructors

関数型インターフェースコンストラクターへの [Callable references](reflection#callable-references) が [Stable](components-stability) になりました。[関数型インターフェースへのコンストラクター関数を持つインターフェースからの移行方法](fun-interfaces#migration-from-an-interface-with-constructor-function-to-a-functional-interface) については、callable references を使用してご確認ください。

[YouTrack](https://youtrack.jetbrains.com/newissue?project=kt) で見つかった問題を報告してください。

### Removed JVM target version 1.6

Kotlin/JVM コンパイルのデフォルトのターゲットバージョンは `1.8` です。`1.6` ターゲットは削除されました。

JVM ターゲット 1.8 以降に移行してください。JVM ターゲットバージョンの更新方法については、以下を参照してください。

* [Gradle](gradle-compiler-options#attributes-specific-to-jvm)
* [Maven](maven#attributes-specific-to-jvm)
* [The command-line compiler](compiler-reference#jvm-target-version)

## Kotlin/Native

Kotlin 1.7.0 には、Objective-C および Swift との相互運用性に関する変更が含まれており、以前のリリースで導入された機能が安定化されています。また、新しいメモリーマネージャーのパフォーマンスが向上し、他のアップデートも行われています。

* [新しいメモリーマネージャーのパフォーマンス向上](#performance-improvements-for-the-new-memory-manager)
* [JVM および JS IR バックエンドとの統一されたコンパイラープラグイン ABI](#unified-compiler-plugin-abi-with-jvm-and-js-ir-backends)
* [スタンドアロン Android 実行可能ファイルのサポート](#support-for-standalone-android-executables)
* [Swift async/await との相互運用性: `KotlinUnit` ではなく `Void` を返す](#interop-with-swift-async-await-returning-void-instead-of-kotlinunit)
* [Objective-C ブリッジを介した未宣言の例外の禁止](#prohibited-undeclared-exceptions-through-objective-c-bridges)
* [CocoaPods 統合の改善](#improved-cocoapods-integration)
* [Kotlin/Native コンパイラーのダウンロード URL のオーバーライド](#overriding-the-kotlin-native-compiler-download-url)

### Performance improvements for the new memory manager

:::note
新しい Kotlin/Native メモリーマネージャーは [Alpha](components-stability) です。
互換性のない変更が行われ、将来手動での移行が必要になる場合があります。
[YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) でのフィードバックをお待ちしております。

:::

新しいメモリーマネージャーはまだ Alpha 版ですが、[Stable](components-stability) になる予定です。このリリースでは、特にガベージコレクション (GC) において、新しいメモリーマネージャーのパフォーマンスが大幅に向上しています。特に、[1.6.20 で導入された](whatsnew1620) スイープフェーズの同時実行実装がデフォルトで有効になっています。これにより、GC のためにアプリケーションが一時停止する時間を短縮できます。新しい GC スケジューラーは、特に大きなヒープの場合、GC の頻度を選択するのに優れています。

また、デバッグバイナリを特に最適化し、メモリーマネージャーの実装コードで適切な最適化レベルとリンク時最適化が使用されるようにしました。これにより、ベンチマークでのデバッグバイナリの実行時間を約 30% 改善できました。

プロジェクトで新しいメモリーマネージャーを使用して、その動作を確認し、[YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) でフィードバックをお寄せください。

### Unified compiler plugin ABI with JVM and JS IR backends

Kotlin 1.7.0 以降、Kotlin Multiplatform Gradle プラグインは、Kotlin/Native 用の埋め込み可能なコンパイラージャーをデフォルトで使用します。この [機能は 1.6.0 で発表されました](whatsnew16#unified-compiler-plugin-abi-with-jvm-and-js-ir-backends) が、Experimental として発表され、現在は Stable で使用できるようになりました。

この改善は、ライブラリの作成者にとって非常に便利です。コンパイラープラグインの開発エクスペリエンスが向上するからです。このリリースより前は、Kotlin/Native 用に個別のアーティファクトを提供する必要がありましたが、現在は Native およびその他のサポートされているプラットフォームに同じコンパイラープラグインアーティファクトを使用できます。

:::note
この機能を使用するには、プラグイン開発者が既存のプラグインに対して移行手順を実行する必要がある場合があります。

この [YouTrack 課題](https://youtrack.jetbrains.com/issue/KT-48595) で、アップデートに向けてプラグインを準備する方法をご覧ください。

### Support for standalone Android executables

Kotlin 1.7.0 は、Android Native ターゲット用の標準実行可能ファイルの生成を完全にサポートしています。[1.6.20 で導入されました](whatsnew1620#support-for-standalone-android-executables) が、デフォルトで有効になりました。

Kotlin/Native が共有ライブラリを生成していた以前の動作に戻す場合は、次の設定を使用します。

```kotlin
binaryOptions["androidProgramType"] = "nativeActivity"
```

### Interop with Swift async/await: returning Void instead of KotlinUnit

Kotlin `suspend` 関数は、Swift で `KotlinUnit` ではなく `Void` 型を返すようになりました。これは、Swift の `async`/`await` との相互運用性が向上した結果です。この機能は [1.6.20 で導入されました](whatsnew1620#interop-with-swift-async-await-returning-void-instead-of-kotlinunit) が、このリリースでは、この動作がデフォルトで有効になっています。

このような関数に適切な型を返すために、`kotlin.native.binary.unitSuspendFunctionObjCExport=proper` プロパティを使用する必要はなくなりました。

### Prohibited undeclared exceptions through Objective-C bridges

Swift/Objective-C コードから Kotlin コードを呼び出す場合 (またはその逆)、このコードが例外をスローする場合は、`@Throws` アノテーションを使用するなど、言語間で例外を適切に変換して転送することを明示的に許可しない限り、例外が発生したコードで処理する必要があります。

以前は、Kotlin には、未宣言の例外が一部のケースで 1 つの言語から別の言語に「リーク」する可能性のある、別の意図しない動作がありました。Kotlin 1.7.0 ではその問題が修正され、そのようなケースはプログラムの終了につながるようになりました。

たとえば、Kotlin に `{ throw Exception() }` ラムダがあり、Swift から呼び出す場合、Kotlin 1.7.0 では例外が Swift コードに到達するとすぐに終了します。以前の Kotlin バージョンでは、そのような例外が Swift コードにリークする可能性がありました。

`@Throws` アノテーションは、以前と同じように引き続き機能します。

### Improved CocoaPods integration

Kotlin 1.7.0 以降では、プロジェクトで CocoaPods を統合する場合に `cocoapods-generate` プラグインをインストールする必要はなくなりました。

以前は、CocoaPods 依存関係マネージャーと `cocoapods-generate` プラグインの両方をインストールして、たとえば Kotlin Multiplatform Mobile プロジェクトで [iOS 依存関係](multiplatform-ios-dependencies#with-cocoapods) を処理するために CocoaPods を使用する必要がありました。

CocoaPods の統合の設定が簡単になり、Ruby 3 以降で `cocoapods-generate` をインストールできないという問題が解決されました。Apple M1 でより適切に動作する最新の Ruby バージョンもサポートされるようになりました。

[最初の CocoaPods 統合](native-cocoapods#set-up-an-environment-to-work-with-cocoapods) の設定方法をご覧ください。

### Overriding the Kotlin/Native compiler download URL

Kotlin 1.7.0 以降では、Kotlin/Native コンパイラーのダウンロード URL をカスタマイズできます。これは、CI で外部リンクが禁止されている場合に役立ちます。

デフォルトのベース URL `https://download.jetbrains.com/kotlin/native/builds` をオーバーライドするには、次の Gradle プロパティを使用します。

```none
kotlin.native.distribution.baseDownloadUrl=https://example.com
```

ダウンローダーは、このベース URL にネイティブバージョンとターゲット OS を追加して、実際のコンパイラーディストリビューションがダウンロードされるようにします。

:::

## Kotlin/JS

Kotlin/JS は、[JS IR コンパイラーバックエンド](js-ir-compiler) に加えて、開発エクスペリエンスを向上させるその他のアップデートも受けています。

* [新しい IR バックエンドのパフォーマンス向上](#performance-improvements-for-the-new-ir-backend)
* [IR を使用する場合のメンバー名の縮小](#minification-for-member-names-when-using-ir)
* [IR バックエンドのポリフィルによる古いブラウザーのサポート](#support-for-older-browsers-via-polyfills-in-the-ir-backend)
* [js 式から JavaScript モジュールを動的にロード](#dynamically-load-javascript-modules-from-js-expressions)
* [JavaScript テストランナーの環境変数の指定](#specify-environment-variables-for-javascript-test-runners)

### Performance improvements for the new IR backend

このリリースには、開発エクスペリエンスを向上させるいくつかの主要なアップデートが含まれています。

* Kotlin/JS のインクリメンタルコンパイルのパフォーマンスが大幅に向上しました。JS プロジェクトの構築にかかる時間が短縮されます。多くの場合、インクリメンタル再構築は、従来のバックエンドとほぼ同等になりました。
* Kotlin/JS の最終バンドルに必要なスペースが少なくなりました。最終アーティファクトのサイズが大幅に削減されたためです。大規模なプロジェクトでは、従来のバックエンドと比較して、本番バンドルサイズが最大 20% 削減されることが測定されています。
* インターフェースの型チェックが大幅に改善されました。
* Kotlin はより高品質な JS コードを生成します。

### Minification for member names when using IR

Kotlin/JS IR コンパイラーは、Kotlin クラスと関数の関係に関する内部情報を使用して、より効率的な縮小を適用し、関数、プロパティ、およびクラスの名前を短縮するようになりました。これにより、バンドルされたアプリケーションが縮小されます。

このタイプの縮小は、Kotlin/JS アプリケーションを本番モードで構築するときに自動的に適用され、デフォルトで有効になっています。メンバー名の縮小を無効にするには、`-Xir-minimized-member-names` コンパイラーフラグを使用します。

```kotlin
kotlin {
    js(IR) {
        compilations.all {
            compileKotlinTask.kotlinOptions.freeCompilerArgs += listOf("-Xir-minimized-member-names=false")
        }
    }
}
```

### Support for older browsers via polyfills in the IR backend

Kotlin/JS の IR コンパイラーバックエンドには、従来のバックエンドと同じポリフィルが含まれるようになりました。これにより、新しいコンパイラーでコンパイルされたコードを、Kotlin 標準ライブラリで使用される ES2015 のすべてのメソッドをサポートしていない古いブラウザーで実行できます。プロジェクトで実際に使用されるポリフィルのみが最終バンドルに含まれるため、バンドルサイズへの潜在的な影響を最小限に抑えることができます。

この機能は、IR コンパイラーを使用する場合にデフォルトで有効になっており、構成する必要はありません。

### Dynamically load JavaScript modules from js expressions

JavaScript モジュールを操作する場合、ほとんどのアプリケーションは静的インポートを使用します。その使用法は [JavaScript モジュール統合](js-modules) で説明されています。ただし、Kotlin/JS には、アプリケーションで実行時に JavaScript モジュールを動的にロードするメカニズムがありませんでした。

Kotlin 1.7.0 以降では、JavaScript の `import` ステートメントが `js` ブロックでサポートされているため、パッケージを実行時にアプリケーションに動的に取り込むことができます。

```kotlin
val myPackage = js("import('my-package')")
```

### Specify environment variables for JavaScript test runners

Node.js パッケージの解決を調整したり、外部情報を Node.js テストに渡したりするために、JavaScript テストランナーで使用される環境変数を指定できるようになりました。環境変数を定義するには、ビルドスクリプトの `testTask` ブロック内でキーと値のペアを使用して `environment()` 関数を使用します。

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

## Standard library

Kotlin 1.7.0 では、標準ライブラリにさまざまな変更と改善が加えられています。新しい機能が導入され、実験的な機能が安定化され、Native、JS、および JVM の名前付きキャプチャリンググループのサポートが統一されています。

* [min() および max() コレクション関数が non-nullable として返される](#min-and-max-collection-functions-return-as-non-nullable)
* [特定のインデックスでの正規表現マッチング](#regular-expression-matching-at-specific-indices)
* [以前の言語および API バージョンの拡張サポート](#extended-support-for-previous-language-and-api-versions)
* [リフレクションによるアノテーションへのアクセス](#access-to-annotations-via-reflection)
* [Stable deep recursive functions](#stable-deep-recursive-functions)
* [デフォルトのタイムソースのインラインクラスに基づくタイムマーク](#time-marks-based-on-inline-classes-for-default-time-source)
* [Java Optionals の新しい実験的な拡張関数](#new-experimental-extension-functions-for-java-optionals)
* [JS および Native での名前付きキャプチャリンググループのサポート](#support-for-named-capturing-groups-in-js-and-native)

### min() and max() collection functions return as non-nullable

[Kotlin 1.4.0](whatsnew14) では、`min()` および `max()` コレクション関数を `minOrNull()` および `maxOrNull()` に名前変更しました。これらの新しい名前は、レシーバーコレクションが空の場合に null を返すという動作をより適切に反映しています。また、Kotlin コレクション API 全体で使用される命名規則に合わせて関数の動作を調整するのにも役立ちました。

同じことが `minBy()`, `maxBy()`, `minWith()`、および `maxWith()` にも当てはまり、Kotlin 1.4.0 ではすべて *OrNull() 同義語を取得しました。この変更の影響を受けた古い関数は、徐々に非推奨になりました。

Kotlin 1.7.0 では、元の関数名が non-nullable の戻り値の型で再導入されています。新しい `min()`, `max()` , `minBy()`, `maxBy()`, `minWith()`、および `maxWith()` 関数は、コレクション要素を厳密に返すか、例外をスローするようになりました。

```kotlin
fun main() {
    val numbers = listOf<Int>()
    println(numbers.maxOrNull()) // "null"
    println(numbers.max()) // "Exception in... Collection is empty."
}
```

### Regular expression matching at specific indices

[1.5.30 で導入された](whatsnew1530#matching-with-regex-at-a-particular-position) `Regex.matchAt()` および `Regex.matchesAt()` 関数が Stable になりました。これらは、正規表現が `String` または `CharSequence` の特定の位置に正確に一致するかどうかを確認する方法を提供します。

`matchesAt()` は一致を確認し、boolean の結果を返します。

```kotlin
fun main() {
    val releaseText = "Kotlin 1.7.0 is on its way!"
    // regular expression: one digit, dot, one digit, dot, one or more digits
    val versionRegex = "\\d[.]\\d[.]\\d+".toRegex()

    println(versionRegex.matchesAt(releaseText, 0)) // "false"
    println(versionRegex.matchesAt(releaseText, 7)) // "true"
}
```

`matchAt()` は、一致が見つかった場合は一致を返し、見つからない場合は `null` を返します。

```kotlin
fun main() {
    val releaseText = "Kotlin 1.7.0 is on its way!"
    val versionRegex = "\\d[.]\\d[.]\\d+".toRegex()

    println(versionRegex.matchAt(releaseText, 0)) // "null"
    println(versionRegex.matchAt(releaseText, 7)?.value) // "1.7.0"
}
```

[この YouTrack 課題](https://youtrack.jetbrains.com/issue/KT-34021) でフィードバックをお待ちしております。

### Extended support for previous language and API versions

広範な以前の Kotlin バージョンで消費されるライブラリを開発しているライブラリ作成者をサポートし、Kotlin のメジャーリリースの頻度が増加していることに対処するために、以前の言語および API バージョンのサポートを拡張しました。

Kotlin 1.7.0 では、2 つではなく 3 つの以前の言語および API バージョンをサポートしています。これは、Kotlin 1.7.0 が 1.4.0 までの Kotlin バージョンをターゲットとするライブラリの開発をサポートしていることを意味します。下位互換性の詳細については、[互換性モード](compatibility-modes) を参照してください。

### Access to annotations via reflection

[最初に 1.6.0 で導入された](whatsnew16#repeatable-annotations-with-runtime-retention-for-1-8-jvm-target) [`KAnnotatedElement.findAnnotations()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/find-annotations.html) 拡張関数が [Stable](components-stability) になりました。この [リフレクション](reflection) 関数は、個別に適用されたアノテーションと繰り返されたアノテーションを含む、要素の指定された型のすべてのアノテーションを返します。

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

### Stable deep recursive functions

Deep recursive functions は、[Kotlin 1.4.0](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-rc-debugging-coroutines/#Defining_deep_recursive_functions_using_coroutines) 以降、実験的な機能として提供されており、Kotlin 1.7.0 では [Stable](components-stability) になりました。`DeepRecursiveFunction` を使用すると、実際のコールスタックを使用する代わりに、スタックをヒープに保持する関数を定義できます。これにより、非常に深い再帰計算を実行できます。Deep recursive functions を呼び出すには、`invoke` します。

この例では、Deep recursive functions を使用して、バイナリツリーの深さを再帰的に計算します。このサンプル関数は 100,000 回再帰的に自身を呼び出しますが、`StackOverflowError` はスローされません。

```kotlin
class Tree(val left: Tree?, val right: Tree?)

val calculateDepth = DeepRecursiveFunction<Tree?, Int> { t `->`
    if (t == null) 0 else maxOf(
        callRecursive(t.left),
        callRecursive(t.right)
    ) + 1
}

fun main() {
    // Generate a tree with a depth of 100_000
    val deepTree = generateSequence(Tree(null, null)) { prev `->`
        Tree(prev, null)
    }.take(100_000).last()

    println(calculateDepth(deepTree)) // 100000
}
```

再帰の深さが 1000 回を超える場合は、コードで Deep recursive functions を使用することを検討してください。

### Time marks based on inline classes for default time source

Kotlin 1.7.0 では、`TimeSource.Monotonic` によって返されるタイムマークをインライン値クラスに変更することで、時間測定機能のパフォーマンスが向上しています。これは、`markNow()`, `elapsedNow()` , `measureTime()`、および `measureTimedValue()` などの関数を呼び出しても、`TimeMark` インスタンスのラッパークラスが割り当てられないことを意味します。特に、ホットパスの一部であるコードを測定する場合、これにより測定のパフォーマンスへの影響を最小限に抑えることができます。

```kotlin
@OptIn(ExperimentalTime::class)
fun main() {
    val mark = TimeSource.Monotonic.markNow() // Returned `TimeMark` is inline class
    val elapsedDuration = mark.elapsedNow()
}
```

:::note
この最適化は、`TimeMark` が取得されたタイムソースが `TimeSource.Monotonic` であることが静的にわかっている場合にのみ利用できます。

:::

### New experimental extension functions for Java Optionals

Kotlin 1.7.0 には、Java の `Optional` クラスの操作を簡素化する新しい便利な関数が付属しています。これらの新しい関数を使用して、JVM でオプションのオブジェクトをアンラップして変換し、Java API の操作をより簡潔にすることができます。

`getOrNull()`, `getOrDefault()`、および `getOrElse()` 拡張関数を使用すると、`Optional` が存在する場合にその値を取得できます。それ以外の場合は、それぞれ `null`、デフォルト値、または関数によって返される値を取得します。

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

`toList()`, `toSet()`、および `asSequence()` 拡張関数は、現在の `Optional` の値をリスト、セット、またはシーケンスに変換するか、それ以外の場合は空のコレクションを返します。`toCollection()` 拡張関数は、`Optional` 値を既存の宛先コレクションに追加します。

```kotlin
val presentOptional = Optional.of("I'm here!")
val absentOptional = Optional.empty<String>()
println(presentOptional.toList() + "," + absentOptional.toList())
// ["I'm here!"], []
println(presentOptional.toSet() + ","