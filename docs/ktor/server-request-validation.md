[//]: # (title: 请求验证)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="RequestValidation"/>
<var name="package_name" value="io.ktor.server.plugins.requestvalidation"/>
<var name="artifact_name" value="ktor-server-request-validation"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="request-validation"/>

    <p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支持 Kotlin/Native，并允许您在没有额外运行时或虚拟机的情况下运行服务器。">原生服务器</Links> 支持</b>: ✅
    </p>
    
</tldr>

<link-summary>
%plugin_name% 提供了验证传入请求请求体的功能。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-request-validation/io.ktor.server.plugins.requestvalidation/-request-validation.html) 插件提供了验证传入请求请求体的功能。如果安装了带有[序列化器](server-serialization.md#configure_serializer)的 `ContentNegotiation` 插件，您可以验证原始请求体或指定的请求对象属性。如果请求体验证失败，该插件会抛出 `RequestValidationException` 异常，此异常可以使用 [StatusPages](server-status-pages.md) 插件进行处理。

## 添加依赖项 {id="add_dependencies"}

    <p>
        要使用 <code>%plugin_name%</code>，您需要将 <code>%artifact_name%</code> 构件包含在构建脚本中:
    </p>
    

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
    

## 安装 %plugin_name% {id="install_plugin"}

    <p>
        要[安装](#install) <code>%plugin_name%</code> 插件到应用程序，
        将其传递给指定<Links href="/ktor/server-modules" summary="模块允许您通过对路由进行分组来组织您的应用程序。">模块</Links>中的 <code>install</code> 函数。
        下面的代码片段展示了如何安装 <code>%plugin_name%</code> ...
    </p>
    <list>
        <li>
            ... 在 <code>embeddedServer</code> 函数调用内部。
        </li>
        <li>
            ... 在显式定义的 <code>module</code> 内部，它是 <code>Application</code> 类的扩展函数。
        </li>
    </list>
    <tabs>
        <tab title="embeddedServer">
            [object Promise]
        </tab>
        <tab title="module">
            [object Promise]
        </tab>
    </tabs>
    

    <p>
        <code>%plugin_name%</code> 插件也可以[安装到特定路由](#install-route)。
        如果您需要针对不同的应用程序资源使用不同的 <code>%plugin_name%</code> 配置，这可能很有用。
    </p>
    

## 配置 %plugin_name% {id="configure"}

配置 `%plugin_name%` 涉及三个主要步骤:

1. [接收请求体内容](#receive-body)。
2. [配置验证函数](#validation-function)。
3. [处理验证异常](#validation-exception)。

### 1. 接收请求体 {id="receive-body"}

%plugin_name% 插件在您使用类型形参调用 **[receive](server-requests.md#body_contents)** 函数时，会验证请求的请求体。例如，下面的代码片段展示了如何将请求体作为 `String` 值接收：

[object Promise]

### 2. 配置验证函数 {id="validation-function"}

要验证请求体，请使用 `validate` 函数。
此函数返回一个 `ValidationResult` 对象，表示成功或不成功的验证结果。
对于不成功的结果，会抛出 **[RequestValidationException](#validation-exception)** 异常。

`validate` 函数有两个重载，允许您以两种方式验证请求体:

- 第一个 `validate` 重载允许您以指定类型的对象形式访问请求体。
   下面的示例展示了如何验证表示 `String` 值的请求体：
   [object Promise]

   如果您已安装配置了特定[序列化器](server-serialization.md#configure_serializer)的 `ContentNegotiation` 插件，您可以验证对象属性。更多信息请参见 [](#example-object)。

- 第二个 `validate` 重载接受 `ValidatorBuilder`，并允许您提供自定义验证规则。
   您可以从 [](#example-byte-array) 了解更多信息。

### 3. 处理验证异常 {id="validation-exception"}

如果请求验证失败，%plugin_name% 会抛出 `RequestValidationException` 异常。
此异常允许您访问请求体，并获取此请求所有验证失败的原因。

您可以使用 [StatusPages](server-status-pages.md) 插件处理 `RequestValidationException` 异常，如下所示:

[object Promise]

您可以在此处找到完整示例：[request-validation](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/request-validation)。

## 示例：验证对象属性 {id="example-object"}

在此示例中，我们将了解如何使用 `%plugin_name%` 插件验证对象属性。
假设服务器收到一个 `POST` 请求，包含以下 JSON 数据:

[object Promise]

要添加 `id` 属性的验证，请遵循以下步骤:

1. 创建描述上述 JSON 对象的 `Customer` 数据类：
   [object Promise]

2. 安装使用 [JSON 序列化器](server-serialization.md#register_json) 的 `ContentNegotiation` 插件：
   [object Promise]

3. 在服务器端接收 `Customer` 对象，如下所示：
   [object Promise]
4. 在 `%plugin_name%` 插件配置中，添加对 `id` 属性的验证，以确保它落在指定区间内：
   [object Promise]
   
   在这种情况下，如果 `id` 值小于或等于 `0`，%plugin_name% 将抛出 **[RequestValidationException](#validation-exception)** 异常。

## 示例：验证字节数组 {id="example-byte-array"}

在此示例中，我们将了解如何验证以字节数组形式接收的请求体。
假设服务器收到一个 `POST` 请求，包含以下文本数据:

[object Promise]

要以字节数组形式接收数据并验证它，请执行以下步骤:

1. 在服务器端接收数据，如下所示：
   [object Promise]
2. 要验证接收到的数据，我们将使用第二个 `validate` [函数重载](#validation-function)，它接受 `ValidatorBuilder` 并允许您提供自定义验证规则：
   [object Promise]

    ```