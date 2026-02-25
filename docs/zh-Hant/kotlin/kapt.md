[//]: # (title: kapt 編譯器外掛程式)

> kapt 處於維護模式。我們正使其與最近的 Kotlin 和 Java 版本保持同步，但目前沒有計畫實作新功能。請使用 [Kotlin Symbol Processing API (KSP)](ksp-overview.md) 進行註解處理。
> [查看 KSP 支援的程式庫列表](ksp-overview.md#supported-libraries)。
>
{style="warning"}

Kotlin 透過 *kapt* 編譯器外掛程式支援註解處理器（參見 [JSR 269](https://jcp.org/en/jsr/detail?id=269)）。

簡而言之，kapt 透過啟用基於 Java 的註解處理，協助您在 Kotlin 專案中使用 [Dagger](https://google.github.io/dagger/) 和 [資料繫結](https://developer.android.com/topic/libraries/data-binding/index.html) 等程式庫。

## 在 Gradle 中使用

若要在 Gradle 中使用 kapt，請按照下列步驟操作：

1. 在您的建置指令碼檔案 `build.gradle(.kts)` 中套用 `kapt` Gradle 外掛程式：

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

2. 在 `dependencies {}` 區塊中使用 `kapt` 配置加入對應的相依性：

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

3. 如果您之前曾針對註解處理器使用 [Android 支援](https://developer.android.com/studio/build/gradle-plugin-3-0-0-migration.html#annotationProcessor_config)，請將 `annotationProcessor` 配置的使用替換為 `kapt`。如果您的專案包含 Java 類別，`kapt` 也會一併處理它們。

   如果您為 `androidTest` 或 `test` 原始碼使用註解處理器，對應的 `kapt` 配置名稱分別為 `kaptAndroidTest` 和 `kaptTest`。請注意，`kaptAndroidTest` 和 `kaptTest` 繼承自 `kapt`，因此您可以提供 `kapt` 相依性，它將同時可用於生產原始碼和測試。

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

預設情況下，kapt 註解處理任務會在 [Gradle 中快取](https://guides.gradle.org/using-build-cache/)。然而，註解處理器可以執行任意程式碼，這可能無法可靠地將任務輸入轉換為輸出，或者可能會存取及修改 Gradle 未追蹤的檔案。如果組建中使用的註解處理器無法正確快取，您可以透過在建置指令碼中指定 `useBuildCache` 屬性來完全停用 kapt 的快取。這有助於防止 kapt 任務出現錯誤的快取命中：

```groovy
kapt {
    useBuildCache = false
}
```

## 提高使用 kapt 的組建速度

### 並行執行 kapt 任務

為了提高使用 kapt 的組建速度，您可以為 kapt 任務啟用 [Gradle Worker API](https://guides.gradle.org/using-the-worker-api/)。使用 Worker API 讓 Gradle 能從單一專案中並行執行獨立的註解處理任務，在某些情況下可以顯著減少執行時間。

當您在 Kotlin Gradle 外掛程式中使用 [自訂 JDK home](gradle-configure-project.md#gradle-java-toolchains-support) 功能時，kapt 任務的 worker 僅使用 [處理序隔離模式](https://docs.gradle.org/current/userguide/worker_api.html#changing_the_isolation_mode)。請注意，`kapt.workers.isolation` 屬性會被忽略。

如果您想為 kapt worker 處理序提供額外的 JVM 引數，請使用 `KaptWithoutKotlincTask` 的輸入 `kaptProcessJvmArgs`：

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

### 為註解處理器的類別載入器提供快取

<primary-label ref="experimental-general"/>

如果您連續執行多個 Gradle 任務，為註解處理器的類別載入器提供快取有助於 kapt 執行得更快。

若要啟用此功能，請在您的 `gradle.properties` 檔案中使用以下屬性：

```none
# gradle.properties
#
# 任何正值都會啟用快取
# 使用與使用 kapt 的模組數量相同的值
kapt.classloaders.cache.size=5

# 必須停用此項以使快取運作
kapt.include.compile.classpath=false
```

如果您在註解處理器的快取方面遇到任何問題，請停用它們的快取：

```none
# 指定註解處理器的全名以停用其快取
kapt.classloaders.cache.disableForProcessors=[註解處理器全名]
```

> 如果您在使用此功能時遇到任何問題，歡迎在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-28901) 中向我們提供回饋。
> 
{style="note"}

### 評估註解處理器的效能

若要獲取註解處理器執行的效能統計資料，請使用 `-Kapt-show-processor-timings` 外掛程式選項。輸出範例：

```text
Kapt Annotation Processing performance report:
com.example.processor.TestingProcessor: total: 133 ms, init: 36 ms, 2 round(s): 97 ms, 0 ms
com.example.processor.AnotherProcessor: total: 100 ms, init: 6 ms, 1 round(s): 93 ms
```

您可以使用外掛程式選項 [`-Kapt-dump-processor-timings` (`org.jetbrains.kotlin.kapt3:dumpProcessorTimings`)](https://github.com/JetBrains/kotlin/pull/4280) 將此報告傾印到檔案中。以下指令將執行 kapt 並將統計資料傾印到 `ap-perf-report.file` 檔案中：

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

### 評估註解處理器產生的檔案數量

`kapt` Gradle 外掛程式可以報告每個註解處理器產生檔案數量的統計資料。

這有助於追蹤組建中是否包含任何未使用的註解處理器。您可以使用產生的報告來尋找觸發不必要註解處理器的模組，並更新模組以避免這種情況。

若要啟用統計報告：

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

> 您也可以透過 [命令列選項 `verbose`](#在-cli-中使用) 啟用詳細輸出。
>
{style="note"}

統計資料會以 `info` 層級顯示在日誌中。您可以看到 `Annotation processor stats:` 行，接著是每個註解處理器執行時間的統計資料。在這些行之後，有 `Generated files report:` 行，接著是每個註解處理器產生檔案數量的統計資料。例如：

```text
[INFO] Annotation processor stats:
[INFO] org.mapstruct.ap.MappingProcessor: total: 290 ms, init: 1 ms, 3 round(s): 289 ms, 0 ms, 0 ms
[INFO] Generated files report:
[INFO] org.mapstruct.ap.MappingProcessor: total sources: 2, sources per round: 2, 0, 0
```

## kapt 的編譯規避

為了提高 kapt 增量組建的時間，它可以使用 Gradle 的 [編譯規避](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java_compile_avoidance)。啟用編譯規避後，Gradle 在重新組建專案時可以跳過註解處理。特別是在下列情況下會跳過註解處理：

* 專案的原始程式碼檔案未變更。
* 相依性的變更符合 [ABI](https://en.wikipedia.org/wiki/Application_binary_interface) 相容。例如，唯一的變更是方法主體。

然而，編譯規避無法用於在編譯類別路徑中探索到的註解處理器，因為其中的 *任何變更* 都需要執行註解處理任務。

若要以編譯規避執行 kapt：
* [手動將註解處理器相依性加入 `kapt*` 配置](#在-gradle-中使用)。
* 在 `gradle.properties` 檔案中關閉在編譯類別路徑中探索註解處理器：

   ```none
   # gradle.properties
   kapt.include.compile.classpath=false
   ```

## 增量註解處理

kapt 預設支援增量註解處理。目前，只有當所有使用的註解處理器都是增量的，註解處理才具備增量性。

若要停用增量註解處理，請在您的 `gradle.properties` 檔案中加入此行：

```none
kapt.incremental.apt=false
```

請注意，增量註解處理也需要啟用 [增量編譯](gradle-compilation-and-caches.md#incremental-compilation)。

## 從父配置繼承註解處理器

您可以在單獨的 Gradle 配置中定義一組通用的註解處理器作為父配置，並在子專案的 kapt 專屬配置中進一步延伸它。

例如，對於使用 [Dagger](https://dagger.dev/) 的子專案，在您的 `build.gradle(.kts)` 檔案中使用以下配置：

```kotlin
val commonAnnotationProcessors by configurations.creating
configurations.named("kapt") { extendsFrom(commonAnnotationProcessors) }

dependencies {
    implementation("com.google.dagger:dagger:2.48.1")
    commonAnnotationProcessors("com.google.dagger:dagger-compiler:2.48.1")
}
```

在此範例中，`commonAnnotationProcessors` Gradle 配置是您希望用於所有專案的通用註解處理父配置。您使用 [`extendsFrom()`](https://docs.gradle.org/current/dsl/org.gradle.api.artifacts.Configuration.html#org.gradle.api.artifacts.Configuration:extendsFrom) 方法將 `commonAnnotationProcessors` 加入為父配置。kapt 會看到 `commonAnnotationProcessors` Gradle 配置對 Dagger 註解處理器具有相依性。因此，kapt 會在其註解處理配置中包含 Dagger 註解處理器。
 
## Java 編譯器選項

kapt 使用 Java 編譯器來執行註解處理器。以下是您傳遞任意選項給 javac 的方式：

```groovy
kapt {
    javacOptions {
        // 增加註解處理器的最大錯誤數量。
        // 預設值為 100。
        option("-Xmaxerrs", 500)
    }
}
```

## 不存在的型別校正

某些註解處理器（如 `AutoFactory`）依賴宣告簽章中的精確型別。預設情況下，kapt 會將每個未知的型別（包括產生的類別型別）替換為 `NonExistentClass`，但您可以變更此行為。在 `build.gradle(.kts)` 檔案中加入選項，以啟用虛設常式中的錯誤型別推論：

```groovy
kapt {
    correctErrorTypes = true
}
```

## 在 Maven 中使用

在 `compile` 之前加入 kotlin-maven-plugin 的 `kapt` 目標執行：

```xml
<execution>
    <id>kapt</id>
    <goals>
        <goal>kapt</goal> <!-- 如果您為外掛程式啟用了擴充套件，
        可以跳過 <goals> 元素 -->
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

若要配置註解處理的層級，請在 `<configuration>` 區塊中將以下其中之一設定為 `aptMode`：

   * `stubs` – 僅產生註解處理所需的虛設常式。
   * `apt` – 僅執行註解處理。
   * `stubsAndApt` – （預設）產生虛設常式並執行註解處理。

例如：

```xml
<configuration>
   ...
   <aptMode>stubs</aptMode>
</configuration>
```

## 在 IntelliJ 組建系統中使用

IntelliJ IDEA 的原生組建系統不支援 kapt。每當您想要重新執行註解處理時，請從「Maven Projects」工具列啟動組建。

## 在命令列中使用

kapt 編譯器外掛程式包含在 Kotlin 編譯器的二進位發行版中。

您可以透過使用 `Xplugin` kotlinc 選項提供其 JAR 檔案的路徑來附加該外掛程式：

```bash
-Xplugin=$KOTLIN_HOME/lib/kotlin-annotation-processing.jar
```

以下是可用選項的列表：

* `sources` (*必填*): 產生檔案的輸出路徑。
* `classes` (*必填*): 產生的類別檔案和資源的輸出路徑。
* `stubs` (*必填*): 虛設常式檔案的輸出路徑。換句話說，就是某些暫時目錄。
* `incrementalData`: 二進位虛設常式的輸出路徑。
* `apclasspath` (*可重複*): 註解處理器 JAR 的路徑。根據您擁有的 JAR 數量傳遞多個 `apclasspath` 選項。
* `apoptions`: Base64 編碼的註解處理器選項列表。有關更多資訊，請參閱 [AP/javac 選項編碼](#apjavac-選項編碼)。
* `javacArguments`: Base64 編碼的傳遞給 javac 的選項列表。有關更多資訊，請參閱 [AP/javac 選項編碼](#apjavac-選項編碼)。
* `processors`: 以逗號分隔的註解處理器合格類別名稱列表。如果指定，kapt 將不會嘗試在 `apclasspath` 中尋找註解處理器。
* `verbose`: 啟用詳細輸出。
* `aptMode` (*必填*)
    * `stubs` – 僅產生註解處理所需的虛設常式。
    * `apt` – 僅執行註解處理。
    * `stubsAndApt` – 產生虛設常式並執行註解處理。
* `correctErrorTypes`: 有關更多資訊，請參閱 [不存在的型別校正](#不存在的型別校正)。預設為停用。
* `dumpFileReadHistory`: 針對每個檔案傾印註解處理期間使用的類別列表的輸出路徑。

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

## 產生 Kotlin 原始碼

kapt 可以產生 Kotlin 原始碼。只需將產生的 Kotlin 原始碼檔案寫入 `processingEnv.options["kapt.kotlin.generated"]` 指定的目錄，這些檔案就會與主原始碼一起編譯。

請注意，kapt 不支援產生 Kotlin 檔案的多回合處理。

## AP/Javac 選項編碼

`apoptions` 和 `javacArguments` 命令列選項接受一個編碼後的選項對照表。以下是您可以自行編碼選項的方式：

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

預設情況下，kapt 會執行所有註解處理器並停用 javac 的註解處理。但是，您可能需要一些 javac 的註解處理器正常運作（例如 [Lombok](https://projectlombok.org/)）。

在 Gradle 組建檔案中，使用 `keepJavacAnnotationProcessors` 選項：

```groovy
kapt {
    keepJavacAnnotationProcessors = true
}
```

如果您使用 Maven，則需要指定具體的外掛程式設定。請參閱這份 [Lombok 編譯器外掛程式設定範例](lombok.md#using-with-kapt)。