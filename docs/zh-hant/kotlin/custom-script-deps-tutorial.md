---
title: "Kotlin 客製化腳本入門教學"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::caution
Kotlin 自訂腳本為 [實驗性](components-stability)。它可能會隨時被刪除或更改。
僅用於評估目的。我們感謝您在 [YouTrack](https://kotl.in/issue) 上提供的反饋。

:::

_Kotlin 腳本 (Kotlin scripting)_ 是一種技術，可以將 Kotlin 程式碼作為腳本執行，而無需事先編譯或打包成可執行檔。

有關帶有範例的 Kotlin 腳本的概述，請查看 Rodrigo Oliveira 在 KotlinConf'19 上的演講 [Implementing the Gradle Kotlin DSL](https://kotlinconf.com/2019/talks/video/2019/126701/)。

在本教學中，您將建立一個 Kotlin 腳本專案，該專案會執行具有 Maven 依賴項的任意 Kotlin 程式碼。
您將能夠執行這樣的腳本：

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

指定的 Maven 依賴項（本例中為 `kotlinx-html-jvm`）將在執行期間從指定的 Maven 儲存庫或本地快取中解析，並用於腳本的其餘部分。

## 專案結構

一個最小的 Kotlin 自訂腳本專案包含兩個部分：

* _腳本定義 (Script definition)_ – 一組參數和配置，用於定義應如何識別、處理、編譯和執行此腳本類型。
* _腳本宿主 (Scripting host)_ – 一個應用程式或元件，用於處理腳本編譯和執行 – 實際運行此類型的腳本。

考慮到所有這些，最好將專案分成兩個模組。

## 開始之前

下載並安裝最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)。

## 建立專案

1. 在 IntelliJ IDEA 中，選擇 **File** | **New** | **Project**。
2. 在左側的面板中，選擇 **New Project**。
3. 命名新專案，並在必要時更改其位置。

   > 選取 **Create Git repository** 核取方塊，以將新專案置於版本控制之下。您稍後可以隨時執行此操作。
   >
   

