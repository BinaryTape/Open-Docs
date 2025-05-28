[//]: # (title: 添加客户端依赖)

<show-structure for="chapter" depth="2"/>

<link-summary>了解如何向现有项目添加客户端依赖。</link-summary>

要在你的项目中使用 Ktor HTTP 客户端，你需要[配置仓库](#repositories)并添加以下依赖：

- **[ktor-client-core](#client-dependency)**

  `ktor-client-core` 包含 Ktor 客户端核心功能。
- **[引擎依赖](#engine-dependency)**

  引擎用于处理网络请求。
  请注意，[特定平台](client-supported-platforms.md)可能需要处理网络请求的特定引擎。
- (可选) **[日志依赖](#logging-dependency)**

  提供一个日志框架以启用结构化和灵活的日志功能。

- (可选) **[插件依赖](#plugin-dependency)**

  插件用于扩展客户端的特定功能。

<include from="server-dependencies.topic" element-id="repositories"/>

## 添加依赖 {id="add-ktor-dependencies"}

> 对于[不同平台](client-supported-platforms.md)，Ktor 提供带有 `-jvm` 或 `-js` 等后缀的平台特定 artifact，例如 `ktor-client-core-jvm`。请注意，Gradle 会自动解析适合给定平台的 artifact，而 Maven 不支持此功能。这意味着对于 Maven，你需要手动添加平台特定后缀。
>
{type="tip"}

### 客户端依赖 {id="client-dependency"}

主要客户端功能在 `ktor-client-core` artifact 中可用。根据你的构建系统，你可以通过以下方式添加它：

<var name="artifact_name" value="ktor-client-core"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

你可以将 `$ktor_version` 替换为所需的 Ktor 版本，例如 `%ktor_version%`。

#### 多平台 {id="client-dependency-multiplatform"}

对于多平台项目，你可以在 `gradle/libs.versions.toml` 文件中定义 Ktor 版本和 `ktor-client-core` artifact：

```kotlin
```

{src="snippets/tutorial-client-kmm/gradle/libs.versions.toml" include-lines="1,5,10-11,19"}

然后，将 `ktor-client-core` 作为依赖添加到 `commonMain` 源集：

```kotlin
```

{src="snippets/tutorial-client-kmm/shared/build.gradle.kts" include-lines="26-28,30,40"}

### 引擎依赖 {id="engine-dependency"}

一个[引擎](client-engines.md)负责处理网络请求。有适用于各种平台的客户端引擎，例如 Apache、CIO、Android、iOS 等。例如，你可以按如下方式添加 `CIO` 引擎依赖：

<var name="artifact_name" value="ktor-client-cio"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

#### 多平台 {id="engine-dependency-multiplatform"}

对于多平台项目，你需要将所需引擎的依赖添加到相应的源集。

例如，要为 Android 添加 `OkHttp` 引擎依赖，你可以首先在 `gradle/libs.versions.toml` 文件中定义 Ktor 版本和 `ktor-client-okhttp` artifact：

```kotlin
```

{src="snippets/tutorial-client-kmm/gradle/libs.versions.toml" include-lines="1,5,10-11,20"}

然后，将 `ktor-client-okhttp` 作为依赖添加到 `androidMain` 源集：

```kotlin
```

{src="snippets/tutorial-client-kmm/shared/build.gradle.kts" include-lines="26,34-36,40"}

有关特定引擎所需依赖的完整列表，请参阅 [](client-engines.md#dependencies)。

### 日志依赖

<include from="client-logging.md" element-id="jvm-logging"/>

有关 Ktor 中日志的更多信息，请参阅 [](client-logging.md)。

### 插件依赖 {id="plugin-dependency"}

Ktor 允许你使用默认不提供的额外客户端功能（[插件](client-plugins.md)），例如授权和序列化。其中一些功能以单独的 artifact 提供。你可以从所需插件的主题中了解你需要哪些依赖。

> 对于多平台项目，插件依赖应添加到 `commonMain` 源集。请注意，某些插件可能对特定平台有[限制](client-engines.md#limitations)。

```