---
title: "浏览器和 DOM API"
---
Kotlin/JS 标准库允许你使用 `kotlinx.browser` 包访问特定于浏览器的功能，该包包含典型的顶级对象，例如 `document` 和 `window`。标准库为这些对象公开的功能提供了类型安全的包装器（wrapper），尽可能地。作为一种回退机制，`dynamic` 类型用于提供与那些不能很好地映射到 Kotlin 类型系统的函数进行交互。

## 与 DOM 交互

对于与文档对象模型（Document Object Model, DOM）的交互，你可以使用变量 `document`。例如，你可以通过这个对象设置我们网站的背景颜色：

```kotlin
document.bgColor = "FFAA12"
```

`document` 对象还提供了一种通过 ID、名称、类名、标签名等检索特定元素的方法。所有返回的元素都是 `Element?` 类型。要访问它们的属性，你需要将它们强制转换为适当的类型。例如，假设你有一个包含 email `<input>` 字段的 HTML 页面：

```html
<body>
    <input type="text" name="email" id="email"/>

    <script type="text/javascript" src="tutorial.js"></script>
</body>
```

请注意，你的脚本包含在 `body` 标签的底部。这确保了在加载脚本之前 DOM 是完全可用的。

通过这样的设置，你可以访问 DOM 的元素。要访问 `input` 字段的属性，请调用 `getElementById` 并将其强制转换为 `HTMLInputElement`。然后，你可以安全地访问其属性，例如 `value`：

```kotlin
val email = document.getElementById("email") as HTMLInputElement
email.value = "hadi@jetbrains.com"
```

就像你引用这个 `input` 元素一样，你可以访问页面上的其他元素，并将它们强制转换为适当的类型。

要了解如何以简洁的方式在 DOM 中创建和构建元素，请查看 [Typesafe HTML DSL](typesafe-html-dsl)。