[//]: # (title: Kotlin 1.4.20 の新機能)

_[リリース日: 2020年11月23日](releases.md#release-details)_

Kotlin 1.4.20では、多数の新しい実験的機能が提供され、1.4.0で追加された機能を含む既存の機能に対する修正と改善が行われています。

新機能の詳細と多くの例については、[こちらのブログ記事](https://blog.jetbrains.com/kotlin/2020/11/kotlin-1-4-20-released/)も参照してください。

## Kotlin/JVM

Kotlin/JVMの改善は、最新のJavaバージョンの機能に対応することを目的としています。

- [Java 15ターゲット](#java-15-target)
- [invokedynamic文字列結合](#invokedynamic-string-concatenation)

### Java 15ターゲット

Java 15がKotlin/JVMのターゲットとして利用可能になりました。

### invokedynamic文字列結合

> `invokedynamic`文字列結合は[実験的機能](components-stability.md)です。将来的に削除または変更される可能性があります。利用にはオプトインが必要です（詳細は以下を参照）。評価目的でのみ使用してください。この機能に関するフィードバックは[YouTrack](https://youtrack.jetbrains.com/issues/KT)までお寄せください。
>
{style="warning"}

Kotlin 1.4.20では、文字列結合をJVM 9+ターゲット上で[動的呼び出し](https://docs.oracle.com/javase/7/docs/technotes/guides/vm/multiple-language-support.html#invokedynamic)にコンパイルできるようになり、パフォーマンスが向上します。

現在、この機能は実験的であり、以下のケースをカバーしています。
- 演算子形式 (`a + b`)、明示的な形式 (`a.plus(b)`)、および参照形式 (`(a::plus)(b)`) での `String.plus`。
- インラインクラスとデータクラスの`toString`。
- 単一の非定数引数を持つもの以外の文字列テンプレート（[KT-42457](https://youtrack.jetbrains.com/issue/KT-42457)を参照）。

`invokedynamic`文字列結合を有効にするには、以下のいずれかの値とともに`-Xstring-concat`コンパイラオプションを追加します。
- `indy-with-constants` を使用して文字列に`invokedynamic`結合を実行します。[StringConcatFactory.makeConcatWithConstants()](https://docs.oracle.com/javase/9/docs/api/java/lang/invoke/StringConcatFactory.html#makeConcatWithConstants-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-java.lang.String-java.lang.Object...-) を使用します。
- `indy` を使用して文字列に`invokedynamic`結合を実行します。[StringConcatFactory.makeConcat()](https://docs.oracle.com/javase/9/docs/api/java/lang/invoke/StringConcatFactory.html#makeConcat-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-) を使用します。
- `inline` を使用して`StringBuilder.append()`による従来の結合に戻します。

## Kotlin/JS

Kotlin/JSは急速に進化を続けており、1.4.20では多くの実験的機能と改善が導入されています。

- [Gradle DSLの変更](#gradle-dsl-changes)
- [新しいウィザードテンプレート](#new-wizard-templates)
- [IRコンパイラでのコンパイルエラーの無視](#ignoring-compilation-errors-with-ir-compiler)

### Gradle DSLの変更

Kotlin/JS用のGradle DSLには、プロジェクトのセットアップとカスタマイズを簡素化する多数の更新が加えられています。これには、webpackの設定調整、自動生成される`package.json`ファイルの変更、および推移的な依存関係の制御の改善が含まれます。

#### webpack設定の一元化

`browser`ターゲット用の新しい設定ブロック`commonWebpackConfig`が利用できるようになりました。このブロック内で、`webpackTask`、`runTask`、`testTask`の構成を重複させる必要なく、共通の設定を一元的に調整できます。

これら3つのタスクすべてでCSSサポートをデフォルトで有効にするには、プロジェクトの`build.gradle(.kts)`に以下のスニペットを追加します。

```groovy
browser {
    commonWebpackConfig {
        cssSupport.enabled = true
    }
    binaries.executable()
}
```

[webpackバンドルの設定](js-project-setup.md#webpack-bundling)の詳細については、こちらを参照してください。

#### `package.json`のGradleからのカスタマイズ

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

[`package.json`のカスタマイズ](js-project-setup.md#package-json-customization)の詳細については、こちらを参照してください。

#### Yarnの選択的依存関係解決

> Yarnの選択的依存関係解決のサポートは[実験的機能](components-stability.md)です。将来的に削除または変更される可能性があります。評価目的でのみ使用してください。この機能に関するフィードバックは[YouTrack](https://youtrack.jetbrains.com/issues/KT)までお寄せください。
>
{style="warning"}

Kotlin 1.4.20では、Yarnの[選択的依存関係解決](https://classic.yarnpkg.com/en/docs/selective-version-resolutions/)を設定する方法を提供します。これは、依存するパッケージの依存関係をオーバーライドするメカニズムです。

Gradleの`YarnPlugin`内の`YarnRootExtension`を通じてこれを使用できます。プロジェクトのパッケージの解決バージョンに影響を与えるには、パッケージ名セレクタ（Yarnで指定されている）と解決すべきバージョンを`resolution`関数に渡します。

```kotlin
rootProject.plugins.withType<YarnPlugin> {
    rootProject.the<YarnRootExtension>().apply {
        resolution("react", "16.0.0")
        resolution("processor/decamelize", "3.0.0")
    }
}
```

ここでは、`react`を必要とするすべてのnpm依存関係がバージョン`16.0.0`を受け取り、`processor`はその依存関係`decamelize`をバージョン`3.0.0`として受け取ります。

#### 粒度の粗いワークスペースの無効化

> 粒度の粗いワークスペースの無効化は[実験的機能](components-stability.md)です。将来的に削除または変更される可能性があります。評価目的でのみ使用してください。この機能に関するフィードバックは[YouTrack](https://youtrack.jetbrains.com/issues/KT)までお寄せください。
>
{style="warning"}

ビルド時間を短縮するため、Kotlin/JS Gradleプラグインは、特定のGradleタスクに必要な依存関係のみをインストールします。たとえば、`webpack-dev-server`パッケージは、`*Run`タスクのいずれかを実行するときにのみインストールされ、assembleタスクの実行時にはインストールされません。このような動作は、複数のGradleプロセスを並行して実行する際に問題を引き起こす可能性があります。依存関係の要件が衝突すると、npmパッケージの2つのインストールがエラーの原因となることがあります。

この問題を解決するため、Kotlin 1.4.20には、これらのいわゆる_粒度の粗いワークスペース_を無効にするオプションが含まれています。この機能は現在、Gradleの`YarnPlugin`内の`YarnRootExtension`を通じて利用できます。使用するには、`build.gradle.kts`ファイルに以下のスニペットを追加します。

```kotlin
rootProject.plugins.withType<YarnPlugin> {
    rootProject.the<YarnRootExtension>().disableGranularWorkspaces()
}
```

### 新しいウィザードテンプレート

プロジェクト作成時により便利にプロジェクトをカスタマイズできるよう、KotlinのプロジェクトウィザードにはKotlin/JSアプリケーション用の新しいテンプレートが追加されました。
- **ブラウザアプリケーション** - ブラウザで実行される最小限のKotlin/JS Gradleプロジェクト。
- **Reactアプリケーション** - 適切な`kotlin-wrappers`を使用するReactアプリ。スタイルシート、ナビゲーションコンポーネント、または状態コンテナの統合を有効にするオプションを提供します。
- **Node.jsアプリケーション** - Node.jsランタイムで実行するための最小限のプロジェクト。実験的な`kotlinx-nodejs`パッケージを直接含めるオプションが付属しています。

### IRコンパイラでのコンパイルエラーの無視

> _コンパイルエラー無視_モードは[実験的機能](components-stability.md)です。将来的に削除または変更される可能性があります。利用にはオプトインが必要です（詳細は以下を参照）。評価目的でのみ使用してください。この機能に関するフィードバックは[YouTrack](https://youtrack.jetbrains.com/issues/KT)までお寄せください。
>
{style="warning"}

Kotlin/JS用の[IRコンパイラ](js-ir-compiler.md)には、新しい実験的なモードである_エラーを伴うコンパイル_が導入されました。このモードでは、コードにエラーが含まれていても実行できます。たとえば、アプリケーション全体がまだ準備できていない段階で特定の機能を試したい場合などに便利です。

このモードには2つの許容ポリシーがあります。
- `SEMANTIC`: コンパイラは、`val x: String = 3`のように、構文的には正しいが意味的に正しくないコードを受け入れます。
- `SYNTAX`: コンパイラは、構文エラーが含まれていても任意のコードを受け入れます。

エラーを伴うコンパイルを許可するには、上記のいずれかの値とともに`-Xerror-tolerance-policy=`コンパイラオプションを追加します。

[Kotlin/JS IRコンパイラ](js-ir-compiler.md)の詳細については、こちらを参照してください。

## Kotlin/Native

Kotlin/Nativeの1.4.20における優先事項は、パフォーマンスと既存機能の磨き上げです。注目すべき改善点は以下のとおりです。
  
- [エスケープ解析](#escape-analysis)
- [パフォーマンスの改善とバグ修正](#performance-improvements-and-bug-fixes)
- [Objective-C例外のオプトインによるラッピング](#opt-in-wrapping-of-objective-c-exceptions)
- [CocoaPodsプラグインの改善](#cocoapods-plugin-improvements)
- [Xcode 12ライブラリのサポート](#support-for-xcode-12-libraries)

### エスケープ解析

> エスケープ解析メカニズムは[実験的機能](components-stability.md)です。将来的に削除または変更される可能性があります。評価目的でのみ使用してください。この機能に関するフィードバックは[YouTrack](https://youtrack.jetbrains.com/issues/KT)までお寄せください。
>
{style="warning"}

Kotlin/Nativeには、新しい[エスケープ解析](https://en.wikipedia.org/wiki/Escape_analysis)メカニズムのプロトタイプが導入されました。これにより、特定のオブジェクトをヒープではなくスタックに割り当てることで、ランタイムパフォーマンスが向上します。このメカニズムは、当社のベンチマークで平均10%のパフォーマンス向上を示しており、プログラムをさらに高速化するために引き続き改善を進めています。

エスケープ解析は、リリースビルド（`-opt`コンパイラオプションを使用）の場合、個別のコンパイルフェーズで実行されます。

エスケープ解析フェーズを無効にしたい場合は、`-Xdisable-phases=EscapeAnalysis`コンパイラオプションを使用します。

### パフォーマンスの改善とバグ修正

Kotlin/Nativeでは、1.4.0で追加された[コード共有メカニズム](https://kotlinlang.org/docs/multiplatform/multiplatform-share-on-platforms.html#share-code-on-similar-platforms)を含む、さまざまなコンポーネントでパフォーマンスの改善とバグ修正が行われています。

### Objective-C例外のオプトインによるラッピング

> Objective-C例外ラッピングメカニズムは[実験的機能](components-stability.md)です。将来的に削除または変更される可能性があります。利用にはオプトインが必要です（詳細は以下を参照）。評価目的でのみ使用してください。この機能に関するフィードバックは[YouTrack](https://youtrack.jetbrains.com/issues/KT)までお寄せください。
>
{style="warning"}

Kotlin/Nativeは、Objective-Cコードからスローされた例外をランタイムで処理し、プログラムのクラッシュを回避できるようになりました。

`NSException`を`ForeignException`型のKotlin例外にラップするようにオプトインできます。これにより、元の`NSException`への参照が保持され、根本原因に関する情報を取得し、適切に処理できるようになります。

Objective-C例外のラッピングを有効にするには、`cinterop`呼び出しで`-Xforeign-exception-mode objc-wrap`オプションを指定するか、`.def`ファイルに`foreignExceptionMode = objc-wrap`プロパティを追加します。[CocoaPods統合](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html)を使用している場合は、依存関係の`pod {}`ビルドスクリプトブロックで次のようにオプションを指定します。

```kotlin
pod("foo") {
    extraOpts = listOf("-Xforeign-exception-mode", "objc-wrap")
}
```

デフォルトの動作は変更されていません。Objective-Cコードから例外がスローされると、プログラムは終了します。

### CocoaPodsプラグインの改善

Kotlin 1.4.20では、CocoaPods統合の改善が継続されています。具体的には、以下の新機能を試すことができます。

- [タスク実行の改善](#improved-task-execution)
- [拡張されたDSL](#extended-dsl)
- [Xcodeとの統合の更新](#updated-integration-with-xcode)

#### タスク実行の改善

CocoaPodsプラグインは、タスク実行フローが改善されました。たとえば、新しいCocoaPods依存関係を追加しても、既存の依存関係は再ビルドされません。追加のターゲットを追加しても、既存の依存関係の再ビルドには影響しません。

#### 拡張されたDSL

Kotlinプロジェクトに[CocoaPods](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html)依存関係を追加するためのDSLに、新しい機能が追加されました。

ローカルのPodとCocoaPodsリポジトリのPodに加えて、以下の種類のライブラリへの依存関係を追加できます。
* カスタムスペックリポジトリからのライブラリ。
* Gitリポジトリからのリモートライブラリ。
* アーカイブからのライブラリ（任意のHTTPアドレスでも利用可能）。
* 静的ライブラリ。
* カスタムcinteropオプションを持つライブラリ。

Kotlinプロジェクトでの[CocoaPods依存関係の追加](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-libraries.html)の詳細については、こちらを参照してください。[Kotlin with CocoaPodsサンプル](https://github.com/Kotlin/kmm-with-cocoapods-sample)で例を見つけることができます。

#### Xcodeとの統合の更新

Xcodeと正しく連携するには、KotlinでPodfileをいくつか変更する必要があります。

* Kotlin PodがGit、HTTP、またはspecRepo Podの依存関係を持っている場合、それもPodfileに指定する必要があります。
* カスタムスペックからライブラリを追加する場合、Podfileの冒頭でスペックの[場所](https://guides.cocoapods.org/syntax/podfile.html#source)も指定する必要があります。

これにより、統合エラーにはIDEAで詳細な説明が表示されるようになりました。Podfileに問題がある場合、すぐに修正方法がわかります。

[Kotlin Podの作成](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-xcode.html)の詳細については、こちらを参照してください。

### Xcode 12ライブラリのサポート
    
Xcode 12に付属する新しいライブラリのサポートを追加しました。Kotlinコードからこれらのライブラリを使用できるようになりました。

## Kotlin Multiplatform

### マルチプラットフォームライブラリの公開構造の更新

Kotlin 1.4.20以降、個別のメタデータ公開はなくなりました。メタデータアーティファクトは、ライブラリ全体を表す_ルート_公開に含まれるようになり、共通ソースセットへの依存関係として追加されると、適切なプラットフォーム固有のアーティファクトに自動的に解決されます。

[マルチプラットフォームライブラリの公開](https://kotlinlang.org/docs/multiplatform/multiplatform-publish-lib-setup.html)の詳細については、こちらを参照してください。

#### 以前のバージョンとの互換性

この構造変更により、[階層型プロジェクト構造](https://kotlinlang.org/docs/multiplatform/multiplatform-share-on-platforms.html#share-code-on-similar-platforms)を持つプロジェクト間の互換性が損なわれます。マルチプラットフォームプロジェクトとそれが依存するライブラリの両方が階層型プロジェクト構造を持つ場合、両方をKotlin 1.4.20以降に同時に更新する必要があります。Kotlin 1.4.20で公開されたライブラリは、以前のバージョンで公開されたプロジェクトからは使用できません。

階層型プロジェクト構造を持たないプロジェクトとライブラリは互換性を維持します。

## 標準ライブラリ

Kotlin 1.4.20の標準ライブラリでは、ファイル操作のための新しい拡張機能とパフォーマンスの向上が提供されます。

- [`java.nio.file.Path`の拡張機能](#extensions-for-java-nio-file-path)
- [`String.replace`関数のパフォーマンス向上](#improved-string-replace-function-performance)

### `java.nio.file.Path`の拡張機能

> `java.nio.file.Path`の拡張機能は[実験的機能](components-stability.md)です。将来的に削除または変更される可能性があります。利用にはオプトインが必要です（詳細は以下を参照）。評価目的でのみ使用してください。これらの機能に関するフィードバックは[YouTrack](https://youtrack.jetbrains.com/issues/KT)までお寄せください。
>
{style="warning"}

現在、標準ライブラリは`java.nio.file.Path`の実験的な拡張機能を提供しています。現代のJVMファイルAPIをKotlinらしい方法で操作することが、`kotlin.io`パッケージの`java.io.File`拡張機能を使用するのと同様になりました。

```kotlin
// construct path with the div (/) operator
val baseDir = Path("/base")
val subDir = baseDir / "subdirectory" 

// list files in a directory
val kotlinFiles: List<Path> = Path("/home/user").listDirectoryEntries("*.kt")
```

これらの拡張機能は、`kotlin-stdlib-jdk7`モジュールの`kotlin.io.path`パッケージで利用できます。拡張機能を使用するには、実験的アノテーション`@ExperimentalPathApi`に[オプトイン](opt-in-requirements.md)する必要があります。

### `String.replace`関数のパフォーマンス向上

`String.replace()`の新しい実装により、関数の実行が高速化されます。大文字と小文字を区別するバリアントは`indexOf`に基づく手動置換ループを使用し、大文字と小文字を区別しないバリアントは正規表現マッチングを使用します。

## Kotlin Android Extensions

1.4.20では、Kotlin Android Extensionsプラグインが非推奨となり、`Parcelable`実装ジェネレータは別のプラグインに移動されます。

- [Synthetic Viewsの非推奨化](#deprecation-of-synthetic-views)
- [Parcelable実装ジェネレータ用の新しいプラグイン](#new-plugin-for-parcelable-implementation-generator)

### Synthetic Viewsの非推奨化

_Synthetic views_は、UI要素とのインタラクションを簡素化し、ボイラープレートを削減するために、以前Kotlin Android Extensionsプラグインで導入されました。現在、Googleは同じことを行うネイティブメカニズムであるAndroid Jetpackの[ビューバインディング](https://developer.android.com/topic/libraries/view-binding)を提供しており、私たちはこれらを支持してSynthetic viewsを非推奨にしています。

`kotlin-android-extensions`から`Parcelable`実装ジェネレータを抽出し、それ以外の部分（Synthetic views）の非推奨化サイクルを開始します。現時点では、これらは非推奨警告とともに動作し続けます。将来的には、プロジェクトを別のソリューションに切り替える必要があります。AndroidプロジェクトをSynthetic viewsからビューバインディングに移行するのに役立つ[ガイドライン](https://goo.gle/kotlin-android-extensions-deprecation)はこちらです。

### Parcelable実装ジェネレータ用の新しいプラグイン

`Parcelable`実装ジェネレータは、新しい`kotlin-parcelize`プラグインで利用できるようになりました。`kotlin-android-extensions`の代わりにこのプラグインを適用してください。

>`kotlin-parcelize`と`kotlin-android-extensions`は、1つのモジュールで同時に適用することはできません。
>
{style="note"}

`@Parcelize`アノテーションは`kotlinx.parcelize`パッケージに移動されました。

`Parcelable`実装ジェネレータの詳細については、[Androidドキュメント](https://developer.android.com/kotlin/parcelize)を参照してください。