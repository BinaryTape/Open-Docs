---
title: "設定編譯 (Configure compilations)"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Kotlin 多平台專案使用編譯 (compilation) 來產生成品 (artifact)。每個目標 (target) 可以有一個或多個編譯，例如，用於生產 (production) 和測試 (test) 目的。

對於每個目標，預設的編譯包括：

* 用於 JVM、JS 和 Native 目標的 `main` 和 `test` 編譯。
* 每個 [Android 建構變體 (Android build variant)](https://developer.android.com/studio/build/build-variants) 的 [編譯](#compilation-for-android)，用於 Android 目標。

<img src="/img/compilations.svg" alt="Compilations" style={{verticalAlign: 'middle'}}/>

如果您需要編譯除了生產程式碼和單元測試之外的其他內容，例如，整合或效能測試，您可以[建立自定義編譯](#create-a-custom-compilation)。

您可以配置如何產生成品：

* 一次配置專案中的[所有編譯](#configure-all-compilations)。
* 配置[單一目標的編譯](#configure-compilations-for-one-target)，因為一個目標可以有多個編譯。
* 配置[特定的編譯](#configure-one-compilation)。

請參閱[編譯參數列表](multiplatform-dsl-reference#compilation-parameters)和可用於所有或特定目標的 [編譯器選項](gradle-compiler-options)。

## 配置所有編譯

此範例配置一個在所有目標中通用的編譯器選項：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    compilerOptions {
        allWarningsAsErrors.set(true)
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</TabItem>
</Tabs>

## 配置單一目標的編譯

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

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
<TabItem value="groovy" label="Groovy" default>

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

## 配置特定的編譯

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

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
<TabItem value="groovy" label="Groovy" default>

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

## 建立自定義編譯

如果您需要編譯除了生產程式碼和單元測試之外的其他內容，例如，整合或效能測試，請建立自定義編譯。
 
例如，要為 `jvm()` 目標的整合測試建立自定義編譯，請將新項目添加到 `compilations` 集合中。
 
:::note
對於自定義編譯，您需要手動設定所有相依性。自定義編譯的預設源集不依賴於 `commonMain` 和 `commonTest` 源集。

:::

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    jvm() {
        compilations {
            val main by getting
            
            val integrationTest by compilations.creating {
                defaultSourceSet {
                    dependencies {
                        // Compile against the main compilation's compile classpath and outputs:
                        implementation(main.compileDependencyFiles + main.output.classesDirs)
                        implementation(kotlin("test-junit"))
                        /* ... */
                    }
                }
                
                // Create a test task to run the tests produced by this compilation:
                tasks.register<Test>("integrationTest") {
                    // Run the tests with the classpath containing the compile dependencies (including 'main'),
                    // runtime dependencies, and the outputs of this compilation:
                    classpath = compileDependencyFiles + runtimeDependencyFiles + output.allOutputs
                    
                    // Run only the tests from this compilation's outputs:
                    testClassesDirs = output.classesDirs
                }
            }
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    jvm() {
        compilations.create('integrationTest') {
            defaultSourceSet {
                dependencies {
                    def main = compilations.main
                    // Compile against the main compilation's compile classpath and outputs:
                    implementation(main.compileDependencyFiles + main.output.classesDirs)
                    implementation kotlin('test-junit')
                    /* ... */
                }
            }
           
            // Create a test task to run the tests produced by this compilation:
            tasks.register('jvmIntegrationTest', Test) {
                // Run the tests with the classpath containing the compile dependencies (including 'main'),
                // runtime dependencies, and the outputs of this compilation:
                classpath = compileDependencyFiles + runtimeDependencyFiles + output.allOutputs
                
                // Run only the tests from this compilation's outputs:
                testClassesDirs = output.classesDirs
            }
        }
    }
}
```

</TabItem>
</Tabs>

在其他情況下，您也需要建立自定義編譯，例如，如果您想在最終成品中合併不同 JVM 版本的編譯，或者您已經在 Gradle 中設定了源集並想遷移到多平台專案。

## 在 JVM 編譯中使用 Java 來源

使用[專案精靈](https://kmp.jetbrains.com/)建立專案時，預設會建立 Java 來源並將其包含在 JVM 目標的編譯中。

Java 來源檔案放置在 Kotlin 來源根目錄的子目錄中。例如，路徑為：

<img src="/img/java-source-paths.png" alt="Java source files" width="200" style={{verticalAlign: 'middle'}}/>

通用源集不能包含 Java 來源。

由於目前的限制，Kotlin 外掛程式會取代由 Java 外掛程式配置的一些任務：

* 目標的 JAR 任務，而不是 `jar`（例如，`jvmJar`）。
* 目標的測試任務，而不是 `test`（例如，`jvmTest`）。
* 資源由編譯的等效任務處理，而不是 `*ProcessResources` 任務。

此目標的發佈由 Kotlin 外掛程式處理，不需要 Java 外掛程式特定的步驟。

## 配置與原生語言的互通性 (interop)

Kotlin 提供了[與原生語言的互操作性](native-c-interop) 和 DSL，以針對特定編譯配置此功能。

| 原生語言       | 支援的平台                         | 備註                                                                  |
|-----------------------|---------------------------------------------|---------------------------------------------------------------------------|
| C                     | 除了 WebAssembly 之外的所有平台       |                                                                           |
| Objective-C           | Apple 平台 (macOS, iOS, watchOS, tvOS) |                                                                           |
| Swift via Objective-C | Apple 平台 (macOS, iOS, watchOS, tvOS) | Kotlin 只能使用標記有 `@objc` 屬性的 Swift 聲明。 |

一個編譯可以與多個原生程式庫互動。使用 [定義檔 (definition file)](native-definition-file) 或建構檔案的 [`cinterops` 區塊](multiplatform-dsl-reference#cinterops) 中的可用屬性配置互通性：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    linuxX64 { // Replace with a target you need.
        compilations.getByName("main") {
            val myInterop by cinterops.creating {
                // Def-file describing the native API.
                // The default path is src/nativeInterop/cinterop/<interop-name>.def
                definitionFile.set(project.file("def-file.def"))
                
                // Package to place the Kotlin API generated.
                packageName("org.sample")
                
                // Options to be passed to compiler by cinterop tool.
                compilerOpts("-Ipath/to/headers")
              
                // Directories to look for headers.
                includeDirs.apply {
                    // Directories for header search (an equivalent of the -I<path> compiler option).
                    allHeaders("path1", "path2")
                    
                    // Additional directories to search headers listed in the 'headerFilter' def-file option.
                    // -headerFilterAdditionalSearchPrefix command line option equivalent.
                    headerFilterOnly("path1", "path2")
                }
                // A shortcut for includeDirs.allHeaders.
                includeDirs("include/directory", "another/directory")
            }
            
            val anotherInterop by cinterops.creating { /* ... */ }
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    linuxX64 { // Replace with a target you need.
        compilations.main {
            cinterops {
                myInterop {
                    // Def-file describing the native API.
                    // The default path is src/nativeInterop/cinterop/<interop-name>.def
                    definitionFile = project.file("def-file.def")
                    
                    // Package to place the Kotlin API generated.
                    packageName 'org.sample'
                    
                    // Options to be passed to compiler by cinterop tool.
                    compilerOpts '-Ipath/to/headers'
                    
                    // Directories for header search (an eqivalent of the -I<path> compiler option).
                    includeDirs.allHeaders("path1", "path2")
                    
                    // Additional directories to search headers listed in the 'headerFilter' def-file option.
                    // -headerFilterAdditionalSearchPrefix command line option equivalent.
                    includeDirs.headerFilterOnly("path1", "path2")
                    
                    // A shortcut for includeDirs.allHeaders.
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

預設情況下，為 Android 目標建立的編譯與 [Android 建構變體 (Android build variants)](https://developer.android.com/studio/build/build-variants) 相關聯：對於每個建構變體，都會建立一個具有相同名稱的 Kotlin 編譯。

然後，對於為每個變體編譯的每個 [Android 來源集 (Android source set)](https://developer.android.com/studio/build/build-variants#sourcesets)，都會建立一個 Kotlin 來源集，該來源集名稱前綴為目標名稱，例如 Android 來源集 `debug` 的 Kotlin 來源集 `androidDebug` 和名為 `androidTarget` 的 Kotlin 目標。這些 Kotlin 來源集會相應地添加到變體的編譯中。

預設來源集 `commonMain` 會添加到每個生產 (應用程式或程式庫) 變體的編譯中。 `commonTest` 來源集也會以類似方式添加到單元測試和檢測測試變體的編譯中。

也支援使用 [`kapt`](kapt) 進行註釋處理，但由於目前的限制，它要求在配置 `kapt` 相依性之前建立 Android 目標，這需要在頂層 `dependencies {}` 區塊中完成，而不是在 Kotlin 來源集相依性中完成。

```kotlin
kotlin {
    androidTarget { /* ... */ }
}

dependencies {
    kapt("com.my.annotation:processor:1.0.0")
}
```

## 來源集層次結構的編譯

Kotlin 可以使用 `dependsOn` 關係建構 [來源集層次結構](multiplatform-share-on-platforms#share-code-on-similar-platforms)。

<img src="/img/jvm-js-main.svg" alt="Source set hierarchy" style={{verticalAlign: 'middle'}}/>

如果源集 `jvmMain` 依賴於源集 `commonMain`，則：

* 只要為特定目標編譯 `jvmMain`，`commonMain` 也會參與該編譯，並且也會被編譯成相同的目標二進制形式，例如 JVM 類別檔案。
* `jvmMain` 的源程式碼「看到」`commonMain` 的聲明，包括內部聲明，並且也看到 `commonMain` 的 [相依性](multiplatform-add-dependencies)，即使這些相依性指定為 `implementation` 相依性。
* `jvmMain` 可以包含 `commonMain` 的 [預期聲明](multiplatform-expect-actual) 的平台特定實作。
* `commonMain` 的資源始終會被處理並與 `jvmMain` 的資源一起複製。
* `jvmMain` 和 `commonMain` 的 [語言設定](multiplatform-dsl-reference#language-settings) 應保持一致。

以以下方式檢查語言設定的一致性：
* `jvmMain` 應設定大於或等於 `commonMain` 的 `languageVersion`。
* `jvmMain` 應啟用 `commonMain` 啟用的所有不穩定的語言功能（對於錯誤修復功能沒有此要求）。
* `jvmMain` 應使用 `commonMain` 使用的所有實驗性註釋。
* `apiVersion`、錯誤修復語言功能和 `progressiveMode` 可以任意設定。

## 在 Gradle 中配置隔離專案 (Isolated Projects) 功能

:::caution
此功能是 [實驗性 (Experimental)](components-stability#stability-levels-explained)，目前處於 Gradle 的 pre-alpha 狀態。
僅在 Gradle 8.10 或更高版本中使用它，並且僅用於評估目的。該功能可能隨時被刪除或更改。
我們將不勝感激您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform) 上對它的回饋。
需要選擇加入（請參閱下面的詳細資訊）。

:::

Gradle 提供了 [隔離專案 (Isolated Projects)](https://docs.gradle.org/current/userguide/isolated_projects.html) 功能，
通過將各個專案彼此「隔離」來提高建構效能。該功能分離了專案之間的建構腳本和外掛程式，允許它們安全地並行運行。

要啟用此功能，請按照 Gradle 的說明 [設定系統屬性](https://docs.gradle.org/current/userguide/isolated_projects.html#how_do_i_use_it)。

有關隔離專案 (Isolated Projects) 功能的更多資訊，請參閱 [Gradle 的文件](https://docs.gradle.org/current/userguide/isolated_projects.html)。