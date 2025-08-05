[//]: # (title: 設定多平台程式庫發布)

您可以設定將多平台程式庫發布到不同位置：

*   [到本地 Maven 儲存庫](#publishing-to-a-local-maven-repository)
*   到 Maven Central 儲存庫。請參閱[我們的教學課程](multiplatform-publish-libraries.md)，了解如何設定帳戶憑證、自訂程式庫後設資料，以及配置發布外掛程式。
*   到 GitHub 儲存庫。如需更多資訊，請參閱 GitHub 上關於 [GitHub Packages](https://docs.github.com/en/packages) 的文件。

## 發布到本地 Maven 儲存庫

您可以使用 `maven-publish` Gradle 外掛程式將多平台程式庫發布到本地 Maven 儲存庫：

1.  在 `shared/build.gradle.kts` 檔案中，新增 [`maven-publish` Gradle 外掛程式](https://docs.gradle.org/current/userguide/publishing_maven.html)。
2.  指定程式庫的 `group` 和 `version`，以及應該發布程式庫的[儲存庫](https://docs.gradle.org/current/userguide/publishing_maven.html#publishing_maven:repositories)：

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

當與 `maven-publish` 搭配使用時，Kotlin 外掛程式會自動為可以在當前主機上建置的每個目標建立發布，除了 Android 目標之外，該目標需要[額外的配置步驟](#publish-an-android-library)才能發布。

## 發布結構

Kotlin Multiplatform 程式庫的發布包含多個 Maven 發布，每個都對應一個特定目標。此外，還會發布一個代表整個程式庫的總括性_根_發布 `kotlinMultiplatform`。

當作為[依賴項](multiplatform-add-dependencies.md)新增到共同原始碼集時，根發布會自動解析為適當的平台特定成品。

### 目標特定發布和根發布

Kotlin Multiplatform Gradle 外掛程式會為每個目標配置單獨的發布。
請考慮以下專案配置：

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

此設定會產生以下 Maven 發布：

**目標特定發布**

*   對於 `jvm` 目標：`test:lib-jvm:1.0`
*   對於 `iosX64` 目標：`test:lib-iosx64:1.0`
*   對於 `iosArm64` 目標：`test:lib-iosarm64:1.0`

每個目標特定發布都是獨立的。例如，執行 `publishJvmPublicationTo<MavenRepositoryName>` 只會發布 JVM 模組，而不會發布其他模組。

**根發布**

`kotlinMultiplatform` 根發布：`test:lib:1.0`。

根發布充當一個參考所有目標特定發布的入口點。
它包含後設資料成品，並透過包含對其他發布的引用（預期的 URL 和個別平台成品的座標）來確保正確的依賴項解析。

*   某些儲存庫，例如 Maven Central，要求根模組包含一個不帶分類器的 JAR 成品，例如 `kotlinMultiplatform-1.0.jar`。Kotlin Multiplatform 外掛程式會自動產生所需的成品以及內嵌的後設資料成品。這表示您無需在程式庫的根模組中新增空成品來滿足儲存庫的要求。

    > 透過 [Gradle](multiplatform-configure-compilations.md#compilation-for-jvm) 和 [Maven](https://kotlinlang.org/docs/maven.html#create-jar-file) 建置系統了解更多關於 JAR 成品產生的資訊。
    >
    {style="tip"}

*   如果儲存庫有要求，`kotlinMultiplatform` 發布可能還需要原始碼和文件成品。在這種情況下，請在發布的範圍內使用 [`artifact()`](https://docs.gradle.org/current/javadoc/org/gradle/api/publish/maven/MavenPublication.html#artifact-java.lang.Object-)。

### 發布完整的程式庫

要一步發布所有必要的成品，請使用 `publishAllPublicationsTo<MavenRepositoryName>` 總括任務。
例如：

```bash
./gradlew publishAllPublicationsToGithubPackagesRepository
```

發布到 Maven Local 時，您可以使用特殊任務：

```bash
./gradlew publishToMavenLocal
```

這些任務確保所有目標特定發布和根發布一同發布，使程式庫完全可用於依賴項解析。

或者，您可以使用單獨的發布任務。首先執行根發布：

```bash
./gradlew publishKotlinMultiplatformPublicationToMavenLocal
```

此任務會發布一個包含目標特定發布資訊的 `*.module` 檔案，但目標本身仍未發布。要完成此過程，請單獨發布每個目標特定發布：

```bash
./gradlew publish<TargetName>PublicationToMavenLocal
```

這保證了所有成品都可用並被正確引用。

## 主機要求

Kotlin/Native 支援交叉編譯，允許任何主機產生必要的 `.klib` 成品。
但是，您仍應記住一些特定事項。

### Apple 目標的編譯
<secondary-label ref="Experimental"/>

要為帶有 Apple 目標的專案產生成品，您通常需要一台 Apple 機器。
但是，如果您想使用其他主機，請在 `gradle.properties` 檔案中設定此選項：

```none
kotlin.native.enableKlibsCrossCompilation=true
```

交叉編譯目前仍為實驗性功能，並有一些限制。在以下情況下，您仍然需要使用 Mac 機器：

*   您的程式庫有 [cinterop 依賴項](https://kotlinlang.org/docs/native-c-interop.html)。
*   您已在專案中設定 [CocoaPods 整合](multiplatform-cocoapods-overview.md)。
*   您需要為 Apple 目標建置或測試[最終二進位檔](multiplatform-build-native-binaries.md)。

### 重複發布

為避免發布期間出現任何問題，請從單一主機發布所有成品，以避免在儲存庫中重複發布。例如，Maven Central 明確禁止重複發布並會導致流程失敗。
<!-- TBD: add the actual error -->

## 發布 Android 程式庫

要發布 Android 程式庫，您需要提供額外的配置。

預設情況下，Android 程式庫不會發布任何成品。要發布由一組 Android [建置變數](https://developer.android.com/build/build-variants)產生的成品，請在 `shared/build.gradle.kts` 檔案中的 Android 目標區塊中指定變數名稱：

```kotlin
kotlin {
    androidTarget {
        publishLibraryVariants("release")
    }
}
```

此範例適用於沒有[產品口味](https://developer.android.com/build/build-variants#product-flavors)的 Android 程式庫。
對於帶有產品口味的程式庫，變數名稱也包含口味，例如 `fooBarDebug` 或 `fooBarRelease`。

預設發布設定如下：
*   如果發布的變數具有相同的建置類型（例如，它們都為 `release` 或 `debug`），它們將與任何消費者建置類型相容。
*   如果發布的變數具有不同的建置類型，則只有 release 變數將與不在已發布變數中的消費者建置類型相容。所有其他變數（例如 `debug`）將只匹配消費者端相同的建置類型，除非消費者專案指定了[相符備用方案](https://developer.android.com/reference/tools/gradle-api/4.2/com/android/build/api/dsl/BuildType)。

如果您希望使每個已發布的 Android 變數僅與程式庫消費者使用的相同建置類型相容，請設定此 Gradle 屬性：`kotlin.android.buildTypeAttribute.keep=true`。

您還可以按產品口味分組發布變數，以便不同建置類型的輸出放置在單一模組中，建置類型成為成品的分類器（release 建置類型仍以無分類器發布）。此模式預設為禁用，可以如下在 `shared/build.gradle.kts` 檔案中啟用：

```kotlin
kotlin {
    androidTarget {
        publishLibraryVariantsGroupedByFlavor = true
    }
}
```

> 如果已發布的變數按產品口味分組且具有不同的依賴項，不建議您這樣做，因為它們將合併到一個依賴項列表中。
>
{style="note"}

## 禁用原始碼發布

預設情況下，Kotlin Multiplatform Gradle 外掛程式會為所有指定目標發布原始碼。但是，您可以使用 `shared/build.gradle.kts` 檔案中的 `withSourcesJar()` API 配置和禁用原始碼發布：

*   要禁用所有目標的原始碼發布：

    ```kotlin
    kotlin {
        withSourcesJar(publish = false)

        jvm()
        linuxX64()
    }
    ```

*   要僅禁用指定目標的原始碼發布：

    ```kotlin
    kotlin {
         // Disable sources publication only for JVM:
        jvm {
            withSourcesJar(publish = false)
        }
        linuxX64()
    }
    ```

*   要禁用所有目標的原始碼發布，除了指定目標：

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

## 禁用 JVM 環境屬性發布

從 Kotlin 2.0.0 開始，Gradle 屬性 [`org.gradle.jvm.environment`](https://docs.gradle.org/current/userguide/variant_attributes.html#sub:jvm_default_attributes) 會自動隨所有 Kotlin 變數發布，以幫助區分 Kotlin Multiplatform 程式庫的 JVM 和 Android 變數。該屬性指示哪個程式庫變數適用於哪個 JVM 環境，Gradle 使用此資訊幫助您專案中的依賴項解析。目標環境可以是 "android"、"standard-jvm" 或 "no-jvm"。

您可以透過將以下 Gradle 屬性新增到 `gradle.properties` 檔案中來禁用此屬性的發布：

```none
kotlin.publishJvmEnvironmentAttribute=false
```

## 推廣您的程式庫

您的程式庫可以在 [JetBrains 的搜尋平台](https://klibs.io/)上獲得推薦。
它旨在讓您根據目標平台輕鬆尋找 Kotlin Multiplatform 程式庫。

符合條件的程式庫會自動新增。有關如何新增程式庫的更多資訊，請參閱 [FAQ](https://klibs.io/faq)。

## 後續步驟

*   [了解如何將您的 Kotlin Multiplatform 程式庫發布到 Maven Central 儲存庫](multiplatform-publish-libraries.md)
*   [查閱程式庫作者指南，了解設計 Kotlin Multiplatform 程式庫的最佳實踐和提示](https://kotlinlang.org/docs/api-guidelines-build-for-multiplatform.html)