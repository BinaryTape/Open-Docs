[//]: # (title: Lombok 編譯器外掛程式)

> Lombok 編譯器外掛程式是 [實驗性的](components-stability.md)。
> 它可能隨時被移除或更改。僅供評估之用。
> 我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-7112) 上提供回饋。
>
{style="warning"}

Kotlin Lombok 編譯器外掛程式允許在相同的混合 Java/Kotlin 模組中，透過 Kotlin 程式碼產生並使用 Java 的 Lombok 宣告。
如果您從另一個模組呼叫此類宣告，則該模組的編譯不需要使用意外掛程式。

Lombok 編譯器外掛程式無法取代 [Lombok](https://projectlombok.org/)，但它有助於 Lombok 在混合 Java/Kotlin 模組中運作。
因此，使用此外掛程式時，您仍需像往常一樣配置 Lombok。
深入了解 [如何配置 Lombok 編譯器外掛程式](#using-the-lombok-configuration-file)。

## 支援的註解

意外掛程式支援以下註解：
* `@Getter`、`@Setter`
* `@Builder`、`@SuperBuilder`
* `@NoArgsConstructor`、`@RequiredArgsConstructor` 和 `@AllArgsConstructor`
* `@Data`
* `@With`
* `@Value`

我們正在持續開發意外掛程式。若要了解詳細的目前狀態，請造訪 [Lombok 編譯器外掛程式的 README](https://github.com/JetBrains/kotlin/tree/master/plugins/lombok)。

目前，我們沒有計畫支援 `@Tolerate` 註解。不過，如果您在 YouTrack 中對 [@Tolerate 問題](https://youtrack.jetbrains.com/issue/KT-53564/Kotlin-Lombok-Support-Tolerate) 投下贊成票，我們可以考慮支援。

> 如果您在 Kotlin 程式碼中使用 Lombok 註解，Kotlin 編譯器會忽略它們。
>
{style="note"}

## Gradle

在 `build.gradle(.kts)` 檔案中套用 `kotlin-plugin-lombok` Gradle 外掛程式：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("plugin.lombok") version "%kotlinVersion%"
    id("io.freefair.lombok") version "%lombokVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.kotlin.plugin.lombok' version '%kotlinVersion%'
    id 'io.freefair.lombok' version '%lombokVersion%'
}
```

</tab>
</tabs>

請參閱此 [使用 Lombok 編譯器外掛程式的測試專案範例](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_gradle/nokapt)。

### 使用 Lombok 配置檔

如果您使用 [Lombok 配置檔](https://projectlombok.org/features/configuration) `lombok.config`，您需要設定該檔案的路徑，以便外掛程式能夠找到它。
該路徑必須相對於模組的目錄。
例如，將以下程式碼加入您的 `build.gradle(.kts)` 檔案中：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlinLombok {
    lombokConfigurationFile(file("lombok.config"))
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlinLombok {
    lombokConfigurationFile file("lombok.config")
}
```

</tab>
</tabs>

請參閱此 [使用 Lombok 編譯器外掛程式和 `lombok.config` 的測試專案範例](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_gradle/withconfig)。

## Maven

若要使用 Lombok 編譯器外掛程式，請將外掛程式 `lombok` 加入 `compilerPlugins` 區塊，並將依賴項 `kotlin-maven-lombok` 加入 `dependencies` 區塊。
如果您使用 [Lombok 配置檔](https://projectlombok.org/features/configuration) `lombok.config`，請在 `pluginOptions` 中向外掛程式提供其路徑。將以下行加入 `pom.xml` 檔案中：

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

請參閱此 [使用 Lombok 編譯器外掛程式和 `lombok.config` 的測試專案範例](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_maven/nokapt)。

## 與 kapt 搭配使用

預設情況下，[kapt](kapt.md) 編譯器外掛程式會執行所有註解處理器，並禁用 `javac` 的註解處理。
若要讓 [Lombok](https://projectlombok.org/) 與 `kapt` 一起執行，請設定 `kapt` 以保持 `javac` 的註解處理器運作。

如果您使用 Gradle，請將選項加入 `build.gradle(.kts)` 檔案中：

```groovy
kapt {
    keepJavacAnnotationProcessors = true
}
```

在 Maven 中，使用以下設定以 Java 編譯器啟動 Lombok：

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

如果註解處理器不依賴於 Lombok 產生的程式碼，Lombok 編譯器外掛程式可與 [kapt](kapt.md) 正確協同工作。

請查看使用 kapt 和 Lombok 編譯器外掛程式的測試專案範例：
* 使用 [Gradle](https://github.com/JetBrains/kotlin/tree/master/libraries/tools/kotlin-gradle-plugin-integration-tests/src/test/resources/testProject/lombokProject/yeskapt)。
* 使用 [Maven](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_maven/yeskapt)

## 命令列編譯器

Lombok 編譯器外掛程式 JAR 可在 Kotlin 編譯器的二進位發行版中取得。您可以使用 `-Xplugin` `kotlinc` 選項提供其 JAR 檔案的路徑來附加意外掛程式：

```bash
-Xplugin=$KOTLIN_HOME/lib/lombok-compiler-plugin.jar
```

如果您想要使用 `lombok.config` 檔案，請將 `<PATH_TO_CONFIG_FILE>` 替換為您的 `lombok.config` 路徑：

```bash
# 外掛程式選項格式為："-P plugin:<外掛程式 ID>:<鍵>=<值>"。 
# 選項可重複。

-P plugin:org.jetbrains.kotlin.lombok:config=<PATH_TO_CONFIG_FILE>
```