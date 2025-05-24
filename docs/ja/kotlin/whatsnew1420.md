---
title: "Kotlin 1.4.20の新機能"
---
_[リリース: 2020年11月23日](releases#release-details)_

Kotlin 1.4.20では、いくつかの新しい試験的な機能が提供され、1.4.0で追加されたものを含む既存の機能に対する修正と改善が行われています。

[こちらのブログ記事](https://blog.jetbrains.com/kotlin/2020/11/kotlin-1-4-20-released/)では、より多くの例とともに新機能について学ぶことができます。

## Kotlin/JVM

Kotlin/JVMの改善は、最新のJavaバージョンの機能に対応することを目的としています。

- [Java 15 target](#java-15-target)
- [invokedynamic string concatenation](#invokedynamic-string-concatenation)

### Java 15 target

Java 15がKotlin/JVMのtargetとして利用可能になりました。

### invokedynamic string concatenation

:::note
`invokedynamic` string concatenationは[Experimental](components-stability)です。予告なく削除または変更される可能性があります。オプトインが必要です（詳細は下記参照）。評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issues/KT)でフィードバックをお寄せください。

Kotlin 1.4.20では、文字列連結をJVM 9+ targets上の[dynamic invocations](https://docs.oracle.com/javase/7/docs/technotes/guides/vm/multiple-language-support.html#invokedynamic)にコンパイルできるため、パフォーマンスが向上します。

現在、この機能は試験的であり、以下のケースを対象としています。
- 演算子 (`a + b`)、明示的 (`a.plus(b)`)、および参照 (`(a::plus)(b)`) 形式の`String.plus`。
- インラインクラスおよびデータクラスの`toString`。
- 単一の非定数引数を持つものを除く、文字列テンプレート（[KT-42457](https://youtrack.jetbrains.com/issue/KT-42457)を参照）。

`invokedynamic` string concatenationを有効にするには、次のいずれかの値を持つ`-Xstring-concat`コンパイラオプションを追加します。
- [StringConcatFactory.makeConcatWithConstants()](https://docs.oracle.com/javase/9/docs/api/java/lang/invoke/StringConcatFactory.html#makeConcatWithConstants-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-java.lang.String-java.lang.Object...-)を使用して、文字列に対して`invokedynamic` concatenationを実行する`indy-with-constants`。
- [StringConcatFactory.makeConcat()](https://docs.oracle.com/javase/9/docs/api/java/lang/invoke/StringConcatFactory.html#makeConcat-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-)を使用して、文字列に対して`invokedynamic` concatenationを実行する`indy`。
- `StringBuilder.append()`による従来の連結に戻す`inline`。

## Kotlin/JS

Kotlin/JSは急速に進化しており、1.4.20では多くの試験的な機能と改善点が見られます。

- [Gradle DSL changes](#gradle-dsl-changes)
- [New Wizard templates](#new-wizard-templates)
- [Ignoring compilation errors with IR compiler](#ignoring-compilation-errors-with-ir-compiler)

### Gradle DSL changes

Kotlin/JSのGradle DSLは、プロジェクトのセットアップとカスタマイズを簡素化する多くの更新を受けます。これには、webpack構成の調整、自動生成された`package.json`ファイルの変更、および推移的な依存関係の制御の改善が含まれます。

#### Single point for webpack configuration

ブラウザtargetには、新しい構成ブロック`commonWebpackConfig`が用意されています。その中で、`webpackTask`、`runTask`、および`testTask`の構成を複製する代わりに、単一のポイントから共通設定を調整できます。

3つのタスクすべてに対してCSSサポートをデフォルトで有効にするには、プロジェクトの`build.gradle(.kts)`に次のスニペットを追加します。

```groovy
browser {
    commonWebpackConfig {
        cssSupport.enabled = true
    }
    binaries.executable()
}
```

[webpack bundlingの設定](js-project-setup#webpack-bundling)について詳しくはこちらをご覧ください。

#### package.json customization from Gradle

Kotlin/JSパッケージの管理と配布をより詳細に制御するために、Gradle DSLを介してプロジェクトファイル[`package.json`](https://nodejs.dev/learn/the-package-json-guide)にプロパティを追加できるようになりました。

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

[`package.json`のカスタマイズ](js-project-setup#package-json-customization)について詳しくはこちらをご覧ください。

#### Selective yarn dependency resolutions

selective yarn dependency resolutionsのサポートは[Experimental](components-stability)です。予告なく削除または変更される可能性があります。評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issues/KT)でフィードバックをお寄せください。

Kotlin 1.4.20では、Yarnの[selective dependency resolutions](https://classic.yarnpkg.com/en/docs/selective-version-resolutions/)（依存するパッケージの依存関係をオーバーライドするメカニズム）を構成する方法が提供されています。

これは、Gradleの`YarnPlugin`内の`YarnRootExtension`を介して使用できます。プロジェクトの解決済みパッケージのバージョンに影響を与えるには、パッケージ名セレクター（Yarnで指定されているとおり）と解決先のバージョンを渡す`resolution`関数を使用します。

```kotlin
rootProject.plugins.withType<YarnPlugin> {
    rootProject.the<YarnRootExtension>().apply {
        resolution("react", "16.0.0")
        resolution("processor/decamelize", "3.0.0")
    }
}
```

ここで、`react`を必要とする_すべての_ npm依存関係はバージョン`16.0.0`を受け取り、`processor`はその依存関係`decamelize`をバージョン`3.0.0`として受け取ります。

#### Disabling granular workspaces

granular workspacesの無効化は[Experimental](components-stability)です。予告なく削除または変更される可能性があります。評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issues/KT)でフィードバックをお寄せください。

ビルド時間を短縮するために、Kotlin/JS Gradleプラグインは、特定のGradleタスクに必要な依存関係のみをインストールします。たとえば、`webpack-dev-server`パッケージは、`*Run`タスクのいずれかを実行した場合にのみインストールされ、assembleタスクを実行した場合はインストールされません。このような動作は、複数のGradleプロセスを並行して実行する場合に問題を引き起こす可能性があります。依存関係の要件が競合すると、npmパッケージの2つのインストールがエラーを引き起こす可能性があります。

この問題を解決するために、Kotlin 1.4.20には、これらのいわゆる_granular workspaces_を無効にするオプションが含まれています。この機能は現在、Gradleの`YarnPlugin`内の`YarnRootExtension`を介して利用可能です。これを使用するには、次のスニペットを`build.gradle.kts`ファイルに追加します。

```kotlin
rootProject.plugins.withType<YarnPlugin> {
    rootProject.the<YarnRootExtension>().disableGranularWorkspaces()
}
```

### New Wizard templates

プロジェクトの作成時により便利なカスタマイズ方法を提供するために、Kotlinのプロジェクトウィザードには、Kotlin/JSアプリケーション用の新しいテンプレートが付属しています。
- **Browser Application** - ブラウザで実行される最小限のKotlin/JS Gradleプロジェクト。
- **React Application** - 適切な`kotlin-wrappers`を使用するReactアプリ。
    スタイルシート、ナビゲーションコンポーネント、または状態コンテナの統合を有効にするオプションが用意されています。
- **Node.js Application** - Node.jsランタイムで実行するための最小限のプロジェクト。実験的な`kotlinx-nodejs`パッケージを直接含めるオプションが付属しています。

### Ignoring compilation errors with IR compiler

_Ignore compilation errors_モードは[Experimental](components-stability)です。予告なく削除または変更される可能性があります。オプトインが必要です（詳細は下記参照）。評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issues/KT)でフィードバックをお寄せください。

Kotlin/JSの[IRコンパイラ](js-ir-compiler)には、新しい実験的なモードである_compilation with errors_が付属しています。このモードでは、たとえば、アプリケーション全体がまだ準備できていない場合に特定のこと試したい場合に、エラーが含まれていてもコードを実行できます。
 
このモードには、次の2つのトレランスポリシーがあります。
- `SEMANTIC`: コンパイラは構文的には正しいが、意味的に意味をなさないコード（`val x: String = 3`など）を受け入れます。

- `SYNTAX`: コンパイラは、構文エラーが含まれていても、すべてのコードを受け入れます。

エラーのあるコンパイルを許可するには、上記のいずれかの値を持つ`-Xerror-tolerance-policy=`コンパイラオプションを追加します。

[Kotlin/JS IRコンパイラ](js-ir-compiler)について詳しくはこちらをご覧ください。

## Kotlin/Native

Kotlin/Nativeの1.4.20での優先事項は、パフォーマンスと既存の機能の改良です。注目すべき改善点は次のとおりです。
  
- [Escape analysis](#escape-analysis)
- [Performance improvements and bug fixes](#performance-improvements-and-bug-fixes)
- [Opt-in wrapping of Objective-C exceptions](#opt-in-wrapping-of-objective-c-exceptions)
- [CocoaPods plugin improvements](#cocoapods-plugin-improvements)
- [Support for Xcode 12 libraries](#support-for-xcode-12-libraries)

### Escape analysis

escape analysisメカニズムは[Experimental](components-stability)です。予告なく削除または変更される可能性があります。評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issues/KT)でフィードバックをお寄せください。

Kotlin/Nativeは、新しい[escape analysis](https://en.wikipedia.org/wiki/Escape_analysis)メカニズムのプロトタイプを受け取ります。これにより、特定のオブジェクトをヒープではなくスタックに割り当てることで、ランタイムパフォーマンスが向上します。このメカニズムは、ベンチマークで平均10％のパフォーマンス向上を示しており、プログラムをさらに高速化できるように改善を続けています。

escape analysisは、リリースビルド（`-opt`コンパイラオプション付き）の別のコンパイルフェーズで実行されます。

escape analysisフェーズを無効にする場合は、`-Xdisable-phases=EscapeAnalysis`コンパイラオプションを使用します。

### Performance improvements and bug fixes

Kotlin/Nativeは、[コード共有メカニズム](multiplatform-share-on-platforms#share-code-on-similar-platforms)など、1.4.0で追加されたものを含む、さまざまなコンポーネントでパフォーマンスの改善とバグ修正を受けています。

### Opt-in wrapping of Objective-C exceptions

Objective-C exception wrappingメカニズムは[Experimental](components-stability)です。予告なく削除または変更される可能性があります。オプトインが必要です（詳細は下記参照）。評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issues/KT)でフィードバックをお寄せください。

Kotlin/Nativeは、プログラムのクラッシュを回避するために、Objective-Cコードからスローされた例外を実行時に処理できるようになりました。

`NSException`を`ForeignException`型のKotlin例外にラップすることを選択できます。これらは元の`NSException`への参照を保持します。これにより、根本原因に関する情報を取得し、適切に処理できます。

Objective-C例外のラッピングを有効にするには、`cinterop`呼び出しで`-Xforeign-exception-mode objc-wrap`オプションを指定するか、`.def`ファイルに`foreignExceptionMode = objc-wrap`プロパティを追加します。[CocoaPods integration](native-cocoapods)を使用している場合は、次のように依存関係の`pod {}`ビルドスクリプトブロックでオプションを指定します。

```kotlin
pod("foo") {
    extraOpts = listOf("-Xforeign-exception-mode", "objc-wrap")
}
```

デフォルトの動作は変更されていません。Objective-Cコードから例外がスローされると、プログラムは終了します。

### CocoaPods plugin improvements

Kotlin 1.4.20では、CocoaPods integrationの改善が引き続き行われています。具体的には、次の新機能を試すことができます。

- [Improved task execution](#improved-task-execution)
- [Extended DSL](#extended-dsl)
- [Updated integration with Xcode](#updated-integration-with-xcode)

#### Improved task execution

CocoaPodsプラグインは、タスク実行フローが改善されています。たとえば、新しいCocoaPods依存関係を追加した場合、既存の依存関係は再構築されません。追加のtargetを追加しても、既存のtargetの依存関係の再構築には影響しません。

#### Extended DSL

Kotlinプロジェクトに[CocoaPods](native-cocoapods)依存関係を追加するためのDSLは、新しい機能を受け取ります。

ローカルのPodsおよびCocoaPodsリポジトリからのPodsに加えて、次の種類のライブラリへの依存関係を追加できます。
* カスタムspecリポジトリからのライブラリ。
* Gitリポジトリからのリモートライブラリ。
* アーカイブからのライブラリ（任意のHTTPアドレスでも利用可能）。
* 静的ライブラリ。
* カスタムcinteropオプションを持つライブラリ。

Kotlinプロジェクトでの[CocoaPods依存関係の追加](native-cocoapods-libraries)について詳しくはこちらをご覧ください。[Kotlin with CocoaPods sample](https://github.com/Kotlin/kmm-with-cocoapods-sample)で例を見つけてください。

#### Updated integration with Xcode

Xcodeで正しく動作させるには、KotlinにはいくつかのPodfileの変更が必要です。

* Kotlin PodにGit、HTTP、またはspecRepo Pod依存関係がある場合は、Podfileにも指定する必要があります。
* カスタムspecからライブラリを追加する場合は、Podfileの先頭でspecの[location](https://guides.cocoapods.org/syntax/podfile.html#source)も指定する必要があります。

IDEAでintegrationエラーの詳細な説明が表示されるようになりました。Podfileに問題がある場合は、すぐに修正方法がわかります。

[Kotlin podsの作成](native-cocoapods-xcode)について詳しくはこちらをご覧ください。

### Support for Xcode 12 libraries
    
Xcode 12で提供される新しいライブラリのサポートを追加しました。Kotlinコードから使用できるようになりました。

## Kotlin Multiplatform

### Updated structure of multiplatform library publications 

Kotlin 1.4.20以降、個別のメタデータ公開はなくなりました。メタデータアーティファクトは、ライブラリ全体を表す_ルート_公開に含まれるようになりました。これは、共通ソースセットへの依存関係として追加されると、適切なプラットフォーム固有のアーティファクトに自動的に解決されます。

[マルチプラットフォームライブラリの公開](multiplatform-publish-lib)について詳しくはこちらをご覧ください。

#### Compatibility with earlier versions

この構造の変更により、[階層型プロジェクト構造](multiplatform-share-on-platforms#share-code-on-similar-platforms)を持つプロジェクト間の互換性が損なわれます。マルチプラットフォームプロジェクトと依存するライブラリの両方が階層型プロジェクト構造を持っている場合は、Kotlin 1.4.20以降に同時に更新する必要があります。Kotlin 1.4.20で公開されたライブラリは、以前のバージョンで公開されたプロジェクトからは使用できません。

階層型プロジェクト構造を持たないプロジェクトおよびライブラリは、互換性が維持されます。

## Standard library

Kotlin 1.4.20の標準ライブラリには、ファイル操作用の新しい拡張機能と、より優れたパフォーマンスが提供されています。

- [Extensions for java.nio.file.Path](#extensions-for-java-nio-file-path)
- [Improved String.replace function performance](#improved-string-replace-function-performance)

### Extensions for java.nio.file.Path

`java.nio.file.Path`の拡張機能は[Experimental](components-stability)です。予告なく削除または変更される可能性があります。オプトインが必要です（詳細は下記参照）。評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issues/KT)でフィードバックをお寄せください。

標準ライブラリは、`java.nio.file.Path`の実験的な拡張機能を提供するようになりました。現代的なJVMファイルAPIをKotlinらしい方法で使用することは、`kotlin.io`パッケージの`java.io.File`拡張機能を使用することと似ています。

```kotlin
// div (/)演算子でパスを構築します
val baseDir = Path("/base")
val subDir = baseDir / "subdirectory" 

// ディレクトリ内のファイルを一覧表示します
val kotlinFiles: List<Path> = Path("/home/user").listDirectoryEntries("*.kt")
```

拡張機能は、`kotlin-stdlib-jdk7`モジュールの`kotlin.io.path`パッケージで利用できます。拡張機能を使用するには、実験的なアノテーション`@ExperimentalPathApi`に[オプトイン](opt-in-requirements)します。

### Improved String.replace function performance

`String.replace()`の新しい実装により、関数の実行が高速化されます。大文字と小文字を区別するvariantは`indexOf`に基づく手動の置換ループを使用し、大文字と小文字を区別しないvariantは正規表現マッチングを使用します。

## Kotlin Android Extensions

1.4.20では、Kotlin Android Extensionsプラグインは非推奨となり、`Parcelable`実装ジェネレーターは別のプラグインに移動します。

- [Deprecation of synthetic views](#deprecation-of-synthetic-views)
- [New plugin for Parcelable implementation generator](#new-plugin-for-parcelable-implementation-generator)

### Deprecation of synthetic views

_Synthetic views_は、UI要素とのやり取りを簡素化し、ボイラープレートを削減するために、少し前にKotlin Android Extensionsプラグインで提示されました。現在、Googleは同じことを行うネイティブメカニズムを提供しています。Android Jetpackの[view bindings](https://developer.android.com/topic/libraries/view-binding)です。そのため、これらの支持のためにsynthetic viewsは非推奨になります。

`kotlin-android-extensions`からParcelable実装ジェネレーターを抽出し、残りのsynthetic viewsに対して非推奨サイクルを開始します。今のところ、非推奨の警告が表示されますが、引き続き動作します。将来的には、プロジェクトを別のソリューションに切り替える必要があります。syntheticsからview bindingsにAndroidプロジェクトを移行するのに役立つ[ガイドライン](https://goo.gle/kotlin-android-extensions-deprecation)を次に示します。

### New plugin for Parcelable implementation generator

`Parcelable`実装ジェネレーターは、新しい`kotlin-parcelize`プラグインで利用できるようになりました。`kotlin-android-extensions`の代わりにこのプラグインを適用します。

`kotlin-parcelize`と`kotlin-android-extensions`を1つのモジュールに同時に適用することはできません。

:::

`@Parcelize`アノテーションは、`kotlinx.parcelize`パッケージに移動されました。

[Androidドキュメント](https://developer.android.com/kotlin/parcelize)で`Parcelable`実装ジェネレーターの詳細をご覧ください。