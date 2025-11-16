[//]: # (title: Kotlin 1.5.30の新機能)

_[リリース日: 2021年8月24日](releases.md#release-details)_

Kotlin 1.5.30では、将来の変更点のプレビューを含む言語のアップデート、プラットフォームサポートやツールにおける様々な改善、そして新しい標準ライブラリの関数が提供されます。

主な改善点は以下の通りです。
*   実験的な`sealed when`文、オプトイン要件の使用変更など、言語機能の改善
*   Appleシリコンのネイティブサポート
*   Kotlin/JS IRバックエンドがベータ版に到達
*   Gradleプラグインの体験向上

変更点の概要については、[リリースブログの投稿](https://blog.jetbrains.com/kotlin/2021/08/kotlin-1-5-30-released/)とこちらの動画でもご確認いただけます。

<video src="https://www.youtube.com/v/rNbb3A9IdOo" title="Kotlin 1.5.30"/>

## 言語機能

Kotlin 1.5.30では、将来の言語変更のプレビューが提供され、オプトイン要件メカニズムと型推論に改善がもたらされます。
*   [sealedおよびBooleanのwhen文の網羅性](#exhaustive-when-statements-for-sealed-and-boolean-subjects)
*   [スーパークラスとしてのサスペンド関数](#suspending-functions-as-supertypes)
*   [実験的なAPIの暗黙的な使用に対するオプトインの要求](#requiring-opt-in-on-implicit-usages-of-experimental-apis)
*   [異なるターゲットを持つオプトイン要件アノテーションの使用変更](#changes-to-using-opt-in-requirement-annotations-with-different-targets)
*   [再帰的なジェネリック型の型推論の改善](#improvements-to-type-inference-for-recursive-generic-types)
*   [ビルダー推論の制限の解消](#eliminating-builder-inference-restrictions)

### sealedおよびBooleanのwhen文の網羅性

> sealed (網羅的な) `when`文のサポートは[実験的](components-stability.md)です。これはいつでも変更または廃止される可能性があります。
> オプトインが必要です（詳細は下記参照）。評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issue/KT-12380)でのフィードバックをお待ちしております。
>
{style="warning"}

_網羅的な_ [`when`](control-flow.md#when-expressions-and-statements)文は、対象となるすべての可能な型または値、あるいは特定の型に対するブランチを含み、残りのケースをカバーするために`else`ブランチを含みます。

非網羅的な`when`文をまもなく禁止し、`when`式の動作と一貫性を持たせる予定です。円滑な移行を確実にするため、sealedクラスまたはBooleanを持つ非網羅的な`when`文について警告を報告するようにコンパイラを設定できます。このような警告はKotlin 1.6でデフォルトで表示され、後にエラーになります。

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

Kotlin 1.5.30でこの機能を有効にするには、言語バージョン`1.6`を使用してください。[プログレッシブモード](whatsnew13.md#progressive-mode)を有効にすることで、警告をエラーに変更することもできます。

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

### スーパークラスとしてのサスペンド関数

> スーパークラスとしてのサスペンド関数のサポートは[実験的](components-stability.md)です。これはいつでも変更または廃止される可能性があります。
> オプトインが必要です（詳細は下記参照）。評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issue/KT-18707)でのフィードバックをお待ちしております。
>
{style="warning"}

Kotlin 1.5.30では、いくつかの制限付きで`suspend`関数型をスーパークラスとして使用できる機能のプレビューが提供されます。

```kotlin
class MyClass: suspend () -> Unit {
    override suspend fun invoke() { TODO() }
}
```

この機能を有効にするには、`-language-version 1.6`コンパイラオプションを使用してください。

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
*   通常の関数型と`suspend`関数型をスーパークラスとして混在させることはできません。これはJVMバックエンドにおける`suspend`関数型の実装詳細に起因します。これらはマーカーインターフェースを持つ通常の関数型として表現されるため、どのスーパークラスがサスペンド型で、どのスーパークラスが通常型であるかを区別する方法がありません。
*   複数の`suspend`関数型をスーパークラスとして使用することはできません。型チェックがある場合、複数の通常の関数型をスーパークラスとして使用することもできません。

### 実験的なAPIの暗黙的な使用に対するオプトインの要求

> オプトイン要件メカニズムは[実験的](components-stability.md)です。
> これはいつでも変更される可能性があります。[オプトイン方法を確認](opt-in-requirements.md)してください。
> 評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issues/KT)でのフィードバックをお待ちしております。
>
{style="warning"}

ライブラリの作者は、実験的なAPIが[オプトインを必要とする](opt-in-requirements.md#create-opt-in-requirement-annotations)ものとしてマークし、その実験的な状態をユーザーに知らせることができます。APIが使用された際にコンパイラが警告またはエラーを発生させ、それを抑制するために[明示的な同意](opt-in-requirements.md#opt-in-to-api)が必要となります。

Kotlin 1.5.30では、コンパイラはシグネチャに実験的な型を持つすべての宣言を実験的として扱います。つまり、実験的なAPIの暗黙的な使用に対してもオプトインを要求します。例えば、関数の戻り値の型が実験的なAPI要素としてマークされている場合、その関数の使用には、宣言が明示的にオプトインを必要としないとマークされていても、オプトインが必要です。

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

[オプトイン要件](opt-in-requirements.md)の詳細を確認してください。

### 異なるターゲットを持つオプトイン要件アノテーションの使用変更

> オプトイン要件メカニズムは[実験的](components-stability.md)です。
> これはいつでも変更される可能性があります。[オプトイン方法を確認](opt-in-requirements.md)してください。
> 評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issues/KT)でのフィードバックをお待ちしております。
>
{style="warning"}

Kotlin 1.5.30では、異なる[ターゲット](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/)に対してオプトイン要件アノテーションを使用および宣言するための新しいルールが導入されます。コンパイラは、コンパイル時に処理するのが非現実的なユースケースに対してエラーを報告するようになりました。Kotlin 1.5.30では以下の通りです。
*   使用箇所でローカル変数と値パラメータをオプトイン要件アノテーションでマークすることは禁止されています。
*   オーバーライドのマークは、その基本宣言もマークされている場合にのみ許可されます。
*   バッキングフィールドとゲッターをマークすることは禁止されています。代わりに基本プロパティをマークできます。
*   オプトイン要件アノテーション宣言サイトでの`TYPE`および`TYPE_PARAMETER`アノテーションターゲットの設定は禁止されています。

[オプトイン要件](opt-in-requirements.md)の詳細を確認してください。

### 再帰的なジェネリック型の型推論の改善

KotlinおよびJavaでは、型パラメータで自身を参照する再帰的なジェネリック型を定義できます。Kotlin 1.5.30では、Kotlinコンパイラは、対応する型パラメータが再帰的なジェネリック型である場合、その上限のみに基づいて型引数を推論できるようになりました。これにより、JavaでビルダーAPIを作成する際によく使用される再帰的なジェネリック型を用いた様々なパターンを作成することが可能になります。

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

改善を有効にするには、`-Xself-upper-bound-inference`または`-language-version 1.6`コンパイラオプションを渡します。新たにサポートされたユースケースの他の例については、[こちらのYouTrackチケット](https://youtrack.jetbrains.com/issue/KT-40804)を参照してください。

### ビルダー推論の制限の解消

ビルダー推論は、ラムダ引数内の他の呼び出しからの型情報に基づいて、呼び出しの型引数を推論できる特殊な型推論です。これは、[`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html)や[`sequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/sequence.html)のような汎用ビルダー関数を呼び出す際に役立ちます。例: `buildList { add("string") }`。

このようなラムダ引数内では、これまでビルダー推論が推論しようとする型情報の使用に制限がありました。つまり、それを指定することはできても、取得することはできませんでした。例えば、明示的に型引数を指定しない限り、`buildList()`のラムダ引数内で[`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/get.html)を呼び出すことはできませんでした。

Kotlin 1.5.30では、`-Xunrestricted-builder-inference`コンパイラオプションによってこれらの制限が解消されます。このオプションを追加することで、汎用ビルダー関数のラムダ引数内でこれまで禁止されていた呼び出しが可能になります。

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

また、`-language-version 1.6`コンパイラオプションでもこの機能を有効にできます。

## Kotlin/JVM

Kotlin 1.5.30では、Kotlin/JVMに以下の機能が追加されます。
*   [アノテーションクラスのインスタンス化](#instantiation-of-annotation-classes)
*   [null許容アノテーションサポート設定の改善](#improved-nullability-annotation-support-configuration)

JVMプラットフォームにおけるKotlin Gradleプラグインの更新については、[Gradle](#gradle)セクションを参照してください。

### アノテーションクラスのインスタンス化

> アノテーションクラスのインスタンス化は[実験的](components-stability.md)です。これはいつでも変更または廃止される可能性があります。
> オプトインが必要です（詳細は下記参照）。評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issue/KT-45395)でのフィードバックをお待ちしております。
>
{style="warning"}

Kotlin 1.5.30では、[アノテーションクラス](annotations.md)のコンストラクタを任意のコードで呼び出して、結果のインスタンスを取得できるようになりました。この機能は、アノテーションインターフェースの実装を許可するJavaの慣習と同じユースケースをカバーします。

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

この機能を有効にするには、`-language-version 1.6`コンパイラオプションを使用してください。非`val`パラメータやセカンダリコンストラクタとは異なるメンバーを定義する制限など、現在のアノテーションクラスのすべての制限はそのまま残ることに注意してください。

アノテーションクラスのインスタンス化の詳細については、[こちらのKEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-instantiation.md)を参照してください。

### null許容アノテーションサポート設定の改善

Kotlinコンパイラは、様々な種類の[null許容アノテーション](java-interop.md#nullability-annotations)を読み取り、Javaからのnull許容情報を取得できます。この情報により、Javaコードを呼び出す際にKotlinでnull許容の不一致を報告できるようになります。

Kotlin 1.5.30では、特定の種類のnull許容アノテーションからの情報に基づいて、コンパイラがnull許容の不一致を報告するかどうかを指定できます。コンパイラオプション`-Xnullability-annotations=@<package-name>:<report-level>`を使用するだけです。引数には、完全修飾されたnull許容アノテーションパッケージと、以下のレポートレベルのいずれかを指定します。
*   `ignore`でnull許容の不一致を無視
*   `warn`で警告を報告
*   `strict`でエラーを報告

サポートされている[null許容アノテーションの完全なリスト](java-interop.md#nullability-annotations)と、それらの完全修飾パッケージ名を確認してください。

新しくサポートされた[RxJava](https://github.com/ReactiveX/RxJava) 3のnull許容アノテーションのエラー報告を有効にする例を以下に示します: `-Xnullability-annotations=@io.reactivex.rxjava3.annotations:strict`。なお、このようなnull許容の不一致はすべてデフォルトで警告となります。

## Kotlin/Native

Kotlin/Nativeは様々な変更と改善を受けました。
*   [Appleシリコンのサポート](#apple-silicon-support)
*   [CocoaPods GradleプラグインのKotlin DSLの改善](#improved-kotlin-dsl-for-the-cocoapods-gradle-plugin)
*   [Swift 5.5 async/awaitとの実験的な相互運用性](#experimental-interoperability-with-swift-5-5-async-await)
*   [オブジェクトとコンパニオンオブジェクトに対するSwift/Objective-Cマッピングの改善](#improved-swift-objective-c-mapping-for-objects-and-companion-objects)
*   [MinGWターゲット向けのインポートライブラリなしDLLへのリンクの非推奨化](#deprecation-of-linkage-against-dlls-without-import-libraries-for-mingw-targets)

### Appleシリコンのサポート

Kotlin 1.5.30は、[Appleシリコン](https://support.apple.com/en-us/HT211814)のネイティブサポートを導入します。

これまで、Kotlin/Nativeコンパイラとツールは、Appleシリコンホストで動作するために[Rosettaトランスレーション環境](https://developer.apple.com/documentation/apple-silicon/about-the-rosetta-translation-environment)を必要としていました。Kotlin 1.5.30では、トランスレーション環境はもはや不要となり、コンパイラとツールは追加のアクションを必要とせずにAppleシリコンハードウェア上で実行できます。

また、KotlinコードをAppleシリコン上でネイティブに実行できるようにする新しいターゲットも導入しました。
*   `macosArm64`
*   `iosSimulatorArm64`
*   `watchosSimulatorArm64`
*   `tvosSimulatorArm64`

これらはIntelベースとAppleシリコンの両方のホストで利用可能です。既存のすべてのターゲットもAppleシリコンホストで利用できます。

Kotlin 1.5.30では、`kotlin-multiplatform` GradleプラグインにおいてAppleシリコンターゲットの基本的なサポートのみを提供していることに注意してください。特に、新しいシミュレータターゲットは、`ios`、`tvos`、`watchos`のターゲットショートカットには含まれていません。
私たちは引き続き、新しいターゲットでのユーザーエクスペリエンスを向上させるために取り組んでいきます。

### CocoaPods GradleプラグインのKotlin DSLの改善

#### Kotlin/Nativeフレームワークの新しいパラメータ

Kotlin 1.5.30では、Kotlin/Nativeフレームワーク向けのCocoaPods GradleプラグインDSLが改善されました。フレームワーク名に加えて、Pod設定で他のパラメータを指定できるようになりました。
*   フレームワークの動的または静的バージョンを指定
*   依存関係を明示的にエクスポートを有効化
*   Bitcode埋め込みを有効化

新しいDSLを使用するには、プロジェクトをKotlin 1.5.30に更新し、`build.gradle(.kts)`ファイルの`cocoapods`セクションでパラメータを指定します。

```kotlin
cocoapods {
    frameworkName = "MyFramework" // このプロパティは非推奨です
    // 将来のバージョンで削除されます
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

#### Xcode構成のカスタム名のサポート

Kotlin CocoaPods Gradleプラグインは、Xcodeビルド構成でのカスタム名をサポートします。これは、Xcodeで`Staging`のような特別なビルド構成名を使用している場合にも役立ちます。

カスタム名を指定するには、`build.gradle(.kts)`ファイルの`cocoapods`セクションで`xcodeConfigurationToNativeBuildType`パラメータを使用します。

```kotlin
cocoapods {
    // Maps custom Xcode configuration to NativeBuildType
    xcodeConfigurationToNativeBuildType["CUSTOM_DEBUG"] = NativeBuildType.DEBUG
    xcodeConfigurationToNativeBuildType["CUSTOM_RELEASE"] = NativeBuildType.RELEASE
}
```

このパラメータはPodspecファイルには表示されません。XcodeがGradleビルドプロセスを実行すると、Kotlin CocoaPods Gradleプラグインが必要なネイティブビルドタイプを選択します。

> `Debug`と`Release`の構成はデフォルトでサポートされているため、宣言する必要はありません。
>
{style="note"}

### Swift 5.5 async/awaitとの実験的な相互運用性

> Swift async/awaitとの並行処理の相互運用性は[実験的](components-stability.md)です。これはいつでも変更または廃止される可能性があります。
> 評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issue/KT-47610)でのフィードバックをお待ちしております。
>
{style="warning"}

Kotlin 1.4.0で[Kotlinのサスペンド関数をObjective-CおよびSwiftから呼び出すサポート](whatsnew14.md#support-for-kotlin-s-suspending-functions-in-swift-and-objective-c)を追加しましたが、Swift 5.5の新機能である[asyncおよびawait修飾子による並行処理](https://github.com/apple/swift-evolution/blob/main/proposals/0296-async-await.md)に対応するために、それを改善しています。

Kotlin/Nativeコンパイラは、null許容の戻り値型を持つサスペンド関数のために、生成されたObjective-Cヘッダーに`_Nullable_result`属性を出力するようになりました。これにより、Swiftから適切なnull許容性を持つ`async`関数としてこれらを呼び出すことが可能になります。

この機能は実験的であり、将来的にKotlinとSwiftの両方の変更によって影響を受ける可能性があることに注意してください。今のところ、私たちはいくつかの制限があるこの機能のプレビューを提供しており、皆様のご意見をぜひお聞かせください。現在の状態の詳細とフィードバックは、[こちらのYouTrackイシュー](https://youtrack.jetbrains.com/issue/KT-47610)に残してください。

### オブジェクトとコンパニオンオブジェクトに対するSwift/Objective-Cマッピングの改善

オブジェクトとコンパニオンオブジェクトの取得が、ネイティブiOS開発者にとってより直感的な方法でできるようになりました。例えば、Kotlinで以下のオブジェクトがある場合:

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

[Swift/Objective-C相互運用性](native-objc-interop.md)の詳細を確認してください。

### MinGWターゲット向けのインポートライブラリなしDLLへのリンクの非推奨化

[LLD](https://lld.llvm.org/)はLLVMプロジェクトのリンカであり、デフォルトのld.bfdよりも優れたパフォーマンスという利点から、MinGWターゲットのKotlin/NativeでLLDの使用を開始する予定です。

しかしながら、LLDの最新安定版はMinGW (Windows) ターゲット向けのDLLへの直接リンクをサポートしていません。そのようなリンクには[インポートライブラリ](https://stackoverflow.com/questions/3573475/how-does-the-import-library-work-details/3573527#3573527)の使用が必要です。Kotlin/Native 1.5.30ではそれらは不要ですが、将来的にMinGWのデフォルトリンカとなるLLDとは互換性がないことをお知らせするために警告を追加しています。

LLDリンカへの移行に関するご意見や懸念事項は、[こちらのYouTrackイシュー](https://youtrack.jetbrains.com/issue/KT-47605)で共有してください。

## Kotlin Multiplatform

1.5.30では、Kotlin Multiplatformに以下の注目すべきアップデートがもたらされます。
*   [共有ネイティブコードでカスタム`cinterop`ライブラリを使用する機能](#ability-to-use-custom-cinterop-libraries-in-shared-native-code)
*   [XCFrameworksのサポート](#support-for-xcframeworks)
*   [Androidアーティファクトの新しいデフォルト公開設定](#new-default-publishing-setup-for-android-artifacts)

### 共有ネイティブコードでカスタムcinteropライブラリを使用する機能

Kotlin Multiplatformは、共有ソースセットでプラットフォーム依存の相互運用ライブラリを使用する[オプション](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#connect-platform-specific-libraries)を提供します。1.5.30より前は、Kotlin/Nativeディストリビューションに同梱されている[プラットフォームライブラリ](native-platform-libs.md)でのみ動作していました。1.5.30からは、カスタム`cinterop`ライブラリでも使用できるようになります。この機能を有効にするには、`gradle.properties`に`kotlin.mpp.enableCInteropCommonization=true`プロパティを追加します。

```none
kotlin.mpp.enableGranularSourceSetsMetadata=true
kotlin.native.enableDependencyPropagation=false
kotlin.mpp.enableCInteropCommonization=true
```

### XCFrameworksのサポート

すべてのKotlin Multiplatformプロジェクトは、XCFrameworksを出力フォーマットとして使用できるようになりました。Appleはユニバーサル（fat）フレームワークの代替としてXCFrameworksを導入しました。XCFrameworksを使用すると、次のことができます。
*   すべてのターゲットプラットフォームとアーキテクチャのロジックを単一のバンドルにまとめることができます。
*   アプリケーションをApp Storeに公開する前に、不要なアーキテクチャをすべて削除する必要がありません。

XCFrameworksは、Apple M1デバイスとシミュレータでKotlinフレームワークを使用したい場合に役立ちます。

XCFrameworksを使用するには、`build.gradle(.kts)`スクリプトを更新してください。

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
*   `assembleXCFramework`
*   `assembleDebugXCFramework`（さらに[dSYMsを含む](native-debugging.md#debug-ios-applications)デバッグアーティファクト）
*   `assembleReleaseXCFramework`

XCFrameworksの詳細については、[このWWDCビデオ](https://developer.apple.com/videos/play/wwdc2019/416/)を参照してください。

### Androidアーティファクトの新しいデフォルト公開設定

`maven-publish` Gradleプラグインを使用すると、ビルドスクリプトで[Androidバリアント](https://developer.android.com/studio/build/build-variants)名を指定することで、[Androidターゲット向けマルチプラットフォームライブラリ](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-lib-setup.html#publish-an-android-library)を公開できます。Kotlin Gradleプラグインは自動的に公開物を生成します。

1.5.30より前は、生成された公開[メタデータ](https://docs.gradle.org/current/userguide/publishing_gradle_module_metadata.html)には、公開されたすべてのAndroidバリアントのビルドタイプ属性が含まれており、ライブラリのコンシューマが使用するのと同じビルドタイプとのみ互換性がありました。Kotlin 1.5.30では、新しいデフォルトの公開設定が導入されます。
*   プロジェクトが公開するすべてのAndroidバリアントが同じビルドタイプ属性を持つ場合、公開されたバリアントにはビルドタイプ属性がなくなり、任意のビルドタイプと互換性を持つようになります。
*   公開されたバリアントが異なるビルドタイプ属性を持つ場合、`release`値を持つもののみがビルドタイプ属性なしで公開されます。これにより、リリースバリアントはコンシューマ側で任意のビルドタイプと互換性を持つようになりますが、非リリースバリアントは一致するコンシューマビルドタイプとのみ互換性を持つことになります。

オプトアウトしてすべてのバリアントのビルドタイプ属性を保持するには、このGradleプロパティを設定します: `kotlin.android.buildTypeAttribute.keep=true`。

## Kotlin/JS

Kotlin 1.5.30では、Kotlin/JSに2つの主要な改善がもたらされます。
*   [JS IRコンパイラバックエンドがベータ版に到達](#js-ir-compiler-backend-reaches-beta)
*   [Kotlin/JS IRバックエンドを使用するアプリケーションのデバッグ体験の向上](#better-debugging-experience-for-applications-with-the-kotlin-js-ir-backend)

### JS IRコンパイラバックエンドがベータ版に到達

Kotlin/JS向けの[IRベースのコンパイラバックエンド](whatsnew14.md#unified-backends-and-extensibility)は、1.4.0で[アルファ版](components-stability.md)として導入されましたが、ベータ版に到達しました。

以前、新しいバックエンドにプロジェクトを移行するのに役立つ[JS IRバックエンドの移行ガイド](js-ir-migration.md)を公開しました。今回は、IntelliJ IDEAに直接必要な変更を表示する[Kotlin/JS Inspection Pack](https://plugins.jetbrains.com/plugin/17183-kotlin-js-inspection-pack/) IDEプラグインをご紹介します。

### Kotlin/JS IRバックエンドを使用するアプリケーションのデバッグ体験の向上

Kotlin 1.5.30では、Kotlin/JS IRバックエンド用のJavaScriptソースマップ生成が導入されます。これにより、IRバックエンドが有効な場合のKotlin/JSのデバッグ体験が向上し、ブレークポイント、ステップ実行、適切なソース参照付きの読みやすいスタックトレースを含む完全なデバッグサポートが提供されます。

ブラウザまたはIntelliJ IDEA UltimateでKotlin/JSをデバッグする方法については、[こちら](js-debugging.md)を参照してください。

## Gradle

[Kotlin Gradleプラグインのユーザーエクスペリエンスを向上させる](https://youtrack.jetbrains.com/issue/KT-45778)という私たちのミッションの一環として、以下の機能を実装しました。
*   [Javaツールチェインのサポート](#support-for-java-toolchains)
    *   これには、[古いGradleバージョン向けに`UsesKotlinJavaToolchain`インターフェースを使用してJDKホームを指定する機能](#ability-to-specify-jdk-home-with-useskotlinjavatoolchain-interface)が含まれます
*   [KotlinデーモンのJVM引数を明示的に指定するより簡単な方法](#easier-way-to-explicitly-specify-kotlin-daemon-jvm-arguments)

### Javaツールチェインのサポート

Gradle 6.7では、「Javaツールチェインサポート」機能が導入されました。
この機能を使用すると、次のことができます。
*   Gradleのものとは異なるJDKやJREを使用して、コンパイル、テスト、実行可能ファイルを実行できます。
*   未リリースの言語バージョンでコードをコンパイルおよびテストできます。

ツールチェインサポートにより、GradleはローカルJDKを自動検出し、ビルドに必要な不足しているJDKをインストールできます。これでGradle自体は任意のJDK上で動作しながら、[ビルドキャッシュ機能](gradle-compilation-and-caches.md#gradle-build-cache-support)を再利用できます。

Kotlin Gradleプラグインは、Kotlin/JVMコンパイルタスクでJavaツールチェインをサポートします。
Javaツールチェインは以下の通りです。
*   JVMターゲットで利用可能な[`jdkHome`オプション](gradle-compiler-options.md#attributes-specific-to-jvm)を設定します。
    > [`jdkHome`オプションを直接設定する機能は非推奨になりました](https://youtrack.jetbrains.com/issue/KT-46541)。
    >
    {style="warning"}

*   ユーザーが`jvmTarget`オプションを明示的に設定しなかった場合、[`kotlinOptions.jvmTarget`](gradle-compiler-options.md#attributes-specific-to-jvm)をツールチェインのJDKバージョンに設定します。
    ツールチェインが設定されていない場合、`jvmTarget`フィールドはデフォルト値を使用します。[JVMターゲットの互換性](gradle-configure-project.md#check-for-jvm-target-compatibility-of-related-compile-tasks)の詳細を確認してください。

*   [`kapt`ワーカー](kapt.md#run-kapt-tasks-in-parallel)がどのJDKで実行されるかに影響します。

ツールチェインを設定するには、以下のコードを使用します。プレースホルダー`<MAJOR_JDK_VERSION>`を使用したいJDKバージョンに置き換えてください。

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

`kotlin`拡張機能を通じてツールチェインを設定すると、Javaコンパイルタスクのツールチェインも更新されることに注意してください。

`java`拡張機能を通じてツールチェインを設定することもでき、Kotlinコンパイルタスクはそれを使用します。

```kotlin
java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) // "8"
    }
}
```

`KotlinCompile`タスクのJDKバージョン設定については、[Task DSLでJDKバージョンを設定する](gradle-configure-project.md#set-jdk-version-with-the-task-dsl)に関するドキュメントを参照してください。

Gradle 6.1から6.6のバージョンでは、[JDKホームを設定するために`UsesKotlinJavaToolchain`インターフェースを使用](#ability-to-specify-jdk-home-with-useskotlinjavatoolchain-interface)してください。

### UsesKotlinJavaToolchainインターフェースを使用してJDKホームを指定する機能

[`kotlinOptions`](gradle-compiler-options.md)を介してJDK設定をサポートするすべてのKotlinタスクが、`UsesKotlinJavaToolchain`インターフェースを実装するようになりました。JDKホームを設定するには、JDKへのパスを記述し、`<JDK_VERSION>`プレースホルダーを置き換えてください。

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

Gradle 6.1から6.6のバージョンでは、`UsesKotlinJavaToolchain`インターフェースを使用してください。Gradle 6.7以降では、代わりに[Javaツールチェイン](#support-for-java-toolchains)を使用してください。

この機能を使用する場合、[kaptタスクワーカー](kapt.md#run-kapt-tasks-in-parallel)は[プロセス分離モード](https://docs.gradle.org/current/userguide/worker_api.html#changing_the_isolation_mode)のみを使用し、`kapt.workers.isolation`プロパティは無視されることに注意してください。

### KotlinデーモンのJVM引数を明示的に指定するより簡単な方法

Kotlin 1.5.30では、KotlinデーモンのJVM引数に新しいロジックが導入されました。以下のリストの各オプションは、それ以前のオプションを上書きします。

*   何も指定されていない場合、Kotlinデーモンは（以前と同様に）Gradleデーモンから引数を継承します。例えば、`gradle.properties`ファイルでは次のようになります。

    ```none
    org.gradle.jvmargs=-Xmx1500m -Xms=500m
    ```

*   GradleデーモンのJVM引数に`kotlin.daemon.jvm.options`システムプロパティがある場合、以前と同様に使用します。

    ```none
    org.gradle.jvmargs=-Dkotlin.daemon.jvm.options=-Xmx1500m -Xms=500m
    ```

*   `gradle.properties`ファイルに`kotlin.daemon.jvmargs`プロパティを追加できます。

    ```none
    kotlin.daemon.jvmargs=-Xmx1500m -Xms=500m
    ```

*   `kotlin`拡張機能で引数を指定できます。

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

*   特定のタスクの引数を指定できます。

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

    > この場合、タスク実行時に新しいKotlinデーモンインスタンスが起動する可能性があります。[KotlinデーモンのJVM引数との相互作用](gradle-compilation-and-caches.md#setting-kotlin-daemon-s-jvm-arguments)について詳しく確認してください。
    >
    {style="note"}

Kotlinデーモンの詳細については、[KotlinデーモンとGradleでの使用方法](gradle-compilation-and-caches.md#the-kotlin-daemon-and-how-to-use-it-with-gradle)を参照してください。

## 標準ライブラリ

Kotlin 1.5.30では、標準ライブラリの`Duration`と`Regex` APIに改善がもたらされます。
*   [`Duration.toString()`の出力変更](#changing-duration-tostring-output)
*   [StringからDurationをパース](#parsing-duration-from-string)
*   [特定の箇所でのRegexによるマッチング](#matching-with-regex-at-a-particular-position)
*   [Regexをシーケンスに分割](#splitting-regex-to-a-sequence)

### Duration.toString()の出力変更

> Duration APIは[実験的](components-stability.md)です。これはいつでも変更または廃止される可能性があります。
> 評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issues/KT)でのフィードバックをお待ちしております。
>
{style="warning"}

Kotlin 1.5.30より前では、[`Duration.toString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-string.html)関数は、その引数の文字列表現を、最もコンパクトで読みやすい数値となる単位で返していました。
今後は、各数値コンポーネントがそれぞれの単位で表現された文字列値を返します。
各コンポーネントは、数値の後に単位の略称（`d`、`h`、`m`、`s`）が続きます。例:

|**関数呼び出しの例**|**以前の出力**|**現在の出力**|
| --- | --- | --- |
Duration.days(45).toString()|`45.0d`|`45d`|
Duration.days(1.5).toString()|`36.0h`|`1d 12h`|
Duration.minutes(1230).toString()|`20.5h`|`20h 30m`|
Duration.minutes(2415).toString()|`40.3h`|`1d 16h 15m`|
Duration.minutes(920).toString()|`920m`|`15h 20m`|
Duration.seconds(1.546).toString()|`1.55s`|`1.546s`|
Duration.milliseconds(25.12).toString()|`25.1ms`|`25.12ms`|

負の期間の表現方法も変更されました。負の期間はマイナス記号（`-`）が接頭辞として付加され、複数のコンポーネントから構成される場合は括弧で囲まれます: `-12m`および`-(1h 30m)`。

1秒未満の短い期間は、秒未満の単位（例: `ms` (ミリ秒)、`us` (マイクロ秒)、`ns` (ナノ秒)）を持つ単一の数値として表現されることに注意してください: `140.884ms`、`500us`、`24ns`。それらを表現するために科学的記数法はもはや使用されません。

期間を単一の単位で表現したい場合は、オーバーロードされた`Duration.toString(unit, decimals)`関数を使用してください。

> シリアライゼーションやデータ交換を含む特定のケースでは、[`Duration.toIsoString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-iso-string.html)を使用することをお勧めします。`Duration.toIsoString()`は、`Duration.toString()`の代わりに、より厳密な[ISO-8601](https://www.iso.org/iso-8601-date-and-time-format.html)形式を使用します。
>
{style="note"}

### StringからDurationをパース

> Duration APIは[実験的](components-stability.md)です。これはいつでも変更または廃止される可能性があります。
> 評価目的でのみ使用してください。[こちらのイシュー](https://github.com/Kotlin/KEEP/issues/190)でのフィードバックをお待ちしております。
>
{style="warning"}

Kotlin 1.5.30では、Duration APIに新しい関数が追加されました。
*   [`parse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/parse.html)は、以下の出力のパースをサポートします。
    *   [`toString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-string.html)。
    *   [`toString(unit, decimals)`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-string.html)。
    *   [`toIsoString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-iso-string.html)。
*   `toIsoString()`によって生成されたフォーマットからのみパースする[`parseIsoString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/parse-iso-string.html)。
*   上記関数と同様に動作しますが、無効な期間フォーマットの場合に`IllegalArgumentException`をスローする代わりに`null`を返す[`parseOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/parse-or-null.html)と[`parseIsoStringOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/parse-iso-string-or-null.html)。

`parse()`と`parseOrNull()`の使用例をいくつか示します。

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

そして、`parseIsoString()`と`parseIsoStringOrNull()`の使用例をいくつか示します。

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

### 特定の箇所でのRegexによるマッチング

> `Regex.matchAt()`と`Regex.matchesAt()`関数は[実験的](components-stability.md)です。これらはいつでも変更または廃止される可能性があります。
> 評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issue/KT-34021)でのフィードバックをお待ちしております。
>
{style="warning"}

新しい`Regex.matchAt()`と`Regex.matchesAt()`関数は、`String`または`CharSequence`の特定の箇所で正規表現が完全に一致するかどうかをチェックする方法を提供します。

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

`matchAt()`は一致が見つかればその一致を返し、見つからなければ`null`を返します。

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

> `Regex.splitToSequence()`と`CharSequence.splitToSequence(Regex)`関数は[実験的](components-stability.md)です。これらはいつでも変更または廃止される可能性があります。
> 評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issue/KT-23351)でのフィードバックをお待ちしております。
>
{style="warning"}

新しい`Regex.splitToSequence()`関数は、[`split()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/split.html)の遅延評価版です。指定された正規表現に一致する箇所で文字列を分割しますが、その結果は[Sequence](sequences.md)として返されるため、この結果に対するすべての操作は遅延実行されます。

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

`kotlinx.serialization` [1.3.0-RC](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.3.0-RC)が、新しいJSONシリアライゼーション機能を備えて登場しました。
*   Java IOストリームのシリアライゼーション
*   デフォルト値に対するプロパティレベルの制御
*   null値をシリアライゼーションから除外するオプション
*   ポリモーフィックシリアライゼーションにおけるカスタムクラス識別子

詳細については、[変更履歴](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.3.0-RC)を参照してください。
<!-- and the [kotlinx.serialization 1.3.0 release blog post](TODO). -->