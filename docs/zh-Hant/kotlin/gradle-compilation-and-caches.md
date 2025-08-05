[//]: # (title: Kotlin Gradle 外掛程式中的編譯與快取)

在此頁面上，您可以了解以下主題：
* [增量編譯](#incremental-compilation)
* [Gradle 建置快取支援](#gradle-build-cache-support)
* [Gradle 設定快取支援](#gradle-configuration-cache-support)
* [Kotlin 守護行程及其在 Gradle 中的使用](#the-kotlin-daemon-and-how-to-use-it-with-gradle)
* [回溯到先前的編譯器](#rolling-back-to-the-previous-compiler)
* [定義 Kotlin 編譯器執行策略](#defining-kotlin-compiler-execution-strategy)
* [Kotlin 編譯器備援策略](#kotlin-compiler-fallback-strategy)
* [試用最新的語言版本](#trying-the-latest-language-version)
* [建置報告](#build-reports)

## 增量編譯

Kotlin Gradle 外掛程式支援增量編譯，此功能預設為 Kotlin/JVM 和 Kotlin/JS 專案啟用。增量編譯會追蹤建置之間類別路徑 (classpath) 中檔案的變更，以便僅編譯受這些變更影響的檔案。此方法適用於 [Gradle 的建置快取](#gradle-build-cache-support) 並支援 [編譯避免 (compilation avoidance)](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java_compile_avoidance)。

對於 Kotlin/JVM，增量編譯依賴於類別路徑快照，該快照會擷取模組的 API 結構，以判斷何時需要重新編譯。為優化整體流程，Kotlin 編譯器使用兩種型別的類別路徑快照：

* **細粒度快照：** 包含有關類別成員的詳細資訊，例如屬性或函式。當偵測到成員層級的變更時，Kotlin 編譯器僅重新編譯依賴於已修改成員的類別。為保持效能，Kotlin Gradle 外掛程式會為 Gradle 快取中的 `.jar` 檔案建立粗粒度快照。
* **粗粒度快照：** 僅包含類別 [ABI](https://en.wikipedia.org/wiki/Application_binary_interface) 雜湊 (hash)。當 ABI 的一部分發生變更時，Kotlin 編譯器會重新編譯所有依賴於變更類別的類別。這對於不常變更的類別（例如外部函式庫）非常有用。

> Kotlin/JS 專案使用基於歷史檔案的不同增量編譯方法。
>
{style="note"}

有幾種方式可以停用增量編譯：

* 將 Kotlin/JVM 的 `kotlin.incremental=false` 設定為 `false`。
* 將 Kotlin/JS 專案的 `kotlin.incremental.js=false` 設定為 `false`。
* 使用 `-Pkotlin.incremental=false` 或 `-Pkotlin.incremental.js=false` 作為命令列參數。

  該參數應新增到每個後續建置中。

當您停用增量編譯時，增量快取在建置後將失效。首次建置永遠不會是增量的。

> 有時增量編譯的問題在失敗發生數輪後才會顯現。使用 [建置報告](#build-reports) 來追蹤變更和編譯的歷史記錄。這有助於您提供可重現的錯誤報告。
>
{style="tip"}

要了解有關我們目前增量編譯方法的運作方式以及與先前方法相比的更多資訊，請參閱我們的 [部落格文章](https://blog.jetbrains.com/kotlin/2022/07/a-new-approach-to-incremental-compilation-in-kotlin/)。

## Gradle 建置快取支援

Kotlin 外掛程式使用 [Gradle 建置快取](https://docs.gradle.org/current/userguide/build_cache.html)，該快取儲存建置輸出，以便在未來的建置中重複使用。

要停用所有 Kotlin 任務的快取，請將系統屬性 `kotlin.caching.enabled` 設定為 `false` (使用引數 `-Dkotlin.caching.enabled=false` 執行建置)。

## Gradle 設定快取支援

Kotlin 外掛程式使用 [Gradle 設定快取](https://docs.gradle.org/current/userguide/configuration_cache.html)，該快取透過重複使用配置階段的結果來加速後續建置的過程。

請參閱 [Gradle 文件](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage) 以了解如何啟用設定快取。啟用此功能後，Kotlin Gradle 外掛程式會自動開始使用它。

## Kotlin 守護行程及其在 Gradle 中的使用

Kotlin 守護行程：
* 與 Gradle 守護行程一同執行以編譯專案。
* 當您使用 IntelliJ IDEA 內建建置系統編譯專案時，與 Gradle 守護行程分開執行。

當其中一個 Kotlin 編譯任務開始編譯原始碼時，Kotlin 守護行程會在 Gradle 的 [執行階段](https://docs.gradle.org/current/userguide/build_lifecycle.html#sec:build_phases) 啟動。Kotlin 守護行程會隨 Gradle 守護行程一同停止，或者在沒有 Kotlin 編譯活動的兩個小時閒置後停止。

Kotlin 守護行程使用與 Gradle 守護行程相同的 JDK。

### 設定 Kotlin 守護行程的 JVM 引數

以下每種設定引數的方式都會覆蓋其之前設定的引數：
* [Gradle 守護行程引數繼承](#gradle-daemon-arguments-inheritance)
* [`kotlin.daemon.jvm.options` 系統屬性](#kotlin-daemon-jvm-options-system-property)
* [`kotlin.daemon.jvmargs` 屬性](#kotlin-daemon-jvmargs-property)
* [`kotlin` 擴充功能](#kotlin-extension)
* [特定任務定義](#specific-task-definition)

#### Gradle 守護行程引數繼承

預設情況下，Kotlin 守護行程會從 Gradle 守護行程繼承一組特定的引數，但會使用為 Kotlin 守護行程直接指定的任何 JVM 引數覆寫它們。例如，如果您在 `gradle.properties` 檔案中新增以下 JVM 引數：

```none
org.gradle.jvmargs=-Xmx1500m -Xms500m -XX:MaxMetaspaceSize=1g
```

這些引數隨後會新增到 Kotlin 守護行程的 JVM 引數中：

```none
-Xmx1500m -XX:ReservedCodeCacheSize=320m -XX:MaxMetaspaceSize=1g -XX:UseParallelGC -ea -XX:+UseCodeCacheFlushing -XX:+HeapDumpOnOutOfMemoryError -Djava.awt.headless=true -Djava.rmi.server.hostname=127.0.0.1 --add-exports=java.base/sun.nio.ch=ALL-UNNAMED
```

> 要了解有關 Kotlin 守護行程 JVM 引數預設行為的更多資訊，請參閱 [Kotlin 守護行程的 JVM 引數行為](#kotlin-daemon-s-behavior-with-jvm-arguments)。
>
{style="note"}

#### kotlin.daemon.jvm.options 系統屬性

如果 Gradle 守護行程的 JVM 引數具有 `kotlin.daemon.jvm.options` 系統屬性，請在 `gradle.properties` 檔案中使用它：

```none
org.gradle.jvmargs=-Dkotlin.daemon.jvm.options=-Xmx1500m,Xms500m
```

傳遞引數時，請遵循以下規則：
* **僅**在引數 `Xmx`、`XX:MaxMetaspaceSize` 和 `XX:ReservedCodeCacheSize` 之前使用減號 `-`。
* 使用逗號 (`,`) 分隔引數，**不帶**空格。空格後面的引數將用於 Gradle 守護行程，而非 Kotlin 守護行程。

> 如果滿足以下所有條件，Gradle 會忽略這些屬性：
> * Gradle 正在使用 JDK 1.9 或更高版本。
> * Gradle 的版本介於（包含）7.0 到 7.1.1 之間。
> * Gradle 正在編譯 Kotlin DSL 腳本。
> * Kotlin 守護行程未運行。
>
> 為了解決此問題，請將 Gradle 升級到 7.2 (或更高) 版本，或使用 `kotlin.daemon.jvmargs` 屬性——請參閱下一節。
>
{style="warning"}

#### kotlin.daemon.jvmargs 屬性

您可以在 `gradle.properties` 檔案中新增 `kotlin.daemon.jvmargs` 屬性：

```none
kotlin.daemon.jvmargs=-Xmx1500m -Xms500m
```

請注意，如果您在此處或在 Gradle 的 JVM 引數中未指定 `ReservedCodeCacheSize` 引數，Kotlin Gradle 外掛程式會應用預設值 `320m`：

```none
-Xmx1500m -XX:ReservedCodeCacheSize=320m -Xms500m
```

#### kotlin 擴充功能

您可以在 `kotlin` 擴充功能中指定引數：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    kotlinDaemonJvmArgs = listOf("-Xmx486m", "-Xms256m", "-XX:+UseParallelGC")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    kotlinDaemonJvmArgs = ["-Xmx486m", "-Xms256m", "-XX:+UseParallelGC"]
}
```

</tab>
</tabs>

#### 特定任務定義

您可以為特定任務指定引數：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.withType<CompileUsingKotlinDaemon>().configureEach {
    kotlinDaemonJvmArguments.set(listOf("-Xmx486m", "-Xms256m", "-XX:+UseParallelGC"))
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.withType(CompileUsingKotlinDaemon).configureEach { task ->
    task.kotlinDaemonJvmArguments = ["-Xmx1g", "-Xms512m"]
}
```

</tab>
</tabs>

> 在這種情況下，新的 Kotlin 守護行程實例可以在任務執行時啟動。了解更多有關 [Kotlin 守護行程 JVM 引數行為](#kotlin-daemon-s-behavior-with-jvm-arguments) 的資訊。
>
{style="note"}

### Kotlin 守護行程的 JVM 引數行為

配置 Kotlin 守護行程的 JVM 引數時，請注意：

* 當不同的子專案或任務具有不同的 JVM 引數集時，預期會同時執行多個 Kotlin 守護行程實例。
* 只有當 Gradle 運行相關的編譯任務且現有 Kotlin 守護行程沒有相同的 JVM 引數集時，才會啟動新的 Kotlin 守護行程實例。
  想像一下您的專案有很多子專案。它們中的大多數都需要一些堆積記憶體用於 Kotlin 守護行程，但其中一個模組需要很多 (儘管它很少被編譯)。在這種情況下，您應該為此類模組提供一組不同的 JVM 引數，這樣具有更大堆積大小的 Kotlin 守護行程只會為接觸此特定模組的開發人員啟動。
  > 如果您已運行一個具有足夠堆積大小來處理編譯請求的 Kotlin 守護行程，即使其他請求的 JVM 引數不同，該守護行程也將被重複使用，而不會啟動新的。
  >
  {style="note"}

如果未指定以下引數，Kotlin 守護行程將從 Gradle 守護行程繼承它們：

* `-Xmx`
* `-XX:MaxMetaspaceSize`
* `-XX:ReservedCodeCacheSize`。如果未指定或繼承，預設值為 `320m`。

Kotlin 守護行程具有以下預設 JVM 引數：
* `-XX:UseParallelGC`。此引數僅在未指定其他垃圾收集器時應用。
* `-ea`
* `-XX:+UseCodeCacheFlushing`
* `-Djava.awt.headless=true`
* `-D{java.servername.property}={localhostip}`
* `--add-exports=java.base/sun.nio.ch=ALL-UNNAMED`。此引數僅適用於 JDK 16 或更高版本。

> Kotlin 守護行程的預設 JVM 引數列表可能因版本而異。您可以使用 [VisualVM](https://visualvm.github.io/) 等工具來檢查正在運行的 JVM 程序（例如 Kotlin 守護行程）的實際設定。
>
{style="note"}

## 回溯到先前的編譯器

從 Kotlin 2.0.0 開始，預設使用 K2 編譯器。

要在 Kotlin 2.0.0 或更高版本中使用先前的編譯器，請執行以下操作之一：

* 在您的 `build.gradle.kts` 檔案中，將 [語言版本設定](gradle-compiler-options.md#example-of-setting-languageversion) 為 `1.9`。

或者
* 使用以下編譯器選項：`-language-version 1.9`。

要了解有關 K2 編譯器優勢的更多資訊，請參閱 [K2 編譯器遷移指南](k2-compiler-migration-guide.md)。

## 定義 Kotlin 編譯器執行策略

_Kotlin 編譯器執行策略_ 定義了 Kotlin 編譯器的執行位置以及在每種情況下是否支援增量編譯。

有三種編譯器執行策略：

| 策略 | Kotlin 編譯器執行位置 | 增量編譯 | 其他特性和注意事項 |
|---|---|---|---|
| Daemon (守護行程) | 在其自身的守護行程中 | 是 | _預設且最快的策略_。可以在不同的 Gradle 守護行程和多個平行編譯之間共享。 |
| In process (行程內) | 在 Gradle 守護行程中 | 否 | 可能與 Gradle 守護行程共享堆積記憶體。「行程內」執行策略比「守護行程」執行策略_慢_。每個 [工作執行緒](https://docs.gradle.org/current/userguide/worker_api.html) 會為每次編譯建立一個獨立的 Kotlin 編譯器類別載入器 (classloader)。 |
| Out of process (行程外) | 在每次編譯的獨立程序中 | 否 | 最慢的執行策略。與「行程內」類似，但額外會在 Gradle 工作執行緒中為每次編譯建立一個獨立的 Java 程序。 |

要定義 Kotlin 編譯器執行策略，您可以使用以下屬性之一：
* `kotlin.compiler.execution.strategy` Gradle 屬性。
* `compilerExecutionStrategy` 編譯任務屬性。

任務屬性 `compilerExecutionStrategy` 的優先級高於 Gradle 屬性 `kotlin.compiler.execution.strategy`。

`kotlin.compiler.execution.strategy` 屬性的可用值為：
1. `daemon` (預設)
2. `in-process`
3. `out-of-process`

在 `gradle.properties` 中使用 Gradle 屬性 `kotlin.compiler.execution.strategy`：

```none
kotlin.compiler.execution.strategy=out-of-process
```

`compilerExecutionStrategy` 任務屬性的可用值為：
1. `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.DAEMON` (預設)
2. `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.IN_PROCESS`
3. `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.OUT_OF_PROCESS`

在您的建置腳本中使用任務屬性 `compilerExecutionStrategy`：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.CompileUsingKotlinDaemon
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy

// ...

tasks.withType<CompileUsingKotlinDaemon>().configureEach {
    compilerExecutionStrategy.set(KotlinCompilerExecutionStrategy.IN_PROCESS)
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.tasks.CompileUsingKotlinDaemon
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy

// ...

tasks.withType(CompileUsingKotlinDaemon)
    .configureEach {
        compilerExecutionStrategy = KotlinCompilerExecutionStrategy.IN_PROCESS
    }
```

</tab>
</tabs>

## Kotlin 編譯器備援策略

Kotlin 編譯器的備援策略是：如果守護行程因故失敗，則在 Kotlin 守護行程之外運行編譯。如果 Gradle 守護行程已啟用，編譯器會使用["行程內"策略](#defining-kotlin-compiler-execution-strategy)。如果 Gradle 守護行程已停用，編譯器會使用「行程外」策略。

當發生此備援時，您的 Gradle 建置輸出中會出現以下警告行：

```none
Failed to compile with Kotlin daemon: java.lang.RuntimeException: Could not connect to Kotlin compile daemon
[exception stacktrace]
Using fallback strategy: Compile without Kotlin daemon
Try ./gradlew --stop if this issue persists.
```

然而，靜默地備援到另一種策略可能會消耗大量系統資源或導致非確定性建置。有關此問題的更多資訊，請參閱此 [YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-48843/Add-ability-to-disable-Kotlin-daemon-fallback-strategy)。為避免此情況，有一個 Gradle 屬性 `kotlin.daemon.useFallbackStrategy`，其預設值為 `true`。當值為 `false` 時，建置會因守護行程啟動或通訊問題而失敗。在 `gradle.properties` 中宣告此屬性：

```none
kotlin.daemon.useFallbackStrategy=false
```

Kotlin 編譯任務中也有一個 `useDaemonFallbackStrategy` 屬性，如果您同時使用這兩者，該屬性將優先於 Gradle 屬性。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks {
    compileKotlin {
        useDaemonFallbackStrategy.set(false)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.named("compileKotlin").configure {
    useDaemonFallbackStrategy = false
}
```
</tab>
</tabs>

如果沒有足夠的記憶體來執行編譯，您可以在日誌中看到相關訊息。

## 試用最新的語言版本

從 Kotlin 2.0.0 開始，要試用最新的語言版本，請在您的 `gradle.properties` 檔案中設定 `kotlin.experimental.tryNext` 屬性。當您使用此屬性時，Kotlin Gradle 外掛程式會將語言版本遞增到您的 Kotlin 版本的預設值之上。例如，在 Kotlin 2.0.0 中，預設語言版本為 2.0，因此該屬性會配置語言版本 2.1。

或者，您可以運行以下命令：

```shell
./gradlew assemble -Pkotlin.experimental.tryNext=true
```

在 [建置報告](#build-reports) 中，您可以找到用於編譯每個任務的語言版本。

## 建置報告

建置報告包含不同編譯階段的持續時間以及編譯無法增量的任何原因。當編譯時間過長或同一個專案的編譯時間不同時，使用建置報告來調查效能問題。

Kotlin 建置報告可以比 [Gradle 建置掃描](https://scans.gradle.com/) 更有效地幫助您調查建置效能問題，因為後者以單一 Gradle 任務作為粒度單位。

分析長時間運行的編譯的建置報告可以幫助您解決兩個常見案例：
* 建置不是增量的。分析原因並解決潛在問題。
* 建置是增量的但花費了太多時間。嘗試重新組織原始碼檔案 — 分割大型檔案、將獨立類別儲存在不同檔案中、重構大型類別、在不同檔案中宣告頂層函式等等。

建置報告還會顯示專案中使用的 Kotlin 版本。此外，從 Kotlin 1.9.0 開始，您可以在 [Gradle 建置掃描](https://scans.gradle.com/) 中查看用於編譯程式碼的編譯器。

了解 [如何閱讀建置報告](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/#how_to_read_build_reports) 以及 [JetBrains 如何使用建置報告](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/#how_we_use_build_reports_in_jetbrains)。

### 啟用建置報告

要啟用建置報告，請在 `gradle.properties` 中宣告建置報告輸出的儲存位置：

```none
kotlin.build.report.output=file
```

以下值及其組合可用於輸出：

| 選項 | 描述 |
|---|---|
| `file` | 以人類可讀的格式將建置報告儲存到本機檔案。預設情況下，它是 `${project_folder}/build/reports/kotlin-build/${project_name}-timestamp.txt` |
| `single_file` | 以物件格式將建置報告儲存到指定的本機檔案。 |
| `build_scan` | 將建置報告儲存到 [建置掃描](https://scans.gradle.com/) 的 `custom values` 區塊中。請注意，Gradle Enterprise 外掛程式限制了自訂值的數量和長度。在大型專案中，某些值可能會丟失。 |
| `http` | 使用 HTTP(S) 發布建置報告。POST 方法以 JSON 格式發送度量。您可以在 [Kotlin 儲存庫](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/report/data/GradleCompileStatisticsData.kt) 中查看已發送資料的目前版本。您可以在 [這篇部落格文章](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/#enable_build_reports) 中找到 HTTP 端點的範例。 |
| `json` | 將建置報告以 JSON 格式儲存到本機檔案。在 `kotlin.build.report.json.directory` 中設定建置報告的位置 (見下文)。預設情況下，其名稱為 `${project_name}-build-<date-time>-<index>.json`。 |

以下是 `kotlin.build.report` 的可用選項列表：

```none
# 必需的輸出。允許任何組合
kotlin.build.report.output=file,single_file,http,build_scan,json

# 如果使用 single_file 輸出，此為必填。報告存放位置 
# 用於取代已棄用的 `kotlin.internal.single.build.metrics.file` 屬性
kotlin.build.report.single_file=some_filename

# 如果使用 json 輸出，此為必填。報告存放位置 
kotlin.build.report.json.directory=my/directory/path

# 選填。檔案式報告的輸出目錄。預設值：build/reports/kotlin-build/
kotlin.build.report.file.output_dir=kotlin-reports

# 選填。用於標記建置報告的標籤 (例如，偵錯參數)
kotlin.build.report.label=some_label
```

僅適用於 HTTP 的選項：

```none
# 必填。HTTP(S) 報告的發布位置
kotlin.build.report.http.url=http://127.0.0.1:8080

# 選填。如果 HTTP 端點需要驗證，請提供使用者名稱和密碼
kotlin.build.report.http.user=someUser
kotlin.build.report.http.password=somePassword

# 選填。將建置的 Git 分支名稱新增到建置報告中
kotlin.build.report.http.include_git_branch.name=true|false

# 選填。將編譯器引數新增到建置報告中
# 如果專案包含許多模組，其編譯器引數在報告中可能會非常龐大且幫助不大
kotlin.build.report.include_compiler_arguments=true|false
```

### 自訂值的限制

為收集建置掃描的統計資料，Kotlin 建置報告使用 [Gradle 的自訂值](https://docs.gradle.com/enterprise/tutorials/extending-build-scans/)。您和不同的 Gradle 外掛程式都可以將資料寫入自訂值。自訂值的數量有其限制。請參閱 [建置掃描外掛程式文件](https://docs.gradle.com/enterprise/gradle-plugin/#adding_custom_values) 中目前自訂值的最大計數。

如果您有一個大型專案，此類自訂值的數量可能會非常大。如果此數量超過限制，您可以在日誌中看到以下訊息：

```text
Maximum number of custom values (1,000) exceeded
```

為減少 Kotlin 外掛程式產生的自訂值數量，您可以在 `gradle.properties` 中使用以下屬性：

```none
kotlin.build.report.build_scan.custom_values_limit=500
```

### 關閉專案和系統屬性收集

HTTP 建置統計日誌可能包含某些專案和系統屬性。這些屬性可能會改變建置的行為，因此將它們記錄在建置統計中會很有用。這些屬性可能儲存敏感資料，例如密碼或專案的完整路徑。

您可以透過在 `gradle.properties` 中新增 `kotlin.build.report.http.verbose_environment` 屬性來停用這些統計資料的收集。

> JetBrains 不會收集這些統計資料。您選擇 [儲存報告的位置](#enabling-build-reports)。
>
{style="note"}

## 接下來？

了解更多：
* [Gradle 基礎知識和細節](https://docs.gradle.org/current/userguide/userguide.html)。
* [支援 Gradle 外掛程式變體](gradle-plugin-variants.md)。