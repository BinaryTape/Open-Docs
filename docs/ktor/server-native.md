[//]: # (title: 原生服务器)

<tldr>
<var name="example_name" value="embedded-server-native"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
Ktor 支持 Kotlin/Native，并允许您在无需额外运行时或虚拟机的情况下运行服务器。
</link-summary>

Ktor 支持 [Kotlin/Native](https://kotlinlang.org/docs/native-overview.html)，并允许您在无需额外运行时或虚拟机的情况下运行服务器。目前，在 Kotlin/Native 下运行 Ktor 服务器存在以下限制：
* [服务器应使用 `embeddedServer` 创建](server-create-and-configure.topic)
* 仅支持 [CIO 引擎](server-engines.md)
* 不支持没有反向代理的 [HTTPS](server-ssl.md)
* 不支持 Windows [目标](server-platforms.md)

<include from="client-engines.md" element-id="newmm-note"/>

## 添加依赖项 {id="add-dependencies"}

Kotlin/Native 项目中的 Ktor 服务器至少需要两个依赖项：`ktor-server-core` 依赖项和一个引擎依赖项 (CIO)。下面的代码片段展示了如何在 `build.gradle.kts` 文件中的 `nativeMain` 源集中添加依赖项：

```kotlin
```
{src="snippets/embedded-server-native/build.gradle.kts" include-lines="33-39,46"}

要[测试](server-testing.md)原生服务器，请将 `ktor-server-test-host` artifact 添加到 `nativeTest` 源集：

```kotlin
```
{src="snippets/embedded-server-native/build.gradle.kts" include-lines="33,40-46"}

## 配置原生目标 {id="native-target"}

指定所需的原生目标，并使用 `binaries` 属性[声明原生二进制文件](https://kotlinlang.org/docs/mpp-build-native-binaries.html)：

```kotlin
```
{src="snippets/embedded-server-native/build.gradle.kts" include-lines="16-32"}

您可以在此处找到完整示例：[embedded-server-native](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server-native)。

## 创建服务器 {id="create-server"}

配置好 Gradle 构建脚本后，您可以按照此处所述创建 Ktor 服务器：[](server-create-and-configure.topic)。