[//]: # (title: Markdown)

> Markdown出力フォーマットはまだAlpha段階であるため、使用中にバグや移行に関する問題が発生する可能性があります。
> **自己責任でご使用ください。**
>
{style="warning"}

Dokkaは、[GitHub Flavored](#gfm) および [Jekyll](#jekyll) と互換性のあるMarkdownでドキュメントを生成できます。

これらのフォーマットを使用すると、出力をドキュメントウェブサイトに直接埋め込むことができるため、ドキュメントのホスティングに関してより自由度が高まります。例えば、[OkHttpのAPIリファレンス](https://square.github.io/okhttp/5.x/okhttp/okhttp3/)ページをご覧ください。

Markdown出力フォーマットは、Dokkaチームが保守する[Dokkaプラグイン](dokka-plugins.md)として実装されており、オープンソースです。

## GFM

GFM出力フォーマットは、[GitHub Flavored Markdown](https://github.github.com/gfm/)でドキュメントを生成します。

<tabs group="build-script">
<tab title="Gradle" group-key="kotlin">

[Dokka用Gradleプラグイン](dokka-gradle.md)には、GFM出力フォーマットが含まれています。これを使用すると、以下のタスクを実行できます。

| **タスク**              | **説明**                                                                                                                                                                                                                                                                     |
|-----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `dokkaGfm`            | 単一のプロジェクト用のGFMドキュメントを生成します。                                                                                                                                                                                                                          |
| `dokkaGfmMultiModule` | マルチプロジェクトビルドの親プロジェクト専用に作成された[`MultiModule`](dokka-gradle.md#multi-project-builds)タスクです。サブプロジェクトのドキュメントを生成し、すべての出力を共通の目次とともに一箇所に集約します。                                                               |
| `dokkaGfmCollector`   | マルチプロジェクトビルドの親プロジェクト専用に作成された[`Collector`](dokka-gradle.md#collector-tasks)タスクです。各サブプロジェクトに対して`dokkaGfm`を呼び出し、すべての出力を単一の仮想プロジェクトに統合します。 |

</tab>
<tab title="Maven" group-key="groovy">

GFMフォーマットは[Dokkaプラグイン](dokka-plugins.md#apply-dokka-plugins)として実装されているため、プラグインの依存関係として適用する必要があります。

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    ...
    <configuration>
        <dokkaPlugins>
            <plugin>
                <groupId>org.jetbrains.dokka</groupId>
                <artifactId>gfm-plugin</artifactId>
                <version>%dokkaVersion%</version>
            </plugin>
        </dokkaPlugins>
    </configuration>
</plugin>
```

これを設定した後、`dokka:dokka`ゴールを実行すると、GFMフォーマットでドキュメントが生成されます。

詳細については、Mavenプラグインのドキュメントの[その他の出力形式](dokka-maven.md#other-output-formats)を参照してください。

</tab>
<tab title="CLI" group-key="cli">

GFMフォーマットは[Dokkaプラグイン](dokka-plugins.md#apply-dokka-plugins)として実装されているため、[JARファイルをダウンロード](https://repo1.maven.org/maven2/org/jetbrains/dokka/gfm-plugin/%dokkaVersion%/gfm-plugin-%dokkaVersion%.jar)して`pluginsClasspath`に渡す必要があります。

[コマンドラインオプション](dokka-cli.md#run-with-command-line-options)を使用する場合:

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;...;./gfm-plugin-%dokkaVersion%.jar" \
     ...
```

[JSON設定](dokka-cli.md#run-with-json-configuration)を使用する場合:

```json
{
  ...
  "pluginsClasspath": [
    "./dokka-base-%dokkaVersion%.jar",
    "...",
    "./gfm-plugin-%dokkaVersion%.jar"
  ],
  ...
}
```

詳細については、CLIランナーのドキュメントの[その他の出力形式](dokka-cli.md#other-output-formats)を参照してください。

</tab>
</tabs>

ソースコードは[GitHub](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-gfm)で確認できます。

## Jekyll

Jekyll出力フォーマットは、[Jekyll](https://jekyllrb.com/)と互換性のあるMarkdownでドキュメントを生成します。

<tabs group="build-script">
<tab title="Gradle" group-key="kotlin">

[Dokka用Gradleプラグイン](dokka-gradle.md)には、Jekyll出力フォーマットが含まれています。これを使用すると、以下のタスクを実行できます。

| **タスク**                 | **説明**                                                                                                                                                                                                                                                                     |
|--------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `dokkaJekyll`            | 単一のプロジェクト用のJekyllドキュメントを生成します。                                                                                                                                                                                                                     |
| `dokkaJekyllMultiModule` | マルチプロジェクトビルドの親プロジェクト専用に作成された[`MultiModule`](dokka-gradle.md#multi-project-builds)タスクです。サブプロジェクトのドキュメントを生成し、すべての出力を共通の目次とともに一箇所に集約します。                                                               |
| `dokkaJekyllCollector`   | マルチプロジェクトビルドの親プロジェクト専用に作成された[`Collector`](dokka-gradle.md#collector-tasks)タスクです。各サブプロジェクトに対して`dokkaJekyll`を呼び出し、すべての出力を単一の仮想プロジェクトに統合します。 |

</tab>
<tab title="Maven" group-key="groovy">

Jekyllフォーマットは[Dokkaプラグイン](dokka-plugins.md#apply-dokka-plugins)として実装されているため、プラグインの依存関係として適用する必要があります。

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    ...
    <configuration>
        <dokkaPlugins>
            <plugin>
                <groupId>org.jetbrains.dokka</groupId>
                <artifactId>jekyll-plugin</artifactId>
                <version>%dokkaVersion%</version>
            </plugin>
        </dokkaPlugins>
    </configuration>
</plugin>
```

これを設定した後、`dokka:dokka`ゴールを実行すると、GFMフォーマットでドキュメントが生成されます。

詳細については、Mavenプラグインのドキュメントの[その他の出力形式](dokka-maven.md#other-output-formats)を参照してください。

</tab>
<tab title="CLI" group-key="cli">

Jekyllフォーマットは[Dokkaプラグイン](dokka-plugins.md#apply-dokka-plugins)として実装されているため、[JARファイルをダウンロード](https://repo1.maven.org/maven2/org/jetbrains/dokka/jekyll-plugin/%dokkaVersion%/jekyll-plugin-%dokkaVersion%.jar)する必要があります。このフォーマットは[GFM](#gfm)フォーマットにも基づいているため、依存関係としても提供する必要があります。両方のJARを`pluginsClasspath`に渡す必要があります。

[コマンドラインオプション](dokka-cli.md#run-with-command-line-options)を使用する場合:

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;...;./gfm-plugin-%dokkaVersion%.jar;./jekyll-plugin-%dokkaVersion%.jar" \
     ...
```

[JSON設定](dokka-cli.md#run-with-json-configuration)を使用する場合:

```json
{
  ...
  "pluginsClasspath": [
    "./dokka-base-%dokkaVersion%.jar",
    "...",
    "./gfm-plugin-%dokkaVersion%.jar",
    "./jekyll-plugin-%dokkaVersion%.jar"
  ],
  ...
}
```

詳細については、CLIランナーのドキュメントの[その他の出力形式](dokka-cli.md#other-output-formats)を参照してください。

</tab>
</tabs>

ソースコードは[GitHub](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-jekyll)で確認できます。