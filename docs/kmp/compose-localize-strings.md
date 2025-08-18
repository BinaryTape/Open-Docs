# 本地化字符串

本地化是使你的应用适应不同语言、区域和文化惯例的过程。本指南将解释如何设置翻译目录、[处理区域特有的格式](compose-regional-format.md)、[处理从右到左 (RTL) 语言](compose-rtl.md)以及[测试跨平台的本地化](compose-localization-tests.md)。

要在 Compose Multiplatform 中本地化字符串，你需要为应用程序的用户界面元素提供所有支持语言的翻译文本。Compose Multiplatform 通过提供一个公共资源管理库和代码生成，简化了此过程，从而可以轻松访问翻译。

## 设置翻译目录

将所有字符串资源存储在公共源代码集内专用的 `composeResources` 目录中。将默认文本放在 `values` 目录中，并为每种语言创建相应的目录。
使用以下结构：

```
commonMain/composeResources/
├── values/
│   └── strings.xml
├── values-es/
│   └── strings.xml
├── values-fr/
│   └── strings.xml
└── ... (other locale directories)
```

在 `values` 目录及其本地化变体中，使用键值对在 `strings.xml` 文件中定义字符串资源。
例如，将英文文本添加到 `commonMain/composeResources/values/strings.xml`：

```xml
<resources>
    <string name="app_name">My Application</string>
    <string name="greeting">Hello, world!</string>
    <string name="welcome_message">Welcome, %s!</string>
</resources>
```

然后，创建相应的本地化文件用于翻译。例如，将西班牙语翻译添加到 `commonMain/composeResources/values-es/strings.xml`：

```xml
<resources>
    <string name="app_name">Mi Aplicación</string>
    <string name="greeting">¡Hola mundo!</string>
    <string name="welcome_message">¡Bienvenido, %s!</string>
</resources>
```

## 生成用于静态访问的类

添加所有翻译后，构建项目以生成一个特殊类，该类提供对资源的访问。
Compose Multiplatform 处理 `composeResources` 中的 `strings.xml` 资源文件，并为每个字符串资源创建静态访问器属性。

生成的 `Res.strings` 对象允许你从共享代码中安全地访问本地化字符串。
要在应用的 UI 中显示字符串，请使用 `stringResource()` 可组合函数。
此函数根据用户的当前区域设置检索正确的文本：

```kotlin
import project.composeapp.generated.resources.Res

@Composable
fun MyApp() {
    Text(stringResource(Res.strings.app_name))
    Text(stringResource(Res.strings.greeting))
    Text(stringResource(Res.strings.welcome_message, "User"))
}
```

在上面的示例中，`welcome_message` 字符串包含一个动态值的占位符 (`%s`)。
生成的访问器和 `stringResource()` 函数都支持传递此类参数。

## 下一步

* [了解如何管理区域格式](compose-regional-format.md)
* [阅读有关处理从右到左语言的内容](compose-rtl.md)