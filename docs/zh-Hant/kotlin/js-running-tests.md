[//]: # (title: 在 Kotlin/JS 中執行測試)

Kotlin 多平台 Gradle 外掛程式允許您透過各種測試執行器執行測試，這些執行器可以透過 Gradle 組建組態進行指定。

當您建立多平台專案時，可以使用 `commonTest` 中的單個相依性，將測試相依性新增至所有原始碼集（包括 JavaScript 目標）：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// build.gradle.kts

kotlin {
    sourceSets {
         commonTest.dependencies {
            implementation(kotlin("test")) // 這讓測試註解和功能在 JS 中可用
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
                implementation kotlin("test") // 這讓測試註解和功能在 JS 中可用
            }
        }
    }
}
```

</tab>
</tabs>

您可以透過調整 Gradle 建置指令碼中 `testTask` 區塊內的設定，來微調 Kotlin/JS 中測試的執行方式。例如，將 Karma 測試執行器與 Chrome 的無頭 (headless) 執行個體以及 Firefox 執行個體結合使用的範例如下：

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

有關可用功能的詳細說明，請參閱 [設定測試任務](js-project-setup.md#test-task) 的 Kotlin/JS 參考資料。

請注意，預設情況下，此外掛程式並未隨附任何瀏覽器。這意味著您必須確保目標系統上已安裝這些瀏覽器。

若要檢查測試是否正確執行，請新增檔案 `src/jsTest/kotlin/AppTest.kt` 並填入以下內容：

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

若要在瀏覽器中執行測試，請透過 IntelliJ IDEA 執行 `jsBrowserTest` 任務，或使用裝訂邊圖示來執行全部或單個測試：

![Gradle browserTest 任務](browsertest-task.png){width=700}

或者，如果您想透過命令列執行測試，請使用 Gradle 包裝函式：

```bash
./gradlew jsBrowserTest
```

在 IntelliJ IDEA 中執行測試後，**執行** 工具視窗將顯示測試結果。您可以點擊失敗的測試以查看其堆疊追蹤，並透過按兩下跳轉到對應的測試實作。

![IntelliJ IDEA 中的測試結果](test-stacktrace-ide.png){width=700}

在每次測試執行後，無論您如何執行測試，都可以在 `build/reports/tests/jsBrowserTest/index.html` 中找到由 Gradle 產生的格式正確的測試報告。在瀏覽器中開啟此檔案以查看測試結果的另一個總覽：

![Gradle 測試摘要](test-summary.png){width=700}

如果您使用上述程式碼片段中顯示的範例測試集，則一個測試會通過，另一個測試會失敗，這會導致總共 50% 的測試成功。若要獲取有關個別測試案例的更多資訊，您可以透過提供的超連結進行導覽：

![Gradle 摘要中失敗測試的堆疊追蹤](failed-test.png){width=700}