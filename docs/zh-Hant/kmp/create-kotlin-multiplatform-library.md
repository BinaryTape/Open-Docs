[//]: # (title: 建立您的 Kotlin 多平台程式庫 – 教學)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
<p>本教學使用 IntelliJ IDEA，但您也可以在 Android Studio 中遵循此教學 — 這兩個 IDE 共享相同的核心功能和 Kotlin 多平台支援。</p>
</tldr>

在本教學中，您將學習如何在 IntelliJ IDEA 中建立一個多平台程式庫，
將該程式庫發佈到本地 Maven 儲存庫，並將其作為依賴項加入另一個專案。

本教學基於我們的[多平台程式庫範本](https://github.com/Kotlin/multiplatform-library-template)，
該範本是一個包含產生費波那契數列函數的簡單程式庫。

## 設定環境

[安裝所有必要的工具並將其更新到最新版本](quickstart.md)。

## 建立專案

1. 在 IntelliJ IDEA 中，選擇 **File** | **New** | **Project from Version Control**。
2. 輸入[多平台程式庫範本專案](https://github.com/Kotlin/multiplatform-library-template)的 URL：

    ```text
    https://github.com/Kotlin/multiplatform-library-template
    ```
   
3. 點擊 **Clone**。

## 檢查專案結構

Kotlin 多平台程式庫範本專案為開發 Kotlin 多平台程式庫提供了一個基礎結構。此範本有助於建立可在各種平台上運作的程式庫。

在範本專案中，`library` 作為核心模組，包含多平台程式庫的主要原始碼和建置資源。

![Multiplatform library project structure](multiplatform-library-template-project.png){width=350}

`library` 模組的結構旨在容納共享程式碼以及平台特定實作。
以下是其主要原始碼 (`src`) 中內容的詳細說明：

* **`commonMain`：** 包含在所有目標平台之間共享的 Kotlin 程式碼。您可以在此處放置不依賴任何平台特定 API 的程式碼。
* **`androidMain`、`iosMain`、`jvmMain` 和 `linuxX64Main`：** 包含 Android、iOS、JVM 和 Linux 平台的特定程式碼。您可以在此處實作這些平台獨有的功能。
* **`commonTest`、`androidUnitTest`、`iosTest`、`jvmTest` 和 `linuxX64Test`：** 分別包含共享 `commonMain` 程式碼的測試以及 Android、iOS、JVM 和 Linux 平台的特定測試。

讓我們專注於在所有平台之間共享的 `library` 程式碼。在 `src/commonMain/kotlin` 目錄中，
您可以找到 `CustomFibi.kt` 檔案，其中包含定義費波那契數列產生器的 Kotlin 多平台程式碼：

```kotlin
package io.github.kotlin.fibonacci

// Defines the function to generate the Fibonacci sequence
fun generateFibi() = sequence {
    var a = firstElement
    yield(a)
    
    var b = secondElement
    yield(b)
    
    while (true) {
        val c = a + b
        yield(c)
        a = b
        b = c
    }
}

// Declares the expected values for `firstElement` and `secondElement`
expect val firstElement: Int
expect val secondElement: Int
```

`firstElement` 和 `secondElement` 屬性是平台特定程式碼可以實作的預留位置。
每個目標應通過在其各自的原始碼集中使用 `actual` 關鍵字來提供實際值。

`expect` 宣告與 `actual` 實作[匹配](multiplatform-connect-to-apis.md#expected-and-actual-functions-and-properties)。
當編寫需要平台特定行為的跨平台程式碼時，此機制非常有用。

在本案例中，多平台程式庫範本包含了 `firstElement` 和 `secondElement` 屬性的平台特定實作。`androidMain`、`iosMain`、`jvmMain` 和 `linuxX64Main` 目錄包含提供這些屬性值的 `actual` 宣告。

例如，以下是 `androidMain/kotlin/fibiprops.android.kt` 中包含的 Android 實作：

```kotlin
package io.github.kotlin.fibonacci

actual val firstElement: Int = 1
actual val secondElement: Int = 2
```

其他平台遵循相同的模式，`firstElement` 和 `secondElement` 屬性的值有所不同。

## 添加新平台

現在您已熟悉範本中共享程式碼和平台特定程式碼的工作方式，讓我們通過為額外平台添加支援來擴展專案。

使用 [`expect`/`actual` 機制](multiplatform-connect-to-apis.md#expected-and-actual-functions-and-properties)配置對 [Kotlin/Wasm](https://kotlinlang.org/docs/wasm-overview.html) 平台的支援。您可以為 `firstElement` 和 `secondElement` 屬性實作平台特定功能。

### 將 Kotlin/Wasm 目標添加到您的專案

1. 在 `library/build.gradle.kts` 檔案中，添加 Kotlin/Wasm 目標 (`wasmJs`) 和原始碼集：

    ```kotlin
    kotlin {
        // ...
        @OptIn(org.jetbrains.kotlin.gradle.ExperimentalWasmDsl::class)
        wasmJs {
            browser()
            // ...
            binaries.executable()
        }
        // ...
        sourceSets {
            //...
            val wasmJsMain by getting {
                dependencies {
                    // Wasm-specific dependencies
                }
            }
        }
    }
    ```

2. 點擊建置檔案中出現的 **Sync Gradle Changes** 圖示 (![Gradle sync icon](gradle-sync-icon.png){width=30}{type="joined"}) 來同步 Gradle 檔案。或者，點擊 Gradle 工具視窗中的重新整理按鈕。

### 為 Wasm 建立平台特定程式碼

添加 Wasm 目標後，您需要一個 Wasm 目錄來存放 `firstElement` 和 `secondElement` 的平台特定實作：

1. 右鍵點擊 `library/src` 目錄，然後選擇 **New | Directory**。
2. 從 **Gradle Source Sets** 列表中選擇 **wasmJsMain/kotlin**。

   ![Gradle source sets list](gradle-source-sets-list.png){width=450}

3. 右鍵點擊新建立的 `wasmJsMain/kotlin` 目錄，然後選擇 **New | Kotlin Class/File**。
4. 輸入 **fibiprops.wasm** 作為檔案名稱，然後選擇 **File**。
5. 將以下程式碼添加到 `fibiprops.wasm.kt` 檔案：

    ```kotlin
    package io.github.kotlin.fibonacci
    
    actual val firstElement: Int = 3
    actual val secondElement: Int = 5
    ```

    此程式碼設定了 Wasm 特定實作，將 `firstElement` 的 `actual` 值定義為 `3`，將 `secondElement` 定義為 `5`。

### 建置專案

確保您的專案使用新平台正確編譯：

1. 透過選擇 **View** | **Tool Windows** | **Gradle** 打開 Gradle 工具視窗。
2. 在 **multiplatform-library-template** | **library** | **Tasks** | **build** 中，執行 **build** 任務。

   ![Gradle tool window](library-gradle-build-window-tasks.png){width=450}

   或者，在 `multiplatform-library-template` 根目錄下的終端機中執行以下命令：

   ```bash
   ./gradlew build
   ```

您可以在 **Build** 工具視窗中看到成功的輸出。

## 將您的程式庫發佈到本地 Maven 儲存庫

您的多平台程式庫已準備好本地發佈，以便您可以在同一台機器上的其他專案中使用它。

要發佈您的程式庫，請使用 [`maven-publish`](https://docs.gradle.org/current/userguide/publishing_maven.html) Gradle 外掛程式，如下所示：

1. 在 `library/build.gradle.kts` 檔案中，找到 `plugins { }` 區塊並應用 `maven-publish` 外掛程式：

   ```kotlin
      plugins {
          // ...
          // Add the following line:
          id("maven-publish")
      }
   ```

2. 找到 `mavenPublishing { }` 區塊並註解掉 `signAllPublications()`
   方法，以指示該發佈僅限本地：

    ```kotlin
    mavenPublishing{
        // ...
        // Comment out the following method:
        // signAllPublications()
    }
    ```

3. 點擊建置檔案中出現的 **Sync Gradle Changes** 圖示 (![Gradle sync icon](gradle-sync-icon.png){width=30}{type="joined"}) 來同步 Gradle 檔案。或者，點擊 Gradle 工具視窗中的重新整理按鈕。

4. 在 Gradle 工具視窗中，轉到 **multiplatform-library-template** | **Tasks** | **publishing** 並執行 **publishToMavenLocal** Gradle 任務。

   ![Multiplatform library Gradle tool window](publish-maven-local-gradle-task.png){width=450}

   或者，在 `multiplatform-library-template` 根目錄下的終端機中執行以下命令：

   ```bash
   ./gradlew publishToMavenLocal
   ```

您的程式庫已發佈到本地 Maven 儲存庫。

要找到您已發佈的程式庫，請使用您的檔案總管或終端機，並導航到您使用者主目錄中的 `.m2\repository\io\github\kotlin\library\1.0.0\`。

## 將您的程式庫作為依賴項加入另一個專案

將您的多平台程式庫發佈到本地 Maven 儲存庫後，您可以在同一台機器上的其他 Kotlin 專案中使用它。

在您的消費者專案的 `build.gradle.kts` 檔案中，添加對已發佈程式庫的依賴項：

```kotlin
repositories {
    // ...
    mavenLocal()
}

dependencies {
    // ...
    implementation("io.github.kotlin:library:1.0.0")
}
```

`repositories{}` 區塊告知 Gradle 從本地 Maven 儲存庫解析程式庫，並使其在共享程式碼中可用。

`implementation` 依賴項由您的程式庫在其 `build.gradle.kts` 檔案中指定的群組和版本組成。

如果您將其添加到另一個多平台專案，您可以將其添加到共享或平台特定原始碼集：

```kotlin
kotlin {
    //...
    sourceSets {
        // For all platforms
        val commonMain by getting {
            dependencies {
                implementation("io.github.kotlin:library:1.0.0")
            }
        }
        // Or for specific platforms
        val wasmJsMain by getting {
            dependencies {
                implementation("io.github.kotlin:library:1.0.0")
            }
        }
    }
}
```

同步消費者專案並開始使用您的程式庫！

## 接下來

我們鼓勵您進一步探索多平台開發：

* [將您的程式庫發佈到 Maven Central](multiplatform-publish-libraries.md)
* [查看程式庫作者指南](https://kotlinlang.org/docs/api-guidelines-introduction.html)

加入社群：

* ![GitHub](git-hub.svg){width=25}{type="joined"} **Compose Multiplatform GitHub**：關注[儲存庫](https://github.com/JetBrains/compose-multiplatform)並貢獻
* ![Slack](slack.svg){width=25}{type="joined"} **Kotlin Slack**：獲取[邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)並加入 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 頻道
* ![Stack Overflow](stackoverflow.svg){width=25}{type="joined"} **Stack Overflow**：訂閱 ["kotlin-multiplatform" 標籤](https://stackoverflow.com/questions/tagged/kotlin-multiplatform)
* ![YouTube](youtube.svg){width=25}{type="joined"} **Kotlin YouTube 頻道**：訂閱並觀看關於[Kotlin 多平台](https://www.youtube.com/playlist?list=PLlFc5cFwUnmy_oVc9YQzjasSNoAk4hk_C)的影片