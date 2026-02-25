[//]: # (title: Javadoc)
<primary-label ref="alpha"/>

> このガイドは Dokka Gradle plugin (DGP) v2 モードに適用されます。DGP v1 モードは現在サポートされていません。
> v1 から v2 モードへのアップグレードについては、[マイグレーションガイド](dokka-migration.md)に従ってください。
>
{style="note"}

Dokka の Javadoc 出力形式は、Java の [Javadoc HTML 形式](https://docs.oracle.com/en/java/javase/19/docs/api/index.html)に似せて作られています。

Javadoc ツールによって生成される HTML ページを視覚的に模倣しようとしますが、直接的な実装や正確なコピーではありません。

![Javadoc 出力形式のスクリーンショット](javadoc-format-example.png){width=706}

すべての Kotlin コードとシグネチャは、Java から見た視点でレンダリングされます。これは [Kotlin as Java Dokka プラグイン](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-kotlin-as-java)によって実現されており、この形式ではデフォルトで同梱および適用されています。

Javadoc 出力形式は [Dokka プラグイン](dokka-plugins.md)として実装されており、Dokka チームによってメンテナンスされています。これはオープンソースであり、ソースコードは [GitHub](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-javadoc) で公開されています。

## Javadoc ドキュメントの生成

> Dokka は、マルチプロジェクトビルドまたは Kotlin マルチプラットフォームプロジェクトにおける Javadoc 形式をサポートしていません。
>
{style="tip"}

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

[Dokka 用の Gradle プラグイン](dokka-gradle.md)には Javadoc 出力形式が含まれています。プロジェクトの `build.gradle.kts` ファイルの `plugins {}` ブロックで、対応するプラグイン ID を適用する必要があります。

```kotlin
plugins {
    id("org.jetbrains.dokka-javadoc") version "%dokkaVersion%"
}
```

プラグインを適用すると、以下のタスクを実行できます。

* `dokkaGenerate`: 適用されたプラグインに基づき、[利用可能なすべての形式](dokka-gradle.md#configure-documentation-output-format)でドキュメントを生成します。
* `dokkaGeneratePublicationJavadoc`: Javadoc 形式でのみドキュメントを生成します。

`javadoc.jar` ファイルは別途生成できます。詳細については、[`javadoc.jar` のビルド](dokka-gradle.md#build-javadoc-jar)を参照してください。

</tab>
<tab title="Maven" group-key="groovy">

[Dokka 用の Maven プラグイン](dokka-maven.md)には、Javadoc 出力形式が組み込まれています。以下のゴールを使用してドキュメントを生成できます。

| **ゴール**           | **説明**                                                              |
|--------------------|------------------------------------------------------------------------------|
| `dokka:javadoc`    | Javadoc 形式でドキュメントを生成します                                    |
| `dokka:javadocJar` | Javadoc 形式のドキュメントを含む `javadoc.jar` ファイルを生成します |

</tab>
<tab title="CLI" group-key="cli">

Javadoc 出力形式は [Dokka プラグイン](dokka-plugins.md#apply-dokka-plugins)であるため、[プラグインの JAR ファイルをダウンロード](https://repo1.maven.org/maven2/org/jetbrains/dokka/javadoc-plugin/%dokkaVersion%/javadoc-plugin-%dokkaVersion%.jar)する必要があります。

Javadoc 出力形式には、追加の JAR ファイルとして提供する必要がある 2 つの依存関係があります。

* [kotlin-as-java プラグイン](https://repo1.maven.org/maven2/org/jetbrains/dokka/kotlin-as-java-plugin/%dokkaVersion%/kotlin-as-java-plugin-%dokkaVersion%.jar)
* [korte-jvm](https://repo1.maven.org/maven2/com/soywiz/korlibs/korte/korte-jvm/3.3.0/korte-jvm-3.3.0.jar)

[コマンドラインオプション](dokka-cli.md#run-with-command-line-options)経由：

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;...;./javadoc-plugin-%dokkaVersion%.jar" \
     ...
```

[JSON 設定](dokka-cli.md#run-with-json-configuration)経由：

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

詳細については、CLI ランナーのドキュメントの[その他の出力形式](dokka-cli.md#other-output-formats)を参照してください。

</tab>
</tabs>