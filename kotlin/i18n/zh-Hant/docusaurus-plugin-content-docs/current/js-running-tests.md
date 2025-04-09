---
title: "在 Kotlin/JS 中執行測試"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Kotlin Multiplatform Gradle 外掛程式讓你可以透過各種測試執行器 (test runner) 執行測試，這些執行器可以透過 Gradle 設定檔指定。

當你建立一個多平台專案時，你可以透過在 `commonTest` 中使用單個依賴項，將測試依賴項新增到所有原始碼集 (source set)，包括 JavaScript 目標：

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

你可以透過調整 Gradle 組建腳本中 `testTask` 區塊中的可用設定，來調整 Kotlin/JS 中測試的執行方式。例如，將 Karma 測試執行器與 Chrome 的無頭 (headless) 實例和 Firefox 的實例一起使用，如下所示：

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

有關可用功能的詳細說明，請查看有關 [設定測試任務](js-project-setup#test-task) 的 Kotlin/JS 參考。

請注意，預設情況下，外掛程式不捆綁任何瀏覽器。這表示你必須確保它們在目標系統上可用。

要檢查測試是否正確執行，請新增一個檔案 `src/jsTest/kotlin/AppTest.kt` 並填入以下內容：

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

要在瀏覽器中執行測試，請透過 IntelliJ IDEA 執行 `jsBrowserTest` 任務，或使用編輯器側邊欄圖示 (gutter icons) 執行所有或個別測試：

<img src="/img/browsertest-task.png" alt="Gradle browserTest task" width="700" style={{verticalAlign: 'middle'}}/>

或者，如果你想透過命令列執行測試，請使用 Gradle 包裝器 (wrapper)：

```bash
./gradlew jsBrowserTest
```

從 IntelliJ IDEA 執行測試後，**Run** 工具視窗將顯示測試結果。你可以點擊失敗的測試以查看其堆疊追蹤 (stack trace)，並透過雙擊導航到相應的測試實作。

<img src="/img/test-stacktrace-ide.png" alt="Test results in IntelliJ IDEA" width="700" style={{verticalAlign: 'middle'}}/>

每次測試執行後，無論你如何執行測試，你都可以在 `build/reports/tests/jsBrowserTest/index.html` 中找到來自 Gradle 的格式正確的測試報告。在瀏覽器中開啟此檔案以查看測試結果的另一個概觀：

<img src="/img/test-summary.png" alt="Gradle test summary" width="700" style={{verticalAlign: 'middle'}}/>

如果你使用的是上面程式碼片段中顯示的範例測試集，則一個測試通過，一個測試失敗，從而得出總共 50% 的成功測試。要取得有關個別測試案例的更多資訊，你可以透過提供的超連結導航：

<img src="/img/failed-test.png" alt="Stacktrace of failed test in the Gradle summary" width="700" style={{verticalAlign: 'middle'}}/>