[//]: # (title: Dokka Gradle 配置選項)

Dokka 提供了許多配置選項，讓您可以自訂您和讀者的體驗。

下方是每個配置區塊的詳細說明和一些範例。您也可以找到一個應用了[所有配置選項](#complete-configuration)的範例。

有關如何將配置區塊應用於單一專案和多專案建構的更多詳細資訊，請參閱[配置範例](dokka-gradle.md#configuration-examples)。

### 一般配置

以下是一般 Dokka Gradle 外掛程式配置的範例：

*   使用頂層的 `dokka {}` DSL 配置。
*   在 DGP (Dokka Gradle Plugin) 中，您在 `dokkaPublications{}` 區塊中宣告 Dokka 的發布配置。
*   預設發布類型是 [`html`](dokka-html.md) 和 [`javadoc`](dokka-javadoc.md)。

*   `build.gradle.kts` 檔案的語法與一般的 `.kt` 檔案（例如用於 Kotlin 自訂外掛程式的檔案）不同，因為 Gradle 的 Kotlin DSL 使用型別安全存取器。

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
        // 標準 HTML 文件輸出目錄
        outputDirectory.set(layout.buildDirectory.dir("dokka/html"))
        failOnWarning.set(false)
        suppressInheritedMembers.set(false)
        suppressObviousFunctions.set(true)
        offlineMode.set(false)
        includes.from("packages.md", "extra.md")
        
        // 額外檔案的輸出目錄
        // 當您想要更改輸出目錄並包含額外檔案時，請使用此區塊而不是標準區塊
        outputDirectory.set(rootDir.resolve("docs/api/0.x"))
        
        // 使用 fileTree 添加多個檔案
        includes.from(
            fileTree("docs") {
                include("**/*.md")
            }
        )
    }
}
```

有關檔案操作的更多資訊，請參閱 [Gradle 文件](https://docs.gradle.org/current/userguide/working_with_files.html#sec:file_trees)。

</tab>
<tab title="Kotlin 自訂外掛程式" group-key="kotlin custom">

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
                // 標準 HTML 文件輸出目錄
                publication.outputDirectory.set(project.layout.buildDirectory.dir("dokka/html"))
                publication.failOnWarning.set(true)
                publication.suppressInheritedMembers.set(true)
                publication.offlineMode.set(false)
                publication.suppressObviousFunctions.set(true)
                publication.includes.from("packages.md", "extra.md")

                // 額外檔案的輸出目錄
                // 當您想要更改輸出目錄並包含額外檔案時，請使用此區塊而不是標準區塊
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
            // 設定一般模組資訊
            moduleName.set(project.name)
            moduleVersion.set(project.version.toString())

            // 標準 HTML 文件輸出目錄
            outputDirectory.set(layout.buildDirectory.dir("dokka/html"))

            // Dokka 核心選項
            failOnWarning.set(false)
            suppressInheritedMembers.set(false)
            suppressObviousFunctions.set(true)
            offlineMode.set(false)
            includes.from(files("packages.md", "extra.md"))

            // 額外檔案的輸出目錄
            // 當您想要更改輸出目錄並包含額外檔案時，請使用此區塊而不是標準區塊
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
           專案文件的顯示名稱。它會出現在目錄、導覽、標題和記錄訊息中。在多專案建構中，每個子專案的 <code>moduleName</code> 會用作其在聚合文件中的區塊標題。
        </p>
        <p>預設值：Gradle 專案名稱</p>
    </def>
    <def title="moduleVersion">
        <p>
            產生文件中顯示的子專案版本。在單一專案建構中，它用作專案版本。在多專案建構中，當聚合文件時，會使用每個子專案的 <code>moduleVersion</code>。
        </p>
        <p>預設值：Gradle 專案版本</p>
    </def>
    <def title="outputDirectory">
        <p>產生文件儲存的目錄。</p>
        <p>此設定適用於由 <code>dokkaGenerate</code> 任務產生的所有文件格式 (HTML, Javadoc 等)。</p>
        <p>預設值：<code>build/dokka/html</code></p>
        <p><b>額外檔案的輸出目錄</b></p>
        <p>您可以為單一專案和多專案建構指定輸出目錄並包含額外檔案。對於多專案建構，請在根專案的配置中設定輸出目錄並包含額外檔案。</p>
    </def>
    <def title="failOnWarning">
        <p>
            決定在文件產生過程中發生警告時，Dokka 是否應導致建構失敗。該程序會等到所有錯誤和警告都發出後才停止。
        </p>
        <p>此設定與 <code>reportUndocumented</code> 搭配使用效果良好。</p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="suppressInheritedMembers">
        <p>是否抑制未在給定類別中明確覆寫的繼承成員。</p>
        <p>
            注意：這會抑制諸如 <code>equals</code>、<code>hashCode</code> 和 <code>toString</code> 之類的函數，但不會抑制諸如 <code>dataClass.componentN</code> 和 <code>dataClass.copy</code> 之類的合成函數。請使用 <code>suppressObviousFunctions</code> 來實現。
        </p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="suppressObviousFunctions">
        <p>是否抑制明顯的函數。</p>
        <p>
            如果函數符合以下條件，則被視為明顯：</p>
            <list>
                <li>
                    繼承自 <code>kotlin.Any</code>、<code>Kotlin.Enum</code>、<code>java.lang.Object</code> 或 <code>java.lang.Enum</code>，例如 <code>equals</code>、<code>hashCode</code>、<code>toString</code>。
                </li>
                <li>
                    由編譯器產生 (合成的)，且沒有任何文件，例如 <code>dataClass.componentN</code> 或 <code>dataClass.copy</code>。
                </li>
            </list>
        <p>預設值：<code>true</code></p>
    </def>
    <def title="offlineMode">
        <p>是否透過您的網路解析遠端檔案和連結。</p>
        <p>
            這包括用於產生外部文件連結的 package-list。例如，這允許使標準函式庫中的類別在您的文件中可點擊。
        </p>
        <p>
            將此設定為 <code>true</code> 在某些情況下可以顯著加快建構時間，但也可能惡化使用者體驗。例如，不解析來自您的依賴項（包括標準函式庫）的類別和成員連結。
        </p>
        <p>注意：您可以將擷取的檔案本地快取，並將其作為本地路徑提供給 Dokka。請參閱 <code><a href="#external-documentation-links-configuration">externalDocumentationLinks</a></code> 區塊。</p>
        <p>預設值：<code>false</code></p>
    </def>
     <def title="includes">
        <p>
            包含<a href="dokka-module-and-package-docs.md">子專案和套件文件</a>的 Markdown 檔案列表。這些 Markdown 檔案必須符合<a href="dokka-module-and-package-docs.md#file-format">必要格式</a>。
        </p>
        <p>指定檔案的內容將被解析並嵌入文件中作為子專案和套件的描述。</p>
        <p>
            有關其外觀和使用方式的範例，請參閱<a href="https://github.com/Kotlin/dokka/blob/master/examples/gradle-v2/basic-gradle-example/build.gradle.kts">Dokka Gradle 範例</a>。
        </p>
    </def>
</deflist>

### 原始碼集配置

Dokka 允許為 [Kotlin 原始碼集](https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets)配置一些選項：

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.gradle.engine.parameters.VisibilityModifier

dokka {
    // ..
    // 一般配置區塊
    // ..

    // 原始碼集配置
    dokkaSourceSets {
        // 範例：'linux' 原始碼集專屬的配置
        named("linux") {
            dependentSourceSets{named("native")}
            sourceRoots.from(file("linux/src"))
        }

        configureEach {
            suppress.set(false)
            displayName.set(name)
            documentedVisibilities.set(setOf(VisibilityModifier.Public)) // 或 documentedVisibilities(VisibilityModifier.Public)
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
                // 原始碼連結區塊
            }
            perPackageOption {
                // 套件選項區塊
            }
            externalDocumentationLinks {
                // 外部文件連結區塊
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
    // 一般配置區塊
    // ..

    dokkaSourceSets {
        // 範例：'linux' 原始碼集專屬的配置
        named("linux") {
            dependentSourceSets { named("native") }
            sourceRoots.from(file("linux/src"))
        }

        configureEach {
            suppress.set(false)
            displayName.set(name)
            documentedVisibilities.set([VisibilityModifier.Public] as Set) // 或 documentedVisibilities(VisibilityModifier.Public)
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
                // 原始碼連結區塊
            }
            perPackageOption {
                // 套件選項區塊
            }
            externalDocumentationLinks {
                // 外部文件連結區塊
            }
        }
    }
}
```

</tab>
</tabs>

<deflist collapsible="true">
    <def title="suppress">
        <p>產生文件時是否應跳過此原始碼集。</p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="displayName">
        <p>用於指稱此原始碼集的顯示名稱。</p>
        <p>
            此名稱既用於外部（例如，文件讀者可見的原始碼集名稱），也用於內部（例如，<code>reportUndocumented</code> 的記錄訊息）。
        </p>
        <p>預設情況下，該值是從 Kotlin Gradle 外掛程式提供的信息推斷出來的。</p>
    </def>
    <def title="documentedVisibilities">
        <p>定義 Dokka 應在產生文件中包含哪些可見性修飾符。</p>
        <p>
            如果您想為 <code>protected</code>、<code>internal</code> 和 <code>private</code> 宣告產生文件，以及如果您想排除 <code>public</code> 宣告而只為內部 API 產生文件，請使用它們。
        </p>
        <p>
            此外，您可以使用 Dokka 的
            <a href="https://github.com/Kotlin/dokka/blob/v2.1.0/dokka-runners/dokka-gradle-plugin/src/main/kotlin/engine/parameters/HasConfigurableVisibilityModifiers.kt"><code>documentedVisibilities()</code> 函數</a>
            來添加文件化可見性。
        </p>
        <p>這可以為每個個別套件配置。</p>
        <p>預設值：<code>VisibilityModifier.Public</code></p>
    </def>
    <def title="reportUndocumented">
        <p>
            是否發出有關可見但未文件化的宣告的警告，即經過 <code>documentedVisibilities</code> 和其他過濾器篩選後，沒有 KDocs 的宣告。
        </p>
        <p>此設定與 <code>failOnWarning</code> 搭配使用效果良好。</p>
        <p>這可以為每個個別套件配置。</p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="skipEmptyPackages">
        <p>
            在應用各種過濾器後，是否跳過不包含任何可見宣告的套件。
        </p>
        <p>
            例如，如果 <code>skipDeprecated</code> 設定為 <code>true</code>，並且您的套件只包含已棄用宣告，則該套件被視為空。
        </p>
        <p>預設值：<code>true</code></p>
    </def>
    <def title="skipDeprecated">
        <p>是否為標註有 <code>@Deprecated</code> 的宣告產生文件。</p>
        <p>這可以在原始碼集層級配置。</p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="suppressGeneratedFiles">
        <p>是否為產生檔案產生文件。</p>
        <p>
            產生檔案預計會位於 <code>{project}/{buildDir}/generated</code> 目錄下。
        </p>
        <p>
            如果設定為 <code>true</code>，它會有效地將該目錄中的所有檔案添加到 <code>suppressedFiles</code> 選項中，因此您可以手動配置它。
        </p>
        <p>預設值：<code>true</code></p>
    </def>
    <def title="jdkVersion">
        <p>產生 Java 型別的外部文件連結時使用的 JDK 版本。</p>
        <p>
            例如，如果您在某些 public 宣告簽章中使用 <code>java.util.UUID</code>，且此選項設定為 <code>8</code>，Dokka 會為其產生一個連結到 <a href="https://docs.oracle.com/javase/8/docs/api/java/util/UUID.html">JDK 8 Javadoc</a> 的外部文件連結。
        </p>
        <p>預設值：<code>8</code></p>
    </def>
    <def title="languageVersion">
        <p>
            用於設定分析和 <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a> 環境的 <a href="https://kotlinlang.org/docs/compatibility-modes.html">Kotlin 語言版本</a>。
        </p>
        <p>預設情況下，會使用 Dokka 嵌入式編譯器可用的最新語言版本。</p>
    </def>
    <def title="apiVersion">
        <p>
            用於設定分析和 <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a> 環境的 <a href="https://kotlinlang.org/docs/compatibility-modes.html">Kotlin API 版本</a>。
        </p>
        <p>預設情況下，它是從 <code>languageVersion</code> 推斷出來的。</p>
    </def>
    <def title="sourceRoots">
        <p>
            要分析和產生文件的原始碼根目錄。可接受的輸入是目錄和單個 <code>.kt</code> 和 <code>.java</code> 檔案。
        </p>
        <p>預設情況下，原始碼根目錄是從 Kotlin Gradle 外掛程式提供的信息推斷出來的。</p>
    </def>
    <def title="classpath">
        <p>用於分析和互動式範例的類別路徑 (classpath)。</p>
        <p>如果某些來自依賴項的型別未能自動解析或擷取，這會很有用。</p>
        <p>此選項接受 <code>.jar</code> 和 <code>.klib</code> 檔案。</p>
        <p>預設情況下，類別路徑是從 Kotlin Gradle 外掛程式提供的信息推斷出來的。</p>
    </def>
    <def title="samples">
        <p>
            包含透過 <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a> KDoc 標籤引用的範例函數的目錄或檔案列表。
        </p>
    </def>
</deflist>

### 原始碼連結配置

配置原始碼連結，以幫助讀者在遠端儲存庫中找到每個宣告的原始碼。請使用 `dokkaSourceSets.main {}` 區塊進行此配置。

`sourceLinks {}` 配置區塊允許您將一個 `source` 連結添加到每個簽章，該連結指向帶有特定行號的 `remoteUrl`。行號可以透過設定 `remoteLineSuffix` 來配置。

例如，請參閱 `kotlinx.coroutines` 中 [`count()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/count.html) 函數的文件。

`build.gradle.kts` 檔案的語法與一般的 `.kt` 檔案（例如用於自訂 Gradle 外掛程式的檔案）不同，因為 Gradle 的 Kotlin DSL 使用型別安全存取器：

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
<tab title="Kotlin 自訂外掛程式" group-key="kotlin custom">

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
            本地原始碼目錄的路徑。該路徑必須相對於目前專案的根目錄。
        </p>
    </def>
    <def title="remoteUrl">
        <p>
            原始碼代管服務的 URL，文件讀者可以存取，例如 GitHub、GitLab、Bitbucket 或任何提供原始碼檔案穩定 URL 的代管服務。此 URL 用於產生宣告的原始碼連結。
        </p>
    </def>
    <def title="remoteLineSuffix">
        <p>
            用於將原始碼行號附加到 URL 的尾碼。這有助於讀者不僅導覽到檔案，還能導覽到宣告的特定行號。
        </p>
        <p>
            數字本身會附加到指定的尾碼。例如，如果此選項設定為 <code>#L</code> 且行號為 10，則產生的 URL 尾碼為 <code>#L10</code>。
        </p>
        <p>
            常用服務使用的尾碼：</p>
            <list>
                <li>GitHub：<code>#L</code></li>
                <li>GitLab：<code>#L</code></li>
                <li>Bitbucket：<code>#lines-</code></li>
            </list>
        <p>預設值：<code>#L</code></p>
    </def>
</deflist>

### 套件選項

`perPackageOption` 配置區塊允許為由 `matchingRegex` 匹配的特定套件設定一些選項：

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
                documentedVisibilities.set(setOf(VisibilityModifier.Public)) // 或 documentedVisibilities(VisibilityModifier.Public)
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
        <p>用於匹配套件的正規表示式。</p>
        <p>預設值：<code>.*</code></p>
    </def>
    <def title="suppress">
        <p>產生文件時是否應跳過該套件。</p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="skipDeprecated">
        <p>是否為標註有 <code>@Deprecated</code> 的宣告產生文件。</p>
        <p>這可以在原始碼集層級配置。</p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="reportUndocumented">
        <p>
            是否發出有關可見但未文件化的宣告的警告，即經過 <code>documentedVisibilities</code> 和其他過濾器篩選後，沒有 KDocs 的宣告。
        </p>
        <p>此設定與 <code>failOnWarning</code> 搭配使用效果良好。</p>
        <p>這可以在原始碼集層級配置。</p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="documentedVisibilities">
        <p>定義 Dokka 應在產生文件中包含哪些可見性修飾符。</p>
        <p>
            如果您想為此套件中的 <code>protected</code>、<code>internal</code> 和 <code>private</code> 宣告產生文件，以及如果您想排除 <code>public</code> 宣告而只為內部 API 產生文件，請使用它們。
        </p>
        <p>
            此外，您可以使用 Dokka 的
            <a href="https://github.com/Kotlin/dokka/blob/v2.0.0/dokka-runners/dokka-gradle-plugin/src/main/kotlin/engine/parameters/HasConfigurableVisibilityModifiers.kt#L14-L16"><code>documentedVisibilities()</code> 函數</a>
            來添加文件化可見性。
        </p>
        <p>這可以在原始碼集層級配置。</p>
        <p>預設值：<code>VisibilityModifier.Public</code></p>
    </def>
</deflist>

### 外部文件連結配置

`externalDocumentationLinks {}` 區塊允許建立指向您的依賴項外部代管文件的連結。

例如，如果您使用來自 `kotlinx.serialization` 的型別，預設情況下它們在您的文件中是不可點擊的，就好像它們未解析一樣。但是，由於 `kotlinx.serialization` 的 API 參考文件是由 Dokka 建構並[發布在 kotlinlang.org](https://kotlinlang.org/api/kotlinx.serialization/) 上的，您可以為其配置外部文件連結。這允許 Dokka 為函式庫中的型別產生連結，使其成功解析並可點擊。

預設情況下，Kotlin 標準函式庫、JDK、Android SDK 和 AndroidX 的外部文件連結已配置。

使用 `register()` 方法註冊外部文件連結以定義每個連結。`externalDocumentationLinks` API 遵循 Gradle DSL 慣例，因此使用此方法：

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
        <p>要連結到的文件根 URL。它<b>必須</b>包含結尾斜線。</p>
        <p>
            Dokka 會盡力自動尋找給定 URL 的 <code>package-list</code>，並將宣告連結在一起。
        </p>
        <p>
            如果自動解析失敗，或者您想改用本地快取檔案，請考慮設定 <code>packageListUrl</code> 選項。
        </p>
    </def>
    <def title="packageListUrl">
        <p>
            <code>package-list</code> 的確切位置。這是替代依賴 Dokka 自動解析的方式。
        </p>
        <p>
            Package list 包含有關文件和專案本身的信息，例如子專案和套件名稱。
        </p>
        <p>這也可以是一個本地快取檔案，以避免網路呼叫。</p>
    </def>
</deflist>

### 完整配置

下方您可以看到同時應用了所有可能的配置選項：

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
        // 範例：'linux' 原始碼集專屬的配置
        named("linux") {
            dependentSourceSets{named("native")}
            sourceRoots.from(file("linux/src"))
        }

        configureEach {
            suppress.set(false)
            displayName.set(name)
            documentedVisibilities.set(setOf(VisibilityModifier.Public)) // 或 documentedVisibilities(VisibilityModifier.Public)
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
        // 範例：'linux' 原始碼集專屬的配置
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