---
title: "在 Kotlin/JS 中运行测试"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Kotlin Multiplatform Gradle 插件允许你通过各种测试运行器来运行测试，这些测试运行器可以通过 Gradle 配置指定。

当你创建一个多平台项目时，你可以通过在 `commonTest` 中使用单个依赖项，将测试依赖项添加到所有源集（source set），包括 JavaScript
目标：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
// build.gradle.kts

kotlin {
    sourceSets {
         commonTest.dependencies {
            implementation(kotlin("test")) // This makes test annotations and functionality available in JS
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
// build.gradle

kotlin {
    sourceSets {
        commonTest {
            dependencies {
                implementation kotlin("test") // This makes test annotations and functionality available in JS
            }
        }
    }
}
```

</TabItem>
</Tabs>

你可以通过调整 Gradle 构建脚本中 `testTask` 块中可用的设置来调整 Kotlin/JS 中测试的执行方式。例如，将 Karma 测试运行器与 Chrome 的 headless 实例和 Firefox 实例一起使用，如下所示：

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

有关可用功能的详细描述，请查看 Kotlin/JS 参考文档中的[配置测试任务](js-project-setup#test-task)。

请注意，默认情况下，插件不捆绑任何浏览器。这意味着你必须确保它们在目标系统上可用。

为了检查测试是否正确执行，添加一个文件 `src/jsTest/kotlin/AppTest.kt` 并填充以下内容：

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

要在浏览器中运行测试，请通过 IntelliJ IDEA 执行 `jsBrowserTest` 任务，或使用侧边栏图标执行所有或单个测试：

<img src="/img/browsertest-task.png" alt="Gradle browserTest task" width="700" style={{verticalAlign: 'middle'}}/>

或者，如果你想通过命令行运行测试，请使用 Gradle 包装器（wrapper）：

```bash
./gradlew jsBrowserTest
```

从 IntelliJ IDEA 运行测试后，**Run** 工具窗口将显示测试结果。你可以单击失败的测试以查看其堆栈跟踪，并通过双击导航到相应的测试实现。

<img src="/img/test-stacktrace-ide.png" alt="Test results in IntelliJ IDEA" width="700" style={{verticalAlign: 'middle'}}/>

每次测试运行后，无论你如何执行测试，你都可以在 `build/reports/tests/jsBrowserTest/index.html` 中找到来自 Gradle 的格式正确的测试报告。在浏览器中打开此文件以查看测试结果的另一个概览：

<img src="/img/test-summary.png" alt="Gradle test summary" width="700" style={{verticalAlign: 'middle'}}/>

如果你使用的是上面代码片段中显示的示例测试集，则一个测试通过，一个测试失败，从而导致总共 50% 的测试成功率。要获取有关单个测试用例的更多信息，你可以通过提供的超链接进行导航：

<img src="/img/failed-test.png" alt="Stacktrace of failed test in the Gradle summary" width="700" style={{verticalAlign: 'middle'}}/>