[//]: # (title: Kotlin 1.6.20 の新機能)

_[リリース日: 2022年4月4日](releases.md#release-details)_

Kotlin 1.6.20 では、将来の言語機能のプレビューが公開され、マルチプラットフォームプロジェクトの階層構造がデフォルトとなり、その他のコンポーネントにも進化的な改善がもたらされます。

変更点の概要をまとめた短い動画もご覧いただけます。

<video src="https://www.youtube.com/v/8F19ds109-o" title="What's new in Kotlin 1.6.20"/>

## 言語

Kotlin 1.6.20 では、2つの新しい言語機能を試すことができます。

* [Kotlin/JVM のコンテキストレシーバのプロトタイプ](#prototype-of-context-receivers-for-kotlin-jvm)
* [Definitely non-nullable types](#definitely-non-nullable-types)

### Kotlin/JVM のコンテキストレシーバのプロトタイプ

> この機能はKotlin/JVMのみで利用可能なプロトタイプです。`-Xcontext-receivers`を有効にすると、
> コンパイラはプレリリースバイナリを生成し、これらは製品コードでは使用できません。
> コンテキストレシーバは個人プロジェクトでのみ使用してください。
> フィードバックは[YouTrack](https://youtrack.jetbrains.com/issues/KT)でお待ちしております。
>
{style="warning"}

Kotlin 1.6.20 では、レシーバを1つに限定する必要がなくなりました。より多くのレシーバが必要な場合は、関数、プロパティ、クラスの宣言にコンテキストレシーバを追加することで、それらをコンテキスト依存 (または _コンテキスト的_) にすることができます。コンテキスト宣言では、以下の処理が行われます。

* 宣言されたすべてのコンテキストレシーバが、呼び出し元のスコープに暗黙のレシーバとして存在する必要があります。
* 宣言されたコンテキストレシーバを、自身の本体スコープに暗黙のレシーバとして取り込みます。

```kotlin
interface LoggingContext {
    val log: Logger // This context provides a reference to a logger 
}

context(LoggingContext)
fun startBusinessOperation() {
    // You can access the log property since LoggingContext is an implicit receiver
    log.info("Operation has started")
}

fun test(loggingContext: LoggingContext) {
    with(loggingContext) {
        // You need to have LoggingContext in a scope as an implicit receiver
        // to call startBusinessOperation()
        startBusinessOperation()
    }
}
```

プロジェクトでコンテキストレシーバを有効にするには、`-Xcontext-receivers`コンパイラオプションを使用します。
この機能とその構文の詳細な説明は、[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/context-receivers.md#detailed-design)で確認できます。

この実装はプロトタイプであることに注意してください。

* `-Xcontext-receivers`を有効にすると、コンパイラは製品コードでは使用できないプレリリースバイナリを生成します。
* コンテキストレシーバのIDEサポートは現状最小限です。

この機能を個人プロジェクトで試して、[このYouTrack課題](https://youtrack.jetbrains.com/issue/KT-42435)で感想や体験を共有してください。
問題が発生した場合は、[新しい課題を提出](https://kotl.in/issue)してください。

### Definitely non-nullable types

> Definitely non-nullable typesは[ベータ版](components-stability.md)です。ほぼ安定していますが、
> 将来的に移行手順が必要になる場合があります。
> 変更を最小限に抑えるよう最善を尽くします。
>
{style="warning"}

ジェネリックJavaクラスやインターフェースを拡張する際により良い相互運用性を提供するために、Kotlin 1.6.20では、新しい構文`T & Any`を使用することで、利用箇所でジェネリック型パラメータを「Definitely non-nullable」としてマークできるようになりました。
この構文形式は[Intersection types](https://en.wikipedia.org/wiki/Intersection_type)の表記法に由来しており、現在は`&`の左側にnullableな上限を持つ型パラメータ、右側にnon-nullableな`Any`を持つ型パラメータに限定されています。

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

Definitely non-nullable typesの詳細については、[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types.md)を参照してください。

## Kotlin/JVM

Kotlin 1.6.20 で導入される機能:

* JVMインターフェースにおけるデフォルトメソッドの互換性改善: [インターフェースのための新しい`@JvmDefaultWithCompatibility`アノテーション](#new-jvmdefaultwithcompatibility-annotation-for-interfaces)と[`-Xjvm-default`モードにおける互換性の変更](#compatibility-changes-in-the-xjvm-default-modes)
* [JVMバックエンドにおける単一モジュールの並列コンパイルのサポート](#support-for-parallel-compilation-of-a-single-module-in-the-jvm-backend)
* [関数型インターフェースのコンストラクタへの呼び出し可能な参照のサポート](#support-for-callable-references-to-functional-interface-constructors)

### インターフェースのための新しい @JvmDefaultWithCompatibility アノテーション

Kotlin 1.6.20 では、新しいアノテーション[`@JvmDefaultWithCompatibility`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-default-with-compatibility/)が導入されます。このアノテーションを`-Xjvm-default=all`コンパイラオプションと組み合わせて使用すると、任意のKotlinインターフェース内の非抽象メンバに対して[JVMインターフェースのデフォルトメソッドが作成されます](java-to-kotlin-interop.md#default-methods-in-interfaces)。

もしあなたのKotlinインターフェースを`-Xjvm-default=all`オプションなしでコンパイルされたクライアントが使用している場合、このオプションでコンパイルされたコードとバイナリ互換性がない可能性があります。
Kotlin 1.6.20 より前では、この互換性の問題を回避するために、[推奨されるアプローチ](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/#JvmDefaultWithoutCompatibility)は`-Xjvm-default=all-compatibility`モードを使用し、この種の互換性を必要としないインターフェースには`@JvmDefaultWithoutCompatibility`アノテーションも使用することでした。

このアプローチにはいくつかの欠点がありました。

* 新しいインターフェースが追加されたときにアノテーションを追加し忘れる可能性がありました。
* 通常、公開API以外の部分にはより多くのインターフェースがあるため、コードの多くの場所にこのアノテーションが存在することになります。

現在、`-Xjvm-default=all`モードを使用し、インターフェースに`@JvmDefaultWithCompatibility`アノテーションを付けることができます。
これにより、公開APIのすべてのインターフェースに一度だけこのアノテーションを追加でき、新しい非公開コードにはアノテーションを使用する必要がなくなります。

この新しいアノテーションに関するフィードバックは、[このYouTrackチケット](https://youtrack.jetbrains.com/issue/KT-48217)にご記入ください。

### -Xjvm-default モードにおける互換性の変更

Kotlin 1.6.20 では、デフォルトモード (`-Xjvm-default=disable` コンパイラオプション) のモジュールを、`-Xjvm-default=all` または `-Xjvm-default=all-compatibility` モードでコンパイルされたモジュールに対してコンパイルするオプションが追加されました。
従来通り、すべてのモジュールが`-Xjvm-default=all`または`-Xjvm-default=all-compatibility`モードである場合もコンパイルは成功します。
フィードバックは[このYouTrack課題](https://youtrack.jetbrains.com/issue/KT-47000)にご記入いただけます。

Kotlin 1.6.20 では、コンパイラオプション`-Xjvm-default`の`compatibility`モードと`enable`モードが非推奨になりました。
他のモードの説明にも互換性に関する変更がありますが、全体的なロジックは同じです。
[更新された説明](java-to-kotlin-interop.md#compatibility-modes-for-default-methods)を確認できます。

Javaとの相互運用におけるデフォルトメソッドの詳細については、[相互運用ドキュメント](java-to-kotlin-interop.md#default-methods-in-interfaces)と
[このブログ記事](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)を参照してください。

### JVMバックエンドにおける単一モジュールの並列コンパイルのサポート

> JVMバックエンドにおける単一モジュールの並列コンパイルのサポートは[実験的](components-stability.md)です。
> いつでも削除または変更される可能性があります。オプトインが必要です（詳細は下記参照）。評価目的でのみ使用してください。
> フィードバックは[YouTrack](https://youtrack.jetbrains.com/issue/KT-46085)でお待ちしております。
>
{style="warning"}

[新しいJVM IRバックエンドのコンパイル時間を改善する](https://youtrack.jetbrains.com/issue/KT-46768)ための作業を継続しています。
Kotlin 1.6.20 では、モジュール内のすべてのファイルを並列でコンパイルする実験的なJVM IRバックエンドモードを追加しました。
並列コンパイルにより、全体のコンパイル時間を最大15%短縮できます。

実験的な並列バックエンドモードを有効にするには、[コンパイラオプション](compiler-reference.md#compiler-options)`-Xbackend-threads`を使用します。
このオプションには以下の引数を指定します。

* `N`は使用したいスレッド数です。CPUコア数よりも大きくしてはいけません。そうしないと、スレッド間のコンテキスト切り替えにより並列化が効果を発揮しなくなります。
* `0`は各CPUコアに独立したスレッドを使用します。

[Gradle](gradle.md)はタスクを並列で実行できますが、プロジェクト（またはプロジェクトの主要部分）がGradleの観点から見て一つの大きなタスクである場合、この種の並列化はあまり役に立ちません。
非常に大きなモノリシックモジュールがある場合は、並列コンパイルを使用してより速くコンパイルしてください。
プロジェクトが多数の小さなモジュールで構成されており、Gradleによってビルドが並列化されている場合、コンテキスト切り替えのために別の並列化レイヤーを追加すると、パフォーマンスが低下する可能性があります。

> 並列コンパイルにはいくつかの制約があります。
> * [kapt](kapt.md)はIRバックエンドを無効にするため、kaptとは動作しません。
> * 設計上、より多くのJVMヒープが必要です。ヒープ量はスレッド数に比例します。
>
{style="note"}

### 関数型インターフェースのコンストラクタへの呼び出し可能な参照のサポート

> 関数型インターフェースのコンストラクタへの呼び出し可能な参照のサポートは[実験的](components-stability.md)です。
> いつでも削除または変更される可能性があります。オプトインが必要です（詳細は下記参照）。評価目的でのみ使用してください。
> フィードバックは[YouTrack](https://youtrack.jetbrains.com/issue/KT-47939)でお待ちしております。
>
{style="warning"}

関数型インターフェースのコンストラクタへの[呼び出し可能な参照](reflection.md#callable-references)のサポートにより、コンストラクタ関数を持つインターフェースから[関数型インターフェース](fun-interfaces.md)への移行を、ソース互換性のある方法で実現できます。

次のコードを検討してください。

```kotlin
interface Printer {
    fun print()
}

fun Printer(block: () -> Unit): Printer = object : Printer { override fun print() = block() }
```

関数型インターフェースのコンストラクタへの呼び出し可能な参照が有効になっている場合、このコードは単に関数型インターフェースの宣言に置き換えることができます。

```kotlin
fun interface Printer {
    fun print()
}
```

そのコンストラクタは暗黙的に作成され、`::Printer`関数参照を使用するすべてのコードはコンパイルされます。例：

```kotlin
documentsStorage.addPrinter(::Printer)
```
{validate="false"}

バイナリ互換性を維持するには、従来の関数`Printer`を[`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/)アノテーションと`DeprecationLevel.HIDDEN`でマークします。

```kotlin
@Deprecated(message = "Your message about the deprecation", level = DeprecationLevel.HIDDEN)
fun Printer(...) {...}
```
{validate="false"}

この機能を有効にするには、コンパイラオプション`-XXLanguage:+KotlinFunInterfaceConstructorReference`を使用します。

## Kotlin/Native

Kotlin/Native 1.6.20 は、新しいコンポーネントの開発が継続していることを示しています。Kotlin を他のプラットフォームで一貫したエクスペリエンスで利用できるように、さらに一歩踏み出しました。

* [新しいメモリマネージャーのアップデート](#an-update-on-the-new-memory-manager)
* [新しいメモリマネージャーにおけるスイープフェーズの並行実装](#concurrent-implementation-for-the-sweep-phase-in-new-memory-manager)
* [アノテーションクラスのインスタンス化](#instantiation-of-annotation-classes)
* [Swift async/await との相互運用: KotlinUnit の代わりに Swift の Void を返す](#interop-with-swift-async-await-returning-void-instead-of-kotlinunit)
* [libbacktrace によるより良いスタックトレース](#better-stack-traces-with-libbacktrace)
* [スタンドアロンAndroid実行可能ファイルのサポート](#support-for-standalone-android-executables)
* [パフォーマンスの改善](#performance-improvements)
* [cinteropモジュールのインポート時のエラー処理の改善](#improved-error-handling-during-cinterop-modules-import)
* [Xcode 13 ライブラリのサポート](#support-for-xcode-13-libraries)

### 新しいメモリマネージャーのアップデート

> 新しいKotlin/Nativeメモリマネージャーは[アルファ版](components-stability.md)です。
> 将来的に互換性のない変更があり、手動での移行が必要になる場合があります。
> フィードバックは[YouTrack](https://youtrack.jetbrains.com/issue/KT-48525)でお待ちしております。
>
{style="note"}

Kotlin 1.6.20では、新しいKotlin/Nativeメモリマネージャーのアルファ版を試すことができます。
これにより、JVMとNativeプラットフォーム間の差異が解消され、マルチプラットフォームプロジェクトで一貫した開発者体験が提供されます。
たとえば、AndroidとiOSの両方で動作する新しいクロスプラットフォームモバイルアプリケーションをはるかに簡単に作成できるようになります。

新しいKotlin/Nativeメモリマネージャーは、スレッド間のオブジェクト共有の制限を解除します。
また、安全で特別な管理やアノテーションを必要としない、リークフリーな並行プログラミングプリミティブも提供します。

新しいメモリマネージャーは将来のバージョンでデフォルトになる予定ですので、今すぐ試すことをお勧めします。
新しいメモリマネージャーの詳細とデモプロジェクトについては、[ブログ記事](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/)を確認するか、すぐに[移行手順](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/NEW_MM.md)にジャンプして自分で試してください。

プロジェクトで新しいメモリマネージャーを使用して、その動作を確認し、[YouTrack](https://youtrack.jetbrains.com/issue/KT-48525)の課題トラッカーでフィードバックを共有してください。

### 新しいメモリマネージャーにおけるスイープフェーズの並行実装

[Kotlin 1.6 で発表された](whatsnew16.md#preview-of-the-new-memory-manager)新しいメモリマネージャーにすでに切り替えている場合、実行時間の大幅な改善に気づくかもしれません。当社のベンチマークでは平均で35%の改善が示されています。
1.6.20 からは、新しいメモリマネージャーでスイープフェーズの並行実装も利用できるようになりました。
これにより、パフォーマンスがさらに向上し、ガベージコレクタの一時停止時間が短縮されるはずです。

新しい Kotlin/Native メモリマネージャーでこの機能を有効にするには、以下のコンパイラオプションを渡します。

```bash
-Xgc=cms 
```

新しいメモリマネージャーのパフォーマンスに関するフィードバックは、[このYouTrack課題](https://youtrack.jetbrains.com/issue/KT-48526)にぜひお寄せください。

### アノテーションクラスのインスタンス化

Kotlin 1.6.0 では、アノテーションクラスのインスタンス化が Kotlin/JVM および Kotlin/JS で[安定版](components-stability.md)になりました。
1.6.20 バージョンでは、Kotlin/Native のサポートが提供されます。

[アノテーションクラスのインスタンス化](annotations.md#instantiation)について詳しくはこちらをご覧ください。

### Swift async/await との相互運用: KotlinUnit の代わりに Swift の Void を返す

> Swift async/await との並行処理の相互運用性は[実験的](components-stability.md)です。いつでも削除または変更される可能性があります。
> 評価目的でのみ使用してください。フィードバックは[YouTrack](https://youtrack.jetbrains.com/issue/KT-47610)でお待ちしております。
>
{style="warning"}

[Swift 5.5 以降で利用可能な Swift の async/await との実験的な相互運用](whatsnew1530.md#experimental-interoperability-with-swift-5-5-async-await)に関する作業を継続してきました。
Kotlin 1.6.20 は、`Unit`戻り型を持つ`suspend`関数の動作方法において、以前のバージョンとは異なります。

以前は、そのような関数はSwiftで`KotlinUnit`を返す`async`関数として表現されていました。しかし、それらの適切な戻り型は、非中断関数と同様に`Void`です。

既存のコードを壊さないように、コンパイラが`Unit`を返す`suspend`関数を`async` Swiftに変換するGradleプロパティを導入します。

```none
# gradle.properties
kotlin.native.binary.unitSuspendFunctionObjCExport=proper
```

今後のKotlinリリースでは、この動作をデフォルトにする予定です。

### libbacktrace によるより良いスタックトレース

> ソース位置解決にlibbacktraceを使用することは[実験的](components-stability.md)です。いつでも削除または変更される可能性があります。
> 評価目的でのみ使用してください。フィードバックは[YouTrack](https://youtrack.jetbrains.com/issue/KT-48424)でお待ちしております。
>
{style="warning"}

Kotlin/Native は現在、`linux*` (ただし`linuxMips32`と`linuxMipsel32`を除く) および`androidNative*`ターゲットのデバッグを改善するために、ファイルの位置と行番号を含む詳細なスタックトレースを生成できるようになりました。

この機能は、内部で[libbacktrace](https://github.com/ianlancetaylor/libbacktrace)ライブラリを使用しています。
次のコードで違いの例を確認してください。

```kotlin
fun main() = bar()
fun bar() = baz()
inline fun baz() {
    error("")
}
```

* **1.6.20 より前:**

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

* **1.6.20 と libbacktrace:**

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

Apple ターゲットでは、すでにスタックトレースにファイル位置と行番号が含まれていましたが、libbacktrace はインライン関数呼び出しについてより詳細な情報を提供します。

* **1.6.20 より前:**

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

* **1.6.20 と libbacktrace:**

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

libbacktrace を使用してより良いスタックトレースを生成するには、`gradle.properties`に次の行を追加します。

```none
# gradle.properties
kotlin.native.binary.sourceInfoType=libbacktrace
```

libbacktrace を使用した Kotlin/Native のデバッグがどのように機能するか、[このYouTrack課題](https://youtrack.jetbrains.com/issue/KT-48424)でぜひフィードバックをお寄せください。

### スタンドアロンAndroid実行可能ファイルのサポート

これまで、Kotlin/NativeのAndroid Native実行可能ファイルは、実際には実行可能ファイルではなく、NativeActivityとして使用できる共有ライブラリでした。現在は、Android Nativeターゲット用の標準実行可能ファイルを生成するオプションがあります。

これを行うには、プロジェクトの`build.gradle(.kts)`部分で、`androidNative`ターゲットの実行可能ブロックを設定します。
以下のバイナリオプションを追加してください。

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

この機能はKotlin 1.7.0でデフォルトになる予定です。
現在の動作を維持したい場合は、以下の設定を使用してください。

```kotlin
binaryOptions["androidProgramType"] = "nativeActivity"
```

Mattia Iavarone氏の実装に感謝いたします！

### パフォーマンスの改善

Kotlin/Nativeでは、[コンパイルプロセスの高速化](https://youtrack.jetbrains.com/issue/KT-42294)と開発体験の向上に力を入れています。

Kotlin 1.6.20 では、Kotlin が生成する LLVM IR に影響するいくつかのパフォーマンス更新とバグ修正が含まれています。
内部プロジェクトでのベンチマークによると、平均して以下のパフォーマンス向上が達成されました。

* 実行時間 15%削減
* リリースおよびデバッグバイナリのコードサイズ 20%削減
* リリースバイナリのコンパイル時間 26%削減

これらの変更により、大規模な内部プロジェクトでのデバッグバイナリのコンパイル時間も10%削減されました。

これを達成するために、コンパイラによって生成される一部の合成オブジェクトに対する静的初期化を実装し、すべての関数に対するLLVM IRの構造化方法を改善し、コンパイラキャッシュを最適化しました。

### cinteropモジュールのインポート時のエラー処理の改善

このリリースでは、`cinterop`ツールを使用してObjective-Cモジュールをインポートする際（CocoaPodsのpodで典型的なケース）のエラー処理が改善されました。
これまで、Objective-Cモジュールを扱おうとした際（例えば、ヘッダーのコンパイルエラーなど）にエラーが発生すると、`fatal error: could not build module $name`のような、情報が不足したエラーメッセージが表示されていました。
今回、`cinterop`ツールのこの部分が拡張され、より詳細な説明を含むエラーメッセージが表示されるようになりました。

### Xcode 13 ライブラリのサポート

Xcode 13 と共に提供されるライブラリは、このリリースから完全にサポートされます。
Kotlin コードのどこからでも自由にアクセスできます。

## Kotlin Multiplatform

1.6.20では、Kotlin Multiplatformに対する以下の注目すべきアップデートが行われました。

* [すべての新しいマルチプラットフォームプロジェクトで階層構造のサポートがデフォルトに](#hierarchical-structure-support-for-multiplatform-projects)
* [Kotlin CocoaPods GradleプラグインがCocoaPods統合のためのいくつかの便利な機能を受け取りました](#kotlin-cocoapods-gradle-plugin)

### マルチプラットフォームプロジェクトにおける階層構造のサポート

Kotlin 1.6.20 では、階層構造のサポートがデフォルトで有効になっています。
[Kotlin 1.4.0 で導入されて以来](whatsnew14.md#sharing-code-in-several-targets-with-the-hierarchical-project-structure)、フロントエンドが大幅に改善され、IDE のインポートが安定しました。

以前は、マルチプラットフォームプロジェクトにコードを追加する方法が2つありました。1つ目は、プラットフォーム固有のソースセットに挿入する方法で、これは1つのターゲットに限定され、他のプラットフォームで再利用できませんでした。
2つ目は、Kotlinが現在サポートしているすべてのプラットフォームで共有される共通ソースセットを使用する方法です。

これで、共通ロジックやサードパーティAPIを多く再利用する、いくつかの類似するネイティブターゲット間で[ソースコードを共有](#better-code-sharing-in-your-project)できるようになりました。
このテクノロジーは、正しいデフォルトの依存関係を提供し、共有コードで利用可能な正確なAPIを見つけます。
これにより、複雑なビルド設定や、ネイティブターゲット間でソースセットを共有するためのIDEサポートを得るための回避策が不要になります。
また、異なるターゲット向けに意図された安全でないAPIの使用を防ぐのにも役立ちます。

このテクノロジーは、階層型プロジェクト構造により、ライブラリの作者がターゲットのサブセットに対して共通APIを持つライブラリを公開・利用できるようになるため、[ライブラリの作者](#more-opportunities-for-library-authors)にとっても役立ちます。

デフォルトでは、階層型プロジェクト構造で公開されたライブラリは、階層型構造のプロジェクトとのみ互換性があります。

#### プロジェクト内でのコード共有の改善

階層構造のサポートがなければ、[Kotlinターゲット](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html#targets)の_すべてではなく一部_でコードを共有する直接的な方法はありません。
一般的な例の1つは、すべてのiOSターゲット間でコードを共有し、FoundationのようなiOS固有の[依存関係](https://kotlinlang.org/docs/multiplatform/multiplatform-share-on-platforms.html#connect-platform-specific-libraries)にアクセスすることです。

階層型プロジェクト構造のサポートのおかげで、この機能をすぐに利用できるようになりました。
新しい構造では、ソースセットが階層を形成します。
与えられたソースセットがコンパイルされる各ターゲットで利用可能なプラットフォーム固有の言語機能と依存関係を使用できます。

たとえば、iOS デバイスとシミュレーター用の `iosArm64` と `iosX64` という 2 つのターゲットを持つ典型的なマルチプラットフォームプロジェクトを考えてみましょう。
Kotlin ツールは、両方のターゲットが同じ関数を持っていることを理解し、中間ソースセット `iosMain` からその関数にアクセスすることを許可します。

![iOS hierarchy example](ios-hierarchy-example.jpg){width=700}

Kotlin ツールチェーンは、Kotlin/Native stdlib やネイティブライブラリなどの適切なデフォルトの依存関係を提供します。
さらに、Kotlin ツールは、共有コードで利用可能な正確なAPIサーフェスを見つけるために最善を尽くします。
これにより、たとえばmacOS固有の関数をWindows向けに共有されたコードで使用するなどのケースを防ぐことができます。

#### ライブラリ作者にとってのより多くの機会

マルチプラットフォームライブラリが公開されると、その中間ソースセットのAPIが適切に公開され、利用者が利用できるようになります。
ここでも、Kotlinツールチェーンは、JVM向けに意図されたAPIをJSコードで使用するなどの安全でない使用法に注意深く目を光らせながら、利用側のソースセットで利用可能なAPIを自動的に特定します。
[ライブラリでのコード共有](https://kotlinlang.org/docs/multiplatform/multiplatform-share-on-platforms.html#share-code-in-libraries)について詳しくはこちらをご覧ください。

#### 設定とセットアップ

Kotlin 1.6.20 から、すべての新しいマルチプラットフォームプロジェクトで階層型プロジェクト構造が適用されます。追加の設定は不要です。

* すでに[手動でオンにしている場合](https://kotlinlang.org/docs/multiplatform/multiplatform-share-on-platforms.html#share-code-on-similar-platforms)は、`gradle.properties`から非推奨のオプションを削除できます。

  ```none
  # gradle.properties
  kotlin.mpp.enableGranularSourceSetsMetadata=true
  kotlin.native.enableDependencyPropagation=false // or 'true', depending on your previous setup
  ```

* Kotlin 1.6.20 の場合、最高の体験を得るために[Android Studio 2021.1.1](https://developer.android.com/studio) (Bumblebee) 以降を使用することをお勧めします。

* オプトアウトすることも可能です。階層構造のサポートを無効にするには、`gradle.properties`で以下のオプションを設定します。

  ```none
  # gradle.properties
  kotlin.mpp.hierarchicalStructureSupport=false
  ```

#### フィードバックをお寄せください

これはエコシステム全体にとって重要な変更です。より良いものにするために、皆様からのフィードバックをお待ちしております。

今すぐ試してみて、遭遇した問題があれば[課題トラッカー](https://kotl.in/issue)に報告してください。

### Kotlin CocoaPods Gradle プラグイン

CocoaPods統合を簡素化するために、Kotlin 1.6.20 では以下の機能が提供されます。

* CocoaPods プラグインには、登録されているすべてのターゲットで XCFramework をビルドし、Podspec ファイルを生成するタスクが追加されました。これは、Xcode と直接統合したくないが、成果物をビルドしてローカルの CocoaPods リポジトリにデプロイしたい場合に役立ちます。
  
  [XCFramework のビルド](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html#build-xcframeworks)について詳しくはこちらをご覧ください。

* プロジェクトで[CocoaPods統合](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html)を使用している場合、Gradleプロジェクト全体に必要なPodバージョンを指定するのが一般的でした。これで、さらに選択肢が増えました。
  * `cocoapods`ブロックでPodバージョンを直接指定する
  * 引き続きGradleプロジェクトバージョンを使用する
  
  これらのプロパティのいずれも設定されていない場合、エラーが発生します。

* `cocoapods`ブロックでCocoaPod名を構成できるようになり、Gradleプロジェクト全体の名前を変更する必要がなくなりました。

* CocoaPodsプラグインに新しい`extraSpecAttributes`プロパティが導入されました。これにより、以前はハードコードされていた`libraries`や`vendored_frameworks`などのPodspecファイルのプロパティを構成できます。

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

Kotlin CocoaPods Gradleプラグインの完全な[DSLリファレンス](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-dsl-reference.html)。

## Kotlin/JS

Kotlin/JS の 1.6.20 における改善点は、主に IR コンパイラに影響を与えます。

* [開発用バイナリのインクリメンタルコンパイル (IR)](#incremental-compilation-for-development-binaries-with-ir-compiler)
* [トップレベルプロパティの遅延初期化がデフォルトに (IR)](#lazy-initialization-of-top-level-properties-by-default-with-ir-compiler)
* [プロジェクトモジュールのJSファイルがデフォルトで分離される (IR)](#separate-js-files-for-project-modules-by-default-with-ir-compiler)
* [Char クラスの最適化 (IR)](#char-class-optimization)
* [エクスポートの改善 (IR とレガシーバックエンドの両方)](#improvements-to-export-and-typescript-declaration-generation)
* [非同期テストに対する`@AfterTest` の保証](#aftertest-guarantees-for-asynchronous-tests)

### IR コンパイラによる開発用バイナリのインクリメンタルコンパイル

IR コンパイラを使用した Kotlin/JS 開発をより効率的にするために、新しい _インクリメンタルコンパイル_ モードを導入します。

このモードで`compileDevelopmentExecutableKotlinJs` Gradle タスクを使用して**開発用バイナリ**をビルドすると、コンパイラは以前のコンパイル結果をモジュールレベルでキャッシュします。
これにより、変更されていないソースファイルに対してキャッシュされたコンパイル結果が後続のコンパイル中に使用されるため、特に小さな変更の場合に、コンパイルがより迅速に完了します。
この改善は開発プロセス (編集-ビルド-デバッグサイクルの短縮) のみを対象としており、製品アーティファクトのビルドには影響しないことに注意してください。

開発用バイナリのインクリメンタルコンパイルを有効にするには、プロジェクトの`gradle.properties`に次の行を追加します。

```none
# gradle.properties
kotlin.incremental.js.ir=true // false by default
```

当社のテストプロジェクトでは、新しいモードによりインクリメンタルコンパイルが最大30%高速化されました。ただし、このモードでのクリーンビルドは、キャッシュを作成および設定する必要があるため、遅くなりました。

Kotlin/JS プロジェクトでインクリメンタルコンパイルを使用することについてのご意見は、[この YouTrack 課題](https://youtrack.jetbrains.com/issue/KT-50203)までお寄せください。

### IR コンパイラでトップレベルプロパティの遅延初期化がデフォルトに

Kotlin 1.4.30 では、JS IR コンパイラで[トップレベルプロパティの遅延初期化](whatsnew1430.md#lazy-initialization-of-top-level-properties)のプロトタイプを提示しました。
アプリケーション起動時にすべてのプロパティを初期化する必要をなくすことで、遅延初期化は起動時間を短縮します。
当社の測定では、実際のKotlin/JSアプリケーションで約10%の高速化が示されました。

今回、このメカニズムを洗練させ、適切にテストした結果、IR コンパイラにおいてトップレベルプロパティの遅延初期化をデフォルトにすることにしました。

```kotlin
// lazy initialization
val a = run {
    val result = // intensive computations
        println(result)
    result
} // run is executed upon the first usage of the variable
```

何らかの理由でプロパティを eager (アプリケーション起動時) に初期化する必要がある場合は、[`@EagerInitialization`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-eager-initialization/)アノテーションでマークしてください。

### IR コンパイラでプロジェクトモジュールのJSファイルがデフォルトで分離される

以前は、JS IR コンパイラはプロジェクトモジュールごとに[個別の`.js`ファイルを生成する機能](https://youtrack.jetbrains.com/issue/KT-44319)を提供していました。
これは、プロジェクト全体に対して1つの`.js`ファイルを出力するというデフォルトオプションの代替手段でした。
プロジェクト内の関数を使用するたびに、JSファイル全体を依存関係として含める必要があるため、このファイルは大きすぎて不便な場合があります。
複数のファイルにすることで、柔軟性が増し、そのような依存関係のサイズが減少します。この機能は`-Xir-per-module`コンパイラオプションで利用可能でした。

1.6.20 から、JS IR コンパイラはプロジェクトモジュールごとに個別の`.js`ファイルをデフォルトで生成します。

プロジェクトを単一の`.js`ファイルにコンパイルする機能は、以下のGradleプロパティで利用できます。

```none
# gradle.properties
kotlin.js.ir.output.granularity=whole-program // `per-module` is the default
```

以前のリリースでは、実験的なモジュールごとのモード（`-Xir-per-module=true`フラグで利用可能）では、各モジュールで`main()`関数が呼び出されました。これは通常の単一`.js`モードとは整合性がありません。1.6.20以降、どちらの場合でも`main()`関数はメインモジュールでのみ呼び出されます。モジュールがロードされたときに何らかのコードを実行する必要がある場合は、`@EagerInitialization`アノテーションが付けられたトップレベルプロパティを使用できます。[IRコンパイラでトップレベルプロパティの遅延初期化がデフォルトに](#lazy-initialization-of-top-level-properties-by-default-with-ir-compiler)を参照してください。

### Char クラスの最適化

`Char`クラスは、Kotlin/JSコンパイラによって（[インラインクラス](inline-classes.md)と同様に）ボクシングを導入せずに処理されるようになりました。
これにより、Kotlin/JSコードにおける文字操作が高速化されます。

パフォーマンスの向上に加えて、これにより`Char`がJavaScriptにエクスポートされる方法が変更され、`Number`に変換されるようになりました。

### エクスポートとTypeScript宣言生成の改善

Kotlin 1.6.20 では、エクスポートメカニズム ([`@JsExport`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-export/)アノテーション) に関する複数の修正と改善がもたらされており、これには[TypeScript 宣言 (`.d.ts`) の生成](js-project-setup.md#generation-of-typescript-declaration-files-d-ts)も含まれます。
インターフェースとEnumをエクスポートする機能が追加され、以前報告された一部の特殊なケースでのエクスポート動作が修正されました。
詳細については、[YouTrack のエクスポート改善リスト](https://youtrack.jetbrains.com/issues?q=Project:%20Kotlin%20issue%20id:%20KT-45434,%20KT-44494,%20KT-37916,%20KT-43191,%20KT-46961,%20KT-40236)を参照してください。

[JavaScript から Kotlin コードを使用する](js-to-kotlin-interop.md)方法について詳しくはこちらをご覧ください。

### 非同期テストに対する`@AfterTest` の保証

Kotlin 1.6.20 では、Kotlin/JS 上での非同期テストにおいて[`@AfterTest`](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/-after-test/)関数が適切に動作するようになりました。
テスト関数の戻り型が静的に[`Promise`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-promise/)として解決される場合、コンパイラは`@AfterTest`関数の実行を対応する[`then()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-promise/then.html)コールバックにスケジュールするようになりました。

## セキュリティ

Kotlin 1.6.20 では、コードのセキュリティを向上させるためのいくつかの機能が導入されます。

* [klib における相対パスの使用](#using-relative-paths-in-klibs)
* [Kotlin/JS Gradle プロジェクトの yarn.lock の永続化](#persisting-yarn-lock-for-kotlin-js-gradle-projects)
* [npm 依存関係の `--ignore-scripts` によるデフォルトインストール](#installation-of-npm-dependencies-with-ignore-scripts-by-default)

### klib における相対パスの使用

`klib`形式のライブラリには、適切なデバッグ情報を生成するためのソースファイルのパスを含む、シリアライズされたIR表現が含まれています。
Kotlin 1.6.20 より前では、保存されるファイルパスは絶対パスでした。ライブラリの作者が絶対パスを共有したくない場合があるため、1.6.20 バージョンでは代替オプションが提供されます。

`klib`を公開し、アーティファクトでソースファイルの相対パスのみを使用したい場合は、`-Xklib-relative-path-base`コンパイラオプションを1つ以上のソースファイルのベースパスと共に渡すことができます。

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

### Kotlin/JS Gradle プロジェクトの yarn.lock の永続化

> この機能は Kotlin 1.6.10 にバックポートされました。
>
{style="note"}

Kotlin/JS Gradle プラグインは、`yarn.lock` ファイルを永続化する機能を提供するようになりました。これにより、追加の Gradle 設定なしでプロジェクトの npm 依存関係のバージョンをロックすることができます。
この機能は、プロジェクトのルートに自動生成された `kotlin-js-store` ディレクトリを追加することで、デフォルトのプロジェクト構造に変更をもたらします。
このディレクトリ内に `yarn.lock` ファイルが保持されます。

`kotlin-js-store` ディレクトリとその内容をバージョン管理システムにコミットすることを強くお勧めします。
ロックファイルをバージョン管理システムにコミットすることは[推奨されるプラクティス](https://classic.yarnpkg.com/blog/2016/11/24/lockfiles-for-all/)です。これは、開発環境やCI/CDサービスなどのすべてのマシンで、アプリケーションがまったく同じ依存関係ツリーでビルドされることを保証するためです。
ロックファイルは、プロジェクトが新しいマシンでチェックアウトされたときに npm 依存関係がサイレントに更新されるのを防ぐことにもなり、これはセキュリティ上の懸念事項です。

[Dependabot](https://github.com/dependabot) のようなツールも、Kotlin/JS プロジェクトの `yarn.lock` ファイルを解析し、依存している npm パッケージが侵害された場合に警告を提供できます。

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

### npm 依存関係の `--ignore-scripts` によるデフォルトインストール

> この機能は Kotlin 1.6.10 にバックポートされました。
>
{style="note"}

Kotlin/JS Gradle プラグインは、デフォルトで npm 依存関係のインストール中に[ライフサイクルスクリプト](https://docs.npmjs.com/cli/v8/using-npm/scripts#life-cycle-scripts)の実行を防止するようになりました。
この変更は、侵害された npm パッケージからの悪意のあるコードの実行の可能性を減らすことを目的としています。

以前の設定に戻すには、`build.gradle(.kts)`に以下の行を追加してライフサイクルスクリプトの実行を明示的に有効にすることができます。

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

[Kotlin/JS Gradle プロジェクトの npm 依存関係](js-project-setup.md#npm-dependencies)について詳しくはこちらをご覧ください。

## Gradle

Kotlin 1.6.20 では、Kotlin Gradle プラグインに以下の変更が加えられました。

* Kotlin コンパイラの実行戦略を定義する新しい[プロパティ`kotlin.compiler.execution.strategy`および`compilerExecutionStrategy`](#properties-for-defining-kotlin-compiler-execution-strategy)
* [`kapt.use.worker.api`、`kotlin.experimental.coroutines`、および`kotlin.coroutines`ビルドオプションの非推奨化](#deprecation-of-build-options-for-kapt-and-coroutines)
* [`kotlin.parallel.tasks.in.project`ビルドオプションの削除](#removal-of-the-kotlin-parallel-tasks-in-project-build-option)

### Kotlin コンパイラの実行戦略を定義するためのプロパティ

Kotlin 1.6.20 より前では、Kotlin コンパイラの実行戦略を定義するためにシステムプロパティ`-Dkotlin.compiler.execution.strategy`を使用していました。
このプロパティは場合によっては不便なことがありました。
Kotlin 1.6.20 では、同じ名前のGradleプロパティ`kotlin.compiler.execution.strategy`とコンパイルタスクプロパティ`compilerExecutionStrategy`が導入されました。

システムプロパティは引き続き動作しますが、将来のリリースで削除される予定です。

現在のプロパティの優先順位は次のとおりです。

* タスクプロパティ`compilerExecutionStrategy`は、システムプロパティおよびGradleプロパティ`kotlin.compiler.execution.strategy`よりも優先されます。
* Gradleプロパティはシステムプロパティよりも優先されます。

これらのプロパティに割り当てることができるコンパイラ実行戦略は3つあります。

| 戦略 | Kotlin コンパイラが実行される場所 | インクリメンタルコンパイル | その他の特性 |
|---|---|---|---|
| Daemon | 独自のデーモンプロセス内 | はい | *デフォルト戦略*。異なるGradleデーモン間で共有可能 |
| In process | Gradle デーモンプロセス内 | いいえ | Gradle デーモンとヒープを共有する可能性あり |
| Out of process | 各呼び出しで別プロセス | いいえ | — |

したがって、`kotlin.compiler.execution.strategy`プロパティ（システムとGradleの両方）で利用可能な値は次のとおりです。
1. `daemon`（デフォルト）
2. `in-process`
3. `out-of-process`

`gradle.properties`でGradleプロパティ`kotlin.compiler.execution.strategy`を使用します。

```none
# gradle.properties
kotlin.compiler.execution.strategy=out-of-process
```

`compilerExecutionStrategy`タスクプロパティに利用可能な値は次のとおりです。

1. `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.DAEMON` (デフォルト)
2. `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.IN_PROCESS`
3. `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.OUT_OF_PROCESS`

`build.gradle.kts`ビルドスクリプトでタスクプロパティ`compilerExecutionStrategy`を使用します。

```kotlin
import org.jetbrains.kotlin.gradle.dsl.KotlinCompile
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy

// ...

tasks.withType<KotlinCompile>().configureEach {
    compilerExecutionStrategy.set(KotlinCompilerExecutionStrategy.IN_PROCESS)
}
```

[この YouTrack タスク](https://youtrack.jetbrains.com/issue/KT-49299)にご意見をお寄せください。

### kapt とコルーチンのビルドオプションの非推奨化

Kotlin 1.6.20 では、プロパティの非推奨レベルを変更しました。

* `kapt.use.worker.api`によるKotlinデーモン経由での[kapt](kapt.md)の実行機能は非推奨になりました。これはGradleの出力に警告を生成します。
  デフォルトでは、[kapt は 1.3.70 リリース以降 Gradle worker を使用しており](kapt.md#run-kapt-tasks-in-parallel)、この方法に固執することをお勧めします。

  今後、`kapt.use.worker.api`オプションは削除される予定です。

* `kotlin.experimental.coroutines` Gradle DSL オプションと`gradle.properties`で使用される`kotlin.coroutines`プロパティは非推奨になりました。
  _中断関数_を使用するか、`build.gradle(.kts)`ファイルに[`kotlinx.coroutines`依存関係を追加](gradle-configure-project.md#set-a-dependency-on-a-kotlinx-library)するだけです。
  
  コルーチンの詳細については、[コルーチンガイド](coroutines-guide.md)を参照してください。

### `kotlin.parallel.tasks.in.project`ビルドオプションの削除

Kotlin 1.5.20 では、[ビルドオプション`kotlin.parallel.tasks.in.project`の非推奨化](whatsnew1520.md#deprecation-of-the-kotlin-parallel-tasks-in-project-build-property)を発表しました。
このオプションは Kotlin 1.6.20 で削除されました。

プロジェクトによっては、Kotlin デーモンでの並列コンパイルにはより多くのメモリが必要になる場合があります。
メモリ消費を削減するには、[Kotlin デーモンの JVM ヒープサイズを増やしてください](gradle-compilation-and-caches.md#setting-kotlin-daemon-s-jvm-arguments)。

Kotlin Gradle プラグインで[現在サポートされているコンパイラオプション](gradle-compiler-options.md)の詳細はこちらをご覧ください。