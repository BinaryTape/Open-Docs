[//]: # (title: 将 Kotlin 添加到 Java 项目 – 教程)

Kotlin 与 Java 完全互操作，因此您可以逐步将其引入现有的 Java 项目，而无需重写所有内容。

在本教程中，您将学习如何：

* 设置 Maven 或 Gradle 构建工具来编译 Java 和 Kotlin 代码。
* 在项目目录中组织 Java 和 Kotlin 源文件。
* 使用 IntelliJ IDEA 将 Java 文件转换为 Kotlin。

> 您可以使用任何现有的 Java 项目来学习本教程，也可以克隆我们已设置好 Maven 和 Gradle 构建文件的公开[示例项目](https://github.com/kotlin-hands-on/kotlin-junit-sample/tree/main/complete)。
>
{style="tip"}

## 项目配置

要将 Kotlin 添加到 Java 项目，您需要根据所使用的构建工具，将项目配置为同时使用 Kotlin 和 Java。

项目配置可确保 Kotlin 和 Java 代码都能正确编译，并能无缝地相互引用。

### Maven

> 从 **IntelliJ IDEA 2025.3** 开始，当您向基于 Maven 的 Java 项目添加第一个 Kotlin 文件时，IDE 会自动更新您的 `pom.xml` 文件，以包含 Kotlin Maven 插件和标准依赖项。如果您想自定义版本或构建阶段，仍可以手动进行配置。
>
{style="note"}

要在 Maven 项目中同时使用 Kotlin 和 Java，请应用 Kotlin Maven 插件并在您的 `pom.xml` 文件中添加 Kotlin 依赖项：

1. 在 `<properties>` 部分，添加 Kotlin 版本属性：

    ```xml
    ```
   {src="jvm-test-tutorial/pom.xml" ignore-vars="false" include-lines="13,17,18"}

2. 在 `<dependencies>` 部分，将所需的依赖项添加到 `<plugins>` 部分：

    ```xml
    ```
   {src="jvm-test-tutorial/pom.xml" include-lines="32,38-43,45-49,62"}

3. 在 `<build><plugins>` 部分，添加 Kotlin 插件：

    ```xml
    ```
   {src="jvm-test-tutorial/pom.xml" include-lines="64-66,102-104,105-137"}

   在此配置中：

    * `<extensions>true</extensions>` 让 Maven 将 Kotlin 插件集成到构建生命周期中。
    * 自定义执行阶段允许 Kotlin 插件先编译 Kotlin，再编译 Java。
    * Kotlin 和 Java 代码可以通过配置的 `sourceDirs` 目录相互引用。
    * 在使用带扩展功能的 Kotlin Maven 插件时，您不需要在 `<build><pluginManagement>` 部分使用单独的 `maven-compiler-plugin`。

4. 在 IDE 中重新加载 Maven 项目。
5. 运行测试以验证配置：

    ```bash
    ./mvnw clean test
    ```

### Gradle

要在 Gradle 项目中同时使用 Kotlin 和 Java，请应用 Kotlin JVM 插件并在您的 `build.gradle.kts` 文件中添加 Kotlin 依赖项：

1. 在 `plugins {}` 块中，添加 Kotlin JVM 插件：

    ```kotlin
    plugins {
        // 其他插件
        kotlin("jvm") version "%kotlinVersion%"
    }
    ```

2. 设置 JVM 工具链版本以匹配您的 Java 版本：

    ```kotlin
    kotlin {
        jvmToolchain(17)
    }
    ```

   这确保了 Kotlin 使用与 Java 代码相同的 JDK 版本。

3. 在 `dependencies {}` 块中，添加 `kotlin("test")` 库，该库提供 Kotlin 测试工具并与 JUnit 集成：

    ```kotlin
    dependencies {
        // 其他依赖项
    
        testImplementation(kotlin("test"))
        // 其他测试依赖项
    }
    ```

4. 在 IDE 中重新加载 Gradle 项目。
5. 运行您的测试以验证配置：

    ```bash
    ./gradlew clean test
    ```

## 项目结构

通过此配置，您可以在相同的源目录中混合使用 Java 和 Kotlin 文件：

```none
src/
  ├── main/
  │    ├── java/          # Java 和 Kotlin 生产代码
  │    └── kotlin/        # 额外的 Kotlin 生产代码（可选）
  └── test/
       ├── java/          # Java 和 Kotlin 测试代码
       └── kotlin/        # 额外的 Kotlin 测试代码（可选）
```

您可以手动创建这些目录，也可以在添加第一个 Kotlin 文件时由 IntelliJ IDEA 自动创建。

Kotlin 插件会自动识别 `src/main/java` 和 `src/test/java` 目录，因此您可以将 `.kt` 和 `.java` 文件放在相同的目录中。

## 将 Java 文件转换为 Kotlin

Kotlin 插件还捆绑了一个 Java 到 Kotlin 转换器 (_J2K_)，可自动将 Java 文件转换为 Kotlin。要对文件使用 J2K，请在其上下文菜单或 IntelliJ IDEA 的 **Code** 菜单中点击 **Convert Java File to Kotlin File**。

![将 Java 转换为 Kotlin](convert-java-to-kotlin.png){width=500}

虽然转换器并非万无一失，但在将大多数 Java 模板代码转换为 Kotlin 方面表现得相当不错。不过，有时仍需要进行一些手动调整。

## 下一步

在 Java 项目中开始使用 Kotlin 的最简单方法是先添加 Kotlin 测试：

[向 Java 项目添加您的第一个 Kotlin 测试](jvm-test-using-junit.md)

### 另请参阅

* [Kotlin 和 Java 互操作性详情](java-to-kotlin-interop.md)
* [Maven 构建配置参考](maven.md)