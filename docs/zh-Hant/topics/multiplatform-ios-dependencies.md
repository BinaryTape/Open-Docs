[//]: # (title: 新增 iOS 依賴項)

Apple SDK 依賴項（例如 Foundation 或 Core Bluetooth）在 Kotlin Multiplatform 專案中作為一組預建函式庫提供。它們不需要任何額外配置。

您也可以在您的 iOS 原始碼集中重複使用 iOS 生態系統中的其他函式庫和框架。如果其 API 透過 `@objc` 屬性匯出至 Objective-C，Kotlin 支援與 Objective-C 依賴項和 Swift 依賴項的互通性。純 Swift 依賴項尚未支援。

若要在 Kotlin Multiplatform 專案中處理 iOS 依賴項，您可以使用 [cinterop 工具](#with-cinterop)管理它們，或使用 [CocoaPods 依賴項管理器](#with-cocoapods)（不支援純 Swift pods）。

### 使用 cinterop

您可以使用 cinterop 工具為 Objective-C 或 Swift 宣告建立 Kotlin 繫結。這將允許您從 Kotlin 程式碼中呼叫它們。

[函式庫](#add-a-library)和[框架](#add-a-framework)的步驟略有不同，但一般工作流程如下：

1.  下載您的依賴項。
2.  建置它以取得其二進位檔。
3.  建立一個特殊的 `.def` [定義檔案](https://kotlinlang.org/docs/native-definition-file.html)，用於向 cinterop 描述此依賴項。
4.  調整您的建置指令碼，以便在建置期間產生繫結。

#### 新增函式庫

1.  下載函式庫原始碼，並將其放置在您可以從專案中引用它的位置。
2.  建置函式庫（函式庫作者通常會提供如何操作的指南），並取得二進位檔的路徑。
3.  在您的專案中，建立一個 `.def` 檔案，例如 `DateTools.def`。
4.  將第一個字串新增到此檔案中：`language = Objective-C`。如果您想使用純 C 依賴項，請省略語言屬性。
5.  提供兩個強制屬性的值：

    *   `headers` 描述了 cinterop 將處理哪些標頭檔。
    *   `package` 設定這些宣告應放入的套件名稱。

    例如：

    ```none
    headers = DateTools.h
    package = DateTools
    ```

6.  將有關此函式庫互通性的資訊新增到建置指令碼中：

    *   傳遞 `.def` 檔案的路徑。如果您的 `.def` 檔案與 cinterop 同名並放置在 `src/nativeInterop/cinterop/` 目錄中，則可以省略此路徑。
    *   使用 `includeDirs` 選項告知 cinterop 在何處尋找標頭檔。
    *   設定連結至函式庫二進位檔。

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        iosArm64() {
            compilations.getByName("main") {
                val DateTools by cinterops.creating {
                    // .def 檔案的路徑
                    definitionFile.set(project.file("src/nativeInterop/cinterop/DateTools.def"))

                    // 標頭檔搜尋目錄（類似於 -I<path> 編譯器選項）
                    includeDirs("include/this/directory", "path/to/another/directory")
                }
                val anotherInterop by cinterops.creating { /* ... */ }
            }

            binaries.all {
                // 連結至函式庫所需的連結器選項。
                linkerOpts("-L/path/to/library/binaries", "-lbinaryname")
            }
        }
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    kotlin {
        iosArm64 {
            compilations.main {
                cinterops {
                    DateTools {
                        // .def 檔案的路徑
                        definitionFile = project.file("src/nativeInterop/cinterop/DateTools.def")

                        // 標頭檔搜尋目錄（類似於 -I<path> 編譯器選項）
                        includeDirs("include/this/directory", "path/to/another/directory")
                    }
                    anotherInterop { /* ... */ }
                }
            }

            binaries.all {
                // 連結至函式庫所需的連結器選項。
                linkerOpts "-L/path/to/library/binaries", "-lbinaryname"
            }
        }
    }
    ```

    </tab>
    </tabs>

7.  建置專案。

現在您可以在您的 Kotlin 程式碼中使用此依賴項。為此，請匯入您在 `.def` 檔案的 `package` 屬性中設定的套件。對於以上範例，將是：

```kotlin
import DateTools.*
```

> 請參閱[使用 cinterop 工具和 libcurl 函式庫](https://github.com/Kotlin/kotlin-hands-on-intro-kotlin-native)的範例專案。
>
{style="tip"}

#### 新增框架

1.  下載框架原始碼，並將其放置在您可以從專案中引用它的位置。
2.  建置框架（框架作者通常會提供如何操作的指南），並取得二進位檔的路徑。
3.  在您的專案中，建立一個 `.def` 檔案，例如 `MyFramework.def`。
4.  將第一個字串新增到此檔案中：`language = Objective-C`。如果您想使用純 C 依賴項，請省略語言屬性。
5.  提供這兩個強制屬性的值：

    *   `modules` – 應由 cinterop 處理的框架名稱。
    *   `package` – 這些宣告應放入的套件名稱。

    例如：

    ```none
    modules = MyFramework
    package = MyFramework
    ```

6.  將有關與框架互通性的資訊新增到建置指令碼中：

    *   傳遞 `.def` 檔案的路徑。如果您的 `.def` 檔案與 cinterop 同名並放置在 `src/nativeInterop/cinterop/` 目錄中，則可以省略此路徑。
    *   使用 `-framework` 選項將框架名稱傳遞給編譯器和連結器。使用 `-F` 選項將框架原始碼和二進位檔的路徑傳遞給編譯器和連結器。

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        iosArm64() {
            compilations.getByName("main") {
                val DateTools by cinterops.creating {
                    // .def 檔案的路徑
                    definitionFile.set(project.file("src/nativeInterop/cinterop/DateTools.def"))

                    compilerOpts("-framework", "MyFramework", "-F/path/to/framework/")
                }
                val anotherInterop by cinterops.creating { /* ... */ }
            }

            binaries.all {
                // 告知連結器框架的位置。
                linkerOpts("-framework", "MyFramework", "-F/path/to/framework/")
            }
       }
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    kotlin {
        iosArm64 {
            compilations.main {
                cinterops {
                    DateTools {
                        // .def 檔案的路徑
                        definitionFile = project.file("src/nativeInterop/cinterop/MyFramework.def")

                        compilerOpts("-framework", "MyFramework", "-F/path/to/framework/")
                    }
                    anotherInterop { /* ... */ }
                }
            }

            binaries.all {
                // 告知連結器框架的位置。
                linkerOpts("-framework", "MyFramework", "-F/path/to/framework/")
            }
        }
    }
    ```

    </tab>
    </tabs>

7.  建置專案。

現在您可以在您的 Kotlin 程式碼中使用此依賴項。為此，請匯入您在 `.def` 檔案的 `package` 屬性中設定的套件。對於以上範例，將是：

```kotlin
import MyFramework.*
```

進一步了解 [Swift/Objective-C 互通性](https://kotlinlang.org/docs/native-objc-interop.html)以及[從 Gradle 配置 cinterop](multiplatform-dsl-reference.md#cinterops)。

### 使用 CocoaPods

1.  執行[初始 CocoaPods 整合設定](multiplatform-cocoapods-overview.md#set-up-an-environment-to-work-with-cocoapods)。
2.  透過在您專案的 `build.gradle(.kts)` 中包含 `pod()` 函數呼叫，新增您想要使用的來自 CocoaPods 儲存庫的 Pod 函式庫依賴項。

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        cocoapods {
            version = "2.0"
            //..
            pod("SDWebImage") {
                version = "5.20.0"
            }
        }
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    kotlin {
        cocoapods {
            version = '2.0'
            //..
            pod('SDWebImage') {
                version = '5.20.0'
            }
        }
    }
    ```

    </tab>
    </tabs>

    您可以新增以下 Pod 函式庫依賴項：

    *   [來自 CocoaPods 儲存庫](multiplatform-cocoapods-libraries.md#from-the-cocoapods-repository)
    *   [本機儲存的函式庫](multiplatform-cocoapods-libraries.md#on-a-locally-stored-library)
    *   [來自自訂 Git 儲存庫](multiplatform-cocoapods-libraries.md#from-a-custom-git-repository)
    *   [來自自訂 Podspec 儲存庫](multiplatform-cocoapods-libraries.md#from-a-custom-podspec-repository)
    *   [帶有自訂 cinterop 選項](multiplatform-cocoapods-libraries.md#with-custom-cinterop-options)

3.  在 IntelliJ IDEA 中執行 **Build** | **Reload All Gradle Projects**（或在 Android Studio 中執行 **File** | **Sync Project with Gradle Files**），以重新匯入專案。

若要在您的 Kotlin 程式碼中使用此依賴項，請匯入套件 `cocoapods.<library-name>`。對於以上範例，將是：

```kotlin
import cocoapods.SDWebImage.*
```

> * 請參閱在 Kotlin 專案中[設定了不同 Pod 依賴項的範例專案](https://github.com/Kotlin/kmp-with-cocoapods-multitarget-xcode-sample)。
> * 查看[具有多個目標的 Xcode 專案依賴於 Kotlin 函式庫](https://github.com/Kotlin/kmp-with-cocoapods-multitarget-xcode-sample)的範例專案。
>
{style="tip"}

## 接下來是什麼？

查看有關在多平台專案中新增依賴項的其他資源，並進一步了解：

*   [連接平台函式庫](https://kotlinlang.org/docs/native-platform-libs.html)
*   [新增多平台函式庫或其他多平台專案的依賴項](multiplatform-add-dependencies.md)
*   [新增 Android 依賴項](multiplatform-android-dependencies.md)