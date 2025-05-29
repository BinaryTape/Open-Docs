[//]: # (title: Gradle)

Gradleベースのプロジェクトのドキュメントを生成するには、[Dokka用Gradleプラグイン](https://plugins.gradle.org/plugin/org.jetbrains.dokka)を使用できます。

これにはプロジェクトの基本的な自動設定機能が付属しており、ドキュメント生成に便利な[Gradleタスク](#generate-documentation)があり、出力をカスタマイズするための[豊富な設定オプション](#configuration-options)も提供されています。

Dokkaを試してさまざまなプロジェクトでどのように設定できるかを確認するには、[Gradleサンプルプロジェクト](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/examples/gradle)をご覧ください。

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

[マルチプロジェクト](#multi-project-builds)ビルドのドキュメントを作成する場合、Dokka用Gradleプラグインをサブプロジェクト内にも適用する必要があります。これには、`allprojects {}`または`subprojects {}`のGradle設定を使用できます。

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

Dokkaをどこに適用すべきか不明な場合は、[設定例](#configuration-examples)を参照してください。

> Dokkaは内部で[Kotlin Gradleプラグイン](https://kotlinlang.org/docs/gradle-configure-project.html#apply-the-plugin)を使用して、ドキュメントを生成する[ソースセット](https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets)の自動設定を行います。Kotlin Gradleプラグインを適用するか、[ソースセットを手動で設定](#source-set-configuration)してください。
>
{style="note"}

> [プリコンパイルされたスクリプトプラグイン](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:precompiled_plugins)でDokkaを使用している場合、正しく動作させるためには[Kotlin Gradleプラグイン](https://kotlinlang.org/docs/gradle-configure-project.html#apply-the-plugin)を依存関係として追加する必要があります。
>
{style="note"}

何らかの理由でplugins DSLを使用できない場合は、プラグイン適用の[レガシーな方法](https://docs.gradle.org/current/userguide/plugins.html#sec:old_plugin_application)を使用できます。

## ドキュメントの生成

Dokka用Gradleプラグインには、[HTML](dokka-html.md)、[Markdown](dokka-markdown.md)、[Javadoc](dokka-javadoc.md)の出力フォーマットが組み込まれています。これには、[単一プロジェクト](#single-project-builds)ビルドと[マルチプロジェクト](#multi-project-builds)ビルドの両方でドキュメントを生成するための多数のタスクが追加されます。

### 単一プロジェクトビルド

シンプルな単一プロジェクトアプリケーションおよびライブラリのドキュメントをビルドするには、以下のタスクを使用します。

| **タスク**    | **説明**                                          |
|-------------|---------------------------------------------------|
| `dokkaHtml` | [HTML](dokka-html.md)形式でドキュメントを生成します。 |

#### 実験的なフォーマット

| **タスク**       | **説明**                                                                           |
|----------------|------------------------------------------------------------------------------------|
| `dokkaGfm`     | [GitHub Flavored Markdown](dokka-markdown.md#gfm)形式でドキュメントを生成します。      |
| `dokkaJavadoc` | [Javadoc](dokka-javadoc.md)形式でドキュメントを生成します。                            |
| `dokkaJekyll`  | [Jekyll互換Markdown](dokka-markdown.md#jekyll)形式でドキュメントを生成します。 |

デフォルトでは、生成されたドキュメントはプロジェクトの`build/dokka/{format}`ディレクトリにあります。出力場所は、他の設定とともに[設定](#configuration-examples)できます。

### マルチプロジェクトビルド

[マルチプロジェクトビルド](https://docs.gradle.org/current/userguide/multi_project_builds.html)のドキュメントを作成するには、ドキュメントを生成したいサブプロジェクト内と、その親プロジェクト内に[Dokka用Gradleプラグインを適用](#apply-dokka)していることを確認してください。

#### MultiModuleタスク

`MultiModule`タスクは、各サブプロジェクトのドキュメントを[`Partial`](#partial-tasks)タスク経由で個別に生成し、すべての出力を収集・処理して、共通の目次と解決されたクロスプロジェクト参照を含む完全なドキュメントを作成します。

Dokkaは、**親**プロジェクト用に以下のタスクを自動的に作成します。

| **タスク**               | **説明**                                                              |
|------------------------|-----------------------------------------------------------------------|
| `dokkaHtmlMultiModule` | [HTML](dokka-html.md)出力形式でマルチモジュールドキュメントを生成します。 |

#### 実験的なフォーマット (マルチモジュール)

| **タスク**                 | **説明**                                                                                               |
|--------------------------|--------------------------------------------------------------------------------------------------------|
| `dokkaGfmMultiModule`    | [GitHub Flavored Markdown](dokka-markdown.md#gfm)出力形式でマルチモジュールドキュメントを生成します。      |
| `dokkaJekyllMultiModule` | [Jekyll互換Markdown](dokka-markdown.md#jekyll)出力形式でマルチモジュールドキュメントを生成します。 |

> [Javadoc](dokka-javadoc.md)出力フォーマットには`MultiModule`タスクがありませんが、代わりに[`Collector`](#collector-tasks)タスクを使用できます。
>
{style="note"}

デフォルトでは、完成したドキュメントは`{parentProject}/build/dokka/{format}MultiModule`ディレクトリで見つけることができます。

#### MultiModuleの結果

以下の構造を持つプロジェクトの場合：

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

`Collector`タスクは、各サブプロジェクトに対応する[単一プロジェクトタスク](#single-project-builds)（例: `dokkaHtml`）を実行し、すべての出力を単一の仮想プロジェクトに結合します。

結果として生成されるドキュメントは、すべてのサブプロジェクトの宣言を含む単一プロジェクトビルドであるかのように見えます。

> マルチプロジェクトビルド用のJavadocドキュメントを作成する必要がある場合は、`dokkaJavadocCollector`タスクを使用してください。
>
{style="tip"}

#### Collectorの結果

以下の構造を持つプロジェクトの場合：

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

各サブプロジェクトには`Partial`タスク（`dokkaHtmlPartial`、`dokkaGfmPartial`、`dokkaJekyllPartial`）が作成されます。

これらのタスクは単独で実行されることを意図しておらず、親の[MultiModule](#multimodule-tasks)タスクによって呼び出されます。

ただし、サブプロジェクトのDokkaをカスタマイズするために、[Partialタスクを設定](#subproject-configuration)できます。

> `Partial`タスクによって生成された出力には、未解決のHTMLテンプレートと参照が含まれているため、親の[`MultiModule`](#multimodule-tasks)タスクによる後処理なしには単独で使用できません。
>
{style="warning"}

> 特定のサブプロジェクトのみのドキュメントを生成したい場合は、[単一プロジェクトタスク](#single-project-builds)を使用してください。例: `:subprojectName:dokkaHtml`。
>
{style="note"}

## javadoc.jarのビルド

ライブラリをリポジトリに公開する場合、ライブラリのAPIリファレンスドキュメントを含む`javadoc.jar`ファイルを提供する必要がある場合があります。

例えば、[Maven Central](https://central.sonatype.org/)に公開する場合、プロジェクトとともに`javadoc.jar`を提供することが[必須](https://central.sonatype.org/publish/requirements/)です。ただし、すべてのリポジトリがそのルールを持っているわけではありません。

Dokka用Gradleプラグインにはこのための既製の機能はありませんが、カスタムGradleタスクを使用して実現できます。[HTML](dokka-html.md)形式のドキュメントを生成するためのタスクと、[Javadoc](dokka-javadoc.md)形式のドキュメントを生成するためのタスクです。

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

> ライブラリをMaven Centralに公開する場合、[javadoc.io](https://javadoc.io/)のようなサービスを利用して、無料でセットアップなしにライブラリのAPIドキュメントをホストできます。これは`javadoc.jar`から直接ドキュメントページを取り込みます。[この例](https://javadoc.io/doc/com.trib3/server/latest/index.html)で示されているように、HTML形式でもうまく機能します。
>
{style="tip"}

## 設定例

プロジェクトのタイプによって、Dokkaの適用方法と設定方法は若干異なります。ただし、[設定オプション](#configuration-options)自体は、プロジェクトのタイプに関わらず同じです。

プロジェクトのルートに単一の`build.gradle.kts`または`build.gradle`ファイルがあるシンプルでフラットなプロジェクトについては、[単一プロジェクト設定](#single-project-configuration)を参照してください。

サブプロジェクトと複数のネストされた`build.gradle.kts`または`build.gradle`ファイルを持つより複雑なビルドについては、[マルチプロジェクト設定](#multi-project-configuration)を参照してください。

### 単一プロジェクト設定

単一プロジェクトビルドでは通常、プロジェクトのルートに`build.gradle.kts`または`build.gradle`ファイルが1つだけあり、典型的に以下の構造を持っています。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

Single platform:

```text
.
├── build.gradle.kts
└── src/
    └── main/
        └── kotlin/
            └── HelloWorld.kt
```

Multiplatform:

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

Single platform:

```text
.
├── build.gradle
└── src/
    └── main/
        └── kotlin/
            └── HelloWorld.kt
```

Multiplatform:

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

このようなプロジェクトでは、ルートの`build.gradle.kts`または`build.gradle`ファイルにDokkaとその設定を適用する必要があります。

タスクと出力フォーマットを個別に設定できます。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

Inside `./build.gradle.kts`:

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

Inside `./build.gradle`:

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

Inside `./build.gradle.kts`:

```kotlin
import org.jetbrains.dokka.gradle.DokkaTask
import org.jetbrains.dokka.gradle.DokkaTaskPartial
import org.jetbrains.dokka.DokkaConfiguration.Visibility

plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}

// dokkaHtml, dokkaJavadoc, dokkaGfmなど、すべての単一プロジェクトDokkaタスクを同時に設定します。
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

Inside `./build.gradle`:

```groovy
import org.jetbrains.dokka.gradle.DokkaTask
import org.jetbrains.dokka.gradle.DokkaTaskPartial
import org.jetbrains.dokka.DokkaConfiguration.Visibility

plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}

// dokkaHtml, dokkaJavadoc, dokkaGfmなど、すべての単一プロジェクトDokkaタスクを同時に設定します。
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

Gradleの[マルチプロジェクトビルド](https://docs.gradle.org/current/userguide/multi_project_builds.html)は、構造と設定がより複雑です。通常、複数のネストされた`build.gradle.kts`または`build.gradle`ファイルがあり、典型的に以下の構造を持っています。

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

この場合、Dokkaを適用し設定する方法は複数あります。

#### サブプロジェクト設定

マルチプロジェクトビルドでサブプロジェクトを設定するには、[`Partial`](#partial-tasks)タスクを設定する必要があります。

Gradleの`allprojects {}`または`subprojects {}`設定ブロックを使用して、ルートの`build.gradle.kts`または`build.gradle`ファイルですべてのサブプロジェクトを同時に設定できます。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

In the root `./build.gradle.kts`:

```kotlin
import org.jetbrains.dokka.gradle.DokkaTaskPartial

plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}

subprojects {
    apply(plugin = "org.jetbrains.dokka")

    // HTMLタスクのみを設定
    tasks.dokkaHtmlPartial {
        outputDirectory.set(layout.buildDirectory.dir("docs/partial"))
    }

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

In the root `./build.gradle`:

```groovy
import org.jetbrains.dokka.gradle.DokkaTaskPartial

plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}

subprojects {
    apply plugin: 'org.jetbrains.dokka'

    // HTMLタスクのみを設定
    dokkaHtmlPartial {
        outputDirectory.set(file("build/docs/partial"))
    }

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

あるいは、Dokkaを個別にサブプロジェクト内に適用し設定することもできます。

例えば、`subproject-A`サブプロジェクトのみに特定の設定を行うには、`./subproject-A/build.gradle.kts`内に以下のコードを適用する必要があります。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

Inside `./subproject-A/build.gradle.kts`:

```kotlin
apply(plugin = "org.jetbrains.dokka")

// subproject-Aのみの設定
tasks.dokkaHtmlPartial {
    outputDirectory.set(layout.buildDirectory.dir("docs/partial"))
}
```

</tab>
<tab title="Groovy" group-key="groovy">

Inside `./subproject-A/build.gradle`:

```groovy
apply plugin: 'org.jetbrains.dokka'

// subproject-Aのみの設定
dokkaHtmlPartial {
    outputDirectory.set(file("build/docs/partial"))
}
```

</tab>
</tabs>

#### 親プロジェクト設定

すべてのドキュメントに共通し、サブプロジェクトに属さないもの（つまり、親プロジェクトのプロパティ）を設定したい場合は、[`MultiModule`](#multimodule-tasks)タスクを設定する必要があります。

例えば、HTMLドキュメントのヘッダーで使用されるプロジェクト名を変更したい場合、ルートの`build.gradle.kts`または`build.gradle`ファイル内に以下を適用する必要があります。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

In the root `./build.gradle.kts` file:

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

In the root `./build.gradle` file:

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

Dokkaには、開発者と読者の体験をカスタマイズするための多くの設定オプションがあります。

以下に、各設定セクションの例と詳細な説明を示します。ページ下部には、[すべての設定オプション](#complete-configuration)が適用された例も記載されています。

設定ブロックをどこに、どのように適用するかについては、[設定例](#configuration-examples)を参照してください。

### 一般設定

ソースセットやパッケージに関わらず、あらゆるDokkaタスクの一般設定の例を以下に示します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.gradle.DokkaTask

// 注意: マルチプロジェクトビルドを設定するには、
// サブプロジェクトのPartialタスクを設定する必要があります。
// ドキュメントの「設定例」セクションを参照してください。
tasks.withType<DokkaTask>().configureEach {
    moduleName.set(project.name)
    moduleVersion.set(project.version.toString())
    outputDirectory.set(layout.buildDirectory.dir("dokka/$name"))
    failOnWarning.set(false)
    suppressObviousFunctions.set(true)
    suppressInheritedMembers.set(false)
    offlineMode.set(false)
    
    // ..
    // ソースセット設定セクション
    // ..
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.dokka.gradle.DokkaTask

// 注意: マルチプロジェクトビルドを設定するには、
// サブプロジェクトのPartialタスクを設定する必要があります。
// ドキュメントの「設定例」セクションを参照してください。
tasks.withType(DokkaTask.class) {
    moduleName.set(project.name)
    moduleVersion.set(project.version.toString())
    outputDirectory.set(file("build/dokka/$name"))
    failOnWarning.set(false)
    suppressObviousFunctions.set(true)
    suppressInheritedMembers.set(false)
    offlineMode.set(false)

    // ..
    // ソースセット設定セクション
    // ..
}
```

</tab>
</tabs>

<deflist collapsible="true">
    <def title="moduleName">
        <p>モジュールを参照するために使用される表示名です。目次、ナビゲーション、ロギングなどに使用されます。</p>
        <p>単一プロジェクトビルドまたは<code>MultiModule</code>タスクに設定されている場合、プロジェクト名として使用されます。</p>
        <p>デフォルト: Gradleプロジェクト名</p>
    </def>
    <def title="moduleVersion">
        <p>
            モジュールバージョンです。単一プロジェクトビルドまたは<code>MultiModule</code>タスクに設定されている場合、プロジェクトバージョンとして使用されます。
        </p>
        <p>デフォルト: Gradleプロジェクトバージョン</p>
    </def>
    <def title="outputDirectory">
        <p>フォーマットに関わらず、ドキュメントが生成されるディレクトリです。タスクごとに設定できます。</p>
        <p>
            デフォルトは<code>{project}/{buildDir}/{format}</code>で、<code>{format}</code>はタスク名から"dokka"プレフィックスを除いたものです。<code>dokkaHtmlMultiModule</code>タスクの場合、<code>project/buildDir/htmlMultiModule</code>です。
        </p>
    </def>
    <def title="failOnWarning">
        <p>
            Dokkaが警告またはエラーを出した場合にドキュメント生成を失敗させるかどうかです。この処理は、すべてのエラーと警告が出力されるまで待機します。
        </p>
        <p>この設定は<code>reportUndocumented</code>とうまく連携します。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="suppressObviousFunctions">
        <p>明らかな関数を抑制するかどうかです。</p>
        <p>
            関数が「明らかな」とみなされるのは、以下のいずれかの場合です。
            <list>
                <li>
                    <code>equals</code>、<code>hashCode</code>、<code>toString</code>など、<code>kotlin.Any</code>、<code>Kotlin.Enum</code>、<code>java.lang.Object</code>、または<code>java.lang.Enum</code>から継承されたもの。
                </li>
                <li>
                    合成されたもの（コンパイラによって生成されたもの）で、<code>dataClass.componentN</code>や<code>dataClass.copy</code>のようにドキュメントがないもの。
                </li>
            </list>
        </p>
        <p>デフォルト: <code>true</code></p>
    </def>
    <def title="suppressInheritedMembers">
        <p>特定のクラスで明示的にオーバーライドされていない継承メンバーを抑制するかどうかです。</p>
        <p>
            注: これは<code>equals</code> / <code>hashCode</code> / <code>toString</code>などの関数を抑制できますが、<code>dataClass.componentN</code>や<code>dataClass.copy</code>のような合成関数を抑制することはできません。その場合は<code>suppressObviousFunctions</code>を使用してください。
        </p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="offlineMode">
        <p>ネットワーク経由でリモートファイル/リンクを解決するかどうかです。</p>
        <p>
            これには、外部ドキュメントリンクを生成するために使用されるパッケージリストが含まれます。例えば、標準ライブラリのクラスをクリック可能にするためなどです。
        </p>
        <p>
            これを<code>true</code>に設定すると、特定のケースでビルド時間を大幅に短縮できますが、ドキュメントの品質とユーザーエクスペリエンスを低下させる可能性もあります。例えば、標準ライブラリを含む依存関係からのクラス/メンバーリンクが解決されなくなるなどです。
        </p>
        <p>
            注: 取得したファイルをローカルにキャッシュし、Dokkaにローカルパスとして提供できます。<code>externalDocumentationLinks</code>セクションを参照してください。
        </p>
        <p>デフォルト: <code>false</code></p>
    </def>
</deflist>

### ソースセット設定

Dokkaでは、[Kotlinソースセット](https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets)に対していくつかのオプションを設定できます。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.DokkaConfiguration.Visibility
import org.jetbrains.dokka.gradle.DokkaTask
import org.jetbrains.dokka.Platform
import java.net.URL

// 注意: マルチプロジェクトビルドを設定するには、
// サブプロジェクトのPartialタスクを設定する必要があります。
// ドキュメントの「設定例」セクションを参照してください。
tasks.withType<DokkaTask>().configureEach {
    // ..
    // 一般設定セクション
    // ..

    dokkaSourceSets {
        // 'linux'ソースセット専用の設定
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
                // ソースリンクセクション
            }
            externalDocumentationLink {
                // 外部ドキュメントリンクセクション
            }
            perPackageOption {
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

// 注意: マルチプロジェクトビルドを設定するには、
// サブプロジェクトのPartialタスクを設定する必要があります。
// ドキュメントの「設定例」セクションを参照してください。
tasks.withType(DokkaTask.class) {
    // ..
    // 一般設定セクション
    // ..
    
    dokkaSourceSets {
        // 'linux'ソースセット専用の設定
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
                // ソースリンクセクション
            }
            externalDocumentationLink {
                // 外部ドキュメントリンクセクション
            }
            perPackageOption {
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
            この名前は、外部（例えば、ドキュメント読者に見えるソースセット名）と内部（例えば、<code>reportUndocumented</code>のログメッセージ）の両方で使用されます。
        </p>
        <p>デフォルトでは、値はKotlin Gradleプラグインから提供される情報に基づいて推論されます。</p>
    </def>
    <def title="documentedVisibilities">
        <p>ドキュメント化すべき可視性修飾子のセットです。</p>
        <p>
            これは、<code>protected</code>/<code>internal</code>/<code>private</code>宣言をドキュメント化したい場合、または<code>public</code>宣言を除外して内部APIのみをドキュメント化したい場合に使用できます。
        </p>
        <p>パッケージごとに設定できます。</p>
        <p>デフォルト: <code>DokkaConfiguration.Visibility.PUBLIC</code></p>
    </def>
    <def title="reportUndocumented">
        <p>
            <code>documentedVisibilities</code>や他のフィルターによってフィルタリングされた後、KDocのない可視の未ドキュメント宣言について警告を発するかどうかです。
        </p>
        <p>この設定は<code>failOnWarning</code>とうまく連携します。</p>
        <p>パッケージごとに設定できます。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="skipEmptyPackages">
        <p>
            さまざまなフィルターが適用された後、可視の宣言を含まないパッケージをスキップするかどうかです。
        </p>
        <p>
            例えば、<code>skipDeprecated</code>が<code>true</code>に設定されており、パッケージに非推奨の宣言のみが含まれる場合、そのパッケージは空であると見なされます。
        </p>
        <p>デフォルト: <code>true</code></p>
    </def>
    <def title="skipDeprecated">
        <p><code>@Deprecated</code>アノテーションが付けられた宣言をドキュメント化するかどうかです。</p>
        <p>パッケージごとに設定できます。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="suppressGeneratedFiles">
        <p>生成されたファイルをドキュメント化/分析するかどうかです。</p>
        <p>
            生成されたファイルは、<code>{project}/{buildDir}/generated</code>ディレクトリに存在すると予想されます。
        </p>
        <p>
            <code>true</code>に設定されている場合、そのディレクトリからのすべてのファイルが<code>suppressedFiles</code>オプションに実質的に追加されるため、手動で設定できます。
        </p>
        <p>デフォルト: <code>true</code></p>
    </def>
    <def title="jdkVersion">
        <p>Java型に対する外部ドキュメントリンクを生成する際に使用するJDKバージョンです。</p>
        <p>
            例えば、ある公開宣言シグネチャで<code>java.util.UUID</code>を使用し、このオプションが<code>8</code>に設定されている場合、Dokkaはそれに対する<a href="https://docs.oracle.com/javase/8/docs/api/java/util/UUID.html">JDK 8 Javadocs</a>への外部ドキュメントリンクを生成します。
        </p>
        <p>デフォルト: JDK 8</p>
    </def>
    <def title="languageVersion">
        <p>
            解析および<a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a>環境の設定に使用される<a href="https://kotlinlang.org/docs/compatibility-modes.html">Kotlin言語バージョン</a>です。
        </p>
        <p>デフォルトでは、Dokkaの組み込みコンパイラで利用可能な最新の言語バージョンが使用されます。</p>
    </def>
    <def title="apiVersion">
        <p>
            解析および<a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a>環境の設定に使用される<a href="https://kotlinlang.org/docs/compatibility-modes.html">Kotlin APIバージョン</a>です。
        </p>
        <p>デフォルトでは、<code>languageVersion</code>から推論されます。</p>
    </def>
    <def title="noStdlibLink">
        <p>
            Kotlinの標準ライブラリのAPIリファレンスドキュメントに繋がる外部ドキュメントリンクを生成するかどうかです。
        </p>
        <p>注: <code>noStdLibLink</code>が<code>false</code>に設定されている場合、リンクは**生成されます**。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="noJdkLink">
        <p>JDKのJavadocへの外部ドキュメントリンクを生成するかどうかです。</p>
        <p>JDK Javadocsのバージョンは<code>jdkVersion</code>オプションによって決定されます。</p>
        <p>注: <code>noJdkLink</code>が<code>false</code>に設定されている場合、リンクは**生成されます**。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="noAndroidSdkLink">
        <anchor name="includes"/>
        <p>Android SDKのAPIリファレンスへの外部ドキュメントリンクを生成するかどうかです。</p>
        <p>これはAndroidプロジェクトでのみ関連があり、それ以外の場合は無視されます。</p>
        <p>注: <code>noAndroidSdkLink</code>が<code>false</code>に設定されている場合、リンクは**生成されます**。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="includes">
        <p>
            <a href="dokka-module-and-package-docs.md">モジュールおよびパッケージのドキュメント</a>を含むMarkdownファイルのリストです。
        </p>
        <p>指定されたファイルの内容は解析され、モジュールおよびパッケージの説明としてドキュメントに埋め込まれます。</p>
        <p>
            見た目と使用方法の例については、<a href="https://github.com/Kotlin/dokka/tree/master/examples/gradle/dokka-gradle-example">Dokka Gradleの例</a>を参照してください。
        </p>
    </def>
    <def title="platform">
        <p>
            コード解析および<a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a>環境の設定に使用されるプラットフォームです。
        </p>
        <p>デフォルト値はKotlin Gradleプラグインから提供される情報に基づいて推論されます。</p>
    </def>
    <def title="sourceRoots">
        <p>
            解析およびドキュメント化されるソースコードのルートです。ディレクトリおよび個別の<code>.kt</code> / <code>.java</code>ファイルが許容されます。
        </p>
        <p>デフォルトでは、ソースルートはKotlin Gradleプラグインから提供される情報に基づいて推論されます。</p>
    </def>
    <def title="classpath">
        <p>解析およびインタラクティブなサンプル用のクラスパスです。</p>
        <p>これは、依存関係から来る一部の型が自動的に解決/認識されない場合に便利です。</p>
        <p>このオプションは<code>.jar</code>ファイルと<code>.klib</code>ファイルの両方を受け入れます。</p>
        <p>デフォルトでは、クラスパスはKotlin Gradleプラグインから提供される情報に基づいて推論されます。</p>
    </def>
    <def title="samples">
        <p>
            <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a> KDocタグ経由で参照されるサンプル関数を含むディレクトリまたはファイルのリストです。
        </p>
    </def>
</deflist>

### ソースリンク設定

`sourceLinks`設定ブロックを使用すると、`remoteUrl`と特定の行番号にリンクする`source`リンクを各シグネチャに追加できます（行番号は`remoteLineSuffix`を設定することで設定可能です）。

これにより、読者は各宣言のソースコードを見つけやすくなります。

例として、`kotlinx.coroutines`の[`count()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/count.html)関数のドキュメントを参照してください。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.gradle.DokkaTask
import java.net.URL

// 注意: マルチプロジェクトビルドを設定するには、
// サブプロジェクトのPartialタスクを設定する必要があります。
// ドキュメントの「設定例」セクションを参照してください。
tasks.withType<DokkaTask>().configureEach {
    // ..
    // 一般設定セクション
    // ..
    
    dokkaSourceSets.configureEach {
        // ..
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

// 注意: マルチプロジェクトビルドを設定するには、
// サブプロジェクトのPartialタスクを設定する必要があります。
// ドキュメントの「設定例」セクションを参照してください。
tasks.withType(DokkaTask.class) {
    // ..
    // 一般設定セクション
    // ..
    
    dokkaSourceSets.configureEach {
        // ..
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
            ローカルソースディレクトリへのパスです。パスは現在のプロジェクトのルートからの相対パスでなければなりません。
        </p>
    </def>
    <def title="remoteUrl">
        <p>
            ドキュメント読者がアクセスできる、GitHub、GitLab、BitbucketなどのソースコードホスティングサービスのURLです。このURLは宣言のソースコードリンクを生成するために使用されます。
        </p>
    </def>
    <def title="remoteLineSuffix">
        <p>
            ソースコードの行番号をURLに付加するために使用されるサフィックスです。これにより、読者はファイルだけでなく、宣言の特定の行番号にも移動できます。
        </p>
        <p>
            指定されたサフィックスに行番号自体が付加されます。例えば、このオプションが<code>#L</code>に設定され、行番号が10の場合、結果のURLサフィックスは<code>#L10</code>となります。
        </p>
        <p>
            人気のあるサービスで使用されるサフィックス:
            <list>
                <li>GitHub: <code>#L</code></li>
                <li>GitLab: <code>#L</code></li>
                <li>Bitbucket: <code>#lines-</code></li>
            </list>
        </p>>
        <p>デフォルト: <code>#L</code></p>
    </def>
</deflist>

### パッケージオプション

`perPackageOption`設定ブロックを使用すると、`matchingRegex`に一致する特定のパッケージに対していくつかのオプションを設定できます。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.DokkaConfiguration.Visibility
import org.jetbrains.dokka.gradle.DokkaTask

// 注意: マルチプロジェクトビルドを設定するには、
// サブプロジェクトのPartialタスクを設定する必要があります。
// ドキュメントの「設定例」セクションを参照してください。
tasks.withType<DokkaTask>().configureEach {
    // ..
    // 一般設定セクション
    // ..
    
    dokkaSourceSets.configureEach {
        // ..
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

// 注意: マルチプロジェクトビルドを設定するには、
// サブプロジェクトのPartialタスクを設定する必要があります。
// ドキュメントの「設定例」セクションを参照してください。
tasks.withType(DokkaTask.class) {
    // ..
    // 一般設定セクション
    // ..
    
    dokkaSourceSets.configureEach {
        // ..
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
        <p>パッケージに一致するために使用される正規表現です。</p>
        <p>デフォルト: <code>.*</code></p>
    </def>
    <def title="suppress">
        <p>ドキュメント生成時にこのパッケージをスキップするかどうかです。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="skipDeprecated">
        <p><code>@Deprecated</code>アノテーションが付けられた宣言をドキュメント化するかどうかです。</p>
        <p>ソースセットレベルで設定できます。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="reportUndocumented">
        <p>
            <code>documentedVisibilities</code>や他のフィルターによってフィルタリングされた後、KDocのない可視の未ドキュメント宣言について警告を発するかどうかです。
        </p>
        <p>この設定は<code>failOnWarning</code>とうまく連携します。</p>
        <p>ソースセットレベルで設定できます。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="documentedVisibilities">
        <p>ドキュメント化すべき可視性修飾子のセットです。</p>
        <p>
            このパッケージ内の<code>protected</code>/<code>internal</code>/<code>private</code>宣言をドキュメント化したい場合、または<code>public</code>宣言を除外して内部APIのみをドキュメント化したい場合に使用できます。
        </p>
        <p>ソースセットレベルで設定できます。</p>
        <p>デフォルト: <code>DokkaConfiguration.Visibility.PUBLIC</code></p>
    </def>
</deflist>

### 外部ドキュメントリンク設定

`externalDocumentationLink`ブロックを使用すると、依存関係の外部ホストされているドキュメントへのリンクを作成できます。

例えば、`kotlinx.serialization`の型を使用している場合、デフォルトではドキュメント内で未解決であるかのようにクリックできません。しかし、`kotlinx.serialization`のAPIリファレンスドキュメントはDokkaによってビルドされ、[kotlinlang.org](https://kotlinlang.org/api/kotlinx.serialization/)で公開されているため、それに対する外部ドキュメントリンクを設定できます。これにより、Dokkaがライブラリの型へのリンクを生成し、それらが正常に解決されてクリック可能になります。

デフォルトでは、Kotlin標準ライブラリ、JDK、Android SDK、およびAndroidXの外部ドキュメントリンクが設定されています。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.gradle.DokkaTask
import java.net.URL

// 注意: マルチプロジェクトビルドを設定するには、
// サブプロジェクトのPartialタスクを設定する必要があります。
// ドキュメントの「設定例」セクションを参照してください。
tasks.withType<DokkaTask>().configureEach {
    // ..
    // 一般設定セクション
    // ..
    
    dokkaSourceSets.configureEach {
        // ..
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

// 注意: マルチプロジェクトビルドを設定するには、
// サブプロジェクトのPartialタスクを設定する必要があります。
// ドキュメントの「設定例」セクションを参照してください。
tasks.withType(DokkaTask.class) {
    // ..
    // 一般設定セクション
    // ..
    
    dokkaSourceSets.configureEach {
        // ..
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
        <p>リンク先のドキュメントのルートURLです。末尾にスラッシュが**必須**です。</p>
        <p>
            Dokkaは、指定されたURLの<code>package-list</code>を自動的に見つけ、宣言をリンクするために最善を尽くします。
        </p>
        <p>
            自動解決に失敗した場合、または代わりにローカルにキャッシュされたファイルを使用したい場合は、<code>packageListUrl</code>オプションを設定することを検討してください。
        </p>
    </def>
    <def title="packageListUrl">
        <p>
            <code>package-list</code>の正確な場所です。これは、Dokkaが自動的に解決するのを信頼する代わりに使用できる代替手段です。
        </p>
        <p>
            パッケージリストには、モジュール名やパッケージ名など、ドキュメントとプロジェクト自体に関する情報が含まれています。
        </p>
        <p>これは、ネットワーク呼び出しを避けるためにローカルにキャッシュされたファイルでも構いません。</p>
    </def>
</deflist>

### 完全な設定

以下に、利用可能なすべての設定オプションが同時に適用された例を示します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.DokkaConfiguration.Visibility
import org.jetbrains.dokka.gradle.DokkaTask
import org.jetbrains.dokka.Platform
import java.net.URL

// 注意: マルチプロジェクトビルドを設定するには、
// サブプロジェクトのPartialタスクを設定する必要があります。
// ドキュメントの「設定例」セクションを参照してください。
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

// 注意: マルチプロジェクトビルドを設定するには、
// サブプロジェクトのPartialタスクを設定する必要があります。
// ドキュメントの「設定例」セクションを参照してください。
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