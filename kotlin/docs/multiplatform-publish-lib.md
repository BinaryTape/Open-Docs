---
title: 设置多平台库发布
---
你可以将你的多平台库发布到不同的位置：

*   [本地 Maven 仓库](#publishing-to-a-local-maven-repository)
*   Maven Central 仓库。学习如何设置账户凭证、自定义库元数据以及配置发布插件，请参考[我们的教程](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-libraries.html)。
*   GitHub 仓库。更多信息请参考 GitHub 关于 [GitHub packages](https://docs.github.com/en/packages) 的文档。

## 发布到本地 Maven 仓库

你可以使用 `maven-publish` Gradle 插件将多平台库发布到本地 Maven 仓库：

1.  在 `shared/build.gradle.kts` 文件中，添加 [`maven-publish` Gradle 插件](https://docs.gradle.org/current/userguide/publishing_maven.html)。
2.  指定库的 group 和 version，以及应该发布到的 [repositories](https://docs.gradle.org/current/userguide/publishing_maven.html#publishing_maven:repositories)：

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

当与 `maven-publish` 一起使用时，Kotlin 插件会自动为可以在当前主机上构建的每个 target (目标平台) 创建 publication (发布配置)，但 Android target (目标平台) 除外，它需要[额外的步骤来配置发布](#publish-an-android-library)。

## Publication (发布配置) 的结构

多平台库的 publication (发布配置) 包括一个额外的 _root_ (根) publication (发布配置) `kotlinMultiplatform`，它代表整个库，并在作为依赖项添加到 common source set (通用源码集) 时自动解析为相应的平台特定 artifacts (产物)。 
了解更多关于[添加依赖](multiplatform-add-dependencies)的信息。

这个 `kotlinMultiplatform` publication (发布配置) 包含 metadata artifacts (元数据产物)，并将其他 publication (发布配置) 作为其 variants (变体) 引用。

:::note
有些仓库，比如 Maven Central，要求 root module (根模块) 包含一个没有 classifier (分类符) 的 JAR artifact (产物)，例如 `kotlinMultiplatform-1.0.jar`。
Kotlin Multiplatform 插件会自动生成带有嵌入的 metadata artifacts (元数据产物) 的所需 artifact (产物)。
这意味着你不需要通过向库的 root module (根模块) 添加一个空的 artifact (产物) 来定制你的构建，以满足仓库的要求。

:::

如果仓库需要，`kotlinMultiplatform` publication (发布配置) 可能还需要 sources (源码) 和 documentation artifacts (文档产物)。在这种情况下，
通过在 publication (发布配置) 的作用域中使用 [`artifact(...)`](https://docs.gradle.org/current/javadoc/org/gradle/api/publish/maven/MavenPublication.html#artifact-java.lang.Object-) 来添加这些 artifacts (产物)。

## Host (主机) 要求

Kotlin/Native 支持 cross-compilation (交叉编译)，允许任何 host (主机) 生成必要的 `.klib` artifacts (产物)。
但是，你仍然应该记住一些具体事项。

### 为 Apple targets (Apple 目标平台) 编译

要生成带有 Apple targets (Apple 目标平台) 的项目的 artifacts (产物)，通常需要一台 Apple 机器。
但是，如果你想使用其他 host (主机)，请在你的 `gradle.properties` 文件中设置此选项：

```none
kotlin.native.enableKlibsCrossCompilation=true
```

Cross-compilation (交叉编译) 目前是 Experimental (实验性) 的，并且有一些限制。在以下情况下，你仍然需要使用 Mac 机器：

*   你的库具有 [cinterop dependency (C 互操作依赖)](native-c-interop)。
*   你在你的项目中设置了 [CocoaPods integration (CocoaPods 集成)](native-cocoapods)。
*   你需要为 Apple targets (Apple 目标平台) 构建或测试 [final binaries (最终二进制文件)](multiplatform-build-native-binaries)。

### Duplicating publications (重复发布)

为避免发布期间出现任何问题，请从单个 host (主机) 发布所有 artifacts (产物)，以避免在
repository (仓库) 中 duplicating publications (重复发布)。例如，Maven Central 明确禁止 duplicate publications (重复发布)，并会使该过程失败。
<!-- TBD: add the actual error -->

## 发布 Android 库

要发布一个 Android 库，你需要提供额外的配置。

默认情况下，不会发布 Android 库的任何 artifacts (产物)。要发布由一组 Android [build variants (构建变体)](https://developer.android.com/build/build-variants) 生成的 artifacts (产物)，
请在 `shared/build.gradle.kts` 文件中的 Android target (目标平台) 块中指定 variant names (变体名称)：

```kotlin
kotlin {
    androidTarget {
        publishLibraryVariants("release")
    }
}

```

该示例适用于没有 [product flavors (产品风味)](https://developer.android.com/build/build-variants#product-flavors) 的 Android 库。
对于具有 product flavors (产品风味) 的库，variant names (变体名称) 也包含 flavors (风味)，如 `fooBarDebug` 或 `fooBarRelease`。

默认的发布设置如下：

*   如果发布的 variants (变体) 具有相同的 build type (构建类型) (例如，它们都是 `release` 或 `debug`)，
    它们将与任何 consumer (消费者) build type (构建类型) 兼容。
*   如果发布的 variants (变体) 具有不同的 build types (构建类型)，那么只有 release (发布) variants (变体) 将与
    不属于已发布 variants (变体) 的 consumer (消费者) build types (构建类型) 兼容。除非 consumer (消费者) 项目指定了
    [matching fallbacks (匹配回退)](https://developer.android.com/reference/tools/gradle-api/4.2/com/android/build/api/dsl/BuildType)，否则所有其他 variants (变体) (如 `debug`)
    将仅匹配 consumer (消费者) 端的相同 build type (构建类型)。

如果你想使每个发布的 Android variant (变体) 仅与库 consumer (消费者) 使用的相同 build type (构建类型) 兼容，
请设置此 Gradle property (属性)：`kotlin.android.buildTypeAttribute.keep=true`。

你还可以按 product flavor (产品风味) 对 variants (变体) 进行分组，以便将不同 build types (构建类型) 的输出放置在
一个模块中，其中 build type (构建类型) 成为 artifacts (产物) 的 classifier (分类符) (release (发布) build type (构建类型) 仍然在没有 classifier (分类符) 的情况下发布)。此模式默认情况下处于禁用状态，可以在 `shared/build.gradle.kts` 文件中按如下方式启用：

```kotlin
kotlin {
    androidTarget {
        publishLibraryVariantsGroupedByFlavor = true
    }
}
```

:::note
不建议在 product flavor (产品风味) 分组的情况下发布 variants (变体) (如果它们具有不同的 dependencies (依赖项))，
因为这些 dependencies (依赖项) 将合并到一个依赖项列表中。

:::

## 禁用 sources (源码) 发布

默认情况下，Kotlin Multiplatform Gradle 插件会发布所有指定 targets (目标平台) 的 sources (源码)。但是，
你可以在 `shared/build.gradle.kts` 文件中使用 `withSourcesJar()` API 配置和禁用 sources (源码) 发布：

*   要禁用所有 targets (目标平台) 的 sources (源码) 发布：

    ```kotlin
    kotlin {
        withSourcesJar(publish = false)

        jvm()
        linuxX64()
    }
    ```

*   要仅禁用指定 target (目标平台) 的 sources (源码) 发布：

    ```kotlin
    kotlin {
         // Disable sources publication only for JVM:
        jvm {
            withSourcesJar(publish = false)
        }
        linuxX64()
    }
    ```

*   要禁用除指定 target (目标平台) 之外的所有 targets (目标平台) 的 sources (源码) 发布：

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

## 禁用 JVM environment attribute (JVM 环境属性) 发布

从 Kotlin 2.0.0 开始，Gradle attribute (属性) [`org.gradle.jvm.environment`](https://docs.gradle.org/current/userguide/variant_attributes.html#sub:jvm_default_attributes)
会自动与所有 Kotlin variants (变体) 一起发布，以帮助区分 Kotlin Multiplatform 库的 JVM 和 Android variants (变体)。该 attribute (属性) 指示哪个库 variant (变体) 适用于哪个 JVM 环境，Gradle 使用此信息来帮助
你项目中的 dependency resolution (依赖项解析)。target environment (目标环境) 可以是 "android"、"standard-jvm" 或 "no-jvm"。

你可以通过将以下 Gradle property (属性) 添加到你的 `gradle.properties` 文件来禁用此 attribute (属性) 的发布：

```none
kotlin.publishJvmEnvironmentAttribute=false
```

## 推广你的库

你的库可以在 [JetBrains' search platform (JetBrains 搜索平台)](https://klibs.io/) 上展示。
它旨在让你更容易地根据 Kotlin Multiplatform 库的 target platforms (目标平台) 查找它们。

符合标准的库会自动添加。有关如何添加你的库的更多信息，请参阅 [FAQ](https://klibs.io/faq)。

## 下一步

*   [了解如何将你的 Kotlin Multiplatform 库发布到 Maven Central 仓库](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-libraries.html)
*   [查看 Library authors' guidelines (库作者指南)，了解有关为 Kotlin Multiplatform 设计库的最佳实践和技巧](api-guidelines-build-for-multiplatform)