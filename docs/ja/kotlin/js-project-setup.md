[//]: # (title: Kotlin/JS プロジェクトのセットアップ)

Kotlin/JS プロジェクトはビルドシステムとして Gradle を使用します。開発者が Kotlin/JS プロジェクトを簡単に管理できるように、
Kotlin チームは `kotlin.multiplatform` Gradle プラグインを提供しています。このプラグインは、JavaScript 開発で一般的なルーティンを自動化するためのヘルパータスクとともに、プロジェクト設定ツールを提供します。

このプラグインは、[npm](https://www.npmjs.com/) または [Yarn](https://yarnpkg.com/) パッケージマネージャーを使用して npm 依存関係をバックグラウンドでダウンロードし、[webpack](https://webpack.js.org/) を使用して Kotlin プロジェクトから JavaScript バンドルをビルドします。
依存関係管理と設定の調整は、大部分を Gradle ビルドファイルから直接行うことができ、
自動生成された設定を上書きして完全に制御することも可能です。

`org.jetbrains.kotlin.multiplatform` プラグインは、`build.gradle(.kts)` ファイルで Gradle プロジェクトに手動で適用できます。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
}
```

</tab>
</tabs>

Kotlin Multiplatform Gradle プラグインを使用すると、ビルドスクリプトの `kotlin {}` ブロックでプロジェクトの側面を管理できます。

```groovy
kotlin {
    // ...
}
```

`kotlin {}` ブロック内では、次の側面を管理できます。

*   [ターゲット実行環境](#execution-environments): ブラウザまたは Node.js
*   [ES2015機能のサポート](#support-for-es2015-features): クラス、モジュール、ジェネレーター
*   [プロジェクト依存関係](#dependencies): Maven と npm
*   [実行設定](#run-task)
*   [テスト設定](#test-task)
*   ブラウザプロジェクト向けの[バンドル](#webpack-bundling)と[CSSサポート](#css)
*   [ターゲットディレクトリ](#distribution-target-directory)と[モジュール名](#module-name)
*   [プロジェクトの `package.json` ファイル](#package-json-customization)

## 実行環境

Kotlin/JS プロジェクトは、次の2つの異なる実行環境をターゲットにできます。

*   ブラウザ: ブラウザでのクライアントサイドスクリプト向け
*   [Node.js](https://nodejs.org/): ブラウザ外で JavaScript コードを実行するため。例えば、サーバーサイドスクリプト向け。

Kotlin/JS プロジェクトのターゲット実行環境を定義するには、`js {}` ブロック内に `browser {}` または `nodejs {}` を追加します。

```groovy
kotlin {
    js {
        browser {
        }
        binaries.executable()
    }
}
```

`binaries.executable()` の指示は、Kotlin コンパイラに実行可能な `.js` ファイルを出力するように明示的に指示します。
`binaries.executable()` を省略すると、コンパイラは Kotlin 内部ライブラリファイルのみを生成します。これらのファイルは他のプロジェクトから使用できますが、それ自体では実行できません。

> これは通常、実行可能ファイルを作成するよりも高速であり、
> プロジェクトの非リーフモジュールを扱う際の最適化の可能性があります。
>
{style="tip"}

Kotlin Multiplatform プラグインは、選択された環境で動作するようにタスクを自動的に設定します。
これには、アプリケーションの実行とテストに必要な環境と依存関係のダウンロードとインストールが含まれます。
これにより、開発者は追加設定なしでシンプルなプロジェクトをビルド、実行、テストできます。
Node.js をターゲットとするプロジェクトの場合、既存の Node.js インストールを使用するオプションもあります。[プリインストールされた Node.js の使用](#use-pre-installed-node-js)方法について学習してください。

## ES2015機能のサポート

Kotlin は、以下の ES2015 機能に対して[実験的な (Experimental)](components-stability.md#stability-levels-explained) サポートを提供しています。

*   コードベースを簡素化し、メンテナンス性を向上させるモジュール。
*   OOP (オブジェクト指向プログラミング) 原則を組み込むことで、よりクリーンで直感的なコードを実現するクラス。
*   最終バンドルサイズを改善し、デバッグに役立つ[サスペンド関数 (suspend functions)](composing-suspending-functions.md) をコンパイルするためのジェネレーター。

`build.gradle(.kts)` ファイルに `es2015` コンパイルターゲットを追加することで、サポートされているすべての ES2015 機能を一度に有効にできます。

```kotlin
tasks.withType<KotlinJsCompile>().configureEach {
    kotlinOptions {
        target = "es2015"
    }
}
```

[ES2015 (ECMAScript 2015, ES6) の詳細については、公式ドキュメントを参照してください](https://262.ecma-international.org/6.0/)。

## 依存関係

他の Gradle プロジェクトと同様に、Kotlin/JS プロジェクトは、ビルドスクリプトの `dependencies {}` ブロックで従来の Gradle [依存関係宣言](https://docs.gradle.org/current/userguide/declaring_dependencies.html)をサポートしています。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    implementation("org.example.myproject", "1.1.0")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    implementation 'org.example.myproject:1.1.0'
}
```

</tab>
</tabs>

Kotlin Multiplatform Gradle プラグインは、ビルドスクリプトの `kotlin {}` ブロックで特定のソースセットの依存関係宣言もサポートしています。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
        val jsMain by getting {
            dependencies {
                implementation("org.example.myproject:1.1.0")
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        jsMain {
            dependencies {
                implementation 'org.example.myproject:1.1.0'
            }
        }
    }
}
```

</tab>
</tabs>

> Kotlin プログラミング言語で利用可能なすべてのライブラリが、JavaScript をターゲットとする際に利用できるわけではありません。
> Kotlin/JS 用のアーティファクトを含むライブラリのみが使用できます。
>
{style="note"}

追加するライブラリが[npm からのパッケージ](#npm-dependencies)に依存している場合、Gradle はこれらの推移的な依存関係も自動的に解決します。

### Kotlin 標準ライブラリ

[標準ライブラリ](https://kotlinlang.org/api/latest/jvm/stdlib/index.html)への依存関係は自動的に追加されます。
標準ライブラリのバージョンは、Kotlin Multiplatform プラグインのバージョンと同じです。

マルチプラットフォームテストの場合、[`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) API が利用可能です。
マルチプラットフォームプロジェクトを作成する際、`commonTest` で単一の依存関係を使用することで、すべてのソースセットにテスト依存関係を追加できます。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
        commonTest.dependencies {
            implementation(kotlin("test")) // Brings all the platform dependencies automatically
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        commonTest {
            dependencies {
                implementation kotlin("test") // Brings all the platform dependencies automatically
            }
        }
    }
}
```

</tab>
</tabs>

### npm 依存関係

JavaScript の世界では、依存関係を管理する最も一般的な方法は [npm](https://www.npmjs.com/) です。
これは、JavaScript モジュールの最大の公開リポジトリを提供します。

Kotlin Multiplatform Gradle プラグインでは、他の依存関係を宣言するのと同じように、Gradle ビルドスクリプトで npm 依存関係を宣言できます。

npm 依存関係を宣言するには、その名前とバージョンを依存関係宣言内の `npm()` 関数に渡します。
[npm の semver 構文](https://docs.npmjs.com/about-semantic-versioning)に基づいて、1つまたは複数のバージョン範囲を指定することもできます。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    implementation(npm("react", "> 14.0.0 <=16.9.0"))
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    implementation npm('react', '> 14.0.0 <=16.9.0')
}
```

