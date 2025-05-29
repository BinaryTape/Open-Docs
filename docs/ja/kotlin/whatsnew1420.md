[//]: # (title: Kotlin 1.4.20の新機能)

_[公開日: 2020年11月23日](releases.md#release-details)_

Kotlin 1.4.20は、多数の新しい実験的機能を提供し、1.4.0で追加されたものを含む既存機能の修正と改善をもたらします。

[このブログ投稿](https://blog.jetbrains.com/kotlin/2020/11/kotlin-1-4-20-released/)で、より多くの例とともに新機能について学ぶこともできます。

## Kotlin/JVM

Kotlin/JVMの改善は、最新のJavaバージョンの機能に対応することを目的としています。

- [Java 15ターゲット](#java-15-target)
- [invokedynamicによる文字列連結](#invokedynamic-string-concatenation)

### Java 15ターゲット

Java 15がKotlin/JVMターゲットとして利用可能になりました。

### invokedynamicによる文字列連結

> `invokedynamic`による文字列連結は[実験的](components-stability.md)です。いつでも削除または変更される可能性があります。オプトインが必要です（詳細は下記を参照）。評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issues/KT)でフィードバックをお寄せください。
>
{style="warning"}

Kotlin 1.4.20は、JVM 9以降のターゲットで文字列連結を[動的呼び出し](https://docs.oracle.com/javase/7/docs/technotes/guides/vm/multiple-language-support.html#invokedynamic)にコンパイルできるため、パフォーマンスが向上します。

現在、この機能は実験的であり、以下のケースをカバーしています。
- 演算子形式 (`a + b`)、明示形式 (`a.plus(b)`)、参照形式 (`(a::plus)(b)`) の`String.plus`。
- インラインクラスとデータクラスの`toString`。
- 単一の非定数引数を持つ文字列テンプレートを除くすべて（[KT-42457](https://youtrack.jetbrains.com/issue/KT-42457)を参照）。

`invokedynamic`による文字列連結を有効にするには、以下のいずれかの値を指定して`-Xstring-concat`コンパイラオプションを追加します。
- `indy-with-constants` を指定すると、[StringConcatFactory.makeConcatWithConstants()](https://docs.oracle.com/javase/9/docs/api/java/lang/invoke/StringConcatFactory.html#makeConcatWithConstants-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-java.lang.String-java.lang.Object...-)を使用して文字列の`invokedynamic`連結を実行します。
- `indy` を指定すると、[StringConcatFactory.makeConcat()](https://docs.oracle.com/javase/9/docs/api/java/lang/invoke/StringConcatFactory.html#makeConcat-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-)を使用して文字列の`invokedynamic`連結を実行します。
- `inline` を指定すると、`StringBuilder.append()`による従来の連結に戻します。

## Kotlin/JS

Kotlin/JSは急速に進化を続けており、1.4.20では多数の実験的機能と改善点が見られます。

- [Gradle DSLの変更](#gradle-dsl-changes)
- [新しいウィザードテンプレート](#new-wizard-templates)
- [IRコンパイラでのコンパイルエラーの無視](#ignoring-compilation-errors-with-ir-compiler)

### Gradle DSLの変更

Kotlin/JSのGradle DSLには、プロジェクトのセットアップとカスタマイズを簡素化する多数の更新が含まれています。これには、webpack構成の調整、自動生成された`package.json`ファイルの変更、および推移的依存関係の制御の改善が含まれます。

#### webpack設定の一元化

ブラウザターゲット向けに、新しい設定ブロック`commonWebpackConfig`が利用可能になりました。その中で、`webpackTask`、`runTask`、`testTask`の構成を重複させることなく、共通の設定を単一のポイントから調整できます。

3つのタスクすべてでCSSサポートをデフォルトで有効にするには、プロジェクトの`build.gradle(.kts)`に以下のスニペットを追加します。

```groovy
browser {
    commonWebpackConfig {
        cssSupport.enabled = true
    }
    binaries.executable()
}
```

[webpackバンドルの設定](js-project-setup.md#webpack-bundling)について詳しく学びます。

#### Gradleからの`package.json`のカスタマイズ

Kotlin/JSのパッケージ管理と配布をより詳細に制御するために、Gradle DSLを介してプロジェクトファイル[`package.json`](https://nodejs.dev/learn/the-package-json-guide)にプロパティを追加できるようになりました。

`package.json`にカスタムフィールドを追加するには、コンパイルの`packageJson`ブロックで`customField`関数を使用します。

```kotlin
kotlin {
    js(BOTH) {
        compilations["main"].packageJson {
            customField("hello", mapOf("one" to 1, "two" to 2))
        }
    }
}
```

[`package.json`のカスタマイズ](js-project-setup.md#package-json-customization)について詳しく学びます。

#### Yarnの選択的依存関係解決

> Yarnの選択的依存関係解決のサポートは[実験的](components-stability.md)です。いつでも削除または変更される可能性があります。評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issues/KT)でフィードバックをお寄せください。
>
{style="warning"}

Kotlin 1.4.20では、Yarnの[選択的依存関係解決](https://classic.yarnpkg.com/en/docs/selective-version-resolutions/)を構成する方法が提供されます。これは、依存するパッケージの依存関係を上書きするメカニズムです。

これはGradleの`YarnPlugin`内の`YarnRootExtension`を通じて使用できます。プロジェクトのパッケージの解決済みバージョンに影響を与えるには、パッケージ名セレクター（Yarnで指定されたもの）と解決されるべきバージョンを渡して`resolution`関数を使用します。

```kotlin
rootProject.plugins.withType<YarnPlugin> {
    rootProject.the<YarnRootExtension>().apply {
        resolution("react", "16.0.0")
        resolution("processor/decamelize", "3.0.0")
    }
}
```

ここでは、`react`を必要とするすべてのnpm依存関係がバージョン`16.0.0`を受け取り、`processor`はその依存関係である`decamelize`をバージョン`3.0.0`として受け取ります。

#### 細分化されたワークスペースの無効化

> 細分化されたワークスペースの無効化は[実験的](components-stability.md)です。いつでも削除または変更される可能性があります。評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issues/KT)でフィードバックをお寄せください。
>
{style="warning"}

ビルド時間を短縮するため、Kotlin/JS Gradleプラグインは、特定のGradleタスクに必要な依存関係のみをインストールします。たとえば、`webpack-dev-server`パッケージは、`*Run`タスクのいずれかを実行するときにのみインストールされ、assembleタスクを実行するときにはインストールされません。このような振る舞いは、複数のGradleプロセスを並行して実行する場合に問題を引き起こす可能性があります。依存関係の要件が衝突すると、npmパッケージの2つのインストールがエラーを引き起こす可能性があります。

この問題を解決するため、Kotlin 1.4.20には、これらのいわゆる_細分化されたワークスペース (granular workspaces)_を無効にするオプションが含まれています。この機能は現在、Gradleの`YarnPlugin`内の`YarnRootExtension`を通じて利用可能です。これを使用するには、`build.gradle.kts`ファイルに以下のスニペットを追加します。

```kotlin
rootProject.plugins.withType<YarnPlugin> {
    rootProject.the<YarnRootExtension>().disableGranularWorkspaces()
}
```

### 新しいウィザードテンプレート

プロジェクト作成時により便利な方法でプロジェクトをカスタマイズできるように、KotlinのプロジェクトウィザードにはKotlin/JSアプリケーション用の新しいテンプレートが付属しています。
- **Browser Application** - ブラウザで動作する最小限のKotlin/JS Gradleプロジェクト。
- **React Application** - 適切な`kotlin-wrappers`を使用するReactアプリ。スタイルシート、ナビゲーションコンポーネント、または状態コンテナの統合を有効にするオプションを提供します。
- **Node.js Application** - Node.jsランタイムで実行するための最小限のプロジェクト。実験的な`kotlinx-nodejs`パッケージを直接含めるオプションが付属しています。

### IRコンパイラでのコンパイルエラーの無視

> _コンパイルエラーの無視_モードは[実験的](components-stability.md)です。いつでも削除または変更される可能性があります。オプトインが必要です（詳細は下記を参照）。評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issues/KT)でフィードバックをお寄せください。
>
{style="warning"}

Kotlin/JSの[IRコンパイラ](js-ir-compiler.md)には、新しい実験的モード「_エラーを伴うコンパイル (compilation with errors)_」が搭載されています。このモードでは、コードにエラーが含まれていても実行できます。たとえば、アプリケーション全体がまだ準備できていないときに、特定の機能を試したい場合などに便利です。

このモードには2つの許容ポリシーがあります。
- `SEMANTIC`: コンパイラは、`val x: String = 3`のように、構文的には正しいが意味的に無意味なコードを受け入れます。

- `SYNTAX`: コンパイラは、構文エラーが含まれていても、任意のコードを受け入れます。

エラーを伴うコンパイルを許可するには、上記の値のいずれかを指定して`-Xerror-tolerance-policy=`コンパイラオプションを追加します。

[Kotlin/JS IRコンパイラについて詳しく学ぶ](js-ir-compiler.md)。

## Kotlin/Native

Kotlin/Nativeの1.4.20における優先事項は、パフォーマンスと既存機能の磨き上げです。以下は注目すべき改善点です。
- [エスケープ解析](#escape-analysis)
- [パフォーマンスの改善とバグ修正](#performance-improvements-and-bug-fixes)
- [Objective-C例外のオプトインによるラッピング](#opt-in-wrapping-of-objective-c-exceptions)
- [CocoaPodsプラグインの改善](#cocoapods-plugin-improvements)
- [Xcode 12ライブラリのサポート](#support-for-xcode-12-libraries)

### エスケープ解析

> エスケープ解析メカニズムは[実験的](components-stability.md)です。いつでも削除または変更される可能性があります。評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issues/KT)でフィードバックをお寄せください。
>
{style="warning"}

Kotlin/Nativeには、新しい[エスケープ解析](https://en.wikipedia.org/wiki/Escape_analysis)メカニズムのプロトタイプが搭載されました。これは、特定のオブジェクトをヒープではなくスタックに割り当てることで、ランタイムパフォーマンスを向上させます。このメカニズムは、我々のベンチマークで平均10%のパフォーマンス向上を示しており、プログラムをさらに高速化するために改善を続けています。

エスケープ解析は、リリースビルド（`-opt`コンパイラオプションを使用）の個別のコンパイルフェーズで実行されます。

エスケープ解析フェーズを無効にしたい場合は、`-Xdisable-phases=EscapeAnalysis`コンパイラオプションを使用します。

### パフォーマンスの改善とバグ修正

Kotlin/Nativeでは、1.4.0で追加された[コード共有メカニズム](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-on-similar-platforms)を含む、様々なコンポーネントでパフォーマンスの改善とバグ修正が行われています。

### Objective-C例外のオプトインによるラッピング

> Objective-C例外のラッピングメカニズムは[実験的](components-stability.md)です。いつでも削除または変更される可能性があります。オプトインが必要です（詳細は下記を参照）。評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issues/KT)でフィードバックをお寄せください。
>
{style="warning"}

Kotlin/Nativeは、プログラムのクラッシュを回避するために、Objective-Cコードからスローされた例外をランタイムで処理できるようになりました。

`NSException`を`ForeignException`型のKotlin例外にラップすることを選択（オプトイン）できます。これらは元の`NSException`への参照を保持します。これにより、根本原因に関する情報を取得し、適切に処理できます。

Objective-C例外のラッピングを有効にするには、`cinterop`呼び出しで`-Xforeign-exception-mode objc-wrap`オプションを指定するか、`.def`ファイルに`foreignExceptionMode = objc-wrap`プロパティを追加します。[CocoaPods連携](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html)を使用している場合は、依存関係の`pod {}`ビルドスクリプトブロックで次のようにオプションを指定します。

```kotlin
pod("foo") {
    extraOpts = listOf("-Xforeign-exception-mode", "objc-wrap")
}
```

デフォルトの動作は変更されていません。Objective-Cコードから例外がスローされた場合、プログラムは終了します。

### CocoaPodsプラグインの改善

Kotlin 1.4.20では、CocoaPods連携の改善が継続されています。具体的には、以下の新機能を試すことができます。

- [改善されたタスク実行](#improved-task-execution)
- [拡張されたDSL](#extended-dsl)
- [Xcodeとの連携の更新](#updated-integration-with-xcode)

#### 改善されたタスク実行

CocoaPodsプラグインは、タスク実行フローが改善されました。たとえば、新しいCocoaPods依存関係を追加しても、既存の依存関係は再ビルドされません。追加のターゲットを追加しても、既存のターゲットの依存関係の再ビルドには影響しません。

#### 拡張されたDSL

Kotlinプロジェクトに[CocoaPods](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html)依存関係を追加するためのDSLに新しい機能が追加されました。

ローカルのPodやCocoaPodsリポジトリからのPodに加えて、以下の種類のライブラリへの依存関係を追加できます。
* カスタムspecリポジトリからのライブラリ。
* Gitリポジトリからのリモートライブラリ。
* アーカイブからのライブラリ（任意のHTTPアドレスでも利用可能）。
* 静的ライブラリ。
* カスタムcinteropオプションを持つライブラリ。

Kotlinプロジェクトでの[CocoaPods依存関係の追加](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-libraries.html)について詳しく学びます。
[Kotlin with CocoaPodsサンプル](https://github.com/Kotlin/kmm-with-cocoapods-sample)で例を見つけることができます。

#### Xcodeとの連携の更新

Xcodeと正しく連携するために、KotlinはいくつかのPodfileの変更を必要とします。

* Kotlin PodにGit、HTTP、またはspecRepo Podの依存関係がある場合、それもPodfileで指定する必要があります。
* カスタムspecからライブラリを追加する場合、Podfileの冒頭でspecの[場所](https://guides.cocoapods.org/syntax/podfile.html#source)も指定する必要があります。

現在、IDEAでの連携エラーには詳細な説明が表示されます。そのため、Podfileに問題がある場合、すぐに修正方法がわかります。

[Kotlin Podの作成](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-xcode.html)について詳しく学びます。

### Xcode 12ライブラリのサポート

Xcode 12で提供される新しいライブラリのサポートを追加しました。Kotlinコードからそれらを使用できるようになりました。

## Kotlin Multiplatform

### マルチプラットフォームライブラリ公開の構造変更

Kotlin 1.4.20以降、個別のメタデータ公開はなくなりました。メタデータ成果物は、ライブラリ全体を表す_ルート_公開に含まれるようになり、共通ソースセットへの依存関係として追加されると、適切なプラットフォーム固有の成果物に自動的に解決されます。

[マルチプラットフォームライブラリの公開](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-lib-setup.html)について詳しく学びます。

#### 以前のバージョンとの互換性

この構造の変更により、[階層型プロジェクト構造](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-on-similar-platforms)を持つプロジェクト間の互換性が損なわれます。マルチプラットフォームプロジェクトとそれが依存するライブラリの両方が階層型プロジェクト構造を持っている場合、それらをKotlin 1.4.20以降に同時に更新する必要があります。Kotlin 1.4.20で公開されたライブラリは、以前のバージョンで公開されたプロジェクトからは使用できません。

階層型プロジェクト構造を持たないプロジェクトとライブラリは互換性が維持されます。

## 標準ライブラリ

Kotlin 1.4.20の標準ライブラリは、ファイル操作のための新しい拡張機能と、より優れたパフォーマンスを提供します。

- [java.nio.file.Path用の拡張機能](#extensions-for-java-nio-file-path)
- [String.replace関数のパフォーマンス向上](#improved-string-replace-function-performance)

### java.nio.file.Path用の拡張機能

> `java.nio.file.Path`用の拡張機能は[実験的](components-stability.md)です。いつでも削除または変更される可能性があります。オプトインが必要です（詳細は下記を参照）。評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issues/KT)でフィードバックをお寄せください。
>
{style="warning"}

現在、標準ライブラリは`java.nio.file.Path`用の実験的な拡張機能を提供しています。現代のJVMファイルAPIをKotlinらしい方法で操作することが、`kotlin.io`パッケージの`java.io.File`拡張機能と似たような感覚でできるようになりました。

```kotlin
// construct path with the div (/) operator
val baseDir = Path("/base")
val subDir = baseDir / "subdirectory" 

// list files in a directory
val kotlinFiles: List<Path> = Path("/home/user").listDirectoryEntries("*.kt")
```

この拡張機能は、`kotlin-stdlib-jdk7`モジュールの`kotlin.io.path`パッケージで利用できます。
拡張機能を使用するには、実験的アノテーション`@ExperimentalPathApi`に[オプトイン](opt-in-requirements.md)する必要があります。

### String.replace関数のパフォーマンス向上

`String.replace()`の新しい実装により、関数の実行が高速化されました。大文字と小文字を区別するバリアントは`indexOf`に基づく手動置換ループを使用し、大文字と小文字を区別しないバリアントは正規表現マッチングを使用します。

## Kotlin Android Extensions

1.4.20では、Kotlin Android Extensionsプラグインが非推奨となり、`Parcelable`実装ジェネレーターは別のプラグインに移行します。

- [Synthetic viewsの非推奨化](#deprecation-of-synthetic-views)
- [Parcelable実装ジェネレーター用の新しいプラグイン](#new-plugin-for-parcelable-implementation-generator)

### Synthetic viewsの非推奨化

_Synthetic views_は、UI要素との相互作用を簡素化し、ボイラープレートを削減するために、以前Kotlin Android Extensionsプラグインで導入されました。現在、Googleは同じことを行うネイティブメカニズムであるAndroid Jetpackの[ビューバインディング](https://developer.android.com/topic/libraries/view-binding)を提供しており、私たちはSynthetic viewsをこれらに置き換える形で非推奨にしています。

`kotlin-android-extensions`から`Parcelable`実装ジェネレーターを抽出し、残りの部分であるSynthetic viewsの非推奨化サイクルを開始します。今のところ、これらは非推奨の警告とともに動作し続けます。将来的には、プロジェクトを別のソリューションに切り替える必要があります。[SyntheticsからビューバインディングにAndroidプロジェクトを移行するのに役立つガイドライン](https://goo.gle/kotlin-android-extensions-deprecation)はこちらです。

### Parcelable実装ジェネレーター用の新しいプラグイン

`Parcelable`実装ジェネレーターは、新しい`kotlin-parcelize`プラグインで利用可能になりました。`kotlin-android-extensions`の代わりにこのプラグインを適用してください。

>`kotlin-parcelize` と `kotlin-android-extensions` は1つのモジュールで同時に適用することはできません。
>
{style="note"}

`@Parcelize`アノテーションは`kotlinx.parcelize`パッケージに移動しました。

`Parcelable`実装ジェネレーターについては、[Androidドキュメント](https://developer.android.com/kotlin/parcelize)で詳しく学ぶことができます。