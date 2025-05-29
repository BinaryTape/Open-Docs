[//]: # (title: Javadoc)

> Javadoc出力フォーマットはまだAlpha版であり、使用時にバグが見つかったり、移行に関する問題が発生したりする可能性があります。
> JavaのJavadoc HTMLを入力として受け入れるツールとの統合が成功することは保証されません。
> **ご自身の責任においてご使用ください。**
>
{style="warning"}

DokkaのJavadoc出力フォーマットは、Javaの
[Javadoc HTML形式](https://docs.oracle.com/en/java/javase/19/docs/api/index.html)の模倣です。

Javadocツールによって生成されるHTMLページを視覚的に模倣しようとしますが、直接的な実装や完全に同じものではありません。

![Screenshot of javadoc output format](javadoc-format-example.png){width=706}

すべてのKotlinコードとシグネチャは、Javaの視点から見たようにレンダリングされます。これは、このフォーマットにバンドルされ、デフォルトで適用される
[Kotlin as Java Dokkaプラグイン](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-kotlin-as-java)によって実現されます。

Javadoc出力フォーマットは[Dokkaプラグイン](dokka-plugins.md)として実装されており、Dokkaチームによってメンテナンスされています。
これはオープンソースであり、ソースコードは[GitHub](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-javadoc)で見つけることができます。

## Javadocドキュメントの生成

> Javadoc形式はマルチプラットフォームプロジェクトをサポートしていません。
>
{style="warning"}

<tabs group="build-script">
<tab title="Gradle" group-key="kotlin">

[Dokka用Gradleプラグイン](dokka-gradle.md)には、Javadoc出力フォーマットが含まれています。以下のタスクを使用できます。

| **Task**                | **Description**                                                                                                                                                                                              |
|-------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `dokkaJavadoc`          | 単一プロジェクトのJavadocドキュメントを生成します。                                                                                                                                                        |
| `dokkaJavadocCollector` | マルチプロジェクトビルドの親プロジェクトにのみ作成される[`Collector`](dokka-gradle.md#collector-tasks)タスクです。すべてのサブプロジェクトに対して`dokkaJavadoc`を呼び出し、すべての出力を1つの仮想プロジェクトにマージします。 |

`javadoc.jar`ファイルは個別に生成できます。詳細については、[Building `javadoc.jar`](dokka-gradle.md#build-javadoc-jar)を参照してください。

</tab>
<tab title="Maven" group-key="groovy">

[Dokka用Mavenプラグイン](dokka-maven.md)には、Javadoc出力フォーマットが組み込まれています。以下のゴールを使用してドキュメントを生成できます。

| **Goal**           | **Description**                               |
|--------------------|-----------------------------------------------|
| `dokka:javadoc`    | Javadoc形式でドキュメントを生成します         |
| `dokka:javadocJar` | Javadoc形式のドキュメントを含む`javadoc.jar`ファイルを生成します |

</tab>
<tab title="CLI" group-key="cli">

Javadoc出力フォーマットは[Dokkaプラグイン](dokka-plugins.md#apply-dokka-plugins)であるため、[プラグインのJARファイルをダウンロード](https://repo1.maven.org/maven2/org/jetbrains/dokka/javadoc-plugin/%dokkaVersion%/javadoc-plugin-%dokkaVersion%.jar)する必要があります。

Javadoc出力フォーマットには、追加のJARファイルとして提供する必要がある2つの依存関係があります。

* [kotlin-as-java plugin](https://repo1.maven.org/maven2/org/jetbrains/dokka/kotlin-as-java-plugin/%dokkaVersion%/kotlin-as-java-plugin-%dokkaVersion%.jar)
* [korte-jvm](https://repo1.maven.org/maven2/com/soywiz/korlibs/korte/korte-jvm/3.3.0/korte-jvm-3.3.0.jar)

[コマンドラインオプション](dokka-cli.md#run-with-command-line-options)を使用する場合:

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;...;./javadoc-plugin-%dokkaVersion%.jar" \
     ...
```

[JSON設定](dokka-cli.md#run-with-json-configuration)を使用する場合:

```json
{
  ...
  "pluginsClasspath": [
    "./dokka-base-%dokkaVersion%.jar",
    "...",
    "./kotlin-as-java-plugin-%dokkaVersion%.jar",
    "./korte-jvm-3.3.0.jar",
    "./javadoc-plugin-%dokkaVersion%.jar"
  ],
  ...
}
```

詳細については、CLIランナーのドキュメントにある[その他の出力フォーマット](dokka-cli.md#other-output-formats)を参照してください。

</tab>
</tabs>