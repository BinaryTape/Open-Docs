[//]: # (title: 设置多平台库发布)

您可以将多平台库发布到不同位置：

* [到本地 Maven 版本库](#publishing-to-a-local-maven-repository)
* 到 Maven Central 版本库。关于如何设置账户凭据、自定义库元数据以及配置发布插件，请参见[我们的教程](multiplatform-publish-libraries.md)。
* 到 GitHub 版本库。更多信息，请参见 GitHub 关于 [GitHub packages](https://docs.github.com/en/packages) 的文档。

## 发布到本地 Maven 版本库

您可以使用 `maven-publish` Gradle 插件将多平台库发布到本地 Maven 版本库：

1. 在 `shared/build.gradle.kts` 文件中，添加 [`maven-publish` Gradle 插件](https://docs.gradle.org/current/userguide/publishing_maven.html)。
2. 为库指定 `group` 和 `version`，以及应发布到的[版本库](https://docs.gradle.org/current/userguide/publishing_maven.html#publishing_maven:repositories)：

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

当与 `maven-publish` 结合使用时，Kotlin 插件会自动为可在当前主机上构建的每个目标创建发布物，Android 目标除外，后者需要[额外步骤来配置发布](#publish-an-android-library)。

## 发布物的结构

Kotlin 多平台库的发布物包含多个 Maven 发布物，每个发布物对应一个特定目标。此外，一个总览的 _根_ 发布物 `kotlinMultiplatform` 会被发布，它代表整个库。

当作为[依赖项](multiplatform-add-dependencies.md)添加到公共源代码集时，根发布物会自动解析为相应的平台特有构件。

### 目标特有发布物和根发布物

Kotlin Multiplatform Gradle 插件为每个目标配置单独的发布物。考虑以下项目配置：

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

此设置会生成以下 Maven 发布物：

**目标特有发布物**

* 对于 `jvm` 目标：`test:lib-jvm:1.0`
* 对于 `iosX64` 目标：`test:lib-iosx64:1.0`
* 对于 `iosArm64` 目标：`test:lib-iosarm64:1.0`

每个目标特有发布物都是独立的。例如，运行 `publishJvmPublicationTo<MavenRepositoryName>` 只会发布 JVM 模块，使其他模块保持未发布状态。

**根发布物**

`kotlinMultiplatform` 根发布物：`test:lib:1.0`。

根发布物作为入口点，引用所有目标特有发布物。它包含元数据构件，并通过包含对其他发布物的引用（例如各个平台构件的预期 URL 和坐标）来确保正确的依赖项解析。

* 某些版本库（例如 Maven Central）要求根模块包含一个不带分类器的 JAR 构件，例如 `kotlinMultiplatform-1.0.jar`。Kotlin Multiplatform 插件会自动生成所需的构件以及嵌入式元数据构件。这意味着您无需向库的根模块添加空构件即可满足版本库的要求。

  > 关于使用 [Gradle](multiplatform-configure-compilations.md#compilation-for-jvm) 和 [Maven](https://kotlinlang.org/docs/maven.html#create-jar-file) 构建系统生成 JAR 构件的更多信息。
  >
  {style="tip"}

* 如果版本库要求，`kotlinMultiplatform` 发布物也可能需要源代码和文档构件。在这种情况下，请在发布物的作用域内使用 [`artifact()`](https://docs.gradle.org/current/javadoc/org/gradle/api/publish/maven/MavenPublication.html#artifact-java.lang.Object-)。

### 发布完整的库

要一步发布所有必要的构件，请使用 `publishAllPublicationsTo<MavenRepositoryName>` 总览任务。例如：

```bash
./gradlew publishAllPublicationsToGithubPackagesRepository
```

发布到本地 Maven 时，您可以使用一个特殊任务：

```bash
./gradlew publishToMavenLocal
```

这些任务可确保所有目标特有发布物和根发布物一起发布，从而使库完全可用于依赖项解析。

或者，您可以使用单独的发布任务。首先运行根发布物：

```bash
./gradlew publishKotlinMultiplatformPublicationToMavenLocal
````

此任务会发布一个 `*.module` 文件，其中包含有关目标特有发布物的信息，但目标本身保持未发布状态。要完成此过程，请单独发布每个目标特有发布物：

```bash
./gradlew publish<TargetName>PublicationToMavenLocal
```

这可确保所有构件可用并被正确引用。

## 主机要求

Kotlin/Native 支持交叉编译，允许任何主机生成必要的 `.klib` 构件。但是，您仍需注意一些具体事项。

### 为 Apple 目标编译
<secondary-label ref="Experimental"/>

要为带有 Apple 目标的项目生成构件，通常需要一台 Apple 机器。但是，如果您想使用其他主机，请在 `gradle.properties` 文件中设置此选项：

```none
kotlin.native.enableKlibsCrossCompilation=true
```

交叉编译目前处于实验性的阶段，并有一些限制。在以下情况下，您仍然需要使用 Mac 机器：

* 您的库具有 [cinterop 依赖项](https://kotlinlang.org/docs/native-c-interop.html)。
* 您在项目中设置了 [CocoaPods 集成](multiplatform-cocoapods-overview.md)。
* 您需要为 Apple 目标构建或测试[最终二进制文件](multiplatform-build-native-binaries.md)。

### 重复发布物

为避免发布过程中出现任何问题，请从单个主机发布所有构件，以避免版本库中出现重复发布物。例如，Maven Central 明确禁止重复发布物，否则会导致进程失败。
<!-- TBD: add the actual error -->

## 发布 Android 库

要发布 Android 库，您需要提供额外配置。

默认情况下，不发布 Android 库的任何构件。要发布由一组 Android [构建变体](https://developer.android.com/build/build-variants)生成的构件，请在 `shared/build.gradle.kts` 文件中的 Android 目标块中指定变体名称：

```kotlin
kotlin {
    androidTarget {
        publishLibraryVariants("release")
    }
}
```

此示例适用于不带[产品风味](https://developer.android.com/build/build-variants#product-flavors)的 Android 库。对于带有产品风味的库，变体名称也包含风味，例如 `fooBarDebug` 或 `fooBarRelease`。

默认发布设置如下：
* 如果已发布的变体具有相同的构建类型（例如，所有变体都是 `release` 或 `debug`），它们将与任何消费方构建类型兼容。
* 如果已发布的变体具有不同的构建类型，则只有 `release` 变体将与未包含在已发布变体中的消费方构建类型兼容。所有其他变体（例如 `debug`）将只与消费方相同的构建类型匹配，除非消费方项目指定了[匹配回退](https://developer.android.com/reference/tools/gradle-api/4.2/com/android/build/api/dsl/BuildType)。

如果您希望每个已发布的 Android 变体仅与其库消费方使用的相同构建类型兼容，请设置此 Gradle 属性：`kotlin.android.buildTypeAttribute.keep=true`。

您还可以按产品风味分组发布变体，以便不同构建类型的输出放置在单个模块中，且构建类型成为构件的分类器（`release` 构建类型仍以无分类器发布）。此模式默认禁用，可按以下方式在 `shared/build.gradle.kts` 文件中启用：

```kotlin
kotlin {
    androidTarget {
        publishLibraryVariantsGroupedByFlavor = true
    }
}
```

> 如果按产品风味分组的变体具有不同的依赖项，则不建议发布此类变体，因为这些依赖项将合并到一个依赖项列表中。
>
{style="note"}

## 禁用源代码发布

默认情况下，Kotlin Multiplatform Gradle 插件会为所有指定目标发布源代码。但是，您可以在 `shared/build.gradle.kts` 文件中使用 `withSourcesJar()` API 配置并禁用源代码发布：

* 要为所有目标禁用源代码发布：

  ```kotlin
  kotlin {
      withSourcesJar(publish = false)

      jvm()
      linuxX64()
  }
  ```

* 要仅为指定目标禁用源代码发布：

  ```kotlin
  kotlin {
       // 仅为 JVM 禁用源代码发布：
      jvm {
          withSourcesJar(publish = false)
      }
      linuxX64()
  }
  ```

* 要为除指定目标之外的所有目标禁用源代码发布：

  ```kotlin
  kotlin {
      // 为除 JVM 之外的所有目标禁用源代码发布：
      withSourcesJar(publish = false)

      jvm {
          withSourcesJar(publish = true)
      }
      linuxX64()
  }
  ```

## 禁用 JVM 环境属性发布

从 Kotlin 2.0.0 开始，Gradle 属性 [`org.gradle.jvm.environment`](https://docs.gradle.org/current/userguide/variant_attributes.html#sub:jvm_default_attributes) 会随所有 Kotlin 变体自动发布，以帮助区分 Kotlin 多平台库的 JVM 变体和 Android 变体。此属性指明哪个库变体适用于哪个 JVM 环境，Gradle 利用此信息帮助项目中的依赖项解析。目标环境可以是 "android"、"standard-jvm" 或 "no-jvm"。

您可以通过将以下 Gradle 属性添加到 `gradle.properties` 文件来禁用此属性的发布：

```none
kotlin.publishJvmEnvironmentAttribute=false
```

<h2>推广您的库</h2>

您的库可以在 [JetBrains 的搜索平台](https://klibs.io/)上展示。它旨在方便根据目标平台查找 Kotlin 多平台库。

满足条件的库会自动添加。关于如何添加您的库的更多信息，请参见[常见问题](https://klibs.io/faq)。

## 下一步

* [了解如何将 Kotlin 多平台库发布到 Maven Central 版本库](multiplatform-publish-libraries.md)
* [关于为 Kotlin Multiplatform 设计库的最佳实践和技巧，请参见库作者指南](https://kotlinlang.org/docs/api-guidelines-build-for-multiplatform.html)