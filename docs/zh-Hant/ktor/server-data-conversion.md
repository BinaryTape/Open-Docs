[//]: # (title: 資料轉換)

<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-data-conversion"/>
<var name="package_name" value="io.ktor.server.plugins.dataconversion"/>
<var name="plugin_name" value="DataConversion"/>
<var name="example_name" value="data-conversion"/>

<tldr>

    <p>
        <b>程式碼範例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
<p>
<b>所需依賴項</b>: <code>io.ktor:%artifact_name%</code>
</p>

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native 並允許您在沒有額外執行時間或虛擬機器的情況下執行伺服器。">原生伺服器</Links>支援</b>: ✅
    </p>
    
</tldr>

<link-summary>
Ktor 伺服器的 %plugin_name% 插件允許您新增自訂轉換器，用於序列化和反序列化值列表。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-utils/io.ktor.util.converters/-data-conversion/index.html) 插件允許您序列化和反序列化值列表。預設情況下，Ktor 透過 [DefaultConversionService](https://api.ktor.io/ktor-utils/io.ktor.util.converters/-default-conversion-service/index.html) 處理原始類型和列舉。您可以透過安裝和配置 `%plugin_name%` 插件來擴展此服務以處理其他類型。

## 新增依賴項 {id="add_dependencies"}

    <p>
        要使用 <code>%plugin_name%</code>，您需要在建置腳本中包含 <code>%artifact_name%</code> artifact：
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
        要將 <code>%plugin_name%</code> 插件<a href="#install">安裝</a>到應用程式中，請將其傳遞給指定<Links href="/ktor/server-modules" summary="模組允許您透過分組路由來組織應用程式。">模組</Links>中的 <code>install</code> 函數。以下程式碼片段顯示了如何安裝 <code>%plugin_name%</code> ...
    </p>
    <list>
        <li>
            ... 在 <code>embeddedServer</code> 函數呼叫內部。
        </li>
        <li>
            ... 在明確定義的 <code>module</code> 內部，它是 <code>Application</code> 類別的擴展函數。
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
    

## 新增轉換器 {id="add-converters"}

您可以在 `%plugin_name%` 配置中定義類型轉換。為指定類型提供一個 `convert<T>` 方法，並使用可用函數來序列化和反序列化值列表：

*   使用 `decode()` 函數反序列化值列表。它接受一個字串列表，表示 URL 中重複的值，並返回解碼後的值。

    ```kotlin
    decode { values -> // converter: (values: List<String>) -> Any?
      //deserialize values
    }
    ```

*   使用 `encode()` 函數序列化一個值。該函數接受任意值並返回一個表示它的字串列表。

    ```kotlin
       encode { value -> // converter: (value: Any?) -> List<String>
         //serialize value
        }
    ```

## 存取服務

{id="service"}

您可以從當前上下文存取 `%plugin_name%` 服務：

```kotlin
val dataConversion = application.conversionService
```

然後您可以使用轉換器服務呼叫回呼函數：

*   `fromValues(values: List<String>, type: TypeInfo)` 回呼函數接受 `values` 作為字串列表，以及要轉換值的 `TypeInfo`，並返回解碼後的值。
*   `toValues(value: Any?)` 回呼函數接受任意值並返回表示它的字串列表。

## 範例

在以下範例中，為 `LocalDate` 類型定義並配置了一個轉換器，用於序列化和反序列化值。當呼叫 `encode` 函數時，服務將使用 `SimpleDateFormat` 轉換值並返回包含格式化值的列表。當呼叫 `decode` 函數時，服務將把日期格式化為 `LocalDate` 並返回。

[object Promise]

然後可以手動呼叫轉換服務以檢索編碼和解碼的值：

[object Promise]

有關完整範例，請參閱 [%example_name%](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%)