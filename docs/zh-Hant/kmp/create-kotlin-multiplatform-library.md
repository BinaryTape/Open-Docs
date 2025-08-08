[//]: # (title: 建立您的 Kotlin 多平台函式庫 – 教學)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
<p>本教學使用 IntelliJ IDEA，但您也可以在 Android Studio 中遵循此教學 – 這兩個 IDE 共享相同的核心功能並支援 Kotlin Multiplatform。</p>
</tldr>

在本教學中，您將學習如何在 IntelliJ IDEA 中建立一個多平台函式庫，將該函式庫發佈到本機 Maven 儲存庫，並將其作為依賴項新增到另一個專案中。

本教學基於我們的 [多平台函式庫範本](https://github.com/Kotlin/multiplatform-library-template)，這是一個包含用於產生費波那契序列函式的簡單函式庫。

## 設定環境

[安裝所有必要的工具並更新至最新版本](quickstart.md)。

## 建立專案

1. 在 IntelliJ IDEA 中，選取 **File** | **New** | **Project from Version Control**。
2. 輸入 [多平台函式庫範本專案](https://github.com/Kotlin/multiplatform-library-template) 的 URL：

    ```text
    https://github.com/Kotlin/multiplatform-library-template
    ```
   
3. 點擊 **Clone**。

## 檢查專案結構

Kotlin Multiplatform 函式庫範本專案為開發 Kotlin Multiplatform 函式庫提供了基礎結構。此範本有助於建立可在各種平台上運作的函式庫。

在範本專案中，`library` 作為核心模組，包含 Multiplatform 函式庫的主要原始程式碼和建置資源。

![多平台函式庫專案結構](multiplatform-library-template-project.png){width=350}

`library` 模組的結構旨在容納共享程式碼和平台專屬實作。以下是其主要原始程式碼 (`src`) 內容的細分：

* **`commonMain`：** 包含所有目標平台共享的 Kotlin 程式碼。您可以在此放置不依賴任何平台專屬 API 的程式碼。
* **`androidMain`、`iosMain`、`jvmMain` 和 `linuxX64Main`：** 包含 Android、iOS、JVM 和 Linux 平台的專屬程式碼。您可以在此實作這些平台獨有的功能。
* **`commonTest`、`androidUnitTest`、`iosTest`、`jvmTest` 和 `linuxX64Test`：** 分別包含共享 `commonMain` 程式碼的測試，以及 Android、iOS、JVM 和 Linux 平台的專屬測試。

讓我們關注 `library` 模組中所有平台共享的程式碼。在 `src/commonMain/kotlin` 目錄中，您可以找到 `CustomFibi.kt` 檔案，其中包含定義費波那契序列產生器的 Kotlin Multiplatform 程式碼：

```kotlin
package io.github.kotlin.fibonacci

// 定義產生費波那契序列的函式
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

// 宣告 `firstElement` 和 `secondElement` 的預期值
expect val firstElement: Int
expect val secondElement: Int
```

`firstElement` 和 `secondElement` 屬性是平台專屬程式碼可以實作的預留位置。每個目標都應該使用其各自原始碼集中的 `actual` 關鍵字來提供實際值。

`expect` 宣告會與 `actual` 實作進行[匹配](multiplatform-connect-to-apis.md#expected-and-actual-functions-and-properties)。當編寫需要平台專屬行為的跨平台程式碼時，此機制很有用。

在此情況下，多平台函式庫範本包含 `firstElement` 和 `secondElement` 屬性的平台專屬實作。`androidMain`、`iosMain`、`jvmMain` 和 `linuxX64Main` 目錄包含提供這些屬性值的 `actual` 宣告。

例如，以下是 `androidMain/kotlin/fibiprops.android.kt` 中包含的 Android 實作：

```kotlin
package io.github.kotlin.fibonacci

actual val firstElement: Int = 1
actual val secondElement: Int = 2
```

其他平台遵循相同的模式，`firstElement` 和 `secondElement` 屬性的值有所不同。

## 新增平台

現在您已經熟悉範本中共享程式碼和平台專屬程式碼的運作方式，接下來讓我們透過新增對其他平台的支援來擴展專案。

透過使用 [`expect`/`actual` 機制](multiplatform-connect-to-apis.md#expected-and-actual-functions-and-properties) 來配置對 [Kotlin/Wasm](https://kotlinlang.org/docs/wasm-overview.html) 平台的支援。您可以為 `firstElement` 和 `secondElement` 屬性實作平台專屬功能。

### 將 Kotlin/Wasm 目標新增至您的專案

1. 在 `library/build.gradle.kts` 檔案中，新增 Kotlin/Wasm 目標 (`wasmJs`) 和原始碼集：

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

2. 透過點擊建置檔案中出現的 **Sync Gradle Changes** 圖示 (![Gradle sync icon](gradle-sync-icon.png){width=30}{type="joined"}) 來同步 Gradle 檔案。或者，點擊 Gradle 工具視窗中的重新整理按鈕。

### 建立 Wasm 平台的專屬程式碼

新增 Wasm 目標後，您需要一個 Wasm 目錄來存放 `firstElement` 和 `secondElement` 的平台專屬實作：

1. 右鍵點擊 `library/src` 目錄並選取 **New | Directory**。
2. 從 **Gradle Source Sets** 清單中選取 **wasmJsMain/kotlin**。

   ![Gradle 原始碼集清單](gradle-source-sets-list.png){width=450}

3. 右鍵點擊新建立的 `wasmJsMain/kotlin` 目錄並選取 **New | Kotlin Class/File**。
4. 輸入 **fibiprops.wasm** 作為檔案名稱並選取 **File**。
5. 將以下程式碼新增至 `fibiprops.wasm.kt` 檔案：

    ```kotlin
    package io.github.kotlin.fibonacci
    
    actual val firstElement: Int = 3
    actual val secondElement: Int = 5
    ```

    此程式碼設定 Wasm 專屬實作，將 `firstElement` 的 `actual` 值定義為 `3`，`secondElement` 的 `actual` 值定義為 `5`。

### 建置專案

確保您的專案在新增平台後能正確編譯：

1. 透過選取 **View** | **Tool Windows** | **Gradle** 來開啟 Gradle 工具視窗。
2. 在 **multiplatform-library-template** | **library** | **Tasks** | **build** 中，執行 **build** 任務。

   ![Gradle 工具視窗](library-gradle-build-window-tasks.png){width=450}

   或者，在 `multiplatform-library-template` 根目錄的終端機中執行以下命令：

   ```bash
   ./gradlew build
   ```

您可以在 **Build** 工具視窗中看到成功的輸出。

## 將您的函式庫發佈至本機 Maven 儲存庫

您的多平台函式庫已準備好進行本機發佈，以便您可以在同一台機器上的其他專案中使用它。

若要發佈您的函式庫，請使用 [`maven-publish`](https://docs.gradle.org/current/userguide/publishing_maven.html) Gradle 外掛程式，如下所示：

1. 在 `library/build.gradle.kts` 檔案中，找到 `plugins { }` 區塊並套用 `maven-publish` 外掛程式：

   ```kotlin
      plugins {
          // ...
          // 新增以下行：
          id("maven-publish")
      }
   ```

2. 找到 `mavenPublishing { }` 區塊並註解掉 `signAllPublications()` 方法，以表示發佈僅限於本機：

    ```kotlin
    mavenPublishing{
        // ...
        // 註解掉以下方法：
        // signAllPublications()
    }
    ```

3. 透過點擊建置檔案中出現的 **Sync Gradle Changes** 圖示 (![Gradle sync icon](gradle-sync-icon.png){width=30}{type="joined"}) 來同步 Gradle 檔案。或者，點擊 Gradle 工具視窗中的重新整理按鈕。

4. 在 Gradle 工具視窗中，前往 **multiplatform-library-template** | **Tasks** | **publishing** 並執行 **publishToMavenLocal** Gradle 任務。

   ![多平台函式庫 Gradle 工具視窗](publish-maven-local-gradle-task.png){width=450}

   或者，在 `multiplatform-library-template` 根目錄的終端機中執行以下命令：

   ```bash
   ./gradlew publishToMavenLocal
   ```

您的函式庫已發佈至本機 Maven 儲存庫。

若要找到您已發佈的函式庫，請使用您的檔案總管或終端機，並導覽至您使用者主目錄中的 `.m2\repository\io\github\kotlin\library\1.0.0\`。

## 將您的函式庫作為依賴項新增至另一個專案

將 Multiplatform 函式庫發佈至本機 Maven 儲存庫後，您可以在同一台機器上的其他 Kotlin 專案中使用它。

在您的消費專案的 `build.gradle.kts` 檔案中，新增對已發佈函式庫的依賴項：

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

`repositories{}` 區塊會告知 Gradle 從本機 Maven 儲存庫解析函式庫，並使其在共享程式碼中可用。

`implementation` 依賴項包含在您的 `build.gradle.kts` 檔案中指定的函式庫群組和版本。

如果您要將其新增至另一個多平台專案，您可以將其新增至共享或平台專屬原始碼集：

```kotlin
kotlin {
    //...
    sourceSets {
        // 適用於所有平台
        val commonMain by getting {
            dependencies {
                implementation("io.github.kotlin:library:1.0.0")
            }
        }
        // 或適用於特定平台
        val wasmJsMain by getting {
            dependencies {
                implementation("io.github.kotlin:library:1.0.0")
            }
        }
    }
}
```

同步消費專案並開始使用您的函式庫！

## 下一步

我們鼓勵您進一步探索多平台開發：

* [將您的函式庫發佈至 Maven Central](multiplatform-publish-libraries.md)
* [查看函式庫作者指南](https://kotlinlang.org/docs/api-guidelines-introduction.html)

加入社群：

* ![GitHub](git-hub.svg){width=25}{type="joined"} **Compose Multiplatform GitHub**：為此[儲存庫加星](https://github.com/JetBrains/compose-multiplatform)並貢獻
* ![Slack](slack.svg){width=25}{type="joined"} **Kotlin Slack**：[取得邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)並加入
  [#multiplatform 頻道](https://kotlinlang.slack.com/archives/C3PQML5NU)
* ![Stack Overflow](stackoverflow.svg){width=25}{type="joined"} **Stack Overflow**：訂閱
  「[kotlin-multiplatform](https://stackoverflow.com/questions/tagged/kotlin-multiplatform)」標籤
* ![YouTube](youtube.svg){width=25}{type="joined"} **Kotlin YouTube 頻道**：訂閱並觀看有關
  [Kotlin Multiplatform](https://www.youtube.com/playlist?list=PLlFc5cFwUnmy_oVc9YQzjasSNoAk4hk_C) 的影片