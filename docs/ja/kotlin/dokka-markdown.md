[//]: # (title: マークダウン)

> Markdown の出力形式はまだアルファ版であり、使用する際にバグが見つかったり、移行に関する問題が発生したりする可能性があります。
> **自己責任でご利用ください。**
>
{style="warning"}

Dokka は、[GitHub Flavored](#gfm) および [Jekyll](#jekyll) に対応した Markdown でドキュメントを生成できます。

これらの形式は、出力を自身のドキュメントウェブサイトに直接埋め込むことができるため、ドキュメントのホスティングに関してより自由度を提供します。例えば、[OkHttp の API リファレンス](https://square.github.io/okhttp/5.x/okhttp/okhttp3/)ページを参照してください。

Markdown の出力形式は、Dokka チームによってメンテナンスされている[Dokka プラグイン](dokka-plugins.md)として実装されており、オープンソースです。

## GFM

GFM 出力形式は、[GitHub Flavored Markdown](https://github.github.com/gfm/) でドキュメントを生成します。

<tabs group="build-script">
<tab title="Gradle" group-key="kotlin">

[Dokka 用 Gradle プラグイン](dokka-gradle.md)には GFM 出力形式が付属しています。これとともに以下のタスクを使用できます。

| **タスク**              | **説明**                                                                                                                                                                                                                         |
|-----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `dokkaGfm`            | 単一プロジェクトの GFM ドキュメントを生成します。                                                                                                                                                                                       |
| `dokkaGfmMultiModule` | マルチプロジェクトビルドにおける親プロジェクトのみのために作成される[`MultiModule`](dokka-gradle.md#multi-project-builds)タスクです。サブプロジェクトのドキュメントを生成し、共通の目次とともにすべての出力を一箇所に収集します。 |
| `dokkaGfmCollector`   | マルチプロジェクトビルドにおける親プロジェクトのみのために作成される[`Collector`](dokka-gradle.md#collector-tasks)タスクです。各サブプロジェクトに対して`dokkaGfm`を呼び出し、すべての出力を単一の仮想プロジェクトにマージします。 |

</tab>
<tab title="Maven" group-key="groovy">

GFM 形式は[Dokka プラグイン](dokka-plugins.md#apply-dokka-plugins)として実装されているため、プラグインの依存関係として適用する必要があります。

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

これTを設定した後、`dokka:dokka` ゴールを実行すると GFM 形式でドキュメントが生成されます。

詳細については、Maven プラグインの[その他の出力形式](dokka-maven.md#other-output-formats)のドキュメントを参照してください。

</tab>
<tab title="CLI" group-key="cli">

GFM 形式は[Dokka プラグイン](dokka-plugins.md#apply-dokka-plugins)として実装されているため、[JAR ファイルをダウンロード](https://repo1.maven.org/maven2/org/jetbrains/dokka/gfm-plugin/%dokkaVersion%/gfm-plugin-%dokkaVersion%.jar)し、`pluginsClasspath` に渡す必要があります。

[コマンドラインオプション](dokka-cli.md#run-with-command-line-options)を介して:

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;...;./gfm-plugin-%dokkaVersion%.jar" \
     ...
```

[JSON 設定](dokka-cli.md#run-with-json-configuration)を介して:

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

詳細については、CLI ランナーの[その他の出力形式](dokka-cli.md#other-output-formats)のドキュメントを参照してください。

</tab>
</tabs>

ソースコードは[GitHub](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-gfm)上で確認できます。

## Jekyll

Jekyll 出力形式は、[Jekyll](https://jekyllrb.com/) に対応した Markdown でドキュメントを生成します。

<tabs group="build-script">
<tab title="Gradle" group-key="kotlin">

[Dokka 用 Gradle プラグイン](dokka-gradle.md)には Jekyll 出力形式が付属しています。これとともに以下のタスクを使用できます。

| **タスク**                 | **説明**                                                                                                                                                                                                                         |
|--------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `dokkaJekyll`            | 単一プロジェクトの Jekyll ドキュメントを生成します。                                                                                                                                                                                    |
| `dokkaJekyllMultiModule` | マルチプロジェクトビルドにおける親プロジェクトのみのために作成される[`MultiModule`](dokka-gradle.md#multi-project-builds)タスクです。サブプロジェクトのドキュメントを生成し、共通の目次とともにすべての出力を一箇所に収集します。 |
| `dokkaJekyllCollector`   | マルチプロジェクトビルドにおける親プロジェクトのみのために作成される[`Collector`](dokka-gradle.md#collector-tasks)タスクです。各サブプロジェクトに対して`dokkaJekyll`を呼び出し、すべての出力を単一の仮想プロジェクトにマージします。 |

</tab>
<tab title="Maven" group-key="groovy">

Jekyll 形式は[Dokka プラグイン](dokka-plugins.md#apply-dokka-plugins)として実装されているため、プラグインの依存関係として適用する必要があります。

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

これTを設定した後、`dokka:dokka` ゴールを実行すると GFM 形式でドキュメントが生成されます。

詳細については、Maven プラグインの[その他の出力形式](dokka-maven.md#other-output-formats)のドキュメントを参照してください。

</tab>
<tab title="CLI" group-key="cli">

Jekyll 形式は[Dokka プラグイン](dokka-plugins.md#apply-dokka-plugins)として実装されているため、[JAR ファイルをダウンロード](https://repo1.maven.org/maven2/org/jetbrains/dokka/jekyll-plugin/%dokkaVersion%/jekyll-plugin-%dokkaVersion%.jar)する必要があります。この形式も[GFM](#gfm)形式に基づいているため、依存関係として提供する必要があります。両方の JAR を `pluginsClasspath` に渡す必要があります。

[コマンドラインオプション](dokka-cli.md#run-with-command-line-options)を介して:

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;...;./gfm-plugin-%dokkaVersion%.jar;./jekyll-plugin-%dokkaVersion%.jar" \
     ...
```

[JSON 設定](dokka-cli.md#run-with-json-configuration)を介して:

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

詳細については、CLI ランナーの[その他の出力形式](dokka-cli.md#other-output-formats)のドキュメントを参照してください。

</tab>
</tabs>

ソースコードは[GitHub](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-jekyll)上で確認できます。