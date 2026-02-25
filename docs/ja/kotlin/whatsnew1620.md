[//]: # (title: Kotlin 1.6.20 の新機能)

<web-summary>Kotlin 1.6.20 のリリースノートでは、新しい言語機能、Kotlin Multiplatform、JVM、Native、JS への更新、および Gradle と Maven のビルドツールサポートについて説明します。</web-summary>

_[リリース日: 2022 年 4 月 4 日](releases.md#release-history)_

Kotlin 1.6.20 では、将来の言語機能のプレビューが公開され、マルチプラットフォームプロジェクトで階層構造がデフォルトになり、その他のコンポーネントにも進化的な改善がもたらされています。

このビデオで変更点の短い概要を確認することもできます：

<video src="https://www.youtube.com/v/8F19ds109-o" title="Kotlin 1.6.20 の新機能"/>

> Kotlin のリリースサイクルについては、[Kotlin のリリースプロセス](releases.md)を参照してください。
>
{style="tip"}

## 言語 (Language)

Kotlin 1.6.20 では、2 つの新しい言語機能を試すことができます：

* [Kotlin/JVM 用のコンテキストレシーバーのプロトタイプ](#prototype-of-context-receivers-for-kotlin-jvm)
* [確実な非 null 型 (Definitely non-nullable types)](#definitely-non-nullable-types)

### Kotlin/JVM 用のコンテキストレシーバーのプロトタイプ

> この機能は Kotlin/JVM でのみ利用可能なプロトタイプです。`-Xcontext-receivers` を有効にすると、コンパイラは製品コードでは使用できないプレリリースバイナリを生成します。
> コンテキストレシーバーは、実験的なプロジェクトでのみ使用してください。
> [YouTrack](https://youtrack.jetbrains.com/issues/KT) でのフィードバックをお待ちしております。
>
{style="warning"}

Kotlin 1.6.20 では、レシーバーを 1 つに制限されることはもうありません。さらに必要であれば、宣言にコンテキストレシーバーを追加することで、関数、プロパティ、クラスをコンテキスト依存（または「コンテキスト」）にすることができます。コンテキスト宣言は以下のことを行います：

* 呼び出し側のスコープ内に、宣言されたすべてのコンテキストレシーバーが暗黙のレシーバーとして存在することを要求します。
* 宣言されたコンテキストレシーバーを、そのボディのスコープ内に暗黙のレシーバーとして取り込みます。

```kotlin
interface LoggingContext {
    val log: Logger // このコンテキストはロガーへの参照を提供します
}

context(LoggingContext)
fun startBusinessOperation() {
    // LoggingContext が暗黙のレシーバーであるため、log プロパティにアクセスできます
    log.info("Operation has started")
}

fun test(loggingContext: LoggingContext) {
    with(loggingContext) {
        // startBusinessOperation() を呼び出すには、
        // スコープ内に暗黙のレシーバーとして LoggingContext が必要です
        startBusinessOperation()
    }
}
```

プロジェクトでコンテキストレシーバーを有効にするには、`-Xcontext-receivers` コンパイラオプションを使用します。
機能の詳細な説明と構文については、[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/context-receivers.md#detailed-design) を参照してください。

この実装はプロトタイプであることに注意してください：

* `-Xcontext-receivers` を有効にすると、コンパイラは製品コードでは使用できないプレリリースバイナリを生成します。
* 現時点では、コンテキストレシーバーに対する IDE のサポートは最小限です。

実験的なプロジェクトでこの機能を試し、[こちらの YouTrack イシュー](https://youtrack.jetbrains.com/issue/KT-42435)で感想や経験を共有してください。
問題が発生した場合は、[新しいイシューを報告](https://kotl.in/issue)してください。

### 確実な非 null 型 (Definitely non-nullable types)

> 確実な非 null 型は [ベータ版](components-stability.md) です。ほぼ安定していますが、将来的に移行ステップが必要になる可能性があります。
> 必要な変更を最小限に抑えるよう最善を尽くします。
>
{style="warning"}

ジェネリックな Java クラスやインターフェースを拡張する際の相互運用性を向上させるため、Kotlin 1.6.20 では、新しい構文 `T & Any` を使用して、利用側（use site）でジェネリック型パラメータを確実な非 null としてマークできるようになりました。
この構文形式は[交差型 (intersection types)](https://en.wikipedia.org/wiki/Intersection_type) の表記に由来しており、現在は `&` の左側に nullable な上限境界を持つ型パラメータ、右側に非 null の `Any` を指定することに限定されています：

```kotlin
fun <T> elvisLike(x: T, y: T & Any): T & Any = x ?: y

fun main() {
    // OK
    elvisLike<String>("", "").length
    // エラー: 'null' は非 null 型の値になれません
    elvisLike<String>("", null).length

    // OK
    elvisLike<String?>(null, "").length
    // エラー: 'null' は非 null 型の値になれません
    elvisLike<String?>(null, null).length
}
```
{validate="false"}

機能を有効にするには、言語バージョンを `1.7` に設定してください：

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

確実な非 null 型の詳細については、[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types.md) を参照してください。

## Kotlin/JVM

Kotlin 1.6.20 では以下が導入されました：

* JVM インターフェースにおけるデフォルトメソッドの互換性の改善：[インターフェース用の新しい `@JvmDefaultWithCompatibility` アノテーション](#new-jvmdefaultwithcompatibility-annotation-for-interfaces) と [`-Xjvm-default` モードにおける互換性の変更](#compatibility-changes-in-the-xjvm-default-modes)
* [JVM バックエンドにおける単一モジュールの並列コンパイルのサポート](#support-for-parallel-compilation-of-a-single-module-in-the-jvm-backend)
* [関数型インターフェースのコンストラクタへの呼び出し可能参照のサポート](#support-for-callable-references-to-functional-interface-constructors)

### インターフェース用の新しい @JvmDefaultWithCompatibility アノテーション

Kotlin 1.6.20 では、新しいアノテーション [`@JvmDefaultWithCompatibility`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-default-with-compatibility/) が導入されました。これを `-Xjvm-default=all` コンパイラオプションと一緒に使用すると、任意の Kotlin インターフェース内の任意の非抽象メンバーに対して、[JVM インターフェースのデフォルトメソッドを作成](java-to-kotlin-interop.md#default-methods-in-interfaces)できます。

`-Xjvm-default=all` オプションなしでコンパイルされた Kotlin インターフェースを使用しているクライアントがある場合、このオプションでコンパイルされたコードとバイナリ互換性がなくなる可能性があります。
Kotlin 1.6.20 より前では、この互換性の問題を回避するために[推奨されていた方法](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/#JvmDefaultWithoutCompatibility)は、`-Xjvm-default=all-compatibility` モードを使用し、さらにこの種の互換性が必要ないインターフェースに対して `@JvmDefaultWithoutCompatibility` アノテーションを使用することでした。

このアプローチにはいくつかの欠点がありました：

* 新しいインターフェースを追加したときに、アノテーションの追加を忘れがちである。
* 通常、公開 API よりも非公開部分に多くのインターフェースがあるため、コードの多くの場所にこのアノテーションを記述することになる。

今後は、`-Xjvm-default=all` モードを使用し、インターフェースを `@JvmDefaultWithCompatibility` アノテーションでマークできます。
これにより、公開 API 内のすべてのインターフェースに一度このアノテーションを追加するだけで済み、新しい非公開コードにはアノテーションを使用する必要がなくなります。

この新しいアノテーションに関するフィードバックは、[こちらの YouTrack チケット](https://youtrack.jetbrains.com/issue/KT-48217)にお寄せください。

### -Xjvm-default モードにおける互換性の変更

Kotlin 1.6.20 では、デフォルトモード (`-Xjvm-default=disable` コンパイラオプション) でコンパイルされたモジュールを、`-Xjvm-default=all` または `-Xjvm-default=all-compatibility` モードでコンパイルされたモジュールに対してコンパイルできるようになりました。
以前と同様に、すべてのモジュールが `-Xjvm-default=all` または `-Xjvm-default=all-compatibility` モードであれば、コンパイルは成功します。
フィードバックは [こちらの YouTrack イシュー](https://youtrack.jetbrains.com/issue/KT-47000) で受け付けています。

Kotlin 1.6.20 では、コンパイラオプション `-Xjvm-default` の `compatibility` モードと `enable` モードが非推奨になりました。
互換性に関する他のモードの説明に変更がありますが、全体的なロジックは変わりません。[更新された説明](java-to-kotlin-interop.md#compatibility-modes-for-default-methods)を確認してください。

Java 相互運用におけるデフォルトメソッドの詳細については、[相互運用ドキュメント](java-to-kotlin-interop.md#default-methods-in-interfaces) および [こちらのブログ記事](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/) を参照してください。

### JVM バックエンドにおける単一モジュールの並列コンパイルのサポート

> JVM バックエンドにおける単一モジュールの並列コンパイルのサポートは [実験的 (Experimental)](components-stability.md) です。
> いつでも変更または削除される可能性があります。使用するにはオプトインが必要であり（詳細は下記）、評価目的でのみ使用してください。
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-46085) でのフィードバックをお待ちしております。
>
{style="warning"}

[新しい JVM IR バックエンドのコンパイル時間の改善](https://youtrack.jetbrains.com/issue/KT-46768)に引き続き取り組んでいます。
Kotlin 1.6.20 では、モジュール内のすべてのファイルを並列にコンパイルする、試験的な JVM IR バックエンドモードを追加しました。
並列コンパイルにより、合計コンパイル時間を最大 15% 短縮できる可能性があります。

実験的な並列バックエンドモードを有効にするには、[コンパイラオプション](compiler-reference.md#compiler-options) `-Xbackend-threads` を使用します。
このオプションには以下の引数を使用します：

* `N`: 使用するスレッド数。CPU コア数を超えないようにしてください。超えると、スレッド間のコンテキストスイッチにより並列化の効果が薄れます。
* `0`: 各 CPU コアに対して個別のスレッドを使用します。

[Gradle](gradle.md) はタスクを並列に実行できますが、プロジェクト（またはプロジェクトの大部分）が Gradle の観点から見て 1 つの大きなタスクである場合、この種の並列化はあまり役に立ちません。
非常に大きなモノリシックなモジュールがある場合は、並列コンパイルを使用してより迅速にコンパイルしてください。
プロジェクトが多くの小さなモジュールで構成され、Gradle によってビルドが並列化されている場合、さらに別の並列化レイヤーを追加するとコンテキストスイッチのためにパフォーマンスが低下する可能性があります。

> 並列コンパイルにはいくつかの制約があります：
> * [kapt](kapt.md) は IR バックエンドを無効にするため、動作しません。
> * 設計上、より多くの JVM ヒープを必要とします。ヒープの量はスレッド数に比例します。
>
{style="note"}

### 関数型インターフェースのコンストラクタへの呼び出し可能参照のサポート

> 関数型インターフェースのコンストラクタへの呼び出し可能参照のサポートは [実験的 (Experimental)](components-stability.md) です。
> いつでも変更または削除される可能性があります。使用するにはオプトインが必要であり（詳細は下記）、評価目的でのみ使用してください。
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-47939) でのフィードバックをお待ちしております。
>
{style="warning"}

関数型インターフェースのコンストラクタへの[呼び出し可能参照 (callable references)](reflection.md#callable-references) のサポートにより、コンストラクタ関数を持つインターフェースから [関数型インターフェース (fun interfaces)](fun-interfaces.md) への、ソース互換性のある移行方法が追加されました。

以下のコードを考えてみましょう：

```kotlin
interface Printer {
    fun print()
}

fun Printer(block: () -> Unit): Printer = object : Printer { override fun print() = block() }
```

関数型インターフェースのコンストラクタへの呼び出し可能参照を有効にすると、このコードは単なる関数型インターフェースの宣言に置き換えることができます：

```fun interface Printer {
    fun print()
}
```

そのコンストラクタは暗黙的に作成され、`::Printer` 関数参照を使用しているコードはコンパイルされます。例：

```kotlin
documentsStorage.addPrinter(::Printer)
```
{validate="false"}

レガシーな関数 `Printer` を [`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/) アノテーションで `DeprecationLevel.HIDDEN` を指定してマークすることで、バイナリ互換性を維持します：

```kotlin
@Deprecated(message = "非推奨に関するメッセージ", level = DeprecationLevel.HIDDEN)
fun Printer(...) {...}
```
{validate="false"}

この機能を有効にするには、コンパイラオプション `-XXLanguage:+KotlinFunInterfaceConstructorReference` を使用してください。

## Kotlin/Native

Kotlin/Native 1.6.20 では、新しいコンポーネントの開発が継続されています。他のプラットフォームの Kotlin との一貫した体験に向けて、さらに一歩前進しました：

* [新しいメモリマネージャに関するアップデート](#an-update-on-the-new-memory-manager)
* [新しいメモリマネージャにおけるスイープフェーズの並列実装](#concurrent-implementation-for-the-sweep-phase-in-new-memory-manager)
* [アノテーションクラスのインスタンス化](#instantiation-of-annotation-classes)
* [Swift async/await との相互運用：KotlinUnit の代わりに Swift の Void を返す](#interop-with-swift-async-await-returning-void-instead-of-kotlinunit)
* [libbacktrace によるスタックトレースの改善](#better-stack-traces-with-libbacktrace)
* [Android スタンドアロン実行ファイルのサポート](#support-for-standalone-android-executables)
* [パフォーマンスの向上](#performance-improvements)
* [cinterop モジュールのインポート中のエラーハンドリングの改善](#improved-error-handling-during-cinterop-modules-import)
* [Xcode 13 ライブラリのサポート](#support-for-xcode-13-libraries)

### 新しいメモリマネージャに関するアップデート

> 新しい Kotlin/Native メモリマネージャは [アルファ版 (Alpha)](components-stability.md) です。
> 将来的に互換性のない変更が行われ、手動での移行が必要になる可能性があります。
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) でのフィードバックをお待ちしております。
>
{style="note"}

Kotlin 1.6.20 では、新しい Kotlin/Native メモリマネージャのアルファ版を試すことができます。
これにより、JVM と Native プラットフォーム間の差異が解消され、マルチプラットフォームプロジェクトにおいて一貫した開発体験が提供されます。
たとえば、Android と iOS の両方で動作する新しいクロスプラットフォームモバイルアプリケーションをより簡単に作成できるようになります。

新しい Kotlin/Native メモリマネージャは、スレッド間でのオブジェクト共有に関する制限を撤廃します。
また、安全で特別な管理やアノテーションを必要としない、リークのない並行プログラミングプリミティブを提供します。

新しいメモリマネージャは将来のバージョンでデフォルトになる予定ですので、今すぐ試してみることをお勧めします。
新しいメモリマネージャの詳細やデモプロジェクトについては、[ブログ記事](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/)を確認するか、[移行手順](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/NEW_MM.md)に進んで自分で試してみてください。

プロジェクトで新しいメモリマネージャを使用してみて、動作を確認し、イシュートラッカー [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) でフィードバックを共有してください。

### 新しいメモリマネージャにおけるスイープフェーズの並列実装

[Kotlin 1.6 で発表](whatsnew16.md#preview-of-the-new-memory-manager)された新しいメモリマネージャにすでに切り替えている場合は、実行時間が大幅に改善されていることに気づくかもしれません。ベンチマークでは平均 35% の改善が見られました。
1.6.20 からは、新しいメモリマネージャでスイープフェーズの並列実装も利用可能になりました。
これにより、パフォーマンスがさらに向上し、ガベージコレクタの停止時間も短縮されるはずです。

新しい Kotlin/Native メモリマネージャでこの機能を有効にするには、以下のコンパイラオプションを渡します：

```bash
-Xgc=cms 
```

新しいメモリマネージャのパフォーマンスに関するフィードバックは、[こちらの YouTrack イシュー](https://youtrack.jetbrains.com/issue/KT-48526) でお寄せください。

### アノテーションクラスのインスタンス化

Kotlin 1.6.0 では、アノテーションクラスのインスタンス化が Kotlin/JVM および Kotlin/JS で [安定版 (Stable)](components-stability.md) になりました。
1.6.20 バージョンでは、Kotlin/Native でもサポートが提供されます。

[アノテーションクラスのインスタンス化](annotations.md#instantiation)の詳細についてはこちらを参照してください。

### Swift async/await との相互運用：KotlinUnit の代わりに Void を返す

> Swift の async/await との並行性相互運用は [実験的 (Experimental)](components-stability.md) です。いつでも変更または削除される可能性があります。
> 評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issue/KT-47610) でのフィードバックをお待ちしております。
>
{style="warning"}

[Swift の async/await との試験的な相互運用](whatsnew1530.md#experimental-interoperability-with-swift-5-5-async-await)（Swift 5.5 以降で利用可能）への取り組みを継続しています。
Kotlin 1.6.20 では、`Unit` 戻り値型を持つ `suspend` 関数の扱いが以前のバージョンと異なります。

以前は、そのような関数は Swift では `KotlinUnit` を返す `async` 関数として表現されていました。しかし、これらに対する適切な戻り値の型は、非 suspend 関数と同様に `Void` です。

既存のコードを壊さないように、コンパイラが `Unit` を返す suspend 関数を `Void` 戻り値型の `async` Swift 関数に変換するようにするための Gradle プロパティを導入します：

```none
# gradle.properties
kotlin.native.binary.unitSuspendFunctionObjCExport=proper
```

将来の Kotlin リリースでは、この挙動をデフォルトにする予定です。

### libbacktrace によるスタックトレースの改善

> ソース位置の解決に libbacktrace を使用することは [実験的 (Experimental)](components-stability.md) です。いつでも変更または削除される可能性があります。
> 評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issue/KT-48424) でのフィードバックをお待ちしております。
>
{style="warning"}

Kotlin/Native は、`linux*`（`linuxMips32` と `linuxMipsel32` を除く）および `androidNative*` ターゲットのデバッグを容易にするために、ファイル位置と行番号を含む詳細なスタックトレースを生成できるようになりました。

この機能は、内部で [libbacktrace](https://github.com/ianlancetaylor/libbacktrace) ライブラリを使用しています。
以下のコードを例に、違いを確認してください：

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

* **1.6.20 (libbacktrace あり):**

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

すでにスタックトレースにファイル位置と行番号が表示されていた Apple ターゲットでは、libbacktrace によりインライン関数呼び出しに関する詳細情報が提供されます：

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

* **1.6.20 (libbacktrace あり):**

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

libbacktrace を使用してより優れたスタックトレースを生成するには、`gradle.properties` に次の行を追加します：

```none
# gradle.properties
kotlin.native.binary.sourceInfoType=libbacktrace
```

libbacktrace を使用した Kotlin/Native のデバッグの使用感について、[こちらの YouTrack イシュー](https://youtrack.jetbrains.com/issue/KT-48424) でお聞かせください。

### Android スタンドアロン実行ファイルのサポート

以前の Kotlin/Native における Android Native 実行ファイルは、実際には実行ファイルではなく、NativeActivity として使用できる共有ライブラリでした。今回、Android Native ターゲット向けに標準の実行ファイルを生成するオプションが追加されました。

これを行うには、プロジェクトの `build.gradle(.kts)` の `androidNative` ターゲットの executable ブロックを構成します。
以下のバイナリオプションを追加してください：

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

この機能は Kotlin 1.7.0 でデフォルトになる予定であることに注意してください。
現在の挙動を維持したい場合は、以下の設定を使用してください：

```kotlin
binaryOptions["androidProgramType"] = "nativeActivity"
```

[実装](https://github.com/jetbrains/kotlin/pull/4624)に貢献してくれた Mattia Iavarone に感謝します！

### パフォーマンスの向上

私たちは [コンパイルプロセスの高速化](https://youtrack.jetbrains.com/issue/KT-42294) と開発体験の向上のため、Kotlin/Native に懸命に取り組んでいます。

Kotlin 1.6.20 では、Kotlin が生成する LLVM IR に影響を与えるいくつかのパフォーマンスアップデートとバグ修正が行われました。
社内プロジェクトでのベンチマークによると、平均して以下のパフォーマンス向上が達成されました：

* 実行時間の 15% 短縮
* リリースバイナリとデバッグバイナリの両方でコードサイズが 20% 削減
* リリースバイナリのコンパイル時間が 26% 短縮

これらの変更により、大規模な社内プロジェクトのデバッグバイナリのコンパイル時間も 10% 短縮されました。

これを実現するために、コンパイラが生成する一部の合成オブジェクトの静的初期化を実装し、各関数の LLVM IR の構造化方法を改善し、コンパイラキャッシュを最適化しました。

### cinterop モジュールのインポート中のエラーハンドリングの改善

本リリースでは、`cinterop` ツールを使用して Objective-C モジュールをインポートする場合（CocoaPods ポッドで一般的です）のエラーハンドリングが改善されました。
以前は、Objective-C モジュールの処理中にエラーが発生した場合（ヘッダーのコンパイルエラーなど）、`fatal error: could not build module $name` のような情報の乏しいエラーメッセージが表示されていました。
`cinterop` ツールのこの部分を拡張したため、より詳細な説明を含むエラーメッセージが表示されるようになります。

### Xcode 13 ライブラリのサポート

Xcode 13 に付属するライブラリは、本リリースでフルサポートされました。
Kotlin コードのどこからでも自由にアクセスできます。

## Kotlin Multiplatform

1.6.20 では、Kotlin Multiplatform に以下の注目すべきアップデートがもたらされました：

* [すべての新しいマルチプラットフォームプロジェクトで階層構造のサポートがデフォルトになりました](#hierarchical-structure-support-for-multiplatform-projects)
* [Kotlin CocoaPods Gradle プラグインに、CocoaPods 統合のためのいくつかの便利な機能が追加されました](#kotlin-cocoapods-gradle-plugin)

### マルチプラットフォームプロジェクトにおける階層構造のサポート

Kotlin 1.6.20 では、階層構造（hierarchical structure）のサポートがデフォルトで有効になっています。
[Kotlin 1.4.0 で導入](whatsnew14.md#sharing-code-in-several-targets-with-the-hierarchical-project-structure)して以来、フロントエンドを大幅に改善し、IDE インポートを安定させました。

以前は、マルチプラットフォームプロジェクトでコードを追加する方法が 2 つありました。1 つはプラットフォーム固有のソースセットに挿入する方法で、これは 1 つのターゲットに限定され、他のプラットフォームで再利用できません。
2 つ目は、Kotlin が現在サポートしているすべてのプラットフォームで共有される共通（common）ソースセットを使用する方法です。

今後は、多くの共通ロジックやサードパーティ API を再利用する、[複数の類似したネイティブターゲット間でソースコードを共有](#better-code-sharing-in-your-project)できるようになります。
この技術は、適切なデフォルトの依存関係を提供し、共有コードで利用可能な正確な API を見つけ出します。
これにより、複雑なビルド設定や、ネイティブターゲット間でのソースセット共有のために IDE サポートを得るための回避策を使用する必要がなくなります。
また、別のターゲット向けに意図された安全でない API の使用を防ぐのにも役立ちます。

階層的なプロジェクト構造により、ターゲットのサブセットに対して共通の API を持つライブラリを公開・利用できるようになるため、[ライブラリ作成者](#more-opportunities-for-library-authors)にとっても便利です。

デフォルトでは、階層的なプロジェクト構造で公開されたライブラリは、階層構造のプロジェクトとのみ互換性があります。

#### プロジェクト内でのより優れたコード共有

階層構造のサポートがない場合、すべてではなく[一部の Kotlin ターゲット](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html#targets)間でのみコードを共有する簡単な方法はありませんでした。
よくある例は、すべての iOS ターゲット間でコードを共有し、Foundation などの iOS 固有の[依存関係](https://kotlinlang.org/docs/multiplatform/multiplatform-share-on-platforms.html#connect-platform-specific-libraries)にアクセスすることです。

階層的なプロジェクト構造のサポートにより、これが標準機能として実現できるようになりました。
新しい構造では、ソースセットが階層を形成します。
特定のソースセットがコンパイルされる各ターゲットで利用可能な、プラットフォーム固有の言語機能や依存関係を使用できます。

例えば、iOS デバイス用とシミュレータ用の 2 つのターゲット `iosArm64` と `iosX64` を持つ一般的なマルチプラットフォームプロジェクトを考えてみましょう。
Kotlin ツールは、両方のターゲットが同じ関数を持っていることを理解し、中間ソースセットである `iosMain` からその関数にアクセスすることを許可します。

![iOS の階層の例](ios-hierarchy-example.jpg){width=700}

Kotlin ツールチェーンは、Kotlin/Native 標準ライブラリやネイティブライブラリなどの正しいデフォルト依存関係を提供します。
さらに、Kotlin ツールは共有コードで利用可能な正確な API サーフェスを見つけるために最善を尽くします。
これにより、Windows 用に共有されているコードで macOS 固有の関数を使用するといったケースを防ぐことができます。

#### ライブラリ作成者へのさらなる機会

マルチプラットフォームライブラリが公開される際、中間ソースセットの API も適切に公開されるようになり、利用者が利用できるようになります。
ここでも、Kotlin ツールチェーンは、JS コードで JVM 向けの API を使用するといった安全でない使用法を注意深く監視しながら、利用者のソースセットで利用可能な API を自動的に判断します。
[ライブラリでのコード共有](https://kotlinlang.org/docs/multiplatform/multiplatform-share-on-platforms.html#share-code-in-libraries)についての詳細を確認してください。

#### 設定とセットアップ

Kotlin 1.6.20 以降、すべての新しいマルチプラットフォームプロジェクトは階層的なプロジェクト構造になります。追加のセットアップは必要ありません。

* すでに[手動で有効にしていた](https://kotlinlang.org/docs/multiplatform/multiplatform-share-on-platforms.html#share-code-on-similar-platforms)場合は、`gradle.properties` から非推奨のオプションを削除できます：

  ```none
  # gradle.properties
  kotlin.mpp.enableGranularSourceSetsMetadata=true
  kotlin.native.enableDependencyPropagation=false // または以前の設定に応じて 'true'
  ```

* Kotlin 1.6.20 では、最高の体験を得るために [Android Studio 2021.1.1](https://developer.android.com/studio) (Bumblebee) 以降を使用することをお勧めします。

* オプトアウトすることも可能です。階層構造のサポートを無効にするには、`gradle.properties` で以下のオプションを設定します：

  ```none
  # gradle.properties
  kotlin.mpp.hierarchicalStructureSupport=false
  ```

#### フィードバックのお願い

これはエコシステム全体にわたる重要な変更です。より良くするために、皆様のフィードバックをお待ちしております。

今すぐ試して、遭遇した問題を [イシュートラッカー](https://kotl.in/issue) に報告してください。

### Kotlin CocoaPods Gradle プラグイン

CocoaPods の統合を簡素化するため、Kotlin 1.6.20 では以下の機能が提供されます：

* CocoaPods プラグインに、登録されたすべてのターゲットを持つ XCFramework をビルドし、Podspec ファイルを生成するタスクが追加されました。これは、Xcode と直接統合したくないが、アーティファクトをビルドしてローカルの CocoaPods リポジトリにデプロイしたい場合に便利です。
  
  [XCFramework のビルド](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html#build-xcframeworks)についての詳細を確認してください。

* プロジェクトで [CocoaPods 統合](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html)を使用している場合、以前は Gradle プロジェクト全体に対して必要な Pod バージョンを指定していました。今後はさらにオプションが増えました：
  * `cocoapods` ブロックで直接 Pod バージョンを指定する
  * 引き続き Gradle プロジェクトのバージョンを使用する
  
  これらのプロパティのいずれも設定されていない場合は、エラーが発生します。

* Gradle プロジェクト全体の名前を変更する代わりに、`cocoapods` ブロックで CocoaPod 名を設定できるようになりました。

* CocoaPods プラグインに新しい `extraSpecAttributes` プロパティが導入されました。これを使用して、以前はハードコードされていた `libraries` や `vendored_frameworks` などの Podspec ファイルのプロパティを構成できます。

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

Kotlin CocoaPods Gradle プラグインの [DSL リファレンス](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-dsl-reference.html) 全体を確認してください。

## Kotlin/JS

Kotlin/JS の 1.6.20 における改善は、主に IR コンパイラに関連するものです：

* [開発用バイナリ (IR) のインクリメンタルコンパイル](#incremental-compilation-for-development-binaries-with-ir-compiler)
* [IR コンパイラにおけるトップレベルプロパティのデフォルトでの遅延初期化](#lazy-initialization-of-top-level-properties-by-default-with-ir-compiler)
* [IR コンパイラにおけるプロジェクトモジュールごとの個別 JS ファイル生成のデフォルト化](#separate-js-files-for-project-modules-by-default-with-ir-compiler)
* [Char クラスの最適化 (IR)](#char-class-optimization)
* [Export の改善 (IR およびレガシーバックエンドの両方)](#improvements-to-export-and-typescript-declaration-generation)
* [非同期テストに対する @AfterTest の保証](#aftertest-guarantees-for-asynchronous-tests)

### IR コンパイラによる開発用バイナリのインクリメンタルコンパイル

IR コンパイラを使用した Kotlin/JS 開発をより効率的にするため、新しい「インクリメンタルコンパイル (incremental compilation)」モードを導入します。

このモードで `compileDevelopmentExecutableKotlinJs` Gradle タスクを使用して**開発用バイナリ**をビルドすると、コンパイラは以前のコンパイル結果をモジュールレベルでキャッシュします。
その後のコンパイルでは、変更されていないソースファイルに対してキャッシュされたコンパイル結果を使用するため、特に小さな変更の場合にコンパイルがより迅速に完了します。
この改善は、開発プロセス（「編集・ビルド・デバッグ」サイクルの短縮）を特に対象としており、本番用アーティファクトのビルドには影響しないことに注意してください。

開発用バイナリのインクリメンタルコンパイルを有効にするには、プロジェクトの `gradle.properties` に次の行を追加します：

```none
# gradle.properties
kotlin.incremental.js.ir=true // デフォルトは false
```

私たちのテストプロジェクトでは、新しいモードによってインクリメンタルコンパイルが最大 30% 高速化されました。ただし、このモードでのクリーンビルドは、キャッシュを作成して配置する必要があるため、遅くなります。

Kotlin/JS プロジェクトでインクリメンタルコンパイルを使用してみた感想を、[こちらの YouTrack イシュー](https://youtrack.jetbrains.com/issue/KT-50203) で教えてください。

### IR コンパイラにおけるトップレベルプロパティのデフォルトでの遅延初期化

Kotlin 1.4.30 では、JS IR コンパイラにおける[トップレベルプロパティの遅延初期化 (lazy initialization)](whatsnew1430.md#lazy-initialization-of-top-level-properties) のプロトタイプを公開しました。
アプリケーション起動時にすべてのプロパティを初期化する必要をなくすことで、遅延初期化は起動時間を短縮します。
私たちの測定では、実際の Kotlin/JS アプリケーションで約 10% の高速化が見られました。

今回、この仕組みを磨き上げ、適切にテストした結果、IR コンパイラにおけるトップレベルプロパティの遅延初期化をデフォルトにしました。

```kotlin
// 遅延初期化
val a = run {
    val result = // 重い計算
        println(result)
    result
} // run は変数の最初の使用時に実行されます
```

何らかの理由でプロパティを先行して（アプリケーション起動時に）初期化する必要がある場合は、[`@EagerInitialization`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-eager-initialization/) アノテーションでマークしてください。

### IR コンパイラにおけるプロジェクトモジュールごとの個別 JS ファイル生成のデフォルト化

以前、JS IR コンパイラには、プロジェクトモジュールごとに[個別の `.js` ファイルを生成する機能]( https://youtrack.jetbrains.com/issue/KT-44319)がありました。
これは、プロジェクト全体に対して 1 つの `.js` ファイルを生成するデフォルトのオプションに代わるものでした。
1 つのファイルだと大きすぎて使いにくい場合があります。プロジェクトの関数を使用したいだけなのに、JS ファイル全体を依存関係として含める必要があるからです。
複数のファイルを持つことで柔軟性が高まり、そのような依存関係のサイズを小さくできます。この機能は `-Xir-per-module` コンパイラオプションで利用可能でした。

1.6.20 から、JS IR コンパイラはデフォルトでプロジェクトモジュールごとに個別の `.js` ファイルを生成するようになりました。

プロジェクトを単一の `.js` ファイルにコンパイルする機能は、引き続き以下の Gradle プロパティで利用可能です：

```none
# gradle.properties
kotlin.js.ir.output.granularity=whole-program // デフォルトは `per-module`
```

以前のリリースでは、実験的な per-module モード（`-Xir-per-module=true` フラグ経由）は各モジュールの `main()` 関数を呼び出していました。これは通常の単一 `.js` モードと矛盾していました。1.6.20 からは、どちらの場合も `main()` 関数はメインモジュールでのみ呼び出されます。モジュールがロードされたときにコードを実行する必要がある場合は、`@EagerInitialization` アノテーションを付けたトップレベルプロパティを使用できます。[IR コンパイラにおけるトップレベルプロパティのデフォルトでの遅延初期化](#lazy-initialization-of-top-level-properties-by-default-with-ir-compiler) を参照してください。

### Char クラスの最適化

`Char` クラスは、ボクシングを導入することなく Kotlin/JS コンパイラによって処理されるようになりました（[インラインクラス](inline-classes.md)と同様）。
これにより、Kotlin/JS コードにおける文字操作が高速化されます。

パフォーマンスの向上に加えて、`Char` が JavaScript にエクスポートされる方法も変更されます。現在は `Number` に変換されます。

### Export と TypeScript 宣言生成の改善

Kotlin 1.6.20 では、エクスポートメカニズム（[`@JsExport`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-export/) アノテーション）に対して、[TypeScript 宣言 (`.d.ts`) の生成](js-project-setup.md#generation-of-typescript-declaration-files-d-ts)を含め、複数の修正と改善が行われました。
インターフェースと列挙型（enum）をエクスポートする機能が追加され、以前に報告されたいくつかの特殊なケースにおけるエクスポートの動作が修正されました。
詳細については、[YouTrack のエクスポート改善リスト](https://youtrack.jetbrains.com/issues?q=Project:%20Kotlin%20issue%20id:%20KT-45434,%20KT-44494,%20KT-37916,%20KT-43191,%20KT-46961,%20KT-40236) を参照してください。

[JavaScript からの Kotlin コードの使用](js-to-kotlin-interop.md)についての詳細を確認してください。

### 非同期テストに対する @AfterTest の保証

Kotlin 1.6.20 では、[`@AfterTest`](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/-after-test/) 関数が Kotlin/JS の非同期テストで適切に動作するようになりました。
テスト関数の戻り値の型が静的に [`Promise`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-promise/) に解決される場合、コンパイラは `@AfterTest` 関数の実行を対応する [`then()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-promise/then.html) コールバックにスケジュールするようになりました。

## セキュリティ (Security)

Kotlin 1.6.20 では、コードのセキュリティを向上させるためのいくつかの機能が導入されました：

* [klib における相対パスの使用](#using-relative-paths-in-klibs)
* [Kotlin/JS Gradle プロジェクトにおける yarn.lock の永続化](#persisting-yarn-lock-for-kotlin-js-gradle-projects)
* [デフォルトでの --ignore-scripts を使用した npm 依存関係のインストール](#installation-of-npm-dependencies-with-ignore-scripts-by-default)

### klib における相対パスの使用

`klib` 形式のライブラリには、ソースファイルのシリアル化された IR 表現が[含まれており](native-libraries.md#library-format)、これには適切なデバッグ情報を生成するためのパスも含まれています。
Kotlin 1.6.20 より前では、保存されるファイルパスは絶対パスでした。ライブラリ作成者が絶対パスを共有したくない場合があるため、1.6.20 バージョンでは代替オプションが用意されました。

`klib` を公開する際にアーティファクト内でソースファイルの相対パスのみを使用したい場合は、1 つまたは複数のソースファイルのベースパスを指定して `-Xklib-relative-path-base` コンパイラオプションを渡すことができます：

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

### Kotlin/JS Gradle プロジェクトにおける yarn.lock の永続化

> この機能は Kotlin 1.6.10 にバックポートされました。
>
{style="note"}

Kotlin/JS Gradle プラグインで `yarn.lock` ファイルを永続化できるようになったため、追加の Gradle 設定なしでプロジェクトの npm 依存関係のバージョンをロックできるようになりました。
この機能により、自動生成される `kotlin-js-store` ディレクトリがプロジェクトのルートに追加され、デフォルトのプロジェクト構造が変更されます。
このディレクトリの中に `yarn.lock` ファイルが保持されます。

`kotlin-js-store` ディレクトリとその内容をバージョン管理システムにコミットすることを強くお勧めします。
ロックファイルをバージョン管理システムにコミットすることは[推奨されるプラクティス](https://classic.yarnpkg.com/blog/2016/11/24/lockfiles-for-all/)です。これにより、他のマシンの開発環境であれ、CI/CD サービスであれ、すべてのマシンでまったく同じ依存関係ツリーを使用してアプリケーションがビルドされることが保証されるためです。
ロックファイルは、新しいマシンでプロジェクトがチェックアウトされたときに npm 依存関係が勝手に更新されることも防ぎます。これはセキュリティ上の懸念事項です。

[Dependabot](https://github.com/dependabot) のようなツールも Kotlin/JS プロジェクトの `yarn.lock` ファイルを解析し、依存している npm パッケージが侵害されている場合に警告を表示できます。

必要に応じて、ビルドスクリプトでディレクトリ名とロックファイル名の両方を変更できます：

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

> ロックファイルの名前を変更すると、依存関係検査ツールがファイルを認識できなくなる可能性があります。
> 
{style="warning"}

### デフォルトでの --ignore-scripts を使用した npm 依存関係のインストール

> この機能は Kotlin 1.6.10 にバックポートされました。
>
{style="note"}

Kotlin/JS Gradle プラグインは、デフォルトで npm 依存関係のインストール中に [ライフサイクルスクリプト](https://docs.npmjs.com/cli/v8/using-npm/scripts#life-cycle-scripts) を実行しないようになりました。
この変更は、侵害された npm パッケージから悪意のあるコードが実行される可能性を減らすことを目的としています。

以前の設定に戻すには、`build.gradle(.kts)` に以下の行を追加して、ライフサイクルスクリプトの実行を明示的に有効にできます：

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

[Kotlin/JS Gradle プロジェクトの npm 依存関係](js-project-setup.md#npm-dependencies)についての詳細を確認してください。

## Gradle

Kotlin 1.6.20 では、Kotlin Gradle プラグインに以下の変更が行われました：

* Kotlin コンパイラの実行戦略を定義するための新しい [プロパティ `kotlin.compiler.execution.strategy` と `compilerExecutionStrategy`](#properties-for-defining-kotlin-compiler-execution-strategy)
* [`kapt.use.worker.api`、`kotlin.experimental.coroutines`、および `kotlin.coroutines` オプションの非推奨化](#deprecation-of-build-options-for-kapt-and-coroutines)
* [`kotlin.parallel.tasks.in.project` ビルドオプションの削除](#removal-of-the-kotlin-parallel-tasks-in-project-build-option)

### Kotlin コンパイラの実行戦略を定義するためのプロパティ

Kotlin 1.6.20 より前は、システムプロパティ `-Dkotlin.compiler.execution.strategy` を使用して Kotlin コンパイラの実行戦略を定義していました。
このプロパティは、場合によっては不便なことがありました。
Kotlin 1.6.20 では、同じ名前の Gradle プロパティ `kotlin.compiler.execution.strategy` と、コンパイルタスクプロパティ `compilerExecutionStrategy` が導入されました。

システムプロパティは引き続き動作しますが、将来のリリーズで削除される予定です。

現在のプロパティの優先順位は以下の通りです：

* タスクプロパティ `compilerExecutionStrategy` は、システムプロパティおよび Gradle プロパティ `kotlin.compiler.execution.strategy` よりも優先されます。
* Gradle プロパティは、システムプロパティよりも優先されます。

これらのプロパティに割り当てることができるコンパイラ実行戦略は 3 つあります：

| 戦略 | Kotlin コンパイラが実行される場所 | インクリメンタルコンパイル | その他の特徴 |
|----------------|--------------------------------------|-------------------------|------------------------------------------------------------------------|
| Daemon | 独自のデーモンプロセス内 | はい | *デフォルトの戦略*。異なる Gradle デーモン間で共有可能 |
| In process | Gradle デーモンプロセス内 | いいえ | Gradle デーモンとヒープを共有する可能性がある |
| Out of process | 呼び出しごとに個別のプロセス内 | いいえ | — |

したがって、`kotlin.compiler.execution.strategy` プロパティ（システムおよび Gradle の両方）に使用できる値は次の通りです：
1. `daemon` (デフォルト)
2. `in-process`
3. `out-of-process`

`gradle.properties` で Gradle プロパティ `kotlin.compiler.execution.strategy` を使用します：

```none
# gradle.properties
kotlin.compiler.execution.strategy=out-of-process
```

`compilerExecutionStrategy` タスクプロパティに使用できる値は次の通りです：

1. `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.DAEMON` (デフォルト)
2. `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.IN_PROCESS`
3. `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.OUT_OF_PROCESS`

`build.gradle.kts` ビルドスクリプトでタスクプロパティ `compilerExecutionStrategy` を使用します：

```kotlin
import org.jetbrains.kotlin.gradle.dsl.KotlinCompile
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy

// ...

tasks.withType<KotlinCompile>().configureEach {
    compilerExecutionStrategy.set(KotlinCompilerExecutionStrategy.IN_PROCESS)
}
```

フィードバックは [こちらの YouTrack タスク](https://youtrack.jetbrains.com/issue/KT-49299) でお聞かせください。

### kapt とコルーチンのビルドオプションの非推奨化

Kotlin 1.6.20 では、以下のプロパティの非推奨レベルを変更しました：

* `kapt.use.worker.api` を介して Kotlin デーモンで [kapt](kapt.md) を実行する機能が非推奨になりました。現在は Gradle の出力に警告が表示されます。
  1.3.70 リリース以降、[kapt はデフォルトで Gradle worker を使用](kapt.md#run-kapt-tasks-in-parallel)しており、この方法を維持することをお勧めします。

  将来のリリースで `kapt.use.worker.api` オプションを削除する予定です。

* Gradle DSL の `kotlin.experimental.coroutines` オプションと `gradle.properties` で使用される `kotlin.coroutines` プロパティが非推奨になりました。
  単に *サスペンド関数* を使用するか、`build.gradle(.kts)` ファイルに [`kotlinx.coroutines` 依存関係を追加](gradle-configure-project.md#set-a-dependency-on-a-kotlinx-library) してください。
  
  コルーチンの詳細については、[コルーチンガイド](coroutines-guide.md) を参照してください。

### kotlin.parallel.tasks.in.project ビルドオプションの削除

Kotlin 1.5.20 で [ビルドオプション `kotlin.parallel.tasks.in.project` の非推奨化](whatsnew1520.md#deprecation-of-the-kotlin-parallel-tasks-in-project-build-property) を発表しました。
このオプションは Kotlin 1.6.20 で削除されました。

プロジェクトによっては、Kotlin デーモンでの並列コンパイルにより、より多くのメモリが必要になる場合があります。
メモリ消費を抑えるには、[Kotlin デーモンのヒープサイズを増やして](gradle-compilation-and-caches.md#setting-kotlin-daemon-s-jvm-arguments)ください。

Kotlin Gradle プラグインで [現在サポートされているコンパイラオプション](gradle-compiler-options.md) について詳細を確認してください。