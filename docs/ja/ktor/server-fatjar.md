[//]: # (title: Ktor Gradleプラグインを使用したfat JARの作成)

<tldr>
<var name="example_name" value="deployment-ktor-plugin"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>Ktor Gradleプラグインを使用して、実行可能なfat JARを作成および実行する方法を学びます。</link-summary>

[Ktor Gradleプラグイン](https://github.com/ktorio/ktor-build-plugins)を使用すると、すべてのコード依存関係を含む実行可能なJAR（fat JAR）を作成して実行できます。

## Ktorプラグインの設定 {id="configure-plugin"}

fat JARをビルドするには、まずKtorプラグインを設定する必要があります。

1. `build.gradle.kts`ファイルを開き、`plugins`ブロックにプラグインを追加します。
   ```kotlin
   plugins {
       id("io.ktor.plugin") version "3.4.3"
   }
   ```

2. [メインアプリケーションクラス](server-dependencies.topic#create-entry-point)が設定されていることを確認してください。
   ```kotlin
   application {
       mainClass.set("com.example.ApplicationKt")
   }
   ```

3. オプションで、`ktor.fatJar`拡張を使用して生成されるfat JARの名前を設定できます。
   ```kotlin
   ktor {
       fatJar {
           archiveFileName.set("fat.jar")
       }
   }
   ```

> Ktor GradleプラグインをKotlin Multiplatform Gradleプラグインと一緒に適用すると、fat JAR作成機能は自動的に無効になります。
> これらを併用できるようにするには：
> 1. 上記のように、Ktor Gradleプラグインを適用したJVM専用プロジェクトを作成します。
> 2. そのJVM専用プロジェクトの依存関係として、Kotlin Multiplatformプロジェクトを追加します。
> 
> この回避策で問題が解決しない場合は、[KTOR-8464](https://youtrack.jetbrains.com/issue/KTOR-8464)にコメントを残してお知らせください。
>
{style="warning"}

## fat JARのビルドと実行 {id="build"}

Ktorプラグインは、fat JARの作成と実行のために以下のタスクを提供します。
- `buildFatJar`: プロジェクトとランタイム依存関係を組み合わせたJARをビルドします。このビルドが完了すると、`build/libs`ディレクトリに`***-all.jar`ファイルが生成されます。
- `runFatJar`: プロジェクトのfat JARをビルドして実行します。

> ProGuardを使用して生成されたJARを最小化する方法については、[proguard](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/proguard)のサンプルを参照してください。