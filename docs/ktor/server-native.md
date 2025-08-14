[//]: # (title: 原生服务器)

<tldr>
<var name="example_name" value="embedded-server-native"/>

    <p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

<link-summary>
Ktor 支持 Kotlin/Native，允许您在没有额外运行时或虚拟机的情况下运行服务器。
</link-summary>

Ktor 支持 [Kotlin/Native](https://kotlinlang.org/docs/native-overview.html)，允许您在没有额外运行时或虚拟机的情况下运行服务器。目前，在 Kotlin/Native 下运行 Ktor 服务器存在以下限制：
* 服务器应使用 `embeddedServer` [创建](server-create-and-configure.topic)
* 仅支持 [CIO 引擎](server-engines.md)
* 不支持没有反向代理的 [HTTPS](server-ssl.md)
* 不支持 Windows [目标平台](server-platforms.md)

undefined

## 添加依赖项 {id="add-dependencies"}

Kotlin/Native 项目中的 Ktor 服务器至少需要两个依赖项：`ktor-server-core` 依赖项和一个引擎依赖项 (CIO)。以下代码片段展示了如何在 `build.gradle.kts` 文件中的 `nativeMain` 源代码集中添加依赖项：

[object Promise]

要[测试](server-testing.md)原生服务器，请将 `ktor-server-test-host` 构件添加到 `nativeTest` 源代码集：

[object Promise]

## 配置原生目标平台 {id="native-target"}

使用 `binaries` 属性指定所需的原生目标平台并[声明原生二进制文件](https://kotlinlang.org/docs/mpp-build-native-binaries.html)：

[object Promise]

您可以在此处找到完整示例：[embedded-server-native](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server-native)。

## 创建服务器 {id="create-server"}

配置 Gradle 构建脚本后，您可以按照此处所述创建 Ktor 服务器：[](server-create-and-configure.topic)。