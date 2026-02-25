[//]: # (title: 浏览器与 DOM API)

Kotlin/JS 标准库允许您使用 `kotlinx.browser` 软件包访问浏览器特定的功能，其中包括典型的顶级对象，如 `document` 和 `window`。标准库尽可能为这些对象公开的功能提供类型安全包装器。作为回退，`dynamic` 类型用于提供与无法很好映射到 Kotlin 类型系统的函数的交互。

## 与 DOM 交互

要与 DOM（文档对象模型）进行交互，您可以使用 `document` 变量。例如，您可以通过此对象设置网站的背景颜色：

```kotlin
document.bgColor = "FFAA12" 
```

`document` 对象还为您提供了一种通过 ID、名称、类名、标记名称等检索特定元素的方法。所有返回的元素均为 `Element?` 类型。要访问其属性，您需要将其转换为相应的类型。例如，假设您有一个包含电子邮件 `<input>` 字段的 HTML 页面：

```html
<body>
    <input type="text" name="email" id="email"/>

    <script type="text/javascript" src="tutorial.js"></script>
</body>
```

请注意，您的脚本包含在 `body` 标记的底部。这确保了在加载脚本之前 DOM 是完全可用的。

通过此设置，您可以访问 DOM 元素。要访问 `input` 字段的属性，请调用 `getElementById` 并将其转换为 `HTMLInputElement`。然后，您就可以安全地访问其属性，例如 `value`：

```kotlin
val email = document.getElementById("email") as HTMLInputElement
email.value = "hadi@jetbrains.com"
```

就像您引用此 `input` 元素一样，您可以访问页面上的其他元素，并将它们转换为相应的类型。

要了解如何以简洁的方式在 DOM 中创建和组织元素，请查看 [类型安全 HTML DSL](typesafe-html-dsl.md)。