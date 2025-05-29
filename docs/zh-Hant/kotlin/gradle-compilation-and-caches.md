[//]: # (title: 編譯與快取在 Kotlin Gradle 外掛程式中)

本頁面將介紹以下主題：
* [增量編譯](#incremental-compilation)
* [支援 Gradle 建構快取](#gradle-build-cache-support)
* [支援 Gradle 配置快取](#gradle-configuration-cache-support)
* [Kotlin 守護行程及其在 Gradle 中的使用方式](#the-kotlin-daemon-and-how-to-use-it-with-gradle)
* [回滾到先前的編譯器](#rolling-back-to-the-previous-compiler)
* [定義 Kotlin 編譯器執行策略](#defining-kotlin-compiler-execution-strategy)
* [Kotlin 編譯器備援策略](#kotlin-compiler-fallback-strategy)
* [嘗試最新的語言版本](#trying-the-latest-language-version)
* [建構報告](#build-reports)

## 增量編譯

Kotlin Gradle 外掛程式支援增量編譯，這對 Kotlin/JVM 和 Kotlin/JS 專案預設啟用。
增量編譯會追蹤建構之間類路徑中檔案的變更，以便只編譯受這些變更影響的檔案。
此方法與 [Gradle 的建構快取](#gradle-build-cache-support) 協同運作，並支援 [編譯避免](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java_compile_avoidance)。

對於 Kotlin/JVM，增量編譯依賴於類路徑快照，這些快照捕獲模組的 API 結構，以確定何時需要重新編譯。
為最佳化整體流程，Kotlin 編譯器使用兩種型別的類路徑快照：

* **細粒度快照：** 包含關於類別成員的詳細資訊，例如屬性或函式。
當偵測到成員層級的變更時，Kotlin 編譯器只會重新編譯依賴於修改成員的類別。
為維持效能，Kotlin Gradle 外掛程式為 Gradle 快取中的 `.jar` 檔案建立粗粒度快照。
* **粗粒度快照：** 只包含類別 [ABI](https://en.wikipedia.org/wiki/Application_binary_interface) 雜湊值。
當 ABI 的一部分發生變更時，Kotlin 編譯器會重新編譯所有依賴於該變更類別的類別。
這對於不常變更的類別（例如外部函式庫）很有用。

> Kotlin/JS 專案使用基於歷史檔案的不同增量編譯方法。 
>
{style="note"}

有幾種方法可以停用增量編譯：

* 為 Kotlin/JVM 設定 `kotlin.incremental=false`。
* 為 Kotlin/JS 專案設定 `kotlin.incremental.js=false`。
* 使用 `-Pkotlin.incremental=false` 或 `-Pkotlin.incremental.js=false` 作為命令列參數。

  此參數應新增至每次後續的建構中。

當您停用增量編譯時，增量快取在建構後將失效。首次建構永遠不是增量的。

> 有時增量編譯的問題在失敗發生數輪後才會顯現。使用 [建構報告](#build-reports)
> 來追蹤變更和編譯的歷史。這有助於您提供可重現的錯誤報告。
>
{style="tip"}

要深入了解我們當前的增量編譯方法如何運作以及與先前方法的比較，請參閱我們的 [部落格文章](https://blog.jetbrains.com/kotlin/2022/07/a-new-approach-to-incremental-compilation-in-kotlin/)。

## 支援 Gradle 建構快取

Kotlin 外掛程式使用 [Gradle 建構快取](https://docs.gradle.org/current/userguide/build_cache.html)，它儲存
建構輸出以供未來建構重複使用。

要停用所有 Kotlin 任務的快取，請將系統屬性 `kotlin.caching.enabled` 設定為 `false`
(使用引數 `-Dkotlin.caching.enabled=false` 執行建構)。

## 支援 Gradle 配置快取

Kotlin 外掛程式使用 [Gradle 配置快取](https://docs.gradle.org/current/userguide/configuration_cache.html)，
它透過重複使用配置階段的結果來加速後續建構的過程。

請參閱 [Gradle 文件](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage) 了解如何啟用配置快取。啟用此功能後，Kotlin Gradle 外掛程式會自動
開始使用它。

## Kotlin 守護行程及其在 Gradle 中的使用方式

Kotlin 守護行程：
* 與 Gradle 守護行程一起運行以編譯專案。
* 當您使用 IntelliJ IDEA 內建建構系統編譯專案時，與 Gradle 守護行程分開運行。

Kotlin 守護行程在 Gradle [執行階段](https://docs.gradle.org/current/userguide/build_lifecycle.html#sec:build_phases) 啟動，當時其中一個 Kotlin 編譯任務開始編譯原始碼。
Kotlin 守護行程會隨 Gradle 守護行程一起停止，或在沒有 Kotlin 編譯的兩個閒置小時後停止。

Kotlin 守護行程使用與 Gradle 守護行程相同的 JDK。

### 設定 Kotlin 守護行程的 JVM 引數

以下每種設定引數的方式都會覆寫其之前的方式：
* [Gradle 守護行程引數繼承](#gradle-daemon-arguments-inheritance)
* [`kotlin.daemon.jvm.options` 系統屬性](#kotlin-daemon-jvm-options-system-property)
* [`kotlin.daemon.jvmargs` 屬性](#kotlin-daemon-jvmargs-property)
* [`kotlin` 擴充](#kotlin-extension)
* [特定任務定義](#specific-task-definition)

#### Gradle 守護行程引數繼承

預設情況下，Kotlin 守護行程會從 Gradle 守護行程繼承一組特定的引數，但會使用直接為 Kotlin 守護行程指定的任何 
JVM 引數來覆寫它們。例如，如果您在 `gradle.properties` 檔案中加入以下 JVM 引數：

```none
org.gradle.jvmargs=-Xmx1500m -Xms500m -XX:MaxMetaspaceSize=1g
```

這些引數隨後會新增到 Kotlin 守護行程的 JVM 引數中：

```none
-Xmx1500m -XX:ReservedCodeCacheSize=320m -XX:MaxMetaspaceSize=1g -XX:UseParallelGC -ea -XX:+UseCodeCacheFlushing -XX:+HeapDumpOnOutOfMemoryError -Djava.awt.headless=true -Djava.rmi.server.hostname=127.0.0.1 --add-exports=java.base/sun.nio.ch=ALL-UNNAMED
```

> 要深入了解 Kotlin 守護行程與 JVM 引數的預設行為，請參閱 [Kotlin 守護行程與 JVM 引數的行為](#kotlin-daemon-s-behavior-with-jvm-arguments)。
>
{style="note"}

#### kotlin.daemon.jvm.options 系統屬性

如果 Gradle 守護行程的 JVM 引數具有 `kotlin.daemon.jvm.options` 系統屬性 – 請在 `gradle.properties` 檔案中使用它：

```none
org.gradle.jvmargs=-Dkotlin.daemon.jvm.options=-Xmx1500m,Xms500m
```

傳遞引數時，請遵循以下規則：
* 僅在引數 `Xmx`、`XX:MaxMetaspaceSize` 和 `XX:ReservedCodeCacheSize` 之前使用減號 `-`。
* 使用逗號 (`,`) 分隔引數，_不帶_空格。空格後的引數將用於 Gradle 守護行程，而不是 Kotlin 守護行程。

> 如果滿足以下所有條件，Gradle 將忽略這些屬性：
> * Gradle 正在使用 JDK 1.9 或更高版本。
> * Gradle 版本介於 7.0 和 7.1.1 之間（含）。
> * Gradle 正在編譯 Kotlin DSL 腳本。
> * Kotlin 守護行程未運行。
>
> 為了解決此問題，請將 Gradle 升級到 7.2 版（或更高版本）或使用 `kotlin.daemon.jvmargs` 屬性 – 請參閱以下部分。
>
{style="warning"}

#### kotlin.daemon.jvmargs 屬性

您可以在 `gradle.properties` 檔案中加入 `kotlin.daemon.jvmargs` 屬性：

```none
kotlin.daemon.jvmargs=-Xmx1500m -Xms500m
```

請注意，如果您在此處或 Gradle 的 JVM 引數中未指定 `ReservedCodeCacheSize` 引數，Kotlin Gradle 外掛程式將應用預設值 `320m`：

```none
-Xmx1500m -XX:ReservedCodeCacheSize=320m -Xms500m
```

#### kotlin 擴充

您可以在 `kotlin` 擴充中指定引數：

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

> 在這種情況下，新的 Kotlin 守護行程實例可以在任務執行時啟動。深入了解 [Kotlin 守護行程與 JVM 引數的行為](#kotlin-daemon-s-behavior-with-jvm-arguments)。
>
{style="note"}

### Kotlin 守護行程與 JVM 引數的行為

配置 Kotlin 守護行程的 JVM 引數時，請注意：

* 預計當不同的子專案或任務具有不同組的 JVM 引數時，會有多個 Kotlin 守護行程實例同時運行。
* 只有當 Gradle 運行相關的編譯任務且現有的 Kotlin 守護行程沒有相同的 JVM 引數集時，才會啟動新的 Kotlin 守護行程實例。
  想像一下，您的專案有很多子專案。它們中的大多數都需要一些堆積記憶體供 Kotlin 守護行程使用，但其中一個模組需要很多（儘管它很少被編譯）。
  在這種情況下，您應該為此類模組提供不同的 JVM 引數集，這樣一個具有更大堆積大小的 Kotlin 守護行程只會為接觸該特定模組的開發人員啟動。
  > 如果您已經運行了一個具有足夠堆積大小來處理編譯請求的 Kotlin 守護行程，
  > 即使其他請求的 JVM 引數不同，該守護行程也會被重複使用，而不是啟動一個新的。
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

> Kotlin 守護行程的預設 JVM 引數清單可能因版本而異。您可以使用 [VisualVM](https://visualvm.github.io/) 之類的工具來檢查正在運行的 JVM 程序（例如 Kotlin 守護行程）的實際設定。
>
{style="note"}

## 回滾到先前的編譯器

從 Kotlin 2.0.0 起，K2 編譯器預設啟用。

要在 Kotlin 2.0.0 或更高版本中使用先前的編譯器，您可以選擇：

* 在您的 `build.gradle.kts` 檔案中，將 [語言版本](gradle-compiler-options.md#example-of-setting-languageversion) 設定為 `1.9`。

  或
* 使用以下編譯器選項：`-language-version 1.9`。

要深入了解 K2 編譯器的好處，請參閱 [K2 編譯器遷移指南](k2-compiler-migration-guide.md)。

## 定義 Kotlin 編譯器執行策略

_Kotlin 編譯器執行策略_ 定義了 Kotlin 編譯器執行的位置以及在每種情況下是否支援增量編譯。

有三種編譯器執行策略：

| 策略       | Kotlin 編譯器執行位置          | 增量編譯 | 其他特性與注意事項                                                                                                                                                                                                                                                |
|----------------|--------------------------------------------|-------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 守護行程         | 在其自己的守護行程程序中              | 是                     | _預設且最快的策略_。可在不同的 Gradle 守護行程和多個平行編譯之間共享。                                                                                                                                                         |
| 程序內     | 在 Gradle 守護行程程序內           | 否                      | 可能與 Gradle 守護行程共享堆積。此「程序內」執行策略比「守護行程」執行策略_慢_。每個 [worker](https://docs.gradle.org/current/userguide/worker_api.html) 都會為每次編譯建立一個單獨的 Kotlin 編譯器類別載入器。 |
| 程序外 | 為每次編譯在單獨的程序中 | 否                      | 最慢的執行策略。與「程序內」類似，但額外為每次編譯在 Gradle worker 內建立一個單獨的 Java 程序。                                                                                                                     |

要定義 Kotlin 編譯器執行策略，您可以使用以下其中一個屬性：
* `kotlin.compiler.execution.strategy` Gradle 屬性。
* `compilerExecutionStrategy` 編譯任務屬性。

任務屬性 `compilerExecutionStrategy` 優先於 Gradle 屬性 `kotlin.compiler.execution.strategy`。

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

在您的建構腳本中使用任務屬性 `compilerExecutionStrategy`：

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

Kotlin 編譯器的備援策略是，如果守護行程因故失敗，則在 Kotlin 守護行程之外運行編譯。 
如果 Gradle 守護行程開啟，編譯器將使用[「程序內」策略](#defining-kotlin-compiler-execution-strategy)。 
如果 Gradle 守護行程關閉，編譯器將使用「程序外」策略。

當發生此備援時，您會在 Gradle 的建構輸出中看到以下警告行：

```none
Failed to compile with Kotlin daemon: java.lang.RuntimeException: Could not connect to Kotlin compile daemon
[exception stacktrace]
Using fallback strategy: Compile without Kotlin daemon
Try ./gradlew --stop if this issue persists.
```

然而，靜默備援到另一種策略可能會消耗大量系統資源或導致非確定性建構。 
有關此問題的更多資訊，請參閱此 [YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-48843/Add-ability-to-disable-Kotlin-daemon-fallback-strategy)。
為避免此問題，有一個 Gradle 屬性 `kotlin.daemon.useFallbackStrategy`，其預設值為 `true`。 
當值為 `false` 時，如果守護行程啟動或通訊出現問題，建構將失敗。在
`gradle.properties` 中宣告此屬性：

```none
kotlin.daemon.useFallbackStrategy=false
```

Kotlin 編譯任務中還有一個 `useDaemonFallbackStrategy` 屬性，如果您同時使用這兩個屬性，它將優先於 Gradle 屬性。 

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

如果記憶體不足以運行編譯，您可以在日誌中看到相關訊息。

## 嘗試最新的語言版本

從 Kotlin 2.0.0 開始，要嘗試最新的語言版本，請在您的 `gradle.properties` 檔案中設定 `kotlin.experimental.tryNext` 屬性。
當您使用此屬性時，Kotlin Gradle 外掛程式會將語言版本增加到比您 Kotlin 版本的預設值高一個的版本。
例如，在 Kotlin 2.0.0 中，預設語言版本是 2.0，因此該屬性配置語言版本 2.1。

或者，您可以運行以下命令：

```shell
./gradlew assemble -Pkotlin.experimental.tryNext=true
``` 

在 [建構報告](#build-reports) 中，您可以找到用於編譯每個任務的語言版本。

## 建構報告

建構報告包含不同編譯階段的持續時間以及編譯無法增量的任何原因。
當編譯時間過長或同一專案的編譯時間不同時，使用建構報告來調查效能問題。

Kotlin 建構報告比以單一 Gradle 任務為粒度單位的 [Gradle 建構掃描](https://scans.gradle.com/) 更有效地幫助您調查建構效能問題。

分析長時間運行的編譯的建構報告可以幫助您解決兩種常見情況：
* 建構不是增量的。分析原因並解決潛在問題。
* 建構是增量的但花費了太多時間。嘗試重新組織原始碼檔案 — 分割大檔案、將單獨的類別儲存到不同的檔案中、重構大型類別、在不同檔案中宣告頂層函式等等。

建構報告還顯示專案中使用的 Kotlin 版本。此外，從 Kotlin 1.9.0 開始，
您可以在 [Gradle 建構掃描](https://scans.gradle.com/) 中看到用於編譯程式碼的編譯器。

了解 [如何閱讀建構報告](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/#how_to_read_build_reports) 以及 [JetBrains 如何使用建構報告](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/#how_we_use_build_reports_in_jetbrains)。

### 啟用建構報告

要啟用建構報告，請在 `gradle.properties` 中宣告建構報告輸出的儲存位置：

```none
kotlin.build.report.output=file
```

以下值及其組合可用於輸出：

| 選項 | 描述 |
|---|---|
| `file` | 將建構報告以人類可讀的格式儲存到本地檔案。預設情況下，它是 `${project_folder}/build/reports/kotlin-build/${project_name}-timestamp.txt` |
| `single_file` | 將建構報告以物件格式儲存到指定的本地檔案。 |
| `build_scan` | 將建構報告儲存到 [建構掃描](https://scans.gradle.com/) 的 `custom values` 部分。請注意，Gradle Enterprise 外掛程式限制了自訂值的數量及其長度。在大型專案中，一些值可能會遺失。 |
| `http` | 使用 HTTP(S) 發布建構報告。POST 方法以 JSON 格式發送度量指標。您可以在 [Kotlin 儲存庫](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/report/data/GradleCompileStatisticsData.kt) 中查看發送資料的當前版本。您可以在 [這篇部落格文章](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/#enable_build_reports) 中找到 HTTP 端點的範例。 |
| `json` | 將建構報告以 JSON 格式儲存到本地檔案。在 `kotlin.build.report.json.directory` 中設定建構報告的位置（見下文）。預設情況下，其名稱為 `${project_name}-build-<date-time>-<index>.json`。 |

以下是 `kotlin.build.report` 的可用選項列表：

```none
# Required outputs. Any combination is allowed
kotlin.build.report.output=file,single_file,http,build_scan,json

# Mandatory if single_file output is used. Where to put reports 
# Use instead of the deprecated `kotlin.internal.single.build.metrics.file` property
kotlin.build.report.single_file=some_filename

# Mandatory if json output is used. Where to put reports 
kotlin.build.report.json.directory=my/directory/path

# Optional. Output directory for file-based reports. Default: build/reports/kotlin-build/
kotlin.build.report.file.output_dir=kotlin-reports

# Optional. Label for marking your build report (for example, debug parameters)
kotlin.build.report.label=some_label
```

僅適用於 HTTP 的選項：

```none
# Mandatory. Where to post HTTP(S)-based reports
kotlin.build.report.http.url=http://127.0.0.1:8080

# Optional. User and password if the HTTP endpoint requires authentication
kotlin.build.report.http.user=someUser
kotlin.build.report.http.password=somePassword

# Optional. Add a Git branch name of a build to a build report
kotlin.build.report.http.include_git_branch.name=true|false

# Optional. Add compiler arguments to a build report
# If a project contains many modules, its compiler arguments in the report can be very heavy and not that helpful
kotlin.build.report.include_compiler_arguments=true|false
```

### 自訂值限制

為收集建構掃描的統計資料，Kotlin 建構報告使用 [Gradle 的自訂值](https://docs.gradle.com/enterprise/tutorials/extending-build-scans/)。 
您和不同的 Gradle 外掛程式都可以向自訂值寫入資料。自訂值的數量有上限。
請參閱 [建構掃描外掛程式文件](https://docs.gradle.com/enterprise/gradle-plugin/#adding_custom_values) 中的當前最大自訂值計數。

如果您有一個大型專案，此類自訂值的數量可能會非常大。如果此數量超過限制，
您可以在日誌中看到以下訊息：

```text
Maximum number of custom values (1,000) exceeded
```

為減少 Kotlin 外掛程式產生的自訂值數量，您可以在 `gradle.properties` 中使用以下屬性：

```none
kotlin.build.report.build_scan.custom_values_limit=500
```

### 關閉專案和系統屬性收集

HTTP 建構統計日誌可能包含一些專案和系統屬性。這些屬性可以改變建構的行為，
因此將它們記錄在建構統計中很有用。 
這些屬性可能儲存敏感資料，例如密碼或專案的完整路徑。

您可以透過在 `gradle.properties` 中新增 `kotlin.build.report.http.verbose_environment` 屬性來停用這些統計資料的收集。

> JetBrains 不會收集這些統計資料。您自行選擇 [報告儲存位置](#enabling-build-reports)。
> 
{style="note"}

## 接下來是什麼？

深入了解：
* [Gradle 基礎知識與特定細節](https://docs.gradle.org/current/userguide/userguide.html)。
* [支援 Gradle 外掛程式變體](gradle-plugin-variants.md)。