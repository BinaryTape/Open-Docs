[//]: # (title: Dokka の使用を開始する)

以下に、Dokka の使用を開始するための簡単な手順を示します。

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

プロジェクトのルートビルドスクリプトに Dokka 用の Gradle プラグインを適用します。

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}
```

[マルチプロジェクト](https://docs.gradle.org/current/userguide/multi_project_builds.html)ビルドをドキュメント化する場合は、サブプロジェクト内にも Gradle プラグインを適用する必要があります。

```kotlin
subprojects {
    apply(plugin = "org.jetbrains.dokka")
}
```

ドキュメントを生成するには、次の Gradle タスクを実行します。

*   `dokkaHtml` (シングルプロジェクトビルドの場合)
*   `dokkaHtmlMultiModule` (マルチプロジェクトビルドの場合)

デフォルトでは、出力ディレクトリは `/build/dokka/html` および `/build/dokka/htmlMultiModule` に設定されています。

Gradle と Dokka の使用について詳しく知るには、[Gradle](dokka-gradle.md) を参照してください。

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

プロジェクトのルートビルドスクリプトに Dokka 用の Gradle プラグインを適用します。

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}
```

[マルチプロジェクト](https://docs.gradle.org/current/userguide/multi_project_builds.html)ビルドをドキュメント化する場合は、サブプロジェクト内にも Gradle プラグインを適用する必要があります。

```groovy
subprojects {
    apply plugin: 'org.jetbrains.dokka'
}
```

ドキュメントを生成するには、次の Gradle タスクを実行します。

*   `dokkaHtml` (シングルプロジェクトビルドの場合)
*   `dokkaHtmlMultiModule` (マルチプロジェクトビルドの場合)

デフォルトでは、出力ディレクトリは `/build/dokka/html` および `/build/dokka/htmlMultiModule` に設定されています。

Gradle と Dokka の使用について詳しく知るには、[Gradle](dokka-gradle.md) を参照してください。

</tab>
<tab title="Maven" group-key="mvn">

Dokka 用の Maven プラグインを POM ファイルの `plugins` セクションに追加します。

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

デフォルトでは、出力ディレクトリは `target/dokka` に設定されています。

Maven と Dokka の使用について詳しく知るには、[Maven](dokka-maven.md) を参照してください。

</tab>
</tabs>

> Dokka 2.0.0 では、使用開始のためのいくつかの手順とタスクが更新されました。以下が含まれます。
>
> *   [マルチプロジェクトビルドの構成](dokka-migration.md#share-dokka-configuration-across-modules)
> *   [更新されたタスクでのドキュメントの生成](dokka-migration.md#generate-documentation-with-the-updated-task)
> *   [出力ディレクトリの指定](dokka-migration.md#output-directory)
>
> 詳細と変更点の完全なリストについては、[移行ガイド](dokka-migration.md)を参照してください。
>
{style="note"}