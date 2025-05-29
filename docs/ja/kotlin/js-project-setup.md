[//]: # (title: Kotlin/JSプロジェクトのセットアップ)

Kotlin/JSプロジェクトはビルドシステムとしてGradleを使用します。開発者がKotlin/JSプロジェクトを簡単に管理できるように、Kotlin/JSプロジェクトの構成ツールとJavaScript開発で一般的なルーティンを自動化するためのヘルパータスクを提供する`kotlin.multiplatform` Gradleプラグインを提供しています。

このプラグインは、[npm](https://www.npmjs.com/)または[Yarn](https://yarnpkg.com/)パッケージマネージャーを使用してnpm依存関係をバックグラウンドでダウンロードし、[webpack](https://webpack.js.org/)を使用してKotlinプロジェクトからJavaScriptバンドルをビルドします。依存関係の管理と設定の調整は、大部分がGradleビルドファイルから直接行うことができ、完全な制御のために自動生成された設定をオーバーライドするオプションもあります。

`org.jetbrains.kotlin.multiplatform`プラグインは、`build.gradle(.kts)`ファイルでGradleプロジェクトに手動で適用できます。

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

KotlinマルチプラットフォームGradleプラグインを使用すると、ビルドスクリプトの`kotlin {}`ブロックでプロジェクトの各側面を管理できます。

```groovy
kotlin {
    // ...
}
```

`kotlin {}`ブロック内では、次の側面を管理できます。

*   ターゲット実行環境 ([Execution environments](#execution-environments))：ブラウザまたはNode.js
*   ES2015機能のサポート ([Support for ES2015 features](#support-for-es2015-features))：クラス、モジュール、ジェネレーター
*   プロジェクトの依存関係 ([Project dependencies](#dependencies))：Mavenおよびnpm
*   実行設定 ([Run configuration](#run-task))
*   テスト設定 ([Test configuration](#test-task))
*   ブラウザプロジェクトのバンドル ([Bundling](#webpack-bundling)) とCSSサポート ([CSS support](#css))
*   ターゲットディレクトリ ([Target directory](#distribution-target-directory)) とモジュール名 ([module name](#module-name))
*   プロジェクトの`package.json`ファイル ([Project's `package.json` file](#package-json-customization))

## 実行環境

Kotlin/JSプロジェクトは、2つの異なる実行環境をターゲットにできます。

*   ブラウザ：ブラウザでのクライアントサイドスクリプティング用
*   [Node.js](https://nodejs.org/)：ブラウザ外でJavaScriptコードを実行するため。たとえば、サーバーサイドスクリプティング用です。

Kotlin/JSプロジェクトのターゲット実行環境を定義するには、`js {}`ブロック内に`browser {}`または`nodejs {}`を追加します。

```groovy
kotlin {
    js {
        browser {
        }
        binaries.executable()
    }
}
```

`binaries.executable()`命令は、Kotlinコンパイラに実行可能な`.js`ファイルを出力するように明示的に指示します。`binaries.executable()`を省略すると、コンパイラはKotlin内部ライブラリファイルのみを生成します。これは他のプロジェクトから使用できますが、それ自体で実行することはできません。

> これは通常、実行可能ファイルを作成するよりも高速であり、プロジェクトの非リーフモジュールを扱う際の最適化となる可能性があります。
>
{style="tip"}

Kotlinマルチプラットフォームプラグインは、選択された環境で動作するようにタスクを自動的に構成します。これには、アプリケーションの実行とテストに必要な環境と依存関係のダウンロードとインストールが含まれます。これにより、開発者は追加の設定なしでシンプルなプロジェクトをビルド、実行、テストできます。Node.jsをターゲットとするプロジェクトの場合、既存のNode.jsインストールを使用するオプションもあります。[プリインストールされたNode.jsを使用する方法](#use-pre-installed-node-js)を参照してください。

## ES2015機能のサポート

Kotlinは、以下のES2015機能に対する[実験的](components-stability.md#stability-levels-explained)サポートを提供します。

*   コードベースを簡素化し、保守性を向上させるモジュール。
*   OOPの原則を組み込むことを可能にし、よりクリーンで直感的なコードをもたらすクラス。
*   最終的なバンドルサイズを改善し、デバッグに役立つ[suspend functions](composing-suspending-functions.md)をコンパイルするためのジェネレーター。

サポートされているすべてのES2015機能を一度に有効にするには、`build.gradle(.kts)`ファイルに`es2015`コンパイルターゲットを追加します。

```kotlin
tasks.withType<KotlinJsCompile>().configureEach {
    kotlinOptions {
        target = "es2015"
    }
}
```

[ES2015 (ECMAScript 2015, ES6) の詳細については、公式ドキュメント](https://262.ecma-international.org/6.0/)を参照してください。

## 依存関係

他のGradleプロジェクトと同様に、Kotlin/JSプロジェクトは、ビルドスクリプトの`dependencies {}`ブロックで従来のGradleの[依存関係宣言](https://docs.gradle.org/current/userguide/declaring_dependencies.html)をサポートしています。

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

KotlinマルチプラットフォームGradleプラグインは、ビルドスクリプトの`kotlin {}`ブロックで特定のソースセットの依存関係宣言もサポートしています。

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

> Kotlinプログラミング言語で利用可能なすべてのライブラリがJavaScriptをターゲットとする際に利用できるわけではありません。Kotlin/JS用のアーティファクトを含むライブラリのみ使用できます。
>
{style="note"}

追加するライブラリが[npmからのパッケージ](#npm-dependencies)に依存している場合、Gradleはそれらの推移的依存関係も自動的に解決します。

### Kotlin標準ライブラリ

[標準ライブラリ](https://kotlinlang.org/api/latest/jvm/stdlib/index.html)への依存関係は自動的に追加されます。標準ライブラリのバージョンは、Kotlinマルチプラットフォームプラグインのバージョンと同じです。

マルチプラットフォームテストの場合、[`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) APIが利用可能です。マルチプラットフォームプロジェクトを作成する際、`commonTest`で単一の依存関係を使用することで、すべてのソースセットにテスト依存関係を追加できます。

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

### npm依存関係

JavaScriptの世界では、依存関係を管理する最も一般的な方法は[npm](https://www.npmjs.com/)です。これはJavaScriptモジュールの最大の公開リポジトリを提供します。

KotlinマルチプラットフォームGradleプラグインを使用すると、他の依存関係を宣言するのと同じように、Gradleビルドスクリプトでnpm依存関係を宣言できます。

npm依存関係を宣言するには、依存関係宣言内の`npm()`関数にその名前とバージョンを渡します。また、[npmのsemver構文](https://docs.npmjs.com/about-semantic-versioning)に基づいて、1つまたは複数のバージョン範囲を指定することもできます。

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

デフォルトでは、このプラグインはnpm依存関係をダウンロードしてインストールするために、[Yarn](https://yarnpkg.com/lang/en/)パッケージマネージャーの個別のインスタンスを使用します。追加の設定なしでそのまま動作しますが、[特定のニーズに合わせて調整](#yarn)できます。

代わりに、[npm](https://www.npmjs.com/)パッケージマネージャーを使用してnpm依存関係を直接操作することもできます。npmをパッケージマネージャーとして使用するには、`gradle.properties`ファイルで次のプロパティを設定します。

```none
kotlin.js.yarn=false
```

通常の依存関係の他に、Gradle DSLから使用できる依存関係にはさらに3つのタイプがあります。各依存関係タイプがいつ最もよく使用できるかについては、npmからリンクされている公式ドキュメントを参照してください。

*   `devNpm(...)`を介した[devDependencies](https://docs.npmjs.com/files/package.json#devdependencies)、
*   `optionalNpm(...)`を介した[optionalDependencies](https://docs.npmjs.com/files/package.json#optionaldependencies)、
*   `peerNpm(...)`を介した[peerDependencies](https://docs.npmjs.com/files/package.json#peerdependencies)。

npm依存関係がインストールされたら、[KotlinからJSを呼び出す](js-interop.md)で説明されているように、コードでそのAPIを使用できます。

## runタスク

KotlinマルチプラットフォームGradleプラグインは、追加の設定なしで純粋なKotlin/JSプロジェクトを実行できる`jsBrowserDevelopmentRun`タスクを提供します。

ブラウザでKotlin/JSプロジェクトを実行する場合、このタスクは`browserDevelopmentRun`タスクのエイリアスです（これもKotlinマルチプラットフォームプロジェクトで利用できます）。これは[webpack-dev-server](https://webpack.js.org/configuration/dev-server/)を使用してJavaScriptアーティファクトを提供します。`webpack-dev-server`で使用される設定をカスタマイズしたい場合、たとえばサーバーが実行されるポートを調整するには、[webpack設定ファイル](#webpack-bundling)を使用します。

Node.jsをターゲットとするKotlin/JSプロジェクトを実行するには、`nodeRun`タスクのエイリアスである`jsNodeDevelopmentRun`タスクを使用します。

プロジェクトを実行するには、標準ライフサイクルタスク`jsBrowserDevelopmentRun`、またはそれに対応するエイリアスを実行します。

```bash
./gradlew jsBrowserDevelopmentRun
```

ソースファイルを変更した後にアプリケーションの再ビルドを自動的にトリガーするには、Gradleの[連続ビルド](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:continuous_build)機能を使用します。

```bash
./gradlew jsBrowserDevelopmentRun --continuous
```

または

```bash
./gradlew jsBrowserDevelopmentRun -t
```

プロジェクトのビルドが成功すると、`webpack-dev-server`は自動的にブラウザページをリフレッシュします。

## testタスク

KotlinマルチプラットフォームGradleプラグインは、プロジェクトのテストインフラストラクチャを自動的にセットアップします。ブラウザプロジェクトの場合、必要な他の依存関係とともに[Karma](https://karma-runner.github.io/)テストランナーをダウンロードしてインストールします。Node.jsプロジェクトの場合、[Mocha](https://mochajs.org/)テストフレームワークが使用されます。

このプラグインは、以下のような便利なテスト機能も提供します。

*   ソースマップの生成
*   テストレポートの生成
*   コンソールでのテスト実行結果

ブラウザテストを実行する場合、プラグインはデフォルトで[Headless Chrome](https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md)を使用します。ビルドスクリプトの`useKarma {}`ブロック内に対応するエントリを追加することで、テストを実行する別のブラウザを選択することもできます。

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

あるいは、`gradle.properties`ファイルにブラウザのテストターゲットを追加することもできます。

```text
kotlin.js.browser.karma.browsers=firefox,safari
```

このアプローチにより、すべてのモジュールに対してブラウザのリストを定義し、特定のモジュールのビルドスクリプトで特定のブラウザを追加できます。

KotlinマルチプラットフォームGradleプラグインはこれらのブラウザを自動的にインストールしないことに注意してください。実行環境で利用可能なブラウザのみを使用します。たとえば、継続的インテグレーションサーバーでKotlin/JSテストを実行している場合は、テスト対象とするブラウザがインストールされていることを確認してください。

テストをスキップしたい場合は、`testTask {}`に`enabled = false`の行を追加します。

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

テストを実行するには、標準ライフサイクルタスク`check`を実行します。

```bash
./gradlew check
```

Node.jsテストランナーで使用される環境変数（たとえば、テストに外部情報を渡したり、パッケージの解決を微調整したりするため）を指定するには、ビルドスクリプトの`testTask {}`ブロック内でキーと値のペアを持つ`environment()`関数を使用します。

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

### Karma設定

KotlinマルチプラットフォームGradleプラグインは、ビルド時にKarma設定ファイルを自動的に生成します。これには、`build.gradle(.kts)`の[`kotlin.js.browser.testTask.useKarma {}`ブロック](#test-task)からの設定が含まれます。ファイルは`build/js/packages/projectName-test/karma.conf.js`にあります。
Karmaで使用される設定を調整するには、プロジェクトのルートにある`karma.config.d`というディレクトリ内に、追加の設定ファイルを配置します。このディレクトリ内のすべての`.js`設定ファイルは自動的に取得され、ビルド時に生成された`karma.conf.js`にマージされます。

Karmaのすべての設定機能は、Karmaの[ドキュメント](https://karma-runner.github.io/5.0/config/configuration-file.html)に詳細に記載されています。

## webpackバンドル

ブラウザをターゲットとする場合、KotlinマルチプラットフォームGradleプラグインは、広く知られている[webpack](https://webpack.js.org/)モジュールバンドラーを使用します。

### webpackバージョン

Kotlinマルチプラットフォームプラグインはwebpack %webpackMajorVersion%を使用します。

プラグインバージョン1.5.0より前に作成されたプロジェクトがある場合、プロジェクトの`gradle.properties`に以下の行を追加することで、これらのバージョンで使用されていたwebpack %webpackPreviousMajorVersion%に一時的に切り替えることができます。

```none
kotlin.js.webpack.major.version=4
```

### webpackタスク

最も一般的なwebpackの調整は、Gradleビルドファイルの`kotlin.js.browser.webpackTask {}`設定ブロックを介して直接行うことができます。
*   `outputFileName` - webpackでバンドルされた出力ファイルの名前。webpackタスクの実行後、`<projectDir>/build/dist/<targetName>`に生成されます。デフォルト値はプロジェクト名です。
*   `output.libraryTarget` - webpackでバンドルされた出力のモジュールシステムです。[Kotlin/JSプロジェクトで利用可能なモジュールシステム](js-modules.md)の詳細については、こちらを参照してください。デフォルト値は`umd`です。

```groovy
webpackTask {
    outputFileName = "mycustomfilename.js"
    output.libraryTarget = "commonjs2"
}
```

`commonWebpackConfig {}`ブロックで、バンドル、実行、テストタスクで使用する共通のwebpack設定を構成することもできます。

### webpack設定ファイル

KotlinマルチプラットフォームGradleプラグインは、ビルド時に標準のwebpack設定ファイルを自動的に生成します。これは`build/js/packages/projectName/webpack.config.js`にあります。

webpack設定をさらに調整したい場合は、プロジェクトのルートにある`webpack.config.d`というディレクトリ内に、追加の設定ファイルを配置します。プロジェクトをビルドする際、すべての`.js`設定ファイルは自動的に`build/js/packages/projectName/webpack.config.js`ファイルにマージされます。
たとえば、新しい[webpackローダー](https://webpack.js.org/loaders/)を追加するには、`webpack.config.d`ディレクトリ内の`.js`ファイルに以下を追加します。

> この場合、設定オブジェクトはグローバルオブジェクト`config`です。スクリプト内でこれを変更する必要があります。
>
{style="note"}

```groovy
config.module.rules.push({
    test: /\.extension$/,
    loader: 'loader-name'
});
```

webpackのすべての設定機能は、その[ドキュメント](https://webpack.js.org/concepts/configuration/)に詳細に記載されています。

### 実行可能ファイルのビルド

webpackを介して実行可能なJavaScriptアーティファクトをビルドするために、KotlinマルチプラットフォームGradleプラグインには`browserDevelopmentWebpack`および`browserProductionWebpack` Gradleタスクが含まれています。

*   `browserDevelopmentWebpack`は、開発用アーティファクトを作成します。これらはサイズが大きくなりますが、作成にほとんど時間がかかりません。そのため、活発な開発中に`browserDevelopmentWebpack`タスクを使用してください。

*   `browserProductionWebpack`は、生成されたアーティファクトにデッドコード除去を適用し、結果のJavaScriptファイルをminifyします。これにはより時間がかかりますが、サイズがより小さい実行可能ファイルを生成します。そのため、本番環境向けにプロジェクトを準備する際に`browserProductionWebpack`タスクを使用してください。

開発または本番用のそれぞれのアーティファクトを取得するには、これらのタスクのいずれかを実行します。生成されたファイルは、[別途指定](#distribution-target-directory)されない限り、`build/dist`に保存されます。

```bash
./gradlew browserProductionWebpack
```

これらのタスクは、ターゲットが実行可能ファイル（`binaries.executable()`を介して）を生成するように構成されている場合にのみ利用可能になることに注意してください。

## CSS

KotlinマルチプラットフォームGradleプラグインは、webpackの[CSS](https://webpack.js.org/loaders/css-loader/)および[style](https://webpack.js.org/loaders/style-loader/)ローダーのサポートも提供します。すべてのオプションは、プロジェクトのビルドに使用される[webpack設定ファイル](#webpack-bundling)を直接変更することで変更できますが、最も一般的に使用される設定は`build.gradle(.kts)`ファイルから直接利用できます。

プロジェクトでCSSサポートを有効にするには、Gradleビルドファイルの`commonWebpackConfig {}`ブロックで`cssSupport.enabled`オプションを設定します。この設定は、ウィザードを使用して新しいプロジェクトを作成する際にもデフォルトで有効になります。

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

あるいは、`webpackTask {}`、`runTask {}`、`testTask {}`に対して個別にCSSサポートを追加することもできます。

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

プロジェクトでCSSサポートを有効にすると、未設定のプロジェクトからスタイルシートを使用しようとしたときに発生する`Module parse failed: Unexpected character '@' (14:0)`などの一般的なエラーを防ぐのに役立ちます。

`cssSupport.mode`を使用して、検出されたCSSをどのように処理するかを指定できます。利用可能な値は次のとおりです。

*   `"inline"` (デフォルト)：スタイルはグローバルな`<style>`タグに追加されます。
*   `"extract"`：スタイルは別のファイルに抽出されます。その後、HTMLページから含めることができます。
*   `"import"`：スタイルは文字列として処理されます。これは、コードからCSSにアクセスする必要がある場合（例：`val styles = require("main.css")`）に役立ちます。

同じプロジェクトで異なるモードを使用するには、`cssSupport.rules`を使用します。ここでは、モード、および[include](https://webpack.js.org/configuration/module/#ruleinclude)と[exclude](https://webpack.js.org/configuration/module/#ruleexclude)パターンを定義する`KotlinWebpackCssRules`のリストを指定できます。

## Node.js

Node.jsをターゲットとするKotlin/JSプロジェクトの場合、プラグインは自動的にホストにNode.js環境をダウンロードしてインストールします。既存のNode.jsインスタンスがある場合は、それを使用することもできます。

### Node.js設定の構成

Node.jsの設定は、各サブプロジェクトに対して構成することも、プロジェクト全体として設定することもできます。

たとえば、特定のサブプロジェクトのNode.jsバージョンを設定するには、`build.gradle(.kts)`ファイルのGradleブロックに次の行を追加します。

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

すべてのサブプロジェクトを含むプロジェクト全体のバージョンを設定するには、同じコードを`allProjects {}`ブロックに適用します。

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

> `NodeJsRootPlugin`クラスを使用してプロジェクト全体のNode.js設定を構成することは非推奨であり、最終的にはサポートされなくなります。
>
{style="note"}

### プリインストールされたNode.jsを使用する

Kotlin/JSプロジェクトをビルドするホストにNode.jsがすでにインストールされている場合、KotlinマルチプラットフォームGradleプラグインを、独自のNode.jsインスタンスをインストールする代わりに、既存のNode.jsを使用するように構成できます。

プリインストールされたNode.jsインスタンスを使用するには、`build.gradle(.kts)`ファイルに次の行を追加します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
project.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin) {
    // Set to `true` for default behavior
    project.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec).download = false
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
project.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin> {
    // Set to `true` for default behavior
    project.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec>().download = false
}
```

</tab>
</tabs>

## Yarn

デフォルトでは、ビルド時に宣言された依存関係をダウンロードしてインストールするために、プラグインは[Yarn](https://yarnpkg.com/lang/en/)パッケージマネージャーの独自のインスタンスを管理します。追加の設定なしでそのまま動作しますが、調整したり、ホストにすでにインストールされているYarnを使用したりできます。

### 追加のYarn機能: .yarnrc

追加のYarn機能を構成するには、プロジェクトのルートに`.yarnrc`ファイルを配置します。ビルド時に自動的に認識されます。

たとえば、npmパッケージのカスタムレジストリを使用するには、プロジェクトルートの`.yarnrc`というファイルに次の行を追加します。

```text
registry "http://my.registry/api/npm/"
```

`.yarnrc`の詳細については、[Yarn公式ドキュメント](https://classic.yarnpkg.com/en/docs/yarnrc/)を参照してください。

### プリインストールされたYarnを使用する

Kotlin/JSプロジェクトをビルドするホストにYarnがすでにインストールされている場合、KotlinマルチプラットフォームGradleプラグインを、独自のYarnインスタンスをインストールする代わりに、既存のYarnを使用するように構成できます。

プリインストールされたYarnインスタンスを使用するには、`build.gradle(.kts)`に次の行を追加します。

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

### kotlin-js-storeによるバージョンロック

> `kotlin-js-store`によるバージョンロックはKotlin 1.6.10以降で利用可能です。
>
{style="note"}

プロジェクトルートの`kotlin-js-store`ディレクトリは、バージョンロックに必要となる`yarn.lock`ファイルを保持するために、KotlinマルチプラットフォームGradleプラグインによって自動的に生成されます。ロックファイルはYarnプラグインによって完全に管理され、`kotlinNpmInstall` Gradleタスクの実行中に更新されます。

[推奨されるプラクティス](https://classic.yarnpkg.com/blog/2016/11/24/lockfiles-for-all/)に従うために、`kotlin-js-store`とその内容をバージョン管理システムにコミットしてください。これにより、すべてのマシンでまったく同じ依存関係ツリーでアプリケーションがビルドされることが保証されます。

必要に応じて、`build.gradle(.kts)`でディレクトリ名とロックファイル名の両方を変更できます。

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

> ロックファイルの名前を変更すると、依存関係検査ツールがファイルを認識しなくなる可能性があります。
>
{style="warning"}

`yarn.lock`の詳細については、[Yarn公式ドキュメント](https://classic.yarnpkg.com/lang/en/docs/yarn-lock/)を参照してください。

### yarn.lockが更新されたことの報告

Kotlin/JSは、`yarn.lock`ファイルが更新された場合に通知できるGradle設定を提供します。これらの設定は、CIビルドプロセス中に`yarn.lock`が静かに変更された場合に通知を受けたい場合に使用できます。

*   `YarnLockMismatchReport`は、`yarn.lock`ファイルの変更がどのように報告されるかを指定します。以下のいずれかの値を使用できます。
    *   `FAIL`：対応するGradleタスクを失敗させます。これがデフォルトです。
    *   `WARNING`：変更に関する情報を警告ログに書き込みます。
    *   `NONE`：レポートを無効にします。
*   `reportNewYarnLock`は、最近作成された`yarn.lock`ファイルについて明示的に報告します。デフォルトでは、このオプションは無効になっています。これは、最初の起動時に新しい`yarn.lock`ファイルを生成するのが一般的な慣行であるためです。このオプションを使用して、ファイルがリポジトリにコミットされていることを確認できます。
*   `yarnLockAutoReplace`は、Gradleタスクが実行されるたびに`yarn.lock`を自動的に置き換えます。

これらのオプションを使用するには、`build.gradle(.kts)`を次のように更新します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnLockMismatchReport
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension

rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin::class.java) {
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

### デフォルトで`--ignore-scripts`を使用したnpm依存関係のインストール

> `--ignore-scripts`を使用したnpm依存関係のインストールは、デフォルトでKotlin 1.6.10以降で利用可能です。
>
{style="note"}

侵害されたnpmパッケージからの悪意のあるコードの実行の可能性を減らすために、KotlinマルチプラットフォームGradleプラグインは、デフォルトでnpm依存関係のインストール中に[ライフサイクルスクリプト](https://docs.npmjs.com/cli/v8/using-npm/scripts#life-cycle-scripts)の実行を防ぎます。

`build.gradle(.kts)`に次の行を追加することで、ライフサイクルスクリプトの実行を明示的に有効にできます。

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

デフォルトでは、Kotlin/JSプロジェクトのビルド結果は、プロジェクトルート内の`/build/dist/<targetName>/<binaryName>`ディレクトリに配置されます。

> Kotlin 1.9.0以前では、デフォルトの配布ターゲットディレクトリは`/build/distributions`でした。
>
{style="note" }

プロジェクト配布ファイルの別の場所を設定するには、ビルドスクリプトの`browser {}`ブロック内に`distribution {}`ブロックを追加し、`set()`メソッドを使用して`outputDirectory`プロパティに値を割り当てます。プロジェクトのビルドタスクを実行すると、Gradleはこの場所にプロジェクトリソースとともにバンドルされた出力が保存されます。

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

JavaScript _モジュール_（`build/js/packages/myModuleName`に生成される）の名前（対応する`.js`ファイルと`.d.ts`ファイルを含む）を調整するには、`moduleName`オプションを使用します。

```groovy
js {
    moduleName = "myModuleName"
}
```

これは`build/dist`内のwebpackでバンドルされた出力には影響しないことに注意してください。

## package.jsonのカスタマイズ

`package.json`ファイルは、JavaScriptパッケージのメタデータを保持します。npmなどの人気のあるパッケージレジストリは、公開されるすべてのパッケージにこのファイルが必要とされます。それらはパッケージの公開を追跡および管理するために使用します。

KotlinマルチプラットフォームGradleプラグインは、ビルド時にKotlin/JSプロジェクト用の`package.json`を自動的に生成します。デフォルトでは、このファイルには必須データ（名前、バージョン、ライセンス、依存関係、およびその他のパッケージ属性）が含まれています。

基本的なパッケージ属性以外にも、`package.json`はJavaScriptプロジェクトがどのように動作すべきか、たとえば、実行可能なスクリプトを特定する方法を定義できます。

Gradle DSLを介して、プロジェクトの`package.json`にカスタムエントリを追加できます。`package.json`にカスタムフィールドを追加するには、コンパイルの`packageJson`ブロックで`customField()`関数を使用します。

```kotlin
kotlin {
    js {
        compilations["main"].packageJson {
            customField("hello", mapOf("one" to 1, "two" to 2))
        }
    }
}
```

プロジェクトをビルドすると、このコードは`package.json`ファイルに次のブロックを追加します。

```json
"hello": {
    "one": 1,
    "two": 2
}
```

npmレジストリ用の`package.json`ファイルの書き方については、[npmドキュメント](https://docs.npmjs.com/cli/v6/configuring-npm/package-json)を参照してください。