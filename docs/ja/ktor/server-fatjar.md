[//]: # (title: Ktor Gradleプラグインを使用してファットJARを作成する)

<tldr>
<var name="example_name" value="deployment-ktor-plugin"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>Ktor Gradleプラグインを使用して実行可能なファットJARを作成し、実行する方法を学ぶ。</link-summary>

[Ktor Gradleプラグイン](https://github.com/ktorio/ktor-build-plugins)を使用すると、すべてのコード依存関係を含む実行可能なJAR (ファットJAR) を作成して実行できます。

## Ktorプラグインの設定 {id="configure-plugin"}

ファットJARをビルドするには、まずKtorプラグインを設定する必要があります。

1. `build.gradle.kts`ファイルを開き、`plugins`ブロックにプラグインを追加します。
   ```kotlin
   plugins {
       id("io.ktor.plugin") version "3.2.3"
   }
   ```

2. [メインアプリケーションクラス](server-dependencies.topic#create-entry-point)が設定されていることを確認してください。
   ```kotlin
   application {
       mainClass.set("com.example.ApplicationKt")
   }
   ```

3. オプションで、`ktor.fatJar`エクステンションを使用して、生成されるファットJARの名前を設定できます。
   ```kotlin
   ktor {
       fatJar {
           archiveFileName.set("fat.jar")
       }
   }
   ```

> Ktor GradleプラグインをKotlin Multiplatform Gradleプラグインと一緒に適用すると、ファットJAR作成機能は自動的に無効になります。
> それらを一緒に使用できるようにするには:
> 1. 上記のようにKtor Gradleプラグインが適用されたJVM専用プロジェクトを作成します。
> 2. そのJVM専用プロジェクトにKotlin Multiplatformプロジェクトを依存関係として追加します。
>
> この回避策で問題が解決しない場合は、[KTOR-8464](https://youtrack.jetbrains.com/issue/KTOR-8464)にコメントを残してお知らせください。
>
{style="warning"}

## ファットJARのビルドと実行 {id="build"}

Ktorプラグインは、ファットJARを作成および実行するための以下のタスクを提供します。
- `buildFatJar`: プロジェクトとランタイム依存関係を組み合わせたJARをビルドします。このビルドが完了すると、`build/libs`ディレクトリに`***-all.jar`ファイルが表示されます。
- `runFatJar`: プロジェクトのファットJARをビルドして実行します。

> 生成されたJARをProGuardを使用して最小化する方法については、[proguard](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/proguard)サンプルを参照してください。