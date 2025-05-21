---
title: 設定多平台函式庫發佈
---
你可以設定將你的多平台函式庫發佈到不同的位置：

*   [發佈到本地 Maven 儲存庫](#publishing-to-a-local-maven-repository)
*   發佈到 Maven Central 儲存庫。請在[我們的教學](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-libraries.html)中學習如何設定帳戶憑證、自訂函式庫元資料，以及配置發佈外掛程式（plugin）。
*   發佈到 GitHub 儲存庫。有關更多資訊，請參閱 GitHub 關於 [GitHub packages](https://docs.github.com/en/packages) 的文件。

## 發佈到本地 Maven 儲存庫

你可以使用 `maven-publish` Gradle 外掛程式（plugin）將多平台函式庫發佈到本地 Maven 儲存庫：

1.  在 `shared/build.gradle.kts` 檔案中，新增 [`maven-publish` Gradle 外掛程式](https://docs.gradle.org/current/userguide/publishing_maven.html)。
2.  指定函式庫的群組（group）和版本（version），以及應該發佈到的[儲存庫](https://docs.gradle.org/current/userguide/publishing_maven.html#publishing_maven:repositories)：

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

當與 `maven-publish` 搭配使用時，Kotlin 外掛程式會自動為可在目前主機上建置的每個目標建立發佈（publication），但 Android 目標除外，後者需要[額外的步驟來配置發佈](#publish-an-android-library)。

## 發佈結構

多平台函式庫的發佈包括一個額外的 _root_ 發佈 `kotlinMultiplatform`，它代表整個函式庫，並且在作為依賴項新增到 common source set 時，會自動解析為適當的平台特定成品（artifact）。 了解更多關於[新增依賴項](multiplatform-add-dependencies)的資訊。

此 `kotlinMultiplatform` 發佈包含元資料成品，並將其他發佈作為其變體（variant）引用。

:::note
某些儲存庫（例如 Maven Central）要求 root 模組包含一個沒有分類符（classifier）的 JAR 成品，例如 `kotlinMultiplatform-1.0.jar`。
Kotlin Multiplatform 外掛程式會自動產生具有嵌入式元資料成品的所需成品。
這表示你不需要透過將空成品新增到函式庫的 root 模組來自訂你的建置，以符合儲存庫的要求。

:::

如果儲存庫需要，`kotlinMultiplatform` 發佈也可能需要原始碼和文件成品。 在這種情況下，請使用發佈範圍中的 [`artifact(...)`](https://docs.gradle.org/current/javadoc/org/gradle/api/publish/maven/MavenPublication.html#artifact-java.lang.Object-) 新增這些成品。

## 主機要求

Kotlin/Native 支援交叉編譯，允許任何主機產生必要的 `.klib` 成品。
但是，你仍然應該記住一些具體細節。

### 編譯 Apple 目標

要為具有 Apple 目標的專案產生成品，你通常需要一台 Apple 機器。
但是，如果你想使用其他主機，請在你的 `gradle.properties` 檔案中設定此選項：

```none
kotlin.native.enableKlibsCrossCompilation=true
```

交叉編譯目前處於實驗階段，並且有一些限制。 如果出現以下情況，你仍然需要使用 Mac 機器：

*   你的函式庫具有 [cinterop 依賴項](native-c-interop)。
*   你的專案中設定了 [CocoaPods 整合](native-cocoapods)。
*   你需要為 Apple 目標建置或測試 [最終二進位檔](multiplatform-build-native-binaries)。

### 重複發佈

為了避免在發佈期間出現任何問題，請從單一主機發佈所有成品，以避免在儲存庫中重複發佈。 例如，Maven Central 明確禁止重複發佈，並會導致流程失敗。
<!-- TBD: add the actual error -->

## 發佈 Android 函式庫

要發佈 Android 函式庫，你需要提供額外的配置。

預設情況下，不會發佈 Android 函式庫的任何成品。 要發佈由一組 Android [建置變體](https://developer.android.com/build/build-variants) 產生的成品，請在 `shared/build.gradle.kts` 檔案的 Android 目標區塊中指定變體名稱：

```kotlin
kotlin {
    androidTarget {
        publishLibraryVariants("release")
    }
}

```

此範例適用於沒有 [product flavors](https://developer.android.com/build/build-variants#product-flavors) 的 Android 函式庫。
對於具有 product flavors 的函式庫，變體名稱也包含 flavor，例如 `fooBarDebug` 或 `fooBarRelease`。

預設發佈設定如下：

*   如果已發佈的變體具有相同的建置類型（例如，它們都是 `release` 或 `debug`），則它們將與任何消費者建置類型相容。
*   如果已發佈的變體具有不同的建置類型，則只有 release 變體將與不屬於已發佈變體的消費者建置類型相容。 所有其他變體（例如 `debug`）將僅與消費者端的相同建置類型匹配，除非消費者專案指定[匹配回退](https://developer.android.com/reference/tools/gradle-api/4.2/com/android/build/api/dsl/BuildType)。

如果你希望每個已發佈的 Android 變體僅與函式庫消費者使用的相同建置類型相容，請設定此 Gradle 屬性：`kotlin.android.buildTypeAttribute.keep=true`。

你也可以按 product flavor 對變體進行分組發佈，以便將不同建置類型的輸出放置在單一模組中，並使建置類型成為成品的分類符（release 建置類型仍然在沒有分類符的情況下發佈）。 預設情況下，此模式已停用，並且可以在 `shared/build.gradle.kts` 檔案中如下啟用：

```kotlin
kotlin {
    androidTarget {
        publishLibraryVariantsGroupedByFlavor = true
    }
}
```

:::note
如果按 product flavor 分組發佈的變體具有不同的依賴項，則不建議這樣做，因為這些依賴項將合併到一個依賴項清單中。

:::

## 停用原始碼發佈

預設情況下，Kotlin Multiplatform Gradle 外掛程式會發佈所有指定目標的原始碼。 但是，你可以使用 `shared/build.gradle.kts` 檔案中的 `withSourcesJar()` API 配置和停用原始碼發佈：

*   要停用所有目標的原始碼發佈：

    ```kotlin
    kotlin {
        withSourcesJar(publish = false)

        jvm()
        linuxX64()
    }
    ```

*   僅停用指定目標的原始碼發佈：

    ```kotlin
    kotlin {
         // 僅停用 JVM 的原始碼發佈：
        jvm {
            withSourcesJar(publish = false)
        }
        linuxX64()
    }
    ```

*   停用除指定目標之外的所有目標的原始碼發佈：

    ```kotlin
    kotlin {
        // 停用除 JVM 之外的所有目標的原始碼發佈：
        withSourcesJar(publish = false)

        jvm {
            withSourcesJar(publish = true)
        }
        linuxX64()
    }
    ```

## 停用 JVM 環境屬性發佈

從 Kotlin 2.0.0 開始，Gradle 屬性 [`org.gradle.jvm.environment`](https://docs.gradle.org/current/userguide/variant_attributes.html#sub:jvm_default_attributes) 會自動與所有 Kotlin 變體一起發佈，以幫助區分 Kotlin Multiplatform 函式庫的 JVM 和 Android 變體。 該屬性指示哪個函式庫變體適合哪個 JVM 環境，Gradle 使用此資訊來幫助你的專案中的依賴項解析。 目標環境可以是 "android"、"standard-jvm" 或 "no-jvm"。

你可以透過將以下 Gradle 屬性新增到你的 `gradle.properties` 檔案來停用此屬性的發佈：

```none
kotlin.publishJvmEnvironmentAttribute=false
```

## 推廣你的函式庫

你的函式庫可以在 [JetBrains 的搜尋平台](https://klibs.io/) 上展示。
它的設計目的是讓你輕鬆地根據目標平台尋找 Kotlin Multiplatform 函式庫。

符合條件的函式庫會自動新增。 有關如何新增你的函式庫的更多資訊，請參閱 [FAQ](https://klibs.io/faq)。

## 接下來

*   [了解如何將你的 Kotlin Multiplatform 函式庫發佈到 Maven Central 儲存庫](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-libraries.html)
*   [請參閱函式庫作者指南，了解有關為 Kotlin Multiplatform 設計函式庫的最佳實務和提示](api-guidelines-build-for-multiplatform)