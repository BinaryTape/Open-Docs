[//]: # (title: Kotlin 1.5.30の新機能)

_[リリース日: 2021年8月24日](releases.md#release-details)_

Kotlin 1.5.30では、将来の変更のプレビューを含む言語アップデート、プラットフォームサポートとツールに関するさまざまな改善、および新しい標準ライブラリ関数が提供されます。

主な改善点は以下の通りです。
* 実験的なsealed `when`ステートメント、オプトイン要件の使用変更などを含む言語機能
* Appleシリコンのネイティブサポート
* Kotlin/JS IRバックエンドがベータ版に到達
* Gradleプラグインの体験向上

変更点の短い概要は、[リリースブログ記事](https://blog.jetbrains.com/kotlin/2021/08/kotlin-1-5-30-released/)とこちらの動画でも確認できます。

<video src="https://www.youtube.com/v/rNbb3A9IdOo" title="Kotlin 1.5.30"/>

## 言語機能

Kotlin 1.5.30では、将来の言語変更のプレビューが提供され、オプトイン要件メカニズムと型推論に改善がもたらされます。
* [sealed および Boolean の被験者に対する網羅的な `when` ステートメント](#exhaustive-when-statements-for-sealed-and-boolean-subjects)
* [スーパークラスとしての suspending 関数](#suspending-functions-as-supertypes)
* [実験的APIの暗黙的な使用に対するオプトイン要件](#requiring-opt-in-on-implicit-usages-of-experimental-apis)
* [異なるターゲットを持つオプトイン要件アノテーションの使用変更](#changes-to-using-opt-in-requirement-annotations-with-different-targets)
* [再帰的なジェネリック型の型推論の改善](#improvements-to-type-inference-for-recursive-generic-types)
* [ビルダー推論の制限の排除](#eliminating-builder-inference-restrictions)

### sealed および Boolean の被験者に対する網羅的な `when` ステートメント

> sealed (網羅的) `when` ステートメントのサポートは[実験的](components-stability.md)です。これはいつでも削除または変更される可能性があります。
> オプトインが必須であり(詳細は下記を参照)、評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issue/KT-12380)でフィードバックをいただけると幸いです。
>
{style="warning"}

_網羅的な_ [`when`](control-flow.md#when-expressions-and-statements) ステートメントには、その被験者のすべての可能な型または値に対するブランチ、または特定の型に対するブランチが含まれ、残りのケースをカバーするための `else` ブランチが含まれます。

私たちはまもなく、非網羅的な `when` ステートメントを禁止し、`when` 式の動作と一貫性を持たせることを計画しています。スムーズな移行を確実にするため、sealed クラスまたは Boolean を持つ非網羅的な `when` ステートメントについてコンパイラが警告を報告するように構成できます。このような警告はKotlin 1.6でデフォルトで表示され、将来的にはエラーになります。

> Enumはすでに警告が表示されます。
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

Kotlin 1.5.30でこの機能を有効にするには、言語バージョン `1.6` を使用します。[プログレッシブモード](whatsnew13.md#progressive-mode)を有効にすることで、警告をエラーに変更することもできます。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets.all {
        languageSettings.apply {
            languageVersion = "1.6"
            //progressiveMode = true // false by default
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
            //progressiveMode = true // false by default
        }
    }
}
```

</tab>
</tabs>

### スーパークラスとしての suspending 関数

> suspending 関数をスーパークラスとして使用するサポートは[実験的](components-stability.md)です。これはいつでも削除または変更される可能性があります。
> オプトインが必須であり(詳細は下記を参照)、評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issue/KT-18707)でフィードバックをいただけると幸いです。
>
{style="warning"}

Kotlin 1.5.30では、いくつかの制限付きで `suspend` 関数型をスーパークラスとして使用する機能のプレビューが提供されます。

```kotlin
class MyClass: suspend () -> Unit {
    override suspend fun invoke() { TODO() }
}
```

この機能を有効にするには、`-language-version 1.6` コンパイラオプションを使用します。

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

この機能には以下の制限があります。
* 通常の関数型と `suspend` 関数型をスーパークラスとして混在させることはできません。これは、JVMバックエンドにおける `suspend` 関数型の実装の詳細によるものです。これらはマーカーインターフェースを持つ通常の関数型として表現されます。マーカーインターフェースのため、どのスーパーインターフェースが `suspend` で、どれが通常のものかを区別する方法がありません。
* 複数の `suspend` 関数型をスーパークラスとして使用することはできません。型チェックがある場合、複数の通常の関数型をスーパークラスとして使用することもできません。

### 実験的APIの暗黙的な使用に対するオプトイン要件

> オプトイン要件メカニズムは[実験的](components-stability.md)です。
> これはいつでも変更される可能性があります。[オプトインの方法を参照してください](opt-in-requirements.md)。
> 評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issues/KT)でフィードバックをいただけると幸いです。
>
{style="warning"}

ライブラリの作者は、実験的なAPIを[オプトイン要件](opt-in-requirements.md#create-opt-in-requirement-annotations)としてマークすることで、その実験的状態をユーザーに知らせることができます。APIが使用されると、コンパイラは警告またはエラーを発生させ、それを抑制するために[明示的な同意](opt-in-requirements.md#opt-in-to-api)を要求します。

Kotlin 1.5.30では、コンパイラはシグネチャに実験的な型を持つすべての宣言を実験的として扱います。つまり、実験的なAPIの暗黙的な使用に対してもオプトインを要求します。例えば、関数の戻り値の型が実験的なAPI要素としてマークされている場合、その宣言が明示的にオプトインを要求するようにマークされていなくても、その関数の使用にはオプトインが必要になります。

```kotlin
// Library code

@RequiresOptIn(message = "This API is experimental.")
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS)
annotation class MyDateTime // Opt-in requirement annotation

@MyDateTime
class DateProvider // A class requiring opt-in

// Client code

// Warning: experimental API usage
fun createDateSource(): DateProvider { /* ... */ }

fun getDate(): Date {
    val dateSource = createDateSource() // Also warning: experimental API usage
    // ... 
}
```

[オプトイン要件](opt-in-requirements.md)についてさらに詳しく学ぶ。

### 異なるターゲットを持つオプトイン要件アノテーションの使用変更

> オプトイン要件メカニズムは[実験的](components-stability.md)です。
> これはいつでも変更される可能性があります。[オプトインの方法を参照してください](opt-in-requirements.md)。
> 評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issues/KT)でフィードバックをいただけると幸いです。
>
{style="warning"}

Kotlin 1.5.30では、異なる[ターゲット](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/)を持つオプトイン要件アノテーションの使用と宣言に関する新しいルールが導入されます。コンパイラは、コンパイル時に処理するのが非実用的なユースケースに対してエラーを報告するようになりました。Kotlin 1.5.30では以下の通りです。
* ローカル変数および値パラメータをオプトイン要件アノテーションでマークすることは、使用箇所では禁止されています。
* オーバーライドのマークは、その基本宣言もマークされている場合にのみ許可されます。
* バッキングフィールドとゲッターのマークは禁止されています。代わりに基本プロパティをマークできます。
* `TYPE` および `TYPE_PARAMETER` アノテーションターゲットをオプトイン要件アノテーション宣言サイトで設定することは禁止されています。

[オプトイン要件](opt-in-requirements.md)についてさらに詳しく学ぶ。

### 再帰的なジェネリック型の型推論の改善

KotlinとJavaでは、型パラメータで自分自身を参照する再帰的なジェネリック型を定義できます。Kotlin 1.5.30では、Kotlinコンパイラは、対応する型パラメータが再帰的なジェネリックである場合、その上限のみに基づいて型引数を推論できるようになりました。これにより、JavaでビルダーAPIを作成するためによく使用される、再帰的なジェネリック型を使ったさまざまなパターンを作成することが可能になります。

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

`-Xself-upper-bound-inference` または `-language-version 1.6` コンパイラオプションを渡すことで、改善を有効にできます。新しくサポートされたユースケースの他の例は、[こちらのYouTrackチケット](https://youtrack.jetbrains.com/issue/KT-40804)を参照してください。

### ビルダー推論の制限の排除

ビルダー推論は、ラムダ引数内の他の呼び出しからの型情報に基づいて、呼び出しの型引数を推論できる特殊な型推論です。これは、[`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html)や[`sequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/sequence.html)などのジェネリックビルダー関数を呼び出す際に役立ちます: `buildList { add("string") }`。

このようなラムダ引数内では、以前はビルダー推論が推論しようとする型情報の使用に制限がありました。つまり、それを指定できるだけで、取得することはできませんでした。例えば、明示的に型引数を指定せずに `buildList()` のラムダ引数内で [`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/get.html) を呼び出すことはできませんでした。

Kotlin 1.5.30では、`-Xunrestricted-builder-inference` コンパイラオプションにより、これらの制限が解除されます。このオプションを追加することで、ジェネリックビルダー関数のラムダ引数内でこれまで禁止されていた呼び出しを有効にできます。

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

また、この機能は `-language-version 1.6` コンパイラオプションでも有効にできます。

## Kotlin/JVM

Kotlin 1.5.30では、Kotlin/JVMに以下の機能が追加されます。
* [アノテーションクラスのインスタンス化](#instantiation-of-annotation-classes)
* [Nullabilityアノテーションサポート設定の改善](#improved-nullability-annotation-support-configuration)

JVMプラットフォームにおけるKotlin Gradleプラグインのアップデートについては、[Gradle](#gradle)セクションを参照してください。

### アノテーションクラスのインスタンス化

> アノテーションクラスのインスタンス化は[実験的](components-stability.md)です。これはいつでも削除または変更される可能性があります。
> オプトインが必須であり(詳細は下記を参照)、評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issue/KT-45395)でフィードバックをいただけると幸いです。
>
{style="warning"}

Kotlin 1.5.30では、[アノテーションクラス](annotations.md)のコンストラクタを任意のコードで呼び出して、結果のインスタンスを取得できるようになりました。この機能は、アノテーションインターフェースの実装を許可するJavaの規約と同じユースケースをカバーします。

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

この機能を有効にするには、`-language-version 1.6` コンパイラオプションを使用します。非`val`パラメータやセカンダリコンストラクタとは異なるメンバを定義するための制限など、現在のアノテーションクラスのすべての制限はそのまま残ることに注意してください。

アノテーションクラスのインスタンス化について、[このKEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-instantiation.md)で詳しく学ぶ。

### Nullabilityアノテーションサポート設定の改善

Kotlinコンパイラは、さまざまな種類の[Nullabilityアノテーション](java-interop.md#nullability-annotations)を読み取り、JavaからのNullability情報を取得できます。この情報により、Javaコードを呼び出すときにKotlinでNullabilityの不一致を報告できます。

Kotlin 1.5.30では、特定の種類のNullabilityアノテーションからの情報に基づいて、コンパイラがNullabilityの不一致を報告するかどうかを指定できます。コンパイラオプション `-Xnullability-annotations=@<package-name>:<report-level>` を使用するだけです。引数には、完全修飾されたNullabilityアノテーションパッケージ名と、次のいずれかのレポートレベルを指定します。
* `ignore` でNullabilityの不一致を無視
* `warn` で警告を報告
* `strict` でエラーを報告

サポートされている[Nullabilityアノテーションの完全なリスト](java-interop.md#nullability-annotations)と、それらの完全修飾パッケージ名を参照してください。

新しくサポートされた[RxJava](https://github.com/ReactiveX/RxJava) 3のNullabilityアノテーションのエラー報告を有効にする例を以下に示します: `-Xnullability-annotations=@io.reactivex.rxjava3.annotations:strict`。このようなNullabilityの不一致は、デフォルトではすべて警告になることに注意してください。

## Kotlin/Native

Kotlin/Nativeには、さまざまな変更と改善が加えられました。
* [Appleシリコンのサポート](#apple-silicon-support)
* [CocoaPods GradleプラグインのKotlin DSLの改善](#improved-kotlin-dsl-for-the-cocoapods-gradle-plugin)
* [Swift 5.5 async/awaitとの実験的な相互運用](#experimental-interoperability-with-swift-5-5-async-await)
* [オブジェクトとコンパニオンオブジェクトのSwift/Objective-Cマッピングの改善](#improved-swift-objective-c-mapping-for-objects-and-companion-objects)
* [MinGWターゲット向けのインポートライブラリなしのDLLへのリンクの非推奨化](#deprecation-of-linkage-against-dlls-without-import-libraries-for-mingw-targets)

### Appleシリコンのサポート

Kotlin 1.5.30では、[Appleシリコン](https://support.apple.com/en-us/HT211814)のネイティブサポートが導入されました。

以前は、Kotlin/NativeコンパイラとツールはAppleシリコンホストでの作業に[Rosettaトランスレーション環境](https://developer.apple.com/documentation/apple-silicon/about-the-rosetta-translation-environment)を必要としていました。Kotlin 1.5.30では、トランスレーション環境はもはや不要です。コンパイラとツールは追加のアクションなしでAppleシリコンハードウェア上で実行できます。

また、KotlinコードをAppleシリコン上でネイティブに実行するための新しいターゲットも導入されました。
* `macosArm64`
* `iosSimulatorArm64`
* `watchosSimulatorArm64`
* `tvosSimulatorArm64`

これらはIntelベースとAppleシリコンホストの両方で利用可能です。既存のすべてのターゲットもAppleシリコンホストで利用可能です。

1.5.30では、`kotlin-multiplatform` GradleプラグインにおいてAppleシリコンターゲットの基本的なサポートのみを提供していることに注意してください。特に、新しいシミュレーターターゲットは`ios`、`tvos`、`watchos`のターゲットショートカットには含まれていません。
新しいターゲットでのユーザーエクスペリエンスを向上させるために、引き続き作業を進めます。

### CocoaPods GradleプラグインのKotlin DSLの改善

#### Kotlin/Nativeフレームワークの新しいパラメータ

Kotlin 1.5.30では、Kotlin/Nativeフレームワーク向けのCocoaPods GradleプラグインDSLが改善されました。Pod設定でフレームワーク名に加えて、他のパラメータを指定できます。
* フレームワークの動的バージョンまたは静的バージョンを指定
* 依存関係のエクスポートを明示的に有効化
* Bitcode埋め込みを有効化

新しいDSLを使用するには、プロジェクトをKotlin 1.5.30にアップデートし、`build.gradle(.kts)`ファイルの`cocoapods`セクションでパラメータを指定します。

```kotlin
cocoapods {
    frameworkName = "MyFramework" // This property is deprecated 
    // and will be removed in future versions
    // New DSL for framework configuration:
    framework {
        // All Framework properties are supported
        // Framework name configuration. Use this property instead of 
        // deprecated 'frameworkName'
        baseName = "MyFramework"
        // Dynamic framework support
        isStatic = false
        // Dependency export
        export(project(":anotherKMMModule"))
        transitiveExport = false // This is default.
        // Bitcode embedding
        embedBitcode(BITCODE)
    }
}
```

#### Xcode設定のカスタム名のサポート

Kotlin CocoaPods Gradleプラグインは、Xcodeビルド設定でのカスタム名をサポートしています。これは、Xcodeでビルド設定に特殊な名前（例: `Staging`）を使用している場合にも役立ちます。

カスタム名を指定するには、`build.gradle(.kts)`ファイルの`cocoapods`セクションで`xcodeConfigurationToNativeBuildType`パラメータを使用します。

```kotlin
cocoapods {
    // Maps custom Xcode configuration to NativeBuildType
    xcodeConfigurationToNativeBuildType["CUSTOM_DEBUG"] = NativeBuildType.DEBUG
    xcodeConfigurationToNativeBuildType["CUSTOM_RELEASE"] = NativeBuildType.RELEASE
}
```

このパラメータはPodspecファイルには表示されません。XcodeがGradleビルドプロセスを実行すると、Kotlin CocoaPods Gradleプラグインが必要なネイティブビルドタイプを選択します。

> `Debug`と`Release`の設定はデフォルトでサポートされているため、宣言する必要はありません。
>
{style="note"}

### Swift 5.5 async/awaitとの実験的な相互運用

> Swift async/awaitとの並行処理の相互運用は[実験的](components-stability.md)です。これはいつでも削除または変更される可能性があります。
> 評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issue/KT-47610)でフィードバックをいただけると幸いです。
>
{style="warning"}

[Kotlinのsuspend関数をObjective-CおよびSwiftから呼び出すサポートを1.4.0で追加しました](whatsnew14.md#support-for-kotlin-s-suspending-functions-in-swift-and-objective-c)が、新しいSwift 5.5機能である[`async`と`await`修飾子による並行処理](https://github.com/apple/swift-evolution/blob/main/proposals/0296-async-await.md)に対応するために改善を進めています。

Kotlin/Nativeコンパイラは、Nullableな戻り値を持つsuspend関数に対して、生成されたObjective-Cヘッダに`_Nullable_result`属性を出力するようになりました。これにより、Swiftから適切なNullabilityを持つ`async`関数として呼び出すことが可能になります。

この機能は実験的であり、将来的にKotlinとSwiftの両方の変更によって影響を受ける可能性があることに注意してください。今のところ、私たちはこの機能のプレビューを提供しており、いくつかの制限がありますが、皆様からのフィードバックをお待ちしております。現在の状態について詳しく学び、[このYouTrack issue](https://youtrack.jetbrains.com/issue/KT-47610)でフィードバックを残してください。

### オブジェクトとコンパニオンオブジェクトのSwift/Objective-Cマッピングの改善

オブジェクトとコンパニオンオブジェクトの取得が、ネイティブiOS開発者にとってより直感的な方法でできるようになりました。例えば、Kotlinに以下のオブジェクトがある場合:

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

Swiftでそれらにアクセスするには、`shared`と`companion`プロパティを使用できます。

```swift
MyObject.shared
MyObject.shared.x
MyClass.companion
MyClass.Companion.shared
```

[Swift/Objective-Cの相互運用](native-objc-interop.md)について詳しく学ぶ。

### MinGWターゲット向けのインポートライブラリなしのDLLへのリンクの非推奨化

[LLD](https://lld.llvm.org/)はLLVMプロジェクトのリンカであり、主にその優れたパフォーマンスという利点から、MinGWターゲット向けのKotlin/Nativeでデフォルトのld.bfdに代わって使用を開始する予定です。

しかし、LLDの最新の安定版は、MinGW (Windows) ターゲット向けのDLLへの直接リンクをサポートしていません。そのようなリンクには[インポートライブラリ](https://stackoverflow.com/questions/3573475/how-does-the-import-library-work-details/3573527#3573527)の使用が必要です。Kotlin/Native 1.5.30ではこれらは不要ですが、将来的にLLDがMinGWのデフォルトリンカになることと互換性がないことを知らせる警告を追加しています。

LLDリンカへの移行に関する皆様のご意見やご懸念を、[このYouTrack issue](https://youtrack.jetbrains.com/issue/KT-47605)で共有してください。

## Kotlin Multiplatform

1.5.30では、Kotlin Multiplatformに以下の注目すべきアップデートがもたらされます。
* [共有ネイティブコードでカスタム`cinterop`ライブラリを使用する機能](#ability-to-use-custom-cinterop-libraries-in-shared-native-code)
* [XCFrameworksのサポート](#support-for-xcframeworks)
* [Androidアーティファクトの新しいデフォルトのパブリッシング設定](#new-default-publishing-setup-for-android-artifacts)

### 共有ネイティブコードでカスタム`cinterop`ライブラリを使用する機能

Kotlin Multiplatformは、[プラットフォーム固有のinteropライブラリを共有ソースセットで使用するオプション](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#connect-platform-specific-libraries)を提供します。1.5.30より前は、これはKotlin/Nativeディストリビューションに同梱されている[プラットフォームライブラリ](native-platform-libs.md)でのみ機能しました。1.5.30以降、カスタム`cinterop`ライブラリでも使用できるようになりました。この機能を有効にするには、`gradle.properties`に`kotlin.mpp.enableCInteropCommonization=true`プロパティを追加します。

```none
kotlin.mpp.enableGranularSourceSetsMetadata=true
kotlin.native.enableDependencyPropagation=false
kotlin.mpp.enableCInteropCommonization=true
```

### XCFrameworksのサポート

すべてのKotlin Multiplatformプロジェクトで、XCFrameworksを出力フォーマットとして使用できるようになりました。Appleはユニバーサル（fat）フレームワークの代替としてXCFrameworksを導入しました。XCFrameworksを使用することで、次のことが可能になります。
* すべてのターゲットプラットフォームとアーキテクチャのロジックを単一のバンドルにまとめることができます。
* アプリケーションをApp Storeに公開する前に、不要なアーキテクチャをすべて削除する必要がなくなります。

XCFrameworksは、Apple M1デバイスやシミュレーターでKotlinフレームワークを使用したい場合に役立ちます。

XCFrameworksを使用するには、`build.gradle(.kts)`スクリプトを更新します。

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

XCFrameworksを宣言すると、以下の新しいGradleタスクが登録されます。
* `assembleXCFramework`
* `assembleDebugXCFramework` (加えて、[dSYMsを含む](native-ios-symbolication.md)デバッグアーティファクト)
* `assembleReleaseXCFramework`

XCFrameworksについて、[このWWDC動画](https://developer.apple.com/videos/play/wwdc2019/416/)で詳しく学ぶ。

### Androidアーティファクトの新しいデフォルトのパブリッシング設定

`maven-publish` Gradleプラグインを使用すると、ビルドスクリプトで[Androidバリアント](https://developer.android.com/studio/build/build-variants)名を指定することで、[Androidターゲット向けのマルチプラットフォームライブラリを公開](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-lib-setup.html#publish-an-android-library)できます。Kotlin Gradleプラグインは公開を自動的に生成します。

1.5.30より前では、生成された公開[メタデータ](https://docs.gradle.org/current/userguide/publishing_gradle_module_metadata.html)には、公開されたすべてのAndroidバリアントのビルドタイプ属性が含まれており、ライブラリの利用者が使用するビルドタイプとしか互換性がありませんでした。Kotlin 1.5.30では、新しいデフォルトのパブリッシング設定が導入されます。
* プロジェクトが公開するすべてのAndroidバリアントが同じビルドタイプ属性を持つ場合、公開されるバリアントはビルドタイプ属性を持たず、任意のビルドタイプと互換性があります。
* 公開されるバリアントが異なるビルドタイプ属性を持つ場合、`release`値を持つもののみがビルドタイプ属性なしで公開されます。これにより、リリースバリアントは利用側で任意のビルドタイプと互換性を持つ一方、非リリースバリアントは対応する利用側のビルドタイプとのみ互換性があります。

すべてのバリアントのビルドタイプ属性を保持してオプトアウトするには、`kotlin.android.buildTypeAttribute.keep=true`のGradleプロパティを設定できます。

## Kotlin/JS

Kotlin/JSには1.5.30で2つの大きな改善がもたらされます。
* [JS IRコンパイラバックエンドがベータ版に到達](#js-ir-compiler-backend-reaches-beta)
* [Kotlin/JS IRバックエンドを使用するアプリケーションのデバッグ体験の向上](#better-debugging-experience-for-applications-with-the-kotlin-js-ir-backend)

### JS IRコンパイラバックエンドがベータ版に到達

1.4.0で[アルファ版](components-stability.md)として導入されたKotlin/JSの[IRベースのコンパイラバックエンド](whatsnew14.md#unified-backends-and-extensibility)がベータ版に到達しました。

以前、新しいバックエンドへのプロジェクトの移行を支援するために[JS IRバックエンドの移行ガイド](js-ir-migration.md)を公開しました。今回、必要な変更をIntelliJ IDEAで直接表示する[Kotlin/JS Inspection Pack](https://plugins.jetbrains.com/plugin/17183-kotlin-js-inspection-pack/) IDEプラグインをご紹介します。

### Kotlin/JS IRバックエンドを使用するアプリケーションのデバッグ体験の向上

Kotlin 1.5.30では、Kotlin/JS IRバックエンド向けにJavaScriptソースマップ生成が導入されます。これにより、IRバックエンドが有効になっている場合のKotlin/JSデバッグ体験が向上し、ブレークポイント、ステップ実行、適切なソース参照による読みやすいスタックトレースを含む完全なデバッグサポートが提供されます。

[ブラウザまたはIntelliJ IDEA UltimateでKotlin/JSをデバッグする方法](js-debugging.md)を学ぶ。

## Gradle

[Kotlin Gradleプラグインのユーザーエクスペリエンスを向上させる](https://youtrack.jetbrains.com/issue/KT-45778)という私たちの使命の一環として、以下の機能を実装しました。
* [Javaツールチェーンのサポート](#support-for-java-toolchains)。これには、[古いGradleバージョン向けに`UsesKotlinJavaToolchain`インターフェースでJDKホームを指定する機能](#ability-to-specify-jdk-home-with-useskotlinjavatoolchain-interface)が含まれます。
* [KotlinデーモンのJVM引数を明示的に指定するより簡単な方法](#easier-way-to-explicitly-specify-kotlin-daemon-jvm-arguments)

### Javaツールチェーンのサポート

Gradle 6.7では、「[Javaツールチェーンのサポート](https://docs.gradle.org/current/userguide/toolchains.html)」機能が導入されました。
この機能を使用すると、次のことが可能になります。
* Gradleとは異なるJDKおよびJREを使用して、コンパイル、テスト、および実行可能ファイルを実行できます。
* 未リリースの言語バージョンでコードをコンパイルおよびテストできます。

ツールチェーンのサポートにより、GradleはローカルのJDKを自動検出したり、ビルドに必要な不足しているJDKをインストールしたりできます。これにより、Gradle自体は任意のJDK上で実行でき、それでも[ビルドキャッシュ機能](gradle-compilation-and-caches.md#gradle-build-cache-support)を再利用できます。

Kotlin Gradleプラグインは、Kotlin/JVMコンパイルタスクに対してJavaツールチェーンをサポートしています。
Javaツールチェーン:
* JVMターゲットで利用可能な[`jdkHome`オプション](gradle-compiler-options.md#attributes-specific-to-jvm)を設定します。
  > [`jdkHome`オプションを直接設定する機能は非推奨になりました](https://youtrack.jetbrains.com/issue/KT-46541)。
  >
  {style="warning"}

* ユーザーが`jvmTarget`オプションを明示的に設定しなかった場合、[`kotlinOptions.jvmTarget`](gradle-compiler-options.md#attributes-specific-to-jvm)をツールチェーンのJDKバージョンに設定します。
  ツールチェーンが設定されていない場合、`jvmTarget`フィールドはデフォルト値を使用します。[JVMターゲットの互換性](gradle-configure-project.md#check-for-jvm-target-compatibility-of-related-compile-tasks)について詳しく学ぶ。

* [`kapt`ワーカー](kapt.md#run-kapt-tasks-in-parallel)がどのJDKで実行されるかに影響します。

ツールチェーンを設定するには、以下のコードを使用します。プレースホルダー`<MAJOR_JDK_VERSION>`を使用したいJDKバージョンに置き換えてください。

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

`kotlin`拡張機能を通じてツールチェーンを設定すると、Javaコンパイルタスクのツールチェーンも更新されることに注意してください。

`java`拡張機能を通じてツールチェーンを設定することもでき、Kotlinコンパイルタスクはそれを使用します。

```kotlin
java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) // "8"
    }
}
```

`KotlinCompile`タスクの任意のJDKバージョンを設定する方法については、[Task DSLでJDKバージョンを設定する](gradle-configure-project.md#set-jdk-version-with-the-task-dsl)に関するドキュメントを参照してください。

Gradleバージョン6.1から6.6の場合、[JDKホームを設定するために`UsesKotlinJavaToolchain`インターフェースを使用します](#ability-to-specify-jdk-home-with-useskotlinjavatoolchain-interface)。

### UsesKotlinJavaToolchainインターフェースでのJDKホーム指定機能

[`kotlinOptions`](gradle-compiler-options.md)経由でJDKの設定をサポートするすべてのKotlinタスクが、`UsesKotlinJavaToolchain`インターフェースを実装するようになりました。JDKホームを設定するには、JDKへのパスを記述し、`<JDK_VERSION>`プレースホルダーを置き換えてください。

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

Gradleバージョン6.1から6.6では`UsesKotlinJavaToolchain`インターフェースを使用してください。Gradle 6.7以降では、代わりに[Javaツールチェーン](#support-for-java-toolchains)を使用してください。

この機能を使用する場合、[kaptタスクワーカー](kapt.md#run-kapt-tasks-in-parallel)は[プロセス分離モード](https://docs.gradle.org/current/userguide/worker_api.html#changing_the_isolation_mode)のみを使用し、`kapt.workers.isolation`プロパティは無視されることに注意してください。

### KotlinデーモンのJVM引数を明示的に指定するより簡単な方法

Kotlin 1.5.30では、KotlinデーモンのJVM引数に関する新しいロジックが導入されました。以下のリストの各オプションは、それより前に指定されたオプションを上書きします。

* 何も指定しない場合、KotlinデーモンはGradleデーモンから引数を継承します（以前と同様）。例えば、`gradle.properties`ファイルでは次のようになります。

    ```none
    org.gradle.jvmargs=-Xmx1500m -Xms=500m
    ```

* GradleデーモンのJVM引数に`kotlin.daemon.jvm.options`システムプロパティがある場合、以前と同様にそれを使用します。

    ```none
    org.gradle.jvmargs=-Dkotlin.daemon.jvm.options=-Xmx1500m -Xms=500m
    ```

* `gradle.properties`ファイルに`kotlin.daemon.jvmargs`プロパティを追加できます。

    ```none
    kotlin.daemon.jvmargs=-Xmx1500m -Xms=500m
    ```

* `kotlin`拡張機能で引数を指定できます。

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

* 特定のタスクの引数を指定できます。

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

    > この場合、タスク実行時に新しいKotlinデーモンインスタンスが起動する可能性があります。[KotlinデーモンとJVM引数の相互作用](gradle-compilation-and-caches.md#setting-kotlin-daemon-s-jvm-arguments)について詳しく学ぶ。
    >
    {style="note"}

Kotlinデーモンに関する詳細については、[KotlinデーモンとGradleでの使用方法](gradle-compilation-and-caches.md#the-kotlin-daemon-and-how-to-use-it-with-gradle)を参照してください。

## 標準ライブラリ

Kotlin 1.5.30では、標準ライブラリの`Duration`および`Regex` APIに改善がもたらされます。
* [`Duration.toString()`出力の変更](#changing-duration-tostring-output)
* [文字列からのDurationのパース](#parsing-duration-from-string)
* [特定のポジションでのRegexマッチング](#matching-with-regex-at-a-particular-position)
* [Regexをシーケンスに分割](#splitting-regex-to-a-sequence)

### Duration.toString()出力の変更

> Duration APIは[実験的](components-stability.md)です。これはいつでも削除または変更される可能性があります。
> 評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issues/KT)でフィードバックをいただけると幸いです。
>
{style="warning"}

Kotlin 1.5.30より前では、[`Duration.toString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-string.html)関数は、最もコンパクトで読みやすい数値となる単位で表現された引数の文字列表現を返していました。
今後は、数値コンポーネントとその単位の短縮名（`d`、`h`、`m`、`s`）を組み合わせた文字列値を返します。例えば、次のようになります。

|**関数呼び出しの例**|**以前の出力**|**現在の出力**|
| --- | --- | --- |
Duration.days(45).toString()|`45.0d`|`45d`|
Duration.days(1.5).toString()|`36.0h`|`1d 12h`|
Duration.minutes(1230).toString()|`20.5h`|`20h 30m`|
Duration.minutes(2415).toString()|`40.3h`|`1d 16h 15m`|
Duration.minutes(920).toString()|`920m`|`15h 20m`|
Duration.seconds(1.546).toString()|`1.55s`|`1.546s`|
Duration.milliseconds(25.12).toString()|`25.1ms`|`25.12ms`|

負の期間の表現方法も変更されました。負の期間にはマイナス記号 (`-`) がプレフィックスとして付き、複数のコンポーネントで構成されている場合は括弧で囲まれます。例: `-12m` と `-(1h 30m)`。

1秒未満の短い期間は、単一の数値とサブセカンド単位のいずれか（例: `ms` (ミリ秒)、`us` (マイクロ秒)、`ns` (ナノ秒)）で表現されることに注意してください。例: `140.884ms`、`500us`、`24ns`。科学的記数法はもはやそれらを表現するために使用されません。

期間を単一の単位で表現したい場合は、オーバーロードされた`Duration.toString(unit, decimals)`関数を使用してください。

> シリアライゼーションや交換など、特定のケースでは[`Duration.toIsoString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-iso-string.html)を使用することをお勧めします。`Duration.toIsoString()`は、`Duration.toString()`ではなく、より厳密な[ISO-8601](https://www.iso.org/iso-8601-date-and-time-format.html)形式を使用します。
>
{style="note"}

### 文字列からのDurationのパース

> Duration APIは[実験的](components-stability.md)です。これはいつでも削除または変更される可能性があります。
> 評価目的でのみ使用してください。[このIssue](https://github.com/Kotlin/KEEP/issues/190)でフィードバックをいただけると幸いです。
>
{style="warning"}

Kotlin 1.5.30では、Duration APIに新しい関数が追加されました。
* [`parse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/parse.html)。これは以下の出力のパースをサポートします。
    * [`toString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-string.html)。
    * [`toString(unit, decimals)`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-string.html)。
    * [`toIsoString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-iso-string.html)。
* [`parseIsoString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/parse-iso-string.html)。これは`toIsoString()`によって生成される形式からのみパースします。
* [`parseOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/parse-or-null.html) および [`parseIsoStringOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/parse-iso-string-or-null.html)。これらは上記の関数と同様に動作しますが、無効な期間形式の場合に`IllegalArgumentException`をスローする代わりに`null`を返します。

`parse()`および`parseOrNull()`の使用例をいくつか示します。

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
    //println(Duration.parse(invalidFormatString)) // throws exception
    println(Duration.parseOrNull(invalidFormatString)) // "null"
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}

`parseIsoString()`および`parseIsoStringOrNull()`の使用例をいくつか示します。

```kotlin
import kotlin.time.Duration
import kotlin.time.ExperimentalTime

@ExperimentalTime
fun main() {
//sampleStart
    val isoFormatString = "PT1H30M"
    val defaultFormatString = "1h 30m"
    println(Duration.parseIsoString(isoFormatString)) // "1h 30m"
    //println(Duration.parseIsoString(defaultFormatString)) // throws exception
    println(Duration.parseIsoStringOrNull(defaultFormatString)) // "null"
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}

### 特定のポジションでのRegexマッチング

> `Regex.matchAt()`および`Regex.matchesAt()`関数は[実験的](components-stability.md)です。これらはいつでも削除または変更される可能性があります。
> 評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issue/KT-34021)でフィードバックをいただけると幸いです。
>
{style="warning"}

新しい`Regex.matchAt()`および`Regex.matchesAt()`関数は、`String`または`CharSequence`内の特定のポジションで正規表現が正確に一致するかどうかをチェックする方法を提供します。

`matchesAt()`はブール値を返します。

```kotlin
fun main(){
//sampleStart
    val releaseText = "Kotlin 1.5.30 is released!"
    // regular expression: one digit, dot, one digit, dot, one or more digits
    val versionRegex = "\\d[.]\\d[.]\\d+".toRegex()
    println(versionRegex.matchesAt(releaseText, 0)) // "false"
    println(versionRegex.matchesAt(releaseText, 7)) // "true"
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}

`matchAt()`は、一致が見つかればその一致を返し、見つからなければ`null`を返します。

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

### Regexをシーケンスに分割

> `Regex.splitToSequence()`および`CharSequence.splitToSequence(Regex)`関数は[実験的](components-stability.md)です。これらはいつでも削除または変更される可能性があります。
> 評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issue/KT-23351)でフィードバックをいただけると幸いです。
>
{style="warning"}

新しい`Regex.splitToSequence()`関数は、[`split()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/split.html)の遅延評価版です。与えられた正規表現の一致箇所で文字列を分割しますが、結果を[Sequence](sequences.md)として返すため、この結果に対するすべての操作は遅延実行されます。

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

同様の関数が`CharSequence`にも追加されました。

```kotlin
    val mixedColor = colorsText.splitToSequence(regex)
```
{kotlin-runnable="false"}

## Serialization 1.3.0-RC

`kotlinx.serialization` [1.3.0-RC](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.3.0-RC)が、
新しいJSONシリアライゼーション機能とともに登場しました。
* Java IOストリームのシリアライゼーション
* デフォルト値に対するプロパティレベルの制御
* null値をシリアライゼーションから除外するオプション
* 多様性のあるシリアライゼーションにおけるカスタムクラスディスクリミネータ

詳細については、[変更履歴](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.3.0-RC)を参照してください。