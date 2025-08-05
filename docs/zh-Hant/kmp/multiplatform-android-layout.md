[//]: # (title: Android 原始碼集佈局)

新的 Android 原始碼集佈局於 Kotlin 1.8.0 中引入，並在 1.9.0 中成為預設。請遵循本指南以了解已棄用佈局與新佈局之間的關鍵差異，以及如何遷移您的專案。

> 您無需實施所有建議，只需實施適用於您特定專案的建議即可。
>
{style="tip"}

## 檢查相容性

新的佈局需要 Android Gradle plugin 7.0 或更高版本，並支援 Android Studio 2022.3 及更高版本。檢查您的 Android Gradle plugin 版本，並在必要時進行升級。

## 重新命名 Kotlin 原始碼集

如果適用，請按照此模式重新命名您專案中的原始碼集：

| 先前的原始碼集佈局             | 新的原始碼集佈局               |
|--------------------------------|---------------------------------|
| `targetName` + `AndroidSourceSet.name` | `targetName` + `AndroidVariantType` |

`{AndroidSourceSet.name}` 映射到 `{KotlinSourceSet.name}` 如下：

|             | 先前的原始碼集佈局 | 新的原始碼集佈局          |
|-------------|--------------------|----------------------------|
| main        | androidMain        | androidMain                |
| test        | androidTest        | android<b>Unit</b>Test     |
| androidTest | android<b>Android</b>Test | android<b>Instrumented</b>Test |

## 移動原始碼檔案

如果適用，請按照此模式將您的原始碼檔案移動到新的目錄：

| 先前的原始碼集佈局                            | 新的原始碼集佈局               |
|-----------------------------------------------|---------------------------------|
| 該佈局有額外的 `/kotlin` SourceDirectories | `src/{KotlinSourceSet.name}/kotlin` |

`{AndroidSourceSet.name}` 映射到 `{SourceDirectories included}` 如下：

|             | 先前的原始碼集佈局                                    | 新的原始碼集佈局                                                                             |
|-------------|-------------------------------------------------------|---------------------------------------------------------------------------------------------------|
| main        | src/androidMain/kotlin<br/>src/main/kotlin<br/>src/main/java  | src/androidMain/kotlin<br/>src/main/kotlin<br/>src/main/java                                      |
| test        | src/androidTest/kotlin<br/>src/test/kotlin<br/>src/test/java  | src/android<b>Unit</b>Test/kotlin<br/>src/test/kotlin<br/>src/test/java                           |
| androidTest | src/android<b>Android</b>Test/kotlin<br/>src/androidTest/java | src/android<b>Instrumented</b>Test/kotlin<br/>src/androidTest/java, <b>src/androidTest/kotlin</b> |

## 移動 AndroidManifest.xml 檔案

如果您的專案中有 `AndroidManifest.xml` 檔案，請按照此模式將其移動到新的目錄：

| 先前的原始碼集佈局                             | 新的原始碼集佈局                                 |
|------------------------------------------------|---------------------------------------------------|
| src/{<b>Android</b>SourceSet.name}/AndroidManifest.xml | src/{<b>Kotlin</b>SourceSet.name}/AndroidManifest.xml |

`{AndroidSourceSet.name}` 映射到 `{AndroidManifest.xml location}` 如下：

|       | 先前的原始碼集佈局    | 新的原始碼集佈局                       |
|-------|-----------------------|-----------------------------------------|
| main  | src/main/AndroidManifest.xml  | src/<b>android</b>Main/AndroidManifest.xml  |
| debug | src/debug/AndroidManifest.xml | src/<b>android</b>Debug/AndroidManifest.xml |

## 檢查 Android 與通用測試之間的關係

新的 Android 原始碼集佈局改變了 Android 插裝測試（在新佈局中重新命名為 `androidInstrumentedTest`）與通用測試之間的關係。

之前，`androidAndroidTest` 和 `commonTest` 之間的 `dependsOn` 關係是預設的。這意味著：

*   `commonTest` 中的程式碼在 `androidAndroidTest` 中可用。
*   `commonTest` 中的 `expect` 宣告必須在 `androidAndroidTest` 中有對應的 `actual` 實作。
*   在 `commonTest` 中宣告的測試也作為 Android 插裝測試運行。

在新的 Android 原始碼集佈局中，`dependsOn` 關係預設不會添加。如果您偏好之前的行為，請在您的 `build.gradle.kts` 檔案中手動宣告以下關係：

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

## 調整 Android flavor 的實作

之前，Kotlin Gradle plugin 會急切地建立對應於包含 `debug` 和 `release` 建置類型或自訂 flavor（例如 `demo` 和 `full`）的 Android 原始碼集。這使得原始碼集可以透過 `val androidDebug by getting { ... }` 這樣的表達式來存取。

新的 Android 原始碼集佈局利用 Android 的 [`onVariants`](https://developer.android.com/reference/tools/gradle-api/8.0/com/android/build/api/variant/AndroidComponentsExtension#onVariants(com.android.build.api.variant.VariantSelector,kotlin.Function1)) 來建立原始碼集。這使得此類表達式無效，導致諸如 `org.gradle.api.UnknownDomainObjectException: KotlinSourceSet with name 'androidDebug' not found` 等錯誤。

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