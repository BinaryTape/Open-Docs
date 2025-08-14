[//]: # (title: 多平台)

<tldr>
<p>
代码示例：<a href="https://github.com/ktorio/ktor-samples/tree/main/client-mpp">client-mpp</a>
</p>
</tldr>

<link-summary>
Ktor 客户端可用于多平台项目，并支持 Android、JavaScript 和 Native 平台。
</link-summary>

[Ktor HTTP 客户端](client-create-and-configure.md)可用于[多平台项目](https://kotlinlang.org/docs/multiplatform.html)，并支持以下平台：
* JVM
* [Android](https://kotlinlang.org/docs/android-overview.html)
* [JavaScript](https://kotlinlang.org/docs/js-overview.html)
* [Native](https://kotlinlang.org/docs/native-overview.html)

## 添加依赖项 {id="add-dependencies"}
要在你的项目中使 用 Ktor HTTP 客户端，你需要至少添加两个依赖项：一个客户端依赖项和一个[引擎](client-engines.md)依赖项。对于多平台项目，你需要按以下方式添加这些依赖项：
1.  要在公共代码中使用 Ktor 客户端，请在 `build.gradle` 或 `build.gradle.kts` 文件中的 `commonMain` 源代码集中添加 `ktor-client-core` 依赖项：
    <var name="platform_name" value="common"/>
    <var name="artifact_name" value="ktor-client-core"/>

    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
    </tabs>

2.  为所需平台将[引擎依赖项](client-engines.md#dependencies)添加到相应的源代码集。对于 Android，你可以将 [Android](client-engines.md#android) 引擎依赖项添加到 `androidMain` 源代码集：
    <var name="platform_name" value="android"/>
    <var name="artifact_name" value="ktor-client-android"/>

    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
    </tabs>

    对于 iOS，你需要将 [Darwin](client-engines.md#darwin) 引擎依赖项添加到 `iosMain`：
    <var name="platform_name" value="ios"/>
    <var name="artifact_name" value="ktor-client-darwin"/>

    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
    </tabs>

    要了解每个平台支持哪些引擎，请参见 [](client-engines.md#dependencies)。

## 创建客户端 {id="create-client"}
要在多平台项目中创建客户端，请在项目的[公共代码](https://kotlinlang.org/docs/mpp-discover-project.html#source-sets)中调用 [HttpClient](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client/index.html) 构造函数：

[object Promise]

在此代码片段中，`HttpClient` 构造函数不接受引擎作为参数：客户端将根据[构建脚本中添加的构件](#add-dependencies)为所需平台选择一个引擎。

如果你需要为特定平台调整引擎配置，请将相应的引擎类作为实参传递给 `HttpClient` 构造函数，并使用 `engine` 方法配置引擎，例如：
[object Promise]

你可以通过 [](client-engines.md) 了解如何配置所有引擎类型。

## 代码示例 {id="code-example"}

[mpp/client-mpp](https://github.com/ktorio/ktor-samples/tree/main/client-mpp) 项目展示了如何在多平台应用程序中使用 Ktor 客户端。此应用程序可在以下平台运行：`Android`、`iOS`、`JavaScript` 和 `macosX64`。