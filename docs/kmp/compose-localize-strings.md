# 字符串本地化

本地化是将您的应用适配不同语言、地区和文化习惯的过程。
本指南介绍了如何设置翻译目录、[处理特定区域格式](compose-regional-format.md)、[处理从右到左 (RTL) 语言](compose-rtl.md)以及跨平台[测试本地化](compose-localization-tests.md)。

要在 Compose Multiplatform 中本地化字符串，您需要为所有支持的语言提供应用程序用户界面元素的翻译文本。Compose Multiplatform 通过提供通用的资源管理库和代码生成功能来简化此过程，以便轻松访问翻译内容。

## 设置翻译目录

将所有字符串资源存储在共享源集内专用的 `composeResources` 目录中。
将默认文本放在 `values` 目录中，并为每种语言创建相应的目录。
使用以下结构：

```
commonMain/composeResources/
├── values/
│   └── strings.xml
├── values-es/
│   └── strings.xml
├── values-fr/
│   └── strings.xml
└── ... (其他区域性目录)
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

然后，为翻译创建相应的本地化文件。例如，将西班牙语翻译添加到 `commonMain/composeResources/values-es/strings.xml`：

```xml
<resources>
    <string name="app_name">Mi Aplicación</string>
    <string name="greeting">¡Hola mundo!</string>
    <string name="welcome_message">¡Bienvenido, %s!</string>
</resources>
```

## 生成静态访问类

添加所有翻译后，构建项目以生成一个提供资源访问权限的特殊类。
Compose Multiplatform 会处理 `composeResources` 中的 `strings.xml` 资源文件，并为每个字符串资源创建静态访问器属性。

生成的 `Res.strings` 对象允许您从共享代码中安全地访问本地化字符串。
要在应用的 UI 中显示字符串，请使用 `stringResource()` 可组合函数。
此函数会根据用户的当前语言区域检索正确的文本：

```kotlin
import project.composeapp.generated.resources.Res

@Composable
fun MyApp() {
    Text(stringResource(Res.strings.app_name))
    Text(stringResource(Res.strings.greeting))
    Text(stringResource(Res.strings.welcome_message, "User"))
}
```

在上述示例中，`welcome_message` 字符串包含一个用于动态值的占位符 (`%s`)。
生成的访问器和 `stringResource()` 函数都支持传递此类形参。

## 下一步

* [了解如何管理区域格式](compose-regional-format.md)
* [阅读关于处理从右到左语言的内容](compose-rtl.md)