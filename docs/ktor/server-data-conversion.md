[//]: # (title: 数据转换)

<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-data-conversion"/>
<var name="package_name" value="io.ktor.server.plugins.dataconversion"/>
<var name="plugin_name" value="DataConversion"/>
<var name="example_name" value="data-conversion"/>

<tldr>
<p>
    <b>代码示例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
<b>所需依赖项</b>: <code>io.ktor:%artifact_name%</code>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor 支持 Kotlin/Native，并允许您无需额外的运行时或虚拟机即可运行服务器。">原生服务器</Links>支持</b>: ✅
</p>
</tldr>

<link-summary>
Ktor 服务器的 %plugin_name% 插件允许您添加自定义转换器，用于序列化和反序列化值列表。
</link-summary>

[DataConversion](https://api.ktor.io/ktor-utils/io.ktor.util.converters/-data-conversion/index.html) 插件
允许您序列化和反序列化值列表。默认情况下，Ktor 通过
[DefaultConversionService](https://api.ktor.io/ktor-utils/io.ktor.util.converters/-default-conversion-service/index.html) 处理原生类型和枚举。
您可以通过安装和配置 %plugin_name% 插件来扩展此服务以处理额外类型。

## 添加依赖项 {id="add_dependencies"}

<p>
    要使用 <code>%plugin_name%</code>，您需要在构建脚本中包含 <code>%artifact_name%</code> artifact：
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

## 安装 %plugin_name% {id="install_plugin"}

<p>
    要<a href="#install">安装</a> <code>%plugin_name%</code> 插件到应用程序，
    请将其传递给指定<Links href="/ktor/server-modules" summary="模块允许您通过分组路由来组织您的应用程序。">模块</Links>中的 <code>install</code> 函数。
    下面的代码片段展示了如何安装 <code>%plugin_name%</code> ...
</p>
<list>
    <li>
        ... 在 <code>embeddedServer</code> 函数调用内部。
    </li>
    <li>
        ... 在显式定义的 <code>module</code> 内部，它是 <code>Application</code> 类的扩展函数。
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

## 添加转换器 {id="add-converters"}

您可以在 %plugin_name% 配置中定义类型转换。为指定类型提供一个 `convert<T>` 方法，并使用可用
函数来序列化和反序列化值列表：

*   使用 `decode()` 函数反序列化值列表。它接受一个字符串列表，表示
    URL 中重复的值，并返回解码后的值。

    ```kotlin
    decode { values -> // converter: (values: List<String>) -> Any?
      //deserialize values
    }
    ```

*   使用 `encode()` 函数序列化值。该函数接受任意值，并返回表示它的
    字符串列表。

    ```kotlin
       encode { value -> // converter: (value: Any?) -> List<String>
         //serialize value
        }
    ```

## 访问服务

{id="service"}

您可以从当前上下文访问 %plugin_name% 服务：

```kotlin
val dataConversion = application.conversionService
```

然后您可以使用转换器服务来调用回调函数：

*   <code>fromValues(values: List String , type: TypeInfo)</code> 回调函数接受作为字符串列表的 <code>values</code>，以及要转换的值的 <code>TypeInfo</code>，
    并返回解码后的值。
*   <code>toValues(value: Any?)</code> 回调函数接受任意值，并返回表示它的字符串列表。

## 示例

在以下示例中，定义并配置了 <code>LocalDate</code> 类型的转换器以序列化和反序列化值。当调用 <code>encode</code> 函数时，服务将使用 <code>SimpleDateFormat</code> 转换该值，并返回包含格式化值的列表。
当调用 <code>decode</code> 函数时，服务将把日期格式化为 <code>LocalDate</code> 并返回它。

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

然后可以手动调用转换服务以检索编码和解码后的值：

```kotlin
val encodedDate = application.conversionService.toValues(call.parameters["date"])
val decodedDate = application.conversionService.fromValues(encodedDate, typeInfo<LocalDate>())
```

有关完整示例，请参见 [%example_name%](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%)