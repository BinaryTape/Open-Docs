[//]: # (title: 預設標頭)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-default-headers"/>
<var name="package_name" value="io.ktor.server.plugins.defaultheaders"/>
<var name="plugin_name" value="DefaultHeaders"/>
<var name="plugin_api_link" value="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-default-headers/io.ktor.server.plugins.defaultheaders/-default-headers.html"/>

<tldr>
<p>
<b>必要依賴項</b>：<code>io.ktor:%artifact_name%</code>
</p>

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，可讓您在無需額外執行時間或虛擬機器的情況下執行伺服器。">原生伺服器</Links>支援</b>: ✅
    </p>
    
</tldr>

[%plugin_name%](%plugin_api_link%) 插件會為每個響應添加標準的 `Server` 和 `Date` 標頭。此外，您可以提供額外的預設標頭並覆寫 `Server` 標頭。

## 新增依賴項 {id="add_dependencies"}

    <p>
        要使用 <code>%plugin_name%</code>，您需要在構建腳本中包含 <code>%artifact_name%</code> 構件：
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
    

## 安裝 %plugin_name% {id="install_plugin"}

    <p>
        要<a href="#install">安裝</a> <code>%plugin_name%</code> 插件到應用程式，
        請在指定的<Links href="/ktor/server-modules" summary="模組允許您通過分組路由來組織應用程式。">模組</Links>中將其傳遞給 <code>install</code> 函數。
        下面的程式碼片段展示了如何安裝 <code>%plugin_name%</code> ...
    </p>
    <list>
        <li>
            ... 在 <code>embeddedServer</code> 函數呼叫中。
        </li>
        <li>
            ... 在明確定義的 <code>module</code> 中，該 <code>module</code> 是 <code>Application</code> 類的擴展函數。
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
        <code>%plugin_name%</code> 插件也可以<a href="#install-route">安裝到特定路由</a>。
        如果您的不同應用程式資源需要不同的 <code>%plugin_name%</code> 配置，這可能會很有用。
    </p>
    

## 配置 %plugin_name% {id="configure"}
### 新增額外標頭 {id="add"}
要自定義預設標頭列表，請使用 <code>header(name, value)</code> 函數將所需標頭傳遞給 <code>install</code>。<code>name</code> 參數接受 <code>HttpHeaders</code> 值，例如：
```kotlin
    install(DefaultHeaders) {
        header(HttpHeaders.ETag, "7c876b7e")
    }
```
要新增自定義標頭，請將其名稱作為字串值傳遞：
```kotlin
    install(DefaultHeaders) {
        header("Custom-Header", "Some value")
    }
```

### 覆寫標頭 {id="override"}
要覆寫 <code>Server</code> 標頭，請使用對應的 <code>HttpHeaders</code> 值：
```kotlin
    install(DefaultHeaders) {
        header(HttpHeaders.Server, "Custom")
    }
```
請注意，由於性能原因，<code>Date</code> 標頭會被緩存，並且不能使用 <code>%plugin_name%</code> 進行覆寫。