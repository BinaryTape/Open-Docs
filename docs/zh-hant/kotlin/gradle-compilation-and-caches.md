---
title: "Kotlin Gradle 外掛程式中的編譯與快取"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

在本頁面中，您可以了解以下主題：
* [增量編譯](#incremental-compilation)
* [Gradle 組建快取支援](#gradle-build-cache-support)
* [Gradle 配置快取支援](#gradle-configuration-cache-support)
* [Kotlin 守護進程以及如何在 Gradle 中使用它](#the-kotlin-daemon-and-how-to-use-it-with-gradle)
* [回滾到先前的編譯器](#rolling-back-to-the-previous-compiler)
* [定義 Kotlin 編譯器執行策略](#defining-kotlin-compiler-execution-strategy)
* [Kotlin 編譯器回退策略](#kotlin-compiler-fallback-strategy)
* [嘗試最新的語言版本](#trying-the-latest-language-version)
* [組建報告](#build-reports)

## 增量編譯 (Incremental compilation)

Kotlin Gradle 外掛程式支援增量編譯，預設情況下為 Kotlin/JVM 和 Kotlin/JS 專案啟用。
增量編譯會追蹤組建之間類別路徑中檔案的變更，以便僅編譯受這些變更影響的檔案。
此方法適用於 [Gradle 的組建快取](#gradle-build-cache-support)，並支援[編譯避免](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java_compile_avoidance)。

對於 Kotlin/JVM，增量編譯依賴於類別路徑快照，
這些快照會擷取模組的 API 結構，以確定何時需要重新編譯。
為了優化整體流程，Kotlin 編譯器使用兩種型別的類別路徑快照：

* **細粒度快照 (Fine-grained snapshots)：** 包含關於類別成員的詳細資訊，例如屬性或函式。
當偵測到成員級別的變更時，Kotlin 編譯器僅重新編譯依賴於修改過的成員的類別。
為了保持效能，Kotlin Gradle 外掛程式會為 Gradle 快取中的 `.jar` 檔案建立粗粒度快照。
* **粗粒度快照 (Coarse-grained snapshots)：** 僅包含類別 [ABI](https://en.wikipedia.org/wiki/Application_binary_interface) 雜湊。
當 ABI 的一部分變更時，Kotlin 編譯器會重新編譯所有依賴於已變更類別的類別。
這對於不經常變更的類別（例如外部程式庫）很有用。

:::note
Kotlin/JS 專案使用基於歷史檔案的不同增量編譯方法。

:::

有多種方法可以停用增量編譯：

* 為 Kotlin/JVM 設定 `kotlin.incremental=false`。
* 為 Kotlin/JS 專案設定 `kotlin.incremental.js=false`。
* 使用 `-Pkotlin.incremental=false` 或 `-Pkotlin.incremental.js=false` 作為命令列參數。

  該參數應新增到每個後續組建中。

當您停用增量編譯時，增量快取會在組建後失效。第一個組建永遠不是增量的。

:::note
有時，增量編譯的問題會在失敗發生後的幾個回合後變得可見。使用 [組建報告](#build-reports)
來追蹤變更和編譯的歷史記錄。這可以幫助您提供可重現的錯誤報告。

要了解有關我們目前增量編譯方法如何運作以及與先前方法相比的更多資訊，
請參閱我們的 [部落格文章](https://blog.jetbrains.com/kotlin/2022/07/a-new-approach-to-incremental-compilation-in-kotlin/)。

## Gradle 組建快取支援 (Gradle build cache support)

Kotlin 外掛程式使用 [Gradle 組建快取](https://docs.gradle.org/current/userguide/build_cache.html)，它儲存
組建輸出，以便在未來的組建中重複使用。

若要停用所有 Kotlin 任務的快取，請將系統屬性 `kotlin.caching.enabled` 設定為 `false`
（使用引數 `-Dkotlin.caching.enabled=false` 執行組建）。

## Gradle 配置快取支援 (Gradle configuration cache support)

Kotlin 外掛程式使用 [Gradle 配置快取](https://docs.gradle.org/current/userguide/configuration_cache.html)，
透過重複使用後續組建的配置階段結果來加速組建過程。

請參閱 [Gradle 文件](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage)
以了解如何啟用配置快取。在您啟用此功能後，Kotlin Gradle 外掛程式會自動
開始使用它。

## Kotlin 守護進程以及如何在 Gradle 中使用它 (The Kotlin daemon and how to use it with Gradle)

Kotlin 守護進程：
* 與 Gradle 守護進程一起執行以編譯專案。
* 當您使用 IntelliJ IDEA 內建的組建系統編譯專案時，與 Gradle 守護進程分開執行。

當其中一個 Kotlin 編譯任務開始編譯來源時，Kotlin 守護進程會在 Gradle [執行階段](https://docs.gradle.org/current/userguide/build_lifecycle.html#sec:build_phases) 啟動。
Kotlin 守護進程會與 Gradle 守護進程一起停止，或在沒有 Kotlin 編譯的兩個閒置小時後停止。

Kotlin 守護進程使用與 Gradle 守護進程相同的 JDK。

### 設定 Kotlin 守護進程的 JVM 引數 (Setting Kotlin daemon's JVM arguments)

以下每種設定引數的方式都會覆寫先前的引數：
* [Gradle 守護進程引數繼承](#gradle-daemon-arguments-inheritance)
* [`kotlin.daemon.jvm.options` 系統屬性](#kotlin-daemon-jvm-options-system-property)
* [`kotlin.daemon.jvmargs` 屬性](#kotlin-daemon-jvmargs-property)
* [`kotlin` 擴充功能](#kotlin-extension)
* [特定任務定義](#specific-task-definition)

#### Gradle 守護進程引數繼承 (Gradle daemon arguments inheritance)

預設情況下，Kotlin 守護進程會從 Gradle 守護進程繼承一組特定的引數，但會使用直接為 Kotlin 守護進程指定的任何
JVM 引數覆寫它們。例如，如果您在 `gradle.properties` 檔案中新增以下 JVM 引數：

```none
org.gradle.jvmargs=-Xmx1500m -Xms500m -XX:MaxMetaspaceSize=1g
```

然後，這些引數會新增到 Kotlin 守護進程的 JVM 引數中：

```none
-Xmx1500m -XX:ReservedCodeCacheSize=320m -XX:MaxMetaspaceSize=1g -XX:UseParallelGC -ea -XX:+UseCodeCacheFlushing -XX:+HeapDumpOnOutOfMemoryError -Djava.awt.headless=true -Djava.rmi.server.hostname=127.0.0.1 --add-exports=java.base/sun.nio.ch=ALL-UNNAMED
```

若要了解有關 Kotlin 守護進程使用 JVM 引數的預設行為的更多資訊，請參閱 [Kotlin 守護進程使用 JVM 引數的行為](#kotlin-daemon-s-behavior-with-jvm-arguments)。

:::

#### kotlin.daemon.jvm.options 系統屬性 (kotlin.daemon.jvm.options system property)

如果 Gradle 守護進程的 JVM 引數具有 `kotlin.daemon.jvm.options` 系統屬性 – 請在 `gradle.properties` 檔案中使用它：

```none
org.gradle.jvmargs=-Dkotlin.daemon.jvm.options=-Xmx1500m,Xms500m
```

傳遞引數時，請遵循以下規則：
* 僅在引數 `Xmx`、`XX:MaxMetaspaceSize` 和 `XX:ReservedCodeCacheSize` 之前使用減號 `-` **。
* 使用逗號 (`,`) 分隔引數，_不帶_ 空格。空格後的引數將用於 Gradle 守護進程，而不是用於 Kotlin 守護進程。

:::note
如果滿足以下所有條件，Gradle 會忽略這些屬性：
* Gradle 正在使用 JDK 1.9 或更高版本。
* Gradle 的版本介於 7.0 和 7.1.1（含）之間。
* Gradle 正在編譯 Kotlin DSL 指令碼。
* Kotlin 守護進程未執行。

要克服此問題，請將 Gradle 升級到 7.2（或更高）版本，或使用 `kotlin.daemon.jvmargs` 屬性 – 請參閱以下章節。

#### kotlin.daemon.jvmargs 屬性 (kotlin.daemon.jvmargs property)

您可以在 `gradle.properties` 檔案中新增 `kotlin.daemon.jvmargs` 屬性：

```none
kotlin.daemon.jvmargs=-Xmx1500m -Xms500m
```

請注意，如果您未在此處或 Gradle 的 JVM 引數中指定 `ReservedCodeCacheSize` 引數，則 Kotlin Gradle 外掛程式會套用 `320m` 的預設值：

```none
-Xmx1500m -XX:ReservedCodeCacheSize=320m -Xms500m
```

#### kotlin 擴充功能 (kotlin extension)

您可以在 `kotlin` 擴充功能中指定引數：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    kotlinDaemonJvmArgs = listOf("-Xmx486m", "-Xms256m", "-XX:+UseParallelGC")
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    kotlinDaemonJvmArgs = ["-Xmx486m", "-Xms256m", "-XX:+UseParallelGC"]
}
```

</TabItem>
</Tabs>

#### 特定任務定義 (Specific task definition)

您可以為特定任務指定引數：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
tasks.withType<CompileUsingKotlinDaemon>().configureEach {
    kotlinDaemonJvmArguments.set(listOf("-Xmx486m", "-Xms256m", "-XX:+UseParallelGC"))
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
tasks.withType(CompileUsingKotlinDaemon).configureEach { task `->`
    task.kotlinDaemonJvmArguments = ["-Xmx1g", "-Xms512m"]
}
```

</TabItem>
</Tabs>

在這種情況下，新的 Kotlin 守護進程執行個體可以在任務執行時啟動。了解有關 [Kotlin 守護進程使用 JVM 引數的行為](#kotlin-daemon-s-behavior-with-jvm-arguments) 的更多資訊。

:::

### Kotlin 守護進程使用 JVM 引數的行為 (Kotlin daemon's behavior with JVM arguments)

在配置 Kotlin 守護進程的 JVM 引數時，請注意：

* 當不同的子專案或任務具有不同的 JVM 引數集時，預期會同時執行 Kotlin 守護進程的多個執行個體。
* 僅當 Gradle 執行相關的編譯任務且現有的 Kotlin 守護進程沒有相同的 JVM 引數集時，才會啟動新的 Kotlin 守護進程執行個體。
  假設您的專案有很多子專案。它們中的大多數需要一些堆積記憶體用於 Kotlin 守護進程，但一個模組需要很多（儘管它很少被編譯）。
  在這種情況下，您應該為這樣的模組提供一組不同的 JVM 引數，因此只有接觸此特定模組的開發人員才會啟動具有較大堆積大小的 Kotlin 守護進程。
  > 如果您已經在執行具有足夠堆積大小來處理編譯請求的 Kotlin 守護進程，
  > 即使其他請求的 JVM 引數不同，也會重複使用此守護進程，而不是啟動新的守護進程。
  >
  

如果未指定以下引數，Kotlin 守護進程會從 Gradle 守護進程繼承它們：

* `-Xmx`
* `-XX:MaxMetaspaceSize`
* `-XX:ReservedCodeCacheSize`。如果未指定或繼承，則預設值為 `320m`。

Kotlin 守護進程具有以下預設 JVM 引數：
* `-XX:UseParallelGC`。僅當未指定其他垃圾收集器時，才會套用此引數。
* `-ea`
* `-XX:+UseCodeCacheFlushing`
* `-Djava.awt.headless=true`
* `-D{java.servername.property}={localhostip}`
* `--add-exports=java.base/sun.nio.ch=ALL-UNNAMED`。僅適用於 JDK 16 或更高版本。

:::note
Kotlin 守護進程的預設 JVM 引數清單可能因版本而異。您可以使用像 [VisualVM](https://visualvm.github.io/) 這樣的工具來檢查正在執行的 JVM 程序的實際設定，例如 Kotlin 守護進程。

:::

## 回滾到先前的編譯器 (Rolling back to the previous compiler)

從 Kotlin 2.0.0 開始，預設使用 K2 編譯器。

若要從 Kotlin 2.0.0 開始使用先前的編譯器，請執行以下任一操作：

* 在您的 `build.gradle.kts` 檔案中，[將您的語言版本設定](gradle-compiler-options#example-of-setting-languageversion)為 `1.9`。

  或者
* 使用以下編譯器選項：`-language-version 1.9`。

要了解更多關於 K2 編譯器的優點，請參閱 [K2 編譯器遷移指南](k2-compiler-migration-guide)。

## 定義 Kotlin 編譯器執行策略 (Defining Kotlin compiler execution strategy)

_Kotlin 編譯器執行策略_ 定義了 Kotlin 編譯器在哪裡執行，以及在每種情況下是否支援增量編譯。

有三種編譯器執行策略：

| 策略 (Strategy)       | Kotlin 編譯器在哪裡執行 (Where Kotlin compiler is executed)          | 增量編譯 (Incremental compilation) | 其他特性和注意事項 (Other characteristics and notes)                                                                                                                                                                                                                                                |
|----------------|--------------------------------------------|-------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 守護進程 (Daemon)         | 在其自己的守護進程程序內 (Inside its own daemon process)              | 是 (Yes)                     | _預設且最快的策略 (The default and fastest strategy)_。可以在不同的 Gradle 守護進程和多個並行編譯之間共享。                                                                                                                                                         |
| 正在處理中 (In process)     | 在 Gradle 守護進程程序內 (Inside the Gradle daemon process)           | 否 (No)                      | 可能與 Gradle 守護進程共享堆積。 "正在處理中 (In process)" 執行策略比 "守護進程 (Daemon)" 執行策略_慢_。每個 [worker](https://docs.gradle.org/current/userguide/worker_api.html) 為每個編譯建立一個單獨的 Kotlin 編譯器類別載入器。 |
| 正在處理外 (Out of process) | 在每個編譯的單獨程序中 (In a separate process for each compilation) | 否 (No)                      | 最慢的執行策略。與 "正在處理中 (In process)" 類似，但另外為每個編譯在 Gradle worker 中建立一個單獨的 Java 程序。                                                                                                                     |

若要定義 Kotlin 編譯器執行策略，您可以使用以下其中一個屬性：
* `kotlin.compiler.execution.strategy` Gradle 屬性。
* `compilerExecutionStrategy` 編譯任務屬性。

任務屬性 `compilerExecutionStrategy` 優先於 Gradle 屬性 `kotlin.compiler.execution.strategy`。

`kotlin.compiler.execution.strategy` 屬性的可用值為：
1. `daemon`（預設）
2. `in-process`
3. `out-of-process`

在 `gradle.properties` 中使用 Gradle 屬性 `kotlin.compiler.execution.strategy`：

```none
kotlin.compiler.execution.strategy=out-of-process
```

`compilerExecutionStrategy` 任務屬性的可用值為：
1. `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.DAEMON`（預設）
2. `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.IN_PROCESS`
3. `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.OUT_OF_PROCESS`

在您的組建指令碼中使用任務屬性 `compilerExecutionStrategy`：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
import org.jetbrains.kotlin.gradle.tasks.CompileUsingKotlinDaemon
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy

// ...

tasks.withType<CompileUsingKotlinDaemon>().configureEach {
    compilerExecutionStrategy.set(KotlinCompilerExecutionStrategy.IN_PROCESS)
} 
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
import org.jetbrains.kotlin.gradle.tasks.CompileUsingKotlinDaemon
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy

// ...

tasks.withType(CompileUsingKotlinDaemon)
    .configureEach {
        compilerExecutionStrategy = KotlinCompilerExecutionStrategy.IN_PROCESS
    }
```

</TabItem>
</Tabs>

## Kotlin 編譯器回退策略 (Kotlin compiler fallback strategy)

Kotlin 編譯器的回退策略是在 Kotlin 守護進程以某種方式失敗時，在 Kotlin 守護進程外執行編譯。
如果 Gradle 守護進程已開啟，則編譯器使用 ["正在處理中 (In process) 策略"](#defining-kotlin-compiler-execution-strategy)。
如果 Gradle 守護進程已關閉，則編譯器使用 "正在處理外 (Out of process) 策略"。

當發生此回退時，您會在 Gradle 的組建輸出中看到以下警告行：

```none
Failed to compile with Kotlin daemon: java.lang.RuntimeException: Could not connect to Kotlin compile daemon
[exception stacktrace]
Using fallback strategy: Compile without Kotlin daemon
Try ./gradlew --stop if this issue persists.
```

但是，靜默回退到另一種策略可能會消耗大量系統資源或導致非確定性組建。
請在此 [YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-48843/Add-ability-to-disable-Kotlin-daemon-fallback-strategy) 中閱讀有關此內容的更多資訊。
為避免這種情況，有一個 Gradle 屬性 `kotlin.daemon.useFallbackStrategy`，其預設值為 `true`。
當值為 `false` 時，組建會在守護進程啟動或通訊出現問題時失敗。在
`gradle.properties` 中宣告此屬性：

```none
kotlin.daemon.useFallbackStrategy=false
```

在 Kotlin 編譯任務中還有一個 `useDaemonFallbackStrategy` 屬性，如果您同時使用這兩個屬性，則該屬性優先於 Gradle 屬性。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
tasks {
    compileKotlin {
        useDaemonFallbackStrategy.set(false)
    }   
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
tasks.named("compileKotlin").configure {
    useDaemonFallbackStrategy = false
}
```
</TabItem>
</Tabs>

如果沒有足夠的記憶體來執行編譯，您可以在日誌中看到一條關於它的訊息。

## 嘗試最新的語言版本 (Trying the latest language version)

從 Kotlin 2.0.0 開始，若要嘗試最新的語言版本，請在您的 `gradle.properties`
檔案中設定 `kotlin.experimental.tryNext` 屬性。當您使用此屬性時，Kotlin Gradle 外掛程式會將語言版本增加到高於您的 Kotlin 版本的預設值。
例如，在 Kotlin 2.0.0 中，預設語言版本為 2.0，因此該屬性配置
語言版本 2.1。

或者，您可以執行以下命令：

```shell
./gradlew assemble -Pkotlin.experimental.tryNext=true
``` 

在 [組建報告](#build-reports) 中，您可以找到用於編譯每個任務的語言版本。

## 組建報告 (Build reports)

組建報告包含不同編譯階段的持續時間以及編譯無法增量的任何原因。
當編譯時間過長或同一
專案的編譯時間不同時，請使用組建報告來調查效能問題。

與將單個 Gradle 任務作為粒度單位的 [Gradle 組建掃描](https://scans.gradle.com/) 相比，Kotlin 組建報告可幫助您更有效地調查組建效能問題。

以下是分析長時間運行的編譯的組建報告可以幫助您解決的兩個常見案例：
* 組建不是增量的。分析原因並修復底層問題。
* 組建是增量的，但花費了太多時間。嘗試重新組織來源檔案 — 分割大檔案，
  將單獨的類別儲存在不同的檔案中，重構大型類別，在不同的檔案中宣告頂層函式，等等。

組建報告還顯示專案中使用的 Kotlin 版本。此外，從 Kotlin 1.9.0 開始，
您可以在您的 [Gradle 組建掃描](https://scans.gradle.com/) 中看到用於編譯程式碼的編譯器。

了解 [如何讀取組建報告](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/#how_to_read_build_reports)
以及關於 [JetBrains 如何使用組建報告](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/#how_we_use_build_reports_in_jetbrains)。

### 啟用組建報告 (Enabling build reports)

若要啟用組建報告，請在 `gradle.properties` 中宣告儲存組建報告輸出的位置：

```none
kotlin.build.report.output=file
```

以下值及其組合可用於輸出：

| 選項 (Option) | 描述 (Description) |
|---|---|
| `file` | 以人類可讀的格式將組建報告儲存到本機檔案。預設情況下，它是 `${project_folder}/build/reports/kotlin-build/${project_name}-timestamp.txt` |
| `single_file` | 以物件的格式將組建報告儲存到指定的本機檔案。 |
| `build_scan` | 將組建報告儲存到 [組建掃描](https://scans.gradle.com/) 的 `custom values` 區段中。請注意，Gradle Enterprise 外掛程式限制了自訂值的數量及其長度。在大型專案中，可能會遺失某些值。 |
| `http` | 使用 HTTP(S) 發佈組建報告。POST 方法以 JSON 格式傳送指標。您可以在 [Kotlin 儲存庫](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/report/data/GradleCompileStatisticsData.kt) 中查看已傳送資料的目前版本。您可以在 [這篇部落格文章](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/?_gl=1*1a7pghy*_ga*MTcxMjc1NzE5Ny4xNjY1NDAzNjkz*_ga_9J976DJZ68*MTcxNTA3NjA2NS4zNzcuMS4xNzE1MDc2MDc5LjQ2LjAuMA..&_ga=2.265800911.1124071296.1714976764-1712757197.1665403693#enable_build_reports) 中找到 HTTP 端點的範例 |
| `json` | 以 JSON 格式將組建報告儲存到本機檔案。在 `kotlin.build.report.json.directory` 中設定組建報告的位置（請參閱下文）。預設情況下，它的名稱是 `${project_name}-build-<date-time>-<index>.json`。 |

以下是 `kotlin.build.report` 的可用選項清單：

```none
# 必要的輸出。允許任何組合
kotlin.build.report.output=file,single_file,http,build_scan,json

# 如果使用 single_file 輸出，則為強制性。放置報告的位置
# 使用此屬性代替已棄用的 `kotlin.internal.single.build.metrics.file` 屬性
kotlin.build.report.single_file=some_filename

# 如果使用 json 輸出，則為強制性。放置報告的位置
kotlin.build.report.json.directory=my/directory/path

# 可選。基於檔案的報告的輸出目錄。預設值：build/reports/kotlin-build/
kotlin.build.report.file.output_dir=kotlin-reports

# 可選。用於標記您的組建報告的標籤（例如，偵錯參數）
kotlin.build.report.label=some_label
```

僅適用於 HTTP 的選項：

```none
# 強制性。在何處發佈基於 HTTP(S) 的報告
kotlin.build.report.http.url=http://127.0.0.1:8080

# 可選。如果 HTTP 端點需要身份驗證，則為使用者和密碼
kotlin.build.report.http.user=someUser
kotlin.build.report.http.password=somePassword

# 可選。將組建的 Git 分支名稱新增到組建報告
kotlin.build.report.http.include_git_branch.name=true|false

# 可選。將編譯器引數新增到組建報告
# 如果專案包含許多模組，則報告中的編譯器引數可能非常繁重且沒有幫助
kotlin.build.report.include_compiler_arguments=true|false
```

### 自訂值限制 (Limit of custom values)

若要收集組建掃描的統計資訊，Kotlin 組建報告使用 [Gradle 的自訂值](https://docs.gradle.com/enterprise/tutorials/extending-build-scans/)。
您和不同的 Gradle 外掛程式都可以將資料寫入自訂值。自訂值的數量有限制。
請參閱 [組建掃描外掛程式文件](https://docs.gradle.com/enterprise/gradle-plugin/#adding_custom_values) 中的目前最大自訂值計數。

如果您有一個大型專案，則此類自訂值的數量可能很大。如果此數量超過限制，
您可以在日誌中看到以下訊息：

```text
Maximum number of custom values (1,000) exceeded
```

若要減少 Kotlin 外掛程式產生的自訂值數量，您可以在 `gradle.properties` 中使用以下屬性：

```none
kotlin.build.report.build_scan.custom_values_limit=500
```

### 關閉收集專案和系統屬性 (Switching off collecting project and system properties)

HTTP 組建統計資訊日誌可以包含一些專案和系統屬性。這些屬性可以變更組建的行為，
因此將它們記錄在組建統計資訊中很有用。
這些屬性可以儲存敏感資料，例如密碼或專案的完整路徑。

您可以透過將 `kotlin.build.report.http.verbose_environment` 屬性新增到
您的 `gradle.properties` 來停用這些統計資訊的收集。

:::note
JetBrains 不會收集這些統計資訊。您可以選擇一個 [儲存報告的位置](#enabling-build-reports)。

:::

## 接下來是什麼？(What's next?)

了解更多關於：
* [Gradle 基礎知識和特定知識](https://docs.gradle.org/current/userguide/userguide.html)。
* [支援 Gradle 外掛程式變體](gradle-plugin-variants)。

  ```