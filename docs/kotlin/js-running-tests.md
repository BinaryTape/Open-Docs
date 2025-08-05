[//]: # (title: 在 Kotlin/JS 中运行测试)

Kotlin 多平台 Gradle 插件允许你通过多种测试运行器运行测试，这些运行器可以通过 Gradle 配置来指定。

当你创建一个多平台项目时，你可以在 `commonTest` 中使用一个依赖项，从而向所有源代码集（包括 JavaScript 目标平台）添加测试依赖项：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// build.gradle.kts

kotlin {
    sourceSets {
         commonTest.dependencies {
            implementation(kotlin("test")) // 这使得测试注解和功能性在 JS 中可用
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
                implementation kotlin("test") // 这使得测试注解和功能性在 JS 中可用
            }
        }
    }
}
```

</tab>
</tabs>

你可以通过调整 Gradle 构建脚本中 `testTask` 代码块的可用设置，来调整 Kotlin/JS 中测试的执行方式。例如，将 Karma 测试运行器与一个无头 Chrome 实例和一个 Firefox 实例一起使用，示例如下：

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

关于可用功能性的详细说明，请查阅 Kotlin/JS 参考文档中 [配置测试任务](js-project-setup.md#test-task) 部分。

请注意，默认情况下，插件不捆绑任何浏览器。这意味着你需要确保它们在目标系统上可用。

要检测测试是否正确执行，请添加文件 `src/jsTest/kotlin/AppTest.kt` 并填充以下内容：

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

要在浏览器中运行测试，可以通过 IntelliJ IDEA 执行 `jsBrowserTest` 任务，或者使用边槽图标来执行所有测试或单个测试：

![Gradle browserTest task](browsertest-task.png){width=700}

或者，如果你想通过命令行运行测试，请使用 Gradle wrapper：

```bash
./gradlew jsBrowserTest
```

从 IntelliJ IDEA 运行测试后，“运行”工具窗口将显示测试结果。你可以点击失败的测试来查看它们的堆栈跟踪，并通过双击导航到相应的测试实现。

![Test results in IntelliJ IDEA](test-stacktrace-ide.png){width=700}

每次测试运行后，无论你如何执行测试，都可以在 `build/reports/tests/jsBrowserTest/index.html` 中找到一份格式正确的 Gradle 测试报告。在浏览器中打开此文件以查看测试结果的另一个概览：

![Gradle test summary](test-summary.png){width=700}

如果你使用的是上面代码片段中所示的示例测试集，一个测试通过，一个测试失败，这使得成功测试的总百分比为 50%。要获取关于单个测试用例的更多信息，你可以通过提供的超链接进行导航：

![Stacktrace of failed test in the Gradle summary](failed-test.png){width=700}