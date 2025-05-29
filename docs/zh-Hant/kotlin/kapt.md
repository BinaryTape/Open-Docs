[//]: # (title: kapt 編譯器外掛)

> kapt 處於維護模式。我們將使其與最新的 Kotlin 和 Java 版本保持同步，但目前沒有實施新功能的計畫。請使用 [Kotlin Symbol Processing API (KSP)](ksp-overview.md) 進行註釋處理。 [請參閱 KSP 支援的程式庫列表](ksp-overview.md#supported-libraries)。
>
{style="warning"}

Kotlin 透過 _kapt_ 編譯器外掛程式支援註釋處理器（請參閱 [JSR 269](https://jcp.org/en/jsr/detail?id=269)）。

簡而言之，您可以在 Kotlin 專案中使用諸如 [Dagger](https://google.github.io/dagger/) 或 [Data Binding](https://developer.android.com/topic/libraries/data-binding/index.html) 之類的程式庫。

請閱讀下方內容，了解如何將 *kapt* 外掛程式應用於您的 Gradle/Maven 建置。

## 在 Gradle 中使用

請遵循以下步驟：
1. 應用 `kotlin-kapt` Gradle 外掛程式：

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

2. 在您的 `dependencies` 區塊中使用 `kapt` 組態新增相應的依賴項：

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

3. 如果您之前曾使用 [Android 支援](https://developer.android.com/studio/build/gradle-plugin-3-0-0-migration.html#annotationProcessor_config) 來處理註釋處理器，請將 `annotationProcessor` 組態的用法替換為 `kapt`。如果您的專案包含 Java 類別，`kapt` 也會處理它們。

   如果您將註釋處理器用於您的 `androidTest` 或 `test` 原始碼，則相應的 `kapt` 組態名稱為 `kaptAndroidTest` 和 `kaptTest`。請注意，`kaptAndroidTest` 和 `kaptTest` 擴展自 `kapt`，因此您只需提供 `kapt` 依賴項，它將同時適用於生產原始碼和測試。

## 試用 Kotlin K2 編譯器

> kapt 編譯器外掛程式中對 K2 的支援仍處於 [實驗性](components-stability.md) 階段。需要選擇啟用（詳情請參閱下方），且您應僅將其用於評估目的。
>
{style="warning"}

從 Kotlin 1.9.20 開始，您可以嘗試將 kapt 編譯器外掛程式與 [K2 編譯器](https://blog.jetbrains.com/kotlin/2021/10/the-road-to-the-k2-compiler/) 搭配使用，它帶來了效能改進和許多其他優勢。要在 Gradle 專案中使用 K2 編譯器，請將以下選項新增到您的 `gradle.properties` 檔案中：

```kotlin
kapt.use.k2=true
```

如果您使用 Maven 建置系統，請更新您的 `pom.xml` 檔案：

```xml
<configuration>
   ...
   <args>
      <arg>-Xuse-k2-kapt</arg>
   </args>
</configuration>
```

> 要在 Maven 專案中啟用 kapt 外掛程式，請參閱 [](#use-in-maven)。
>
{style="tip"}

如果您在使用 kapt 與 K2 編譯器時遇到任何問題，請向我們的 [問題追蹤器](http://kotl.in/issue) 報告。

## 註釋處理器參數

使用 `arguments {}` 區塊將參數傳遞給註釋處理器：

```groovy
kapt {
    arguments {
        arg("key", "value")
    }
}
```

## Gradle 建置快取支援

kapt 註釋處理任務預設在 [Gradle 中進行快取](https://guides.gradle.org/using-build-cache/)。然而，註釋處理器執行任意程式碼，這些程式碼不一定會將任務輸入轉換為輸出，可能會存取和修改 Gradle 未追蹤的檔案等。如果在建置中使用的註釋處理器無法正確快取，則可以透過在建置指令碼中新增以下行來完全禁用 kapt 的快取，以避免 kapt 任務的誤報快取命中：

```groovy
kapt {
    useBuildCache = false
}
```

## 提升使用 kapt 的建置速度

### 並行執行 kapt 任務

為了提高使用 kapt 的建置速度，您可以為 kapt 任務啟用 [Gradle Worker API](https://guides.gradle.org/using-the-worker-api/)。使用 Worker API 允許 Gradle 並行執行單一專案中獨立的註釋處理任務，這在某些情況下能顯著縮短執行時間。

當您在 Kotlin Gradle 外掛程式中使用 [自訂 JDK 主目錄](gradle-configure-project.md#gradle-java-toolchains-support) 功能時，kapt 任務工作者僅使用 [處理程序隔離模式](https://docs.gradle.org/current/userguide/worker_api.html#changing_the_isolation_mode)。請注意，`kapt.workers.isolation` 屬性將被忽略。

如果您想為 kapt 工作處理程序提供額外的 JVM 參數，請使用 `KaptWithoutKotlincTask` 的輸入 `kaptProcessJvmArgs`：

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

### 註釋處理器類別載入器的快取

> kapt 中註釋處理器類別載入器的快取仍處於 [實驗性](components-stability.md) 階段。它可能隨時被移除或更改。請僅將其用於評估目的。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-28901) 上提供相關回饋。
>
{style="warning"}

註釋處理器類別載入器的快取有助於 kapt 在您連續執行多個 Gradle 任務時更快地執行。

要啟用此功能，請在您的 `gradle.properties` 檔案中使用以下屬性：

```none
# positive value will enable caching
# use the same value as the number of modules that use kapt
kapt.classloaders.cache.size=5

# disable for caching to work
kapt.include.compile.classpath=false
```

如果您在使用註釋處理器快取時遇到任何問題，請禁用它們的快取：

```none
# specify annotation processors' full names to disable caching for them
kapt.classloaders.cache.disableForProcessors=[annotation processors full names]
```

### 測量註釋處理器的效能

使用 `-Kapt-show-processor-timings` 外掛程式選項取得註釋處理器執行的效能統計。輸出範例：

```text
Kapt Annotation Processing performance report:
com.example.processor.TestingProcessor: total: 133 ms, init: 36 ms, 2 round(s): 97 ms, 0 ms
com.example.processor.AnotherProcessor: total: 100 ms, init: 6 ms, 1 round(s): 93 ms
```

您可以將此報告使用外掛程式選項 [`-Kapt-dump-processor-timings` (`org.jetbrains.kotlin.kapt3:dumpProcessorTimings`)](https://github.com/JetBrains/kotlin/pull/4280) 轉儲到檔案中。以下命令將執行 kapt 並將統計資料轉儲到 `ap-perf-report.file` 檔案：

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

### 測量透過註釋處理器生成的檔案數量

`kotlin-kapt` Gradle 外掛程式可以報告每個註釋處理器生成的檔案數量統計。

這有助於追蹤建置中是否存在未使用的註釋處理器。您可以使用生成的報告來查找觸發不必要註釋處理器的模組，並更新這些模組以防止這種情況發生。

分兩步啟用統計：
* 在您的 `build.gradle(.kts)` 中將 `showProcessorStats` 旗標設定為 `true`：

  ```kotlin
  kapt {
      showProcessorStats = true
  }
  ```

* 在您的 `gradle.properties` 中將 `kapt.verbose` Gradle 屬性設定為 `true`：

  ```none
  kapt.verbose=true
  ```

> 您也可以透過 [命令列選項 `verbose`](#use-in-cli) 啟用詳細輸出。
>
> {style="note"}

統計資料將以 `info` 級別顯示在日誌中。您將看到 `Annotation processor stats:` 行，其後是每個註釋處理器執行時間的統計資料。這些行之後將有 `Generated files report:` 行，其後是每個註釋處理器生成的檔案數量的統計資料。例如：

```text
[INFO] Annotation processor stats:
[INFO] org.mapstruct.ap.MappingProcessor: total: 290 ms, init: 1 ms, 3 round(s): 289 ms, 0 ms, 0 ms
[INFO] Generated files report:
[INFO] org.mapstruct.ap.MappingProcessor: total sources: 2, sources per round: 2, 0, 0
```

## kapt 的編譯迴避

為了縮短使用 kapt 的增量建置時間，它可以使用 Gradle 的 [編譯迴避](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java_compile_avoidance) 功能。啟用編譯迴避後，Gradle 可以在重建專案時跳過註釋處理。具體而言，註釋處理在以下情況下被跳過：

* 專案的原始碼檔案未更改。
* 依賴項中的更改與 [ABI](https://en.wikipedia.org/wiki/Application_binary_interface) 相容。例如，僅更改了方法體。

然而，對於在編譯類別路徑中發現的註釋處理器，無法使用編譯迴避，因為它們的**任何更改**都需要執行註釋處理任務。

若要使用編譯迴避來執行 kapt：
* 按照 [上方](#use-in-gradle) 描述的方式，手動將註釋處理器依賴項新增到 `kapt*` 組態中。
* 透過將此行新增到您的 `gradle.properties` 檔案中，關閉編譯類別路徑中註釋處理器的發現：

```none
kapt.include.compile.classpath=false
```

## 增量註釋處理

kapt 支援預設啟用的增量註釋處理。目前，只有當所有使用的註釋處理器都是增量時，註釋處理才能是增量的。

要禁用增量註釋處理，請將此行新增到您的 `gradle.properties` 檔案中：

```none
kapt.incremental.apt=false
```

請注意，增量註釋處理也需要啟用 [增量編譯](gradle-compilation-and-caches.md#incremental-compilation)。

## 從上層組態繼承註釋處理器

您可以在單獨的 Gradle 組態中定義一組通用的註釋處理器作為上層組態，並在您的子專案的 kapt 特定組態中進一步擴展它。

例如，對於使用 [Dagger](https://dagger.dev/) 的子專案，在您的 `build.gradle(.kts)` 檔案中，請使用以下組態：

```kotlin
val commonAnnotationProcessors by configurations.creating
configurations.named("kapt") { extendsFrom(commonAnnotationProcessors) }

dependencies {
    implementation("com.google.dagger:dagger:2.48.1")
    commonAnnotationProcessors("com.google.dagger:dagger-compiler:2.48.1")
}
```

在此範例中，`commonAnnotationProcessors` Gradle 組態是您希望用於所有專案的通用註釋處理上層組態。您使用 [`extendsFrom()`](https://docs.gradle.org/current/dsl/org.gradle.api.artifacts.Configuration.html#org.gradle.api.artifacts.Configuration:extendsFrom) 方法將 `commonAnnotationProcessors` 添加為上層組態。kapt 會看到 `commonAnnotationProcessors` Gradle 組態依賴於 Dagger 註釋處理器。因此，kapt 將 Dagger 註釋處理器包含在其註釋處理組態中。

## Java 編譯器選項

kapt 使用 Java 編譯器來執行註釋處理器。以下是您如何將任意選項傳遞給 javac 的方法：

```groovy
kapt {
    javacOptions {
        // Increase the max count of errors from annotation processors.
        // Default is 100.
        option("-Xmaxerrs", 500)
    }
}
```

## 不存在類型修正

某些註釋處理器（例如 `AutoFactory`）依賴於宣告簽章中的精確類型。預設情況下，kapt 會將每個未知類型（包括生成類別的類型）替換為 `NonExistentClass`，但您可以更改此行為。將此選項新增到 `build.gradle(.kts)` 檔案中，以在 stubs 中啟用錯誤類型推斷：

```groovy
kapt {
    correctErrorTypes = true
}
```

## 在 Maven 中使用

在 `compile` 之前新增 kotlin-maven-plugin 的 `kapt` 目標執行：

```xml
<execution>
    <id>kapt</id>
    <goals>
        <goal>kapt</goal> <!-- You can skip the <goals> element 
        if you enable extensions for the plugin -->
    </goals>
    <configuration>
        <sourceDirs>
            <sourceDir>src/main/kotlin</sourceDir>
            <sourceDir>src/main/java</sourceDir>
        </sourceDirs>
        <annotationProcessorPaths>
            <!-- Specify your annotation processors here -->
            <annotationProcessorPath>
                <groupId>com.google.dagger</groupId>
                <artifactId>dagger-compiler</artifactId>
                <version>2.9</version>
            </annotationProcessorPath>
        </annotationProcessorPaths>
    </configuration>
</execution>
```

若要配置註釋處理級別，請在 `<configuration>` 區塊中將以下其中一個設定為 `aptMode`：

   * `stubs` – 僅生成註釋處理所需的 stubs。
   * `apt` – 僅執行註釋處理。
   * `stubsAndApt` – （預設）生成 stubs 並執行註釋處理。

例如：

```xml
<configuration>
   ...
   <aptMode>stubs</aptMode>
</configuration>
```

若要啟用與 K2 編譯器搭配使用的 kapt 外掛程式，請新增 `-Xuse-k2-kapt` 編譯器選項：

```xml
<configuration>
   ...
   <args>
      <arg>-Xuse-k2-kapt</arg>
   </args>
</configuration>
```

## 在 IntelliJ 建置系統中使用

IntelliJ IDEA 自身的建置系統不支援 kapt。每當您想要重新執行註釋處理時，請從「Maven Projects」工具列啟動建置。

## 在 CLI 中使用

kapt 編譯器外掛程式在 Kotlin 編譯器的二進位發佈中可用。

您可以透過使用 `Xplugin` kotlinc 選項提供其 JAR 檔案的路徑來附加外掛程式：

```bash
-Xplugin=$KOTLIN_HOME/lib/kotlin-annotation-processing.jar
```

以下是可用選項的列表：

* `sources` （*必填*）：生成檔案的輸出路徑。
* `classes` （*必填*）：生成類別檔案和資源的輸出路徑。
* `stubs` （*必填*）：stub 檔案的輸出路徑。換句話說，是一個臨時目錄。
* `incrementalData`：二進位 stub 的輸出路徑。
* `apclasspath` （*可重複*）：註釋處理器 JAR 的路徑。根據您擁有的 JAR 數量傳遞相同數量的 `apclasspath` 選項。
* `apoptions`：註釋處理器選項的 Base64 編碼列表。有關更多資訊，請參閱 [AP/javac 選項編碼](#ap-javac-options-encoding)。
* `javacArguments`：傳遞給 javac 選項的 Base64 編碼列表。有關更多資訊，請參閱 [AP/javac 選項編碼](#ap-javac-options-encoding)。
* `processors`：逗號分隔的註釋處理器合格類別名稱列表。如果指定，kapt 不會嘗試在 `apclasspath` 中查找註釋處理器。
* `verbose`：啟用詳細輸出。
* `aptMode` （*必填*）
    * `stubs` – 僅生成註釋處理所需的 stubs。
    * `apt` – 僅執行註釋處理。
    * `stubsAndApt` – 生成 stubs 並執行註釋處理。
* `correctErrorTypes`：有關更多資訊，請參閱 [不存在類型修正](#non-existent-type-correction)。預設禁用。
* `dumpFileReadHistory`：用於轉儲每個檔案在註釋處理期間使用的類別列表的輸出路徑。

外掛程式選項格式為：`-P plugin:<外掛程式 ID>:<鍵>=<值>`。選項可以重複。

範例：

```bash
-P plugin:org.jetbrains.kotlin.kapt3:sources=build/kapt/sources
-P plugin:org.jetbrains.kotlin.kapt3:classes=build/kapt/classes
-P plugin:org.jetbrains.kotlin.kapt3:stubs=build/kapt/stubs

-P plugin:org.jetbrains.kotlin.kapt3:apclasspath=lib/ap.jar
-P plugin:org.jetbrains.kotlin.kapt3:apclasspath=lib/anotherAp.jar

-P plugin:org.jetbrains.kotlin.kapt3:correctErrorTypes=true
```

## 生成 Kotlin 原始碼

kapt 可以生成 Kotlin 原始碼。只需將生成的 Kotlin 原始碼檔案寫入 `processingEnv.options["kapt.kotlin.generated"]` 指定的目錄，這些檔案將與主要原始碼一起編譯。

請注意，kapt 不支援對生成的 Kotlin 檔案進行多輪處理。

## AP/Javac 選項編碼

`apoptions` 和 `javacArguments` CLI 選項接受一個編碼的選項映射。以下是您可以自行編碼選項的方法：

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

## 保留 Java 編譯器的註釋處理器

預設情況下，kapt 會執行所有註釋處理器並禁用 javac 的註釋處理。然而，您可能需要某些 javac 的註釋處理器正常運作（例如 [Lombok](https://projectlombok.org/)）。

在 Gradle 建置檔案中，使用選項 `keepJavacAnnotationProcessors`：

```groovy
kapt {
    keepJavacAnnotationProcessors = true
}
```

如果您使用 Maven，則需要指定具體的外掛程式設定。請參閱此 [Lombok 編譯器外掛程式的設定範例](lombok.md#using-with-kapt)。