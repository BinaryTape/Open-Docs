# 本地化测试
<show-structure depth="2"/>

为了测试本地化，请验证针对不同的区域设置是否显示了正确的翻译字符串，并确保格式和布局能适应区域设置的要求。

## 在不同平台上测试区域设置

### Android

在 Android 上，你可以通过 **Settings | System | Languages & input | Languages** 更改设备的系统区域设置。对于自动化测试，你可以使用 `adb` shell 直接在模拟器上修改区域设置：

```shell
adb -e shell
setprop persist.sys.locale [BCP-47 language tag];stop;sleep 5;start
```

此命令会重新启动模拟器，从而允许你使用新的区域设置重新启动应用程序。

此外，你可以在运行测试前使用 Espresso 等框架以编程方式配置区域设置。例如，你可以使用 `LocaleTestRule()` 在测试期间自动化区域设置切换。

### iOS

在 iOS 上，你可以通过 **Settings | General | Language & Region** 更改设备的系统语言和区域。对于使用 XCUITest 框架的自动化 UI 测试，请使用启动参数来模拟区域设置更改：

```swift
app.launchArguments = [
    "-AppleLanguages", "(es)",
    "-AppleLocale", "es_ES"
]
```

### Desktop

在桌面端，JVM 区域设置通常默认为操作系统的区域设置。设置位置因不同的桌面平台而异。

你可以在 UI 初始化之前，在测试设置或应用程序入口点以编程方式设置 JVM 默认区域设置：

```java
java.util.Locale.setDefault(java.util.Locale("es_ES"))
``` 

### Web

为了快速检查，你可以在浏览器偏好设置中更改语言设置。对于自动化测试，Selenium 或 Puppeteer 等浏览器自动化工具可以模拟区域设置更改。

此外，你可以尝试绕过 `window.navigator.languages` 属性的只读限制来引入自定义区域设置。更多信息请参阅 [](compose-resource-environment.md) 教程。

## 关键测试场景

### 自定义区域设置

* 以编程方式覆盖区域设置。
* 断言 UI 元素、格式化字符串和布局能针对所选区域设置正确地进行调整，包括（如适用）处理从右到左的文本。

### 默认资源

当指定区域设置没有可用翻译时，将使用默认资源。应用程序必须正确回退到这些默认值。

* 使用上述平台特有的方法，将区域设置配置为不支持的值。
* 验证回退机制是否正确加载并显示了默认资源。

### 区域设置特有情况

为了避免常见的本地化问题，请考虑以下区域设置特有的情况：

* 测试 [区域设置特有的格式设置](compose-regional-format.md)，例如日期格式设置（`MM/dd/yyyy` vs. `dd/MM/yyyy`）和数字格式设置。
* 验证 [RTL 和 LTR 行为](compose-rtl.md)，确保阿拉伯语和希伯来语等从右到左的语言能正确显示字符串、布局和对齐方式。