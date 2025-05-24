---
title: "Kotlin 1.6.20の新機能"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[公開日: 2022年4月4日](releases#release-details)_

Kotlin 1.6.20では、将来の言語機能のプレビュー、マルチプラットフォームプロジェクトの階層構造のデフォルト化、およびその他のコンポーネントの漸進的な改善が明らかになりました。

この動画で変更点の概要を確認することもできます。

<video src="https://www.youtube.com/v/8F19ds109-o" title="What's new in Kotlin 1.6.20"/>

## 言語

Kotlin 1.6.20では、次の2つの新しい言語機能を試すことができます。

* [Kotlin/JVMのコンテキストレシーバーのプロトタイプ](#prototype-of-context-receivers-for-kotlin-jvm)
* [非null型](#definitely-non-nullable-types)

### Kotlin/JVMのコンテキストレシーバーのプロトタイプ

:::note
この機能はKotlin/JVMでのみ利用可能なプロトタイプです。`-Xcontext-receivers`を有効にすると、
コンパイラーは、本番コードでは使用できないプレリリースバイナリを生成します。
コンテキストレシーバーはおもちゃのプロジェクトでのみ使用してください。
[YouTrack](https://youtrack.jetbrains.com/issues/KT)でフィードバックをお待ちしております。

Kotlin 1.6.20では、レシーバーを1つに制限されなくなりました。さらに必要な場合は、関数、プロパティ、およびクラスを、宣言にコンテキストレシーバーを追加することにより、コンテキスト依存（または_コンテキスト_)にすることができます。コンテキスト宣言は、次のことを行います。

* 宣言されたすべてのコンテキストレシーバーが、暗黙のレシーバーとして呼び出し側のスコープに存在することを要求します。
* 宣言されたコンテキストレシーバーを、暗黙のレシーバーとして本体スコープに導入します。

```kotlin
interface LoggingContext {
    val log: Logger // このコンテキストは、ロガーへの参照を提供します
}

context(LoggingContext)
fun startBusinessOperation() {
    // LoggingContextは暗黙のレシーバーであるため、logプロパティにアクセスできます
    log.info("Operation has started")
}

fun test(loggingContext: LoggingContext) {
    with(loggingContext) {
        // startBusinessOperation()を呼び出すには、LoggingContextを暗黙のレシーバーとしてスコープに含める必要があります
        startBusinessOperation()
    }
}
```

プロジェクトでコンテキストレシーバーを有効にするには、`-Xcontext-receivers`コンパイラーオプションを使用します。
機能とその構文の詳細な説明は、[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/context-receivers#detailed-design)にあります。

実装はプロトタイプであることに注意してください。

* `-Xcontext-receivers`を有効にすると、コンパイラーは、本番コードでは使用できないプレリリースバイナリを生成します
* 現在、コンテキストレシーバーのIDEサポートは最小限です

おもちゃのプロジェクトでこの機能を試し、[このYouTrack issue](https://youtrack.jetbrains.com/issue/KT-42435)であなたの考えや経験を共有してください。
問題が発生した場合は、[新しいissueを提出](https://kotl.in/issue)してください。

### 非null型

非null型は[ベータ版](components-stability)です。ほぼ安定していますが、
将来、移行手順が必要になる場合があります。
変更を最小限に抑えるために最善を尽くします。

ジェネリックJavaクラスおよびインターフェースを拡張する際の相互運用性を向上させるために、Kotlin 1.6.20では、新しい構文`T & Any`を使用して、使用箇所でジェネリック型パラメーターを確実に非nullとしてマークできます。
構文形式は、[インターセクション型](https://en.wikipedia.org/wiki/Intersection_type)の表記法に由来し、現在では、`&`の左側にnull許容の上限があり、右側に非nullの`Any`を持つ型パラメーターに限定されています。

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

この機能を有効にするには、言語バージョンを`1.7`に設定します。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets.all {
        languageSettings.apply {
            languageVersion = "1.7"
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    sourceSets.all {
        languageSettings {
            languageVersion = '1.7'
        }
    }
}
```

</TabItem>
</Tabs>

非null型の詳細については、[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types)を参照してください。

## Kotlin/JVM

Kotlin 1.6.20では、以下が導入されています。

* JVMインターフェースのデフォルトメソッドの互換性の改善：[インターフェースの新しい`@JvmDefaultWithCompatibility`アノテーション](#new-jvmdefaultwithcompatibility-annotation-for-interfaces)および[-Xjvm-defaultモードの互換性の変更](#compatibility-changes-in-the-xjvm-default-modes)
* [JVMバックエンドでの単一モジュールの並列コンパイルのサポート](#support-for-parallel-compilation-of-a-single-module-in-the-jvm-backend)
* [関数型インターフェースコンストラクターへの呼び出し可能参照のサポート](#support-for-callable-references-to-functional-interface-constructors)

### インターフェースの新しい@JvmDefaultWithCompatibilityアノテーション

Kotlin 1.6.20では、新しいアノテーション[`@JvmDefaultWithCompatibility`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-default-with-compatibility/)が導入されています。`-Xjvm-default=all`コンパイラーオプションとともに使用して、Kotlinインターフェースの非抽象メンバーの[JVMインターフェースでデフォルトメソッドを作成](java-to-kotlin-interop#default-methods-in-interfaces)します。

`-Xjvm-default=all`オプションなしでコンパイルされたKotlinインターフェースを使用するクライアントがある場合、このオプションでコンパイルされたコードとのバイナリ互換性がない可能性があります。
Kotlin 1.6.20より前は、この互換性の問題を回避するために、[推奨されるアプローチ](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/#JvmDefaultWithoutCompatibility)は、`-Xjvm-default=all-compatibility`モードと、このタイプの互換性を必要としないインターフェースの`@JvmDefaultWithoutCompatibility`アノテーションを使用することでした。

このアプローチにはいくつかの欠点がありました。

* 新しいインターフェースが追加されたときにアノテーションを追加するのを簡単に忘れる可能性があります。
* 通常、非公開部分には公開APIよりも多くのインターフェースがあるため、最終的にコードの多くの場所にこのアノテーションが付きます。

これで、`-Xjvm-default=all`モードを使用し、`@JvmDefaultWithCompatibility`アノテーションでインターフェースをマークできます。
これにより、このアノテーションを公開APIのすべてのインターフェースに一度に追加でき、新しい非公開コードにアノテーションを使用する必要はありません。

[このYouTrackチケット](https://youtrack.jetbrains.com/issue/KT-48217)で、この新しいアノテーションに関するフィードバックをお寄せください。

### -Xjvm-defaultモードの互換性の変更

Kotlin 1.6.20では、`-Xjvm-default=all`または`-Xjvm-default=all-compatibility`モードでコンパイルされたモジュールに対して、デフォルトモード（`-Xjvm-default=disable`コンパイラーオプション）でモジュールをコンパイルするオプションが追加されています。
以前と同様に、すべてのモジュールに`-Xjvm-default=all`または`-Xjvm-default=all-compatibility`モードがある場合も、コンパイルは成功します。
[このYouTrack issue](https://youtrack.jetbrains.com/issue/KT-47000)でフィードバックをお寄せください。

Kotlin 1.6.20では、コンパイラーオプション`-Xjvm-default`の`compatibility`および`enable`モードが非推奨になりました。
互換性に関する他のモードの説明には変更がありますが、全体的なロジックは同じままです。
[更新された説明](java-to-kotlin-interop#compatibility-modes-for-default-methods)を確認できます。

Javaインターロップのデフォルトメソッドの詳細については、[相互運用性のドキュメント](java-to-kotlin-interop#default-methods-in-interfaces)と
[このブログ投稿](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)を参照してください。

### JVMバックエンドでの単一モジュールの並列コンパイルのサポート

JVMバックエンドでの単一モジュールの並列コンパイルのサポートは[試験的](components-stability)です。
いつでも削除または変更される可能性があります。オプトインが必要です（詳細は下記参照）。評価目的でのみ使用してください。
[YouTrack](https://youtrack.jetbrains.com/issue/KT-46085)でフィードバックをお待ちしております。

[新しいJVM IRバックエンドのコンパイル時間を改善](https://youtrack.jetbrains.com/issue/KT-46768)するための作業を続けています。
Kotlin 1.6.20では、モジュール内のすべてのファイルを並行してコンパイルするための実験的なJVM IRバックエンドモードを追加しました。
並列コンパイルにより、合計コンパイル時間を最大15％短縮できます。

[コンパイラーオプション](compiler-reference#compiler-options)`-Xbackend-threads`を使用して、実験的な並列バックエンドモードを有効にします。
このオプションには、次の引数を使用します。

* `N`は使用するスレッド数です。CPUコアの数を超えないようにしてください。そうしないと、スレッド間のコンテキストを切り替えるために並列化が効果的でなくなります。
* `0`を使用して、CPUコアごとに個別のスレッドを使用します

[Gradle](gradle)はタスクを並行して実行できますが、プロジェクト（またはプロジェクトの大部分）がGradleの観点から単なる1つの大きなタスクである場合、このタイプの並列化はあまり役に立ちません。
非常に大きなモノリシックモジュールがある場合は、並列コンパイルを使用してコンパイルを高速化します。
プロジェクトが多数の小さなモジュールで構成され、Gradleによって並列化されたビルドがある場合、コンテキストの切り替えにより、別のレイヤーの並列化を追加するとパフォーマンスが低下する可能性があります。

並列コンパイルにはいくつかの制約があります。
* [kapt](kapt)はIRバックエンドを無効にするため、kaptでは機能しません
* 設計上、より多くのJVMヒープが必要です。ヒープの量はスレッド数に比例します

:::

### 関数型インターフェースコンストラクターへの呼び出し可能参照のサポート

:::note
関数型インターフェースコンストラクターへの呼び出し可能参照のサポートは[試験的](components-stability)です。
いつでも削除または変更される可能性があります。オプトインが必要です（詳細は下記参照）。評価目的でのみ使用してください。
[YouTrack](https://youtrack.jetbrains.com/issue/KT-47939)でフィードバックをお待ちしております。

関数型インターフェースコンストラクターへの[呼び出し可能参照](reflection#callable-references)のサポートにより、コンストラクター関数を持つインターフェースから[関数型インターフェース](fun-interfaces)に移行するためのソース互換性のある方法が追加されます。

次のコードを検討してください。

```kotlin
interface Printer {
    fun print()
}

fun Printer(block: () `->` Unit): Printer = object : Printer { override fun print() = block() }
```

関数型インターフェースコンストラクターへの呼び出し可能参照を有効にすると、このコードは関数型インターフェース宣言のみに置き換えることができます。

```kotlin
fun interface Printer {
    fun print()
}
```

そのコンストラクターは暗黙的に作成され、`::Printer`関数参照を使用するコードはコンパイルされます。次に例を示します。

```kotlin
documentsStorage.addPrinter(::Printer)
```

レガシー関数`Printer`を[`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/)アノテーションで`DeprecationLevel.HIDDEN`でマークして、バイナリ互換性を維持します。

```kotlin
@Deprecated(message = "Your message about the deprecation", level = DeprecationLevel.HIDDEN)
fun Printer(...) {...}
```

この機能を有効にするには、コンパイラーオプション`-XXLanguage:+KotlinFunInterfaceConstructorReference`を使用します。

## Kotlin/Native

Kotlin/Native 1.6.20は、新しいコンポーネントの開発を継続していることを示しています。他のプラットフォームでのKotlinとの一貫したエクスペリエンスに向けて、もう一歩進みました。

* [新しいメモリーマネージャーのアップデート](#an-update-on-the-new-memory-manager)
* [新しいメモリーマネージャーでのスイープフェーズの同時実装](#concurrent-implementation-for-the-sweep-phase-in-new-memory-manager)
* [アノテーションクラスのインスタンス化](#instantiation-of-annotation-classes)
* [Swift async/awaitとの相互運用：KotlinUnitの代わりにSwiftのVoidを返す](#interop-with-swift-async-await-returning-void-instead-of-kotlinunit)
* [libbacktraceによる改善されたスタックトレース](#better-stack-traces-with-libbacktrace)
* [スタンドアロンのAndroid実行可能ファイルのサポート](#support-for-standalone-android-executables)
* [パフォーマンスの改善](#performance-improvements)
* [cinteropモジュールのインポート中のエラー処理の改善](#improved-error-handling-during-cinterop-modules-import)
* [Xcode 13ライブラリのサポート](#support-for-xcode-13-libraries)

### 新しいメモリーマネージャーのアップデート

新しいKotlin/Nativeメモリーマネージャーは[アルファ版](components-stability)です。
互換性のない変更が加えられる可能性があり、将来手動での移行が必要になる場合があります。
[YouTrack](https://youtrack.jetbrains.com/issue/KT-48525)でフィードバックをお待ちしております。

:::

Kotlin 1.6.20では、新しいKotlin/Nativeメモリーマネージャーのアルファ版を試すことができます。
これにより、JVMプラットフォームとNativeプラットフォームの違いがなくなり、マルチプラットフォームプロジェクトで一貫した開発者エクスペリエンスが提供されます。
たとえば、AndroidとiOSの両方で動作する新しいクロスプラットフォームモバイルアプリケーションをはるかに簡単に作成できます。

新しいKotlin/Nativeメモリーマネージャーは、スレッド間のオブジェクト共有の制限を解除します。
また、安全で特別な管理やアノテーションを必要としない、リークのない同時プログラミングプリミティブも提供します。

新しいメモリーマネージャーは将来のバージョンでデフォルトになるため、今すぐ試してみることをお勧めします。
新しいメモリーマネージャーの詳細、デモプロジェクトの探索、または[移行手順](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/NEW_MM)に直接進んで自分で試してみるには、[ブログ投稿](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/)をご覧ください。

プロジェクトで新しいメモリーマネージャーを使用して、その動作を確認し、issueトラッカー[YouTrack](https://youtrack.jetbrains.com/issue/KT-48525)でフィードバックを共有してください。

### 新しいメモリーマネージャーでのスイープフェーズの同時実装

[Kotlin 1.6で発表された](whatsnew16#preview-of-the-new-memory-manager)新しいメモリーマネージャーにすでに切り替えている場合は、実行時間が大幅に改善されていることに気付くかもしれません。ベンチマークでは、平均で35％の改善が見られます。
1.6.20以降、新しいメモリーマネージャーで使用できるスイープフェーズの同時実装もあります。
これにより、パフォーマンスが向上し、ガベージコレクターの一時停止時間が短縮されるはずです。

新しいKotlin/Nativeメモリーマネージャーの機能を有効にするには、次のコンパイラーオプションを渡します。

```bash
-Xgc=cms 
```

[このYouTrack issue](https://youtrack.jetbrains.com/issue/KT-48526)で、新しいメモリーマネージャーのパフォーマンスに関するフィードバックをお気軽にお寄せください。

### アノテーションクラスのインスタンス化

Kotlin 1.6.0では、アノテーションクラスのインスタンス化がKotlin/JVMおよびKotlin/JSで[安定](components-stability)しました。
1.6.20バージョンでは、Kotlin/Nativeのサポートが提供されます。

[アノテーションクラスのインスタンス化](annotations#instantiation)の詳細をご覧ください。

### Swift async/awaitとの相互運用：KotlinUnitの代わりにVoidを返す

:::note
Swift async/awaitとの同時実行の相互運用性は[試験的](components-stability)です。いつでも削除または変更される可能性があります。
評価目的でのみ使用してください。 [YouTrack](https://youtrack.jetbrains.com/issue/KT-47610)でフィードバックをお待ちしております。

[Swiftのasync/awaitとの実験的な相互運用性](whatsnew1530#experimental-interoperability-with-swift-5-5-async-await)（Swift 5.5以降で利用可能）の作業を継続しています。
Kotlin 1.6.20は、`Unit`戻り値の型を持つ`suspend`関数での動作が以前のバージョンとは異なります。

以前は、このような関数はSwiftでは`KotlinUnit`を返す`async`関数として表示されていました。ただし、それらの適切な戻り値の型は、非中断関数と同様に`Void`です。

既存のコードを壊さないようにするために、コンパイラーが`Unit`を返す中断関数を`Void`戻り値の型で`async` Swiftに変換するGradleプロパティを導入しています。

```none
# gradle.properties
kotlin.native.binary.unitSuspendFunctionObjCExport=proper
```

この動作を将来のKotlinリリースでデフォルトにする予定です。

### libbacktraceによる改善されたスタックトレース

ソースの場所の解決にlibbacktraceを使用することは[試験的](components-stability)です。いつでも削除または変更される可能性があります。
評価目的でのみ使用してください。 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48424)でフィードバックをお待ちしております。

Kotlin/Nativeは、ファイルロケーションと行番号の詳細なスタックトレースを生成できるようになりました
`linux*`（`linuxMips32`と`linuxMipsel32`を除く）および`androidNative*`ターゲットをより適切にデバッグできます。

この機能は、内部で[libbacktrace](https://github.com/ianlancetaylor/libbacktrace)ライブラリを使用します。
違いの例については、次のコードをご覧ください。

```kotlin
fun main() = bar()
fun bar() = baz()
inline fun baz() {
    error("")
}
```

* **1.6.20より前：**

```text
Uncaught Kotlin exception: kotlin.IllegalStateException:
   at 0   example.kexe        0x227190       kfun:kotlin.Throwable#<init>(kotlin.String?){} + 96
   at 1   example.kexe        0x221e4c       kfun:kotlin.Exception#<init>(kotlin.String?){} + 92
   at 2   example.kexe        0x221f4c       kfun:kotlin.RuntimeException#<init>(kotlin.String?){} + 92
   at 3   example.kexe        0x22234c       kfun:kotlin.IllegalStateException#<init>(kotlin.String?){} + 92
   at 4   example.kexe        0x25d708       kfun:#bar(){} + 104
   at 5   example.kexe        0x25d68c       kfun:#main(){} + 12
```

* **libbacktraceを使用した1.6.20：**

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

すでにスタックトレースにファイルロケーションと行番号が含まれているAppleターゲットでは、libbacktraceはインライン関数呼び出しの詳細を提供します。

* **1.6.20より前：**

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

* **libbacktraceを使用した1.6.20：**

```text
Uncaught Kotlin exception: kotlin.IllegalStateException:
   at 0   example.kexe    0x10669bc88    kfun:kotlin.Throwable#<init>(kotlin.String?){} + 88 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Throwable.kt:24:37)
   at 1   example.kexe    0x106696bd6    kfun:kotlin.Exception#<init>(kotlin.String?){} + 86 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:23:44)
   at 2   example.kexe    0x106696cc6    kfun:kotlin.RuntimeException#<init>(kotlin.String?){} + 86 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:34:44)
   at 3   example.kexe    0x106697016    kfun:kotlin.IllegalStateException#<init>(kotlin.String?){} + 86 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:70:44)
   at 4   example.kexe    0x106689d35    kfun:#bar(){} + 117 [inlined] (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/libraries/stdlib/src/kotlin/util/Preconditions.kt:143:56)  
:::caution
at 5   example.kexe    0x106689d35    kfun:#bar(){} + 117 [inlined] (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:4:5)
   at 6   example.kexe    0x106689d35    kfun:#bar(){} + 117 (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:2:13)
   at 7   example.kexe    0x106689cac    kfun:#main(){} + 12 (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:1:14)
...
```

libbacktraceでより良いスタックトレースを生成するには、次の行を`gradle.properties`に追加します。

```none
# gradle.properties
kotlin.native.binary.sourceInfoType=libbacktrace
```

[このYouTrack issue](https://youtrack.jetbrains.com/issue/KT-48424)で、libbacktraceを使用したKotlin/Nativeのデバッグの動作について教えてください。

### スタンドアロンのAndroid実行可能ファイルのサポート

以前は、Kotlin/NativeのAndroid Native実行可能ファイルは、実際には実行可能ファイルではなく、NativeActivityとして使用できる共有ライブラリでした。これで、Android Nativeターゲットの標準実行可能ファイルを生成するオプションができました。

そのためには、プロジェクトの`build.gradle(.kts)`部分で、`androidNative`ターゲットの実行可能ブロックを構成します。
次のバイナリオプションを追加します。

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
現在の動作を維持する場合は、次の設定を使用します。

```kotlin
binaryOptions["androidProgramType"] = "nativeActivity"
```

[実装](https://github.com/jetbrains/kotlin/pull/4624)のMattia Iavaroneに感謝します！

### パフォーマンスの改善

Kotlin/Nativeで[コンパイルプロセスを高速化](https://youtrack.jetbrains.com/issue/KT-42294)し、開発エクスペリエンスを向上させるために、私たちは懸命に取り組んでいます。

Kotlin 1.6.20には、Kotlinが生成するLLVM IRに影響を与えるパフォーマンスアップデートとバグ修正がいくつか含まれています。
内部プロジェクトのベンチマークによると、平均して次のパフォーマンス向上が達成されました。

* 実行時間が15％短縮
* リリースバイナリとデバッグバイナリの両方のコードサイズが20％削減
* リリースバイナリのコンパイル時間が26％短縮

これらの変更により、大規模な内部プロジェクトのデバッグバイナリのコンパイル時間も10％短縮されます。

これを実現するために、コンパイラーが生成した一部の合成オブジェクトの静的初期化を実装し、すべての関数のLLVM IRの構造化方法を改善し、コンパイラーキャッシュを最適化しました。

### cinteropモジュールのインポート中のエラー処理の改善

このリリースでは、`cinterop`ツールを使用してObjective-Cモジュールをインポートする場合のエラー処理が改善されました（CocoaPodsポッドの典型的な場合）。
以前は、Objective-Cモジュールを操作しようとしたときにエラーが発生した場合（たとえば、ヘッダーのコンパイルエラーを処理する場合）、`fatal error: could not build module $name`などの情報のないエラーメッセージが表示されました。
この`cinterop`ツールのこの部分を拡張したため、拡張された説明を含むエラーメッセージが表示されます。

### Xcode 13ライブラリのサポート

Xcode 13で提供されるライブラリは、このリリース以降、完全にサポートされています。
Kotlinコードのどこからでも自由にアクセスできます。

## Kotlin Multiplatform

1.6.20では、Kotlin Multiplatformに次の注目すべきアップデートがもたらされます。

* [階層構造のサポートが、すべての新しいマルチプラットフォームプロジェクトのデフォルトになりました](#hierarchical-structure-support-for-multiplatform-projects)
* [Kotlin CocoaPods Gradleプラグインは、CocoaPods統合に役立ついくつかの機能を受け取りました](#kotlin-cocoapods-gradle-plugin)

### マルチプラットフォームプロジェクトの階層構造のサポート

Kotlin 1.6.20には、デフォルトで有効になっている階層構造のサポートが付属しています。
[Kotlin 1.4.0で導入されて以来](whatsnew14#sharing-code-in-several-targets-with-the-hierarchical-project-structure)、フロントエンドを大幅に改善し、IDEインポートを安定させました。

以前は、マルチプラットフォームプロジェクトでコードを追加する方法が2つありました。1つ目は、プラットフォーム固有のソースセットに挿入することでした。これは1つのターゲットに制限されており、他のプラットフォームでは再利用できません。
2つ目は、Kotlinで現在サポートされているすべてのプラットフォームで共有される共通のソースセットを使用することです。

これで、共通のロジックとサードパーティAPIの多くを再利用する、いくつかの同様のネイティブターゲット間で[ソースコードを共有](#better-code-sharing-in-your-project)できるようになりました。
このテクノロジーは、正しいデフォルトの依存関係を提供し、共有コードで利用可能な正確なAPIを見つけます。
これにより、複雑なビルドセットアップと、ネイティブターゲット間でソースセットを共有するためのIDEサポートを取得するための回避策を使用する必要がなくなります。
また、別のターゲットを対象とした安全でないAPIの使用を防ぐのにも役立ちます。

このテクノロジーは、階層プロジェクト構造により、ターゲットのサブセットに対して共通APIを持つライブラリを公開および消費できるため、[ライブラリの作成者](#more-opportunities-for-library-authors)にとっても役立ちます。

デフォルトでは、階層プロジェクト構造で公開されているライブラリは、階層構造プロジェクトとのみ互換性があります。

#### プロジェクトでのより良いコード共有

階層構造のサポートがない場合、[Kotlinターゲット](multiplatform-dsl-reference#targets)の_一部_ではあるが、_すべて_ではないでコードを共有する簡単な方法はありません。
1つの一般的な例は、すべてのiOSターゲット間でコードを共有し、FoundationのようなiOS固有の[依存関係](multiplatform-share-on-platforms#connect-platform-specific-libraries)にアクセスできることです。

階層プロジェクト構造のサポートのおかげで、これをすぐに実現できます。
新しい構造では、ソースセットは階層を形成します。
特定のソースセットのコンパイル先となる各ターゲットで利用可能な、プラットフォーム固有の言語機能と依存関係を使用できます。

たとえば、iOSデバイスとシミュレーター用の2つのターゲット（`iosArm64`と`iosX64`）を持つ一般的なマルチプラットフォームプロジェクトを考えてみましょう。
Kotlinツールは、両方のターゲットが同じ関数を持つことを理解しており、中間ソースセット`iosMain`からその関数にアクセスできます。

<img src="/img/ios-hierarchy-example.jpg" alt="iOS hierarchy example" width="700" style={{verticalAlign: 'middle'}}/>

Kotlinツールチェーンは、Kotlin/Native stdlibやネイティブライブラリなどの正しいデフォルトの依存関係