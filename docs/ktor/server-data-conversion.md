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
        <b><Links href="/ktor/server-native" summary="Ktor 支持 Kotlin/Native，允许您在没有额外运行时或虚拟机的情况下运行服务器。">原生服务器</Links>支持</b>: ✅
    </p>
    
</tldr>

<link-summary>
Ktor 服务器的 %plugin_name% 插件允许您添加自定义转换器，用于序列化和反序列化值列表。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-utils/io.ktor.util.converters/-data-conversion/index.html) 插件允许您序列化和反序列化值列表。默认情况下，Ktor 通过 [DefaultConversionService](https://api.ktor.io/ktor-utils/io.ktor.util.converters/-default-conversion-service/index.html) 处理基本类型和枚举。您可以通过安装和配置 %plugin_name% 插件来扩展此服务，以处理其他类型。

## 添加依赖项 {id="add_dependencies"}

    <p>
        要使用 <code>%plugin_name%</code>，您需要在构建脚本中包含 <code>%artifact_name%</code> 构件：
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
    

## 安装 %plugin_name% {id="install_plugin"}

    <p>
        要将 <code>%plugin_name%</code> 插件<a href="#install">安装</a>到应用程序中，请在指定的<Links href="/ktor/server-modules" summary="模块允许您通过对路由进行分组来组织应用程序。">模块</Links>中将其传递给 <code>install</code> 函数。下面的代码片段展示了如何安装 <code>%plugin_name%</code> ...
    </p>
    <list>
        <li>
            ... 在 <code>embeddedServer</code> 函数调用内部。
        </li>
        <li>
            ... 在显式定义的 <code>module</code> 内部，它是 <code>Application</code> 类的一个扩展函数。
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
    

## 添加转换器 {id="add-converters"}

您可以在 %plugin_name% 配置中定义类型转换。为指定类型提供一个 <code>convert<T></code> 方法，并使用可用函数来序列化和反序列化值列表：

* 使用 <code>decode()</code> 函数反序列化值列表。它接受一个字符串列表，表示 URL 中重复的值，并返回解码后的值。

  ```kotlin
  decode { values -> // converter: (values: List<String>) -> Any?
    //deserialize values
  }
  ```

* 使用 <code>encode()</code> 函数序列化值。该函数接受一个任意值，并返回一个表示该值的字符串列表。

  ```kotlin
     encode { value -> // converter: (value: Any?) -> List<String>
       //serialize value
      }
  ```

## 访问服务

{id="service"}

您可以从当前上下文中访问 %plugin_name% 服务：

```kotlin
val dataConversion = application.conversionService
```

然后您可以使用转换器服务来调用回调函数：

* <code>fromValues(values: List<String>, type: TypeInfo)</code> 回调函数接受 <code>values</code> 作为字符串列表，以及用于转换值的 <code>TypeInfo</code>，并返回解码后的值。
* <code>toValues(value: Any?)</code> 回调函数接受一个任意值，并返回一个表示该值的字符串列表。

## 示例

在以下示例中，定义并配置了一个用于 <code>LocalDate</code> 类型的转换器，用于序列化和反序列化值。当调用 <code>encode</code> 函数时，服务将使用 <code>SimpleDateFormat</code> 转换该值并返回一个包含格式化值的列表。当调用 <code>decode</code> 函数时，服务将把日期格式化为 <code>LocalDate</code> 并返回它。

[object Promise]

然后可以手动调用转换服务来检索编码和解码后的值：

[object Promise]

有关完整示例，请参见 [%example_name%](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%)