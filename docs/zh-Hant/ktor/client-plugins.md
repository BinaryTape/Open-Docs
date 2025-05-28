[//]: # (title: 客戶端外掛)

<link-summary>
了解提供常見功能的各種外掛，例如記錄、序列化、授權等。
</link-summary>

許多應用程式需要超出其應用程式邏輯範圍的常見功能。這可能包括[記錄](client-logging.md)、[序列化](client-serialization.md)或[授權](client-auth.md)等功能。所有這些功能都由 Ktor 透過我們稱之為 **外掛 (Plugins)** 的方式提供。

## 新增外掛相依性 {id="plugin-dependency"}
一個外掛可能需要單獨的[相依性](client-dependencies.md)。例如，[記錄](client-logging.md)外掛需要在建置腳本中新增 `ktor-client-logging` artifact：

<var name="artifact_name" value="ktor-client-logging"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

你可以從所需外掛的主題中了解你需要哪些相依性。

## 安裝外掛 {id="install"}
要安裝外掛，你需要將其傳遞給[客戶端配置區塊](client-create-and-configure.md#configure-client)內的 `install` 函數。例如，安裝 `Logging` 外掛如下所示：

```kotlin
```
{src="snippets/_misc_client/InstallLoggingPlugin.kt"}

## 配置外掛 {id="configure_plugin"}
你可以在 `install` 區塊內配置外掛。例如，對於[記錄](client-logging.md)外掛，你可以指定記錄器、記錄等級以及篩選記錄訊息的條件：
```kotlin
```
{src="snippets/client-logging/src/main/kotlin/com/example/Application.kt" include-lines="12-20"}

## 建立自訂外掛 {id="custom"}
要了解如何建立自訂外掛，請參閱 [](client-custom-plugins.md)。