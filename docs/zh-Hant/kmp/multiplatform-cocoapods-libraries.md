[//]: # (title: 新增 Pod 函式庫的相依性)

<tldr>

   * 在新增 Pod 相依性之前，請先[完成初始配置](multiplatform-cocoapods-overview.md#set-up-an-environment-to-work-with-cocoapods)。
   * 您可以在我們的 [GitHub 儲存庫](https://github.com/Kotlin/kmp-with-cocoapods-sample)中找到一個範例專案。

</tldr>

您可以在 Kotlin 專案中從不同位置新增 Pod 函式庫的相依性。

若要新增 Pod 相依性，請在共享模組的 `build.gradle(.kts)` 檔案中呼叫 `pod()` 函數。
每個相依性都需要單獨的函數呼叫。您可以在函數的配置區塊中指定相依性的參數。

* 當您新增一個新相依性並在您的 IDE 中重新匯入專案時，該函式庫將會自動連接。
* 若要在 Xcode 中使用您的 Kotlin 專案，請先[變更您專案的 Podfile](multiplatform-cocoapods-overview.md#update-podfile-for-xcode)。

> 如果您未指定最低部署目標版本，且某個相依 Pod 需要更高的部署目標，
> 您將會收到錯誤。
>
{style="note"}

## 來自 CocoaPods 儲存庫

若要新增對位於 CocoaPods 儲存庫中的 Pod 函式庫的相依性：

1. 在 `pod()` 函數中指定 Pod 函式庫的名稱。
   
   在配置區塊中，您可以使用 `version` 參數指定函式庫的版本。
   若要使用函式庫的最新版本，您可以完全省略此參數。

   > 您也可以新增對 subspecs 的相依性。
   >
   {style="note"}

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
                version = "5.20.0"
            }
        }
    }
    ```

3. 在 IntelliJ IDEA 中執行 **Build** | **Reload All Gradle Projects**（或在 Android Studio 中執行 **File** | **Sync Project with Gradle Files**）以重新匯入專案。

若要從 Kotlin 程式碼中使用這些相依性，請匯入 `cocoapods.<library-name>` 套件：

```kotlin
import cocoapods.SDWebImage.*
```

## 在本地儲存的函式庫上

若要新增對本地儲存的 Pod 函式庫的相依性：

1. 在 `pod()` 函數中指定 Pod 函式庫的名稱。

   在配置區塊中，指定本地 Pod 函式庫的路徑：在 `source` 參數值中使用 `path()` 函數。

   > 您也可以新增對 subspecs 的本地相依性。
   > `cocoapods {}` 區塊可以同時包含對本地儲存的 Pod 以及來自 CocoaPods 儲存庫的 Pod 的相依性。
   >
   {style="note"}

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

   > 您也可以在配置區塊中使用 `version` 參數指定函式庫的版本。
   > 若要使用函式庫的最新版本，請省略該參數。
   >
   {style="note"}

3. 在 IntelliJ IDEA 中執行 **Build** | **Reload All Gradle Projects**（或在 Android Studio 中執行 **File** | **Sync Project with Gradle Files**）以重新匯入專案。

若要從 Kotlin 程式碼中使用這些相依性，請匯入 `cocoapods.<library-name>` 套件：

```kotlin
import cocoapods.pod_dependency.*
import cocoapods.subspec_dependency.*
import cocoapods.SDWebImage.*
```

## 來自自訂 Git 儲存庫

若要新增對位於自訂 Git 儲存庫中的 Pod 函式庫的相依性：

1. 在 `pod()` 函數中指定 Pod 函式庫的名稱。

   在配置區塊中，指定 Git 儲存庫的路徑：在 `source` 參數值中使用 `git()` 函數。

   此外，您可以在 `git()` 後的區塊中指定以下參數：
    * `commit` – 使用儲存庫中的特定提交
    * `tag` – 使用儲存庫中的特定標籤
    * `branch` – 使用儲存庫中的特定分支

   `git()` 函數按照以下優先順序處理傳入的參數：`commit`、`tag`、`branch`。
   如果您未指定參數，Kotlin 外掛程式將使用 `master` 分支的 `HEAD`。

   > 您可以結合 `branch`、`commit` 和 `tag` 參數來獲取 Pod 的特定版本。
   >
   {style="note"}

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

3. 在 IntelliJ IDEA 中執行 **Build** | **Reload All Gradle Projects**（或在 Android Studio 中執行 **File** | **Sync Project with Gradle Files**）以重新匯入專案。

若要從 Kotlin 程式碼中使用這些相依性，請匯入 `cocoapods.<library-name>` 套件：

```kotlin
import cocoapods.SDWebImage.*
import cocoapods.JSONModel.*
import cocoapods.CocoaLumberjack.*
```

## 來自自訂 Podspec 儲存庫

若要新增對位於自訂 Podspec 儲存庫中的 Pod 函式庫的相依性：

1. 使用 `specRepos {}` 區塊內的 `url()` 呼叫指定自訂 Podspec 儲存庫的位址。
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

4. 在 IntelliJ IDEA 中執行 **Build** | **Reload All Gradle Projects**（或在 Android Studio 中執行 **File** | **Sync Project with Gradle Files**）以重新匯入專案。

> 若要在 Xcode 中工作，請在您的 Podfile 開頭指定 specs 的位置：
>
> ```ruby
> source 'https://github.com/Kotlin/kotlin-cocoapods-spec.git'
> ```
>
{style="note"}

若要從 Kotlin 程式碼中使用這些相依性，請匯入 `cocoapods.<library-name>` 套件：

```kotlin
import cocoapods.example.*
```

## 帶有自訂 cinterop 選項

若要使用自訂 cinterop 選項新增對 Pod 函式庫的相依性：

1. 在 `pod()` 函數中指定 Pod 函式庫的名稱。
2. 在配置區塊中，新增以下選項：

   * `extraOpts` – 指定 Pod 函式庫的選項列表。例如，`extraOpts = listOf("-compiler-option")`。
      
      > 如果您遇到 clang 模組相關問題，請也新增 `-fmodules` 選項。
      >
     {style="note"}

   * `packageName` – 直接使用套件名稱 `import <packageName>` 匯入函式庫。

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

4. 在 IntelliJ IDEA 中執行 **Build** | **Reload All Gradle Projects**（或在 Android Studio 中執行 **File** | **Sync Project with Gradle Files**）以重新匯入專案。

若要從 Kotlin 程式碼中使用這些相依性，請匯入 `cocoapods.<library-name>` 套件：
   
```kotlin
import cocoapods.FirebaseAuth.*
```
   
如果您使用 `packageName` 參數，則可以使用套件名稱 `import <packageName>` 匯入函式庫：
   
```kotlin
import FirebaseAuthWrapper.Auth
import FirebaseAuthWrapper.User
```

### 支援帶有 @import 指令的 Objective-C 標頭檔

> 此功能為[實驗性](supported-platforms.md#general-kotlin-stability-levels)。
> 它可能隨時被刪除或更改。僅用於評估目的。
> 我們很樂意在 [YouTrack](https://kotl.in/issue) 中收到您的回饋。
>
{style="warning"}

一些 Objective-C 函式庫，特別是那些作為 Swift 函式庫包裝器的函式庫，
在其標頭檔中包含 `@import` 指令。預設情況下，cinterop 不支援這些指令。

若要啟用對 `@import` 指令的支援，請在 `pod()` 函數的配置區塊中指定 `-fmodules` 選項：

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

### 在相依的 Pod 之間共享 Kotlin cinterop

如果您使用 `pod()` 函數新增了多個 Pod 相依性，當您的 Pod API 之間存在相依性時，您可能會遇到問題。

若要在這種情況下使程式碼編譯，請使用 `useInteropBindingFrom()` 函數。
它在為新 Pod 建立綁定時，會利用為另一個 Pod 生成的 cinterop 綁定。

您應該在設定相依性之前宣告相依的 Pod：

```kotlin
// pod("WebImage") 的 cinterop：
fun loadImage(): WebImage

// pod("Info") 的 cinterop：
fun printImageInfo(image: WebImage)

// 您的程式碼：
printImageInfo(loadImage())
```

如果您在這種情況下未配置 cinterop 之間正確的相依性，
程式碼將會無效，因為 `WebImage` 類型將來自不同的 cinterop 檔案，因此來自不同的套件。

## 接下來

* [設定 Kotlin 專案與 Xcode 專案之間的相依性](multiplatform-cocoapods-xcode.md)
* [查看完整的 CocoaPods Gradle 外掛程式 DSL 參考](multiplatform-cocoapods-dsl-reference.md)