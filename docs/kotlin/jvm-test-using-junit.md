[//]: # (title: 使用 Kotlin 和 JUnit 测试 Java 代码 – 教程)

Kotlin 与 Java 完全互操作，这意味着你可以使用 Kotlin 为 Java 代码编写测试，并在同一项目中与现有的 Java 测试一起运行。

在本教程中，你将学习如何：

*   配置混合 Java–Kotlin 项目以使用 [JUnit 5](https://junit.org/junit5/) 运行测试。
*   添加验证 Java 代码的 Kotlin 测试。
*   使用 Maven 或 Gradle 运行测试。

> 开始之前，请确保你已具备：
>
> *   [IntelliJ IDEA](https://www.jetbrains.com/idea/download/)（Community 或 Ultimate 版），并包含 Kotlin 插件
> *   或已安装 [Kotlin 扩展](https://github.com/Kotlin/kotlin-lsp/tree/main?tab=readme-ov-file#vs-code-quick-start) 的 [VS Code](https://code.visualstudio.com/Download)。
> *   Java 17 或更高版本
>
{style="note"}

## 配置项目

1.  在你的 IDE 中，从版本控制克隆示例项目：

    ```text
    https://github.com/kotlin-hands-on/kotlin-junit-sample.git
    ```

2.  导航到 `initial` 模块并审阅项目结构：

    ```text
    kotlin-junit-sample/
    ├── initial/
    │   ├── src/
    │   │   ├── main/java/    # Java 源代码
    │   │   └── test/java/    # Java 中的 JUnit 测试
    │   ├── pom.xml           # Maven 配置
    │   └── build.gradle.kts  # Gradle 配置
    ```

    `initial` 模块包含一个简单的 Java Todo 应用程序，带有一个测试。

3.  在同一目录下，打开 Maven 的 `pom.xml` 或 Gradle 的 `build.gradle.kts` 构建文件，并更新其内容以支持 Kotlin：

    <tabs group="build-system">
    <tab title="Maven" group-key="maven">

    ```xml
    ```
   {src="jvm-test-tutorial/pom.xml" initial-collapse-state="collapsed" collapsible="true" ignore-vars="false" collapsed-title="pom.xml 文件"}

    *   在 `<properties>` 部分中，设置 Kotlin 版本。
    *   在 `<dependencies>` 部分中，添加 JUnit Jupiter 依赖项和 `kotlin-stdlib`（test 作用域）以编译和运行 Kotlin 测试。
    *   在 `<build><plugins>` 部分中，应用 `kotlin-maven-plugin` 并启用 `extensions`，以及为 Kotlin 和 Java 配置带有 `sourceDirs` 的 `compile` 和 `test-compile` 执行。
    *   使用带扩展的 Kotlin Maven 插件时，无需将 `maven-compiler-plugin` 添加到 `<build><pluginManagement>` 部分。

    </tab>
    <tab title="Gradle" group-key="gradle">

    ```kotlin
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
   {initial-collapse-state="collapsed" collapsible="true" collapsed-title="build.gradle.kts 文件"}

    *   在 `plugins {}` 代码块中，添加 `kotlin("jvm")` 插件。
    *   设置 JVM 工具链版本以匹配你的 Java 版本。
    *   在 `dependencies {}` 代码块中，添加 `kotlin.test` 库，该库提供 Kotlin 的测试实用程序并与 JUnit 集成。

    </tab>
    </tabs>

4.  在你的 IDE 中重新加载构建文件。

关于构建文件设置的更详细说明，请参见[项目配置](mixing-java-kotlin-intellij.md#project-configuration)。

## 添加你的第一个 Kotlin 测试

`initial/src/test/java` 中的 `TodoItemTest.java` 测试已验证应用基础功能：项目创建、默认值、唯一 ID 和状态变更。

你可以通过添加验证仓库级行为的 Kotlin 测试来扩展测试覆盖范围：

1.  导航到相同的测试源代码目录 `initial/src/test/java`。
2.  在与 Java 测试相同的包中创建 `TodoRepositoryTest.kt` 文件。
3.  创建带有字段声明和设置函数的测试类：

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

    *   JUnit 5 注解在 Kotlin 中与在 Java 中作用相同。
    *   在 Kotlin 中，[`lateinit` 关键字](properties.md#late-initialized-properties-and-variables)允许声明稍后初始化的非空属性。
        这有助于避免在测试中使用可空类型 (`TodoRepository?`)。

4.  在 `TodoRepositoryTest` 类中添加测试，以检测初始仓库状态及其大小：

   ```kotlin
   @Test
   @DisplayName("Should start with empty repository")
   fun shouldStartEmpty() {
       Assertions.assertEquals(0, repository.size())
       Assertions.assertTrue(repository.all.isEmpty())
   }
   ```

    *   与 Java 静态导入不同，Jupiter 的 `Assertions` 作为类导入，并用作断言函数的限定符。
    *   你可以通过 `repository.all` 在 Kotlin 中将 Java getter 作为属性访问，而不是调用 `.getAll()`。

5.  编写另一个测试来验证所有项目的复制行为：

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
    *   你可以在多行上拆分复杂断言，而无需使用任何特殊的续行符。

6.  添加一个测试来验证通过 ID 查找项目：

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

    Kotlin 与 Java 的 [`Optional` API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Optional.html) 顺畅地协作。
    它会自动将 getter 方法转换为属性，因此 `isPresent()` 方法在此处作为属性访问。

7.  编写一个测试来验证项目移除机制：

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

    在 Kotlin 中，你可以链式调用方法和属性访问，例如 `repository.getById(id).isEmpty`。

> 你可以向 `TodoRepositoryTest` 测试类添加更多测试，以覆盖其他功能。
> 关于完整源代码，请参见示例项目中的 [`complete`](https://github.com/kotlin-hands-on/kotlin-junit-sample/blob/main/complete/src/test/java/org/jetbrains/kotlin/junit/TodoRepositoryTest.kt) 模块。
>
{style="tip"}

## 运行测试

运行 Java 和 Kotlin 测试以验证你的项目是否按预期工作：

1.  使用边栏图标运行测试：

    ![Run the test](run-test.png)

    你也可以使用命令行从 `initial` 目录运行所有项目测试：

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

2.  通过更改其中一个变量值来检测测试是否正常工作。
    例如，修改 `shouldAddItem` 测试，使其预期错误的仓库大小：

   ```kotlin
   @Test
   @DisplayName("Should add item to repository")
   fun shouldAddItem() {
       repository.add(testItem1)

       Assertions.assertEquals(2, repository.size())  // 从 1 更改为 2
       Assertions.assertTrue(repository.all.contains(testItem1))
   }
   ```

3.  再次运行测试并验证它是否失败：

    ![Check the test result. The test has failed](test-failed.png)

> 你可以在示例项目中的 [`complete`](https://github.com/kotlin-hands-on/kotlin-junit-sample/tree/main/complete) 模块中找到完全配置好并带测试的项目。
>
{style="tip"}

## 探查其他测试库

除了 JUnit 之外，你还可以使用其他支持 Kotlin 和 Java 的库：

| 库                                                          | 描述                                                                                                           |
| :---------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------- |
| [AssertJ](https://github.com/assertj/assertj)               | 具有链式断言的流畅断言库。                                                                                     |
| [Mockito-Kotlin](https://github.com/mockito/mockito-kotlin) | Mockito 的 Kotlin 包装器，提供辅助函数和与 Kotlin 类型系统更好的集成。                                         |
| [MockK](https://github.com/mockk/mockk)                     | 原生 Kotlin 模拟库，支持 Kotlin 特有的特性，包括协程和扩展函数。                                               |
| [Kotest](https://github.com/kotest/kotest)                  | Kotlin 的断言库，提供多种断言风格和广泛的匹配器支持。                                                          |
| [Strikt](https://github.com/robfletcher/strikt)             | Kotlin 的断言库，具有类型安全的断言并支持数据类。                                                              |

## 接下来

*   使用 [Kotlin 的 Power-assert 编译器插件](power-assert.md)改进你的测试输出。
*   使用 Kotlin 和 Spring Boot 创建你的第一个[服务器端应用程序](jvm-get-started-spring-boot.md)。
*   探查 [`kotlin.test` 库](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/)的特性。