[//]: # (title: Kotlin 守護行程)

Kotlin 守護行程 (daemon) 是一個背景程序，建構系統可利用它來縮短建構時間，方式是讓編譯器及其環境保持準備好進行編譯。這種方法避免了每次編譯都啟動新的 Java 虛擬機器 (JVM) 實例並重新初始化編譯器，從而減少了增量建構或頻繁小幅變更的建構時間。

一些建構系統有自己的守護行程來協助降低啟動成本，例如 [Gradle daemon](https://docs.gradle.org/current/userguide/gradle_daemon.html) 和 [Maven daemon](https://maven.apache.org/tools/mvnd.html)。使用 Kotlin 守護行程除了降低啟動成本外，還能將建構系統程序與編譯器完全隔離。這種分離在系統設定可能在執行時變更的動態環境中非常有用。

儘管 Kotlin 守護行程沒有直接的使用者介面，但您可以透過建構系統或 [建構工具 API](build-tools-api.md) 來使用它。

## Kotlin 守護行程設定

針對 Gradle 或 Maven，有一些方法可以設定 Kotlin 守護行程的某些設定。

### 記憶體管理

Kotlin 守護行程是一個獨立的程序，擁有自己的記憶體空間，與客戶端隔離。
預設情況下，Kotlin 守護行程會嘗試繼承啟動 JVM 程序的堆積大小 (`-Xmx`)。

要設定特定的記憶體限制，例如 `-Xmx` 和 `-XX:MaxMetaspaceSize`，請使用以下屬性：

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin.daemon.jvmargs=-Xmx1500m
```

更多資訊，請參閱 [`kotlin.daemon.jvmargs` 屬性](gradle-compilation-and-caches.md#kotlin-daemon-jvmargs-property)。

</tab>
<tab title="Maven" group-key="maven">

```xml
<kotlin.compiler.daemon.jvmArgs>-Xmx1500m</kotlin.compiler.daemon.jvmArgs>
```

</tab>
</tabs>

### 生命週期

Kotlin 守護行程有兩種常見的生命週期策略：

*   **附加式守護行程 (Attached daemon)**：在客戶端程序關閉後不久，或守護行程閒置一段時間後關閉。適用於客戶端長時間執行的情況。
*   **分離式守護行程 (Detached daemon)**：讓守護行程存活更長時間，以等待潛在的後續請求。適用於客戶端短暫執行的情況。

要設定生命週期策略，您可以使用以下選項：

| 選項                      | 說明                                                                                               | 預設值 |
|-----------------------------|----------------------------------------------------------------------------------------------------|---------------|
| `autoshutdownIdleSeconds`   | 當客戶端仍保持連線時，守護行程在上次編譯後應保持活動狀態多長時間。                             | 2 小時        |
| `autoshutdownUnusedSeconds` | 新啟動的守護行程在關閉前，等待首個客戶端連接的時間，如果未使用。                   | 1 分鐘        |
| `shutdownDelayMilliseconds` | 所有客戶端斷開連線後，守護行程等待關閉的時間。                                                   | 1 秒          |

要設定附加式守護行程生命週期策略，請將 `autoshutdownIdleSeconds` 設定為 **高** 值，並將 `shutdownDelayMilliseconds` 設定為 **低** 值。

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

將以下內容新增至您的 `gradle.properties` 檔案中：

```none
org.gradle.jvmargs=-Dkotlin.daemon.jvm.options=autoshutdownIdleSeconds=7200,shutdownDelayMilliseconds=1000
```

</tab>
<tab title="Maven" group-key="maven">

使用以下命令：

```bash
 mvn package -Dkotlin.daemon.options=autoshutdownIdleSeconds=7200,shutdownDelayMilliseconds=1000
```

</tab>
</tabs>

要設定分離式守護行程生命週期策略，請將 `shutdownDelayMilliseconds` 設定為 **高** 值。

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

將以下內容新增至您的 `gradle.properties` 檔案中：

```none
org.gradle.jvmargs=-Dkotlin.daemon.jvm.options=shutdownDelayMilliseconds=7200
```

</tab>
<tab title="Maven" group-key="maven">

將以下屬性新增至您的 `pom.xml` 檔案中：

```xml
<kotlin.compiler.daemon.shutdownDelayMs>7200</kotlin.compiler.daemon.shutdownDelayMs>
```

</tab>
</tabs>