[//]: # (title: 新增 iOS 相依性)

Apple SDK 相依性（例如 Foundation 或 Core Bluetooth）在 Kotlin Multiplatform 專案中作為一組預先建置的程式庫提供。它們不需要任何額外的設定。

你也可以在 iOS 原始碼集中重複使用 iOS 生態系統中的其他程式庫和架構。如果 Swift 相依性的 API 已透過 `@objc` 屬性匯出至 Objective-C，則 Kotlin 支援與 Objective-C 相依性和 Swift 相依性的互通性。目前尚不支援純 Swift 相依性。

若要處理 Kotlin Multiplatform 專案中的 iOS 相依性，你可以使用 [cinterop 工具](#with-cinterop)進行管理，或使用 [CocoaPods 相依管理器](#with-cocoapods)（不支援純 Swift pods）。

### 使用 cinterop

你可以使用 cinterop 工具為 Objective-C 或 Swift 宣告建立 Kotlin 繫結。這將允許你從 Kotlin 程式碼中呼叫它們。

[程式庫](#add-a-library)和[架構](#add-a-framework)的步驟略有不同，但一般工作流程如下：

1. 下載你的相依性。
2. 建置它以取得其二進位檔。
3. 建立一個特殊的 `.def` [定義檔](https://kotlinlang.org/docs/native-definition-file.html)，向 cinterop 描述此相依性。
4. 調整你的建置指令碼，以便在建置期間產生繫結。

#### 新增程式庫

1. 下載程式庫原始碼，並將其放置在可以從專案中參照的位置。
2. 建置程式庫（程式庫作者通常會提供如何操作的指南）並取得二進位檔的路徑。
3. 在你的專案中建立一個 `.def` 檔案，例如 `DateTools.def`。
4. 在此檔案中加入第一行字串：`language = Objective-C`。如果你想使用純 C 相依性，請省略 language 屬性。
5. 提供兩個強制屬性的值：

    * `headers` 描述哪些標頭將由 cinterop 處理。
    * `package` 設定這些宣告應放入的套件名稱。

   例如：

    ```none
    headers = DateTools.h
    package = DateTools
    ```

6. 在建置指令碼中加入與此程式庫互通的資訊：

    * 傳遞 `.def` 檔案的路徑。如果你的 `.def` 檔案與 cinterop 同名且放置在 `src/nativeInterop/cinterop/` 目錄中，則可以省略此路徑。
    * 使用 `includeDirs` 選項告訴 cinterop 在何處尋找標頭檔。
    * 設定與程式庫二進位檔的連結。

    <Tabs group="build-script">
    <TabItem title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        iosArm64() {
            compilations.getByName("main") {
                val DateTools by cinterops.creating {
                    // .def 檔案的路徑
                    definitionFile.set(project.file("src/nativeInterop/cinterop/DateTools.def"))

                    // 標頭搜尋目錄（類比於 -I<path> 編譯器選項）
                    includeDirs("include/this/directory", "path/to/another/directory")
                }
                val anotherInterop by cinterops.creating { /* ... */ }
            }

            binaries.all {
                // 連結至程式庫所需的連結器選項。
                linkerOpts("-L/path/to/library/binaries", "-lbinaryname")
            }
        }
    }
    ```

    </TabItem>
    <TabItem title="Groovy" group-key="groovy">

    ```groovy
    kotlin {
        iosArm64 {
            compilations.main {
                cinterops {
                    DateTools {
                        // .def 檔案的路徑
                        definitionFile = project.file("src/nativeInterop/cinterop/DateTools.def")

                        // 標頭搜尋目錄（類比於 -I<path> 編譯器選項）
                        includeDirs("include/this/directory", "path/to/another/directory")
                    }
                    anotherInterop { /* ... */ }
                }
            }

            binaries.all {
                // 連結至程式庫所需的連結器選項。
                linkerOpts "-L/path/to/library/binaries", "-lbinaryname"
            }
        }
    }
    ```

    </TabItem>
    </Tabs>

7. 建置專案。

現在你可以在 Kotlin 程式碼中使用此相依性。為此，請匯入你在 `.def` 檔案的 `package` 屬性中設定的套件。對於上述範例，這將是：

```kotlin
import DateTools.*
```

> 請參閱[使用 cinterop 工具和 libcurl 程式庫](https://github.com/Kotlin/kotlin-hands-on-intro-kotlin-native)的範例專案。
>
{style="tip"}

#### 新增架構

1. 下載架構原始碼，並將其放置在可以從專案中參照的位置。
2. 建置架構（架構作者通常會提供如何操作的指南）並取得二進位檔的路徑。
3. 在你的專案中建立一個 `.def` 檔案，例如 `MyFramework.def`。
4. 在此檔案中加入第一行字串：`language = Objective-C`。如果你想使用純 C 相依性，請省略 language 屬性。
5. 提供這兩個強制屬性的值：

    * `modules` – 應由 cinterop 處理的架構名稱。
    * `package` – 這些宣告應放入的套件名稱。

    例如：
    
    ```none
    modules = MyFramework
    package = MyFramework
    ```

6. 在建置指令碼中加入與架構互通的資訊：

    * 傳遞 .def 檔案的路徑。如果你的 `.def` 檔案與 cinterop 同名且放置在 `src/nativeInterop/cinterop/` 目錄中，則可以省略此路徑。
    * 使用 `-framework` 選項將架構名稱傳遞給編譯器和連結器。使用 `-F` 選項將架構來源和二進位檔的路徑傳遞給編譯器和連結器。

    <Tabs group="build-script">
    <TabItem title="Kotlin" group-key="kotlin">

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
                // 告訴連結器架構的位置。
                linkerOpts("-framework", "MyFramework", "-F/path/to/framework/")
            }
       }
    }
    ```

    </TabItem>
    <TabItem title="Groovy" group-key="groovy">

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
                // 告訴連結器架構的位置。
                linkerOpts("-framework", "MyFramework", "-F/path/to/framework/")
            }
        }
    }
    ```

    </TabItem>
    </Tabs>

7. 建置專案。

現在你可以在 Kotlin 程式碼中使用此相依性。為此，請匯入你在 `.def` 檔案的 package 屬性中設定的套件。對於上述範例，這將是：

```kotlin
import MyFramework.*
```

進一步了解 [Swift/Objective-C 互通性](https://kotlinlang.org/docs/native-objc-interop.html)以及[從 Gradle 設定 cinterop](multiplatform-dsl-reference.md#cinterops)。

### 使用 CocoaPods

1. 執行[初始 CocoaPods 整合設定](multiplatform-cocoapods-overview.md#set-up-an-environment-to-work-with-cocoapods)。
2. 透過在專案的 `build.gradle(.kts)` 中包含 `pod()` 函式呼叫，新增來自 CocoaPods 儲存庫中你想要使用的 Pod 程式庫相依性。

    <Tabs group="build-script">
    <TabItem title="Kotlin" group-key="kotlin">

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

    </TabItem>
    <TabItem title="Groovy" group-key="groovy">

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

    </TabItem>
    </Tabs>

   你可以新增以下對 Pod 程式庫的相依性：

   * [來自 CocoaPods 儲存庫](multiplatform-cocoapods-libraries.md#from-the-cocoapods-repository)
   * [對本機儲存的程式庫](multiplatform-cocoapods-libraries.md#on-a-locally-stored-library)
   * [來自自訂 Git 儲存庫](multiplatform-cocoapods-libraries.md#from-a-custom-git-repository)
   * [來自自訂 Podspec 儲存庫](multiplatform-cocoapods-libraries.md#from-a-custom-podspec-repository)
   * [搭配自訂 cinterop 選項](multiplatform-cocoapods-libraries.md#with-custom-cinterop-options)

3. 在 IntelliJ IDEA 中執行 **Build** | **Reload All Gradle Projects**（或在 Android Studio 中執行 **File** | **Sync Project with Gradle Files**）以重新匯入專案。

若要在 Kotlin 程式碼中使用該相依性，請匯入套件 `cocoapods.<library-name>`。對於上述範例，即為：

```kotlin
import cocoapods.SDWebImage.*
```

> * 請參閱[在 Kotlin 專案中設定不同 Pod 相依性](https://github.com/Kotlin/kmp-with-cocoapods-multitarget-xcode-sample)的範例專案。
> * 查看[具有多個目標的 Xcode 專案相依於 Kotlin 程式庫](https://github.com/Kotlin/kmp-with-cocoapods-multitarget-xcode-sample)的範例專案。
> 
{style="tip"}

## 下一步

查看關於在多平台專案中新增相依性的其他資源，並進一步了解：

* [連接平台程式庫](https://kotlinlang.org/docs/native-platform-libs.html)
* [新增對多平台程式庫或其他多平台專案的相依性](multiplatform-add-dependencies.md)
* [新增 Android 相依性](multiplatform-android-dependencies.md)