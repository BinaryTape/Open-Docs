---
title: "在 JVM 中使用 JUnit 测试代码 – 教程"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

本教程将向你展示如何在 Kotlin/JVM 项目中编写一个简单的单元测试，并使用 Gradle 构建工具运行它。

在本教程中，你将使用 [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/index.html) 库，并使用 JUnit 运行测试。
如果你正在开发一个多平台应用，请参阅 [Kotlin Multiplatform 教程](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-run-tests.html)。

首先，下载并安装最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html) 以开始。

## 添加依赖

1. 在 IntelliJ IDEA 中打开一个 Kotlin 项目。如果你没有项目，请[创建一个](https://www.jetbrains.com/help/idea/create-your-first-kotlin-app.html#create-project)。

2. 打开 `build.gradle(.kts)` 文件，并检查是否存在 `testImplementation` 依赖项。
   此依赖项允许你使用 `kotlin.test` 和 JUnit：

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>

   ```kotlin
   dependencies {
       // Other dependencies.
       testImplementation(kotlin("test"))
   }
   ```

    </TabItem>
    <TabItem value="groovy" label="Groovy" default>

   ```groovy
   dependencies {
       // Other dependencies.
       testImplementation 'org.jetbrains.kotlin:kotlin-test'
   }
   ```

   </TabItem>
   </Tabs>

3. 将 `test` 任务添加到 `build.gradle(.kts)` 文件中：

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>

   ```kotlin
   tasks.test {
       useJUnitPlatform()
   }
   ```

    </TabItem>
    <TabItem value="groovy" label="Groovy" default>

   ```groovy
   test {
       useJUnitPlatform()
   }
   ```

   </TabItem>
   </Tabs>

   > 如果你在构建脚本中使用 `useJUnitPlatform()` 函数，则 `kotlin-test` 库会自动包含 JUnit 5 作为依赖项。
   > 这种设置可以在 JVM-only 项目和 Kotlin Multiplatform (KMP) 项目的 JVM 测试中访问所有 JUnit 5 API 以及 `kotlin-test` API。
   >
   

这是 `build.gradle.kts` 的完整代码：

```kotlin
plugins {
    kotlin("jvm") version "2.1.20"
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

## 添加代码进行测试

1. 在 `src/main/kotlin` 中打开 `Main.kt` 文件。

   `src` 目录包含 Kotlin 源代码文件和资源文件。
   `Main.kt` 文件包含打印 `Hello, World!` 的示例代码。

2. 创建包含 `sum()` 函数的 `Sample` 类，该函数将两个整数相加：

   ```kotlin
   class Sample() {

       fun sum(a: Int, b: Int): Int {
           return a + b
       }
   }
   ```

## 创建一个测试

1. 在 IntelliJ IDEA 中，为 `Sample` 类选择 **Code** | **Generate** | **Test...**：

   <img src="/img/generate-test.png" alt="Create a test" style={{verticalAlign: 'middle'}}/>

2. 指定测试类的名称。例如，`SampleTest`：

   <img src="/img/create-test.png" alt="Create a test" style={{verticalAlign: 'middle'}}/>

   IntelliJ IDEA 将在 `test` 目录中创建 `SampleTest.kt` 文件。
   此目录包含 Kotlin 测试源代码文件和资源文件。

   > 你也可以在 `src/test/kotlin` 中手动创建一个用于测试的 `*.kt` 文件。
   >
   

3. 在 `SampleTest.kt` 中为 `sum()` 函数添加测试代码：

   * 使用 [`@Test` 注解](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/-test/index.html) 定义测试函数 `testSum()`。
   * 通过使用 [`assertEquals()`](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/assert-equals.html) 函数检查 `sum()` 函数是否返回预期值。

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

1. 使用代码槽图标运行测试：

   <img src="/img/run-test.png" alt="Run the test" style={{verticalAlign: 'middle'}}/>

   > 你也可以使用 `./gradlew check` 命令通过命令行界面运行所有项目测试。
   >
   

2. 在 **Run** 工具窗口中检查结果：

   <img src="/img/test-successful.png" alt="Check the test result. The test passed successfully" style={{verticalAlign: 'middle'}}/>

   测试函数已成功执行。

3. 通过将 `expected` 变量值更改为 43，确保测试正常工作：

   ```kotlin
   @Test
   fun testSum() {
       val expected = 43
       assertEquals(expected, classForTesting.sum(40, 2))
   }
   ```

4. 再次运行测试并检查结果：

   <img src="/img/test-failed.png" alt="Check the test result. The test has failed" style={{verticalAlign: 'middle'}}/>

   测试执行失败。

## 接下来做什么

完成第一个测试后，你可以：

* 使用其他 [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/) 函数编写更多测试。
   例如，使用 [`assertNotEquals()`](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/assert-not-equals.html) 函数。
* 使用 [Kotlin Power-assert 编译器插件](power-assert) 改进你的测试输出。
   该插件使用上下文信息丰富测试输出。
* 使用 Kotlin 和 Spring Boot [创建你的第一个服务器端应用程序](jvm-get-started-spring-boot)。
  ```