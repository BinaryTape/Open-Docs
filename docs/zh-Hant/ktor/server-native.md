[//]: # (title: 原生伺服器)

<tldr>
<var name="example_name" value="embedded-server-native"/>
<p>
    <b>程式碼範例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>
Ktor 支援 Kotlin/Native，並允許您執行無需額外執行環境或虛擬機器的伺服器。
</link-summary>

Ktor 支援 [Kotlin/Native](https://kotlinlang.org/docs/native-overview.html)，並允許您執行無需額外執行環境或虛擬機器的伺服器。目前，在 Kotlin/Native 下執行 Ktor 伺服器有以下限制：
* 伺服器應使用 `embeddedServer` 建立
* 僅支援 [CIO 引擎](server-engines.md)
* 不支援沒有反向代理的 [HTTPS](server-ssl.md)
* 不支援 Windows [目標平台](server-platforms.md)

## 新增依賴項 {id="add-dependencies"}

在 Kotlin/Native 專案中的 Ktor 伺服器至少需要兩個依賴項：`ktor-server-core` 依賴項和一個引擎依賴項 (CIO)。下方的程式碼片段展示了如何在 `build.gradle.kts` 檔案的 `nativeMain` 原始碼集中新增依賴項：

```kotlin
sourceSets {
    val nativeMain by getting {
        dependencies {
            implementation("io.ktor:ktor-server-core:$ktor_version")
            implementation("io.ktor:ktor-server-cio:$ktor_version")
        }
    }
}
```

若要 [測試](server-testing.md) 原生伺服器，請將 `ktor-server-test-host` artifact 新增至 `nativeTest` 原始碼集：

```kotlin
sourceSets {
    val nativeTest by getting {
        dependencies {
            implementation(kotlin("test"))
            implementation("io.ktor:ktor-server-test-host:$ktor_version")
        }
    }
}
```

## 設定原生目標 {id="native-target"}

指定所需的原生目標，並使用 `binaries` 屬性 [宣告原生二進位檔](https://kotlinlang.org/docs/mpp-build-native-binaries.html)：

```kotlin
    val arch = System.getProperty("os.arch")
    val nativeTarget = when {
        hostOs == "Mac OS X" && arch == "x86_64" -> macosX64("native")
        hostOs == "Mac OS X" && arch == "aarch64" -> macosArm64("native")
        hostOs == "Linux" && arch == "x86_64" -> linuxX64("native")
        hostOs == "Linux" && arch == "aarch64" -> linuxArm64("native")
        // 其他支援的目標列於此處：https://ktor.io/docs/native-server.html#targets
        else -> throw GradleException("Host OS is not supported in Kotlin/Native.")
    }

    nativeTarget.apply {
        binaries {
            executable {
                entryPoint = "main"
            }
        }
    }
```

您可以在此處找到完整範例：[embedded-server-native](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server-native)。

## 建立伺服器 {id="create-server"}

配置 Gradle 建置指令碼後，您可以按照此處的說明建立 Ktor 伺服器：[建立伺服器](server-create-and-configure.topic)。