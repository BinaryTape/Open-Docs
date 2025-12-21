[//]: # (title: Gradle)

> このガイドはDokka Gradleプラグイン (DGP) v2モードに適用されます。以前のDGP v1モードはサポートされなくなりました。
> v1からv2モードにアップグレードする場合は、[移行ガイド](dokka-migration.md)を参照してください。
>
{style="note"}

Gradleベースのプロジェクトのドキュメントを生成するには、[Dokka用Gradleプラグイン](https://plugins.gradle.org/plugin/org.jetbrains.dokka)を使用できます。

Dokka Gradleプラグイン (DGP) は、プロジェクトの基本的な自動設定が付属しており、ドキュメント生成のための[Gradleタスク](#generate-documentation)を含み、出力をカスタマイズするための[設定オプション](dokka-gradle-configuration-options.md)を提供します。

Dokkaを試してさまざまなプロジェクトでどのように設定できるかを確認するには、当社の[Gradleサンプルプロジェクト](https://github.com/Kotlin/dokka/tree/2.0.0/examples/gradle-v2)にアクセスしてください。

## サポートされているバージョン

プロジェクトが以下の最小バージョン要件を満たしていることを確認してください。

| **ツール**                                                                          | **バージョン**   |
|-----------------------------------------------------------------------------------|---------------|
| [Gradle](https://docs.gradle.org/current/userguide/upgrading_version_8.html)      | 7.6以上 |
| [Android Gradleプラグイン](https://developer.android.com/build/agp-upgrade-assistant) | 7.0以上 |
| [Kotlin Gradleプラグイン](https://kotlinlang.org/docs/gradle-configure-project.html) | 1.9以上 |

## Dokkaの適用

Dokka用Gradleプラグインを適用する推奨される方法は、[pluginsブロック](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block)を使用することです。プロジェクトの`build.gradle.kts`ファイルの`plugins {}`ブロックに追加してください。

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}
```

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}
```

</tab>
</tabs>

マルチプロジェクトビルドをドキュメント化する場合、ドキュメント化したいすべてのサブプロジェクトに明示的にプラグインを適用する必要があります。Dokkaを各サブプロジェクトで直接設定することも、コンベンションプラグインを使用して複数のサブプロジェクト間でDokkaの設定を共有することもできます。詳細については、[シングルプロジェクト](#single-project-configuration)ビルドと[マルチプロジェクト](#multi-project-configuration)ビルドの設定方法を参照してください。

> * 内部では、Dokkaは[Kotlin Gradleプラグイン](https://kotlinlang.org/docs/gradle-configure-project.html#apply-the-plugin)を使用して、ドキュメントが生成される[ソースセット](https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets)を自動的に設定します。Kotlin Gradleプラグインを適用するか、[ソースセットを手動で設定](dokka-gradle-configuration-options.md#source-set-configuration)してください。
>
> * Dokkaを[プリコンパイルされたスクリプトプラグイン](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:precompiled_plugins)で使用している場合、適切に動作させるためには[Kotlin Gradleプラグイン](https://kotlinlang.org/docs/gradle-configure-project.html#apply-the-plugin)を依存関係として追加する必要があります。
>
{style="tip"}

## ビルドキャッシュと設定キャッシュを有効にする

DGPはGradleのビルドキャッシュと設定キャッシュをサポートし、ビルドパフォーマンスを向上させます。

* ビルドキャッシュを有効にするには、[Gradleビルドキャッシュのドキュメント](https://docs.gradle.org/current/userguide/build_cache.html#sec:build_cache_enable)の指示に従ってください。
* 設定キャッシュを有効にするには、[Gradle設定キャッシュのドキュメント](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage:enable )の指示に従ってください。

## ドキュメントの生成

Dokka Gradleプラグインには、[HTML](dokka-html.md)と[Javadoc](dokka-javadoc.md)の出力フォーマットが組み込まれています。

ドキュメントを生成するには、以下のGradleタスクを使用してください。

```shell
./gradlew :dokkaGenerate
```

`dokkaGenerate` Gradleタスクの主な動作は次のとおりです。

* このタスクは、[シングル](#single-project-configuration)プロジェクトビルドと[マルチプロジェクト](#multi-project-configuration)ビルドの両方のドキュメントを生成します。
* デフォルトでは、ドキュメントの出力フォーマットはHTMLです。[適切なプラグインを追加](#configure-documentation-output-format)することで、Javadoc形式またはHTMLとJavadocの両方の形式で生成することもできます。
* 生成されたドキュメントは、シングルプロジェクトビルドとマルチプロジェクトビルドの両方で、自動的に`build/dokka/html`ディレクトリに配置されます。[出力場所 (`outputDirectory`) を変更](dokka-gradle-configuration-options.md#general-configuration)できます。

### ドキュメントの出力形式を設定する

> Javadoc出力フォーマットは[アルファ版 (Alpha)](https://kotlinlang.org/docs/components-stability.html#stability-levels-explained)です。これを使用する際、バグが見つかったり、移行の問題が発生したりする可能性があります。Javadocを入力として受け入れるツールとの統合が成功することは保証されません。自己責任で使用してください。
>
{style="warning"}

APIドキュメントをHTML、Javadoc、または両方の形式で同時に生成することができます。

1. 対応するプラグイン`id`を、プロジェクトの`build.gradle.kts`ファイルの`plugins {}`ブロックに配置します。

   ```kotlin
   plugins {
       // Generates HTML documentation
       id("org.jetbrains.dokka") version "%dokkaVersion%"

       // Generates Javadoc documentation
       id("org.jetbrains.dokka-javadoc") version "%dokkaVersion%"

       // Keeping both plugin IDs generates both formats
   }
   ```

2. 対応するGradleタスクを実行します。

   各形式に対応するプラグイン`id`とGradleタスクのリストを以下に示します。

   |             | **HTML**                                  | **Javadoc**                                  | **両方**                          |
   |-------------|-------------------------------------------|----------------------------------------------|-----------------------------------|
   | プラグイン`id` | `id("org.jetbrains.dokka")`               | `id("org.jetbrains.dokka-javadoc")`          | HTMLとJavadocの両方のプラグインを使用 |
   | Gradleタスク | `./gradlew :dokkaGeneratePublicationHtml` | `./gradlew :dokkaGeneratePublicationJavadoc` | `./gradlew :dokkaGenerate`        |

    > * `dokkaGenerate`タスクは、適用されたプラグインに基づいて利用可能なすべての形式でドキュメントを生成します。HTMLとJavadocの両方のプラグインが適用されている場合、`dokkaGeneratePublicationHtml`タスクを実行してHTMLのみを生成するか、`dokkaGeneratePublicationJavadoc`タスクを実行してJavadocのみを生成するかを選択できます。
    >
    {style="tip"}

IntelliJ IDEAを使用している場合、`dokkaGenerateHtml` Gradleタスクが表示されることがあります。このタスクは単に`dokkaGeneratePublicationHtml`のエイリアスです。両方のタスクはまったく同じ操作を実行します。

### マルチプロジェクトビルドでドキュメント出力を集約する

Dokkaは、複数のサブプロジェクトからのドキュメントを単一の出力またはパブリケーションに集約できます。

ドキュメントを集約する前に、ドキュメント化可能なすべてのサブプロジェクトに[Dokkaプラグインを適用](#apply-the-convention-plugin-to-your-subprojects)する必要があります。

複数のサブプロジェクトからドキュメントを集約するには、ルートプロジェクトの`build.gradle.kts`ファイルに`dependencies {}`ブロックを追加します。

```kotlin
dependencies {
    dokka(project(":childProjectA:"))
    dokka(project(":childProjectB:"))
}
```

次の構造を持つプロジェクトが与えられた場合：

```text
.
└── parentProject/
    ├── childProjectA/
    │   └── demo/
    │       └── ChildProjectAClass.kt
    └── childProjectB/
        └── demo/
            └── ChildProjectBClass.kt
```

生成されたドキュメントは次のように集約されます。

![Screenshot for output of dokkaHtmlMultiModule task](dokkaHtmlMultiModule-example.png){width=600}

詳細については、[マルチプロジェクトの例](https://github.com/Kotlin/dokka/tree/2.0.0/examples/gradle-v2/multimodule-example)を参照してください。

#### 集約されたドキュメントのディレクトリ

DGPがサブプロジェクトを集約すると、各サブプロジェクトは集約されたドキュメント内に独自のサブディレクトリを持ちます。DGPは、完全なプロジェクト構造を保持することで、各サブプロジェクトが一意のディレクトリを持つことを保証します。

例えば、`:turbo-lib`に集約があり、`:turbo-lib:maths`というネストされたサブプロジェクトがあるプロジェクトが与えられた場合、生成されたドキュメントは以下に配置されます。

```text
turbo-lib/build/dokka/html/turbo-lib/maths/
```

この動作は、サブプロジェクトのディレクトリを手動で指定することで元に戻すことができます。各サブプロジェクトの`build.gradle.kts`ファイルに以下の設定を追加します。

```kotlin
// /turbo-lib/maths/build.gradle.kts

plugins {
    id("org.jetbrains.dokka")
}

dokka {
    // Overrides the subproject directory
    modulePath.set("maths")
}
```

この設定により、`:turbo-lib:maths`モジュールの生成されたドキュメントは`turbo-lib/build/dokka/html/maths/`に出力されるように変更されます。

## javadoc.jarのビルド

ライブラリをリポジトリに公開したい場合、ライブラリのAPIリファレンスドキュメントを含む`javadoc.jar`ファイルを提供する必要がある場合があります。

例えば、[Maven Central](https://central.sonatype.org/)に公開する場合、プロジェクトと一緒に`javadoc.jar`を供給する[必要があります](https://central.sonatype.org/publish/requirements/)。ただし、すべてのリポジトリにこのルールがあるわけではありません。

Dokka用Gradleプラグインは、このための標準的な方法を提供していませんが、カスタムGradleタスクで実現できます。1つは[HTML](dokka-html.md)形式でドキュメントを生成するためのタスクで、もう1つは[Javadoc](dokka-javadoc.md)形式でドキュメントを生成するためのタスクです。

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
// To generate documentation in HTML
val dokkaHtmlJar by tasks.registering(Jar::class) {
    description = "A HTML Documentation JAR containing Dokka HTML"
    from(tasks.dokkaGeneratePublicationHtml.flatMap { it.outputDirectory })
    archiveClassifier.set("html-doc")
}

// To generate documentation in Javadoc
val dokkaJavadocJar by tasks.registering(Jar::class) {
    description = "A Javadoc JAR containing Dokka Javadoc"
    from(tasks.dokkaGeneratePublicationJavadoc.flatMap { it.outputDirectory })
    archiveClassifier.set("javadoc")
}
```

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
// To generate documentation in HTML
tasks.register('dokkaHtmlJar', Jar) {
    description = 'A HTML Documentation JAR containing Dokka HTML'
    from(tasks.named('dokkaGeneratePublicationHtml').flatMap { it.outputDirectory })
    archiveClassifier.set('html-doc')
}

// To generate documentation in Javadoc
tasks.register('dokkaJavadocJar', Jar) {
    description = 'A Javadoc JAR containing Dokka Javadoc'
    from(tasks.named('dokkaGeneratePublicationJavadoc').flatMap { it.outputDirectory })
    archiveClassifier.set('javadoc')
}
```

</tab>
</tabs>

> ライブラリをMaven Centralに公開する場合、[javadoc.io](https://javadoc.io/)のようなサービスを利用して、無料でセットアップなしでライブラリのAPIドキュメントをホストできます。これは`javadoc.jar`から直接ドキュメントページを取得します。これは、[この例](https://javadoc.io/doc/com.trib3/server/latest/index.html)で示されているように、HTML形式とうまく連携します。
>
{style="tip"}

## 設定例

お持ちのプロジェクトの種類によって、Dokkaの適用方法や設定方法はわずかに異なります。しかし、[設定オプション](dokka-gradle-configuration-options.md)自体は、プロジェクトの種類に関係なく同じです。

プロジェクトのルートに単一の`build.gradle.kts`または`build.gradle`ファイルがあるシンプルでフラットなプロジェクトについては、[シングルプロジェクト設定](#single-project-configuration)を参照してください。

サブプロジェクトと複数のネストされた`build.gradle.kts`または`build.gradle`ファイルを持つより複雑なビルドについては、[マルチプロジェクト設定](#multi-project-configuration)を参照してください。

### シングルプロジェクト設定

シングルプロジェクトビルドは通常、プロジェクトのルートに1つの`build.gradle.kts`または`build.gradle`ファイルしかありません。これらはシングルプラットフォームまたはマルチプラットフォームのいずれかであり、典型的には以下の構造を持ちます。

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

ルートの`build.gradle.kts`ファイルでDokka Gradleプラグインを適用し、トップレベルの`dokka {}` DSLを使用して設定します。

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}

dokka {
    dokkaPublications.html {
        moduleName.set("MyProject")
        outputDirectory.set(layout.buildDirectory.dir("documentation/html"))
        includes.from("README.md")
   }

    dokkaSourceSets.main {
        sourceLink {
            localDirectory.set(file("src/main/kotlin"))
            remoteUrl.set(URI("https://github.com/your-repo"))
            remoteLineSuffix.set("#L")
        }
    }
}
```

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

Inside `./build.gradle`:

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}

dokka {
    dokkaPublications {
        html {
            moduleName.set("MyProject")
            outputDirectory.set(layout.buildDirectory.dir("documentation/html"))
            includes.from("README.md")
        }
    }

    dokkaSourceSets {
        named("main") {
            sourceLink {
                localDirectory.set(file("src/main/kotlin"))
                remoteUrl.set(new URI("https://github.com/your-repo"))
                remoteLineSuffix.set("#L")
            }
        }
    }
}
```

</tab>
</tabs>

この設定は、Dokkaをプロジェクトに適用し、ドキュメントの出力ディレクトリを設定し、メインのソースセットを定義します。カスタムアセット、可視性フィルター、またはプラグイン設定を同じ`dokka {}`ブロック内に追加することで、さらに拡張できます。詳細については、[設定オプション](dokka-gradle-configuration-options.md)を参照してください。

### マルチプロジェクト設定

[マルチプロジェクトビルド](https://docs.gradle.org/current/userguide/multi_project_builds.html)は通常、いくつかのネストされた`build.gradle.kts`ファイルを含み、以下のような構造を持ちます。

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

シングルプロジェクトとマルチプロジェクトのドキュメントは、[トップレベルの`dokka {}` DSL](#single-project-configuration)を使用した同じ[設定モデル (configuration model)](Configuration model)を共有します。

マルチプロジェクトビルドでDokkaを設定するには、2つの方法があります。

* **[コンベンションプラグインによる共有設定](#shared-configuration-via-a-convention-plugin) (推奨)**: コンベンションプラグインを定義し、それをすべてのサブプロジェクトに適用します。これにより、Dokkaの設定が一元化されます。

* **[手動設定](#manual-configuration)**: Dokkaプラグインを適用し、同じ`dokka {}`ブロックを各サブプロジェクトで繰り返します。コンベンションプラグインは必要ありません。

サブプロジェクトを設定した後、複数のサブプロジェクトからのドキュメントを単一の出力に集約できます。詳細については、[マルチプロジェクトビルドでのドキュメント出力の集約](#aggregate-documentation-output-in-multi-project-builds)を参照してください。

> マルチプロジェクトの例については、[Dokka GitHubリポジトリ](https://github.com/Kotlin/dokka/tree/master/examples/gradle-v2/multimodule-example)を参照してください。
>
{style="tip"}

#### コンベンションプラグインによる共有設定

コンベンションプラグインを設定し、サブプロジェクトに適用するには、以下の手順に従ってください。

##### buildSrcディレクトリの設定

1. プロジェクトのルートに、2つのファイルを含む`buildSrc`ディレクトリを作成します。

    * `settings.gradle.kts`
    * `build.gradle.kts`

2. `buildSrc/settings.gradle.kts`ファイルに、以下のスニペットを追加します。

   ```kotlin
   rootProject.name = "buildSrc"
   ```

3. `buildSrc/build.gradle.kts`ファイルに、以下のスニペットを追加します。

    ```kotlin
    plugins {
        `kotlin-dsl`
    }
    
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
    
    dependencies {
        implementation("org.jetbrains.dokka:dokka-gradle-plugin:%dokkaVersion%")
    }   
    ```

##### Dokkaコンベンションプラグインの設定

`buildSrc`ディレクトリを設定した後、Dokkaコンベンションプラグインを設定します。

1. [コンベンションプラグイン](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:convention_plugins)をホストするために、`buildSrc/src/main/kotlin/dokka-convention.gradle.kts`ファイルを作成します。
2. `dokka-convention.gradle.kts`ファイルに、以下のスニペットを追加します。

    ```kotlin
    plugins {
        id("org.jetbrains.dokka") 
    }

    dokka {
        // The shared configuration goes here
    }
    ```

   `dokka {}`ブロック内に、すべてのサブプロジェクトに共通のDokka[設定](dokka-gradle-configuration-options.md)を追加する必要があります。また、Dokkaのバージョンを指定する必要はありません。バージョンは`buildSrc/build.gradle.kts`ファイルですでに設定されています。

##### コンベンションプラグインをサブプロジェクトに適用する

各サブプロジェクトの`build.gradle.kts`ファイルにDokkaコンベンションプラグインを追加して、サブプロジェクト全体に適用します。

```kotlin
plugins {
    id("dokka-convention")
}
```

#### 手動設定

プロジェクトでコンベンションプラグインを使用していない場合、同じ`dokka {}ブロック`を手動で各サブプロジェクトにコピーすることで、同じDokka設定パターンを再利用できます。

1. すべてのサブプロジェクトの`build.gradle.kts`ファイルにDokkaプラグインを適用します。

   ```kotlin
   plugins {
       id("org.jetbrains.dokka") version "%dokkaVersion%"
   }
   ```

2. 各サブプロジェクトの`dokka {}`ブロックで共有設定を宣言します。設定を一元化するコンベンションプラグインがないため、複数のサブプロジェクト間で必要な設定を複製します。詳細については、[設定オプション](dokka-gradle-configuration-options.md)を参照してください。

#### 親プロジェクトの設定

マルチプロジェクトビルドでは、ルートプロジェクトでドキュメント全体に適用される設定を構成できます。これには、出力フォーマット、出力ディレクトリ、ドキュメントのサブプロジェクト名、すべてのサブプロジェクトからのドキュメントの集約、およびその他の[設定オプション](dokka-gradle-configuration-options.md)の定義が含まれます。

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}

dokka {
    // Sets properties for the whole project
    dokkaPublications.html {
        moduleName.set("My Project")
        outputDirectory.set(layout.buildDirectory.dir("docs/html"))
        includes.from("README.md")
    }

    dokkaSourceSets.configureEach {
        documentedVisibilities.set(setOf(VisibilityModifier.Public)) // OR documentedVisibilities(VisibilityModifier.Public)    
    }
}

// Aggregates subproject documentation
dependencies {
    dokka(project(":childProjectA"))
    dokka(project(":childProjectB"))
}
```

さらに、各サブプロジェクトは、カスタム設定が必要な場合に独自の`dokka {}`ブロックを持つことができます。以下の例では、サブプロジェクトはDokkaプラグインを適用し、カスタムのサブプロジェクト名を設定し、その`README.md`ファイルから追加のドキュメントを含めます。

```kotlin
// subproject/build.gradle.kts
plugins {
    id("org.jetbrains.dokka")
}

dokka {
    dokkaPublications.html {
        moduleName.set("Child Project A")
        includes.from("README.md")
    }
}