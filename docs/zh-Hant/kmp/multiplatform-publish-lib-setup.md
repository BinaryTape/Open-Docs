[//]: # (title: 設定多平台程式庫發佈)

您可以將多平台程式庫的發佈設定至不同位置：

* [到本機 Maven 存儲庫](#publishing-to-a-local-maven-repository)
* 到 Maven Central 存儲庫。在[我們的教學](multiplatform-publish-libraries.md)中了解如何設定帳戶憑據、自訂程式庫元資料以及設定發佈外掛程式。
* 到 GitHub 存儲庫。如需更多資訊，請參閱 GitHub 關於 [GitHub Packages](https://docs.github.com/en/packages) 的文件。

## 發佈至本機 Maven 存儲庫

您可以使用 `maven-publish` Gradle 外掛程式將多平台程式庫發佈到本機 Maven 存儲庫：

1. 在 `shared/build.gradle.kts` 檔案中，新增 [`maven-publish` Gradle 外掛程式](https://docs.gradle.org/current/userguide/publishing_maven.html)。
2. 為程式庫指定群組 (group) 與版本 (version)，以及應該發佈到的 [存儲庫](https://docs.gradle.org/current/userguide/publishing_maven.html#publishing_maven:repositories)：

   ```kotlin
   plugins {
       // ...
       id("maven-publish")
   }

   group = "com.example"
   version = "1.0"

   publishing {
       repositories {
           maven {
               //...
           }
       }
   }
   ```

當與 `maven-publish` 搭配使用時，Kotlin 外掛程式會自動為每個可在目前主機上建置的目標建立發佈，但 Android 目標除外，它需要[額外的步驟來配置發佈](#publish-an-android-library)。

## 發佈結構

Kotlin 多平台程式庫的發佈包含多個 Maven 發佈，每個發佈對應一個特定目標。此外，還會發佈一個代表整個程式庫的統整式 _根_ 發佈：`kotlinMultiplatform`。

當作為[相依性](multiplatform-add-dependencies.md)新增至共通原始碼集時，根發佈會自動解析為適當的平台特定構件。

### 目標特定與根發佈

Kotlin 多平台 Gradle 外掛程式會為每個目標配置單獨的發佈。考慮以下專案配置：

```kotlin
// projectName = "lib"
group = "test"
version = "1.0"

kotlin {
    jvm()
    iosX64()
    iosArm64()
}
```

此設定會產生以下 Maven 發佈：

**目標特定發佈**

* 對於 `jvm` 目標：`test:lib-jvm:1.0`
* 對於 `iosX64` 目標：`test:lib-iosx64:1.0`
* 對於 `iosArm64` 目標：`test:lib-iosarm64:1.0`

每個目標特定的發佈都是獨立的。例如，執行 `publishJvmPublicationTo<MavenRepositoryName>` 僅發佈 JVM 模組，其他模組則保持未發佈狀態。

**根發佈**

`kotlinMultiplatform` 根發佈：`test:lib:1.0`。

根發佈作為引用所有目標特定發佈的入口點。它包含元資料構件，並透過包含對其他發佈的引用（個別平台構件的預期 URL 與座標）來確保正確的相依性解析。

* 某些存儲庫（例如 Maven Central）要求根模組包含一個不帶分類器的 JAR 構件，例如 `kotlinMultiplatform-1.0.jar`。Kotlin 多平台外掛程式會自動產生帶有內嵌元資料構件的必要構件。這意味著您不必在程式庫的根模組中新增空白構件來滿足存儲庫的要求。

  > 進一步了解使用 [Gradle](multiplatform-configure-compilations.md#compilation-for-jvm) 和 [Maven](https://kotlinlang.org/docs/maven.html#create-jar-file) 建置系統產生 JAR 構件的資訊。
  >
  {style="tip"}

* 如果存儲庫要求，`kotlinMultiplatform` 發佈可能還需要原始碼與文件構件。在這種情況下，請在發佈的作用域中使用 [`artifact()`](https://docs.gradle.org/current/javadoc/org/gradle/api/publish/maven/MavenPublication.html#artifact-java.lang.Object-)。

### 發佈完整的程式庫

若要一個步驟發佈所有必要的構件，請使用 `publishAllPublicationsTo<MavenRepositoryName>` 統整任務。例如：

```bash
./gradlew publishAllPublicationsToGithubPackagesRepository
```

發佈到 Maven Local 時，可以使用特殊任務：

```bash
./gradlew publishToMavenLocal
```

這些任務可確保所有目標特定發佈與根發佈一起發佈，使程式庫完全可用於相依性解析。

或者，您可以使用單獨的發佈任務。先執行根發佈：

```bash
./gradlew publishKotlinMultiplatformPublicationToMavenLocal
```

此任務會發佈一個包含目標特定發佈資訊的 `*.module` 檔案，但目標本身仍未發佈。若要完成此程序，請分別發佈每個目標特定的發佈：

```bash
./gradlew publish<TargetName>PublicationToMavenLocal
```

這保證了所有構件皆可用且被正確引用。

## 主機需求

Kotlin/Native 支援交叉編譯，允許任何主機產生必要的 `.klib` 構件。然而，仍有一些限制需要注意。

### Apple 目標的編譯

您可以使用任何主機為具有 Apple 目標的專案產生構件。然而，在以下情況下您仍需使用 Mac 電腦：

* 您的程式庫或相依模組具有 [cinterop 相依性](https://kotlinlang.org/docs/native-c-interop.html)。
* 您的專案中設定了 [CocoaPods 整合](multiplatform-cocoapods-overview.md)。
* 您需要為 Apple 目標建置或測試 [最終二進位檔](multiplatform-build-native-binaries.md)。

### 重複發佈

為了避免在存儲庫中重複發佈，請從單一主機發佈所有構件。例如，Maven Central 明確禁止重複發佈，如果建立重複發佈，程序將會失敗。

## 發佈 Android 程式庫

要發佈 Android 程式庫，您需要提供額外的配置。預設情況下，Android 程式庫不會發佈任何構件。

> 本節假設您正在使用 Android Gradle Library 外掛程式。關於設定外掛程式或從舊版 `com.android.library` 外掛程式遷移的指南，請參閱 Android 文件中的 [設定 Android Gradle Library 外掛程式](https://developer.android.com/kotlin/multiplatform/plugin#migrate) 頁面。
> 
{style="note"}

若要發佈構件，請將 `androidLibrary {}` 區塊新增至 `shared/build.gradle.kts` 檔案，並使用 KMP DSL 配置發佈。例如：

```kotlin
kotlin {
    androidLibrary {
        namespace = "org.example.library"
        compileSdk = libs.versions.android.compileSdk.get().toInt()
        minSdk = libs.versions.android.minSdk.get().toInt()

        // 啟用 Java 編譯支援。
        // 當不需要 Java 編譯時，這可以縮短建置時間
        withJava()

        compilations.configureEach {
            compilerOptions.configure {
                jvmTarget.set(
                    JvmTarget.JVM_11
                )
            }
        }
    }
}
```

請注意，Android Gradle Library 外掛程式不支援產品變體 (product flavors) 與組建變體 (build variants)，進而簡化了配置。因此，您需要選擇加入以建立測試原始碼集與配置。例如：

```kotlin
kotlin {
    androidLibrary {
        // ...

        // 選擇加入以啟用並配置主機端（單元）測試
        withHostTestBuilder {}.configure {}

        // 選擇加入以啟用裝置測試，並指定原始碼集名稱
        withDeviceTestBuilder {
            sourceSetTreeName = "test"
        }

        // ...
    }
}
```

以前，使用 GitHub Action 執行測試時，需要分別指定 debug 和 release 變體：

```yaml
- target: testDebugUnitTest
  os: ubuntu-latest
- target: testReleaseUnitTest
  os: ubuntu-latest
```

使用 Android Gradle Library 外掛程式，您只需要指定帶有原始碼集名稱的一般目標：

```yaml
- target: testAndroidHostTest
  os: ubuntu-latest
```

## 停用原始碼發佈

預設情況下，Kotlin 多平台 Gradle 外掛程式會為所有指定的目標發佈原始碼。但是，您可以在 `shared/build.gradle.kts` 檔案中使用 `withSourcesJar()` API 來配置並停用原始碼發佈：

* 停用所有目標的原始碼發佈：

  ```kotlin
  kotlin {
      withSourcesJar(publish = false)

      jvm()
      linuxX64()
  }
  ```

* 僅停用指定目標的原始碼發佈：

  ```kotlin
  kotlin {
       // 僅停用 JVM 的原始碼發佈：
      jvm {
          withSourcesJar(publish = false)
      }
      linuxX64()
  }
  ```

* 停用除指定目標以外所有目標的原始碼發佈：

  ```kotlin
  kotlin {
      // 停用除 JVM 以外所有目標的原始碼發佈：
      withSourcesJar(publish = false)

      jvm {
          withSourcesJar(publish = true)
      }
      linuxX64()
  }
  ```

## 推廣您的程式庫

您的程式庫可以在 [JetBrains 的多平台程式庫目錄](https://klibs.io/)中展示。它旨在讓使用者輕鬆地根據目標平台尋找 Kotlin 多平台程式庫。

符合條件的程式庫會被自動新增。有關如何確保您的程式庫出現在目錄中的更多資訊，請參閱 [常見問題](https://klibs.io/faq)。

## 下一步

* [了解如何將您的 Kotlin 多平台程式庫發佈到 Maven Central 存儲庫](multiplatform-publish-libraries.md)
* [參閱程式庫作者指南，了解為 Kotlin 多平台設計程式庫的最佳實務與技巧](https://kotlinlang.org/docs/api-guidelines-build-for-multiplatform.html)