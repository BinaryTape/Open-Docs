[//]: # (title: 使用 JUnit 在 JVM 中測試程式碼 – 教學)

本教學將向您展示如何在 Kotlin/JVM 專案中編寫一個簡單的單元測試，並使用 Gradle 建構工具執行它。

在此專案中，您將使用 [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/index.html) 函式庫，並使用 JUnit 執行測試。如果您正在開發多平台應用程式，請參閱 [Kotlin 多平台教學](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-run-tests.html)。

若要開始，請先下載並安裝最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)。

## 新增依賴項

1. 在 IntelliJ IDEA 中開啟 Kotlin 專案。如果您沒有專案，請[建立一個](https://www.jetbrains.com/help/idea/create-your-first-kotlin-app.html#create-project)。

2. 開啟 `build.gradle(.kts)` 檔案並檢查 `testImplementation` 依賴項是否存在。此依賴項允許您使用 `kotlin.test` 和 `JUnit`：

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   dependencies {
       // 其他依賴項。
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

3. 將 `test` 任務新增到 `build.gradle(.kts)` 檔案中：

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

   > 如果您在建構腳本中使用 `useJUnitPlatform()` 函式，
   > `kotlin-test` 函式庫會自動將 JUnit 5 作為依賴項包含進來。
   > 此設定允許在僅限 JVM 的專案和 Kotlin 多平台 (KMP) 專案的 JVM 測試中存取所有 JUnit 5 API，以及 `kotlin-test` API。
   >
   {style="note"}

以下是 `build.gradle.kts` 的完整程式碼：

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

## 新增要測試的程式碼

1. 開啟 `src/main/kotlin` 中的 `Main.kt` 檔案。

   `src` 目錄包含 Kotlin 原始檔和資源。
   `Main.kt` 檔案包含列印 `Hello, World!` 的範例程式碼。

2. 建立包含 `sum()` 函式的 `Sample` 類別，該函式將兩個整數相加：

   ```kotlin
   class Sample() {
       fun sum(a: Int, b: Int): Int {
           return a + b
       }
   }
   ```

## 建立測試

1. 在 IntelliJ IDEA 中，為 `Sample` 類別選擇 **Code** | **Generate** | **Test...**：

   ![Generate a test](generate-test.png)

2. 指定測試類別的名稱。例如，`SampleTest`：

   ![Create a test](create-test.png)

   IntelliJ IDEA 會在 `test` 目錄中建立 `SampleTest.kt` 檔案。
   此目錄包含 Kotlin 測試原始檔和資源。

   > 您也可以在 `src/test/kotlin` 中手動為測試建立 `*.kt` 檔案。
   >
   {style="note"}

3. 在 `SampleTest.kt` 中為 `sum()` 函式新增測試程式碼：

   * 使用 [`@Test` 註解](https://kotlinlang.org/api/latest/kotlin.test/-test/index.html) 定義 `testSum()` 測試函式。
   * 透過使用 [`assertEquals()`](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/assert-equals.html) 函式，檢查 `sum()` 函式是否回傳預期值。

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

## 執行測試

1. 使用邊欄圖示執行測試：

   ![Run the test](run-test.png)

   > 您也可以透過命令列介面使用 `./gradlew check` 命令執行所有專案測試。
   >
   {style="note"}

2. 在 **Run** 工具視窗中檢查結果：

   ![檢查測試結果。測試已成功通過](test-successful.png)

   測試函式已成功執行。

3. 透過將 `expected` 變數的值更改為 43，確保測試正常運作：

   ```kotlin
   @Test
   fun testSum() {
       val expected = 43
       assertEquals(expected, classForTesting.sum(40, 2))
   }
   ```

4. 再次執行測試並檢查結果：

   ![檢查測試結果。測試已失敗](test-failed.png)

   測試執行失敗。

## 接下來

完成第一個測試後，您可以：

* 使用其他 [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/) 函式編寫更多測試。
   例如，使用 [`assertNotEquals()`](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/assert-not-equals.html) 函式。
* 使用 [Kotlin Power-assert 編譯器外掛程式](power-assert.md)改進您的測試輸出。
   該外掛程式以環境資訊豐富了測試輸出。
* 使用 Kotlin 和 Spring Boot [建立您的第一個伺服器端應用程式](jvm-get-started-spring-boot.md)。