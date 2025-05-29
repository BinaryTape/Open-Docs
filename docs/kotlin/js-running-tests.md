[//]: # (title: 在 Kotlin/JS 中运行测试)

Kotlin 多平台 Gradle 插件允许您通过各种测试运行器运行测试，这些测试运行器可以通过 Gradle 配置指定。

当您创建多平台项目时，可以通过在 `commonTest` 中使用单个依赖项，将测试依赖项添加到所有源集，包括 JavaScript 目标：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// build.gradle.kts

kotlin {
    sourceSets {
         commonTest.dependencies {
            implementation(kotlin("test")) // 这使得测试注解和功能在 JS 中可用
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// build.gradle

kotlin {
    sourceSets {
        commonTest {
            dependencies {
                implementation kotlin("test") // 这使得测试注解和功能在 JS 中可用
            }
        }
    }
}
```

</tab>
</tabs>

您可以通过调整 Gradle 构建脚本中 `testTask` 块中的可用设置来调整 Kotlin/JS 中测试的执行方式。例如，将 Karma 测试运行器与无头 Chrome 实例和 Firefox 实例一起使用如下所示：

```kotlin
kotlin {
    js {
        browser {
            testTask {
                useKarma {
                    useChromeHeadless()
                    useFirefox()
                }
            }
        }
    }
}
```

有关可用功能的详细说明，请查阅 Kotlin/JS 参考文档中关于[配置测试任务](js-project-setup.md#test-task)的部分。

请注意，默认情况下，插件不捆绑任何浏览器。这意味着您必须确保它们在目标系统上可用。

为了检查测试是否正确执行，请添加文件 `src/jsTest/kotlin/AppTest.kt` 并填充以下内容：

```kotlin
import kotlin.test.Test
import kotlin.test.assertEquals

class AppTest {
    @Test
    fun thingsShouldWork() {
        assertEquals(listOf(1,2,3).reversed(), listOf(3,2,1))
    }

    @Test
    fun thingsShouldBreak() {
        assertEquals(listOf(1,2,3).reversed(), listOf(1,2,3))
    }
}
```

要在浏览器中运行测试，请通过 IntelliJ IDEA 执行 `jsBrowserTest` 任务，或者使用边槽图标（gutter icons）来执行所有或单个测试：

![Gradle browserTest 任务](browsertest-task.png){width=700}

或者，如果您想通过命令行运行测试，请使用 Gradle wrapper：

```bash
./gradlew jsBrowserTest
```

从 IntelliJ IDEA 运行测试后，**运行 (Run)** 工具窗口将显示测试结果。您可以点击失败的测试以查看其堆栈跟踪，并通过双击导航到相应的测试实现。

![IntelliJ IDEA 中的测试结果](test-stacktrace-ide.png){width=700}

每次测试运行后，无论您如何执行测试，都可以在 `build/reports/tests/jsBrowserTest/index.html` 中找到 Gradle 生成的格式正确的测试报告。在浏览器中打开此文件以查看测试结果的另一个概览：

![Gradle 测试摘要](test-summary.png){width=700}

如果您使用上面代码片段中所示的示例测试集，其中一个测试通过，另一个测试失败，这使得总共有 50% 的测试成功。要获取有关单个测试用例的更多信息，您可以通过提供的超链接进行导航：

![Gradle 摘要中失败测试的堆栈跟踪](failed-test.png){width=700}