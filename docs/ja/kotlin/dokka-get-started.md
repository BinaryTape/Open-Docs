[//]: # (title: Dokkaを始める)

Dokkaの利用を開始するのに役立つ簡単な手順を以下に示します。

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

> Dokka 2.0.0以降、いくつかの設定オプション、Gradleタスク、およびドキュメント生成の手順が更新されました。これには以下が含まれます。
>
> * [設定オプションの調整](dokka-migration.md#adjust-configuration-options)
> * [マルチモジュールプロジェクトの操作](dokka-migration.md#share-dokka-configuration-across-modules)
> * [更新されたタスクでのドキュメントの生成](dokka-migration.md#generate-documentation-with-the-updated-task)
> * [出力ディレクトリの指定](dokka-migration.md#output-directory)
>
> 詳細および変更点の全リストについては、[マイグレーションガイド](dokka-migration.md)を参照してください。
>
{style="note"}

プロジェクトのルートビルドスクリプトにDokkaのGradleプラグインを適用します。

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}
```

[マルチプロジェクト](https://docs.gradle.org/current/userguide/multi_project_builds.html)ビルドをドキュメント化する場合、サブプロジェクト内にもGradleプラグインを適用する必要があります。

```kotlin
subprojects {
    apply(plugin = "org.jetbrains.dokka")
}
```

ドキュメントを生成するには、以下のGradleタスクを実行します。

* `dokkaHtml` (シングルプロジェクトビルドの場合)
* `dokkaHtmlMultiModule` (マルチプロジェクトビルドの場合)

デフォルトでは、出力ディレクトリは `/build/dokka/html` および `/build/dokka/htmlMultiModule` に設定されています。

GradleでDokkaを使用する方法の詳細については、[Gradle](dokka-gradle.md)を参照してください。

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

プロジェクトのルートビルドスクリプトにDokkaのGradleプラグインを適用します。

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}
```

[マルチプロジェクト](https://docs.gradle.org/current/userguide/multi_project_builds.html)ビルドをドキュメント化する場合、サブプロジェクト内にもGradleプラグインを適用する必要があります。

```groovy
subprojects {
    apply plugin: 'org.jetbrains.dokka'
}
```

ドキュメントを生成するには、以下のGradleタスクを実行します。

* `dokkaHtml` (シングルプロジェクトビルドの場合)
* `dokkaHtmlMultiModule` (マルチプロジェクトビルドの場合)

デフォルトでは、出力ディレクトリは `/build/dokka/html` および `/build/dokka/htmlMultiModule` に設定されています。

GradleでDokkaを使用する方法の詳細については、[Gradle](dokka-gradle.md)を参照してください。

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

ドキュメントを生成するには、`dokka:dokka` ゴールを実行します。

デフォルトでは、出力ディレクトリは `target/dokka` に設定されています。

MavenでDokkaを使用する方法の詳細については、[Maven](dokka-maven.md)を参照してください。

</tab>
</tabs>