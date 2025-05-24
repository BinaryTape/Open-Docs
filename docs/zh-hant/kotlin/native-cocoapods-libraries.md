---
title: "新增對 Pod 函式庫的依賴"
---
為了在 Kotlin 專案和 Pod 函式庫之間新增依賴項，請[完成初始設定](native-cocoapods#set-up-an-environment-to-work-with-cocoapods)。
然後，您可以新增對不同類型 Pod 函式庫的依賴項。

當您新增新的依賴項並在 IDE 中重新匯入專案時，新的依賴項將會自動新增。
不需要額外的步驟。

若要在 Xcode 中使用您的 Kotlin 專案，您應該[在專案的 Podfile 中進行變更](native-cocoapods#update-podfile-for-xcode)。

Kotlin 專案需要在 `build.gradle(.kts)` 中呼叫 `pod()` 函數，以新增 Pod 依賴項。
每個依賴項都需要其單獨的函數呼叫。您可以在函數的設定區塊中指定依賴項的參數。

:::note
如果您沒有指定最低部署目標版本，且依賴的 Pod 需要更高的部署目標，您將會收到錯誤。

:::

您可以在[此處](https://github.com/Kotlin/kmm-with-cocoapods-sample)找到範例專案。

## 從 CocoaPods 儲存庫

1. 在 `pod()` 函數中指定 Pod 函式庫的名稱。
   
   在設定區塊中，您可以使用 `version` 參數指定函式庫的版本。若要使用函式庫的最新版本，您可以完全省略此參數。

   > 您可以新增對子規格 (subspec) 的依賴項。
   >
   

2. 指定 Pod 函式庫的最低部署目標版本。

    ```kotlin
    kotlin {
        iosArm64()

        cocoapods {
            version = "2.0"
            ios.deploymentTarget = "16.0"

            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"

            pod("SDWebImage") {
                version = "5.20.0"
            }
        }
    }
    ```

3. 在 IntelliJ IDEA 中執行 **Reload All Gradle Projects**（或在 Android Studio 中執行 **Sync Project with Gradle Files**）以重新匯入專案。

若要從 Kotlin 程式碼使用這些依賴項，請匯入套件 `cocoapods.<library-name>`：

```kotlin
import cocoapods.SDWebImage.*
```

## 從本機儲存的函式庫

1. 在 `pod()` 函數中指定 Pod 函式庫的名稱。

   在設定區塊中，指定本機 Pod 函式庫的路徑：在 `source` 參數值中使用 `path()` 函數。

   > 您也可以新增對子規格 (subspec) 的本機依賴項。
   > `cocoapods` 區塊可以同時包含對本機儲存的 Pod 和來自 CocoaPods 儲存庫的 Pod 的依賴項。
   >
   

2. 指定 Pod 函式庫的最低部署目標版本。

    ```kotlin
    kotlin {
        iosArm64()

        cocoapods {
            version = "2.0"
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"

            ios.deploymentTarget = "16.0"

            pod("pod_dependency") {
                version = "1.0"
                extraOpts += listOf("-compiler-option")
                source = path(project.file("../pod_dependency"))
            }
            pod("subspec_dependency/Core") {
                version = "1.0"
                extraOpts += listOf("-compiler-option")
                source = path(project.file("../subspec_dependency"))
            }
            pod("SDWebImage") {
                version = "5.20.0"
            }
        }
    }
    ```

   > 您也可以使用設定區塊中的 `version` 參數指定函式庫的版本。
   > 若要使用函式庫的最新版本，請省略該參數。
   >
   

3. 在 IntelliJ IDEA 中執行 **Reload All Gradle Projects**（或在 Android Studio 中執行 **Sync Project with Gradle Files**）以重新匯入專案。

若要從 Kotlin 程式碼使用這些依賴項，請匯入套件 `cocoapods.<library-name>`：

```kotlin
import cocoapods.pod_dependency.*
import cocoapods.subspec_dependency.*
import cocoapods.SDWebImage.*
```

## 從自訂 Git 儲存庫

1. 在 `pod()` 函數中指定 Pod 函式庫的名稱。

   在設定區塊中，指定 Git 儲存庫的路徑：在 `source` 參數值中使用 `git()` 函數。

   此外，您可以在 `git()` 後面的區塊中指定以下參數：
    * `commit` – 使用儲存庫中的特定 commit
    * `tag` – 使用儲存庫中的特定 tag
    * `branch` – 使用儲存庫中的特定 branch

   `git()` 函數會按以下順序優先處理傳遞的參數：`commit`、`tag`、`branch`。
   如果您沒有指定參數，Kotlin 外掛程式會使用 `master` branch 中的 `HEAD`。

   > 您可以組合 `branch`、`commit` 和 `tag` 參數，以取得 Pod 的特定版本。
   >
   

2. 指定 Pod 函式庫的最低部署目標版本。

    ```kotlin
    kotlin {
        iosArm64()

        cocoapods {
            version = "2.0"
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"

            ios.deploymentTarget = "16.0"

            pod("SDWebImage") {
                source = git("https://github.com/SDWebImage/SDWebImage") {
                    tag = "5.20.0"
                }
            }

            pod("JSONModel") {
                source = git("https://github.com/jsonmodel/jsonmodel.git") {
                    branch = "key-mapper-class"
                }
            }

            pod("CocoaLumberjack") {
                source = git("https://github.com/CocoaLumberjack/CocoaLumberjack.git") {
                    commit = "3e7f595e3a459c39b917aacf9856cd2a48c4dbf3"
                }
            }
        }
    }
    ```

3. 在 IntelliJ IDEA 中執行 **Reload All Gradle Projects**（或在 Android Studio 中執行 **Sync Project with Gradle Files**）以重新匯入專案。

若要從 Kotlin 程式碼使用這些依賴項，請匯入套件 `cocoapods.<library-name>`：

```kotlin
import cocoapods.Alamofire.*
import cocoapods.JSONModel.*
import cocoapods.CocoaLumberjack.*
```

## 從自訂 Podspec 儲存庫

1. 使用 `specRepos` 區塊內的 `url()` 指定自訂 Podspec 儲存庫的 HTTP 位址。
2. 在 `pod()` 函數中指定 Pod 函式庫的名稱。
3. 指定 Pod 函式庫的最低部署目標版本。

    ```kotlin
    kotlin {
        iosArm64()

        cocoapods {
            version = "2.0"
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"

            ios.deploymentTarget = "16.0"

            specRepos {
                url("https://github.com/Kotlin/kotlin-cocoapods-spec.git")
            }
            pod("example")
        }
    }
    ```

4. 在 IntelliJ IDEA 中執行 **Reload All Gradle Projects**（或在 Android Studio 中執行 **Sync Project with Gradle Files**）以重新匯入專案。

:::note
為了與 Xcode 正確協同運作，您應該在 Podfile 的開頭指定規範 (spec) 的位置。
例如，
```ruby
source 'https://github.com/Kotlin/kotlin-cocoapods-spec.git'
```

:::

若要從 Kotlin 程式碼使用這些依賴項，請匯入套件 `cocoapods.<library-name>`：

```kotlin
import cocoapods.example.*
```

## 使用自訂 cinterop 選項

1. 在 `pod()` 函數中指定 Pod 函式庫的名稱。
2. 在設定區塊中，新增以下選項：

   * `extraOpts` – 指定 Pod 函式庫的選項清單。例如，`extraOpts = listOf("-compiler-option")`。
      
      > 如果您遇到 clang 模組的問題，也請新增 `-fmodules` 選項。
      >
     

   * `packageName` – 使用 `import <packageName>`，透過套件名稱直接匯入函式庫。

3. 指定 Pod 函式庫的最低部署目標版本。

    ```kotlin
    kotlin {
        iosArm64()

        cocoapods {
            version = "2.0"
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"

            ios.deploymentTarget = "16.0"

            pod("FirebaseAuth") {
                packageName = "FirebaseAuthWrapper"
                version = "11.7.0"
                extraOpts += listOf("-compiler-option", "-fmodules")
            }
        }
    }
    ```

4. 在 IntelliJ IDEA 中執行 **Reload All Gradle Projects**（或在 Android Studio 中執行 **Sync Project with Gradle Files**）以重新匯入專案。

若要從 Kotlin 程式碼使用這些依賴項，請匯入套件 `cocoapods.<library-name>`：
   
```kotlin
import cocoapods.FirebaseAuth.*
```
   
如果您使用 `packageName` 參數，則可以使用套件名稱 `import <packageName>` 匯入函式庫：
   
```kotlin
import FirebaseAuthWrapper.Auth
import FirebaseAuthWrapper.User
```

### 支援具有 @import 指令的 Objective-C 標頭

:::caution
此功能為[實驗性](components-stability#stability-levels-explained)。
它可能會隨時被刪除或變更。僅將其用於評估目的。
我們感謝您在 [YouTrack](https://kotl.in/issue) 中提供有關它的意見反應。

:::

某些 Objective-C 函式庫，特別是那些充當 Swift 函式庫包裝器的函式庫，在其標頭中具有 `@import` 指令。預設情況下，cinterop 不支援這些指令。

若要啟用對 `@import` 指令的支援，請在 `pod()` 函數的設定區塊中指定 `-fmodules` 選項：

```kotlin
kotlin {
    iosArm64()

    cocoapods {
        version = "2.0"
        summary = "CocoaPods test library"
        homepage = "https://github.com/JetBrains/kotlin"

        ios.deploymentTarget = "16.0"

        pod("PodName") {
            version = "1.0.0"
            extraOpts = listOf("-compiler-option", "-fmodules")
        }
    }
}
```

### 在相依 Pod 之間共用 Kotlin cinterop

如果您使用 `pod()` 函數在 Pod 上新增多個依賴項，則當 Pod 的 API 之間存在依賴項時，您可能會遇到問題。

為了使程式碼在這種情況下能夠編譯，請使用 `useInteropBindingFrom()` 函數。
它會在為新 Pod 建立綁定時，利用為另一個 Pod 產生的 cinterop 綁定。

您應該在設定依賴項之前宣告相依 Pod：

```kotlin
// The cinterop of pod("WebImage"):
fun loadImage(): WebImage

// The cinterop of pod("Info"):
fun printImageInfo(image: WebImage)

// Your code:
printImageInfo(loadImage())
```

如果這種情況下您沒有設定 cinterop 之間的正確依賴項，則程式碼將會無效，因為 `WebImage` 類型將來自不同的 cinterop 檔案，因此來自不同的套件。