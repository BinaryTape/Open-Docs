[//]: # (title: Ktor Gradleプラグインを使用してfat JARを作成する)

<tldr>
<var name="example_name" value="deployment-ktor-plugin"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>Ktor Gradleプラグインを使用して、実行可能なfat JARを作成および実行する方法を学びます。</link-summary>

[Ktor Gradleプラグイン](https://github.com/ktorio/ktor-build-plugins)を使用すると、すべてのコード依存関係を含む実行可能なJAR（fat JAR）を作成して実行できます。

## Ktorプラグインの設定 {id="configure-plugin"}
fat JARをビルドするには、まずKtorプラグインを設定する必要があります。
1. `build.gradle.kts` ファイルを開き、`plugins` ブロックにプラグインを追加します。
   ```kotlin
   ```
   {src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="4,7-8"}

2. [メインアプリケーションクラス](server-dependencies.topic#create-entry-point)が設定されていることを確認してください。
   ```kotlin
   ```
   {src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="10-12"}

3. オプションで、`ktor.fatJar` 拡張機能を使用して生成されるfat JARの名前を設定できます。
   ```kotlin
   ```
   {src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="28-31,53"}

## fat JARのビルドと実行 {id="build"}

Ktorプラグインは、fat JARの作成と実行のための以下のタスクを提供します。
- `buildFatJar`: プロジェクトとランタイムの依存関係を組み合わせたJARをビルドします。このビルドが完了すると、`build/libs` ディレクトリに`***-all.jar` ファイルが表示されます。
- `runFatJar`: プロジェクトのfat JARをビルドして実行します。

> ProGuardを使用して生成されたJARを最小化する方法については、[proguard](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/proguard) サンプルを参照してください。