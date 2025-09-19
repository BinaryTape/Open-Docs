[//]: # (title: 设置多平台库发布)

您可以将多平台库发布到不同位置：

*   [到本地 Maven 版本库](#publishing-to-a-local-maven-repository)
*   到 Maven Central 版本库。了解如何在[我们的教程](multiplatform-publish-libraries.md)中设置账户凭据、自定义库元数据以及配置发布插件。
*   到 GitHub 版本库。有关更多信息，请参阅 GitHub 关于 [GitHub packages](https://docs.github.com/en/packages) 的文档。

## 发布到本地 Maven 版本库

您可以使用 `maven-publish` Gradle 插件将多平台库发布到本地 Maven 版本库：

1.  在 `shared/build.gradle.kts` 文件中，添加 [`maven-publish` Gradle 插件](https://docs.gradle.org/current/userguide/publishing_maven.html)。
2.  指定库的 group 和 version，以及应发布到的[版本库](https://docs.gradle.org/current/userguide/publishing_maven.html#publishing_maven:repositories)：

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

与 `maven-publish` 结合使用时，Kotlin 插件会自动为可在当前主机上构建的每个目标创建发布项，但 Android 目标除外，它需要[额外步骤来配置发布](#publish-an-android-library)。

## 发布项的结构

Kotlin Multiplatform 库的发布项包含多个 Maven 发布项，每个都对应一个特定目标。此外，一个伞形 _root_ 发布项 `kotlinMultiplatform`（代表整个库）也会被发布。

当作为[依赖项](multiplatform-add-dependencies.md)添加到公共源代码集时，根发布项会自动解析为相应的平台特有 artifact。

### 目标特有与根发布项

Kotlin Multiplatform Gradle 插件为每个目标配置独立的发布项。考虑以下项目配置：

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

此设置会生成以下 Maven 发布项：

**目标特有的发布项**

*   对于 `jvm` 目标：`test:lib-jvm:1.0`
*   对于 `iosX64` 目标：`test:lib-iosx64:1.0`
*   对于 `iosArm64` 目标：`test:lib-iosarm64:1.0`

每个目标特有的发布项都是独立的。例如，运行 `publishJvmPublicationTo<MavenRepositoryName>` 只发布 JVM 模块，使其他模块保持未发布状态。

**根发布项**

`kotlinMultiplatform` 根发布项：`test:lib:1.0`。

根发布项作为入口点，引用所有目标特有的发布项。它包含元数据 artifact，并通过包含对其他发布项的引用（即各个平台 artifact 的预期 URL 和坐标）来确保正确的依赖项解析。

*   一些版本库，例如 Maven Central，要求根模块包含不带分类器的 JAR artifact，例如 `kotlinMultiplatform-1.0.jar`。Kotlin Multiplatform 插件会自动生成所需的 artifact，其中包含嵌入式元数据 artifact。这意味着您无需在库的根模块中添加一个空 artifact 来满足版本库的要求。

    > 详细了解如何使用 [Gradle](multiplatform-configure-compilations.md#compilation-for-jvm) 和 [Maven](https://kotlinlang.org/docs/maven.html#create-jar-file) 构建系统生成 JAR artifact。
    >
    {style="tip"}

*   如果版本库需要，`kotlinMultiplatform` 发布项也可能需要源代码和文档 artifact。在这种情况下，请在发布项的作用域中使用 [`artifact()`](https://docs.gradle.org/current/javadoc/org/gradle/api/publish/maven/MavenPublication.html#artifact-java.lang.Object-)。

### 发布完整库

要一步发布所有必需的 artifact，请使用 `publishAllPublicationsTo<MavenRepositoryName>` 伞形任务。例如：

```bash
./gradlew publishAllPublicationsToGithubPackagesRepository
```

发布到 Maven Local 时，您可以使用特殊任务：

```bash
./gradlew publishToMavenLocal
```

这些任务确保所有目标特有和根发布项一起发布，使库完全可用于依赖项解析。

或者，您可以使用单独的发布任务。首先运行根发布项：

```bash
./gradlew publishKotlinMultiplatformPublicationToMavenLocal
````

此任务发布一个 `*.module` 文件，其中包含关于目标特有发布项的信息，但目标本身仍未发布。要完成此过程，请单独发布每个目标特有的发布项：

```bash
./gradlew publish<TargetName>PublicationToMavenLocal
```

这保证所有 artifact 都可用并被正确引用。

## 主机要求

Kotlin/Native 支持交叉编译，允许任何主机生成必要的 `.klib` artifact。但是，您仍需注意一些具体事项。

**Apple 目标的编译**

您可以使用任何主机为带有 Apple 目标的项目生成 artifact。但是，如果您仍需使用 Mac 机器，则需要满足以下条件：

*   您的库或依赖模块具有 [cinterop 依赖项](https://kotlinlang.org/docs/native-c-interop.html)。
*   您的项目中设置了 [CocoaPods 集成](multiplatform-cocoapods-overview.md)。
*   您需要为 Apple 目标构建或测试[最终二进制文件](multiplatform-build-native-binaries.md)。

**重复发布项**

为避免发布期间出现任何问题，请从单个主机发布所有 artifact，以避免在版本库中重复发布项。例如，Maven Central 明确禁止重复发布项并会导致进程失败。

## 发布 Android 库

要发布 Android 库，您需要提供额外配置。

默认情况下，不发布 Android 库的任何 artifact。要发布一组 Android [构建变体](https://developer.android.com/build/build-variants)生成的 artifact，请在 `shared/build.gradle.kts` 文件中的 Android 目标块中指定变体名称：

```kotlin
kotlin {
    androidTarget {
        publishLibraryVariants("release")
    }
}
```

此示例适用于不带 [product flavor](https://developer.android.com/build/build-variants#product-flavors) 的 Android 库。对于带有 product flavor 的库，变体名称也包含 flavor，例如 `fooBarDebug` 或 `fooBarRelease`。

默认发布设置如下：
*   如果已发布的变体具有相同的构建类型（例如，所有变体都是 `release` 或 `debug`），它们将与任何消费者构建类型兼容。
*   如果已发布的变体具有不同的构建类型，则只有 release 变体将与未包含在已发布变体中的消费者构建类型兼容。所有其他变体（例如 `debug`）将只匹配消费者侧的相同构建类型，除非消费者项目指定了[匹配回退](https://developer.android.com/reference/tools/gradle-api/4.2/com/android/build/api/dsl/BuildType)。

如果您希望使每个已发布的 Android 变体仅与库消费者使用的相同构建类型兼容，请设置此 Gradle 属性：`kotlin.android.buildTypeAttribute.keep=true`。

您还可以按 product flavor 分组发布变体，这样不同构建类型的输出会放置在单个模块中，构建类型成为 artifact 的分类器（release 构建类型仍不带分类器发布）。此模式默认禁用，可以在 `shared/build.gradle.kts` 文件中按如下方式启用：

```kotlin
kotlin {
    androidTarget {
        publishLibraryVariantsGroupedByFlavor = true
    }
}
```

> 不建议您按 product flavor 分组发布变体，以防它们具有不同的依赖项，因为这些依赖项将合并到一个依赖项列表中。
>
{style="note"}

## 禁用源代码发布

默认情况下，Kotlin Multiplatform Gradle 插件会为所有指定目标发布源代码。但是，您可以在 `shared/build.gradle.kts` 文件中使用 `withSourcesJar()` API 配置并禁用源代码发布：

*   要为所有目标禁用源代码发布：

    ```kotlin
    kotlin {
        withSourcesJar(publish = false)

        jvm()
        linuxX64()
    }
    ```

*   要仅为指定目标禁用源代码发布：

    ```kotlin
    kotlin {
         // Disable sources publication only for JVM:
        jvm {
            withSourcesJar(publish = false)
        }
        linuxX64()
    }
    ```

*   要为除指定目标外的所有目标禁用源代码发布：

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

## 禁用 JVM 环境属性发布

从 Kotlin 2.0.0 开始，Gradle 属性 [`org.gradle.jvm.environment`](https://docs.gradle.org/current/userguide/variant_attributes.html#sub:jvm_default_attributes) 会随所有 Kotlin 变体自动发布，以帮助区分 Kotlin Multiplatform 库的 JVM 和 Android 变体。此属性指示哪个库变体适用于哪个 JVM 环境，Gradle 会使用此信息帮助您项目中的依赖项解析。目标环境可以是 "android"、"standard-jvm" 或 "no-jvm"。

您可以通过将以下 Gradle 属性添加到您的 `gradle.properties` 文件来禁用此属性的发布：

```none
kotlin.publishJvmEnvironmentAttribute=false
```

## 推广您的库

您的库可以在 [JetBrains 的搜索平台](https://klibs.io/)上展示。它旨在方便根据目标平台查找 Kotlin Multiplatform 库。

符合标准的库会自动添加。有关如何添加库的更多信息，请参阅 [FAQ](https://klibs.io/faq)。

## 下一步

*   [了解如何将您的 Kotlin Multiplatform 库发布到 Maven Central 版本库](multiplatform-publish-libraries.md)
*   [参阅库作者指南，了解为 Kotlin Multiplatform 设计库的最佳实践和技巧](https://kotlinlang.org/docs/api-guidelines-build-for-multiplatform.html)