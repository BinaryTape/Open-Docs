[//]: # (title: 資料轉換)

<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-data-conversion"/>
<var name="package_name" value="io.ktor.server.plugins.dataconversion"/>
<var name="plugin_name" value="DataConversion"/>
<var name="example_name" value="data-conversion"/>

<tldr>
<include from="lib.topic" element-id="download_example"/>
<p>
<b>所需依賴項</b>：<code>io.ktor:ktor-server-data-conversion</code>
</p>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

<link-summary>
Ktor 伺服器的 DataConversion 插件允許您添加自定義轉換器，用於序列化和反序列化值列表。
</link-summary>

[DataConversion](https://api.ktor.io/ktor-utils/io.ktor.util.converters/-data-conversion/index.html) 插件允許您序列化和反序列化值列表。默認情況下，Ktor 通過 [DefaultConversionService](https://api.ktor.io/ktor-utils/io.ktor.util.converters/-default-conversion-service/index.html) 處理原始類型和列舉。您可以透過安裝和配置 `DataConversion` 插件來擴展此服務，以處理額外類型。

## 添加依賴 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安裝 DataConversion {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

## 添加轉換器 {id="add-converters"}

您可以在 `DataConversion` 配置中定義類型轉換。為指定類型提供 `convert<T>` 方法，並使用可用函數序列化和反序列化值列表：

*   使用 `decode()` 函數反序列化值列表。它接收一個字串列表，表示 URL 中重複的值，並返回解碼後的值。

    ```kotlin
    decode { values -> // converter: (values: List<String>) -> Any?
      //deserialize values
    }
    ```

*   使用 `encode()` 函數序列化一個值。該函數接收一個任意值，並返回一個表示該值的字串列表。

    ```kotlin
       encode { value -> // converter: (value: Any?) -> List<String>
         //serialize value
        }
    ```

## 訪問服務

{id="service"}

您可以從當前上下文訪問 `DataConversion` 服務：

```kotlin
val dataConversion = application.conversionService
```

然後您可以使用轉換器服務來呼叫回呼函數：

*   `fromValues(values: List<String>, type: TypeInfo)` 回呼函數接受 `values` 作為字串列表，以及要將值轉換成的 `TypeInfo`，並返回解碼後的值。
*   `toValues(value: Any?)` 回呼函數接受一個任意值，並返回一個表示該值的字串列表。

## 範例

在以下範例中，定義並配置了 `LocalDate` 類型的轉換器，用於序列化和反序列化值。當呼叫 `encode` 函數時，服務將使用 `SimpleDateFormat` 轉換該值，並返回一個包含格式化值的列表。當呼叫 `decode` 函數時，服務會將日期格式化為 `LocalDate` 並返回。

```kotlin
```

{src="snippets/data-conversion/src/main/kotlin/dataconversion/Application.kt" include-lines="18-34"}

然後可以手動呼叫轉換服務以檢索編碼和解碼後的值：

```kotlin
```

{src="snippets/data-conversion/src/main/kotlin/dataconversion/Application.kt" include-lines="38-39"}

如需完整範例，請參閱 [data-conversion](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/data-conversion)