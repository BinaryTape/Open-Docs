---
title: "Kotlin/JS プロジェクトのセットアップ"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Kotlin/JSプロジェクトは、ビルドシステムとしてGradleを使用します。開発者がKotlin/JSプロジェクトを簡単に管理できるように、プロジェクト構成ツールと、JavaScript開発で一般的なルーチンを自動化するためのヘルパータスクを提供する、`kotlin.multiplatform` Gradle plugin を提供しています。

このpluginは、[npm](https://www.npmjs.com/) または [Yarn](https://yarnpkg.com/) パッケージマネージャーを使用してnpm依存関係をバックグラウンドでダウンロードし、[webpack](https://webpack.js.org/) を使用してKotlinプロジェクトからJavaScriptバンドルをビルドします。依存関係の管理と構成の調整は、Gradleビルドファイルから直接行うことができ、自動生成された構成を上書きして完全に制御することも可能です。

`org.jetbrains.kotlin.multiplatform` pluginは、`build.gradle(.kts)` ファイル内でGradleプロジェクトに手動で適用できます。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    kotlin("multiplatform") version "2.1.20"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '2.1.20'
}
```

</TabItem>
</Tabs>

Kotlin Multiplatform Gradle pluginを使用すると、ビルドスクリプトの `kotlin {}` ブロックでプロジェクトのさまざまな側面を管理できます。

```groovy
kotlin {
    // ...
}
```

`kotlin {}` ブロック内では、次の側面を管理できます。

* [ターゲット実行環境](#execution-environments): ブラウザまたはNode.js
* [ES2015機能のサポート](#support-for-es2015-features): クラス、モジュール、およびジェネレーター
* [プロジェクトの依存関係](#dependencies): Mavenおよびnpm
* [実行構成](#run-task)
* [テスト構成](#test-task)
* ブラウザプロジェクトの[バンドル](#webpack-bundling)と[CSSサポート](#css)
* [ターゲットディレクトリ](#distribution-target-directory)と[モジュール名](#module-name)
* [プロジェクトの `package.json` ファイル](#package-json-customization)

## 実行環境

Kotlin/JSプロジェクトは、2つの異なる実行環境をターゲットにできます。

* ブラウザでのクライアントサイドスクリプト
* ブラウザの外部でJavaScriptコードを実行するための[Node.js](https://nodejs.org/)。たとえば、サーバーサイドスクリプトなど。

Kotlin/JSプロジェクトのターゲット実行環境を定義するには、`browser {}` または `nodejs {}` を含む `js {}` ブロックを追加します。

```groovy
kotlin {
    js {
        browser {
        }
        binaries.executable()
    }
}
```

`binaries.executable()` 命令は、Kotlinコンパイラーに実行可能な `.js` ファイルを出力するように明示的に指示します。
`binaries.executable()` を省略すると、コンパイラーはKotlin内部ライブラリファイルのみを生成します。これは他のプロジェクトから使用できますが、単独では実行できません。

:::note
これは通常、実行可能ファイルを作成するよりも高速です。
また、プロジェクトのリーフモジュール以外を扱う場合に可能な最適化になります。

Kotlin Multiplatform pluginは、選択された環境で動作するようにタスクを自動的に構成します。
これには、アプリケーションの実行とテストに必要な環境と依存関係のダウンロードとインストールが含まれます。
これにより、開発者は追加の構成なしで、簡単なプロジェクトをビルド、実行、およびテストできます。
Node.jsをターゲットとするプロジェクトの場合、既存のNode.jsインストールを使用するオプションもあります。[プリインストールされたNode.jsの使用方法](#use-pre-installed-node-js)をご覧ください。

## ES2015機能のサポート

Kotlinは、次のES2015機能の[Experimental](components-stability#stability-levels-explained)サポートを提供します。

* コードベースを簡素化し、保守性を向上させるモジュール
* OOP原則を組み込むことができるクラス。これにより、よりクリーンで直感的なコードになります。
* 最終的なバンドルサイズを改善し、デバッグに役立つ[suspend functions](composing-suspending-functions)をコンパイルするためのジェネレーター

`build.gradle(.kts)` ファイルに `es2015` コンパイルターゲットを追加することで、サポートされているすべてのES2015機能を一度に有効にできます。

```kotlin
tasks.withType<KotlinJsCompile>().configureEach {
    kotlinOptions {
        target = "es2015"
    }
}
```

[ES2015（ECMAScript 2015、ES6）の詳細については、公式ドキュメントをご覧ください](https://262.ecma-international.org/6.0/)。

## 依存関係

他のGradleプロジェクトと同様に、Kotlin/JSプロジェクトは、ビルドスクリプトの `dependencies {}` ブロックで従来のGradle [dependency declarations](https://docs.gradle.org/current/userguide/declaring_dependencies.html)をサポートします。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
dependencies {
    implementation("org.example.myproject", "1.1.0")
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
dependencies {
    implementation 'org.example.myproject:1.1.0'
}
```

