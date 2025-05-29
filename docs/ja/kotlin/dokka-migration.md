[//]: # (title: Dokka Gradle plugin v2 への移行)

> Dokka Gradleプラグイン v2 は[実験的 (Experimental)](https://kotlinlang.org/docs/components-stability.html#stability-levels-explained) 機能です。
> これはいつでも変更される可能性があります。[GitHub](https://github.com/Kotlin/dokka/issues) でのフィードバックをお待ちしております。
>
{style="warning"}

Dokka Gradleプラグイン (DGP) は、GradleでビルドされたKotlinプロジェクトの包括的なAPIドキュメントを生成するためのツールです。

DGPはKotlinのKDocコメントとJavaのJavadocコメントの両方をシームレスに処理し、情報を抽出して[HTMLまたはJavadoc](#select-documentation-output-format)形式の構造化されたドキュメントを作成します。

Dokka 2.0.0以降、DGPの新しいバージョンであるDokka Gradleプラグイン v2を試すことができます。Dokka 2.0.0では、Dokka Gradleプラグインをv1またはv2モードのいずれかで利用できます。

DGP v2はDGPに大幅な改善をもたらし、Gradleのベストプラクティスにさらに密接に適合しています。

*   Gradleの型を採用しており、パフォーマンスの向上につながります。
*   低レベルのタスクベースのセットアップの代わりに直感的なトップレベルDSL設定を使用することで、ビルドスクリプトとその可読性が簡素化されます。
*   ドキュメントの集約に対してより宣言的なアプローチを採用しており、マルチプロジェクトのドキュメント管理が容易になります。
*   型安全なプラグイン設定を使用しており、ビルドスクリプトの信頼性と保守性が向上します。
*   Gradleの[コンフィグレーションキャッシュ](https://docs.gradle.org/current/userguide/configuration_cache.html)と[ビルドキャッシュ](https://docs.gradle.org/current/userguide/build_cache.html)を完全にサポートしており、パフォーマンスを向上させ、ビルド作業を簡素化します。

## 開始する前に

移行を開始する前に、以下の手順を完了してください。

### サポートされているバージョンを確認する

プロジェクトが以下の最小バージョン要件を満たしていることを確認してください。

| **ツール**                                                                          | **バージョン**   |
|:----------------------------------------------------------------------------------|:---------------|
| [Gradle](https://docs.gradle.org/current/userguide/upgrading_version_8.html)      | 7.6 or higher  |
| [Android Gradle plugin](https://developer.android.com/build/agp-upgrade-assistant) | 7.0 or higher  |
| [Kotlin Gradle plugin](https://kotlinlang.org/docs/gradle-configure-project.html) | 1.9 or higher  |

### DGP v2を有効にする

プロジェクトの`build.gradle.kts`ファイルの`plugins {}`ブロックで、Dokkaのバージョンを2.0.0に更新します。

```kotlin
plugins {
    kotlin("jvm") version "2.1.10"
    id("org.jetbrains.dokka") version "2.0.0"
}
```

または、[バージョンカタログ](https://docs.gradle.org/current/userguide/platforms.html#sub:version-catalog)を使用してDokka Gradle plugin v2を有効にすることもできます。

> デフォルトでは、DGP v2はHTML形式でドキュメントを生成します。JavadocまたはHTMLとJavadocの両方の形式を生成するには、適切なプラグインを追加します。プラグインの詳細については、[ドキュメント出力形式の選択](#select-documentation-output-format)を参照してください。
>
{style="tip"}

### 移行ヘルパーを有効にする

プロジェクトの`gradle.properties`ファイルで、以下のGradleプロパティを設定して、ヘルパー付きのDGP v2をアクティベートします。

```text
org.jetbrains.dokka.experimental.gradle.pluginMode=V2EnabledWithHelpers
```

> プロジェクトに`gradle.properties`ファイルがない場合は、プロジェクトのルートディレクトリに作成してください。
>
{style="tip"}

このプロパティは、移行ヘルパー付きのDGP v2プラグインをアクティベートします。これらのヘルパーは、ビルドスクリプトがDGP v2で利用できなくなったDGP v1のタスクを参照した場合に発生するコンパイルエラーを防ぎます。

> 移行ヘルパーは、移行を積極的に支援するものではありません。これらは、新しいAPIに移行する間、ビルドスクリプトが破損しないようにするだけです。
>
{style="note"}

移行が完了したら、[移行ヘルパーを無効にします](#set-the-opt-in-flag)。

### プロジェクトをGradleと同期する

DGP v2と移行ヘルパーを有効にした後、Gradleとプロジェクトを同期して、DGP v2が適切に適用されていることを確認します。

*   IntelliJ IDEAを使用している場合は、Gradleツールウィンドウで**すべてのGradleプロジェクトをリロード** ![Reload button](gradle-reload-button.png){width=30}{type="joined"} ボタンをクリックします。
*   Android Studioを使用している場合は、**File** | **Sync Project with Gradle Files** を選択します。

## プロジェクトを移行する

Dokka Gradleプラグインをv2に更新した後、プロジェクトに適用可能な移行手順に従ってください。

### 設定オプションを調整する

DGP v2は[Gradleの設定オプション](dokka-gradle.md#configuration-options)にいくつかの変更を導入しています。`build.gradle.kts`ファイルで、プロジェクトの設定に合わせて設定オプションを調整してください。

#### DGP v2のトップレベルDSL設定

DGP v1の設定構文を、DGP v2のトップレベル`dokka {}` DSL設定に置き換えます。

DGP v1での設定:

```kotlin
tasks.withType<DokkaTask>().configureEach {
    suppressInheritedMembers.set(true)
    failOnWarning.set(true)
    dokkaSourceSets {
        named("main") {
            moduleName.set("Project Name")
            includes.from("README.md")
            sourceLink {
                localDirectory.set(file("src/main/kotlin"))
                remoteUrl.set(URL("https://example.com/src"))
                remoteLineSuffix.set("#L")
            }
        }
    }
}

tasks.dokkaHtml {
    pluginConfiguration<DokkaBase, DokkaBaseConfiguration> {
        customStyleSheets.set(listOf("styles.css"))
        customAssets.set(listOf("logo.png"))
        footerMessage.set("(c) Your Company")
    }
}
```

DGP v2での設定:

`build.gradle.kts`ファイルの構文は、GradleのKotlin DSLが型安全なアクセサーを使用しているため、通常の`.kt`ファイル（カスタムGradleプラグインなどで使用されるものなど）とは異なります。

<tabs group="dokka-configuration">
<tab title="Gradle設定ファイル" group-key="gradle">

```kotlin
// build.gradle.kts

dokka {
    moduleName.set("Project Name")
    dokkaPublications.html {
        suppressInheritedMembers.set(true)
        failOnWarning.set(true)
    }
    dokkaSourceSets.main {
        includes.from("README.md")
        sourceLink {
            localDirectory.set(file("src/main/kotlin"))
            remoteUrl("https://example.com/src")
            remoteLineSuffix.set("#L")
        }
    }
    pluginsConfiguration.html {
        customStyleSheets.from("styles.css")
        customAssets.from("logo.png")
        footerMessage.set("(c) Your Company")
    }
}
```

</tab>
<tab title="Kotlinファイル" group-key="kotlin">

```kotlin
// CustomPlugin.kt

import org.gradle.api.Plugin
import org.gradle.api.Project
import org.jetbrains.dokka.gradle.DokkaExtension
import org.jetbrains.dokka.gradle.engine.plugins.DokkaHtmlPluginParameters

abstract class CustomPlugin : Plugin<Project> {
    override fun apply(project: Project) {
        project.plugins.apply("org.jetbrains.dokka")

        project.extensions.configure(DokkaExtension::class.java) { dokka ->

            dokka.dokkaPublications.named("html") { publication ->
                publication.suppressInheritedMembers.set(true)
                publication.failOnWarning.set(true)
            }

            dokka.dokkaSourceSets.named("main") { dss ->
                dss.includes.from("README.md")
                dss.sourceLink {
                    it.localDirectory.set(project.file("src/main/kotlin"))
                    it.remoteUrl("https://example.com/src")
                    it.remoteLineSuffix.set("#L")
                }
            }

            dokka.pluginsConfiguration.named("html", DokkaHtmlPluginParameters::class.java) { html ->
                html.customStyleSheets.from("styles.css")
                html.customAssets.from("logo.png")
                html.footerMessage.set("(c) Your Company")
            }
        }
    }
}
```

</tab>
</tabs>

#### 可視性設定

`documentedVisibilities`プロパティを`Visibility.PUBLIC`から`VisibilityModifier.Public`に設定します。

DGP v1での設定:

```kotlin
import org.jetbrains.dokka.DokkaConfiguration.Visibility

// ...
documentedVisibilities.set(
    setOf(Visibility.PUBLIC)
)
```

DGP v2での設定:

```kotlin
import org.jetbrains.dokka.gradle.engine.parameters.VisibilityModifier

// ...
documentedVisibilities.set(
    setOf(VisibilityModifier.Public)
)

// OR

documentedVisibilities(VisibilityModifier.Public)
```

さらに、DGP v2の[ユーティリティ関数](https://github.com/Kotlin/dokka/blob/v2.0.0/dokka-runners/dokka-gradle-plugin/src/main/kotlin/engine/parameters/HasConfigurableVisibilityModifiers.kt#L14-L16)を使用して、ドキュメント化された可視性を追加します。

```kotlin
fun documentedVisibilities(vararg visibilities: VisibilityModifier): Unit =
    documentedVisibilities.set(visibilities.asList())
```

#### ソースリンク

生成されたドキュメントからリモートリポジトリ内の対応するソースコードへナビゲートできるように、ソースリンクを設定します。この設定には`dokkaSourceSets.main{}`ブロックを使用します。

DGP v1での設定:

```kotlin
tasks.withType<DokkaTask>().configureEach {
    dokkaSourceSets {
        named("main") {
            sourceLink {
                localDirectory.set(file("src/main/kotlin"))
                remoteUrl.set(URL("https://github.com/your-repo"))
                remoteLineSuffix.set("#L")
            }
        }
    }
}
```

DGP v2での設定:

`build.gradle.kts`ファイルの構文は、GradleのKotlin DSLが型安全なアクセサーを使用しているため、通常の`.kt`ファイル（カスタムGradleプラグインなどで使用されるものなど）とは異なります。

<tabs group="dokka-configuration">
<tab title="Gradle設定ファイル" group-key="gradle">

```kotlin
// build.gradle.kts

dokka {
    dokkaSourceSets.main {
        sourceLink {
            localDirectory.set(file("src/main/kotlin"))
            remoteUrl("https://github.com/your-repo")
            remoteLineSuffix.set("#L")
        }
    }
}
```

</tab>
<tab title="Kotlinファイル" group-key="kotlin">

```kotlin
// CustomPlugin.kt

import org.gradle.api.Plugin
import org.gradle.api.Project
import org.jetbrains.dokka.gradle.DokkaExtension

abstract class CustomPlugin : Plugin<Project> {
    override fun apply(project: Project) {
        project.plugins.apply("org.jetbrains.dokka")
        project.extensions.configure(DokkaExtension::class.java) { dokka ->
            dokka.dokkaSourceSets.named("main") { dss ->
                dss.includes.from("README.md")
                dss.sourceLink {
                    it.localDirectory.set(project.file("src/main/kotlin"))
                    it.remoteUrl("https://example.com/src")
                    it.remoteLineSuffix.set("#L")
                }
            }
        }
    }
}
```

</tab>
</tabs>

ソースリンクの設定が[変更された](https://docs.gradle.org/current/userguide/upgrading_version_8.html#deprecated_invalid_url_decoding)ため、リモートURLを指定するには`URL`クラスの代わりに`URI`クラスを使用してください。

DGP v1での設定:

```kotlin
remoteUrl.set(URL("https://github.com/your-repo"))
```

DGP v2での設定:

```kotlin
remoteUrl.set(URI("https://github.com/your-repo"))

// or

remoteUrl("https://github.com/your-repo")
```

さらに、DGP v2にはURLを設定するための2つの[ユーティリティ関数](https://github.com/Kotlin/dokka/blob/220922378e6c68eb148fda2ec80528a1b81478c9/dokka-runners/dokka-gradle-plugin/src/main/kotlin/engine/parameters/DokkaSourceLinkSpec.kt#L82-L96)があります。

```kotlin
fun remoteUrl(@Language("http-url-reference") value: String): Unit =
    remoteUrl.set(URI(value))

// and

fun remoteUrl(value: Provider<String>): Unit =
    remoteUrl.set(value.map(::URI))
```

#### 外部リンク

`register()`メソッドを使用して外部リンクを登録し、各リンクを定義します。`externalDocumentationLinks` APIは、Gradle DSLの規約に合わせてこのメソッドを使用します。

DGP v1での設定:

```kotlin
tasks.dokkaHtml {
    dokkaSourceSets {
        configureEach {
            externalDocumentationLink {
                url = URL("https://example.com/docs/")
                packageListUrl = File("/path/to/package-list").toURI().toURL()
            }
        }
    }
}
```

DGP v2での設定:

```kotlin
dokka {
    dokkaSourceSets.configureEach {
        externalDocumentationLinks.register("example-docs") {
            url("https://example.com/docs/")
            packageListUrl("https://example.com/docs/package-list")
        }
    }
}
```

#### カスタムアセット

[`customAssets`](dokka-html.md#customize-assets)プロパティをリスト（`var List<File>`）ではなく、ファイルのコレクション（[`FileCollection`](https://docs.gradle.org/8.10/userguide/lazy_configuration.html#working_with_files_in_lazy_properties)）とともに使用します。

DGP v1での設定:

```kotlin
customAssets = listOf(file("example.png"), file("example2.png"))
```

DGP v2での設定:

```kotlin
customAssets.from("example.png", "example2.png")
```

#### 出力ディレクトリ

`dokka {}`ブロックを使用して、生成されたDokkaドキュメントの出力ディレクトリを指定します。

DGP v1での設定:

```kotlin
tasks.dokkaHtml {
    outputDirectory.set(layout.buildDirectory.dir("dokkaDir"))
}
```

DGP v2での設定:

```kotlin
dokka {
    dokkaPublications.html {
        outputDirectory.set(layout.buildDirectory.dir("dokkaDir"))
    }
}
```

#### 追加ファイルの出力ディレクトリ

単一モジュールプロジェクトとマルチモジュールプロジェクトの両方で、`dokka {}`ブロック内に、出力ディレクトリを指定し、追加ファイルを含めます。

DGP v2では、単一モジュールプロジェクトとマルチモジュールプロジェクトの設定が統合されています。`dokkaHtml`タスクと`dokkaHtmlMultiModule`タスクを個別に設定する代わりに、`dokka {}`ブロック内の`dokkaPublications.html {}`で設定を指定します。

マルチモジュールプロジェクトの場合、ルートプロジェクトの設定で出力ディレクトリを設定し、追加ファイル（`README.md`など）を含めます。

DGP v1での設定:

```kotlin
tasks.dokkaHtmlMultiModule {
    outputDirectory.set(rootDir.resolve("docs/api/0.x"))
    includes.from(project.layout.projectDirectory.file("README.md"))
}
```

DGP v2での設定:

`build.gradle.kts`ファイルの構文は、GradleのKotlin DSLが型安全なアクセサーを使用しているため、通常の`.kt`ファイル（カスタムGradleプラグインなどで使用されるものなど）とは異なります。

<tabs group="dokka-configuration">
<tab title="Gradle設定ファイル" group-key="gradle">

```kotlin
// build.gradle.kts

dokka {
    dokkaPublications.html {
        outputDirectory.set(rootDir.resolve("docs/api/0.x"))
        includes.from(project.layout.projectDirectory.file("README.md"))
    }
}
```

</tab>
<tab title="Kotlinファイル" group-key="kotlin">

```kotlin
// CustomPlugin.kt

import org.gradle.api.Plugin
import org.gradle.api.Project
import org.jetbrains.dokka.gradle.DokkaExtension

abstract class CustomPlugin : Plugin<Project> {
    override fun apply(project: Project) {
        project.plugins.apply("org.jetbrains.dokka")
        project.extensions.configure(DokkaExtension::class.java) { dokka ->
            dokka.dokkaPublications.named("html") { html ->
                html.outputDirectory.set(project.rootDir.resolve("docs/api/0.x"))
                html.includes.from(project.layout.projectDirectory.file("README.md"))
            }
        }
    }
}
```

</tab>
</tabs>

### Dokkaプラグインを設定する

組み込みのDokkaプラグインをJSONで設定する方法は非推奨となり、型安全なDSLが推奨されます。この変更により、Gradleのインクリメンタルビルドシステムとの互換性が向上し、タスク入力の追跡が改善されます。

DGP v1での設定:

DGP v1では、DokkaプラグインはJSONを使用して手動で設定されていました。このアプローチは、Gradleの最新チェックのための[タスク入力の登録](https://docs.gradle.org/current/userguide/incremental_build.html)で問題を引き起こしていました。

以下は、非推奨のJSONベースの[Dokka Versioningプラグイン](https://kotl.in/dokka-versioning-plugin)の設定例です。

```kotlin
tasks.dokkaHtmlMultiModule {
    pluginsMapConfiguration.set(
        mapOf(
            "org.jetbrains.dokka.versioning.VersioningPlugin" to """
                { "version": "1.2", "olderVersionsDir": "$projectDir/dokka-docs" }
                """.trimIndent()
        )
    )
}
```

DGP v2での設定:

DGP v2では、Dokkaプラグインは型安全なDSLを使用して設定されます。Dokkaプラグインを型安全な方法で設定するには、`pluginsConfiguration{}`ブロックを使用します。

```kotlin
dokka {
    pluginsConfiguration {
        versioning {
            version.set("1.2")
            olderVersionsDir.set(projectDir.resolve("dokka-docs"))
        }
    }
}
```

DGP v2設定の例については、[Dokkaのバージョン管理プラグイン](https://github.com/Kotlin/dokka/tree/master/examples/gradle-v2/versioning-multimodule-example)を参照してください。

Dokka 2.0.0では、[カスタムプラグインを設定する](https://github.com/Kotlin/dokka/blob/ae3840edb4e4afd7b3e3768a5fddfe8ec0e08f31/examples/gradle-v2/custom-dokka-plugin-example/demo-library/build.gradle.kts)ことで機能を拡張できます。カスタムプラグインは、ドキュメント生成プロセスへの追加処理や変更を可能にします。

### モジュール間でDokka設定を共有する

DGP v2では、モジュール間で設定を共有するために`subprojects {}`や`allprojects {}`を使用するアプローチから移行しています。将来のGradleバージョンでは、これらのアプローチを使用すると[エラーにつながる](https://docs.gradle.org/current/userguide/isolated_projects.html)可能性があります。

既存の[コンベンションプラグインを使用する](#multi-module-projects-with-convention-plugins)か、[コンベンションプラグインを使用しない](#multi-module-projects-without-convention-plugins)マルチモジュールプロジェクトでDokka設定を適切に共有するには、以下の手順に従ってください。

Dokka設定を共有した後、複数のモジュールからのドキュメントを1つの出力に集約できます。詳細については、[マルチモジュールプロジェクトでのドキュメント集約の更新](#update-documentation-aggregation-in-multi-module-projects)を参照してください。

> マルチモジュールプロジェクトの例については、[Dokka GitHubリポジトリ](https://github.com/Kotlin/dokka/tree/master/examples/gradle-v2/multimodule-example)を参照してください。
>
{style="tip"}

#### コンベンションプラグインを使用しないマルチモジュールプロジェクト

プロジェクトがコンベンションプラグインを使用していない場合でも、各モジュールを直接設定することでDokka設定を共有できます。これには、各モジュールの`build.gradle.kts`ファイルで共有設定を手動でセットアップすることが含まれます。このアプローチは集中度が低いものの、コンベンションプラグインのような追加のセットアップは不要です。

そうでない場合、プロジェクトがコンベンションプラグインを使用している場合は、`buildSrc`ディレクトリにコンベンションプラグインを作成し、そのプラグインをモジュール（サブプロジェクト）に適用することで、マルチモジュールプロジェクトでDokka設定を共有することもできます。

##### buildSrcディレクトリをセットアップする

1.  プロジェクトのルートに、`buildSrc`ディレクトリを作成し、以下の2つのファイルを含めます。

    *   `settings.gradle.kts`
    *   `build.gradle.kts`

2.  `buildSrc/settings.gradle.kts`ファイルに、以下のスニペットを追加します。

    ```kotlin
    rootProject.name = "buildSrc"
    ```

3.  `buildSrc/build.gradle.kts`ファイルに、以下のスニペットを追加します。

    ```kotlin
    plugins {
        `kotlin-dsl`
    }

    repositories {
        mavenCentral()
        gradlePluginPortal()
    }

    dependencies {
        implementation("org.jetbrains.dokka:dokka-gradle-plugin:2.0.0")
    }
    ```

##### Dokkaコンベンションプラグインをセットアップする

`buildSrc`ディレクトリをセットアップした後:

1.  [コンベンションプラグイン](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:convention_plugins)をホストする`buildSrc/src/main/kotlin/dokka-convention.gradle.kts`ファイルを作成します。
2.  `dokka-convention.gradle.kts`ファイルに、以下のスニペットを追加します。

    ```kotlin
    plugins {
        id("org.jetbrains.dokka")
    }

    dokka {
        // The shared configuration goes here
    }
    ```

    `dokka {}`ブロック内に、すべてのサブプロジェクトに共通の共有Dokka[設定](#adjust-configuration-options)を追加する必要があります。
    また、Dokkaのバージョンを指定する必要はありません。バージョンは`buildSrc/build.gradle.kts`ファイルですでに設定されています。

##### コンベンションプラグインをモジュールに適用する

Dokkaコンベンションプラグインを各サブプロジェクトの`build.gradle.kts`ファイルに追加することで、モジュール（サブプロジェクト）全体に適用します。

```kotlin
plugins {
    id("dokka-convention")
}
```

#### コンベンションプラグインを使用するマルチモジュールプロジェクト

すでにコンベンションプラグインがある場合は、[Gradleのドキュメント](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:convention_plugins)に従って、専用のDokkaコンベンションプラグインを作成します。

その後、[Dokkaコンベンションプラグインのセットアップ](#set-up-the-dokka-convention-plugin)と[モジュール全体への適用](#apply-the-convention-plugin-to-your-modules)の手順に従ってください。

### マルチモジュールプロジェクトでのドキュメント集約を更新する

Dokkaは、複数のモジュール（サブプロジェクト）からのドキュメントを1つの出力または成果物に集約できます。

[説明した](#apply-the-convention-plugin-to-your-modules)ように、ドキュメントを集約する前に、すべてのドキュメント可能なサブプロジェクトにDokkaプラグインを適用してください。

DGP v2での集約は、タスクではなく`dependencies {}`ブロックを使用し、任意の`build.gradle.kts`ファイルに追加できます。

DGP v1では、集約はルートプロジェクトで暗黙的に作成されていました。DGP v2でこの動作を再現するには、ルートプロジェクトの`build.gradle.kts`ファイルに`dependencies {}`ブロックを追加します。

DGP v1での集約:

```kotlin
    tasks.dokkaHtmlMultiModule {
        // ...
    }
```

DGP v2での集約:

```kotlin
dependencies {
    dokka(project(":some-subproject:"))
    dokka(project(":another-subproject:"))
}
```

### 集約されたドキュメントのディレクトリを変更する

DGPがモジュールを集約する場合、各サブプロジェクトは集約されたドキュメント内に独自のサブディレクトリを持ちます。

DGP v2では、集約メカニズムがGradleの規約により密接に適合するように更新されました。DGP v2は、任意の場所でドキュメントを集約する際の競合を防ぐために、サブプロジェクトのフルディレクトリを保持するようになりました。

DGP v1での集約ディレクトリ:

DGP v1では、集約されたドキュメントは折りたたまれたディレクトリ構造に配置されていました。例えば、`:turbo-lib`に集約があり、`:turbo-lib:maths`というネストされたサブプロジェクトを持つプロジェクトの場合、生成されたドキュメントは以下に配置されていました。

```text
turbo-lib/build/dokka/html/maths/
```

DGP v2での集約ディレクトリ:

DGP v2は、完全なプロジェクト構造を保持することで、各サブプロジェクトが固有のディレクトリを持つことを保証します。同じ集約されたドキュメントは現在、この構造に従います。

```text
turbo-lib/build/dokka/html/turbo-lib/maths/
```

この変更により、同じ名前のサブプロジェクトが衝突するのを防ぎます。ただし、ディレクトリ構造が変更されたため、外部リンクが古くなり、`404`エラーを引き起こす可能性があります。

#### DGP v1のディレクトリ動作に戻す

プロジェクトがDGP v1で使用されていたディレクトリ構造に依存している場合、モジュールディレクトリを手動で指定することでこの動作を元に戻すことができます。各サブプロジェクトの`build.gradle.kts`ファイルに以下の設定を追加します。

```kotlin
// /turbo-lib/maths/build.gradle.kts

plugins {
    id("org.jetbrains.dokka")
}

dokka {
    // Overrides the module directory to match the V1 structure
    modulePath.set("maths")
}
```

### 更新されたタスクでドキュメントを生成する

DGP v2では、APIドキュメントを生成するGradleタスクの名前が変更されました。

DGP v1でのタスク:

```text
./gradlew dokkaHtml

// or

./gradlew dokkaHtmlMultiModule
```

DGP v2でのタスク:

```text
./gradlew :dokkaGenerate
```

`dokkaGenerate`タスクは、`build/dokka/`ディレクトリにAPIドキュメントを生成します。

DGP v2バージョンでは、`dokkaGenerate`タスク名は単一モジュールプロジェクトとマルチモジュールプロジェクトの両方で機能します。HTML、Javadoc、またはHTMLとJavadocの両方の形式で出力を生成するために、異なるタスクを使用できます。詳細については、[ドキュメント出力形式の選択](#select-documentation-output-format)を参照してください。

### ドキュメント出力形式を選択する

> Javadoc出力形式は[アルファ版 (Alpha)](https://kotlinlang.org/docs/components-stability.html#stability-levels-explained)です。
> 使用中にバグや移行の問題が発生する可能性があります。Javadocを入力として受け入れるツールとの統合が成功することは保証されません。自己責任でご使用ください。
>
{style="note"}

DGP v2のデフォルト出力形式はHTMLです。ただし、APIドキュメントをHTML、Javadoc、または両方の形式で同時に生成することもできます。

1.  プロジェクトの`build.gradle.kts`ファイルの`plugins {}`ブロックに、対応するプラグイン`id`を配置します。

    ```kotlin
    plugins {
        // Generates HTML documentation
        id("org.jetbrains.dokka") version "2.0.0"

        // Generates Javadoc documentation
        id("org.jetbrains.dokka-javadoc") version "2.0.0"

        // Keeping both plugin IDs generates both formats
    }
    ```

2.  対応するGradleタスクを実行します。

以下は、各形式に対応するプラグイン`id`とGradleタスクのリストです。

|             | **HTML**                          | **Javadoc**                           | **両方**                              |
|:------------|:----------------------------------|:------------------------------------|:------------------------------------|
| プラグイン`id` | `id("org.jetbrains.dokka")`       | `id("org.jetbrains.dokka-javadoc")` | Use both HTML and Javadoc plugins |
| Gradleタスク   | `./gradlew :dokkaGeneratePublicationHtml` | `./gradlew :dokkaGeneratePublicationJavadoc` | `./gradlew :dokkaGenerate`          |

> `dokkaGenerate`タスクは、適用されているプラグインに基づいて、利用可能なすべての形式でドキュメントを生成します。HTMLプラグインとJavadocプラグインの両方が適用されている場合、`dokkaGeneratePublicationHtml`タスクを実行してHTMLのみを生成するか、`dokkaGeneratePublicationJavadoc`タスクを実行してJavadocのみを生成するかを選択できます。
>
{style="tip"}

### 非推奨と削除に対応する

*   **出力形式のサポート:** Dokka 2.0.0はHTMLとJavadoc出力のみをサポートしています。MarkdownやJekyllのような実験的な形式はサポートされなくなりました。
*   **コレクタータスク:** `DokkaCollectorTask`は削除されました。これからは、各サブプロジェクトのドキュメントを個別に生成し、必要に応じて[ドキュメントを集約する](#update-documentation-aggregation-in-multi-module-projects)必要があります。

## 移行を完了する

プロジェクトの移行が完了したら、これらの手順を実行して最終的な設定とパフォーマンスの向上を行います。

### オプトインフラグを設定する

移行が成功した後、プロジェクトの`gradle.properties`ファイルで、ヘルパーなしの以下のオプトインフラグを設定します。

```text
org.jetbrains.dokka.experimental.gradle.pluginMode=V2Enabled
```

DGP v2で利用できなくなったDGP v1のGradleタスクへの参照を削除した場合、それに関連するコンパイルエラーは発生しないはずです。

### ビルドキャッシュとコンフィグレーションキャッシュを有効にする

DGP v2はGradleのビルドキャッシュとコンフィグレーションキャッシュをサポートするようになり、ビルドパフォーマンスが向上します。

*   ビルドキャッシュを有効にするには、[Gradleビルドキャッシュのドキュメント](https://docs.gradle.org/current/userguide/build_cache.html#sec:build_cache_enable)の指示に従ってください。
*   コンフィグレーションキャッシュを有効にするには、[Gradleコンフィグレーションキャッシュのドキュメント](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage:enable )の指示に従ってください。

## トラブルシューティング

大規模なプロジェクトでは、Dokkaはドキュメントを生成するためにかなりの量のメモリを消費する可能性があります。これは、特に大量のデータを処理する場合に、Gradleのメモリ制限を超える可能性があります。

Dokkaの生成時にメモリ不足になると、ビルドは失敗し、Gradleは`java.lang.OutOfMemoryError: Metaspace`のような例外をスローする可能性があります。

Dokkaのパフォーマンスを向上させるための積極的な取り組みが進行中ですが、いくつかの制限はGradleに起因しています。

メモリの問題が発生した場合は、以下の回避策を試してください。

*   [ヒープスペースを増やす](#increase-heap-space)
*   [Gradleプロセス内でDokkaを実行する](#run-dokka-within-the-gradle-process)

### ヒープスペースを増やす

メモリの問題を解決する1つの方法は、Dokkaジェネレータープロセスに割り当てるJavaヒープメモリの量を増やすことです。`build.gradle.kts`ファイルで、以下の設定オプションを調整します。

```kotlin
    dokka {
        // Dokka generates a new process managed by Gradle
        dokkaGeneratorIsolation = ProcessIsolation {
            // Configures heap size
            maxHeapSize = "4g"
        }
    }
```

この例では、最大ヒープサイズは4GB（`"4g"`）に設定されています。ビルドに最適な設定を見つけるために、値を調整してテストしてください。

例えば、Gradle自身のメモリ使用量よりも大幅に多くのDokkaヒープサイズが必要であることが判明した場合は、[DokkaのGitHubリポジトリにイシューを作成してください](https://kotl.in/dokka-issues)。

> この設定を各サブプロジェクトに適用する必要があります。すべてのサブプロジェクトに適用されるコンベンションプラグインでDokkaを設定することをお勧めします。
>
{style="note"}

### Gradleプロセス内でDokkaを実行する

GradleビルドとDokka生成の両方が多くのメモリを必要とする場合、それらは個別のプロセスとして実行され、単一のマシン上でかなりのメモリを消費する可能性があります。

メモリ使用量を最適化するには、Dokkaを個別のプロセスとしてではなく、同じGradleプロセス内で実行できます。これにより、各プロセスに個別にメモリを割り当てるのではなく、Gradleのメモリを一度設定することができます。

Dokkaを同じGradleプロセス内で実行するには、`build.gradle.kts`ファイルで以下の設定オプションを調整します。

```kotlin
    dokka {
        // Runs Dokka in the current Gradle process
        dokkaGeneratorIsolation = ClassLoaderIsolation()
    }
```

[ヒープスペースを増やす](#increase-heap-space)場合と同様に、この設定がプロジェクトでうまく機能することを確認するためにテストしてください。

GradleのJVMメモリの設定に関する詳細については、[Gradleのドキュメント](https://docs.gradle.org/current/userguide/config_gradle.html#sec:configuring_jvm_memory)を参照してください。

> GradleのJavaオプションを変更すると、新しいGradleデーモンが起動し、長時間稼働し続ける可能性があります。[他のGradleプロセスを手動で停止する](https://docs.gradle.org/current/userguide/gradle_daemon.html#sec:stopping_an_existing_daemon)ことができます。
>
> さらに、`ClassLoaderIsolation()`設定に関するGradleのイシューが[メモリリークを引き起こす](https://github.com/gradle/gradle/issues/18313)可能性があります。
>
{style="note"}

## 次のステップ

*   [DGP v2プロジェクトの例をもっと探索する](https://github.com/Kotlin/dokka/tree/master/examples/gradle-v2)。
*   [Dokkaを始める](dokka-get-started.md)。
*   [Dokkaプラグインについて詳しく学ぶ](dokka-plugins.md)。