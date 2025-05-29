[//]: # (title: Kotlin 1.6.0 の新機能)

_\[リリース日: 2021年11月16日](releases.md#release-details)_

Kotlin 1.6.0 では、新しい言語機能、既存機能の最適化と改善、そしてKotlin標準ライブラリの多くの改善が導入されています。

変更点の概要は、[リリースブログ記事](https://blog.jetbrains.com/kotlin/2021/11/kotlin-1-6-0-is-released/)でも確認できます。

## 言語
Kotlin 1.6.0 では、以前の 1.5.30 リリースでプレビュー版として導入されたいくつかの言語機能が安定化されました。
* [enum、sealed、Boolean 型を対象とする網羅的な `when` 文の安定化](#stable-exhaustive-when-statements-for-enum-sealed-and-boolean-subjects)
* [スーパータイプとしての suspending function の安定化](#stable-suspending-functions-as-supertypes)
* [サスペンド変換の安定化](#stable-suspend-conversions)
* [アノテーションクラスのインスタンス化の安定化](#stable-instantiation-of-annotation-classes)

また、様々な型推論の改善と、クラスの型パラメータに対するアノテーションのサポートも含まれています。
* [再帰的なジェネリック型の型推論の改善](#improved-type-inference-for-recursive-generic-types)
* [ビルダー推論の変更点](#changes-to-builder-inference)
* [クラスの型パラメータに対するアノテーションのサポート](#support-for-annotations-on-class-type-parameters)

### enum、sealed、および Boolean 型を対象とする網羅的な `when` 文の安定化
_網羅的な_ [`when`](control-flow.md#when-expressions-and-statements) 文には、その対象のすべての可能な型または値、またはいくつかの型に `else` ブランチを加えたすべてのブランチが含まれます。これにより、考えられるすべてのケースがカバーされ、コードがより安全になります。

`when` 式との動作の一貫性を保つため、網羅的でない `when` 文はまもなく禁止されます。
スムーズな移行を確実にするため、Kotlin 1.6.0 では、enum、sealed、または Boolean 型を対象とする網羅的でない `when` 文に対して警告が報告されます。
これらの警告は、将来のリリースでエラーになります。

```kotlin
sealed class Contact {
    data class PhoneCall(val number: String) : Contact()
    data class TextMessage(val number: String) : Contact()
}

fun Contact.messageCost(): Int =
    when(this) { // Error: 'when' expression must be exhaustive
        is Contact.PhoneCall -> 42
    }

fun sendMessage(contact: Contact, message: String) {
    // Starting with 1.6.0

    // Warning: Non exhaustive 'when' statements on Boolean will be
    // prohibited in 1.7, add 'false' branch or 'else' branch instead
    when(message.isEmpty()) {
        true -> return
    }
    // Warning: Non exhaustive 'when' statements on sealed class/interface will be
    // prohibited in 1.7, add 'is TextMessage' branch or 'else' branch instead
    when(contact) {
        is Contact.PhoneCall -> TODO()
    }
}
```

変更とその影響についてさらに詳しく説明するには、[こちらのYouTrackチケット](https://youtrack.jetbrains.com/issue/KT-47709)を参照してください。

### スーパータイプとしての suspending function の安定化
Kotlin 1.6.0 では、suspending 関数型の実装が[安定版](components-stability.md)になりました。
プレビュー版は[1.5.30](whatsnew1530.md#suspending-functions-as-supertypes)で利用可能でした。

この機能は、Kotlinコルーチンを使用し、suspending関数型を受け入れるAPIを設計する際に役立ちます。
これで、必要な動作をsuspending関数型を実装する別のクラスにカプセル化することで、コードを効率化できます。

```kotlin
class MyClickAction : suspend () -> Unit {
    override suspend fun invoke() { TODO() }
}

fun launchOnClick(action: suspend () -> Unit) {}
```

以前はラムダとsuspending関数の参照のみが許可されていた場所で、このクラスのインスタンスを使用できるようになりました: `launchOnClick(MyClickAction())`。

現在、実装の詳細に起因する2つの制限があります。
* スーパータイプのリストで、通常の関数型とsuspending関数型を混在させることはできません。
* 複数のsuspending関数スーパータイプを使用することはできません。

### サスペンド変換の安定化
Kotlin 1.6.0 では、通常の関数型から suspending 関数型への[安定版](components-stability.md)変換が導入されました。
1.4.0 以降、この機能は関数リテラルとcallable参照をサポートしていました。
1.6.0 では、あらゆる形式の式で機能します。呼び出し引数として、suspendingが期待される場所で、適切な通常の関数型の任意の式を渡せるようになりました。
コンパイラは自動的に暗黙的な変換を実行します。

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
Kotlin 1.5.30 では、JVMプラットフォームでのアノテーションクラスのインスタンス化に対する実験的なサポートが[導入されました](whatsnew1530.md#instantiation-of-annotation-classes)。
1.6.0 からは、この機能はKotlin/JVMとKotlin/JSの両方でデフォルトで利用できます。

アノテーションクラスのインスタンス化の詳細については、[こちらのKEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-instantiation.md)を参照してください。

### 再帰的なジェネリック型の型推論の改善
Kotlin 1.5.30 では、再帰的なジェネリック型の型推論が改善され、対応する型パラメータの上限のみに基づいて型引数を推論できるようになりました。
この改善はコンパイラオプションで利用可能でした。バージョン 1.6.0 以降では、デフォルトで有効になっています。

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

### ビルダー推論の変更点
ビルダー推論は、汎用ビルダー関数を呼び出す際に役立つ型推論の一種です。これにより、ラムダ引数内の呼び出しからの型情報を使用して、呼び出しの型引数を推論できます。

完全な安定版ビルダー推論に近づくために、複数の変更を行っています。1.6.0 からは以下のようになります。
* ビルダーラムダ内で、まだ推論されていない型のインスタンスを返す呼び出しを、[1.5.30 で導入された](whatsnew1530.md#eliminating-builder-inference-restrictions) `-Xunrestricted-builder-inference` コンパイラオプションを指定せずに作成できるようになりました。
* `-Xenable-builder-inference` を使用すると、[`@BuilderInference`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-builder-inference/) アノテーションを適用せずに独自のビルダーを作成できます。

    > これらのビルダーのクライアントは、同じ `-Xenable-builder-inference` コンパイラオプションを指定する必要があることに注意してください。
    >
    {style="warning"}

* `-Xenable-builder-inference` を使用すると、通常の型推論が型に関する十分な情報を取得できない場合、ビルダー推論が自動的にアクティブになります。

[カスタムの汎用ビルダーの記述方法](using-builders-with-builder-inference.md)について学ぶ。

### クラスの型パラメータに対するアノテーションのサポート
クラスの型パラメータに対するアノテーションのサポートは次のようになります。

```kotlin
@Target(AnnotationTarget.TYPE_PARAMETER)
annotation class BoxContent

class Box<@BoxContent T> {}
```

すべての型パラメータに対するアノテーションはJVMバイトコードに出力されるため、アノテーションプロセッサがそれらを使用できます。

その動機となるユースケースについては、[こちらのYouTrackチケット](https://youtrack.jetbrains.com/issue/KT-43714)を参照してください。

[アノテーション](annotations.md)の詳細について学ぶ。

## 以前のAPIバージョンをより長くサポート
Kotlin 1.6.0 からは、現在の安定版に加えて、以前のAPIバージョンを2つではなく3つサポートします。現在、バージョン 1.3、1.4、1.5、1.6 をサポートしています。

## Kotlin/JVM
Kotlin/JVM では、1.6.0 からコンパイラが JVM 17 に対応するバイトコードバージョンのクラスを生成できるようになりました。新しい言語バージョンには、ロードマップに記載されていた最適化された委譲プロパティと繰り返し可能なアノテーションも含まれています。
* [1.8 JVM ターゲット向けランタイムリテンションを持つ繰り返し可能なアノテーション](#repeatable-annotations-with-runtime-retention-for-1-8-jvm-target)
* [指定された KProperty インスタンスで get/set を呼び出す委譲プロパティの最適化](#optimize-delegated-properties-which-call-get-set-on-the-given-kproperty-instance)

### 1.8 JVM ターゲット向けランタイムリテンションを持つ繰り返し可能なアノテーション
Java 8 では、1つのコード要素に複数回適用できる[繰り返し可能なアノテーション](https://docs.oracle.com/javase/tutorial/java/annotations/repeating.html)が導入されました。
この機能には、Javaコードに2つの宣言が必要です。[`@java.lang.annotation.Repeatable`](https://docs.oracle.com/javase/8/docs/api/java/lang/annotation/Repeatable.html)でマークされた繰り返し可能なアノテーション自体と、その値を保持するコンテナアノテーションです。

Kotlinにも繰り返し可能なアノテーションがありますが、アノテーション宣言に[`@kotlin.annotation.Repeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/)が存在するだけで、繰り返し可能になります。
1.6.0 より前は、この機能は `SOURCE` リテンションのみをサポートしており、Javaの繰り返し可能なアノテーションと互換性がありませんでした。
Kotlin 1.6.0 はこれらの制限を取り除きます。[`@kotlin.annotation.Repeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/) は、あらゆるリテンションを受け入れるようになり、アノテーションをKotlinとJavaの両方で繰り返し可能にします。
Javaの繰り返し可能なアノテーションも、Kotlin側からサポートされるようになりました。

コンテナアノテーションを宣言することもできますが、必須ではありません。たとえば、以下のようになります。
* `@Tag` アノテーションが `@kotlin.annotation.Repeatable` でマークされている場合、Kotlinコンパイラは自動的に `@Tag.Container` という名前でコンテナアノテーションクラスを生成します。

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

Kotlinリフレクションは、新しい関数[`KAnnotatedElement.findAnnotations()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/find-annotations.html)を介して、KotlinとJavaの両方の繰り返し可能なアノテーションをサポートするようになりました。

Kotlinの繰り返し可能なアノテーションの詳細については、[こちらのKEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/repeatable-annotations.md)を参照してください。

### 指定された KProperty インスタンスで get/set を呼び出す委譲プロパティの最適化
`$delegate` フィールドを省略し、参照されているプロパティへの直接アクセスを生成することで、生成される JVM バイトコードを最適化しました。

例えば、次のコードでは

```kotlin
class Box<T> {
    private var impl: T = ...

    var content: T by ::impl
}
```

Kotlin は `content$delegate` フィールドを生成しなくなりました。
`content` 変数のプロパティアクセサは、委譲プロパティの `getValue`/`setValue` 演算子をスキップして `impl` 変数を直接呼び出すため、[`KProperty`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-property/index.html) 型のプロパティ参照オブジェクトは不要になります。

実装に貢献してくれたGoogleの同僚に感謝します！

[委譲プロパティ](delegated-properties.md)の詳細について学ぶ。

## Kotlin/Native
Kotlin/Native は複数の改善とコンポーネントの更新を受けており、その一部はプレビュー段階にあります。
* [新しいメモリマネージャのプレビュー](#preview-of-the-new-memory-manager)
* [Xcode 13 のサポート](#support-for-xcode-13)
* [任意のホストでの Windows ターゲットのコンパイル](#compilation-of-windows-targets-on-any-host)
* [LLVM およびリンカーの更新](#llvm-and-linker-updates)
* [パフォーマンスの改善](#performance-improvements)
* [JVM および JS IR バックエンドとの統合されたコンパイラプラグイン ABI](#unified-compiler-plugin-abi-with-jvm-and-js-ir-backends)
* [klib リンク失敗の詳細なエラーメッセージ](#detailed-error-messages-for-klib-linkage-failures)
* [未処理例外処理 API の再構築](#reworked-unhandled-exception-handling-api)

### 新しいメモリマネージャのプレビュー
> 新しいKotlin/Nativeメモリマネージャは[実験的](components-stability.md)です。
> いつでも削除または変更される可能性があります。オプトインが必要であり（詳細は下記参照）、評価目的でのみ使用してください。
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525)でのフィードバックをお待ちしております。
>
{style="warning"}

Kotlin 1.6.0 では、新しい Kotlin/Native メモリマネージャの開発プレビュー版を試すことができます。
これにより、JVM と Native プラットフォーム間の違いをなくし、マルチプラットフォームプロジェクトで一貫した開発者エクスペリエンスを提供することに近づきます。

注目すべき変更点の1つは、Kotlin/JVM と同様にトップレベルプロパティの遅延初期化です。トップレベルプロパティは、同じファイル内のトップレベルプロパティまたは関数が初めてアクセスされたときに初期化されます。
このモードには、グローバルなプロシージャ間最適化（リリースバイナリでのみ有効）も含まれており、冗長な初期化チェックを削除します。

新しいメモリマネージャに関する[ブログ記事](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/)を最近公開しました。
それを読んで、新しいメモリマネージャの現在の状態について学び、デモプロジェクトを見つけるか、[移行手順](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/NEW_MM.md)に直接アクセスして自分で試してみてください。
新しいメモリマネージャがあなたのプロジェクトでどのように機能するかを確認し、イシュートラッカーの[YouTrack](https://youtrack.jetbrains.com/issue/KT-48525)でフィードバックを共有してください。

### Xcode 13 のサポート
Kotlin/Native 1.6.0 は Xcode の最新バージョンである Xcode 13 をサポートしています。Xcode を自由にアップデートして、Apple オペレーティングシステム向けの Kotlin プロジェクトでの作業を続けてください。

> Xcode 13 で追加された新しいライブラリは Kotlin 1.6.0 では使用できませんが、今後のバージョンでそれらのサポートを追加する予定です。
>
{style="note"}

### 任意のホストでの Windows ターゲットのコンパイル
1.6.0 からは、Windows ターゲットの `mingwX64` と `mingwX86` をコンパイルするために Windows ホストは必要ありません。Kotlin/Native をサポートする任意のホストでコンパイルできます。

### LLVM およびリンカーの更新
Kotlin/Native が内部で使用している LLVM 依存関係を再構築しました。これにより、次のような様々な利点が得られます。
* LLVM バージョンを 11.1.0 に更新。
* 依存関係のサイズが減少。例えば、macOS では以前のバージョンの 1200 MB ではなく、約 300 MB になりました。
* 最新の Linux ディストリビューションでは利用できない [`ncurses5` ライブラリへの依存関係を除外](https://youtrack.jetbrains.com/issue/KT-42693)。

LLVM の更新に加えて、Kotlin/Native は MingGW ターゲット向けに [LLD](https://lld.llvm.org/) リンカー (LLVM プロジェクトのリンカー) を使用するようになりました。
これにより、以前使用されていた ld.bfd リンカーと比較して様々な利点があり、生成されるバイナリのランタイムパフォーマンスを向上させ、MinGW ターゲットのコンパイラキャッシュをサポートできるようになります。
LLD は [DLL リンクのためにインポートライブラリを必要とする](whatsnew1530.md#deprecation-of-linkage-against-dlls-without-import-libraries-for-mingw-targets)ことに注意してください。
詳細については、[こちらの Stack Overflow スレッド](https://stackoverflow.com/questions/3573475/how-does-the-import-library-work-details/3573527/#3573527)を参照してください。

### パフォーマンスの改善
Kotlin/Native 1.6.0 では、以下のパフォーマンス改善が実現されています。

* コンパイル時間: `linuxX64` および `iosArm64` ターゲットでは、コンパイラキャッシュがデフォルトで有効になりました。
これにより、デバッグモードでのほとんどのコンパイル（初回を除く）が高速化されます。測定では、テストプロジェクトで約200%の速度向上を示しました。
これらのターゲットのコンパイラキャッシュは、Kotlin 1.5.0 から[追加の Gradle プロパティ](whatsnew15.md#performance-improvements)で利用可能でしたが、これでそれらを削除できます。
* ランタイム: `for` ループでの配列のイテレーションは、生成される LLVM コードの最適化により、最大 12% 高速化されました。

### JVM および JS IR バックエンドとの統合されたコンパイラプラグイン ABI
> Kotlin/Native 用の共通 IR コンパイラプラグイン ABI を使用するオプションは[実験的](components-stability.md)です。
> いつでも削除または変更される可能性があります。オプトインが必要であり（詳細は下記参照）、評価目的でのみ使用してください。
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-48595)でのフィードバックをお待ちしております。
>
{style="warning"}

以前のバージョンでは、ABI の違いにより、コンパイラプラグインの作成者は Kotlin/Native 用に別々のアーティファクトを提供する必要がありました。

1.6.0 からは、Kotlin Multiplatform Gradle プラグインが、JVM および JS IR バックエンドで使用される埋め込み可能なコンパイラ JAR を Kotlin/Native 用に使用できるようになりました。
これにより、Native および他のサポートされているプラットフォームで同じコンパイラプラグインアーティファクトを使用できるようになり、コンパイラプラグイン開発エクスペリエンスの統一に向けた一歩となります。

これはこのサポートのプレビューバージョンであり、オプトインが必要です。
Kotlin/Native で汎用コンパイラプラグインアーティファクトの使用を開始するには、`gradle.properties` に次の行を追加します: `kotlin.native.useEmbeddableCompilerJar=true`。

将来的に Kotlin/Native 用の埋め込み可能なコンパイラ JAR をデフォルトで使用する予定ですので、プレビューがどのように機能するかについて皆様からのご意見を伺うことは非常に重要です。

コンパイラプラグインの作成者の方は、このモードを試して、プラグインが機能するかどうかを確認してください。
プラグインの構造によっては、移行手順が必要になる場合があることに注意してください。移行手順については[こちらのYouTrackイシュー](https://youtrack.jetbrains.com/issue/KT-48595)を参照し、コメントにフィードバックを残してください。

### klib リンク失敗の詳細なエラーメッセージ
Kotlin/Native コンパイラは、klib リンクエラーに対して詳細なエラーメッセージを提供するようになりました。
メッセージには明確なエラーの説明が含まれ、考えられる原因と修正方法に関する情報も含まれるようになりました。

例えば:
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

### 未処理例外処理 API の再構築
Kotlin/Native ランタイム全体で未処理例外の処理を統一し、`kotlinx.coroutines` のようなカスタム実行環境で使用するために、デフォルトの処理を関数 `processUnhandledException(throwable: Throwable)` として公開しました。
この処理は、`Worker.executeAfter()` での操作から逸脱する例外にも適用されますが、新しい[メモリマネージャ](#preview-of-the-new-memory-manager)にのみ適用されます。

API の改善は、`setUnhandledExceptionHook()` によって設定されたフックにも影響を与えました。以前は、Kotlin/Native ランタイムが未処理例外でフックを呼び出すと、これらのフックはリセットされ、プログラムは常に直後に終了していました。
現在、これらのフックは複数回使用できるようになりました。未処理例外でプログラムを常に終了させたい場合は、未処理例外フックを設定しない (`setUnhandledExceptionHook()`) か、フックの最後に `terminateWithUnhandledException()` を呼び出すようにしてください。
これにより、例外をサードパーティのクラッシュレポートサービス (Firebase Crashlytics など) に送信し、プログラムを終了させることができます。
`main()` から逸脱する例外や、相互運用境界を越える例外は、フックが `terminateWithUnhandledException()` を呼び出さなくても、常にプログラムを終了させます。

## Kotlin/JS
Kotlin/JS コンパイラ向け IR バックエンドの安定化作業を継続しています。
Kotlin/JS には、Node.js と Yarn のダウンロードを無効にする[オプション](#option-to-use-pre-installed-node-js-and-yarn)が追加されました。

### プリインストールされた Node.js と Yarn を使用するオプション
Kotlin/JS プロジェクトをビルドする際に Node.js と Yarn のダウンロードを無効にし、ホストにすでにインストールされているインスタンスを使用できるようになりました。
これは、CI サーバーなどのインターネット接続のないサーバーでビルドする場合に役立ちます。

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
Kotlin 1.6.0 では、`KotlinGradleSubplugin` クラスの非推奨レベルを「ERROR」に変更しました。
このクラスはコンパイラプラグインの記述に使用されていました。今後のリリースで、このクラスは削除されます。代わりに `KotlinCompilerPluginSupportPlugin` クラスを使用してください。

`kotlin.useFallbackCompilerSearch` ビルドオプションと、`noReflect` および `includeRuntime` コンパイラオプションを削除しました。
`useIR` コンパイラオプションは非表示になり、今後のリリースで削除される予定です。

Kotlin Gradle プラグインで[現在サポートされているコンパイラオプション](gradle-compiler-options.md)の詳細について学ぶ。

## 標準ライブラリ
標準ライブラリの新しい 1.6.0 バージョンでは、実験的な機能が安定化され、新しい機能が導入され、プラットフォーム間での動作が統一されています。

* [新しい readline 関数](#new-readline-functions)
* [Stable `typeOf()`](#stable-typeof)
* [Stable コレクションビルダー](#stable-collection-builders)
* [Stable Duration API](#stable-duration-api)
* [Regex をシーケンスに分割](#splitting-regex-into-a-sequence)
* [整数のビットローテーション操作](#bit-rotation-operations-on-integers)
* [JS における `replace()` および `replaceFirst()` の変更](#changes-for-replace-and-replacefirst-in-js)
* [既存 API の改善](#improvements-to-the-existing-api)
* [非推奨](#deprecations)

### 新しい readline 関数
Kotlin 1.6.0 では、標準入力処理のための新しい関数、[`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html) と [`readlnOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln-or-null.html) が提供されます。

> 現時点では、新しい関数は JVM および Native ターゲットプラットフォームでのみ利用可能です。
>
{style="note"}

|**以前のバージョン**|**1.6.0 の代替**|**使用例**|
| --- | --- | --- |
|`readLine()!!`|`readln()`| 標準入力から行を読み取り、それを返します。EOF に達した場合は `RuntimeException` をスローします。 |
|`readLine()`|`readlnOrNull()`| 標準入力から行を読み取り、それを返します。EOF に達した場合は `null` を返します。 |

行を読み取る際に `!!` を使用する必要がなくなることで、初心者にとっての体験が向上し、Kotlin の学習が簡素化されると私たちは考えています。
読み取り行の操作名を `println()` との整合性を保つため、新しい関数の名前を「ln」に短縮することにしました。

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

既存の `readLine()` 関数は、IDE のコード補完で `readln()` および `readlnOrNull()` よりも優先度が低くなります。
IDE インスペクションも、レガシーな `readLine()` の代わりに新しい関数を使用することを推奨します。

将来のリリースで `readLine()` 関数を段階的に非推奨にする予定です。

### Stable `typeOf()`
バージョン 1.6.0 では、[安定版](components-stability.md) [`typeOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/type-of.html) 関数が導入され、[主要なロードマップ項目](https://youtrack.com/issue/KT-45396)の1つが完了しました。

[1.3.40 以降](https://blog.jetbrains.com/kotlin/2019/06/kotlin-1-3-40-released/)、`typeOf()` は JVM プラットフォームで実験的な API として利用可能でした。
これで、どの Kotlin プラットフォームでもこれを使用でき、コンパイラが推論できるあらゆる Kotlin 型の [`KType`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-type/#kotlin.reflect.KType) 表現を取得できます。

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

### Stable コレクションビルダー
Kotlin 1.6.0 では、コレクションビルダー関数が[安定版](components-stability.md)に昇格されました。コレクションビルダーによって返されるコレクションは、読み取り専用の状態でもシリアライズ可能になりました。

[`buildMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-map.html)、
[`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html)、および [`buildSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-set.html)
をオプトインアノテーションなしで使用できるようになりました。

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

### Stable Duration API
異なる時間単位で期間量を表す[`Duration`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/)クラスが[安定版](components-stability.md)に昇格されました。1.6.0 では、Duration API に次の変更が加えられました。

* 期間を日、時、分、秒、ナノ秒に分解する[`toComponents()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-components.html)関数の最初のコンポーネントが、`Int`型ではなく`Long`型になりました。
  以前は、値が`Int`範囲に収まらない場合、その範囲に強制変換されていました。`Long`型を使用すると、`Int`に収まらない値を切り捨てることなく、期間範囲内のあらゆる値を分解できます。

* `DurationUnit` enum は、JVM 上で `java.util.concurrent.TimeUnit` の型エイリアスではなく、独立した存在になりました。
  `typealias DurationUnit = TimeUnit` が役立つ説得力のあるケースは見つかりませんでした。また、型エイリアスを介して `TimeUnit` API を公開すると、`DurationUnit` ユーザーが混乱する可能性があります。

* コミュニティからのフィードバックに応え、`Int.seconds` のような拡張プロパティを復活させます。しかし、その適用範囲を制限したいため、`Duration` クラスのコンパニオンに配置しました。
  IDE はコード補完で拡張を提案し、コンパニオンからのインポートを自動的に挿入できますが、将来的にはこの動作を `Duration` 型が期待される場合に限定する予定です。

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

  以前導入された `Duration.seconds(Int)` などのコンパニオン関数や、非推奨のトップレベル拡張関数 (`Int.seconds` など) を、`Duration.Companion` の新しい拡張関数に置き換えることをお勧めします。

  > このような置き換えは、古いトップレベル拡張と新しいコンパニオン拡張との間で曖昧さを引き起こす可能性があります。
  > 自動移行を行う前に、`kotlin.time` パッケージのワイルドカードインポート (`import kotlin.time.*`) を使用していることを確認してください。
  >
  {style="note"}

### Regex をシーケンスに分割
`Regex.splitToSequence(CharSequence)` と `CharSequence.splitToSequence(Regex)` 関数が[安定版](components-stability.md)に昇格されました。
これらの関数は、指定された正規表現の一致箇所で文字列を分割しますが、結果を[シーケンス](sequences.md)として返すため、この結果に対するすべての操作は遅延実行されます。

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

### 整数のビットローテーション操作
Kotlin 1.6.0 では、ビット操作のための `rotateLeft()` および `rotateRight()` 関数が[安定版](components-stability.md)になりました。
これらの関数は、数値のバイナリ表現を指定されたビット数だけ左右に回転させます。

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

### JS における `replace()` および `replaceFirst()` の変更
Kotlin 1.6.0 より前は、[`replace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/replace.html)
および [`replaceFirst()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/replace-first.html) Regex 関数は、置換文字列にグループ参照が含まれている場合に、Java と JS で動作が異なっていました。
すべてのターゲットプラットフォームで動作の一貫性を保つため、JS での実装を変更しました。

置換文字列内の `${name}` または `$index` の出現は、指定されたインデックスまたは名前を持つキャプチャされたグループに対応する部分文字列に置換されます。
* `$index` – '``` の後の最初の数字は常にグループ参照の一部として扱われます。後続の数字は、有効なグループ参照を形成する場合にのみ `index` に組み込まれます。数字 '0'～'9' のみがグループ参照の潜在的な構成要素と見なされます。キャプチャされたグループのインデックスは '1' から始まることに注意してください。
  インデックス '0' のグループは、全体の一致を表します。
* `${name}` – `name` は、ラテン文字 'a'～'z'、'A'～'Z'、または数字 '0'～'9' で構成できます。最初の文字は文字である必要があります。

    > 置換パターンにおける名前付きグループは、現在 JVM でのみサポートされています。
    >
    {style="note"}

* 後続の文字をリテラルとして置換文字列に含めるには、バックスラッシュ文字 `\` を使用します。

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
* バージョン 1.6.0 では、`Comparable.compareTo()` の中置拡張関数が追加されました。2つのオブジェクトの順序を比較するために、中置形式を使用できるようになりました。

    ```kotlin
     class WrappedText(val text: String) : Comparable<WrappedText> {
         override fun compareTo(other: WrappedText): Int =
             this.text compareTo other.text
    }
    ```

* JS の `Regex.replace()` も、すべてのプラットフォームで実装を統一するためにインラインではなくなりました。
* `compareTo()` および `equals()` String 関数、ならびに `isBlank()` CharSequence 関数は、JS で JVM とまったく同じように動作するようになりました。
  以前は、非 ASCII 文字に関して差異がありました。

### 非推奨
Kotlin 1.6.0 では、JS のみの stdlib API の一部について、警告を伴う非推奨化サイクルを開始します。

#### concat()、match()、matches() 文字列関数
* 文字列を、指定された他のオブジェクトの文字列表現と連結するには、`concat()` の代わりに `plus()` を使用します。
* 入力内の正規表現のすべての出現箇所を見つけるには、`String.match(regex: String)` の代わりに Regex クラスの `findAll()` を使用します。
* 正規表現が入力全体と一致するかどうかを確認するには、`String.matches(regex: String)` の代わりに Regex クラスの `matches()` を使用します。

#### 比較関数を受け取る配列に対する sort()
比較関数によって渡された順序に従って配列をソートする `Array<out T>.sort()` 関数およびインライン関数 `ByteArray.sort()`、`ShortArray.sort()`、`IntArray.sort()`、`LongArray.sort()`、`FloatArray.sort()`、`DoubleArray.sort()`、`CharArray.sort()` を非推奨にしました。
配列のソートには、他の標準ライブラリ関数を使用してください。

参照として、[コレクションの順序付け](collection-ordering.md)セクションを参照してください。

## ツール
### Kover – Kotlin 用のコードカバレッジツール
> Kover Gradle プラグインは実験的です。GitHubでの[フィードバック](https://github.com/Kotlin/kotlinx-kover/issues)をお待ちしております。
>
{style="warning"}

Kotlin 1.6.0 では、Kover を導入します。Kover は、[IntelliJ](https://github.com/JetBrains/intellij-coverage) および [JaCoCo](https://github.com/jacoco/jacoco) Kotlin コードカバレッジエージェント用の Gradle プラグインです。
インライン関数を含むすべての言語構成要素で動作します。

Kover の詳細については、[GitHub リポジトリ](https://github.com/Kotlin/kotlinx-kover)またはこのビデオをご覧ください。

<video src="https://www.youtube.com/v/jNu5LY9HIbw" title="Kover – The Code Coverage Plugin"/>

## Coroutines 1.6.0-RC
`kotlinx.coroutines` [1.6.0-RC](https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.6.0-RC) がリリースされ、
複数の機能と改善が含まれています。

* [新しい Kotlin/Native メモリマネージャ](#preview-of-the-new-memory-manager)のサポート
* 追加のスレッドを作成せずに並行処理を制限できるディスパッチャ _ビュー_ API の導入
* Java 6 から Java 8 ターゲットへの移行
* 新しい再構築された API とマルチプラットフォームサポートを備えた `kotlinx-coroutines-test`
* コルーチンに [`ThreadLocal`](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/ThreadLocal.html) 変数へのスレッドセーフな書き込みアクセスを提供する [`CopyableThreadContextElement`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-copyable-thread-context-element/index.html) の導入

詳細については、[変更ログ](https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.6.0-RC)を参照してください。

## Kotlin 1.6.0 への移行
IntelliJ IDEA および Android Studio は、Kotlin プラグインが利用可能になり次第、1.6.0 へのアップデートを提案します。

既存のプロジェクトを Kotlin 1.6.0 に移行するには、Kotlin のバージョンを `1.6.0` に変更し、Gradle または Maven プロジェクトを再インポートします。
[Kotlin 1.6.0 へのアップデート方法](releases.md#update-to-a-new-kotlin-version)について学ぶ。

Kotlin 1.6.0 で新しいプロジェクトを開始するには、Kotlin プラグインを更新し、**File** | **New** | **Project** からプロジェクトウィザードを実行します。

新しいコマンドラインコンパイラは、[GitHub リリースページ](https://github.com/JetBrains/kotlin/releases/tag/v1.6.0)からダウンロードできます。

Kotlin 1.6.0 は[機能リリース](kotlin-evolution-principles.md#language-and-tooling-releases)であるため、以前のバージョンの言語で書かれたコードと互換性のない変更をもたらす可能性があります。
そのような変更点の詳細なリストは、[Kotlin 1.6 互換性ガイド](compatibility-guide-16.md)で確認できます。