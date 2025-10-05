[//]: # (title: Kotlin 2.2.0の新機能)

_[リリース日: 2025年6月23日](releases.md#release-details)_

Kotlin 2.2.0がリリースされました！主なハイライトは以下の通りです。

*   **言語**: [コンテキストパラメータ](#preview-of-context-parameters)など、プレビュー段階の新言語機能が追加されました。ガード条件、非ローカルな`break`と`continue`、複数ドル記号による文字列補間など、[以前実験的だった機能のいくつかは安定版になりました](#stable-features-guard-conditions-non-local-break-and-continue-and-multi-dollar-interpolation)。
*   **Kotlinコンパイラ**: [コンパイラの警告の一元管理](#kotlin-compiler-unified-management-of-compiler-warnings)。
*   **Kotlin/JVM**: [インターフェース関数のデフォルトメソッド生成の変更点](#changes-to-default-method-generation-for-interface-functions)。
*   **Kotlin/Native**: [LLVM 19とメモリ消費量の追跡および調整のための新機能](#kotlin-native)。
*   **Kotlin/Wasm**: [Wasmターゲットの分離](#build-infrastructure-for-wasm-target-separated-from-javascript-target)と[プロジェクトごとのBinaryen設定機能](#per-project-binaryen-configuration)。
*   **Kotlin/JS**: [`@JsPlainObject`インターフェース用に生成される`copy()`メソッドの修正](#fix-for-copy-in-jsplainobject-interfaces)。
*   **Gradle**: [Kotlin Gradleプラグインにバイナリ互換性検証が組み込まれました](#binary-compatibility-validation-included-in-kotlin-gradle-plugin)。
*   **標準ライブラリ**: [Base64およびHexFormat APIの安定化](#stable-base64-encoding-and-decoding)。
*   **ドキュメント**: [ドキュメントに関するアンケートを開始しました](https://surveys.jetbrains.com/s3/Kotlin-Docs-2025)。また、[Kotlinドキュメントに大幅な改善が行われました](#documentation-updates)。

Kotlin Language Evolutionチームが新機能について議論し、質問に答えるこのビデオもご覧ください。

<video src="https://www.youtube.com/watch?v=jne3923lWtw" title="Kotlin 2.2.0の新機能"/>

## IDEサポート

2.2.0をサポートするKotlinプラグインは、IntelliJ IDEAおよびAndroid Studioの最新バージョンに同梱されています。
IDEのKotlinプラグインを更新する必要はありません。
必要なのは、ビルドスクリプトで[Kotlinのバージョンを2.2.0に変更する](configure-build-for-eap.md#adjust-the-kotlin-version)だけです。

詳細は[新しいリリースへのアップデート](releases.md#update-to-a-new-kotlin-version)を参照してください。

## 言語

このリリースでは、ガード条件、非ローカルな`break`と`continue`、複数ドル記号による文字列補間が[安定版](#stable-features-guard-conditions-non-local-break-and-continue-and-multi-dollar-interpolation)に昇格しました。
さらに、[コンテキストパラメータ](#preview-of-context-parameters)や[コンテキスト依存の解決](#preview-of-context-sensitive-resolution)などのいくつかの機能がプレビューとして導入されました。

### コンテキストパラメータのプレビュー
<primary-label ref="experimental-general"/> 

コンテキストパラメータを使用すると、関数とプロパティは、周囲のコンテキストで暗黙的に利用可能な依存関係を宣言できます。

コンテキストパラメータを使用すると、サービスや依存関係など、共有され、関数呼び出しのセット間でめったに変更されない値を手動で渡す必要がなくなります。

コンテキストパラメータは、コンテキストレシーバと呼ばれる以前の実験的な機能を置き換えます。コンテキストレシーバからコンテキストパラメータに移行するには、[ブログ記事](https://blog.jetbrains.com/kotlin/2025/04/update-on-context-parameters/)で説明されているように、IntelliJ IDEAの支援機能を使用できます。

主な違いは、コンテキストパラメータが関数の本体にレシーバとして導入されない点です。結果として、コンテキストが暗黙的に利用可能だったコンテキストレシーバとは異なり、コンテキストパラメータの名前を使用してそのメンバーにアクセスする必要があります。

Kotlinのコンテキストパラメータは、簡素化された依存性注入、改善されたDSL設計、およびスコープ付き操作を通じて、依存関係の管理において大幅な改善をもたらします。詳細については、この機能の[KEEP](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md)を参照してください。

#### コンテキストパラメータの宣言方法

`context`キーワードの後に`name: Type`の形式のパラメータのリストを続けることで、プロパティや関数にコンテキストパラメータを宣言できます。以下は、`UserService`インターフェースへの依存関係を持つ例です。

```kotlin
// UserServiceはコンテキストで必要な依存関係を定義します 
interface UserService {
    fun log(message: String)
    fun findUserById(id: Int): String
}

// コンテキストパラメータを持つ関数を宣言します
context(users: UserService)
fun outputMessage(message: String) {
    // コンテキストからlogを使用します
    users.log("Log: $message")
}

// コンテキストパラメータを持つプロパティを宣言します
context(users: UserService)
val firstUser: String
    // コンテキストからfindUserByIdを使用します    
    get() = users.findUserById(1)
```

コンテキストパラメータ名として`_`を使用できます。この場合、パラメータの値は解決に利用できますが、ブロック内で名前によってアクセスすることはできません。

```kotlin
// コンテキストパラメータ名として"_"を使用
context(_: UserService)
fun logWelcome() {
    // UserServiceから適切なlog関数を見つけます
    outputMessage("Welcome!")
}
```

#### コンテキストパラメータを有効にする方法

プロジェクトでコンテキストパラメータを有効にするには、コマンドラインで以下のコンパイラオプションを使用します。

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

> `-Xcontext-receivers`と`-Xcontext-parameters`の両方のコンパイラオプションを同時に指定するとエラーになります。
>
{style="warning"}

#### フィードバックにご協力ください

この機能は、今後のKotlinリリースで安定化され、改善される予定です。
課題トラッカー[YouTrack](https://youtrack.jetbrains.com/issue/KT-10468/Context-Parameters-expanding-extension-receivers-to-work-with-scopes)へのフィードバックをお待ちしております。

### コンテキスト依存の解決のプレビュー
<primary-label ref="experimental-general"/> 

Kotlin 2.2.0は、コンテキスト依存の解決のプレビュー版実装を導入します。

以前は、型がコンテキストから推論できる場合でも、enumエントリまたはsealedクラスのメンバーの完全な名前を記述する必要がありました。
例:

```kotlin
enum class Problem {
    CONNECTION, AUTHENTICATION, DATABASE, UNKNOWN
}

fun message(problem: Problem): String = when (problem) {
    Problem.CONNECTION -> "connection"
    Problem.AUTHENTICATION -> "authentication"
    Problem.DATABASE -> "database"
    Problem.UNKNOWN -> "unknown"
}
```

現在、コンテキスト依存の解決により、期待される型が既知であるコンテキストでは、型名を省略できます。

```kotlin
enum class Problem {
    CONNECTION, AUTHENTICATION, DATABASE, UNKNOWN
}

// 問題の既知の型に基づいてenumエントリを解決します
fun message(problem: Problem): String = when (problem) {
    CONNECTION -> "connection"
    AUTHENTICATION -> "authentication"
    DATABASE -> "database"
    UNKNOWN -> "unknown"
}
```

コンパイラは、このコンテキストの型情報を使用して、正しいメンバーを解決します。この情報には、とりわけ以下が含まれます。

*   `when`式の対象
*   明示的な戻り値の型
*   宣言された変数型
*   型チェック (`is`) およびキャスト (`as`)
*   sealedクラス階層の既知の型
*   パラメータの宣言された型

> コンテキスト依存の解決は、関数、パラメータを持つプロパティ、またはレシーバを持つ拡張プロパティには適用されません。
>
{style="note"}

プロジェクトでコンテキスト依存の解決を試すには、コマンドラインで以下のコンパイラオプションを使用します。

```bash
-Xcontext-sensitive-resolution
```

または、Gradleビルドファイルの`compilerOptions {}`ブロックに追加します。

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xcontext-sensitive-resolution")
    }
}
```

私たちは、今後のKotlinリリースでこの機能を安定化させ、改善していく予定です。課題トラッカー[YouTrack](https://youtrack.jetbrains.com/issue/KT-16768/Context-sensitive-resolution)へのフィードバックをお待ちしております。

### アノテーション使用サイトターゲット機能のプレビュー
<primary-label ref="experimental-general"/>

Kotlin 2.2.0は、アノテーションの使用サイトターゲットとの連携をより便利にするいくつかの機能を導入します。

#### プロパティの`@all`メタターゲット
<primary-label ref="experimental-general"/>

Kotlinでは、[使用サイトターゲット](annotations.md#annotation-use-site-targets)として知られる、宣言の特定の箇所にアノテーションを付加できます。
しかし、各ターゲットに個別にアノテーションを付けるのは複雑でエラーが発生しやすいものでした。

```kotlin
data class User(
    val username: String,

    @param:Email      // コンストラクタパラメータ
    @field:Email      // バッキングフィールド
    @get:Email        // ゲッターメソッド
    @property:Email   // Kotlinプロパティ参照
    val email: String,
) {
    @field:Email
    @get:Email
    @property:Email
    val secondaryEmail: String? = null
}
```

これを簡素化するために、Kotlinはプロパティ用の新しい`@all`メタターゲットを導入します。
この機能は、コンパイラに、プロパティの関連するすべての箇所にアノテーションを適用するように指示します。`@all`を使用すると、アノテーションは以下に適用しようとします。

*   **`param`**: プライマリコンストラクタで宣言されている場合、コンストラクタパラメータ。

*   **`property`**: Kotlinプロパティ自体。

*   **`field`**: 存在する場合、バッキングフィールド。

*   **`get`**: ゲッターメソッド。

*   **`set_param`**: プロパティが`var`として定義されている場合、セッターメソッドのパラメータ。

*   **`RECORD_COMPONENT`**: クラスが`@JvmRecord`である場合、アノテーションは[Javaレコードコンポーネント](#improved-support-for-annotating-jvm-records)に適用されます。この動作は、Javaがレコードコンポーネントのアノテーションを処理する方法を模倣しています。

コンパイラは、指定されたプロパティのターゲットにのみアノテーションを適用します。

以下の例では、`@Email`アノテーションは各プロパティの関連するすべてのターゲットに適用されます。

```kotlin
data class User(
    val username: String,

    // @Emailをparam、property、field、
    // get、set_param（varの場合）に適用します
    @all:Email val email: String,
) {
    // @Emailをproperty、field、およびgetterに適用します 
    // （コンストラクタにはないためparamなし）
    @all:Email val secondaryEmail: String? = null
}
```

プライマリコンストラクタの内外を問わず、任意のプロパティで`@all`メタターゲットを使用できます。ただし、[複数のアノテーション](https://kotlinlang.org/spec/syntax-and-grammar.html#grammar-rule-annotation)で`@all`メタターゲットを使用することはできません。

この新機能は、構文を簡素化し、一貫性を確保し、Javaレコードとの相互運用性を向上させます。

プロジェクトで`@all`メタターゲットを有効にするには、コマンドラインで以下のコンパイラオプションを使用します。

```Bash
-Xannotation-target-all
```

または、Gradleビルドファイルの`compilerOptions {}`ブロックに追加します。

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotation-target-all")
    }
}
```

この機能はプレビュー段階です。問題が発生した場合は、課題トラッカー[YouTrack](https://kotl.in/issue)までご報告ください。
`@all`メタターゲットの詳細については、この[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-target-in-properties.md)提案を参照してください。

#### 使用サイトアノテーションターゲットの新しいデフォルトルール
<primary-label ref="experimental-general"/>

Kotlin 2.2.0は、パラメータ、フィールド、プロパティにアノテーションを伝播するための新しいデフォルトルールを導入します。
以前はアノテーションがデフォルトで`param`、`property`、`field`のいずれか1つにのみ適用されていましたが、現在はアノテーションに期待されるものとより一致するようになりました。

複数の適用可能なターゲットがある場合、以下のように1つ以上が選択されます。

*   コンストラクタパラメータターゲット (`param`) が適用可能な場合、それが使用されます。
*   プロパティターゲット (`property`) が適用可能な場合、それが使用されます。
*   フィールドターゲット (`field`) が適用可能で`property`が適用可能でない場合、`field`が使用されます。

複数のターゲットがあり、`param`、`property`、`field`のいずれも適用できない場合、アノテーションはエラーになります。

この機能を有効にするには、Gradleビルドファイルの`compilerOptions {}`ブロックに追加します。

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotation-default-target=param-property")
    }
}
```

または、コンパイラのコマンドライン引数を使用します。

```Bash
-Xannotation-default-target=param-property
```

古い動作を使用したい場合は、次のことができます。

*   特定のケースでは、例えば`@Annotation`の代わりに`@param:Annotation`を使用するなど、必要なターゲットを明示的に定義します。
*   プロジェクト全体では、Gradleビルドファイルでこのフラグを使用します。

    ```kotlin
    // build.gradle.kts
    kotlin {
        compilerOptions {
            freeCompilerArgs.add("-Xannotation-default-target=first-only")
        }
    }
    ```

この機能はプレビュー段階です。問題が発生した場合は、課題トラッカー[YouTrack](https://kotl.in/issue)までご報告ください。
アノテーション使用サイトターゲットの新しいデフォルトルールの詳細については、この[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-target-in-properties.md)提案を参照してください。

### ネストされた型エイリアスのサポート
<primary-label ref="beta"/>

以前は、[型エイリアス](type-aliases.md)はKotlinファイルのトップレベルでのみ宣言できました。これは、内部またはドメイン固有の型エイリアスでさえ、使用されるクラスの外に存在する必要があることを意味していました。

2.2.0以降、外側のクラスから型パラメータをキャプチャしない限り、他の宣言内で型エイリアスを定義できます。

```kotlin
class Dijkstra {
    typealias VisitedNodes = Set<Node>

    private fun step(visited: VisitedNodes, ...) = ...
}
```

ネストされた型エイリアスには、型パラメータを参照できないなど、いくつかの追加の制約があります。全ルールセットについては[ドキュメント](type-aliases.md#nested-type-aliases)を参照してください。

ネストされた型エイリアスは、カプセル化の向上、パッケージレベルの煩雑さの軽減、内部実装の簡素化により、よりクリーンで保守しやすいコードを可能にします。

#### ネストされた型エイリアスを有効にする方法

プロジェクトでネストされた型エイリアスを有効にするには、コマンドラインで以下のコンパイラオプションを使用します。

```bash
-Xnested-type-aliases
```

または、Gradleビルドファイルの`compilerOptions {}`ブロックに追加します。

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xnested-type-aliases")
    }
}
```

#### フィードバックを共有する

ネストされた型エイリアスは現在[ベータ版](components-stability.md#stability-levels-explained)です。問題が発生した場合は、課題トラッカー[YouTrack](https://kotl.in/issue)までご報告ください。この機能の詳細については、この[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/nested-typealias.md)提案を参照してください。

### 安定版機能: ガード条件、非ローカルな`break`と`continue`、および複数ドル記号による文字列補間

Kotlin 2.1.0では、いくつかの新言語機能がプレビュー段階で導入されました。
このリリースで以下の言語機能が[安定版](components-stability.md#stability-levels-explained)になったことをお知らせします。

*   [when`におけるガード条件（対象あり）](control-flow.md#guard-conditions-in-when-expressions)
*   [非ローカルな`break`と`continue`](inline-functions.md#break-and-continue)
*   [複数ドル記号による文字列補間: 文字列リテラルにおける処理の改善](strings.md#multi-dollar-string-interpolation)

[Kotlinの言語設計機能と提案の全リストを参照してください](kotlin-language-features-and-proposals.md)。

## Kotlinコンパイラ: コンパイラの警告の一元管理
<primary-label ref="experimental-general"/>

Kotlin 2.2.0は、新しいコンパイラオプション`-Xwarning-level`を導入します。これは、Kotlinプロジェクトでコンパイラの警告を一元的に管理するための統一された方法を提供することを目的としています。

以前は、`-nowarn`ですべての警告を無効にする、`-Werror`ですべての警告をコンパイルエラーにする、または`-Wextra`で追加のコンパイラチェックを有効にするなど、一般的なモジュール全体にわたるルールのみを適用できました。特定の警告に対して調整する唯一のオプションは`-Xsuppress-warning`オプションでした。

この新しいソリューションにより、一般的なルールを上書きし、特定の診断を一貫した方法で除外できます。

### 適用方法

新しいコンパイラオプションは以下の構文を持ちます。

```bash
-Xwarning-level=DIAGNOSTIC_NAME:(error|warning|disabled)
```

*   `error`: 指定された警告をエラーに昇格させます。
*   `warning`: 警告を出力し、デフォルトで有効になります。
*   `disabled`: 指定された警告をモジュール全体で完全に抑制します。

この新しいコンパイラオプションでは、_警告_の重要度レベルのみを設定できることに注意してください。

### ユースケース

新しいソリューションを使用すると、一般的なルールと特定のルールを組み合わせることで、プロジェクトでの警告レポートをより詳細に調整できます。
ユースケースを選択してください:

#### 警告の抑制

| コマンド                                          | 説明                                           |
|-------------------------------------------------|------------------------------------------------|
| [`-nowarn`](compiler-reference.md#nowarn)       | コンパイル中のすべての警告を抑制します。         |
| `-Xwarning-level=DIAGNOSTIC_NAME:disabled`      | 指定された警告のみを抑制します。                 |
| `-nowarn -Xwarning-level=DIAGNOSTIC_NAME:warning` | 指定された警告を除き、すべての警告を抑制します。 |

#### 警告をエラーに昇格

| コマンド                                          | 説明                                                 |
|-------------------------------------------------|------------------------------------------------------|
| [`-Werror`](compiler-reference.md#werror)       | すべての警告をコンパイルエラーに昇格させます。       |
| `-Xwarning-level=DIAGNOSTIC_NAME:error`         | 指定された警告のみをエラーに昇格させます。           |
| `-Werror -Xwarning-level=DIAGNOSTIC_NAME:warning` | 指定された警告を除き、すべての警告をエラーに昇格させます。 |

#### 追加のコンパイラ警告を有効にする

| コマンド                                            | 説明                                                                                         |
|---------------------------------------------------|----------------------------------------------------------------------------------------------|
| [`-Wextra`](compiler-reference.md#wextra)         | trueの場合に警告を出力する、すべての追加の宣言、式、型コンパイラチェックを有効にします。 |
| `-Xwarning-level=DIAGNOSTIC_NAME:warning`         | 指定された追加のコンパイラチェックのみを有効にします。                                       |
| `-Wextra -Xwarning-level=DIAGNOSTIC_NAME:disabled` | 指定されたものを除き、すべての追加チェックを有効にします。                                     |

#### 警告リスト

一般的なルールから除外したい警告が多数ある場合、[`@argfile`](compiler-reference.md#argfile)を介して別のファイルにそれらをリストできます。

### フィードバックにご協力ください

新しいコンパイラオプションはまだ[実験的](components-stability.md#stability-levels-explained)です。問題が発生した場合は、課題トラッカー[YouTrack](https://kotl.in/issue)までご報告ください。

## Kotlin/JVM

Kotlin 2.2.0はJVMに多くのアップデートをもたらします。コンパイラはJava 24バイトコードをサポートし、インターフェース関数のデフォルトメソッド生成に変更を導入します。また、このリリースではKotlinメタデータでのアノテーションの扱いを簡素化し、インライン値クラスとのJava相互運用性を向上させ、JVMレコードへのアノテーション付けのサポートを改善します。

### インターフェース関数のデフォルトメソッド生成の変更点

Kotlin 2.2.0以降、インターフェースで宣言された関数は、別途設定されていない限り、JVMのデフォルトメソッドにコンパイルされます。この変更は、Kotlinの、実装を持つインターフェース関数がバイトコードにコンパイルされる方法に影響します。

この動作は、非推奨の`-Xjvm-default`オプションを置き換える、新しい安定版コンパイラオプション`-jvm-default`によって制御されます。

以下の値を使用して`-jvm-default`オプションの動作を制御できます。

*   `enable` (デフォルト): インターフェースにデフォルト実装を生成し、サブクラスと`DefaultImpls`クラスにブリッジ関数を含めます。このモードは、古いKotlinバージョンとのバイナリ互換性を維持するために使用します。
*   `no-compatibility`: インターフェースにデフォルト実装のみを生成します。このモードでは、互換性ブリッジと`DefaultImpls`クラスがスキップされるため、新しいコードに適しています。
*   `disable`: インターフェースのデフォルト実装を無効にします。ブリッジ関数と`DefaultImpls`クラスのみが生成され、Kotlin 2.2.0より前の動作と一致します。

`-jvm-default`コンパイラオプションを設定するには、Gradle Kotlin DSLで`jvmDefault`プロパティを設定します。

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        jvmDefault = JvmDefaultMode.NO_COMPATIBILITY
    }
}
```

### Kotlinメタデータにおけるアノテーションの読み書きのサポート
<primary-label ref="experimental-general"/>

以前は、コンパイルされたJVMクラスファイルからリフレクションまたはバイトコード分析を使用してアノテーションを読み取り、シグネチャに基づいてメタデータエントリに手動で一致させる必要がありました。
このプロセスは、特にオーバーロードされた関数では、エラーが発生しやすかったものでした。

現在、Kotlin 2.2.0では、[Kotlinメタデータ](metadata-jvm.md)に格納されたアノテーションの読み取りのサポートが導入されます。

コンパイルされたファイルのメタデータでアノテーションを利用可能にするには、以下のコンパイラオプションを追加します。

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

このオプションを有効にすると、KotlinコンパイラはJVMバイトコードとともにメタデータにアノテーションを書き込み、`kotlin-metadata-jvm`ライブラリからアクセスできるようにします。

このライブラリは、アノテーションにアクセスするための以下のAPIを提供します。

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

Kotlinメタデータからアノテーションを読み取る例を以下に示します。

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

> プロジェクトで`kotlin-metadata-jvm`ライブラリを使用している場合、アノテーションをサポートするようにコードをテストおよび更新することをお勧めします。
> そうしないと、将来のKotlinバージョンでメタデータ内のアノテーションが[デフォルトで有効](https://youtrack.jetbrains.com/issue/KT-75736)になったときに、プロジェクトが無効または不完全なメタデータを生成する可能性があります。
>
> 問題が発生した場合は、[課題トラッカー](https://youtrack.jetbrains.com/issue/KT-31857)までご報告ください。
>
{style="warning"}

### インライン値クラスとのJava相互運用性の改善
<primary-label ref="experimental-general"/>

> IntelliJ IDEAでの本機能のコード分析、コード補完、ハイライトのサポートは、現在のところ[2025.3 EAPビルド](https://www.jetbrains.com/idea/nextversion/)でのみ利用可能です。
>
{style="note"}

Kotlin 2.2.0は、新しい実験的なアノテーション[`@JvmExposeBoxed`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.jvm/-jvm-expose-boxed/)を導入します。このアノテーションは、Javaから[インライン値クラス](inline-classes.md)を使用しやすくします。

デフォルトでは、Kotlinはインライン値クラスを**アンボックス化された表現**を使用するようにコンパイルします。これはパフォーマンスが向上しますが、Javaから使用するのが困難または不可能な場合が多いです。例:

```kotlin
@JvmInline value class PositiveInt(val number: Int) {
    init { require(number >= 0) }
}
```

この場合、クラスがアンボックス化されているため、Javaが呼び出せるコンストラクタがありません。また、Javaが`init`ブロックをトリガーして`number`が正であることを保証する方法もありません。

クラスに`@JvmExposeBoxed`アノテーションを付けると、KotlinはJavaが直接呼び出せるパブリックコンストラクタを生成し、`init`ブロックも実行されることを保証します。

`@JvmExposeBoxed`アノテーションは、クラス、コンストラクタ、または関数レベルで適用でき、Javaに公開されるものを細かく制御できます。

例えば、以下のコードでは、拡張関数`.timesTwoBoxed()`はJavaからアクセス**できません**。

```kotlin
@JvmInline
value class MyInt(val value: Int)

fun MyInt.timesTwoBoxed(): MyInt = MyInt(this.value * 2)
```

`MyInt`クラスのインスタンスを作成し、Javaコードから`.timesTwoBoxed()`関数を呼び出すことを可能にするには、クラスと関数の両方に`@JvmExposeBoxed`アノテーションを追加します。

```kotlin
@JvmExposeBoxed
@JvmInline
value class MyInt(val value: Int)

@JvmExposeBoxed
fun MyInt.timesTwoBoxed(): MyInt = MyInt(this.value * 2)
```

これらのアノテーションを使用すると、Kotlinコンパイラは`MyInt`クラス用のJavaからアクセス可能なコンストラクタを生成します。また、値クラスのボックス化された形式を使用する拡張関数のオーバーロードも生成します。結果として、以下のJavaコードが正常に実行されます。

```java
MyInt input = new MyInt(5);
MyInt output = ExampleKt.timesTwoBoxed(input);
```

公開したいインライン値クラスのすべての部分にアノテーションを付けたくない場合、アノテーションをモジュール全体に効果的に適用できます。この動作をモジュールに適用するには、`-Xjvm-expose-boxed`オプションでコンパイルします。このオプションでコンパイルすると、モジュール内のすべての宣言に`@JvmExposeBoxed`アノテーションが付いているのと同じ効果があります。

この新しいアノテーションは、Kotlinが値クラスを内部でコンパイルまたは使用する方法を変更せず、既存のコンパイル済みコードはすべて有効なままです。Java相互運用性を向上させる新しい機能を追加するだけです。値クラスを使用するKotlinコードのパフォーマンスには影響しません。

`@JvmExposeBoxed`アノテーションは、メンバー関数のボックス化されたバリアントを公開し、ボックス化された戻り値の型を受け取りたいライブラリ作者にとって有用です。これにより、インライン値クラス（効率的だがKotlin専用）とデータクラス（Java互換だが常にボックス化される）のどちらかを選択する必要がなくなります。

`@JvmExposedBoxed`アノテーションの動作とそれが解決する問題に関するより詳細な説明については、この[KEEP](https://github.com/Kotlin/KEEP/blob/jvm-expose-boxed/proposals/jvm-expose-boxed.md)提案を参照してください。

### JVMレコードへのアノテーション付けのサポートの改善

KotlinはKotlin 1.5.0以降、[JVMレコード](jvm-records.md)をサポートしています。現在、Kotlin 2.2.0は、レコードコンポーネントに対するKotlinのアノテーションの扱いを改善します。特に、Javaの[`RECORD_COMPONENT`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/annotation/ElementType.html#RECORD_COMPONENT)ターゲットとの関連において、改善が見られます。

まず、`RECORD_COMPONENT`をアノテーションターゲットとして使用したい場合、Kotlin (`@Target`) とJavaのアノテーションを手動で追加する必要があります。これは、Kotlinの`@Target`アノテーションが`RECORD_COMPONENT`をサポートしていないためです。例:

```kotlin
@Target(AnnotationTarget.CLASS, AnnotationTarget.PROPERTY)
@java.lang.annotation.Target(ElementType.CLASS, ElementType.RECORD_COMPONENT)
annotation class exampleClass
```

両方のリストを手動で維持するのはエラーが発生しやすいため、Kotlin 2.2.0はKotlinとJavaのターゲットが一致しない場合にコンパイラの警告を導入します。例えば、Javaターゲットリストから`ElementType.CLASS`を省略すると、コンパイラは次のように報告します。

```
Incompatible annotation targets: Java target 'CLASS' missing, corresponding to Kotlin targets 'CLASS'.
```

次に、Kotlinの動作は、レコードでのアノテーションの伝播に関してJavaとは異なります。Javaでは、レコードコンポーネントのアノテーションは自動的にバッキングフィールド、ゲッター、およびコンストラクタパラメータに適用されます。Kotlinはデフォルトではこれを実行しませんが、[`@all:`使用サイトターゲット](#all-meta-target-for-properties)を使用してその動作を再現できるようになりました。

例:

```kotlin
@JvmRecord
data class Person(val name: String, @all:Positive val age: Int)
```

`@JvmRecord`を`@all:`と組み合わせて使用すると、Kotlinは現在、次のように動作します。

*   アノテーションをプロパティ、バッキングフィールド、コンストラクタパラメータ、ゲッターに伝播します。
*   アノテーションがJavaの`RECORD_COMPONENT`をサポートしている場合、レコードコンポーネントにもアノテーションを適用します。

## Kotlin/Native

2.2.0以降、Kotlin/NativeはLLVM 19を使用します。このリリースでは、メモリ消費量を追跡および調整するために設計されたいくつかの実験的機能も導入します。

### オブジェクトごとのメモリ割り当て
<primary-label ref="experimental-opt-in"/>

Kotlin/Nativeの[メモリ割り当てツール](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md)は、オブジェクトごとにメモリを予約できるようになりました。場合によっては、これにより厳密なメモリ制限を満たしたり、アプリケーションの起動時のメモリ消費量を削減したりするのに役立つ場合があります。

この新機能は、デフォルトのメモリ割り当てツールの代わりにシステムメモリ割り当てツールを有効にする`-Xallocator=std`コンパイラオプションを置き換えるように設計されています。現在、メモリ割り当てを切り替えることなく、バッファリング（割り当てのページング）を無効にできます。

この機能は現在[実験的](components-stability.md#stability-levels-explained)です。
有効にするには、`gradle.properties`ファイルで以下のオプションを設定します。

```none
kotlin.native.binary.pagedAllocator=false
```

問題が発生した場合は、課題トラッカー[YouTrack](https://kotl.in/issue)までご報告ください。

### 実行時におけるLatin-1エンコード文字列のサポート
<primary-label ref="experimental-opt-in"/>

Kotlinは現在、[JVM](https://openjdk.org/jeps/254)と同様に、Latin-1エンコードされた文字列をサポートするようになりました。これは、アプリケーションのバイナリサイズを削減し、メモリ消費量を調整するのに役立つはずです。

デフォルトでは、Kotlinの文字列はUTF-16エンコーディングを使用して格納され、各文字は2バイトで表現されます。場合によっては、これによりソースコードと比較して、バイナリで文字列が2倍のスペースを占めることになり、単純なASCIIファイルからデータを読み取ると、ディスクにファイルを保存するよりも2倍のメモリを消費する可能性があります。

一方、[Latin-1 (ISO 8859-1)](https://en.wikipedia.org/wiki/ISO/IEC_8859-1)エンコーディングは、最初の256個のUnicode文字をそれぞれ1バイトで表現します。Latin-1サポートが有効になっている場合、すべての文字がその範囲内にある限り、文字列はLatin-1エンコーディングで格納されます。それ以外の場合は、デフォルトのUTF-16エンコーディングが使用されます。

#### Latin-1サポートを有効にする方法

この機能は現在[実験的](components-stability.md#stability-levels-explained)です。
有効にするには、`gradle.properties`ファイルで以下のオプションを設定します。

```none
kotlin.native.binary.latin1Strings=true
```
#### 既知の問題

この機能が実験的である限り、cinterop拡張関数[`String.pin`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/pin.html)、[`String.usePinned`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-pinned.html)、および[`String.refTo`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/ref-to.html)は効率が低下します。それらへの各呼び出しは、自動的な文字列のUTF-16変換をトリガーする可能性があります。

Kotlinチームは、この機能の実装にご協力いただいたGoogleの同僚、特に[Sonya Valchuk](https://github.com/pyos)に深く感謝いたします。

Kotlinでのメモリ消費量の詳細については、[ドキュメント](native-memory-manager.md#memory-consumption)を参照してください。

### Appleプラットフォームにおけるメモリ消費量追跡の改善

Kotlin 2.2.0以降、Kotlinコードによって割り当てられたメモリにタグが付けられるようになりました。これは、Appleプラットフォームでのメモリ問題のデバッグに役立ちます。

アプリケーションの高いメモリ使用量を調査する際、Kotlinコードによってどれくらいのメモリが予約されているかを識別できるようになりました。Kotlinの共有メモリは識別子でタグ付けされ、Xcode InstrumentsのVM Trackerなどのツールを通じて追跡できます。

この機能はデフォルトで有効ですが、以下の_すべての_条件が満たされている場合にのみ、Kotlin/Nativeのデフォルトメモリ割り当てツールで利用可能です。

*   **タグ付けが有効であること**。メモリには有効な識別子でタグが付けられている必要があります。Appleは240から255の範囲の数値を推奨しており、デフォルト値は246です。

    `kotlin.native.binary.mmapTag=0`Gradleプロパティを設定すると、タグ付けは無効になります。

*   **`mmap`による割り当て**。アロケータは`mmap`システムコールを使用してファイルをメモリにマップする必要があります。

    `kotlin.native.binary.disableMmap=true`Gradleプロパティを設定すると、デフォルトのアロケータは`mmap`の代わりに`malloc`を使用します。

*   **ページングが有効であること**。割り当てのページング（バッファリング）が有効になっている必要があります。

    [`kotlin.native.binary.pagedAllocator=false`](#per-object-memory-allocation)Gradleプロパティを設定すると、代わりにメモリはオブジェクトごとに予約されます。

Kotlinでのメモリ消費量の詳細については、[ドキュメント](native-memory-manager.md#memory-consumption)を参照してください。

### LLVM 16から19へのアップデート

Kotlin 2.2.0では、LLVMをバージョン16から19にアップデートしました。
新しいバージョンには、パフォーマンスの改善、バグ修正、セキュリティアップデートが含まれています。

このアップデートがコードに影響を与えることはないはずですが、何か問題が発生した場合は、[課題トラッカー](http://kotl.in/issue)までご報告ください。

### Windows 7ターゲットの非推奨化

Kotlin 2.2.0以降、最小サポートWindowsバージョンがWindows 7からWindows 10に引き上げられました。Microsoftが2025年1月にWindows 7のサポートを終了したため、私たちはこのレガシーターゲットを非推奨とすることを決定しました。

詳細については、[ネイティブターゲットのサポート](native-target-support.md)を参照してください。

## Kotlin/Wasm

このリリースでは、[WasmターゲットのビルドインフラストラクチャがJavaScriptターゲットから分離されました](#build-infrastructure-for-wasm-target-separated-from-javascript-target)。さらに、[プロジェクトまたはモジュールごとにBinaryenツールを設定できる](#per-project-binaryen-configuration)ようになりました。

### WasmターゲットのビルドインフラストラクチャがJavaScriptターゲットから分離されました

以前は、`wasmJs`ターゲットは`js`ターゲットと同じインフラストラクチャを共有していました。その結果、両方のターゲットは同じディレクトリ (`build/js`) にホストされ、同じNPMタスクと設定を使用していました。

現在、`wasmJs`ターゲットは`js`ターゲットとは分離された独自のインフラストラクチャを持つようになりました。これにより、WasmタスクとタイプをJavaScriptのそれらと区別し、独立した設定を可能にします。

さらに、Wasm関連のプロジェクトファイルとNPM依存関係は、個別の`build/wasm`ディレクトリに格納されるようになりました。

Wasm用の新しいNPM関連タスクが導入され、既存のJavaScriptタスクはJavaScript専用になりました。

| **Wasmタスク**         | **JavaScriptタスク** |
|------------------------|----------------------|
| `kotlinWasmNpmInstall` | `kotlinNpmInstall`   |
| `wasmRootPackageJson`  | `rootPackageJson`    |

同様に、新しいWasm固有の宣言が追加されました。

| **Wasm宣言**     | **JavaScript宣言** |
|---------------------------|-----------------------------|
| `WasmNodeJsRootPlugin`    | `NodeJsRootPlugin`          |
| `WasmNodeJsPlugin`        | `NodeJsPlugin`              |
| `WasmYarnPlugin`          | `YarnPlugin`                |
| `WasmNodeJsRootExtension` | `NodeJsRootExtension`       |
| `WasmNodeJsEnvSpec`       | `NodeJsEnvSpec`             |
| `WasmYarnRootEnvSpec`     | `YarnRootEnvSpec`           |

これにより、JavaScriptターゲットから独立してWasmターゲットを操作できるようになり、設定プロセスが簡素化されます。

この変更はデフォルトで有効になっており、追加の設定は不要です。

### プロジェクトごとのBinaryen設定

Kotlin/Wasmで[プロダクションビルドを最適化する](whatsnew20.md#optimized-production-builds-by-default-using-binaryen)ために使用されるBinaryenツールは、以前はルートプロジェクトで一度だけ設定されていました。

現在、プロジェクトまたはモジュールごとにBinaryenツールを設定できるようになりました。この変更はGradleのベストプラクティスと整合し、[プロジェクト分離](https://docs.gradle.org/current/userguide/isolated_projects.html)のような機能のサポートを強化し、複雑なビルドでのビルドパフォーマンスと信頼性を向上させます。

さらに、必要に応じて、異なるモジュールに対して異なるバージョンのBinaryenを設定することもできます。

この機能はデフォルトで有効です。ただし、カスタムのBinaryen設定がある場合、ルートプロジェクトのみではなく、プロジェクトごとに適用する必要があります。

## Kotlin/JS

このリリースでは、[`@JsPlainObject`インターフェースにおける`copy()`関数の修正](#fix-for-copy-in-jsplainobject-interfaces)、[`@JsModule`アノテーションを持つファイルでの型エイリアス](#support-for-type-aliases-in-files-with-jsmodule-annotation)、およびその他のKotlin/JS機能が改善されています。

### `@JsPlainObject`インターフェースにおける`copy()`の修正

Kotlin/JSには`js-plain-objects`という実験的なプラグインがあり、`@JsPlainObject`でアノテーションされたインターフェースに`copy()`関数を導入しました。`copy()`関数を使用してオブジェクトを操作できます。

しかし、`copy()`の初期実装は継承と互換性がなく、これにより`@JsPlainObject`インターフェースが他のインターフェースを拡張する際に問題を引き起こしました。

プレーンオブジェクトに関する制限を回避するため、`copy()`関数はオブジェクト自体からそのコンパニオンオブジェクトに移動されました。

```kotlin
@JsPlainObject
external interface User {
    val name: String
    val age: Int
}

fun main() {
    val user = User(name = "SomeUser", age = 21)
    // この構文はもう有効ではありません
    val copy = user.copy(age = 35)      
    // こちらが正しい構文です
    val copy = User.copy(user, age = 35)
}
```

この変更は、継承階層の競合を解決し、曖昧さを解消します。
Kotlin 2.2.0からデフォルトで有効になります。

### `@JsModule`アノテーションを持つファイルにおける型エイリアスのサポート

以前は、JavaScriptモジュールから宣言をインポートするために`@JsModule`でアノテーションされたファイルは、外部宣言にのみ制限されていました。これは、そのようなファイルで`typealias`を宣言できなかったことを意味します。

Kotlin 2.2.0以降、`@JsModule`でマークされたファイル内で型エイリアスを宣言できます。

```kotlin
@file:JsModule("somepackage")
package somepackage
typealias SomeClass = Any
```

この変更はKotlin/JSの相互運用性における制限の一側面を軽減します。今後のリリースでさらなる改善が計画されています。

`@JsModule`を持つファイルでの型エイリアスのサポートはデフォルトで有効になっています。

### マルチプラットフォームの`expect`宣言における`@JsExport`のサポート

Kotlinマルチプラットフォームプロジェクトで[`expect/actual`メカニズム](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)を使用する場合、共通コードの`expect`宣言に`@JsExport`アノテーションを使用することはできませんでした。

このリリースから、`expect`宣言に直接`@JsExport`を適用できます。

```kotlin
// commonMain

// 以前はエラーになりましたが、現在は正しく動作します 
@JsExport
expect class WindowManager {
    fun close()
}

@JsExport
fun acceptWindowManager(manager: WindowManager) {
    ...
}

// jsMain

@JsExport
actual class WindowManager {
    fun close() {
        window.close()
    }
}
```

JavaScriptソースセット内の対応する`actual`実装にも`@JsExport`でアノテーションを付ける必要があり、エクスポート可能な型のみを使用する必要があります。

この修正により、`commonMain`で定義された共有コードをJavaScriptに正しくエクスポートできます。これにより、手動の回避策を使用することなく、マルチプラットフォームコードをJavaScriptのコンシューマに公開できるようになりました。

この変更はデフォルトで有効になっています。

### `Promise<Unit>`型での`@JsExport`の使用

以前は、`@JsExport`アノテーションを付けて`Promise<Unit>`型を返す関数をエクスポートしようとすると、Kotlinコンパイラがエラーを生成しました。

`Promise<Int>`のような戻り値の型は正しく動作しましたが、`Promise<Unit>`を使用すると、「エクスポート不可能な型」の警告がトリガーされました。TypeScriptでは`Promise<void>`に正しくマッピングされていたにもかかわらず、です。

この制限は解除されました。現在、以下のコードはエラーなしでコンパイルされます。

```kotlin
// 以前は正しく動作しました
@JsExport
fun fooInt(): Promise<Int> = GlobalScope.promise {
    delay(100)
    return@promise 42
}

// 以前はエラーになりましたが、現在は正しく動作します
@JsExport
fun fooUnit(): Promise<Unit> = GlobalScope.promise {
    delay(100)
}
```

この変更はKotlin/JS相互運用モデルにおける不要な制限を削除します。この修正はデフォルトで有効になっています。

## Gradle

Kotlin 2.2.0はGradle 7.6.3から8.14まで完全に互換性があります。最新のGradleリリースまでのGradleバージョンも使用できます。ただし、そうすると非推奨の警告が発生したり、一部の新しいGradle機能が動作しない可能性があることに注意してください。

このリリースでは、Kotlin Gradleプラグインの診断機能にいくつかの改善が加えられています。また、[バイナリ互換性検証](#binary-compatibility-validation-included-in-kotlin-gradle-plugin)の実験的な統合が導入され、ライブラリでの作業が容易になります。

### Kotlin Gradleプラグインにバイナリ互換性検証が含まれるようになりました
<primary-label ref="experimental-general"/>

ライブラリバージョン間のバイナリ互換性をチェックしやすくするために、[バイナリ互換性バリデータ](https://github.com/Kotlin/binary-compatibility-validator)の機能をKotlin Gradleプラグイン（KGP）に移行する実験を行っています。おもちゃのプロジェクトで試すことはできますが、まだ本番環境での使用は推奨しません。

元の[バイナリ互換性バリデータ](https://github.com/Kotlin/binary-compatibility-validator)は、この実験段階中も引き続きメンテナンスされます。

Kotlinライブラリは2つのバイナリフォーマットのいずれかを使用できます: JVMクラスファイルまたは`klib`。これらのフォーマットは互換性がないため、KGPはそれぞれを個別に処理します。

バイナリ互換性検証機能を有効にするには、`build.gradle.kts`ファイルの`kotlin{}`ブロックに以下を追加します。

```kotlin
// build.gradle.kts
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        // 古いGradleバージョンとの互換性を確保するためにset()関数を使用します
        enabled.set(true)
    }
}
```

プロジェクトにバイナリ互換性をチェックしたい複数のモジュールがある場合、各モジュールで個別に機能を設定します。各モジュールは独自のカスタム設定を持つことができます。

有効にしたら、`checkLegacyAbi`Gradleタスクを実行して、バイナリ互換性の問題をチェックします。タスクはIntelliJ IDEAまたはプロジェクトディレクトリのコマンドラインから実行できます。

```kotlin
./gradlew checkLegacyAbi
```

このタスクは、現在のコードからアプリケーションバイナリインターフェース（ABI）ダンプをUTF-8テキストファイルとして生成します。タスクは、新しいダンプを以前のリリースからのものと比較します。違いが見つかった場合、それらをエラーとして報告します。エラーを確認し、変更が許容できると判断した場合は、`updateLegacyAbi`Gradleタスクを実行して参照ABIダンプを更新できます。

#### クラスのフィルタリング

この機能により、ABIダンプ内のクラスをフィルタリングできます。名前または部分名で明示的にクラスを含めたり除外したり、またはそれらをマークするアノテーション（またはアノテーション名の一部）によってフィルタリングできます。

例えば、このサンプルは`com.company`パッケージ内のすべてのクラスを除外します。

```kotlin
// build.gradle.kts
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        filters.excluded.byNames.add("com.company.**")
    }
}
```

バイナリ互換性バリデータの設定について詳しくは、[KGP APIリファレンス](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.dsl.abi/)を参照してください。

#### マルチプラットフォームの制限

マルチプラットフォームプロジェクトで、ホストがすべてのターゲットのクロスコンパイルをサポートしていない場合、KGPは、他のターゲットからのABIダンプをチェックすることで、サポートされていないターゲットのABI変更を推論しようとします。このアプローチは、後で**すべて**のターゲットをコンパイルできるホストに切り替えた場合に、誤った検証失敗を回避するのに役立ちます。

KGPがサポートされていないターゲットのABI変更を推論しないように、このデフォルトの動作を変更するには、`build.gradle.kts`ファイルに以下を追加します。

```kotlin
// build.gradle.kts
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        klib {
            keepUnsupportedTargets = false
        }
    }
}
```

ただし、プロジェクトにサポートされていないターゲットがある場合、タスクがABIダンプを作成できないため、`checkLegacyAbi`タスクの実行は失敗します。この動作は、他のターゲットから推論されたABI変更による互換性のない変更を見逃すよりも、チェックが失敗する方が重要である場合に望ましいです。

### Kotlin Gradleプラグインのコンソールにおけるリッチ出力のサポート

Kotlin 2.2.0では、Gradleビルドプロセス中に、コンソールでの色やその他のリッチ出力をサポートします。これにより、報告される診断情報をより読みやすく、理解しやすくします。

リッチ出力はLinuxおよびmacOSのサポートされているターミナルエミュレーターで利用可能であり、Windowsのサポート追加に取り組んでいます。

![Gradle console](gradle-console-rich-output.png){width=600}

この機能はデフォルトで有効ですが、上書きしたい場合、`gradle.properties`ファイルに以下のGradleプロパティを追加してください。

```
org.gradle.console=plain
```

このプロパティとそのオプションの詳細については、Gradleの[ログ形式のカスタマイズ](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:command_line_customizing_log_format)に関するドキュメントを参照してください。

### KGP診断におけるProblems APIの統合

以前は、Kotlin Gradleプラグイン（KGP）は、警告やエラーなどの診断情報を、コンソールやログにプレーンテキスト出力としてしか報告できませんでした。

2.2.0以降、KGPは追加のレポートメカニズムを導入します: 現在は[GradleのProblems API](https://docs.gradle.org/current/kotlin-dsl/gradle/org.gradle.api.problems/index.html)を使用しています。これは、ビルドプロセス中にリッチで構造化された問題情報を報告する標準化された方法です。

KGP診断は、Gradle CLIやIntelliJ IDEAなど、異なるインターフェースでより読みやすく、より一貫して表示されるようになりました。

この統合は、Gradle 8.6以降からデフォルトで有効になっています。
APIはまだ進化中であるため、最新の改善を活用するために最新のGradleバージョンを使用してください。

### KGPと`--warning-mode`の互換性

Kotlin Gradleプラグイン（KGP）診断は、固定された重要度レベルで問題を報告していました。これは、Gradleの[`--warning-mode`コマンドラインオプション](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:command_line_warnings)がKGPのエラー表示方法に影響を与えなかったことを意味します。

現在、KGP診断は`--warning-mode`オプションと互換性があり、より柔軟性を提供します。例えば、すべての警告をエラーに変換したり、警告を完全に無効にしたりできます。

この変更により、KGP診断は選択された警告モードに基づいて出力を調整します。

*   `--warning-mode=fail`を設定すると、`Severity.Warning`の診断は`Severity.Error`に昇格されます。
*   `--warning-mode=none`を設定すると、`Severity.Warning`の診断はログに記録されません。

この動作は2.2.0からデフォルトで有効になっています。

`--warning-mode`オプションを無視するには、`gradle.properties`ファイルに以下のGradleプロパティを設定してください。

```
kotlin.internal.diagnostics.ignoreWarningMode=true
```

## 新しい実験的なビルドツールAPI
<primary-label ref="experimental-general"/>

Gradle、Maven、AmperなどのさまざまなビルドシステムでKotlinを使用できます。ただし、インクリメンタルコンパイル、Kotlinコンパイラプラグイン、デーモン、Kotlin Multiplatformとの互換性など、完全な機能セットをサポートするために各システムにKotlinを統合することは、多大な労力を必要とします。

このプロセスを簡素化するために、Kotlin 2.2.0は新しい実験的なビルドツールAPI（BTA）を導入します。BTAは、ビルドシステムとKotlinコンパイラエコシステム間の抽象化レイヤーとして機能する普遍的なAPIです。このアプローチにより、各ビルドシステムは単一のBTAエントリーポイントをサポートするだけでよくなります。

現在、BTAはKotlin/JVMのみをサポートしています。JetBrainsのKotlinチームは、Kotlin Gradleプラグイン（KGP）と`kotlin-maven-plugin`で既にこれを使用しています。これらのプラグインを通じてBTAを試すことはできますが、API自体は、独自のビルドツール統合での一般的な使用にはまだ準備ができていません。BTAの提案に興味がある場合、またはフィードバックを共有したい場合、この[KEEP](https://github.com/Kotlin/KEEP/issues/421)提案を参照してください。

BTAを試すには:

*   KGPの場合、`gradle.properties`ファイルに以下のプロパティを追加してください。

```kotlin
kotlin.compiler.runViaBuildToolsApi=true
```   

*   Mavenの場合、何もする必要はありません。デフォルトで有効になっています。

BTAは現在、Mavenプラグインに直接的なメリットはありませんが、[Kotlinデーモンのサポート](https://youtrack.jetbrains.com/issue/KT-77587/Maven-Introduce-Kotlin-daemon-support-and-make-it-enabled-by-default)や[インクリメンタルコンパイルの安定化](https://youtrack.jetbrains.com/issue/KT-77086/Stabilize-incremental-compilation-in-Maven)など、新機能のより迅速な提供のための確固たる基盤を築きます。

KGPの場合、BTAを使用することですでに以下のメリットがあります。

*   [「インプロセス」コンパイラ実行戦略の改善](#improved-in-process-compiler-execution-strategy)
*   [Kotlinからの異なるコンパイラバージョン設定の柔軟性](#flexibility-to-configure-different-compiler-versions-from-kotlin)

### 「インプロセス」コンパイラ実行戦略の改善

KGPは3つの[Kotlinコンパイラ実行戦略](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy)をサポートしています。Gradleデーモンプロセス内でコンパイラを実行する「インプロセス」戦略は、以前はインクリメンタルコンパイルをサポートしていませんでした。

現在、BTAを使用することで、「インプロセス」戦略はインクリメンタルコンパイルを**サポート**するようになりました。使用するには、`gradle.properties`ファイルに以下のプロパティを追加してください。

```kotlin
kotlin.compiler.execution.strategy=in-process
```

### Kotlinからの異なるコンパイラバージョン設定の柔軟性

ビルドスクリプトの非推奨を処理しながら新しい言語機能を試すなど、コードで新しいKotlinコンパイラバージョンを使用しながら、KGPを古いバージョンのままにしたい場合があります。または、KGPのバージョンを更新し、古いKotlinコンパイラバージョンを保持したい場合もあります。

BTAはこれを可能にします。`build.gradle.kts`ファイルで次のように設定できます。

```kotlin
// build.gradle.kts
import org.jetbrains.kotlin.buildtools.api.ExperimentalBuildToolsApi
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

plugins { 
    kotlin("jvm") version "2.2.0"
}

group = "org.jetbrains.example"
version = "1.0-SNAPSHOT"

repositories { 
    mavenCentral()
}

kotlin { 
    jvmToolchain(8)
    @OptIn(ExperimentalBuildToolsApi::class, ExperimentalKotlinGradlePluginApi::class) 
    compilerVersion.set("2.1.21") // 2.2.0とは異なるバージョン
}

```

BTAは、KGPとKotlinコンパイラバージョンを、過去3つのメジャーバージョンと将来の1つのメジャーバージョンで設定することをサポートします。したがって、KGP 2.2.0では、Kotlinコンパイラバージョン2.1.x、2.0.x、および1.9.25がサポートされます。KGP 2.2.0は、将来のKotlinコンパイラバージョン2.2.xおよび2.3.xとも互換性があります。

ただし、異なるコンパイラバージョンをコンパイラプラグインと組み合わせて使用すると、Kotlinコンパイラ例外が発生する可能性があることに注意してください。Kotlinチームは、今後のリリースでこれらの問題に対処する予定です。

これらのプラグインでBTAを試して、[KGP](https://youtrack.jetbrains.com/issue/KT-56574)と[Mavenプラグイン](https://youtrack.jetbrains.com/issue/KT-73012)専用のYouTrackチケットでフィードバックをお寄せください。

## Kotlin標準ライブラリ

Kotlin 2.2.0では、[`Base64` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/)と[`HexFormat` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/-hex-format/)が[安定版](components-stability.md#stability-levels-explained)になりました。

### Base64エンコーディングとデコーディングの安定化

Kotlin 1.8.20は[Base64エンコーディングとデコーディングの実験的なサポート](whatsnew1820.md#support-for-base64-encoding)を導入しました。
Kotlin 2.2.0では、[Base64 API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/)は現在[安定版](components-stability.md#stability-levels-explained)であり、4つのエンコーディングスキームが含まれ、このリリースで新しい`Base64.Pem`が追加されました。

*   [`Base64.Default`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/-default/)は、標準の[Base64エンコーディングスキーム](https://www.rfc-editor.org/rfc/rfc4648#section-4)を使用します。

    > `Base64.Default`は`Base64`クラスのコンパニオンオブジェクトです。
    > 結果として、`Base64.Default.encode()`や`Base64.Default.decode()`の代わりに、`Base64.encode()`や`Base64.decode()`でその関数を呼び出すことができます。
    >
    {style="tip"}

*   [`Base64.UrlSafe`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/-default/-url-safe.html)は、["URLおよびファイル名セーフ"](https://www.rfc-editor.org/rfc/rfc4648#section-5)エンコーディングスキームを使用します。
*   [`Base64.Mime`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/-default/-mime.html)は、[MIME](https://www.rfc-editor.org/rfc/rfc2045#section-6.8)エンコーディングスキームを使用し、エンコード中に76文字ごとに改行文字を挿入し、デコード中に不正な文字をスキップします。
*   `Base64.Pem`は`Base64.Mime`のようにデータをエンコードしますが、行の長さを64文字に制限します。

Base64 APIを使用して、バイナリデータをBase64文字列にエンコードし、バイトにデコードするために使用できます。

以下に例を示します。

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

JVMでは、`.encodingWith()`および`.decodingWith()`拡張関数を使用して、入力ストリームと出力ストリームでBase64をエンコードおよびデコードします。

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

### Stable (安定版) HexFormat APIによる16進数のパースとフォーマット

[Kotlin 1.9.0](whatsnew19.md#new-hexformat-class-to-format-and-parse-hexadecimals)で導入された[`HexFormat` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/-hex-format/)は、現在[安定版](components-stability.md#stability-levels-explained)です。
これを使用して、数値と16進数文字列間の変換が可能です。

例えば:

```kotlin
fun main() {
    //sampleStart
    println(93.toHexString())
    //sampleEnd
}
```
{kotlin-runnable="true"}

詳細については、[16進数をフォーマットおよびパースするための新しい`HexFormat`クラス](whatsnew19.md#new-hexformat-class-to-format-and-parse-hexadecimals)を参照してください。

## Composeコンパイラ

このリリースでは、Composeコンパイラがコンポーザブル関数参照のサポートを導入し、いくつかの機能フラグのデフォルトを変更します。

### `@Composable`関数参照のサポート

Composeコンパイラは、Kotlin 2.2.0リリース以降、コンポーザブル関数参照の宣言と使用をサポートします。

```kotlin
val content: @Composable (String) -> Unit = ::Text

@Composable fun App() {
    content("My App")
}
```

コンポーザブル関数参照は、ランタイムにおいてコンポーザブルラムダオブジェクトとはわずかに異なる動作をします。特に、コンポーザブルラムダは`ComposableLambda`クラスを拡張することでスキッピングのより細かい制御を可能にします。関数参照は`KCallable`インターフェースを実装することが期待されるため、同じ最適化は適用できません。

### `PausableComposition`機能フラグがデフォルトで有効に

Kotlin 2.2.0以降、`PausableComposition`機能フラグがデフォルトで有効になります。このフラグは、再開可能な関数に対するComposeコンパイラの出力を調整し、ランタイムがスキッピング動作を強制することで、各関数をスキップしてコンポジションを効果的に一時停止できるようにします。これにより、重いコンポジションをフレーム間で分割できるようになり、将来のリリースでプリフェッチによって使用される予定です。

この機能フラグを無効にするには、Gradle設定に以下を追加します。

```kotlin
// build.gradle.kts
composeCompiler {
    featureFlag = setOf(ComposeFeatureFlag.PausableComposition.disabled())
}
```

### `OptimizeNonSkippingGroups`機能フラグがデフォルトで有効に

Kotlin 2.2.0以降、`OptimizeNonSkippingGroups`機能フラグがデフォルトで有効になります。この最適化は、非スキッピングなコンポーザブル関数に対して生成されるグループ呼び出しを削除することで、ランタイムパフォーマンスを向上させます。ランタイムで目に見える動作変更が生じることはありません。

問題が発生した場合は、この変更が原因であることを機能フラグを無効にして検証できます。[Jetpack Compose課題トラッカー](https://issuetracker.google.com/issues/new?component=610764&template=1424126)に問題を報告してください。

`OptimizeNonSkippingGroups`フラグを無効にするには、Gradle設定に以下を追加します。

```kotlin
composeCompiler {
    featureFlag = setOf(ComposeFeatureFlag.OptimizeNonSkippingGroups.disabled())
}
```

### 非推奨の機能フラグ

`StrongSkipping`と`IntrinsicRemember`機能フラグは現在非推奨であり、将来のリリースで削除される予定です。
これらの機能フラグを無効にする必要がある問題が発生した場合は、[Jetpack Compose課題トラッカー](https://issuetracker.google.com/issues/new?component=610764&template=1424126)に問題を報告してください。

## 破壊的変更と非推奨化

このセクションでは、注目すべき重要な破壊的変更と非推奨化について説明します。このリリースにおけるすべての破壊的変更と非推奨化の完全な概要については、[互換性ガイド](compatibility-guide-22.md)を参照してください。

*   Kotlin 2.2.0以降、[Ant](ant.md)ビルドシステムのサポートは非推奨になりました。AntのKotlinサポートは長らく活発な開発が行われておらず、ユーザーベースが比較的小さいため、これ以上維持する計画はありません。

    2.3.0でAntのサポートを削除する予定です。しかし、Kotlinは[貢献](contribute.md)に対して開かれたままです。Antの外部メンテナーになることに興味がある場合は、[このYouTrack issue](https://youtrack.jetbrains.com/issue/KT-75875/)に「jetbrains-team」の公開設定でコメントを残してください。

*   Kotlin 2.2.0では、Gradleの[`kotlinOptions{}`ブロックの非推奨レベルがエラーに引き上げられました](compatibility-guide-22.md#deprecate-kotlinoptions-dsl)。代わりに`compilerOptions{}`ブロックを使用してください。ビルドスクリプトの更新に関するガイダンスについては、[`kotlinOptions{}`から`compilerOptions{}`への移行](gradle-compiler-options.md#migrate-from-kotlinoptions-to-compileroptions)を参照してください。
*   KotlinスクリプトはKotlinのエコシステムの重要な部分であり続けていますが、より良いエクスペリエンスを提供するために、カスタムスクリプト、`gradle.kts`、`main.kts`スクリプトなどの特定のユースケースに焦点を当てています。
    詳細については、更新された[ブログ記事](https://blog.jetbrains.com/kotlin/2024/11/state-of-kotlin-scripting-2024/)を参照してください。結果として、Kotlin 2.2.0では以下のサポートが非推奨になります。

    *   REPL: `kotlinc`経由でREPLを引き続き使用するには、`-Xrepl`コンパイラオプションでオプトインしてください。
    *   JSR-223: この[JSR](https://jcp.org/en/jsr/detail?id=223)は**Withdrawn**（撤回済み）状態であるため、JSR-223の実装は言語バージョン1.9では動作し続けますが、将来的にK2コンパイラを使用するように移行されることはありません。
    *   `KotlinScriptMojo` Mavenプラグイン: このプラグインは十分な採用が見られませんでした。引き続き使用するとコンパイラの警告が表示されます。

*   Kotlin 2.2.0では、[`KotlinCompileTool`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/#)の[`setSource()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/set-source.html#)関数が、[設定されたソースを追加するのではなく置き換えるようになりました](compatibility-guide-22.md#correct-setsource-function-in-kotlincompiletool-to-replace-sources)。
    既存のソースを置き換えずにソースを追加したい場合は、[`source()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/source.html#)関数を使用してください。
*   `BaseKapt`の[`annotationProcessorOptionProviders`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-base-kapt/annotation-processor-option-providers.html#)の型が、[`MutableList<Any>`から`MutableList<CommandLineArgumentProvider>`に変更されました](compatibility-guide-22.md#deprecate-basekapt-annotationprocessoroptionproviders-property)。コードが現在リストを単一要素として追加している場合、`add()`関数の代わりに`addAll()`関数を使用してください。
*   レガシーKotlin/JSバックエンドで使用されていたデッドコードエリミネーション（DCE）ツールの非推奨化に伴い、DCEに関連する残りのDSLがKotlin Gradleプラグインから削除されました。
    *   `org.jetbrains.kotlin.gradle.dsl.KotlinJsDce`インターフェース
    *   `org.jetbrains.kotlin.gradle.targets.js.dsl.KotlinJsBrowserDsl.dceTask(body: Action<KotlinJsDce>)`関数
    *   `org.jetbrains.kotlin.gradle.dsl.KotlinJsDceCompilerToolOptions`インターフェース
    *   `org.jetbrains.kotlin.gradle.dsl.KotlinJsDceOptions`インターフェース

    現在の[JS IRコンパイラ](js-ir-compiler.md)は、DCEをすぐにサポートしており、[`@JsExport`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-export/)アノテーションを使用すると、DCE中に保持するKotlin関数とクラスを指定できます。

*   非推奨の`kotlin-android-extensions`プラグインは[Kotlin 2.2.0で削除されました](compatibility-guide-22.md#deprecate-kotlin-android-extensions-plugin)。
    `Parcelable`実装ジェネレーターには`kotlin-parcelize`プラグインを、合成ビューにはAndroid Jetpackの[ビューバインディング](https://developer.android.com/topic/libraries/view-binding)を使用してください。
*   実験的な`kotlinArtifacts` APIは[Kotlin 2.2.0で非推奨になりました](compatibility-guide-22.md#deprecate-kotlinartifacts-api)。
    最終的なネイティブバイナリをビルドするには、Kotlin Gradleプラグインで利用可能な現在のDSLを使用してください。[移行に不十分な場合は、[このYouTrack issue](https://youtrack.jetbrains.com/issue/KT-74953)にコメントを残してください。
*   Kotlin 1.9.0で非推奨になった`KotlinCompilation.source`は、[Kotlin Gradleプラグインから削除されました](compatibility-guide-22.md#deprecate-kotlincompilation-source-api)。
*   実験的なcommonizationモードのパラメータは[Kotlin 2.2.0で非推奨になりました](compatibility-guide-22.md#deprecate-commonization-parameters)。
    無効なコンパイル成果物を削除するには、commonizationキャッシュをクリアしてください。
*   非推奨の`konanVersion`プロパティは、[`CInteropProcess`タスクから削除されました](compatibility-guide-22.md#deprecate-konanversion-in-cinteropprocess)。
    代わりに`CInteropProcess.kotlinNativeVersion`を使用してください。
*   非推奨の`destinationDir`プロパティの使用は、[エラーになります](compatibility-guide-22.md#deprecate-destinationdir-in-cinteropprocess)。
    代わりに`CInteropProcess.destinationDirectory.set()`を使用してください。

## ドキュメントの更新

このリリースでは、Kotlin Multiplatformのドキュメントが[KMPポータル](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)に移行されるなど、注目すべきドキュメントの変更が行われました。

さらに、ドキュメントに関するアンケートを開始し、新しいページやチュートリアルを作成・改訂しました。

### Kotlinドキュメントに関するアンケート

Kotlinドキュメントをより良くするために、皆様からの率直なフィードバックを求めています。

アンケートの所要時間は約15分です。皆様の意見がKotlinドキュメントの未来を形作るのに役立ちます。

[こちらからアンケートにご回答ください](https://surveys.jetbrains.com/s3/Kotlin-Docs-2025)。

### 新しいチュートリアルと改訂されたチュートリアル

*   [Kotlin中級ツアー](kotlin-tour-welcome.md) – Kotlinの理解を次のレベルへと進めましょう。拡張関数、インターフェース、クラスなどをいつ使用すべきか学びます。
*   [Spring AIを使用するKotlinアプリを構築する](spring-ai-guide.md) – OpenAIとベクトルデータベースを使用して質問に答えるKotlinアプリを作成する方法を学びます。
*   [GradleでSpring Bootプロジェクトを作成する](jvm-create-project-with-spring-boot.md) – IntelliJ IDEAの**New Project**ウィザードを使用して、GradleでSpring Bootプロジェクトを作成する方法を学びます。
*   [KotlinとCのマッピングチュートリアルシリーズ](mapping-primitive-data-types-from-c.md) – KotlinとCの間でさまざまな型と構造がどのようにマッピングされるかを学びます。
*   [C interopとlibcurlを使用してアプリを作成する](native-app-with-c-and-libcurl.md) – libcurl Cライブラリを使用してネイティブで実行できるシンプルなHTTPクライアントを作成します。
*   [Kotlin Multiplatformライブラリを作成する](https://www.jetbrains.com/help/kotlin-multiplatform-dev/create-kotlin-multiplatform-library.html) – IntelliJ IDEAを使用してマルチプラットフォームライブラリを作成および公開する方法を学びます。
*   [KtorとKotlin Multiplatformでフルスタックアプリケーションを構築する](https://ktor.io/docs/full-stack-development-with-kotlin-multiplatform.html) – このチュートリアルでは、Fleetの代わりにIntelliJ IDEAを使用し、Material 3とKtorおよびKotlinの最新バージョンを使用するようになりました。
*   [Compose Multiplatformアプリでローカルリソース環境を管理する](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-resource-environment.html) – アプリケーションのテーマや言語など、アプリ内リソース環境を管理する方法を学びます。

### 新しいページと改訂されたページ

*   [Kotlin for AI概要](kotlin-ai-apps-development-overview.md) – AI搭載アプリケーションを構築するためのKotlinの機能を学びます。
*   [Dokka移行ガイド](https://kotlinlang.org/docs/dokka-migration.html) – Dokka Gradleプラグインのv2への移行方法を学びます。
*   [Kotlinメタデータ](metadata-jvm.md) – JVM用にコンパイルされたKotlinクラスのメタデータを読み取り、変更、生成する方法に関するガイダンスを探ります。
*   [CocoaPods統合](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html) – チュートリアルとサンプルプロジェクトを通じて、環境の設定、Pod依存関係の追加、KotlinプロジェクトをCocoaPod依存関係として使用する方法を学びます。
*   iOS安定版リリースをサポートするためのCompose Multiplatformの新しいページ:
    *   [ナビゲーション](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-navigation.html)と特に[ディープリンク](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-navigation-deep-links.html)。
    *   [Composeでのレイアウトの実装](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-layout.html)。
    *   [文字列のローカライズ](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-localize-strings.html)や、RTL言語のサポートなど他の国際化ページ。
*   [Compose Hot Reload](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-hot-reload.html) – デスクトップターゲットでCompose Hot Reloadを使用する方法と、既存のプロジェクトに追加する方法を学びます。
*   [Exposedマイグレーション](https://www.jetbrains.com/help/exposed/migrations.html) – Exposedがデータベーススキーマの変更を管理するために提供するツールについて学びます。

## Kotlin 2.2.0へのアップデート方法

Kotlinプラグインは、IntelliJ IDEAおよびAndroid Studioにバンドルされたプラグインとして配布されます。

新しいKotlinバージョンにアップデートするには、ビルドスクリプトで[Kotlinのバージョンを2.2.0に変更する](releases.md#update-to-a-new-kotlin-version)だけです。