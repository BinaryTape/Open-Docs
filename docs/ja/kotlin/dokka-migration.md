[//]: # (title: Dokka Gradleプラグインv2への移行)

Dokka Gradleプラグイン（DGP）は、GradleでビルドされたKotlinプロジェクト向けに包括的なAPIドキュメントを生成するためのツールです。

DGPは、KotlinのKDocコメントとJavaのJavadocコメントの両方をスムーズに処理し、情報を抽出し、[HTMLまたはJavadoc](#select-documentation-output-format)形式で構造化されたドキュメントを作成します。

Dokka 2.0.0以降、DGPの新バージョンであるDokka Gradleプラグインv2を試すことができます。Dokka 2.0.0では、Dokka Gradleプラグインをv1またはv2モードのいずれかで使用できます。

DGP v2はDGPに大幅な改善をもたらし、Gradleのベストプラクティスにより密接に準拠しています。

*   Gradleの型を採用し、パフォーマンスが向上します。
*   低レベルのタスクベースのセットアップではなく、直感的なトップレベルDSL設定を使用することで、ビルドスクリプトとその可読性を簡素化します。
*   ドキュメントの集約に対してより宣言的なアプローチを採用し、マルチプロジェクトのドキュメントを管理しやすくします。
*   型安全なプラグイン設定を使用することで、ビルドスクリプトの信頼性と保守性が向上します。
*   Gradleの[設定キャッシュ](https://docs.gradle.org/current/userguide/configuration_cache.html)と[ビルドキャッシュ](https://docs.gradle.org/current/userguide/build_cache.html)に完全に対応し、パフォーマンスが向上し、ビルド作業が簡素化されます。

## 開始する前に

移行を開始する前に、以下の手順を完了してください。

### サポートされているバージョンを確認する

プロジェクトが最小バージョン要件を満たしていることを確認してください。

| **ツール**                                                                        | **バージョン**   |
|-----------------------------------------------------------------------------------|---------------|
| [Gradle](https://docs.gradle.org/current/userguide/upgrading_version_8.html)      | 7.6 以降      |
| [Android Gradle plugin](https://developer.android.com/build/agp-upgrade-assistant) | 7.0 以降      |
| [Kotlin Gradle plugin](https://kotlinlang.org/docs/gradle-configure-project.html) | 1.9 以降      |

### DGP v2を有効にする

> Dokka 2.1.0以降、DGP v2はデフォルトで有効になります。
> Dokka 2.1.0以降を使用している場合、または更新する場合は、この手順をスキップして[プロジェクトを移行する](#migrate-your-project)に直接進むことができます。
>
{style="note"}

プロジェクトの`build.gradle.kts`ファイルの`plugins {}`ブロックで、Dokkaのバージョンを2.0.0に更新します。

```kotlin
plugins {
    kotlin("jvm") version "2.1.10"
    id("org.jetbrains.dokka") version "2.0.0"
}
```

あるいは、[バージョンカタログ](https://docs.gradle.org/current/userguide/platforms.html#sub:version-catalog)を使用してDokka Gradleプラグインv2を有効にできます。

> デフォルトでは、DGP v2はHTML形式でドキュメントを生成します。JavadocまたはHTMLとJavadocの両方の形式を生成するには、適切なプラグインを追加します。プラグインの詳細については、[ドキュメント出力形式の選択](#select-documentation-output-format)を参照してください。
>
{style="tip"}

### 移行ヘルパーを有効にする

プロジェクトの`gradle.properties`ファイルで、以下のGradleプロパティを設定して、ヘルパー付きでDGP v2を有効にします。

```text
org.jetbrains.dokka.experimental.gradle.pluginMode=V2EnabledWithHelpers
```

> プロジェクトに`gradle.properties`ファイルがない場合は、プロジェクトのルートディレクトリに作成してください。
>
{style="tip"}

このプロパティは、移行ヘルパー付きでDGP v2プラグインを有効にします。これらのヘルパーは、ビルドスクリプトがDGP v2で利用できなくなったDGP v1のタスクを参照する際に、コンパイルエラーを防ぎます。

> 移行ヘルパーは移行を積極的に支援するものではありません。新しいAPIに移行する間、ビルドスクリプトが壊れないようにするだけです。
>
{style="note"}

移行が完了したら、[移行ヘルパーを無効にしてください](#set-the-opt-in-flag)。

### プロジェクトをGradleと同期する

DGP v2と移行ヘルパーを有効にした後、DGP v2が適切に適用されていることを確認するため、プロジェクトをGradleと同期します。

*   IntelliJ IDEAを使用している場合は、Gradleツールウィンドウで**Reload All Gradle Projects** ![Reload button](gradle-reload-button.png){width=30}{type="joined"}ボタンをクリックします。
*   Android Studioを使用している場合は、**File** | **Sync Project with Gradle Files**を選択します。

## プロジェクトを移行する

Dokka Gradleプラグインをv2に更新したら、プロジェクトに適用される移行手順に従ってください。

### 設定オプションを調整する

DGP v2は、[Gradle設定オプション](dokka-gradle.md#configuration-options)にいくつかの変更を導入します。`build.gradle.kts`ファイルで、プロジェクトのセットアップに合わせて設定オプションを調整してください。

#### DGP v2におけるトップレベルDSL設定

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

さらに、DGP v2の[ユーティリティ関数](https://github.com/Kotlin/dokka/blob/v2.1.0/dokka-runners/dokka-gradle-plugin/src/main/kotlin/engine/parameters/HasConfigurableVisibilityModifiers.kt#L14-L16)を使用して、ドキュメント化された可視性を追加します。

```kotlin
fun documentedVisibilities(vararg visibilities: VisibilityModifier): Unit =
    documentedVisibilities.set(visibilities.asList()) 
```

#### ソースリンク

生成されたドキュメントからリモートリポジトリ内の対応するソースコードへのナビゲーションを可能にするには、ソースリンクを設定します。この設定には`dokkaSourceSets.main{}`ブロックを使用します。

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

ソースリンクの設定が[変更された](https://docs.gradle.org/current/userguide/upgrading_version_8.html#deprecated_invalid_url_decoding)ため、`URL`ではなく`URI`クラスを使用してリモートURLを指定します。

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

#### 外部ドキュメントリンク

`register()`メソッドを使用して外部ドキュメントリンクを登録し、各リンクを定義します。`externalDocumentationLinks` APIは、Gradle DSLの慣例に合わせてこのメソッドを使用します。

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

[`customAssets`](dokka-html.md#customize-assets)プロパティをリスト（`var List<File>`)ではなく、ファイルのコレクション（[(`FileCollection`)](https://docs.gradle.org/8.10/userguide/lazy_configuration.html#working_with_files_in_lazy_properties)）とともに使用します。

DGP v1での設定:

```kotlin
customAssets = listOf(file("example.png"), file("example2.png"))
```

DGP v2での設定:

```kotlin
customAssets.from("example.png", "example2.png")
```

#### 出力ディレクトリ

`dokka {}`ブロックを使用して、生成されるDokkaドキュメントの出力ディレクトリを指定します。

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

`dokka {}`ブロック内で、シングルモジュールプロジェクトとマルチモジュールプロジェクトの両方について、出力ディレクトリを指定し、追加ファイルを含めます。

DGP v2では、シングルモジュールプロジェクトとマルチモジュールプロジェクトの設定が統合されています。`dokkaHtml`と`dokkaHtmlMultiModule`タスクを別々に設定するのではなく、`dokka {}`ブロック内の`dokkaPublications.html {}`で設定を指定します。

マルチモジュールプロジェクトの場合、ルートプロジェクトの設定で出力ディレクトリを設定し、追加ファイル（例: `README.md`）を含めます。

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

DGP v1では、DokkaプラグインはJSONを使用して手動で設定されていました。このアプローチは、Gradleの最新性チェックのための[タスク入力の登録](https://docs.gradle.org/current/userguide/incremental_build.html)に問題を引き起こしました。

以下は、[Dokka Versioningプラグイン](https://kotl.in/dokka-versioning-plugin)の非推奨となったJSONベースの設定例です。

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

DGP v2では、Dokkaプラグインは型安全なDSLを使用して設定されます。Dokkaプラグインを型安全に設定するには、`pluginsConfiguration{}`ブロックを使用します。

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

DGP v2では、[カスタムプラグインを設定する](https://github.com/Kotlin/dokka/blob/ae3840edb4e4afd7b3e3768a5fddfe8ec0e08f31/examples/gradle-v2/custom-dokka-plugin-example/demo-library/build.gradle.kts)ことで、その機能を拡張できます。カスタムプラグインを使用すると、ドキュメント生成プロセスに追加の処理や変更を加えることができます。

### モジュール間でDokka設定を共有する

DPG v2は、モジュール間で設定を共有するために`subprojects {}`や`allprojects {}`を使用する方法から移行します。将来のGradleバージョンでは、これらのアプローチを使用すると[エラーにつながります](https://docs.gradle.org/current/userguide/isolated_projects.html)。

以下の手順に従って、[既存の規約プラグインを使用する](#multi-module-projects-with-convention-plugins)または[規約プラグインを使用しない](#multi-module-projects-without-convention-plugins)マルチモジュールプロジェクトでDokka設定を適切に共有してください。

Dokka設定を共有した後、複数のモジュールからのドキュメントを単一の出力に集約できます。詳細については、[マルチモジュールプロジェクトでのドキュメント集約の更新](#update-documentation-aggregation-in-multi-module-projects)を参照してください。

> マルチモジュールプロジェクトの例については、[Dokka GitHubリポジトリ](https://github.com/Kotlin/dokka/tree/master/examples/gradle-v2/multimodule-example)を参照してください。
>
{style="tip"}

#### 規約プラグインを使用しないマルチモジュールプロジェクト

プロジェクトが規約プラグインを使用していない場合でも、各モジュールを直接設定することでDokka設定を共有できます。これには、各モジュールの`build.gradle.kts`ファイルで共有設定を手動でセットアップすることが含まれます。このアプローチは集中度が低いですが、規約プラグインのような追加のセットアップの必要がありません。

それ以外の場合、プロジェクトが規約プラグインを使用している場合は、`buildSrc`ディレクトリに規約プラグインを作成し、そのプラグインをモジュール（サブプロジェクト）に適用することで、マルチモジュールプロジェクトでDokka設定を共有することもできます。

##### buildSrcディレクトリをセットアップする

1.  プロジェクトのルートに、2つのファイルを含む`buildSrc`ディレクトリを作成します。

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

##### Dokka規約プラグインをセットアップする

`buildSrc`ディレクトリをセットアップした後:

1.  [規約プラグイン](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:convention_plugins)をホストする`buildSrc/src/main/kotlin/dokka-convention.gradle.kts`ファイルを作成します。
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

##### 規約プラグインをモジュールに適用する

各サブプロジェクトの`build.gradle.kts`ファイルにDokka規約プラグインを追加して、モジュール（サブプロジェクト）全体に適用します。

```kotlin
plugins {
    id("dokka-convention")
}
```

#### 規約プラグインを使用するマルチモジュールプロジェクト

既存の規約プラグインがある場合は、[Gradleのドキュメント](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:convention_plugins)に従って専用のDokka規約プラグインを作成してください。

その後、[Dokka規約プラグインをセットアップする](#set-up-the-dokka-convention-plugin)と[モジュール全体に適用する](#apply-the-convention-plugin-to-your-modules)の手順に従ってください。

### マルチモジュールプロジェクトでのドキュメント集約を更新する

Dokkaは、複数のモジュール（サブプロジェクト）からのドキュメントを単一の出力またはパブリケーションに集約できます。

[説明した](#apply-the-convention-plugin-to-your-modules)ように、ドキュメントを集約する前に、すべてのドキュメント化可能なサブプロジェクトにDokkaプラグインを適用します。

DGP v2での集約は、タスクの代わりに`dependencies {}`ブロックを使用し、任意の`build.gradle.kts`ファイルに追加できます。

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

DGPがモジュールを集約すると、各サブプロジェクトは集約されたドキュメント内に独自のサブディレクトリを持ちます。

DGP v2では、集約メカニズムがGradleの慣例により密接に準拠するように更新されました。DGP v2は、任意の場所でドキュメントを集約する際の競合を防ぐために、サブプロジェクトの完全なディレクトリを保持するようになりました。

DGP v1での集約ディレクトリ:

DGP v1では、集約されたドキュメントは折りたたまれたディレクトリ構造に配置されていました。たとえば、`:turbo-lib`に集約があり、`:turbo-lib:maths`というネストされたサブプロジェクトがあるプロジェクトの場合、生成されたドキュメントは以下に配置されていました:

```text
turbo-lib/build/dokka/html/maths/
```

DGP v2での集約ディレクトリ:

DGP v2は、完全なプロジェクト構造を保持することで、各サブプロジェクトがユニークなディレクトリを持つことを保証します。同じ集約されたドキュメントは、この構造に従うようになりました:

```text
turbo-lib/build/dokka/html/turbo-lib/maths/
```

この変更により、同じ名前のサブプロジェクトが衝突するのを防ぎます。しかし、ディレクトリ構造が変更されたため、外部リンクが古くなり、`404`エラーを引き起こす可能性があります。

#### DGP v1のディレクトリ動作に戻す

プロジェクトがDGP v1で使用されていたディレクトリ構造に依存している場合、モジュールディレクトリを手動で指定することでこの動作を元に戻すことができます。各サブプロジェクトの`build.gradle.kts`ファイルに以下の設定を追加します:

```kotlin
// /turbo-lib/maths/build.gradle.kts

plugins {
    id("org.jetbrains.dokka")
}

dokka {
    // モジュールディレクトリをV1構造に一致させるためにオーバーライドします
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

DGP v2バージョンでは、`dokkaGenerate`タスク名はシングルモジュールプロジェクトとマルチモジュールプロジェクトの両方で機能します。HTML、Javadoc、またはHTMLとJavadocの両方の形式で出力を生成するために、異なるタスクを使用できます。詳細については、[ドキュメント出力形式の選択](#select-documentation-output-format)を参照してください。

### ドキュメント出力形式の選択

> Javadoc出力形式は[アルファ版](https://kotlinlang.org/docs/components-stability.html#stability-levels-explained)です。
> 使用中にバグや移行の問題が発生する可能性があります。Javadocを入力として受け入れるツールとの統合が成功することは保証されていません。自己責任でご使用ください。
>
{style="note"}

DGP v2のデフォルト出力形式はHTMLです。ただし、APIドキュメントをHTML、Javadoc、または両方の形式で同時に生成することもできます。

1.  対応するプラグイン`id`を、プロジェクトの`build.gradle.kts`ファイルの`plugins {}`ブロックに配置します。

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

各形式に対応するプラグイン`id`とGradleタスクのリストは以下のとおりです。

|             | **HTML**                       | **Javadoc**                         | **両方**                          |
|-------------|--------------------------------|-------------------------------------|-----------------------------------|
| プラグイン`id` | `id("org.jetbrains.dokka")`    | `id("org.jetbrains.dokka-javadoc")` | HTMLとJavadocの両方のプラグインを使用 |
| Gradleタスク | `./gradlew :dokkaGeneratePublicationHtml` | `./gradlew :dokkaGeneratePublicationJavadoc`   | `./gradlew :dokkaGenerate`        |

> `dokkaGenerate`タスクは、適用されたプラグインに基づいて利用可能なすべての形式でドキュメントを生成します。HTMLとJavadocの両方のプラグインが適用されている場合、`dokkaGeneratePublicationHtml`タスクを実行してHTMLのみを生成するか、`dokkaGeneratePublicationJavadoc`タスクを実行してJavadocのみを生成するかを選択できます。
>
{style="tip"}

### 非推奨および削除された項目への対応

*   **出力形式のサポート:** Dokka 2.0.0はHTMLとJavadoc出力のみをサポートしています。MarkdownやJekyllのような実験的な形式はサポートされなくなりました。
*   **コレクタータスク:** `DokkaCollectorTask`は削除されました。これからは、各サブプロジェクトのドキュメントを個別に生成し、必要に応じて[ドキュメントを集約](#update-documentation-aggregation-in-multi-module-projects)する必要があります。

## 移行を完了する

プロジェクトの移行が完了したら、以下の手順を実行して完了させ、パフォーマンスを向上させます。

### オプトインフラグを設定する

移行が成功した後、プロジェクトの`gradle.properties`ファイルで、ヘルパーなしで以下のオプトインフラグを設定します。

```text
org.jetbrains.dokka.experimental.gradle.pluginMode=V2Enabled
```

DGP v2で利用できなくなったDGP v1のGradleタスクへの参照を削除した場合、それに関連するコンパイルエラーは表示されないはずです。

### ビルドキャッシュと設定キャッシュを有効にする

DGP v2はGradleのビルドキャッシュと設定キャッシュをサポートし、ビルドパフォーマンスを向上させます。

*   ビルドキャッシュを有効にするには、[Gradleビルドキャッシュのドキュメント](https://docs.gradle.org/current/userguide/build_cache.html#sec:build_cache_enable)の指示に従ってください。
*   設定キャッシュを有効にするには、[Gradle設定キャッシュのドキュメント](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage:enable)の指示に従ってください。

## トラブルシューティング

大規模なプロジェクトでは、Dokkaはドキュメントを生成するためにかなりの量のメモリを消費する可能性があります。これは、特に大量のデータを処理する場合に、Gradleのメモリ制限を超える可能性があります。

Dokkaの生成がメモリ不足になると、ビルドは失敗し、Gradleは`java.lang.OutOfMemoryError: Metaspace`のような例外をスローすることがあります。

一部の制限はGradleに起因しますが、Dokkaのパフォーマンスを改善するための積極的な取り組みが進行中です。

メモリの問題に遭遇した場合は、以下の回避策を試してください。

*   [ヒープスペースを増やす](#increase-heap-space)
*   [DokkaをGradleプロセス内で実行する](#run-dokka-within-the-gradle-process)

### ヒープスペースを増やす

メモリの問題を解決する1つの方法は、DokkaジェネレータープロセスのJavaヒープメモリ量を増やすことです。`build.gradle.kts`ファイルで、以下の設定オプションを調整します。

```kotlin
    dokka {
        // DokkaはGradleによって管理される新しいプロセスを生成します
        dokkaGeneratorIsolation = ProcessIsolation {
            // ヒープサイズを設定します
            maxHeapSize = "4g"
        }
    }
```

この例では、最大ヒープサイズは4 GB (`"4g"`)に設定されています。ビルドに最適な設定を見つけるために、値を調整してテストしてください。

DokkaがGradle自身のメモリ使用量よりも大幅に大きなヒープサイズを必要とすることが判明した場合は、[DokkaのGitHubリポジトリでissueを作成してください](https://kotl.in/dokka-issues)。

> この設定を各サブプロジェクトに適用する必要があります。すべてのサブプロジェクトに適用される規約プラグインでDokkaを設定することをお勧めします。
>
{style="note"}

### DokkaをGradleプロセス内で実行する

GradleビルドとDokka生成の両方が多くのメモリを必要とする場合、それらは別々のプロセスとして実行され、単一のマシンでかなりのメモリを消費する可能性があります。

メモリ使用量を最適化するために、Dokkaを別々のプロセスとしてではなく、同じGradleプロセス内で実行できます。これにより、各プロセスに個別にメモリを割り当てるのではなく、Gradleのメモリを一度に設定できます。

Dokkaを同じGradleプロセス内で実行するには、`build.gradle.kts`ファイルで以下の設定オプションを調整します。

```kotlin
    dokka {
        // Dokkaを現在のGradleプロセスで実行します
        dokkaGeneratorIsolation = ClassLoaderIsolation()
    }
```

[ヒープスペースを増やす](#increase-heap-space)場合と同様に、この設定がプロジェクトでうまく機能することを確認するためにテストしてください。

GradleのJVMメモリの設定に関する詳細については、[Gradleのドキュメント](https://docs.gradle.org/current/userguide/config_gradle.html#sec:configuring_jvm_memory)を参照してください。

> GradleのJavaオプションを変更すると、新しいGradleデーモンが起動し、長時間アクティブなままになることがあります。[他のGradleプロセスを手動で停止する](https://docs.gradle.org/current/userguide/gradle_daemon.html#sec:stopping_an_existing_daemon)ことができます。
>
> さらに、`ClassLoaderIsolation()`設定に関連するGradleの問題が[メモリリークを引き起こす](https://github.com/gradle/gradle/issues/18313)可能性があります。
>
{style="note"}

## 次のステップ

*   [DGP v2プロジェクトのその他の例を探索する](https://github.com/Kotlin/dokka/tree/master/examples/gradle-v2)。
*   [Dokkaの使用を開始する](dokka-get-started.md)。
*   [Dokkaプラグインについて詳しく学ぶ](dokka-plugins.md)。