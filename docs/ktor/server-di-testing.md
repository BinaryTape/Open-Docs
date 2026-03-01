[//]: # (title: 使用依赖注入进行测试)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>所需依赖项</b>：<code>io.ktor:ktor-server-di</code>
</p>
<var name="example_name" value="server-di"/>
<p>
    <b>代码示例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

[依赖注入 (DI) 插件](server-dependency-injection.md)提供了简化测试的工具。

您可以在加载应用程序模块之前重写依赖项：

```kotlin
fun test() = testApplication {
  application {
    dependencies.provide<MyService> {
      MockService()
    }
    loadServices()
  }
}
```

在上面的示例中，`loadServices()` 是引导应用程序模块的函数 — 例如，注册路由和服务的函数，相当于 `application.yaml` 中 `modules` 下列出的内容。

### 在测试中加载配置

使用 `configure()` 在测试中轻松加载配置文件：

```kotlin
fun test() = testApplication {
  // 从默认配置文件路径加载属性
  configure()
  // 加载多个文件并进行重写
  configure("root-config.yaml", "test-overrides.yaml")
}
```

测试引擎会忽略冲突的声明，以便您可以自由重写。