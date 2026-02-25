[//]: # (title: 新增對 Pod 程式庫的相依性)

<tldr>

   * 在新增 Pod 相依性之前，請先[完成初始配置](multiplatform-cocoapods-overview.md#set-up-an-environment-to-work-with-cocoapods)。
   * 您可以在我們的 [GitHub 存儲庫](https://github.com/Kotlin/kmp-with-cocoapods-sample)中找到範例專案。

</tldr>

您可以在 Kotlin 專案中的不同位置新增對 Pod 程式庫的相依性。

要新增 Pod 相依性，請在共用模組的 `build.gradle(.kts)` 檔案中呼叫 `pod()` 函式。
每個相依性都需要單獨的函式呼叫。您可以在該函式的配置區塊中指定相依性的參數。

* 當您新增相依性並在 IDE 中重新匯入專案時，該程式庫將會自動連接。
* 要在 Xcode 中使用您的 Kotlin 專案，請先[對專案的 Podfile 進行變更](multiplatform-cocoapods-overview.md#update-podfile-for-xcode)。

> 如果您沒有指定最低部署目標版本，而相依的 Pod 需要更高的部署目標，則會發生錯誤。
>
{style="note"}

## 從 CocoaPods 存儲庫

要新增對位於 CocoaPods 存儲庫中的 Pod 程式庫之相依性：

1. 在 `pod()` 函式中指定 Pod 程式庫的名稱。
   
   在配置區塊中，您可以使用 `version` 參數指定程式庫的版本。
   若要使用該程式庫的最新版本，您可以完全省略此參數。

   > 您也可以新增對 subspec 的相依性。
   >
   {style="note"}

2. 指定 Pod 程式庫的最低部署目標版本。

    ```kotlin
    kotlin {
        iosArm64()

        cocoapods {
            version = "2.0"
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"
            ios.deploymentTarget = "16.0"

            pod("SDWebImage") {
                version = "5.20.0"
            }
        }
    }
    ```

3. 在 IntelliJ IDEA 中執行 **組建 (Build)** | **重新載入所有 Gradle 專案 (Reload All Gradle Projects)**（或在 Android Studio 中執行 **檔案 (File)** | **將專案與 Gradle 檔案同步 (Sync Project with Gradle Files)**）以重新匯入專案。

若要從 Kotlin 程式碼中使用這些相依性，請匯入套件 `cocoapods.<library-name>`：

```kotlin
import cocoapods.SDWebImage.*
```

## 在本機存儲的程式庫上

要新增對本機存儲的 Pod 程式庫之相依性：

1. 在 `pod()` 函式中指定 Pod 程式庫的名稱。

   在配置區塊中，指定本機 Pod 程式庫的路徑：在 `source` 參數值中使用 `path()` 函式。

   > 您也可以新增對 subspec 的本機相依性。
   > `cocoapods {}` 區塊可以同時包含對本機存儲的 Pod 和來自 CocoaPods 存儲庫的 Pod 之相依性。
   >
   {style="note"}

2. 指定 Pod 程式庫的最低部署目標版本。

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

   > 您也可以在配置區塊中使用 `version` 參數指定程式庫的版本。
   > 若要使用該程式庫的最新版本，請省略此參數。
   >
   {style="note"}

3. 在 IntelliJ IDEA 中執行 **組建 (Build)** | **重新載入所有 Gradle 專案 (Reload All Gradle Projects)**（或在 Android Studio 中執行 **檔案 (File)** | **將專案與 Gradle 檔案同步 (Sync Project with Gradle Files)**）以重新匯入專案。

若要從 Kotlin 程式碼中使用這些相依性，請匯入套件 `cocoapods.<library-name>`：

```kotlin
import cocoapods.pod_dependency.*
import cocoapods.subspec_dependency.*
import cocoapods.SDWebImage.*
```

## 從自訂 Git 存儲庫

要新增對位於自訂 Git 存儲庫中的 Pod 程式庫之相依性：

1. 在 `pod()` 函式中指定 Pod 程式庫的名稱。

   在配置區塊中，指定 git 存儲庫的路徑：在 `source` 參數值中使用 `git()` 函式。

   此外，您可以在 `git()` 之後的區塊中指定以下參數：
    * `commit` – 使用存儲庫中的特定提交
    * `tag` – 使用存儲庫中的特定標籤
    * `branch` – 使用存儲庫中的特定分支

   `git()` 函式按以下順序優先處理傳遞的參數：`commit`、`tag`、`branch`。
   如果您未指定參數，Kotlin 外掛程式將使用 `master` 分支中的 `HEAD`。

   > 您可以結合使用 `branch`、`commit` 和 `tag` 參數來取得特定版本的 Pod。
   >
   {style="note"}

2. 指定 Pod 程式庫的最低部署目標版本。

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

3. 在 IntelliJ IDEA 中執行 **組建 (Build)** | **重新載入所有 Gradle 專案 (Reload All Gradle Projects)**（或在 Android Studio 中執行 **檔案 (File)** | **將專案與 Gradle 檔案同步 (Sync Project with Gradle Files)**）以重新匯入專案。

若要從 Kotlin 程式碼中使用這些相依性，請匯入套件 `cocoapods.<library-name>`：

```kotlin
import cocoapods.SDWebImage.*
import cocoapods.JSONModel.*
import cocoapods.CocoaLumberjack.*
```

## 從自訂 Podspec 存儲庫

要新增對位於自訂 Podspec 存儲庫中的 Pod 程式庫之相依性：

1. 在 `specRepos {}` 區塊中使用 `url()` 呼叫指定自訂 Podspec 存儲庫的位址。
2. 在 `pod()` 函式中指定 Pod 程式庫的名稱。
3. 指定 Pod 程式庫的最低部署目標版本。

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

4. 在 IntelliJ IDEA 中執行 **組建 (Build)** | **重新載入所有 Gradle 專案 (Reload All Gradle Projects)**（或在 Android Studio 中執行 **檔案 (File)** | **將專案與 Gradle 檔案同步 (Sync Project with Gradle Files)**）以重新匯入專案。

> 若要與 Xcode 協作，請在 Podfile 的開頭指定 spec 的位置：
> 
> ```ruby
> source 'https://github.com/Kotlin/kotlin-cocoapods-spec.git'
> ```
>
{style="note"}

若要從 Kotlin 程式碼中使用這些相依性，請匯入套件 `cocoapods.<library-name>`：

```kotlin
import cocoapods.example.*
```

## 使用自訂 cinterop 選項

要使用自訂 cinterop 選項新增對 Pod 程式庫的相依性：

1. 在 `pod()` 函式中指定 Pod 程式庫的名稱。
2. 在配置區塊中，新增以下選項：

   * `extraOpts` – 指定 Pod 程式庫的選項清單。例如，`extraOpts = listOf("-compiler-option")`。
      
      > 如果您遇到 clang 模組的問題，請同時新增 `-fmodules` 選項。
      >
     {style="note"}

   * `packageName` – 使用 `import <packageName>` 直接透過套件名稱匯入程式庫。

3. 指定 Pod 程式庫的最低部署目標版本。

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

4. 在 IntelliJ IDEA 中執行 **組建 (Build)** | **重新載入所有 Gradle 專案 (Reload All Gradle Projects)**（或在 Android Studio 中執行 **檔案 (File)** | **將專案與 Gradle 檔案同步 (Sync Project with Gradle Files)**）以重新匯入專案。

若要從 Kotlin 程式碼中使用這些相依性，請匯入套件 `cocoapods.<library-name>`：
   
```kotlin
import cocoapods.FirebaseAuth.*
```
   
如果您使用 `packageName` 參數，則可以使用套件名稱 `import <packageName>` 匯入程式庫：
   
```kotlin
import FirebaseAuthWrapper.Auth
import FirebaseAuthWrapper.User
```

### 支援帶有 @import 指示詞的 Objective-C 標頭

> 此功能為 [實驗性](supported-platforms.md#general-kotlin-stability-levels)。
> 它隨時可能被捨棄或變更。請僅出於評估目的使用。
> 我們歡迎您在 [YouTrack](https://kotl.in/issue) 提供相關回饋。
>
{style="warning"}

某些 Objective-C 程式庫，特別是那些作為 Swift 程式庫包裝器的程式庫，在標頭中包含 `@import` 指示詞。預設情況下，cinterop 不提供對這些指示詞的支援。

要啟用對 `@import` 指示詞的支援，請在 `pod()` 函式的配置區塊中指定 `-fmodules` 選項：

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

### 在相依的 Pod 之間共用 Kotlin cinterop

如果您使用 `pod()` 函式新增多個 Pod 相依性，當 Pod 的 API 之間存在相依關係時，您可能會遇到問題。

要在這種情況下使程式碼編譯，請使用 `useInteropBindingFrom()` 函式。
它在為新 Pod 建置繫結時，會利用為另一個 Pod 產生的 cinterop 繫結。

您應該在設定相依性之前宣告被相依的 Pod：

```kotlin
// pod("WebImage") 的 cinterop：
fun loadImage(): WebImage

// pod("Info") 的 cinterop：
fun printImageInfo(image: WebImage)

// 您的程式碼：
printImageInfo(loadImage())
```

如果您在這種情況下沒有配置 cinterop 之間正確的相依性，程式碼將會無效，因為 `WebImage` 型別會來自不同的 cinterop 檔案，進而來自不同的套件。

## 下一步

* [設定 Kotlin 專案與 Xcode 專案之間的相依性](multiplatform-cocoapods-xcode.md)
* [參閱完整的 CocoaPods Gradle 外掛程式 DSL 參考](multiplatform-cocoapods-dsl-reference.md)