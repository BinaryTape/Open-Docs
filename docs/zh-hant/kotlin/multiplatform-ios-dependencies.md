---
title: "新增 iOS 依賴項"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Apple SDK相依性（dependencies，例如 Foundation 或 Core Bluetooth）在 Kotlin Multiplatform 專案中以一組預先建置的函式庫（prebuilt libraries）形式提供。 它們不需要任何額外的設定。

您也可以在 iOS 來源集中重複使用來自 iOS 生態系統的其他函式庫和框架（frameworks）。 Kotlin 支援與 Objective-C 相依性和 Swift 相依性的互通性（interoperability），前提是它們的 API 使用 `@objc` 屬性匯出到 Objective-C。 目前尚不支援純 Swift 相依性。

若要在 Kotlin Multiplatform 專案中處理 iOS 相依性，您可以使用 [cinterop 工具](#with-cinterop)管理它們，或使用 [CocoaPods 相依性管理器](#with-cocoapods)（不支援純 Swift pod）。

### 使用 cinterop

您可以使用 cinterop 工具為 Objective-C 或 Swift 宣告（declarations）建立 Kotlin 綁定（bindings）。 這將允許您從 Kotlin 程式碼呼叫它們。

對於[函式庫](#add-a-library)和[框架](#add-a-framework)，步驟略有不同，但一般工作流程如下所示：

1. 下載您的相依性。
2. 建置它以取得其二進位檔（binaries）。
3. 建立一個特殊的 `.def` [定義檔](native-definition-file)，向 cinterop 描述此相依性。
4. 調整您的建置腳本以在建置期間產生綁定。

#### 加入函式庫

1. 下載函式庫原始碼，並將其放置在您可以從專案中參考它的位置。
2. 建置函式庫（library authors 通常會提供有關如何執行此操作的指南）並取得二進位檔的路徑。
3. 在您的專案中，建立一個 `.def` 檔案，例如 `DateTools.def`。
4. 將第一個字串新增到此檔案：`language = Objective-C`。 如果您想使用純 C 相依性，請省略 language 屬性。
5. 為兩個強制屬性提供值：

    * `headers` 描述將由 cinterop 處理的標頭。
    * `package` 設定這些宣告應放入的套件名稱。

   例如：

    ```none
    headers = DateTools.h
    package = DateTools
    ```

6. 將有關與此函式庫互通性的資訊新增到建置腳本：

    * 傳遞 `.def` 檔案的路徑。 如果您的 `.def` 檔案與 cinterop 同名，並且放置在 `src/nativeInterop/cinterop/` 目錄中，則可以省略此路徑。
    * 使用 `includeDirs` 選項告知 cinterop 在哪裡尋找標頭檔。
    * 設定連結到函式庫二進位檔的連結。

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>

    ```kotlin
    kotlin {
        iosArm64() {
            compilations.getByName("main") {
                val DateTools by cinterops.creating {
                    // Path to the .def file
                    definitionFile.set(project.file("src/nativeInterop/cinterop/DateTools.def"))

                    // Directories for header search (an analogue of the -I<path> compiler option)
                    includeDirs("include/this/directory", "path/to/another/directory")
                }
                val anotherInterop by cinterops.creating { /* ... */ }
            }

            binaries.all {
                // Linker options required to link to the library.
                linkerOpts("-L/path/to/library/binaries", "-lbinaryname")
            }
        }
    }
    ```

    </TabItem>
    <TabItem value="groovy" label="Groovy" default>

    ```groovy
    kotlin {
        iosArm64 {
            compilations.main {
                cinterops {
                    DateTools {
                        // Path to the .def file
                        definitionFile = project.file("src/nativeInterop/cinterop/DateTools.def")

                        // Directories for header search (an analogue of the -I<path> compiler option)
                        includeDirs("include/this/directory", "path/to/another/directory")
                    }
                    anotherInterop { /* ... */ }
                }
            }

            binaries.all {
                // Linker options required to link to the library.
                linkerOpts "-L/path/to/library/binaries", "-lbinaryname"
            }
        }
    }
    ```

    </TabItem>
    </Tabs>

7. 建置專案。

現在您可以在 Kotlin 程式碼中使用此相依性。 為此，請匯入您在 `.def` 檔案的 `package` 屬性中設定的套件。 對於上面的範例，這將是：

```kotlin
import DateTools.*
```

#### 加入框架

1. 下載框架原始碼，並將其放置在您可以從專案中參考它的位置。
2. 建置框架（framework authors 通常會提供有關如何執行此操作的指南）並取得二進位檔的路徑。
3. 在您的專案中，建立一個 `.def` 檔案，例如 `MyFramework.def`。
4. 將第一個字串新增到此檔案：`language = Objective-C`。 如果您想使用純 C 相依性，請省略 language 屬性。
5. 為這兩個強制屬性提供值：

    * `modules` – 應由 cinterop 處理的框架名稱。
    * `package` – 這些宣告應放入的套件名稱。

    例如：
    
    ```none
    modules = MyFramework
    package = MyFramework
    ```

6. 將有關與框架互通性的資訊新增到建置腳本：

    * 傳遞 .def 檔案的路徑。 如果您的 .def 檔案與 cinterop 同名，並且放置在 `src/nativeInterop/cinterop/` 目錄中，則可以省略此路徑。
    * 使用 `-framework` 選項將框架名稱傳遞給編譯器和連結器。 使用 `-F` 選項將框架來源和二進位檔的路徑傳遞給編譯器和連結器。

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>

    ```kotlin
    kotlin {
        iosArm64() {
            compilations.getByName("main") {
                val DateTools by cinterops.creating {
                    // Path to the .def file
                    definitionFile.set(project.file("src/nativeInterop/cinterop/DateTools.def"))

                    compilerOpts("-framework", "MyFramework", "-F/path/to/framework/")
                }
                val anotherInterop by cinterops.creating { /* ... */ }
            }

            binaries.all {
                // Tell the linker where the framework is located.
                linkerOpts("-framework", "MyFramework", "-F/path/to/framework/")
            }
       }
    }
    ```

    </TabItem>
    <TabItem value="groovy" label="Groovy" default>

    ```groovy
    kotlin {
        iosArm64 {
            compilations.main {
                cinterops {
                    DateTools {
                        // Path to the .def file
                        definitionFile = project.file("src/nativeInterop/cinterop/MyFramework.def")

                        compilerOpts("-framework", "MyFramework", "-F/path/to/framework/")
                    }
                    anotherInterop { /* ... */ }
                }
            }

            binaries.all {
                // Tell the linker where the framework is located.
                linkerOpts("-framework", "MyFramework", "-F/path/to/framework/")
            }
        }
    }
    ```

    </TabItem>
    </Tabs>

7. 建置專案。

現在您可以在 Kotlin 程式碼中使用此相依性。 為此，請匯入您在 package 屬性中設定的套件。 對於上面的範例，這將是：

```kotlin
import MyFramework.*
```

深入瞭解 [Objective-C 和 Swift 互通性](native-objc-interop)以及[從 Gradle 設定 cinterop](multiplatform-dsl-reference#cinterops)。

### 使用 CocoaPods

1. 執行 [初始 CocoaPods 整合設定](native-cocoapods#set-up-an-environment-to-work-with-cocoapods)。
2. 透過在專案的 `build.gradle(.kts)` 中包含 `pod()` 函數呼叫，新增您要使用的 CocoaPods 儲存庫中 Pod 函式庫的相依性。

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>

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
    <TabItem value="groovy" label="Groovy" default>

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

   您可以新增以下 Pod 函式庫的相依性：

   * [從 CocoaPods 儲存庫](native-cocoapods-libraries#from-the-cocoapods-repository)
   * [在本機儲存的函式庫上](native-cocoapods-libraries#on-a-locally-stored-library)
   * [從自訂 Git 儲存庫](native-cocoapods-libraries#from-a-custom-git-repository)
   * [從自訂 Podspec 儲存庫](native-cocoapods-libraries#from-a-custom-podspec-repository)
   * [使用自訂 cinterop 選項](native-cocoapods-libraries#with-custom-cinterop-options)

3. 在 IntelliJ IDEA 中執行 **Reload All Gradle Projects**（或在 Android Studio 中執行 **Sync Project with Gradle Files**）以重新匯入專案。

若要在 Kotlin 程式碼中使用相依性，請匯入套件 `cocoapods.<library-name>`。 對於上面的範例，它是：

```kotlin
import cocoapods.SDWebImage.*
```

## 接下來是什麼？

查看有關在多平台專案中新增相依性的其他資源，並深入瞭解：

* [連接平台函式庫](native-platform-libs)
* [新增多平台函式庫或其他多平台專案的相依性](multiplatform-add-dependencies)
* [新增 Android 相依性](multiplatform-android-dependencies)