---
title: "Lombok 編譯器外掛程式 (Compiler Plugin)"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::note
Lombok 編譯器外掛程式是 [實驗性的 (components-stability)](components-stability)。
它可能隨時被刪除或變更。僅將其用於評估目的。
我們將感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-7112) 中對其提供的意見反應。

Kotlin Lombok 編譯器外掛程式允許在同一個混合 Java/Kotlin 模組中，由 Kotlin 程式碼產生和使用 Java 的 Lombok 宣告。
如果您從另一個模組呼叫此類宣告，則不需要為該模組的編譯使用此外掛程式。

Lombok 編譯器外掛程式無法取代 [Lombok](https://projectlombok.org/)，但它可以幫助 Lombok 在混合的 Java/Kotlin 模組中工作。
因此，當使用此外掛程式時，您仍然需要像往常一樣配置 Lombok。
瞭解更多關於[如何配置 Lombok 編譯器外掛程式](#using-the-lombok-configuration-file)。

## 支援的註解 (annotations)

此外掛程式支援下列註解：
* `@Getter`、`@Setter`
* `@Builder`、`@SuperBuilder`
* `@NoArgsConstructor`、`@RequiredArgsConstructor` 和 `@AllArgsConstructor`
* `@Data`
* `@With`
* `@Value`

我們正在繼續開發此外掛程式。要了解詳細的當前狀態，請訪問 [Lombok 編譯器外掛程式的 README](https://github.com/JetBrains/kotlin/tree/master/plugins/lombok)。

目前，我們沒有計劃支援 `@Tolerate` 註解。但是，如果您在 YouTrack 中投票支持 [@Tolerate issue](https://youtrack.jetbrains.com/issue/KT-53564/Kotlin-Lombok-Support-Tolerate)，我們可以考慮這一點。

如果您在 Kotlin 程式碼中使用 Lombok 註解，Kotlin 編譯器會忽略它們。

:::

## Gradle

在 `build.gradle(.kts)` 檔案中套用 `kotlin-plugin-lombok` Gradle 外掛程式：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    kotlin("plugin.lombok") version "2.1.20"
    id("io.freefair.lombok") version "8.13"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id 'org.jetbrains.kotlin.plugin.lombok' version '2.1.20'
    id 'io.freefair.lombok' version '8.13'
}
```

</TabItem>
</Tabs>

請參閱此 [測試專案，其中包含 Lombok 編譯器外掛程式的使用範例](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_gradle/nokapt)。

### 使用 Lombok 組態檔 (configuration file)

如果您使用 [Lombok 組態檔](https://projectlombok.org/features/configuration) `lombok.config`，則需要設定檔案的路徑，以便外掛程式可以找到它。
該路徑必須相對於模組的目錄。
例如，將以下程式碼新增到您的 `build.gradle(.kts)` 檔案：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlinLombok {
    lombokConfigurationFile(file("lombok.config"))
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlinLombok {
    lombokConfigurationFile file("lombok.config")
}
```

</TabItem>
</Tabs>

請參閱此 [測試專案，其中包含 Lombok 編譯器外掛程式和 `lombok.config` 的使用範例](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_gradle/withconfig)。

## Maven

要使用 Lombok 編譯器外掛程式，請將外掛程式 `lombok` 新增到 `compilerPlugins` 區段，並將相依性 (dependency)
`kotlin-maven-lombok` 新增到 `dependencies` 區段。
如果您使用 [Lombok 組態檔](https://projectlombok.org/features/configuration) `lombok.config`，
請在 `pluginOptions` 中提供外掛程式的路徑。將以下程式碼新增到 `pom.xml` 檔案：

```xml
<plugin>
    <groupId>org.jetbrains.kotlin</groupId>
    <artifactId>kotlin-maven-plugin</artifactId>
    <version>${kotlin.version}</version>
    <configuration>
        <compilerPlugins>
<plugin>lombok</plugin>
        </compilerPlugins>
<pluginOptions>
            <option>lombok:config=${project.basedir}/lombok.config</option>
        </pluginOptions>
    </configuration>
    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-lombok</artifactId>
            <version>${kotlin.version}</version>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.18.20</version>
            <scope>provided</scope>
        </dependency>
    </dependencies>
</plugin>
```

請參閱此 [Lombok 編譯器外掛程式和 `lombok.config` 使用範例測試專案](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_maven/nokapt)。

## 搭配 kapt 使用

預設情況下，[kapt](kapt) 編譯器外掛程式會執行所有註解處理器 (annotation processors)，並停用 javac 的註解處理。
若要將 [Lombok](https://projectlombok.org/) 與 kapt 一起執行，請設定 kapt 以保持 javac 的註解處理器正常運作。

如果您使用 Gradle，請將選項新增到 `build.gradle(.kts)` 檔案：

```groovy
kapt {
    keepJavacAnnotationProcessors = true
}
```

在 Maven 中，使用以下設定以使用 Java 編譯器啟動 Lombok：

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <version>3.5.1</version>
    <configuration>
        <source>1.8</source>
        <target>1.8</target>
        <annotationProcessorPaths>
            <annotationProcessorPath>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok</artifactId>
                <version>${lombok.version}</version>
            </annotationProcessorPath>
        </annotationProcessorPaths>
    </configuration>
</plugin>    
```

如果註解處理器不依賴 Lombok 產生的程式碼，則 Lombok 編譯器外掛程式可以與 [kapt](kapt) 正常工作。

請查看 kapt 和 Lombok 編譯器外掛程式使用範例測試專案：
* 使用 [Gradle](https://github.com/JetBrains/kotlin/tree/master/libraries/tools/kotlin-gradle-plugin-integration-tests/src/test/resources/testProject/lombokProject/yeskapt)。
* 使用 [Maven](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_maven/yeskapt)

## 命令列編譯器 (Command-line compiler)

Lombok 編譯器外掛程式 JAR 可在 Kotlin 編譯器的二進位發佈版本中取得。您可以使用 `Xplugin` kotlinc 選項提供其 JAR 檔案的路徑來附加此外掛程式：

```bash
-Xplugin=$KOTLIN_HOME/lib/lombok-compiler-plugin.jar
```

如果您想使用 `lombok.config` 檔案，請將 `<PATH_TO_CONFIG_FILE>` 替換為您的 `lombok.config` 的路徑：

```bash
# The plugin option format is: "-P plugin:<plugin id>:<key>=<value>". 
# Options can be repeated.

-P plugin:org.jetbrains.kotlin.lombok:config=<PATH_TO_CONFIG_FILE>
```