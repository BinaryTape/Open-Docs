[//]: # (title: Kotlin 1.6.0 の新機能)

公開日: 2021年11月16日](releases.md#release-details)

Kotlin 1.6.0 では、新しい言語機能、既存機能の最適化と改善、そしてKotlin標準ライブラリへの多数の改善が導入されています。

変更点の概要については、[リリースブログ記事](https://blog.jetbrains.com/kotlin/2021/11/kotlin-1-6-0-is-released/)でもご確認いただけます。

## 言語

Kotlin 1.6.0 では、前回の1.5.30リリースでプレビューとして導入されたいくつかの言語機能が安定化されました。
* [enum、sealed、Boolean を対象とする when ステートメントの安定化](#stable-exhaustive-when-statements-for-enum-sealed-and-boolean-subjects)
* [サスペンド関数をスーパークラスとして使用する機能の安定化](#stable-suspending-functions-as-supertypes)
* [サスペンド変換の安定化](#stable-suspending-functions-as-supertypes)
* [アノテーションクラスのインスタンス化の安定化](#stable-instantiation-of-annotation-classes)

また、さまざまな型推論の改善と、クラス型パラメータに対するアノテーションのサポートも含まれています。
* [再帰ジェネリック型の型推論の改善](#improved-type-inference-for-recursive-generic-types)
* [ビルダー推論の変更](#changes-to-builder-inference)
* [クラス型パラメータに対するアノテーションのサポート](#support-for-annotations-on-class-type-parameters)

### enum、sealed、Boolean を対象とする when ステートメントの安定化

`_exhaustive_` (網羅的な) [`when`](control-flow.md#when-expressions-and-statements) ステートメントには、その対象のすべての可能な型または値、あるいは一部の型と `else` ブランチの分岐が含まれます。これにより、すべての可能なケースがカバーされ、コードの安全性が向上します。

`when` 式との動作の一貫性を保つため、網羅的でない `when` ステートメントはまもなく禁止されます。スムーズな移行を確実にするため、Kotlin 1.6.0 では、enum、sealed、または Boolean を対象とする網羅的でない `when` ステートメントに対して警告を報告します。これらの警告は、将来のリリースではエラーになります。

```kotlin
sealed class Contact {
    data class PhoneCall(val number: String) : Contact()
    data class TextMessage(val number: String) : Contact()
}

fun Contact.messageCost(): Int =
    when(this) { // エラー: 'when' 式は網羅的である必要があります
        is Contact.PhoneCall -> 42
    }

fun sendMessage(contact: Contact, message: String) {
    // 1.6.0 から

    // 警告: Boolean に対する網羅的でない 'when' ステートメントは
    // 1.7 で禁止されます。代わりに 'false' ブランチまたは 'else' ブランチを追加してください
    when(message.isEmpty()) {
        true -> return
    }
    // 警告: sealed クラス/インターフェースに対する網羅的でない 'when' ステートメントは
    // 1.7 で禁止されます。代わりに 'is TextMessage' ブランチまたは 'else' ブランチを追加してください
    when(contact) {
        is Contact.PhoneCall -> TODO()
    }
}
```

この変更とその影響に関する詳細な説明については、[こちらの YouTrack チケット](https://youtrack.jetbrains.com/issue/KT-47709)を参照してください。

### サスペンド関数をスーパークラスとして使用する機能の安定化

サスペンド関数型の実装は、Kotlin 1.6.0 で[安定化](components-stability.md)されました。[1.5.30 でプレビュー](whatsnew1530.md#suspending-functions-as-supertypes)として利用可能でした。

この機能は、Kotlin コルーチンを使用し、サスペンド関数型を受け入れる API を設計する際に役立ちます。サスペンド関数型を実装する別のクラスに必要な動作をカプセル化することで、コードを簡素化できるようになりました。

```kotlin
class MyClickAction : suspend () -> Unit {
    override suspend fun invoke() { TODO() }
}

fun launchOnClick(action: suspend () -> Unit) {}
```

以前はラムダとサスペンド関数参照のみが許可されていた場所で、このクラスのインスタンスを使用できます: `launchOnClick(MyClickAction())`。

現在、実装の詳細に起因する2つの制限があります。
* スーパークラスのリストで通常の関数型とサスペンド関数型を混在させることはできません。
* 複数のサスペンド関数スーパークラスを使用することはできません。

### サスペンド変換の安定化

Kotlin 1.6.0 では、通常の関数型からサスペンド関数型への[安定版](components-stability.md)変換が導入されました。1.4.0 から、この機能は関数リテラルと callable 参照をサポートしていました。1.6.0 からは、あらゆる形式の式で動作します。呼び出し引数として、サスペンド型が期待される場所に、適切な通常の関数型のあらゆる式を渡すことができるようになりました。コンパイラが自動的に暗黙的な変換を実行します。

```kotlin
fun getSuspending(suspending: suspend () -> Unit) {}

fun suspending() {}

fun test(regular: () -> Unit) {
    getSuspending { }           // OK
    getSuspending(::suspending) // OK
    getSuspending(regular)      // OK
}
```

### アノテーションクラスのインスタンス化の安定化

Kotlin 1.5.30 では、JVM プラットフォームでのアノテーションクラスのインスタンス化の試験的なサポートが[導入されました](whatsnew1530.md#instantiation-of-annotation-classes)。1.6.0 からは、Kotlin/JVM と Kotlin/JS の両方でこの機能がデフォルトで利用可能です。

アノテーションクラスのインスタンス化の詳細については、[この KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-instantiation.md) を参照してください。

### 再帰ジェネリック型の型推論の改善

Kotlin 1.5.30 では、再帰ジェネリック型に対する型推論の改善が導入され、対応する型パラメータの上限のみに基づいて型引数を推論できるようになりました。この改善はコンパイラオプションで利用可能でした。バージョン 1.6.0 以降では、デフォルトで有効になっています。

```kotlin
// Before 1.5.30
val containerA = PostgreSQLContainer<Nothing>(DockerImageName.parse("postgres:13-alpine")).apply {
  withDatabaseName("db")
  withUsername("user")
  withPassword("password")
  withInitScript("sql/schema.sql")
}

// With compiler option in 1.5.30 or by default starting with 1.6.0
val containerB = PostgreSQLContainer(DockerImageName.parse("postgres:13-alpine"))
  .withDatabaseName("db")
  .withUsername("user")
  .withPassword("password")
  .withInitScript("sql/schema.sql")
```

### ビルダー推論の変更

ビルダー推論は、ジェネリックビルダー関数を呼び出す際に役立つ型推論の一種です。ラムダ引数内の呼び出しからの型情報を使用して、呼び出しの型引数を推論できます。

完全な安定版ビルダー推論に近づくための複数の変更を行っています。1.6.0 からの変更点:
* ビルダーラムダ内でまだ推論されていない型のインスタンスを返す呼び出しを行う際に、[1.5.30 で導入された](whatsnew1530.md#eliminating-builder-inference-restrictions) `-Xunrestricted-builder-inference` コンパイラオプションを指定する必要がなくなりました。
* `-Xenable-builder-inference` を使用すると、[`@BuilderInference`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-builder-inference/) アノテーションを適用せずに独自のビルダーを作成できます。

    > これらのビルダーのクライアントは、同じ `-Xenable-builder-inference` コンパイラオプションを指定する必要があることに注意してください。
    >
    {style="warning"}

* `-Xenable-builder-inference` を使用すると、通常の型推論が型に関する十分な情報を取得できない場合、ビルダー推論が自動的に有効になります。

[カスタムジェネリックビルダーの作成方法](using-builders-with-builder-inference.md)を学びましょう。

### クラス型パラメータに対するアノテーションのサポート

クラス型パラメータに対するアノテーションのサポートは次のようになります。

```kotlin
@Target(AnnotationTarget.TYPE_PARAMETER)
annotation class BoxContent

class Box<@BoxContent T> {}
```

すべての型パラメータに対するアノテーションは JVM バイトコードに出力されるため、アノテーションプロセッサがそれらを使用できます。

その動機となるユースケースについては、[こちらの YouTrack チケット](https://youtrack.jetbrains.com/issue/KT-43714)を読んでください。

[アノテーション](annotations.md)について詳しく学びましょう。

## 以前の API バージョンをより長期間サポート

Kotlin 1.6.0 からは、現在の安定版に加えて、以前の API バージョン2つではなく3つ分の開発をサポートします。現在、バージョン 1.3、1.4、1.5、1.6 をサポートしています。

## Kotlin/JVM

Kotlin/JVM では、1.6.0 からコンパイラが JVM 17 に対応するバイトコードバージョンのクラスを生成できるようになりました。新しい言語バージョンには、最適化された委譲プロパティと、ロードマップに記載されていた反復可能アノテーションも含まれています。
* [1.8 JVM ターゲット向けランタイムリテンションの反復可能アノテーション](#repeatable-annotations-with-runtime-retention-for-1-8-jvm-target)
* [指定された KProperty インスタンスで get/set を呼び出す委譲プロパティの最適化](#optimize-delegated-properties-which-call-get-set-on-the-given-kproperty-instance)

### 1.8 JVM ターゲット向けランタイムリテンションの反復可能アノテーション

Java 8 では、単一のコード要素に複数回適用できる[反復可能アノテーション](https://docs.oracle.com/javase/tutorial/java/annotations/repeating.html)が導入されました。この機能には、Java コード内に2つの宣言が必要です: [`@java.lang.annotation.Repeatable`](https://docs.oracle.com/javase/8/docs/api/java/lang/annotation/Repeatable.html) でマークされた反復可能アノテーション自体と、その値を保持するためのコンテナアノテーションです。

Kotlin にも反復可能アノテーションがありますが、アノテーション宣言で[`@kotlin.annotation.Repeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/) が存在することのみを要求し、それにより反復可能になります。1.6.0 より前は、この機能は `SOURCE` リテンションのみをサポートしており、Java の反復可能アノテーションとは互換性がありませんでした。Kotlin 1.6.0 はこれらの制限を解除します。`@kotlin.annotation.Repeatable` はあらゆるリテンションを受け入れるようになり、Kotlin と Java の両方でアノテーションを反復可能にします。Java の反復可能アノテーションも、Kotlin 側からサポートされるようになりました。

コンテナアノテーションを宣言することもできますが、必須ではありません。例えば:
* アノテーション `@Tag` が `@kotlin.annotation.Repeatable` でマークされている場合、Kotlin コンパイラは `@Tag.Container` という名前でコンテナアノテーションクラスを自動的に生成します。

    ```kotlin
    @Repeatable 
    annotation class Tag(val name: String)

    // The compiler generates @Tag.Container containing annotation
    ```

* コンテナアノテーションにカスタム名を指定するには、[`@kotlin.jvm.JvmRepeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvmrepeatable/) メタアノテーションを適用し、明示的に宣言されたコンテナアノテーションクラスを引数として渡します。

    ```kotlin
    @JvmRepeatable(Tags::class)
    annotation class Tag(val name: String)
    
    annotation class Tags(val value: Array<Tag>)
    ```

Kotlin のリフレクションは、新しい関数 [`KAnnotatedElement.findAnnotations()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/find-annotations.html) を介して、Kotlin と Java の両方の反復可能アノテーションをサポートするようになりました。

Kotlin の反復可能アノテーションの詳細については、[この KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/repeatable-annotations.md) を参照してください。

### 指定された KProperty インスタンスで get/set を呼び出す委譲プロパティの最適化

生成される JVM バイトコードは、`$delegate` フィールドを省略し、参照されるプロパティへの即時アクセスを生成することで最適化されました。

例えば、以下のコードでは

```kotlin
class Box<T> {
    private var impl: T = ...

    var content: T by ::impl
}
```

Kotlin はフィールド `content$delegate` を生成しなくなりました。`content` 変数のプロパティアクセサーは `impl` 変数を直接呼び出し、委譲プロパティの `getValue`/`setValue` 演算子をスキップするため、[`KProperty`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-property/index.html) 型のプロパティ参照オブジェクトは不要になります。

実装にご協力いただいた Google の同僚に感謝します！

[委譲プロパティ](delegated-properties.md)について詳しく学びましょう。

## Kotlin/Native

Kotlin/Native は複数の改善とコンポーネントアップデートを受けており、その一部はプレビュー状態です。
* [新しいメモリマネージャーのプレビュー](#preview-of-the-new-memory-manager)
* [Xcode 13 のサポート](#support-for-xcode-13)
* [あらゆるホストでの Windows ターゲットのコンパイル](#compilation-of-windows-targets-on-any-host)
* [LLVM とリンカーのアップデート](#llvm-and-linker-updates)
* [パフォーマンスの改善](#performance-improvements)
* [JVM および JS IR バックエンドとの統一されたコンパイラプラグイン ABI](#unified-compiler-plugin-abi-with-jvm-and-js-ir-backends)
* [klib リンク失敗の詳細なエラーメッセージ](#detailed-error-messages-for-klib-linkage-failures)
* [未処理例外処理 API の再設計](#reworked-unhandled-exception-handling-api)

### 新しいメモリマネージャーのプレビュー

> 新しい Kotlin/Native メモリマネージャーは[実験的](components-stability.md)です。
> これはいつでも廃止または変更される可能性があります。オプトインが必要です (詳細は下記参照)。評価目的でのみ使用してください。
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) でフィードバックをいただけると幸いです。
>
{style="warning"}

Kotlin 1.6.0 では、新しい Kotlin/Native メモリマネージャーの開発プレビューを試すことができます。これにより、JVM と Native プラットフォーム間の違いをなくし、マルチプラットフォームプロジェクトで一貫した開発者エクスペリエンスを提供することに近づきます。

注目すべき変更点の1つは、Kotlin/JVM と同様に、トップレベルプロパティの遅延初期化です。トップレベルプロパティは、同じファイル内のトップレベルプロパティまたは関数に初めてアクセスされたときに初期化されます。このモードには、冗長な初期化チェックを削除するグローバルなプロシージャ間最適化 (リリースバイナリでのみ有効) も含まれています。

最近、新しいメモリマネージャーに関する[ブログ記事](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/)を公開しました。新しいメモリマネージャーの現状について学び、デモプロジェクトを見つけるにはそちらをお読みいただくか、[移行手順](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/NEW_MM.md)に直接進んでご自身でお試しください。新しいメモリマネージャーがご自身のプロジェクトでどのように機能するかをご確認いただき、課題トラッカーの [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) でフィードバックを共有してください。

### Xcode 13 のサポート

Kotlin/Native 1.6.0 は、Xcode の最新バージョンである Xcode 13 をサポートしています。Xcode を自由にアップデートして、Apple オペレーティングシステム向けの Kotlin プロジェクトで作業を続けることができます。

> Xcode 13 で追加された新しいライブラリは Kotlin 1.6.0 では使用できませんが、今後のバージョンでそれらのサポートを追加する予定です。
>
{style="note"}

### あらゆるホストでの Windows ターゲットのコンパイル

1.6.0 からは、Windows ターゲット `mingwX64` と `mingwX86` をコンパイルするために Windows ホストは必要ありません。Kotlin/Native をサポートするあらゆるホストでコンパイルできます。

### LLVM とリンカーのアップデート

Kotlin/Native が内部で使用する LLVM の依存関係を再設計しました。これにより、次のような様々な利点がもたらされます。
* LLVM のバージョンが 11.1.0 に更新されました。
* 依存関係のサイズが減少しました。例えば、macOS では以前のバージョンの 1200 MB から約 300 MB になりました。
* [現代の Linux ディストリビューションでは利用できない `ncurses5` ライブラリへの依存関係を除外しました](https://youtrack.jetbrains.com/issue/KT-42693)。

LLVM のアップデートに加えて、Kotlin/Native は MingGW ターゲット向けに [LLD](https://lld.llvm.org/) リンカー (LLVM プロジェクトのリンカー) を使用するようになりました。これは以前使用されていた ld.bfd リンカーよりも様々な利点があり、生成されるバイナリのランタイムパフォーマンスを向上させ、MinGW ターゲットのコンパイラキャッシュをサポートできるようになります。LLD は [DLL リンクのためにインポートライブラリを必要とすることに注意してください](whatsnew1530.md#deprecation-of-linkage-against-dlls-without-import-libraries-for-mingw-targets)。詳細については、[この Stack Overflow スレッド](https://stackoverflow.com/questions/3573475/how-does-the-import-library-work-details/3573527/#3573527)を参照してください。

### パフォーマンスの改善

Kotlin/Native 1.6.0 では、以下のパフォーマンス改善が提供されます。

* コンパイル時間: `linuxX64` および `iosArm64` ターゲットでは、コンパイラキャッシュがデフォルトで有効になりました。これにより、デバッグモードでのほとんどのコンパイルが高速化されます (初回を除く)。測定では、テストプロジェクトで約 200% の速度向上が示されました。これらのターゲットのコンパイラキャッシュは Kotlin 1.5.0 から[追加の Gradle プロパティ](whatsnew15.md#performance-improvements)を使用して利用可能でしたが、これで削除できます。
* ランタイム: 生成される LLVM コードの最適化により、`for` ループでの配列の反復処理が最大 12% 高速化されました。

### JVM および JS IR バックエンドとの統一されたコンパイラプラグイン ABI

> Kotlin/Native で共通の IR コンパイラプラグイン ABI を使用するオプションは[実験的](components-stability.md)です。
> これはいつでも廃止または変更される可能性があります。オプトインが必要です (詳細は下記参照)。評価目的でのみ使用してください。
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-48595) でフィードバックをいただけると幸いです。
>
{style="warning"}

以前のバージョンでは、ABI の違いのため、コンパイラプラグインの作成者は Kotlin/Native 用に別々のアーティファクトを提供する必要がありました。

1.6.0 からは、Kotlin Multiplatform Gradle プラグインが、JVM および JS IR バックエンドで使用される埋め込み可能なコンパイラ jar を Kotlin/Native 用に使用できるようになりました。これにより、Native およびその他のサポートされているプラットフォームで同じコンパイラプラグインアーティファクトを使用できるため、コンパイラプラグイン開発エクスペリエンスの統一に向けた一歩となります。

これはこのようなサポートのプレビューバージョンであり、オプトインが必要です。Kotlin/Native 用の汎用コンパイラプラグインアーティファクトの使用を開始するには、`gradle.properties` に次の行を追加します: `kotlin.native.useEmbeddableCompilerJar=true`。

将来的には Kotlin/Native で埋め込み可能なコンパイラ jar をデフォルトで使用する予定ですので、プレビューがどのように機能するかについて皆様からのフィードバックをいただくことが非常に重要です。

コンパイラプラグインの作成者の方は、このモードを試してご自身のプラグインで動作するかどうかを確認してください。プラグインの構造によっては、移行手順が必要になる場合があります。[こちらの YouTrack Issue](https://youtrack.com/issue/KT-48595) で移行手順を確認し、コメントでフィードバックを残してください。

### klib リンク失敗の詳細なエラーメッセージ

Kotlin/Native コンパイラは、klib リンクエラーに対して詳細なエラーメッセージを提供するようになりました。メッセージには明確なエラー説明が含まれ、考えられる原因と解決方法に関する情報も含まれるようになりました。

例:
* 1.5.30:

    ```text
    e: java.lang.IllegalStateException: IrTypeAliasSymbol expected: Unbound public symbol for public kotlinx.coroutines/CancellationException|null[0]
    <stack trace>
    ```

* 1.6.0:

    ```text
    e: IR デシリアライズ中に予期しない型のシンボルが見つかりました: IrClassPublicSymbolImpl, kotlinx.coroutines/CancellationException|null[0]。
    IrTypeAliasSymbol が予期されます。
    
    これは、プロジェクトで現在使用されている他のライブラリとは異なるバージョンのライブラリに対してコンパイルされた2つのライブラリが存在する場合に発生する可能性があります。
    プロジェクト構成が正しく、依存関係のバージョンが一貫していることを確認してください。
    
    "org.jetbrains.kotlinx:kotlinx-coroutines-core (org.jetbrains.kotlinx:kotlinx-coroutines-core-macosx64)" に依存し、競合を引き起こす可能性のあるライブラリのリスト:
    <ライブラリのリストと潜在的なバージョン不一致>
    
    プロジェクトの依存関係:
    <依存関係ツリー>
    ```

### 未処理例外処理 API の再設計

Kotlin/Native ランタイム全体で未処理例外の処理を統一し、デフォルトの処理を `processUnhandledException(throwable: Throwable)` 関数として公開しました。これは `kotlinx.coroutines` のようなカスタム実行環境で使用できます。

この処理は、`Worker.executeAfter()` での操作からエスケープする例外にも適用されますが、新しい[メモリマネージャー](#preview-of-the-new-memory-manager)にのみ適用されます。

API の改善は、`setUnhandledExceptionHook()` によって設定されたフックにも影響を与えました。以前は、Kotlin/Native ランタイムが未処理例外でフックを呼び出した後、そのようなフックはリセットされ、プログラムは常に直後に終了していました。しかし今では、これらのフックは複数回使用できます。未処理例外時に常にプログラムを終了させたい場合は、未処理例外フック (`setUnhandledExceptionHook()`) を設定しないか、フックの最後に `terminateWithUnhandledException()` を呼び出すようにしてください。これにより、例外をサードパーティのクラッシュレポートサービス (Firebase Crashlytics など) に送信し、その後プログラムを終了させることができます。`main()` からエスケープする例外や、相互運用境界を越える例外は、フックが `terminateWithUnhandledException()` を呼び出さなかった場合でも、常にプログラムを終了させます。

## Kotlin/JS

Kotlin/JS コンパイラの IR バックエンドの安定化作業を継続しています。Kotlin/JS には、[Node.js と Yarn のダウンロードを無効にするオプション](#option-to-use-pre-installed-node-js-and-yarn)が追加されました。

### プリインストールされた Node.js と Yarn を使用するオプション

Kotlin/JS プロジェクトをビルドする際に Node.js と Yarn のダウンロードを無効にし、ホストにすでにインストールされているインスタンスを使用できるようになりました。これは、CI サーバーなど、インターネット接続のないサーバーでのビルドに役立ちます。

外部コンポーネントのダウンロードを無効にするには、`build.gradle(.kts)` に次の行を追加します。

* Yarn:

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">
    
    ```kotlin
    rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> {
        rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().download = false // or true for default behavior
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
        rootProject.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootExtension>().download = false // or true for default behavior
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

Kotlin 1.6.0 では、`KotlinGradleSubplugin` クラスの非推奨レベルを 'ERROR' に変更しました。このクラスはコンパイラプラグインの記述に使用されていました。今後のリリースでは、このクラスを削除します。代わりに `KotlinCompilerPluginSupportPlugin` クラスを使用してください。

`kotlin.useFallbackCompilerSearch` ビルドオプションと、`noReflect` および `includeRuntime` コンパイラオプションを削除しました。`useIR` コンパイラオプションは非表示になり、今後のリリースで削除される予定です。

Kotlin Gradle プラグインで[現在サポートされているコンパイラオプション](gradle-compiler-options.md)について詳しく学びましょう。

## 標準ライブラリ

標準ライブラリの新しい 1.6.0 バージョンでは、実験的な機能が安定化され、新しい機能が導入され、プラットフォーム間での動作が統一されています。

* [新しい readline 関数](#new-readline-functions)
* [typeOf() の安定化](#stable-typeof)
* [コレクションビルダーの安定化](#stable-collection-builders)
* [Duration API の安定化](#stable-duration-api)
* [正規表現をシーケンスに分割](#splitting-regex-into-a-sequence)
* [整数のビット回転操作](#bit-rotation-operations-on-integers)
* [JS の replace() と replaceFirst() の変更](#changes-for-replace-and-replacefirst-in-js)
* [既存 API の改善](#improvements-to-the-existing-api)
* [非推奨](#deprecations)

### 新しい readline 関数

Kotlin 1.6.0 では、標準入力を処理するための新しい関数、[`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html) と [`readlnOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln-or-null.html) が提供されます。

> 現時点では、新しい関数は JVM および Native ターゲットプラットフォームでのみ利用可能です。
>
{style="note"}

|**以前のバージョン**|**1.6.0 の代替**|**使用方法**|
| --- | --- | --- |
|`readLine()!!`|`readln()`| 標準入力から行を読み取り、それを返します。EOF に達した場合、`RuntimeException` をスローします。 |
|`readLine()`|`readlnOrNull()`| 標準入力から行を読み取り、それを返します。EOF に達した場合、`null` を返します。 |

行を読み取る際に `!!` を使用する必要をなくすことで、初心者にとっての体験が向上し、Kotlin の教育が簡素化されると信じています。読み取り操作の名前を `println()` と一貫させるため、新しい関数の名前を 'ln' に短縮することにしました。

```kotlin
println("What is your nickname?")
val nickname = readln()
println("Hello, $nickname!")
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

既存の `readLine()` 関数は、IDE のコード補完で `readln()` および `readlnOrNull()` よりも優先度が低くなります。IDE のインスペクションも、従来の `readLine()` の代わりに新しい関数を使用することを推奨します。

今後のリリースで `readLine()` 関数を段階的に非推奨にする予定です。

### typeOf() の安定化

バージョン 1.6.0 では、[安定版](components-stability.md) [`typeOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/type-of.html) 関数が導入され、[主要なロードマップ項目](https://youtrack.jetbrains.com/issue/KT-45396)の1つが完了しました。

[1.3.40 以降](https://blog.jetbrains.com/kotlin/2019/06/kotlin-1-3-40-released/)、`typeOf()` は JVM プラットフォームで実験的 API として利用可能でした。今では、あらゆる Kotlin プラットフォームでこれを使用し、コンパイラが推論できるあらゆる Kotlin 型の [`KType`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-type/#kotlin.reflect.KType) 表現を取得できます。

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

### コレクションビルダーの安定化

Kotlin 1.6.0 では、コレクションビルダー関数が[安定版](components-stability.md)に昇格しました。コレクションビルダーによって返されるコレクションは、読み取り専用状態でもシリアライズ可能になりました。

オプトインアノテーションなしで、[`buildMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-map.html)、[`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html)、[`buildSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-set.html) を使用できるようになりました。

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

### Duration API の安定化

異なる時間単位で期間量を表現するための [Duration](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/) クラスが[安定版](components-stability.md)に昇格しました。1.6.0 では、Duration API は以下の変更を受けました。

* 期間を日、時間、分、秒、ナノ秒に分解する [`toComponents()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-components.html) 関数の最初のコンポーネントは、`Int` 型ではなく `Long` 型になりました。以前は、値が `Int` の範囲に収まらない場合、その範囲に強制されていました。`Long` 型を使用すると、`Int` に収まらない値を切り捨てることなく、期間範囲内のあらゆる値を分解できます。

* `DurationUnit` enum は独立したものとなり、JVM 上の `java.util.concurrent.TimeUnit` の型エイリアスではなくなりました。`typealias DurationUnit = TimeUnit` が役立つ説得力のあるケースは見つかりませんでした。また、型エイリアスを介して `TimeUnit` API を公開すると、`DurationUnit` のユーザーを混乱させる可能性があります。

* コミュニティからのフィードバックに応え、`Int.seconds` のような拡張プロパティを復活させます。ただし、その適用範囲を制限したいため、`Duration` クラスのコンパニオンオブジェクトに配置しました。IDE は補完で拡張を提案し、コンパニオンからのインポートを自動的に挿入できますが、将来的にはこの動作を `Duration` 型が期待される場合に限定する予定です。

  ```kotlin
  import kotlin.time.Duration.Companion.seconds
  
  fun main() {
  //sampleStart
      val duration = 10000
      println("There are ${duration.seconds.inWholeMinutes} minutes in $duration seconds")
      // There are 166 minutes in 10000 seconds
  //sampleEnd
  }
  ```
  {kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}
  
  以前導入された `Duration.seconds(Int)` のようなコンパニオン関数や、`Int.seconds` のような非推奨のトップレベル拡張を、`Duration.Companion` の新しい拡張に置き換えることを推奨します。

  > このような置き換えは、古いトップレベル拡張と新しいコンパニオン拡張の間に曖昧さを引き起こす可能性があります。
  > 自動移行を行う前に、kotlin.time パッケージのワイルドカードインポート — `import kotlin.time.*` — を必ず使用してください。
  >
  {style="note"}

### 正規表現をシーケンスに分割

`Regex.splitToSequence(CharSequence)` 関数と `CharSequence.splitToSequence(Regex)` 関数が[安定版](components-stability.md)に昇格しました。これらは指定された正規表現の一致箇所で文字列を分割しますが、結果を [Sequence](sequences.md) として返すため、この結果に対するすべての操作は遅延実行されます。

```kotlin
fun main() {
//sampleStart
    val colorsText = "green, red, brown&blue, orange, pink&green"
    val regex = "[,\\s]+".toRegex()
    val mixedColor = regex.splitToSequence(colorsText)
    // or
    // val mixedColor = colorsText.splitToSequence(regex)
        .onEach { println(it) }
        .firstOrNull { it.contains('&') }
    println(mixedColor) // "brown&blue"
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}

### 整数のビット回転操作

Kotlin 1.6.0 では、ビット操作のための `rotateLeft()` および `rotateRight()` 関数が[安定版](components-stability.md)になりました。これらの関数は、数値のバイナリ表現を、指定されたビット数だけ左または右に回転させます。

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

### JS の replace() と replaceFirst() の変更

Kotlin 1.6.0 より前は、置き換え文字列にグループ参照が含まれている場合、[`replace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/replace.html) および [`replaceFirst()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/replace-first.html) Regex 関数は Java と JS で異なる動作をしていました。すべてのターゲットプラットフォームで動作の一貫性を保つため、JS での実装を変更しました。

置き換え文字列内の `${name}` または `$index` の出現は、指定されたインデックスまたは名前を持つキャプチャされたグループに対応するサブシーケンスに置換されます。
* `$index` – '``` の後の最初の数字は、常にグループ参照の一部として扱われます。後続の数字は、有効なグループ参照を形成する場合にのみ `index` に組み込まれます。数字 '0'～'9' のみがグループ参照の潜在的なコンポーネントと見なされます。キャプチャされたグループのインデックスは '1' から始まることに注意してください。インデックス '0' のグループは、全体の一致を表します。
* `${name}` – `name` は、ラテン文字 'a'～'z'、'A'～'Z'、または数字 '0'～'9' で構成できます。最初の文字は文字である必要があります。

    > 置き換えパターンにおける名前付きグループは、現在 JVM でのみサポートされています。
    >
    {style="note"}

* 後続の文字を置き換え文字列にリテラルとして含めるには、バックスラッシュ文字 `\` を使用します。

    ```kotlin
    fun main() {
    //sampleStart
        println(Regex("(.+)").replace("Kotlin", """\$ $1""")) // $ Kotlin
        println(Regex("(.+)").replaceFirst("1.6.0", """\\ $1""")) // \ 1.6.0
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.6"}

    置き換え文字列をリテラル文字列として扱う必要がある場合は、[`Regex.escapeReplacement()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/escape-replacement.html) を使用できます。

### 既存 API の改善

* バージョン 1.6.0 では、`Comparable.compareTo()` の中置拡張関数が追加されました。これで、2つのオブジェクトの順序を比較するために中置形式を使用できます。

    ```kotlin
     class WrappedText(val text: String) : Comparable<WrappedText> {
         override fun compareTo(other: WrappedText): Int =
             this.text compareTo other.text
    }
    ```

* JS の `Regex.replace()` も、すべてのプラットフォームで実装を統一するために、インライン化されなくなりました。
* `compareTo()` および `equals()` String 関数、ならびに `isBlank()` CharSequence 関数は、JS で JVM とまったく同じように動作するようになりました。以前は非 ASCII 文字に関して差異がありました。

### 非推奨

Kotlin 1.6.0 では、一部の JS 専用 stdlib API に対する警告から非推奨サイクルを開始します。

#### concat()、match()、matches() 文字列関数

* 文字列を別の与えられたオブジェクトの文字列表現と連結するには、`concat()` の代わりに `plus()` を使用してください。
* 入力内の正規表現のすべての出現箇所を見つけるには、`String.match(regex: String)` の代わりに Regex クラスの `findAll()` を使用してください。
* 正規表現が入力全体に一致するかどうかを確認するには、`String.matches(regex: String)` の代わりに Regex クラスの `matches()` を使用してください。

#### 比較関数を受け取る配列の sort()

比較関数によって渡された順序に従って配列をソートする `Array<out T>.sort()` 関数と、インライン関数 `ByteArray.sort()`、`ShortArray.sort()`、`IntArray.sort()`、`LongArray.sort()`、`FloatArray.sort()`、`DoubleArray.sort()`、`CharArray.sort()` を非推奨にしました。配列のソートには、他の標準ライブラリ関数を使用してください。

詳細については、[コレクションの順序付け](collection-ordering.md)セクションを参照してください。

## ツール

### Kover – Kotlin のコードカバレッジツール

> Kover Gradle プラグインは実験的です。[GitHub](https://github.com/Kotlin/kotlinx-kover/issues) でフィードバックをいただけると幸いです。
>
{style="warning"}

Kotlin 1.6.0 では、Kover を導入します。これは、[IntelliJ](https://github.com/JetBrains/intellij-coverage) および [JaCoCo](https://github.com/jacoco/jacoco) の Kotlin コードカバレッジエージェント用の Gradle プラグインです。インライン関数を含むすべての言語構成要素で動作します。

Kover の詳細については、[GitHub リポジトリ](https://github.com/Kotlin/kotlinx-kover)または以下のビデオを参照してください。

<video src="https://www.youtube.com/v/jNu5LY9HIbw" title="Kover – The Code Coverage Plugin"/>

## Coroutines 1.6.0-RC

`kotlinx.coroutines` [1.6.0-RC](https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.6.0-RC) がリリースされ、複数の機能と改善が含まれています。

* [新しい Kotlin/Native メモリマネージャーのサポート](#preview-of-the-new-memory-manager)
* 追加のスレッドを作成せずに並列処理を制限できる、ディスパッチャーの _views_ API の導入
* Java 6 から Java 8 ターゲットへの移行
* 新しい再設計された API とマルチプラットフォームサポートを備えた `kotlinx-coroutines-test`
* コルーチンに [`ThreadLocal`](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/ThreadLocal.html) 変数へのスレッドセーフな書き込みアクセスを提供する [`CopyableThreadContextElement`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-copyable-thread-context-element/index.html) の導入

詳細については、[変更履歴](https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.6.0-RC)を参照してください。

## Kotlin 1.6.0 への移行

IntelliJ IDEA と Android Studio は、Kotlin プラグインが利用可能になり次第、1.6.0 への更新を提案します。

既存のプロジェクトを Kotlin 1.6.0 に移行するには、Kotlin のバージョンを `1.6.0` に変更し、Gradle または Maven プロジェクトを再インポートします。[Kotlin 1.6.0 への更新方法](releases.md#update-to-a-new-kotlin-version)を学びましょう。

Kotlin 1.6.0 で新しいプロジェクトを開始するには、Kotlin プラグインを更新し、**File** | **New** | **Project** からプロジェクトウィザードを実行します。

新しいコマンドラインコンパイラは、[GitHub リリースページ](https://github.com/JetBrains/kotlin/releases/tag/v1.6.0)からダウンロードできます。

Kotlin 1.6.0 は[機能リリース](kotlin-evolution-principles.md#language-and-tooling-releases)であるため、以前のバージョンの言語用に記述されたコードと互換性のない変更をもたらす可能性があります。そのような変更点の詳細なリストは、[Kotlin 1.6 互換性ガイド](compatibility-guide-16.md)で確認できます。