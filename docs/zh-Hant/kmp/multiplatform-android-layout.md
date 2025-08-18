[//]: # (title: Android 原始碼集佈局)

新的 Android 原始碼集佈局已在 Kotlin 1.8.0 中引入，並於 1.9.0 中成為預設設定。請遵循本指南，以了解已棄用佈局和新佈局之間的關鍵差異，以及如何遷移您的專案。

> 您無需實作所有建議，只需實作適用於您特定專案的建議即可。
>
{style="tip"}

## 檢查相容性

新的佈局需要 Android Gradle 外掛程式 7.0 或更高版本，並支援 Android Studio 2022.3 及更高版本。請檢查您的 Android Gradle 外掛程式版本，並在必要時升級。

## 重新命名 Kotlin 原始碼集

如果適用，請依照此模式重新命名您專案中的原始碼集：

| 舊版原始碼集佈局             | 新版原始碼集佈局              |
|----------------------------------------|-------------------------------------|
| `targetName` + `AndroidSourceSet.name` | `targetName` + `AndroidVariantType` |

`{AndroidSourceSet.name}` 對應到 `{KotlinSourceSet.name}` 如下：

|             | 舊版原始碼集佈局             | 新版原始碼集佈局               |
|-------------|----------------------------|--------------------------------|
| main        | androidMain                | androidMain                    |
| test        | androidTest                | android<b>Unit</b>Test         |
| androidTest | android<b>Android</b>Test  | android<b>Instrumented</b>Test |

## 移動原始碼檔案

如果適用，請依照此模式將您的原始碼檔案移動到新的目錄：

| 舊版原始碼集佈局                             | 新版原始碼集佈局              |
|-------------------------------------------------------|-------------------------------------|
| 該佈局有額外的 `/kotlin` SourceDirectories | `src/{KotlinSourceSet.name}/kotlin` |

`{AndroidSourceSet.name}` 對應到 `{包含的原始碼目錄}` 如下：

|             | 舊版原始碼集佈局                                               | 新版原始碼集佈局                                                                                  |
|-------------|---------------------------------------------------------------|---------------------------------------------------------------------------------------------------|
| main        | src/androidMain/kotlin<br/>src/main/kotlin<br/>src/main/java  | src/androidMain/kotlin<br/>src/main/kotlin<br/>src/main/java                                      |
| test        | src/androidTest/kotlin<br/>src/test/kotlin<br/>src/test/java  | src/android<b>Unit</b>Test/kotlin<br/>src/test/kotlin<br/>src/test/java                           |
| androidTest | src/android<b>Android</b>Test/kotlin<br/>src/androidTest/java | src/android<b>Instrumented</b>Test/kotlin<br/>src/androidTest/java, <b>src/androidTest/kotlin</b> |

## 移動 AndroidManifest.xml 檔案

如果您的專案中有 `AndroidManifest.xml` 檔案，請依照此模式將其移動到新的目錄：

| 舊版原始碼集佈局                                | 新版原始碼集佈局                                    |
|--------------------------------------------------------|-------------------------------------------------------|
| src/{<b>Android</b>SourceSet.name}/AndroidManifest.xml | src/{<b>Kotlin</b>SourceSet.name}/AndroidManifest.xml |

`{AndroidSourceSet.name}` 對應到 `{AndroidManifest.xml 位置}` 如下：

|       | 舊版原始碼集佈局                | 新版原始碼集佈局                          |
|-------|-------------------------------|---------------------------------------------|
| main  | src/main/AndroidManifest.xml  | src/<b>android</b>Main/AndroidManifest.xml  |
| debug | src/debug/AndroidManifest.xml | src/<b>android</b>Debug/AndroidManifest.xml |

## 檢查 Android 與通用測試之間的關聯

新的 Android 原始碼集佈局變更了 Android 儀器化測試（在新佈局中已重新命名為 `androidInstrumentedTest`）與通用測試之間的關聯。

以前，`androidAndroidTest` 與 `commonTest` 之間的 `dependsOn` 關聯是預設的。這表示：

*   `commonTest` 中的程式碼可在 `androidAndroidTest` 中使用。
*   `commonTest` 中的 `expect` 宣告必須在 `androidAndroidTest` 中有對應的 `actual` 實作。
*   在 `commonTest` 中宣告的測試也作為 Android 儀器化測試執行。

在新的 Android 原始碼集佈局中，`dependsOn` 關聯預設不自動新增。如果您偏好先前的行為，請在您的 `build.gradle.kts` 檔案中手動宣告以下關聯：

```kotlin
kotlin {
// ...
    sourceSets {
        val commonTest by getting
        val androidInstrumentedTest by getting {
            dependsOn(commonTest)
        }
    }
}
```

## 調整 Android 變體的實作

以前，Kotlin Gradle 外掛程式會積極地建立對應於包含 `debug` 和 `release` 建置類型或自訂變體（例如 `demo` 和 `full`）的 Android 原始碼集。這使得原始碼集可以透過使用 `val androidDebug by getting { ... }` 這樣的表達式來存取。

新的 Android 原始碼集佈局利用 Android 的 [`onVariants`](https://developer.android.com/reference/tools/gradle-api/8.0/com/android/build/api/variant/AndroidComponentsExtension#onVariants(com.android.build.api.variant.VariantSelector,kotlin.Function1)) 來建立原始碼集。這使得此類表達式失效，導致類似 `org.gradle.api.UnknownDomainObjectException: KotlinSourceSet with name 'androidDebug' not found` 的錯誤。

為了解決這個問題，請在您的 `build.gradle.kts` 檔案中使用新的 `invokeWhenCreated()` API：

```kotlin
kotlin {
// ...
    @OptIn(ExperimentalKotlinGradlePluginApi::class)
    sourceSets.invokeWhenCreated("androidFreeDebug") {
// ...
    }
}
```