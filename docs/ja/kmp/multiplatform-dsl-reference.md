[//]: # (title: マルチプラットフォーム Gradle DSL リファレンス)

Kotlin Multiplatform Gradle プラグインは、Kotlin Multiplatform プロジェクトを作成するためのツールです。
ここでは、その内容のリファレンスを提供します。Kotlin Multiplatform プロジェクトの Gradle ビルドスクリプトを記述する際の参考にしてください。Kotlin Multiplatform プロジェクトの[概念、作成方法、および構成方法](multiplatform-discover-project.md)について学習してください。

## ID とバージョン

Kotlin Multiplatform Gradle プラグインの完全修飾名は `org.jetbrains.kotlin.multiplatform` です。
Kotlin Gradle DSL を使用する場合、`kotlin("multiplatform")` でプラグインを適用できます。
プラグインのバージョンは Kotlin リリースバージョンと一致します。最新バージョンは %kotlinVersion% です。

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
}
```

</TabItem>
</Tabs>

## トップレベルブロック

`kotlin {}` は、Gradle ビルドスクリプトにおけるマルチプラットフォームプロジェクト構成のトップレベルブロックです。
`kotlin {}` 内に、以下のブロックを記述できます。

| **ブロック**            | **説明**                                                                                                                                     |
|----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| _&lt;targetName&gt;_ | プロジェクトの特定のターゲットを宣言します。利用可能なターゲット名は、[ターゲット](#targets)セクションにリストされています。             |
| `targets`            | プロジェクトのすべてのターゲットをリストします。                                                                                                         |
| `sourceSets`         | 事前定義されたソースセットを設定し、プロジェクトのカスタム[ソースセット](#source-sets)を宣言します。                                                     |
| `compilerOptions`    | すべてのターゲットおよび共有ソースセットのデフォルトとして使用される共通の拡張レベル[コンパイラーオプション](#compiler-options)を指定します。 |

## ターゲット

_ターゲット_は、サポートされているプラットフォームのいずれかを対象としたソフトウェアをコンパイル、テスト、パッケージ化するビルドの一部です。Kotlin は各プラットフォームに対応するターゲットを提供するため、特定のターゲット用にコードをコンパイルするよう Kotlin に指示できます。[ターゲットの設定](multiplatform-discover-project.md#targets)について詳しく学びましょう。

各ターゲットは1つ以上の[コンピレーション](#compilations)を持つことができます。テストおよびプロダクション目的のデフォルトコンピレーションに加えて、[カスタムコンピレーションを作成](multiplatform-configure-compilations.md#create-a-custom-compilation)できます。

マルチプラットフォームプロジェクトのターゲットは、`kotlin {}` 内の対応するブロック（例: `jvm`、`androidTarget`、`iosArm64`）で記述されます。
利用可能なターゲットの完全なリストは以下のとおりです。

<table>
    
<tr>
<th>ターゲットプラットフォーム</th>
        <th>ターゲット</th>
        <th>コメント</th>
</tr>

    
<tr>
<td>Kotlin/JVM</td>
        <td><code>jvm</code></td>
        <td></td>
</tr>

    
<tr>
<td rowspan="2">Kotlin/Wasm</td>
        <td><code>wasmJs</code></td>
        <td>プロジェクトを JavaScript ランタイムで実行する予定の場合に使用します。</td>
</tr>

    
<tr>
<td><code>wasmWasi</code></td>
        <td><a href="https://github.com/WebAssembly/WASI">WASI</a>システムインターフェースのサポートが必要な場合に使用します。</td>
</tr>

    
<tr>
<td>Kotlin/JS</td>
        <td><code>js</code></td>
        <td>
            <p>実行環境を選択します:</p>
            <list>
                <li>ブラウザーで実行されるアプリケーションには<code>browser {}</code>。</li>
                <li>Node.js で実行されるアプリケーションには<code>nodejs {}</code>。</li>
            </list>
            <p><a href="https://kotlinlang.org/docs/js-project-setup.html#execution-environments">Kotlin/JS プロジェクトのセットアップ</a>で詳細を確認してください。</p>
        </td>
</tr>

    
<tr>
<td>Kotlin/Native</td>
        <td></td>
        <td>
            <p><a href="https://kotlinlang.org/docs/native-target-support.html">Kotlin/Native ターゲットサポート</a>で、現在サポートされている macOS、Linux、Windows ホストのターゲットについて学びましょう。</p>
        </td>
</tr>

    
<tr>
<td>Android アプリケーションとライブラリ</td>
        <td><code>androidTarget</code></td>
        <td>
            <p>Android Gradle プラグインを手動で適用します: <code>com.android.application</code> または <code>com.android.library</code>。</p>
            <p>Gradle サブプロジェクトごとに作成できる Android ターゲットは1つだけです。</p>
        </td>
</tr>

</table>

> 現在のホストでサポートされていないターゲットは、ビルド中に無視されるため、公開されません。
>
{style="note"}

```groovy
kotlin {
    jvm()
    iosArm64()
    macosX64()
    js().browser()
}
```

ターゲットの構成には2つの部分を含めることができます。

* すべてのターゲットで利用可能な[共通設定](#common-target-configuration)。
* ターゲット固有の設定。

各ターゲットは1つ以上の[コンピレーション](#compilations)を持つことができます。

### 共通ターゲット設定

どのターゲットブロックでも、以下の宣言を使用できます。

| **名前**            | **説明**                                                                                                                                                                           |
|---------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `platformType`      | このターゲットの Kotlin プラットフォーム。利用可能な値: `jvm`、`androidJvm`、`js`、`wasm`、`native`、`common`。                                                                              |
| `artifactsTaskName` | このターゲットの結果アーティファクトをビルドするタスクの名前。                                                                                                                   |
| `components`        | Gradle 公開の設定に使用されるコンポーネント。                                                                                                                                             |
| `compilerOptions`   | ターゲットに使用される[コンパイラーオプション](#compiler-options)。この宣言は、[トップレベル](multiplatform-dsl-reference.md#top-level-blocks)で構成された `compilerOptions {}` をすべてオーバーライドします。 |

### Web ターゲット

`js {}` ブロックは Kotlin/JS ターゲットの設定を記述し、`wasmJs {}` ブロックは JavaScript と相互運用可能な Kotlin/Wasm ターゲットの設定を記述します。これらは、ターゲットの実行環境に応じて、2つのブロックのいずれかを含めることができます。

| **名前**              | **説明**                      |
|-----------------------|--------------------------------------|
| [`browser`](#browser) | ブラウザターゲットの設定。     |
| [`nodejs`](#node-js)  | Node.js ターゲットの設定。   |

[Kotlin/JS プロジェクトの設定](https://kotlinlang.org/docs/js-project-setup.html)について詳しく学びましょう。

別の `wasmWasi {}` ブロックは、WASI システムインターフェースをサポートする Kotlin/Wasm ターゲットの設定を記述します。
ここでは、[`nodejs`](#node-js) 実行環境のみが利用可能です。

```kotlin
kotlin {
    wasmWasi {
        nodejs()
        binaries.executable()
    }
}
```

すべての Web ターゲット、`js`、`wasmJs`、および `wasmWasi` も `binaries.executable()` 呼び出しをサポートしています。これは、Kotlin コンパイラに実行可能ファイルを出力するように明示的に指示します。詳細については、Kotlin/JS ドキュメントの[実行環境](https://kotlinlang.org/docs/js-project-setup.html#execution-environments)を参照してください。

#### ブラウザー

`browser {}` には以下の設定ブロックを含めることができます。

| **名前**       | **説明**                                                            |
|----------------|----------------------------------------------------------------------------|
| `testRuns`     | テスト実行の設定。                                           |
| `runTask`      | プロジェクト実行の設定。                                          |
| `webpackTask`  | [Webpack](https://webpack.js.org/)を使用したプロジェクトのバンドル設定。 |
| `distribution` | 出力ファイルへのパス。                                                      |

```kotlin
kotlin {
    js().browser {
        webpackTask { /* ... */ }
        testRuns { /* ... */ }
        distribution {
            directory = File("$projectDir/customdir/")
        }
    }
}
```

#### Node.js

`nodejs {}` には、テストタスクと実行タスクの設定を含めることができます。

| **名前**   | **説明**                   |
|------------|-----------------------------------|
| `testRuns` | テスト実行の設定。  |
| `runTask`  | プロジェクト実行の設定。 |

```kotlin
kotlin {
    js().nodejs {
        runTask { /* ... */ }
        testRuns { /* ... */ }
    }
}
```

### Native ターゲット

Native ターゲットでは、以下の特定のブロックが利用可能です。

| **名前**    | **説明**                                          |
|-------------|----------------------------------------------------------|
| `binaries`  | 生成する[バイナリ](#binaries)の設定。       |
| `cinterops` | [C ライブラリとの相互運用](#cinterops)の設定。 |

#### バイナリ

バイナリには以下の種類があります。

| **名前**     | **説明**        |
|--------------|------------------------|
| `executable` | プロダクト実行可能ファイル。    |
| `test`       | テスト実行可能ファイル。       |
| `sharedLib`  | 共有ライブラリ。        |
| `staticLib`  | 静的ライブラリ。        |
| `framework`  | Objective-C フレームワーク。 |

```kotlin
kotlin {
    linuxX64 { // 代わりにターゲットを使用してください。
        binaries {
            executable {
                // バイナリ設定。
            }
        }
    }
}
```

バイナリ設定には、以下のパラメータが利用可能です。

| **名前**      | **説明**                                                                                                                                                   |
|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `compilation` | バイナリがビルドされるコンピレーション。デフォルトでは、`test` バイナリは `test` コンピレーションに基づいていますが、他のバイナリは `main` コンピレーションに基づいています。 |
| `linkerOpts`  | バイナリビルド中にシステムリンカーに渡されるオプション。                                                                                                         |
| `baseName`    | 出力ファイルのカスタムベース名。最終的なファイル名は、このベース名にシステム依存のプレフィックスとポストフィックスを追加して形成されます。                         |
| `entryPoint`  | 実行可能バイナリのエントリポイント関数。デフォルトでは、ルートパッケージの `main()` です。                                                                  |
| `outputFile`  | 出力ファイルへのアクセス。                                                                                                                                        |
| `linkTask`    | リンクタスクへのアクセス。                                                                                                                                          |
| `runTask`     | 実行可能バイナリの実行タスクへのアクセス。`linuxX64`、`macosX64`、`mingwX64` 以外のターゲットの場合、値は `null` です。                                 |
| `isStatic`    | Objective-C フレームワークの場合。ダイナミックライブラリの代わりに静的ライブラリを含めます。                                                                                   |

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
binaries {
    executable("my_executable", listOf(RELEASE)) {
        // テストコンピレーションに基づいてバイナリをビルドします。
        compilation = compilations["test"]

        // リンカー用のカスタムコマンドラインオプション。
        linkerOpts = mutableListOf("-L/lib/search/path", "-L/another/search/path", "-lmylib")

        // 出力ファイルのベース名。
        baseName = "foo"

        // カスタムエントリポイント関数。
        entryPoint = "org.example.main"

        // 出力ファイルにアクセスします。
        println("Executable path: ${outputFile.absolutePath}")

        // リンクタスクにアクセスします。
        linkTask.dependsOn(additionalPreprocessingTask)

        // 実行タスクにアクセスします。
        // ホスト以外のプラットフォームでは runTask が null になることに注意してください。
        runTask?.dependsOn(prepareForRun)
    }

    framework("my_framework" listOf(RELEASE)) {
        // 動的ライブラリの代わりに静的ライブラリをフレームワークに含めます。
        isStatic = true
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
binaries {
    executable('my_executable', [RELEASE]) {
        // テストコンピレーションに基づいてバイナリをビルドします。
        compilation = compilations.test

        // リンカー用のカスタムコマンドラインオプション。
        linkerOpts = ['-L/lib/search/path', '-L/another/search/path', '-lmylib']

        // 出力ファイルのベース名。
        baseName = 'foo'

        // カスタムエントリポイント関数。
        entryPoint = 'org.example.main'

        // 出力ファイルにアクセスします。
        println("Executable path: ${outputFile.absolutePath}")

        // リンクタスクにアクセスします。
        linkTask.dependsOn(additionalPreprocessingTask)

        // 実行タスクにアクセスします。
        // ホスト以外のプラットフォームでは runTask が null になることに注意してください。
        runTask?.dependsOn(prepareForRun)
    }

    framework('my_framework' [RELEASE]) {
        // 動的ライブラリの代わりに静的ライブラリをフレームワークに含めます。
        isStatic = true
    }
}
```

