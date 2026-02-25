[//]: # (title: Dokka を使ってみる)

以下に、Dokka を使い始めるための簡単な手順をまとめます。

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

> このガイドは、Dokka Gradle plugin (DGP) v2 モードに適用されます。DGP v1 モードは現在サポートされていません。
> v1 から v2 モードにアップグレードするには、[移行ガイド](dokka-migration.md)に従ってください。
>
{style="note"}

**Gradle Dokka プラグインの適用** 

プロジェクトのルートビルドスクリプトで Dokka Gradle plugin (DGP) を適用します:

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}
```

**マルチプロジェクトビルドのドキュメント生成**

[マルチプロジェクトビルド](https://docs.gradle.org/current/userguide/multi_project_builds.html)をドキュメント化する場合は、ドキュメント化したいすべてのサブプロジェクトにプラグインを適用してください。以下のいずれかの方法を使用して、サブプロジェクト間で Dokka の設定を共有します:

* コンベンションプラグイン（Convention plugin）
* コンベンションプラグインを使用していない場合は、各サブプロジェクトで直接設定

マルチプロジェクトビルドでの Dokka 設定の共有に関する詳細は、[マルチプロジェクトの設定](dokka-gradle.md#multi-project-configuration)を参照してください。

**ドキュメントの生成**

ドキュメントを生成するには、以下の Gradle タスクを実行します:

```bash
./gradlew :dokkaGenerate
```

このタスクは、シングルプロジェクトとマルチプロジェクトの両方のビルドで機能します。

タスクの前にプロジェクトパス（`:`）を付けて、集約プロジェクトから `dokkaGenerate` タスクを実行します。例:

```bash
./gradlew :dokkaGenerate

// または

./gradlew :aggregatingProject:dokkaGenerate
```

`./gradlew :dokkaGenerate` や `./gradlew :aggregatingProject:dokkaGenerate` の代わりに `./gradlew dokkaGenerate` を実行することは避けてください。タスクの前にプロジェクトパス（`:`）がない場合、Gradle はビルド全体ですべての `dokkaGenerate` タスクを実行しようとするため、不要な処理が発生する可能性があります。

[HTML](dokka-html.md)、[Javadoc](dokka-javadoc.md)、または[HTML と Javadoc の両方](dokka-gradle.md#configure-documentation-output-format)の形式で出力を生成するために、異なるタスクを使用できます。

> Gradle での Dokka の使用について詳細は、[Gradle](dokka-gradle.md) を参照してください。
{style="tip"}

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

> このガイドは、Dokka Gradle plugin (DGP) v2 モードに適用されます。DGP v1 モードは現在サポートされていません。
> v1 から v2 モードにアップグレードするには、[移行ガイド](dokka-migration.md)に従ってください。
>
{style="note"}

**Gradle Dokka プラグインの適用**

プロジェクトのルートビルドスクリプトで Dokka Gradle プラグインを適用します:

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}
```

**マルチプロジェクトビルドのドキュメント生成**

[マルチプロジェクトビルド](https://docs.gradle.org/current/userguide/multi_project_builds.html)をドキュメント化する場合は、ドキュメント化したいすべてのサブプロジェクトにプラグインを適用する必要があります。以下のいずれかの方法を使用して、サブプロジェクト間で Dokka の設定を共有します:

* コンベンションプラグイン（Convention plugin）
* コンベンションプラグインを使用していない場合は、各サブプロジェクトで直接設定

マルチプロジェクトビルドでの Dokka 設定の共有に関する詳細は、[マルチプロジェクトの設定](dokka-gradle.md#multi-project-configuration)を参照してください。

**ドキュメントの生成**

ドキュメントを生成するには、以下の Gradle タスクを実行します:

```bash
./gradlew :dokkaGenerate
```

このタスクは、シングルプロジェクトとマルチプロジェクトの両方のビルドで機能します。

タスクの前にプロジェクトパスを付けて、集約プロジェクトから `dokkaGenerate` タスクを実行します。例:

```bash
./gradlew :dokkaGenerate

// または

./gradlew :aggregatingProject:dokkaGenerate
```

`./gradlew :dokkaGenerate` や `./gradlew :aggregatingProject:dokkaGenerate` の代わりに `./gradlew dokkaGenerate` を実行することは避けてください。タスクの前にプロジェクトパス（`:`）がない場合、Gradle はビルド全体ですべての `dokkaGenerate` タスクを実行しようとするため、不要な処理が発生する可能性があります。

[HTML](dokka-html.md)、[Javadoc](dokka-javadoc.md)、または[HTML と Javadoc の両方](dokka-gradle.md#configure-documentation-output-format)の形式で出力を生成するために、異なるタスクを使用できます。

> Gradle での Dokka の使用について詳細は、[Gradle](dokka-gradle.md) を参照してください。
{style="tip"}

</tab>
<tab title="Maven" group-key="mvn">

POM ファイルの `plugins` セクションに Dokka の Maven プラグインを追加します:

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.dokka</groupId>
            <artifactId>dokka-maven-plugin</artifactId>
            <version>%dokkaVersion%</version>
            <executions>
                <execution>
                    <phase>pre-site</phase>
                    <goals>
                        <goal>dokka</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

ドキュメントを生成するには、`dokka:dokka` ゴールを実行します。

デフォルトでは、出力ディレクトリは `target/dokka` に設定されます。

Maven での Dokka の使用について詳細は、[Maven](dokka-maven.md) を参照してください。

</tab>
</tabs>