</TabItem>
</Tabs>

Kotlin Multiplatform Gradle pluginは、ビルドスクリプトの `kotlin {}` ブロック内の特定のソースセットの依存関係宣言もサポートします。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

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

</TabItem>
<TabItem value="groovy" label="Groovy" default>

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

</TabItem>
</Tabs>

Kotlinプログラミング言語で使用できるすべてのライブラリがJavaScriptをターゲットにする場合に利用できるわけではありません。
Kotlin/JSのアーティファクトを含むライブラリのみを使用できます。

:::

追加しているライブラリが[npmのパッケージ](#npm-dependencies)への依存関係を持っている場合、Gradleはこれらの推移的な依存関係も自動的に解決します。

### Kotlin標準ライブラリ

[標準ライブラリ](https://kotlinlang.org/api/latest/jvm/stdlib/index.html)への依存関係は自動的に追加されます。標準ライブラリのバージョンは、Kotlin Multiplatform pluginのバージョンと同じです。

マルチプラットフォームテストの場合、[`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) APIが利用可能です。マルチプラットフォームプロジェクトを作成する場合、`commonTest` で単一の依存関係を使用することにより、すべてのソースセットにテスト依存関係を追加できます。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets {
        commonTest.dependencies {
            implementation(kotlin("test")) // Brings all the platform dependencies automatically
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

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

</TabItem>
</Tabs>

### npm 依存関係

JavaScriptの世界では、依存関係を管理する最も一般的な方法は [npm](https://www.npmjs.com/) です。
これは、JavaScriptモジュールの最大の公開リポジトリを提供します。

Kotlin Multiplatform Gradle pluginを使用すると、他の依存関係を宣言するのと同じように、Gradleビルドスクリプトでnpm依存関係を宣言できます。

npm依存関係を宣言するには、その名前とバージョンを依存関係宣言内の `npm()` 関数に渡します。
[npmのセマンティックバージョニング構文](https://docs.npmjs.com/about-semantic-versioning)に基づいて、1つまたは複数のバージョン範囲を指定することもできます。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
dependencies {
    implementation(npm("react", "> 14.0.0 &lt;=16.9.0"))
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
dependencies {
    implementation npm('react', '> 14.0.0 &lt;=16.9.0')
}
```

</TabItem>
</Tabs>

デフォルトでは、pluginは [Yarn](https://yarnpkg.com/lang/en/) パッケージマネージャーの個別のインスタンスを使用して、npm依存関係をダウンロードしてインストールします。
追加の構成なしですぐに使用できますが、[特定のニーズに合わせて調整](#yarn)できます。

[npm](https://www.npmjs.com/) パッケージマネージャーを使用して、npm依存関係を直接操作することもできます。
npmをパッケージマネージャーとして使用するには、`gradle.properties` ファイルで、次のプロパティを設定します。

```none
kotlin.js.yarn=false
```

通常の依存関係に加えて、Gradle DSLから使用できる依存関係には、さらに3つのタイプがあります。
各タイプの依存関係を最適に使用できる場合については、npmからリンクされている公式ドキュメントをご覧ください。

* [devDependencies](https://docs.npmjs.com/files/package.json#devdependencies)（`devNpm(...)` 経由）
* [optionalDependencies](https://docs.npmjs.com/files/package.json#optionaldependencies)（`optionalNpm(...)` 経由）
* [peerDependencies](https://docs.npmjs.com/files/package.json#peerdependencies)（`peerNpm(...)` 経由）

npm依存関係がインストールされると、[KotlinからのJSの呼び出し](js-interop)で説明されているように、コード内でそのAPIを使用できます。

## run task

Kotlin Multiplatform Gradle pluginは、追加の構成なしで純粋なKotlin/JSプロジェクトを実行できる `jsBrowserDevelopmentRun` タスクを提供します。

ブラウザでKotlin/JSプロジェクトを実行する場合、このタスクは `browserDevelopmentRun` タスクのエイリアスです（これはKotlinマルチプラットフォームプロジェクトでも利用可能です）。これは [webpack-dev-server](https://webpack.js.org/configuration/dev-server/) を使用して、JavaScriptアーティファクトを提供します。
たとえば、サーバーが実行されるポートを調整するなど、`webpack-dev-server` で使用される構成をカスタマイズする場合は、[webpack構成ファイル](#webpack-bundling)を使用します。

Node.jsをターゲットとするKotlin/JSプロジェクトを実行するには、`nodeRun` タスクのエイリアスである `jsNodeDevelopmentRun` タスクを使用します。

プロジェクトを実行するには、標準ライフサイクルの `jsBrowserDevelopmentRun` タスク、またはそれに対応するエイリアスを実行します。

```bash
./gradlew jsBrowserDevelopmentRun
```

ソースファイルに変更を加えた後、アプリケーションの再ビルドを自動的にトリガーするには、Gradle [continuous build](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:continuous_build) 機能を使用します。

```bash
./gradlew jsBrowserDevelopmentRun --continuous
```

または

```bash
./gradlew jsBrowserDevelopmentRun -t
```

プロジェクトのビルドが成功すると、`webpack-dev-server` はブラウザページを自動的に更新します。

## test task

Kotlin Multiplatform Gradle pluginは、プロジェクトのテストインフラストラクチャを自動的に設定します。ブラウザプロジェクトの場合、[Karma](https://karma-runner.github.io/) テストランナーを他の必要な依存関係とともにダウンロードしてインストールします。
Node.jsプロジェクトの場合、[Mocha](https://mochajs.org/) テストフレームワークが使用されます。

このpluginは、次のような便利なテスト機能も提供します。

* ソースマップの生成
* テストレポートの生成
* コンソールでのテスト実行結果

ブラウザテストを実行するために、pluginはデフォルトで [Headless Chrome](https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README) を使用します。`build.gradle(.kts)` ファイルの `useKarma {}` ブロック内に対応するエントリを追加することにより、テストを実行する別のブラウザを選択することもできます。

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

このアプローチを使用すると、すべてのモジュールのブラウザのリストを定義し、特定のモジュールのビルドスクリプトに特定のブラウザを追加できます。

Kotlin Multiplatform Gradle pluginは、これらのブラウザを自動的にインストールしません。実行環境で使用可能なブラウザのみを使用することに注意してください。たとえば、継続的インテグレーションサーバーでKotlin/JSテストを実行する場合は、テスト対象のブラウザがインストールされていることを確認してください。

テストをスキップする場合は、`enabled = false` という行を `testTask {}` に追加します。

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

テストを実行するには、標準ライフサイクルの `check` タスクを実行します。

```bash
./gradlew check
```

Node.jsテストランナーで使用される環境変数を指定するには（たとえば、外部情報をテストに渡したり、パッケージの解決を微調整したりするため）、ビルドスクリプトの `testTask {}` ブロック内で、キーと値のペアを指定して `environment()` 関数を使用します。

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

### Karma構成

Kotlin Multiplatform Gradle pluginは、ビルド時にKarma構成ファイルを自動的に生成します。これには、`build.gradle(.kts)` の [`kotlin.js.browser.testTask.useKarma {}` ブロック](#test-task)からの設定が含まれています。
このファイルは `build/js/packages/projectName-test/karma.conf.js` にあります。
Karmaで使用される構成を調整するには、プロジェクトのルートにある `karma.config.d` というディレクトリ内に、追加の構成ファイルを配置します。このディレクトリ内のすべての `.js` 構成ファイルが選択され、ビルド時に生成された `karma.conf.js` に自動的にマージされます。

Karmaのすべての構成機能は、Karmaの[ドキュメント](https://karma-runner.github.io/5.0/config/configuration-file.html)に詳しく説明されています。

## webpack バンドル

ブラウザターゲットの場合、Kotlin Multiplatform Gradle pluginは、広く知られている [webpack](https://webpack.js.org/) モジュールバンドラーを使用します。

### webpackのバージョン

Kotlin Multiplatform pluginは webpack 5を使用します。

1.5.0より前のpluginバージョンで作成されたプロジェクトがある場合は、次の行をプロジェクトの `gradle.properties` に追加することにより、これらのバージョンで使用されているwebpack 4に一時的に切り替えることができます。

```none
kotlin.js.webpack.major.version=4
```

### webpackタスク

最も一般的なwebpackの調整は、Gradleビルドファイルの `kotlin.js.browser.webpackTask {}` 構成ブロックで直接行うことができます。
* `outputFileName` - webpackで出力されたファイルの名前。これはwebpackタスクの実行後、`<projectDir>/build/dist/<targetName>` に生成されます。デフォルト値はプロジェクト名です。
* `output.libraryTarget` - webpackで出力されたモジュールシステム。[Kotlin/JSプロジェクトで利用可能なモジュールシステム](js-modules)の詳細をご覧ください。デフォルト値は `umd` です。
  
```groovy
webpackTask {
    outputFileName = "mycustomfilename.js"
    output.libraryTarget = "commonjs2"
}
```

`commonWebpackConfig {}` ブロックで、バンドル、実行、およびテストタスクで使用する一般的なwebpack設定を構成することもできます。

### webpack構成ファイル

Kotlin Multiplatform Gradle pluginは、ビルド時に標準のwebpack構成ファイルを自動的に生成します。これは `build/js/packages/projectName/webpack.config.js` にあります。

webpack構成をさらに調整する場合は、プロジェクトのルートにある `webpack.config.d` というディレクトリ内に、追加の構成ファイルを配置します。プロジェクトをビルドすると、すべての `.js` 構成ファイルが自動的に `build/js/packages/projectName/webpack.config.js` ファイルにマージされます。
たとえば、新しい [webpack ローダー](https://webpack.js.org/loaders/)を追加するには、`webpack.config.d` ディレクトリ内の `.js` ファイルに次を追加します。

:::note
この場合、構成オブジェクトは `config` グローバルオブジェクトです。スクリプトで変更する必要があります。

:::

```groovy
config.module.rules.push({
    test: /\.extension$/,
    loader: 'loader-name'
});
```

webpackのすべての構成
機能は、その[ドキュメント](https://webpack.js.org/concepts/configuration/)に詳しく説明されています。

### 実行可能ファイルのビルド

webpackを介して実行可能なJavaScriptアーティファクトをビルドするために、Kotlin Multiplatform Gradle pluginには `browserDevelopmentWebpack` および `browserProductionWebpack` Gradleタスクが含まれています。

* `browserDevelopmentWebpack` は、サイズは大きいものの、作成に時間がかからない開発アーティファクトを作成します。
そのため、アクティブな開発中は `browserDevelopmentWebpack` タスクを使用してください。

* `browserProductionWebpack` は、生成されたアーティファクトにデッドコード除去を適用し、結果のJavaScriptファイルを最小化します。これは時間がかかりますが、サイズが小さい実行可能ファイルを生成します。そのため、プロジェクトを本番環境で使用する準備をするときは、`browserProductionWebpack` タスクを使用してください。
 
 これらのタスクのいずれかを実行して、開発または本番環境用のそれぞれのアーティファクトを取得します。生成されたファイルは、[特に指定がない限り](#distribution-target-directory)、`build/dist` で利用できます。

```bash
./gradlew browserProductionWebpack
```

これらのタスクは、ターゲットが実行可能ファイル（`binaries.executable()` 経由）を生成するように構成されている場合にのみ利用可能になることに注意してください。

## CSS

Kotlin Multiplatform Gradle pluginは、webpackの[CSS](https://webpack.js.org/loaders/css-loader/) および
[スタイル](https://webpack.js.org/loaders/style-loader/)ローダーのサポートも提供します。すべてのオプションは、プロジェクトのビルドに使用される[webpack構成ファイル](#webpack-bundling)を直接変更することで変更できますが、最も一般的に使用される設定は、`build.gradle(.kts)` ファイルから直接利用できます。

プロジェクトでCSSサポートをオンにするには、Gradleビルドファイルの `commonWebpackConfig {}` ブロックで `cssSupport.enabled` オプションを設定します。この構成は、ウィザードを使用して新しいプロジェクトを作成する場合にも、デフォルトで有効になっています。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
browser {
    commonWebpackConfig {
        cssSupport {
            enabled.set(true)
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
browser {
    commonWebpackConfig {
        cssSupport {
            it.enabled = true
        }
    }
}
```

</TabItem>
</Tabs>

または、`webpackTask {}`、`runTask {}`、および `testTask {}` に対して個別にCSSサポートを追加できます。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

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

</TabItem>
<TabItem value="groovy" label="Groovy" default>

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

</TabItem>
</Tabs>

プロジェクトでCSSサポートをアクティブにすると、構成されていないプロジェクトからスタイルシートを使用しようとしたときに発生する一般的なエラー（`Module parse failed: Unexpected character '@' (14:0)`など）を防ぐのに役立ちます。

`cssSupport.mode` を使用して、検出されたCSSの処理方法を指定できます。次の値を使用できます。

* `"inline"` (default): スタイルはグローバル `<style>` タグに追加されます。
* `"extract"`: スタイルは別のファイルに抽出されます。その後、HTMLページから含めることができます。
* `"import"`: スタイルは文字列として処理されます。これは、コードからCSSにアクセスする必要がある場合に役立ちます（`val styles = require("main.css")` など）。

同じプロジェクトで異なるモードを使用するには、`cssSupport.rules` を使用します。ここでは、`KotlinWebpackCssRules` のリストを指定できます。各リストは、[include](https://webpack.js.org/configuration/module/#ruleinclude) および [exclude](https://webpack.js.org/configuration/module/#ruleexclude) パターンと同様に、モードを定義します。

## Node.js

Node.jsをターゲットとするKotlin/JSプロジェクトの場合、pluginはホストにNode.js環境を自動的にダウンロードしてインストールします。
既存のNode.jsインスタンスがある場合は、それを使用することもできます。

### Node.js設定の構成

Node.js設定はサブプロジェクトごとに構成するか、プロジェクト全体に対して設定できます。

たとえば、特定のサブプロジェクトのNode.jsバージョンを設定するには、`build.gradle(.kts)` ファイルのGradleブロックに次の行を追加します。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
project.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin> {
    project.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec>().version = "your Node.js version"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
project.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin) {
    project.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec).version = "your Node.js version"
}
```

</TabItem>
</Tabs>

すべてのサブプロジェクトを含むプロジェクト全体のバージョンを設定するには、同じコードを `allProjects {}` ブロックに適用します。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
allprojects {
    project.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin> {
        project.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec>().version = "your Node.js version"
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
allprojects {
    project.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin) {
        project.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec).version = "your Node.js version"
}
```

</TabItem>
</Tabs>

:::note
`NodeJsRootPlugin` クラスを使用してプロジェクト全体のNode.js設定を構成する方法は非推奨であり、最終的にはサポートされなくなります。

:::

### プリインストールされたNode.jsの使用

Kotlin/JSプロジェクトをビルドするホストにNode.jsがすでにインストールされている場合は、Kotlin Multiplatform Gradle
pluginを構成して、独自のNode.jsインスタンスをインストールする代わりに、それを使用できます。

プリインストールされたNode.jsインスタンスを使用するには、次の行を `build.gradle(.kts)` ファイルに追加します。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
project.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin) {
    // Set to `true` for default behavior
    project.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec).download = false
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
project.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin> {
    // Set to `true` for default behavior
    project.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec>().download = false
}
```

</TabItem>
</Tabs>

## Yarn

デフォルトでは、ビルド時に宣言された依存関係をダウンロードしてインストールするために、pluginは [Yarn](https://yarnpkg.com/lang/en/) パッケージマネージャーの独自のインスタンスを管理します。
追加の構成なしですぐに使用できますが、調整したり、ホストにすでにインストールされているYarnを使用したりできます。

### 追加のYarn機能：.yarnrc

追加のYarn機能を構成するには、プロジェクトのルートに `.yarnrc` ファイルを配置します。
ビルド時に、自動的に選択されます。

たとえば、npmパッケージにカスタムレジストリを使用するには、プロジェクトルートにある `.yarnrc` というファイルに次の行を追加します。

```text
registry "http://my.registry/api/npm/"
```

`.yarnrc` の詳細については、[公式Yarnドキュメント](https://classic.yarnpkg.com/en/docs/yarnrc/)をご覧ください。

### プリインストールされたYarnの使用

Kotlin/JSプロジェクトをビルドするホストにYarnがすでにインストールされている場合は、Kotlin Multiplatform Gradle
pluginを構成して、独自のYarnインスタンスをインストールする代わりに、それを使用できます。

プリインストールされたYarnインスタンスを使用するには、`build.gradle(.kts)` に次の行を追加します。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> {
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().download = false
    // "true" for default behavior
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).download = false
}
 
```

</TabItem>
</Tabs>

### kotlin-js-store経由のバージョンロック

:::note
`kotlin-js-store` を使用したバージョンロックは、Kotlin 1.6.10以降で使用できます。

:::

プロジェクトルートの `kotlin-js-store` ディレクトリは、バージョンロックに必要な `yarn.lock` ファイルを保持するために、Kotlin Multiplatform Gradle pluginによって自動的に生成されます。
ロックファイルはYarn pluginによって完全に管理され、`kotlinNpmInstall` Gradleタスクの実行中に更新されます。

[推奨されるプラクティス](https://classic.yarnpkg.com/blog/2016/11/24/lockfiles-for-all/)に従うには、`kotlin-js-store` とそのコンテンツをバージョン管理システムにコミットします。これにより、アプリケーションがすべてのマシンでまったく同じ依存関係ツリーでビルドされることが保証されます。

必要に応じて、`build.gradle(.kts)` でディレクトリ名とロックファイル名の両方を変更できます。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> {
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().lockFileDirectory =
        project.rootDir.resolve("my-kotlin-js-store")
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().lockFileName = "my-yarn.lock"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).lockFileDirectory =
        file("my-kotlin-js-store")
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).lockFileName = 'my-yarn.lock'
}
```

</TabItem>
</Tabs>

:::note
ロックファイルの名前を変更すると、依存関係検査ツールがファイルを認識しなくなる可能性があります。

`yarn.lock` の詳細については、[公式Yarnドキュメント](https://classic.yarnpkg.com/lang/en/docs/yarn-lock/)をご覧ください。

### yarn.lockが更新されたことのレポート

Kotlin/JSは、`yarn.lock` ファイルが更新された場合に通知できるGradle設定を提供します。
CIビルドプロセス中に `yarn.lock` がサイレントに変更された場合に通知を受けたい場合は、これらの設定を使用できます。

* `YarnLockMismatchReport`: `yarn.lock` ファイルへの変更がどのように報告されるかを指定します。次のいずれかの値を使用できます。
    * `FAIL`: 対応するGradleタスクを失敗させます。これがデフォルトです。
    * `WARNING`: 警告ログに変更に関する情報を書き込みます。
    * `NONE`: レポートを無効にします。
* `reportNewYarnLock`: 最近作成された `yarn.lock` ファイルについて明示的に報告します。デフォルトでは、このオプションは無効になっています。これは、最初の起動時に新しい `yarn.lock` ファイルを生成するのが一般的なプラクティスであるためです。このオプションを使用して、ファイルがリポジトリにコミットされていることを確認できます。
* `yarnLockAutoReplace`: Gradleタスクが実行されるたびに、`yarn.lock` を自動的に置き換えます。

これらのオプションを使用するには、次のように `build.gradle(.kts)` を更新します。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnLockMismatchReport
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension

rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin::class.java) \{
    rootProject.the<YarnRootExtension>().yarnLockMismatchReport =
        YarnLockMismatchReport.WARNING // NONE | FAIL
    rootProject.the<YarnRootExtension>().reportNewYarnLock = false // true
    rootProject.the<YarnRootExtension>().yarnLockAutoReplace = false // true
\}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnLockMismatchReport
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension

rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) \{
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).yarnLockMismatchReport =
        YarnLockMismatchReport.WARNING // NONE | FAIL
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).reportNewYarnLock = false // true
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).yarnLockAutoReplace = false // true
\}
```

</TabItem>
</Tabs>

### デフォルトで--ignore-scriptsを使用してnpm依存関係をインストールする

デフォルトで `--ignore-scripts` を使用したnpm依存関係のインストールは、Kotlin 1.6.10以降で使用できます。

:::

侵害されたnpmパッケージからの悪意のあるコードの実行の可能性を減らすために、Kotlin Multiplatform Gradle pluginは、デフォルトでnpm依存関係のインストール中に[ライフサイクルスクリプト](https://docs.npmjs.com/cli/v8/using-npm/scripts#life-cycle-scripts)の実行を防止します。

次の行を `build.gradle(.kts)` に追加することにより、ライフサイクルスクリプトの実行を明示的に有効にできます。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> { 
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().ignoreScripts = false
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).ignoreScripts = false
}
```

</TabItem>
</Tabs>

## 配布ターゲットディレクトリ

デフォルトでは、Kotlin/JSプロジェクトのビルド結果は、プロジェクトルート内の `/build/dist/<targetName>/<binaryName>` ディレクトリにあります。

> Kotlin 1.9.0より前は、デフォルトの配布ターゲットディレクトリは `/build/distributions` でした。
>

プロジェクト配布ファイルの別の場所を設定するには、ビルドスクリプトの `browser {}` ブロック内に `distribution {}` ブロックを追加し、`set()` メソッドを使用して `outputDirectory` プロパティに値を割り当てます。
プロジェクトビルドタスクを実行すると、Gradleはこの場所にプロジェクトリソースとともに出力バンドルを保存します。
