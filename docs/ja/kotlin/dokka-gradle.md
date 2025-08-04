[//]: # (title: Gradle)

Gradleベースのプロジェクトのドキュメントを生成するには、[Dokka用Gradleプラグイン](https://plugins.gradle.org/plugin/org.jetbrains.dokka)を使用できます。

このプラグインにはプロジェクトの基本的な自動設定が付属しており、ドキュメント生成のための便利な[Gradleタスク](#generate-documentation)があり、出力をカスタマイズするための豊富な[設定オプション](#configuration-options)が提供されています。

当社の[Gradleサンプルプロジェクト](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/examples/gradle)にアクセスすると、Dokkaを試してさまざまなプロジェクトでどのように設定できるかを確認できます。

## Dokkaの適用

Dokka用Gradleプラグインを適用する推奨される方法は、[plugins DSL](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block)を使用することです。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}
```

</tab>
</tabs>

[マルチプロジェクト](#multi-project-builds)ビルドをドキュメント化する場合、サブプロジェクト内でもDokka用Gradleプラグインを適用する必要があります。そのためには、`allprojects {}`または`subprojects {}`のGradle設定を使用できます。

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
subprojects {
    apply(plugin = "org.jetbrains.dokka")
}
```

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
subprojects {
    apply plugin: 'org.jetbrains.dokka'
}
```

</tab>
</tabs>

Dokkaをどこに適用すればよいか不明な場合は、[設定例](#configuration-examples)を参照してください。

> 内部では、Dokkaは[Kotlin Gradleプラグイン](https://kotlinlang.org/docs/gradle-configure-project.html#apply-the-plugin)を使用して、ドキュメントを生成する[ソースセット](https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets)の自動設定を実行します。Kotlin Gradleプラグインを適用するか、[ソースセットを手動で設定](#source-set-configuration)してください。
>
{style="note"}

> Dokkaを[プリコンパイルされたスクリプトプラグイン](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:precompiled_plugins)で使用している場合、適切に動作させるためには[Kotlin Gradleプラグイン](https://kotlinlang.org/docs/gradle-configure-project.html#apply-the-plugin)を依存関係として追加する必要があります。
>
{style="note"}

何らかの理由でplugins DSLを使用できない場合は、プラグインを適用する[従来の（レガシーな）方法](https://docs.gradle.org/current/userguide/plugins.html#sec:old_plugin_application)を使用できます。

## ドキュメントの生成

Dokka用Gradleプラグインには、[HTML](dokka-html.md)、[Markdown](dokka-markdown.md)、[Javadoc](dokka-javadoc.md)の出力フォーマットが組み込まれています。これにより、[シングルプロジェクト](#single-project-builds)および[マルチプロジェクト](#multi-project-builds)ビルドの両方のドキュメントを生成するための多数のタスクが追加されます。

### シングルプロジェクトビルド

シンプルでシングルプロジェクトのアプリケーションやライブラリのドキュメントをビルドするには、以下のタスクを使用します。

| **タスク**    | **説明**                                             |
|-------------|----------------------------------------------------------|
| `dokkaHtml` | [HTML](dokka-html.md)形式でドキュメントを生成します。 |

#### 実験的フォーマット

| **タスク**       | **説明**                                                                                     |
|----------------|--------------------------------------------------------------------------------------------------|
| `dokkaGfm`     | [GitHub Flavored Markdown](dokka-markdown.md#gfm)形式でドキュメントを生成します。      |
| `dokkaJavadoc` | [Javadoc](dokka-javadoc.md)形式でドキュメントを生成します。                            |
| `dokkaJekyll`  | [Jekyll互換Markdown](dokka-markdown.md#jekyll)形式でドキュメントを生成します。 |

デフォルトでは、生成されたドキュメントはプロジェクトの`build/dokka/{format}`ディレクトリにあります。出力場所は、他にも[設定](#configuration-examples)できます。

### マルチプロジェクトビルド

[マルチプロジェクトビルド](https://docs.gradle.org/current/userguide/multi_project_builds.html)のドキュメント化では、ドキュメントを生成したいサブプロジェクト内、およびその親プロジェクトでも[Dokka用Gradleプラグインを適用](#apply-dokka)していることを確認してください。

#### MultiModuleタスク

`MultiModule`タスクは、[`Partial`](#partial-tasks)タスクを介して各サブプロジェクトのドキュメントを個別に生成し、すべての出力を収集して処理し、共通の目次と解決済みのプロジェクト間参照を含む完全なドキュメントを生成します。

Dokkaは、**親**プロジェクト用に以下のタスクを自動的に作成します。

| **タスク**               | **説明**                                                              |
|------------------------|-----------------------------------------------------------------------|
| `dokkaHtmlMultiModule` | [HTML](dokka-html.md)出力形式でマルチモジュールドキュメントを生成します。 |

#### 実験的フォーマット（マルチモジュール）

| **タスク**                 | **説明**                                                                                                        |
|--------------------------|---------------------------------------------------------------------------------------------------------------------|
| `dokkaGfmMultiModule`    | [GitHub Flavored Markdown](dokka-markdown.md#gfm)出力形式でマルチモジュールドキュメントを生成します。      |
| `dokkaJekyllMultiModule` | [Jekyll互換Markdown](dokka-markdown.md#jekyll)出力形式でマルチモジュールドキュメントを生成します。 |

> [Javadoc](dokka-javadoc.md)出力フォーマットには`MultiModule`タスクがありませんが、代わりに[`Collector`](#collector-tasks)タスクを使用できます。
>
{style="note"}

デフォルトでは、すぐに使用できるドキュメントは`{parentProject}/build/dokka/{format}MultiModule`ディレクトリの下にあります。

#### MultiModuleの成果物

次の構造を持つプロジェクトが与えられた場合：

```text
.
└── parentProject/
    ├── childProjectA/
    │   └── demo/
    │       └── ChildProjectAClass
    └── childProjectB/
        └── demo/
            └── ChildProjectBClass
```

`dokkaHtmlMultiModule`を実行すると、これらのページが生成されます。

![Screenshot for output of dokkaHtmlMultiModule task](dokkaHtmlMultiModule-example.png){width=600}

詳細については、[マルチモジュールプロジェクトの例](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/examples/gradle/dokka-multimodule-example)を参照してください。

#### Collectorタスク

`MultiModule`タスクと同様に、各親プロジェクトに対して`Collector`タスク（`dokkaHtmlCollector`、`dokkaGfmCollector`、`dokkaJavadocCollector`、`dokkaJekyllCollector`）が作成されます。

`Collector`タスクは、各サブプロジェクトの対応する[シングルプロジェクトタスク](#single-project-builds)（例：`dokkaHtml`）を実行し、すべての出力を単一の仮想プロジェクトに結合します。

結果として得られるドキュメントは、すべてのサブプロジェクトからの宣言を含む単一プロジェクトビルドであるかのように見えます。

> マルチプロジェクトビルドのJavadocドキュメントを作成する必要がある場合は、`dokkaJavadocCollector`タスクを使用してください。
>
{style="tip"}

#### Collectorの成果物

次の構造を持つプロジェクトが与えられた場合：

```text
.
└── parentProject/
    ├── childProjectA/
    │   └── demo/
    │       └── ChildProjectAClass
    └── childProjectB/
        └── demo/
            └── ChildProjectBClass
```

`dokkaHtmlCollector`を実行すると、これらのページが生成されます。

![Screenshot for output of dokkaHtmlCollector task](dokkaHtmlCollector-example.png){width=706}

詳細については、[マルチモジュールプロジェクトの例](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/examples/gradle/dokka-multimodule-example)を参照してください。

#### Partialタスク

各サブプロジェクトに対して、`Partial`タスク（`dokkaHtmlPartial`、`dokkaGfmPartial`、`dokkaJekyllPartial`）が作成されます。

これらのタスクは単独で実行されることを意図しておらず、親の[MultiModule](#multimodule-tasks)タスクによって呼び出されます。

ただし、サブプロジェクトのDokkaをカスタマイズするために`Partial`タスクを[設定](#subproject-configuration)できます。

> `Partial`タスクによって生成された出力には、未解決のHTMLテンプレートと参照が含まれているため、親の[`MultiModule`](#multimodule-tasks)タスクによる後処理なしでは単独で使用できません。
>
{style="warning"}

> 単一のサブプロジェクトのみのドキュメントを生成したい場合は、[シングルプロジェクトタスク](#single-project-builds)を使用してください（例：`:subprojectName:dokkaHtml`）。
>
{style="note"}

## javadoc.jarのビルド

ライブラリをリポジトリに公開したい場合、ライブラリのAPIリファレンスドキュメントを含む`javadoc.jar`ファイルを提供する必要がある場合があります。

例えば、[Maven Central](https://central.sonatype.org/)に公開する場合、プロジェクトと一緒に`javadoc.jar`を供給する[必要があります](https://central.sonatype.org/publish/requirements/)。ただし、すべてのリポジトリにこのルールがあるわけではありません。

Dokka用Gradleプラグインは、このための標準的な方法を提供していませんが、カスタムGradleタスクで実現できます。HTML形式でドキュメントを生成するためのタスクと、[Javadoc](dokka-javadoc.md)形式でドキュメントを生成するためのタスクの2つです。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.register<Jar>("dokkaHtmlJar") {
    dependsOn(tasks.dokkaHtml)
    from(tasks.dokkaHtml.flatMap { it.outputDirectory })
    archiveClassifier.set("html-docs")
}

tasks.register<Jar>("dokkaJavadocJar") {
    dependsOn(tasks.dokkaJavadoc)
    from(tasks.dokkaJavadoc.flatMap { it.outputDirectory })
    archiveClassifier.set("javadoc")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.register('dokkaHtmlJar', Jar.class) {
    dependsOn(dokkaHtml)
    from(dokkaHtml)
    archiveClassifier.set("html-docs")
}

tasks.register('dokkaJavadocJar', Jar.class) {
    dependsOn(dokkaJavadoc)
    from(dokkaJavadoc)
    archiveClassifier.set("javadoc")
}
```

</tab>
</tabs>

> ライブラリをMaven Centralに公開する場合、[javadoc.io](https://javadoc.io/)のようなサービスを利用して、無料でセットアップなしでライブラリのAPIドキュメントをホストできます。このサービスは`javadoc.jar`から直接ドキュメントページを取得します。これは、[この例](https://javadoc.io/doc/com.trib3/server/latest/index.html)で示されているように、HTML形式とうまく連携します。
>
{style="tip"}

## 設定例

お持ちのプロジェクトの種類によって、Dokkaの適用方法や設定方法はわずかに異なります。ただし、[設定オプション](#configuration-options)自体は、プロジェクトの種類に関係なく同じです。

プロジェクトのルートに単一の`build.gradle.kts`または`build.gradle`ファイルがあるシンプルでフラットなプロジェクトについては、[シングルプロジェクト設定](#single-project-configuration)を参照してください。

サブプロジェクトと複数のネストされた`build.gradle.kts`または`build.gradle`ファイルを持つより複雑なビルドについては、[マルチプロジェクト設定](#multi-project-configuration)を参照してください。

### シングルプロジェクト設定

シングルプロジェクトビルドは通常、プロジェクトのルートに1つの`build.gradle.kts`または`build.gradle`ファイルしかなく、典型的に以下の構造を持っています。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

シングルプラットフォーム:

```text
.
├── build.gradle.kts
└── src/
    └── main/
        └── kotlin/
            └── HelloWorld.kt
```

マルチプラットフォーム:

```text
.
├── build.gradle.kts
└── src/
    ├── commonMain/
    │   └── kotlin/
    │       └── Common.kt
    ├── jvmMain/
    │   └── kotlin/
    │       └── JvmUtils.kt
    └── nativeMain/
        └── kotlin/
            └── NativeUtils.kt
```

</tab>
<tab title="Groovy" group-key="groovy">

シングルプラットフォーム:

```text
.
├── build.gradle
└── src/
    └── main/
        └── kotlin/
            └── HelloWorld.kt
```

マルチプラットフォーム:

```text
.
├── build.gradle
└── src/
    ├── commonMain/
    │   └── kotlin/
    │       └── Common.kt
    ├── jvmMain/
    │   └── kotlin/
    │       └── JvmUtils.kt
    └── nativeMain/
        └── kotlin/
            └── NativeUtils.kt
```

</tab>
</tabs>

このようなプロジェクトでは、ルートの`build.gradle.kts`または`build.gradle`ファイルでDokkaとその設定を適用する必要があります。

タスクと出力フォーマットは個別に設定できます。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

`./build.gradle.kts`内:

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}

tasks.dokkaHtml {
    outputDirectory.set(layout.buildDirectory.dir("documentation/html"))
}

tasks.dokkaGfm {
    outputDirectory.set(layout.buildDirectory.dir("documentation/markdown"))
}
```

</tab>
<tab title="Groovy" group-key="groovy">

`./build.gradle`内:

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}

dokkaHtml {
    outputDirectory.set(file("build/documentation/html"))
}

dokkaGfm {
    outputDirectory.set(file("build/documentation/markdown"))
}
```

</tab>
</tabs>

または、すべてのタスクと出力フォーマットを同時に設定することもできます。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

`./build.gradle.kts`内:

```kotlin
import org.jetbrains.dokka.gradle.DokkaTask
import org.jetbrains.dokka.gradle.DokkaTaskPartial
import org.jetbrains.dokka.DokkaConfiguration.Visibility

plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}

// Configure all single-project Dokka tasks at the same time,
// such as dokkaHtml, dokkaJavadoc and dokkaGfm.
// dokkaHtml、dokkaJavadoc、dokkaGfmなど、
// すべてのシングルプロジェクトDokkaタスクを同時に設定します。
tasks.withType<DokkaTask>().configureEach {
    dokkaSourceSets.configureEach {
        documentedVisibilities.set(
            setOf(
                Visibility.PUBLIC,
                Visibility.PROTECTED,
            )
        )

        perPackageOption {
            matchingRegex.set(".*internal.*")
            suppress.set(true)
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

`./build.gradle`内:

```groovy
import org.jetbrains.dokka.gradle.DokkaTask
import org.jetbrains.dokka.gradle.DokkaTaskPartial
import org.jetbrains.dokka.DokkaConfiguration.Visibility

plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}

// Configure all single-project Dokka tasks at the same time,
// such as dokkaHtml, dokkaJavadoc and dokkaGfm.
// dokkaHtml、dokkaJavadoc、dokkaGfmなど、
// すべてのシングルプロジェクトDokkaタスクを同時に設定します。
tasks.withType(DokkaTask.class) {
    dokkaSourceSets.configureEach {
        documentedVisibilities.set([
                Visibility.PUBLIC,
                Visibility.PROTECTED
        ])

        perPackageOption {
            matchingRegex.set(".*internal.*")
            suppress.set(true)
        }
    }
}
```

</tab>
</tabs>

### マルチプロジェクト設定

Gradleの[マルチプロジェクトビルド](https://docs.gradle.org/current/userguide/multi_project_builds.html)は、構造と設定がより複雑です。通常、複数のネストされた`build.gradle.kts`または`build.gradle`ファイルを持ち、典型的に以下の構造を持っています。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```text
.
├── build.gradle.kts
├── settings.gradle.kts
├── subproject-A/
│   ├── build.gradle.kts
│   └── src/
│       └── main/
│           └── kotlin/
│               └── HelloFromA.kt
└── subproject-B/
    ├── build.gradle.kts
    └── src/
        └── main/
            └── kotlin/
                └── HelloFromB.kt
```

</tab>
<tab title="Groovy" group-key="groovy">

```text
.
├── build.gradle
├── settings.gradle
├── subproject-A/
│   ├── build.gradle
│   └── src/
│       └── main/
│           └── kotlin/
│               └── HelloFromA.kt
└── subproject-B/
    ├── build.gradle
    └── src/
        └── main/
            └── kotlin/
                └── HelloFromB.kt
```

</tab>
</tabs>

この場合、Dokkaの適用と設定には複数の方法があります。

#### サブプロジェクト設定

マルチプロジェクトビルドでサブプロジェクトを設定するには、[`Partial`](#partial-tasks)タスクを設定する必要があります。

ルートの`build.gradle.kts`または`build.gradle`ファイルで、Gradleの`allprojects {}`または`subprojects {}`設定ブロックを使用して、すべてのサブプロジェクトを同時に設定できます。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

ルートの`./build.gradle.kts`内:

```kotlin
import org.jetbrains.dokka.gradle.DokkaTaskPartial

plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}

subprojects {
    apply(plugin = "org.jetbrains.dokka")

    // configure only the HTML task
    // HTMLタスクのみを設定
    tasks.dokkaHtmlPartial {
        outputDirectory.set(layout.buildDirectory.dir("docs/partial"))
    }

    // configure all format tasks at once
    // すべてのフォーマットタスクを一度に設定
    tasks.withType<DokkaTaskPartial>().configureEach {
        dokkaSourceSets.configureEach {
            includes.from("README.md")
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

ルートの`./build.gradle`内:

```groovy
import org.jetbrains.dokka.gradle.DokkaTaskPartial

plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}

subprojects {
    apply plugin: 'org.jetbrains.dokka'

    // configure only the HTML task
    // HTMLタスクのみを設定
    dokkaHtmlPartial {
        outputDirectory.set(file("build/docs/partial"))
    }

    // configure all format tasks at once
    // すべてのフォーマットタスクを一度に設定
    tasks.withType(DokkaTaskPartial.class) {
        dokkaSourceSets.configureEach {
            includes.from("README.md")
        }
    }
}
```

</tab>
</tabs>

または、サブプロジェクト内で個別にDokkaを適用および設定することもできます。

例えば、`subproject-A`サブプロジェクトのみに特定の設定を適用するには、`./subproject-A/build.gradle.kts`内に以下のコードを適用する必要があります。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

`./subproject-A/build.gradle.kts`内:

```kotlin
apply(plugin = "org.jetbrains.dokka")

// configuration for subproject-A only.
// subproject-Aのみの設定。
tasks.dokkaHtmlPartial {
    outputDirectory.set(layout.buildDirectory.dir("docs/partial"))
}
```

</tab>
<tab title="Groovy" group-key="groovy">

`./subproject-A/build.gradle`内:

```groovy
apply plugin: 'org.jetbrains.dokka'

// configuration for subproject-A only.
// subproject-Aのみの設定。
dokkaHtmlPartial {
    outputDirectory.set(file("build/docs/partial"))
}
```

</tab>
</tabs>

#### 親プロジェクト設定

すべてのドキュメントにわたって普遍的であり、サブプロジェクトに属さないものを設定したい場合、つまり親プロジェクトのプロパティである場合は、[`MultiModule`](#multimodule-tasks)タスクを設定する必要があります。

例えば、HTMLドキュメントのヘッダーで使用されるプロジェクトの名前を変更したい場合は、ルートの`build.gradle.kts`または`build.gradle`ファイル内に以下を適用する必要があります。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

ルートの`./build.gradle.kts`ファイル内:

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}

tasks.dokkaHtmlMultiModule {
    moduleName.set("WHOLE PROJECT NAME USED IN THE HEADER")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

ルートの`./build.gradle`ファイル内:

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}

dokkaHtmlMultiModule {
    moduleName.set("WHOLE PROJECT NAME USED IN THE HEADER")
}
```

</tab>
</tabs>

## 設定オプション

Dokkaには、あなたと読者の体験をカスタマイズするための多くの設定オプションがあります。

以下に、各設定セクションの例と詳細な説明を示します。ページの下部には、[すべての設定オプション](#complete-configuration)が適用された例も記載されています。

設定ブロックをどこに、どのように適用するかについては、[設定例](#configuration-examples)を参照してください。

### 一般的な設定

ソースセットやパッケージに関係なく、任意のDokkaタスクの一般的な設定例を以下に示します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.gradle.DokkaTask

// Note: To configure multi-project builds, you need
//       to configure Partial tasks of the subprojects.
//       See "Configuration example" section of documentation.
// 注: マルチプロジェクトビルドを設定するには、
//     サブプロジェクトのPartialタスクを設定する必要があります。
//     ドキュメントの「設定例」セクションを参照してください。
tasks.withType<DokkaTask>().configureEach {
    moduleName.set(project.name)
    moduleVersion.set(project.version.toString())
    outputDirectory.set(layout.buildDirectory.dir("dokka/$name"))
    failOnWarning.set(false)
    suppressObviousFunctions.set(true)
    suppressInheritedMembers.set(false)
    offlineMode.set(false)

    // ..
    // source set configuration section
    // ソースセット設定セクション
    // ..
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.dokka.gradle.DokkaTask

// Note: To configure multi-project builds, you need
//       to configure Partial tasks of the subprojects.
//       See "Configuration example" section of documentation.
// 注: マルチプロジェクトビルドを設定するには、
//     サブプロジェクトのPartialタスクを設定する必要があります。
//     ドキュメントの「設定例」セクションを参照してください。
tasks.withType(DokkaTask.class) {
    moduleName.set(project.name)
    moduleVersion.set(project.version.toString())
    outputDirectory.set(file("build/dokka/$name"))
    failOnWarning.set(false)
    suppressObviousFunctions.set(true)
    suppressInheritedMembers.set(false)
    offlineMode.set(false)

    // ..
    // source set configuration section
    // ソースセット設定セクション
    // ..
}
```

</tab>
</tabs>

<deflist collapsible="true">
    <def title="moduleName">
        <p>モジュールを参照するために使用される表示名です。目次、ナビゲーション、ロギングなどに使用されます。</p>
        <p>シングルプロジェクトビルドまたは<code>MultiModule</code>タスクに設定されている場合、プロジェクト名として使用されます。</p>
        <p>デフォルト: Gradleプロジェクト名</p>
    </def>
    <def title="moduleVersion">
        <p>
            モジュールのバージョンです。シングルプロジェクトビルドまたは<code>MultiModule</code>タスクに設定されている場合、
            プロジェクトバージョンとして使用されます。
        </p>
        <p>デフォルト: Gradleプロジェクトバージョン</p>
    </def>
    <def title="outputDirectory">
        <p>ドキュメントが生成されるディレクトリです。フォーマットに関係なく、タスクごとに設定できます。</p>
        <p>
            デフォルトは<code>{project}/{buildDir}/{format}</code>です。ここで<code>{format}</code>はタスク名から
            "dokka"プレフィックスを削除したものです。<code>dokkaHtmlMultiModule</code>タスクの場合は、
            <code>project/buildDir/htmlMultiModule</code>となります。
        </p>
    </def>
    <def title="failOnWarning">
        <p>
            Dokkaが警告またはエラーを出した場合にドキュメント生成を失敗させるかどうかです。
            プロセスは、すべてのエラーと警告が最初に出力されるまで待機します。
        </p>
        <p>この設定は<code>reportUndocumented</code>と連携してうまく機能します。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="suppressObviousFunctions">
        <p>自明な関数を抑制するかどうかです。</p>
        <p>
            以下の関数は自明と見なされます:</p>
            <list>
                <li>
                    <code>kotlin.Any</code>、<code>Kotlin.Enum</code>、<code>java.lang.Object</code>、または
                    <code>java.lang.Enum</code>から継承されたもの（例：<code>equals</code>、<code>hashCode</code>、<code>toString</code>）。
                </li>
                <li>
                    合成（コンパイラによって生成された）であり、ドキュメントがないもの（例：
                    <code>dataClass.componentN</code>または<code>dataClass.copy</code>）。
                </li>
            </list>
        <p>デフォルト: <code>true</code></p>
    </def>
    <def title="suppressInheritedMembers">
        <p>特定のクラスで明示的にオーバーライドされていない継承されたメンバーを抑制するかどうかです。</p>
        <p>
            注: これは<code>equals</code> / <code>hashCode</code> / <code>toString</code>などの関数を抑制できますが、
            <code>dataClass.componentN</code>や<code>dataClass.copy</code>などの合成関数を抑制することはできません。
            そのためには<code>suppressObviousFunctions</code>を使用してください。
        </p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="offlineMode">
        <p>ネットワーク経由でリモートファイル/リンクを解決するかどうかです。</p>
        <p>
            これには、外部ドキュメントリンクの生成に使用されるパッケージリストが含まれます。
            例えば、標準ライブラリのクラスをクリック可能にするためです。
        </p>
        <p>
            これを<code>true</code>に設定すると、特定のケースでビルド時間が大幅に短縮される可能性がありますが、
            ドキュメントの品質とユーザーエクスペリエンスが低下する可能性もあります。例えば、
            標準ライブラリを含む依存関係からのクラス/メンバーリンクが解決されないなどです。
        </p>
        <p>
            注: フェッチされたファイルをローカルにキャッシュし、
            ローカルパスとしてDokkaに提供することができます。<code>externalDocumentationLinks</code>セクションを参照してください。
        </p>
        <p>デフォルト: <code>false</code></p>
    </def>
</deflist>

### ソースセット設定

Dokkaは[Kotlinソースセット](https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets)のいくつかのオプションを設定できます。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.DokkaConfiguration.Visibility
import org.jetbrains.dokka.gradle.DokkaTask
import org.jetbrains.dokka.Platform
import java.net.URL

// Note: To configure multi-project builds, you need
//       to configure Partial tasks of the subprojects.
//       See "Configuration example" section of documentation.
// 注: マルチプロジェクトビルドを設定するには、
//     サブプロジェクトのPartialタスクを設定する必要があります。
//     ドキュメントの「設定例」セクションを参照してください。
tasks.withType<DokkaTask>().configureEach {
    // ..
    // general configuration section
    // 一般的な設定セクション
    // ..

    dokkaSourceSets {
        // configuration exclusive to the 'linux' source set
        // 'linux'ソースセットに限定された設定
        named("linux") {
            dependsOn("native")
            sourceRoots.from(file("linux/src"))
        }
        configureEach {
            suppress.set(false)
            displayName.set(name)
            documentedVisibilities.set(setOf(Visibility.PUBLIC))
            reportUndocumented.set(false)
            skipEmptyPackages.set(true)
            skipDeprecated.set(false)
            suppressGeneratedFiles.set(true)
            jdkVersion.set(8)
            languageVersion.set("1.7")
            apiVersion.set("1.7")
            noStdlibLink.set(false)
            noJdkLink.set(false)
            noAndroidSdkLink.set(false)
            includes.from(project.files(), "packages.md", "extra.md")
            platform.set(Platform.DEFAULT)
            sourceRoots.from(file("src"))
            classpath.from(project.files(), file("libs/dependency.jar"))
            samples.from(project.files(), "samples/Basic.kt", "samples/Advanced.kt")

            sourceLink {
                // Source link section
                // ソースリンクセクション
            }
            externalDocumentationLink {
                // External documentation link section
                // 外部ドキュメントリンクセクション
            }
            perPackageOption {
                // Package options section
                // パッケージオプションセクション
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.dokka.DokkaConfiguration.Visibility
import org.jetbrains.dokka.gradle.DokkaTask
import org.jetbrains.dokka.Platform
import java.net.URL

// Note: To configure multi-project builds, you need
//       to configure Partial tasks of the subprojects.
//       See "Configuration example" section of documentation.
// 注: マルチプロジェクトビルドを設定するには、
//     サブプロジェクトのPartialタスクを設定する必要があります。
//     ドキュメントの「設定例」セクションを参照してください。
tasks.withType(DokkaTask.class) {
    // ..
    // general configuration section
    // 一般的な設定セクション
    // ..

    dokkaSourceSets {
        // configuration exclusive to the 'linux' source set
        // 'linux'ソースセットに限定された設定
        named("linux") {
            dependsOn("native")
            sourceRoots.from(file("linux/src"))
        }
        configureEach {
            suppress.set(false)
            displayName.set(name)
            documentedVisibilities.set([Visibility.PUBLIC])
            reportUndocumented.set(false)
            skipEmptyPackages.set(true)
            skipDeprecated.set(false)
            suppressGeneratedFiles.set(true)
            jdkVersion.set(8)
            languageVersion.set("1.7")
            apiVersion.set("1.7")
            noStdlibLink.set(false)
            noJdkLink.set(false)
            noAndroidSdkLink.set(false)
            includes.from(project.files(), "packages.md", "extra.md")
            platform.set(Platform.DEFAULT)
            sourceRoots.from(file("src"))
            classpath.from(project.files(), file("libs/dependency.jar"))
            samples.from(project.files(), "samples/Basic.kt", "samples/Advanced.kt")

            sourceLink {
                // Source link section
                // ソースリンクセクション
            }
            externalDocumentationLink {
                // External documentation link section
                // 外部ドキュメントリンクセクション
            }
            perPackageOption {
                // Package options section
                // パッケージオプションセクション
            }
        }
    }
}
```

</tab>
</tabs>

<deflist collapsible="true">
    <def title="suppress">
        <p>ドキュメント生成時にこのソースセットをスキップするかどうかです。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="displayName">
        <p>このソースセットを参照するために使用される表示名です。</p>
        <p>
            名前は、外部（例えば、ドキュメントリーダーに見えるソースセット名）と
            内部（例えば、<code>reportUndocumented</code>のロギングメッセージ）の両方で使用されます。
        </p>
        <p>デフォルトでは、値はKotlin Gradleプラグインによって提供される情報から推測されます。</p>
    </def>
    <def title="documentedVisibilities">
        <p>ドキュメント化されるべき可視性修飾子のセットです。</p>
        <p>
            これは、<code>protected</code>/<code>internal</code>/<code>private</code>宣言をドキュメント化したい場合、
            または<code>public</code>宣言を除外して内部APIのみをドキュメント化したい場合に使用できます。
        </p>
        <p>これはパッケージごとに設定できます。</p>
        <p>デフォルト: <code>DokkaConfiguration.Visibility.PUBLIC</code></p>
    </def>
    <def title="reportUndocumented">
        <p>
            <code>documentedVisibilities</code>やその他のフィルターによってフィルタリングされた後、
            可視でありながらドキュメント化されていない宣言（KDocがない宣言）について警告を発するかどうかです。
        </p>
        <p>この設定は<code>failOnWarning</code>と連携してうまく機能します。</p>
        <p>これはパッケージごとに設定できます。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="skipEmptyPackages">
        <p>
            様々なフィルターが適用された後、可視な宣言を何も含まないパッケージをスキップするかどうかです。
        </p>
        <p>
            例えば、<code>skipDeprecated</code>が<code>true</code>に設定されており、パッケージに非推奨の宣言のみが含まれている場合、
            そのパッケージは空と見なされます。
        </p>
        <p>デフォルト: <code>true</code></p>
    </def>
    <def title="skipDeprecated">
        <p><code>@Deprecated</code>アノテーションが付けられた宣言をドキュメント化するかどうかです。</p>
        <p>これはパッケージごとに設定できます。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="suppressGeneratedFiles">
        <p>生成されたファイルをドキュメント化/分析するかどうかです。</p>
        <p>
            生成されたファイルは<code>{project}/{buildDir}/generated</code>ディレクトリの下に存在すると想定されています。
        </p>
        <p>
            これを<code>true</code>に設定すると、そのディレクトリ内のすべてのファイルが実質的に
            <code>suppressedFiles</code>オプションに追加されるため、手動で設定することも可能です。
        </p>
        <p>デフォルト: <code>true</code></p>
    </def>
    <def title="jdkVersion">
        <p>Java型用の外部ドキュメントリンクを生成する際に使用するJDKバージョンです。</p>
        <p>
            例えば、何らかの公開宣言シグネチャで<code>java.util.UUID</code>を使用しており、
            このオプションが<code>8</code>に設定されている場合、Dokkaはそれに対する
            <a href="https://docs.oracle.com/javase/8/docs/api/java/util/UUID.html">JDK 8 Javadoc</a>への外部ドキュメントリンクを生成します。
        </p>
        <p>デフォルト: JDK 8</p>
    </def>
    <def title="languageVersion">
        <p>
            解析および<a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a>
            環境のセットアップに使用される<a href="https://kotlinlang.org/docs/compatibility-modes.html">Kotlin言語バージョン</a>です。
        </p>
        <p>デフォルトでは、Dokkaの組み込みコンパイラで利用可能な最新の言語バージョンが使用されます。</p>
    </def>
    <def title="apiVersion">
        <p>
            解析および<a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a>
            環境のセットアップに使用される<a href="https://kotlinlang.org/docs/compatibility-modes.html">Kotlin APIバージョン</a>です。
        </p>
        <p>デフォルトでは、<code>languageVersion</code>から推測されます。</p>
    </def>
    <def title="noStdlibLink">
        <p>
            Kotlin標準ライブラリのAPIリファレンスドキュメントに繋がる外部ドキュメントリンクを生成するかどうかです。
        </p>
        <p>注: <code>noStdLibLink</code>が<code>false</code>に設定されている場合、リンクは<b>生成されます</b>。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="noJdkLink">
        <p>JDKのJavadocへの外部ドキュメントリンクを生成するかどうかです。</p>
        <p>JDK Javadocのバージョンは<code>jdkVersion</code>オプションによって決定されます。</p>
        <p>注: <code>noJdkLink</code>が<code>false</code>に設定されている場合、リンクは<b>生成されます</b>。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="noAndroidSdkLink">
        <anchor name="includes"/>
        <p>Android SDK APIリファレンスへの外部ドキュメントリンクを生成するかどうかです。</p>
        <p>これはAndroidプロジェクトでのみ関連性があり、それ以外の場合は無視されます。</p>
        <p>注: <code>noAndroidSdkLink</code>が<code>false</code>に設定されている場合、リンクは<b>生成されます</b>。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="includes">
        <p>
            <a href="dokka-module-and-package-docs.md">モジュールおよびパッケージドキュメント</a>を含むMarkdownファイルのリストです。
        </p>
        <p>指定されたファイルの内容は解析され、モジュールおよびパッケージの説明としてドキュメントに埋め込まれます。</p>
        <p>
            使用例については、<a href="https://github.com/Kotlin/dokka/tree/master/examples/gradle/dokka-gradle-example">Dokka gradleの例</a>を参照してください。
        </p>
    </def>
    <def title="platform">
        <p>
            コード分析および<a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a>環境のセットアップに使用するプラットフォームです。
        </p>
        <p>デフォルト値はKotlin Gradleプラグインによって提供される情報から推測されます。</p>
    </def>
    <def title="sourceRoots">
        <p>
            分析およびドキュメント化されるソースコードのルートです。
            許容される入力はディレクトリおよび個々の<code>.kt</code> / <code>.java</code>ファイルです。
        </p>
        <p>デフォルトでは、ソースルートはKotlin Gradleプラグインによって提供される情報から推測されます。</p>
    </def>
    <def title="classpath">
        <p>分析およびインタラクティブなサンプル用のクラスパスです。</p>
        <p>これは、依存関係から来るいくつかの型が自動的に解決/認識されない場合に便利です。</p>
        <p>このオプションは<code>.jar</code>と<code>.klib</code>ファイルの両方を受け入れます。</p>
        <p>デフォルトでは、クラスパスはKotlin Gradleプラグインによって提供される情報から推測されます。</p>
    </def>
    <def title="samples">
        <p>
            <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a> KDocタグを介して参照されるサンプル関数を含むディレクトリまたはファイルのリストです。
        </p>
    </def>
</deflist>

### ソースリンク設定

`sourceLinks`設定ブロックを使用すると、特定の行番号（行番号は`remoteLineSuffix`を設定することで構成可能）を持つ`remoteUrl`に繋がる`source`リンクを各シグネチャに追加できます。

これにより、読者は各宣言のソースコードを見つけることができます。

例については、`kotlinx.coroutines`の[`count()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/count.html)関数のドキュメントを参照してください。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.gradle.DokkaTask
import java.net.URL

// Note: To configure multi-project builds, you need
//       to configure Partial tasks of the subprojects.
//       See "Configuration example" section of documentation.
// 注: マルチプロジェクトビルドを設定するには、
//     サブプロジェクトのPartialタスクを設定する必要があります。
//     ドキュメントの「設定例」セクションを参照してください。
tasks.withType<DokkaTask>().configureEach {
    // ..
    // general configuration section
    // 一般的な設定セクション
    // ..

    dokkaSourceSets.configureEach {
        // ..
        // source set configuration section
        // ソースセット設定セクション
        // ..

        sourceLink {
            localDirectory.set(projectDir.resolve("src"))
            remoteUrl.set(URL("https://github.com/kotlin/dokka/tree/master/src"))
            remoteLineSuffix.set("#L")
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.dokka.gradle.DokkaTask
import java.net.URL

// Note: To configure multi-project builds, you need
//       to configure Partial tasks of the subprojects.
//       See "Configuration example" section of documentation.
// 注: マルチプロジェクトビルドを設定するには、
//     サブプロジェクトのPartialタスクを設定する必要があります。
//     ドキュメントの「設定例」セクションを参照してください。
tasks.withType(DokkaTask.class) {
    // ..
    // general configuration section
    // 一般的な設定セクション
    // ..

    dokkaSourceSets.configureEach {
        // ..
        // source set configuration section
        // ソースセット設定セクション
        // ..

        sourceLink {
            localDirectory.set(file("src"))
            remoteUrl.set(new URL("https://github.com/kotlin/dokka/tree/master/src"))
            remoteLineSuffix.set("#L")
        }
    }
}
```

</tab>
</tabs>

<deflist collapsible="true">
    <def title="localDirectory">
        <p>
            ローカルのソースディレクトリへのパスです。パスは現在のプロジェクトのルートからの相対パスでなければなりません。
        </p>
    </def>
    <def title="remoteUrl">
        <p>
            GitHub、GitLab、Bitbucketなど、ドキュメントリーダーがアクセスできるソースコードホスティングサービスのURLです。
            このURLは宣言のソースコードリンクを生成するために使用されます。
        </p>
    </def>
    <def title="remoteLineSuffix">
        <p>
            URLにソースコードの行番号を追加するために使用されるサフィックスです。これにより、読者はファイルだけでなく、
            宣言の特定の行番号に移動できるようになります。
        </p>
        <p>
            番号自体は指定されたサフィックスに追加されます。例えば、このオプションが<code>#L</code>に設定され、
            行番号が10の場合、結果のURLサフィックスは<code>#L10</code>となります。
        </p>
        <p>
            一般的なサービスで使用されるサフィックス:</p>
            <list>
                <li>GitHub: <code>#L</code></li>
                <li>GitLab: <code>#L</code></li>
                <li>Bitbucket: <code>#lines-</code></li>
            </list>
        <p>デフォルト: <code>#L</code></p>
    </def>
</deflist>

### パッケージオプション

`perPackageOption`設定ブロックは、`matchingRegex`によってマッチする特定のパッケージに対していくつかのオプションを設定することを可能にします。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.DokkaConfiguration.Visibility
import org.jetbrains.dokka.gradle.DokkaTask

// Note: To configure multi-project builds, you need
//       to configure Partial tasks of the subprojects.
//       See "Configuration example" section of documentation.
// 注: マルチプロジェクトビルドを設定するには、
//     サブプロジェクトのPartialタスクを設定する必要があります。
//     ドキュメントの「設定例」セクションを参照してください。
tasks.withType<DokkaTask>().configureEach {
    // ..
    // general configuration section
    // 一般的な設定セクション
    // ..

    dokkaSourceSets.configureEach {
        // ..
        // source set configuration section
        // ソースセット設定セクション
        // ..

        perPackageOption {
            matchingRegex.set(".*api.*")
            suppress.set(false)
            skipDeprecated.set(false)
            reportUndocumented.set(false)
            documentedVisibilities.set(setOf(Visibility.PUBLIC))
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.dokka.DokkaConfiguration.Visibility
import org.jetbrains.dokka.gradle.DokkaTask

// Note: To configure multi-project builds, you need
//       to configure Partial tasks of the subprojects.
//       See "Configuration example" section of documentation.
// 注: マルチプロジェクトビルドを設定するには、
//     サブプロジェクトのPartialタスクを設定する必要があります。
//     ドキュメントの「設定例」セクションを参照してください。
tasks.withType(DokkaTask.class) {
    // ..
    // general configuration section
    // 一般的な設定セクション
    // ..

    dokkaSourceSets.configureEach {
        // ..
        // Source set configuration section
        // ソースセット設定セクション
        // ..

        perPackageOption {
            matchingRegex.set(".*api.*")
            suppress.set(false)
            skipDeprecated.set(false)
            reportUndocumented.set(false)
            documentedVisibilities.set([Visibility.PUBLIC])
        }
    }
}
```

</tab>
</tabs>

<deflist collapsible="true">
    <def title="matchingRegex">
        <p>パッケージをマッチさせるために使用される正規表現です。</p>
        <p>デフォルト: <code>.*</code></p>
    </def>
    <def title="suppress">
        <p>ドキュメント生成時にこのパッケージをスキップするかどうかです。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="skipDeprecated">
        <p><code>@Deprecated</code>アノテーションが付けられた宣言をドキュメント化するかどうかです。</p>
        <p>これはソースセットレベルで設定できます。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="reportUndocumented">
        <p>
            <code>documentedVisibilities</code>やその他のフィルターによってフィルタリングされた後、
            可視でありながらドキュメント化されていない宣言（KDocがない宣言）について警告を発するかどうかです。
        </p>
        <p>この設定は<code>failOnWarning</code>と連携してうまく機能します。</p>
        <p>これはソースセットレベルで設定できます。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="documentedVisibilities">
        <p>ドキュメント化されるべき可視性修飾子のセットです。</p>
        <p>
            これは、このパッケージ内の<code>protected</code>/<code>internal</code>/<code>private</code>宣言をドキュメント化したい場合、
            または<code>public</code>宣言を除外して内部APIのみをドキュメント化したい場合に使用できます。
        </p>
        <p>これはソースセットレベルで設定できます。</p>
        <p>デフォルト: <code>DokkaConfiguration.Visibility.PUBLIC</code></p>
    </def>
</deflist>

### 外部ドキュメントリンク設定

`externalDocumentationLink`ブロックを使用すると、依存関係の外部ホストされているドキュメントに繋がるリンクを作成できます。

例えば、`kotlinx.serialization`の型を使用している場合、デフォルトではドキュメント内でクリックできず、未解決であるかのように表示されます。しかし、`kotlinx.serialization`のAPIリファレンスドキュメントはDokkaによって構築され、[kotlinlang.org](https://kotlinlang.org/api/kotlinx.serialization/)で公開されているため、それに対する外部ドキュメントリンクを設定できます。これにより、Dokkaはライブラリからの型のリンクを生成し、それらを正常に解決してクリック可能にします。

デフォルトでは、Kotlin標準ライブラリ、JDK、Android SDK、AndroidXの外部ドキュメントリンクが設定されています。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.gradle.DokkaTask
import java.net.URL

// Note: To configure multi-project builds, you need
//       to configure Partial tasks of the subprojects.
//       See "Configuration example" section of documentation.
// 注: マルチプロジェクトビルドを設定するには、
//     サブプロジェクトのPartialタスクを設定する必要があります。
//     ドキュメントの「設定例」セクションを参照してください。
tasks.withType<DokkaTask>().configureEach {
    // ..
    // general configuration section
    // 一般的な設定セクション
    // ..

    dokkaSourceSets.configureEach {
        // ..
        // source set configuration section
        // ソースセット設定セクション
        // ..

        externalDocumentationLink {
            url.set(URL("https://kotlinlang.org/api/kotlinx.serialization/"))
            packageListUrl.set(
                rootProject.projectDir.resolve("serialization.package.list").toURL()
            )
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.dokka.gradle.DokkaTask
import java.net.URL

// Note: To configure multi-project builds, you need
//       to configure Partial tasks of the subprojects.
//       See "Configuration example" section of documentation.
// 注: マルチプロジェクトビルドを設定するには、
//     サブプロジェクトのPartialタスクを設定する必要があります。
//     ドキュメントの「設定例」セクションを参照してください。
tasks.withType(DokkaTask.class) {
    // ..
    // general configuration section
    // 一般的な設定セクション
    // ..

    dokkaSourceSets.configureEach {
        // ..
        // source set configuration section
        // ソースセット設定セクション
        // ..

        externalDocumentationLink {
            url.set(new URL("https://kotlinlang.org/api/kotlinx.serialization/"))
            packageListUrl.set(
                file("serialization.package.list").toURL()
            )
        }
    }
}
```

</tab>
</tabs>

<deflist collapsible="true">
    <def title="url">
        <p>リンク先のドキュメントのルートURLです。末尾にスラッシュが<b>必要です</b>。</p>
        <p>
            Dokkaは、与えられたURLの<code>package-list</code>を自動的に見つけ、宣言をリンクするために最善を尽くします。
        </p>
        <p>
            自動解決に失敗した場合、または代わりにローカルにキャッシュされたファイルを使用したい場合は、
            <code>packageListUrl</code>オプションの設定を検討してください。
        </p>
    </def>
    <def title="packageListUrl">
        <p>
            <code>package-list</code>の正確な場所です。これはDokkaが自動的に解決することに頼る代替手段です。
        </p>
        <p>
            パッケージリストには、モジュール名やパッケージ名など、ドキュメントとプロジェクト自体に関する情報が含まれています。
        </p>
        <p>これは、ネットワーク呼び出しを避けるためのローカルキャッシュファイルでも構いません。</p>
    </def>
</deflist>

### 完全な設定

以下に、考えられるすべての設定オプションが同時に適用された例を示します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.DokkaConfiguration.Visibility
import org.jetbrains.dokka.gradle.DokkaTask
import org.jetbrains.dokka.Platform
import java.net.URL

// Note: To configure multi-project builds, you need
//       to configure Partial tasks of the subprojects.
//       See "Configuration example" section of documentation.
// 注: マルチプロジェクトビルドを設定するには、
//     サブプロジェクトのPartialタスクを設定する必要があります。
//     ドキュメントの「設定例」セクションを参照してください。
tasks.withType<DokkaTask>().configureEach {
    moduleName.set(project.name)
    moduleVersion.set(project.version.toString())
    outputDirectory.set(layout.buildDirectory.dir("dokka/$name"))
    failOnWarning.set(false)
    suppressObviousFunctions.set(true)
    suppressInheritedMembers.set(false)
    offlineMode.set(false)

    dokkaSourceSets {
        named("linux") {
            dependsOn("native")
            sourceRoots.from(file("linux/src"))
        }
        configureEach {
            suppress.set(false)
            displayName.set(name)
            documentedVisibilities.set(setOf(Visibility.PUBLIC))
            reportUndocumented.set(false)
            skipEmptyPackages.set(true)
            skipDeprecated.set(false)
            suppressGeneratedFiles.set(true)
            jdkVersion.set(8)
            languageVersion.set("1.7")
            apiVersion.set("1.7")
            noStdlibLink.set(false)
            noJdkLink.set(false)
            noAndroidSdkLink.set(false)
            includes.from(project.files(), "packages.md", "extra.md")
            platform.set(Platform.DEFAULT)
            sourceRoots.from(file("src"))
            classpath.from(project.files(), file("libs/dependency.jar"))
            samples.from(project.files(), "samples/Basic.kt", "samples/Advanced.kt")

            sourceLink {
                localDirectory.set(projectDir.resolve("src"))
                remoteUrl.set(URL("https://github.com/kotlin/dokka/tree/master/src"))
                remoteLineSuffix.set("#L")
            }

            externalDocumentationLink {
                url.set(URL("https://kotlinlang.org/api/core/kotlin-stdlib/"))
                packageListUrl.set(
                    rootProject.projectDir.resolve("stdlib.package.list").toURL()
                )
            }

            perPackageOption {
                matchingRegex.set(".*api.*")
                suppress.set(false)
                skipDeprecated.set(false)
                reportUndocumented.set(false)
                documentedVisibilities.set(
                    setOf(
                        Visibility.PUBLIC,
                        Visibility.PRIVATE,
                        Visibility.PROTECTED,
                        Visibility.INTERNAL,
                        Visibility.PACKAGE
                    )
                )
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.dokka.DokkaConfiguration.Visibility
import org.jetbrains.dokka.gradle.DokkaTask
import org.jetbrains.dokka.Platform
import java.net.URL

// Note: To configure multi-project builds, you need
//       to configure Partial tasks of the subprojects.
//       See "Configuration example" section of documentation.
// 注: マルチプロジェクトビルドを設定するには、
//     サブプロジェクトのPartialタスクを設定する必要があります。
//     ドキュメントの「設定例」セクションを参照してください。
tasks.withType(DokkaTask.class) {
    moduleName.set(project.name)
    moduleVersion.set(project.version.toString())
    outputDirectory.set(file("build/dokka/$name"))
    failOnWarning.set(false)
    suppressObviousFunctions.set(true)
    suppressInheritedMembers.set(false)
    offlineMode.set(false)

    dokkaSourceSets {
        named("linux") {
            dependsOn("native")
            sourceRoots.from(file("linux/src"))
        }
        configureEach {
            suppress.set(false)
            displayName.set(name)
            documentedVisibilities.set([Visibility.PUBLIC])
            reportUndocumented.set(false)
            skipEmptyPackages.set(true)
            skipDeprecated.set(false)
            suppressGeneratedFiles.set(true)
            jdkVersion.set(8)
            languageVersion.set("1.7")
            apiVersion.set("1.7")
            noStdlibLink.set(false)
            noJdkLink.set(false)
            noAndroidSdkLink.set(false)
            includes.from(project.files(), "packages.md", "extra.md")
            platform.set(Platform.DEFAULT)
            sourceRoots.from(file("src"))
            classpath.from(project.files(), file("libs/dependency.jar"))
            samples.from(project.files(), "samples/Basic.kt", "samples/Advanced.kt")

            sourceLink {
                localDirectory.set(file("src"))
                remoteUrl.set(new URL("https://github.com/kotlin/dokka/tree/master/src"))
                remoteLineSuffix.set("#L")
            }

            externalDocumentationLink {
                url.set(new URL("https://kotlinlang.org/api/core/kotlin-stdlib/"))
                packageListUrl.set(
                        file("stdlib.package.list").toURL()
                )
            }

            perPackageOption {
                matchingRegex.set(".*api.*")
                suppress.set(false)
                skipDeprecated.set(false)
                reportUndocumented.set(false)
                documentedVisibilities.set([Visibility.PUBLIC])
            }
        }
    }
}
```

</tab>
</tabs>