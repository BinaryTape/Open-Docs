[//]: # (title: 設定多平台函式庫發佈)

您可以將多平台函式庫的發佈設定到不同的位置：

*   [到本地 Maven 儲存庫](#publishing-to-a-local-maven-repository)
*   到 Maven Central 儲存庫。了解如何在[我們的教學](multiplatform-publish-libraries.md)中設定帳戶憑證、自訂函式庫中繼資料，以及配置發佈外掛程式。
*   到 GitHub 儲存庫。更多資訊，請參閱 GitHub 上關於 [GitHub packages](https://docs.github.com/en/packages) 的文件。

## 發佈到本地 Maven 儲存庫

您可以使用 `maven-publish` Gradle 外掛程式將多平台函式庫發佈到本地 Maven 儲存庫：

1.  在 `shared/build.gradle.kts` 檔案中，加入 [`maven-publish` Gradle 外掛程式](https://docs.gradle.org/current/userguide/publishing_maven.html)。
2.  為函式庫指定 group 和 version，以及應發佈到的[儲存庫](https://docs.gradle.org/current/userguide/publishing_maven.html#publishing_maven:repositories)：

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

當與 `maven-publish` 結合使用時，Kotlin 外掛程式會自動為當前主機上可以建置的每個目標建立發佈，Android 目標除外，它需要[額外的步驟來配置發佈](#publish-an-android-library)。

## 發佈的結構

Kotlin 多平台函式庫的發佈包含多個 Maven 發佈，每個發佈都對應一個特定的目標。此外，還會發佈一個代表整個函式庫的總括性_根_發佈，即 `kotlinMultiplatform`。

當作為[依賴項](multiplatform-add-dependencies.md)添加到通用原始碼集時，根發佈會自動解析為適當的平台特定產物。

### 目標特定發佈與根發佈

Kotlin 多平台 Gradle 外掛程式為每個目標配置單獨的發佈。考慮以下專案配置：

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

*   對於 `jvm` 目標：`test:lib-jvm:1.0`
*   對於 `iosX64` 目標：`test:lib-iosx64:1.0`
*   對於 `iosArm64` 目標：`test:lib-iosarm64:1.0`

每個目標特定發佈都是獨立的。例如，執行 `publishJvmPublicationTo<MavenRepositoryName>` 只會發佈 JVM 模組，而其他模組則未發佈。

**根發佈**

`kotlinMultiplatform` 根發佈：`test:lib:1.0`。

根發佈作為一個入口點，引用所有目標特定的發佈。它包含中繼資料產物，並透過包含對其他發佈的引用來確保正確的依賴解析：個別平台產物的預期 URL 和座標。

*   某些儲存庫，例如 Maven Central，要求根模組包含一個沒有分類器（classifier）的 JAR 產物，例如 `kotlinMultiplatform-1.0.jar`。Kotlin 多平台外掛程式會自動產生所需的產物，其中包含嵌入式中繼資料產物。這表示您無需在函式庫的根模組中添加一個空的產物來滿足儲存庫的要求。

    > 透過 [Gradle](multiplatform-configure-compilations.md#compilation-for-jvm) 和 [Maven](https://kotlinlang.org/docs/maven.html#create-jar-file) 建置系統了解更多關於 JAR 產物生成。
    >
    {style="tip"}

*   如果儲存庫有要求，`kotlinMultiplatform` 發佈可能還需要原始碼和文件產物。在這種情況下，請在發佈範圍內使用 [`artifact()`](https://docs.gradle.org/current/javadoc/org/gradle/api/publish/maven/MavenPublication.html#artifact-java.lang.Object-)。

### 發佈完整的函式庫

要一步到位發佈所有必要的產物，請使用 `publishAllPublicationsTo<MavenRepositoryName>` 總括任務。例如：

```bash
./gradlew publishAllPublicationsToGithubPackagesRepository
```

發佈到 Maven Local 時，您可以使用一個特殊任務：

```bash
./gradlew publishToMavenLocal
```

這些任務確保所有目標特定和根發佈都被一同發佈，使函式庫完全可供依賴解析。

或者，您可以使用單獨的發佈任務。首先執行根發佈：

```bash
./gradlew publishKotlinMultiplatformPublicationToMavenLocal
```

此任務發佈一個 `*.module` 檔案，其中包含目標特定發佈的資訊，但目標本身仍未發佈。要完成此過程，請單獨發佈每個目標特定發佈：

```bash
./gradlew publish<TargetName>PublicationToMavenLocal
```

這保證所有產物都可用並正確引用。

## 主機要求

Kotlin/Native 支援交叉編譯，允許任何主機生成必要的 `.klib` 產物。然而，您仍需注意一些限制。

**編譯 Apple 目標**

您可以使用任何主機為包含 Apple 目標的專案生成產物。然而，如果您仍需要使用 Mac 機器，則需符合以下情況：

*   您的函式庫或依賴模組具有 [cinterop 依賴項](https://kotlinlang.org/docs/native-c-interop.html)。
*   您在專案中設定了 [CocoaPods 整合](multiplatform-cocoapods-overview.md)。
*   您需要為 Apple 目標建置或測試[最終二進位檔](multiplatform-build-native-binaries.md)。

**重複發佈**

為避免發佈過程中出現任何問題，請從單一主機發佈所有產物，以避免儲存庫中出現重複的發佈。例如，Maven Central 明確禁止重複發佈，並會導致該過程失敗。

## 發佈 Android 函式庫

要發佈 Android 函式庫，您需要提供額外的配置。

預設情況下，Android 函式庫不發佈任何產物。要發佈由一組 Android [建置變體](https://developer.android.com/build/build-variants)產生的產物，請在 `shared/build.gradle.kts` 檔案的 Android 目標區塊中指定變體名稱：

```kotlin
kotlin {
    androidTarget {
        publishLibraryVariants("release")
    }
}
```

此範例適用於沒有[產品特色](https://developer.android.com/build/build-variants#product-flavors)的 Android 函式庫。對於具有產品特色的函式庫，變體名稱也包含特色，例如 `fooBarDebug` 或 `fooBarRelease`。

預設的發佈設定如下：
*   如果已發佈的變體具有相同的建置類型（例如，它們都是 `release` 或 `debug`），它們將與任何消費者建置類型相容。
*   如果已發佈的變體具有不同的建置類型，則只有 `release` 變體將與不屬於已發佈變體的消費者建置類型相容。所有其他變體（例如 `debug`）將僅在消費者端匹配相同的建置類型，除非消費者專案指定了[匹配回退](https://developer.android.com/reference/tools/gradle-api/4.2/com/android/build/api/dsl/BuildType)。

如果您希望使每個已發佈的 Android 變體僅與函式庫消費者使用的相同建置類型相容，請設定此 Gradle 屬性：`kotlin.android.buildTypeAttribute.keep=true`。

您還可以按產品特色對變體進行分組發佈，以便不同建置類型的輸出放置在單個模組中，其中建置類型成為產物的分類器（`release` 建置類型仍以無分類器方式發佈）。此模式預設為禁用，可以在 `shared/build.gradle.kts` 檔案中啟用，如下所示：

```kotlin
kotlin {
    androidTarget {
        publishLibraryVariantsGroupedByFlavor = true
    }
}
```

> 不建議您按產品特色對變體進行分組發佈，以防它們具有不同的依賴項，因為這些依賴項將合併到一個依賴項列表中。
>
{style="note"}

## 禁用原始碼發佈

預設情況下，Kotlin 多平台 Gradle 外掛程式會為所有指定目標發佈原始碼。然而，您可以在 `shared/build.gradle.kts` 檔案中透過 `withSourcesJar()` API 配置和禁用原始碼發佈：

*   要禁用所有目標的原始碼發佈：

    ```kotlin
    kotlin {
        withSourcesJar(publish = false)

        jvm()
        linuxX64()
    }
    ```

*   僅禁用指定目標的原始碼發佈：

    ```kotlin
    kotlin {
         // Disable sources publication only for JVM:
        jvm {
            withSourcesJar(publish = false)
        }
        linuxX64()
    }
    ```

*   禁用除指定目標外的所有目標的原始碼發佈：

    ```kotlin
    kotlin {
        // Disable sources publication for all targets except for JVM:
        withSourcesJar(publish = false)

        jvm {
            withSourcesJar(publish = true)
        }
        linuxX64()
    }
  ```

## 禁用 JVM 環境屬性發佈

從 Kotlin 2.0.0 開始，Gradle 屬性 [`org.gradle.jvm.environment`](https://docs.gradle.org/current/userguide/variant_attributes.html#sub:jvm_default_attributes) 會隨所有 Kotlin 變體自動發佈，以幫助區分 Kotlin 多平台函式庫的 JVM 和 Android 變體。此屬性指示哪個函式庫變體適合哪個 JVM 環境，Gradle 使用此資訊協助您專案中的依賴解析。目標環境可以是 "android"、"standard-jvm" 或 "no-jvm"。

您可以透過在 `gradle.properties` 檔案中添加以下 Gradle 屬性來禁用此屬性的發佈：

```none
kotlin.publishJvmEnvironmentAttribute=false
```

## 推廣您的函式庫

您的函式庫可以在 [JetBrains 的搜尋平台](https://klibs.io/)上展示。它旨在讓您根據目標平台輕鬆查找 Kotlin 多平台函式庫。

符合條件的函式庫會自動添加。有關如何添加函式庫的更多資訊，請參閱 [常見問題](https://klibs.io/faq)。

## 接下來

*   [了解如何將您的 Kotlin 多平台函式庫發佈到 Maven Central 儲存庫](multiplatform-publish-libraries.md)
*   [查看函式庫作者指南，了解設計 Kotlin 多平台函式庫的最佳實踐和技巧](https://kotlinlang.org/docs/api-guidelines-build-for-multiplatform.html)