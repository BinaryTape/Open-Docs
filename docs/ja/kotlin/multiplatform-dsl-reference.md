---
title: "マルチプラットフォーム Gradle DSL リファレンス"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Kotlin Multiplatform Gradle プラグインは、Kotlin Multiplatform プロジェクトを作成するためのツールです。
ここでは、その内容のリファレンスを提供します。Kotlin Multiplatform プロジェクトの Gradle ビルドスクリプトを作成する際の参考としてください。[Kotlin Multiplatform プロジェクトの概念、作成方法、設定方法](multiplatform-intro)について学びましょう。

## Id とバージョン

Kotlin Multiplatform Gradle プラグインの完全修飾名は `org.jetbrains.kotlin.multiplatform` です。
Kotlin Gradle DSL を使用している場合は、`kotlin("multiplatform")` でプラグインを適用できます。
プラグインのバージョンは、Kotlin のリリースバージョンと一致します。最新バージョンは 2.1.20 です。

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

## トップレベルのブロック

`kotlin {}` は、Gradle ビルドスクリプトにおけるマルチプラットフォームプロジェクト構成のトップレベルブロックです。
`kotlin {}` 内には、次のブロックを記述できます。

| **ブロック**            | **説明**                                                                                                                          |
|----------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| _&lt;targetName&gt;_ | プロジェクトの特定の[ターゲット](#targets)を宣言します。利用可能なターゲットの名前は、[ターゲット](#targets)セクションにリストされています。                 |
| `targets`            | プロジェクトのすべてのターゲットをリストします。                                                                                                        |
| `sourceSets`         | プロジェクトの事前定義済みおよびカスタム[ソースセット](#source-sets)を設定および宣言します。                                                    |
| `compilerOptions`    | すべてのターゲットと共有ソースセットのデフォルトとして使用される、共通の拡張レベル[コンパイラオプション](#compiler-options)を指定します。 |

## ターゲット

_ターゲット_とは、サポートされているプラットフォームのいずれかを対象としたソフトウェアのコンパイル、テスト、パッケージングを担当するビルドの一部です。Kotlin は各プラットフォームのターゲットを提供しているため、Kotlin にその特定のターゲットに対してコードをコンパイルするように指示できます。[ターゲットの設定](multiplatform-discover-project#targets)の詳細をご覧ください。

各ターゲットは、1 つ以上の[コンピレーション](#compilations)を持つことができます。テストおよび本番環境用のデフォルトのコンピレーションに加えて、[カスタムコンピレーションを作成](multiplatform-configure-compilations#create-a-custom-compilation)できます。

マルチプラットフォームプロジェクトのターゲットは、`kotlin {}` 内の対応するブロックで記述されます。たとえば、`jvm`、`androidTarget`、`iosArm64` などです。
利用可能なターゲットの完全なリストは次のとおりです。
<table>
<tr>
        <th>対象プラットフォーム</th>
        <th>ターゲット</th>
        <th>コメント</th>
</tr>
<tr>
<td>
Kotlin/JVM
</td>
<td>
`jvm`
</td>
<td>
</td>
</tr>
<tr>
<td rowspan="2">
Kotlin/Wasm
</td>
<td>
`wasmJs`
</td>
<td>
JavaScript ランタイムでプロジェクトを実行する予定がある場合は、これを使用します。
</td>
</tr>
<tr>
<td>
`wasmWasi`
</td>
<td>
<a href="https://github.com/WebAssembly/WASI">WASI</a> システムインターフェイスのサポートが必要な場合は、これを使用します。
</td>
</tr>
<tr>
<td>
Kotlin/JS
</td>
<td>
`js`
</td>
<td>

<p>
   実行環境を選択してください。
</p>
<list>
<li>ブラウザで実行されるアプリケーションの場合は `browser {}`。</li>
<li>Node.js で実行されるアプリケーションの場合は `nodejs {}`。</li>
</list>
<p>
   詳細については、<a href="js-project-setup#execution-environments">Kotlin/JS プロジェクトの設定</a>を参照してください。
</p>
</td>
</tr>
<tr>
<td>
Kotlin/Native
</td>
<td>
</td>
<td>

<p>
   macOS、Linux、Windows ホストで現在サポートされているターゲットについては、<a href="native-target-support">Kotlin/Native ターゲットのサポート</a>を参照してください。
</p>
</td>
</tr>
<tr>
<td>
Android アプリケーションおよびライブラリ
</td>
<td>
`androidTarget`
</td>
<td>

<p>
   Android Gradle プラグインを手動で適用します: `com.android.application` または `com.android.library`。
</p>
<p>
   Gradle サブプロジェクトごとに作成できる Android ターゲットは 1 つだけです。
</p>
</td>
</tr>
</table>
:::note
現在のホストでサポートされていないターゲットは、ビルド中に無視されるため、公開されません。

:::

```groovy
kotlin {
    jvm()
    iosArm64()
    macosX64()
    js().browser()
}
```

ターゲットの構成には、次の 2 つの部分を含めることができます。

* すべてのターゲットで使用可能な[共通ターゲット構成](#common-target-configuration)。
* ターゲット固有の構成。

各ターゲットは、1 つ以上の[コンピレーション](#compilations)を持つことができます。

### 共通ターゲット構成

任意のターゲットブロックでは、次の宣言を使用できます。

| **名前**            | **説明**                                                                                                                                                                            | 
|---------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `platformType`      | このターゲットの Kotlin プラットフォーム。使用可能な値: `jvm`、`androidJvm`、`js`、`wasm`、`native`、`common`。                                                                              |
| `artifactsTaskName` | このターゲットの結果の成果物をビルドするタスクの名前。                                                                                                                   |
| `components`        | Gradle パブリケーションの設定に使用されるコンポーネント。                                                                                                                                             |
| `compilerOptions`   | ターゲットに使用される[コンパイラオプション](#compiler-options)。この宣言は、[トップレベル](multiplatform-dsl-reference#top-level-blocks)で構成された `compilerOptions {}` を上書きします。 |

### Web ターゲット

`js {}` ブロックは Kotlin/JS ターゲットの構成を記述し、`wasmJs {}` ブロックは JavaScript と相互運用可能な Kotlin/Wasm ターゲットの構成を記述します。これらには、ターゲットの実行に応じて、次の 2 つのブロックのいずれかを含めることができます。
環境：

| **名前**              | **説明**                      | 
|-----------------------|--------------------------------------|
| [`browser`](#browser) | ブラウザターゲットの構成。 |
| [`nodejs`](#node-js)  | Node.js ターゲットの構成。 |

[Kotlin/JS プロジェクトの構成](js-project-setup)の詳細をご覧ください。

個別の `wasmWasi {}` ブロックは、WASI システムインターフェイスをサポートする Kotlin/Wasm ターゲットの構成を記述します。
ここでは、[`nodejs`](#node-js) 実行環境のみが利用可能です。

```kotlin
kotlin {
    wasmWasi {
        nodejs()
        binaries.executable()
    }
}
```

すべての Web ターゲット (`js`、`wasmJs`、`wasmWasi`) は、`binaries.executable()` 呼び出しもサポートしています。これは、Kotlin コンパイラに実行可能ファイルを出力するように明示的に指示します。詳細については、Kotlin/JS ドキュメントの[実行環境](js-project-setup#execution-environments)を参照してください。

#### Browser

`browser {}` には、次の構成ブロックを含めることができます。

| **名前**       | **説明**                                                         | 
|----------------|---------------------------------------------------------|
| `testRuns`     | テスト実行の構成。                                        |
| `runTask`      | プロジェクトの実行の構成。                                       |
| `webpackTask`  | [Webpack](https://webpack.js.org/) を使用したプロジェクトバンドルの構成。 |
| `distribution` | 出力ファイルへのパス。                                                   |

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

`nodejs {}` には、テストタスクと実行タスクの構成を含めることができます。

| **名前**   | **説明**                   | 
|------------|-----------------------------------|
| `testRuns` | テスト実行の構成。  |
| `runTask`  | プロジェクトの実行の構成。 |

```kotlin
kotlin {
    js().nodejs {
        runTask { /* ... */ }
        testRuns { /* ... */ }
    }
}
```

### Native ターゲット

Native ターゲットでは、次の特定のブロックが利用可能です。

| **名前**    | **説明**                                          | 
|-------------|----------------------------------------------------------|
| `binaries`  | 生成する[バイナリ](#binaries)の構成。       |
| `cinterops` | [C ライブラリとのインターオペラビリティ](#cinterops)の構成。 |

#### バイナリ

次の種類のバイナリがあります。

| **名前**     | **説明**        | 
|--------------|------------------------|
| `executable` | 製品の実行可能ファイル。    |
| `test`       | テストの実行可能ファイル。       |
| `sharedLib`  | 共有ライブラリ。        |
| `staticLib`  | 静的ライブラリ。        |
| `framework`  | Objective-C フレームワーク。 |

```kotlin
kotlin {
    linuxX64 { // ターゲットを代わりに使用してください。
        binaries {
            executable {
                // バイナリ構成。
            }
        }
    }
}
```

バイナリ構成では、次のパラメーターが利用可能です。

| **名前**      | **説明**                                                                                                                                                   | 
|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `compilation` | バイナリの構築元となるコンピレーション。デフォルトでは、`test` バイナリは `test` コンピレーションに基づいていますが、他のバイナリは `main` コンピレーションに基づいています。 |
| `linkerOpts`  | バイナリの構築中にシステムリンカーに渡されるオプション。                                                                                                         |
| `baseName`    | 出力ファイルのカスタムベース名。最終的なファイル名は、システム依存のプレフィックスとポストフィックスをこのベース名に追加して形成されます。                         |
| `entryPoint`  | 実行可能バイナリのエントリーポイント関数。デフォルトでは、ルートパッケージの `main()` です。                                                                  |
| `outputFile`  | 出力ファイルへのアクセス。                                                                                                                                        |
| `linkTask`    | リンクタスクへのアクセス。                                                                                                                                          |
| `runTask`     | 実行可能バイナリの実行タスクへのアクセス。`linuxX64`、`macosX64`、`mingwX64` 以外のターゲットの場合、値は `null` です。                                 |
| `isStatic`    | Objective-C フレームワークの場合。動的ライブラリの代わりに静的ライブラリを含めます。                                                                                   |

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
binaries {
    executable("my_executable", listOf(RELEASE)) {
        // テストコンパイルに基づいてバイナリを構築します。
        compilation = compilations["test"]

        // リンカーのカスタムコマンドラインオプション。
        linkerOpts = mutableListOf("-L/lib/search/path", "-L/another/search/path", "-lmylib")

        // 出力ファイルのベース名。
        baseName = "foo"

        // カスタムエントリポイント関数。
        entryPoint = "org.example.main"

        // 出力ファイルへのアクセス。
        println("Executable path: ${outputFile.absolutePath}")

        // リンクタスクへのアクセス。
        linkTask.dependsOn(additionalPreprocessingTask)

        // 実行タスクへのアクセス。
        // runTask はホストプラットフォーム以外では null であることに注意してください。
        runTask?.dependsOn(prepareForRun)
    }

    framework("my_framework" listOf(RELEASE)) {
        // 動的ライブラリの代わりに静的ライブラリをフレームワークに含めます。
        isStatic = true
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
binaries {
    executable('my_executable', [RELEASE]) {
        // テストコンパイルに基づいてバイナリを構築します。
        compilation = compilations.test

        // リンカーのカスタムコマンドラインオプション。
        linkerOpts = ['-L/lib/search/path', '-L/another/search/path', '-lmylib']

        // 出力ファイルのベース名。
        baseName = 'foo'

        // カスタムエントリポイント関数。
        entryPoint = 'org.example.main'

        // 出力ファイルへのアクセス。
        println("Executable path: ${outputFile.absolutePath}")

        // リンクタスクへのアクセス。
        linkTask.dependsOn(additionalPreprocessingTask)

        // 実行タスクへのアクセス。
        // runTask はホストプラットフォーム以外では null であることに注意してください。
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

[Native バイナリのビルド](multiplatform-build-native-binaries)の詳細をご覧ください。

#### CInterops

`cinterops` は、Native ライブラリとのインターオペラビリティの説明のコレクションです。
ライブラリとのインターオペラビリティを提供するには、`cinterops` にエントリを追加し、そのパラメーターを定義します。

| **名前**         | **説明**                                       | 
|------------------|-------------------------------------------------------|
| `definitionFile` | Native API を記述する `.def` ファイル。            |
| `packageName`    | 生成された Kotlin API のパッケージプレフィックス。          |
| `compilerOpts`   | cinterop ツールによってコンパイラに渡されるオプション。 |
| `includeDirs`    | ヘッダーを検索するディレクトリ。                      |
| `header`         | バインディングに含めるヘッダー。                |
| `headers`        | バインディングに含めるヘッダーのリスト。   |

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    linuxX64 { // 必要なターゲットに置き換えてください。
        compilations.getByName("main") {
            val myInterop by cinterops.creating {
                // Native API を記述する Def ファイル。
                // デフォルトのパスは src/nativeInterop/cinterop/<interop-name>.def です。
                definitionFile.set(project.file("def-file.def"))

                // 生成された Kotlin API を配置するパッケージ。
                packageName("org.sample")

                // cinterop ツールによってコンパイラに渡されるオプション。
                compilerOpts("-Ipath/to/headers")

                // ヘッダー検索用のディレクトリ (コンパイラオプション -I<path> の類似)。
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
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    linuxX64 { // 必要なターゲットに置き換えてください。
        compilations.main {
            cinterops {
                myInterop {
                    // Native API を記述する Def ファイル。
                    // デフォルトのパスは src/nativeInterop/cinterop/<interop-name>.def です。
                    definitionFile = project.file("def-file.def")

                    // 生成された Kotlin API を配置するパッケージ。
                    packageName 'org.sample'

                    // cinterop ツールによってコンパイラに渡されるオプション。
                    compilerOpts '-Ipath/to/headers'

                    // ヘッダー検索用のディレクトリ (コンパイラオプション -I<path> の類似)。
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

その他の cinterop プロパティについては、[定義ファイル](native-definition-file#properties)を参照してください。

### Android ターゲット

Kotlin Multiplatform プラグインには、Android ターゲット用の 2 つの特定の関数が含まれています。
2 つの関数は、[ビルドバリアント](https://developer.android.com/studio/build/build-variants)の構成に役立ちます。

| **名前**                      | **説明**                                                                                                                                | 
|-------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------|
| `publishLibraryVariants()`    | 公開するビルドバリアントを指定します。[Android ライブラリの公開](multiplatform-publish-lib#publish-an-android-library)の詳細をご覧ください。 |
| `publishAllLibraryVariants()` | すべてのビルドバリアントを公開します。                                                                                                                  |

```kotlin
kotlin {
    androidTarget {
        publishLibraryVariants("release")
    }
}
```

[Android のコンピレーション](multiplatform-configure-compilations#compilation-for-android)の詳細をご覧ください。

:::note
`kotlin {}` ブロック内の `androidTarget` 構成は、Android プロジェクトのビルド構成を置き換えるものではありません。
Android プロジェクトのビルドスクリプトの作成の詳細については、[Android デベロッパー向けドキュメント](https://developer.android.com/studio/build)を参照してください。

:::

## ソースセット

`sourceSets {}` ブロックは、プロジェクトのソースセットを記述します。ソースセットには、リソース、依存関係、および言語設定とともに、コンピレーションに一緒に参加する Kotlin ソースファイルが含まれています。

マルチプラットフォームプロジェクトには、ターゲットの[事前定義済み](#predefined-source-sets)ソースセットが含まれています。
開発者は、ニーズに合わせて[カスタム](#custom-source-sets)ソースセットを作成することもできます。

### 事前定義済みのソースセット

事前定義済みのソースセットは、マルチプラットフォームプロジェクトの作成時に自動的に設定されます。
利用可能な事前定義済みのソースセットは次のとおりです。

| **名前**                                    | **説明**                                                                                                                                                                                               | 
|---------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `commonMain`                                | すべてのプラットフォーム間で共有されるコードとリソース。すべてのマルチプラットフォームプロジェクトで利用可能です。プロジェクトのすべての main [コンピレーション](#compilations)で使用されます。                         |
| `commonTest`                                | すべてのプラットフォーム間で共有されるテストコードとリソース。すべてのマルチプラットフォームプロジェクトで利用可能です。プロジェクトのすべてのテストコンピレーションで使用されます。                                                                    |
| _&lt;targetName&gt;&lt;compilationName&gt;_ | コンピレーションのターゲット固有のソース。 _&lt;targetName&gt;_ は事前定義されたターゲットの名前であり、_&lt;compilationName&gt;_ はこのターゲットのコンピレーションの名前です。例: `jsTest`、`jvmMain`。 |

Kotlin Gradle DSL では、事前定義済みのソースセットのセクションは `by getting` でマークする必要があります。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets {
        val commonMain by getting { /* ... */ }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin { 
    sourceSets { 
        commonMain { /* ... */ } 
    }
}
```

</TabItem>
</Tabs>

[ソースセット](multiplatform-discover-project#source-sets)の詳細をご覧ください。

### カスタムソースセット

カスタムソースセットは、プロジェクト開発者が手動で作成します。
カスタムソースセットを作成するには、`sourceSets` セクション内にその名前のセクションを追加します。
Kotlin Gradle DSL を使用する場合は、カスタムソースセットを `by creating` でマークします。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin { 
    sourceSets { 
        val myMain by creating { /* ... */ } // 「MyMain」という名前で新しいソースセットを作成します
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin { 
    sourceSets { 
        myMain { /* ... */ } // 「myMain」という名前でソースセットを作成または設定します 
    }
}
```

</TabItem>
</Tabs>

新しく作成されたソースセットは他のソースセットに接続されていないことに注意してください。プロジェクトのコンピレーションで使用するには、
[他のソースセットと接続](multiplatform-hierarchy#manual-configuration)します。

### ソースセットのパラメーター

ソースセットの構成は、`sourceSets {}` の対応するブロック内に格納されます。ソースセットには、次のパラメーターがあります。

| **名前**           | **説明**                                                                        | 
|--------------------|----------------------------------------------------------------------------------------|
| `kotlin.srcDir`    | ソースセットディレクトリ内の Kotlin ソースファイルの場所。                       |
| `resources.srcDir` | ソースセットディレクトリ内のリソースの場所。                                 |
| `dependsOn`        | [別のソースセットとの接続](multiplatform-hierarchy#manual-configuration)。 |
| `dependencies`     | ソースセットの[依存関係](#dependencies)。                                       |
| `languageSettings` | ソースセットに適用される[言語設定](#language-settings)。                     |

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin { 
    sourceSets { 
        val commonMain by getting {
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
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin { 
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

ターゲットは、本番環境やテストなど、1 つ以上のコンピレーションを持つことができます。[事前定義済みのコンピレーション](#predefined-compilations)があります
これは、ターゲットの作成時に自動的に追加されます。さらに、[カスタムコンピレーション](#custom-compilations)を作成できます。

ターゲットのすべてまたは一部の特定のコンピレーションを参照するには、`compilations` オブジェクトコレクションを使用します。
`compilations` から、名前でコンピレーションを参照できます。

[コンピレーションの構成](multiplatform-configure-compilations)の詳細をご覧ください。

### 事前定義済みのコンピレーション

事前定義済みのコンピレーションは、Android ターゲットを除く、プロジェクトの各ターゲットに対して自動的に作成されます。
利用可能な事前定義済みのコンピレーションは次のとおりです。

| **名前** | **説明**                     | 
|----------|-------------------------------------|
| `main`   | 本番環境ソースのコンピレーション。 |
| `test`   | テストのコンピレーション。              |

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    jvm {
        val main by compilations.getting {
            output // メインコンピレーションの出力を取得します
        }

        compilations["test"].runtimeDependencyFiles // テストランタイムクラスパスを取得します
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    jvm {
        compilations.main.output // メインコンピレーションの出力を取得します
        compilations.test.runtimeDependencyFiles // テストランタイムクラスパスを取得します
    }
}
```

</TabItem>
</Tabs>

### カスタムコンピレーション

事前定義済みのコンピレーションに加えて、独自のカスタムコンピレーションを作成できます。
カスタムコンピレーションを作成するには、`compilations` コレクションに新しいアイテムを追加します。
Kotlin Gradle DSL を使用する場合は、カスタムコンピレーションを `by creating` でマークします。

[カスタムコンピレーション](multiplatform-configure-compilations#create-a-custom-compilation)の作成の詳細をご覧ください。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    jvm() {
        compilations {
            val integrationTest by compilations.creating {
                defaultSourceSet {
                    dependencies {
                        /* ... */
                    }
                }

                // このコンピレーションによって生成されたテストを実行するテストタスクを作成します。
                tasks.register<Test>("integrationTest") {
                    /* ... */
                }
            }
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    jvm() {
        compilations.create('integrationTest') {
            defaultSourceSet {
                dependencies {
                    /* ... */
                }
            }

            // このコンピレーションによって生成されたテストを実行するテストタスクを作成します。
            tasks.register('jvmIntegrationTest', Test) {
                /* ... */
            }
        }
    }
}
```

</TabItem>
</Tabs>

### コンピレーションパラメーター

コンピレーションには、次のパラメーターがあります。

| **名前**                 | **説明**                                                                                                                                                           | 
|--------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `defaultSourceSet`       | コンピレーションのデフォルトソースセット。                                                                                                                                     |
| `kotlinSourceSets`       | コンピレーションに参加しているソースセット。                                                                                                                             |
| `allKotlinSourceSets`    | コンピレーションに参加しているソースセットと、`dependsOn()` を介した接続。                                                                                     |
| `compilerOptions`        | コンピレーションに適用されるコンパイラオプション。利用可能なオプションのリストについては、[コンパイラオプション](gradle-compiler-options)を参照してください。                                       |
| `compileKotlinTask`      | Kotlin ソースをコンパイルするための Gradle タスク。                                                                                                                                 |
| `compileKotlinTaskName`  | `compileKotlinTask` の名前。                                                                                                                                              |
| `compileAllTaskName`     | コンピレーションのすべてのソースをコンパイルするための Gradle タスクの名前。                                                                                                       |
| `output`                 | コンピレーションの出力。                                                                                                                                                   |
| `compileDependencyFiles` | コンピレーションのコンパイル時の依存関係ファイル (クラスパス)。すべての Kotlin/Native コンピレーションの場合、これには標準ライブラリとプラットフォームの依存関係が自動的に含まれます。 |
| `runtimeDependencyFiles` | コンピレーションのランタイム依存関係ファイル (クラスパス)。                                                                                                                  |

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    jvm {
        val main by compilations.getting {
            compileTaskProvider.configure {
                compilerOptions {
                    // 「main」コンピレーションの Kotlin コンパイラオプションを設定します。
                    jvmTarget.set(JvmTarget.JVM_1_8)
                }
            }
        
            compileKotlinTask // Kotlin タスク「compileKotlinJvm」を取得します 
            output // メインコンピレーションの出力を取得します
        }
        
        compilations["test"].runtimeDependencyFiles // テストランタイムクラスパスを取得します
    }

    // すべてのターゲットのすべてのコンピレーションを設定します。
    compilerOptions {
        allWarningsAsErrors.set(true)
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    jvm {
        compilations.main {
            compileTaskProvider.configure {
                compilerOptions {
                    // 「main」コンピレーションの Kotlin コンパイラオプションを設定します。
                    jvmTarget = JvmTarget.JVM_1_8
                }
            }
        }

        compilations.main.compileKotlinTask // Kotlin タスク「compileKotlinJvm」を取得します 
        compilations.main.output // メインコンピレーションの出力を取得します
        compilations.test.runtimeDependencyFiles // テストランタイムクラスパスを取得します
    }

    // すべてのターゲットのすべてのコンピレーションを設定します。
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</TabItem>
</Tabs>

## コンパイラオプション

プロジェクトでは、コンパイラオプションを 3 つの異なるレベルで構成できます。

* **拡張機能レベル** (`kotlin {}` ブロック内)。
* **ターゲットレベル** (ターゲットブロック内)。
* **コンパイルユニットレベル** (通常は特定のコンパイルタスク内)。

<img src="/img/compiler-options-levels.svg" alt="Kotlin compiler options levels" width="700" style={{verticalAlign: 'middle'}}/>

上位レベルの設定は、下位レベルのデフォルトとして機能します。

* 拡張機能レベルで設定されたコンパイラオプションは、`commonMain`、`nativeMain`、`commonTest` などの共有ソースセットを含む、ターゲットレベルオプションのデフォルトです。
* ターゲットレベルで設定されたコンパイラオプションは、`compileKotlinJvm` および `compileTestKotlinJvm` タスクなどの、コンパイルユニット (タスク) レベルのオプションのデフォルトです。

下位レベルで行われた構成は、上位レベルの同様の設定を上書きします。

* タスクレベルのコンパイラオプションは、ターゲットレベルまたは拡張機能レベルの同様の設定を上書きします。
* ターゲットレベルのコンパイラオプションは、拡張機能レベルの同様の設定を上書きします。

可能なコンパイラオプションのリストについては、[すべてのコンパイラオプション](gradle-compiler-options#all-compiler-options)を参照してください。

### 拡張機能レベル

プロジェクト内のすべてのターゲットのコンパイラオプションを構成するには、トップレベルで `compilerOptions {}` ブロックを使用します。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    // すべてのターゲットのすべてのコンピレーションを構成します
    compilerOptions {
        allWarningsAsErrors.set(true)
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    // すべてのターゲットのすべてのコンピレーションを構成します。
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</TabItem>
</Tabs>

### ターゲットレベル

プロジェクト内の特定のターゲットのコンパイラオプションを構成するには、ターゲットブロック内で `compilerOptions {}` ブロックを使用します。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    jvm {
        // JVM ターゲットのすべてのコンピレーションを構成します
        compilerOptions {
            allWarningsAsErrors.set(true)
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    jvm {
        // JVM ターゲットのすべてのコンピレーションを構成します
        compilerOptions {
            allWarningsAsErrors = true
        }
    }
}
```

</TabItem>
</Tabs>

### コンパイルユニットレベル

特定のタスクのコンパイラオプションを構成するには、タスク内で `compilerOptions {}` ブロックを使用します。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
task.named<KotlinJvmCompile>("compileKotlinJvm") {
    compilerOptions {
        allWarningsAsErrors.set(true)
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
task.named<KotlinJvmCompile>("compileKotlinJvm") {
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</TabItem>
</Tabs>

特定のコンピレーションのコンパイラオプションを構成するには、コンピレーションのタスクプロバイダー内で `compilerOptions {}` ブロックを使用します。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    jvm {
        compilations.named(KotlinCompilation.MAIN_COMPILATION_NAME) {
            compileTaskProvider.configure {
                // 「main」コンピレーションを構成します。
                compilerOptions {
                    allWarningsAsErrors.set(true)
                }
            }
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    jvm {
        compilations.named(KotlinCompilation.MAIN_COMPILATION_NAME) {
            compileTaskProvider.configure {
                // 「main」コンピレーションを構成します。
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

## 依存関係

ソースセット宣言の `dependencies {}` ブロックには、このソースセットの依存関係が含まれています。

[依存関係の構成](gradle-configure-project)の詳細をご覧ください。

依存関係には 4 種類あります。

| **名前**         | **説明**                                                                     | 
|------------------|-------------------------------------------------------------------------------------|
| `api`            | 現在のモジュールの API で使用される依存関係。                                 |
| `implementation` | モジュールで使用されるが、外部には公開されない依存関係。                         |