</tab>
</tabs>

デフォルトでは、プラグインは npm 依存関係をダウンロードしてインストールするために、[Yarn](https://yarnpkg.com/lang/en/) パッケージマネージャーの個別のインスタンスを使用します。
これは追加設定なしでそのまま動作しますが、[特定のニーズに合わせて調整](#yarn)できます。

代わりに、[npm](https://www.npmjs.com/) パッケージマネージャーを直接使用して npm 依存関係を操作することもできます。
npm をパッケージマネージャーとして使用するには、`gradle.properties` ファイルで次のプロパティを設定します。

```none
kotlin.js.yarn=false
```

通常の依存関係に加えて、Gradle DSL から使用できる依存関係にはさらに3つのタイプがあります。
各タイプの依存関係がいつ最適に使用できるかについて詳しくは、npm からリンクされている公式ドキュメントを参照してください。

*   `devNpm(...)` を介した [devDependencies](https://docs.npmjs.com/files/package.json#devdependencies)、
*   `optionalNpm(...)` を介した [optionalDependencies](https://docs.npmjs.com/files/package.json#optionaldependencies)、および
*   `peerNpm(...)` を介した [peerDependencies](https://docs.npmjs.com/files/package.json#peerdependencies)。

npm 依存関係がインストールされたら、[Kotlin から JS を呼び出す](js-interop.md)に記載されているように、コードでその API を使用できます。

## run タスク

Kotlin Multiplatform Gradle プラグインは、追加設定なしで純粋な Kotlin/JS プロジェクトを実行できる `jsBrowserDevelopmentRun` タスクを提供します。

Kotlin/JS プロジェクトをブラウザで実行する場合、このタスクは `browserDevelopmentRun` タスクのエイリアスです (これは Kotlin マルチプラットフォームプロジェクトでも利用可能です)。
これは、[webpack-dev-server](https://webpack.js.org/configuration/dev-server/) を使用して JavaScript アーティファクトを配信します。
`webpack-dev-server` が使用する設定をカスタマイズしたい場合、例えばサーバーが実行されるポートを調整したい場合は、[webpack 設定ファイル](#webpack-bundling)を使用します。

Node.js をターゲットとする Kotlin/JS プロジェクトを実行するには、`nodeRun` タスクのエイリアスである `jsNodeDevelopmentRun` タスクを使用します。

プロジェクトを実行するには、標準のライフサイクル `jsBrowserDevelopmentRun` タスク、またはそれに相当するエイリアスを実行します。

```bash
./gradlew jsBrowserDevelopmentRun
```

ソースファイルに変更を加えた後にアプリケーションの再ビルドを自動的にトリガーするには、Gradle の[継続ビルド (continuous build)](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:continuous_build) 機能を使用します。

```bash
./gradlew jsBrowserDevelopmentRun --continuous
```

または

```bash
./gradlew jsBrowserDevelopmentRun -t
```

プロジェクトのビルドが成功すると、`webpack-dev-server` はブラウザページを自動的に更新します。

## test タスク

Kotlin Multiplatform Gradle プラグインは、プロジェクトのテストインフラストラクチャを自動的にセットアップします。
ブラウザプロジェクトの場合、[Karma](https://karma-runner.github.io/) テストランナーと他の必要な依存関係をダウンロードしてインストールします。
Node.js プロジェクトの場合、[Mocha](https://mochajs.org/) テストフレームワークが使用されます。

プラグインは、次のような便利なテスト機能も提供します。

*   ソースマップ生成
*   テストレポート生成
*   コンソールでのテスト実行結果

ブラウザテストを実行する場合、プラグインはデフォルトで [Headless Chrome](https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md) を使用します。
ビルドスクリプトの `useKarma {}` ブロック内に対応するエントリを追加することで、テストを実行する別のブラウザを選択することもできます。

```groovy
kotlin {
    js {
        browser {
            testTask {
                useKarma {
                    useIe()
                    useSafari()
                    useFirefox()
                    useChrome()
                    useChromeCanary()
                    useChromeHeadless()
                    usePhantomJS()
                    useOpera()
                }
            }
        }
        binaries.executable()
        // ...
    }
}
```

または、`gradle.properties` ファイルにブラウザのテストターゲットを追加することもできます。

```text
kotlin.js.browser.karma.browsers=firefox,safari
```

このアプローチにより、すべてのモジュールに対してブラウザのリストを定義し、特定のモジュールのビルドスクリプトで特定のブラウザを追加できます。

Kotlin Multiplatform Gradle プラグインはこれらのブラウザを自動的にインストールしません。実行環境で利用可能なブラウザのみを使用することに注意してください。
継続的インテグレーションサーバーで Kotlin/JS テストを実行している場合などは、テスト対象のブラウザがインストールされていることを確認してください。

テストをスキップしたい場合は、`testTask {}` に `enabled = false` の行を追加します。

```groovy
kotlin {
    js {
        browser {
            testTask {
                enabled = false
            }
        }
        binaries.executable()
        // ...
    }
}
```

テストを実行するには、標準のライフサイクル `check` タスクを実行します。

```bash
./gradlew check
```

Node.js テストランナーで使用する環境変数を指定するには (例えば、外部情報をテストに渡したり、パッケージの解決を微調整したりするため)、ビルドスクリプトの `testTask {}` ブロック内でキーと値のペアを指定して `environment()` 関数を使用します。

```groovy
kotlin {
    js {
        nodejs {
            testTask {
                environment("key", "value")
            }
        }
    }
}
```

### Karma 設定

Kotlin Multiplatform Gradle プラグインは、ビルド時に Karma 設定ファイルを自動生成します。これには、`build.gradle(.kts)` の [`kotlin.js.browser.testTask.useKarma {}` ブロック](#test-task)からの設定が含まれます。
このファイルは `build/js/packages/projectName-test/karma.conf.js` にあります。
Karma が使用する設定を調整するには、プロジェクトのルートにある `karma.config.d` というディレクトリ内に、追加の設定ファイルを配置します。
このディレクトリ内のすべての `.js` 設定ファイルは自動的に認識され、ビルド時に生成された `karma.conf.js` に自動的にマージされます。

すべての Karma 設定機能は、Karma の[ドキュメント](https://karma-runner.github.io/5.0/config/configuration-file.html)によく記述されています。

## webpack バンドル

ブラウザターゲットの場合、Kotlin Multiplatform Gradle プラグインは広く知られている [webpack](https://webpack.js.org/) モジュールバンドラーを使用します。

### webpack バージョン

Kotlin Multiplatform プラグインは webpack %webpackMajorVersion% を使用します。

1.5.0より前のプラグインバージョンで作成されたプロジェクトをお持ちの場合、
プロジェクトの `gradle.properties` に以下の行を追加することで、これらのバージョンで使用されていた webpack %webpackPreviousMajorVersion% に一時的に切り替えることができます。

```none
kotlin.js.webpack.major.version=4
```

### webpack タスク

最も一般的な webpack の調整は、Gradle ビルドファイルの `kotlin.js.browser.webpackTask {}` 設定ブロックを介して直接行うことができます。
*   `outputFileName` - webpacked 出力ファイルのファイル名。webpack タスクの実行後、`<projectDir>/build/dist/<targetName>` に生成されます。デフォルト値はプロジェクト名です。
*   `output.libraryTarget` - webpacked 出力のモジュールシステム。
    [Kotlin/JS プロジェクトで利用可能なモジュールシステム](js-modules.md)について詳しく学習してください。
    デフォルト値は `umd` です。

```groovy
webpackTask {
    outputFileName = "mycustomfilename.js"
    output.libraryTarget = "commonjs2"
}
```

`commonWebpackConfig {}` ブロックで、バンドル、実行、テストタスクで使用する共通の webpack 設定を構成することもできます。

### webpack 設定ファイル

Kotlin Multiplatform Gradle プラグインは、ビルド時に標準の webpack 設定ファイルを自動的に生成します。
このファイルは `build/js/packages/projectName/webpack.config.js` にあります。

webpack 設定をさらに調整したい場合は、プロジェクトのルートにある `webpack.config.d` というディレクトリ内に、追加の設定ファイルを配置します。
プロジェクトをビルドすると、すべての `.js` 設定ファイルは自動的に `build/js/packages/projectName/webpack.config.js` ファイルにマージされます。
例えば、新しい [webpack ローダー](https://webpack.js.org/loaders/)を追加するには、`webpack.config.d` ディレクトリ内の `.js` ファイルに次を追加します。

> この場合、設定オブジェクトはグローバルオブジェクト `config` です。スクリプトでこれを変更する必要があります。
>
{style="note"}

```groovy
config.module.rules.push({
    test: /\.extension$/,
    loader: 'loader-name'
});
```

すべての webpack 設定機能は、その[ドキュメント](https://webpack.js.org/concepts/configuration/)によく記述されています。

### 実行可能ファイルのビルド

webpack を介して実行可能な JavaScript アーティファクトをビルドするために、Kotlin Multiplatform Gradle プラグインには `browserDevelopmentWebpack` と `browserProductionWebpack` Gradle タスクが含まれています。

*   `browserDevelopmentWebpack` は開発アーティファクトを作成します。これらはサイズが大きくなりますが、作成にほとんど時間がかかりません。
    そのため、活発な開発中は `browserDevelopmentWebpack` タスクを使用します。

*   `browserProductionWebpack` は生成されたアーティファクトにデッドコード除去を適用し、結果の JavaScript ファイルを縮小 (minify) します。
    これにはより時間がかかりますが、サイズが小さい実行可能ファイルを生成します。
    そのため、プロジェクトを本番環境で使用する準備をする際には、`browserProductionWebpack` タスクを使用します。

開発用または本番用のそれぞれのアーティファクトを取得するには、これらのタスクのいずれかを実行します。
生成されたファイルは、[別途指定がない限り](#distribution-target-directory) `build/dist` で利用できます。

```bash
./gradlew browserProductionWebpack
```

これらのタスクは、ターゲットが実行可能ファイルを生成するように設定されている場合 (つまり、`binaries.executable()` を使用している場合) にのみ利用可能であることに注意してください。

## CSS

Kotlin Multiplatform Gradle プラグインは、webpack の [CSS](https://webpack.js.org/loaders/css-loader/) および [style](https://webpack.js.org/loaders/style-loader/) ローダーのサポートも提供します。
すべてのオプションは、プロジェクトのビルドに使用される[webpack 設定ファイル](#webpack-bundling)を直接変更することで変更できますが、最も一般的に使用される設定は `build.gradle(.kts)` ファイルから直接利用できます。

プロジェクトで CSS サポートを有効にするには、`commonWebpackConfig {}` ブロックの Gradle ビルドファイルで `cssSupport.enabled` オプションを `true` に設定します。
この設定は、ウィザードを使用して新しいプロジェクトを作成する際にもデフォルトで有効になっています。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
browser {
    commonWebpackConfig {
        cssSupport {
            enabled.set(true)
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
browser {
    commonWebpackConfig {
        cssSupport {
            it.enabled = true
        }
    }
}
```

</tab>
</tabs>

または、`webpackTask {}`、`runTask {}`、`testTask {}` に対して個別に CSS サポートを追加することもできます。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
browser {
    webpackTask {
        cssSupport {
            enabled.set(true)
        }
    }
    runTask {
        cssSupport {
            enabled.set(true)
        }
    }
    testTask {
        useKarma {
            // ...
            webpackConfig.cssSupport {
                enabled.set(true)
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
browser {
    webpackTask {
        cssSupport {
            it.enabled = true
        }
    }
    runTask {
        cssSupport {
            it.enabled = true
        }
    }
    testTask {
        useKarma {
            // ...
            webpackConfig.cssSupport {
                it.enabled = true
            }
        }
    }
}
```

</tab>
</tabs>

プロジェクトで CSS サポートを有効にすると、`Module parse failed: Unexpected character '@' (14:0)` のような、設定されていないプロジェクトからスタイルシートを使用しようとしたときに発生する一般的なエラーを防ぐのに役立ちます。

`cssSupport.mode` を使用して、検出された CSS をどのように処理するかを指定できます。次の値が利用可能です。

*   `"inline"` (デフォルト): スタイルはグローバルな `<style>` タグに追加されます。
*   `"extract"`: スタイルは別のファイルに抽出されます。その後、HTML ページから含めることができます。
*   `"import"`: スタイルは文字列として処理されます。これは、コードから CSS にアクセスする必要がある場合 (例: `val styles = require("main.css")`) に役立ちます。

同じプロジェクトで異なるモードを使用するには、`cssSupport.rules` を使用します。ここでは、`KotlinWebpackCssRules` のリストを指定でき、それぞれがモード、[include](https://webpack.js.org/configuration/module/#ruleinclude) パターン、[exclude](https://webpack.js.org/configuration/module/#ruleexclude) パターンを定義します。

## Node.js

Node.js をターゲットとする Kotlin/JS プロジェクトの場合、プラグインはホストに Node.js 環境を自動的にダウンロードしてインストールします。
既存の Node.js インスタンスがある場合は、それを使用することもできます。

### Node.js 設定の構成

各サブプロジェクトの Node.js 設定を構成することも、プロジェクト全体として設定することもできます。

例えば、特定のサブプロジェクトの Node.js バージョンを設定するには、`build.gradle(.kts)` ファイルの Gradle ブロックに次の行を追加します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
project.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin> {
    project.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec>().version = "your Node.js version"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
project.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin) {
    project.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec).version = "your Node.js version"
}
```

</tab>
</tabs>

すべてのサブプロジェクトを含むプロジェクト全体にバージョンを設定するには、`allProjects {}` ブロックに同じコードを適用します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
allprojects {
    project.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin> {
        project.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec>().version = "your Node.js version"
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
allprojects {
    project.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin) {
        project.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec).version = "your Node.js version"
}
```

</tab>
</tabs>

> プロジェクト全体に Node.js 設定を構成するために `NodeJsRootPlugin` クラスを使用することは非推奨であり、最終的にはサポートが停止します。
>
{style="note"}

### プリインストールされた Node.js の使用

Kotlin/JS プロジェクトをビルドするホストに Node.js がすでにインストールされている場合、Kotlin Multiplatform Gradle プラグインを構成して、独自の Node.js インスタンスをインストールする代わりに、その既存の Node.js を使用できます。

プリインストールされた Node.js インスタンスを使用するには、`build.gradle(.kts)` ファイルに次の行を追加します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
project.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin> {
    // Set to `true` for default behavior
    project.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec>().download = false
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
project.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin) {
    // Set to `true` for default behavior
    project.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec).download = false
}
```

</tab>
</tabs>

## Yarn

デフォルトでは、ビルド時に宣言された依存関係をダウンロードしてインストールするために、プラグインは [Yarn](https://yarnpkg.com/lang/en/) パッケージマネージャーの独自のインスタンスを管理します。
これは追加設定なしでそのまま動作しますが、調整したり、ホストにすでにインストールされている Yarn を使用したりできます。

### 追加の Yarn 機能: .yarnrc

追加の Yarn 機能を構成するには、`.yarnrc` ファイルをプロジェクトのルートに配置します。
ビルド時に、これは自動的に認識されます。

例えば、npm パッケージのカスタムレジストリを使用するには、プロジェクトルートの `.yarnrc` というファイルに次の行を追加します。

```text
registry "http://my.registry/api/npm/"
```

`.yarnrc` について詳しく知るには、[公式 Yarn ドキュメント](https://classic.yarnpkg.com/en/docs/yarnrc/)を参照してください。

### プリインストールされた Yarn の使用

Kotlin/JS プロジェクトをビルドするホストに Yarn がすでにインストールされている場合、Kotlin Multiplatform Gradle プラグインを構成して、独自の Yarn インスタンスをインストールする代わりに、その既存の Yarn を使用できます。

プリインストールされた Yarn インスタンスを使用するには、`build.gradle(.kts)` に次の行を追加します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> {
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().download = false
    // "true" for default behavior
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).download = false
}
 
```

</tab>
</tabs>

### `kotlin-js-store` を介したバージョンロック

> `kotlin-js-store` を介したバージョンロックは Kotlin 1.6.10 以降で利用可能です。
>
{style="note"}

プロジェクトルートにある `kotlin-js-store` ディレクトリは、バージョンロックに必要な `yarn.lock` ファイルを保持するために、Kotlin Multiplatform Gradle プラグインによって自動的に生成されます。
このロックファイルは Yarn プラグインによって完全に管理され、`kotlinNpmInstall` Gradle タスクの実行中に更新されます。

[推奨されるプラクティス](https://classic.yarnpkg.com/blog/2016/11/24/lockfiles-for-all/)に従い、`kotlin-js-store` とその内容をバージョン管理システムにコミットしてください。
これにより、すべてのマシンでアプリケーションがまったく同じ依存関係ツリーでビルドされることが保証されます。

必要に応じて、`build.gradle(.kts)` でディレクトリ名とロックファイル名の両方を変更できます。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> {
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().lockFileDirectory =
        project.rootDir.resolve("my-kotlin-js-store")
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().lockFileName = "my-yarn.lock"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).lockFileDirectory =
        file("my-kotlin-js-store")
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).lockFileName = 'my-yarn.lock'
}
```

</tab>
</tabs>

> ロックファイルの名前を変更すると、依存関係検査ツールがそのファイルを認識しなくなる可能性があります。
>
{style="warning"}

`yarn.lock` について詳しく知るには、[公式 Yarn ドキュメント](https://classic.yarnpkg.com/lang/en/docs/yarn-lock/)を参照してください。

### `yarn.lock` が更新されたことの報告

Kotlin/JS は、`yarn.lock` ファイルが更新された場合に通知できる Gradle 設定を提供します。
これらの設定は、CI ビルドプロセス中に `yarn.lock` がサイレントに変更された場合に通知を受けたい場合に使用できます。

*   `YarnLockMismatchReport`: `yarn.lock` ファイルへの変更がどのように報告されるかを指定します。次のいずれかの値を使用できます。
    *   `FAIL`: 対応する Gradle タスクを失敗させます。これがデフォルトです。
    *   `WARNING`: 変更に関する情報を警告ログに書き込みます。
    *   `NONE`: レポートを無効にします。
*   `reportNewYarnLock`: 最近作成された `yarn.lock` ファイルについて明示的に報告します。
    デフォルトでは、このオプションは無効になっています。最初の起動時に新しい `yarn.lock` ファイルを生成するのが一般的な慣行です。
    このオプションを使用して、ファイルがリポジトリにコミットされていることを確認できます。
*   `yarnLockAutoReplace`: Gradle タスクが実行されるたびに `yarn.lock` を自動的に置き換えます。

これらのオプションを使用するには、`build.gradle(.kts)` を次のように更新します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnLockMismatchReport
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension

rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> {
    rootProject.the<YarnRootExtension>().yarnLockMismatchReport =
        YarnLockMismatchReport.WARNING // NONE | FAIL
    rootProject.the<YarnRootExtension>().reportNewYarnLock = false // true
    rootProject.the<YarnRootExtension>().yarnLockAutoReplace = false // true
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnLockMismatchReport
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension

rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).yarnLockMismatchReport =
        YarnLockMismatchReport.WARNING // NONE | FAIL
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).reportNewYarnLock = false // true
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).yarnLockAutoReplace = false // true
}
```

</tab>
</tabs>

### `--ignore-scripts` をデフォルトで指定して npm 依存関係をインストールする

> `--ignore-scripts` をデフォルトで指定して npm 依存関係をインストールする機能は Kotlin 1.6.10 以降で利用可能です。
>
{style="note"}

侵害された npm パッケージからの悪意のあるコードの実行の可能性を減らすため、Kotlin Multiplatform Gradle プラグインは、npm 依存関係のインストール中に[ライフサイクルスクリプト](https://docs.npmjs.com/cli/v8/using-npm/scripts#life-cycle-scripts)の実行をデフォルトで防止します。

`build.gradle(.kts)` に次の行を追加することで、ライフサイクルスクリプトの実行を明示的に有効にできます。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> { 
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().ignoreScripts = false
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).ignoreScripts = false
}
```

</tab>
</tabs>

## 配布ターゲットディレクトリ

デフォルトでは、Kotlin/JS プロジェクトのビルド結果は、プロジェクトルート内の `/build/dist/<targetName>/<binaryName>` ディレクトリに配置されます。

> Kotlin 1.9.0 より前は、デフォルトの配布ターゲットディレクトリは `/build/distributions` でした。
>
{style="note"}

プロジェクト配布ファイルの別の場所を設定するには、ビルドスクリプトの `browser {}` ブロック内に `distribution {}` ブロックを追加し、`set()` メソッドを使用して `outputDirectory` プロパティに値を割り当てます。
プロジェクトビルドタスクを実行すると、Gradle は出力バンドルをプロジェクトリソースとともにこの場所に保存します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    js {
        browser {
            distribution {
                outputDirectory.set(projectDir.resolve("output"))
            }
        }
        binaries.executable()
        // ...
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    js {
        browser {
            distribution {
                outputDirectory = file("$projectDir/output")
            }
        }
        binaries.executable()
        // ...
    }
}
```

</tab>
</tabs>

## モジュール名

JavaScript _モジュール_ ( `build/js/packages/myModuleName` に生成される) の名前を調整するには、
対応する `.js` ファイルと `.d.ts` ファイルを含め、`moduleName` オプションを使用します。

```groovy
js {
    moduleName = "myModuleName"
}
```

これは `build/dist` の webpack 出力には影響しないことに注意してください。

## package.json のカスタマイズ

`package.json` ファイルは、JavaScript パッケージのメタデータを保持します。npm のような人気のあるパッケージレジストリでは、
公開されるすべてのパッケージにこのファイルが必要です。これを使用してパッケージの公開を追跡および管理します。

Kotlin Multiplatform Gradle プラグインは、ビルド時に Kotlin/JS プロジェクトの `package.json` を自動的に生成します。
デフォルトでは、このファイルには必須のデータが含まれています。名前、バージョン、ライセンス、依存関係、およびその他のパッケージ属性です。

基本的なパッケージ属性以外に、`package.json` は JavaScript プロジェクトがどのように動作すべきかを定義できます。
例えば、実行可能なスクリプトを識別するなどです。

Gradle DSL を介して、プロジェクトの `package.json` にカスタムエントリを追加できます。
`package.json` にカスタムフィールドを追加するには、コンパイルの `packageJson` ブロックで `customField()` 関数を使用します。

```kotlin
kotlin {
    js {
        compilations["main"].packageJson {
            customField("hello", mapOf("one" to 1, "two" to 2))
        }
    }
}
```

プロジェクトをビルドすると、このコードは `package.json` ファイルに次のブロックを追加します。

```json
"hello": {
    "one": 1,
    "two": 2
}
```

npm レジストリ用の `package.json` ファイルの書き方について詳しくは、[npm ドキュメント](https://docs.npmjs.com/cli/v6/configuring-npm/package-json)を参照してください。