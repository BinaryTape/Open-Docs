[//]: # (title: 在 Kotlin/JS 中執行測試)

Kotlin 多平台 Gradle 外掛程式可讓您透過各種測試執行器執行測試，這些執行器可透過 Gradle 組態指定。

當您建立多平台專案時，可以透過在 `commonTest` 中使用單一依賴項，將測試依賴項新增到所有原始碼集，包括 JavaScript 目標：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// build.gradle.kts

kotlin {
    sourceSets {
         commonTest.dependencies {
            implementation(kotlin("test")) // 這使得測試註解和功能可在 JS 中使用
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
                implementation kotlin("test") // 這使得測試註解和功能可在 JS 中使用
            }
        }
    }
}
```

</tab>
</tabs>

您可以透過調整 Gradle 建置指令碼中 `testTask` 區塊內的設定，來調整 Kotlin/JS 中測試的執行方式。例如，將 Karma 測試執行器與 Chrome 的無頭實例和 Firefox 實例一起使用，看起來會像這樣：

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

如需可用功能的詳細說明，請查閱 Kotlin/JS 參考文件中有關[組態測試任務](js-project-setup.md#test-task)的部分。

請注意，預設情況下，此外掛程式不包含任何瀏覽器。這表示您必須確保它們在目標系統上可用。

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

要在瀏覽器中執行測試，請透過 IntelliJ IDEA 執行 `jsBrowserTest` 任務，或使用邊欄圖示來執行所有或個別測試：

![Gradle browserTest task](browsertest-task.png){width=700}

或者，如果您想透過命令列執行測試，請使用 Gradle 包裝器：

```bash
./gradlew jsBrowserTest
```

從 IntelliJ IDEA 執行測試後，**執行**工具視窗將顯示測試結果。您可以點擊失敗的測試以查看其堆疊追蹤，並透過雙擊導航到相應的測試實作。

![Test results in IntelliJ IDEA](test-stacktrace-ide.png){width=700}

每次測試執行後，無論您如何執行測試，都可以在 `build/reports/tests/jsBrowserTest/index.html` 中找到一份格式正確的 Gradle 測試報告。在瀏覽器中開啟此檔案以查看測試結果的另一份總覽：

![Gradle test summary](test-summary.png){width=700}

如果您使用上述片段中所示的範例測試集，其中一個測試通過，另一個測試失敗，這將導致總計 50% 的測試成功。要獲取有關個別測試案例的更多資訊，您可以透過提供的超連結導航：

![Stacktrace of failed test in the Gradle summary](failed-test.png){width=700}