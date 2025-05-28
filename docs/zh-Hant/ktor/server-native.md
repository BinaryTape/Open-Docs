[//]: # (title: 原生伺服器)

<tldr>
<var name="example_name" value="embedded-server-native"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
Ktor 支援 Kotlin/Native，並允許您無需額外的執行環境或虛擬機器即可執行伺服器。
</link-summary>

Ktor 支援 [Kotlin/Native](https://kotlinlang.org/docs/native-overview.html)，並允許您無需額外的執行環境或虛擬機器即可執行伺服器。目前，在 Kotlin/Native 下執行 Ktor 伺服器存在以下限制：
* 伺服器應使用 `embeddedServer` [建立](server-create-and-configure.topic)
* 僅支援 [CIO 引擎](server-engines.md)
* 不支援沒有反向代理的 [HTTPS](server-ssl.md)
* 不支援 Windows [目標](server-platforms.md)

<include from="client-engines.md" element-id="newmm-note"/>

## 新增依賴項 {id="add-dependencies"}

Kotlin/Native 專案中的 Ktor 伺服器至少需要兩個依賴項：一個 `ktor-server-core` 依賴項和一個引擎依賴項 (CIO)。下方程式碼片段顯示如何在 `build.gradle.kts` 檔案的 `nativeMain` 原始碼集中新增依賴項：

```kotlin
```
{src="snippets/embedded-server-native/build.gradle.kts" include-lines="33-39,46"}

若要[測試](server-testing.md)原生伺服器，請將 `ktor-server-test-host` Artifact 新增到 `nativeTest` 原始碼集：

```kotlin
```
{src="snippets/embedded-server-native/build.gradle.kts" include-lines="33,40-46"}

## 配置原生目標 {id="native-target"}

指定所需的原生目標，並使用 `binaries` 屬性[宣告原生二進位檔](https://kotlinlang.org/docs/mpp-build-native-binaries.html)：

```kotlin
```
{src="snippets/embedded-server-native/build.gradle.kts" include-lines="16-32"}

您可以在這裡找到完整範例：[embedded-server-native](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server-native)。

## 建立伺服器 {id="create-server"}

配置您的 Gradle 建置腳本後，您可以[建立](server-create-and-configure.topic) Ktor 伺服器，如下所述。