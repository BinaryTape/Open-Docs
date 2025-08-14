[//]: # (title: 压缩)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-compression"/>
<var name="package_name" value="io.ktor.server.plugins.compression"/>
<var name="plugin_name" value="Compression"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="compression"/>

    <p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支持 Kotlin/Native 并允许您运行服务器，无需额外的运行时或虚拟机。">原生服务器</Links>支持</b>: ✖️
    </p>
    
</tldr>

Ktor 提供了压缩响应体和解压缩请求体的功能，通过使用 [Compression](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-compression/io.ktor.server.plugins.compression/-compression.html) 插件。
您可以使用不同的压缩算法，包括 `gzip` 和 `deflate`，指定压缩数据所需的条件（例如内容类型或响应大小），甚至可以根据特定的请求参数来压缩数据。

> 请注意，目前 `%plugin_name%` 插件不支持 `SSE` 响应。
>
{style="warning"}

> 要了解如何在 Ktor 中提供预压缩的静态文件，请参见 [](server-static-content.md#precompressed)。

## 添加依赖项 {id="add_dependencies"}

    <p>
        要使用 <code>%plugin_name%</code>，您需要将 <code>%artifact_name%</code> artifact 包含到构建脚本中：
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
        要将 <code>%plugin_name%</code> 插件<a href="#install">安装</a>到应用程序，
        请将其传递给指定 <Links href="/ktor/server-modules" summary="模块允许您通过对路由进行分组来构建应用程序结构。">module</Links> 中的 <code>install</code> 函数。
        下面的代码片段展示了如何安装 <code>%plugin_name%</code> ...
    </p>
    <list>
        <li>
            ... 在 <code>embeddedServer</code> 函数调用中。
        </li>
        <li>
            ... 在显式定义的 <code>module</code> 中，这是一个 <code>Application</code> 类的扩展函数。
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
    

这会在服务器上启用 `gzip`、`deflate` 和 `identity` 编码器。
在下一章中，我们将了解如何仅启用特定的编码器以及配置数据压缩的条件。
请注意，每个添加的编码器都将在需要时用于解压缩请求体。

## 配置压缩设置 {id="configure"}

您可以通过多种方式配置压缩：仅启用特定的编码器，指定它们的优先级，仅压缩特定的内容类型，等等。

### 添加特定编码器 {id="add_specific_encoders"}

要仅启用特定的编码器，请调用相应的扩展函数，例如：

```kotlin
install(Compression) {
    gzip()
    deflate()
}
```

您可以通过为每个压缩算法设置 `priority` 属性来指定优先级：

```kotlin
install(Compression) {
    gzip {
        priority = 0.9
    }
    deflate {
        priority = 1.0
    }
}
```

在上面的示例中，`deflate` 具有更高的优先级值并优先于 `gzip`。请注意，服务器首先查看 [Accept-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding) 标头中的 [质量](https://developer.mozilla.org/en-US/docs/Glossary/Quality_Values) 值，然后考虑指定的优先级。

### 配置内容类型 {id="configure_content_type"}

默认情况下，Ktor 不会压缩特定的内容类型，例如 `audio`、`video`、`image` 和 `text/event-stream`。
您可以通过调用 `matchContentType` 来选择要压缩的内容类型，或者使用 `excludeContentType` 将所需的媒体类型从压缩中排除。下面的代码片段展示了如何使用 `gzip` 压缩 JavaScript 代码以及使用 `deflate` 压缩所有文本子类型：

[object Promise]

您可以在此处找到完整示例：[compression](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/compression)。

### 配置响应大小 {id="configure_response_size"}

`%plugin_name%` 插件允许您对大小不超过指定值的响应禁用压缩。为此，请将所需值（以字节为单位）传递给 `minimumSize` 函数：

```kotlin
    install(Compression) {
        deflate {
            minimumSize(1024)
        }
    }

```

### 指定自定义条件 {id="specify_custom_conditions"}

如有必要，您可以提供一个自定义条件，使用 `condition` 函数并根据特定的请求参数压缩数据。下面的代码片段展示了如何压缩指定 URI 的请求：

```kotlin
install(Compression) {
    gzip {
        condition {
            request.uri == "/orders"
        }
    }
}
```

## HTTPS 安全性 {id="security"}

启用压缩的 HTTPS 容易受到 [BREACH](https://en.wikipedia.org/wiki/BREACH) 攻击。您可以使用各种方法来缓解此攻击。例如，只要 referrer 标头指示跨站请求，您就可以禁用压缩。在 Ktor 中，这可以通过检测 referrer 标头值来完成：

```kotlin
install(Compression) {
    gzip {
        condition {
            request.headers[HttpHeaders.Referrer]?.startsWith("https://my.domain/") == true
        }
    }
}
```

## 实现自定义编码器 {id="custom_encoder"}

如有必要，您可以通过实现 [ContentEncoder](https://api.ktor.io/ktor-utils/io.ktor.util/-content-encoder/index.html) 接口来提供自己的编码器。
请参见 [GzipEncoder](https://github.com/ktorio/ktor/blob/b5b59ca3ae61601e6175f334e6a1252609638e61/ktor-server/ktor-server-plugins/ktor-server-compression/jvm/src/io/ktor/server/plugins/compression/Encoders.kt#L41) 作为实现示例。