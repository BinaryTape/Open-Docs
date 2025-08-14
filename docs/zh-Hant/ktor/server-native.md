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
Ktor 支援 Kotlin/Native，並允許您在沒有額外執行時或虛擬機器的情況下執行伺服器。
</link-summary>

Ktor 支援 [Kotlin/Native](https://kotlinlang.org/docs/native-overview.html)，並允許您在沒有額外執行時或虛擬機器的情況下執行伺服器。目前，在 Kotlin/Native 下執行 Ktor 伺服器有以下限制：
*   應使用 `embeddedServer` [建立伺服器](server-create-and-configure.topic)
*   僅支援 [CIO 引擎](server-engines.md)
*   不支援沒有反向代理的 [HTTPS](server-ssl.md)
*   不支援 Windows [目標](server-platforms.md)

undefined

## 新增依賴項 {id="add-dependencies"}

Kotlin/Native 專案中的 Ktor 伺服器至少需要兩個依賴項：`ktor-server-core` 依賴項和一個引擎依賴項 (CIO)。下面的程式碼片段顯示了如何在 `build.gradle.kts` 檔案的 `nativeMain` 來源集中新增依賴項：

[object Promise]

若要[測試](server-testing.md)原生伺服器，請將 `ktor-server-test-host` artifact 新增到 `nativeTest` 來源集：

[object Promise]

## 配置原生目標 {id="native-target"}

使用 `binaries` 屬性指定所需的原生目標並[宣告原生二進位檔](https://kotlinlang.org/docs/mpp-build-native-binaries.html)：

[object Promise]

您可以在這裡找到完整範例：[embedded-server-native](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server-native)。

## 建立伺服器 {id="create-server"}

配置 Gradle 建置腳本後，您可以依照這裡的說明建立 Ktor 伺服器：[](server-create-and-configure.topic)。