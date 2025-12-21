[//]: # (title: Dokkaを始める)

Dokkaの利用を開始するのに役立つ簡単な手順を以下に示します。

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

> このガイドはDokka Gradleプラグイン (DGP) v2モードに適用されます。DGP v1モードはサポートされなくなりました。
> v1モードからv2モードにアップグレードするには、[マイグレーションガイド](dokka-migration.md)を参照してください。
>
{style="note"}

**Gradle Dokkaプラグインを適用する**

プロジェクトのルートビルドスクリプトにDokka Gradleプラグイン (DGP) を適用します。

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}
```

**マルチプロジェクトビルドをドキュメント化する**

[マルチプロジェクトビルド](https://docs.gradle.org/current/userguide/multi_project_builds.html)をドキュメント化する場合、ドキュメント化したいすべてのサブプロジェクトにプラグインを適用します。Dokkaの設定をサブプロジェクト間で共有するには、次のいずれかのアプローチを使用します。

*   Conventionプラグイン
*   Conventionプラグインを使用しない場合は、各サブプロジェクトで直接設定

マルチプロジェクトビルドでのDokka設定の共有に関する詳細については、[マルチプロジェクト設定](dokka-gradle.md#multi-project-configuration)を参照してください。

**ドキュメントを生成する**

ドキュメントを生成するには、次のGradleタスクを実行します。

```bash
./gradlew :dokkaGenerate
```

このタスクは、シングルプロジェクトビルドとマルチプロジェクトビルドの両方で機能します。

集約プロジェクトから`dokkaGenerate`タスクを実行するには、タスクの前にそのプロジェクトパス (`:`) を付与します。例えば、次のようになります。

```bash
./gradlew :dokkaGenerate

// または

./gradlew :aggregatingProject:dokkaGenerate
```

`./gradlew :dokkaGenerate` または `./gradlew :aggregatingProject:dokkaGenerate` の代わりに `./gradlew dokkaGenerate` を実行することは避けてください。タスクにプロジェクトパス (`:`) が付与されていない場合、Gradleはビルド全体で`dokkaGenerate`タスクをすべて実行しようとし、不要な作業がトリガーされる可能性があります。

[HTML](dokka-html.md)、[Javadoc](dokka-javadoc.md)、またはその両方の[HTMLとJavadoc](dokka-gradle.md#configure-documentation-output-format)で出力を生成するために、異なるタスクを使用できます。

> GradleでDokkaを使用する方法の詳細については、[Gradle](dokka-gradle.md)を参照してください。
{style="tip"}

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

> このガイドはDokka Gradleプラグイン (DGP) v2モードに適用されます。DGP v1モードはサポートされなくなりました。
> v1モードからv2モードにアップグレードするには、[マイグレーションガイド](dokka-migration.md)を参照してください。
>
{style="note"}

**Gradle Dokkaプラグインを適用する**

プロジェクトのルートビルドスクリプトにDokkaのGradleプラグインを適用します。

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}
```

**マルチプロジェクトビルドをドキュメント化する**

[マルチプロジェクトビルド](https://docs.gradle.org/current/userguide/multi_project_builds.html)をドキュメント化する場合、ドキュメント化したいすべてのサブプロジェクトにプラグインを適用する必要があります。Dokkaの設定をサブプロジェクト間で共有するには、次のいずれかのアプローチを使用します。

*   Conventionプラグイン
*   Conventionプラグインを使用しない場合は、各サブプロジェクトで直接設定

マルチプロジェクトビルドでのDokka設定の共有に関する詳細については、[マルチプロジェクト設定](dokka-gradle.md#multi-project-configuration)を参照してください。

**ドキュメントを生成する**

ドキュメントを生成するには、次のGradleタスクを実行します。

```bash
./gradlew :dokkaGenerate
```

このタスクは、シングルプロジェクトビルドとマルチプロジェクトビルドの両方で機能します。

集約プロジェクトから`dokkaGenerate`タスクを実行するには、タスクの前にそのプロジェクトパスを付与します。例えば、次のようになります。

```bash
./gradlew :dokkaGenerate

// または

./gradlew :aggregatingProject:dokkaGenerate
```

`./gradlew :dokkaGenerate` または `./gradlew :aggregatingProject:dokkaGenerate` の代わりに `./gradlew dokkaGenerate` を実行することは避けてください。タスクにプロジェクトパス (`:`) が付与されていない場合、Gradleはビルド全体で`dokkaGenerate`タスクをすべて実行しようとし、不要な作業がトリガーされる可能性があります。

[HTML](dokka-html.md)、[Javadoc](dokka-javadoc.md)、またはその両方の[HTMLとJavadoc](dokka-gradle.md#configure-documentation-output-format)で出力を生成するために、異なるタスクを使用できます。

> GradleでDokkaを使用する方法の詳細については、[Gradle](dokka-gradle.md)を参照してください。
{style="tip"}

</tab>
<tab title="Maven" group-key="mvn">

DokkaのMavenプラグインをPOMファイルの`plugins`セクションに追加します。

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

ドキュメントを生成するには、`dokka:dokka`ゴールを実行します。

デフォルトでは、出力ディレクトリは`target/dokka`に設定されています。

MavenでDokkaを使用する方法の詳細については、[Maven](dokka-maven.md)を参照してください。

</tab>
</tabs>