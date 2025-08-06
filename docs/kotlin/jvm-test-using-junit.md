[//]: # (title: 在 JVM 中使用 JUnit 测试代码 – 教程)

本教程将向你展示如何在 Kotlin/JVM 项目中编写一个简单的单元测试，并使用 Gradle 构建工具运行它。

在此项目中，你将使用 [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/index.html) 库，并使用 JUnit 运行测试。
如果你正在开发多平台应用，请参阅 [Kotlin 多平台教程](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-run-tests.html)。

首先，下载并安装最新版 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html) 以开始。

## 添加依赖项

1. 在 IntelliJ IDEA 中打开一个 Kotlin 项目。如果你没有项目，[创建一个](https://www.jetbrains.com/help/idea/create-your-first-kotlin-app.html#create-project)。

2. 打开 `build.gradle(.kts)` 文件，并检测 `testImplementation` 依赖项是否存在。此依赖项允许你使用 `kotlin.test` 和 `JUnit`：

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   dependencies {
       // Other dependencies.
       testImplementation(kotlin("test"))
   }
   ```

    </tab>
    <tab title="Groovy" group-key="groovy">

   ```groovy
   dependencies {
       // Other dependencies.
       testImplementation 'org.jetbrains.kotlin:kotlin-test'
   }
   ```

   </tab>
   </tabs>

3. 将 `test` 任务添加到 `build.gradle(.kts)` 文件：

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   tasks.test {
       useJUnitPlatform()
   }
   ```

    </tab>
    <tab title="Groovy" group-key="groovy">

   ```groovy
   test {
       useJUnitPlatform()
   }
   ```

   </tab>
   </tabs>

   > 如果你在构建脚本中使用 `useJUnitPlatform()` 函数，`kotlin-test` 库会自动将 JUnit 5 作为依赖项包含进来。此设置允许在仅 JVM 项目和 Kotlin 多平台 (KMP) 项目的 JVM 测试中访问所有 JUnit 5 API 以及 `kotlin-test` API。
   >
   {style="note"}

以下是 `build.gradle.kts` 的完整代码：

```kotlin
plugins {
    kotlin("jvm") version "%kotlinVersion%"
}

group = "org.example"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    testImplementation(kotlin("test"))
}

tasks.test {
    useJUnitPlatform()
}
```
{initial-collapse-state="collapsed" collapsible="true"}

## 添加代码进行测试

1. 打开 `src/main/kotlin` 中的 `Main.kt` 文件。

   `src` 目录包含 Kotlin 源文件和资源。`Main.kt` 文件包含打印 `Hello, World!` 的示例代码。

2. 创建 `Sample` 类，其中包含用于将两个整型相加的 `sum()` 函数：

   ```kotlin
   class Sample() {
       fun sum(a: Int, b: Int): Int {
           return a + b
       }
   }
   ```

## 创建测试

1. 在 IntelliJ IDEA 中，为 `Sample` 类选择 **Code** | **Generate** | **Test...**：

   ![Generate a test](generate-test.png)

2. 指定测试类的名称。例如，`SampleTest`：

   ![Create a test](create-test.png)

   IntelliJ IDEA 会在 `test` 目录中创建 `SampleTest.kt` 文件。此目录包含 Kotlin 测试源文件和资源。

   > 你也可以在 `src/test/kotlin` 中手动创建用于测试的 `*.kt` 文件。
   >
   {style="note"}

3. 在 `SampleTest.kt` 中为 `sum()` 函数添加测试代码：

   * 使用 [`@Test` 注解](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/-test/index.html) 定义测试 `testSum()` 函数。
   * 使用 [`assertEquals()`](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/assert-equals.html) 函数检测 `sum()` 函数是否返回预期值。

   ```kotlin
   import org.example.Sample
   import org.junit.jupiter.api.Assertions.*
   import kotlin.test.Test

   class SampleTest {
       private val testSample: Sample = Sample()

       @Test
       fun testSum() {
           val expected = 42
           assertEquals(expected, testSample.sum(40, 2))
       }
   }
   ```

## 运行测试

1. 使用边栏图标运行测试：

   ![Run the test](run-test.png)

   > 你也可以通过命令行界面使用 `./gradlew check` 命令运行所有项目测试。
   >
   {style="note"}

2. 在 **Run** 工具窗口中检测结果：

   ![Check the test result. The test passed successfully](test-successful.png)

   测试函数已成功执行。

3. 将 `expected` 变量值更改为 43，以确保测试正常工作：

   ```kotlin
   @Test
   fun testSum() {
       val expected = 43
       assertEquals(expected, classForTesting.sum(40, 2))
   }
   ```

4. 再次运行测试并检测结果：

   ![Check the test result. The test has failed](test-failed.png)

   测试执行失败。

## 接下来

完成首次测试后，你可以：

* 使用其他 [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/) 函数编写更多测试。例如，使用 [`assertNotEquals()`](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/assert-not-equals.html) 函数。
* 使用 [Kotlin Power-assert 编译器插件](power-assert.md) 改进测试输出。该插件通过上下文信息丰富了测试输出。
* 使用 Kotlin 和 Spring Boot [创建你的第一个服务器端应用程序](jvm-get-started-spring-boot.md)。