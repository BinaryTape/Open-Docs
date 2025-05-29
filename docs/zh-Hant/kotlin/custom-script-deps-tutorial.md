[//]: # (title: 開始使用 Kotlin 自訂腳本 – 教學)

> Kotlin 自訂腳本功能為 [實驗性](components-stability.md)。此功能可能隨時被移除或更改。
> 請僅將其用於評估目的。我們非常感謝您在 [YouTrack](https://kotl.in/issue) 上提供關於此功能的意見回饋。
>
{style="warning"}

_Kotlin 腳本 (scripting)_ 是一種技術，它允許 Kotlin 程式碼作為腳本執行，而無需事先編譯或打包成可執行檔。

如需了解 Kotlin 腳本的概述和範例，請查閱 Rodrigo Oliveira 在 KotlinConf'19 上的演講 [實作 Gradle Kotlin DSL](https://kotlinconf.com/2019/talks/video/2019/126701/)。

在本教學中，您將建立一個 Kotlin 腳本專案，該專案能執行帶有 Maven 依賴項的任意 Kotlin 程式碼。您將能夠像這樣執行腳本：

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

指定的 Maven 依賴項（此範例為 `kotlinx-html-jvm`）將在執行期間從指定的 Maven 儲存庫或本地快取中解析，並用於腳本的其餘部分。

## 專案結構

一個最簡 Kotlin 自訂腳本專案包含兩個部分：

* _腳本定義 (Script definition)_ – 一組參數和配置，用於定義此腳本類型應如何被識別、處理、編譯和執行。
* _腳本主機 (Scripting host)_ – 處理腳本編譯和執行（即實際執行此類型腳本）的應用程式或元件。

考量到以上所述，最好將專案拆分為兩個模組。

## 開始之前

下載並安裝最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)。

## 建立專案

1. 在 IntelliJ IDEA 中，選擇 **File** | **New** | **Project**。
2. 在左側面板中，選擇 **New Project**。
3. 命名新專案並在必要時更改其位置。

   > 勾選 **Create Git repository** 核取方塊，將新專案置於版本控制之下。您也可以隨時在之後進行此操作。
   >
   {style="tip"}

4. 從 **Language** 清單中，選擇 **Kotlin**。
5. 選擇 **Gradle** 建置系統。
6. 從 **JDK** 清單中，選擇您要在專案中使用的 [JDK](https://www.oracle.com/java/technologies/downloads/)。
   * 如果 JDK 已安裝在您的電腦上，但未在 IDE 中定義，請選擇 **Add JDK** 並指定 JDK 主目錄的路徑。
   * 如果您的電腦上沒有必要的 JDK，請選擇 **Download JDK**。

7. 為 **Gradle DSL** 選擇 Kotlin 或 Gradle 語言。
8. 點擊 **Create**。

![Create a root project for custom Kotlin scripting](script-deps-create-root-project.png){width=700}

## 加入腳本模組

現在您有一個空的 Kotlin/JVM Gradle 專案。加入所需的模組，即腳本定義和腳本主機：

1. 在 IntelliJ IDEA 中，選擇 **File | New | Module**。
2. 在左側面板中，選擇 **New Module**。此模組將作為腳本定義。
3. 命名新模組並在必要時更改其位置。
4. 從 **Language** 清單中，選擇 **Java**。
5. 選擇 **Gradle** 建置系統，如果您想用 Kotlin 撰寫建置腳本，請為 **Gradle DSL** 選擇 Kotlin。
6. 將根模組選為此模組的父級。
7. 點擊 **Create**。

   ![Create script definition module](script-deps-module-definition.png){width=700}

8. 在模組的 `build.gradle(.kts)` 檔案中，移除 Kotlin Gradle 外掛程式的 `version`。它已存在於根專案的建置腳本中。

9. 重複前述步驟一次，為腳本主機建立一個模組。

專案應具有以下結構：

![Custom scripting project structure](script-deps-project-structure.png){width=300}

您可以在 [kotlin-script-examples GitHub 儲存庫](https://github.com/Kotlin/kotlin-script-examples/tree/master/jvm/basic/jvm-maven-deps) 中找到此類專案的範例以及更多 Kotlin 腳本範例。

## 建立腳本定義

首先，定義腳本類型：開發者可以在此類型的腳本中撰寫什麼，以及如何處理它。在本教學中，這包括在腳本中支援 `@Repository` 和 `@DependsOn` 註解。

1. 在腳本定義模組中，將 Kotlin 腳本元件的依賴項加入到 `build.gradle(.kts)` 的 `dependencies` 區塊中。這些依賴項提供了腳本定義所需的 API：

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   dependencies {
       implementation("org.jetbrains.kotlin:kotlin-scripting-common")
       implementation("org.jetbrains.kotlin:kotlin-scripting-jvm")
       implementation("org.jetbrains.kotlin:kotlin-scripting-dependencies")
       implementation("org.jetbrains.kotlin:kotlin-scripting-dependencies-maven")
       // coroutines dependency is required for this particular definition
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
       // coroutines dependency is required for this particular definition
       implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'

   }
   ```

   </tab>
   </tabs>

2. 在模組中建立 `src/main/kotlin/` 目錄，並加入一個 Kotlin 原始碼檔案，例如 `scriptDef.kt`。

3. 在 `scriptDef.kt` 中，建立一個類別。它將作為此類型腳本的父類別，因此請將其宣告為 `abstract` 或 `open`。

    ```kotlin
    // abstract (or open) superclass for scripts of this type
    abstract class ScriptWithMavenDeps
    ```

   此類別稍後也將作為腳本定義的參考。

4. 若要使此類別成為腳本定義，請使用 `@KotlinScript` 註解來標記它。將兩個參數傳遞給該註解：
   * `fileExtension` – 一個以 `.kts` 結尾的字串，用於定義此腳本類型檔案的副檔名。
   * `compilationConfiguration` – 一個繼承自 `ScriptCompilationConfiguration` 的 Kotlin 類別，用於定義此腳本定義的編譯細節。您將在下一步中建立它。

   ```kotlin
    // @KotlinScript annotation marks a script definition class
    @KotlinScript(
        // File extension for the script type
        fileExtension = "scriptwithdeps.kts",
        // Compilation configuration for the script type
        compilationConfiguration = ScriptWithMavenDepsConfiguration::class
    )
    abstract class ScriptWithMavenDeps

    object ScriptWithMavenDepsConfiguration: ScriptCompilationConfiguration()
   ```
   
   > 在本教學中，我們僅提供可運作的程式碼，不解釋 Kotlin 腳本 API。
   > 您可以在 [GitHub](https://github.com/Kotlin/kotlin-script-examples/blob/master/jvm/basic/jvm-maven-deps/script/src/main/kotlin/org/jetbrains/kotlin/script/examples/jvm/resolve/maven/scriptDef.kt) 上找到帶有詳細解釋的相同程式碼。
   > 
   {style="note"}

5. 如下所示定義腳本編譯配置。

   ```kotlin
    object ScriptWithMavenDepsConfiguration : ScriptCompilationConfiguration(
        {
            // Implicit imports for all scripts of this type
            defaultImports(DependsOn::class, Repository::class)
            jvm {
                // Extract the whole classpath from context classloader and use it as dependencies
                dependenciesFromCurrentContext(wholeClasspath = true) 
            }
            // Callbacks
            refineConfiguration {
                // Process specified annotations with the provided handler
                onAnnotations(DependsOn::class, Repository::class, handler = ::configureMavenDepsOnAnnotations)
            }
        }
    )
   ```

   `configureMavenDepsOnAnnotations` 函數如下：

   ```kotlin
    // Handler that reconfigures the compilation on the fly
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

   您可以在[此處](https://github.com/Kotlin/kotlin-script-examples/blob/master/jvm/basic/jvm-maven-deps/script/src/main/kotlin/org/jetbrains/kotlin/script/examples/jvm/resolve/maven/scriptDef.kt)找到完整的程式碼。

## 建立腳本主機

下一步是建立腳本主機 – 處理腳本執行的元件。

1. 在腳本主機模組中，將依賴項加入到 `build.gradle(.kts)` 的 `dependencies` 區塊中：
   * 提供腳本主機所需 API 的 Kotlin 腳本元件
   * 您之前建立的腳本定義模組

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   dependencies {
       implementation("org.jetbrains.kotlin:kotlin-scripting-common")
       implementation("org.jetbrains.kotlin:kotlin-scripting-jvm")
       implementation("org.jetbrains.kotlin:kotlin-scripting-jvm-host")
       implementation(project(":script-definition")) // the script definition module
   }
   ```

   </tab>
   <tab title="Groovy" group-key="groovy">

   ```groovy
   dependencies {
       implementation 'org.jetbrains.kotlin:kotlin-scripting-common'
       implementation 'org.jetbrains.kotlin:kotlin-scripting-jvm'
       implementation 'org.jetbrains.kotlin:kotlin-scripting-jvm-host'
       implementation project(':script-definition') // the script definition module
   }
   ```

   </tab>
   </tabs>

2. 在模組中建立 `src/main/kotlin/` 目錄，並加入一個 Kotlin 原始碼檔案，例如 `host.kt`。

3. 為應用程式定義 `main` 函數。在其主體中，檢查它是否只有一個參數 – 腳本檔案的路徑 – 並執行該腳本。您將在下一步中在單獨的 `evalFile` 函數中定義腳本執行。現在請將其宣告為空。

   `main` 可以像這樣：

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

4. 定義腳本評估函數。這就是您將使用腳本定義的地方。透過呼叫 `createJvmCompilationConfigurationFromTemplate` 並將腳本定義類別作為類型參數來取得它。然後呼叫 `BasicJvmScriptingHost().eval`，將腳本程式碼及其編譯配置傳遞給它。`eval` 回傳 `ResultWithDiagnostics` 的實例，因此請將其設定為您函數的回傳類型。

   ```kotlin
    fun evalFile(scriptFile: File): ResultWithDiagnostics<EvaluationResult> {
        val compilationConfiguration = createJvmCompilationConfigurationFromTemplate<ScriptWithMavenDeps>()
        return BasicJvmScriptingHost().eval(scriptFile.toScriptSource(), compilationConfiguration, null)
    }
   ```

5. 調整 `main` 函數以印出腳本執行資訊：

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

您可以在[此處](https://github.com/Kotlin/kotlin-script-examples/blob/master/jvm/basic/jvm-maven-deps/host/src/main/kotlin/org/jetbrains/kotlin/script/examples/jvm/resolve/maven/host/host.kt)找到完整的程式碼。

## 執行腳本

若要檢查您的腳本主機如何運作，請準備一個要執行的腳本和一個執行配置。

1. 在專案根目錄中建立檔案 `html.scriptwithdeps.kts`，內容如下：

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
   
   它使用了 `kotlinx-html-jvm` 函式庫中的函數，該函式庫在 `@DependsOn` 註解引數中被引用。

2. 建立一個啟動腳本主機並執行此檔案的執行配置：
   1. 開啟 `host.kt` 並導覽至 `main` 函數。它在左側有一個 **Run** 邊欄圖示。
   2. 右鍵點擊邊欄圖示並選擇 **Modify Run Configuration**。
   3. 在 **Create Run Configuration** 對話框中，將腳本檔案名加入到 **Program arguments** 中，然後點擊 **OK**。
   
      ![Scripting host run configuration](script-deps-run-config.png){width=800}

3. 執行所建立的配置。

您將看到腳本如何執行，從指定的儲存庫中解析 `kotlinx-html-jvm` 的依賴項，並印出呼叫其函數的結果：

```text
<html>
  <body>
    <h1>Hello, World!</h1>
  </body>
</html>
```

第一次執行時解析依賴項可能需要一些時間。後續執行將會快得多，因為它們使用來自本地 Maven 儲存庫的已下載依賴項。

## 接下來是什麼？

一旦您建立了簡單的 Kotlin 腳本專案，請了解更多關於此主題的資訊：
* 閱讀 [Kotlin 腳本 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/scripting-support.md)
* 瀏覽更多 [Kotlin 腳本範例](https://github.com/Kotlin/kotlin-script-examples)
* 觀看 Rodrigo Oliveira 的演講 [實作 Gradle Kotlin DSL](https://kotlinconf.com/2019/talks/video/2019/126701/)