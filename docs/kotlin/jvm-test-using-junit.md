[//]: # (title: 使用 JUnit 在 JVM 中测试代码 – 教程)

本教程向你展示如何在 Kotlin/JVM 项目中编写一个简单的单元测试，并使用 Gradle 构建工具运行它。

在此项目中，你将使用 [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/index.html) 库并通过 JUnit 运行测试。
如果你正在开发多平台应用，请参阅 [Kotlin Multiplatform 教程](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-run-tests.html)。

首先，下载并安装最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html) 以开始。

## 添加依赖项

1. 在 IntelliJ IDEA 中打开一个 Kotlin 项目。如果你还没有项目，请[创建一个](https://www.jetbrains.com/help/idea/create-your-first-kotlin-app.html#create-project)。

2. 打开 `build.gradle(.kts)` 文件并检查 `testImplementation` 依赖项是否存在。
   此依赖项让你能够使用 `kotlin.test` 和 `JUnit`：

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

3. 将 `test` 任务添加到 `build.gradle(.kts)` 文件中：

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

   > 如果你在构建脚本中使用 `useJUnitPlatform()` 函数，
   > `kotlin-test` 库会自动将 JUnit 5 作为依赖项包含进来。
   > 此设置允许在仅限 JVM 的项目和 Kotlin Multiplatform (KMP) 项目的 JVM 测试中，
   > 访问所有 JUnit 5 API 以及 `kotlin-test` API。
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

## 添加测试代码

1. 打开 `src/main/kotlin` 中的 `Main.kt` 文件。

   `src` 目录包含 Kotlin 源代码文件和资源。
   `Main.kt` 文件包含打印 `Hello, World!` 的示例代码。

2. 创建 `Sample` 类，其中包含将两个整数相加的 `sum()` 函数：

   ```kotlin
   class Sample() {
       fun sum(a: Int, b: Int): Int {
           return a + b
       }
   }
   ```

## 创建测试

1. 在 IntelliJ IDEA 中，针对 `Sample` 类选择 **Code** | **Generate** | **Test...**：

   ![生成测试](generate-test.png)

2. 指定测试类的名称。例如，`SampleTest`：

   ![创建测试](create-test.png)

   IntelliJ IDEA 会在 `test` 目录中创建 `SampleTest.kt` 文件。
   此目录包含 Kotlin 测试源代码文件和资源。

   > 你也可以在 `src/test/kotlin` 中手动为测试创建一个 `*.kt` 文件。
   >
   {style="note"}

3. 在 `SampleTest.kt` 中添加 `sum()` 函数的测试代码：

   * 使用 [`@Test` 注解](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/-test/index.html) 定义测试 `testSum()` 函数。
   * 通过使用 [`assertEquals()`](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/assert-equals.html) 函数，检查 `sum()` 函数是否返回预期值。

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

1. 使用行号旁边的图标运行测试：

   ![运行测试](run-test.png)

   > 你还可以通过命令行界面使用 `./gradlew check` 命令运行所有项目测试。
   >
   {style="note"}

2. 在 **Run** 工具窗口中检查结果：

   ![检查测试结果。测试已成功通过](test-successful.png)

   测试函数已成功执行。

3. 通过将 `expected` 变量值更改为 43，确保测试工作正常：

   ```kotlin
   @Test
   fun testSum() {
       val expected = 43
       assertEquals(expected, classForTesting.sum(40, 2))
   }
   ```

4. 再次运行测试并检查结果：

   ![检查测试结果。测试已失败](test-failed.png)

   测试执行失败。

## 接下来

完成第一次测试后，你可以：

* 编写更多测试，使用其他 [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/) 函数。
   例如，使用 [`assertNotEquals()`](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/assert-not-equals.html) 函数。
* 使用 [Kotlin Power-assert 编译器插件](power-assert.md) 改进你的测试输出。
   该插件通过上下文信息丰富了测试输出。
* [创建你的第一个服务器端应用程序](jvm-get-started-spring-boot.md) 使用 Kotlin 和 Spring Boot。