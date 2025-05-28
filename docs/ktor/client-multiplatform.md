[//]: # (title: 多平台)

<tldr>
<p>
代码示例：<a href="https://github.com/ktorio/ktor-samples/tree/main/client-mpp">client-mpp</a>
</p>
</tldr>

<link-summary>
Ktor 客户端可用于多平台项目，并支持 Android、JavaScript 和原生平台。
</link-summary>

[Ktor HTTP 客户端](client-create-and-configure.md) 可用于[多平台项目](https://kotlinlang.org/docs/multiplatform.html)，并支持以下平台：
* JVM
* [Android](https://kotlinlang.org/docs/android-overview.html)
* [JavaScript](https://kotlinlang.org/docs/js-overview.html)
* [原生](https://kotlinlang.org/docs/native-overview.html)

## 添加依赖项 {id="add-dependencies"}
要在您的项目中使用 Ktor HTTP 客户端，您需要添加至少两个依赖项：一个客户端依赖项和一个[引擎](client-engines.md)依赖项。对于多平台项目，您需要按以下方式添加这些依赖项：
1. 要在通用代码中使用 Ktor 客户端，请在 `build.gradle` 或 `build.gradle.kts` 文件中，将 `ktor-client-core` 依赖项添加到 `commonMain` 源集：
   <var name="platform_name" value="common"/>
   <var name="artifact_name" value="ktor-client-core"/>
   <include from="lib.topic" element-id="add_ktor_artifact_multiplatform"/>
1. 为所需平台将[引擎依赖项](client-engines.md#dependencies)添加到相应的源集。对于 Android，您可以将 [Android](client-engines.md#android) 引擎依赖项添加到 `androidMain` 源集：
   <var name="platform_name" value="android"/>
   <var name="artifact_name" value="ktor-client-android"/>
   <include from="lib.topic" element-id="add_ktor_artifact_multiplatform"/>
   
   对于 iOS，您需要将 [Darwin](client-engines.md#darwin) 引擎依赖项添加到 `iosMain`：
   <var name="platform_name" value="ios"/>
   <var name="artifact_name" value="ktor-client-darwin"/>
   <include from="lib.topic" element-id="add_ktor_artifact_multiplatform"/>
   
   要了解每个平台支持哪些引擎，请参阅 [](client-engines.md#dependencies)。

## 创建客户端 {id="create-client"}
要在多平台项目中创建客户端，请在项目的[通用代码](https://kotlinlang.org/docs/mpp-discover-project.html#source-sets)中调用 [HttpClient](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client/index.html) 构造函数：

```kotlin
```
{src="snippets/_misc_client/DefaultEngineCreate.kt"}

在此代码片段中，`HttpClient` 构造函数不接受引擎作为参数：客户端将根据在[构建脚本中添加的工件](#add-dependencies)为所需平台选择一个引擎。

如果您需要为特定平台调整引擎配置，请将相应的引擎类作为参数传递给 `HttpClient` 构造函数，并使用 `engine` 方法配置引擎，例如：
```kotlin
```
{src="snippets/_misc_client/AndroidConfig.kt" interpolate-variables="true" disable-links="false"}

您可以从 [](client-engines.md) 了解如何配置所有引擎类型。

## 代码示例 {id="code-example"}

[mpp/client-mpp](https://github.com/ktorio/ktor-samples/tree/main/client-mpp) 项目展示了如何在多平台应用程序中使用 Ktor 客户端。此应用程序可在以下平台运行：`Android`、`iOS`、`JavaScript` 和 `macosX64`。