---
title: "kapt 編譯器外掛程式"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::tip
kapt 處於維護模式。 我們會使其與最新的 Kotlin 和 Java 版本保持同步，但沒有實作新功能的計畫。 請使用 [Kotlin Symbol Processing API (KSP)](ksp-overview) 進行註解處理。
[請參閱 KSP 支援的程式庫清單](ksp-overview#supported-libraries)。

Kotlin 透過 _kapt_ 編譯器外掛程式支援註解處理器 (請參閱 [JSR 269](https://jcp.org/en/jsr/detail?id=269))。

簡而言之，您可以在 Kotlin 專案中使用 [Dagger](https://google.github.io/dagger/) 或
[Data Binding](https://developer.android.com/topic/libraries/data-binding/index.html) 等程式庫。

請閱讀以下內容，瞭解如何將 *kapt* 外掛程式套用到您的 Gradle/Maven 建置。

## 在 Gradle 中使用

請按照下列步驟操作：
1. 套用 `kotlin-kapt` Gradle 外掛程式：

   <Tabs groupId="build-script">
   <TabItem value="kotlin" label="Kotlin" default>

   ```kotlin
   plugins {
       kotlin("kapt") version "2.1.20"
   }
   ```

   </TabItem>
   <TabItem value="groovy" label="Groovy" default>

   ```groovy
   plugins {
       id "org.jetbrains.kotlin.kapt" version "2.1.20"
   }
   ```

   </TabItem>
   </Tabs>

2. 在 `dependencies` 區塊中使用 `kapt` 組態新增各自的相依性：

   <Tabs groupId="build-script">
   <TabItem value="kotlin" label="Kotlin" default>

   ```kotlin
   dependencies {
       kapt("groupId:artifactId:version")
   }
   ```

   </TabItem>
   <TabItem value="groovy" label="Groovy" default>

   ```groovy
   dependencies {
       kapt 'groupId:artifactId:version'
   }
   ```

   </TabItem>
   </Tabs>

3. 如果您之前使用 [Android 支援](https://developer.android.com/studio/build/gradle-plugin-3-0-0-migration.html#annotationProcessor_config)
   進行註解處理器處理，請將 `annotationProcessor` 組態的用法替換為 `kapt`。
   如果您的專案包含 Java 類別，`kapt` 也會處理它們。

   如果您將註解處理器用於 `androidTest` 或 `test` 來源，則各自的 `kapt` 組態分別命名為
   `kaptAndroidTest` 和 `kaptTest`。 請注意，`kaptAndroidTest` 和 `kaptTest` 擴充了 `kapt`，因此您可以直接提供
   `kapt` 相依性，它將同時適用於產品來源和測試。

## 試用 Kotlin K2 編譯器

kapt 編譯器外掛程式中對 K2 的支援是 [實驗性的](components-stability)。 需要選擇加入 (請參閱下面的詳細資訊)，
您應該僅將其用於評估目的。

從 Kotlin 1.9.20 開始，您可以嘗試將 kapt 編譯器外掛程式與 [K2 編譯器](https://blog.jetbrains.com/kotlin/2021/10/the-road-to-the-k2-compiler/) 搭配使用，
這會帶來效能改進和許多其他優點。 若要在您的 Gradle 專案中使用 K2 編譯器，請將下列
選項新增至您的 `gradle.properties` 檔案：

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

若要在您的 Maven 專案中啟用 kapt 外掛程式，請參閱 [](#use-in-maven)。

:::

如果您在使用 kapt 與 K2 編譯器時遇到任何問題，請將其報告給我們的
[問題追蹤器](http://kotl.in/issue)。

## 註解處理器引數 (Annotation processor arguments)

使用 `arguments {}` 區塊將引數傳遞給註解處理器：

```groovy
kapt {
    arguments {
        arg("key", "value")
    }
}
```

## Gradle 建置快取支援

kapt 註解處理工作預設會在 [Gradle 中快取](https://guides.gradle.org/using-build-cache/)。
但是，註解處理器會執行任意程式碼，這些程式碼可能不一定將工作輸入轉換為輸出，
可能會存取和修改 Gradle 未追蹤的檔案等等。 如果建置中使用的註解處理器無法
正確快取，則可以透過將下列行新增至建置指令碼來完全停用 kapt 的快取，
以避免 kapt 工作的誤判快取命中：

```groovy
kapt {
    useBuildCache = false
}
```

## 提高使用 kapt 的建置速度

### 平行執行 kapt 工作

若要提高使用 kapt 的建置速度，您可以為 kapt 工作啟用 [Gradle Worker API](https://guides.gradle.org/using-the-worker-api/)。
使用 Worker API 可讓 Gradle 平行執行來自單一專案的獨立註解處理工作，
在某些情況下，這會顯著縮短執行時間。

當您在 Kotlin Gradle 外掛程式中使用 [自訂 JDK 首頁](gradle-configure-project#gradle-java-toolchains-support) 功能時，
kapt 工作工作者僅使用 [程序隔離模式](https://docs.gradle.org/current/userguide/worker_api.html#changing_the_isolation_mode)。
請注意，會忽略 `kapt.workers.isolation` 屬性。

如果您想要為 kapt 工作者程序提供其他 JVM 引數，請使用 `KaptWithoutKotlincTask` 的輸入 `kaptProcessJvmArgs`：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.internal.KaptWithoutKotlincTask>()
    .configureEach {
        kaptProcessJvmArgs.add("-Xmx512m")
    }
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
tasks.withType(org.jetbrains.kotlin.gradle.internal.KaptWithoutKotlincTask.class)
    .configureEach {
        kaptProcessJvmArgs.add('-Xmx512m')
    }
```

</TabItem>
</Tabs>

### 註解處理器類別載入器的快取

:::caution
kapt 中註解處理器類別載入器的快取是 [實驗性的](components-stability)。
它可能會隨時刪除或變更。 僅將其用於評估目的。
我們將感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-28901) 中提供您的意見反應。

:::

如果您連續執行許多 Gradle 工作，註解處理器類別載入器的快取可協助 kapt 更快地執行。

若要啟用此功能，請在您的 `gradle.properties` 檔案中使用下列屬性：

```none
# 正值將啟用快取
# 使用與使用 kapt 的模組數量相同的值
kapt.classloaders.cache.size=5

# 停用以使快取生效
kapt.include.compile.classpath=false
```

如果您在註解處理器的快取中遇到任何問題，請停用它們的快取：

```none
# 指定註解處理器的完整名稱以停用它們的快取
kapt.classloaders.cache.disableForProcessors=[註解處理器完整名稱]
```

### 測量註解處理器的效能

使用 `-Kapt-show-processor-timings` 外掛程式選項取得註解處理器執行效能統計資訊。
輸出範例：

```text
Kapt Annotation Processing performance report:
com.example.processor.TestingProcessor: total: 133 ms, init: 36 ms, 2 round(s): 97 ms, 0 ms
com.example.processor.AnotherProcessor: total: 100 ms, init: 6 ms, 1 round(s): 93 ms
```

您可以使用外掛程式選項 [`-Kapt-dump-processor-timings` (`org.jetbrains.kotlin.kapt3:dumpProcessorTimings`)](https://github.com/JetBrains/kotlin/pull/4280) 將此報告傾印到檔案中。
下列命令將執行 kapt 並將統計資訊傾印到 `ap-perf-report.file` 檔案中：

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

### 測量使用註解處理器產生的檔案數量

`kotlin-kapt` Gradle 外掛程式可以報告每個註解處理器產生的檔案數量統計資訊。

這有助於追蹤建置中是否有未使用的註解處理器。
您可以使用產生的報告來尋找觸發不必要註解處理器的模組，並更新模組以防止這種情況。

分兩個步驟啟用統計資訊：
* 在您的 `build.gradle(.kts)` 中，將 `showProcessorStats` 旗標設定為 `true`：

  ```kotlin
  kapt {
      showProcessorStats = true
  }
  ```

* 在您的 `gradle.properties` 中，將 `kapt.verbose` Gradle 屬性設定為 `true`：

  ```none
  kapt.verbose=true
  ```

> 您也可以透過 [命令列選項 `verbose`](#use-in-cli) 啟用詳細輸出。
>
>

統計資訊將出現在記錄檔中，層級為 `info`。 您會看到 `Annotation processor stats:` 行，後面接著
每個註解處理器執行時間的統計資訊。 在這些行之後，會有 `Generated files report:` 行，後面接著
每個註解處理器產生的檔案數量統計資訊。 例如：

```text
[INFO] Annotation processor stats:
[INFO] org.mapstruct.ap.MappingProcessor: total: 290 ms, init: 1 ms, 3 round(s): 289 ms, 0 ms, 0 ms
[INFO] Generated files report:
[INFO] org.mapstruct.ap.MappingProcessor: total sources: 2, sources per round: 2, 0, 0
```

## kapt 的編譯避免

為了改善使用 kapt 的增量建置時間，它可以使用 Gradle [編譯避免](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java_compile_avoidance)。
啟用編譯避免後，Gradle 可以在重建專案時跳過註解處理。 特別是，在以下情況下會跳過註解
處理：

* 專案的原始檔未變更。
* 相依性中的變更與 [ABI](https://en.wikipedia.org/wiki/Application_binary_interface) 相容。
   例如，唯一的變更在於方法主體中。

但是，無法對在編譯類別路徑中探索到的註解處理器使用編譯避免，因為它們中的 _任何變更_
都需要執行註解處理工作。

若要使用編譯避免執行 kapt：
* 如 [上文](#use-in-gradle) 所述，手動將註解處理器相依性新增至 `kapt*` 組態。
* 透過將此行新增至您的 `gradle.properties` 檔案，關閉在編譯類別路徑中探索註解處理器：

```none
kapt.include.compile.classpath=false
```

## 增量註解處理

kapt 支援預設啟用的增量註解處理。
目前，只有在使用的所有註解處理器都是增量的情況下，註解處理才能是增量的。

若要停用增量註解處理，請將此行新增至您的 `gradle.properties` 檔案：

```none
kapt.incremental.apt=false
```

請注意，增量註解處理也需要啟用 [增量編譯](gradle-compilation-and-caches#incremental-compilation)。

## 從超組態繼承註解處理器

您可以在單獨的 Gradle 組態中定義一組常見的註解處理器，作為
超組態，並在子專案的 kapt 專用組態中進一步擴充它。

例如，對於使用 [Dagger](https://dagger.dev/) 的子專案，在您的 `build.gradle(.kts)` 檔案中，使用下列組態：

```kotlin
val commonAnnotationProcessors by configurations.creating
configurations.named("kapt") { extendsFrom(commonAnnotationProcessors) }

dependencies {
    implementation("com.google.dagger:dagger:2.48.1")
    commonAnnotationProcessors("com.google.dagger:dagger-compiler:2.48.1")
}
```

在此範例中，`commonAnnotationProcessors` Gradle 組態是您想要用於所有專案的註解處理的常見超組態。 您使用 [`extendsFrom()`](https://docs.gradle.org/current/dsl/org.gradle.api.artifacts.Configuration.html#org.gradle.api.artifacts.Configuration:extendsFrom)
方法將 `commonAnnotationProcessors` 新增為超組態。 kapt 看到 `commonAnnotationProcessors`
Gradle 組態具有對 Dagger 註解處理器的相依性。 因此，kapt 會在其註解處理組態中包含 Dagger 註解處理器。

## Java 編譯器選項

kapt 使用 Java 編譯器執行註解處理器。
以下是如何將任意選項傳遞給 javac：

```groovy
kapt {
    javacOptions {
        // Increase the max count of errors from annotation processors.
        // Default is 100.
        option("-Xmaxerrs", 500)
    }
}
```

## 不存在的類型更正

某些註解處理器 (例如 `AutoFactory`) 依賴於宣告簽章中的精確類型。
預設情況下，kapt 會將每個未知類型 (包括產生類別的類型) 替換為 `NonExistentClass`，
但您可以變更此行為。 將選項新增至 `build.gradle(.kts)` 檔案以在 stub 中啟用錯誤類型推斷：

```groovy
kapt {
    correctErrorTypes = true
}
```

## 在 Maven 中使用

在 `compile` 之前，從 kotlin-maven-plugin 新增 `kapt` 目標的執行：

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

若要設定註解處理的層級，請在 `<configuration>` 區塊中將下列其中一項設定為 `aptMode`：

   * `stubs` – 僅產生註解處理所需的 stub。
   * `apt` – 僅執行註解處理。
   * `stubsAndApt` – (預設) 產生 stub 並執行註解處理。

例如：

```xml
<configuration>
   ...
   <aptMode>stubs</aptMode>
</configuration>
```

若要使用 K2 編譯器啟用 kapt 外掛程式，請新增 `-Xuse-k2-kapt` 編譯器選項：

```xml
<configuration>
   ...
   <args>
      <arg>-Xuse-k2-kapt</arg>
   </args>
</configuration>
```

## 在 IntelliJ 建置系統中使用

IntelliJ IDEA 自己的建置系統不支援 kapt。 每當您想要重新執行註解處理時，請從「Maven 專案」
工具列啟動建置。

## 在 CLI 中使用

kapt 編譯器外掛程式可在 Kotlin 編譯器的二進位發佈中取得。

您可以透過使用 `Xplugin` kotlinc 選項提供其 JAR 檔案的路徑來附加外掛程式：

```bash
-Xplugin=$KOTLIN_HOME/lib/kotlin-annotation-processing.jar
```

以下是可用的選項清單：

* `sources` (*必要*): 產生檔案的輸出路徑。
* `classes` (*必要*): 產生的類別檔案和資源的輸出路徑。
* `stubs` (*必要*): stub 檔案的輸出路徑。 換句話說，就是一些暫時目錄。
* `incrementalData`: 二進位 stub 的輸出路徑。
* `apclasspath` (*可重複*): 註解處理器 JAR 的路徑。 傳遞與您擁有的 JAR 數量一樣多的 `apclasspath` 選項。
* `apoptions`: 註解處理器選項的 base64 編碼清單。 如需更多資訊，請參閱 [AP/javac 選項編碼](#ap-javac-options-encoding)。
* `javacArguments`: 傳遞給 javac 的選項的 base64 編碼清單。 如需更多資訊，請參閱 [AP/javac 選項編碼](#ap-javac-options-encoding)。
* `processors`: 註解處理器完整類別名稱的逗號分隔清單。 如果指定，kapt 不會嘗試在 `apclasspath` 中尋找註解處理器。
* `verbose`: 啟用詳細輸出。
* `aptMode` (*必要*)
    * `stubs` – 僅產生註解處理所需的 stub。
    * `apt` – 僅執行註解處理。
    * `stubsAndApt` – 產生 stub 並執行註解處理。
* `correctErrorTypes`: 如需更多資訊，請參閱 [不存在的類型更正](#non-existent-type-correction)。 預設停用。
* `dumpFileReadHistory`: 傾印每個檔案在註解處理期間使用的類別清單的輸出路徑。

外掛程式選項格式為：`-P plugin:<plugin id>:<key>=<value>`。 選項可以重複。

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

kapt 可以產生 Kotlin 原始碼。 只要將產生的 Kotlin 原始碼檔案寫入由 `processingEnv.options["kapt.kotlin.generated"]` 指定的目錄，
這些檔案就會與主要原始碼一起編譯。

請注意，kapt 不支援產生 Kotlin 檔案的多個回合。

## AP/Javac 選項編碼

`apoptions` 和 `javacArguments` CLI 選項接受選項的編碼對應。
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

預設情況下，kapt 會執行所有註解處理器並停用 javac 的註解處理。
但是，您可能需要一些 javac 的註解處理器才能工作 (例如，[Lombok](https://projectlombok.org/))。

在 Gradle 建置檔案中，使用選項 `keepJavacAnnotationProcessors`：

```groovy
kapt {
    keepJavacAnnotationProcessors = true
}
```

如果您使用 Maven，則需要指定具體的外掛程式設定。
請參閱此 [Lombok 編譯器外掛程式設定範例](lombok#using-with-kapt)。