---
title: "Kotlin 1.5.30 の新機能"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[Released: 24 August 2021](releases#release-details)_

Kotlin 1.5.30では、将来の変更のプレビュー、プラットフォームのサポートとツールに関するさまざまな改善、および新しい標準ライブラリ関数を含む言語アップデートが提供されます。

主な改善点は次のとおりです。
* 試験的な sealed `when` ステートメント、opt-in requirement の使用における変更などを含む、言語機能
* Apple silicon のネイティブサポート
* Kotlin/JS IR バックエンドがベータに到達
* Gradle プラグインのエクスペリエンスが向上

変更点の簡単な概要については、[リリースブログ記事](https://blog.jetbrains.com/kotlin/2021/08/kotlin-1-5-30-released/)とこの動画をご覧ください。

<video src="https://www.youtube.com/v/rNbb3A9IdOo" title="Kotlin 1.5.30"/>

## Language features

Kotlin 1.5.30 では、将来の言語変更のプレビューが提示され、opt-in requirement メカニズムと型推論が改善されています。
* [sealed および Boolean サブジェクトに対する網羅的な when ステートメント](#exhaustive-when-statements-for-sealed-and-boolean-subjects)
* [スーパtypeとしての suspending 関数](#suspending-functions-as-supertypes)
* [試験的な API の暗黙的な使用に対する opt-in の要求](#requiring-opt-in-on-implicit-usages-of-experimental-apis)
* [異なるターゲットで opt-in requirement アノテーションを使用するための変更](#changes-to-using-opt-in-requirement-annotations-with-different-targets)
* [再帰的なジェネリック型の型推論の改善](#improvements-to-type-inference-for-recursive-generic-types)
* [ビルダー推論の制限の排除](#eliminating-builder-inference-restrictions)

### sealed および Boolean サブジェクトに対する網羅的な when ステートメント

:::note
sealed (網羅的な) when ステートメントのサポートは[Experimental](components-stability)です。
これはいつでも削除または変更される可能性があります。
Opt-in が必要です (以下の詳細を参照)。評価目的でのみ使用してください。
[YouTrack](https://youtrack.jetbrains.com/issue/KT-12380) でのご意見をお待ちしております。

_網羅的な_ [`when`](control-flow#when-expressions-and-statements) ステートメントには、そのサブジェクトの可能なすべての型または値に対するブランチ、または特定の型に対するブランチが含まれており、残りのケースをカバーするために `else` ブランチが含まれています。

`when` 式と一貫した動作にするために、間もなく網羅的でない `when` ステートメントを禁止する予定です。
スムーズな移行を確実にするために、sealed クラスまたは Boolean を使用した網羅的でない `when` ステートメントに関する警告を報告するようにコンパイラーを構成できます。
このような警告は、Kotlin 1.6 ではデフォルトで表示され、後でエラーになります。

Enum はすでに警告を受け取ります。

:::

```kotlin
sealed class Mode {
    object ON : Mode()
    object OFF : Mode()
}

fun main() {
    val x: Mode = Mode.ON
    when (x) { 
        Mode.ON `->` println("ON")
    }
// WARNING: Non exhaustive 'when' statements on sealed classes/interfaces 
// will be prohibited in 1.7, add an 'OFF' or 'else' branch instead

    val y: Boolean = true
    when (y) {  
        true `->` println("true")
    }
// WARNING: Non exhaustive 'when' statements on Booleans will be prohibited 
// in 1.7, add a 'false' or 'else' branch instead
}
```

Kotlin 1.5.30 でこの機能を有効にするには、言語バージョン `1.6` を使用します。
[progressive mode](whatsnew13#progressive-mode)を有効にして、警告をエラーに変更することもできます。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

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

</TabItem>
<TabItem value="groovy" label="Groovy" default>

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

</TabItem>
</Tabs>

### スーパtypeとしての suspending 関数

:::note
スーパtypeとしての suspending 関数のサポートは[Experimental](components-stability)です。
これはいつでも削除または変更される可能性があります。
Opt-in が必要です (以下の詳細を参照)。評価目的でのみ使用してください。
[YouTrack](https://youtrack.jetbrains.com/issue/KT-18707) でのご意見をお待ちしております。

Kotlin 1.5.30 は、いくつかの制限付きで `suspend` 関数型をスーパtypeとして使用する機能のプレビューを提供します。

```kotlin
class MyClass: suspend () `->` Unit {
    override suspend fun invoke() { TODO() }
}
```

`-language-version 1.6` コンパイラーオプションを使用して機能を有効にします。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets.all {
        languageSettings.apply {
            languageVersion = "1.6"
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
            languageVersion = '1.6'
        }
    }
}
```

</TabItem>
</Tabs>

この機能には次の制限があります。
* 通常の関数型と `suspend` 関数型をスーパtypeとして混在させることはできません。
これは、JVM バックエンドにおける `suspend` 関数型の実装の詳細が理由です。
それらはマーカーインターフェイスを備えた通常の関数型として表されます。
マーカーインターフェイスのため、どのスーパインターフェイスが suspend され、どれが通常であるかを判別する方法はありません。
* 複数の `suspend` 関数スーパtypeを使用することはできません。
型チェックがある場合、複数の通常の関数スーパtypeを使用することもできません。

### 試験的な API の暗黙的な使用に対する opt-in の要求

opt-in requirement メカニズムは[Experimental](components-stability)です。
これはいつでも変更される可能性があります。
[opt-in の方法を参照してください](opt-in-requirements)。
評価目的でのみ使用してください。
[YouTrack](https://youtrack.jetbrains.com/issues/KT) でのご意見をお待ちしております。

ライブラリの作成者は、実験的な API に[opt-in を要求する](opt-in-requirements#create-opt-in-requirement-annotations)マークを付けて、その実験的な状態をユーザーに知らせることができます。
コンパイラーは、API が使用されると警告またはエラーを発生させ、それを抑制するために[明示的な同意](opt-in-requirements#opt-in-to-api)を必要とします。

Kotlin 1.5.30 では、コンパイラーはシグネチャに実験的な型を持つ宣言を実験的なものとして扱います。
つまり、実験的な API の暗黙的な使用についても opt-in を要求します。
たとえば、関数の戻り型が実験的な API 要素としてマークされている場合、宣言が opt-in を明示的に要求するとしてマークされていなくても、関数の使用には opt-in が必要になります。

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

[opt-in requirements](opt-in-requirements) の詳細をご覧ください。

### 異なるターゲットで opt-in requirement アノテーションを使用するための変更

opt-in requirement メカニズムは[Experimental](components-stability)です。
これはいつでも変更される可能性があります。
[opt-in の方法を参照してください](opt-in-requirements)。
評価目的でのみ使用してください。
[YouTrack](https://youtrack.jetbrains.com/issues/KT) でのご意見をお待ちしております。

Kotlin 1.5.30 では、さまざまな[ターゲット](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/)で opt-in requirement アノテーションを使用および宣言するための新しいルールが提示されています。
コンパイラーは、コンパイル時に処理するのが非現実的なユースケースに対してエラーを報告するようになりました。
Kotlin 1.5.30 では次のようになります。
* ローカル変数と値パラメーターを opt-in requirement アノテーションでマークすることは、使用サイトでは禁止されています。
* override のマーキングは、その基本的な宣言もマークされている場合にのみ許可されます。
* backing フィールドとゲッターのマーキングは禁止されています。
代わりに基本的なプロパティをマークできます。
* `TYPE` および `TYPE_PARAMETER` アノテーションターゲットの設定は、opt-in requirement アノテーション宣言サイトでは禁止されています。

[opt-in requirements](opt-in-requirements) の詳細をご覧ください。

### 再帰的なジェネリック型の型推論の改善

Kotlin および Java では、その型パラメーターで自身を参照する再帰的なジェネリック型を定義できます。
Kotlin 1.5.30 では、Kotlin コンパイラーは、対応する型パラメーターの上限のみに基づいて型引数を推論できます (再帰的なジェネリックである場合)。
これにより、Java でビルダー API を作成するためによく使用される、再帰的なジェネリック型を使用したさまざまなパターンを作成できます。

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

`-Xself-upper-bound-inference` または `-language-version 1.6` コンパイラーオプションを渡すことで、改善を有効にできます。
新しくサポートされるユースケースのその他の例については、[この YouTrack チケット](https://youtrack.jetbrains.com/issue/KT-40804)を参照してください。

### ビルダー推論の制限の排除

ビルダー推論は、ラムダ引数内の他の呼び出しからの型情報に基づいて呼び出しの型引数を推論できる特別な種類の型推論です。
これは、[`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html) や [`sequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/sequence.html) などのジェネリックビルダー関数を呼び出す場合に役立ちます: `buildList { add("string") }`.

このようなラムダ引数内では、以前はビルダー推論が推論しようとする型情報を使用することに制限がありました。
つまり、それを指定することしかできず、取得することはできません。
たとえば、明示的に指定された型引数なしで `buildList()` のラムダ引数内で [`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/get.html) を呼び出すことはできません。

Kotlin 1.5.30 では、`-Xunrestricted-builder-inference` コンパイラーオプションを使用してこれらの制限が削除されます。
このオプションを追加して、ジェネリックビルダー関数のラムダ引数内で以前に禁止されていた呼び出しを有効にします。

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

また、`-language-version 1.6` コンパイラーオプションを使用してこの機能を有効にすることもできます。

## Kotlin/JVM

Kotlin 1.5.30 では、Kotlin/JVM は次の機能を受け取ります。
* [アノテーションクラスのインスタンス化](#instantiation-of-annotation-classes)
* [null 可能性アノテーションのサポート構成の改善](#improved-nullability-annotation-support-configuration)

JVM プラットフォームでの Kotlin Gradle プラグインの更新については、[Gradle](#gradle) セクションを参照してください。

### アノテーションクラスのインスタンス化

アノテーションクラスのインスタンス化は[Experimental](components-stability)です。
これはいつでも削除または変更される可能性があります。
Opt-in が必要です (以下の詳細を参照)。評価目的でのみ使用してください。
[YouTrack](https://youtrack.jetbrains.com/issue/KT-45395) でのご意見をお待ちしております。

Kotlin 1.5.30 では、任意 コードで[アノテーションクラス](annotations)のコンストラクターを呼び出して、結果のインスタンスを取得できるようになりました。
この機能は、アノテーションインターフェイスの実装を可能にする Java の規約と同じユースケースをカバーしています。

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

この機能を有効にするには、`-language-version 1.6` コンパイラーオプションを使用します。
非 `val` パラメーターまたはセカンダリコンストラクターとは異なるメンバーを定義する制限など、現在のアノテーションクラスのすべての制限はそのまま残ることに注意してください。

アノテーションクラスのインスタンス化の詳細については、[この KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-instantiation)を参照してください。

### null 可能性アノテーションのサポート構成の改善

Kotlin コンパイラーは、さまざまな型の[null 可能性アノテーション](java-interop#nullability-annotations)を読み取って、Java から null 可能性情報を取得できます。
この情報により、Java コードを呼び出すときに、Kotlin で null 可能性の不一致を報告できます。

Kotlin 1.5.30 では、特定の型の null 可能性アノテーションからの情報に基づいて、コンパイラーが null 可能性の不一致を報告するかどうかを指定できます。
コンパイラーオプション `-Xnullability-annotations=@<package-name>:<report-level>` を使用するだけです。
引数では、完全修飾 null 可能性アノテーションパッケージと、次のいずれかのレポートレベルを指定します。
* null 可能性の不一致を無視するには、`ignore`
* 警告を報告するには、`warn`
* エラーを報告するには、`strict`.

サポートされている[null 可能性アノテーションの完全なリスト](java-interop#nullability-annotations)を、完全修飾パッケージ名とともに参照してください。

次に、新しくサポートされる[RxJava](https://github.com/ReactiveX/RxJava) 3 null 可能性アノテーションのエラーレポートを有効にする方法を示す例を示します: `-Xnullability-annotations=@io.reactivex.rxjava3.annotations:strict`.
このような null 可能性の不一致はすべて、デフォルトでは警告であることに注意してください。

## Kotlin/Native

Kotlin/Native は、さまざまな変更と改善を受けました。
* [Apple silicon のサポート](#apple-silicon-support)
* [CocoaPods Gradle プラグインの Kotlin DSL の改善](#improved-kotlin-dsl-for-the-cocoapods-gradle-plugin)
* [Swift 5.5 async/await との試験的な相互運用性](#experimental-interoperability-with-swift-5-5-async-await)
* [オブジェクトおよびコンパニオンオブジェクトの Swift/Objective-C マッピングの改善](#improved-swift-objective-c-mapping-for-objects-and-companion-objects)
* [MinGW ターゲットのインポートライブラリなしの DLL に対するリンケージの非推奨](#deprecation-of-linkage-against-dlls-without-import-libraries-for-mingw-targets)

### Apple silicon のサポート

Kotlin 1.5.30 では、[Apple silicon](https://support.apple.com/en-us/HT211814) のネイティブサポートが導入されています。

以前は、Kotlin/Native コンパイラーとツールは、Apple silicon ホストで動作させるために[Rosetta 翻訳環境](https://developer.apple.com/documentation/apple-silicon/about-the-rosetta-translation-environment)を必要としていました。
Kotlin 1.5.30 では、翻訳環境は不要になりました。コンパイラーとツールは、追加のアクションを必要とせずに Apple silicon ハードウェアで実行できます。

また、Kotlin コードを Apple silicon でネイティブに実行できるようにする新しいターゲットも導入しました。
* `macosArm64`
* `iosSimulatorArm64`
* `watchosSimulatorArm64`
* `tvosSimulatorArm64`

これらは、Intel ベースと Apple silicon ホストの両方で使用できます。
既存のターゲットもすべて Apple silicon ホストで使用できます。

1.5.30 では、`kotlin-multiplatform` Gradle プラグインで Apple silicon ターゲットの基本的なサポートのみを提供することに注意してください。
特に、新しいシミュレーターターゲットは、`ios`、`tvos`、および `watchos` ターゲットショートカットには含まれていません。
新しいターゲットでユーザーエクスペリエンスを向上させるために、引き続き取り組んでいきます。

### CocoaPods Gradle プラグインの Kotlin DSL の改善

#### Kotlin/Native フレームワークの新しいパラメーター

Kotlin 1.5.30 では、Kotlin/Native フレームワークの CocoaPods Gradle プラグイン DSL が改善されました。
フレームワークの名前に加えて、Pod 構成で他のパラメーターを指定できます。
* フレームワークの動的バージョンまたは静的バージョンを指定します
* 明示的にエクスポート依存関係を有効にします
* Bitcode 埋め込みを有効にします

新しい DSL を使用するには、プロジェクトを Kotlin 1.5.30 に更新し、`build.gradle(.kts)` ファイルの `cocoapods` セクションでパラメーターを指定します。

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

#### Xcode 構成のカスタム名のサポート

Kotlin CocoaPods Gradle プラグインは、Xcode ビルド構成のカスタム名をサポートしています。
これは、Xcode でビルド構成に特別な名前 (例: `Staging`) を使用している場合にも役立ちます。

カスタム名を指定するには、`build.gradle(.kts)` ファイルの `cocoapods` セクションで `xcodeConfigurationToNativeBuildType` パラメーターを使用します。

```kotlin
cocoapods {
    // Maps custom Xcode configuration to NativeBuildType
    xcodeConfigurationToNativeBuildType["CUSTOM_DEBUG"] = NativeBuildType.DEBUG
    xcodeConfigurationToNativeBuildType["CUSTOM_RELEASE"] = NativeBuildType.RELEASE
}
```

このパラメーターは、Podspec ファイルには表示されません。
Xcode が Gradle ビルドプロセスを実行すると、Kotlin CocoaPods Gradle プラグインは必要なネイティブビルドタイプを選択します。

`Debug` および `Release` 構成はデフォルトでサポートされているため、宣言する必要はありません。

:::

### Swift 5.5 async/await との試験的な相互運用性

:::note
Swift async/await との同時実行性の相互運用性は[Experimental](components-stability)です。
これはいつでも削除または変更される可能性があります。
評価目的でのみ使用してください。
[YouTrack](https://youtrack.jetbrains.com/issue/KT-47610) でのご意見をお待ちしております。

[Kotlin の suspending 関数を Objective-C および Swift から呼び出すサポートを 1.4.0 で追加しました](whatsnew14#support-for-kotlin-s-suspending-functions-in-swift-and-objective-c)。現在、新しい Swift 5.5 機能である [`async` および `await` 修飾子を使用した同時実行性](https://github.com/apple/swift-evolution/blob/main/proposals/0296-async-await)に対応するために、それを改善しています。

Kotlin/Native コンパイラーは、null 可能な戻り型を持つ suspending 関数に対して、生成された Objective-C ヘッダーに `_Nullable_result` 属性を出力するようになりました。
これにより、Swift から `async` 関数として適切な null 可能性で呼び出すことができます。

この機能は実験的なものであり、将来、Kotlin と Swift の両方の変更によって影響を受ける可能性があることに注意してください。
今のところ、特定の制限のあるこの機能のプレビューを提供しており、皆様のご意見をお待ちしております。
現在の状態の詳細については、[この YouTrack issue](https://youtrack.jetbrains.com/issue/KT-47610) を参照して、ご意見をお寄せください。

### オブジェクトおよびコンパニオンオブジェクトの Swift/Objective-C マッピングの改善

オブジェクトとコンパニオンオブジェクトの取得は、ネイティブ iOS 開発者にとってより直感的な方法で実行できるようになりました。
たとえば、Kotlin に次のオブジェクトがある場合:

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

Swift でアクセスするには、`shared` プロパティと `companion` プロパティを使用できます。

```swift
MyObject.shared
MyObject.shared.x
MyClass.companion
MyClass.Companion.shared
```

[Swift/Objective-C 相互運用性](native-objc-interop) の詳細をご覧ください。

### MinGW ターゲットのインポートライブラリなしの DLL に対するリンケージの非推奨

[LLD](https://lld.llvm.org/) は LLVM プロジェクトのリンカーであり、Kotlin/Native で MinGW ターゲットに使用を開始する予定です。これは、デフォルトの ld.bfd よりも優れているためです。主にパフォーマンスが向上します。

ただし、LLD の最新の安定バージョンは、MinGW (Windows) ターゲットの DLL に対する直接リンケージをサポートしていません。
このようなリンケージでは、[インポートライブラリ](https://stackoverflow.com/questions/3573475/how-does-the-import-library-work-details/3573527#3573527)を使用する必要があります。
これらは Kotlin/Native 1.5.30 では必要ありませんが、このような使用法は LLD と互換性がないことを通知する警告を追加します。LLD は将来 MinGW のデフォルトリンカーになります。

LLD リンカーへの移行に関するご意見やご懸念については、[この YouTrack issue](https://youtrack.jetbrains.com/issue/KT-47605) で共有してください。

## Kotlin Multiplatform

1.5.30 では、Kotlin Multiplatform に次の注目すべきアップデートが加えられています。
* [共有ネイティブコードでカスタム `cinterop` ライブラリを使用する機能](#ability-to-use-custom-cinterop-libraries-in-shared-native-code)
* [XCFrameworks のサポート](#support-for-xcframeworks)
* [Android アーティファクトの新しいデフォルト発行設定](#new-default-publishing-setup-for-android-artifacts)

### 共有ネイティブコードでカスタム cinterop ライブラリを使用する機能

Kotlin Multiplatform では、共有ソースセットでプラットフォーム固有の interop ライブラリを使用する[オプション](multiplatform-share-on-platforms#connect-platform-specific-libraries)が提供されています。
1.5.30 より前は、これは Kotlin/Native ディストリビューションに同梱されている[プラットフォームライブラリ](native-platform-libs)でのみ機能していました。
1.5.30 以降は、カスタム `cinterop` ライブラリで使用できます。
この機能を有効にするには、`gradle.properties` に `kotlin.mpp.enableCInteropCommonization=true` プロパティを追加します。

```none
kotlin.mpp.enableGranularSourceSetsMetadata=true
kotlin.native.enableDependencyPropagation=false
kotlin.mpp.enableCInteropCommonization=true
```

### XCFrameworks のサポート

すべての Kotlin Multiplatform プロジェクトで、出力形式として XCFrameworks を使用できるようになりました。
Apple は、ユニバーサル (fat) フレームワークの代替として XCFrameworks を導入しました。
XCFrameworks を使用すると、次のことが可能になります。
* すべてのターゲットプラットフォームとアーキテクチャのロジックを 1 つのバンドルにまとめることができます。
* アプリケーションを App Store に公開する前に、不要なアーキテクチャをすべて削除する必要はありません。

XCFrameworks は、Apple M1 のデバイスとシミュレーターで Kotlin フレームワークを使用する場合に役立ちます。

XCFrameworks を使用するには、`build.gradle(.kts)` スクリプトを更新します。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

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

</TabItem>
<TabItem value="groovy" label="Groovy" default>

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

</TabItem>
</Tabs>

XCFrameworks を宣言すると、これらの新しい Gradle タスクが登録されます。
* `assembleXCFramework`
* `assembleDebugXCFramework` (追加の debug アーティファクト ([dSYMs を含む](native-ios-symbolication)))
* `assembleReleaseXCFramework`

XCFrameworks の詳細については、[この WWDC ビデオ](https://developer.apple.com/videos/play/wwdc2019/416/)をご覧ください。

### Android アーティファクトの新しいデフォルト発行設定

`maven-publish` Gradle プラグインを使用すると、ビルドスクリプトで[Android バリアント](https://developer.android.com/studio/build/build-variants)名を指定することにより、[Android ターゲットのマルチプラットフォームライブラリを発行](multiplatform-publish-lib#publish-an-android-library)できます。
Kotlin Gradle プラグインは、パブリケーションを自動的に生成します。

1.5.30 より前は、生成されたパブリケーション[メタデータ](https://docs.gradle.org/current/userguide/publishing_gradle_module_metadata.html)には、発行されたすべての Android バリアントのビルドタイプ属性が含まれており、ライブラリコンシューマーが使用する同じビルドタイプとのみ互換性がありました。
Kotlin 1.5.30 では、新しいデフォルトの発行設定が導入されています。
* プロジェクトが発行するすべての Android バリアントが同じビルドタイプ属性を持っている場合、発行されたバリアントはビルドタイプ属性を持たず、任意のビルドタイプと互換性があります。
* 発行されたバリアントが異なるビルドタイプ属性を持っている場合、`release` 値を持つバリアントのみがビルドタイプ属性なしで発行されます。
これにより、リリースバリアントはコンシューマー側の任意のビルドタイプと互換性があり、非リリースバリアントは一致するコンシューマービルドタイプとのみ互換性があります。

オプトアウトしてすべてのバリアントのビルドタイプ属性を保持するには、この Gradle プロパティを設定します: `kotlin.android.buildTypeAttribute.keep=true`.

## Kotlin/JS

1.5.30 では、2 つの主要な改善が Kotlin/JS に加えられています。
* [JS IR コンパイラーバックエンドがベータに到達](#js-ir-compiler-backend-reaches-beta)
* [Kotlin/JS IR バックエンドを使用したアプリケーションのデバッグエクスペリエンスの向上](#better-debugging-experience-for-applications-with-the-kotlin-js-ir-backend)

### JS IR コンパイラーバックエンドがベータに到達

Kotlin/JS の[IR ベースのコンパイラーバックエンド](whatsnew14#unified-backends-and-extensibility)は、1.4.0 で [Alpha](components-stability) で導入されましたが、ベータに到達しました。

以前は、プロジェクトを新しいバックエンドに移行するのに役立つ[JS IR バックエンドの移行ガイド](js-ir-migration)を公開していました。
IntelliJ IDEA で必要な変更を直接表示する[Kotlin/JS Inspection Pack](https://plugins.jetbrains.com/plugin/17183-kotlin-js-inspection-pack/) IDE プラグインを紹介します。

### Kotlin/JS IR バックエンドを使用したアプリケーションのデバッグエクスペリエンスの向上

Kotlin 1.5.30 では、Kotlin/JS IR バックエンド用の JavaScript ソースマップ生成が導入されています。
これにより、IR バックエンドが有効になっている場合の Kotlin/JS デバッグエクスペリエンスが向上し、ブレークポイント、ステップ実行、適切なソース参照を含む読みやすいスタックトレースを含む完全なデバッグサポートが提供されます。

[ブラウザーまたは IntelliJ IDEA Ultimate で Kotlin/JS をデバッグ](js-debugging)する方法をご覧ください。

## Gradle

[Kotlin Gradle プラグインのユーザーエクスペリエンスを向上させる](https://youtrack.jetbrains.com/issue/KT-45778)という私たちの使命の一環として、次の機能を実装しました。
* [Java ツールチェーンのサポート](#support-for-java-toolchains)。これには、[古い Gradle バージョンの `UsesKotlinJavaToolchain` インターフェイスで JDK ホームを指定する機能](#ability-to-specify-jdk-home-with-useskotlinjavatoolchain-interface)が含まれます。
* [Kotlin デーモンの JVM 引数を明示的に指定する簡単な方法](#easier-way-to-explicitly-specify-kotlin-daemon-jvm-arguments)

### Java ツールチェーンのサポート

Gradle 6.7 では、["Java ツールチェーンのサポート"](https://docs.gradle.org/current/userguide/toolchains.html)機能が導入されました。
この機能を使用すると、次のことが可能になります。
* Gradle のものとは異なる JDK および JRE を使用して、コンパイル、テスト、および実行可能ファイルを実行します。
* 未リリースの言語バージョンでコードをコンパイルしてテストします。

ツールチェーンのサポートにより、Gradle はローカル JDK を自動検出し、ビルドに必要な Gradle が見つからない JDK をインストールできます。
これで、Gradle 自体が任意の JDK で実行でき、[ビルドキャッシュ機能](gradle-compilation-and-caches#gradle-build-cache-support)を再利用できます。

Kotlin Gradle プラグインは、Kotlin/JVM コンパイルタスクの Java ツールチェーンをサポートしています。
Java ツールチェーン:
* JVM ターゲットで使用できる [`jdkHome` オプション](gradle-compiler-options#attributes-specific-to-jvm)を設定します。
   [`jdkHome` オプションを直接設定する機能は非推奨になりました](https://youtrack.jetbrains.com/issue/KT-46541)。
  
  

* ユーザーが `jvmTarget` オプションを明示的に設定しなかった場合、[`kotlinOptions.jvmTarget`](gradle-compiler-options#attributes-specific-to-jvm) をツールチェーンの JDK バージョンに設定します。
  ツールチェーンが構成されていない場合、`jvmTarget` フィールドはデフォルト値を使用します。
  [関連するコンパイルタスクの JVM ターゲット互換性](gradle-configure-project#check-for-jvm-target-compatibility-of-related-compile-tasks)の詳細をご覧ください。

* どの JDK [`kapt` workers](kapt#run-kapt-tasks-in-parallel) が実行されているかに影響します。

次のコードを使用して、ツールチェーンを設定します。
プレースホルダー `<MAJOR_JDK_VERSION>` を、使用する JDK バージョンに置き換えます。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    jvmToolchain {
        (this as JavaToolchainSpec).languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) // "8"
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    jvmToolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) // "8"
    }
}
```

</TabItem>
</Tabs>

`kotlin` 拡張機能を介してツールチェーンを設定すると、Java コンパイルタスクのツールチェーンも更新されることに注意してください。

`java` 拡張機能を介してツールチェーンを設定でき、Kotlin コンパイルタスクはそれを使用します。

```kotlin
java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) // "8"
    }
}
```

`KotlinCompile` タ