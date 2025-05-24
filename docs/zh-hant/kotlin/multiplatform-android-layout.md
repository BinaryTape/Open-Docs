---
title: "Android 原始碼集佈局"
---
新的 Android 原始碼集版面配置在 Kotlin 1.8.0 中引入，並在 1.9.0 中成為預設配置。請按照本指南了解已棄用和新版面配置之間的關鍵差異，以及如何遷移您的專案。

:::tip
您無需實作所有建議，只需實作適用於您的特定專案的建議即可。
:::

## 檢查相容性

新的版面配置需要 Android Gradle 外掛程式 7.0 或更高版本，並在 Android Studio 2022.3 及更高版本中受到支援。檢查您的 Android Gradle 外掛程式版本，並在必要時升級。

## 重新命名 Kotlin 原始碼集

如果適用，請按照以下模式重新命名專案中的原始碼集：

| 先前的原始碼集版面配置                   | 新的原始碼集版面配置                 |
|--------------------------------------|------------------------------------|
| `targetName` + `AndroidSourceSet.name` | `targetName` + `AndroidVariantType` |

`{AndroidSourceSet.name}` 映射到 `{KotlinSourceSet.name}` 如下：

|             | 先前的原始碼集版面配置 | 新的原始碼集版面配置         |
|-------------|----------------------------|-------------------------------|
| main        | androidMain                | androidMain                   |
| test        | androidTest                | android<b>Unit</b>Test        |
| androidTest | android<b>Android</b>Test  | android<b>Instrumented</b>Test |

## 移動原始碼檔案

如果適用，請按照以下模式將原始碼檔案移動到新的目錄：

| 先前的原始碼集版面配置                                | 新的原始碼集版面配置               |
|---------------------------------------------------|------------------------------------|
| 該版面配置具有額外的 `/kotlin` SourceDirectories | `src/{KotlinSourceSet.name}/kotlin` |

`{AndroidSourceSet.name}` 映射到 `{SourceDirectories included}` 如下：

|             | 先前的原始碼集版面配置                                  | 新的原始碼集版面配置                                                                        |
|-------------|---------------------------------------------------------|---------------------------------------------------------------------------------------------|
| main        | src/androidMain/kotlin<br/>src/main/kotlin<br/>src/main/java | src/androidMain/kotlin<br/>src/main/kotlin<br/>src/main/java                                 |
| test        | src/androidTest/kotlin<br/>src/test/kotlin<br/>src/test/java | src/android<b>Unit</b>Test/kotlin<br/>src/test/kotlin<br/>src/test/java                          |
| androidTest | src/android<b>Android</b>Test/kotlin<br/>src/androidTest/java | src/android<b>Instrumented</b>Test/kotlin<br/>src/androidTest/java, <b>src/androidTest/kotlin</b> |

## 移動 AndroidManifest.xml 檔案

如果您的專案中有 `AndroidManifest.xml` 檔案，請按照以下模式將其移動到新的目錄：

| 先前的原始碼集版面配置                               | 新的原始碼集版面配置                              |
|---------------------------------------------------|----------------------------------------------------|
| src/**Android**SourceSet.name/AndroidManifest.xml | src/**Kotlin**SourceSet.name/AndroidManifest.xml |

`{AndroidSourceSet.name}` 映射到 `{AndroidManifest.xml location}` 如下：

|       | 先前的原始碼集版面配置   | 新的原始碼集版面配置                      |
|-------|------------------------------|--------------------------------------------|
| main  | src/main/AndroidManifest.xml | src/<b>android</b>Main/AndroidManifest.xml |
| debug | src/debug/AndroidManifest.xml| src/<b>android</b>Debug/AndroidManifest.xml|

## 檢查 Android 測試和 common 測試之間的關係

新的 Android 原始碼集版面配置變更了 Android instrumentation 測試（在新版面配置中重新命名為 `androidInstrumentedTest`）和 common 測試之間的關係。

先前，`androidAndroidTest` 和 `commonTest` 之間的 `dependsOn` 關係是預設的。這意味著：

* `commonTest` 中的程式碼在 `androidAndroidTest` 中可用。
* `commonTest` 中的 `expect` 宣告必須在 `androidAndroidTest` 中具有對應的 `actual` 實作。
* 在 `commonTest` 中宣告的測試也作為 Android instrumentation 測試執行。

在新的 Android 原始碼集版面配置中，預設情況下不會新增 `dependsOn` 關係。如果您喜歡先前的行為，請在 `build.gradle.kts` 檔案中手動宣告以下關係：

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

## 調整 Android flavors 的實作

先前，Kotlin Gradle 外掛程式會急切地建立與包含 `debug` 和 `release` 建置類型或自訂 flavor（如 `demo` 和 `full`）的 Android 原始碼集對應的原始碼集。它使得可以使用諸如 `val androidDebug by getting { ... }` 之類的表達式來存取原始碼集。

新的 Android 原始碼集版面配置利用 Android 的 [`onVariants`](https://developer.android.com/reference/tools/gradle-api/8.0/com/android/build/api/variant/AndroidComponentsExtension#onVariants(com.android.build.api.variant.VariantSelector,kotlin.Function1)) 來建立原始碼集。這使得此類表達式無效，從而導致諸如 `org.gradle.api.UnknownDomainObjectException: KotlinSourceSet with name 'androidDebug' not found` 之類的錯誤。

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