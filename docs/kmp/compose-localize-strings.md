# 字符串本地化

本地化是使您的应用适应不同的语言、地区和文化习惯的过程。本指南将解释如何设置翻译目录、[处理区域特有格式](compose-regional-format.md)、[处理从右到左 (RTL) 语言](compose-rtl.md)以及[测试本地化](compose-localization-tests.md)跨平台。

要在 Compose Multiplatform 中本地化字符串，您需要为应用程序的用户界面元素提供所有支持语言的译文。Compose Multiplatform 通过提供公共资源管理库和代码生成，简化了此过程，从而轻松访问译文。

## 设置翻译目录

将所有字符串资源存储在您的公共源代码集中的专用 `composeResources` 目录中。将默认文本放在 `values` 目录中，并为每种语言创建相应的目录。
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

然后，为译文创建相应的本地化文件。例如，将西班牙语译文添加到 `commonMain/composeResources/values-es/strings.xml`：

```xml
<resources>
    <string name="app_name">Mi Aplicación</string>
    <string name="greeting">¡Hola mundo!</string>
    <string name="welcome_message">¡Bienvenido, %s!</string>
</resources>
```

## 生成用于静态访问的类

添加所有译文后，构建项目以生成一个特殊类，该类提供资源访问。
Compose Multiplatform 处理 `composeResources` 中的 `strings.xml` 资源文件，并为每个字符串资源创建静态访问器属性。

生成的 `Res.strings` 对象允许您安全地访问共享代码中的本地化字符串。
要在应用的 UI 中显示字符串，请使用 `stringResource()` 可组合函数。此函数根据用户的当前区域设置检索正确的文本：

```kotlin
import project.composeapp.generated.resources.Res

@Composable
fun MyApp() {
    Text(stringResource(Res.strings.app_name))
    Text(stringResource(Res.strings.greeting))
    Text(stringResource(Res.strings.welcome_message, "User"))
}
```

在上面的示例中，`welcome_message` 字符串包含一个占位符 (`%s`) 用于动态值。生成的访问器和 `stringResource()` 函数都支持传递此类形参。

## 下一步

* [了解如何管理区域格式](compose-regional-format.md)
* [阅读有关处理从右到左语言的内容](compose-rtl.md)