---
title: "Android 源码集布局"
---
新的 Android 源码集布局在 Kotlin 1.8.0 中引入，并在 1.9.0 中成为默认布局。请按照本指南了解已弃用布局和新布局之间的主要区别，以及如何迁移你的项目。

:::tip
你无需实现所有建议，只需实现适用于你特定项目的建议即可。
:::

## 检查兼容性

新布局需要 Android Gradle 插件 7.0 或更高版本，并且在 Android Studio 2022.3 及更高版本中受支持。检查你的 Android Gradle 插件版本，必要时进行升级。

## 重命名 Kotlin 源码集

如果适用，请按照以下模式重命名项目中的源码集：

| 之前的源码集布局                       | 新的源码集布局                      |
| -------------------------------------- | ------------------------------------- |
| `targetName` + `AndroidSourceSet.name` | `targetName` + `AndroidVariantType` |

`{AndroidSourceSet.name}` 映射到 `{KotlinSourceSet.name}` 如下所示：

|             | 之前的源码集布局   | 新的源码集布局              |
| ----------- | ------------------ | ---------------------------- |
| main        | androidMain        | androidMain                  |
| test        | androidTest        | android<b>Unit</b>Test       |
| androidTest | android<b>Android</b>Test | android<b>Instrumented</b>Test |

## 移动源文件

如果适用，请按照以下模式将源文件移动到新目录：

| 之前的源码集布局                                 | 新的源码集布局                      |
| ------------------------------------------------- | ------------------------------------- |
| 该布局具有额外的 `/kotlin` SourceDirectories | `src/{KotlinSourceSet.name}/kotlin` |

`{AndroidSourceSet.name}` 映射到 `{SourceDirectories included}` 如下所示：

|             | 之前的源码集布局                                   | 新的源码集布局                                                                                 |
| ----------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| main        | src/androidMain/kotlin<br/>src/main/kotlin<br/>src/main/java | src/androidMain/kotlin<br/>src/main/kotlin<br/>src/main/java                                  |
| test        | src/androidTest/kotlin<br/>src/test/kotlin<br/>src/test/java | src/android<b>Unit</b>Test/kotlin<br/>src/test/kotlin<br/>src/test/java                       |
| androidTest | src/android<b>Android</b>Test/kotlin<br/>src/androidTest/java | src/android<b>Instrumented</b>Test/kotlin<br/>src/androidTest/java, <b>src/androidTest/kotlin</b> |

## 移动 AndroidManifest.xml 文件

如果你的项目中有 `AndroidManifest.xml` 文件，请按照以下模式将其移动到新目录：

| 之前的源码集布局                               | 新的源码集布局                               |
| ---------------------------------------------- | ---------------------------------------------- |
| src/**Android**SourceSet.name/AndroidManifest.xml | src/**Kotlin**SourceSet.name/AndroidManifest.xml |

`{AndroidSourceSet.name}` 映射到 `{AndroidManifest.xml location}` 如下所示：

|       | 之前的源码集布局                   | 新的源码集布局                         |
| ----- | ---------------------------------- | --------------------------------------- |
| main  | src/main/AndroidManifest.xml       | src/<b>android</b>Main/AndroidManifest.xml   |
| debug | src/debug/AndroidManifest.xml      | src/<b>android</b>Debug/AndroidManifest.xml  |

## 检查 Android 测试和 common 测试之间的关系

新的 Android 源码集布局更改了 Android instrumentation 测试（在新布局中重命名为 `androidInstrumentedTest`）与 common 测试之间的关系。

以前，`androidAndroidTest` 和 `commonTest` 之间的 `dependsOn` 关系是默认的。这意味着：

* `commonTest` 中的代码在 `androidAndroidTest` 中可用。
* `commonTest` 中的 `expect` 声明必须在 `androidAndroidTest` 中具有相应的 `actual` 实现。
* 在 `commonTest` 中声明的测试也作为 Android instrumentation 测试运行。

在新的 Android 源码集布局中，默认情况下不添加 `dependsOn` 关系。 如果你更喜欢之前的行为，请在 `build.gradle.kts` 文件中手动声明以下关系：

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

## 调整 Android flavors 的实现

以前，Kotlin Gradle 插件会急切地创建与包含 `debug` 和 `release` 构建类型或自定义 flavor（如 `demo` 和 `full`）的 Android 源码集相对应的源码集。
它使可以使用 `val androidDebug by getting { ... }` 之类的表达式来访问源码集。

新的 Android 源码集布局利用 Android 的 [`onVariants`](https://developer.android.com/reference/tools/gradle-api/8.0/com/android/build/api/variant/AndroidComponentsExtension#onVariants(com.android.build.api.variant.VariantSelector,kotlin.Function1))
来创建源码集。 这使得此类表达式无效，
从而导致诸如 `org.gradle.api.UnknownDomainObjectException: KotlinSourceSet with name 'androidDebug' not found` 之类的错误。

为了解决这个问题，请在你的 `build.gradle.kts` 文件中使用新的 `invokeWhenCreated()` API：

```kotlin
kotlin {
// ...
    @OptIn(ExperimentalKotlinGradlePluginApi::class)
    sourceSets.invokeWhenCreated("androidFreeDebug") {
// ...
    }
}