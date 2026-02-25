[//]: # (title: Kotlin 1.6.0 の新機能)

<web-summary>新しい言語機能、Kotlin Multiplatform、JVM、Native、JS への更新、および Gradle と Maven のビルドツールサポートを網羅した Kotlin 1.6.0 のリリースノートをご覧ください。</web-summary>

_[リリース日: 2021年11月16日](releases.md#release-history)_

Kotlin 1.6.0 では、新しい言語機能、既存機能の最適化と改善、および Kotlin 標準ライブラリへの多くの改善が導入されています。

変更の概要は、[リリースのブログ記事](https://blog.jetbrains.com/kotlin/2021/11/kotlin-1-6-0-is-released/)でもご確認いただけます。

> Kotlin のリリースサイクルに関する情報は、[Kotlin のリリースプロセス](releases.md)をご覧ください。
>
{style="tip"}

## 言語

Kotlin 1.6.0 では、以前の 1.5.30 リリースでプレビューとして導入されたいくつかの言語機能が安定版（Stable）になりました。
* [enum、シールド、Boolean を対象とした安定した網羅的な when 文](#stable-exhaustive-when-statements-for-enum-sealed-and-boolean-subjects)
* [スーパタイプとしての安定したサスペンド関数](#stable-suspending-functions-as-supertypes)
* [安定したサスペンド変換](#stable-suspend-conversions)
* [アノテーションクラスの安定したインスタンス化](#stable-instantiation-of-annotation-classes)

また、さまざまな型推論の改善や、クラスの型パラメータに対するアノテーションのサポートも含まれています。
* [再帰的ジェネリック型に対する型推論の改善](#improved-type-inference-for-recursive-generic-types)
* [ビルダー型推論の変更](#changes-to-builder-inference)
* [クラスの型パラメータに対するアノテーションのサポート](#support-for-annotations-on-class-type-parameters)

### enum、シールド、Boolean を対象とした安定した網羅的な when 文

_網羅的（exhaustive）_な [`when`](control-flow.md#when-expressions-and-statements) 文とは、対象のすべての可能な型や値、あるいはいくつかの型に加えて `else` 分岐を含む分岐を持つものです。すべての可能なケースをカバーするため、コードがより安全になります。

まもなく、`when` 式の動作と一貫性を持たせるために、網羅的でない `when` 文は禁止される予定です。スムーズな移行を確実にするため、Kotlin 1.6.0 では enum、シールドクラス、または Boolean を対象とする網羅的でない `when` 文について警告を報告します。これらの警告は、将来のリリースでエラーになります。

```kotlin
sealed class Contact {
    data class PhoneCall(val number: String) : Contact()
    data class TextMessage(val number: String) : Contact()
}

fun Contact.messageCost(): Int =
    when(this) { // エラー: 'when' 式は網羅的でなければなりません
        is Contact.PhoneCall -> 42
    }

fun sendMessage(contact: Contact, message: String) {
    // 1.6.0 以降

    // 警告: Boolean に対する網羅的でない 'when' 文は 1.7 で禁止されます。
    // 代わりに 'false' 分岐または 'else' 分岐を追加してください
    when(message.isEmpty()) {
        true -> return
    }
    // 警告: シールドクラス/インターフェースに対する網羅的でない 'when' 文は 1.7 で禁止されます。
    // 代わりに 'is TextMessage' 分岐または 'else' 分岐を追加してください
    when(contact) {
        is Contact.PhoneCall -> TODO()
    }
}
```

この変更とその影響に関する詳細な説明については、[こちらの YouTrack チケット](https://youtrack.jetbrains.com/issue/KT-47709)をご覧ください。

### スーパタイプとしての安定したサスペンド関数

サスペンド関数型（suspending functional types）の実装が Kotlin 1.6.0 で[安定版（Stable）](components-stability.md)になりました。プレビューは [1.5.30 で利用可能](whatsnew1530.md#suspending-functions-as-supertypes)でした。

この機能は、Kotlin コルーチンを使用し、サスペンド関数型を受け取る API を設計する際に役立ちます。サスペンド関数型を実装する独立したクラスに必要な動作を封じ込めることで、コードを合理化できるようになりました。

```kotlin
class MyClickAction : suspend () -> Unit {
    override suspend fun invoke() { TODO() }
}

fun launchOnClick(action: suspend () -> Unit) {}
```

以前はラムダやサスペンド関数の参照のみが許可されていた場所で、このクラスのインスタンスを使用できます：`launchOnClick(MyClickAction())`。

実装の詳細に起因する 2 つの制限事項が現在あります。
* スーパタイプのリストに、通常の関数型とサスペンド関数型を混在させることはできません。
* 複数のサスペンド関数型のスーパタイプを使用することはできません。

### 安定したサスペンド変換

Kotlin 1.6.0 では、通常の関数型からサスペンド関数型への[安定した（Stable）](components-stability.md)変換が導入されました。1.4.0 以降、この機能は関数リテラルと呼び出し可能参照をサポートしていました。
1.6.0 では、あらゆる形式の式で動作します。呼び出しの引数として、サスペンドが期待される場所に、適切な通常の関数型の任意の式を渡すことができるようになりました。コンパイラは暗黙的な変換を自動的に実行します。

```kotlin
fun getSuspending(suspending: suspend () -> Unit) {}

fun suspending() {}

fun test(regular: () -> Unit) {
    getSuspending { }           // OK
    getSuspending(::suspending) // OK
    getSuspending(regular)      // OK
}
```

### アノテーションクラスの安定したインスタンス化

Kotlin 1.5.30 で JVM プラットフォームにおけるアノテーションクラスのインスタンス化の試験的サポートが[導入](whatsnew1530.md#instantiation-of-annotation-classes)されました。
1.6.0 では、この機能が Kotlin/JVM と Kotlin/JS の両方でデフォルトで利用可能になりました。

アノテーションクラスのインスタンス化の詳細については、[この KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-instantiation.md) をご覧ください。

### 再帰的ジェネリック型に対する型推論の改善

Kotlin 1.5.30 では、再帰的ジェネリック型の型推論の改善が導入されました。これにより、対応する型パラメータの上限境界（upper bounds）のみに基づいて型引数を推論できるようになりました。
この改善はコンパイラオプションで利用可能でしたが、バージョン 1.6.0 以降ではデフォルトで有効になっています。

```kotlin
// 1.5.30 より前
val containerA = PostgreSQLContainer<Nothing>(DockerImageName.parse("postgres:13-alpine")).apply {
  withDatabaseName("db")
  withUsername("user")
  withPassword("password")
  withInitScript("sql/schema.sql")
}

// 1.5.30 でコンパイラオプションを使用、または 1.6.0 以降でデフォルト
val containerB = PostgreSQLContainer(DockerImageName.parse("postgres:13-alpine"))
  .withDatabaseName("db")
  .withUsername("user")
  .withPassword("password")
  .withInitScript("sql/schema.sql")
```

### ビルダー型推論の変更

ビルダー型推論（Builder inference）は、ジェネリックなビルダー関数を呼び出す際に便利な型推論の一種です。ラムダ引数内の呼び出しからの型情報を使用して、呼び出しの型引数を推論できます。

完全に安定したビルダー型推論に近づけるために、複数の変更を行っています。1.6.0 からは以下のようになります：
* [1.5.30 で導入された](whatsnew1530.md#eliminating-builder-inference-restrictions) `-Xunrestricted-builder-inference` コンパイラオプションを指定せずに、ビルダーラムダ内でまだ推論されていない型のインスタンスを返す呼び出しを行うことができます。
* `-Xenable-builder-inference` を使用すると、[`@BuilderInference`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-builder-inference/) アノテーションを適用せずに独自のビルダーを作成できます。

    > これらのビルダーのクライアントも、同じ `-Xenable-builder-inference` コンパイラオプションを指定する必要があることに注意してください。
    >
    {style="warning"}

* `-Xenable-builder-inference` を使用すると、通常の型推論で型に関する十分な情報を得られない場合に、ビルダー型推論が自動的に有効になります。

[カスタムジェネリックビルダーの作成方法を学ぶ](using-builders-with-builder-inference.md)。

### クラスの型パラメータに対するアノテーションのサポート

クラスの型パラメータに対するアノテーションのサポートは以下のようになります：

```kotlin
@Target(AnnotationTarget.TYPE_PARAMETER)
annotation class BoxContent

class Box<@BoxContent T> {}
```

すべての型パラメータに対するアノテーションは JVM バイトコードに出力されるため、アノテーションプロセッサがそれらを使用することが可能です。

動機となったユースケースについては、こちらの [YouTrack チケット](https://youtrack.jetbrains.com/issue/KT-43714) をお読みください。

[アノテーション](annotations.md)についての詳細はこちらをご覧ください。

## 以前の API バージョンのサポート期間の延長

Kotlin 1.6.0 以降、現在の安定版に加えて、以前の 2 つではなく 3 つの API バージョンの開発をサポートします。現在は、バージョン 1.3、1.4、1.5、1.6 をサポートしています。

## Kotlin/JVM

Kotlin/JVM では、1.6.0 からコンパイラが JVM 17 に対応するバイトコードバージョンのクラスを生成できるようになりました。新しい言語バージョンには、ロードマップにあった最適化された委譲プロパティと繰り返し可能なアノテーションも含まれています。
* [1.8 JVM ターゲット向けの実行時保持（runtime retention）を備えた繰り返し可能なアノテーション](#repeatable-annotations-with-runtime-retention-for-1-8-jvm-target)
* [指定された KProperty インスタンスの get/set を呼び出す委譲プロパティの最適化](#optimize-delegated-properties-which-call-get-set-on-the-given-kproperty-instance)

### 1.8 JVM ターゲット向けの実行時保持（runtime retention）を備えた繰り返し可能なアノテーション

Java 8 では、単一のコード要素に複数回適用できる[繰り返し可能なアノテーション（repeatable annotations）](https://docs.oracle.com/javase/tutorial/java/annotations/repeating.html)が導入されました。
この機能では、Java コードに 2 つの宣言が存在する必要があります。[`@java.lang.annotation.Repeatable`](https://docs.oracle.com/javase/8/docs/api/java/lang/annotation/Repeatable.html) でマークされた繰り返し可能なアノテーション自体と、その値を保持するための包含アノテーション（containing annotation）です。

Kotlin にも繰り返し可能なアノテーションがありますが、アノテーション宣言を繰り返し可能にするために必要なのは [`@kotlin.annotation.Repeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/) だけです。
1.6.0 より前では、この機能は `SOURCE` 保持（retention）のみをサポートしており、Java の繰り返し可能なアノテーションとは互換性がありませんでした。
Kotlin 1.6.0 では、これらの制限が解消されました。`@kotlin.annotation.Repeatable` はあらゆる保持（retention）を受け入れるようになり、Kotlin と Java の両方でアノテーションを繰り返し可能にします。
Java の繰り返し可能なアノテーションも、Kotlin 側からサポートされるようになりました。

包含アノテーションを宣言することもできますが、必須ではありません。例えば：
* アノテーション `@Tag` が `@kotlin.annotation.Repeatable` でマークされている場合、Kotlin コンパイラは自動的に `@Tag.Container` という名前で包含アノテーションクラスを生成します：

    ```kotlin
    @Repeatable 
    annotation class Tag(val name: String)

    // コンパイラは @Tag.Container 包含アノテーションを生成します
    ```

* 包含アノテーションにカスタム名を指定するには、[`@kotlin.jvm.JvmRepeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvmrepeatable/) メタアノテーションを適用し、明示的に宣言された包含アノテーションクラスを引数として渡します：

    ```kotlin
    @JvmRepeatable(Tags::class)
    annotation class Tag(val name: String)
    
    annotation class Tags(val value: Array<Tag>)
    ```

Kotlin リフレクションは、新しい関数 [`KAnnotatedElement.findAnnotations()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/find-annotations.html) を介して、Kotlin と Java の両方の繰り返し可能なアノテーションをサポートするようになりました。

Kotlin の繰り返し可能なアノテーションの詳細については、[この KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/repeatable-annotations.md) をご覧ください。

### 指定された KProperty インスタンスの get/set を呼び出す委譲プロパティの最適化

`$delegate` フィールドを省略し、参照されるプロパティに直接アクセスするように生成することで、生成される JVM バイトコードを最適化しました。

例えば、以下のコードにおいて：

```kotlin
class Box<T> {
    private var impl: T = ...

    var content: T by ::impl
}
```

Kotlin はフィールド `content$delegate` を生成しなくなりました。
`content` 変数のプロパティアクセサは `impl` 変数を直接呼び出し、委譲プロパティの `getValue`/`setValue` オペレータをスキップするため、[`KProperty`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-property/index.html) 型のプロパティ参照オブジェクトが不要になります。

この実装に協力してくれた Google の同僚に感謝します！

[委譲プロパティ](delegated-properties.md)の詳細はこちらをご覧ください。

## Kotlin/Native

Kotlin/Native は、プレビュー状態のものも含め、複数の改善とコンポーネントのアップデートを受けています。
* [新しいメモリマネージャのプレビュー](#preview-of-the-new-memory-manager)
* [Xcode 13 のサポート](#support-for-xcode-13)
* [任意のホスト上での Windows ターゲットのコンパイル](#compilation-of-windows-targets-on-any-host)
* [LLVM およびリンカーのアップデート](#llvm-and-linker-updates)
* [パフォーマンスの向上](#performance-improvements)
* [JVM および JS IR バックエンドと統合されたコンパイラプラグイン ABI](#unified-compiler-plugin-abi-with-jvm-and-js-ir-backends)
* [klib リンケージ失敗の詳細なエラーメッセージ](#detailed-error-messages-for-klib-linkage-failures)
* [再構成された未処理例外処理 API](#reworked-unhandled-exception-handling-api)

### 新しいメモリマネージャのプレビュー

> 新しい Kotlin/Native メモリマネージャは[試験的（Experimental）](components-stability.md)です。
> いつでも廃止または変更される可能性があります。オプトインが必要です（詳細は以下を参照）。評価目的でのみ使用してください。
> フィードバックは [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) でお待ちしております。
>
{style="warning"}

Kotlin 1.6.0 では、新しい Kotlin/Native メモリマネージャの開発プレビューを試すことができます。
これにより、マルチプラットフォームプロジェクトにおいて一貫した開発者体験を提供するために、JVM と Native プラットフォーム間の差異をなくすことに一歩近づきました。

注目すべき変更点の 1 つは、Kotlin/JVM のようなトップレベルプロパティの遅延初期化です。トップレベルプロパティは、同じファイル内のトップレベルプロパティまたは関数が初めてアクセスされたときに初期化されます。
このモードには、冗長な初期化チェックを削除するグローバルなインタープロシージャル最適化（リリースバイナリでのみ有効）も含まれています。

最近、新しいメモリマネージャに関する[ブログ記事](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/)を公開しました。
そちらを読んで、新しいメモリマネージャの現在の状態を確認したり、デモプロジェクトを見つけたりしてください。すぐに試したい場合は、[移行手順](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/NEW_MM.md)へ進んでください。
ご自身のプロジェクトで新しいメモリマネージャがどのように動作するかを確認し、イシュートラッカーの [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) でフィードバックを共有してください。

### Xcode 13 のサポート

Kotlin/Native 1.6.0 は、Xcode の最新バージョンである Xcode 13 をサポートしています。Xcode をアップデートして、Apple オペレーティングシステム向けの Kotlin プロジェクトの作業を続けてください。

> Xcode 13 で追加された新しいライブラリは Kotlin 1.6.0 では使用できませんが、今後のバージョンでサポートを追加する予定です。
>
{style="note"}

### 任意のホスト上での Windows ターゲットのコンパイル

1.6.0 からは、Windows ターゲットの `mingwX64` および `mingwX86` をコンパイルするために Windows ホストは必要ありません。Kotlin/Native をサポートする任意のホストでコンパイルできます。

### LLVM およびリンカーのアップデート

Kotlin/Native が内部で使用している LLVM 依存関係を再構成しました。これにより、以下のようなさまざまな利点が得られます。
* LLVM バージョンを 11.1.0 にアップデート。
* 依存関係のサイズを削減。例えば macOS では、以前のバージョンの約 1200 MB から約 300 MB になりました。
* モダンな Linux ディストリビューションでは利用できない [`ncurses5` ライブラリへの依存を排除](https://youtrack.jetbrains.com/issue/KT-42693)。

LLVM のアップデートに加えて、Kotlin/Native は MingGW ターゲットに対して [LLD](https://lld.llvm.org/) リンカー（LLVM プロジェクトのリンカー）を使用するようになりました。
これにより、以前使用されていた ld.bfd リンカーよりもさまざまな利点が得られ、生成されるバイナリの実行時パフォーマンスの向上や、MinGW ターゲットのコンパイラキャッシュのサポートが可能になります。
LLD では [DLL リンケージのためのインポートライブラリが必要](whatsnew1530.md#deprecation-of-linkage-against-dlls-without-import-libraries-for-mingw-targets)であることに注意してください。
詳細は、[こちらの Stack Overflow スレッド](https://stackoverflow.com/questions/3573475/how-does-the-import-library-work-details/3573527/#3573527)をご覧ください。

### パフォーマンスの向上

Kotlin/Native 1.6.0 では、以下のパフォーマンス向上が実現されています。

* コンパイル時間: `linuxX64` および `iosArm64` ターゲットに対してコンパイラキャッシュがデフォルトで有効になりました。
これにより、デバッグモードでのほとんどのコンパイルが高速化されます（最初の 1 回を除く）。測定の結果、テストプロジェクトでは約 200% の速度向上が見られました。
コンパイラキャッシュは Kotlin 1.5.0 から [追加の Gradle プロパティ](whatsnew15.md#performance-improvements) で利用可能でしたが、今後はそれらを削除して構いません。
* 実行時: 生成される LLVM コードの最適化により、`for` ループによる配列の反復処理が最大 12% 高速化されました。

### JVM および JS IR バックエンドと統合されたコンパイラプラグイン ABI

> Kotlin/Native で共通の IR コンパイラプラグイン ABI を使用するオプションは[試験的（Experimental）](components-stability.md)です。
> いつでも廃止または変更される可能性があります。オプトインが必要です（詳細は以下を参照）。評価目的でのみ使用してください。
> フィードバックは [YouTrack](https://youtrack.jetbrains.com/issue/KT-48595) でお待ちしております。
>
{style="warning"}

以前のバージョンでは、ABI の違いにより、コンパイラプラグインの作成者は Kotlin/Native 用に別のアーティファクトを提供する必要がありました。

1.6.0 からは、Kotlin Multiplatform Gradle プラグインが、JVM および JS IR バックエンドで使用されるものと同じ埋め込み可能（embeddable）なコンパイラ jar を Kotlin/Native で使用できるようになりました。
これにより、Native と他のサポートされているプラットフォームで同じコンパイラプラグインのアーティファクトを使用できるようになるため、コンパイラプラグイン開発体験の統合に向けた一歩となります。

これはこのサポートのプレビューバージョンであり、オプトインが必要です。
Kotlin/Native で汎用コンパイラプラグインアーティファクトの使用を開始するには、`gradle.properties` に `kotlin.native.useEmbeddableCompilerJar=true` という行を追加してください。

将来的には Kotlin/Native でデフォルトで埋め込み可能なコンパイラ jar を使用する予定ですので、プレビューがどのように動作するかについてフィードバックをいただくことが非常に重要です。

コンパイラプラグインの作成者の方は、このモードを試して、ご自身のプラグインで動作するかどうかを確認してください。
プラグインの構造によっては、移行手順が必要になる場合があることに注意してください。移行手順については [こちらの YouTrack イシュー](https://youtrack.jetbrains.com/issue/KT-48595) を参照し、コメントでフィードバックを残してください。

### klib リンケージ失敗の詳細なエラーメッセージ

Kotlin/Native コンパイラは、klib リンケージエラーに対して詳細なエラーメッセージを提供するようになりました。
メッセージには明確なエラーの説明が含まれ、考えられる原因と修正方法に関する情報も含まれています。

例：
* 1.5.30:

    ```text
    e: java.lang.IllegalStateException: IrTypeAliasSymbol expected: Unbound public symbol for public kotlinx.coroutines/CancellationException|null[0]
    <stack trace>
    ```

* 1.6.0:

    ```text
    e: The symbol of unexpected type encountered during IR deserialization: IrClassPublicSymbolImpl, kotlinx.coroutines/CancellationException|null[0].
    IrTypeAliasSymbol is expected.
    
    This could happen if there are two libraries, where one library was compiled against the different version of the other library than the one currently used in the project.
    Please check that the project configuration is correct and has consistent versions of dependencies.
    
    The list of libraries that depend on "org.jetbrains.kotlinx:kotlinx-coroutines-core (org.jetbrains.kotlinx:kotlinx-coroutines-core-macosx64)" and may lead to conflicts:
    <list of libraries and potential version mismatches>
    
    Project dependencies:
    <dependencies tree>
    ```

### 再構成された未処理例外処理 API

Kotlin/Native ランタイム全体で未処理例外の処理を統合し、デフォルトの処理を関数 `processUnhandledException(throwable: Throwable)` として公開しました。これにより、`kotlinx.coroutines` のようなカスタム実行環境で使用できるようになります。
この処理は `Worker.executeAfter()` での操作から漏れた例外にも適用されますが、新しい [メモリマネージャ](#preview-of-the-new-memory-manager) の場合に限られます。

API の改善は、`setUnhandledExceptionHook()` によって設定されたフックにも影響を与えました。以前は、Kotlin/Native ランタイムが未処理例外とともにフックを呼び出した後、そのようなフックはリセットされ、プログラムは常に直後に終了していました。
今後は、これらのフックを複数回使用できるようになりました。未処理例外が発生したときにプログラムを常に終了させたい場合は、未処理例外フックを設定しない（`setUnhandledExceptionHook()` を呼び出さない）か、フックの最後で必ず `terminateWithUnhandledException()` を呼び出すようにしてください。
これにより、例外をサードパーティのクラッシュレポートサービス（Firebase Crashlytics など）に送信してからプログラムを終了させるといったことが可能になります。
`main()` から漏れた例外やインターオペラビリティ（interop）の境界を越える例外は、フックが `terminateWithUnhandledException()` を呼び出さなかったとしても、常にプログラムを終了させます。

## Kotlin/JS

Kotlin/JS コンパイラの IR バックエンドを安定させるための作業を続けています。
Kotlin/JS に [Node.js と Yarn のダウンロードを無効にするオプション](#option-to-use-pre-installed-node-js-and-yarn)が追加されました。

### インストール済みの Node.js と Yarn を使用するオプション

Kotlin/JS プロジェクトをビルドする際に Node.js と Yarn のダウンロードを無効にし、ホストに既にインストールされているインスタンスを使用できるようになりました。
これは、CI サーバーなど、インターネット接続のないサーバーでビルドする場合に便利です。

外部コンポーネントのダウンロードを無効にするには、`build.gradle(.kts)` に以下の行を追加します。

* Yarn:

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">
    
    ```kotlin
    rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> {
        rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().download = false // デフォルトの動作にする場合は true
    }
    ```
    
    </tab>
    <tab title="Groovy" group-key="groovy">
    
    ```groovy
    rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
        rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).download = false
    }
    ```
    
    </tab>
    </tabs>

* Node.js:

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">
    
    ```kotlin
    rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootPlugin> {
        rootProject.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootExtension>().download = false // デフォルトの動作にする場合は true
    }
     
    ```
    
    </tab>
    <tab title="Groovy" group-key="groovy">
    
    ```groovy
    rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootPlugin) {
        rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootExtension).download = false
    }
    ```
    
    </tab>
    </tabs>

## Kotlin Gradle プラグイン

Kotlin 1.6.0 では、`KotlinGradleSubplugin` クラスの非推奨レベルを 'ERROR' に変更しました。
このクラスはコンパイラプラグインの作成に使用されていました。今後のリリースで、このクラスを削除する予定です。代わりに `KotlinCompilerPluginSupportPlugin` クラスを使用してください。

`kotlin.useFallbackCompilerSearch` ビルドオプション、および `noReflect` と `includeRuntime` コンパイラオプションを削除しました。
`useIR` コンパイラオプションは非表示になり、今後のリリースで削除される予定です。

Kotlin Gradle プラグインにおける[現在サポートされているコンパイラオプション](gradle-compiler-options.md)の詳細をご覧ください。

## 標準ライブラリ

標準ライブラリの新しい 1.6.0 バージョンでは、試験的な機能が安定版になり、新しい機能が導入され、各プラットフォーム間での動作が統一されました。

* [新しい readline 関数](#new-readline-functions)
* [安定した typeOf()](#stable-typeof)
* [安定したコレクションビルダー](#stable-collection-builders)
* [安定した Duration API](#stable-duration-api)
* [Regex をシーケンスに分割](#splitting-regex-into-a-sequence)
* [整数のビット回転操作](#bit-rotation-operations-on-integers)
* [JS における replace() と replaceFirst() の変更](#changes-for-replace-and-replacefirst-in-js)
* [既存 API の改善](#improvements-to-the-existing-api)
* [非推奨](#deprecations)

### 新しい readline 関数

Kotlin 1.6.0 では、標準入力を処理するための新しい関数 [`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html) と [`readlnOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln-or-null.html) が提供されています。

> 現在のところ、新しい関数は JVM と Native ターゲットプラットフォームでのみ利用可能です。
>
{style="note"}

|**以前のバージョン**|**1.6.0 の代替**|**使用法**|
| --- | --- | --- |
|`readLine()!!`|`readln()`| stdin から 1 行読み取って返し、EOF に達した場合は `RuntimeException` をスローします。 |
|`readLine()`|`readlnOrNull()`| stdin から 1 行読み取って返し、EOF に達した場合は `null` を返します。 |

1 行を読み取る際に `!!` を使用する必要をなくすことは、初心者にとっての体験を向上させ、Kotlin の教育を簡素化すると考えています。
読み取り操作の名前を `println()` と一貫性を持たせるため、新しい関数の名前を 'ln' に短縮することにしました。

```kotlin
println("ニックネームは何ですか？")
val nickname = readln()
println("こんにちは、$nickname！")
```

```kotlin
fun main() {
//sampleStart
    var sum = 0
    while (true) {
        val nextLine = readlnOrNull().takeUnless { 
            it.isNullOrEmpty() 
        } ?: break
        sum += nextLine.toInt()
    }
    println(sum)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.6"}

既存の `readLine()` 関数は、IDE のコード補完において `readln()` や `readlnOrNull()` よりも優先順位が低くなります。
IDE のインスペクションでも、レガシーな `readLine()` の代わりに新しい関数を使用することが推奨されます。

将来のリリースで、`readLine()` 関数を段階的に非推奨にする予定です。

### 安定した typeOf()

バージョン 1.6.0 では、[安定した（Stable）](components-stability.md) [`typeOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/type-of.html) 関数が導入され、[主要なロードマップ項目](https://youtrack.jetbrains.com/issue/KT-45396)の 1 つが完了しました。

[1.3.40 以降](https://blog.jetbrains.com/kotlin/2019/06/kotlin-1-3-40-released/)、`typeOf()` は JVM プラットフォームで試験的 API として利用可能でした。
今後は、任意の Kotlin プラットフォームでこれを使用し、コンパイラが推論できる任意の Kotlin 型の [`KType`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-type/#kotlin.reflect.KType) 表現を取得できます。

```kotlin
inline fun <reified T> renderType(): String {
    val type = typeOf<T>()
    return type.toString()
}

fun main() {
    val fromExplicitType = typeOf<Int>()
    val fromReifiedType = renderType<List<Int>>()
}
```

### 安定したコレクションビルダー

Kotlin 1.6.0 では、コレクションビルダー関数が[安定版（Stable）](components-stability.md)に昇格しました。コレクションビルダーから返されるコレクションは、読み取り専用の状態でシリアル化可能になりました。

[`buildMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-map.html)、[`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html)、および [`buildSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-set.html) をオプトインアノテーションなしで使用できるようになりました。

```kotlin
fun main() {
//sampleStart
    val x = listOf('b', 'c')
    val y = buildList {
        add('a')
        addAll(x)
        add('d')
    }
    println(y)  // [a, b, c, d]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}

### 安定した Duration API

さまざまな時間単位で期間の量を表すための [Duration](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/) クラスが、[安定版（Stable）](components-stability.md)に昇格しました。1.6.0 では、Duration API に以下の変更が加えられました。

* 期間を日、時間、分、秒、ナノ秒に分解する [`toComponents()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-components.html) 関数の最初のコンポーネントが、`Int` 型ではなく `Long` 型になりました。
  以前は、値が `Int` の範囲に収まらない場合、その範囲に丸められていました。`Long` 型を使用することで、`Int` に収まらない値を切り捨てることなく、期間の範囲内の任意の値を分解できるようになりました。

* `DurationUnit` 列挙型は独立したものになり、JVM 上で `java.util.concurrent.TimeUnit` の型エイリアスではなくなりました。
  `typealias DurationUnit = TimeUnit` であることが有用となる説得力のあるケースが見つからなかったためです。また、型エイリアスを通じて `TimeUnit` API を公開すると、`DurationUnit` ユーザーを混乱させる可能性があります。

* コミュニティからのフィードバックに応え、`Int.seconds` のような拡張プロパティを復活させます。ただし、その適用範囲を制限したいため、`Duration` クラスのコンパニオンオブジェクトに配置しました。
  IDE は補完で拡張機能を提案し、コンパニオンからのインポートを自動的に挿入できますが、将来的には `Duration` 型が期待される場合にのみ、この動作を制限する予定です。

  ```kotlin
  import kotlin.time.Duration.Companion.seconds
  
  fun main() {
  //sampleStart
      val duration = 10000
      println("$duration 秒は ${duration.seconds.inWholeMinutes} 分です")
      // 10000 秒は 166 分です
//sampleEnd
  }
  ```
  {kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}
  
  以前に導入されたコンパニオン関数（`Duration.seconds(Int)` など）や、非推奨となったトップレベルの拡張（`Int.seconds` など）を、`Duration.Companion` の新しい拡張に置き換えることをお勧めします。

  > このような置き換えにより、古いトップレベル拡張と新しいコンパニオン拡張の間で曖昧さが生じる可能性があります。
  > 自動移行を行う前に、`import kotlin.time.*` のように kotlin.time パッケージをワイルドカードインポートするようにしてください。
  >
  {style="note"}

### Regex をシーケンスに分割

`Regex.splitToSequence(CharSequence)` と `CharSequence.splitToSequence(Regex)` 関数が [安定版（Stable）](components-stability.md) に昇格しました。
これらは、指定された正規表現の正規表現に一致する箇所の前後で文字列を分割しますが、結果を [Sequence](sequences.md) として返すため、この結果に対するすべての操作は遅延実行されます。

```kotlin
fun main() {
//sampleStart
    val colorsText = "green, red, brown&blue, orange, pink&green"
    val regex = "[,\\s]+".toRegex()
    val mixedColor = regex.splitToSequence(colorsText)
    // または
    // val mixedColor = colorsText.splitToSequence(regex)
        .onEach { println(it) }
        .firstOrNull { it.contains('&') }
    println(mixedColor) // "brown&blue"
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}

### 整数のビット回転操作

Kotlin 1.6.0 では、ビット操作のための `rotateLeft()` および `rotateRight()` 関数が [安定版（Stable）](components-stability.md) になりました。
これらの関数は、数値のバイナリ表現を指定されたビット数だけ左または右に回転させます。

```kotlin
fun main() {
//sampleStart
    val number: Short = 0b10001
    println(number
        .rotateRight(2)
        .toString(radix = 2)) // 100000000000100
    println(number
        .rotateLeft(2)
        .toString(radix = 2))  // 1000100
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.6"}

### JS における replace() と replaceFirst() の変更

Kotlin 1.6.0 より前、置換文字列にグループ参照が含まれている場合、[`replace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/replace.html) と [`replaceFirst()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/replace-first.html) の Regex 関数は Java と JS で動作が異なっていました。
すべてのターゲットプラットフォームで動作を一貫させるため、JS での実装を変更しました。

置換文字列内の `${name}` または `$index` の出現箇所は、指定されたインデックスまたは名前を持つキャプチャされたグループに対応する部分シーケンスに置換されます。
* `$index` – '
    ``` の直後の最初の数字は常にグループ参照の一部として扱われます。後続の数字は、有効なグループ参照を形成する場合にのみ `index` に組み込まれます。'0'～'9' の数字のみがグループ参照の潜在的な構成要素と見なされます。キャプチャされたグループのインデックスは '1' から始まることに注意してください。
  インデックス '0' のグループは、一致した全体を表します。
* `${name}` – `name` は英字 'a'～'z'、'A'～'Z'、または数字 '0'～'9' で構成できます。最初の文字は英字である必要があります。

    > 置換パターンにおける名前付きグループは、現在 JVM でのみサポートされています。
    >
    {style="note"}

* 置換文字列内で後続の文字をリテラルとして含めるには、バックスラッシュ文字 `\` を使用します。

    ```kotlin
    fun main() {
    //sampleStart
        println(Regex("(.+)").replace("Kotlin", """\$ $1""")) // $ Kotlin
        println(Regex("(.+)").replaceFirst("1.6.0", """\\ $1""")) // \ 1.6.0
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.6"}

    置換文字列をリテラル文字列として扱う必要がある場合は、[`Regex.escapeReplacement()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/escape-replacement.html) を使用できます。

### 既存 API の改善

* バージョン 1.6.0 では、`Comparable.compareTo()` の中置（infix）拡張関数が追加されました。2 つのオブジェクトの順序を比較するために、中置形式を使用できるようになりました。

    ```kotlin
     class WrappedText(val text: String) : Comparable<WrappedText> {
         override fun compareTo(other: WrappedText): Int =
             this.text compareTo other.text
    }
    ```

* JS における `Regex.replace()` も、すべてのプラットフォームで実装を統一するため、インラインではなくなりました。
* `compareTo()` および `equals()` String 関数、および `isBlank()` CharSequence 関数は、JS において JVM とまったく同じように動作するようになりました。
  以前は、非 ASCII 文字に関して差異がありました。

### 非推奨

Kotlin 1.6.0 では、一部の JS 専用の stdlib API について、警告を伴う非推奨サイクルを開始します。

#### concat()、match()、および matches() 文字列関数

* 文字列を、指定された別のオブジェクトの文字列表現と連結するには、`concat()` の代わりに `plus()` を使用してください。
* 入力内の正規表現のすべての出現箇所を見つけるには、`String.match(regex: String)` の代わりに Regex クラスの `findAll()` を使用してください。
* 正規表現が入力全体と一致するかどうかを確認するには、`String.matches(regex: String)` の代わりに Regex クラスの `matches()` を使用してください。

#### 比較関数を取る配列の sort()

比較関数によって渡された順序に従って配列をソートしていた、`Array<out T>.sort()` 関数およびインライン関数 `ByteArray.sort()`、`ShortArray.sort()`、`IntArray.sort()`、`LongArray.sort()`、`FloatArray.sort()`、`DoubleArray.sort()`、`CharArray.sort()` を非推奨にしました。
配列のソートには、他の標準ライブラリ関数を使用してください。

詳細は [コレクションの順序付け](collection-ordering.md) セクションを参照してください。

## ツール

### Kover – Kotlin 用コードカバレッジツール

> Kover Gradle プラグインは試験的（Experimental）です。フィードバックは [GitHub](https://github.com/Kotlin/kotlinx-kover/issues) でお待ちしております。
>
{style="warning"}

Kotlin 1.6.0 では、[IntelliJ](https://github.com/JetBrains/intellij-coverage) および [JaCoCo](https://github.com/jacoco/jacoco) Kotlin コードカバレッジエージェント用の Gradle プラグインである Kover を導入します。
インライン関数を含む、すべての言語構造で動作します。

Kover の詳細については、[GitHub リポジトリ](https://github.com/Kotlin/kotlinx-kover) またはこちらのビデオをご覧ください。

<video src="https://www.youtube.com/v/jNu5LY9HIbw" title="Kover – The Code Coverage Plugin"/>

## Coroutines 1.6.0-RC

`kotlinx.coroutines` [1.6.0-RC](https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.6.0-RC) が公開され、複数の機能と改善が含まれています。

* [新しい Kotlin/Native メモリマネージャ](#preview-of-the-new-memory-manager)のサポート
* 追加のスレッドを作成せずに並列性を制限できる dispatcher _views_ API の導入
* Java 6 から Java 8 ターゲットへの移行
* 新しく再構成された API とマルチプラットフォームをサポートした `kotlinx-coroutines-test`
* [`ThreadLocal`](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/ThreadLocal.html) 変数へのスレッドセーフな書き込みアクセスをコルーチンに提供する [`CopyableThreadContextElement`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-copyable-thread-context-element/index.html) の導入

詳細は [チェンジログ](https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.6.0-RC) をご覧ください。

## Kotlin 1.6.0 への移行

IntelliJ IDEA と Android Studio は、Kotlin プラグイン 1.6.0 が利用可能になると、そのアップデートを提案します。

既存のプロジェクトを Kotlin 1.6.0 に移行するには、Kotlin バージョンを `1.6.0` に変更し、Gradle または Maven プロジェクトを再インポートしてください。[Kotlin 1.6.0 へのアップデート方法を学ぶ](releases.md#update-to-a-new-kotlin-version)。

Kotlin 1.6.0 で新しいプロジェクトを開始するには、Kotlin プラグインを更新し、**File** | **New** | **Project** からプロジェクトウィザードを実行します。

新しいコマンドラインコンパイラは、[GitHub のリリースページ](https://github.com/JetBrains/kotlin/releases/tag/v1.6.0)からダウンロード可能です。

Kotlin 1.6.0 は [フィーチャーリリース](kotlin-evolution-principles.md#language-and-tooling-releases) であるため、以前のバージョンの言語で書かれたコードと互換性のない変更が含まれる可能性があります。
そのような変更の詳細なリストについては、[Kotlin 1.6 互換性ガイド](compatibility-guide-16.md) を参照してください。