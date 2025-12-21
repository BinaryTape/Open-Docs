[//]: # (title: Dokka Gradle設定オプション)

Dokkaには、ユーザーと読者のエクスペリエンスをカスタマイズするための多くの設定オプションがあります。

以下に、各設定セクションの詳細な説明といくつかの例を示します。[すべての設定オプション](#complete-configuration)が適用された例も参照できます。

シングルプロジェクトビルドおよびマルチプロジェクトビルドでの設定ブロックの適用方法の詳細については、[設定例](dokka-gradle.md#configuration-examples)を参照してください。

### 一般的な設定

以下は、一般的なDokka Gradleプラグイン設定の例です。

* トップレベルの`dokka {}` DSL設定を使用します。
* DGPでは、`dokkaPublications{}`ブロックでDokkaパブリケーション設定を宣言します。
* デフォルトのパブリケーションは[`html`](dokka-html.md)と[`javadoc`](dokka-javadoc.md)です。

* GradleのKotlin DSLは型安全なアクセサーを使用するため、`build.gradle.kts`ファイルの構文は、通常の`.kt`ファイル（Kotlinカスタムプラグインに使用されるものなど）とは異なります。

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}

dokka {
    dokkaPublications.html {
        moduleName.set(project.name)
        moduleVersion.set(project.version.toString())
        // Standard output directory for HTML documentation
        outputDirectory.set(layout.buildDirectory.dir("dokka/html"))
        failOnWarning.set(false)
        suppressInheritedMembers.set(false)
        suppressObviousFunctions.set(true)
        offlineMode.set(false)
        includes.from("packages.md", "extra.md")
        
        // Output directory for additional files
        // Use this block instead of the standard when you 
        // want to change the output directory and include extra files
        outputDirectory.set(rootDir.resolve("docs/api/0.x"))
        
        // Use fileTree to add multiple files
        includes.from(
            fileTree("docs") {
                include("**/*.md")
            }
        )
    }
}
```

ファイル操作の詳細については、[Gradleドキュメント](https://docs.gradle.org/current/userguide/working_with_files.html#sec:file_trees)を参照してください。

</tab>
<tab title="Kotlinカスタムプラグイン" group-key="kotlin custom">

```kotlin
// CustomPlugin.kt

import org.gradle.api.Plugin
import org.gradle.api.Project
import org.jetbrains.dokka.gradle.DokkaExtension

abstract class CustomPlugin : Plugin<Project> {
    override fun apply(project: Project) {
        project.plugins.apply("org.jetbrains.dokka")

        project.extensions.configure(DokkaExtension::class.java) { dokka ->
            
            dokka.moduleName.set(project.name)
            dokka.moduleVersion.set(project.version.toString())

            dokka.dokkaPublications.named("html") { publication ->
                // Standard output directory for HTML documentation
                publication.outputDirectory.set(project.layout.buildDirectory.dir("dokka/html"))
                publication.failOnWarning.set(true)
                publication.suppressInheritedMembers.set(true)
                publication.offlineMode.set(false)
                publication.suppressObviousFunctions.set(true)
                publication.includes.from("packages.md", "extra.md")

                // Output directory for additional files
                // Use this instead of the standard block when you 
                // want to change the output directory and include extra files
                html.outputDirectory.set(project.rootDir.resolve("docs/api/0.x"))
            }
        }
    }
}
```

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}

dokka {
    dokkaPublications {
        html {
            // Sets general module information
            moduleName.set(project.name)
            moduleVersion.set(project.version.toString())

            // Standard output directory for HTML documentation
            outputDirectory.set(layout.buildDirectory.dir("dokka/html"))

            // Core Dokka options
            failOnWarning.set(false)
            suppressInheritedMembers.set(false)
            suppressObviousFunctions.set(true)
            offlineMode.set(false)
            includes.from(files("packages.md", "extra.md"))

            // Output directory for additional files
            // Use this block instead of the standard when you want to 
            // change the output directory and include extra files
            outputDirectory.set(file("$rootDir/docs/api/0.x"))
        }
    }
}
```

</tab>
</tabs>

<deflist collapsible="true">
    <def title="moduleName">
        <p>
           プロジェクトのドキュメントの表示名です。目次、ナビゲーション、ヘッダー、ログメッセージに表示されます。マルチプロジェクトビルドでは、各サブプロジェクトの<code>moduleName</code>が集約されたドキュメントのセクションタイトルとして使用されます。
        </p>
        <p>デフォルト: Gradleプロジェクト名</p>
    </def>
    <def title="moduleVersion">
        <p>
            生成されるドキュメントに表示されるサブプロジェクトのバージョンです。
            シングルプロジェクトビルドでは、プロジェクトのバージョンとして使用されます。
            マルチプロジェクトビルドでは、ドキュメントを集約する際に各サブプロジェクトの<code>moduleVersion</code>が使用されます。
        </p>
        <p>デフォルト: Gradleプロジェクトバージョン</p>
    </def>
    <def title="outputDirectory">
        <p>生成されたドキュメントが保存されるディレクトリです。</p>
        <p>この設定は、<code>dokkaGenerate</code>タスクによって生成されるすべてのドキュメント形式（HTML、Javadocなど）に適用されます。</p>
        <p>デフォルト: <code>build/dokka/html</code></p>
        <p><b>追加ファイルの出力ディレクトリ</b></p>
        <p>シングルプロジェクトビルドとマルチプロジェクトビルドの両方で、出力ディレクトリを指定し、追加ファイルを含めることができます。
           マルチプロジェクトビルドの場合、
           ルートプロジェクトの設定で出力ディレクトリを設定し、追加ファイルを含めます。
        </p>
    </def>
    <def title="failOnWarning">
        <p>
            ドキュメント生成中に警告が発生した場合に、Dokkaがビルドを失敗させるかどうかを決定します。
            このプロセスは、すべてのエラーと警告が最初に出力されるまで待機します。
        </p>
        <p>この設定は<code>reportUndocumented</code>と連携してうまく機能します。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="suppressInheritedMembers">
        <p>特定のクラスで明示的にオーバーライドされていない継承されたメンバーを抑制するかどうか。</p>
        <p>
            注:
            これにより<code>equals</code>、<code>hashCode</code>、<code>toString</code>などの関数は抑制されますが、
            <code>dataClass.componentN</code>や<code>dataClass.copy</code>などの合成関数は抑制されません。
            それらについては<code>suppressObviousFunctions</code>を使用してください。
        </p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="suppressObviousFunctions">
        <p>自明な関数を抑制するかどうか。</p>
        <p>
            関数は次の場合に自明とみなされます:</p>
            <list>
                <li>
                    <code>kotlin.Any</code>、<code>Kotlin.Enum</code>、<code>java.lang.Object</code>、または
                    <code>java.lang.Enum</code>から継承されたもので、<code>equals</code>、<code>hashCode</code>、<code>toString</code>など。
                </li>
                <li>
                    合成（コンパイラによって生成された）であり、ドキュメントがないもの、<code>dataClass.componentN</code>や
                    <code>dataClass.copy</code>など。
                </li>
            </list>
        <p>デフォルト: <code>true</code></p>
    </def>
    <def title="offlineMode">
        <p>ネットワーク経由でリモートファイルやリンクを解決するかどうか。</p>
        <p>
            これには、外部ドキュメントへのリンク生成に使用されるパッケージリストが含まれます。
            たとえば、これにより、標準ライブラリのクラスをドキュメント内でクリック可能にできます。
        </p>
        <p>
            これを<code>true</code>に設定すると、特定のケースではビルド時間を大幅に短縮できますが、
            ユーザーエクスペリエンスを悪化させる可能性もあります。たとえば、
            標準ライブラリを含む、依存関係からのクラスおよびメンバーリンクを解決しないことによってです。
        </p>
        <p>注: 取得したファイルをローカルにキャッシュし、それらをローカルパスとしてDokkaに提供できます。
           <code><a href="#external-documentation-links-configuration">externalDocumentationLinks</a></code>セクションを参照してください。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
     <def title="includes">
        <p>
            <a href="dokka-module-and-package-docs.md">サブプロジェクトおよびパッケージドキュメント</a>を含むMarkdownファイルのリスト。Markdownファイルは<a href="dokka-module-and-package-docs.md#file-format">必要な形式</a>に一致する必要があります。
        </p>
        <p>指定されたファイルの内容は解析され、サブプロジェクトおよびパッケージの説明としてドキュメントに埋め込まれます。</p>
        <p>
            その外観と使用方法の例については、<a href="https://github.com/Kotlin/dokka/blob/master/examples/gradle-v2/basic-gradle-example/build.gradle.kts">Dokka Gradleの例</a>を参照してください。
        </p>
    </def>
</deflist>

### ソースセット設定

Dokkaでは、[Kotlinソースセット](https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets)のいくつかのオプションを設定できます。

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.gradle.engine.parameters.VisibilityModifier

dokka {
    // ..
    // General configuration section
    // ..

    // Source sets configuration
    dokkaSourceSets {
        // Example: Configuration exclusive to the 'linux' source set
        named("linux") {
            dependentSourceSets{named("native")}
            sourceRoots.from(file("linux/src"))
        }

        configureEach {
            suppress.set(false)
            displayName.set(name)
            documentedVisibilities.set(setOf(VisibilityModifier.Public)) // OR documentedVisibilities(VisibilityModifier.Public)
            reportUndocumented.set(false)
            skipEmptyPackages.set(true)
            skipDeprecated.set(false)
            suppressGeneratedFiles.set(true)
            jdkVersion.set(8)
            languageVersion.set("1.7")
            apiVersion.set("1.7")
            sourceRoots.from(file("src"))
            classpath.from(file("libs/dependency.jar"))
            samples.from("samples/Basic.kt", "samples/Advanced.kt")
           
            sourceLink {
                // Source link section
            }
            perPackageOption {
                // Package options section
            }
            externalDocumentationLinks {
                // External documentation links section
            }
        }
    }
}
```

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
import org.jetbrains.dokka.gradle.engine.parameters.VisibilityModifier

dokka {
    // ..
    // General configuration section
    // ..

    dokkaSourceSets {
        // Example: Configuration exclusive to the 'linux' source set
        named("linux") {
            dependentSourceSets { named("native") }
            sourceRoots.from(file("linux/src"))
        }

        configureEach {
            suppress.set(false)
            displayName.set(name)
            documentedVisibilities.set([VisibilityModifier.Public] as Set) // OR documentedVisibilities(VisibilityModifier.Public)
            reportUndocumented.set(false)
            skipEmptyPackages.set(true)
            skipDeprecated.set(false)
            suppressGeneratedFiles.set(true)
            jdkVersion.set(8)
            languageVersion.set("1.7")
            apiVersion.set("1.7")
            sourceRoots.from(file("src"))
            classpath.from(file("libs/dependency.jar"))
            samples.from("samples/Basic.kt", "samples/Advanced.kt")

            sourceLink {
                // Source link section
            }
            perPackageOption {
                // Package options section
            }
            externalDocumentationLinks {
                // External documentation links section
            }
        }
    }
}
```

</tab>
</tabs>

<deflist collapsible="true">
    <def title="suppress">
        <p>ドキュメント生成時にこのソースセットをスキップするかどうか。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="displayName">
        <p>このソースセットを参照するために使用される表示名。</p>
        <p>
            この名前は、外部（例えば、ドキュメント読者に表示されるソースセット名）と内部（例えば、<code>reportUndocumented</code>のログメッセージ）の両方で使用されます。
        </p>
        <p>デフォルトでは、Kotlin Gradleプラグインによって提供される情報から値が推論されます。</p>
    </def>
    <def title="documentedVisibilities">
        <p>Dokkaが生成されたドキュメントに含める可視性修飾子を定義します。</p>
        <p>
            <code>protected</code>、<code>internal</code>、<code>private</code>な宣言をドキュメント化したい場合、
            または<code>public</code>な宣言を除外して内部APIのみをドキュメント化したい場合に使用します。
        </p>
        <p>
            さらに、Dokkaの
            <a href="https://github.com/Kotlin/dokka/blob/v2.1.0/dokka-runners/dokka-gradle-plugin/src/main/kotlin/engine/parameters/HasConfigurableVisibilityModifiers.kt"><code>documentedVisibilities()</code>関数</a>
            を使用して、文書化された可視性を追加できます。
        </p>
        <p>これは個々のパッケージごとに設定できます。</p>
        <p>デフォルト: <code>VisibilityModifier.Public</code></p>
    </def>
    <def title="reportUndocumented">
        <p>
            <code>documentedVisibilities</code>およびその他のフィルターによってフィルタリングされた後、
            KDocのない目に見える文書化されていない宣言に関する警告を発するかどうか。
        </p>
        <p>この設定は<code>failOnWarning</code>と連携してうまく機能します。</p>
        <p>これは個々のパッケージごとに設定できます。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="skipEmptyPackages">
        <p>
            様々なフィルターが適用された後、可視な宣言を全く含まないパッケージをスキップするかどうか。
        </p>
        <p>
            例えば、<code>skipDeprecated</code>が<code>true</code>に設定されており、パッケージに非推奨の宣言のみが含まれている場合、
            そのパッケージは空であるとみなされます。
        </p>
        <p>デフォルト: <code>true</code></p>
    </def>
    <def title="skipDeprecated">
        <p><code>@Deprecated</code>アノテーションが付けられた宣言をドキュメント化するかどうか。</p>
        <p>これは個々のパッケージごとに設定できます。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="suppressGeneratedFiles">
        <p>生成されたファイルをドキュメント化するかどうか。</p>
        <p>
            生成されたファイルは<code>{project}/{buildDir}/generated</code>ディレクトリの下に存在すると予想されます。
        </p>
        <p>
            <code>true</code>に設定すると、そのディレクトリのすべてのファイルが実質的に
            <code>suppressedFiles</code>オプションに追加されるため、手動で設定できます。
        </p>
        <p>デフォルト: <code>true</code></p>
    </def>
    <def title="jdkVersion">
        <p>Java型の外部ドキュメントリンクを生成する際に使用するJDKバージョン。</p>
        <p>
            例えば、いくつかのパブリック宣言のシグネチャで<code>java.util.UUID</code>を使用し、
            このオプションが<code>8</code>に設定されている場合、Dokkaはそれに対して
            [JDK 8 Javadoc](https://docs.oracle.com/javase/8/docs/api/java/util/UUID.html)への外部ドキュメントリンクを生成します。
        </p>
        <p>デフォルト: `8`</p>
    </def>
    <def title="languageVersion">
        <p>
            解析および<a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a>
            環境の設定に使用される<a href="https://kotlinlang.org/docs/compatibility-modes.html">Kotlin言語バージョン</a>。
        </p>
        <p>デフォルトでは、Dokkaの組み込みコンパイラが利用できる最新の言語バージョンが使用されます。</p>
    </def>
    <def title="apiVersion">
        <p>
            解析および<a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a>
            環境の設定に使用される<a href="https://kotlinlang.org/docs/compatibility-modes.html">Kotlin APIバージョン</a>。
        </p>
        <p>デフォルトでは、<code>languageVersion</code>から推論されます。</p>
    </def>
    <def title="sourceRoots">
        <p>
            解析およびドキュメント化されるソースコードルート。
            許容される入力は、ディレクトリと個々の<code>.kt</code>および<code>.java</code>ファイルです。
        </p>
        <p>デフォルトでは、ソースルートはKotlin Gradleプラグインによって提供される情報から推論されます。</p>
    </def>
    <def title="classpath">
        <p>解析とインタラクティブなサンプル用のクラスパス。</p>
        <p>これは、依存関係から来るいくつかの型が解決されない、または自動的に認識されない場合に役立ちます。</p>
        <p>このオプションは<code>.jar</code>ファイルと<code>.klib</code>ファイルの両方を受け入れます。</p>
        <p>デフォルトでは、クラスパスはKotlin Gradleプラグインによって提供される情報から推論されます。</p>
    </def>
    <def title="samples">
        <p>
            <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a> KDocタグを介して参照されるサンプル関数を含むディレクトリまたはファイルのリスト。
        </p>
    </def>
</deflist>

### ソースリンク設定

読者がリモートリポジトリで各宣言のソースを見つけるのを助けるためにソースリンクを設定します。この設定には、`dokkaSourceSets.main {}`ブロックを使用します。

`sourceLinks {}`設定ブロックを使用すると、特定の行番号を持つ`remoteUrl`に繋がる`source`リンクを各シグネチャに追加できます。行番号は`remoteLineSuffix`を設定することで構成可能です。

例として、`kotlinx.coroutines`の[`count()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/count.html)関数のドキュメントを参照してください。

GradleのKotlin DSLは型安全なアクセサーを使用するため、`build.gradle.kts`ファイルの構文は、通常の`.kt`ファイル（カスタムGradleプラグインに使用されるものなど）とは異なります。

<tabs group="dokka-configuration">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

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
<tab title="Kotlinカスタムプラグイン" group-key="kotlin custom">

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
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
dokka {
    dokkaSourceSets {
        main {
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

<deflist collapsible="true">
    <def title="localDirectory">
        <p>
            ローカルソースディレクトリへのパス。このパスは現在のプロジェクトのルートからの相対パスでなければなりません。
        </p>
    </def>
    <def title="remoteUrl">
        <p>
            GitHub、GitLab、Bitbucketなど、ドキュメント読者がアクセスでき、ソースファイルに安定したURLを提供するソースコードホスティングサービスのURLです。このURLは、宣言のソースコードリンクを生成するために使用されます。
        </p>
    </def>
    <def title="remoteLineSuffix">
        <p>
            ソースコードの行番号をURLに付加するために使用されるサフィックスです。これにより、読者はファイルだけでなく、宣言の特定の行番号にも移動できるようになります。
        </p>
        <p>
            番号自体は指定されたサフィックスに付加されます。例えば、このオプションが<code>#L</code>に設定され、行番号が10の場合、結果のURLサフィックスは<code>#L10</code>になります。
        </p>
        <p>
            人気のあるサービスで使用されるサフィックス:
            <list>
                <li>GitHub: <code>#L</code></li>
                <li>GitLab: <code>#L</code></li>
                <li>Bitbucket: <code>#lines-</code></li>
            </list>
        <p>デフォルト: <code>#L</code></p>
    </def>
</deflist>

### パッケージオプション

`perPackageOption`設定ブロックを使用すると、`matchingRegex`に一致する特定のパッケージにいくつかのオプションを設定できます。

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.gradle.engine.parameters.VisibilityModifier

dokka {
    dokkaPublications.html {
        dokkaSourceSets.configureEach {
            perPackageOption {
                matchingRegex.set(".*api.*")
                suppress.set(false)
                skipDeprecated.set(false)
                reportUndocumented.set(false)
                documentedVisibilities.set(setOf(VisibilityModifier.Public)) // OR documentedVisibilities(VisibilityModifier.Public)
            }
        }
    }
}
```

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
import org.jetbrains.dokka.gradle.engine.parameters.VisibilityModifier

dokka {
    dokkaPublications {
        html {
            dokkaSourceSets.configureEach {
                perPackageOption {
                    matchingRegex.set(".*api.*")
                    suppress.set(false)
                    skipDeprecated.set(false)
                    reportUndocumented.set(false)
                    documentedVisibilities.set([VisibilityModifier.Public] as Set)
                }
            }
        }
    }
}
```

</tab>
</tabs>

<deflist collapsible="true">
    <def title="matchingRegex">
        <p>パッケージを照合するために使用される正規表現。</p>
        <p>デフォルト: <code>.*</code></p>
    </def>
    <def title="suppress">
        <p>ドキュメント生成時にパッケージをスキップするかどうか。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="skipDeprecated">
        <p><code>@Deprecated</code>アノテーションが付けられた宣言をドキュメント化するかどうか。</p>
        <p>これはソースセットレベルで構成できます。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="reportUndocumented">
        <p>
            <code>documentedVisibilities</code>およびその他のフィルターによってフィルタリングされた後、
            KDocのない目に見える文書化されていない宣言に関する警告を発するかどうか。
        </p>
        <p>この設定は<code>failOnWarning</code>と連携してうまく機能します。</p>
        <p>これはソースセットレベルで構成できます。</p>
        <p>デフォルト: <code>false</code></p>
    </def>
    <def title="documentedVisibilities">
        <p>Dokkaが生成されたドキュメントに含める可視性修飾子を定義します。</p>
        <p>
            このパッケージ内で<code>protected</code>、<code>internal</code>、<code>private</code>な宣言をドキュメント化したい場合、
            または<code>public</code>な宣言を除外して内部APIのみをドキュメント化したい場合に使用します。
        </p>
        <p>
            さらに、Dokkaの
            <a href="https://github.com/Kotlin/dokka/blob/v2.0.0/dokka-runners/dokka-gradle-plugin/src/main/kotlin/engine/parameters/HasConfigurableVisibilityModifiers.kt#L14-L16"><code>documentedVisibilities()</code>関数</a>
            を使用して、文書化された可視性を追加できます。
        </p>
        <p>これはソースセットレベルで構成できます。</p>
        <p>デフォルト: <code>VisibilityModifier.Public</code></p>
    </def>
</deflist>

### 外部ドキュメントリンク設定

`externalDocumentationLinks {}`ブロックを使用すると、依存関係の外部ホスト型ドキュメントに繋がるリンクを作成できます。

例えば、`kotlinx.serialization`の型を使用している場合、デフォルトではドキュメント内でクリックできません。未解決であるかのように表示されます。しかし、`kotlinx.serialization`のAPIリファレンスドキュメントはDokkaによって構築され、[kotlinlang.org](https://kotlinlang.org/api/kotlinx.serialization/)で公開されているため、それに対して外部ドキュメントリンクを設定できます。これによりDokkaはライブラリの型に対するリンクを生成し、それらを正常に解決してクリック可能にします。

デフォルトでは、Kotlin標準ライブラリ、JDK、Android SDK、AndroidXの外部ドキュメントリンクが構成されています。

各リンクを定義するために`register()`メソッドを使用して外部ドキュメントリンクを登録します。`externalDocumentationLinks` APIは、Gradle DSLの慣例に沿ってこのメソッドを使用します。

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

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

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
dokka {
    dokkaSourceSets.configureEach {
        externalDocumentationLinks.register("example-docs") {
            url.set(new URI("https://example.com/docs/"))
            packageListUrl.set(new URI("https://example.com/docs/package-list"))
        }
    }
}
```

</tab>
</tabs>

<deflist collapsible="true">
    <def title="url">
        <p>リンク先のドキュメントのルートURL。末尾にスラッシュを含める<b>必要があります</b>。</p>
        <p>
            Dokkaは、指定されたURLの<code>package-list</code>を自動的に見つけ、
            宣言を相互にリンクするために最善を尽くします。
        </p>
        <p>
            自動解決が失敗した場合、または代わりにローカルキャッシュされたファイルを使用したい場合は、
            <code>packageListUrl</code>オプションを設定することを検討してください。
        </p>
    </def>
    <def title="packageListUrl">
        <p>
            <code>package-list</code>の正確な場所。これは、Dokkaが自動的に解決することに頼る代替手段です。
        </p>
        <p>
            パッケージリストには、サブプロジェクト名やパッケージ名など、ドキュメントとプロジェクト自体に関する情報が含まれています。
        </p>
        <p>これは、ネットワーク呼び出しを避けるためのローカルキャッシュファイルにすることもできます。</p>
    </def>
</deflist>

### 完全な設定

以下に、可能なすべての設定オプションが同時に適用された例を示します。

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.gradle.engine.parameters.VisibilityModifier

plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}

dokka {
    dokkaPublications.html {
        moduleName.set(project.name)
        moduleVersion.set(project.version.toString())
        outputDirectory.set(layout.buildDirectory.dir("dokka/html"))
        failOnWarning.set(false)
        suppressInheritedMembers.set(false)
        suppressObviousFunctions.set(true)
        offlineMode.set(false)
        includes.from("packages.md", "extra.md")
   }

    dokkaSourceSets {
        // Example: Configuration exclusive to the 'linux' source set
        named("linux") {
            dependentSourceSets{named("native")}
            sourceRoots.from(file("linux/src"))
        }

        configureEach {
            suppress.set(false)
            displayName.set(name)
            documentedVisibilities.set(setOf(VisibilityModifier.Public)) // OR documentedVisibilities(VisibilityModifier.Public)
            reportUndocumented.set(false)
            skipEmptyPackages.set(true)
            skipDeprecated.set(false)
            suppressGeneratedFiles.set(true)
            jdkVersion.set(8)
            languageVersion.set("1.7")
            apiVersion.set("1.7")
            sourceRoots.from(file("src"))
            classpath.from(file("libs/dependency.jar"))
            samples.from("samples/Basic.kt", "samples/Advanced.kt")

            sourceLink {
                localDirectory.set(file("src/main/kotlin"))
                remoteUrl("https://example.com/src")
                remoteLineSuffix.set("#L")
            }

            externalDocumentationLinks {
                url = URL("https://example.com/docs/")
                packageListUrl = File("/path/to/package-list").toURI().toURL()
            }

            perPackageOption {
                matchingRegex.set(".*api.*")
                suppress.set(false)
                skipDeprecated.set(false)
                reportUndocumented.set(false)
                documentedVisibilities.set(
                    setOf(
                        VisibilityModifier.Public,
                        VisibilityModifier.Private,
                        VisibilityModifier.Protected,
                        VisibilityModifier.Internal,
                        VisibilityModifier.Package
                    )
                )
            }
        }
    }
}
```

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
import org.jetbrains.dokka.gradle.engine.parameters.VisibilityModifier

plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}

dokka {
    dokkaPublications {
        html {
            moduleName.set(project.name)
            moduleVersion.set(project.version.toString())
            outputDirectory.set(layout.buildDirectory.dir("dokka/html"))
            failOnWarning.set(false)
            suppressInheritedMembers.set(false)
            suppressObviousFunctions.set(true)
            offlineMode.set(false)
            includes.from("packages.md", "extra.md")
        }
    }

    dokkaSourceSets {
        // Example: Configuration exclusive to the 'linux' source set
        named("linux") {
            dependentSourceSets { named("native") }
            sourceRoots.from(file("linux/src"))
        }

        configureEach {
            suppress.set(false)
            displayName.set(name)
            documentedVisibilities.set([VisibilityModifier.Public] as Set)
            reportUndocumented.set(false)
            skipEmptyPackages.set(true)
            skipDeprecated.set(false)
            suppressGeneratedFiles.set(true)
            jdkVersion.set(8)
            languageVersion.set("1.7")
            apiVersion.set("1.7")
            sourceRoots.from(file("src"))
            classpath.from(file("libs/dependency.jar"))
            samples.from("samples/Basic.kt", "samples/Advanced.kt")

            sourceLink {
                localDirectory.set(file("src/main/kotlin"))
                remoteUrl.set(new URI("https://example.com/src"))
                remoteLineSuffix.set("#L")
            }

            externalDocumentationLinks {
                url.set(new URI("https://example.com/docs/"))
                packageListUrl.set(new File("/path/to/package-list").toURI().toURL())
            }

            perPackageOption {
                matchingRegex.set(".*api.*")
                suppress.set(false)
                skipDeprecated.set(false)
                reportUndocumented.set(false)
                documentedVisibilities.set([
                        VisibilityModifier.Public,
                        VisibilityModifier.Private,
                        VisibilityModifier.Protected,
                        VisibilityModifier.Internal,
                        VisibilityModifier.Package
                ] as Set)
            }
        }
    }
}
```

</tab>
</tabs>