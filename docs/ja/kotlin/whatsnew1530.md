[//]: # (title: Kotlin 1.5.30 の新機能)

<web-summary>新しい言語機能、Kotlin Multiplatform、JVM、Native、JS への更新、Gradle および Maven のビルドツールサポートを含む Kotlin 1.5.30 のリリースノートをご覧ください。</web-summary>

_[リリース日: 2021年8月24日](releases.md#release-history)_

Kotlin 1.5.30 では、将来の変更のプレビューを含む言語のアップデート、プラットフォーム・サポートとツールのさまざまな改善、および新しい標準ライブラリ関数が提供されています。

主な改善点は以下の通りです：
* 実験的なシールド（sealed）`when` ステートメント、オプトイン要求の使用に関する変更などの言語機能
* Appleシリコンのネイティブサポート
* Kotlin/JS IR バックエンドが Beta に到達
* Gradle プラグインのエクスペリエンス改善

変更の短い概要については、[リリースブログ記事（英語）](https://blog.jetbrains.com/kotlin/2021/08/kotlin-1-5-30-released/)およびこちらの動画もご覧ください：

<video src="https://www.youtube.com/v/rNbb3A9IdOo" title="Kotlin 1.5.30"/>

> Kotlin のリリースサイクルに関する情報は、[Kotlin のリリースプロセス](releases.md)をご覧ください。
>
{style="tip"}

## 言語機能

Kotlin 1.5.30 では、将来の言語変更のプレビューを紹介し、オプトイン要求メカニズムと型推論に改善を加えています：
* [sealed および Boolean な対象に対する網羅的な when ステートメント](#exhaustive-when-statements-for-sealed-and-boolean-subjects)
* [スーパータイプとしての suspend 関数](#suspending-functions-as-supertypes)
* [実験的 API の暗黙的な使用に対するオプトイン要求](#requiring-opt-in-on-implicit-usages-of-experimental-apis)
* [異なるターゲットでのオプトイン要求アノテーションの使用に関する変更](#changes-to-using-opt-in-requirement-annotations-with-different-targets)
* [再帰的ジェネリック型の型推論の改善](#improvements-to-type-inference-for-recursive-generic-types)
* [ビルダー推論의 制限の撤廃](#eliminating-builder-inference-restrictions)

### sealed および Boolean な対象に対する網羅的な when ステートメント

> シールド（網羅的）な `when` ステートメントのサポートは[実験的](components-stability.md)です。これはいつでも変更または削除される可能性があります。
> オプトインが必要です（詳細は以下を参照）。評価目的のみで使用してください。これに関するフィードバックを [YouTrack](https://youtrack.jetbrains.com/issue/KT-12380) でお待ちしております。
>
{style="warning"}

*網羅的（exhaustive）*な [`when`](control-flow.md#when-expressions-and-statements) ステートメントとは、対象のすべての可能な型または値に対するブランチ、あるいは特定の型に対するブランチと残りのケースをカバーする `else` ブランチを含むものです。

動作を `when` 式と一致させるため、非網羅的な `when` ステートメントを近く禁止する予定です。スムーズな移行を確実にするため、sealed クラスまたは Boolean を使用した非網羅的な `when` ステートメントについて、コンパイラが警告を報告するように設定できます。このような警告は Kotlin 1.6 でデフォルトで表示され、将来的にはエラーになります。

> Enum については、すでに警告が表示されます。
>
{style="note"}

```kotlin
sealed class Mode {
    object ON : Mode()
    object OFF : Mode()
}

fun main() {
    val x: Mode = Mode.ON
    when (x) { 
        Mode.ON -> println("ON")
    }
// WARNING: Non exhaustive 'when' statements on sealed classes/interfaces 
// will be prohibited in 1.7, add an 'OFF' or 'else' branch instead

    val y: Boolean = true
    when (y) {  
        true -> println("true")
    }
// WARNING: Non exhaustive 'when' statements on Booleans will be prohibited 
// in 1.7, add a 'false' or 'else' branch instead
}
```

Kotlin 1.5.30 でこの機能を有効にするには、言語バージョン `1.6` を使用してください。[プログレッシブモード](whatsnew13.md#progressive-mode)を有効にすることで、警告をエラーに変更することもできます。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets.all {
        languageSettings.apply {
            languageVersion = "1.6"
            //progressiveMode = true // デフォルトは false
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
            languageVersion = '1.6'
            //progressiveMode = true // デフォルトは false
        }
    }
}
```

</tab>
</tabs>

### スーパータイプとしての suspend 関数

> スーパータイプとしての suspend 関数のサポートは[実験的](components-stability.md)です。これはいつでも変更または削除される可能性があります。
> オプトインが必要です（詳細は以下を参照）。評価目的のみで使用してください。これに関するフィードバックを [YouTrack](https://youtrack.jetbrains.com/issue/KT-18707) でお待ちしております。
>
{style="warning"}

Kotlin 1.5.30 では、いくつかの制限付きで `suspend` 関数型をスーパータイプとして使用できる機能のプレビューを提供します。

```kotlin
class MyClass: suspend () -> Unit {
    override suspend fun invoke() { TODO() }
}
```

この機能を有効にするには、`-language-version 1.6` コンパイラオプションを使用してください：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets.all {
        languageSettings.apply {
            languageVersion = "1.6"
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
            languageVersion = '1.6'
        }
    }
}
```

</tab>
</tabs>

この機能には以下の制限があります：
* 通常の関数型と `suspend` 関数型をスーパータイプとして混ぜることはできません。これは JVM バックエンドにおける `suspend` 関数型の実装の詳細によるものです。これらはマーカーインターフェースを持つ通常の関数型として表現されます。マーカーインターフェースのため、どのスーパーインターフェースが suspend でどれが通常のものかを区別する方法がありません。
* 複数の `suspend` 関数スーパータイプを使用することはできません。型チェックがある場合、複数の通常の関数スーパータイプを使用することもできません。

### 実験的 API の暗黙的な使用に対するオプトイン要求

> オプトイン要求メカニズムは[実験的](components-stability.md)です。
> いつでも変更される可能性があります。[オプトインの方法はこちら](opt-in-requirements.md)を参照してください。
> 評価目的のみで使用してください。これに関するフィードバックを [YouTrack](https://youtrack.jetbrains.com/issues/KT) でお待ちしております。
>
{style="warning"}

ライブラリの作成者は、実験的な API に [オプトイン要求](opt-in-requirements.md#create-opt-in-requirement-annotations) のマークを付けて、その API が実験的な状態であることをユーザーに知らせることができます。その API が使用されると、コンパイラは警告またはエラーを発生させ、それを抑制するために [明示的な同意](opt-in-requirements.md#opt-in-to-api) を要求します。

Kotlin 1.5.30 では、シグネチャに実験的な型が含まれている宣言はすべて実験的なものとして扱われます。つまり、実験的 API の暗黙的な使用に対してもオプトインが必要になります。例えば、関数の戻り値の型が実験的 API 要素としてマークされている場合、その宣言自体に明示的にオプトイン要求のマークがなくても、その関数を使用するにはオプトインが必要です。

```kotlin
// ライブラリ側のコード

@RequiresOptIn(message = "This API is experimental.")
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS)
annotation class MyDateTime // オプトイン要求アノテーション

@MyDateTime
class DateProvider // オプトインが必要なクラス

// クライアント側のコード

// 警告: 実験的 API の使用
fun createDateSource(): DateProvider { /* ... */ }

fun getDate(): Date {
    val dateSource = createDateSource() // これも警告: 実験的 API の使用
    // ... 
}
```

詳細は [オプトイン要求](opt-in-requirements.md) をご覧ください。

### 異なるターゲットでのオプトイン要求アノテーションの使用に関する変更

> オプトイン要求メカニズムは[実験的](components-stability.md)です。
> いつでも変更される可能性があります。[オプトインの方法はこちら](opt-in-requirements.md)を参照してください。
> 評価目的のみで使用してください。これに関するフィードバックを [YouTrack](https://youtrack.jetbrains.com/issues/KT) でお待ちしております。
>
{style="warning"}

Kotlin 1.5.30 では、さまざまな [ターゲット](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/) におけるオプトイン要求アノテーションの使用および宣言に関する新しいルールが導入されました。コンパイラは、コンパイル時に処理するのが実用的でないユースケースに対してエラーを報告するようになりました。Kotlin 1.5.30 では：
* 使用箇所でのローカル変数および値パラメータへのオプトイン要求アノテーションの付与は禁止されます。
* オーバーライドへの付与は、その基本宣言にもマークされている場合にのみ許可されます。
* バッキングフィールドおよびゲッターへの付与は禁止されます。代わりに基本プロパティにマークを付けることができます。
* オプトイン要求アノテーションの宣言サイトでの `TYPE` および `TYPE_PARAMETER` アノテーションターゲットの設定は禁止されます。

詳細は [オプトイン要求](opt-in-requirements.md) をご覧ください。

### 再帰的ジェネリック型の型推論の改善

Kotlin と Java では、型パラメータの中で自分自身を参照する再帰的ジェネリック型を定義できます。Kotlin 1.5.30 では、Kotlin コンパイラは、再帰的ジェネリックの場合に、対応する型パラメータの境界（upper bounds）のみに基づいて型引数を推論できるようになりました。これにより、Java でビルダー API を作成するためによく使用される、再帰的ジェネリック型を用いたさまざまなパターンを作成することが可能になります。

```kotlin
// Kotlin 1.5.20
val containerA = PostgreSQLContainer<Nothing>(DockerImageName.parse("postgres:13-alpine")).apply {
    withDatabaseName("db")
    withUsername("user")
    withPassword("password")
    withInitScript("sql/schema.sql")
}

// Kotlin 1.5.30
val containerB = PostgreSQLContainer(DockerImageName.parse("postgres:13-alpine"))
    .withDatabaseName("db")
    .withUsername("user")
    .withPassword("password")
    .withInitScript("sql/schema.sql")
```

この改善を有効にするには、`-Xself-upper-bound-inference` または `-language-version 1.6` コンパイラオプションを渡します。新しくサポートされたユースケースの他の例については、[こちらの YouTrack チケット](https://youtrack.jetbrains.com/issue/KT-40804) を参照してください。

### ビルダー推論の制限の撤廃

ビルダー推論は、ラムダ引数内の他の呼び出しからの型情報に基づいて、呼び出しの型引数を推論できるようにする特殊な型の型推論です。これは、[`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html) や [`sequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/sequence.html) のようなジェネリックなビルダー関数を呼び出す際に便利です： `buildList { add("string") }`。

このようなラムダ引数内では、以前はビルダー推論が推論しようとしている型情報の使用に制限がありました。つまり、その型を指定することはできますが、取得することはできませんでした。例えば、明示的に型引数を指定せずに `buildList()` のラムダ引数内で [`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/get.html) を呼び出すことはできませんでした。

Kotlin 1.5.30 では、`-Xunrestricted-builder-inference` コンパイラオプションによってこれらの制限が解除されます。このオプションを追加して、ジェネリックビルダー関数のラムダ引数内で以前は禁止されていた呼び出しを有効にします：

```kotlin
@kotlin.ExperimentalStdlibApi
val list = buildList {
    add("a")
    add("b")
    set(1, null)
    val x = get(1)
    if (x != null) {
        removeAt(1)
    }
}

@kotlin.ExperimentalStdlibApi
val map = buildMap {
    put("a", 1)
    put("b", 1.1)
    put("c", 2f)
}
```

また、`-language-version 1.6` コンパイラオプションでもこの機能を有効にできます。

## Kotlin/JVM

Kotlin 1.5.30 では、Kotlin/JVM に以下の機能が導入されています：
* [アノテーションクラスのインスタンス化](#instantiation-of-annotation-classes)
* [Nullability アノテーションサポート設定の改善](#improved-nullability-annotation-support-configuration)

JVM プラットフォームにおける Kotlin Gradle プラグインの更新については、[Gradle](#gradle) セクションを参照してください。

### アノテーションクラスのインスタンス化

> アノテーションクラスのインスタンス化は[実験的](components-stability.md)です。これはいつでも変更または削除される可能性があります。
> オプトインが必要です（詳細は以下を参照）。評価目的のみで使用してください。これに関するフィードバックを [YouTrack](https://youtrack.jetbrains.com/issue/KT-45395) でお待ちしております。
>
{style="warning"}

Kotlin 1.5.30 では、任意のコード内で [アノテーションクラス](annotations.md) のコンストラクタを呼び出して、インスタンスを取得できるようになりました。この機能は、アノテーションインターフェースの実装を許可する Java の慣習と同じユースケースをカバーします。

```kotlin
annotation class InfoMarker(val info: String)

fun processInfo(marker: InfoMarker) = ...

fun main(args: Array<String>) {
    if (args.size != 0)
        processInfo(getAnnotationReflective(args))
    else
        processInfo(InfoMarker("default"))
}
```

この機能を有効にするには、`-language-version 1.6` コンパイラオプションを使用してください。なお、`val` 以外のパラメータを定義できない、あるいはセカンダリコンストラクタ以外のメンバを定義できないといった、現在のアノテーションクラスの制限はすべてそのまま維持されます。

アノテーションクラスのインスタンス化の詳細については、[この KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-instantiation.md) を参照してください。

### Nullability アノテーションサポート設定の改善

Kotlin コンパイラは、Java から null 許容性（nullability）情報を取得するために、さまざまな種類の [null 許容性アノテーション](java-interop.md#nullability-annotations) を読み取ることができます。この情報により、Java コードを呼び出す際に Kotlin 側で null 許容性の不一致を報告できます。

Kotlin 1.5.30 では、特定の種類の null 許容性アノテーションからの情報に基づいてコンパイラが不一致を報告するかどうかを指定できます。コンパイラオプション `-Xnullability-annotations=@<package-name>:<report-level>` を使用するだけです。引数には、完全修飾された null 許容性アノテーションのパッケージと、以下のレポートレベルのいずれかを指定します：
* `ignore`: 不一致を無視する
* `warn`: 警告を報告する
* `strict`: エラーを報告する

[サポートされている null 許容性アノテーションの全リスト](java-interop.md#nullability-annotations)と、それらの完全修飾パッケージ名を確認してください。

新しくサポートされた [RxJava](https://github.com/ReactiveX/RxJava) 3 の null 許容性アノテーションに対してエラー報告を有効にする例： `-Xnullability-annotations=@io.reactivex.rxjava3.annotations:strict`。なお、このような不一致はデフォルトではすべて警告となります。

## Kotlin/Native

Kotlin/Native には、さまざまな変更と改善が行われました：
* [Appleシリコンのサポート](#apple-silicon-support)
* [CocoaPods Gradle プラグイン用の Kotlin DSL の改善](#improved-kotlin-dsl-for-the-cocoapods-gradle-plugin)
* [Swift 5.5 の async/await との実験的な相互運用性](#experimental-interoperability-with-swift-5-5-async-await)
* [オブジェクトおよびコンパニオンオブジェクトに対する Swift/Objective-C マッピングの改善](#improved-swift-objective-c-mapping-for-objects-and-companion-objects)
* [MinGW ターゲットにおけるインポートライブラリなしの DLL へのリンクの非推奨化](#deprecation-of-linkage-against-dlls-without-import-libraries-for-mingw-targets)

### Appleシリコンのサポート

Kotlin 1.5.30 では、[Appleシリコン](https://support.apple.com/en-us/HT211814)のネイティブサポートが導入されました。

以前は、Kotlin/Native コンパイラとツールを Appleシリコンホストで動作させるには [Rosetta 翻訳環境](https://developer.apple.com/documentation/apple-silicon/about-the-rosetta-translation-environment) が必要でした。Kotlin 1.5.30 では、翻訳環境は不要になり、コンパイラとツールは追加のアクションなしで Appleシリコンハードウェア上で動作できます。

また、Appleシリコン上で Kotlin コードをネイティブに実行できるようにするための新しいターゲットも導入されました：
* `macosArm64`
* `iosSimulatorArm64`
* `watchosSimulatorArm64`
* `tvosSimulatorArm64`

これらは Intel ベースおよび Appleシリコンベースの両方のホストで利用可能です。既存のすべてのターゲットも、Appleシリコンホストで利用できます。

なお、1.5.30 では、`kotlin-multiplatform` Gradle プラグインにおける Appleシリコンターゲットのサポートは基本的なものに留まっています。特に、新しいシミュレータターゲットは `ios`、`tvos`、`watchos` のターゲットショートカットには含まれていません。
新しいターゲットでのユーザーエクスペリエンス向上のため、引き続き取り組んでまいります。

### CocoaPods Gradle プラグイン用の Kotlin DSL の改善

#### Kotlin/Native フレームワーク用の新パラメータ

Kotlin 1.5.30 では、Kotlin/Native フレームワーク用の改善された CocoaPods Gradle プラグイン DSL が導入されました。フレームワークの名前だけでなく、Pod 設定で他のパラメータも指定できるようになりました：
* フレームワークの動的または静的なバージョンの指定
* エクスポート依存関係の明示的な有効化
* Bitcode 埋め込みの有効化

新しい DSL を使用するには、プロジェクトを Kotlin 1.5.30 にアップデートし、`build.gradle(.kts)` ファイルの `cocoapods` セクションでパラメータを指定します：

```kotlin
cocoapods {
    frameworkName = "MyFramework" // このプロパティは非推奨となり、
    // 将来のバージョンで削除される予定です
    // フレームワーク設定用の新しい DSL：
    framework {
        // すべての Framework プロパティがサポートされています
        // フレームワーク名の設定。非推奨の 'frameworkName' の代わりに使用してください
        baseName = "MyFramework"
        // 動的フレームワークのサポート
        isStatic = false
        // 依存関係のエクスポート
        export(project(":anotherKMMModule"))
        transitiveExport = false // デフォルト
        // Bitcode の埋め込み
        embedBitcode(BITCODE)
    }
}
```

#### Xcode 設定のカスタム名のサポート

Kotlin CocoaPods Gradle プラグインは、Xcode ビルド設定のカスタム名をサポートするようになりました。Xcode でビルド設定に `Staging` などの特別な名前を使用している場合にも役立ちます。

カスタム名を指定するには、`build.gradle(.kts)` ファイルの `cocoapods` セクションで `xcodeConfigurationToNativeBuildType` パラメータを使用します：

```kotlin
cocoapods {
    // カスタム Xcode 設定を NativeBuildType にマッピング
    xcodeConfigurationToNativeBuildType["CUSTOM_DEBUG"] = NativeBuildType.DEBUG
    xcodeConfigurationToNativeBuildType["CUSTOM_RELEASE"] = NativeBuildType.RELEASE
}
```

このパラメータは Podspec ファイルには現れません。Xcode が Gradle ビルドプロセスを実行すると、Kotlin CocoaPods Gradle プラグインが必要なネイティブビルドタイプを選択します。

> `Debug` および `Release` 設定はデフォルトでサポートされているため、宣言する必要はありません。
>
{style="note"}

### Swift 5.5 の async/await との実験的な相互運用性

> Swift の async/await との並行性相互運用性は[実験的](components-stability.md)です。これはいつでも変更または削除される可能性があります。
> 評価目的のみで使用してください。これに関するフィードバックを [YouTrack](https://youtrack.jetbrains.com/issue/KT-47610) でお待ちしております。
>
{style="warning"}

[1.4.0 で Objective-C および Swift から Kotlin の suspend 関数を呼び出すサポートを追加](whatsnew14.md#support-for-kotlin-s-suspending-functions-in-swift-and-objective-c)しましたが、現在は新しい Swift 5.5 の機能である [`async` および `await` 修飾子による並行性](https://github.com/apple/swift-evolution/blob/main/proposals/0296-async-await.md) に合わせて改善を進めています。

Kotlin/Native コンパイラは、戻り値の型が null 許容（nullable）な suspend 関数に対して、生成された Objective-C ヘッダーに `_Nullable_result` 属性を出力するようになりました。これにより、Swift から適切な null 許容性を持った `async` 関数として呼び出すことが可能になります。

この機能は実験的であり、将来的に Kotlin と Swift の両方の変更によって影響を受ける可能性があることに注意してください。現在は、特定の制限があるプレビューとして提供しており、皆さんの意見をお待ちしております。現在の状況の詳細については、[こちらの YouTrack イシュー](https://youtrack.jetbrains.com/issue/KT-47610) で確認し、フィードバックをお寄せください。

### オブジェクトおよびコンパニオンオブジェクトに対する Swift/Objective-C マッピングの改善

オブジェクトおよびコンパニオンオブジェクトの取得が、ネイティブの iOS 開発者にとってより直感的な方法で行えるようになりました。例えば、Kotlin に以下のオブジェクトがあるとします：

```kotlin
object MyObject {
    val x = "Some value"
}

class MyClass {
    companion object {
        val x = "Some value"
    }
}
```

これらに Swift からアクセスするには、`shared` および `companion` プロパティを使用できます：

```swift
MyObject.shared
MyObject.shared.x
MyClass.companion
MyClass.Companion.shared
```

詳細は [Swift/Objective-C の相互運用性](native-objc-interop.md) を参照してください。

### MinGW ターゲットにおけるインポートライブラリなしの DLL へのリンクの非推奨化

[LLD](https://lld.llvm.org/) は LLVM プロジェクトのリンカーであり、デフォルトの ld.bfd に対する利点（主にパフォーマンスの向上）のため、Kotlin/Native の MinGW ターゲットでの使用を開始する予定です。

しかし、LLD の最新の安定版は、MinGW (Windows) ターゲットに対する DLL への直接リンクをサポートしていません。このようなリンクには [インポートライブラリ](https://stackoverflow.com/questions/3573475/how-does-the-import-library-work-details/3573527#3573527) を使用する必要があります。Kotlin/Native 1.5.30 ではこれらは不要ですが、将来的に MinGW のデフォルトリンカーとなる LLD との互換性がないことを知らせるための警告を追加しています。

LLD リンカーへの移行に関するご意見や懸念事項は、[こちらの YouTrack イシュー](https://youtrack.jetbrains.com/issue/KT-47605) で共有してください。

## Kotlin Multiplatform

1.5.30 では、Kotlin Multiplatform に以下の注目すべきアップデートが行われました：
* [共有ネイティブコードでカスタム cinterop ライブラリを使用可能に](#ability-to-use-custom-cinterop-libraries-in-shared-native-code)
* [XCFrameworks のサポート](#support-for-xcframeworks)
* [Android アーティファクトの新しいデフォルトパブリッシュ設定](#new-default-publishing-setup-for-android-artifacts)

### 共有ネイティブコードでカスタム cinterop ライブラリを使用可能に

Kotlin Multiplatform では、共有ソースセットでプラットフォーム依存の相互運用（interop）ライブラリを使用する [オプション](https://kotlinlang.org/docs/multiplatform/multiplatform-share-on-platforms.html#connect-platform-specific-libraries) が用意されています。1.5.30 より前は、これは Kotlin/Native ディストリビューションに付属する [プラットフォームライブラリ](native-platform-libs.md) でのみ動作していました。1.5.30 からは、独自のカスタム `cinterop` ライブラリでも使用可能になります。この機能を有効にするには、`gradle.properties` に `kotlin.mpp.enableCInteropCommonization=true` プロパティを追加してください：

```none
kotlin.mpp.enableGranularSourceSetsMetadata=true
kotlin.native.enableDependencyPropagation=false
kotlin.mpp.enableCInteropCommonization=true
```

### XCFrameworks のサポート

すべての Kotlin Multiplatform プロジェクトで、出力フォーマットとして XCFrameworks を使用できるようになりました。Apple はユニバーサル（ファット）フレームワークの代替として XCFrameworks を導入しました。XCFrameworks を使用すると：
* すべてのターゲットプラットフォームおよびアーキテクチャのロジックを単一のバンドルに集約できます。
* アプリケーションを App Store に公開する前に、不要なアーキテクチャをすべて削除する必要がありません。

XCFrameworks は、Apple M1 上のデバイスやシミュレータで Kotlin フレームワークを使用したい場合に便利です。

XCFrameworks を使用するには、`build.gradle(.kts)` スクリプトを更新してください：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.plugin.mpp.apple.XCFramework

plugins {
    kotlin("multiplatform")
}

kotlin {
    val xcf = XCFramework()
  
    ios {
        binaries.framework {
            baseName = "shared"
            xcf.add(this)
        }
    }
    watchos {
        binaries.framework {
            baseName = "shared"
            xcf.add(this)
        }
    }
    tvos {
        binaries.framework {
            baseName = "shared"
            xcf.add(this)
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.plugin.mpp.apple.XCFrameworkConfig

plugins {
    id 'org.jetbrains.kotlin.multiplatform'
}

kotlin {
    def xcf = new XCFrameworkConfig(project)

    ios {
        binaries.framework {
            baseName = "shared"
            xcf.add(it)
        }
    }
    watchos {
        binaries.framework {
            baseName = "shared"
            xcf.add(it)
        }
    }
    tvos {
        binaries.framework {
            baseName = "shared"
            xcf.add(it)
        }
    }
}
```

</tab>
</tabs>

XCFrameworks を宣言すると、以下の新しい Gradle タスクが登録されます：
* `assembleXCFramework`
* `assembleDebugXCFramework` ([dSYMs を含む](native-debugging.md#debug-ios-applications)追加のデバッグアーティファクト)
* `assembleReleaseXCFramework`

XCFrameworks の詳細は、[この WWDC ビデオ](https://developer.apple.com/videos/play/wwdc2019/416/) を参照してください。

### Android アーティファクトの新しいデフォルトパブリッシュ設定

`maven-publish` Gradle プラグインを使用して、ビルドスクリプトで [Android バリアント](https://developer.android.com/studio/build/build-variants) 名を指定することで、[Android ターゲット用のマルチプラットフォームライブラリを公開](https://kotlinlang.org/docs/multiplatform/multiplatform-publish-lib-setup.html#publish-an-android-library) できます。Kotlin Gradle プラグインが自動的にパブリケーションを生成します。

1.5.30 より前は、生成されたパブリケーションの [メタデータ](https://docs.gradle.org/current/userguide/publishing_gradle_module_metadata.html) には、公開された各 Android バリアントのビルドタイプ属性が含まれていました。そのため、ライブラリの消費者が使用するビルドタイプと同じである場合にのみ互換性がありました。Kotlin 1.5.30 では、新しいデフォルトのパブリッシュ設定が導入されています：
* プロジェクトが公開するすべての Android バリアントが同じビルドタイプ属性を持つ場合、公開されるバリアントにはビルドタイプ属性が含まれず、任意のビルドタイプと互換性が持たされます。
* 公開されるバリアントが異なるビルドタイプ属性を持つ場合、`release` 値を持つものだけがビルドタイプ属性なしで公開されます。これにより、リリースバリアントは消費者側の任意のビルドタイプと互換性を持ち、非リリースバリアントは一致する消費者のビルドタイプとのみ互換性を持ちます。

これをオプトアウトしてすべてのバリアントでビルドタイプ属性を維持するには、Gradle プロパティ `kotlin.android.buildTypeAttribute.keep=true` を設定できます。

## Kotlin/JS

Kotlin/JS では、1.5.30 で 2 つの大きな改善が行われました：
* [JS IR コンパイラバックエンドが Beta に到達](#js-ir-compiler-backend-reaches-beta)
* [Kotlin/JS IR バックエンドを使用するアプリケーションのデバッグエクスペリエンスの向上](#better-debugging-experience-for-applications-with-the-kotlin-js-ir-backend)

### JS IR コンパイラバックエンドが Beta に到達

1.4.0 で [Alpha](components-stability.md) として導入された Kotlin/JS 用の [IR ベースのコンパイラバックエンド](whatsnew14.md#unified-backends-and-extensibility) が Beta に到達しました。

以前、プロジェクトを新しいバックエンドに移行するのを支援するために JS IR バックエンドへの移行ガイドを公開しました。今回、必要な変更を IntelliJ IDEA 内で直接表示する IDE プラグイン [Kotlin/JS Inspection Pack](https://plugins.jetbrains.com/plugin/17183-kotlin-js-inspection-pack/) を紹介します。

### Kotlin/JS IR バックエンドを使用するアプリケーションのデバッグエクスペリエンスの向上

Kotlin 1.5.30 では、Kotlin/JS IR バックエンド向けに JavaScript ソースマップの生成が導入されました。これにより、IR バックエンドが有効な場合の Kotlin/JS デバッグエクスペリエンスが向上し、ブレークポイント、ステップ実行、適切なソース参照を含む読みやすいスタックトレースなど、完全なデバッグサポートが提供されます。

[ブラウザまたは IntelliJ IDEA Ultimate で Kotlin/JS をデバッグする方法](js-debugging.md) をご覧ください。

## Gradle

[Kotlin Gradle プラグインのユーザーエクスペリエンス向上](https://youtrack.jetbrains.com/issue/KT-45778) の一環として、以下の機能を実装しました：
* [Java ツールチェーンのサポート](#support-for-java-toolchains)。これには、[古い Gradle バージョン向けに `UsesKotlinJavaToolchain` インターフェースを使用して JDK のホームを指定する機能](#ability-to-specify-jdk-home-with-useskotlinjavatoolchain-interface) も含まれます。
* [Kotlin デーモンの JVM 引数を明示的に指定するより簡単な方法](#easier-way-to-explicitly-specify-kotlin-daemon-jvm-arguments)

### Java ツールチェーンのサポート

Gradle 6.7 で [「Java ツールチェーンのサポート」](https://docs.gradle.org/current/userguide/toolchains.html) 機能が導入されました。
この機能を使用すると：
* Gradle 自体の実行に使用している JDK/JRE とは異なるものを使用して、コンパイル、テスト、実行を行えます。
* 未リリースの言語バージョンでコードをコンパイルおよびテストできます。

ツールチェーンのサポートにより、Gradle はローカルの JDK を自動検出し、ビルドに必要な不足している JDK をインストールできます。これで、Gradle 自体は任意の JDK で動作しつつ、[ビルドキャッシュ機能](gradle-compilation-and-caches.md#gradle-build-cache-support) を再利用できるようになります。

Kotlin Gradle プラグインは、Kotlin/JVM コンパイルタスクに対して Java ツールチェーンをサポートしています。
Java ツールチェーンは：
* JVM ターゲットで利用可能な [`jdkHome` オプション](gradle-compiler-options.md#attributes-specific-to-jvm) を設定します。
  > [`jdkHome` オプションを直接設定する機能は非推奨となりました](https://youtrack.jetbrains.com/issue/KT-46541)。
  >
  {style="warning"}

* ユーザーが `jvmTarget` オプションを明示的に設定していない場合、[`kotlinOptions.jvmTarget`](gradle-compiler-options.md#attributes-specific-to-jvm) をツールチェーンの JDK バージョンに設定します。
  ツールチェーンが構成されていない場合、`jvmTarget` フィールドはデフォルト値を使用します。詳細は [JVM ターゲットの互換性チェック](gradle-configure-project.md#check-for-jvm-target-compatibility-of-related-compile-tasks) を参照してください。

* [`kapt` ワーカー](kapt.md#run-kapt-tasks-in-parallel) が実行される JDK に影響を与えます。

ツールチェーンを設定するには、以下のコードを使用します。プレースホルダー `<MAJOR_JDK_VERSION>` を使用したい JDK バージョンに置き換えてください：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvmToolchain {
        (this as JavaToolchainSpec).languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) // "8"
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvmToolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) // "8"
    }
}
```

</tab>
</tabs>

なお、`kotlin` エクステンションを介してツールチェーンを設定すると、Java のコンパイルタスクのツールチェーンも更新されます。

`java` エクステンションを介してツールチェーンを設定することもでき、Kotlin のコンパイルタスクもそれを使用します：

```kotlin
java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) // "8"
    }
}
```

`KotlinCompile` タスクに任意の JDK バージョンを設定する方法については、[Task DSL を使用した JDK バージョンの設定](gradle-configure-project.md#set-jdk-version-with-the-task-dsl) に関するドキュメントを確認してください。

Gradle 6.1 から 6.6 のバージョンでは、[`UsesKotlinJavaToolchain` インターフェースを使用して JDK のホームを設定してください](#ability-to-specify-jdk-home-with-useskotlinjavatoolchain-interface)。

### UsesKotlinJavaToolchain インターフェースを使用した JDK ホームの指定機能

[`kotlinOptions`](gradle-compiler-options.md) を介した JDK の設定をサポートするすべての Kotlin タスクが、`UsesKotlinJavaToolchain` インターフェースを実装するようになりました。JDK のホームを設定するには、JDK へのパスを指定し、`<LOCAL_JDK_VERSION>` プレースホルダーを置き換えます：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
project.tasks
    .withType<UsesKotlinJavaToolchain>()
    .configureEach {
        it.kotlinJavaToolchain.jdk.use(
            "/path/to/local/jdk",
            JavaVersion.<LOCAL_JDK_VERSION>
        )
    }
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
project.tasks
    .withType(UsesKotlinJavaToolchain.class)
    .configureEach {
        it.kotlinJavaToolchain.jdk.use(
            '/path/to/local/jdk',
            JavaVersion.<LOCAL_JDK_VERSION>
        )
    }
```

</tab>
</tabs>

Gradle 6.1 から 6.6 のバージョンでは `UsesKotlinJavaToolchain` インターフェースを使用してください。Gradle 6.7 以降では、代わりに [Java ツールチェーン](#support-for-java-toolchains) を使用してください。

この機能を使用する場合、[kapt タスクワーカー](kapt.md#run-kapt-tasks-in-parallel) は [プロセス分離モード](https://docs.gradle.org/current/userguide/worker_api.html#changing_the_isolation_mode) のみを使用し、`kapt.workers.isolation` プロパティは無視されることに注意してください。

### Kotlin デーモンの JVM 引数を明示的に指定するより簡単な方法

Kotlin 1.5.30 では、Kotlin デーモンの JVM 引数に関する新しいロジックが導入されました。以下のリストの各オプションは、その前にあるオプションを上書きします：

* 何も指定されていない場合、Kotlin デーモンは（以前と同様に）Gradle デーモンから引数を継承します。例えば、`gradle.properties` ファイルで以下のように指定されている場合：

    ```none
    org.gradle.jvmargs=-Xmx1500m -Xms=500m
    ```

* Gradle デーモンの JVM 引数に `kotlin.daemon.jvm.options` システムプロパティがある場合、以前と同様にそれを使用します：

    ```none
    org.gradle.jvmargs=-Dkotlin.daemon.jvm.options=-Xmx1500m -Xms=500m
    ```

* `gradle.properties` ファイルに `kotlin.daemon.jvmargs` プロパティを追加できます：

    ```none
    kotlin.daemon.jvmargs=-Xmx1500m -Xms=500m
    ```

* `kotlin` エクステンションで引数を指定できます：

  <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        kotlinDaemonJvmArgs = listOf("-Xmx486m", "-Xms256m", "-XX:+UseParallelGC")
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    kotlin {
        kotlinDaemonJvmArgs = ["-Xmx486m", "-Xms256m", "-XX:+UseParallelGC"]
    }
    ```

    </tab>
    </tabs>

* 特定のタスクに対して引数を指定できます：

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    tasks
        .matching { it.name == "compileKotlin" && it is CompileUsingKotlinDaemon }
        .configureEach {
            (this as CompileUsingKotlinDaemon).kotlinDaemonJvmArguments.set(listOf("-Xmx486m", "-Xms256m", "-XX:+UseParallelGC"))
        }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">
  
    ```groovy
    tasks
        .matching {
            it.name == "compileKotlin" && it instanceof CompileUsingKotlinDaemon
        }
        .configureEach {
            kotlinDaemonJvmArguments.set(["-Xmx1g", "-Xms512m"])
        }
    ```

    </tab>
    </tabs>

    > この場合、タスクの実行時に新しい Kotlin デーモンインスタンスが開始される可能性があります。詳細は [Kotlin デーモンと JVM 引数の相互作用](gradle-compilation-and-caches.md#setting-kotlin-daemon-s-jvm-arguments) を参照してください。
    >
    {style="note"}

Kotlin デーモンの詳細については、[Kotlin デーモンと Gradle での使用](gradle-compilation-and-caches.md#the-kotlin-daemon-and-how-to-use-it-with-gradle) を参照してください。

## 標準ライブラリ

Kotlin 1.5.30 では、標準ライブラリの `Duration` および `Regex` API に改善が行われました：
* [`Duration.toString()` 出力の変更](#changing-duration-tostring-output)
* [文字列からの Duration のパース](#parsing-duration-from-string)
* [特定のポジションでの Regex マッチング](#matching-with-regex-at-a-particular-position)
* [Regex によるシーケンスへの分割](#splitting-regex-to-a-sequence)

### Duration.toString() 出力の変更

> Duration API は[実験的](components-stability.md)です。これはいつでも変更または削除される可能性があります。
> 評価目的のみで使用してください。これに関するフィードバックを [YouTrack](https://youtrack.jetbrains.com/issues/KT) でお待ちしております。
>
{style="warning"}

Kotlin 1.5.30 より前では、[`Duration.toString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-string.html) 関数は、最もコンパクトで読みやすい数値を生成する単位で表現された引数の文字列形式を返していました。
今後は、それぞれ独自の単位を持つ数値コンポーネントの組み合わせとして表現された文字列値を返します。
各コンポーネントは、数値の後に単位の略称（`d`、`h`、`m`、`s`）が続きます。例：

|**関数呼び出しの例**|**以前の出力**|**現在の出力**|
| --- | --- | --- |
Duration.days(45).toString()|`45.0d`|`45d`|
Duration.days(1.5).toString()|`36.0h`|`1d 12h`|
Duration.minutes(1230).toString()|`20.5h`|`20h 30m`|
Duration.minutes(2415).toString()|`40.3h`|`1d 16h 15m`|
Duration.minutes(920).toString()|`920m`|`15h 20m`|
Duration.seconds(1.546).toString()|`1.55s`|`1.546s`|
Duration.milliseconds(25.12).toString()|`25.1ms`|`25.12ms`|

負の期間の表現方法も変更されました。負の期間にはマイナス記号 (`-`) がプレフィックスとして付き、複数のコンポーネントで構成される場合は括弧で囲まれます： `-12m` および `-(1h 30m)`。

なお、1秒未満の短い期間は、秒未満の単位のいずれかを持つ単一の数値として表現されます。例えば、`ms`（ミリ秒）、`us`（マイクロ秒）、または `ns`（ナノ秒）： `140.884ms`、`500us`、`24ns`。これらを表現するために科学的表記法（指数表記）は使用されなくなりました。

期間を単一の単位で表現したい場合は、オーバーロードされた `Duration.toString(unit, decimals)` 関数を使用してください。

> シリアライズやデータ交換など、特定の場合には [`Duration.toIsoString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-iso-string.html) を使用することをお勧めします。`Duration.toIsoString()` は `Duration.toString()` の代わりに、より厳格な [ISO-8601](https://www.iso.org/iso-8601-date-and-time-format.html) 形式を使用します。
>
{style="note"}

### 文字列からの Duration のパース

> Duration API は[実験的](components-stability.md)です。これはいつでも変更または削除される可能性があります。
> 評価目的のみで使用してください。これに関するフィードバックを [こちらのイシュー](https://github.com/Kotlin/KEEP/issues/190) でお待ちしております。
>
{style="warning"}

Kotlin 1.5.30 では、Duration API に新しい関数が追加されました：
* [`parse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/parse.html)：以下の出力をパースできます。
    * [`toString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-string.html)
    * [`toString(unit, decimals)`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-string.html)
    * [`toIsoString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-iso-string.html)
* [`parseIsoString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/parse-iso-string.html)：`toIsoString()` によって生成された形式のみをパースします。
* [`parseOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/parse-or-null.html) および [`parseIsoStringOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/parse-iso-string-or-null.html)：上記の関数と同様に動作しますが、無効な期間形式に対して `IllegalArgumentException` をスローする代わりに `null` を返します。

`parse()` および `parseOrNull()` の使用例：

```kotlin
import kotlin.time.Duration
import kotlin.time.ExperimentalTime

@ExperimentalTime
fun main() {
//sampleStart
    val isoFormatString = "PT1H30M"
    val defaultFormatString = "1h 30m"
    val singleUnitFormatString = "1.5h"
    val invalidFormatString = "1 hour 30 minutes"
    println(Duration.parse(isoFormatString)) // "1h 30m"
    println(Duration.parse(defaultFormatString)) // "1h 30m"
    println(Duration.parse(singleUnitFormatString)) // "1h 30m"
    //println(Duration.parse(invalidFormatString)) // 例外をスロー
    println(Duration.parseOrNull(invalidFormatString)) // "null"
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}

`parseIsoString()` および `parseIsoStringOrNull()` の使用例：

```kotlin
import kotlin.time.Duration
import kotlin.time.ExperimentalTime

@ExperimentalTime
fun main() {
//sampleStart
    val isoFormatString = "PT1H30M"
    val defaultFormatString = "1h 30m"
    println(Duration.parseIsoString(isoFormatString)) // "1h 30m"
    //println(Duration.parseIsoString(defaultFormatString)) // 例外をスロー
    println(Duration.parseIsoStringOrNull(defaultFormatString)) // "null"
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}

### 特定のポジションでの Regex マッチング

> `Regex.matchAt()` および `Regex.matchesAt()` 関数は[実験的](components-stability.md)です。これらはいつでも変更または削除される可能性があります。
> 評価目的のみで使用してください。これに関するフィードバックを [YouTrack](https://youtrack.jetbrains.com/issue/KT-34021) でお待ちしております。
>
{style="warning"}

新しい `Regex.matchAt()` および `Regex.matchesAt()` 関数は、`String` または `CharSequence` の特定のポジションで正規表現が完全に一致するかどうかを確認する方法を提供します。

`matchesAt()` は Boolean の結果を返します：

```kotlin
fun main(){
//sampleStart
    val releaseText = "Kotlin 1.5.30 is released!"
    // 正規表現: 1桁, ドット, 1桁, ドット, 1桁以上
    val versionRegex = "\\d[.]\\d[.]\\d+".toRegex()
    println(versionRegex.matchesAt(releaseText, 0)) // "false"
    println(versionRegex.matchesAt(releaseText, 7)) // "true"
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}

`matchAt()` は、一致が見つかった場合はその一致を、見つからない場合は `null` を返します：

```kotlin
fun main(){
//sampleStart
    val releaseText = "Kotlin 1.5.30 is released!"
    val versionRegex = "\\d[.]\\d[.]\\d+".toRegex()
    println(versionRegex.matchAt(releaseText, 0)) // "null"
    println(versionRegex.matchAt(releaseText, 7)?.value) // "1.5.30"
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}

### Regex によるシーケンスへの分割

> `Regex.splitToSequence()` および `CharSequence.splitToSequence(Regex)` 関数は[実験的](components-stability.md)です。これらはいつでも変更または削除される可能性があります。
> 評価目的のみで使用してください。これに関するフィードバックを [YouTrack](https://youtrack.jetbrains.com/issue/KT-23351) でお待ちしております。
>
{style="warning"}

新しい `Regex.splitToSequence()` 関数は、[`split()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/split.html) の遅延（lazy）版です。指定された正規表現の一致箇所で文字列を分割しますが、結果を [Sequence](sequences.md) として返すため、この結果に対するすべての操作は遅延実行されます。

```kotlin
fun main(){
//sampleStart
    val colorsText = "green, red , brown&blue, orange, pink&green"
    val regex = "[,\\s]+".toRegex()
    val mixedColor = regex.splitToSequence(colorsText)
        .onEach { println(it) }
        .firstOrNull { it.contains('&') }
    println(mixedColor) // "brown&blue"
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}

同様の関数が `CharSequence` にも追加されました：

```kotlin
    val mixedColor = colorsText.splitToSequence(regex)
```
{kotlin-runnable="false"}

## Serialization 1.3.0-RC

`kotlinx.serialization` [1.3.0-RC](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.3.0-RC) が公開され、新しい JSON シリアライズ機能が追加されました：
* Java IO ストリームのシリアライズ
* デフォルト値に対するプロパティレベルの制御
* シリアライズから null 値を除外するオプション
* ポリモーフィックなシリアライズにおけるカスタムクラス識別子（discriminators）

詳細は [チェンジログ](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.3.0-RC) をご覧ください。