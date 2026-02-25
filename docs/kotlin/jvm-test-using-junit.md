[//]: # (title: 使用 Kotlin 和 JUnit 测试 Java 代码 – 教程)

Kotlin 与 Java 完全互操作，这意味着您可以使用 Kotlin 为 Java 代码编写测试，并与同一项目中的现有 Java 测试一起运行。

在本教程中，您将学习如何：

*   配置 Java–Kotlin 混合项目，以使用 [JUnit](https://junit.org/) 运行测试。
*   添加用于验证 Java 代码的 Kotlin 测试。
*   使用 Maven 或 Gradle 运行测试。

> 在开始之前，请确保您具备以下条件：
>
> *   已内置 Kotlin 插件的 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/)（社区版或终极版），或安装了 [Kotlin 扩展程序](https://github.com/Kotlin/kotlin-lsp/tree/main?tab=readme-ov-file#vs-code-quick-start) 的 [VS Code](https://code.visualstudio.com/Download)。
> *   Java 17 或更高版本
>
{style="note"}

## 配置项目

1. 在您的 IDE 中，从版本控制系统中复刻示例项目：

   ```text
   https://github.com/kotlin-hands-on/kotlin-junit-sample.git
   ```

2. 导航至 `initial` 模块并查看项目结构：

    ```text
    kotlin-junit-sample/
    ├── initial/
    │   ├── src/
    │   │   ├── main/java/    # Java 源代码
    │   │   └── test/java/    # Java 中的 JUnit 测试
    │   ├── pom.xml           # Maven 配置
    │   └── build.gradle.kts  # Gradle 配置
    ```

   `initial` 模块包含一个简单的 Java 版 Todo 应用程序，并带有一个测试。

3. 在同一目录下，打开您的构建文件并更新其内容以支持 Kotlin：

    <tabs group="build-system">
    <tab title="Maven" group-key="maven">

    ```xml
    ```
   {src="jvm-test-tutorial/pom.xml" initial-collapse-state="collapsed" collapsible="true" ignore-vars="false" collapsed-title="pom.xml 文件"}

    *   在 `<properties>` 部分，设置 Kotlin 版本。
    *   在 `<dependencies>` 部分，添加 JUnit Jupiter 依赖项和 `kotlin-stdlib`（测试作用域）以编译并运行 Kotlin 测试。
    *   在 `<build><plugins>` 部分，应用启用了 `extensions` 的 `kotlin-maven-plugin`，并为 Kotlin 和 Java 配置包含 `sourceDirs` 的 `compile` 和 `test-compile` 执行。
    *   当使用启用了扩展的 Kotlin Maven 插件时，您不需要在 `<build><pluginManagement>` 部分添加 `maven-compiler-plugin`。

    </tab>
    <tab title="Gradle" group-key="gradle">

    ```kotlin
   // build.gradle.kts
    group = "org.jetbrains.kotlin"
    version = "1.0-SNAPSHOT"
    description = "kotlin-junit-complete"
    java.sourceCompatibility = JavaVersion.VERSION_17
    
    plugins {
        application
        kotlin("jvm") version "%kotlinVersion%"
    }

    kotlin {
        jvmToolchain(17)
    }

    application {
        mainClass.set("org.jetbrains.kotlin.junit.App")
    }

    repositories {
        mavenCentral()
    }

    dependencies {
        implementation("com.gitlab.klamonte:jexer:1.6.0")

        testImplementation(kotlin("test"))
        testImplementation(libs.org.junit.jupiter.junit.jupiter.api)
        testImplementation(libs.org.junit.jupiter.junit.jupiter.params)
        testRuntimeOnly(libs.org.junit.jupiter.junit.jupiter.engine)
        testRuntimeOnly(libs.org.junit.platform.junit.platform.launcher)
    }

    tasks.test {
        useJUnitPlatform()
    }
    ```
   {initial-collapse-state="collapsed" collapsible="true" collapsed-title="build.gradle.kts"}

    *   在 `plugins {}` 块中，添加 `kotlin("jvm")` 插件。
    *   设置 JVM 工具链版本以匹配您的 Java 版本。
    *   在 `dependencies {}` 块中，添加 `kotlin.test` 库，它提供了 Kotlin 的测试实用程序并与 JUnit 集成。
      
    Kotlin/JVM 支持最新的稳定 JUnit 版本 JUnit 6。您可以在 `gradle/libs.versions.toml` 版本目录中找到它。
   
    如果您通常更喜欢使用版本目录，甚至可以在其中添加 `kotlin("jvm")` 插件：

    ```toml
    # gradle/libs.versions.toml
    [versions]
    kotlin = "%kotlinVersion%"
    junit = "6.0.2"

    [libraries]
    org-junit-jupiter-junit-jupiter-api = { module = "org.junit.jupiter:junit-jupiter-api", version.ref = "junit" }
    org-junit-jupiter-junit-jupiter-params = { module = "org.junit.jupiter:junit-jupiter-params", version.ref = "junit" }
    org-junit-jupiter-junit-jupiter-engine = { module = "org.junit.jupiter:junit-jupiter-engine", version.ref = "junit" }
    org-junit-platform-junit-platform-launcher = { module = "org.junit.platform:junit-platform-launcher" }
      
    [plugins]
    kotlinJvm = { id = "org.jetbrains.kotlin.jvm", version.ref = "kotlin" }
    ```
    {initial-collapse-state="collapsed" collapsible="true" collapsed-title="libs.versions.toml"}

    </tab>
    </tabs>

4. 在您的 IDE 中重新加载构建文件。

有关构建文件设置的更多详细说明，请参阅[项目配置](mixing-java-kotlin-intellij.md#project-configuration)。

## 添加您的第一个 Kotlin 测试

位于 `initial/src/test/java` 中的 `TodoItemTest.java` 测试已经验证了应用的基础功能：项目创建、默认值、唯一 ID 和状态更改。

您可以通过添加验证仓库级行为的 Kotlin 测试来扩大测试覆盖范围：

1. 导航至相同的测试源目录 `initial/src/test/java`。
2. 在与 Java 测试相同的包中创建一个 `TodoRepositoryTest.kt` 文件。
3. 创建包含字段声明和设置函数的测试类：

   ```kotlin
   package org.jetbrains.kotlin.junit

   import org.junit.jupiter.api.BeforeEach
   import org.junit.jupiter.api.Assertions
   import org.junit.jupiter.api.Test
   import org.junit.jupiter.api.DisplayName

   internal class TodoRepositoryTest {
       lateinit var repository: TodoRepository
       lateinit var testItem1: TodoItem
       lateinit var testItem2: TodoItem

       @BeforeEach
       fun setUp() {
           repository = TodoRepository()
           testItem1 = TodoItem("Task 1", "Description 1")
           testItem2 = TodoItem("Task 2", "Description 2")
       }
   }
   ```

    *   JUnit 5 注解在 Kotlin 中的工作方式与在 Java 中相同。
    *   在 Kotlin 中，[`lateinit` 关键字](properties.md#late-initialized-properties-and-variables)允许声明随后初始化的非 null 属性。这有助于避免在测试中使用可空类型 (`TodoRepository?`)。

4. 在 `TodoRepositoryTest` 类中添加一个测试，以检查初始仓库状态及其大小：

   ```kotlin
   @Test
   @DisplayName("Should start with empty repository")
   fun shouldStartEmpty() {
       Assertions.assertEquals(0, repository.size())
       Assertions.assertTrue(repository.all.isEmpty())
   }
   ```

    *   与 Java 的静态导入不同，Jupiter 的 `Assertions` 是作为一个类导入的，并用作断言函数的限定符。
    *   在 Kotlin 中，您可以使用 `repository.all` 将 Java 的 getter 方法作为属性进行访问，而不是调用 `.getAll()`。

5. 编写另一个测试来验证所有项目的副本行为：

   ```kotlin
   @Test
   @DisplayName("Should return defensive copy of items")
   fun shouldReturnDefensiveCopy() {
       repository.add(testItem1)

       val items1 = repository.all
       val items2 = repository.all

       Assertions.assertNotSame(items1, items2)
       Assertions.assertThrows(
           UnsupportedOperationException::class.java
       ) { items1.clear() }
       Assertions.assertEquals(1, repository.size())
   }
   ```

    *   要从 Kotlin 类获取 Java 类对象，请使用 `::class.java`。
    *   您可以将复杂的断言拆分为多行，而无需使用任何特殊的延续字符。

6. 添加一个测试来验证通过 ID 查找项目：

   ```kotlin
   @Test
   @DisplayName("Should find item by ID")
   fun shouldFindItemById() {
       repository.add(testItem1)
       repository.add(testItem2)

        val found = repository.getById(testItem1.id())

        Assertions.assertTrue(found.isPresent)
        Assertions.assertEquals(testItem1, found.get())
   }
   ```

   Kotlin 可以顺利地与 Java [`Optional` API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Optional.html) 配合使用。它会自动将 getter 方法转换为属性，这就是为什么这里将 `isPresent()` 方法作为属性访问的原因。

7. 编写一个测试来验证项目移除机制：

   ```kotlin
    @Test
    @DisplayName("Should remove item by ID")
    fun shouldRemoveItemById() {
        repository.add(testItem1)
        repository.add(testItem2)

        val removed = repository.remove(testItem1.id())

        Assertions.assertTrue(removed)
        Assertions.assertEquals(1, repository.size())
        Assertions.assertTrue(repository.getById(testItem1.id()).isEmpty)
        Assertions.assertTrue(repository.getById(testItem2.id()).isPresent)
    }
   
    @Test
    @DisplayName("Should return false when removing non-existent item")
    fun shouldReturnFalseForNonExistentRemoval() {
        repository.add(testItem1)

        val removed = repository.remove("non-existent-id")

        Assertions.assertFalse(removed)
        Assertions.assertEquals(1, repository.size())
    }
   ```

   在 Kotlin 中，您可以链式调用方法和属性访问，例如 `repository.getById(id).isEmpty`。

> 您可以向 `TodoRepositoryTest` 测试类中添加更多测试以覆盖更多功能。请参阅示例项目中 [`complete`](https://github.com/kotlin-hands-on/kotlin-junit-sample/blob/main/complete/src/test/java/org/jetbrains/kotlin/junit/TodoRepositoryTest.kt) 模块的完整源代码。
>
{style="tip"}

## 运行测试

运行 Java 和 Kotlin 测试以验证您的项目是否按预期工作：

1. 使用装订区域图标运行测试：

   ![运行测试](run-test.png)

   您还可以使用命令行从 `initial` 目录运行所有项目测试：

    <tabs group="build-system">
    <tab title="Maven" group-key="maven">

    ```bash
    mvn test
    ```

    </tab>
    <tab title="Gradle" group-key="gradle">

    ```bash
    ./gradlew test
    ```

    </tab>
    </tabs>

2. 通过更改其中一个变量值来检查测试是否正常工作。例如，修改 `shouldAddItem` 测试以使其期望一个错误的仓库大小：

   ```kotlin
   @Test
   @DisplayName("Should add item to repository")
   fun shouldAddItem() {
       repository.add(testItem1)

       Assertions.assertEquals(2, repository.size())  // 从 1 更改为 2
       Assertions.assertTrue(repository.all.contains(testItem1))
   }
   ```

3. 再次运行测试并验证其是否失败：

   ![检查测试结果。测试已失败](test-failed.png)

> 您可以在示例项目的 [`complete`](https://github.com/kotlin-hands-on/kotlin-junit-sample/tree/main/complete) 模块中找到带有测试的完整配置项目。
>
{style="tip"}

## 探索其他测试库

除了 JUnit，您还可以使用其他同时支持 Kotlin 和 Java 的库：

| 库 | 描述 |
|-------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------|
| [AssertJ](https://github.com/assertj/assertj)               | 具有可链式调用断言的流式断言库。 |
| [Mockito-Kotlin](https://github.com/mockito/mockito-kotlin) | Mockito 的 Kotlin 包装器，提供辅助函数并能更好地与 Kotlin 类型系统集成。 |
| [MockK](https://github.com/mockk/mockk)                     | 原生 Kotlin 模拟库，支持包括协程和扩展函数在内的 Kotlin 特有功能。 |
| [Kotest](https://github.com/kotest/kotest)                  | Kotlin 断言库，提供多种断言风格和广泛的匹配器支持。 |
| [Strikt](https://github.com/robfletcher/strikt)             | 具有类型安全断言并支持数据类的 Kotlin 断言库。 |

## 下一步

*   使用 [Kotlin 的 Power-assert 编译器插件](power-assert.md)改进您的测试输出。
*   使用 [Kotlin 和 Spring Boot 创建您的第一个服务器端应用程序](jvm-get-started-spring-boot.md)。
*   探索 [`kotlin.test` 库](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/)的功能。