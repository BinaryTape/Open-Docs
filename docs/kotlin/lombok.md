[//]: # (title: Lombok 编译器插件)

> Lombok 编译器插件是[实验性](components-stability.md)的。
> 它随时可能取消或更改。请仅将其用于评估目的。
> 欢迎通过 [YouTrack](https://youtrack.jetbrains.com/issue/KT-7112) 提供反馈。
>
{style="warning"}

Kotlin Lombok 编译器插件允许 Kotlin 代码在同一个混合 Java/Kotlin 模块中生成和使用 Java 的 Lombok 声明。
如果您从另一个模块调用此类声明，则无需为该模块的编译使用此插件。

Lombok 编译器插件不能替代 [Lombok](https://projectlombok.org/)，但它有助于 Lombok 在混合 Java/Kotlin 模块中工作。
因此，当使用此插件时，您仍需要按常规配置 Lombok。
详细了解[如何配置 Lombok 编译器插件](#using-the-lombok-configuration-file)。

## 支持的注解

该插件支持以下注解：
*   `@Getter`、`@Setter`
*   `@Builder`、`@SuperBuilder`
*   `@NoArgsConstructor`、`@RequiredArgsConstructor` 和 `@AllArgsConstructor`
*   `@Data`
*   `@With`
*   `@Value`

我们正在继续开发此插件。要了解详细的当前状态，请访问 [Lombok 编译器插件的 README](https://github.com/JetBrains/kotlin/tree/master/plugins/lombok)。

目前，我们没有计划支持 `@Tolerate` 注解。但是，如果您在 YouTrack 中为 [@Tolerate 问题](https://youtrack.jetbrains.com/issue/KT-53564/Kotlin-Lombok-Support-Tolerate) 投票，我们可以考虑。

> 如果在 Kotlin 代码中使用 Lombok 注解，Kotlin 编译器会忽略它们。
>
{style="note"}

## Gradle

在 `build.gradle(.kts)` 文件中应用 `kotlin-plugin-lombok` Gradle 插件：

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

请参阅这个[使用 Lombok 编译器插件的测试项目示例](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_gradle/nokapt)。

### 使用 Lombok 配置文件

如果您使用 [Lombok 配置文件](https://projectlombok.org/features/configuration) `lombok.config`，您需要设置该文件的路径，以便插件可以找到它。
路径必须相对于模块的目录。
例如，将以下代码添加到您的 `build.gradle(.kts)` 文件中：

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

请参阅这个[使用 Lombok 编译器插件和 `lombok.config` 的测试项目示例](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_gradle/withconfig)。

## Maven

要使用 Lombok 编译器插件，请将插件 `lombok` 添加到 `compilerPlugins` 部分，并将依赖 `kotlin-maven-lombok` 添加到 `dependencies` 部分。
如果您使用 [Lombok 配置文件](https://projectlombok.org/features/configuration) `lombok.config`，请在 `pluginOptions` 中向插件提供其路径。将以下行添加到 `pom.xml` 文件中：

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

请参阅这个[使用 Lombok 编译器插件和 `lombok.config` 的测试项目示例](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_maven/nokapt)。

## 与 kapt 结合使用

默认情况下，[kapt](kapt.md) 编译器插件会运行所有注解处理器并禁用 javac 的注解处理。
要将 [Lombok](https://projectlombok.org/) 与 kapt 一起运行，请将 kapt 设置为保持 javac 的注解处理器正常工作。

如果您使用 Gradle，请将该选项添加到 `build.gradle(.kts)` 文件中：

```groovy
kapt {
    keepJavacAnnotationProcessors = true
}
```

在 Maven 中，使用以下设置通过 Java 编译器启动 Lombok：

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

如果注解处理器不依赖于 Lombok 生成的代码，Lombok 编译器插件可以与 [kapt](kapt.md) 正常工作。

查看使用 kapt 和 Lombok 编译器插件的测试项目示例：
*   使用 [Gradle](https://github.com/JetBrains/kotlin/tree/master/libraries/tools/kotlin-gradle-plugin-integration-tests/src/test/resources/testProject/lombokProject/yeskapt)。
*   使用 [Maven](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_maven/yeskapt)

## 命令行编译器

Lombok 编译器插件 JAR 文件在 Kotlin 编译器的二进制发行版中可用。您可以通过使用 `Xplugin` kotlinc 选项提供其 JAR 文件的路径来附加该插件：

```bash
-Xplugin=$KOTLIN_HOME/lib/lombok-compiler-plugin.jar
```

如果您想使用 `lombok.config` 文件，请将 `<PATH_TO_CONFIG_FILE>` 替换为您的 `lombok.config` 文件的路径：

```bash
# 插件选项格式为："-P plugin:<plugin id>:<key>=<value>"。 
# 选项可以重复。

-P plugin:org.jetbrains.kotlin.lombok:config=<PATH_TO_CONFIG_FILE>
```