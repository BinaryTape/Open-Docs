[//]: # (title: Kotlin 1.6.20の新機能)

_[リリース日: 2022年4月4日](releases.md#release-details)_

Kotlin 1.6.20では、今後の言語機能のプレビューが公開され、マルチプラットフォームプロジェクトで階層構造がデフォルトとなり、その他のコンポーネントにも進化的な改善がもたらされました。

これらの変更の簡単な概要をこちらの動画でも確認できます。

<video src="https://www.youtube.com/v/8F19ds109-o" title="What's new in Kotlin 1.6.20"/>

## 言語

Kotlin 1.6.20では、2つの新しい言語機能を試すことができます。

*   [Kotlin/JVMのコンテキストレシーバーのプロトタイプ](#prototype-of-context-receivers-for-kotlin-jvm)
*   [確実な非NULL可能型](#definitely-non-nullable-types)

### Kotlin/JVMのコンテキストレシーバーのプロトタイプ

> この機能は、Kotlin/JVMでのみ利用可能なプロトタイプです。`-Xcontext-receivers`を有効にすると、
> コンパイラは本番コードでは使用できないプレリリースバイナリを生成します。
> コンテキストレシーバーはご自身の玩具プロジェクトでのみ使用してください。
> [YouTrack](https://youtrack.jetbrains.com/issues/KT)でのフィードバックをお待ちしております。
>
{style="warning"}

Kotlin 1.6.20では、レシーバーを1つに限定する必要がなくなりました。複数必要な場合は、関数、プロパティ、クラスをコンテキストレシーバーを宣言に追加することで、コンテキストに依存（または_コンテクスチュアル_）にすることができます。コンテクスチュアルな宣言は次のことを行います。

*   呼び出し元のスコープに、宣言されたすべてのコンテキストレシーバーが暗黙的なレシーバーとして存在することを要求します。
*   宣言されたコンテキストレシーバーを、自身のボディスコープに暗黙的なレシーバーとして持ち込みます。

```kotlin
interface LoggingContext {
    val log: Logger // このコンテキストはロガーへの参照を提供します
}

context(LoggingContext)
fun startBusinessOperation() {
    // LoggingContextは暗黙的なレシーバーなので、logプロパティにアクセスできます
    log.info("Operation has started")
}

fun test(loggingContext: LoggingContext) {
    with(loggingContext) {
        // startBusinessOperation()を呼び出すには、
        // スコープ内にLoggingContextを暗黙的なレシーバーとして持っている必要があります
        startBusinessOperation()
    }
}
```

プロジェクトでコンテキストレシーバーを有効にするには、`-Xcontext-receivers`コンパイラオプションを使用します。
この機能とその構文の詳細な説明は、[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/context-receivers.md#detailed-design)で見つけることができます。

この実装はプロトタイプであることに注意してください。

*   `-Xcontext-receivers`を有効にすると、コンパイラは本番コードでは使用できないプレリリースバイナリを生成します。
*   コンテキストレシーバーのIDEサポートは今のところ最小限です。

ご自身の玩具プロジェクトでこの機能を試して、[このYouTrack課題](https://youtrack.jetbrains.com/issue/KT-42435)で感想や経験を私たちと共有してください。
何か問題が発生した場合は、[新しい課題を提出してください](https://kotl.in/issue)。

### 確実な非NULL可能型

> 確実な非NULL可能型は[ベータ版](components-stability.md)です。ほぼ安定していますが、
> 将来的に移行ステップが必要になる可能性があります。
> 私たちは皆様が行う必要のある変更を最小限に抑えるよう最善を尽くします。
>
{style="warning"}

ジェネリックなJavaクラスやインターフェースを拡張する際に、より良い相互運用性を提供するため、Kotlin 1.6.20では新しい構文`T & Any`を使用して、ジェネリック型パラメータを使用箇所で確実な非NULL可能型としてマークできます。
この構文形式は[交差型](https://en.wikipedia.org/wiki/Intersection_type)の表記法に由来し、現在は`&`の左側にNULL許容な上限を持つ型パラメータ、右側に非NULLな`Any`を持つ型パラメータに限定されています。

```kotlin
fun <T> elvisLike(x: T, y: T & Any): T & Any = x ?: y

fun main() {
    // OK
    elvisLike<String>("", "").length
    // エラー: 'null' は非NULL型の値にできません
    elvisLike<String>("", null).length

    // OK
    elvisLike<String?>(null, "").length
    // エラー: 'null' は非NULL型の値にできません
    elvisLike<String?>(null, null).length
}
```
{validate="false"}

この機能を有効にするには、言語バージョンを`1.7`に設定してください。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets.all {
        languageSettings.apply {
            languageVersion = "1.7"
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets.all {
        languageSettings {
            languageVersion = '1.7'
        }
    }
}
```

</tab>
</tabs>

確実な非NULL可能型については、[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types.md)で詳しく学ぶことができます。

## Kotlin/JVM

Kotlin 1.6.20で導入されたもの:

*   JVMインターフェースにおけるデフォルトメソッドの互換性改善: [インターフェース向けの新しい`@JvmDefaultWithCompatibility`アノテーション](#new-jvmdefaultwithcompatibility-annotation-for-interfaces)と[`-Xjvm-default`モードにおける互換性の変更](#compatibility-changes-in-the-xjvm-default-modes)
*   [JVMバックエンドでの単一モジュールの並列コンパイルのサポート](#support-for-parallel-compilation-of-a-single-module-in-the-jvm-backend)
*   [関数型インターフェースコンストラクタへの呼び出し可能参照のサポート](#support-for-callable-references-to-functional-interface-constructors)

### インターフェース向けの新しい@JvmDefaultWithCompatibilityアノテーション

Kotlin 1.6.20では、新しい[`@JvmDefaultWithCompatibility`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-default-with-compatibility/)アノテーションが導入されました。このアノテーションを`-Xjvm-default=all`コンパイラオプションと組み合わせて使用すると、[JVMインターフェースにデフォルトメソッドを作成できます](java-to-kotlin-interop.md#default-methods-in-interfaces)（Kotlinインターフェース内の非抽象メンバーであれば何でも）。

`-Xjvm-default=all`オプションなしでコンパイルされたKotlinインターフェースを使用するクライアントが存在する場合、それらのコードは、このオプションでコンパイルされたコードとバイナリ互換性がない可能性があります。
Kotlin 1.6.20以前は、この互換性の問題を回避するために[推奨されるアプローチ](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/#JvmDefaultWithoutCompatibility)は、`-Xjvm-default=all-compatibility`モードを使用し、この種の互換性を必要としないインターフェースには`@JvmDefaultWithoutCompatibility`アノテーションも使用することでした。

このアプローチにはいくつかの欠点がありました。

*   新しいインターフェースが追加された際に、アノテーションの追加を簡単に忘れてしまう可能性がありました。
*   通常、公開APIよりも非公開部分に多くのインターフェースがあるため、コードの多くの場所にこのアノテーションが散見されることになりました。

現在では、`-Xjvm-default=all`モードを使用し、公開API内のすべてのインターフェースを`@JvmDefaultWithCompatibility`アノテーションでマークすることができます。
これにより、このアノテーションを公開API内のすべてのインターフェースに一度追加するだけで済み、新しい非公開コードにアノテーションを使用する必要がなくなります。

この新しいアノテーションに関するフィードバックを[このYouTrackチケット](https://youtrack.jetbrains.com/issue/KT-48217)にお寄せください。

### -Xjvm-defaultモードにおける互換性の変更

Kotlin 1.6.20では、デフォルトモード（`-Xjvm-default=disable`コンパイラオプション）でモジュールを、`-Xjvm-default=all`または`-Xjvm-default=all-compatibility`モードでコンパイルされたモジュールに対してコンパイルするオプションが追加されました。
これまでと同様に、すべてのモジュールが`-Xjvm-default=all`または`-Xjvm-default=all-compatibility`モードである場合も、コンパイルは成功します。
フィードバックは[このYouTrack課題](https://youtrack.jetbrains.com/issue/KT-47000)にお寄せください。

Kotlin 1.6.20では、コンパイラオプション`-Xjvm-default`の`compatibility`および`enable`モードが非推奨になりました。
他のモードの説明には互換性に関する変更がありますが、全体的なロジックは同じままです。
[更新された説明](java-to-kotlin-interop.md#compatibility-modes-for-default-methods)を確認できます。

Javaインターオペレーションにおけるデフォルトメソッドの詳細については、[相互運用性のドキュメント](java-to-kotlin-interop.md#default-methods-in-interfaces)と
[このブログ記事](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)を参照してください。

### JVMバックエンドでの単一モジュールの並列コンパイルのサポート

> JVMバックエンドでの単一モジュールの並列コンパイルのサポートは[実験的](components-stability.md)です。
> 将来的に削除または変更される可能性があります。オプトインが必要です（詳細は下記参照）。
> 評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issue/KT-46085)でのフィードバックをお待ちしております。
>
{style="warning"}

[新しいJVM IRバックエンドのコンパイル時間を改善する](https://youtrack.jetbrains.com/issue/KT-46768)ための作業を続けています。
Kotlin 1.6.20では、モジュール内のすべてのファイルを並列でコンパイルする実験的なJVM IRバックエンドモードを追加しました。
並列コンパイルにより、合計コンパイル時間を最大15%短縮できます。

実験的な並列バックエンドモードを有効にするには、[コンパイラオプション](compiler-reference.md#compiler-options) `-Xbackend-threads`を使用します。
このオプションには以下の引数を使用します。

*   `N` は使用したいスレッド数です。CPUコア数より大きくするべきではありません。そうしないと、スレッド間のコンテキスト切り替えにより並列化の効果がなくなります。
*   `0` は各CPUコアに独立したスレッドを使用します。

[Gradle](gradle.md)はタスクを並列で実行できますが、プロジェクト（またはプロジェクトの大部分）がGradleの視点から見て単一の大きなタスクである場合、この種の並列化はあまり役に立ちません。
非常に大きなモノリシックモジュールがある場合は、並列コンパイルを使用してコンパイルを高速化してください。
プロジェクトが多数の小さなモジュールで構成され、Gradleによってビルドが並列化されている場合、コンテキスト切り替えにより、さらなる並列化の層を追加するとパフォーマンスが低下する可能性があります。

> 並列コンパイルにはいくつかの制約があります。
> *   [kapt](kapt.md)ではIRバックエンドが無効になるため、動作しません。
> *   設計上、より多くのJVMヒープを必要とします。ヒープの量はスレッド数に比例します。
>
{style="note"}

### 関数型インターフェースコンストラクタへの呼び出し可能参照のサポート

> 関数型インターフェースコンストラクタへの呼び出し可能参照のサポートは[実験的](components-stability.md)です。
> 将来的に削除または変更される可能性があります。オプトインが必要です（詳細は下記参照）。
> 評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issue/KT-47939)でのフィードバックをお待ちしております。
>
{style="warning"}

関数型インターフェースコンストラクタへの[呼び出し可能参照](reflection.md#callable-references)のサポートにより、コンストラクタ関数を持つインターフェースから[関数型インターフェース](fun-interfaces.md)への移行をソース互換の方法で実現できます。

以下のコードを考えてみましょう。

```kotlin
interface Printer {
    fun print()
}

fun Printer(block: () -> Unit): Printer = object : Printer { override fun print() = block() }
```

関数型インターフェースコンストラクタへの呼び出し可能参照が有効になっている場合、このコードは単なる関数型インターフェースの宣言に置き換えることができます。

```kotlin
fun interface Printer {
    fun print()
}
```

そのコンストラクタは暗黙的に作成され、`::Printer`関数参照を使用するコードはすべてコンパイルされます。例：

```kotlin
documentsStorage.addPrinter(::Printer)
```
{validate="false"}

バイナリ互換性を維持するには、従来の関数`Printer`を`DeprecationLevel.HIDDEN`を指定した[`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/)アノテーションでマークします。

```kotlin
@Deprecated(message = "Your message about the deprecation", level = DeprecationLevel.HIDDEN)
fun Printer(...) {...}
```
{validate="false"}

この機能を有効にするには、`-XXLanguage:+KotlinFunInterfaceConstructorReference`コンパイラオプションを使用します。

## Kotlin/Native

Kotlin/Native 1.6.20では、新しいコンポーネントの開発が継続されています。他のプラットフォームでのKotlinとの一貫した体験に向けて、さらなる一歩を踏み出しました。

*   [新しいメモリマネージャーのアップデート](#an-update-on-the-new-memory-manager)
*   [新しいメモリマネージャーにおけるスイープフェーズの並行実装](#concurrent-implementation-for-the-sweep-phase-in-new-memory-manager)
*   [アノテーションクラスのインスタンス化](#instantiation-of-annotation-classes)
*   [Swiftのasync/awaitとの相互運用性: KotlinUnitの代わりにVoidを返す](#interop-with-swift-async-await-returning-void-instead-of-kotlinunit)
*   [`libbacktrace`によるより良いスタックトレース](#better-stack-traces-with-libbacktrace)
*   [スタンドアロンAndroid実行可能ファイルのサポート](#support-for-standalone-android-executables)
*   [パフォーマンス改善](#performance-improvements)
*   [`cinterop`モジュールのインポート時のエラーハンドリングの改善](#improved-error-handling-during-cinterop-modules-import)
*   [Xcode 13ライブラリのサポート](#support-for-xcode-13-libraries)

### 新しいメモリマネージャーのアップデート

> 新しいKotlin/Nativeメモリマネージャーは[アルファ版](components-stability.md)です。
> 将来的に互換性のない変更があり、手動での移行が必要になる可能性があります。
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525)でのフィードバックをお待ちしております。
>
{style="note"}

Kotlin 1.6.20では、新しいKotlin/Nativeメモリマネージャーのアルファ版を試すことができます。
これにより、JVMとNativeプラットフォーム間の違いが解消され、マルチプラットフォームプロジェクトで一貫した開発体験を提供します。
例えば、AndroidとiOSの両方で動作する新しいクロスプラットフォームモバイルアプリケーションの作成が格段に容易になります。

新しいKotlin/Nativeメモリマネージャーは、スレッド間のオブジェクト共有に関する制限を解除します。
また、安全で特別な管理やアノテーションを必要としない、リークフリーな並行プログラミングプリミティブを提供します。

新しいメモリマネージャーは将来のバージョンでデフォルトになる予定ですので、ぜひ今すぐお試しください。
新しいメモリマネージャーの詳細とデモプロジェクトについては、[ブログ記事](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/)を、
またはすぐに試すには[移行手順](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/NEW_MM.md)をご覧ください。

ご自身のプロジェクトで新しいメモリマネージャーを試して、その動作を確認し、課題トラッカーである[YouTrack](https://youtrack.jetbrains.com/issue/KT-48525)にフィードバックをお寄せください。

### 新しいメモリマネージャーにおけるスイープフェーズの並行実装

Kotlin 1.6で[発表された新しいメモリマネージャー](whatsnew16.md#preview-of-the-new-memory-manager)にすでに切り替えている場合、実行時間が大幅に改善されていることに気づくかもしれません。私たちのベンチマークでは、平均で35%の改善が見られました。
1.6.20以降、新しいメモリマネージャーにはスイープフェーズの並行実装も利用できます。
これにより、パフォーマンスがさらに向上し、ガベージコレクタの一時停止時間が短縮されるはずです。

新しいKotlin/Nativeメモリマネージャーでこの機能を有効にするには、以下のコンパイラオプションを渡します。

```bash
-Xgc=cms
```

新しいメモリマネージャーのパフォーマンスに関するフィードバックは、[このYouTrack課題](https://youtrack.jetbrains.com/issue/KT-48526)に自由にお寄せください。

### アノテーションクラスのインスタンス化

Kotlin 1.6.0で、アノテーションクラスのインスタンス化はKotlin/JVMおよびKotlin/JSで[安定版](components-stability.md)になりました。
1.6.20バージョンでは、Kotlin/Nativeのサポートが提供されます。

[アノテーションクラスのインスタンス化](annotations.md#instantiation)について詳しく学ぶことができます。

### Swiftのasync/awaitとの相互運用性: KotlinUnitの代わりにVoidを返す

> Swiftのasync/awaitとの並行処理の相互運用性は[実験的](components-stability.md)です。
> 将来的に削除または変更される可能性があります。評価目的でのみ使用してください。
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-47610)でのフィードバックをお待ちしております。
>
{style="warning"}

Swift 5.5以降利用可能な[Swiftのasync/awaitとの実験的な相互運用性](whatsnew1530.md#experimental-interoperability-with-swift-5-5-async-await)に関する作業を継続しました。
Kotlin 1.6.20は、`Unit`戻り値型を持つ`suspend`関数の動作方法が以前のバージョンと異なります。

以前は、このような関数はSwiftでは`KotlinUnit`を返す`async`関数として表現されていました。しかし、それらの適切な戻り値型は、非中断関数と同様に`Void`です。

既存のコードを壊さないように、コンパイラが`Unit`を返す`suspend`関数を`Void`戻り値型を持つ`async` Swiftに変換するようにするGradleプロパティを導入しています。

```none
# gradle.properties
kotlin.native.binary.unitSuspendFunctionObjCExport=proper
```

この動作は将来のKotlinリリースでデフォルトにする予定です。

### libbacktraceによるより良いスタックトレース

> ソースロケーションの解決に`libbacktrace`を使用することは[実験的](components-stability.md)です。
> 将来的に削除または変更される可能性があります。評価目的でのみ使用してください。
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-48424)でのフィードバックをお待ちしております。
>
{style="warning"}

Kotlin/Nativeは現在、`linux*`（`linuxMips32`および`linuxMipsel32`を除く）および`androidNative*`ターゲットのデバッグを改善するために、ファイルロケーションと行番号を含む詳細なスタックトレースを生成できるようになりました。

この機能は、内部的に[`libbacktrace`](https://github.com/ianlancetaylor/libbacktrace)ライブラリを使用しています。
以下のコードを見て、その違いの例を確認してください。

```kotlin
fun main() = bar()
fun bar() = baz()
inline fun baz() {
    error("")
}
```

*   **1.6.20以前:**

```text
Uncaught Kotlin exception: kotlin.IllegalStateException:
   at 0   example.kexe        0x227190       kfun:kotlin.Throwable#<init>(kotlin.String?){} + 96
   at 1   example.kexe        0x221e4c       kfun:kotlin.Exception#<init>(kotlin.String?){} + 92
   at 2   example.kexe        0x221f4c       kfun:kotlin.RuntimeException#<init>(kotlin.String?){} + 92
   at 3   example.kexe        0x22234c       kfun:kotlin.IllegalStateException#<init>(kotlin.String?){} + 92
   at 4   example.kexe        0x25d708       kfun:#bar(){} + 104
   at 5   example.kexe        0x25d68c       kfun:#main(){} + 12
```
{initial-collapse-state="collapsed" collapsible="true"}

*   **1.6.20と`libbacktrace`を使用した場合:**

```text
Uncaught Kotlin exception: kotlin.IllegalStateException:
   at 0   example.kexe        0x229550    kfun:kotlin.Throwable#<init>(kotlin.String?){} + 96 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Throwable.kt:24:37)
   at 1   example.kexe        0x22420c    kfun:kotlin.Exception#<init>(kotlin.String?){} + 92 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:23:44)
   at 2   example.kexe        0x22430c    kfun:kotlin.RuntimeException#<init>(kotlin.String?){} + 92 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:34:44)
   at 3   example.kexe        0x22470c    kfun:kotlin.IllegalStateException#<init>(kotlin.String?){} + 92 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:70:44)
   at 4   example.kexe        0x25fac8    kfun:#bar(){} + 104 [inlined] (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/libraries/stdlib/src/kotlin/util/Preconditions.kt:143:56)
   at 5   example.kexe        0x25fac8    kfun:#bar(){} + 104 [inlined] (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:4:5)
   at 6   example.kexe        0x25fac8    kfun:#bar(){} + 104 (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:2:13)
   at 7   example.kexe        0x25fa4c    kfun:#main(){} + 12 (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:1:14)
```
{initial-collapse-state="collapsed" collapsible="true"}

Appleターゲットでは、すでにスタックトレースにファイルロケーションと行番号が含まれていましたが、`libbacktrace`を使用すると、インライン関数呼び出しに関する詳細情報が提供されます。

*   **1.6.20以前:**

```text
Uncaught Kotlin exception: kotlin.IllegalStateException:
   at 0   example.kexe    0x10a85a8f8    kfun:kotlin.Throwable#<init>(kotlin.String?){} + 88 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Throwable.kt:24:37)
   at 1   example.kexe    0x10a855846    kfun:kotlin.Exception#<init>(kotlin.String?){} + 86 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:23:44)
   at 2   example.kexe    0x10a855936    kfun:kotlin.RuntimeException#<init>(kotlin.String?){} + 86 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:34:44)
   at 3   example.kexe    0x10a855c86    kfun:kotlin.IllegalStateException#<init>(kotlin.String?){} + 86 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:70:44)
   at 4   example.kexe    0x10a8489a5    kfun:#bar(){} + 117 (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:2:1)
   at 5   example.kexe    0x10a84891c    kfun:#main(){} + 12 (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:1:14)
...
```
{initial-collapse-state="collapsed" collapsible="true"}

*   **1.6.20と`libbacktrace`を使用した場合:**

```text
Uncaught Kotlin exception: kotlin.IllegalStateException:
   at 0   example.kexe    0x10669bc88    kfun:kotlin.Throwable#<init>(kotlin.String?){} + 88 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Throwable.kt:24:37)
   at 1   example.kexe    0x106696bd6    kfun:kotlin.Exception#<init>(kotlin.String?){} + 86 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:23:44)
   at 2   example.kexe    0x106696cc6    kfun:kotlin.RuntimeException#<init>(kotlin.String?){} + 86 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:34:44)
   at 3   example.kexe    0x106697016    kfun:kotlin.IllegalStateException#<init>(kotlin.String?){} + 86 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:70:44)
   at 4   example.kexe    0x106689d35    kfun:#bar(){} + 117 [inlined] (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/libraries/stdlib/src/kotlin/util/Preconditions.kt:143:56)
>>  at 5   example.kexe    0x106689d35    kfun:#bar(){} + 117 [inlined] (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:4:5)
   at 6   example.kexe    0x106689d35    kfun:#bar(){} + 117 (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:2:13)
   at 7   example.kexe    0x106689cac    kfun:#main(){} + 12 (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:1:14)
...
```
{initial-collapse-state="collapsed" collapsible="true"}

`libbacktrace`を使用してより良いスタックトレースを生成するには、`gradle.properties`に以下の行を追加します。

```none
# gradle.properties
kotlin.native.binary.sourceInfoType=libbacktrace
```

`libbacktrace`を使用したKotlin/Nativeのデバッグについて、[このYouTrack課題](https://youtrack.jetbrains.com/issue/KT-48424)でご意見をお聞かせください。

### スタンドアロンAndroid実行可能ファイルのサポート

以前、Kotlin/NativeのAndroid Native実行可能ファイルは、実際には実行可能ファイルではなく、NativeActivityとして使用できる共有ライブラリでした。今回、Android Nativeターゲット用の標準的な実行可能ファイルを生成するオプションが追加されました。

そのためには、プロジェクトの`build.gradle(.kts)`部分で、`androidNative`ターゲットの`executable`ブロックを設定します。
以下のバイナリオプションを追加します。

```kotlin
kotlin {
    androidNativeX64("android") {
        binaries {
            executable {
                binaryOptions["androidProgramType"] = "standalone"
            }
        }
    }
}
```

この機能はKotlin 1.7.0でデフォルトになることに注意してください。
現在の動作を維持したい場合は、以下の設定を使用してください。

```kotlin
binaryOptions["androidProgramType"] = "nativeActivity"
```

Mattia Iavarone氏による[実装](https://github.com/jetbrains/kotlin/pull/4624)に感謝します！

### パフォーマンス改善

Kotlin/Nativeの[コンパイルプロセスを高速化](https://youtrack.jetbrains.com/issue/KT-42294)し、開発体験を向上させるために、私たちは懸命に取り組んでいます。

Kotlin 1.6.20では、Kotlinが生成するLLVM IRに影響するいくつかのパフォーマンスアップデートとバグ修正が含まれています。
私たちの内部プロジェクトのベンチマークによると、平均して以下のパフォーマンス向上が達成されました。

*   実行時間を15%削減
*   リリースおよびデバッグバイナリの両方のコードサイズを20%削減
*   リリースバイナリのコンパイル時間を26%削減

これらの変更により、大規模な内部プロジェクトでのデバッグバイナリのコンパイル時間も10%短縮されました。

これを達成するために、コンパイラが生成する一部のシンセティックオブジェクトの静的初期化を実装し、各関数のLLVM IRの構造を改善し、コンパイラキャッシュを最適化しました。

### cinteropモジュールのインポート時のエラーハンドリングの改善

このリリースでは、`cinterop`ツールを使用してObjective-Cモジュールをインポートする際（CocoaPodsのpodでよくあるケース）のエラーハンドリングが改善されました。
以前は、Objective-Cモジュールを扱おうとした際にエラーが発生した場合（例えば、ヘッダーのコンパイルエラーなど）、`fatal error: could not build module $name`のような情報が少ないエラーメッセージが表示されていました。
今回、`cinterop`ツールのこの部分を拡張し、詳細な説明付きのエラーメッセージが表示されるようになりました。

### Xcode 13ライブラリのサポート

Xcode 13に付属するライブラリは、このリリースから完全にサポートされるようになりました。
Kotlinコードのどこからでも自由にアクセスできます。

## Kotlin Multiplatform

1.6.20では、Kotlin Multiplatformに以下の注目すべきアップデートがもたらされました。

*   [階層構造サポートがすべての新しいマルチプラットフォームプロジェクトでデフォルトに](#hierarchical-structure-support-for-multiplatform-projects)
*   [Kotlin CocoaPods GradleプラグインがCocoaPods統合のためのいくつかの便利な機能を受け取りました](#kotlin-cocoapods-gradle-plugin)

### マルチプラットフォームプロジェクトの階層構造サポート

Kotlin 1.6.20では、階層構造のサポートがデフォルトで有効になっています。
[Kotlin 1.4.0で導入](whatsnew14.md#sharing-code-in-several-targets-with-the-hierarchical-project-structure)して以来、フロントエンドを大幅に改善し、IDEインポートを安定させました。

以前は、マルチプラットフォームプロジェクトにコードを追加する方法は2つありました。1つはプラットフォーム固有のソースセットに挿入する方法で、これは1つのターゲットに限定され、他のプラットフォームで再利用できませんでした。
もう1つは、Kotlinが現在サポートしているすべてのプラットフォームで共有される共通ソースセットを使用する方法でした。

現在では、多くの共通ロジックとサードパーティAPIを再利用する複数の類似するネイティブターゲット間で[ソースコードを共有する](#better-code-sharing-in-your-project)ことができます。
この技術により、正しいデフォルトの依存関係が提供され、共有コードで利用可能な正確なAPIが見つけられます。
これにより、複雑なビルド設定や、ネイティブターゲット間でソースセットを共有するためのIDEサポートを得るための回避策の使用が不要になります。
また、異なるターゲットを意図した安全でないAPIの使用を防ぐのにも役立ちます。

この技術は、[ライブラリ作者](#more-opportunities-for-library-authors)にとっても便利です。階層構造プロジェクトにより、ターゲットのサブセット向けに共通APIを持つライブラリを公開および利用できるためです。

デフォルトでは、階層構造プロジェクトで公開されたライブラリは、階層構造プロジェクトとのみ互換性があります。

#### プロジェクト内でのコード共有の改善

階層構造のサポートがない場合、すべての[Kotlinターゲット](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#targets)ではなく、_一部_のターゲット間でコードを共有する直接的な方法はありません。
一般的な例の1つは、すべてのiOSターゲット間でコードを共有し、FoundationのようなiOS固有の[依存関係](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#connect-platform-specific-libraries)にアクセスすることです。

階層構造プロジェクトのサポートのおかげで、これはすぐに使える形で実現できるようになりました。
新しい構造では、ソースセットは階層を形成します。
与えられたソースセットがコンパイルされる各ターゲットで利用可能なプラットフォーム固有の言語機能と依存関係を使用できます。

例えば、iOSデバイスとシミュレーター用の2つのターゲット（`iosArm64`と`iosX64`）を持つ典型的なマルチプラットフォームプロジェクトを考えてみましょう。
Kotlinツールは、両方のターゲットが同じ関数を持つことを理解し、中間ソースセット`iosMain`からその関数にアクセスできるようにします。

![iOS hierarchy example](ios-hierarchy-example.jpg){width=700}

Kotlinツールチェインは、Kotlin/Native stdlibやネイティブライブラリなどの正しいデフォルトの依存関係を提供します。
さらに、Kotlinツールは、共有コードで利用可能なAPIの正確な表面領域を特定するために最善を尽くします。
これにより、例えば、Windows用のコードでJVM固有の関数を使用するような安全でないケースを防ぎます。

#### ライブラリ作者へのさらなる機会

マルチプラットフォームライブラリが公開される際、その中間ソースセットのAPIは、適切に共に公開され、利用者が利用できるようになります。
ここでも、Kotlinツールチェインは、消費側ソースセットで利用可能なAPIを自動的に把握し、JSコードでJVM用のAPIを使用するような安全でない使用を注意深く監視します。
[ライブラリでのコード共有](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-in-libraries)について詳しく学ぶことができます。

#### 設定とセットアップ

Kotlin 1.6.20以降、すべての新しいマルチプラットフォームプロジェクトは階層構造プロジェクトになります。追加の設定は必要ありません。

*   すでに[手動で有効にしている場合](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-on-similar-platforms)は、`gradle.properties`から非推奨のオプションを削除できます。

  ```none
  # gradle.properties
  kotlin.mpp.enableGranularSourceSetsMetadata=true
  kotlin.native.enableDependencyPropagation=false // または、以前の設定に応じて 'true'
  ```

*   Kotlin 1.6.20では、最高の体験を得るために[Android Studio 2021.1.1](https://developer.android.com/studio) (Bumblebee) 以降を使用することをお勧めします。

*   オプトアウトすることも可能です。階層構造のサポートを無効にするには、`gradle.properties`で以下のオプションを設定します。

  ```none
  # gradle.properties
  kotlin.mpp.hierarchicalStructureSupport=false
  ```

#### フィードバックをお願いします

これはエコシステム全体にとって重要な変更です。さらに改善するために、皆様からのフィードバックをお待ちしております。

今すぐ試して、遭遇した問題があれば[課題トラッカー](https://kotl.in/issue)に報告してください。

### Kotlin CocoaPods Gradleプラグイン

CocoaPods統合を簡素化するため、Kotlin 1.6.20では以下の機能が提供されます。

*   CocoaPodsプラグインには、登録されているすべてのターゲットでXCFrameworkをビルドし、Podspecファイルを生成するタスクが追加されました。これは、Xcodeと直接統合したくないが、成果物をビルドしてローカルのCocoaPodsリポジトリにデプロイしたい場合に便利です。
  
  [XCFrameworkのビルド](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html#build-xcframeworks)について詳しく学ぶことができます。

*   プロジェクトで[CocoaPods統合](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html)を使用している場合、Gradleプロジェクト全体に必要なPodバージョンを指定することに慣れているでしょう。これに加えて、以下のオプションが利用可能になりました。
  *   `cocoapods`ブロックでPodバージョンを直接指定する
  *   Gradleプロジェクトバージョンを引き続き使用する
  
  これらのプロパティのいずれも設定されていない場合、エラーが発生します。

*   Gradleプロジェクト全体の名前を変更する代わりに、`cocoapods`ブロックでCocoaPod名を構成できるようになりました。

*   CocoaPodsプラグインは、新しい`extraSpecAttributes`プロパティを導入しました。これにより、`libraries`や`vendored_frameworks`など、以前はハードコードされていたPodspecファイル内のプロパティを構成できます。

```kotlin
kotlin {
    cocoapods {
        version = "1.0"
        name = "MyCocoaPod"
        extraSpecAttributes["social_media_url"] = 'https://twitter.com/kotlin'
        extraSpecAttributes["vendored_frameworks"] = 'CustomFramework.xcframework'
        extraSpecAttributes["libraries"] = 'xml'
    }
}
```

Kotlin CocoaPods Gradleプラグインの完全な[DSLリファレンス](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-dsl-reference.html)を参照してください。

## Kotlin/JS

Kotlin/JS 1.6.20の改善は、主にIRコンパイラに影響します。

*   [開発バイナリ向けインクリメンタルコンパイル（IR）](#incremental-compilation-for-development-binaries-with-ir-compiler)
*   [トップレベルプロパティのデフォルトでの遅延初期化（IR）](#lazy-initialization-of-top-level-properties-by-default-with-ir-compiler)
*   [プロジェクトモジュールごとのJSファイルのデフォルトでの分離（IR）](#separate-js-files-for-project-modules-by-default-with-ir-compiler)
*   [Charクラスの最適化（IR）](#char-class-optimization)
*   [エクスポートの改善（IRおよびレガシーバックエンドの両方）](#improvements-to-export-and-typescript-declaration-generation)
*   [非同期テストにおける@AfterTestの保証](#aftertest-guarantees-for-asynchronous-tests)

### 開発バイナリ向けインクリメンタルコンパイル（IRコンパイラ使用）

IRコンパイラを使用したKotlin/JS開発をより効率的にするために、新しい_インクリメンタルコンパイル_モードを導入しました。

このモードで`compileDevelopmentExecutableKotlinJs` Gradleタスクを使用して**開発バイナリ**をビルドする場合、コンパイラはモジュールレベルで以前のコンパイル結果をキャッシュします。
変更されていないソースファイルについては、後続のコンパイルでキャッシュされたコンパイル結果を使用するため、特に小さな変更の場合にコンパイルがより高速に完了します。
この改善は、開発プロセス（編集・ビルド・デバッグサイクルの短縮）のみを対象としており、プロダクション成果物のビルドには影響しないことに注意してください。

開発バイナリのインクリメンタルコンパイルを有効にするには、プロジェクトの`gradle.properties`に以下の行を追加します。

```none
# gradle.properties
kotlin.incremental.js.ir=true // デフォルトはfalse
```

テストプロジェクトでは、新しいモードによりインクリメンタルコンパイルが最大30%高速化されました。ただし、このモードでのクリーンビルドは、キャッシュを作成して投入する必要があるため、遅くなりました。

Kotlin/JSプロジェクトでのインクリメンタルコンパイルの使用について、[このYouTrack課題](https://youtrack.jetbrains.com/issue/KT-50203)でご意見をお聞かせください。

### トップレベルプロパティのデフォルトでの遅延初期化（IRコンパイラ使用）

Kotlin 1.4.30では、JS IRコンパイラにおける[トップレベルプロパティの遅延初期化](whatsnew1430.md#lazy-initialization-of-top-level-properties)のプロトタイプを発表しました。
すべてのプロパティをアプリケーション起動時に初期化する必要をなくすことで、遅延初期化は起動時間を短縮します。
私たちの測定では、実際のKotlin/JSアプリケーションで約10%の高速化が見られました。

このメカニズムを磨き上げ、適切にテストした結果、IRコンパイラでのトップレベルプロパティの遅延初期化をデフォルトにしました。

```kotlin
// 遅延初期化
val a = run {
    val result = // 負荷の高い計算
        println(result)
    result
} // run は変数が最初に利用されたときに実行される
```

何らかの理由でプロパティを即時（アプリケーション起動時）に初期化する必要がある場合は、[`@EagerInitialization`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-eager-initialization/)アノテーションでマークしてください。

### プロジェクトモジュールごとのJSファイルのデフォルトでの分離（IRコンパイラ使用）

以前は、JS IRコンパイラは、[プロジェクトモジュールごとに個別の`.js`ファイルを生成する機能](https://youtrack.jetbrains.com/issue/KT-44319)を提供していました。
これは、プロジェクト全体に対して単一の`.js`ファイルを生成するデフォルトオプションの代替でした。
このファイルは大きすぎて使いにくく、プロジェクトの関数を使用するたびにJSファイル全体を依存関係として含める必要がありました。
複数のファイルを持つことで柔軟性が増し、そのような依存関係のサイズが減少します。この機能は`-Xir-per-module`コンパイラオプションで利用可能でした。

1.6.20以降、JS IRコンパイラはデフォルトでプロジェクトモジュールごとに個別の`.js`ファイルを生成します。

プロジェクトを単一の`.js`ファイルにコンパイルすることは、以下のGradleプロパティで利用可能になりました。

```none
# gradle.properties
kotlin.js.ir.output.granularity=whole-program // `per-module`がデフォルト
```

以前のリリースでは、実験的なモジュールごとモード（`-Xir-per-module=true`フラグで利用可能）は、各モジュールの`main()`関数を呼び出していました。これは、通常の単一`.js`モードと一貫性がありません。1.6.20以降、`main()`関数はどちらの場合でもメインモジュールでのみ呼び出されます。モジュールがロードされたときにコードを実行する必要がある場合は、`@EagerInitialization`アノテーションが付けられたトップレベルプロパティを使用できます。詳細については、「[トップレベルプロパティのデフォルトでの遅延初期化（IRコンパイラ使用）](#lazy-initialization-of-top-level-properties-by-default-with-ir-compiler)」を参照してください。

### Charクラスの最適化

`Char`クラスは、Kotlin/JSコンパイラによってボクシングを導入せずに処理されるようになりました（[インラインクラス](inline-classes.md)と同様）。
これにより、Kotlin/JSコードでの文字に対する操作が高速化されます。

パフォーマンスの向上に加えて、これにより`Char`がJavaScriptにエクスポートされる方法が変更され、現在は`Number`に変換されます。

### エクスポートとTypeScript宣言生成の改善

Kotlin 1.6.20では、エクスポートメカニズム（[`@JsExport`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-export/)アノテーション）に複数の修正と改善が加えられ、これには[TypeScript宣言（`.d.ts`）の生成](js-ir-compiler.md#preview-generation-of-typescript-declaration-files-d-ts)も含まれます。
インターフェースとenumをエクスポートする機能が追加され、以前報告された一部のコーナーケースにおけるエクスポート動作が修正されました。
詳細については、[YouTrackのエクスポート改善点のリスト](https://youtrack.jetbrains.com/issues?q=Project:%20Kotlin%20issue%20id:%20KT-45434,%20KT-44494,%20KT-37916,%20KT-43191,%20KT-46961,%20KT-40236)を参照してください。

[JavaScriptからKotlinコードを使用する](js-to-kotlin-interop.md)方法について詳しく学ぶことができます。

### 非同期テストにおける@AfterTestの保証

Kotlin 1.6.20では、[`@AfterTest`](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/-after-test/)関数がKotlin/JS上の非同期テストで適切に動作するようになりました。
テスト関数の戻り値の型が静的に[`Promise`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-promise/)に解決される場合、コンパイラは`@AfterTest`関数の実行を対応する[`then()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-promise/then.html)コールバックにスケジュールするようになりました。

## セキュリティ

Kotlin 1.6.20では、コードのセキュリティを向上させるためのいくつかの機能が導入されています。

*   [klibにおける相対パスの使用](#using-relative-paths-in-klibs)
*   [Kotlin/JS Gradleプロジェクトにおける`yarn.lock`の永続化](#persisting-yarn-lock-for-kotlin-js-gradle-projects)
*   [npm依存関係のデフォルトでの`--ignore-scripts`によるインストール](#installation-of-npm-dependencies-with-ignore-scripts-by-default)

### klibにおける相対パスの使用

`klib`形式のライブラリには、適切なデバッグ情報を生成するためのパスも含む、ソースファイルのシリアル化されたIR表現が含まれています。
Kotlin 1.6.20以前は、保存されるファイルパスは絶対パスでした。ライブラリの作者が絶対パスを共有したくない場合があるため、1.6.20バージョンでは代替オプションが提供されます。

`klib`を公開し、成果物内でソースファイルの相対パスのみを使用したい場合は、`-Xklib-relative-path-base`コンパイラオプションを1つ以上のソースファイルのベースパスとともに渡すことができます。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinCompile::class).configureEach {
    // $base はソースファイルのベースパスです
    kotlinOptions.freeCompilerArgs += "-Xklib-relative-path-base=$base"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinCompile).configureEach {
    kotlinOptions {
        // $base はソースファイルのベースパスです
        freeCompilerArgs += "-Xklib-relative-path-base=$base"
    }
}
```

</tab>
</tabs>

### Kotlin/JS Gradleプロジェクトにおけるyarn.lockの永続化

> この機能はKotlin 1.6.10にバックポートされました。
>
{style="note"}

Kotlin/JS Gradleプラグインは、`yarn.lock`ファイルを永続化する機能を提供するようになり、追加のGradle設定なしでプロジェクトのnpm依存関係のバージョンをロックできるようになりました。
この機能により、プロジェクトのルートに自動生成される`kotlin-js-store`ディレクトリが追加され、デフォルトのプロジェクト構造に変更がもたらされます。
このディレクトリ内に`yarn.lock`ファイルが保持されます。

`kotlin-js-store`ディレクトリとその内容をバージョン管理システムにコミットすることを強くお勧めします。
ロックファイルをバージョン管理システムにコミットすることは[推奨されるプラクティス](https://classic.yarnpkg.com/blog/2016/11/24/lockfiles-for-all/)です。これは、開発環境であれCI/CDサービスであれ、すべてのマシンでアプリケーションがまったく同じ依存関係ツリーでビルドされることを保証するためです。
ロックファイルはまた、プロジェクトが新しいマシンでチェックアウトされたときに、npm依存関係が静かに更新されるのを防ぎます。これはセキュリティ上の懸念です。

[Dependabot](https://github.com/dependabot)などのツールもKotlin/JSプロジェクトの`yarn.lock`ファイルを解析し、依存するnpmパッケージが侵害された場合に警告を提供できます。

必要に応じて、ビルドスクリプトでディレクトリ名とロックファイル名の両方を変更できます。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> {
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().lockFileDirectory =
        project.rootDir.resolve("my-kotlin-js-store")
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().lockFileName = "my-yarn.lock"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).lockFileDirectory =
        file("my-kotlin-js-store")
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).lockFileName = 'my-yarn.lock'
}
```

</tab>
</tabs>

> ロックファイルの名前を変更すると、依存関係検査ツールがファイルを認識しなくなる可能性があります。
>
{style="warning"}

### npm依存関係のデフォルトでの--ignore-scriptsによるインストール

> この機能はKotlin 1.6.10にバックポートされました。
>
{style="note"}

Kotlin/JS Gradleプラグインは、デフォルトでnpm依存関係のインストール中に[ライフサイクルスクリプト](https://docs.npmjs.com/cli/v8/using-npm/scripts#life-cycle-scripts)の実行を防止するようになりました。
この変更は、侵害されたnpmパッケージからの悪意のあるコードが実行される可能性を減らすことを目的としています。

以前の設定に戻すには、`build.gradle(.kts)`に以下の行を追加して、ライフサイクルスクリプトの実行を明示的に有効にできます。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> {
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().ignoreScripts = false
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).ignoreScripts = false
}
```

</tab>
</tabs>

[Kotlin/JS Gradleプロジェクトのnpm依存関係](js-project-setup.md#npm-dependencies)について詳しく学ぶことができます。

## Gradle

Kotlin 1.6.20では、Kotlin Gradleプラグインに以下の変更がもたらされました。

*   Kotlinコンパイラの実行戦略を定義するための新しい[プロパティ`kotlin.compiler.execution.strategy`および`compilerExecutionStrategy`](#properties-for-defining-kotlin-compiler-execution-strategy)
*   [kaptおよびコルーチン向けビルドオプションの非推奨化](#deprecation-of-build-options-for-kapt-and-coroutines)
*   [`kotlin.parallel.tasks.in.project`ビルドオプションの削除](#removal-of-the-kotlin-parallel-tasks-in-project-build-option)

### Kotlinコンパイラ実行戦略を定義するためのプロパティ

Kotlin 1.6.20以前は、Kotlinコンパイラの実行戦略を定義するためにシステムプロパティ`-Dkotlin.compiler.execution.strategy`を使用していました。
このプロパティは、場合によっては不便だったかもしれません。
Kotlin 1.6.20では、同名のGradleプロパティ`kotlin.compiler.execution.strategy`と、コンパイルタスクプロパティ`compilerExecutionStrategy`が導入されました。

システムプロパティは引き続き動作しますが、将来のリリースで削除される予定です。

プロパティの現在の優先順位は以下の通りです。

*   タスクプロパティ`compilerExecutionStrategy`は、システムプロパティとGradleプロパティ`kotlin.compiler.execution.strategy`よりも優先されます。
*   Gradleプロパティはシステムプロパティよりも優先されます。

これらのプロパティに割り当てることができるコンパイラ実行戦略は3つあります。

| 戦略       | Kotlinコンパイラが実行される場所 | インクリメンタルコンパイル | その他の特徴                                                  |
|------------|----------------------------------|----------------------------|---------------------------------------------------------------|
| Daemon     | 自身のデーモンプロセス内         | はい                       | *デフォルトの戦略*。異なるGradleデーモン間で共有可能。       |
| In process | Gradleデーモンプロセス内         | いいえ                     | Gradleデーモンとヒープを共有する可能性あり。                  |
| Out of process | 呼び出しごとに独立したプロセスで | いいえ                     | —                                                             |

したがって、`kotlin.compiler.execution.strategy`プロパティ（システムプロパティとGradleの両方）で利用可能な値は次のとおりです。
1.  `daemon` (デフォルト)
2.  `in-process`
3.  `out-of-process`

`gradle.properties`でGradleプロパティ`kotlin.compiler.execution.strategy`を使用します。

```none
# gradle.properties
kotlin.compiler.execution.strategy=out-of-process
```

`compilerExecutionStrategy`タスクプロパティで利用可能な値は次のとおりです。

1.  `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.DAEMON` (デフォルト)
2.  `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.IN_PROCESS`
3.  `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.OUT_OF_PROCESS`

`build.gradle.kts`ビルドスクリプトでタスクプロパティ`compilerExecutionStrategy`を使用します。

```kotlin
import org.jetbrains.kotlin.gradle.dsl.KotlinCompile
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy

// ...

tasks.withType<KotlinCompile>().configureEach {
    compilerExecutionStrategy.set(KotlinCompilerExecutionStrategy.IN_PROCESS)
}
```

[このYouTrackタスク](https://youtrack.jetbrains.com/issue/KT-49299)にフィードバックをお寄せください。

### kaptおよびコルーチン向けビルドオプションの非推奨化

Kotlin 1.6.20では、プロパティの非推奨レベルを変更しました。

*   `kapt.use.worker.api`を介してKotlinデーモン経由で[kapt](kapt.md)を実行する機能は非推奨になりました。これは現在、Gradleの出力に警告を生成します。
    デフォルトでは、[kaptは1.3.70リリースからGradleワーカーを使用](kapt.md#run-kapt-tasks-in-parallel)しており、この方法に固執することをお勧めします。

    将来のリリースでオプション`kapt.use.worker.api`を削除する予定です。

*   `kotlin.experimental.coroutines` Gradle DSLオプションと`gradle.properties`で使用される`kotlin.coroutines`プロパティは非推奨になりました。
    単に_中断関数_を使用するか、`build.gradle(.kts)`ファイルに[`kotlinx.coroutines`依存関係を追加](gradle-configure-project.md#set-a-dependency-on-a-kotlinx-library)してください。
    
    コルーチンについては、[コルーチンガイド](coroutines-guide.md)で詳しく学ぶことができます。

### kotlin.parallel.tasks.in.projectビルドオプションの削除

Kotlin 1.5.20で、[ビルドオプション`kotlin.parallel.tasks.in.project`の非推奨化](whatsnew1520.md#deprecation-of-the-kotlin-parallel-tasks-in-project-build-property)を発表しました。
このオプションはKotlin 1.6.20で削除されました。

プロジェクトによっては、Kotlinデーモンでの並列コンパイルに多くのメモリが必要となる場合があります。
メモリ消費を削減するには、[Kotlinデーモンのヒープサイズを増やしてください](gradle-compilation-and-caches.md#setting-kotlin-daemon-s-jvm-arguments)。

Kotlin Gradleプラグインで[現在サポートされているコンパイラオプション](gradle-compiler-options.md)について詳しく学ぶことができます。