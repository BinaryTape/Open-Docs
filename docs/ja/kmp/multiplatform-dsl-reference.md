[//]: # (title: マルチプラットフォーム Gradle DSL リファレンス)

Kotlin Multiplatform Gradle プラグインは、Kotlin Multiplatform プロジェクトを作成するためのツールです。ここではその内容のリファレンスを提供します。Kotlin Multiplatform プロジェクトの Gradle ビルドスクリプトを記述する際の参考にしてください。Kotlin Multiplatform プロジェクトの[概念、作成方法、設定方法](multiplatform-discover-project.md)については、こちらをご覧ください。

## ID とバージョン

Kotlin Multiplatform Gradle プラグインの完全修飾名は `org.jetbrains.kotlin.multiplatform` です。Kotlin Gradle DSL を使用する場合、`kotlin("multiplatform")` でプラグインを適用できます。プラグインのバージョンは Kotlin のリリースバージョンと一致します。最新バージョンは %kotlinVersion% です。

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
    id 'org.jetbrains.kotlin.multiplatform' version "%kotlinVersion%"
}
```

</tab>
</tabs>

## トップレベルブロック

`kotlin {}` は、Gradle ビルドスクリプトにおけるマルチプラットフォームプロジェクト構成のトップレベルブロックです。`kotlin {}` の内部には、以下のブロックを記述できます。

| **ブロック**            | **説明**                                                                                                                          |
|----------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| _&lt;targetName&gt;_ | プロジェクトの特定のターゲットを宣言します。利用可能なターゲット名は「[ターゲット](#targets)」セクションに記載されています。                 |
| `targets`            | プロジェクトのすべてのターゲットを一覧表示します。                                                                                                        |
| `sourceSets`         | プロジェクトの事前定義された[ソースセット](#source-sets)を設定し、カスタムソースセットを宣言します。                                                    |
| `compilerOptions`    | すべてのターゲットおよび共有ソースセットのデフォルトとして使用される共通の拡張レベル[コンパイラオプション](#compiler-options)を指定します。 |

## ターゲット

_ターゲット_ とは、サポートされているプラットフォームのいずれかを対象としたソフトウェアをコンパイル、テスト、パッケージ化するビルドの一部です。Kotlin は各プラットフォームに対応するターゲットを提供しているため、Kotlin に特定のターゲット向けにコードをコンパイルするよう指示できます。[ターゲットの設定](multiplatform-discover-project.md#targets)の詳細については、こちらをご覧ください。

各ターゲットには、1つ以上の[コンパイル](#compilations)を含めることができます。テストおよびプロダクション目的のデフォルトのコンパイルに加えて、[カスタムコンパイルを作成](multiplatform-configure-compilations.md#create-a-custom-compilation)できます。

マルチプラットフォームプロジェクトのターゲットは、`kotlin {}` 内の対応するブロック (例: `jvm`, `androidTarget`, `iosArm64`) で記述されます。利用可能なターゲットの完全なリストは次のとおりです。

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
        <td>JavaScript ランタイムでプロジェクトを実行する予定の場合に使用します。</td>
    </tr>
    <tr>
        <td><code>wasmWasi</code></td>
        <td><a href="https://github.com/WebAssembly/WASI">WASI</a> システムインターフェースのサポートが必要な場合に使用します。</td>
    </tr>
    <tr>
        <td>Kotlin/JS</td>
        <td><code>js</code></td>
        <td>
            <p>実行環境を選択します。</p>
            <list>
                <li><code>browser {}</code> はブラウザで実行するアプリケーション用です。</li>
                <li><code>nodejs {}</code> は Node.js で実行するアプリケーション用です。</li>
            </list>
            <p><a href="https://kotlinlang.org/docs/js-project-setup.html#execution-environments">Kotlin/JS プロジェクトのセットアップ</a>で詳細をご覧ください。</p>
        </td>
    </tr>
    <tr>
        <td>Kotlin/Native</td>
        <td></td>
        <td>
            <p>macOS、Linux、Windows ホストで現在サポートされているターゲットについては、<a href="https://kotlinlang.org/docs/native-target-support.html">Kotlin/Native ターゲットサポート</a>をご覧ください。</p>
        </td>
    </tr>
    <tr>
        <td>Android アプリケーションおよびライブラリ</td>
        <td><code>androidTarget</code></td>
        <td>
            <p>Android Gradle プラグイン: <code>com.android.application</code> または <code>com.android.library</code> を手動で適用します。</p>
            <p>1つの Gradle サブプロジェクトにつき、Android ターゲットは1つしか作成できません。</p>
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

ターゲットの構成には、2つの部分を含めることができます。

*   すべてのターゲットで利用可能な[共通構成](#common-target-configuration)。
*   ターゲット固有の構成。

各ターゲットには、1つ以上の[コンパイル](#compilations)を含めることができます。

### 共通ターゲット構成

任意のターゲットブロックで、以下の宣言を使用できます。

| **名前**            | **説明**                                                                                                                                                                            |
|---------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `platformType`      | このターゲットの Kotlin プラットフォーム。利用可能な値: `jvm`、`androidJvm`、`js`、`wasm`、`native`、`common`。                                                                              |
| `artifactsTaskName` | このターゲットの成果物 (artifacts) をビルドするタスクの名前。                                                                                                                   |
| `components`        | Gradle パブリケーション (公開) を設定するために使用されるコンポーネント。                                                                                                                                             |
| `compilerOptions`   | ターゲットに使用される[コンパイラオプション](#compiler-options)。この宣言は、[トップレベル](multiplatform-dsl-reference.md#top-level-blocks)で構成された `compilerOptions {}` をすべてオーバーライドします。 |

### ウェブターゲット

`js {}` ブロックは Kotlin/JS ターゲットの構成を記述し、`wasmJs {}` ブロックは JavaScript と相互運用可能な Kotlin/Wasm ターゲットの構成を記述します。これらは、ターゲットの実行環境に応じて、以下の2つのブロックのいずれかを含めることができます。

| **名前**              | **説明**                      |
|-----------------------|--------------------------------------|
| [`browser`](#browser) | ブラウザターゲットの構成。 |
| [`nodejs`](#node-js)  | Node.js ターゲットの構成。 |

[Kotlin/JS プロジェクトの構成](https://kotlinlang.org/docs/js-project-setup.html)の詳細については、こちらをご覧ください。

独立した `wasmWasi {}` ブロックは、WASI システムインターフェースをサポートする Kotlin/Wasm ターゲットの構成を記述します。ここでは、[`nodejs`](#node-js) 実行環境のみが利用可能です。

```kotlin
kotlin {
    wasmWasi {
        nodejs()
        binaries.executable()
    }
}
```

すべてのウェブターゲット、`js`、`wasmJs`、および `wasmWasi` は、`binaries.executable()` 呼び出しもサポートしています。これは、Kotlin コンパイラに実行可能ファイルを出力するよう明示的に指示します。詳細については、Kotlin/JS ドキュメントの[実行環境](https://kotlinlang.org/docs/js-project-setup.html#execution-environments)をご覧ください。

#### ブラウザ

`browser {}` には以下の構成ブロックを含めることができます。

| **名前**       | **説明**                                                            |
|----------------|----------------------------------------------------------------------------|
| `testRuns`     | テスト実行の構成。                                           |
| `runTask`      | プロジェクト実行の構成。                                          |
| `webpackTask`  | [Webpack](https://webpack.js.org/) によるプロジェクトのバンドル構成。 |
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

`nodejs {}` には、テストおよび実行タスクの構成を含めることができます。

| **名前**   | **説明**                   |
|------------|-----------------------------------|
| `testRuns` | テスト実行の構成。  |
| `runTask`  | プロジェクト実行の構成。 |

```kotlin
kotlin {
    js().nodejs {
        runTask { /* ... */ }
        testRuns { /* ... */ }
    }
}
```

### ネイティブターゲット

ネイティブターゲットの場合、以下の特定のブロックが利用可能です。

| **名前**    | **説明**                                          |
|-------------|----------------------------------------------------------|
| `binaries`  | 生成する[バイナリ](#binaries)の構成。       |
| `cinterops` | [C ライブラリとの相互運用](#cinterops)の構成。 |

#### バイナリ

バイナリには以下の種類があります。

| **名前**     | **説明**        |
|--------------|------------------------|
| `executable` | プロダクトの実行可能ファイル。    |
| `test`       | テスト実行可能ファイル。       |
| `sharedLib`  | 共有ライブラリ。        |
| `staticLib`  | 静的ライブラリ。        |
| `framework`  | Objective-C フレームワーク。 |

```kotlin
kotlin {
    linuxX64 { // 必要に応じてターゲットを置き換えてください。
        binaries {
            executable {
                // Binary configuration.
            }
        }
    }
}
```

バイナリ構成には、以下のパラメータが利用可能です。

| **名前**      | **説明**                                                                                                                                                   |
|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `compilation` | バイナリがビルドされるコンパイル。デフォルトでは、`test` バイナリは `test` コンパイルに基づき、その他のバイナリは `main` コンパイルに基づきます。 |
| `linkerOpts`  | バイナリビルド中にシステムリンカーに渡されるオプション。                                                                                                         |
| `baseName`    | 出力ファイルのカスタムベース名。最終的なファイル名は、このベース名にシステム依存のプレフィックスとポストフィックスを追加して形成されます。                         |
| `entryPoint`  | 実行可能バイナリのエントリポイント関数。デフォルトでは、ルートパッケージの `main()` です。                                                                  |
| `outputFile`  | 出力ファイルへのアクセス。                                                                                                                                        |
| `linkTask`    | リンクタスクへのアクセス。                                                                                                                                          |
| `runTask`     | 実行可能バイナリの実行タスクへのアクセス。`linuxX64`、`macosX64`、または `mingwX64` 以外のターゲットの場合、値は `null` です。                                 |
| `isStatic`    | Objective-C フレームワーク用。ダイナミックライブラリの代わりに静的ライブラリを含めます。                                                                                   |

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
binaries {
    executable("my_executable", listOf(RELEASE)) {
        // テストコンパイルに基づいてバイナリをビルドします。
        compilation = compilations["test"]

        // リンカーのカスタムコマンドラインオプション。
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
        // 非ホストプラットフォームでは runTask が null になることに注意してください。
        runTask?.dependsOn(prepareForRun)
    }

    framework("my_framework", listOf(RELEASE)) {
        // フレームワークに動的ライブラリの代わりに静的ライブラリを含めます。
        isStatic = true
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
binaries {
    executable('my_executable', [RELEASE]) {
        // テストコンパイルに基づいてバイナリをビルドします。
        compilation = compilations.test

        // リンカーのカスタムコマンドラインオプション。
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
        // 非ホストプラットフォームでは runTask が null になることに注意してください。
        runTask?.dependsOn(prepareForRun)
    }

    framework('my_framework', [RELEASE]) {
        // フレームワークに動的ライブラリの代わりに静的ライブラリを含めます。
        isStatic = true
    }
}
```

