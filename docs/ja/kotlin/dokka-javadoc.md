[//]: # (title: Javadoc)
<primary-label ref="alpha"/>

> このガイドは、Dokka Gradleプラグイン (DGP) v2モードに適用されます。DGP v1モードはサポートされなくなりました。
> v1からv2モードにアップグレードするには、[移行ガイド](dokka-migration.md)に従ってください。
>
{style="note"}

DokkaのJavadoc出力形式は、Javaの
[Javadoc HTML形式](https://docs.oracle.com/en/java/javase/19/docs/api/index.html)の模倣です。

これはJavadocツールによって生成されたHTMLページを視覚的に模倣しようとしますが、直接的な実装や正確なコピーではありません。

![Screenshot of Javadoc output format](javadoc-format-example.png){width=706}

すべてのKotlinコードとシグネチャは、Javaの視点から見たものとしてレンダリングされます。これは、弊社の
[Kotlin as Java Dokkaプラグイン](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-kotlin-as-java)によって実現されます。このプラグインは、この形式でデフォルトでバンドルされ適用されます。

Javadoc出力形式は[Dokkaプラグイン](dokka-plugins.md)として実装されており、Dokkaチームによってメンテナンスされています。
これはオープンソースであり、
ソースコードは[GitHub](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-javadoc)で確認できます。

## Javadocドキュメントの生成

> Dokkaは、マルチプロジェクトビルドやKotlin Multiplatformプロジェクトに対してJavadoc形式をサポートしていません。
>
{style="tip"}

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

[Dokka用Gradleプラグイン](dokka-gradle.md)には、Javadoc出力形式が同梱されています。
対応するプラグインIDをプロジェクトの`build.gradle.kts`ファイルの`plugins {}`ブロックに適用する必要があります。

```kotlin
plugins {
    id("org.jetbrains.dokka-javadoc") version "%dokkaVersion%"
}
```

プラグインを適用すると、以下のタスクを実行できます。

*   `dokkaGenerate`：[適用されているプラグインに基づいて、利用可能なすべての形式](dokka-gradle.md#configure-documentation-output-format)でドキュメントを生成します。
*   `dokkaGeneratePublicationJavadoc`：Javadoc形式でのみドキュメントを生成します。

`javadoc.jar`ファイルは別途生成できます。詳細については、[`javadoc.jar`のビルド](dokka-gradle.md#build-javadoc-jar)を参照してください。

</tab>
<tab title="Maven" group-key="groovy">

[Dokka用Mavenプラグイン](dokka-maven.md)には、Javadoc出力形式が組み込まれています。以下のゴールを使用してドキュメントを生成できます。

| **ゴール**           | **説明**                                                              |
|--------------------|------------------------------------------------------------------------------|
| `dokka:javadoc`    | Javadoc形式でドキュメントを生成します                                    |
| `dokka:javadocJar` | Javadoc形式のドキュメントを含む`javadoc.jar`ファイルを生成します |

</tab>
<tab title="CLI" group-key="cli">

Javadoc出力形式は[Dokkaプラグイン](dokka-plugins.md#apply-dokka-plugins)であるため、[プラグインのJARファイルをダウンロード](https://repo1.maven.org/maven2/org/jetbrains/dokka/javadoc-plugin/%dokkaVersion%/javadoc-plugin-%dokkaVersion%.jar)する必要があります。

Javadoc出力形式には、追加のJARファイルとして提供する必要がある2つの依存関係があります。

*   [kotlin-as-java plugin](https://repo1.maven.org/maven2/org/jetbrains/dokka/kotlin-as-java-plugin/%dokkaVersion%/kotlin-as-java-plugin-%dokkaVersion%.jar)
*   [korte-jvm](https://repo1.maven.org/maven2/com/soywiz/korlibs/korte/korte-jvm/3.3.0/korte-jvm-3.3.0.jar)

[コマンドラインオプション](dokka-cli.md#run-with-command-line-options)を介して:

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;...;./javadoc-plugin-%dokkaVersion%.jar" \
     ...
```

[JSON設定](dokka-cli.md#run-with-json-configuration)を介して:

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

詳細については、CLIランナーのドキュメントの[その他の出力形式](dokka-cli.md#other-output-formats)を参照してください。

</tab>
</tabs>