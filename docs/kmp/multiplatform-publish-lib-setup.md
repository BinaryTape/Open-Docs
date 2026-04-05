[//]: # (title: 设置多平台库发布)

您可以将多平台库配置为发布到不同位置：

* [到本地 Maven 仓库](#publishing-to-a-local-maven-repository)
* 到 Maven Central 仓库。了解如何在[我们的教程](multiplatform-publish-libraries-to-maven.md)中设置帐户凭据、自定义库元数据以及配置发布插件。
* 到 GitHub 仓库。更多信息请参阅 GitHub 关于 [GitHub packages](https://docs.github.com/en/packages) 的文档。

## 发布到本地 Maven 仓库

您可以使用 `maven-publish` Gradle 插件将多平台库发布到本地 Maven 仓库：

1. 在 `shared/build.gradle.kts` 文件中，添加 [`maven-publish` Gradle 插件](https://docs.gradle.org/current/userguide/publishing_maven.html)。
2. 为库指定组（group）和版本（version），以及应当发布到的[仓库](https://docs.gradle.org/current/userguide/publishing_maven.html#publishing_maven:repositories)：

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

当与 `maven-publish` 结合使用时，Kotlin 插件会自动为可以在当前主机上构建的每个目标创建发布，但 Android 目标除外，它需要[额外的步骤来配置发布](#publish-an-android-library)。

## 发布结构

Kotlin 多平台库的发布包含多个 Maven 发布，每个发布对应一个特定的目标。此外，还会发布一个代表整个库的名为 `kotlinMultiplatform` 的伞形“根”发布。

当作为[依赖项](multiplatform-add-dependencies.md)添加到公共源集中时，根发布会自动解析为相应的平台特定工件。

### 目标特定发布与根发布

Kotlin 多平台 Gradle 插件为每个目标配置独立的发布。考虑以下项目配置：

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

此设置将生成以下 Maven 发布：

**目标特定发布**

* 对于 `jvm` 目标：`test:lib-jvm:1.0`
* 对于 `iosX64` 目标：`test:lib-iosx64:1.0`
* 对于 `iosArm64` 目标：`test:lib-iosarm64:1.0`

每个目标特定发布都是独立的。例如，运行 `publishJvmPublicationTo<MavenRepositoryName>` 仅发布 JVM 模块，其他模块保持未发布状态。

**根发布**

`kotlinMultiplatform` 根发布：`test:lib:1.0`。

根发布作为入口点，引用所有目标特定的发布。它包含元数据工件，并通过包含对其他发布的引用（各个平台工件的预期 URL 和坐标）来确保正确的依赖解析。

* 某些仓库（如 Maven Central）要求根模块包含一个不带分类器的 JAR 工件，例如 `kotlinMultiplatform-1.0.jar`。Kotlin 多平台插件会自动生成带有嵌入式元数据工件的所需工件。这意味着您无需在库的根模块中手动添加空工件来满足仓库的要求。

  > 详细了解如何使用 [Gradle](multiplatform-configure-compilations.md#compilation-for-jvm) 和 [Maven](https://kotlinlang.org/docs/maven.html#create-jar-file) 构建系统生成 JAR 工件。
  >
  {style="tip"}

* 如果仓库有要求，`kotlinMultiplatform` 发布可能还需要源代码和文档工件。在这种情况下，请在发布的范围内使用 [`artifact()`](https://docs.gradle.org/current/javadoc/org/gradle/api/publish/maven/MavenPublication.html#artifact-java.lang.Object-)。

### 发布完整的库

要在一个步骤中发布所有必要的工件，请使用 `publishAllPublicationsTo<MavenRepositoryName>` 伞形任务。例如：

```bash
./gradlew publishAllPublicationsToGithubPackagesRepository
```

发布到 Maven Local 时，可以使用特殊任务：

```bash
./gradlew publishToMavenLocal
```

这些任务可确保所有目标特定发布和根发布被共同发布，从而使库完全可用于依赖解析。

或者，您也可以使用单独的发布任务。先运行根发布：

```bash
./gradlew publishKotlinMultiplatformPublicationToMavenLocal
```

此任务会发布一个包含目标特定发布信息的 `*.module` 文件，但目标本身仍未发布。要完成该过程，请分别发布每个目标特定的发布：

```bash
./gradlew publish<TargetName>PublicationToMavenLocal
```

这可以保证所有工件均可用并被正确引用。

## 主机要求

Kotlin/Native 支持交叉编译，允许任何主机生成必要的 `.klib` 工件。但是，您仍需注意一些限制。

### 为 Apple 目标编译

您可以使用任何主机为带有 Apple 项目目标生成工件。但是，在以下情况下您仍需使用 Mac 计算机：

* 您的库或依赖模块具有 [cinterop 依赖项](https://kotlinlang.org/docs/native-c-interop.html)。
* 您的项目中设置了 [CocoaPods 集成](multiplatform-cocoapods-overview.md)。
* 您需要为 Apple 目标构建或测试[最终二进制文件](multiplatform-build-native-binaries.md)。

### 避免重复发布

为了避免在仓库中产生重复发布，请从单个主机发布所有工件。例如，Maven Central 明确禁止重复发布，如果产生重复发布，发布过程将会失败。

## 发布 Android 库

要发布 Android 库，您需要提供额外的配置。默认情况下，Android 库的任何工件都不会被发布。

> 本节假设您使用的是 Android Gradle Library 插件。有关设置该插件或从旧版 `com.android.library` 插件迁移的指南，请参阅 Android 文档中的[设置 Android Gradle Library 插件](https://developer.android.com/kotlin/multiplatform/plugin#migrate)页面。
> 
{style="note"}

要发布工件，请将 `androidLibrary {}` 块添加到 `shared/build.gradle.kts` 文件中，并使用 KMP DSL 配置发布。例如：

```kotlin
kotlin {
    androidLibrary {
        namespace = "org.example.library"
        compileSdk = libs.versions.android.compileSdk.get().toInt()
        minSdk = libs.versions.android.minSdk.get().toInt()

        // 启用 Java 编译支持。
        // 在不需要 Java 编译时，这可以缩短构建时间
        withJava()

        compilations.configureEach {
            compilerOptions.configure {
                jvmTarget.set(
                    JvmTarget.JVM_11
                )
            }
        }
    }
}
```

请注意，Android Gradle Library 插件不支持 product flavors 和构建变体，从而简化了配置。因此，您需要选择启用以创建测试源集和配置。例如：

```kotlin
kotlin {
    androidLibrary {
        // ...

        // 选择启用并配置主机端（单元）测试
        withHostTestBuilder {}.configure {}

        // 选择启用设备测试，并指定源集名称
        withDeviceTestBuilder {
            sourceSetTreeName = "test"
        }

        // ...
    }
}
```

以前，例如在使用 GitHub 操作运行测试时，需要分别指定 debug 和 release 变体：

```yaml
- target: testDebugUnitTest
  os: ubuntu-latest
- target: testReleaseUnitTest
  os: ubuntu-latest
```

在使用 Android Gradle Library 插件时，您只需指定带有源集名称的通用目标：

```yaml
- target: testAndroidHostTest
  os: ubuntu-latest
```

## 禁用源代码发布

默认情况下，Kotlin 多平台 Gradle 插件会发布所有指定目标的源代码。但是，您可以在 `shared/build.gradle.kts` 文件中使用 `withSourcesJar()` API 配置并禁用源代码发布：

* 禁用所有目标的源代码发布：

  ```kotlin
  kotlin {
      withSourcesJar(publish = false)

      jvm()
      linuxX64()
  }
  ```

* 仅针对指定目标禁用源代码发布：

  ```kotlin
  kotlin {
       // 仅禁用 JVM 的源代码发布：
      jvm {
          withSourcesJar(publish = false)
      }
      linuxX64()
  }
  ```

* 禁用除指定目标以外的所有目标的源代码发布：

  ```kotlin
  kotlin {
      // 禁用除 JVM 以外所有目标的源代码发布：
      withSourcesJar(publish = false)

      jvm {
          withSourcesJar(publish = true)
      }
      linuxX64()
  }
  ```

## 推广您的库

您的库可以在 [JetBrains 的多平台库目录](https://klibs.io/)中展示。该目录旨在让开发者根据目标平台轻松查找 Kotlin 多平台库。

符合标准的库会被自动添加。有关如何确保您的库出现在目录中的更多信息，请参阅[常见问题解答 (FAQ)](https://klibs.io/faq)。

## 下一步

* [了解如何将您的 Kotlin 多平台库发布到 Maven Central 仓库](multiplatform-publish-libraries-to-maven.md)
* [参阅库作者指南，了解为 Kotlin 多平台设计库的最佳做法和技巧](https://kotlinlang.org/docs/api-guidelines-build-for-multiplatform.html)