</TabItem>
</Tabs>

[Native バイナリのビルド](multiplatform-build-native-binaries.md)について詳しく学びましょう。

#### Cinterops

`cinterops` は、Native ライブラリとの相互運用に関する記述のコレクションです。
ライブラリとの相互運用を提供するには、`cinterops` にエントリを追加し、そのパラメータを定義します。

| **名前**         | **説明**                                       |
|------------------|-------------------------------------------------------|
| `definitionFile` | Native API を記述する `.def` ファイル。            |
| `packageName`    | 生成された Kotlin API のパッケージプレフィックス。          |
| `compilerOpts`   | cinterop ツールによってコンパイラに渡されるオプション。 |
| `includeDirs`    | ヘッダーを検索するディレクトリ。                      |
| `header`         | バインディングに含めるヘッダー。                               |
| `headers`        | バインディングに含めるヘッダーのリスト。   |

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    linuxX64 { // 必要なターゲットに置き換えてください。
        compilations.getByName("main") {
            val myInterop by cinterops.creating {
                // Native API を記述する定義ファイル。
                // デフォルトパスは src/nativeInterop/cinterop/<interop-name>.def
                definitionFile.set(project.file("def-file.def"))

                // 生成される Kotlin API を配置するパッケージ。
                packageName("org.sample")

                // cinterop ツールによってコンパイラに渡されるオプション。
                compilerOpts("-Ipath/to/headers")

                // ヘッダー検索用のディレクトリ (コンパイラオプション -I<path> のアナロジー)。
                includeDirs.allHeaders("path1", "path2")

                // includeDirs.allHeaders のショートカット。
                includeDirs("include/directory", "another/directory")

                // バインディングに含めるヘッダーファイル。
                header("path/to/header.h")
                headers("path/to/header1.h", "path/to/header2.h")
            }

            val anotherInterop by cinterops.creating { /* ... */ }
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    linuxX64 { // 必要なターゲットに置き換えてください。
        compilations.main {
            cinterops {
                myInterop {
                    // Native API を記述する定義ファイル。
                    // デフォルトパスは src/nativeInterop/cinterop/<interop-name>.def
                    definitionFile = project.file("def-file.def")

                    // 生成される Kotlin API を配置するパッケージ。
                    packageName 'org.sample'

                    // cinterop ツールによってコンパイラに渡されるオプション。
                    compilerOpts '-Ipath/to/headers'

                    // ヘッダー検索用のディレクトリ (コンパイラオプション -I<path> のアナロジー)。
                    includeDirs.allHeaders("path1", "path2")

                    // includeDirs.allHeaders のショートカット。
                    includeDirs("include/directory", "another/directory")

                    // バインディングに含めるヘッダーファイル。
                    header("path/to/header.h")
                    headers("path/to/header1.h", "path/to/header2.h")
                }

                anotherInterop { /* ... */ }
            }
        }
    }
}
```

</TabItem>
</Tabs>

より多くの cinterop プロパティについては、[Definition file](https://kotlinlang.org/docs/native-definition-file.html#properties) を参照してください。

### Android ターゲット

Kotlin Multiplatform プラグインには、Android ターゲットの[ビルドバリアント](https://developer.android.com/studio/build/build-variants)を設定するのに役立つ特定の機能があります。

| **名前**                      | **説明**                                                                                                                                      |
|-------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| `publishLibraryVariants()`    | 公開するビルドバリアントを指定します。[Android ライブラリの公開](multiplatform-publish-lib-setup.md#publish-an-android-library)について詳しく学びましょう。 |

```kotlin
kotlin {
    androidTarget {
        publishLibraryVariants("release")
    }
}
```

[Android のコンパイル](multiplatform-configure-compilations.md#compilation-for-android)について詳しく学びましょう。

> `kotlin {}` ブロック内の `androidTarget` 設定は、Android プロジェクトのビルド設定を置き換えるものではありません。
> Android プロジェクトのビルドスクリプトの作成については、[Android developer documentation](https://developer.android.com/studio/build) を参照してください。
>
{style="note"}

## ソースセット

`sourceSets {}` ブロックはプロジェクトのソースセットを記述します。ソースセットには、そのリソースと依存関係とともに、コンピレーションに一緒に参加する Kotlin ソースファイルが含まれます。

マルチプラットフォームプロジェクトには、そのターゲットに対応する[事前定義](#predefined-source-sets)されたソースセットが含まれています。開発者は、必要に応じて[カスタム](#custom-source-sets)ソースセットを作成することもできます。

### 事前定義されたソースセット

事前定義されたソースセットは、マルチプラットフォームプロジェクトの作成時に自動的に設定されます。
利用可能な事前定義されたソースセットは以下のとおりです。

| **名前**                                    | **説明**                                                                                                                                                                                               |
|---------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `commonMain`                                | すべてのプラットフォーム間で共有されるコードとリソース。すべてのマルチプラットフォームプロジェクトで利用可能です。プロジェクトのすべての `main` [コンピレーション](#compilations)で使用されます。                                                        |
| `commonTest`                                | すべてのプラットフォーム間で共有されるテストコードとリソース。すべてのマルチプラットフォームプロジェクトで利用可能です。プロジェクトのすべてのテストコンピレーションで使用されます。                                                                    |
| _&lt;targetName&gt;&lt;compilationName&gt;_ | コンピレーションのターゲット固有のソース。_&lt;targetName&gt;_ は事前定義されたターゲットの名前であり、_&lt;compilationName&gt;_ はこのターゲットのコンピレーションの名前です。例: `jsTest`、`jvmMain`。 |

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        commonMain { /* ... */ }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets { 
        commonMain { /* ... */ }
    }
}
```

</TabItem>
</Tabs>

[ソースセット](multiplatform-discover-project.md#source-sets)について詳しく学びましょう。

### カスタムソースセット

カスタムソースセットは、プロジェクト開発者が手動で作成します。
カスタムソースセットを作成するには、`sourceSets` セクション内にその名前のセクションを追加します。
Kotlin Gradle DSL を使用する場合は、カスタムソースセットを `by creating` でマークします。

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets { 
        val myMain by creating { /* ... */ } // 'MyMain' という名前で新しいソースセットを作成します
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets { 
        myMain { /* ... */ } // 'myMain' という名前でソースセットを作成または設定します 
    }
}
```

</TabItem>
</Tabs>

新しく作成されたソースセットは他のソースセットとは接続されていません。プロジェクトのコンピレーションで使用するには、[他のソースセットと接続](multiplatform-hierarchy.md#manual-configuration)してください。

### ソースセットパラメータ

ソースセットの設定は、`sourceSets {}` の対応するブロック内に格納されます。ソースセットには以下のパラメータがあります。

| **名前**           | **説明**                                                                        |
|--------------------|----------------------------------------------------------------------------------------|
| `kotlin.srcDir`    | ソースセットディレクトリ内の Kotlin ソースファイルの場所。                       |
| `resources.srcDir` | ソースセットディレクトリ内のリソースの場所。                                 |
| `dependsOn`        | [他のソースセットとの接続](multiplatform-hierarchy.md#manual-configuration)。 |
| `dependencies`     | ソースセットの[依存関係](#dependencies)。                                       |
| `languageSettings` | 共有ソースセットに適用される[言語設定](#language-settings)。              |

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin { 
    //...
    sourceSets { 
        commonMain {
            kotlin.srcDir("src")
            resources.srcDir("res")

            dependencies {
                /* ... */
            }
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin { 
    //...
    sourceSets { 
        commonMain {
            kotlin.srcDir('src')
            resources.srcDir('res')

            dependencies {
                /* ... */
            }
        }
    }
}
``` 

</TabItem>
</Tabs>

## コンピレーション

ターゲットは、プロダクション用またはテスト用など、1つ以上のコンピレーションを持つことができます。ターゲット作成時に自動的に追加される[事前定義されたコンピレーション](#predefined-compilations)があります。さらに[カスタムコンピレーション](#custom-compilations)を作成することもできます。

ターゲットのすべてのコンピレーションまたは特定のコンピレーションを参照するには、`compilations` オブジェクトコレクションを使用します。
`compilations` から、名前でコンピレーションを参照できます。

[コンピレーションの設定](multiplatform-configure-compilations.md)について詳しく学びましょう。

### 事前定義されたコンピレーション

事前定義されたコンピレーションは、Android ターゲットを除くプロジェクトの各ターゲットに対して自動的に作成されます。
利用可能な事前定義されたコンピレーションは以下のとおりです。

| **名前** | **説明**                     |
|----------|-------------------------------------|
| `main`   | プロダクションソースのコンピレーション。 |
| `test`   | テストのコンピレーション。              |

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        val main by compilations.getting {
            output // main コンピレーションの出力を取得します
        }

        compilations["test"].runtimeDependencyFiles // テストランタイムクラスパスを取得します
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilations.main.output // main コンピレーションの出力を取得します
        compilations.test.runtimeDependencyFiles // テストランタイムクラスパスを取得します
    }
}
```

</TabItem>
</Tabs>

### カスタムコンピレーション

事前定義されたコンピレーションに加えて、独自のカスタムコンピレーションを作成できます。
そのためには、新しいコンピレーションと `main` コンピレーションとの間に [`associateWith`](https://kotlinlang.org/docs/gradle-configure-project.html#associate-compiler-tasks) 関係を設定します。Kotlin Gradle DSL を使用している場合は、カスタムコンピレーションを `by creating` でマークします。

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        compilations {
            val main by getting
            val integrationTest by creating {
                // main とそのクラスパスを依存関係としてインポートし、internal 可視性を確立します
                associateWith(main)
                defaultSourceSet {
                    dependencies {
                        implementation(kotlin("test-junit"))
                        /* ... */
                    }
                }

                // このコンピレーションによって生成されたテストを実行するテストタスクを作成します
                testRuns.create("integration") {
                    // テストタスクを設定します
                    setExecutionSourceFrom(integrationTest)
                }
            }
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilations.create('integrationTest') {
            def main = compilations.main
            // main とそのクラスパスを依存関係としてインポートし、internal 可視性を確立します
            associateWith(main)
            defaultSourceSet {
                dependencies {
                    implementation kotlin('test-junit')
                    /* ... */
                }
            }

            // このコンピレーションによって生成されたテストを実行するテストタスクを作成します
            testRuns.create('integration') {
                // テストタスクを設定します
                setExecutionSourceFrom(compilations.integrationTest)
            }
        }
    }
}
```

</TabItem>
</Tabs>

コンピレーションを関連付けることで、メインコンピレーションの出力を依存関係として追加し、コンピレーション間の `internal` 可視性を確立します。

[カスタムコンピレーションの作成](multiplatform-configure-compilations.md#create-a-custom-compilation)について詳しく学びましょう。

### コンピレーションパラメータ

コンピレーションには以下のパラメータがあります。

| **名前**                 | **説明**                                                                                                                                                           |
|--------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `defaultSourceSet`       | コンピレーションのデフォルトソースセット。                                                                                                                                     |
| `kotlinSourceSets`       | コンピレーションに参加するソースセット。                                                                                                                             |
| `allKotlinSourceSets`    | コンピレーションに参加するソースセットと `dependsOn()` を介したそれらの接続。                                                                                     |
| `compilerOptions`        | コンピレーションに適用されるコンパイラーオプション。利用可能なオプションのリストについては、[コンパイラーオプション](https://kotlinlang.org/docs/gradle-compiler-options.html)を参照してください。         |
| `compileKotlinTask`      | Kotlin ソースをコンパイルするための Gradle タスク。                                                                                                                                 |
| `compileKotlinTaskName`  | `compileKotlinTask` の名前。                                                                                                                                              |
| `compileAllTaskName`     | コンピレーションのすべてのソースをコンパイルするための Gradle タスクの名前。                                                                                                       |
| `output`                 | コンピレーションの出力。                                                                                                                                                   |
| `compileDependencyFiles` | コンピレーションのコンパイル時依存ファイル (クラスパス)。すべての Kotlin/Native コンピレーションでは、標準ライブラリとプラットフォームの依存関係が自動的に含まれます。 |
| `runtimeDependencyFiles` | コンピレーションのランタイム依存ファイル (クラスパス)。                                                                                                                  |

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        val main by compilations.getting {
            compileTaskProvider.configure {
                compilerOptions {
                    // 'main' コンピレーションの Kotlin コンパイラーオプションを設定します:
                    jvmTarget.set(JvmTarget.JVM_1_8)
                }
            }
        
            compileKotlinTask // Kotlin タスク 'compileKotlinJvm' を取得します 
            output // main コンピレーションの出力を取得します
        }
        
        compilations["test"].runtimeDependencyFiles // テストランタイムクラスパスを取得します
    }

    // すべてのターゲットのすべてのコンピレーションを設定します:
    compilerOptions {
        allWarningsAsErrors.set(true)
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilations.main {
            compileTaskProvider.configure {
                compilerOptions {
                    // 'main' コンピレーションの Kotlin コンパイラーオプションを設定します:
                    jvmTarget = JvmTarget.JVM_1_8
                }
            }
        }

        compilations.main.compileKotlinTask // Kotlin タスク 'compileKotlinJvm' を取得します 
        compilations.main.output // main コンピレーションの出力を取得します
        compilations.test.runtimeDependencyFiles // テストランタイムクラスパスを取得します
    }

    // すべてのターゲットのすべてのコンピレーションを設定します:
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</TabItem>
</Tabs>

## コンパイラーオプション

プロジェクトのコンパイラーオプションは、次の3つの異なるレベルで設定できます。

* **拡張レベル**: `kotlin {}` ブロック内。
* **ターゲットレベル**: ターゲットブロック内。
* **コンピレーションユニットレベル**: 通常、特定のコンピレーションタスク内。

![Kotlin コンパイラーオプションのレベル](compiler-options-levels.svg){width=700}

上位レベルの設定は、下位レベルのデフォルトとして機能します。

* 拡張レベルで設定されたコンパイラーオプションは、`commonMain`、`nativeMain`、`commonTest` のような共有ソースセットを含むターゲットレベルのオプションのデフォルトです。
* ターゲットレベルで設定されたコンパイラーオプションは、`compileKotlinJvm` や `compileTestKotlinJvm` タスクのようなコンピレーションユニット（タスク）レベルのオプションのデフォルトです。

下位レベルで行われた設定は、上位レベルの同様の設定をオーバーライドします。

* タスクレベルのコンパイラーオプションは、ターゲットレベルまたは拡張レベルの同様の設定をオーバーライドします。
* ターゲットレベルのコンパイラーオプションは、拡張レベルの同様の設定をオーバーライドします。

設定可能なコンパイラーオプションのリストについては、[すべてのコンパイラーオプション](https://kotlinlang.org/docs/gradle-compiler-options.html#all-compiler-options)を参照してください。

### 拡張レベル

プロジェクト内のすべてのターゲットのコンパイラーオプションを設定するには、トップレベルの `compilerOptions {}` ブロックを使用します。

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    // すべてのターゲットのすべてのコンピレーションを設定します
    compilerOptions {
        allWarningsAsErrors.set(true)
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    // すべてのターゲットのすべてのコンピレーションを設定します:
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</TabItem>
</Tabs>

### ターゲットレベル

プロジェクト内の特定のターゲットのコンパイラーオプションを設定するには、ターゲットブロック内の `compilerOptions {}` ブロックを使用します。

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        // JVM ターゲットのすべてのコンピレーションを設定します
        compilerOptions {
            allWarningsAsErrors.set(true)
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        // JVM ターゲットのすべてのコンピレーションを設定します
        compilerOptions {
            allWarningsAsErrors = true
        }
    }
}
```

</TabItem>
</Tabs>

### コンピレーションユニットレベル

特定のタスクのコンパイラーオプションを設定するには、タスク内の `compilerOptions {}` ブロックを使用します。

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
task.named<KotlinJvmCompile>("compileKotlinJvm") {
    compilerOptions {
        allWarningsAsErrors.set(true)
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
task.named<KotlinJvmCompile>("compileKotlinJvm") {
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</TabItem>
</Tabs>

特定のコンピレーションのコンパイラーオプションを設定するには、コンピレーションのタスクプロバイダー内で `compilerOptions {}` ブロックを使用します。

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        compilations.named(KotlinCompilation.MAIN_COMPILATION_NAME) {
            compileTaskProvider.configure {
                // 'main' コンピレーションを設定します:
                compilerOptions {
                    allWarningsAsErrors.set(true)
                }
            }
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilations.named(KotlinCompilation.MAIN_COMPILATION_NAME) {
            compileTaskProvider.configure {
                // 'main' コンピレーションを設定します:
                compilerOptions {
                    allWarningsAsErrors = true
                }
            }
        }
    }
}
```

</TabItem>
</Tabs>

### `kotlinOptions {}` から `compilerOptions {}` への移行 {collapsible="true"}

Kotlin 2.2.0 より前は、`kotlinOptions {}` ブロックを使用してコンパイラーオプションを設定できました。`kotlinOptions {}` ブロックは Kotlin 2.2.0 で非推奨になったため、代わりにビルドスクリプトで `compilerOptions {}` ブロックを使用する必要があります。
詳細については、[`kotlinOptions{}` から `compilerOptions{}` への移行](https://kotlinlang.org/docs/gradle-compiler-options.html#migrate-from-kotlinoptions-to-compileroptions)を参照してください。

## 依存関係

ソースセット宣言の `dependencies {}` ブロックには、このソースセットの依存関係が含まれます。

[依存関係の設定](https://kotlinlang.org/docs/gradle-configure-project.html)について詳しく学びましょう。

依存関係には4つのタイプがあります。

| **名前**         | **説明**                                                                     |
|------------------|-------------------------------------------------------------------------------------|
| `api`            | 現在のモジュールの API で使用される依存関係。                                 |
| `implementation` | モジュール内で使用されるが、外部に公開されない依存関係。                         |
| `compileOnly`    | 現在のモジュールのコンパイルのみに使用される依存関係。                       |
| `runtimeOnly`    | 実行時に利用可能だが、どのモジュールのコンパイル時にも見えない依存関係。 |

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        commonMain {
            dependencies {
                api("com.example:foo-metadata:1.0")
            }
        }
        jvmMain {
            dependencies {
                implementation("com.example:foo-jvm:1.0")
            }
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        commonMain {
            dependencies {
                api 'com.example:foo-metadata:1.0'
            }
        }
        jvmMain {
            dependencies {
                implementation 'com.example:foo-jvm:1.0'
            }
        }
    }
}
```

</TabItem>
</Tabs>

さらに、ソースセットは互いに依存し、階層を形成することができます。
この場合、[`dependsOn()`](#source-set-parameters) 関係が使用されます。

## 言語設定

ソースセットの `languageSettings {}` ブロックは、プロジェクトの解析とコンパイルの特定の側面を定義します。`languageSettings {}` ブロックは、共有ソースセットに特に適用される設定を構成する場合にのみ使用してください。その他のすべてのケースでは、`compilerOptions {}` ブロックを使用して、拡張レベルまたはターゲットレベルで[コンパイラーオプションを設定](#compiler-options)してください。

以下の言語設定が利用可能です。

| **名前**                | **説明**                                                                                                                                                                 |
|-------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `languageVersion`       | 指定されたバージョンの Kotlin とのソース互換性を提供します。                                                                                                             |
| `apiVersion`            | 指定されたバージョンの Kotlin バンドルライブラリからの宣言のみを使用できるようにします。                                                                                          |
| `enableLanguageFeature` | 指定された言語機能を有効にします。利用可能な値は、現在実験的な、またはある時点で実験的として導入された言語機能に対応します。 |
| `optIn`                 | 指定された[オプトインアノテーション](https://kotlinlang.org/docs/opt-in-requirements.html)の使用を許可します。                                                                           |
| `progressiveMode`       | [プログレッシブモード](https://kotlinlang.org/docs/whatsnew13.html#progressive-mode)を有効にします。                                                                                   |

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets.all {
        languageSettings.apply {
            languageVersion = "%languageVersion%" // 利用可能な値: "1.8", "1.9", "2.0", "2.1"
            apiVersion = "%apiVersion%" // 利用可能な値: "1.8", "1.9", "2.0", "2.1"
            enableLanguageFeature("InlineClasses") // 言語機能名
            optIn("kotlin.ExperimentalUnsignedTypes") // アノテーションの完全修飾名
            progressiveMode = true // デフォルトは false
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets.all {
        languageSettings {
            languageVersion = '%languageVersion%' // 利用可能な値: '1.8', '1.9', '2.0', '2.1'
            apiVersion = '%apiVersion%' // 利用可能な値: '1.8', '1.9', '2.0', '2.1'
            enableLanguageFeature('InlineClasses') // 言語機能名
            optIn('kotlin.ExperimentalUnsignedTypes') // アノテーションの完全修飾名
            progressiveMode = true // デフォルトは false
        }
    }
}
```

</TabItem>
</Tabs>