[//]: # (title: Kotlin %kotlinEapVersion% の新機能)

_[リリース日: %kotlinEapReleaseDate%](eap.md#build-details)_

> このドキュメントは、Early Access Preview (EAP) リリースのすべての機能について説明するものではありませんが、
> 主要な改善点についてハイライトしています。
>
> 変更点の完全なリストは、[GitHub changelog](https://github.com/JetBrains/kotlin/releases/tag/v%kotlinEapVersion%) を参照してください。
>
{style="note"}

Kotlin %kotlinEapVersion% がリリースされました！
このEAPリリースの詳細を以下に示します。

*   [言語: コンテキストパラメータのプレビュー](#preview-of-context-parameters)
*   [Kotlinコンパイラ: コンパイラの警告の統一管理](#kotlin-compiler-unified-management-of-compiler-warnings)
*   [Kotlin/JVM: インターフェース関数のデフォルトメソッド生成の変更](#changes-to-default-method-generation-for-interface-functions)
*   [Gradle: KGP診断におけるProblems APIの統合](#integration-of-problems-api-within-kgp-diagnostics)
    および [KGPと`--warning-mode`の互換性](#kgp-compatibility-with-warning-mode)

## IDEサポート

Kotlin %kotlinEapVersion% をサポートするKotlinプラグインは、最新のIntelliJ IDEAおよびAndroid Studioにバンドルされています。
IDEのKotlinプラグインを更新する必要はありません。
必要なのは、ビルドスクリプトで[Kotlinのバージョンを %kotlinEapVersion% に変更する](configure-build-for-eap.md)ことだけです。

詳細については、[新しいリリースへの更新](releases.md#update-to-a-new-kotlin-version) を参照してください。

## 言語

このリリースでは、いくつかの言語機能が安定版として昇格され、コンテキストパラメータがプレビューとして導入されました。

### 安定版機能: ガード条件、非ローカルな`break`と`continue`、およびマルチダラー補間

Kotlin 2.1.0では、いくつかの新しい言語機能がプレビューで導入されました。
これらの言語機能がこのリリースで[安定版](components-stability.md#stability-levels-explained)になったことをお知らせいたします。

*   [サブジェクトを持つ`when`でのガード条件](whatsnew21.md#guard-conditions-in-when-with-a-subject)
*   [非ローカルな`break`と`continue`](whatsnew21.md#non-local-break-and-continue)
*   [マルチダラー補間: 文字列リテラルにおけるより改善された処理](whatsnew21.md#multi-dollar-string-interpolation)

[Kotlinの言語設計機能と提案の全リスト](kotlin-language-features-and-proposals.md) を参照してください。

### コンテキストパラメータのプレビュー

<primary-label ref="experimental-general"/>

このリリースでは、コンテキストパラメータがプレビューで導入されます。
コンテキストパラメータにより、関数やプロパティは、囲むコンテキストで暗黙的に利用可能な依存関係を宣言できます。

この機能は、以前の実験的機能であるコンテキストレシーバを置き換えるものです。コンテキストレシーバからコンテキストパラメータへの移行には、[ブログ投稿](https://blog.jetbrains.com/kotlin/2025/04/update-on-context-parameters/)で説明されているIntelliJ IDEAの支援サポートを使用できます。

#### コンテキストパラメータの宣言方法

プロパティと関数に対して、`context`キーワードの後に`name: Type`形式のパラメータリストを続けることで、コンテキストパラメータを宣言できます。以下は、`UserService`インターフェースへの依存関係を持つ例です。

```kotlin
// `UserService` defines the dependency required in context 
interface UserService {
    fun log(message: String)
    fun findUserById(id: Int): String
}

// Declares a function with a context parameter
context(users: UserService)
fun outputMessage(message: String) {
    // Uses `log` from the context
    users.log("Log: $message")
}

// Declares a property with a context parameter
context(users: UserService)
val firstUser: String
    // Uses `findUserById` from the context    
    get() = users.findUserById(1)
```

コンテキストパラメータ名として`_`を使用できます。この場合、パラメータの値は解決のために利用可能ですが、ブロック内で名前でアクセスすることはできません。

```kotlin
// Uses `_` as context parameter name
context(_: UserService)
fun logWelcome() {
    // Resolution still finds the appropriate `log` function from UserService
    outputMessage("Welcome!")
}
```

#### コンテキストパラメータの解決

Kotlinは、現在のスコープで一致するコンテキスト値を検索することで、呼び出しサイトでコンテキストパラメータを解決します。Kotlinは型によってそれらを照合します。
同じスコープレベルに複数の互換性のある値が存在する場合、コンパイラは曖昧さを報告します。

```kotlin
// `UserService` defines the dependency required in context
interface UserService {
    fun log(message: String)
}

// Declares a function with a context parameter
context(users: UserService)
fun outputMessage(message: String) {
    users.log("Log: $message")
}

fun main() {
    // Implements `UserService` 
    val serviceA = object : UserService {
        override fun log(message: String) = println("A: $message")
    }

    // Implements `UserService`
    val serviceB = object : UserService {
        override fun log(message: String) = println("B: $message")
    }

    // Both `serviceA` and `serviceB` match the expected `UserService` type at the call site
    context(serviceA, serviceB) {
        outputMessage("This will not compile")
        // Ambiguity error
    }
}
```

#### 制限事項

コンテキストパラメータは継続的に改善されています。現在の制限事項の一部は次のとおりです。

*   コンストラクタはコンテキストパラメータを宣言できません
*   コンテキストパラメータを持つプロパティはバッキングフィールドまたは初期化子を持つことができません
*   コンテキストパラメータを持つプロパティはデリゲーションを使用できません

しかし、Kotlinのコンテキストパラメータは、簡素化された依存性注入、改善されたDSL設計、およびスコープ付き操作を通じて依存関係を管理する上で重要な改善を表しています。詳細については、機能の[KEEP](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md)を参照してください。

#### コンテキストパラメータを有効にする方法

プロジェクトでコンテキストパラメータを有効にするには、コマンドラインで次のコンパイラオプションを使用します。

```Bash
-Xcontext-parameters
```

または、Gradleビルドファイルの`compilerOptions {}`ブロックに追加します。

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xcontext-parameters")
    }
}
```

> `-Xcontext-receivers`と`-Xcontext-parameters`の両方のコンパイラオプションを同時に指定すると、エラーが発生します。
>
{style="warning"}

#### フィードバックを送る

この機能は、将来のKotlinリリースで安定化され、改善される予定です。
Issueトラッカーの[YouTrack](https://youtrack.jetbrains.com/issue/KT-10468/Context-Parameters-expanding-extension-receivers-to-work-with-scopes)で皆様からのフィードバックをいただければ幸いです。

## Kotlinコンパイラ: コンパイラの警告の統一管理

<primary-label ref="experimental-general"/>

Kotlin %kotlinEapVersion% では、` -Xwarning-level` という新しいコンパイラオプションが導入されました。これは、Kotlinプロジェクトにおけるコンパイラの警告を統一的に管理するために設計されています。

以前は、`-nowarn`ですべての警告を無効にしたり、`-Werror`ですべての警告をコンパイルエラーにしたり、`-Wextra`で追加のコンパイラチェックを有効にしたりするなど、一般的なモジュール全体のルールしか適用できませんでした。特定の警告に対してそれらを調整する唯一のオプションは、`-Xsuppress-warning`オプションでした。

この新しいソリューションにより、一般的なルールをオーバーライドし、特定の診断を一貫した方法で除外できます。

### 適用方法

新しいコンパイラオプションには、次の構文があります。

```bash
-Xwarning-level=DIAGNOSTIC_NAME:(error|warning|disabled)
```

*   `error`: 指定された警告をエラーに昇格させます。
*   `warning`: 警告を出力し、デフォルトで有効です。
*   `disabled`: 指定された警告をモジュール全体で完全に抑制します。

新しいコンパイラオプションでは、_警告_ の深刻度レベルのみを設定できることに注意してください。

### ユースケース

新しいソリューションを使用すると、一般的なルールと特定のルールを組み合わせることで、プロジェクトにおける警告レポートをより細かく調整できます。ユースケースを選択してください。

#### 警告の抑制

| コマンド                                           | 説明                                                                                                             |
|:---------------------------------------------------|:-------------------------------------------------------------------------------------------------------------------------|
| [`-nowarn`](compiler-reference.md#nowarn)         | コンパイル中のすべての警告を抑制します。                                                                             |
| `-Xwarning-level=DIAGNOSTIC_NAME:disabled`        | 指定された警告のみを抑制します。[`-Xsuppress-warning`](compiler-reference.md#xsuppress-warning) と同じように機能します。 |
| `-nowarn -Xwarning-level=DIAGNOSTIC_NAME:warning` | 指定された警告を除き、すべての警告を抑制します。                                                                  |

#### 警告をエラーに昇格

| コマンド                                           | 説明                                                  |
|:---------------------------------------------------|:--------------------------------------------------------------|
| [`-Werror`](compiler-reference.md#werror)         | すべての警告をコンパイルエラーに昇格させます。                   |
| `-Xwarning-level=DIAGNOSTIC_NAME:error`           | 指定された警告のみをエラーに昇格させます。                    |
| `-Werror -Xwarning-level=DIAGNOSTIC_NAME:warning` | 指定された警告を除き、すべての警告をエラーに昇格させます。 |

#### 追加のコンパイラ警告の有効化

| コマンド                                            | 説明                                                                                          |
|:---------------------------------------------------|:------------------------------------------------------------------------------------------------------|
| [`-Wextra`](compiler-reference.md#wextra)          | すべての追加の宣言、式、型コンパイラチェックを有効にし、trueの場合に警告を出力します。 |
| `-Xwarning-level=DIAGNOSTIC_NAME:warning`          | 指定された追加のコンパイラチェックのみを有効にします。                                                   |
| `-Wextra -Xwarning-level=DIAGNOSTIC_NAME:disabled` | 指定されたものを除き、すべての追加チェックを有効にします。                                         |

#### 警告リスト

一般的なルールから除外したい警告が多数ある場合は、[`@argfile`](compiler-reference.md#argfile) を介して別のファイルにリストできます。

### フィードバックを残す

新しいコンパイラオプションはまだ[実験的](components-stability.md#stability-levels-explained)です。問題があれば、Issueトラッカーの[YouTrack](https://kotl.in/issue)に報告してください。

## Kotlin/JVM

### インターフェース関数のデフォルトメソッド生成の変更

Kotlin %kotlinEapVersion% 以降、インターフェースで宣言された関数は、特に設定されていない限り、JVMのデフォルトメソッドとしてコンパイルされます。
この変更は、Kotlinのインターフェース関数が実装とともにバイトコードにコンパイルされる方法に影響します。
この動作は、非推奨の`-Xjvm-default`オプションに代わる新しい安定版コンパイラオプション`-jvm-default`によって制御されます。

`-jvm-default`オプションの動作は、次の値を使用して制御できます。

*   `enable` (デフォルト): インターフェースにデフォルトの実装を生成し、サブクラスと`DefaultImpls`クラスにブリッジ関数を含めます。このモードは、以前のKotlinバージョンとのバイナリ互換性を維持するために使用します。
*   `no-compatibility`: インターフェースにデフォルトの実装のみを生成します。このモードは互換性ブリッジと`DefaultImpls`クラスをスキップするため、新しいコードに適しています。
*   `disable`: インターフェースでのデフォルトの実装を無効にします。ブリッジ関数と`DefaultImpls`クラスのみが生成され、Kotlin %kotlinEapVersion% 以前の動作と一致します。

`-jvm-default`コンパイラオプションを設定するには、Gradle Kotlin DSLで`jvmDefault`プロパティを設定します。

```kotlin
kotlin {
  compilerOptions {
    jvmDefault = JvmDefaultMode.NO_COMPATIBILITY
  }
}
```

### Kotlinメタデータにおけるアノテーションの読み書きのサポート

<primary-label ref="experimental-general"/>

以前は、コンパイルされたJVMクラスファイルからリフレクションまたはバイトコード分析を使用してアノテーションを読み取り、シグネチャに基づいてメタデータエントリに手動で一致させる必要がありました。
このプロセスは、特にオーバーロードされた関数ではエラーが発生しやすかったのです。

現在、Kotlin %kotlinEapVersion% では、[Kotlin Metadata JVMライブラリ](metadata-jvm.md) がKotlinメタデータに格納されているアノテーションの読み取りをサポートするようになりました。

コンパイル済みファイルでメタデータ内のアノテーションを利用可能にするには、次のコンパイラオプションを追加します。

```kotlin
-Xannotations-in-metadata
```

または、Gradleビルドファイルの`compilerOptions {}`ブロックに追加します。

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotations-in-metadata")
    }
}
```

このオプションを有効にすると、KotlinコンパイラはアノテーションをJVMバイトコードとともにメタデータに書き込み、`kotlin-metadata-jvm`ライブラリからアクセスできるようにします。

このライブラリは、アノテーションにアクセスするための次のAPIを提供します。

*   `KmClass.annotations`
*   `KmFunction.annotations`
*   `KmProperty.annotations`
*   `KmConstructor.annotations`
*   `KmPropertyAccessorAttributes.annotations`
*   `KmValueParameter.annotations`
*   `KmFunction.extensionReceiverAnnotations`
*   `KmProperty.extensionReceiverAnnotations`
*   `KmProperty.backingFieldAnnotations`
*   `KmProperty.delegateFieldAnnotations`
*   `KmEnumEntry.annotations`

これらのAPIは[実験的](components-stability.md#stability-levels-explained)です。
オプトインするには、`@OptIn(ExperimentalAnnotationsInMetadata::class)`アノテーションを使用します。

Kotlinメタデータからアノテーションを読み取る例を次に示します。

```kotlin
@file:OptIn(ExperimentalAnnotationsInMetadata::class)

import kotlin.metadata.ExperimentalAnnotationsInMetadata
import kotlin.metadata.jvm.KotlinClassMetadata

annotation class Label(val value: String)

@Label("Message class")
class Message

fun main() {
    val metadata = Message::class.java.getAnnotation(Metadata::class.java)
    val kmClass = (KotlinClassMetadata.readStrict(metadata) as KotlinClassMetadata.Class).kmClass
    println(kmClass.annotations)
    // [@Label(value = StringValue("Message class"))]
}
```

> プロジェクトで`kotlin-metadata-jvm`ライブラリを使用している場合は、コードをテストしてアノテーションをサポートするように更新することをお勧めします。
> そうしないと、将来のKotlinバージョンでメタデータ内のアノテーションが[デフォルトで有効](https://youtrack.jetbrains.com/issue/KT-75736)になったときに、プロジェクトが無効または不完全なメタデータを生成する可能性があります。
>
> 問題が発生した場合は、[Issueトラッカー](https://youtrack.jetbrains.com/issue/KT-31857) に報告してください。
>
{style="warning"}

## Kotlin/Native

### オブジェクトごとのメモリ割り当て

<primary-label ref="experimental-opt-in"/>

Kotlin/Nativeの[メモリ割り当て機能](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md)が、オブジェクトごとにメモリを予約できるようになりました。場合によっては、厳密なメモリ制限やアプリケーション起動時の高いメモリ消費を回避するのに役立ちます。

この新機能は、デフォルトのアロケータの代わりにシステムメモリ割り当て機能を有効にする`-Xallocator=std`コンパイラオプションを置き換えるように設計されています。これで、メモリ割り当て機能を切り替えることなく、バッファリング（割り当てのページング）を無効にできます。

この機能は現在[実験的](components-stability.md#stability-levels-explained)です。
これを有効にするには、`gradle.properties`ファイルで次のオプションを設定します。

```none
kotlin.native.binary.pagedAllocator=false
```

問題が発生した場合は、Issueトラッカーの[YouTrack](https://kotl.in/issue)に報告してください。

### LLVM 16から19へのアップデート

Kotlin %kotlinEapVersion% では、LLVMがバージョン16から19に更新されました。
新バージョンには、パフォーマンスの向上、バグ修正、セキュリティアップデートが含まれています。

このアップデートはコードに影響を与えないはずですが、何か問題が発生した場合は、[Issueトラッカー](http://kotl.in/issue) に報告してください。

## Kotlin/Wasm: wasmJsターゲットがjsターゲットから分離

以前は、`wasmJs`ターゲットは`js`ターゲットと同じインフラストラクチャを共有していました。その結果、両方のターゲットは同じディレクトリ (`build/js`) にホストされ、同じNPMタスクと構成を使用していました。

現在、`wasmJs`ターゲットは`js`ターゲットとは別の独自のインフラストラクチャを持っています。これにより、
Wasmのタスクと型がJavaScriptのものと区別され、独立した構成が可能になります。

さらに、Wasm関連のプロジェクトファイルとNPM依存関係は、`build/wasm`という別のディレクトリに配置されるようになりました。

新しいNPM関連タスクがWasm用に導入され、既存のJavaScriptタスクはJavaScript専用になりました。

| **Wasmタスク**         | **JavaScriptタスク** |
|:-----------------------|:---------------------|
| `kotlinWasmNpmInstall` | `kotlinNpmInstall`   |
| `wasmRootPackageJson`  | `rootPackageJson`    |

同様に、新しいWasm固有の宣言が導入されました。

| **Wasm宣言**     | **JavaScript宣言** |
|:-------------------|:-------------------|
| `WasmNodeJsRootPlugin`    | `NodeJsRootPlugin`          |
| `WasmNodeJsPlugin`        | `NodeJsPlugin`              |
| `WasmYarnPlugin`          | `YarnPlugin`                |
| `WasmNodeJsRootExtension` | `NodeJsRootExtension`       |
| `WasmNodeJsEnvSpec`       | `NodeJsEnvSpec`             |
| `WasmYarnRootEnvSpec`     | `YarnRootEnvSpec`           |

これにより、JavaScriptターゲットとは独立してWasmターゲットを操作できるようになり、構成が簡素化されます。

この変更はデフォルトで有効になっており、追加の構成は必要ありません。

## Kotlin/JS

### `@JsPlainObject`インターフェースにおける`copy()`の修正

Kotlin/JSには`js-plain-objects`という実験的なプラグインがあり、`@JsPlainObject`アノテーションが付けられたインターフェースに`copy()`関数を導入しました。
`copy()`関数はオブジェクトを操作するために使用できます。

しかし、`copy()`の初期の実装は継承と互換性がなく、
`@JsPlainObject`インターフェースが他のインターフェースを拡張する際に問題を引き起こしていました。

プレーンオブジェクトの制限を回避するため、`copy()`関数はオブジェクト自体からそのコンパニオンオブジェクトに移動されました。

```kotlin
@JsPlainObject
external interface User {
    val name: String
    val age: Int
}

fun main() {
    val user = User(name = "SomeUser", age = 21)
    // This syntax is not valid anymore
    val copy = user.copy(age = 35)      
    // This is the correct syntax
    val copy = User.copy(user, age = 35)
}
```

この変更により、継承階層での競合が解決され、曖昧さが解消されます。
Kotlin %kotlinEapVersion% からデフォルトで有効になっています。

### `@JsModule`アノテーションを持つファイルにおけるtypealiasのサポート

以前は、JavaScriptモジュールから宣言をインポートするために`@JsModule`アノテーションが付けられたファイルは、外部宣言のみに制限されていました。つまり、そのようなファイルでは`typealias`を宣言できませんでした。

Kotlin %kotlinEapVersion% 以降、`@JsModule`とマークされたファイル内でtypealiasを宣言できます。

```kotlin
@file:JsModule("somepackage")
package somepackage
typealias SomeClass = Any
```

この変更により、Kotlin/JSの相互運用性の制限が緩和され、今後のリリースでさらに改善が計画されています。

`@JsModule`を持つファイルにおけるtypealiasのサポートはデフォルトで有効になっています。

## Gradle

Kotlin %kotlinEapVersion% はGradle 7.6.3から8.14まで完全に互換性があります。最新のGradleバージョンも使用できます。ただし、その場合は非推奨の警告が発生したり、一部の新しいGradle機能が動作しない可能性があることに注意してください。

### Kotlin Gradleプラグインのコンソールでのリッチ出力のサポート

Kotlin %kotlinEapVersion% では、Gradleビルドプロセス中のコンソールでの色やその他のリッチ出力をサポートし、報告される診断を読みやすく、理解しやすくしました。
リッチ出力は、LinuxおよびmacOSでサポートされているターミナルエミュレータで利用できます。Windowsのサポートも現在開発中です。

![Gradle console](gradle-console-rich-output.png){width=600}

この機能はデフォルトで有効になっていますが、オーバーライドしたい場合は、次のGradleプロパティを`gradle.properties`ファイルに追加してください。

```
org.gradle.console=plain
```

このプロパティとそのオプションの詳細については、Gradleのドキュメントの[ログ形式のカスタマイズ](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:command_line_customizing_log_format)を参照してください。

### KGP診断におけるProblems APIの統合

以前は、Kotlin Gradleプラグイン（KGP）は、警告やエラーなどの診断を、コンソールまたはログへのプレーンテキスト出力としてのみ報告していました。

%kotlinEapVersion% から、KGPは追加のレポートメカニズムを導入しました。ビルドプロセス中に豊富で構造化された問題情報を報告するための標準化された方法である[GradleのProblems API](https://docs.gradle.org/current/kotlin-dsl/gradle/org.gradle.api.problems/index.html)を使用するようになりました。

KGP診断は、Gradle CLIやIntelliJ IDEAなど、さまざまなインターフェースで読みやすく、より一貫して表示されるようになりました。

この統合は、Gradle 8.6以降からデフォルトで有効になっています。
APIはまだ進化中であるため、最新の改善の恩恵を受けるには、最新のGradleバージョンを使用してください。

### KGPと`--warning-mode`の互換性

Kotlin Gradleプラグイン（KGP）の診断は、固定された深刻度レベルを使用して問題を報告していたため、Gradleの[`--warning-mode`コマンドラインオプション](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:command_line_warnings)は、KGPがエラーを表示する方法に影響を与えませんでした。

現在、KGP診断は`--warning-mode`オプションと互換性があり、より高い柔軟性を提供します。たとえば、
すべての警告をエラーに変換したり、警告を完全に無効にしたりできます。

この変更により、KGP診断は選択された警告モードに基づいて出力を調整します。

*   `--warning-mode=fail`を設定すると、`Severity.Warning`の診断は`Severity.Error`に昇格されます。
*   `--warning-mode=none`を設定すると、`Severity.Warning`の診断はログに記録されません。

この動作はKotlin %kotlinEapVersion% 以降、デフォルトで有効になっています。

`--warning-mode`オプションを無視するには、Gradleプロパティで`kotlin.internal.diagnostics.ignoreWarningMode=true`を設定します。

## Kotlin標準ライブラリ: Base64およびHexFormat APIの安定版

Kotlin %kotlinEapVersion% では、[`Base64` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/) および [`HexFormat` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/-hex-format/) が[安定版](components-stability.md#stability-levels-explained)になりました。

### Base64エンコーディングとデコーディング

Kotlin 1.8.20で[Base64エンコーディングとデコーディングの実験的サポート](whatsnew1820.md#support-for-base64-encoding)が導入されました。
Kotlin %kotlinEapVersion% では、[Base64 API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/) が安定版になり、
このリリースで追加された新しい`Base64.Pem`を含む4つのエンコーディングスキームが含まれています。

*   [`Base64.Default`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/-default/) は、標準の[Base64エンコーディングスキーム](https://www.rfc-editor.org/rfc/rfc4648#section-4)を使用します。

    > `Base64.Default`は`Base64`クラスのコンパニオンオブジェクトです。
    > その結果、`Base64.Default.encode()`や`Base64.Default.decode()`の代わりに、`Base64.encode()`や`Base64.decode()`でその関数を呼び出すことができます。
    >
    {style="tip"}

*   [`Base64.UrlSafe`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/-default/-url-safe.html) は、「[URLおよびファイル名に安全な](https://www.rfc-editor.org/rfc/rfc4648#section-5)」エンコーディングスキームを使用します。
*   [`Base64.Mime`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/-default/-mime.html) は[MIME](https://www.rfc-editor.org/rfc/rfc2045#section-6.8)エンコーディングスキームを使用し、エンコーディング時に76文字ごとに改行記号を挿入し、デコーディング時に不正な文字をスキップします。
*   `Base64.Pem`は`Base64.Mime`のようにデータをエンコードしますが、行の長さを64文字に制限します。

Base64 APIを使用して、バイナリデータをBase64文字列にエンコードしたり、バイトにデコードし直したりできます。

例を次に示します。

```kotlin
val foBytes = "fo".map { it.code.toByte() }.toByteArray()
Base64.Default.encode(foBytes) // "Zm8="
// Alternatively:
// Base64.encode(foBytes)

val foobarBytes = "foobar".map { it.code.toByte() }.toByteArray()
Base64.UrlSafe.encode(foobarBytes) // "Zm9vYmFy"

Base64.Default.decode("Zm8=") // foBytes
// Alternatively:
// Base64.decode("Zm8=")

Base64.UrlSafe.decode("Zm9vYmFy") // foobarBytes
```

JVMでは、入力ストリームと出力ストリームでBase64をエンコードおよびデコードするために、`.encodingWith()`および`.decodingWith()`拡張関数を使用します。

```kotlin
import kotlin.io.encoding.*
import java.io.ByteArrayOutputStream

fun main() {
    val output = ByteArrayOutputStream()
    val base64Output = output.encodingWith(Base64.Default)

    base64Output.use { stream ->
        stream.write("Hello World!!".encodeToByteArray())
    }

    println(output.toString())
    // SGVsbG8gV29ybGQhIQ==
}
```

### HexFormat APIによる16進数のパースとフォーマット

[Kotlin 1.9.0で導入された](whatsnew19.md#new-hexformat-class-to-format-and-parse-hexadecimals)[`HexFormat` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/-hex-format/)が[安定版](components-stability.md#stability-levels-explained)になりました。
これを使用して、数値と16進数文字列の間で変換できます。

例：

```kotlin
fun main() {
    //sampleStart
    println(93.toHexString())
    //sampleEnd
}
```
{kotlin-runnable="true"}

詳細については、[新しいHexFormatクラスによる16進数のフォーマットとパース](whatsnew19.md#new-hexformat-class-to-format-and-parse-hexadecimals) を参照してください。