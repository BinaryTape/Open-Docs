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
Ktor 支持 Kotlin/Native，并允许你在无需额外运行时或虚拟机的情况下运行服务器。
</link-summary>

Ktor 支持 [Kotlin/Native](https://kotlinlang.org/docs/native-overview.html)，并允许你在无需额外运行时或虚拟机的情况下运行服务器。目前，在 Kotlin/Native 下运行 Ktor 服务器存在以下限制：
* 服务器应使用 `embeddedServer` 创建
* 仅支持 [CIO 引擎](server-engines.md)
* [HTTPS](server-ssl.md) 不支持不带反向代理

未定义

## 添加依赖项 {id="add-dependencies"}

Kotlin/Native 项目中的 Ktor 服务器至少需要两个依赖项：`ktor-server-core` 依赖项和引擎依赖项 (CIO)。下面的代码片段展示了如何在 `build.gradle.kts` 文件中的 `nativeMain` 源代码集中添加依赖项：

```kotlin
}
sourceSets {
    val nativeMain by getting {
        dependencies {
            implementation("io.ktor:ktor-server-core:$ktor_version")
            implementation("io.ktor:ktor-server-cio:$ktor_version")
        }
    }
```

要[测试](server-testing.md)原生服务器，请将 `ktor-server-test-host` 构件添加到 `nativeTest` 源代码集：

```kotlin
}
    }
    val nativeTest by getting {
        dependencies {
            implementation(kotlin("test"))
            implementation("io.ktor:ktor-server-test-host:$ktor_version")
        }
    }
```

## 配置原生目标 {id="native-target"}

使用 `binaries` 属性指定所需的原生目标并[声明原生二进制文件](https://kotlinlang.org/docs/mpp-build-native-binaries.html)：

```kotlin
    val arch = System.getProperty("os.arch")
    val nativeTarget = when {
        hostOs == "Mac OS X" && arch == "x86_64" -> macosX64("native")
        hostOs == "Mac OS X" && arch == "aarch64" -> macosArm64("native")
        hostOs == "Linux" && arch == "x86_64" -> linuxX64("native")
        hostOs == "Linux" && arch == "aarch64" -> linuxArm64("native")
        hostOs.startsWith("Windows") -> mingwX64("native")
        // Other supported targets are listed here: https://ktor.io/docs/server-native.html#targets
        else -> throw GradleException("Host OS is not supported in Kotlin/Native.")
    }

    nativeTarget.apply {
        binaries {
            executable {
                entryPoint = "main"
            }
        }
```

你可以在此处找到完整示例：[embedded-server-native](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server-native)。

## 创建服务器 {id="create-server"}

配置好 Gradle 构建脚本后，你可以按照此处描述创建 Ktor 服务器：[创建服务器](server-create-and-configure.topic)。