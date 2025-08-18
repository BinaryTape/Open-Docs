[//]: # (title: 浏览器和 DOM API)

Kotlin/JS 标准库允许您使用 `kotlinx.browser` 包访问浏览器特有的功能，
该包包括典型的顶层对象，例如 `document` 和 `window`。标准库尽可能地为这些对象所暴露的功能提供了类型安全包装器。作为备用方案，`dynamic` 类型用于提供与无法很好地映射到 Kotlin 类型系统的函数进行交互。

## 与 DOM 交互

为了与文档对象模型 (DOM) 交互，您可以使用 `document` 变量。例如，您可以通过此对象设置我们网站的背景颜色：

```kotlin
document.bgColor = "FFAA12" 
```

`document` 对象还为您提供了一种通过 ID、名称、类名、标签名等检索特定元素的方法。
所有返回的元素都属于 `Element?` 类型。要访问它们的属性，您需要将它们转换为其相应的类型。
例如，假设您有一个带电子邮件 `<input>` 字段的 HTML 页面：

```html
<body>
    <input type="text" name="email" id="email"/>

    <script type="text/javascript" src="tutorial.js"></script>
</body>
```

请注意，您的脚本包含在 `body` 标签的底部。这确保了 DOM 在脚本加载之前完全可用。

通过此设置，您可以访问 DOM 的元素。要访问 `input` 字段的属性，请调用 `getElementById`
并将其转换为 `HTMLInputElement`。然后，您可以安全地访问其属性，例如 `value`：

```kotlin
val email = document.getElementById("email") as HTMLInputElement
email.value = "hadi@jetbrains.com"
```

就像您引用这个 `input` 元素一样，您可以访问页面上的其他元素，并将它们转换为适当的类型。

要了解如何以简洁的方式在 DOM 中创建和构建元素，请查阅 [类型安全 HTML DSL](typesafe-html-dsl.md)。