4. 從 **Language** 清單中，選取 **Kotlin**。
5. 選取 **Gradle** 建置系統。
6. 從 **JDK** 清單中，選取您要在專案中使用的 [JDK](https://www.oracle.com/java/technologies/downloads/)。
   * 如果 JDK 安裝在您的電腦上，但未在 IDE 中定義，請選取 **Add JDK** 並指定 JDK 主目錄的路徑。
   * 如果您的電腦上沒有必要的 JDK，請選取 **Download JDK**。

7. 為 **Gradle DSL** 選取 Kotlin 或 Gradle 語言。
8. 按一下 **Create**。

<img src="/img/script-deps-create-root-project.png" alt="Create a root project for custom Kotlin scripting" width="700" style={{verticalAlign: 'middle'}}/>

## 新增腳本模組

現在您有一個空的 Kotlin/JVM Gradle 專案。新增所需的模組、腳本定義和腳本宿主：

1. 在 IntelliJ IDEA 中，選取 **File | New | Module**。
2. 在左側的面板中，選取 **New Module**。此模組將是腳本定義。
3. 命名新模組，並在必要時更改其位置。
4. 從 **Language** 清單中，選取 **Java**。
5. 如果您想用 Kotlin 撰寫建置腳本，請選取 **Gradle** 建置系統和 Kotlin 作為 **Gradle DSL**。
6. 作為模組的父項，選取根模組。
7. 按一下 **Create**。

   <img src="/img/script-deps-module-definition.png" alt="Create script definition module" width="700" style={{verticalAlign: 'middle'}}/>

8. 在模組的 `build.gradle(.kts)` 檔案中，移除 Kotlin Gradle 外掛程式的 `version`。它已在根專案的建置腳本中。

9. 再次重複先前的步驟，為腳本宿主建立模組。

專案應具有以下結構：

<img src="/img/script-deps-project-structure.png" alt="Custom scripting project structure" width="300" style={{verticalAlign: 'middle'}}/>

您可以在 [kotlin-script-examples GitHub 儲存庫](https://github.com/Kotlin/kotlin-script-examples/tree/master/jvm/basic/jvm-maven-deps) 中找到此類專案的範例以及更多 Kotlin 腳本範例。

## 建立腳本定義

首先，定義腳本類型：開發人員可以在此類型的腳本中撰寫什麼以及如何處理它。
在本教學中，這包括支援腳本中的 `@Repository` 和 `@DependsOn` 註解。

1. 在腳本定義模組中，在 `build.gradle(.kts)` 的 `dependencies` 區塊中新增 Kotlin 腳本元件的依賴項。這些依賴項提供您將需要用於腳本定義的 API：

   <Tabs groupId="build-script">
   <TabItem value="kotlin" label="Kotlin" default>

   ```kotlin
   dependencies {
       implementation("org.jetbrains.kotlin:kotlin-scripting-common")
       implementation("org.jetbrains.kotlin:kotlin-scripting-jvm")
       implementation("org.jetbrains.kotlin:kotlin-scripting-dependencies")
       implementation("org.jetbrains.kotlin:kotlin-scripting-dependencies-maven")
       // 執行此特定定義需要協程依賴項
       implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1") 
   }
   ```

   </TabItem>
   <TabItem value="groovy" label="Groovy" default>

   ```groovy
   dependencies {
       implementation 'org.jetbrains.kotlin:kotlin-scripting-common'
       implementation 'org.jetbrains.kotlin:kotlin-scripting-jvm'
       implementation 'org.jetbrains.kotlin:kotlin-scripting-dependencies'
       implementation 'org.jetbrains.kotlin:kotlin-scripting-dependencies-maven'
       // 執行此特定定義需要協程依賴項
       implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1'

   }
   ```

   </TabItem>
   </Tabs>

2. 在模組中建立 `src/main/kotlin/` 目錄，並新增一個 Kotlin 原始檔，例如 `scriptDef.kt`。

3. 在 `scriptDef.kt` 中，建立一個類別。它將是此類型腳本的父類別，因此將其宣告為 `abstract` 或 `open`。

    ```kotlin
    // 此類型腳本的 abstract（或 open）父類別
    abstract class ScriptWithMavenDeps
    ```

   此類別稍後也將用作腳本定義的參考。

4. 若要使類別成為腳本定義，請使用 `@KotlinScript` 註解標記它。將兩個參數傳遞給註解：
   * `fileExtension` – 以 `.kts` 結尾的字串，用於定義此類型腳本的檔案副檔名。
   * `compilationConfiguration` – 擴充 `ScriptCompilationConfiguration` 的 Kotlin 類別，用於定義此腳本定義的編譯細節。您將在下一個步驟中建立它。

   ```kotlin
    // @KotlinScript 註解標記腳本定義類別
    @KotlinScript(
        // 腳本類型的檔案副檔名
        fileExtension = "scriptwithdeps.kts",
        // 腳本類型的編譯配置
        compilationConfiguration = ScriptWithMavenDepsConfiguration::class
    )
    abstract class ScriptWithMavenDeps

    object ScriptWithMavenDepsConfiguration: ScriptCompilationConfiguration()
   ```
   
   > 在本教學中，我們僅提供可運作的程式碼，而不解釋 Kotlin 腳本 API。
   > 您可以在 [GitHub](https://github.com/Kotlin/kotlin-script-examples/blob/master/jvm/basic/jvm-maven-deps/script/src/main/kotlin/org/jetbrains/kotlin/script/examples/jvm/resolve/maven/scriptDef.kt) 上找到帶有詳細說明的相同程式碼。
   > 
   

5. 如下所示定義腳本編譯配置。

   ```kotlin
    object ScriptWithMavenDepsConfiguration : ScriptCompilationConfiguration(
        {
            // 此類型所有腳本的隱含匯入
            defaultImports(DependsOn::class, Repository::class)
            jvm {
                // 從上下文類別載入器提取整個類別路徑，並將其用作依賴項
                dependenciesFromCurrentContext(wholeClasspath = true) 
            }
            // 回呼
            refineConfiguration {
                // 使用提供的處理常式處理指定的註解
                onAnnotations(DependsOn::class, Repository::class, handler = ::configureMavenDepsOnAnnotations)
            }
        }
    )
   ```

   `configureMavenDepsOnAnnotations` 函數如下所示：

   ```kotlin
    // 即時重新配置編譯的處理常式
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

   您可以在 [此處](https://github.com/Kotlin/kotlin-script-examples/blob/master/jvm/basic/jvm-maven-deps/script/src/main/kotlin/org/jetbrains/kotlin/script/examples/jvm/resolve/maven/scriptDef.kt) 找到完整程式碼。

## 建立腳本宿主

下一步是建立腳本宿主 – 處理腳本執行的元件。

1. 在腳本宿主模組中，在 `build.gradle(.kts)` 的 `dependencies` 區塊中新增依賴項：
   * Kotlin 腳本元件，提供您需要用於腳本宿主的 API
   * 您先前建立的腳本定義模組

   <Tabs groupId="build-script">
   <TabItem value="kotlin" label="Kotlin" default>

   ```kotlin
   dependencies {
       implementation("org.jetbrains.kotlin:kotlin-scripting-common")
       implementation("org.jetbrains.kotlin:kotlin-scripting-jvm")
       implementation("org.jetbrains.kotlin:kotlin-scripting-jvm-host")
       implementation(project(":script-definition")) // 腳本定義模組
   }
   ```

   </TabItem>
   <TabItem value="groovy" label="Groovy" default>

   ```groovy
   dependencies {
       implementation 'org.jetbrains.kotlin:kotlin-scripting-common'
       implementation 'org.jetbrains.kotlin:kotlin-scripting-jvm'
       implementation 'org.jetbrains.kotlin:kotlin-scripting-jvm-host'
       implementation project(':script-definition') // 腳本定義模組
   }
   ```

   </TabItem>
   </Tabs>

2. 在模組中建立 `src/main/kotlin/` 目錄，並新增一個 Kotlin 原始檔，例如 `host.kt`。

3. 定義應用程式的 `main` 函數。在其主體中，檢查它是否具有一個引數 – 腳本檔案的路徑 – 並執行腳本。您將在下一個步驟中的單獨函數 `evalFile` 中定義腳本執行。
   現在將其宣告為空。

   `main` 看起來可能像這樣：

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

4. 定義腳本評估函數。您將在此處使用腳本定義。透過使用腳本定義類別作為類型參數呼叫 `createJvmCompilationConfigurationFromTemplate` 來取得它。
   然後呼叫 `BasicJvmScriptingHost().eval`，將腳本程式碼及其編譯配置傳遞給它。`eval` 傳回 `ResultWithDiagnostics` 的執行個體，因此將其設定為函數的傳回類型。

   ```kotlin
    fun evalFile(scriptFile: File): ResultWithDiagnostics<EvaluationResult> {
        val compilationConfiguration = createJvmCompilationConfigurationFromTemplate<ScriptWithMavenDeps>()
        return BasicJvmScriptingHost().eval(scriptFile.toScriptSource(), compilationConfiguration, null)
    }
   ```

5. 調整 `main` 函數以列印有關腳本執行的資訊：

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

您可以在 [此處](https://github.com/Kotlin/kotlin-script-examples/blob/master/jvm/basic/jvm-maven-deps/host/src/main/kotlin/org/jetbrains/kotlin/script/examples/jvm/resolve/maven/host/host.kt) 找到完整程式碼。

## 執行腳本

若要檢查腳本宿主的工作方式，請準備一個要執行的腳本和一個執行配置。

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
   
   它使用 `kotlinx-html-jvm` 庫中的函數，該函數在 `@DependsOn` 註解引數中引用。

2. 建立一個啟動腳本宿主並執行此檔案的執行配置：
   1. 開啟 `host.kt` 並導覽至 `main` 函數。左側有一個 **Run** 裝訂邊圖示。
   2. 以滑鼠右鍵按一下裝訂邊圖示，然後選取 **Modify Run Configuration**。
   3. 在 **Create Run Configuration** 對話方塊中，將腳本檔案名稱新增至 **Program arguments**，然後按一下 **OK**。
   
      <img src="/img/script-deps-run-config.png" alt="Scripting host run configuration" width="800" style={{verticalAlign: 'middle'}}/>

3. 執行建立的配置。

您將看到如何執行腳本，解析指定儲存庫中 `kotlinx-html-jvm` 的依賴項，並列印呼叫其函數的結果：

```text
<html>
  <body>
    <h1>Hello, World!</h1>
  </body>
</html>
```

在第一次執行時，解析依賴項可能需要一些時間。後續執行將更快完成，因為它們使用從本機 Maven 儲存庫下載的依賴項。

## 接下來呢？

一旦您建立了一個簡單的 Kotlin 腳本專案，請尋找有關此主題的更多資訊：
* 閱讀 [Kotlin 腳本 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/scripting-support)
* 瀏覽更多 [Kotlin 腳本範例](https://github.com/Kotlin/kotlin-script-examples)
* 觀看 Rodrigo Oliveira 的演講 [Implementing the Gradle Kotlin DSL](https://kotlinconf.com/2019/talks/video/2019/126701/)

  ```