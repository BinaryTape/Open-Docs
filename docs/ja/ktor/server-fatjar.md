[//]: # (title: Ktor Gradleプラグインを使用したファットJARの作成)

<tldr>
<var name="example_name" value="deployment-ktor-plugin"/>

    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

<link-summary>Ktor Gradleプラグインを使用して、実行可能なファットJARを作成し実行する方法を学びます。</link-summary>

[Ktor Gradleプラグイン](https://github.com/ktorio/ktor-build-plugins)を使用すると、すべてのコード依存関係を含む実行可能なJAR（ファットJAR）を作成し、実行できます。

## Ktorプラグインの設定 {id="configure-plugin"}

ファットJARをビルドするには、まずKtorプラグインを設定する必要があります。

1.  `build.gradle.kts`ファイルを開き、プラグインを`plugins`ブロックに追加します。
    [object Promise]

2.  [メインアプリケーションクラス](server-dependencies.topic#create-entry-point)が設定されていることを確認してください。
    [object Promise]

3.  オプションとして、`ktor.fatJar`拡張機能を使用して、生成されるファットJARの名前を設定できます。
    [object Promise]

> Ktor GradleプラグインをKotlin Multiplatform Gradleプラグインと同時に適用すると、ファットJAR作成機能は自動的に無効になります。
> 両方を一緒に使用できるようにするには：
> 1. 上記のようにKtor Gradleプラグインを適用したJVM専用プロジェクトを作成します。
> 2. そのJVM専用プロジェクトにKotlin Multiplatformプロジェクトを依存関係として追加します。
> 
> この回避策で問題が解決しない場合は、[KTOR-8464](https://youtrack.jetbrains.com/issue/KTOR-8464)にコメントを残してご連絡ください。
>
{style="warning"}

## ファットJARのビルドと実行 {id="build"}

Ktorプラグインは、ファットJARを作成および実行するための以下のタスクを提供します。
- `buildFatJar`: プロジェクトとランタイム依存関係を結合したJARをビルドします。このビルドが完了すると、`build/libs`ディレクトリに`***-all.jar`ファイルが生成されます。
- `runFatJar`: プロジェクトのファットJARをビルドして実行します。

> ProGuardを使用して生成されたJARを最小化する方法については、[proguard](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/proguard)サンプルを参照してください。