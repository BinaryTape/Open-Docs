[//]: # (title: Kotlin Daemon)

Kotlin daemon 是一個背景程序，建構系統可以使用它來保持編譯器及其環境處於就緒狀態，從而縮短建置時間。這種方法避免了為每次編譯啟動新的 Java 虛擬機 (JVM) 執行個體並重新初始化編譯器，進而縮短了增量建置或頻繁小幅變更時的建置時間。

某些建構系統擁有自己的 daemon 以協助降低啟動開銷，例如 [Gradle daemon](https://docs.gradle.org/current/userguide/gradle_daemon.html) 與 [Maven daemon](https://maven.apache.org/tools/mvnd.html)。改用 Kotlin daemon 則可在降低啟動開銷的同時，將建構系統程序與編譯器完全隔離。這種隔離在系統設定可能於執行期變動的動態環境中非常有用。

雖然 Kotlin daemon 沒有直接面向使用者的介面，但您可以透過建構系統或 [建置工具 API](build-tools-api.md) 來使用它。

## Kotlin Daemon 配置

您可以透過多種方式為 Gradle 或 Maven 的 Kotlin daemon 配置部分設定。

### 記憶體管理

Kotlin daemon 是一個獨立的程序，擁有自己的記憶體空間，並與用戶端隔離。預設情況下，Kotlin daemon 會嘗試繼承啟動它的 JVM 程序的堆積大小 (`-Xmx`)。

若要配置特定的記憶體限制，例如 `-Xmx` 與 `-XX:MaxMetaspaceSize`，請使用以下屬性：

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin.daemon.jvmargs=-Xmx1500m
```

如需更多資訊，請參閱 [`kotlin.daemon.jvmargs` 屬性](gradle-compilation-and-caches.md#kotlin-daemon-jvmargs-property)。

</tab>
<tab title="Maven" group-key="maven">

```xml
<kotlin.compiler.daemon.jvmArgs>-Xmx1500m</kotlin.compiler.daemon.jvmArgs>
```

</tab>
</tabs>

### 生命周期

Kotlin daemon 有兩種常見的生命週期策略：

* **Attached daemon**：在用戶端程序關閉後不久，或 daemon 一段時間未被使用時關閉。適用於用戶端長時間執行的情況。 
* **Detached daemon**：讓 daemon 保持運行更長時間，以等待潛在的後續請求。適用於用戶端生命週期較短的情況。 

若要配置生命週期策略，您可以使用以下選項：

| 選項                          | 說明                                                                                              | 預設值         |
|-----------------------------|---------------------------------------------------------------------------------------------------|---------------|
| `autoshutdownIdleSeconds`   | 當用戶端仍連線時，daemon 在最後一次編譯後應保持運行的時間。                                                 | 2 小時        |
| `autoshutdownUnusedSeconds` | 新啟動且未使用的 daemon 在關閉前等待第一個用戶端的時間。                                                     | 1 分鐘        |
| `shutdownDelayMilliseconds` | 所有用戶端斷開連線後，daemon 等待關閉的時間。                                                               | 1 秒          |

若要配置 attached daemon 生命週期策略，請將 `autoshutdownIdleSeconds` 設為 **高** 值，並將 `shutdownDelayMilliseconds` 設為 **低** 值。

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

將以下內容新增至您的 `gradle.properties` 檔案：

```none
org.gradle.jvmargs=-Dkotlin.daemon.jvm.options=autoshutdownIdleSeconds=7200,shutdownDelayMilliseconds=1000
```

</tab>
<tab title="Maven" group-key="maven">

使用以下指令：

```bash
 mvn package -Dkotlin.daemon.options=autoshutdownIdleSeconds=7200,shutdownDelayMilliseconds=1000
```

</tab>
</tabs>

若要配置 detached daemon 生命週期策略，請將 `shutdownDelayMilliseconds` 設為 **高** 值。

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

將以下內容新增至您的 `gradle.properties` 檔案：

```none
org.gradle.jvmargs=-Dkotlin.daemon.jvm.options=shutdownDelayMilliseconds=7200
```

</tab>
<tab title="Maven" group-key="maven">

將以下屬性新增至您的 `pom.xml` 檔案：

```xml
<kotlin.compiler.daemon.shutdownDelayMs>7200</kotlin.compiler.daemon.shutdownDelayMs>
```

</tab>
</tabs>