</tab>
</tabs>

[ネイティブバイナリのビルド](multiplatform-build-native-binaries.md)の詳細については、こちらをご覧ください。

#### Cinterops

`cinterops` は、ネイティブライブラリとの相互運用に関する記述の集合です。ライブラリとの相互運用を提供するには、`cinterops` にエントリを追加し、そのパラメータを定義します。

| **名前**         | **説明**                                       |
|------------------|-------------------------------------------------------|
| `definitionFile` | ネイティブ API を記述する `.def` ファイル。            |
| `packageName`    | 生成された Kotlin API のパッケージプレフィックス。          |
| `compilerOpts`   | cinterop ツールによってコンパイラに渡されるオプション。 |
| `includeDirs`    | ヘッダーを検索するディレクトリ。                      |
| `header`         | バインディングに含めるヘッダー。                |
| `headers`        | バインディングに含めるヘッダーのリスト。   |

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    linuxX64 { // 必要に応じてターゲットを置き換えてください。
        compilations.getByName("main") {
            val myInterop by cinterops.creating {
                // ネイティブ API を記述する定義ファイル。
                // デフォルトパスは src/nativeInterop/cinterop/<interop-name>.def です。
                definitionFile.set(project.file("def-file.def"))

                // 生成された Kotlin API を配置するパッケージ。
                packageName("org.sample")

                // cinterop ツールによってコンパイラに渡されるオプション。
                compilerOpts("-Ipath/to/headers")

                // ヘッダー検索用のディレクトリ (-I<path> コンパイラオプションの類義語)。
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

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    linuxX64 { // 必要に応じてターゲットを置き換えてください。
        compilations.main {
            cinterops {
                myInterop {
                    // ネイティブ API を記述する定義ファイル。
                    // デフォルトパスは src/nativeInterop/cinterop/<interop-name>.def です。
                    definitionFile = project.file("def-file.def")

                    // 生成された Kotlin API を配置するパッケージ。
                    packageName 'org.sample'

                    // cinterop ツールによってコンパイラに渡されるオプション。
                    compilerOpts '-Ipath/to/headers'

                    // ヘッダー検索用のディレクトリ (-I<path> コンパイラオプションの類義語)。
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

</tab>
</tabs>

Cinterop の詳細なプロパティについては、[定義ファイル](https://kotlinlang.org/docs/native-definition-file.html#properties)をご覧ください。

### Android ターゲット

Kotlin Multiplatform プラグインには、Android ターゲットの[ビルドバリアント](https://developer.android.com/studio/build/build-variants)を構成するのに役立つ特定の機能があります。

| **名前**                      | **説明**                                                                                                                                      |
|-------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| `publishLibraryVariants()`    | 公開するビルドバリアントを指定します。[Android ライブラリの公開](multiplatform-publish-lib-setup.md#publish-an-android-library)の詳細については、こちらをご覧ください。 |

```kotlin
kotlin {
    androidTarget {
        publishLibraryVariants("release")
    }
}
```

[Android 向けコンパイル](multiplatform-configure-compilations.md#compilation-for-android)の詳細については、こちらをご覧ください。

> `kotlin {}` ブロック内の `androidTarget` 構成は、Android プロジェクトのビルド構成を置き換えるものではありません。Android プロジェクトのビルドスクリプトの記述方法については、[Android 開発者向けドキュメント](https://developer.android.com/studio/build)をご覧ください。
>
{style="note"}

## ソースセット

`sourceSets {}` ブロックは、プロジェクトのソースセットを記述します。ソースセットには、そのリソースと依存関係とともに、コンパイルに一緒に参加する Kotlin ソースファイルが含まれます。

マルチプラットフォームプロジェクトには、そのターゲットに対して[事前定義された](#predefined-source-sets)ソースセットが含まれています。開発者は、必要に応じて[カスタム](#custom-source-sets)ソースセットを作成することもできます。

### 事前定義されたソースセット

事前定義されたソースセットは、マルチプラットフォームプロジェクトの作成時に自動的に設定されます。利用可能な事前定義されたソースセットは以下のとおりです。

| **名前**                                    | **説明**                                                                                                                                                                                               |
|---------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `commonMain`                                | すべてのプラットフォーム間で共有されるコードとリソース。すべてのマルチプラットフォームプロジェクトで利用可能。プロジェクトのすべての main [コンパイル](#compilations)で使用されます。                                                        |
| `commonTest`                                | すべてのプラットフォーム間で共有されるテストコードとリソース。すべてのマルチプラットフォームプロジェクトで利用可能。プロジェクトのすべてのテストコンパイルで使用されます。                                                                    |
| _&lt;targetName&gt;&lt;compilationName&gt;_ | コンパイル用のターゲット固有のソース。_&lt;targetName&gt;_ は事前定義されたターゲットの名前であり、_&lt;compilationName&gt;_ はこのターゲットのコンパイルの名前です。例: `jsTest`、`jvmMain`。 |

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        commonMain { /* ... */ }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        commonMain { /* ... */ }
    }
}
```

</tab>
</tabs>

[ソースセット](multiplatform-discover-project.md#source-sets)の詳細については、こちらをご覧ください。

### カスタムソースセット

カスタムソースセットは、プロジェクト開発者によって手動で作成されます。カスタムソースセットを作成するには、`sourceSets` セクション内にその名前のセクションを追加します。Kotlin Gradle DSL を使用する場合、カスタムソースセットを `by creating` でマークします。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        val myMain by creating { /* ... */ } // 'MyMain' という名前で新しいソースセットを作成する
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        myMain { /* ... */ } // 'myMain' という名前のソースセットを作成または構成する
    }
}
```

</tab>
</tabs>

新しく作成されたソースセットは、他のソースセットと接続されていないことに注意してください。プロジェクトのコンパイルで使用するには、[他のソースセットと接続](multiplatform-hierarchy.md#manual-configuration)してください。

### ソースセットパラメータ

ソースセットの構成は、`sourceSets {}` の対応するブロック内に格納されます。ソースセットには以下のパラメータがあります。

| **名前**           | **説明**                                                                        |
|--------------------|----------------------------------------------------------------------------------------|
| `kotlin.srcDir`    | ソースセットディレクトリ内の Kotlin ソースファイルの場所。                       |
| `resources.srcDir` | ソースセットディレクトリ内のリソースの場所。                                 |
| `dependsOn`        | [別のソースセットとの接続](multiplatform-hierarchy.md#manual-configuration)。 |
| `dependencies`     | ソースセットの[依存関係](#dependencies)。                                       |
| `languageSettings` | 共有ソースセットに適用される[言語設定](#language-settings)。              |

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

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

</tab>
<tab title="Groovy" group-key="groovy">

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

</tab>
</tabs>

## コンパイル

ターゲットには、プロダクションやテストなど、1つ以上のコンパイルを含めることができます。ターゲット作成時に自動的に追加される[事前定義されたコンパイル](#predefined-compilations)があります。さらに、[カスタムコンパイル](#custom-compilations)を作成することもできます。

ターゲットのすべてのコンパイルまたは特定のコンパイルを参照するには、`compilations` オブジェクトコレクションを使用します。`compilations` から、その名前でコンパイルを参照できます。

[コンパイルの構成](multiplatform-configure-compilations.md)の詳細については、こちらをご覧ください。

### 事前定義されたコンパイル

事前定義されたコンパイルは、Android ターゲットを除くプロジェクトの各ターゲットに対して自動的に作成されます。利用可能な事前定義されたコンパイルは以下のとおりです。

| **名前** | **説明**                     |
|----------|-------------------------------------|
| `main`   | プロダクションソースのコンパイル。 |
| `test`   | テストのコンパイル。              |

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        val main by compilations.getting {
            output // main コンパイルの出力を取得する
        }

        compilations["test"].runtimeDependencyFiles // テストのランタイムクラスパスを取得する
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilations.main.output // main コンパイルの出力を取得する
        compilations.test.runtimeDependencyFiles // テストのランタイムクラスパスを取得する
    }
}
```

</tab>
</tabs>

### カスタムコンパイル

事前定義されたコンパイルに加えて、独自のカスタムコンパイルを作成できます。これを行うには、新しいコンパイルと `main` コンパイルの間に [`associateWith`](https://kotlinlang.org/docs/gradle-configure-project.html#associate-compiler-tasks) 関係を設定します。Kotlin Gradle DSL を使用している場合、カスタムコンパイルを `by creating` でマークします。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        compilations {
            val main by getting
            val integrationTest by creating {
                // main とそのクラスパスを依存関係としてインポートし、内部可視性を確立します
                associateWith(main)
                defaultSourceSet {
                    dependencies {
                        implementation(kotlin("test-junit"))
                        /* ... */
                    }
                }

                // このコンパイルによって生成されたテストを実行するテストタスクを作成する
                testRuns.create("integration") {
                    // テストタスクを構成する
                    setExecutionSourceFrom(integrationTest)
                }
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilations.create('integrationTest') {
            def main = compilations.main
            // main とそのクラスパスを依存関係としてインポートし、内部可視性を確立します
            associateWith(main)
            defaultSourceSet {
                dependencies {
                    implementation kotlin('test-junit')
                    /* ... */
                }
            }

            // このコンパイルによって生成されたテストを実行するテストタスクを作成する
            testRuns.create('integration') {
                // テストタスクを構成する
                setExecutionSourceFrom(compilations.integrationTest)
            }
        }
    }
}
```

</tab>
</tabs>

コンパイルを関連付けることで、main コンパイルの出力を依存関係として追加し、コンパイル間の `internal` 可視性を確立します。

[カスタムコンパイルの作成](multiplatform-configure-compilations.md#create-a-custom-compilation)の詳細については、こちらをご覧ください。

### コンパイルパラメータ

コンパイルには以下のパラメータがあります。

| **名前**                 | **説明**                                                                                                                                                           |
|--------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `defaultSourceSet`       | コンパイルのデフォルトソースセット。                                                                                                                                     |
| `kotlinSourceSets`       | コンパイルに参加するソースセット。                                                                                                                             |
| `allKotlinSourceSets`    | コンパイルに参加するソースセットと、`dependsOn()` を介したそれらの接続。                                                                                     |
| `compilerOptions`        | コンパイルに適用されるコンパイラオプション。利用可能なオプションのリストについては、[コンパイラオプション](https://kotlinlang.org/docs/gradle-compiler-options.html)をご覧ください。         |
| `compileKotlinTask`      | Kotlin ソースをコンパイルするための Gradle タスク。                                                                                                                                 |
| `compileKotlinTaskName`  | `compileKotlinTask` の名前。                                                                                                                                              |
| `compileAllTaskName`     | コンパイルのすべてのソースをコンパイルするための Gradle タスクの名前。                                                                                                       |
| `output`                 | コンパイルの出力。                                                                                                                                                   |
| `compileDependencyFiles` | コンパイルのコンパイル時依存ファイル (クラスパス)。すべての Kotlin/Native コンパイルの場合、これには標準ライブラリとプラットフォームの依存関係が自動的に含まれます。 |
| `runtimeDependencyFiles` | コンパイルのランタイム依存ファイル (クラスパス)。                                                                                                                  |

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        val main by compilations.getting {
            compileTaskProvider.configure {
                compilerOptions {
                    // 'main' コンパイルの Kotlin コンパイラオプションを設定します。
                    jvmTarget.set(JvmTarget.JVM_1_8)
                }
            }

            compileKotlinTask // Kotlin タスク 'compileKotlinJvm' を取得する
            output // main コンパイルの出力を取得する
        }

        compilations["test"].runtimeDependencyFiles // テストのランタイムクラスパスを取得する
    }

    // すべてのターゲットのすべてのコンパイルを構成します。
    compilerOptions {
        allWarningsAsErrors.set(true)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilations.main {
            compileTaskProvider.configure {
                // 'main' コンパイルの Kotlin コンパイラオプションを設定します。
                jvmTarget = JvmTarget.JVM_1_8
                }
            }
        }

        compilations.main.compileKotlinTask // Kotlin タスク 'compileKotlinJvm' を取得する
        compilations.main.output // main コンパイルの出力を取得する
        compilations.test.runtimeDependencyFiles // テストのランタイムクラスパスを取得する
    }

    // すべてのターゲットのすべてのコンパイルを構成します。
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</tab>
</tabs>

## コンパイラオプション

プロジェクトのコンパイラオプションは、以下の3つの異なるレベルで構成できます。

*   **拡張レベル**、`kotlin {}` ブロック内。
*   **ターゲットレベル**、ターゲットブロック内。
*   **コンパイルユニットレベル**、通常は特定のコンパイルタスク内。

![Kotlin compiler options levels](compiler-options-levels.svg){width=700}

上位レベルでの設定は、下位レベルのデフォルトとして機能します。

*   拡張レベルで設定されたコンパイラオプションは、`commonMain`、`nativeMain`、`commonTest` などの共有ソースセットを含む、ターゲットレベルのオプションのデフォルトです。
*   ターゲットレベルで設定されたコンパイラオプションは、`compileKotlinJvm` および `compileTestKotlinJvm` タスクのような、コンパイルユニット (タスク) レベルのオプションのデフォルトです。

下位レベルで行われた構成は、上位レベルの同様の設定をオーバーライドします。

*   タスクレベルのコンパイラオプションは、ターゲットまたは拡張レベルの同様の設定をオーバーライドします。
*   ターゲットレベルのコンパイラオプションは、拡張レベルの同様の設定をオーバーライドします。

利用可能なコンパイラオプションのリストについては、[すべてのコンパイラオプション](https://kotlinlang.org/docs/gradle-compiler-options.html#all-compiler-options)をご覧ください。

### 拡張レベル

プロジェクト内のすべてのターゲットのコンパイラオプションを構成するには、トップレベルで `compilerOptions {}` ブロックを使用します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    // すべてのターゲットのすべてのコンパイルを構成します
    compilerOptions {
        allWarningsAsErrors.set(true)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    // すべてのターゲットのすべてのコンパイルを構成します。
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</tab>
</tabs>

### ターゲットレベル

プロジェクト内の特定のターゲットのコンパイラオプションを構成するには、ターゲットブロック内で `compilerOptions {}` ブロックを使用します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        // JVM ターゲットのすべてのコンパイルを構成します
        compilerOptions {
            allWarningsAsErrors.set(true)
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        // JVM ターゲットのすべてのコンパイルを構成します
        compilerOptions {
            allWarningsAsErrors = true
        }
    }
}
```

</tab>
</tabs>

### コンパイルユニットレベル

特定のタスクのコンパイラオプションを構成するには、タスク内で `compilerOptions {}` ブロックを使用します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
task.named<KotlinJvmCompile>("compileKotlinJvm") {
    compilerOptions {
        allWarningsAsErrors.set(true)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
task.named<KotlinJvmCompile>("compileKotlinJvm") {
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</tab>
</tabs>

特定のコンパイルのコンパイラオプションを構成するには、そのコンパイルのタスクプロバイダ内で `compilerOptions {}` ブロックを使用します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        compilations.named(KotlinCompilation.MAIN_COMPILATION_NAME) {
            compileTaskProvider.configure {
                // 'main' コンパイルを構成します。
                compilerOptions {
                    allWarningsAsErrors.set(true)
                }
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilations.named(KotlinCompilation.MAIN_COMPILATION_NAME) {
            compileTaskProvider.configure {
                // 'main' コンパイルを構成します。
                compilerOptions {
                    allWarningsAsErrors = true
                }
            }
        }
    }
}
```

</tab>
</tabs>

### `kotlinOptions {}` から `compilerOptions {}` への移行 {collapsible="true"}

Kotlin 2.2.0 より前は、`kotlinOptions {}` ブロックを使用してコンパイラオプションを構成できました。Kotlin 2.2.0 で `kotlinOptions {}` ブロックが非推奨になったため、代わりにビルドスクリプトで `compilerOptions {}` ブロックを使用する必要があります。詳細については、[Migrate from `kotlinOptions{}` to `compilerOptions{}`](https://kotlinlang.org/docs/gradle-compiler-options.html#migrate-from-kotlinoptions-to-compileroptions) を参照してください。

## 依存関係

ソースセット宣言の `dependencies {}` ブロックには、このソースセットの依存関係が含まれます。

[依存関係の構成](https://kotlinlang.org/docs/gradle-configure-project.html)の詳細については、こちらをご覧ください。

依存関係には4つのタイプがあります。

| **名前**         | **説明**                                                                     |
|------------------|-------------------------------------------------------------------------------------|
| `api`            | 現在のモジュールの API で使用される依存関係。                                 |
| `implementation` | モジュール内で使用されるが、モジュールの外部には公開されない依存関係。                         |
| `compileOnly`    | 現在のモジュールのコンパイルのみに使用される依存関係。                       |
| `runtimeOnly`    | ランタイム時には利用可能だが、どのモジュールのコンパイル時にも可視ではない依存関係。 |

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

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

</tab>
<tab title="Groovy" group-key="groovy">

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

</tab>
</tabs>

さらに、ソースセットは互いに依存し、階層を形成できます。この場合、[`dependsOn()`](#source-set-parameters) 関係が使用されます。

ソースセットの依存関係は、ビルドスクリプトのトップレベルの `dependencies {}` ブロックでも宣言できます。この場合、その宣言は `<sourceSetName><DependencyKind>` のパターン (例: `commonMainApi`) に従います。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    "commonMainApi"("com.example:foo-common:1.0")
    "jvm6MainApi"("com.example:foo-jvm6:1.0")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    commonMainApi 'com.example:foo-common:1.0'
    jvm6MainApi 'com.example:foo-jvm6:1.0'
}
```

</tab>
</tabs>

## 言語設定

ソースセットの `languageSettings {}` ブロックは、プロジェクトの解析とコンパイルの特定の側面を定義します。`languageSettings {}` ブロックは、共有ソースセットに特化した設定を構成する場合にのみ使用してください。その他のすべてのケースでは、拡張レベルまたはターゲットレベルで[コンパイラオプションを構成](#compiler-options)するために `compilerOptions {}` ブロックを使用してください。

以下の言語設定が利用可能です。

| **名前**                | **説明**                                                                                                                                                                 |
|-------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `languageVersion`       | 指定された Kotlin バージョンとのソース互換性を提供します。                                                                                                             |
| `apiVersion`            | 指定されたバージョンの Kotlin バンドルライブラリからの宣言のみを使用できるようにします。                                                                                          |
| `enableLanguageFeature` | 指定された言語機能を有効にします。利用可能な値は、現在実験的であるか、ある時点でそのようなものとして導入された言語機能に対応します。 |
| `optIn`                 | 指定された[オプトインアノテーション](https://kotlinlang.org/docs/opt-in-requirements.html)の使用を許可します。                                                                           |
| `progressiveMode`       | [プログレッシブモード](https://kotlinlang.org/docs/whatsnew13.html#progressive-mode)を有効にします。                                                                                   |

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets.all {
        languageSettings.apply {
            languageVersion = "%languageVersion%" // 指定可能な値: "1.8", "1.9", "2.0", "2.1"
            apiVersion = "%apiVersion%" // 指定可能な値: "1.8", "1.9", "2.0", "2.1"
            enableLanguageFeature("InlineClasses") // 言語機能名
            optIn("kotlin.ExperimentalUnsignedTypes") // アノテーションの完全修飾名 (FQ-name)
            progressiveMode = true // デフォルトでは false
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets.all {
        languageSettings {
            languageVersion = '%languageVersion%' // 指定可能な値: '1.8', '1.9', '2.0', '2.1'
            apiVersion = '%apiVersion%' // 指定可能な値: '1.8', '1.9', '2.0', '2.1'
            enableLanguageFeature('InlineClasses') // 言語機能名
            optIn('kotlin.ExperimentalUnsignedTypes') // アノテーションの完全修飾名 (FQ-name)
            progressiveMode = true // デフォルトでは false
        }
    }
}
```

</tab>
</tabs>