[//]: # (title: Android 源代码集布局)

新的 Android 源代码集布局在 Kotlin 1.8.0 中引入，并在 1.9.0 中成为默认。遵循本指南可了解已弃用布局和新布局之间的主要区别，以及如何迁移你的项目。

> 你无需实现所有建议，只需实现适用于你特定项目的建议。
>
{style="tip"}

## 检测兼容性

新布局要求 Android Gradle 插件 7.0 或更高版本，并支持 Android Studio 2022.3 及更高版本。检测你的 Android Gradle 插件版本，如有必要请升级。

## 重命名 Kotlin 源代码集

如果适用，请按照以下模式重命名项目中的源代码集：

| 旧的源代码集布局             | 新的源代码集布局               |
|----------------------------|--------------------------------|
| `targetName` + `AndroidSourceSet.name` | `targetName` + `AndroidVariantType` |

`{AndroidSourceSet.name}` 映射到 `{KotlinSourceSet.name}` 如下所示：

|             | 旧的源代码集布局 | 新的源代码集布局          |
|-------------|----------------------------|--------------------------------|
| main        | androidMain                | androidMain                    |
| test        | androidTest                | android<b>Unit</b>Test         |
| androidTest | android<b>Android</b>Test  | android<b>Instrumented</b>Test |

## 移动源文件

如果适用，请按照以下模式将源文件移动到新目录：

| 旧的源代码集布局                            | 新的源代码集布局               |
|-------------------------------------------|-------------------------------------|
| 该布局有额外的 `/kotlin` SourceDirectories | `src/{KotlinSourceSet.name}/kotlin` |

`{AndroidSourceSet.name}` 映射到 `{SourceDirectories included}` 如下所示：

|             | 旧的源代码集布局                                    | 新的源代码集布局                                                                             |
|-------------|---------------------------------------------------------------|---------------------------------------------------------------------------------------------------|
| main        | src/androidMain/kotlin<br/>src/main/kotlin<br/>src/main/java  | src/androidMain/kotlin<br/>src/main/kotlin<br/>src/main/java                                      |
| test        | src/androidTest/kotlin<br/>src/test/kotlin<br/>src/test/java  | src/android<b>Unit</b>Test/kotlin<br/>src/test/kotlin<br/>src/test/java                           |
| androidTest | src/android<b>Android</b>Test/kotlin<br/>src/androidTest/java | src/android<b>Instrumented</b>Test/kotlin<br/>src/androidTest/java, <b>src/androidTest/kotlin</b> |

## 移动 AndroidManifest.xml 文件

如果你的项目中有 `AndroidManifest.xml` 文件，请按照以下模式将其移动到新目录：

| 旧的源代码集布局                             | 新的源代码集布局                                 |
|--------------------------------------------|-------------------------------------------------------|
| src/{<b>Android</b>SourceSet.name}/AndroidManifest.xml | src/{<b>Kotlin</b>SourceSet.name}/AndroidManifest.xml |

`{AndroidSourceSet.name}` 映射到 `{AndroidManifest.xml location}` 如下所示：

|       | 旧的源代码集布局    | 新的源代码集布局                       |
|-------|-------------------------------|---------------------------------------------|
| main  | src/main/AndroidManifest.xml  | src/<b>android</b>Main/AndroidManifest.xml  |
| debug | src/debug/AndroidManifest.xml | src/<b>android</b>Debug/AndroidManifest.xml |

## 检测 Android 与公共测试之间的关系

新的 Android 源代码集布局改变了 Android 仪器化测试（在新布局中重命名为 `androidInstrumentedTest`）与公共测试之间的关系。

此前，`androidAndroidTest` 和 `commonTest` 之间的 `dependsOn` 关系是默认的。这意味着以下几点：

*   `commonTest` 中的代码在 `androidAndroidTest` 中可用。
*   `commonTest` 中的 `expect` 声明必须在 `androidInstrumentedTest` 中有对应的 `actual` 实现。
*   `commonTest` 中声明的测试也作为 Android 仪器化测试运行。

在新的 Android 源代码集布局中，默认不添加 `dependsOn` 关系。如果你偏好之前的行为，请在 `build.gradle.kts` 文件中手动声明以下关系：

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

## 调整 Android flavor 的实现

此前，Kotlin Gradle 插件会急切地创建与包含 `debug` 和 `release` 构建类型或 `demo` 和 `full` 等自定义 flavor 的 Android 源代码集相对应的源代码集。
这使得源代码集可以使用 `val androidDebug by getting { ... }` 这样的表达式进行访问。

新的 Android 源代码集布局利用 Android 的 [`onVariants`](https://developer.android.com/reference/tools/gradle-api/8.0/com/android/build/api/variant/AndroidComponentsExtension#onVariants(com.android.build.api.variant.VariantSelector,kotlin.Function1)) 来创建源代码集。这使得此类表达式无效，导致类似 `org.gradle.api.UnknownDomainObjectException: KotlinSourceSet with name 'androidDebug' not found` 的错误。

为了解决这个问题，请在 `build.gradle.kts` 文件中使用新的 `invokeWhenCreated()` API：

```kotlin
kotlin {
// ...
    @OptIn(ExperimentalKotlinGradlePluginApi::class)
    sourceSets.invokeWhenCreated("androidFreeDebug") {
// ...
    }
}