[//]: # (title: 設定編譯)

Kotlin 多平台專案使用編譯來產生產物。每個目標（target）可以有一個或多個編譯，例如用於生產環境與測試目的。

對於每個目標，預設的編譯包括：

* JVM、JS 和 Native 目標的 `main` 與 `test` 編譯。
* Android 目標中每個 [Android 建置變體](https://developer.android.com/build/build-variants) 對應的一個 [編譯](#compilation-for-android)。

![編譯](compilations.svg)

如果您需要編譯生產環境程式碼和單元測試以外的內容，例如整合測試或效能測試，您可以[建立自訂編譯](#create-a-custom-compilation)。

您可以設定產物的產生方式，對象可以是：

* 專案中的[所有編譯](#configure-all-compilations)（一次性設定）。
* [單一目標的所有編譯](#configure-compilations-for-one-target)（因為一個目標可以有多個編譯）。
* [特定的編譯](#configure-one-compilation)。

請參閱可用於所有或特定目標的[編譯參數列表](multiplatform-dsl-reference.md#compilation-parameters)與[編譯器選項](https://kotlinlang.org/docs/gradle-compiler-options.html)。

## 設定所有編譯

此範例設定了一個適用於所有目標的通用編譯器選項：

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    compilerOptions {
        allWarningsAsErrors.set(true)
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</TabItem>
</Tabs>

## 設定單一目標的編譯

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        compilerOptions {
            jvmTarget.set(JvmTarget.JVM_1_8)
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilerOptions {
            jvmTarget = JvmTarget.JVM_1_8
        }
    }
}
```

</TabItem>
</Tabs>

## 設定特定編譯

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        val main by compilations.getting {
            compileTaskProvider.configure {
                compilerOptions {
                    jvmTarget.set(JvmTarget.JVM_1_8)
                }
            }
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilations.main {
            compileTaskProvider.configure {
                compilerOptions {
                    jvmTarget = JvmTarget.JVM_1_8
                }
            }
        }
    }
}
```

</TabItem>
</Tabs>

## 建立自訂編譯

如果您需要編譯生產環境程式碼和單元測試以外的內容，例如整合測試或效能測試，請建立自訂編譯。

對於自訂編譯，您需要手動設定所有相依性。自訂編譯的預設原始碼集並不相依於 `commonMain` 和 `commonTest` 原始碼集。
 
例如，要為 `jvm` 目標建立一個整合測試的自訂編譯，請在 `integrationTest` 和 `main` 編譯之間建立 [`associateWith`](https://kotlinlang.org/docs/gradle-configure-project.html#associate-compiler-tasks) 關係：

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        compilations {
            val main by getting
            val integrationTest by creating {
                // 將 main 及其類別路徑匯入為相依性，並建立 internal 可見性
                associateWith(main)
                defaultSourceSet {
                    dependencies {
                        implementation(kotlin("test-junit"))
                        /* ... */
                    }
                }
            }

            // 建立一個測試任務來執行此編譯產生的測試：
            testRuns.create("integration") {
                // 配置測試任務
                setExecutionSourceFrom(integrationTest)
            }
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilations.create('integrationTest') {
            def main = compilations.main
            // 將 main 及其類別路徑匯入為相依性，並建立 internal 可見性
            associateWith(main)
            defaultSourceSet {
                dependencies {
                    implementation kotlin('test-junit')
                    /* ... */
                }
            }
        }

        // 建立一個測試任務來執行此編譯產生的測試
        testRuns.create('integration') {
            // 配置測試任務
            setExecutionSourceFrom(compilations.integrationTest)
        }
    }
}
```

</TabItem>
</Tabs>

透過關聯編譯，您可以將 `main` 編譯的輸出新增為相依性，並在編譯之間建立 `internal` 可見性。

在其他情況下也需要自訂編譯。例如，如果您想在最終產物中結合不同 JVM 版本的編譯，或者您已經在 Gradle 中設定了原始碼集並希望遷移到多平台專案。

> 若要為 [`android`](#compilation-for-android) 建立自訂編譯，請透過 [Android Gradle 外掛程式](https://developer.android.com/build/build-variants)設定建置變體。
> 
{style="tip"}

## JVM 的編譯

當您在多平台專案中宣告 `jvm` 目標時，Kotlin Multiplatform Gradle 外掛程式會自動建立 Java 原始碼集並將其包含在 JVM 目標的編譯中。

通用原始碼集不能包含 Java 資源，因此您應該將它們放在多平台專案對應的子目錄中。例如：

![Java 原始碼檔案](java-source-paths.png){width=200}

目前，Kotlin Multiplatform Gradle 外掛程式取代了 Java 外掛程式設定的一些任務：

* JAR 任務：它不使用標準的 `jar`，而是根據產物的名稱使用特定於目標的任務，例如 `jvmJar` 用於 `jvm()` 目標宣告，`desktopJar` 用於 `jvm("desktop")`。
* 測試任務：它不使用標準的 `test`，而是根據產物的名稱使用特定於目標的任務，例如 `jvmTest`。
* 資源處理：資源不由 `*ProcessResources` 任務處理，而是由相應的編譯任務處理。

這些任務在宣告目標時會自動建立。不過，如有必要，您可以手動定義 JAR 任務並對其進行配置：

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
// 共享模組的 `build.gradle.kts` 檔案
plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
}

kotlin {
    // 指定 JVM 目標
    jvm {
        // 新增用於產生 JAR 的任務
        tasks.named<Jar>(artifactsTaskName).configure {
            // 配置任務
        }
    }

    sourceSets {
        jvmMain {
            dependencies {
                // 新增 JVM 特有的相依性
            }
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
// 共享模組的 `build.gradle` 檔案
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
}

kotlin {
    // 指定 JVM 目標
    jvm {
        // 新增用於產生 JAR 的任務
        tasks.named<Jar>(artifactsTaskName).configure {
            // 配置任務
        }
    }

    sourceSets {
        jvmMain {
            dependencies {
                // 新增 JVM 特有的相依性
            }
        }
    }
}
```

</TabItem>
</Tabs>

此目標由 Kotlin Multiplatform Gradle 外掛程式發佈，不需要特定於 Java 外掛程式的步驟。

## 設定與原生語言的互通性

Kotlin 提供[與原生語言的互通性](https://kotlinlang.org/docs/native-overview.html)，並提供 DSL 來為特定編譯設定此功能。

| 原生語言 | 支援的平台 | 說明 |
|-----------------------|---------------------------------------------|---------------------------------------------------------------------------|
| C | 所有平台 | |
| Objective-C | Apple 平台 (macOS, iOS, watchOS, tvOS) | |
| Swift 透過 Objective-C | Apple 平台 (macOS, iOS, watchOS, tvOS) | Kotlin 僅能使用標記有 `@objc` 屬性的 Swift 宣告。 |

一個編譯可以與多個原生程式庫進行交互。請在 [定義檔](https://kotlinlang.org/docs/native-definition-file.html) 或建置檔的 [`cinterops` 區塊](multiplatform-dsl-reference.md#cinterops) 中使用可用屬性來設定互通性：

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    linuxX64 { // 替換為您需要的目標。
        compilations.getByName("main") {
            val myInterop by cinterops.creating {
                // 描述原生 API 的 def 檔案。
                // 預設路徑為 src/nativeInterop/cinterop/<interop-name>.def
                definitionFile.set(project.file("def-file.def"))
                
                // 放置產生的 Kotlin API 的套件。
                packageName("org.sample")
                
                // cinterop 工具傳遞給編譯器的選項。
                compilerOpts("-Ipath/to/headers")
              
                // 尋找標頭檔的目錄。
                includeDirs.apply {
                    // 標頭檔搜尋目錄（相當於 -I<path> 編譯器選項）。
                    allHeaders("path1", "path2")
                    
                    // 搜尋 'headerFilter' def 檔案選項中列出的標頭檔的其他目錄。
                    // 相當於 -headerFilterAdditionalSearchPrefix 命令列選項。
                    headerFilterOnly("path1", "path2")
                }
                // includeDirs.allHeaders 的捷徑。
                includeDirs("include/directory", "another/directory")
            }
            
            val anotherInterop by cinterops.creating { /* ... */ }
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    linuxX64 { // 替換為您需要的目標。
        compilations.main {
            cinterops {
                myInterop {
                    // 描述原生 API 的 def 檔案。
                    // 預設路徑為 src/nativeInterop/cinterop/<interop-name>.def
                    definitionFile = project.file("def-file.def")
                    
                    // 放置產生的 Kotlin API 的套件。
                    packageName 'org.sample'
                    
                    // cinterop 工具傳遞給編譯器的選項。
                    compilerOpts '-Ipath/to/headers'
                    
                    // 標頭檔搜尋目錄（相當於 -I<path> 編譯器選項）。
                    includeDirs.allHeaders("path1", "path2")
                    
                    // 搜尋 'headerFilter' def 檔案選項中列出的標頭檔的其他目錄。
                    // 相當於 -headerFilterAdditionalSearchPrefix 命令列選項。
                    includeDirs.headerFilterOnly("path1", "path2")
                    
                    // includeDirs.allHeaders 的捷徑。
                    includeDirs("include/directory", "another/directory")
                }
                
                anotherInterop { /* ... */ }
            }
        }
    }
}
```

</TabItem>
</Tabs>

## Android 的編譯
 
預設情況下，為 Android 目標建立的編譯與 [Android 建置變體](https://developer.android.com/build/build-variants) 綁定：對於每個建置變體，都會建立一個同名的 Kotlin 編譯。

然後，對於為每個變體編譯的每個 [Android 原始碼集](https://developer.android.com/build/build-variants#sourcesets)，都會建立一個 Kotlin 原始碼集，其名稱為目標名稱加上該原始碼集名稱，例如 Android 原始碼集 `debug` 對應的 Kotlin 原始碼集為 `androidDebug`（假設 Kotlin 目標名為 `android`）。這些 Kotlin 原始碼集會相應地新增到變體的編譯中。

預設原始碼集 `commonMain` 會新增到每個生產環境（應用程式或程式庫）變體的編譯中。`commonTest` 原始碼集則類似地新增到單元測試（unit test）和儀器化測試（instrumented test）變體的編譯中。

專案也支援使用 [`kapt`](https://kotlinlang.org/docs/kapt.html) 進行註解處理，但由於目前的限制，它要求在設定 `kapt` 相依性之前先建立 Android 目標，且必須在頂層的 `dependencies {}` 區塊中進行，而不是在 Kotlin 原始碼集相依性中。

```kotlin
kotlin {
    android { /* ... */ }
}

dependencies {
    kapt("com.my.annotation:processor:1.0.0")
}
```

## 原始碼集階層結構的編譯 

Kotlin 可以透過 `dependsOn` 關係建構 [原始碼集階層結構](multiplatform-share-on-platforms.md#share-code-on-similar-platforms)。

![原始碼集階層結構](jvm-js-main.svg)

如果原始碼集 `jvmMain` 相依於原始碼集 `commonMain`，則：

* 每當 `jvmMain` 為特定目標編譯時，`commonMain` 也會參與該編譯，並被編譯成相同的目標二進位形式，例如 JVM 類別檔案。
* `jvmMain` 的源碼可以「看見」`commonMain` 的宣告（包括 internal 宣告），並且也能看見 `commonMain` 的[相依性](multiplatform-add-dependencies.md)，甚至是那些指定為 `implementation` 的相依性。
* `jvmMain` 可以包含針對 `commonMain` [預期宣告](multiplatform-expect-actual.md)的平台特定實作。
* `commonMain` 的資源總是會與 `jvmMain` 的資源一起處理和複製。
* `jvmMain` 和 `commonMain` 的[語言設定](multiplatform-dsl-reference.md#language-settings)應該保持一致。

語言設定會透過以下方式檢查一致性：
* `jvmMain` 設定的 `languageVersion` 應大於或等於 `commonMain` 的版本。
* `jvmMain` 應啟用 `commonMain` 啟用的所有不穩定語言特性（對於錯誤修正特性則無此要求）。
* `jvmMain` 應使用 `commonMain` 使用的所有實驗性註解。
* `apiVersion`、錯誤修正語言特性和 `progressiveMode` 可以任意設定。

## 在 Gradle 中配置 Isolated Projects 特性

> 此特性處於 [實驗性](supported-platforms.md#general-kotlin-stability-levels) 階段，目前在 Gradle 中處於 pre-alpha 狀態。請僅在 Gradle 8.10 或更高版本中使用，且僅用於評估目的。該特性隨時可能被刪除或更改。我們歡迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform) 上提供意見回饋。需要手動啟用（詳情見下文）。
> 
{style="warning"}

Gradle 提供 [Isolated Projects](https://docs.gradle.org/current/userguide/isolated_projects.html) 特性，透過將各個專案相互「隔離」來提高建置效能。該特性將各專案之間的建置指令碼和外掛程式分開，使其能夠安全地並行執行。

要啟用此特性，請按照 Gradle 的指示[設定系統屬性](https://docs.gradle.org/current/userguide/isolated_projects.html#how_do_i_use_it)。

有關 Isolated Projects 特性的更多資訊，請參閱 [Gradle 文件](https://docs.gradle.org/current/userguide/isolated_projects.html)。