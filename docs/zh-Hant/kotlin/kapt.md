[//]: # (title: kapt 編譯器外掛程式)

> kapt 處於維護模式。我們將其與最新的 Kotlin 和 Java 版本保持同步，但沒有計劃實施新功能。請使用 [Kotlin 符號處理 API (KSP)](ksp-overview.md) 進行註解處理。
> [請參閱 KSP 支援的函式庫列表](ksp-overview.md#supported-libraries)。
>
{style="warning"}

Kotlin 透過 _kapt_ 編譯器外掛程式支援註解處理器（請參閱 [JSR 269](https://jcp.org/en/jsr/detail?id=269)）。

簡而言之，kapt 透過啟用基於 Java 的註解處理，協助您在 Kotlin 專案中使用 [Dagger](https://google.github.io/dagger/)
和 [資料繫結 (Data Binding)](https://developer.android.com/topic/libraries/data-binding/index.html) 等函式庫。

## 在 Gradle 中使用

要在 Gradle 中使用 kapt，請依照以下步驟操作：

1. 在您的建置指令碼檔案 `build.gradle(.kts)` 中應用 `kapt` Gradle 外掛程式：

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   plugins {
       kotlin("kapt") version "%kotlinVersion%"
   }
   ```

   </tab>
   <tab title="Groovy" group-key="groovy">

   ```groovy
   plugins {
       id "org.jetbrains.kotlin.kapt" version "%kotlinVersion%"
   }
   ```

   </tab>
   </tabs>

2. 在 `dependencies {}` 區塊中使用 `kapt` 配置新增相應的依賴項：

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   dependencies {
       kapt("groupId:artifactId:version")
   }
   ```

   </tab>
   <tab title="Groovy" group-key="groovy">

   ```groovy
   dependencies {
       kapt 'groupId:artifactId:version'
   }
   ```

   </tab>
   </tabs>

3. 如果您之前曾使用 [Android 支援](https://developer.android.com/studio/build/gradle-plugin-3-0-0-migration.html#annotationProcessor_config)
   進行註解處理器，請將 `annotationProcessor` 配置的用法替換為 `kapt`。
   如果您的專案包含 Java 類別，`kapt` 也會處理它們。

   如果您將註解處理器用於您的 `androidTest` 或 `test` 來源，則相應的 `kapt` 配置名稱為
   `kaptAndroidTest` 和 `kaptTest`。請注意，`kaptAndroidTest` 和 `kaptTest` 繼承自 `kapt`，因此您可以提供
   `kapt` 依賴項，它將同時適用於生產來源和測試。

## 註解處理器引數

在您的建置指令碼檔案 `build.gradle(.kts)` 中使用 `arguments {}` 區塊將引數傳遞給註解處理器：

```kotlin
kapt {
    arguments {
        arg("key", "value")
    }
}
```

## Gradle 建置快取支援

kapt 註解處理任務預設情況下在 [Gradle 中進行快取](https://guides.gradle.org/using-build-cache/)。
然而，註解處理器可以執行任意程式碼，這可能無法可靠地將任務輸入轉換為輸出，
或者可能存取和修改 Gradle 未追蹤的檔案。
如果建置中使用的註解處理器無法正確快取，
您可以透過在建置指令碼中指定 `useBuildCache` 屬性來完全停用 kapt 的快取。
這有助於防止 kapt 任務的誤報快取命中：

```groovy
kapt {
    useBuildCache = false
}
```

## 提升使用 kapt 的建置速度

### 平行執行 kapt 任務

為了提升使用 kapt 的建置速度，您可以為 kapt 任務啟用 [Gradle Worker API](https://guides.gradle.org/using-the-worker-api/)。
使用 Worker API 讓 Gradle 能夠平行執行單一專案中獨立的註解處理任務，
這在某些情況下能顯著縮短執行時間。

當您在 Kotlin Gradle 外掛程式中使用 [自訂 JDK 主目錄](gradle-configure-project.md#gradle-java-toolchains-support) 功能時，
kapt 任務 Worker 僅使用 [程序隔離模式](https://docs.gradle.org/current/userguide/worker_api.html#changing_the_isolation_mode)。
請注意，`kapt.workers.isolation` 屬性會被忽略。

如果您想為 kapt Worker 程序提供額外的 JVM 引數，請使用 `KaptWithoutKotlincTask` 的輸入 `kaptProcessJvmArgs`：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.internal.KaptWithoutKotlincTask>()
    .configureEach {
        kaptProcessJvmArgs.add("-Xmx512m")
    }
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.withType(org.jetbrains.kotlin.gradle.internal.KaptWithoutKotlincTask.class)
    .configureEach {
        kaptProcessJvmArgs.add('-Xmx512m')
    }
```

</tab>
</tabs>

### 註解處理器類別載入器的快取

<primary-label ref="experimental-general"/>

註解處理器類別載入器的快取有助於 kapt 在您連續執行多個 Gradle 任務時更快地執行。

要啟用此功能，請在您的 `gradle.properties` 檔案中使用以下屬性：

```none
# gradle.properties
#
# Any positive value enables caching
# Use the same value as the number of modules that use kapt
kapt.classloaders.cache.size=5

# Disable for caching to work
kapt.include.compile.classpath=false
```

如果您在使用註解處理器的快取方面遇到任何問題，請停用它們的快取：

```none
# Specify annotation processors' full names to disable caching for them
kapt.classloaders.cache.disableForProcessors=[annotation processors full names]
```

> 如果您遇到此功能的任何問題，
> 我們將感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-28901) 中提供回饋。
>
{style="note"}

### 測量註解處理器的效能

要獲取註解處理器執行的效能統計資料，
請使用 `-Kapt-show-processor-timings` 外掛程式選項。
範例輸出：

```text
Kapt Annotation Processing performance report:
com.example.processor.TestingProcessor: total: 133 ms, init: 36 ms, 2 round(s): 97 ms, 0 ms
com.example.processor.AnotherProcessor: total: 100 ms, init: 6 ms, 1 round(s): 93 ms
```

您可以使用外掛程式選項 [`-Kapt-dump-processor-timings` (`org.jetbrains.kotlin.kapt3:dumpProcessorTimings`)](https://github.com/JetBrains/kotlin/pull/4280) 將此報告傾印到檔案中。
以下命令將執行 kapt 並將統計資料傾印到 `ap-perf-report.file` 檔案中：

```bash
kotlinc -cp $MY_CLASSPATH \
-Xplugin=kotlin-annotation-processing-SNAPSHOT.jar -P \
plugin:org.jetbrains.kotlin.kapt3:aptMode=stubsAndApt,\
plugin:org.jetbrains.kotlin.kapt3:apclasspath=processor/build/libs/processor.jar,\
plugin:org.jetbrains.kotlin.kapt3:dumpProcessorTimings=ap-perf-report.file \
-Xplugin=$JAVA_HOME/lib/tools.jar \
-d cli-tests/out \
-no-jdk -no-reflect -no-stdlib -verbose \
sample/src/main/
```

### 測量使用註解處理器生成的檔案數量

`kapt` Gradle 外掛程式可以報告每個註解處理器生成的檔案數量的統計資料。

這有助於追蹤建置中是否包含任何未使用的註解處理器。
您可以使用生成的報告來查找觸發不必要註解處理器的模組，並更新這些模組以避免這種情況。

要啟用統計報告：

1. 在您的 `build.gradle(.kts)` 中將 `showProcessorStats` 屬性值設定為 `true`：

   ```kotlin
   // build.gradle.kts
   kapt {
       showProcessorStats = true
   }
   ```

2. 在您的 `gradle.properties` 中將 `kapt.verbose` Gradle 屬性設定為 `true`：

   ```none
   # gradle.properties
   kapt.verbose=true
   ```

> 您也可以透過 [命令列選項 `verbose`](#use-in-cli) 啟用詳細輸出。
>
{style="note"}

統計資料會以 `info` 等級顯示在日誌中。
您會看到 `Annotation processor stats:` 行，其後是每個註解處理器執行時間的統計資料。
這些行之後是 `Generated files report:` 行，其後是每個註解處理器生成的檔案數量的統計資料。例如：

```text
[INFO] Annotation processor stats:
[INFO] org.mapstruct.ap.MappingProcessor: total: 290 ms, init: 1 ms, 3 round(s): 289 ms, 0 ms, 0 ms
[INFO] Generated files report:
[INFO] org.mapstruct.ap.MappingProcessor: total sources: 2, sources per round: 2, 0, 0
```

## kapt 的編譯避免

為了改進使用 kapt 的增量建置時間，它可以使用 Gradle [編譯避免](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java_compile_avoidance)。
啟用編譯避免後，Gradle 可以在重建專案時跳過註解處理。特別是，註解
處理會在以下情況下跳過：

* 專案的原始檔未更改。
* 依賴項中的更改是 [ABI](https://en.wikipedia.org/wiki/Application_binary_interface) 相容的。
   例如，僅方法主體有更改。

然而，編譯避免不能用於在編譯類別路徑中發現的註解處理器，因為它們的 _任何更改_
都要求執行註解處理任務。

要使用編譯避免來執行 kapt：
* [手動將註解處理器依賴項新增到 `kapt*` 配置中](#use-in-gradle)。
* 在 `gradle.properties` 檔案中關閉編譯類別路徑中註解處理器的發現：

   ```none
   # gradle.properties
   kapt.include.compile.classpath=false
   ```

## 增量註解處理

kapt 預設支援增量註解處理。
目前，註解處理只有在所有正在使用的註解處理器都是增量時才能增量。

要停用增量註解處理，請將此行新增到您的 `gradle.properties` 檔案中：

```none
kapt.incremental.apt=false
```

請注意，增量註解處理也需要啟用 [增量編譯](gradle-compilation-and-caches.md#incremental-compilation)。

## 從超配置繼承註解處理器

您可以將一組常見的註解處理器定義為單獨的 Gradle 配置中的
超配置，並在您的子專案的 kapt 特定配置中進一步擴展它。

例如，對於使用 [Dagger](https://dagger.dev/) 的子專案，在您的 `build.gradle(.kts)` 檔案中，請使用以下配置：

```kotlin
val commonAnnotationProcessors by configurations.creating
configurations.named("kapt") { extendsFrom(commonAnnotationProcessors) }

dependencies {
    implementation("com.google.dagger:dagger:2.48.1")
    commonAnnotationProcessors("com.google.dagger:dagger-compiler:2.48.1")
}
```

在此範例中，`commonAnnotationProcessors` Gradle 配置是您希望用於所有專案的註解處理的通用超配置。
您使用 [`extendsFrom()`](https://docs.gradle.org/current/dsl/org.gradle.api.artifacts.Configuration.html#org.gradle.api.artifacts.Configuration:extendsFrom)
方法將 `commonAnnotationProcessors` 新增為超配置。kapt 看到 `commonAnnotationProcessors`
Gradle 配置對 Dagger 註解處理器有依賴項。因此，kapt 在其註解處理配置中包含了 Dagger 註解處理器。

## Java 編譯器選項

kapt 使用 Java 編譯器來執行註解處理器。
以下是如何將任意選項傳遞給 javac：

```groovy
kapt {
    javacOptions {
        // 增加來自註解處理器的最大錯誤數量。
        // 預設值為 100。
        option("-Xmaxerrs", 500)
    }
}
```

## 不存在的類型校正

一些註解處理器（例如 `AutoFactory`）依賴於宣告簽章中的精確類型。
預設情況下，kapt 會將每個未知類型（包括生成類別的類型）替換為 `NonExistentClass`，
但您可以更改此行為。將該選項新增到 `build.gradle(.kts)` 檔案中以在 Stub 中啟用錯誤類型推斷：

```groovy
kapt {
    correctErrorTypes = true
}
```

## 在 Maven 中使用

在 `compile` 之前，新增 kotlin-maven-plugin 中 `kapt` 目標的執行：

```xml
<execution>
    <id>kapt</id>
    <goals>
        <goal>kapt</goal> <!-- 如果您為外掛程式啟用擴展，則可以跳過 <goals> 元素 -->
    </goals>
    <configuration>
        <sourceDirs>
            <sourceDir>src/main/kotlin</sourceDir>
            <sourceDir>src/main/java</sourceDir>
        </sourceDirs>
        <annotationProcessorPaths>
            <!-- 在此處指定您的註解處理器 -->
            <annotationProcessorPath>
                <groupId>com.google.dagger</groupId>
                <artifactId>dagger-compiler</artifactId>
                <version>2.9</version>
            </annotationProcessorPath>
        </annotationProcessorPaths>
    </configuration>
</execution>
```

要配置註解處理的等級，請在 `<configuration>` 區塊中設定以下任一 `aptMode`：

   * `stubs` – 僅生成註解處理所需的 Stub。
   * `apt` – 僅執行註解處理。
   * `stubsAndApt` – (預設) 生成 Stub 並執行註解處理。

例如：

```xml
<configuration>
   ...
   <aptMode>stubs</aptMode>
</configuration>
```

## 在 IntelliJ 建置系統中使用

IntelliJ IDEA 自身的建置系統不支援 kapt。每當您想重新執行註解處理時，請從「Maven Projects」
工具列啟動建置。

## 在命令列介面中使用

kapt 編譯器外掛程式在 Kotlin 編譯器的二進位發行版中可用。

您可以透過使用 `Xplugin` kotlinc 選項提供其 JAR 檔案的路徑來附加外掛程式：

```bash
-Xplugin=$KOTLIN_HOME/lib/kotlin-annotation-processing.jar
```

以下是可用選項的列表：

* `sources` (*必填*): 生成檔案的輸出路徑。
* `classes` (*必填*): 生成類別檔案和資源的輸出路徑。
* `stubs` (*必填*): Stub 檔案的輸出路徑。換句話說，一些暫存目錄。
* `incrementalData`: 二進位 Stub 的輸出路徑。
* `apclasspath` (*可重複*): 註解處理器 JAR 的路徑。根據您擁有的 JAR 數量，傳遞相同數量的 `apclasspath` 選項。
* `apoptions`: 註解處理器選項的 Base64 編碼列表。有關詳細資訊，請參閱 [AP/javac 選項編碼](#ap-javac-options-encoding)。
* `javacArguments`: 傳遞給 javac 的選項的 Base64 編碼列表。有關詳細資訊，請參閱 [AP/javac 選項編碼](#ap-javac-options-encoding)。
* `processors`: 以逗號分隔的註解處理器合格類別名稱列表。如果指定，kapt 不會嘗試在 `apclasspath` 中查找註解處理器。
* `verbose`: 啟用詳細輸出。
* `aptMode` (*必填*)
    * `stubs` – 僅生成註解處理所需的 Stub。
    * `apt` – 僅執行註解處理。
    * `stubsAndApt` – 生成 Stub 並執行註解處理。
* `correctErrorTypes`: 有關詳細資訊，請參閱 [不存在的類型校正](#non-existent-type-correction)。預設情況下停用。
* `dumpFileReadHistory`: 每個檔案的輸出路徑，用於傾倒在註解處理期間使用的類別列表。

外掛程式選項格式為：`-P plugin:<plugin id>:<key>=<value>`。選項可以重複。

範例：

```bash
-P plugin:org.jetbrains.kotlin.kapt3:sources=build/kapt/sources
-P plugin:org.jetbrains.kotlin.kapt3:classes=build/kapt/classes
-P plugin:org.jetbrains.kotlin.kapt3:stubs=build/kapt/stubs

-P plugin:org.jetbrains.kotlin.kapt3:apclasspath=lib/ap.jar
-P plugin:org.jetbrains.kotlin.kapt3:apclasspath=lib/anotherAp.jar

-P plugin:org.jetbrains.kotlin.kapt3:correctErrorTypes=true
```

## 生成 Kotlin 來源

kapt 可以生成 Kotlin 來源。只需將生成的 Kotlin 來源檔案寫入由 `processingEnv.options["kapt.kotlin.generated"]` 指定的目錄，
這些檔案將與主要來源一起編譯。

請注意，kapt 不支援對生成的 Kotlin 檔案進行多輪處理。

## AP/Javac 選項編碼

`apoptions` 和 `javacArguments` CLI 選項接受選項的編碼映射。
以下是如何自行編碼選項：

```kotlin
fun encodeList(options: Map<String, String>): String {
    val os = ByteArrayOutputStream()
    val oos = ObjectOutputStream(os)

    oos.writeInt(options.size)
    for ((key, value) in options.entries) {
        oos.writeUTF(key)
        oos.writeUTF(value)
    }

    oos.flush()
    return Base64.getEncoder().encodeToString(os.toByteArray())
}
```

## 保留 Java 編譯器的註解處理器

預設情況下，kapt 執行所有註解處理器並停用 javac 的註解處理。
然而，您可能需要一些 javac 的註解處理器正常運作（例如 [Lombok](https://projectlombok.org/)）。

在 Gradle 建置檔案中，使用選項 `keepJavacAnnotationProcessors`：

```groovy
kapt {
    keepJavacAnnotationProcessors = true
}
```

如果您使用 Maven，則需要指定具體的外掛程式設定。
請參閱 [Lombok 編譯器外掛程式設定的範例](lombok.md#using-with-kapt)。