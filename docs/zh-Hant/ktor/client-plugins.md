[//]: # (title: 客戶端插件)

<link-summary>
熟悉提供常用功能（例如日誌記錄、序列化、授權等）的插件。
</link-summary>

許多應用程式需要超出應用程式邏輯範疇的常用功能。這可能包括 [日誌記錄](client-logging.md)、[序列化](client-serialization.md) 或 [授權](client-auth.md) 等。所有這些功能都透過我們稱之為 **Plugins** 的方式在 Ktor 中提供。

## 添加插件依賴項 {id="plugin-dependency"}
插件可能需要獨立的 [依賴項](client-dependencies.md)。例如，[Logging](client-logging.md) 插件要求在構建腳本中添加 `ktor-client-logging` artifact：

<var name="artifact_name" value="ktor-client-logging"/>

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
    

你可以從所需插件的主題中了解你需要哪些依賴項。

## 安裝插件 {id="install"}
要安裝插件，你需要將其傳遞給 [客戶端配置塊](client-create-and-configure.md#configure-client) 內的 `install` 函數。例如，安裝 `Logging` 插件如下所示：

[object Promise]

## 配置插件 {id="configure_plugin"}
你可以在 `install` 塊中配置插件。例如，對於 [Logging](client-logging.md) 插件，你可以指定日誌記錄器、日誌級別以及過濾日誌消息的條件：
[object Promise]

## 創建自訂插件 {id="custom"}
要了解如何創建自訂插件，請參考 [](client-custom-plugins.md)。