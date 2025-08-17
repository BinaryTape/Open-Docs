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
    <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，允許您在不依賴額外執行時或虛擬機器的情況下執行伺服器。">原生伺服器</Links> 支援</b>: ✅
</p>
</tldr>

<link-summary>
Ktor 伺服器的 %plugin_name% 外掛允許您新增自訂轉換器，以序列化和反序列化值列表。
</link-summary>

%plugin_name% [外掛](https://api.ktor.io/ktor-utils/io.ktor.util.converters/-data-conversion/index.html) 允許您序列化和反序列化值列表。預設情況下，Ktor 透過 [DefaultConversionService](https://api.ktor.io/ktor-utils/io.ktor.util.converters/-default-conversion-service/index.html) 處理基本類型和列舉。您可以透過安裝和配置 `%plugin_name%` 外掛來擴展此服務以處理其他類型。

## 新增依賴項 {id="add_dependencies"}

<p>
    要使用 <code>%plugin_name%</code>，您需要在構建腳本中包含 <code>%artifact_name%</code> artifact：
</p>
<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

## 安裝 %plugin_name% {id="install_plugin"}

<p>
    若要將 <code>%plugin_name%</code> 外掛<a href="#install">安裝</a>到應用程式中，請在指定的<Links href="/ktor/server-modules" summary="模組允許您透過分組路由來組織應用程式。">模組</Links>中將其傳遞給 <code>install</code> 函數。以下程式碼片段展示了如何安裝 <code>%plugin_name%</code> ...
</p>
<list>
    <li>
        ... 在 <code>embeddedServer</code> 函數呼叫內部。
    </li>
    <li>
        ... 在明確定義的 <code>module</code> 內部，後者是 <code>Application</code> 類別的一個擴展函數。
    </li>
</list>
<Tabs>
    <TabItem title="embeddedServer">
        <code-block lang="kotlin" code="            import io.ktor.server.engine.*&#10;            import io.ktor.server.netty.*&#10;            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;&#10;            fun main() {&#10;                embeddedServer(Netty, port = 8080) {&#10;                    install(%plugin_name%)&#10;                    // ...&#10;                }.start(wait = true)&#10;            }"/>
    </TabItem>
    <TabItem title="module">
        <code-block lang="kotlin" code="            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;            // ...&#10;            fun Application.module() {&#10;                install(%plugin_name%)&#10;                // ...&#10;            }"/>
    </TabItem>
</Tabs>

## 新增轉換器 {id="add-converters"}

您可以在 `%plugin_name%` 配置中定義類型轉換。為指定類型提供一個 `convert<T>` 方法，並使用可用函數序列化和反序列化值列表：

*   使用 `decode()` 函數反序列化值列表。它接受一個字串列表，表示 URL 中的重複值，並返回解碼後的值。

  ```kotlin
  decode { values -> // converter: (values: List<String>) -> Any?
    //deserialize values
  }
  ```

*   使用 `encode()` 函數序列化一個值。該函數接受任意值並返回表示它的字串列表。

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

*   `fromValues(values: List<String>, type: TypeInfo)` 回呼函數接受 `values` 作為字串列表，以及用於轉換值的 `TypeInfo`，並返回解碼後的值。
*   `toValues(value: Any?)` 回呼函數接受任意值並返回表示它的字串列表。

## 範例

在以下範例中，為 `LocalDate` 類型定義並配置了一個轉換器，用於序列化和反序列化值。當呼叫 `encode` 函數時，服務將使用 `SimpleDateFormat` 轉換值並返回包含格式化值的列表。當呼叫 `decode` 函數時，服務將把日期格式化為 `LocalDate` 並返回。

```kotlin
    install(DataConversion) {
        convert<LocalDate> { // this: DelegatingConversionService
            val formatter = DateTimeFormatterBuilder()
                .appendValue(ChronoField.YEAR, 4, 4, SignStyle.NEVER)
                .appendValue(ChronoField.MONTH_OF_YEAR, 2)
                .appendValue(ChronoField.DAY_OF_MONTH, 2)
                .toFormatter(Locale.ROOT)

            decode { values -> // converter: (values: List<String>) -> Any?
                LocalDate.from(formatter.parse(values.single()))
            }

            encode { value -> // converter: (value: Any?) -> List<String>
                listOf(SimpleDateFormat.getInstance().format(value))
            }
        }
    }
```

隨後可以手動呼叫轉換服務，以擷取編碼和解碼的值：

```kotlin
val encodedDate = application.conversionService.toValues(call.parameters["date"])
val decodedDate = application.conversionService.fromValues(encodedDate, typeInfo<LocalDate>())
```

如需完整範例，請參閱 [%example_name%](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%)