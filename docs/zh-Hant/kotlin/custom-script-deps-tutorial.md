[//]: # (title: 開始使用 Kotlin 自訂指令碼 – 教學)

> Kotlin 自訂指令碼為 [實驗性](components-stability.md) 功能。它可能隨時被移除或更改。
> 僅用於評估目的。我們感謝您在 [YouTrack](https://kotl.in/issue) 上提供相關意見回饋。
>
{style="warning"}

_Kotlin 指令碼_ 是一種無需預先編譯或打包成可執行檔，即可將 Kotlin 程式碼作為指令碼執行的技術。

若要概述 Kotlin 指令碼及範例，請參閱 Rodrigo Oliveira 在 KotlinConf'19 上發表的演講：[實作 Gradle Kotlin DSL](https://kotlinconf.com/2019/talks/video/2019/126701/)。

在本教學中，您將建立一個 Kotlin 指令碼專案，該專案能執行帶有 Maven 相依性的任意 Kotlin 程式碼。
您將能夠像這樣執行指令碼：

```kotlin
@file:Repository("https://maven.pkg.jetbrains.space/public/p/kotlinx-html/maven")
@file:DependsOn("org.jetbrains.kotlinx:kotlinx-html-jvm:0.7.3")

import kotlinx.html.*
import kotlinx.html.stream.*
import kotlinx.html.attributes.*

val addressee = "World"

print(
    createHTML().html {
        body {
            h1 { +"Hello, $addressee!" }
        }
    }
)
```

指定的 Maven 相依性 (在此範例中為 `kotlinx-html-jvm`) 將在執行期間從指定的 Maven 儲存庫或本機快取中解析，並用於指令碼的其餘部分。

## 專案結構

一個最小的 Kotlin 自訂指令碼專案包含兩個部分：

*   _指令碼定義_ – 一組參數和組態，用於定義此指令碼類型應如何被識別、處理、編譯和執行。
*   _指令碼主機_ – 一個處理指令碼編譯和執行的應用程式或元件，即實際執行此類型指令碼的程式。

考慮到這些，最好將專案分成兩個模組。

## 開始之前

下載並安裝最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)。

## 建立專案

1.  在 IntelliJ IDEA 中，選取 **檔案** | **新增** | **專案**。
2.  在左側面板中，選取 **新增專案**。
3.  為新專案命名，並在必要時更改其位置。

    > 勾選 **建立 Git 儲存庫** 核取方塊，將新專案置於版本控制之下。您隨時可以在稍後執行此操作。
    >
    {style="tip"}

4.  從 **語言** 清單中，選取 **Kotlin**。
5.  選取 **Gradle** 建置系統。
6.  從 **JDK** 清單中，選取您要在專案中使用的 [JDK](https://www.oracle.com/java/technologies/downloads/)。
    *   如果 JDK 已安裝在您的電腦上，但未在 IDE 中定義，請選取 **新增 JDK** 並指定 JDK 家目錄的路徑。
    *   如果您的電腦上沒有必要的 JDK，請選取 **下載 JDK**。

7.  為 **Gradle DSL** 選取 Kotlin 或 Gradle 語言。
8.  點擊 **建立**。

![建立用於自訂 Kotlin 指令碼的根專案](script-deps-create-root-project.png){width=700}

## 新增指令碼模組

現在您有一個空的 Kotlin/JVM Gradle 專案。新增所需的模組、指令碼定義和指令碼主機：

1.  在 IntelliJ IDEA 中，選取 **檔案 | 新增 | 模組**。
2.  在左側面板中，選取 **新增模組**。此模組將為指令碼定義。
3.  為新模組命名，並在必要時更改其位置。
4.  從 **語言** 清單中，選取 **Java**。
5.  選取 **Gradle** 建置系統，如果您想用 Kotlin 撰寫建置指令碼，請為 **Gradle DSL** 選取 Kotlin。
6.  作為模組的父項，選取根模組。
7.  點擊 **建立**。

    ![建立指令碼定義模組](script-deps-module-definition.png){width=700}

8.  在模組的 `build.gradle(.kts)` 檔案中，移除 Kotlin Gradle 外掛程式的 `version`。它已經存在於根專案的建置指令碼中。

9.  再次重複上述步驟，為指令碼主機建立一個模組。

專案應具有以下結構：

![自訂指令碼專案結構](script-deps-project-structure.png){width=300}

您可以在 [kotlin-script-examples GitHub 儲存庫](https://github.com/Kotlin/kotlin-script-examples/tree/master/jvm/basic/jvm-maven-deps) 中找到此類專案的範例以及更多 Kotlin 指令碼範例。

## 建立指令碼定義

首先，定義指令碼類型：開發人員可以在此類型指令碼中撰寫什麼以及它將如何被處理。
在本教學中，這包括在指令碼中支援 `@Repository` 和 `@DependsOn` 註釋。

1.  在指令碼定義模組中，將 Kotlin 指令碼元件的相依性新增到 `build.gradle(.kts)` 的 `dependencies` 區塊中。這些相依性提供了指令碼定義所需的 API：

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    dependencies {
        implementation("org.jetbrains.kotlin:kotlin-scripting-common")
        implementation("org.jetbrains.kotlin:kotlin-scripting-jvm")
        implementation("org.jetbrains.kotlin:kotlin-scripting-dependencies")
        implementation("org.jetbrains.kotlin:kotlin-scripting-dependencies-maven")
        // 此特定定義需要 coroutines 相依性
        implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    dependencies {
        implementation 'org.jetbrains.kotlin:kotlin-scripting-common'
        implementation 'org.jetbrains.kotlin:kotlin-scripting-jvm'
        implementation 'org.jetbrains.kotlin:kotlin-scripting-dependencies'
        implementation 'org.jetbrains.kotlin:kotlin-scripting-dependencies-maven'
        // 此特定定義需要 coroutines 相依性
        implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
    }
    ```

    </tab>
    </tabs>

2.  在模組中建立 `src/main/kotlin/` 目錄，並新增一個 Kotlin 原始碼檔案，例如 `scriptDef.kt`。

3.  在 `scriptDef.kt` 中，建立一個類別。它將是此類型指令碼的超類別，因此將其宣告為 `abstract` 或 `open`。

    ```kotlin
    // 此類型指令碼的抽象 (或開放) 超類別
    abstract class ScriptWithMavenDeps
    ```

    此類別稍後也將作為指令碼定義的參考。

4.  要使此類別成為指令碼定義，請使用 `@KotlinScript` 註釋標記它。將兩個參數傳遞給註釋：
    *   `fileExtension` – 一個以 `.kts` 結尾的字串，用於定義此類型指令碼的檔案副檔名。
    *   `compilationConfiguration` – 一個 Kotlin 類別，它擴展了 `ScriptCompilationConfiguration` 並定義了此指令碼定義的編譯細節。您將在下一步中建立它。

    ```kotlin
    // @KotlinScript 註釋標記指令碼定義類別
    @KotlinScript(
        // 指令碼類型的檔案副檔名
        fileExtension = "scriptwithdeps.kts",
        // 指令碼類型的編譯組態
        compilationConfiguration = ScriptWithMavenDepsConfiguration::class
    )
    abstract class ScriptWithMavenDeps

    object ScriptWithMavenDepsConfiguration: ScriptCompilationConfiguration()
    ```

    > 在本教學中，我們只提供可運作的程式碼，而不解釋 Kotlin 指令碼 API。
    > 您可以在 [GitHub](https://github.com/Kotlin/kotlin-script-examples/blob/master/jvm/basic/jvm-maven-deps/script/src/main/kotlin/org/jetbrains/kotlin/script/examples/jvm/resolve/maven/scriptDef.kt) 上找到帶有詳細說明的相同程式碼。
    >
    {style="note"}

5.  如下所示定義指令碼編譯組態。

    ```kotlin
    object ScriptWithMavenDepsConfiguration : ScriptCompilationConfiguration(
        {
            // 此類型所有指令碼的隱式引入
            defaultImports(DependsOn::class, Repository::class)
            jvm {
                // 從上下文類別載入器提取整個類別路徑並將其用作相依性
                dependenciesFromCurrentContext(wholeClasspath = true)
            }
            // 回呼
            refineConfiguration {
                // 使用提供的處理程式處理指定的註釋
                onAnnotations(DependsOn::class, Repository::class, handler = ::configureMavenDepsOnAnnotations)
            }
        }
    )
    ```

    `configureMavenDepsOnAnnotations` 函數如下：

    ```kotlin
    // 重新配置即時編譯的處理程式
    fun configureMavenDepsOnAnnotations(context: ScriptConfigurationRefinementContext): ResultWithDiagnostics<ScriptCompilationConfiguration> {
        val annotations = context.collectedData?.get(ScriptCollectedData.collectedAnnotations)?.takeIf { it.isNotEmpty() }
            ?: return context.compilationConfiguration.asSuccess()
        return runBlocking {
            resolver.resolveFromScriptSourceAnnotations(annotations)
        }.onSuccess {
            context.compilationConfiguration.with {
                dependencies.append(JvmDependency(it))
            }.asSuccess()
        }
    }

    private val resolver = CompoundDependenciesResolver(FileSystemDependenciesResolver(), MavenDependenciesResolver())
    ```

    您可以在 [這裡](https://github.com/Kotlin/kotlin-script-examples/blob/master/jvm/basic/jvm-maven-deps/script/src/main/kotlin/org/jetbrains/kotlin/script/examples/jvm/resolve/maven/scriptDef.kt) 找到完整程式碼。

## 建立指令碼主機

下一步是建立指令碼主機 – 處理指令碼執行的元件。

1.  在指令碼主機模組中，將相依性新增到 `build.gradle(.kts)` 的 `dependencies` 區塊中：
    *   提供指令碼主機所需 API 的 Kotlin 指令碼元件
    *   您先前建立的指令碼定義模組

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    dependencies {
        implementation("org.jetbrains.kotlin:kotlin-scripting-common")
        implementation("org.jetbrains.kotlin:kotlin-scripting-jvm")
        implementation("org.jetbrains.kotlin:kotlin-scripting-jvm-host")
        implementation(project(":script-definition")) // 指令碼定義模組
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    dependencies {
        implementation 'org.jetbrains.kotlin:kotlin-scripting-common'
        implementation 'org.jetbrains.kotlin:kotlin-scripting-jvm'
        implementation 'org.jetbrains.kotlin:kotlin-scripting-jvm-host'
        implementation project(':script-definition') // 指令碼定義模組
    }
    ```

    </tab>
    </tabs>

2.  在模組中建立 `src/main/kotlin/` 目錄，並新增一個 Kotlin 原始碼檔案，例如 `host.kt`。

3.  為應用程式定義 `main` 函數。在其主體中，檢查它是否具有一個引數 – 指令碼檔案的路徑 – 並執行該指令碼。您將在下一步中在單獨的 `evalFile` 函數中定義指令碼執行。現在暫時將其宣告為空。

    `main` 函數可以如下所示：

    ```kotlin
    fun main(vararg args: String) {
        if (args.size != 1) {
            println("usage: <app> <script file>")
        } else {
            val scriptFile = File(args[0])
            println("Executing script $scriptFile")
            evalFile(scriptFile)
        }
    }
    ```

4.  定義指令碼評估函數。這就是您將使用指令碼定義的地方。透過以指令碼定義類別作為類型參數呼叫 `createJvmCompilationConfigurationFromTemplate` 來獲取它。然後呼叫 `BasicJvmScriptingHost().eval`，將指令碼程式碼及其編譯組態傳遞給它。`eval` 返回 `ResultWithDiagnostics` 的實例，因此將其設定為您函數的回傳類型。

    ```kotlin
    fun evalFile(scriptFile: File): ResultWithDiagnostics<EvaluationResult> {
        val compilationConfiguration = createJvmCompilationConfigurationFromTemplate<ScriptWithMavenDeps>()
        return BasicJvmScriptingHost().eval(scriptFile.toScriptSource(), compilationConfiguration, null)
    }
    ```

5.  調整 `main` 函數以列印有關指令碼執行的資訊：

    ```kotlin
    fun main(vararg args: String) {
        if (args.size != 1) {
            println("usage: <app> <script file>")
        } else {
            val scriptFile = File(args[0])
            println("Executing script $scriptFile")
            val res = evalFile(scriptFile)
            res.reports.forEach {
                if (it.severity > ScriptDiagnostic.Severity.DEBUG) {
                    println(" : ${it.message}" + if (it.exception == null) "" else ": ${it.exception}")
                }
            }
        }
    }
    ```

您可以在 [這裡](https://github.com/Kotlin/kotlin-script-examples/blob/master/jvm/basic/jvm-maven-deps/host/src/main/kotlin/org/jetbrains/kotlin/script/examples/jvm/resolve/maven/host/host.kt) 找到完整程式碼。

## 執行指令碼

要檢查您的指令碼主機如何運作，請準備要執行的指令碼和執行組態。

1.  在專案根目錄中建立檔案 `html.scriptwithdeps.kts`，內容如下：

    ```kotlin
    @file:Repository("https://maven.pkg.jetbrains.space/public/p/kotlinx-html/maven")
    @file:DependsOn("org.jetbrains.kotlinx:kotlinx-html-jvm:0.7.3")

    import kotlinx.html.*; import kotlinx.html.stream.*; import kotlinx.html.attributes.*

    val addressee = "World"

    print(
        createHTML().html {
            body {
                h1 { +"Hello, $addressee!" }
            }
        }
    )
    ```

    它使用 `kotlinx-html-jvm` 函式庫中的函數，該函式庫在 `@DependsOn` 註釋引數中被參考。

2.  建立一個執行組態，啟動指令碼主機並執行此檔案：
    1.  開啟 `host.kt` 並導覽至 `main` 函數。它在左側有一個 **執行** 側邊圖示。
    2.  右鍵點擊側邊圖示並選取 **修改執行組態**。
    3.  在 **建立執行組態** 對話方塊中，將指令碼檔案名稱新增到 **程式引數** 中，然後點擊 **確定**。

        ![指令碼主機執行組態](script-deps-run-config.png){width=800}

3.  執行建立的組態。

您將看到指令碼如何執行，解析指定儲存庫中對 `kotlinx-html-jvm` 的相依性，並列印呼叫其函數的結果：

```text
<html>
  <body>
    <h1>Hello, World!</h1>
  </body>
</html>
```

首次執行時解析相依性可能需要一些時間。後續執行將會快得多，因為它們使用從本機 Maven 儲存庫下載的相依性。

## 接下來是什麼？

一旦您建立了簡單的 Kotlin 指令碼專案，請尋找有關此主題的更多資訊：
*   閱讀 [Kotlin 指令碼 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/scripting-support.md)
*   瀏覽更多 [Kotlin 指令碼範例](https://github.com/Kotlin/kotlin-script-examples)
*   觀看 Rodrigo Oliveira 的演講：[實作 Gradle Kotlin DSL](https://kotlinconf.com/2019/talks/video/2019/126701/)