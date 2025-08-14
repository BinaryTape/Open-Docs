[//]: # (title: 添加客户端依赖项)

<show-structure for="chapter" depth="2"/>

<link-summary>了解如何向现有项目添加客户端依赖项。</link-summary>

要在项目中运用 Ktor HTTP 客户端，您需要[配置版本库](#repositories)并添加以下依赖项：

- **[ktor-client-core](#client-dependency)**

  `ktor-client-core` 包含 Ktor 客户端的核心功能。
- **[引擎依赖项](#engine-dependency)**

  引擎用于处理网络请求。
  请注意，[特定平台](client-supported-platforms.md)可能需要特定的引擎来处理网络请求。
- (可选) **[日志依赖项](#logging-dependency)**

  提供日志框架以启用结构化和灵活的日志记录功能。

- (可选) **[插件依赖项](#plugin-dependency)**

  插件用于通过特定功能扩展客户端。

## 添加依赖项 {id="add-ktor-dependencies"}

> 对于[不同平台](client-supported-platforms.md)，Ktor 提供了带有 `-jvm` 或 `-js` 等后缀的平台特有构件，例如 `ktor-client-core-jvm`。请注意，Gradle 会自动解析适合给定平台的构件，而 Maven 不支持此功能。这意味着对于 Maven，您需要手动添加平台特有的后缀。
>
{type="tip"}

### 客户端依赖项 {id="client-dependency"}

主要客户端功能可在 `ktor-client-core` 构件中获取。根据您的构建系统，您可以通过以下方式添加它：

<var name="artifact_name" value="ktor-client-core"/>

    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    

您可以将 `$ktor_version` 替换为所需的 Ktor 版本，例如 `%ktor_version%`。

#### 多平台 {id="client-dependency-multiplatform"}

对于多平台项目，您可以在 `gradle/libs.versions.toml` 文件中定义 Ktor 版本和 `ktor-client-core` 构件：

[object Promise]

然后，将 `ktor-client-core` 作为依赖项添加到 `commonMain` 源代码集：

[object Promise]

### 引擎依赖项 {id="engine-dependency"}

[引擎](client-engines.md)负责处理网络请求。有适用于各种平台的不同客户端引擎，例如 Apache、CIO、Android、iOS 等。例如，您可以按如下方式添加 `CIO` 引擎依赖项：

<var name="artifact_name" value="ktor-client-cio"/>

    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    

#### 多平台 {id="engine-dependency-multiplatform"}

对于多平台项目，您需要将所需引擎的依赖项添加到相应的源代码集。

例如，要为 Android 添加 `OkHttp` 引擎依赖项，您可以首先在 `gradle/libs.versions.toml` 文件中定义 Ktor 版本和 `ktor-client-okhttp` 构件：

[object Promise]

然后，将 `ktor-client-okhttp` 作为依赖项添加到 `androidMain` 源代码集：

[object Promise]

有关特定引擎所需的完整依赖项列表，请参见 [](client-engines.md#dependencies)。

### 日志依赖项

<snippet id="jvm-logging">
  <p>
在 <a href="#jvm">JVM</a> 上，Ktor 使用 Java 简单日志门面 (<a href="http://www.slf4j.org/">SLF4J</a>) 作为日志记录的抽象层。SLF4J 将日志 API 与底层日志实现解耦，使您能够集成最适合您的应用程序需求的日志框架。常见的选择包括 <a href="https://logback.qos.ch/">Logback</a> 或 <a href="https://logging.apache.org/log4j">Log4j</a>。如果未提供框架，SLF4J 将默认为无操作 (NOP) 实现，这会基本禁用日志记录。
  </p>

  <p>
要启用日志记录，请包含一个带有所需 SLF4J 实现的构件，例如 <a href="https://logback.qos.ch/">Logback</a>：
  </p>
  <var name="group_id" value="ch.qos.logback"/>
  <var name="artifact_name" value="logback-classic"/>
  <var name="version" value="logback_version"/>
  <include from="lib.topic" element-id="add_artifact"/>
</snippet>

有关 Ktor 中日志记录的更多信息，请参见 [](client-logging.md)。

### 插件依赖项 {id="plugin-dependency"}

Ktor 允许您使用默认不提供的额外客户端功能（[插件](client-plugins.md)），例如授权和序列化。其中一些功能在单独的构件中提供。您可以从所需插件的主题中了解您需要的依赖项。

> 对于多平台项目，插件依赖项应添加到 `commonMain` 源代码集。请注意，某些插件可能对特定平台存在[限制](client-engines.md#limitations)。

## 确保 Ktor 版本一致性

<chapter title="使用 Ktor BOM 依赖项">

Ktor BOM 允许您确保所有 Ktor 模块使用相同的、一致的版本，而无需单独指定每个依赖项的版本。

要添加 Ktor BOM 依赖项，请在您的构建脚本中声明它，如下所示：

<tabs group="languages">
    <tab title="Gradle (Kotlin)" group-key="kotlin">
        [object Promise]
    </tab>
    <tab title="Gradle (Groovy)" group-key="groovy">
        [object Promise]
    </tab>
    <tab title="Maven" group-key="maven">
        [object Promise]
    </tab>
</tabs>
</chapter>

<var name="target_module" value="client"/>