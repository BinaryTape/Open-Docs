[//]: # (title: Dokka Gradle 設定オプション)

Dokka には、開発者や読者の体験をカスタマイズするための多くの設定オプションがあります。

以下に、各設定セクションの詳細な説明といくつかの例を示します。
また、[すべての設定オプション](#complete-configuration)を適用した例も確認できます。

シングルプロジェクトおよびマルチプロジェクトビルドでの設定ブロックの適用に関する詳細は、
[設定例](dokka-gradle.md#configuration-examples)を参照してください。

### 一般設定 (General configuration)

以下は、一般的な Dokka Gradle プラグインの設定例です。

* トップレベルの `dokka {}` DSL 設定を使用します。
* DGP（Dokka Gradle Plugin）では、`dokkaPublications{}` ブロックで Dokka のパブリケーション設定を宣言します。
* デフォルトのパブリケーションは [`html`](dokka-html.md) と [`javadoc`](dokka-javadoc.md) です。

* `build.gradle.kts` ファイルの構文は、通常の `.kt` ファイル（Kotlin カスタムプラグインなどで使用されるもの）とは異なります。これは、Gradle の Kotlin DSL が型安全なアクセサを使用するためです。

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
        // HTMLドキュメントの標準出力ディレクトリ
        outputDirectory.set(layout.buildDirectory.dir("dokka/html"))
        failOnWarning.set(false)
        suppressInheritedMembers.set(false)
        suppressObviousFunctions.set(true)
        offlineMode.set(false)
        includes.from("packages.md", "extra.md")
        
        // 追加ファイル用の出力ディレクトリ
        // 出力ディレクトリを変更し、追加ファイルを含めたい場合は
        // 標準のブロックの代わりにこのブロックを使用します
        outputDirectory.set(rootDir.resolve("docs/api/0.x"))
        
        // fileTree を使用して複数のファイルを追加する
        includes.from(
            fileTree("docs") {
                include("**/*.md")
            }
        )
    }
}
```

ファイル操作に関する詳細は、[Gradle ドキュメント](https://docs.gradle.org/current/userguide/working_with_files.html#sec:file_trees)を参照してください。

</tab>
<tab title="Kotlin custom plugin" group-key="kotlin custom">

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
                // HTMLドキュメントの標準出力ディレクトリ
                publication.outputDirectory.set(project.layout.buildDirectory.dir("dokka/html"))
                publication.failOnWarning.set(true)
                publication.suppressInheritedMembers.set(true)
                publication.offlineMode.set(false)
                publication.suppressObviousFunctions.set(true)
                publication.includes.from("packages.md", "extra.md")

                // 追加ファイル用の出力ディレクトリ
                // 出力ディレクトリを変更し、追加ファイルを含めたい場合は
                // 標準のブロックの代わりにこれを使用します
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
            // 一般的なモジュール情報を設定
            moduleName.set(project.name)
            moduleVersion.set(project.version.toString())

            // HTMLドキュメントの標準出力ディレクトリ
            outputDirectory.set(layout.buildDirectory.dir("dokka/html"))

            // Dokka のコアオプション
            failOnWarning.set(false)
            suppressInheritedMembers.set(false)
            suppressObviousFunctions.set(true)
            offlineMode.set(false)
            includes.from(files("packages.md", "extra.md"))

            // 追加ファイル用の出力ディレクトリ
            // 出力ディレクトリを変更し、追加ファイルを含めたい場合は
            // 標準のブロックの代わりにこのブロックを使用します
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
           プロジェクトドキュメントの表示名です。目次、ナビゲーション、ヘッダー、およびログメッセージに表示されます。マルチプロジェクトビルドでは、各サブプロジェクトの <code>moduleName</code> が集約ドキュメントのセクションタイトルとして使用されます。
        </p>
        <p>デフォルト：Gradle プロジェクト名</p>
    </def>
    <def title="moduleVersion">
        <p>
            生成されたドキュメントに表示されるサブプロジェクトのバージョンです。
            シングルプロジェクトビルドでは、プロジェクトのバージョンとして使用されます。
            マルチプロジェクトビルドでは、ドキュメントを集約する際に各サブプロジェクトの <code>moduleVersion</code> が使用されます。
        </p>
        <p>デフォルト：Gradle プロジェクトのバージョン</p>
    </def>
    <def title="outputDirectory">
        <p>生成されたドキュメントが保存されるディレクトリです。</p>
        <p>この設定は、<code>dokkaGenerate</code> タスクによって生成されるすべてのドキュメント形式（HTML、Javadoc など）に適用されます。</p>
        <p>デフォルト：<code>build/dokka/html</code></p>
        <p><b>追加ファイル用の出力ディレクトリ</b></p>
        <p>シングルプロジェクトおよびマルチプロジェクトビルドの両方で、出力ディレクトリを指定し、追加ファイルを含めることができます。
           マルチプロジェクトビルドの場合は、ルートプロジェクトの設定で出力ディレクトリを設定し、追加ファイルを含めます。
        </p>
    </def>
    <def title="failOnWarning">
        <p>
            ドキュメント生成中に警告が発生したときに、Dokka がビルドを失敗させるかどうかを決定します。
            処理は、すべてのエラーと警告が最初に出力されるまで待機します。
        </p>
        <p>この設定は <code>reportUndocumented</code> と組み合わせて使用すると効果的です。</p>
        <p>デフォルト：<code>false</code></p>
    </def>
    <def title="suppressInheritedMembers">
        <p>特定のクラスで明示的にオーバーライドされていない継承メンバーを抑制するかどうかを指定します。</p>
        <p>
            注：
            これは <code>equals</code>、<code>hashCode</code>、<code>toString</code> などの関数を抑制しますが、<code>dataClass.componentN</code> や <code>dataClass.copy</code> などの合成関数は抑制しません。
            それらを抑制するには <code>suppressObviousFunctions</code> を使用してください。
        </p>
        <p>デフォルト：<code>false</code></p>
    </def>
    <def title="suppressObviousFunctions">
        <p>明白な関数（obvious functions）を抑制するかどうかを指定します。</p>
        <p>
            以下の条件に当てはまる場合、その関数は明白であるとみなされます：</p>
            <list>
                <li>
                    <code>kotlin.Any</code>、<code>Kotlin.Enum</code>、<code>java.lang.Object</code>、または <code>java.lang.Enum</code> から継承されており、<code>equals</code>、<code>hashCode</code>、<code>toString</code> などである場合。
                </li>
                <li>
                    合成（コンパイラによって生成）されており、ドキュメントがない場合（<code>dataClass.componentN</code> や <code>dataClass.copy</code> など）。
                </li>
            </list>
        <p>デフォルト：<code>true</code></p>
    </def>
    <def title="offlineMode">
        <p>リモートファイルやリンクをネットワーク経由で解決するかどうかを指定します。</p>
        <p>
            これには、外部ドキュメントへのリンクを生成するために使用される package-lists が含まれます。
            たとえば、これにより標準ライブラリのクラスをドキュメント内でクリック可能にすることができます。
        </p>
        <p>
            これを <code>true</code> に設定すると、特定の場合にビルド時間を大幅に短縮できますが、ユーザー体験が悪化する可能性もあります。
            たとえば、標準ライブラリを含む依存関係からのクラスやメンバーのリンクが解決されなくなります。
        </p>
        <p>注：取得したファイルをローカルにキャッシュし、ローカルパスとして Dokka に提供することができます。<code><a href="#external-documentation-links-configuration">externalDocumentationLinks</a></code> セクションを参照してください。</p>
        <p>デフォルト：<code>false</code></p>
    </def>
     <def title="includes">
        <p>
            <a href="dokka-module-and-package-docs.md">サブプロジェクトおよびパッケージのドキュメント</a>を含む Markdown ファイルのリストです。Markdown ファイルは<a href="dokka-module-and-package-docs.md#file-format">要求される形式</a>に一致している必要があります。
        </p>
        <p>指定されたファイルの内容は解析され、サブプロジェクトやパッケージの説明としてドキュメントに埋め込まれます。</p>
        <p>
            外観や使用方法の例については、<a href="https://github.com/Kotlin/dokka/blob/master/examples/gradle-v2/basic-gradle-example/build.gradle.kts">Dokka Gradle の例</a>を参照してください。
        </p>
    </def>
</deflist>

### ソースセット設定 (Source set configuration)

Dokka では、[Kotlin ソースセット](https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets)に対していくつかのオプションを設定できます：

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.gradle.engine.parameters.VisibilityModifier

dokka {
    // ..
    // 一般設定セクション
    // ..

    // ソースセット設定
    dokkaSourceSets {
        // 例：'linux' ソースセット専用の設定
        named("linux") {
            dependentSourceSets{named("native")}
            sourceRoots.from(file("linux/src"))
        }

        configureEach {
            suppress.set(false)
            displayName.set(name)
            documentedVisibilities.set(setOf(VisibilityModifier.Public)) // または documentedVisibilities(VisibilityModifier.Public)
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
                // ソースリンクセクション
            }
            perPackageOption {
                // パッケージオプションセクション
            }
            externalDocumentationLinks {
                // 外部ドキュメントリンクセクション
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
    // 一般設定セクション
    // ..

    dokkaSourceSets {
        // 例：'linux' ソースセット専用の設定
        named("linux") {
            dependentSourceSets { named("native") }
            sourceRoots.from(file("linux/src"))
        }

        configureEach {
            suppress.set(false)
            displayName.set(name)
            documentedVisibilities.set([VisibilityModifier.Public] as Set) // または documentedVisibilities(VisibilityModifier.Public)
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
                // ソースリンクセクション
            }
            perPackageOption {
                // パッケージオプションセクション
            }
            externalDocumentationLinks {
                // 外部ドキュメントリンクセクション
            }
        }
    }
}
```

</tab>
</tabs>

<deflist collapsible="true">
    <def title="suppress">
        <p>ドキュメント生成時にこのソースセットをスキップするかどうかを指定します。</p>
        <p>デフォルト：<code>false</code></p>
    </def>
    <def title="displayName">
        <p>このソースセットを参照するために使用される表示名です。</p>
        <p>
            この名前は、外部（ドキュメントの読者に表示されるソースセット名など）と内部（<code>reportUndocumented</code> のログメッセージなど）の両方で使用されます。
        </p>
        <p>デフォルトでは、Kotlin Gradle プラグインから提供される情報に基づいて値が推論されます。</p>
    </def>
    <def title="documentedVisibilities">
        <p>Dokka が生成されたドキュメントに含めるべき可視性修飾子を定義します。</p>
        <p>
            <code>protected</code>、<code>internal</code>、<code>private</code> の宣言をドキュメント化したい場合や、<code>public</code> 宣言を除外して内部 API のみをドキュメント化したい場合に使用します。
        </p>
        <p>
            さらに、Dokka の 
            <a href="https://github.com/Kotlin/dokka/blob/v2.1.0/dokka-runners/dokka-gradle-plugin/src/main/kotlin/engine/parameters/HasConfigurableVisibilityModifiers.kt"><code>documentedVisibilities()</code> 関数</a> 
            を使用して、ドキュメント化する可視性を追加することもできます。
        </p>
        <p>これはパッケージごとに個別に設定することも可能です。</p>
        <p>デフォルト：<code>VisibilityModifier.Public</code></p>
    </def>
    <def title="reportUndocumented">
        <p>
            <code>documentedVisibilities</code> やその他のフィルタによってフィルタリングされた後、KDoc のない公開された宣言について警告を出すかどうかを指定します。
        </p>
        <p>この設定は <code>failOnWarning</code> と組み合わせて使用すると効果的です。</p>
        <p>これはパッケージごとに個別に設定することも可能です。</p>
        <p>デフォルト：<code>false</code></p>
    </def>
    <def title="skipEmptyPackages">
        <p>
            各種フィルタが適用された後に、公開された宣言を含まないパッケージをスキップするかどうかを指定します。
        </p>
        <p>
            たとえば、<code>skipDeprecated</code> が <code>true</code> に設定されており、パッケージに非推奨（deprecated）の宣言しか含まれていない場合、そのパッケージは空であるとみなされます。
        </p>
        <p>デフォルト：<code>true</code></p>
    </def>
    <def title="skipDeprecated">
        <p><code>@Deprecated</code> アノテーションが付いた宣言をドキュメント化するかどうかを指定します。</p>
        <p>これはパッケージごとに個別に設定することも可能です。</p>
        <p>デフォルト：<code>false</code></p>
    </def>
    <def title="suppressGeneratedFiles">
        <p>生成されたファイルをドキュメント化するかどうかを指定します。</p>
        <p>
            生成されたファイルは <code>{project}/{buildDir}/generated</code> ディレクトリの下にあることが期待されます。
        </p>
        <p>
            <code>true</code> に設定すると、そのディレクトリにあるすべてのファイルが <code>suppressedFiles</code> オプションに実質的に追加されます。手動で設定することも可能です。
        </p>
        <p>デフォルト：<code>true</code></p>
    </def>
    <def title="jdkVersion">
        <p>Java 型の外部ドキュメントリンクを生成する際に使用する JDK バージョンです。</p>
        <p>
            たとえば、公開された宣言のシグネチャで <code>java.util.UUID</code> を使用しており、このオプションが <code>8</code> に設定されている場合、Dokka はそれに対して <a href="https://docs.oracle.com/javase/8/docs/api/java/util/UUID.html">JDK 8 Javadoc</a> への外部ドキュメントリンクを生成します。
        </p>
        <p>デフォルト：`8`</p>
    </def>
    <def title="languageVersion">
        <p>
            解析および <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a> 環境の設定に使用される <a href="https://kotlinlang.org/docs/compatibility-modes.html">Kotlin 言語バージョン</a>です。
        </p>
        <p>デフォルトでは、Dokka の組み込みコンパイラで利用可能な最新の言語バージョンが使用されます。</p>
    </def>
    <def title="apiVersion">
        <p>
            解析および <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a> 環境の設定に使用される <a href="https://kotlinlang.org/docs/compatibility-modes.html">Kotlin API バージョン</a>です。
        </p>
        <p>デフォルトでは、<code>languageVersion</code> から推論されます。</p>
    </def>
    <def title="sourceRoots">
        <p>
            解析およびドキュメント化されるソースコードのルートです。
            入力としてディレクトリ、および個別の <code>.kt</code>、<code>.java</code> ファイルを受け付けます。
        </p>
        <p>デフォルトでは、Kotlin Gradle プラグインから提供される情報に基づいてソースルートが推論されます。</p>
    </def>
    <def title="classpath">
        <p>解析およびインタラクティブサンプルのためのクラスパスです。</p>
        <p>依存関係にある一部の型が自動的に解決されなかったり、取得できなかったりする場合に便利です。</p>
        <p>このオプションは <code>.jar</code> ファイルと <code>.klib</code> ファイルの両方を受け付けます。</p>
        <p>デフォルトでは、Kotlin Gradle プラグインから提供される情報に基づいてクラスパスが推論されます。</p>
    </def>
    <def title="samples">
        <p>
            <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a> KDoc タグを介して参照されるサンプル関数を含むディレクトリまたはファイルのリストです。
        </p>
    </def>
</deflist>

### ソースリンク設定 (Source link configuration)

ソースリンクを設定して、読者がリモートリポジトリ内の各宣言のソースを見つけられるようにします。
この設定には `dokkaSourceSets.main {}` ブロックを使用します。

`sourceLinks {}` 設定ブロックを使用すると、各シグネチャに特定の行番号を持つ `remoteUrl` への `source` リンクを追加できます。
行番号は `remoteLineSuffix` を設定することでカスタマイズ可能です。

例として、`kotlinx.coroutines` の [`count()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/count.html) 関数のドキュメントを参照してください。

`build.gradle.kts` ファイルの構文は、通常の `.kt` ファイル（カスタム Gradle プラグインなどで使用されるもの）とは異なります。これは、Gradle の Kotlin DSL が型安全なアクセサを使用するためです。

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
<tab title="Kotlin custom plugin" group-key="kotlin custom">

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
            ローカルソースディレクトリへのパスです。パスは現在のプロジェクトのルートからの相対パスである必要があります。
        </p>
    </def>
    <def title="remoteUrl">
        <p>
            GitHub、GitLab、Bitbucket、またはソースファイルへの不変な URL を提供するホスティングサービスなど、ドキュメントの読者がアクセスできるソースコードホスティングサービスの URL です。この URL は、宣言のソースコードリンクを生成するために使用されます。
        </p>
    </def>
    <def title="remoteLineSuffix">
        <p>
            URL にソースコードの行番号を付加するために使用されるサフィックスです。これにより、読者はファイルだけでなく、宣言の特定の行番号までナビゲートできるようになります。
        </p>
        <p>
            番号自体は指定されたサフィックスの後に追加されます。たとえば、このオプションが <code>#L</code> に設定されており、行番号が 10 の場合、結果の URL サフィックスは <code>#L10</code> になります。
        </p>
        <p>
            一般的なサービスで使用されるサフィックス：</p>
            <list>
                <li>GitHub: <code>#L</code></li>
                <li>GitLab: <code>#L</code></li>
                <li>Bitbucket: <code>#lines-</code></li>
            </list>
        <p>デフォルト：<code>#L</code></p>
    </def>
</deflist>

### パッケージオプション (Package options)

`perPackageOption` 設定ブロックを使用すると、`matchingRegex` に一致する特定のパッケージに対していくつかのオプションを設定できます：

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
                documentedVisibilities.set(setOf(VisibilityModifier.Public)) // または documentedVisibilities(VisibilityModifier.Public)
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
        <p>パッケージのマッチングに使用される正規表現です。</p>
        <p>デフォルト：<code>.*</code></p>
    </def>
    <def title="suppress">
        <p>ドキュメント生成時にそのパッケージをスキップするかどうかを指定します。</p>
        <p>デフォルト：<code>false</code></p>
    </def>
    <def title="skipDeprecated">
        <p><code>@Deprecated</code> アノテーションが付いた宣言をドキュメント化するかどうかを指定します。</p>
        <p>これはソースセットレベルで設定することも可能です。</p>
        <p>デフォルト：<code>false</code></p>
    </def>
    <def title="reportUndocumented">
        <p>
            <code>documentedVisibilities</code> やその他のフィルタによってフィルタリングされた後、KDoc のない公開された宣言について警告を出すかどうかを指定します。
        </p>
        <p>この設定は <code>failOnWarning</code> と組み合わせて使用すると効果的です。</p>
        <p>これはソースセットレベルで設定することも可能です。</p>
        <p>デフォルト：<code>false</code></p>
    </def>
    <def title="documentedVisibilities">
        <p>Dokka が生成されたドキュメントに含めるべき可視性修飾子を定義します。</p>
        <p>
            このパッケージ内の <code>protected</code>、<code>internal</code>、<code>private</code> の宣言をドキュメント化したい場合や、<code>public</code> 宣言を除外して内部 API のみをドキュメント化したい場合に使用します。
        </p>
        <p>
            さらに、Dokka の 
            <a href="https://github.com/Kotlin/dokka/blob/v2.0.0/dokka-runners/dokka-gradle-plugin/src/main/kotlin/engine/parameters/HasConfigurableVisibilityModifiers.kt#L14-L16"><code>documentedVisibilities()</code> 関数</a> 
            を使用して、ドキュメント化する可視性を追加することもできます。
        </p>
        <p>これはソースセットレベルで設定することも可能です。</p>
        <p>デフォルト：<code>VisibilityModifier.Public</code></p>
    </def>
</deflist>

### 外部ドキュメントリンクの設定 (External documentation links configuration)

`externalDocumentationLinks {}` ブロックを使用すると、依存関係にある外部でホストされているドキュメントへのリンクを作成できます。

たとえば、`kotlinx.serialization` の型を使用している場合、デフォルトではそれらは解決されていないものとしてドキュメント内でクリック可能になりません。しかし、`kotlinx.serialization` の API リファレンスドキュメントは Dokka によって構築され、[kotlinlang.org で公開されている](https://kotlinlang.org/api/kotlinx.serialization/)ため、それに対する外部ドキュメントリンクを設定できます。これにより、Dokka はライブラリの型に対するリンクを生成し、正常に解決してクリック可能にすることができます。

デフォルトでは、Kotlin 標準ライブラリ、JDK、Android SDK、および AndroidX の外部ドキュメントリンクが設定されています。

`register()` メソッドを使用して各リンクを定義し、外部ドキュメントリンクを登録します。`externalDocumentationLinks` API は、Gradle DSL の慣習に従ってこのメソッドを使用します：

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
        <p>リンク先となるドキュメントのルート URL です。末尾にスラッシュが<b>含まれている必要があります</b>。</p>
        <p>
            Dokka は、指定された URL に対して <code>package-list</code> を自動的に見つけ、宣言を互いにリンクさせるよう最善を尽くします。
        </p>
        <p>
            自動解決が失敗した場合や、代わりにローカルにキャッシュされたファイルを使用したい場合は、<code>packageListUrl</code> オプションの設定を検討してください。
        </p>
    </def>
    <def title="packageListUrl">
        <p>
            <code>package-list</code> の正確な場所です。これは、Dokka による自動解決に頼る代わりの方法です。
        </p>
        <p>
            パッケージリストには、サブプロジェクトやパッケージ名など、ドキュメントとプロジェクト自体に関する情報が含まれています。
        </p>
        <p>ネットワーク呼び出しを避けるために、ローカルにキャッシュされたファイルにすることも可能です。</p>
    </def>
</deflist>

### 全設定の例 (Complete configuration)

以下に、考えられるすべての設定オプションを同時に適用した例を示します：

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
        // 例：'linux' ソースセット専用の設定
        named("linux") {
            dependentSourceSets{named("native")}
            sourceRoots.from(file("linux/src"))
        }

        configureEach {
            suppress.set(false)
            displayName.set(name)
            documentedVisibilities.set(setOf(VisibilityModifier.Public)) // または documentedVisibilities(VisibilityModifier.Public)
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
        // 例：'linux' ソースセット専用の設定
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