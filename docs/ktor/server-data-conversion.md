[//]: # (title: 数据转换)

<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-data-conversion"/>
<var name="package_name" value="io.ktor.server.plugins.dataconversion"/>
<var name="plugin_name" value="DataConversion"/>
<var name="example_name" value="data-conversion"/>

<tldr>
<include from="lib.topic" element-id="download_example"/>
<p>
<b>所需依赖项</b>: <code>io.ktor:%artifact_name%</code>
</p>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

<link-summary>
Ktor 服务器的 %plugin_name% 插件允许您添加自定义转换器，用于序列化和反序列化值列表。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-utils/io.ktor.util.converters/-data-conversion/index.html) 插件允许您序列化和反序列化值列表。默认情况下，Ktor 通过
[DefaultConversionService](https://api.ktor.io/ktor-utils/io.ktor.util.converters/-default-conversion-service/index.html) 处理原始类型和枚举。
您可以通过安装和配置 `%plugin_name%` 插件来扩展此服务，以处理其他类型。

## 添加依赖项 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安装 %plugin_name% {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

## 添加转换器 {id="add-converters"}

您可以在 `%plugin_name%` 配置中定义类型转换。为指定类型提供 `convert<T>` 方法，并使用可用函数来序列化和反序列化值列表：

*   使用 `decode()` 函数来反序列化值列表。它接受一个字符串列表，该列表表示 URL 中的重复值，并返回解码后的值。

  ```kotlin
  decode { values -> // converter: (values: List<String>) -> Any?
    // 反序列化值
  }
  ```

*   使用 `encode()` 函数来序列化一个值。该函数接受一个任意值，并返回表示该值的字符串列表。

  ```kotlin
     encode { value -> // converter: (value: Any?) -> List<String>
       // 序列化值
      }
  ```

## 访问服务

{id="service"}

您可以从当前上下文中访问 `%plugin_name%` 服务：

```kotlin
val dataConversion = application.conversionService
```

然后您可以使用转换器服务来调用回调函数：

*   `fromValues(values: List<String>, type: TypeInfo)` 回调函数接受 `values` 作为字符串列表，以及要将值转换成的 `TypeInfo`，并返回解码后的值。
*   `toValues(value: Any?)` 回调函数接受一个任意值，并返回表示该值的字符串列表。

## 示例

在以下示例中，定义并配置了一个 `LocalDate` 类型的转换器，用于序列化和反序列化值。当调用 `encode` 函数时，服务将使用 `SimpleDateFormat` 转换该值，并返回包含格式化值的列表。
当调用 `decode` 函数时，服务将把日期格式化为 `LocalDate` 并返回。

```kotlin
```

{src="snippets/data-conversion/src/main/kotlin/dataconversion/Application.kt" include-lines="18-34"}

然后可以手动调用转换服务来检索编码和解码后的值：

```kotlin
```

{src="snippets/data-conversion/src/main/kotlin/dataconversion/Application.kt" include-lines="38-39"}

有关完整示例，请参阅 [%example_name%](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%)