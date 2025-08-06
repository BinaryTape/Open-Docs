[//]: # (title: 設定編譯)

Kotlin 多平台專案使用編譯來產生構件。每個目標可以有一個或多個編譯，例如，用於生產和測試目的。

對於每個目標，預設編譯包括：

*   `main` 和 `test` 編譯，用於 JVM、JS 和 Native 目標。
*   每個 [Android 建置變體](https://developer.android.com/build/build-variants)一個[編譯](#compilation-for-android)，用於 Android 目標。

![Compilations](compilations.svg)

如果您需要編譯生產程式碼和單元測試以外的內容，例如整合測試或效能測試，您可以[建立自訂編譯](#create-a-custom-compilation)。

您可以設定構件的產生方式，包括：

*   專案中[所有編譯](#configure-all-compilations)的一次性設定。
*   [單一目標的編譯](#configure-compilations-for-one-target)，因為一個目標可以有多個編譯。
*   [特定編譯](#configure-one-compilation)。

請參閱適用於所有或特定目標的[編譯參數列表](multiplatform-dsl-reference.md#compilation-parameters)和[編譯器選項](https://kotlinlang.org/docs/gradle-compiler-options.html)。

## 設定所有編譯

此範例設定了一個在所有目標間通用的編譯器選項：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    compilerOptions {
        allWarningsAsErrors.set(true)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</tab>
</tabs>

## 設定單一目標的編譯

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        compilerOptions {
            jvmTarget.set(JvmTarget.JVM_1_8)
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilerOptions {
            jvmTarget = JvmTarget.JVM_1_8
        }
    }
}
```

</tab>
</tabs>

## 設定特定編譯

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

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

</tab>
<tab title="Groovy" group-key="groovy">

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

</tab>
</tabs>

## 建立自訂編譯

如果您需要編譯生產程式碼和單元測試以外的內容，例如整合測試或效能測試，請建立自訂編譯。

對於自訂編譯，您需要手動設定所有依賴項。自訂編譯的預設原始碼集不依賴於 `commonMain` 和 `commonTest` 原始碼集。
 
例如，若要為 `jvm` 目標的整合測試建立自訂編譯，請在 `integrationTest` 和 `main` 編譯之間建立 [`associateWith`](https://kotlinlang.org/docs/gradle-configure-project.html#associate-compiler-tasks) 關聯：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        compilations {
            val main by getting
            val integrationTest by creating {
                // 將 main 及其類別路徑作為依賴項匯入並建立內部可見性
                associateWith(main)
                defaultSourceSet {
                    dependencies {
                        implementation(kotlin("test-junit"))
                        /* ... */
                    }
                }
                
                // 建立一個測試任務來執行此編譯產生的測試：
                testRuns.create("integration") {
                    // 設定測試任務
                    setExecutionSourceFrom(integrationTest)
                }
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilations.create('integrationTest') {
            def main = compilations.main
            // 將 main 及其類別路徑作為依賴項匯入並建立內部可見性
            associateWith(main)
            defaultSourceSet {
                dependencies {
                    implementation kotlin('test-junit')
                    /* ... */
                }
            }

            // 建立一個測試任務來執行此編譯產生的測試
            testRuns.create('integration') {
                // 設定測試任務
                setExecutionSourceFrom(compilations.integrationTest)
            }
        }
    }
}
```

</tab>
</tabs>

透過關聯編譯，您可以將主編譯輸出作為依賴項加入，並在編譯之間建立 `internal` 可見性。

在其他情況下，自訂編譯也是必要的。例如，如果您想在最終構件中組合不同 JVM 版本的編譯，或者您已經在 Gradle 中設定了原始碼集並希望遷移到多平台專案。

> 若要為 [`androidTarget`](#compilation-for-android) 建立自訂編譯，請透過 [Android Gradle 外掛程式](https://developer.android.com/build/build-variants) 設定建置變體。
> 
{style="tip"}

## JVM 的編譯

當您在多平台專案中宣告 `jvm` 目標時，Kotlin 多平台外掛程式會自動建立 Java 原始碼集，並將它們包含在 JVM 目標的編譯中。

通用原始碼集不能包含 Java 資源，因此您應該將它們放置在多平台專案的相應子目錄中。例如：

![Java source files](java-source-paths.png){width=200}

目前，Kotlin 多平台外掛程式會取代由 Java 外掛程式設定的一些任務：

*   JAR 任務：它不使用標準的 `jar`，而是使用基於構件名稱的目標特定任務，例如，`jvm()` 目標宣告的 `jvmJar` 和 `jvm("desktop")` 的 `desktopJar`。
*   測試任務：它不使用標準的 `test`，而是使用基於構件名稱的目標特定任務，例如 `jvmTest`。
*   資源處理：資源不由 `*ProcessResources` 任務處理，而是由相應的編譯任務處理。

這些任務在宣告目標時自動建立。但是，您可以手動定義 JAR 任務並在必要時進行設定：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// 共享模組的 `build.gradle.kts` 檔案
plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
}

kotlin {
    // 指定 JVM 目標
    jvm {
        // 加入用於 JAR 生成的任務
        tasks.named<Jar>(artifactsTaskName).configure {
            // 設定任務
        }
    }

    sourceSets {
        jvmMain {
            dependencies {
                // 加入 JVM 特定依賴項
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// 共享模組的 `build.gradle` 檔案
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
}

kotlin {
    // 指定 JVM 目標
    jvm {
        // 加入用於 JAR 生成的任務
        tasks.named<Jar>(artifactsTaskName).configure {
            // 設定任務
        }
    }

    sourceSets {
        jvmMain {
            dependencies {
                // 加入 JVM 特定依賴項
            }
        }
    }
}
```

</tab>
</tabs>

此目標由 Kotlin 多平台外掛程式發布，且不需要 Java 外掛程式特有的步驟。

## 設定與原生語言的互通性

Kotlin 提供了[與原生語言的互通性](https://kotlinlang.org/docs/native-overview.html)以及用於設定特定編譯的 DSL。

| 原生語言 | 支援的平台 | 備註 |
|---|---|---|
| C | 所有平台 | |
| Objective-C | Apple 平台 (macOS, iOS, watchOS, tvOS) | |
| Swift 透過 Objective-C | Apple 平台 (macOS, iOS, watchOS, tvOS) | Kotlin 只能使用標記為 `@objc` 屬性的 Swift 宣告。 |

一個編譯可以與多個原生函式庫互動。透過[定義檔](https://kotlinlang.org/docs/native-definition-file.html)中或建置檔的 [`cinterops` 區塊](multiplatform-dsl-reference.md#cinterops)中的可用屬性來設定互通性：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    linuxX64 { // 替換為您需要的目標。
        compilations.getByName("main") {
            val myInterop by cinterops.creating {
                // 描述原生 API 的 Def 檔案。
                // 預設路徑為 src/nativeInterop/cinterop/<interop-name>.def
                definitionFile.set(project.file("def-file.def"))
                
                // 放置生成的 Kotlin API 的套件。
                packageName("org.sample")
                
                // 要由 cinterop 工具傳遞給編譯器的選項。
                compilerOpts("-Ipath/to/headers")
              
                // 尋找標頭的目錄。
                includeDirs.apply {
                    // 標頭搜尋的目錄（等同於 -I<path> 編譯器選項）。
                    allHeaders("path1", "path2")
                    
                    // 搜尋 'headerFilter' def 檔案選項中列出的標頭的附加目錄。
                    // 等同於 -headerFilterAdditionalSearchPrefix 命令列選項。
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

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    linuxX64 { // 替換為您需要的目標。
        compilations.main {
            cinterops {
                myInterop {
                    // 描述原生 API 的 Def 檔案。
                    // 預設路徑為 src/nativeInterop/cinterop/<interop-name>.def
                    definitionFile = project.file("def-file.def")
                    
                    // 放置生成的 Kotlin API 的套件。
                    packageName 'org.sample'
                    
                    // 要由 cinterop 工具傳遞給編譯器的選項。
                    compilerOpts '-Ipath/to/headers'
                    
                    // 標頭搜尋的目錄（等同於 -I<path> 編譯器選項）。
                    includeDirs.allHeaders("path1", "path2")
                    
                    // 搜尋 'headerFilter' def 檔案選項中列出的標頭的附加目錄。
                    // 等同於 -headerFilterAdditionalSearchPrefix 命令列選項。
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

</tab>
</tabs>

## Android 編譯
 
預設為 Android 目標建立的編譯與 [Android 建置變體](https://developer.android.com/build/build-variants)綁定：對於每個建置變體，都會建立一個同名的 Kotlin 編譯。

然後，對於為每個變體編譯的每個 [Android 原始碼集](https://developer.android.com/build/build-variants#sourcesets)，都會建立一個以目標名稱為前綴的 Kotlin 原始碼集，例如 Android 原始碼集 `debug` 和名為 `androidTarget` 的 Kotlin 目標會建立 Kotlin 原始碼集 `androidDebug`。這些 Kotlin 原始碼集會相應地加入到變體的編譯中。

預設原始碼集 `commonMain` 會加入到每個生產（應用程式或函式庫）變體的編譯中。`commonTest` 原始碼集也會類似地加入到單元測試和儀器化測試變體的編譯中。

也支援使用 [`kapt`](https://kotlinlang.org/docs/kapt.html) 進行註解處理，但由於目前的限制，它要求在配置 `kapt` 依賴項之前建立 Android 目標，這需要在頂層的 `dependencies {}` 區塊中完成，而不是在 Kotlin 原始碼集依賴項中完成。

```kotlin
kotlin {
    androidTarget { /* ... */ }
}

dependencies {
    kapt("com.my.annotation:processor:1.0.0")
}
```

## 原始碼集階層的編譯

Kotlin 可以使用 `dependsOn` 關聯建立[原始碼集階層](multiplatform-share-on-platforms.md#share-code-on-similar-platforms)。

![Source set hierarchy](jvm-js-main.svg)

如果原始碼集 `jvmMain` 依賴於原始碼集 `commonMain`，那麼：

*   無論何時 `jvmMain` 為特定目標編譯，`commonMain` 也會參與該編譯，並編譯成相同的目標二進位形式，例如 JVM 類別檔案。
*   `jvmMain` 的原始碼可以「看見」`commonMain` 的宣告，包括內部宣告，並且也能看見 `commonMain` 的[依賴項](multiplatform-add-dependencies.md)，即使是那些被指定為 `implementation` 依賴項的。
*   `jvmMain` 可以包含 `commonMain` [預期宣告](multiplatform-expect-actual.md)的特定平台實作。
*   `commonMain` 的資源總是與 `jvmMain` 的資源一起處理和複製。
*   `jvmMain` 和 `commonMain` 的[語言設定](multiplatform-dsl-reference.md#language-settings)應該保持一致。

語言設定會以以下方式檢查一致性：
*   `jvmMain` 應該設定一個大於或等於 `commonMain` 的 `languageVersion`。
*   `jvmMain` 應該啟用 `commonMain` 啟用的所有不穩定語言功能（對錯誤修正功能沒有此類要求）。
*   `jvmMain` 應該使用 `commonMain` 使用的所有實驗性註解。
*   `apiVersion`、錯誤修正語言功能和 `progressiveMode` 可以任意設定。

## 在 Gradle 中設定獨立專案功能

> 此功能為[實驗性](supported-platforms.md#general-kotlin-stability-levels)，目前在 Gradle 中處於預 Alpha 狀態。
> 僅限於 Gradle 8.10 或更高版本使用，且僅用於評估目的。該功能可能隨時被移除或更改。
> 我們將非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform) 上提供關於此功能的意見回饋。
> 需要選擇啟用（詳情見下文）。
> 
{style="warning"}

Gradle 提供了[獨立專案](https://docs.gradle.org/current/userguide/isolated_projects.html)功能，
透過「隔離」各個專案來提升建置效能。此功能將專案間的建置腳本和外掛程式分離，使其能夠安全地並行執行。

若要啟用此功能，請依照 Gradle 的說明[設定系統屬性](https://docs.gradle.org/current/userguide/isolated_projects.html#how_do_i_use_it)。

有關獨立專案功能的更多資訊，請參閱 [Gradle 的文件](https://docs.gradle.org/current/userguide/isolated_projects.html)。