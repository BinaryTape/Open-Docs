---
title: "Kotlin 1.6.0 の新機能"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[公開日: 2021年11月16日](releases#release-details)_

Kotlin 1.6.0では、新しい言語機能、既存の機能の最適化と改善、そしてKotlin標準ライブラリへの多くの改善が導入されています。

変更点の概要は、[リリースブログ記事](https://blog.jetbrains.com/kotlin/2021/11/kotlin-1-6-0-is-released/)をご覧ください。

## 言語

Kotlin 1.6.0では、以前の1.5.30リリースでプレビューとして導入されたいくつかの言語機能が安定化されました。
* [enum、sealed、およびBooleanのsubjectに対する網羅的なwhenステートメントの安定化](#stable-exhaustive-when-statements-for-enum-sealed-and-boolean-subjects)
* [supertypeとしてのsuspend関数の安定化](#stable-suspending-functions-as-supertypes)
* [suspend変換の安定化](#stable-suspend-conversions)
* [annotationクラスのインスタンス化の安定化](#stable-instantiation-of-annotation-classes)

また、さまざまな型推論の改善や、クラスの型パラメータに対するannotationのサポートも含まれています。
* [再帰的なジェネリック型に対する型推論の改善](#improved-type-inference-for-recursive-generic-types)
* [builder推論の変更](#changes-to-builder-inference)
* [クラスの型パラメータに対するannotationのサポート](#support-for-annotations-on-class-type-parameters)

### enum、sealed、およびBooleanのsubjectに対する網羅的なwhenステートメントの安定化

_網羅的な_ [`when`](control-flow#when-expressions-and-statements)ステートメントは、そのsubjectのすべての可能な型または値に対するbranch、またはいくつかの型と`else` branchを含んでいます。これはすべての可能なケースをカバーし、コードをより安全にします。

`when`式の動作と一貫性を持たせるために、まもなく網羅的でない`when`ステートメントを禁止する予定です。
スムーズな移行を確実にするために、Kotlin 1.6.0では、enum、sealed、またはBooleanのsubjectを持つ網羅的でない`when`ステートメントに関する警告が表示されます。
これらの警告は、将来のリリースでエラーになります。

```kotlin
sealed class Contact {
    data class PhoneCall(val number: String) : Contact()
    data class TextMessage(val number: String) : Contact()
}

fun Contact.messageCost(): Int =
    when(this) { // Error: 'when' expression must be exhaustive
        is Contact.PhoneCall `->` 42
    }

fun sendMessage(contact: Contact, message: String) {
    // Starting with 1.6.0

    // Warning: Non exhaustive 'when' statements on Boolean will be
    // prohibited in 1.7, add 'false' branch or 'else' branch instead 
    when(message.isEmpty()) {
        true `->` return
    }
    // Warning: Non exhaustive 'when' statements on sealed class/interface will be
    // prohibited in 1.7, add 'is TextMessage' branch or 'else' branch instead
    when(contact) {
        is Contact.PhoneCall `->` TODO()
    }
}
```

変更点とその影響の詳細な説明については、[こちらのYouTrackチケット](https://youtrack.jetbrains.com/issue/KT-47709)をご覧ください。

### supertypeとしてのsuspend関数の安定化

Kotlin 1.6.0では、suspend関数の型の実装が[安定化](components-stability)されました。
プレビューは[1.5.30で利用可能](whatsnew1530#suspending-functions-as-supertypes)でした。

この機能は、Kotlinコルーチンを使用し、suspend関数の型を受け入れるAPIを設計する際に役立ちます。
suspend関数の型を実装する個別のクラスに必要な動作を記述することで、コードを効率化できます。

```kotlin
class MyClickAction : suspend () `->` Unit {
    override suspend fun invoke() { TODO() }
}

fun launchOnClick(action: suspend () `->` Unit) {}
```

このクラスのインスタンスは、以前はラムダ式とsuspend関数の参照のみが許可されていた場所で使用できます: `launchOnClick(MyClickAction())`。

現在、実装の詳細に起因する2つの制限があります。
* 通常の関数型とsuspend関数型をsupertypeのリストに混在させることはできません。
* 複数のsuspend関数型supertypeを使用することはできません。

### suspend変換の安定化

Kotlin 1.6.0では、通常の関数型からsuspend関数型への[安定化](components-stability)された変換が導入されました。
1.4.0以降、この機能は関数リテラルとcallableな参照をサポートしていました。
1.6.0では、すべての形式の式で機能します。呼び出し引数として、suspend関数が期待される場所に、適切な通常の関数型の式を渡せるようになりました。
コンパイラは暗黙的な変換を自動的に実行します。

```kotlin
fun getSuspending(suspending: suspend () `->` Unit) {}

fun suspending() {}

fun test(regular: () `->` Unit) {
    getSuspending { }           // OK
    getSuspending(::suspending) // OK
    getSuspending(regular)      // OK
}
```

### annotationクラスのインスタンス化の安定化

Kotlin 1.5.30では、JVMプラットフォームでのannotationクラスのインスタンス化に対する実験的なサポートが[導入されました](whatsnew1530#instantiation-of-annotation-classes)。
1.6.0では、この機能はKotlin/JVMとKotlin/JSの両方でデフォルトで使用できます。

annotationクラスのインスタンス化の詳細については、[こちらのKEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-instantiation)をご覧ください。

### 再帰的なジェネリック型に対する型推論の改善

Kotlin 1.5.30では、再帰的なジェネリック型に対する型推論の改善が導入されました。これにより、対応する型パラメータの上限のみに基づいて型引数を推論できるようになりました。
この改善はコンパイラオプションで使用可能でした。バージョン1.6.0以降では、デフォルトで有効になっています。

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

### builder推論の変更

builder推論は、ジェネリックなbuilder関数を呼び出す際に役立つ型推論の一種です。これは、ラムダ引数内の呼び出しからの型情報を使用して、呼び出しの型引数を推論できます。

完全に安定したbuilder推論に近づくために、いくつかの変更を加えています。1.6.0以降：
* [1.5.30で導入された](whatsnew1530#eliminating-builder-inference-restrictions)コンパイラオプション`-Xunrestricted-builder-inference`を指定せずに、builderラムダ内でまだ推論されていない型のインスタンスを返す呼び出しを行うことができます。
* `-Xenable-builder-inference`を使用すると、[`@BuilderInference`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-builder-inference/) annotationを適用せずに、独自のbuilderを作成できます。

    > これらのbuilderのクライアントは、同じ`-Xenable-builder-inference`コンパイラオプションを指定する必要があります。
    >
    

* `-Xenable-builder-inference`を使用すると、通常の型推論で型に関する十分な情報を取得できない場合、builder推論が自動的にアクティブになります。

[カスタムジェネリックbuilderの作成方法](using-builders-with-builder-inference)をご覧ください。

### クラスの型パラメータに対するannotationのサポート

クラスの型パラメータに対するannotationのサポートは次のようになります。

```kotlin
@Target(AnnotationTarget.TYPE_PARAMETER)
annotation class BoxContent

class Box<@BoxContent T> {}
```

すべての型パラメータに対するannotationはJVM bytecodeに出力されるため、annotationプロセッサはそれらを使用できます。

動機となるユースケースについては、[こちらのYouTrackチケット](https://youtrack.jetbrains.com/issue/KT-43714)をお読みください。

[annotation](annotations)の詳細をご覧ください。

## より長い期間、以前のAPIバージョンをサポート

Kotlin 1.6.0以降では、現在の安定版に加えて、以前のAPIバージョンを2つではなく3つサポートします。現在、バージョン1.3、1.4、1.5、および1.6をサポートしています。

## Kotlin/JVM

Kotlin/JVMの場合、1.6.0以降、コンパイラはJVM 17に対応するbytecodeバージョンでクラスを生成できます。新しい言語バージョンには、最適化されたdelegated propertiesとrepeatable annotationsも含まれています。
* [1.8 JVM targetに対するruntime retentionを持つrepeatable annotations](#repeatable-annotations-with-runtime-retention-for-1-8-jvm-target)
* [指定されたKPropertyインスタンスでget/setを呼び出すdelegated propertiesを最適化](#optimize-delegated-properties-which-call-get-set-on-the-given-kproperty-instance)

### 1.8 JVM targetに対するruntime retentionを持つrepeatable annotations

Java 8では、[repeatable annotations](https://docs.oracle.com/javase/tutorial/java/annotations/repeating.html)が導入されました。これは、1つのコード要素に複数回適用できます。
この機能には、Javaコードに2つの宣言が必要です。[`@java.lang.annotation.Repeatable`](https://docs.oracle.com/javase/8/docs/api/java/lang/annotation/Repeatable.html)でマークされたrepeatable annotation自体と、その値を保持するためのcontaining annotationです。

Kotlinにもrepeatable annotationsがありますが、repeatableにするためにはannotation宣言に[`@kotlin.annotation.Repeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/)が存在するだけで済みます。
1.6.0より前では、この機能は`SOURCE` retentionのみをサポートし、Javaのrepeatable annotationsとは互換性がありませんでした。
Kotlin 1.6.0では、これらの制限が取り除かれました。`@kotlin.annotation.Repeatable`は、任意のretentionを受け入れ、KotlinとJavaの両方でannotationをrepeatableにします。
Javaのrepeatable annotationsもKotlin側からサポートされるようになりました。

containing annotationを宣言できますが、必須ではありません。例：
* annotation `@Tag`が`@kotlin.annotation.Repeatable`でマークされている場合、Kotlinコンパイラは`@Tag.Container`という名前でcontaining annotationクラスを自動的に生成します。

    ```kotlin
    @Repeatable 
    annotation class Tag(val name: String)

    // The compiler generates @Tag.Container containing annotation
    ```

* containing annotationにカスタム名を設定するには、[`@kotlin.jvm.JvmRepeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvmrepeatable/) meta-annotationを適用し、明示的に宣言されたcontaining annotationクラスを引数として渡します。

    ```kotlin
    @JvmRepeatable(Tags::class)
    annotation class Tag(val name: String)
    
    annotation class Tags(val value: Array<Tag>)
    ```

Kotlinリフレクションは、新しい関数[`KAnnotatedElement.findAnnotations()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/find-annotations.html)を介して、KotlinとJavaの両方のrepeatable annotationsをサポートします。

Kotlinのrepeatable annotationsの詳細については、[こちらのKEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/repeatable-annotations)をご覧ください。

### 指定されたKPropertyインスタンスでget/setを呼び出すdelegated propertiesを最適化

`$delegate`フィールドを省略し、参照されるpropertyへの即時アクセスを生成することで、生成されたJVM bytecodeを最適化しました。

たとえば、次のコードでは

```kotlin
class Box<T> {
    private var impl: T = ...

    var content: T by ::impl
}
```

Kotlinは`content$delegate`フィールドを生成しなくなりました。
`content`変数のproperty accessorは、delegated propertyの`getValue`/`setValue`オペレーターをスキップし、[`KProperty`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-property/index.html)型のproperty参照オブジェクトの必要性を回避して、`impl`変数を直接呼び出します。

実装してくれたGoogleの同僚に感謝します！

[delegated properties](delegated-properties)の詳細をご覧ください。

## Kotlin/Native

Kotlin/Nativeは、複数の改善とコンポーネントの更新を受けています。そのうちのいくつかはプレビュー状態です。
* [新しいメモリマネージャのプレビュー](#preview-of-the-new-memory-manager)
* [Xcode 13のサポート](#support-for-xcode-13)
* [任意のホストでのWindows targetのコンパイル](#compilation-of-windows-targets-on-any-host)
* [LLVMとリンカの更新](#llvm-and-linker-updates)
* [パフォーマンスの向上](#performance-improvements)
* [JVMおよびJS IRバックエンドとの統合されたコンパイラプラグインABI](#unified-compiler-plugin-abi-with-jvm-and-js-ir-backends)
* [klibリンケージ失敗の詳細なエラーメッセージ](#detailed-error-messages-for-klib-linkage-failures)
* [リワークされた未処理の例外処理API](#reworked-unhandled-exception-handling-api)

### 新しいメモリマネージャのプレビュー

:::note
新しいKotlin/Nativeメモリマネージャは[実験的](components-stability)です。
いつでも削除または変更される可能性があります。オプトインが必要です（詳細は下記参照）。評価目的でのみ使用してください。
[YouTrack](https://youtrack.jetbrains.com/issue/KT-48525)でフィードバックをお待ちしております。

Kotlin 1.6.0では、新しいKotlin/Nativeメモリマネージャの開発プレビューを試すことができます。
これにより、JVMとNativeプラットフォームの違いを解消し、マルチプラットフォームプロジェクトで一貫した開発者エクスペリエンスを提供することに近づきます。

注目すべき変更点の1つは、Kotlin/JVMのように、トップレベルのpropertiesの遅延初期化です。トップレベルのpropertyは、同じファイルのトップレベルのpropertyまたは関数が最初にアクセスされたときに初期化されます。
このモードには、グローバルな手続き間最適化（リリースバイナリでのみ有効）も含まれており、冗長な初期化チェックが削除されます。

最近、新しいメモリマネージャに関する[ブログ記事](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/)を公開しました。
新しいメモリマネージャの現在の状態について学び、いくつかのデモプロジェクトを見つけたり、[移行手順](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/NEW_MM)に直接ジャンプして自分で試してみてください。
新しいメモリマネージャがプロジェクトでどのように機能するかを確認し、[YouTrack](https://youtrack.jetbrains.com/issue/KT-48525)のissue trackerでフィードバックを共有してください。

### Xcode 13のサポート

Kotlin/Native 1.6.0は、最新バージョンのXcodeであるXcode 13をサポートしています。Xcodeを更新して、Appleオペレーティングシステム用のKotlinプロジェクトの作業を続けることができます。

Xcode 13で追加された新しいライブラリは、Kotlin 1.6.0では使用できませんが、今後のバージョンでサポートを追加する予定です。

:::

### 任意のホストでのWindows targetのコンパイル

1.6.0以降では、Windows target `mingwX64`および`mingwX86`をコンパイルするためにWindowsホストは必要ありません。これらは、Kotlin/Nativeをサポートする任意のホストでコンパイルできます。

### LLVMとリンカの更新

Kotlin/Nativeが内部で使用するLLVM依存関係をリワークしました。これにより、次のようなさまざまな利点があります。
* LLVMバージョンを11.1.0に更新しました。
* 依存関係のサイズが減少しました。たとえば、macOSでは、以前のバージョンの1200 MBではなく、約300 MBになりました。
* 最新のLinuxディストリビューションでは利用できない[`ncurses5`ライブラリへの依存関係を除外しました](https://youtrack.jetbrains.com/issue/KT-42693)。

LLVMの更新に加えて、Kotlin/Nativeは、MingGW targetに[LLD](https://lld.llvm.org/)リンカ（LLVMプロジェクトのリンカ）を使用するようになりました。
これにより、以前に使用されていたld.bfdリンカよりもさまざまな利点があり、生成されたバイナリのランタイムパフォーマンスを向上させ、MinGW targetのコンパイラキャッシュをサポートできます。
LLDは[DLLリンケージのインポートライブラリを必要とする](whatsnew1530#deprecation-of-linkage-against-dlls-without-import-libraries-for-mingw-targets)ことに注意してください。
詳細については、[こちらのStack Overflowスレッド](https://stackoverflow.com/questions/3573475/how-does-the-import-library-work-details/3573527/#3573527)をご覧ください。

### パフォーマンスの向上

Kotlin/Native 1.6.0では、次のパフォーマンスが向上しました。

* コンパイル時間：コンパイラキャッシュは、`linuxX64`および`iosArm64` targetに対してデフォルトで有効になっています。
これにより、デバッグモードでのほとんどのコンパイルが高速化されます（最初のコンパイルを除く）。測定では、テストプロジェクトで約200％の速度向上が示されました。
コンパイラキャッシュは、[追加のGradle property](whatsnew15#performance-improvements)を使用して、Kotlin 1.5.0からこれらのtargetで使用できるようになりました。これでそれらを削除できます。
* ランタイム：生成されたLLVMコードの最適化により、`for`ループで配列を反復処理することが最大12％高速になりました。

### JVMおよびJS IRバックエンドとの統合されたコンパイラプラグインABI

:::note
Kotlin/Nativeで共通IRコンパイラプラグインABIを使用するオプションは[実験的](components-stability)です。
いつでも削除または変更される可能性があります。オプトインが必要です（詳細は下記参照）。評価目的でのみ使用してください。
[YouTrack](https://youtrack.jetbrains.com/issue/KT-48595)でフィードバックをお待ちしております。

以前のバージョンでは、コンパイラプラグインの作成者は、ABIの違いにより、Kotlin/Native用の個別のアーティファクトを提供する必要がありました。

1.6.0以降、Kotlin Multiplatform Gradleプラグインは、埋め込み可能なコンパイラjar（JVMおよびJS IRバックエンドで使用されるもの）をKotlin/Nativeに使用できます。
これは、コンパイラプラグインの開発エクスペリエンスの統合に向けた一歩です。Nativeおよびその他のサポートされているプラットフォームで同じコンパイラプラグインアーティファクトを使用できるようになったためです。

これはそのようなサポートのプレビューバージョンであり、オプトインが必要です。
Kotlin/Nativeにジェネリックコンパイラプラグインアーティファクトの使用を開始するには、次の行を`gradle.properties`に追加します：`kotlin.native.useEmbeddableCompilerJar=true`。

今後、Kotlin/Nativeで埋め込み可能なコンパイラjarをデフォルトで使用する予定ですので、プレビューがどのように機能するかをお知らせいただくことが重要です。

コンパイラプラグインの作成者の方は、このモードを試して、プラグインで動作するかどうかを確認してください。
プラグインの構造によっては、移行手順が必要になる場合があることに注意してください。移行手順については、[こちらのYouTrack issue](https://youtrack.jetbrains.com/issue/KT-48595)を参照し、コメントでフィードバックをお寄せください。

### klibリンケージ失敗の詳細なエラーメッセージ

Kotlin/Nativeコンパイラは、klibリンケージエラーの詳細なエラーメッセージを提供するようになりました。
メッセージには、明確なエラーの説明があり、考えられる原因と修正方法に関する情報も含まれています。

例：
* 1.5.30：

    ```text
    e: java.lang.IllegalStateException: IrTypeAliasSymbol expected: Unbound public symbol for public kotlinx.coroutines/CancellationException|null[0]
    <stack trace>
    ```

* 1.6.0：

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

### リワークされた未処理の例外処理API

Kotlin/Nativeランタイム全体の未処理の例外の処理を統合し、カスタム実行環境（`kotlinx.coroutines`など）で使用するために、デフォルトの処理を関数`processUnhandledException(throwable: Throwable)`として公開しました。
この処理は、[新しいメモリマネージャ](#preview-of-the-new-memory-manager)の場合にのみ、`Worker.executeAfter()`の操作からエスケープする例外にも適用されます。

APIの改善は、`setUnhandledExceptionHook()`によって設定されたフックにも影響しました。以前は、Kotlin/Nativeランタイムが未処理の例外でフックを呼び出した後、このようなフックはリセットされ、プログラムはすぐに終了していました。
現在、これらのフックは複数回使用でき、未処理の例外でプログラムを常に終了させたい場合は、未処理の例外フックを設定しない(`setUnhandledExceptionHook()`)か、フックの最後に`terminateWithUnhandledException()`を必ず呼び出してください。
これは、例外をサードパーティのクラッシュレポートサービス（Firebase Crashlyticsなど）に送信してから、プログラムを終了するのに役立ちます。
`main()`からエスケープする例外と、interop境界を越える例外は、フックが`terminateWithUnhandledException()`を呼び出さなかった場合でも、常にプログラムを終了させます。

## Kotlin/JS

Kotlin/JSコンパイラのIRバックエンドの安定化に取り組んでいます。
Kotlin/JSには、[Node.jsとYarnのダウンロードを無効にするオプション](#option-to-use-pre-installed-node-js-and-yarn)があります。

### 事前インストールされたNode.jsとYarnを使用するオプション

Kotlin/JSプロジェクトをビルドするときにNode.jsとYarnのダウンロードを無効にして、ホストにすでにインストールされているインスタンスを使用できるようになりました。
これは、CIサーバーなど、インターネット接続のないサーバーでビルドする場合に役立ちます。

外部コンポーネントのダウンロードを無効にするには、次の行を`build.gradle(.kts)`に追加します。

* Yarn：

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>
    
    ```kotlin
    rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> {
        rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().download = false // or true for default behavior
    }
    ```
    
    </TabItem>
    <TabItem value="groovy" label="Groovy" default>
    
    ```groovy
    rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
        rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).download = false
    }
    ```
    
    </TabItem>
    </Tabs>

* Node.js：

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>
    
    ```kotlin
    rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootPlugin> {
        rootProject.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootExtension>().download = false // or true for default behavior
    }
     
    ```
    
    </TabItem>
    <TabItem value="groovy" label="Groovy" default>
    
    ```groovy
    rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootPlugin) {
        rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootExtension).download = false
    }
    ```
    
    </TabItem>
    </Tabs>

## Kotlin Gradleプラグイン

Kotlin 1.6.0では、`KotlinGradleSubplugin`クラスの非推奨レベルを'ERROR'に変更しました。
このクラスは、コンパイラプラグインの作成に使用されていました。今後のリリースでは、このクラスを削除します。代わりに、クラス`KotlinCompilerPluginSupportPlugin`を使用してください。

`kotlin.useFallbackCompilerSearch`ビルドオプションと`noReflect`および`includeRuntime`コンパイラオプションを削除しました。
`useIR`コンパイラオプションは非表示になっており、今後のリリースで削除されます。

Kotlin Gradleプラグインで[現在サポートされているコンパイラオプション](gradle-compiler-options)の詳細をご覧ください。

## 標準ライブラリ

標準ライブラリの新しい1.6.0バージョンでは、実験的な機能が安定化され、新しい機能が導入され、プラットフォーム全体での動作が統一されます。

* [新しいreadline関数](#new-readline-functions)
* [Stable typeOf()](#stable-typeof)
* [Stable collection builders](#stable-collection-builders)
* [Stable Duration API](#stable-duration-api)
* [Regexをシーケンスに分割](#splitting-regex-into-a-sequence)
* [整数に対するビット回転操作](#bit-rotation-operations-on-integers)
* [JSでのreplace()とreplaceFirst()の変更](#changes-for-replace-and-replacefirst-in-js)
* [既存のAPIの改善](#improvements-to-the-existing-api)
* [非推奨](#deprecations)

### 新しいreadline関数

Kotlin 1.6.0は、標準入力を処理するための新しい関数を提供します：[`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html)と[`readlnOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln-or-null.html)。

現在のところ、新しい関数はJVMおよびNative targetプラットフォームでのみ使用できます。

:::

|**以前のバージョン**|**1.6.0の代替**|**使用法**|
| --- | --- | --- |
|`readLine()!!`|`readln()`| stdinから行を読み取り、それを返します。EOFに達した場合は`RuntimeException`をスローします。|
|`readLine()`|`readlnOrNull()`| stdinから行を読み取り、それを返します。EOFに達した場合は`null`を返します。|

行を読み取るときに`!!`を使用する必要がなくなることで、初心者のエクスペリエンスが向上し、Kotlinの教育が簡素化されると考えています。
読み取り行の操作名を`println()`の対応するものと一致させるために、新しい関数の名前を'ln'に短縮することにしました。

```kotlin
println("What is your nickname?")
val nickname = readln()
println("Hello, $nickname!")
```

```kotlin
fun main() {

    var sum = 0
    while (true) {
        val nextLine = readlnOrNull().takeUnless { 
            it.isNullOrEmpty() 
        } ?: break
        sum += nextLine.toInt()
    }
    println(sum)

}
```

既存の`readLine()`関数は、IDEコード補完で`readln()`および`readlnOrNull()`よりも低い優先度になります。
IDEインスペクションは、従来の`readLine()`の代わりに新しい関数を使用することを推奨します。

今後のリリースでは、`readLine()`関数を徐々に非推奨にする予定です。

### Stable typeOf()

バージョン1.6.0では、[安定化](components-stability)された[`typeOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/type-of.html)関数が導入され、[主要なロードマップアイテム](https://youtrack.jetbrains.com/issue/KT-45396)の1つが完了しました。

[1.3.40以降](https://blog.jetbrains.com/kotlin/2019/06/kotlin-1-3-40-released/)、`typeOf()`はJVMプラットフォームで実験的なAPIとして利用可能でした。
これで、任意のKotlinプラットフォームで使用して、コンパイラが推論できる任意のKotlin型の[`KType`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-type/#kotlin.reflect.KType)表現を取得できます。

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

### Stable collection builders

Kotlin 1.6.0では、collection builder関数が[安定化](components-stability)されました。collection builderによって返されるコレクションは、読み取り専用の状態でシリアライズ可能になりました。

annotationをオプトインせずに、[`buildMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-map.html)、
[`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html)、および[`buildSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-set.html)を使用できるようになりました。

```kotlin
fun main() {

    val x = listOf('b', 'c')
    val y = buildList {
        add('a')
        addAll(x)
        add('d')
    }
    println(y)  // [a, b, c, d]

}
```

### Stable Duration API

さまざまな時間単位で期間を表す[Duration](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/)クラスが[安定化](components-stability)されました。1.6.0では、Duration APIは次の変更を受けました。

* 期間を日、時間、分、秒、およびナノ秒に分解する[`toComponents()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-components.html)関数の最初のコンポーネントは、`Int`型ではなく`Long`型になりました。
  以前は、値が`Int`の範囲に収まらない場合、その範囲に強制的に変換されていました。`Long`型を使用すると、`Int`に収まらない値を切り捨てることなく、期間範囲内の任意の値に分解できます。

* `DurationUnit` enumはスタンドアロンになり、JVMの`java.util.concurrent.TimeUnit`の型エイリアスではなくなりました。
  `typealias DurationUnit = TimeUnit`が役立つ可能性のある説得力のあるケースは見つかりませんでした。また、型エイリアスを介して`TimeUnit` APIを公開すると、`DurationUnit`ユーザーを混乱させる可能性があります。

* コミュニティからのフィードバックに応えて、`Int.seconds`のような拡張propertiesを復活させます。ただし、その適用性を制限したいので、`Duration`クラスのコンパニオンに配置しました。
  IDEは引き続き補完で拡張機能を提案し、コンパニオンからのインポートを自動的に挿入できますが、将来的には、この動作を`Duration`型が期待される場合に制限する予定です。

  ```kotlin
  import kotlin.time.Duration.Companion.seconds
  
  fun main() {

      val duration = 10000
      println("There are ${duration.seconds.inWholeMinutes} minutes in $duration seconds")
      // There are 166 minutes in 10000 seconds

  }
  ```
  
  
  `Duration.seconds(Int)`などの以前に導入されたコンパニオン関数と、`Int.seconds`のような非推奨のトップレベル拡張機能を、`Duration.Companion`の新しい拡張機能に置き換えることをお勧めします。

  > このような置換は、古いトップレベル拡張機能と新しいコンパニオン拡張機能の間であいまいさを引き起こす可能性があります。
  > 自動移行を行う前に、kotlin.timeパッケージのワイルドカードインポート – `import kotlin.time.*` – を必ず使用してください。
  >
  

### Regexをシーケンスに分割

`Regex.splitToSequence(CharSequence)`関数と`CharSequence.splitToSequence(Regex)`関数が[安定化](components-stability)されました。
これらは、指定された正規表現の一致箇所で文字列を分割しますが、この結果に対するすべての操作が遅延実行されるように、結果を[Sequence](sequences)として返します。

```kotlin
fun main() {

    val colorsText = "green, red, brown&blue, orange, pink&green"
    val regex = "[,\\s]+".toRegex()
    val mixedColor = regex.splitToSequence(colorsText)
    // or
    // val mixedColor = colorsText.splitToSequence(regex)
        .onEach { println(it) }
        .firstOrNull { it.contains('&') }
    println(mixedColor) // "brown&blue"

}
```

### 整数に対するビット回転操作

Kotlin 1.6.0では、ビット操作用の`rotateLeft()`関数と`rotateRight()`関数が[安定化](components-stability)されました。
これらの関数は、数のバイナリ表現を指定されたビット数だけ左または右に回転させます。

```kotlin
fun main() {

    val number: Short = 0b10001
    println(number
        .rotateRight(2)
        .toString(radix = 2)) // 100000000000100
    println(number
        .rotateLeft(2)
        .toString(radix = 2))  // 1000100

}
```

### JSでのreplace()とreplaceFirst()の変更

Kotlin 1.6.0より前は、[`replace()`](https://kotlinlang.org/api/